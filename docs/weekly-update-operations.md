# Weekly Update operations

GIHub's Weekly Update section is now **repo-managed**. The website imports weekly-update data from:

```text
src/data/weekly.js
```

The previous Vercel `/api/cron-weekly` updater is no longer scheduled by `vercel.json` and is kept only as an explicit no-op legacy endpoint. The frontend and legacy `/api/claude` content route serve weekly-update data from the committed data file.

## Source prompt

The weekly fetch prompt remains in:

```text
api/cron-shared.js
```

Keep that prompt as the source of truth for weekly update discovery. It currently searches:

- `https://news.gastro.org/`
- `https://www.healio.com/gastroenterology`
- `https://www.gastroendonews.com/`

It prioritizes FDA approvals, RCT/trial results, other news, and exactly 1-2 opinion/how-to pieces from `news.gastro.org`. It requires study-link validation and forbids fabricated conference-abstract links.

## Hermes-managed workflow

Hermes owns publication of weekly-update data:

1. Start from latest `main`.
2. Use the existing weekly fetch prompt in `api/cron-shared.js`.
3. Add user-shared articles as supplemental curated inputs when available.
4. Validate article/source links, using authorized Browserbase sessions only where needed.
5. Generate a complete JSON array of up to 12 weekly items.
6. Run:

```bash
node scripts/update-weekly-data.mjs /path/to/weekly.json
npm test
npm run lint
npm run build
```

7. Open a GitHub PR with source links, changed items, and test results.
8. The Vercel site updates after the PR is merged.

## Update cadence

Default cadence should match the old Vercel schedule:

```text
Sundays 08:00 UTC
```

## Safety rules

- Do not call or recreate `/api/cron-weekly` for publication.
- Do not write `gihub:weekly` in Redis for the live website.
- Do not change the Weekly Update prompt unless explicitly asked.
- Do not fabricate `studyUrl`; leave it empty for conference abstracts or inaccessible/unverified studies.
- Prefer direct article/source URLs over homepage or search-result URLs.
