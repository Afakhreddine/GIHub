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
4. Build structured evidence cards for each candidate source/article.
5. Run the source-triage layer to validate links, score impact, and route items:

```bash
node scripts/triage-weekly-candidates.mjs /path/to/candidates.json /tmp/gihub-weekly-triaged.json /tmp/gihub-weekly-triage-audit.json
```

6. Convert included, verified candidates into repo-managed weekly data:

```bash
node scripts/update-weekly-data.mjs /tmp/gihub-weekly-triaged.json
npm test
npm run lint
npm run build
```

7. Open a GitHub PR with source links, candidate/audit counts, changed items, and test results.
8. Review the PR preview at `/review/weekly`. Mark each card `Approve`, `Hold`, or `Reject`, then use `Publish approved` to publish only approved cards. Rejected/held cards are excluded from the published weekly data. If the publish endpoint has to rewrite `src/data/weekly.js` to remove rejected/held cards, wait for the updated PR preview checks to pass and click `Publish approved` again to merge.
9. The Vercel site updates after the PR is merged.

Full triage rules are documented in `docs/source-triage-workflow.md`.

## Update cadence

Default cadence should match the old Vercel schedule:

```text
Sundays 08:00 UTC
```

## Previously published weekly archive

The active Weekly Update feed remains `src/data/weekly.js` and is replaced on each approved publication. Previously published cards are preserved in `src/data/weeklyArchive.js` as abbreviated records for future schedule-tab and longitudinal browsing work.

Archive records intentionally stay compact:

```json
{
  "title": "Card title",
  "oneLineSummary": "One concise clinical/research takeaway.",
  "doi": "10.xxxx/... or empty",
  "pmid": "PubMed ID or empty",
  "source": "news or journal domain",
  "url": "preferred study/source URL",
  "date": "Published card date",
  "topic": "GI topic",
  "type": "Research|FDA|News|Opinion|Guideline",
  "archivedFrom": "YYYY-MM-DD"
}
```

The protected `Publish approved` endpoint archives the outgoing active `src/data/weekly.js` cards onto the PR branch before replacing/merging the new active weekly set. If the archive commit changes the PR branch, wait for checks and click `Publish approved` again to merge.

## Review sandbox publish button

The `/review/weekly` sandbox supports a protected `Publish approved` flow for PR preview deployments. The short production URL `/review/weekly` automatically loads the latest open Weekly Update PR so it is easy to type on a computer; use `/review/weekly?pr=10` only as an explicit fallback/debug override.

- Every weekly-update card must be reviewed as `Approve`, `Hold`, or `Reject`; unreviewed cards disable publishing.
- At least one card must be approved.
- Only approved cards are published; held/rejected cards are removed from the repo-managed weekly data before merge.
- The button prompts for a publish code instead of embedding secrets in the browser bundle.
- The client posts to `/api/weekly-review-publish`.
- The server endpoint is available only on Vercel preview deployments with a pull-request id.
- The endpoint checks the review publish code, verifies GitHub publishing configuration, checks PR status, and squash-merges the PR if checks are successful.

Required Vercel environment variables, stored server-side only:

```text
WEEKLY_REVIEW_PUBLISH_TOKEN
GITHUB_TOKEN
```

Optional overrides:

```text
GITHUB_OWNER
GITHUB_REPO
```

Never expose these values in client code, PR text, logs, or WhatsApp. If the variables are not configured, the UI remains safe and the endpoint returns a configuration error instead of publishing.

## Safety rules

- Do not call or recreate `/api/cron-weekly` for publication.
- Do not write `gihub:weekly` in Redis for the live website.
- Do not change the Weekly Update prompt unless explicitly asked.
- Do not fabricate `studyUrl`; leave it empty for conference abstracts or inaccessible/unverified studies.
- Prefer direct article/source URLs over homepage or search-result URLs.
