# Raider Robotics GitHub App Cloudflare Worker

A lightweight, secure Cloudflare Worker proxy that enables 1-click **"Sign in with GitHub"** for the Raider Robotics Dashboard on both `localhost:3000` and the production GitHub Pages site (`msoevex.com`).

---

## Why a GitHub App with Fine-Grained Permissions?

| Feature | Legacy OAuth App | Modern GitHub App |
| :--- | :--- | :--- |
| **Scope of Access** | Blanket `repo` scope — grants write access to **every repository** (both personal and organizational) the user has access to on GitHub. | Strictly isolated to **only selected repositories** (`msoe-vex/vex-website`). Personal repos are completely untouched. |
| **Permissions** | Coarse-grained ("all or nothing"). | Fine-grained: only `Contents: Read and write` and `Pull requests: Read and write`. |
| **Secrets Safety** | `CLIENT_SECRET` in Worker. | `CLIENT_SECRET` in Worker — never exposed to client or browser. |
| **Org Governance** | Requires broad org OAuth approvals. | Explicitly installed by org admin on specific repos with clear audit trails. |

---

## Step 1: Create and Configure the GitHub App

1. **Go to GitHub App Registration**:
   - Organization: Go to `https://github.com/organizations/msoe-vex/settings/apps` &rarr; click **New GitHub App**.
   - *(Or in personal settings: Settings &rarr; Developer settings &rarr; GitHub Apps &rarr; New GitHub App).*
2. **App Details**:
   - **GitHub App name**: `Raider Robotics Dashboard` (or your preferred name)
   - **Homepage URL**: `https://msoevex.com`
   - **Callback URL**:
     ```text
     https://msoevex.com/dashboard
     http://localhost:3000/dashboard
     ```
     *(You can add both URLs, one per line).*
3. **Webhook**:
   - **Active**: Uncheck this box (the dashboard calls the GitHub REST API on demand; no incoming webhook delivery is needed).
4. **Permissions**:
   - **Repository permissions**:
     - `Contents`: **Read and write** *(to read files for diffing, create branches, and commit updated data & images)*
     - `Pull requests`: **Read and write** *(to open pull requests from dashboard changes)*
     - `Metadata`: **Read-only** *(automatically assigned by GitHub)*
   - **Organization permissions** *(optional)*:
     - `Members`: **Read-only** *(allows the dashboard to directly verify active org membership via GitHub's API)*
5. **User-to-server token expiration**:
   - *Recommendation*: **Uncheck** *"Expire user authorization tokens"* for non-expiring login sessions in the browser. If left checked, user access tokens expire after 8 hours.
6. **Where can this GitHub App be installed?**:
   - Select **"Only on this account"**.
7. Click **Create GitHub App**.
8. **Generate Client Secret**:
   - On the newly created App's general settings page, copy the **Client ID** (e.g. `Iv...`).
   - Under **Client secrets**, click **Generate a new client secret** and copy the secret.

---

## Step 2: Install the App on the Repository

1. In the left sidebar of your GitHub App settings, click **Install App**.
2. Click **Install** next to the `msoe-vex` organization (or your account).
3. Under **Repository access**, select **"Only select repositories"** and choose `msoe-vex/vex-website`.
4. Click **Install**.

---

## Step 3: Configure and Deploy the Cloudflare Worker

### Option A: Via Cloudflare Dashboard (No CLI Needed, 2 minutes)

1. Log into your free [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** &rarr; **Create application** &rarr; **Create Worker**.
3. Name it `raider-robotics-auth` and click **Deploy**.
4. Click **Edit code** on the top right.
5. Replace the code with the contents of [`cloudflare-worker/worker.js`](worker.js) (or [`src/index.ts`](src/index.ts)) and click **Deploy**.
6. In Worker settings:
   - Click **Settings** tab &rarr; **Variables and Secrets**.
   - Under **Secrets**, click **Add**:
     - Variable name: `CLIENT_SECRET` &rarr; Value: Your GitHub App Client Secret &rarr; Click **Encrypt**.
     - Variable name: `CLIENT_ID` &rarr; Value: Your GitHub App Client ID &rarr; Click **Encrypt**.
7. Copy your Worker URL: `https://raider-robotics-auth.<your-subdomain>.workers.dev`.

### Option B: Via Wrangler CLI

```bash
cd cloudflare-worker
npx wrangler login
npx wrangler secret put CLIENT_ID      # Enter your GitHub App Client ID (Iv...)
npx wrangler secret put CLIENT_SECRET  # Enter your GitHub App Client Secret
npx wrangler deploy
```

---

## Step 4: Configure the Website

In the website root:

1. **Local Development (`.env.local`)**:
   ```env
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_app_client_id
   NEXT_PUBLIC_AUTH_WORKER_URL=https://raider-robotics-auth.<your-subdomain>.workers.dev
   ```

2. **Code Defaults (`app/dashboard/auth/githubAuth.ts`)**:
   Update `DEFAULT_GITHUB_CLIENT_ID` and `DEFAULT_AUTH_WORKER_URL` with your production values so that visitors to `msoevex.com` authenticate seamlessly without needing build-time env variables.

## Step 4: Configure the Website

In the website root:

1. **Local Development (`.env.local`)**:
   ```env
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_app_client_id
   NEXT_PUBLIC_AUTH_WORKER_URL=https://raider-robotics-auth.<your-subdomain>.workers.dev
   ```

2. **Code Defaults (`app/dashboard/auth/githubAuth.ts`)**:
   Update `DEFAULT_GITHUB_CLIENT_ID` and `DEFAULT_AUTH_WORKER_URL` with your production values so that visitors to `msoevex.com` authenticate seamlessly without needing build-time env variables.

