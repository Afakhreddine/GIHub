# Guidelines operations

GIHub's Clinical Guidelines section is backed by the Redis key `gihub:guidelines:repo` and rendered by `src/App.jsx`.

## Current production flow

- Vercel cron calls `/api/cron-guidelines` weekly.
- `/api/cron-guidelines` asks Claude to check ACG, AGA, ASGE, and AASLD sources for newly published guidelines.
- Newly detected entries are deduplicated and written back to Upstash Redis.
- Recent additions are also written to `gihub:guidelines:new` for the frontend banner.

## Endpoint modes

`/api/cron-guidelines` supports these modes:

- no query parameters: weekly update across all four societies
- `?society=ACG|AGA|ASGE|AASLD`: initialize or refresh one society
- `?dedup=true`: deduplicate the repository
- `?fixlinks=ORG`: re-resolve PubMed links for one society
- `?reset=true`: clear the repository

## Authorization

If `CRON_SECRET` is unset, the endpoint preserves the historical permissive behavior.

If `CRON_SECRET` is set, callers must include:

```http
Authorization: Bearer <CRON_SECRET>
```

This keeps the current deployment non-breaking while allowing Hermes or Vercel to run the endpoint safely once a shared cron secret is configured.

## Hermes handoff plan

Recommended migration path:

1. Keep the existing Vercel cron enabled while Hermes is introduced.
2. Add a Hermes cron that calls `/api/cron-guidelines` in report-only/test mode or calls it immediately after the Vercel job and summarizes the result.
3. After several successful runs, make Hermes the primary scheduler and disable the Vercel schedule for `/api/cron-guidelines`.
4. Keep emergency maintenance actions (`reset`, `dedup`, `fixlinks`) secret-protected whenever `CRON_SECRET` is available.

## Weekly update and schedule notes

Weekly updates and lecture schedule content should remain human-in-the-loop. Hermes can use articles shared by the user as additional inputs and can use the user's authenticated ACG, AGA, and ASGE Browserbase sessions to verify that linked articles/guidelines resolve correctly before pushing updates.
