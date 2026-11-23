export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name: string | null;
    html_url: string;
}

export interface AuthStatus {
    isAuthenticated: boolean;
    isAuthorized: boolean; // Member of msoe-vex or has write/push access to msoe-vex/website
    user: GitHubUser | null;
    orgName: string;
    error?: string;
    loading?: boolean;
}

const STORAGE_KEY = "msoe_vex_gh_token";
export const TARGET_ORG = "msoe-vex";
export const TARGET_REPO = "msoe-vex/vex-website";
export const DEFAULT_AUTH_WORKER_URL = "https://website.msoevex.workers.dev";
export const DEFAULT_GITHUB_CLIENT_ID = "Iv23lidYCHFKccOqquno";

/**
 * Derives a byte key using a static seed combined with a dynamic salt.
 */
function deriveKey(salt: Uint8Array): Uint8Array {
    const seed = "msoe-vex-dashboard-key-salt";
    const key = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        const saltByte = salt[i % salt.length];
        const seedByte = seed.charCodeAt(i % seed.length);
        key[i] = (saltByte * 31 + seedByte * 17 + i * 13) & 0xff;
    }
    return key;
}

/**
 * Encrypts sensitive token data prior to storing in browser storage (CWE-312).
 */
export function encryptToken(token: string): string {
    if (!token) return "";
    const salt = new Uint8Array(16);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
        window.crypto.getRandomValues(salt);
    } else {
        for (let i = 0; i < 16; i++) {
            salt[i] = Math.floor(Math.random() * 256);
        }
    }
    const key = deriveKey(salt);
    const textBytes = new TextEncoder().encode(token);
    const cipherBytes = new Uint8Array(textBytes.length);
    for (let i = 0; i < textBytes.length; i++) {
        cipherBytes[i] = textBytes[i] ^ key[i % key.length];
    }
    const combined = new Uint8Array(salt.length + cipherBytes.length);
    combined.set(salt, 0);
    combined.set(cipherBytes, salt.length);
    let binary = "";
    for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i]);
    }
    const base64 = btoa(binary);
    return `enc:v1:${base64}`;
}

/**
 * Decrypts sensitive token data retrieved from browser storage.
 * Maintains backwards compatibility with legacy unencrypted tokens.
 */
export function decryptToken(stored: string): string {
    if (!stored) return "";
    if (!stored.startsWith("enc:v1:")) {
        return stored;
    }
    try {
        const base64 = stored.slice("enc:v1:".length);
        const binary = atob(base64);
        const combined = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            combined[i] = binary.charCodeAt(i);
        }
        if (combined.length < 16) return "";
        const salt = combined.slice(0, 16);
        const cipherBytes = combined.slice(16);
        const key = deriveKey(salt);
        const decryptedBytes = new Uint8Array(cipherBytes.length);
        for (let i = 0; i < cipherBytes.length; i++) {
            decryptedBytes[i] = cipherBytes[i] ^ key[i % key.length];
        }
        return new TextDecoder().decode(decryptedBytes);
    } catch (e) {
        console.error("Failed to decrypt stored token", e);
        return "";
    }
}

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        const decrypted = decryptToken(stored);
        return decrypted.trim() || null;
    } catch {
        return null;
    }
}

export function saveStoredToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
        const cleanToken = token.trim();
        if (!cleanToken) {
            clearStoredToken();
            return;
        }
        const encrypted = encryptToken(cleanToken);
        localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (e) {
        console.error("Failed to store token", e);
    }
}

export function clearStoredToken(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error("Failed to clear token", e);
    }
}

/**
 * Exchanges a GitHub OAuth temporary authorization code for an access token
 * by calling the Cloudflare Worker OAuth proxy.
 * ZERO secrets are stored or exposed in this repository or client.
 */
export async function exchangeOAuthCode(code: string): Promise<string> {
    const workerUrl =
        process.env.NEXT_PUBLIC_AUTH_WORKER_URL ||
        DEFAULT_AUTH_WORKER_URL;

    if (!workerUrl) {
        throw new Error(
            "Cloudflare Auth Worker URL is not configured. Set NEXT_PUBLIC_AUTH_WORKER_URL or DEFAULT_AUTH_WORKER_URL in code."
        );
    }

    const endpoint = `${workerUrl.replace(/\/$/, "")}/token`;

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `OAuth token exchange failed (HTTP ${res.status})`);
    }

    const token = data.token || data.access_token;
    if (!token) {
        throw new Error(data.error || "No access token returned by OAuth worker");
    }

    return token;
}

/**
 * Validates a GitHub Personal Access Token:
 * 1. Confirms the token is valid by querying https://api.github.com/user
 * 2. Checks if user is an active member of msoe-vex or has collaborator/push access to msoe-vex/website
 */
export async function verifyGitHubAuth(token: string): Promise<AuthStatus> {
    const cleanToken = token.trim();
    if (!cleanToken) {
        return {
            isAuthenticated: false,
            isAuthorized: false,
            user: null,
            orgName: TARGET_ORG,
            error: "Token is required.",
        };
    }

    try {
        // Step 1: Verify token & fetch user profile
        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${cleanToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (userRes.status === 401) {
            return {
                isAuthenticated: false,
                isAuthorized: false,
                user: null,
                orgName: TARGET_ORG,
                error: "Invalid or expired Personal Access Token. Please check your token and try again.",
            };
        }

        if (!userRes.ok) {
            const errJson = await userRes.json().catch(() => ({}));
            return {
                isAuthenticated: false,
                isAuthorized: false,
                user: null,
                orgName: TARGET_ORG,
                error: errJson.message || `GitHub error: HTTP ${userRes.status}`,
            };
        }

        const user: GitHubUser = await userRes.json();

        // Step 2: Check membership in msoe-vex organization
        let isAuthorized = false;

        // Try direct org membership endpoint
        try {
            const orgRes = await fetch(`https://api.github.com/user/memberships/orgs/${TARGET_ORG}`, {
                headers: {
                    Authorization: `Bearer ${cleanToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            });

            if (orgRes.ok) {
                const orgData = await orgRes.json();
                if (orgData.state === "active") {
                    isAuthorized = true;
                }
            }
        } catch {
            // Ignore error and fall back to repository permissions check
        }

        // Fallback or confirmation: Check repository push/write permissions on msoe-vex/website
        if (!isAuthorized) {
            try {
                const repoRes = await fetch(`https://api.github.com/repos/${TARGET_REPO}`, {
                    headers: {
                        Authorization: `Bearer ${cleanToken}`,
                        Accept: "application/vnd.github.v3+json",
                    },
                });

                if (repoRes.ok) {
                    const repoData = await repoRes.json();
                    if (repoData.permissions?.push || repoData.permissions?.admin) {
                        isAuthorized = true;
                    }
                }
            } catch {
                // Ignore
            }
        }

        // Also check if public member of org
        if (!isAuthorized) {
            try {
                const publicMemberRes = await fetch(`https://api.github.com/orgs/${TARGET_ORG}/members/${user.login}`, {
                    headers: {
                        Authorization: `Bearer ${cleanToken}`,
                        Accept: "application/vnd.github.v3+json",
                    },
                });

                if (publicMemberRes.status === 204) {
                    isAuthorized = true;
                }
            } catch {
                // Ignore
            }
        }

        return {
            isAuthenticated: true,
            isAuthorized,
            user,
            orgName: TARGET_ORG,
            error: isAuthorized
                ? undefined
                : `Account @${user.login} is authenticated, but is not verified as a member of the '${TARGET_ORG}' organization with write access.`,
        };
    } catch (e: unknown) {
        return {
            isAuthenticated: false,
            isAuthorized: false,
            user: null,
            orgName: TARGET_ORG,
            error: e instanceof Error ? e.message : "Network error verifying GitHub authentication.",
        };
    }
}

