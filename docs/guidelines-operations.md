# Guidelines operations

GIHub's Clinical Guidelines section is now **repo-managed**. The website imports guideline data from:

```text
src/data/guidelines.js
```

The previous Vercel `/api/cron-guidelines` updater has been removed from the repo and is no longer scheduled by `vercel.json`. The frontend does not call Redis for the guidelines section. The legacy `/api/claude` content route now returns the same repo-managed data for `section:"guidelines"` so older clients do not see stale Redis content.

## Operating model

1. Hermes checks ACG / AGA / ASGE / AASLD sources on a schedule.
2. Hermes uses authorized Browserbase sessions where needed to validate links and retrieve accessible source pages.
3. Hermes prepares a reviewed JSON array of guideline objects.
4. Hermes runs:

```bash
node scripts/update-guidelines-data.mjs /path/to/guidelines.json
```

5. Hermes runs tests/build.
6. Hermes commits the updated `src/data/guidelines.js` file on a branch and opens a GitHub PR.
7. Merging the PR updates the site through Vercel's normal GitHub deployment.

This avoids relying on a Vercel API cron or Anthropic credits inside the Vercel runtime for guideline updates.

## Data schema

Each guideline item must have:

```json
{
  "org": "ACG|AGA|ASGE|AASLD",
  "year": "2026",
  "month": "Jan",
  "topic": "IBD",
  "urgency": "High|Moderate|Routine",
  "title": "Guideline title",
  "summary": "One- to two-sentence fellow-facing summary.",
  "url": "https://..."
}
```

`url` may be an empty string only if no reliable item-level URL is available. Prefer PubMed, society guideline pages, or journal full-text pages over society index pages.

## Validation

The updater script validates:

- supported society names
- 4-digit years
- allowed urgency values
- required title/topic/month/summary fields
- URL format when present
- duplicate `(org, year, title)` entries

Run the normal project checks before opening a PR:

```bash
npm test
npm run lint
npm run build
```

## Weekly update

The Weekly Update remains separate and should keep its existing fetch prompt in `api/cron-shared.js`.

User-shared articles can be treated as additional curated inputs for the weekly update, but the weekly fetch prompt should not be replaced unless explicitly requested.
