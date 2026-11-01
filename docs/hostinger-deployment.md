# Hostinger deployment

GIHub runs on Hostinger Business Web Hosting as a Node.js web app at `https://mygihub.com`. `server.js` (Express) serves the Vite build from `dist/` and mounts every `api/*.js` handler at `/api/<name>`, the same routes Vercel served. `vercel.json` is left in place so the Vercel project keeps working as a fallback; Hostinger ignores it.

The website makes no Anthropic calls and runs no scheduled jobs: Hermes runs the content workflows and publishes through GitHub PRs. The server only exists for:

- `/api/claude`: serves guidelines (Upstash Redis `gihub:guidelines:repo` plus repo supplements), new-guideline alerts and schedule lecture resources.
- `/api/weekly-review-data`, `/api/schedule-review-data`: load the PR under review and store Approve/Hold/Reject decisions in Redis.
- `/api/weekly-review-publish`, `/api/schedule-review-publish`: the protected `Publish approved` buttons on `/review`, which commit to and merge the PR with the GitHub token.

## App settings (hPanel → Websites → mygihub.com)

| Setting | Value |
| --- | --- |
| Source | GitHub `Afakhreddine/GIHub`, branch `main` |
| Node version | 22 |
| Package manager | npm |
| Framework preset | Express |
| Entry file | `server.js` |

Hostinger's Express preset has no build command, so `package.json` runs `vite build` as a `postinstall` script: every `npm install` on deploy rebuilds `dist/`. Hostinger assigns the port through `PORT`; the server reads it and falls back to 3000 locally.

## Environment variables

Set server-side only, copied from the Vercel project:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
GITHUB_TOKEN
WEEKLY_REVIEW_PUBLISH_TOKEN
SCHEDULE_REVIEW_PUBLISH_TOKEN
GUIDELINE_REVIEW_PUBLISH_TOKEN
```

Optional: `GITHUB_OWNER`, `GITHUB_REPO`. `ANTHROPIC_API_KEY` and `CRON_SECRET` are no longer used by the website.

## Publishing and CI

`.github/workflows/ci.yml` runs `npm test` and `npm run build` on every PR. The review `Publish approved` endpoints merge a PR only after its commit statuses and check runs have all passed, so this workflow replaces the Vercel preview status that used to gate merges. After a merge, Hostinger redeploys `main`.

## Running locally

```bash
npm install
npm run build
npm start
```

The site is then at `http://localhost:3000`. `npm run dev` proxies `/api` to the same port, so `npm start` and `npm run dev` can run side by side.
