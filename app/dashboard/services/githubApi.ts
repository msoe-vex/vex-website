import { TARGET_REPO } from "../auth/githubAuth";

export interface GitHubFileCommitResult {
    content: {
        name: string;
        path: string;
        sha: string;
        html_url: string;
    };
    commit: {
        sha: string;
        message: string;
        html_url: string;
    };
}

export interface PullRequestResult {
    number: number;
    html_url: string;
    title: string;
    state: string;
}

export function utf8ToBase64(str: string): string {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
        )
    );
}

export function base64ToUtf8(str: string): string {
    const cleaned = str.replace(/\s/g, "");
    return decodeURIComponent(
        Array.prototype.map
            .call(atob(cleaned), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
}

/**
 * Retrieves the raw text and SHA of a file in the repository.
 */
export async function fetchFileContent(
    token: string,
    filePath: string,
    branch = "main"
): Promise<{ text: string; sha: string } | null> {
    const url = `https://api.github.com/repos/${TARGET_REPO}/contents/${filePath}?ref=${branch}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });

    if (res.status === 404) {
        return null;
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch ${filePath}: HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.content) {
        return null;
    }

    const text = base64ToUtf8(data.content);
    return { text, sha: data.sha };
}

/**
 * Creates a new git branch from baseBranch (defaults to 'main').
 */
export async function createBranch(
    token: string,
    newBranchName: string,
    baseBranch = "main"
): Promise<string> {
    // 1. Get SHA of base branch
    const branchRes = await fetch(`https://api.github.com/repos/${TARGET_REPO}/branches/${baseBranch}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
        },
    });

    if (!branchRes.ok) {
        const err = await branchRes.json().catch(() => ({}));
        throw new Error(`Failed to read base branch '${baseBranch}': ${err.message || branchRes.status}`);
    }

    const branchData = await branchRes.json();
    const baseSha = branchData.commit.sha;

    // 2. Create new branch ref
    const createRefUrl = `https://api.github.com/repos/${TARGET_REPO}/git/refs`;
    const createRefRes = await fetch(createRefUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ref: `refs/heads/${newBranchName}`,
            sha: baseSha,
        }),
    });

    if (!createRefRes.ok) {
        const err = await createRefRes.json().catch(() => ({}));
        throw new Error(`Failed to create branch '${newBranchName}': ${err.message || createRefRes.status}`);
    }

    return baseSha;
}

/**
 * Commits a file (either text or base64 binary) to a branch.
 */
export async function commitFile(
    token: string,
    branch: string,
    filePath: string,
    content: string,
    commitMessage: string,
    isBase64 = false
): Promise<GitHubFileCommitResult> {
    // Check if file already exists on this branch to obtain SHA
    let existingSha: string | undefined;
    try {
        const checkUrl = `https://api.github.com/repos/${TARGET_REPO}/contents/${filePath}?ref=${branch}`;
        const checkRes = await fetch(checkUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });
        if (checkRes.ok) {
            const checkData = await checkRes.json();
            existingSha = checkData.sha;
        }
    } catch {
        // file doesn't exist, ignore
    }

    const encodedContent = isBase64 ? content : utf8ToBase64(content);

    const putUrl = `https://api.github.com/repos/${TARGET_REPO}/contents/${filePath}`;
    const putRes = await fetch(putUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: commitMessage,
            content: encodedContent,
            branch,
            ...(existingSha ? { sha: existingSha } : {}),
        }),
    });

    if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error(`Failed to commit file ${filePath}: ${err.message || putRes.status}`);
    }

    return await putRes.json();
}

/**
 * Creates a Pull Request on msoe-vex/website.
 */
export async function createPullRequest(
    token: string,
    branch: string,
    title: string,
    body: string,
    base = "main"
): Promise<PullRequestResult> {
    const prUrl = `https://api.github.com/repos/${TARGET_REPO}/pulls`;
    const res = await fetch(prUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            head: branch,
            base,
            body,
        }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Failed to create pull request: ${err.message || res.status}`);
    }

    const data = await res.json();
    return {
        number: data.number,
        html_url: data.html_url,
        title: data.title,
        state: data.state,
    };
}

