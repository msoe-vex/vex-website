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
export const TARGET_REPO = "msoe-vex/website";
export const DEFAULT_AUTH_WORKER_URL = "https://raider-robotics.brightneonlights1.workers.dev";

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function saveStoredToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, token.trim());
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
        (typeof window !== "undefined" ? localStorage.getItem("msoe_vex_auth_worker_url") : null) ||
        DEFAULT_AUTH_WORKER_URL;

    if (!workerUrl) {
        throw new Error(
            "Cloudflare Auth Worker URL is not configured. Set NEXT_PUBLIC_AUTH_WORKER_URL or enter your worker URL in the dashboard."
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

    if (!data.token) {
        throw new Error("No access token returned by OAuth worker");
    }

    return data.token;
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

