# GIHub source triage workflow

GIHub content updates should pass through a source-triage layer before any AI-assisted summary is committed to the site.

This workflow was formalized from the CGH 2026 review *Artificial Intelligence Tools for Gastrointestinal Research: A Practical Guide* and applies most directly to Weekly Update, with spillover to Guidelines and future lecture/schedule support.

## Why this exists

Hermes should not jump directly from `found article` to `published summary`. GIHub needs an auditable chain:

```text
candidate source/article
  → evidence card
  → source verification
  → relevance/impact scoring
  → routing decision
  → summary drafting
  → GitHub PR review
```

The public site stays concise, while the PR preserves the evidence trail.

## Evidence card schema

Each candidate should be represented as a structured evidence card before conversion to `src/data/weekly.js`:

```json
{
  "title": "Article title",
  "sourceType": "journal article | news article | FDA update | guideline | opinion",
  "journalOrPublisher": "CGH | Gastroenterology | ACG | Healio | FDA | ...",
  "date": "Aug 23, 2026",
  "url": "https://primary-source-or-news-url",
  "studyUrl": "https://doi.org/... or PubMed/journal URL, empty if unverified",
  "doi": "10.xxxx/xxxxx",
  "pmid": "optional",
  "topic": "IBD | Hepatology | Endoscopy | Education | ...",
  "studyDesign": "RCT | cohort | meta-analysis | guideline | narrative review | ...",
  "population": "brief patient population or audience",
  "sampleSize": "n=... when applicable",
  "interventionExposure": "optional",
  "comparator": "optional",
  "primaryOutcome": "optional",
  "keyResults": ["result 1", "result 2"],
  "limitations": ["limitation 1"],
  "practiceRelevance": "why fellows/attendings care",
  "verificationStatus": "verified | partially verified | unverified",
  "triageDecision": "include | maybe | exclude | route-to-guidelines",
  "sourceQuality": "journal | society | FDA | news | opinion | unknown",
  "contentRisk": "low | medium | high",
  "clinicalImpact": 0,
  "novelty": 0,
  "evidenceQuality": 0,
  "fellowUsefulness": 0,
  "actionability": 0,
  "timeliness": 0
}
```

Scoring dimensions are integers from 0 to 3. Total impact score maps to Weekly Update impact level:

- `15–18` → `Practice-changing`
- `10–14` → `High Impact`
- `<10` → `Noteworthy`

## Routing rules

- `include` → convert to a Weekly Update item if verified and relevant.
- `maybe` → keep in the triage audit but do not publish.
- `exclude` → keep in the triage audit with the exclusion reason.
- `route-to-guidelines` → do not publish as ordinary news; send to the Guidelines workflow.

Other practical routing:

- Review/methodology articles can become internal workflow notes even if not public Weekly Update items.
- User-shared papers can be included if timely/high-yield, or saved for podcast/quiz/lecture support when better suited there.
- FDA approvals, RCTs, and practice-changing studies should outrank general news.

## Verification rules

- Verify title against the source page.
- Verify DOI/PubMed/journal page before setting `studyUrl`.
- Leave `studyUrl` empty for conference abstracts or unverified/unpublished claims.
- Check key numbers against the source: sample size, event rates, percentages, P values, confidence intervals.
- Do not overstate observational or press-release findings as practice-changing.
- Do not use patient-level data.
- Use authorized Browserbase sessions only for access/link validation where appropriate.

## Scripted triage

Use:

```bash
node scripts/triage-weekly-candidates.mjs /path/to/candidates.json /tmp/gihub-weekly-triaged.json /tmp/gihub-weekly-triage-audit.json
node scripts/update-weekly-data.mjs /tmp/gihub-weekly-triaged.json
```

The triage script:

- validates evidence-card URLs and required fields,
- rejects unverified `studyUrl` values,
- scores candidates,
- routes guideline items away from Weekly Update,
- writes a Weekly Update-compatible JSON array,
- writes an audit JSON for the PR body.

## PR body checklist

Every Weekly Update PR should include:

```text
## Source triage
Candidates reviewed:
Included:
Excluded:
Routed to guidelines:
Verified links:
Unverified/empty study links:
Risk counts:

## Review checklist
- [ ] Existing weekly prompt in api/cron-shared.js was used.
- [ ] User-shared articles were considered as supplemental inputs.
- [ ] Titles and primary URLs were verified.
- [ ] PubMed/DOI/journal study URLs were verified where available.
- [ ] No fabricated studyUrl values.
- [ ] Key statistics match source article/abstract.
- [ ] Impact levels are justified.
- [ ] Clinical implications are not overstated.
- [ ] Guideline items were routed to Guidelines workflow.
- [ ] No patient-level data was used.
- [ ] AI-assisted summaries require human review before merge.
- [ ] npm test / lint / build passed.
```

## Relationship to the public site

The triage audit is primarily an internal PR/review artifact. The public website should continue to render the curated `src/data/weekly.js` items, not the full evidence cards.
