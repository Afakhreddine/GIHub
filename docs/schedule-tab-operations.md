# Schedule tab operations

GIHub Schedule is moving to the same repo-managed model as Weekly Update: Hermes edits data files, opens a PR, Vercel deploys after merge, and no production Redis mutation is required for the published site.

## User-facing requirements

- The bulk schedule build runs when Ali provides an image/PDF/text of the lecture schedule.
- The Schedule tab should show one combined `News and Articles` section, not separate news and article panels.
- Topic enrichment should search the entire Weekly Update repository first:
  - `src/data/weekly.js` for the current active weekly cards.
  - `src/data/weeklyArchive.js` for previously published abbreviated cards.
- If the weekly repository does not provide enough strong hits, do a targeted topic pull using the current Weekly Update source model/prompt rather than fabricating content.
- Guidelines should include the most recent relevant guideline per society when available, so a topic may show ACG + AGA + ASGE + AASLD.
- Each clickable schedule topic should always have an interactive quiz.
- Preferred quiz generation is AutoContent from PDFs pulled for the relevant guidelines/articles; store the resulting quiz JSON and render with the existing interactive quiz component.

## Repo-managed files

- `src/scheduleConfig.js` — current calendar/events. This remains the schedule seed until the image-import workflow generates a replacement data file.
- `src/data/scheduleResources.js` — repo-managed per-topic resources. Keys are lecture slugs. Values should contain:
  - `guidelines`
  - `newsAndArticles`
  - `quiz`
  - `quizSourcePdfs`
  - `fetchedAt`
- `src/scheduleResourcesModel.js` — reusable matching, guideline selection, validation, and weekly-card screening helpers.
- `src/data/weekly.js` — active Weekly Update cards.
- `src/data/weeklyArchive.js` — cumulative abbreviated archive of prior Weekly Update cards.

## Bulk build workflow

When Ali provides a lecture schedule image:

1. OCR/parse the image into events with date, label, topic, slug, and type.
2. Update schedule data.
3. For each clickable topic:
   - Select the most recent relevant guideline for each society.
   - Search `weekly.js` + `weeklyArchive.js` for matching News and Articles.
   - If too few strong hits exist, run a targeted topic pull using the current weekly prompt/source model.
   - Pull relevant PDFs for guidelines/articles when authorized.
   - Send PDFs to AutoContent quiz generation.
   - Store quiz JSON in `src/data/scheduleResources.js`.
4. Run `npm test`, `npm run lint`, `npm run build`, `git diff --check`.
5. Open a GitHub PR.

## Weekly screener workflow

Every Weekly Update cron run should screen newly included weekly cards against upcoming schedule topics.

Run after weekly candidate triage/generation:

```bash
node scripts/screen-weekly-for-schedule.mjs /tmp/gihub-weekly-triaged.json --today YYYY-MM-DD
```

Or dry-run for reporting only:

```bash
node scripts/screen-weekly-for-schedule.mjs /tmp/gihub-weekly-triaged.json --today YYYY-MM-DD --dry-run
```

The screener:

- considers upcoming clickable schedule topics within the next 90 days;
- compares new weekly cards against each topic;
- writes candidate `newsAndArticles` additions into `src/data/scheduleResources.js` only when matches are strong enough;
- marks additions as `status: "candidate"` with a relevance reason;
- de-duplicates by DOI, PMID, URL, or title.

The screener should not silently auto-publish schedule links. It should add candidates to the same weekly PR so Ali can review them.

## Validation commands

```bash
node --import ./tests/register-jsx.mjs --test tests/schedule-resources-model.test.js tests/schedule-ui.test.jsx
npm test
npm run lint
npm run build
git diff --check
```
