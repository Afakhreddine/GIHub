# Schedule tab operations

GIHub Schedule is moving to the same repo-managed model as Weekly Update: Hermes edits data files, opens a PR, Vercel deploys after merge, and no production Redis mutation is required for the published site.

## User-facing requirements

- The bulk schedule build runs when Ali provides an image/PDF/text of the lecture schedule.
- The Schedule tab should show one combined `News and Articles` section, not separate news and article panels.
- Topic enrichment should search the entire Weekly Update repository first:
  - `src/data/weekly.js` for the current active weekly cards.
  - `src/data/weeklyArchive.js` for previously published abbreviated cards.
- Schedule population must use a two-phase enrichment workflow: first search `weekly.js` + `weeklyArchive.js`, then run a targeted online topic pull for any clickable topic with sparse `News and Articles` candidates. Do not stop after guidelines plus archive matches when article/news sections are sparse; add targeted results as reviewable `status: "candidate"` items rather than fabricating filler content.
- Guidelines should include the most recent relevant guideline per society when available, so a topic may show ACG + AGA + ASGE + AASLD.
- Each clickable schedule topic should always have an interactive quiz.
- Preferred quiz generation is AutoContent from original source PDFs pulled for the relevant guidelines/articles; do not send metadata packets, summaries, screenshots, or synthetic source-packet PDFs for quiz generation. Store the resulting quiz JSON and render with the existing interactive quiz component.
- Schedule quiz generation should request AutoContent `quiz_difficulty: hard` using the repo wrapper below, with clinical-reasoning/board-review instructions and plausible distractors. The import step still randomizes answer order and recomputes the correct letter.

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
   - Always run `npm run schedule:targeted-pull` after `src/scheduleConfig.js` is updated. The script derives its topic list from the current calendar automatically, replaces prior `targeted-online-pull` candidates for those current slugs, and writes review-only PubMed candidates to `src/data/scheduleResources.js`.
   - Pull relevant original source PDFs for guidelines/articles when authorized. Do not create or send metadata/summary/source-packet PDFs to AutoContent for quiz generation.
   - Build the source manifest with actual PDF paths only, for example:
     ```json
     {
       "colon-polyps-pathology": {
         "topic": "Colon Polyps Pathology",
         "sourceType": "source-pdfs",
         "pdfs": [
           "/opt/data/gihub_sources/colon-polyps/acg-crc-screening.pdf",
           "/opt/data/gihub_sources/colon-polyps/serrated-neoplasia-review.pdf"
         ]
       }
     }
     ```
   - Generate hard AutoContent quizzes from the source manifest. The wrapper rejects entries that are not marked `source-pdf`/`source-pdfs`, passes only those PDF files to AutoContent, requests `--quiz-difficulty hard`, and explicitly requires exactly 10 single-best-answer `multiple_choice` questions only; no multiple-select/select-all questions because the GIHub quiz UI is single-answer.
     ```bash
     npm run schedule:quiz-generate -- --source-manifest /path/to/source-manifest.json --out-dir /opt/data/autocontent_outputs/gihub_schedule_quizzes
     ```
   - Import the generated quiz JSON into repo-managed resources:
     ```bash
     npm run schedule:quiz-import -- --artifact-dir /opt/data/autocontent_outputs/gihub_schedule_quizzes --source-manifest /path/to/source-manifest.json
     ```
   - Store quiz JSON in `src/data/scheduleResources.js`.
4. Close or supersede any stale open Schedule review PRs from prior calendars before sharing `/review/schedule`; otherwise the latest-PR selector can show old cards.
5. Run `npm test`, `npm run lint`, `npm run build`, `git diff --check`.
6. Open a GitHub PR.

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
