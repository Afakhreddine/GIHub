# Hostinger deployment

GIHub runs on Hostinger Business Web Hosting as a Node.js web app at `https://mygihub.com`. `server.js` (Express) serves the Vite build from `dist/` and mounts every `api/*.js` handler at `/api/<name>`, the same routes Vercel served. `vercel.json` is left in place so the Vercel project keeps working as a fallback; Hostinger ignores it.

The website makes no Anthropic calls and runs no scheduled jobs: Hermes runs the content workflows and publishes through GitHub PRs. The server only exists for:

- `/api/claude`: serves guidelines (Upstash Redis `gihub:guidelines:repo` plus repo supplements), new-guideline alerts and schedule lecture resources.
- `/api/weekly-review-data`, `/api/schedule-review-data`: load the PR under review and store Approve/Hold/Reject decisions in Redis.
- `/api/weekly-review-publish`, `/api/schedule-review-publish`: the protected `Publish approved` buttons on `/review`, which commit to and merge the PR with the GitHub token.
- `/api/gihub-auth/login`, `/logout`, `/me`, `/profile`, `/change-password`: same-origin GIHub sessions for existing EndoEval users. Credentials pass only from GIHub's server to EndoEval; its JWT is encrypted inside a Secure, HttpOnly GIHub cookie (not available to browser JavaScript). Profile reads/writes and signed-in password changes are proxied to EndoEval. Password changes require the current password, update the *same* EndoEval account, and rotate the encrypted GIHub cookie without extending its original lifetime. A GIHub username is only a profile handle, not a separate login.
- `/api/community`: signed-in article leads and moderated discussion on published articles, episodes, and Schedule quizzes. Records use separate Upstash keys and do not mutate repo-managed content or review decisions. See `docs/community-operations.md` for the required reviewer token and weekly intake procedure.

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
GIHUB_SESSION_SECRET
GIHUB_COMMUNITY_REVIEW_TOKEN
```

`GIHUB_SESSION_SECRET` is independent from every EndoEval secret and is required for GIHub auth. Use a cryptographically random value of at least 32 bytes (for example, generate one outside the repo with `openssl rand -base64 48`). Never commit or copy the generated value into documentation. Auth routes fail closed when it is absent or too short.

Optional auth settings:

```text
ENDOEVAL_AUTH_ORIGIN
GIHUB_PUBLIC_ORIGIN
```

`ENDOEVAL_AUTH_ORIGIN` defaults to `https://endoeval.com`; an override must be a bare HTTPS origin with no path, query, fragment, or embedded credentials. `GIHUB_PUBLIC_ORIGIN` defaults to `https://mygihub.com` and is the exact browser `Origin` accepted for login, logout, and profile updates. Configure the same variables in Vercel only if the fallback deployment is in use. Do not add EndoEval credentials, JWTs, or database access to either host.

### Auth rollout limitations

- Logout deletes the browser cookie but does **not** revoke a previously copied cookie. The cookie is valid for at most 12 hours, subject to the EndoEval JWT's expiry and EndoEval's account-state checks. A shared server-side session/revocation store is needed if immediate sign-out invalidation is a requirement.
- GIHub's five-attempt-per-email login throttle is process-local and resets on restart or another app instance. EndoEval also has a process-local account throttle. Add a shared limiter at the application or trusted edge before relying on either across multiple instances, and monitor abuse.
- Deploy and verify EndoEval's account-state and reset changes before enabling GIHub login. A normal EndoEval auth login and profile read/write should succeed first; a password reset should invalidate existing sessions. Neither the draft PR nor local tests verifies the live Hostinger routing or SMTP behavior.

Optional publishing settings: `GITHUB_OWNER`, `GITHUB_REPO`. `ANTHROPIC_API_KEY` and `CRON_SECRET` are no longer used by the website.

## Publishing and CI

`.github/workflows/ci.yml` runs `npm test` and `npm run build` on every PR. The review `Publish approved` endpoints merge a PR only after its commit statuses and check runs have all passed, so this workflow replaces the Vercel preview status that used to gate merges. After a merge, Hostinger redeploys `main`.

## Running locally

```bash
npm install
npm run build
npm start
```

The site is then at `http://localhost:3000`. `npm run dev` proxies `/api` to the same port, so `npm start` and `npm run dev` can run side by side.
