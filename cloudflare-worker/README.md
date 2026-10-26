# Raider Robotics GitHub OAuth Cloudflare Worker

A lightweight, secure Cloudflare Worker proxy that enables 1-click **"Sign in with GitHub"** for the Raider Robotics Dashboard on both `localhost:3000` and the production GitHub Pages site (`msoevex.com`).

---

## Why Use This Worker?
1. **Keeps Secrets Safe**: `GITHUB_CLIENT_SECRET` is stored as an encrypted secret in Cloudflare—it is **never** committed to Git or exposed to the browser.
2. **CORS & Static Site Compatible**: Bypasses GitHub's CORS limitations for browser-side requests and works seamlessly with GitHub Pages static hosting.
3. **100% Free**: Cloudflare Workers free tier includes 100,000 requests/day.

---

## Option A: Deploy via Cloudflare Dashboard (No CLI Needed, 2 minutes)

1. Log into your free [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation, click **Compute (Workers & Pages)** &rarr; **Create application** &rarr; **Create Worker**.
3. Name it `raider-robotics-auth` and click **Deploy**.
4. Click **Edit code** on the top right.
5. Replace the entire code with the contents of [`cloudflare-worker/src/index.ts`](src/index.ts) and click **Deploy**.
6. Go back to your Worker settings:
   - Click **Settings** tab &rarr; **Variables and Secrets**.
   - Under **Secrets**, click **Add**:
     - Variable name: `CLIENT_SECRET` &rarr; Value: Your GitHub OAuth App Client Secret &rarr; Click **Encrypt**.
     - Variable name: `CLIENT_ID` &rarr; Value: Your GitHub OAuth App Client ID &rarr; Click **Encrypt**.
7. Copy your Worker URL: `https://raider-robotics-auth.<your-subdomain>.workers.dev`.
8. In your website repository:
   - In `.env.local` (for dev):
     ```env
     NEXT_PUBLIC_GITHUB_CLIENT_ID=your_client_id
     NEXT_PUBLIC_AUTH_WORKER_URL=https://raider-robotics-auth.<your-subdomain>.workers.dev
     ```
   - For GitHub Pages deployment: add `NEXT_PUBLIC_AUTH_WORKER_URL` as a GitHub repository secret / variable in `.github/workflows/deploy.yml` or keep in your `.env`.

---

## Option B: Deploy via Wrangler CLI

If you have Node.js and want to deploy via terminal:

```bash
cd cloudflare-worker
npx wrangler login
npx wrangler secret put CLIENT_ID
npx wrangler secret put CLIENT_SECRET
npx wrangler deploy
```

