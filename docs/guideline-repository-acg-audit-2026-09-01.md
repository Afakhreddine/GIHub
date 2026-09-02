# Guideline repository audit — 2026-09-01

## Context

The Clinical Guidelines section is intended to load the existing `gihub:guidelines:repo` repository/cache and use `src/data/guidelines.js` only as a fallback seed. After restoring that code path, a live production check returned 390 guideline records, but a known historical ACG pancreatic cyst guideline was still missing.

## Audit method

- Backed up the current live production guideline repository/cache before making changes.
- Compared live guideline records against society-source audit/backfill records for ACG, AGA, ASGE, and AASLD.
- Treated this as an append-only historical repair, not a full rebuild.
- Preserved the live cache/repository as authoritative.

Backup/audit artifacts on the Hermes host:

```text
/opt/data/gihub_guideline_repository_backups/production_guidelines_repo_20260901T211610Z.json
/opt/data/gihub_guideline_repository_backups/acg_missing_audit_20260901.json
/opt/data/gihub_guideline_repository_backups/non_acg_missing_audit_20260901.json
```

## Findings

The live repository contained 390 total guideline records. Society-source comparison identified append-only supplement candidates across all four configured guideline societies:

- ACG: 17 missing records, including the pancreatic cyst guideline.
- AGA: 10 missing records from the AGA clinical guidance source list.
- ASGE: 2 missing records from the ASGE Standards of Practice guideline list.
- AASLD: 19 missing practice guideline/guidance topic pages from the official AASLD practice-guidelines disease library.

The most clinically important diagnostic example was:

- ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts
- Year/month: 2018 Feb
- Source: https://journals.lww.com/ajg/Fulltext/2018/04000/ACG_Clinical_Guideline__Diagnosis_and_Management.8.aspx

## Repair strategy

This PR adds `src/data/guidelineSupplements.js` as an append-only historical repair supplement. The API still loads `gihub:guidelines:repo` first. At response time it merges only supplements that are not already present, using PMID/DOI/title-token matching to avoid duplicates.

This avoids:

- rebuilding the entire guideline library,
- deleting or shrinking existing records,
- replacing the live repository/cache,
- relying on the small fallback seed as the source of truth.

## Supplemented records

The supplement currently adds 48 missing records when absent from the live repository/cache:

- ACG: 17
- AGA: 10
- ASGE: 2
- AASLD: 19

Key ACG supplemented records include:

- 2025 Sep — Perioperative Risk Assessment and Management in Patients With Cirrhosis
- 2025 Aug — Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease
- 2025 May — Malnutrition and Nutritional Recommendations in Liver Disease
- 2025 Mar — Diagnosis and Management of Gastric Premalignant Conditions
- 2024 Jul — Focal Liver Lesions
- 2023 Mar — Diagnosis and Management of Biliary Strictures
- 2023 Jan — Diagnosis and Management of Gastrointestinal Subepithelial Lesions
- 2021 May — Idiosyncratic Drug-Induced Liver Injury
- 2020 Sep — Achalasia
- 2020 Feb — Small Intestinal Bacterial Overgrowth
- 2019 Aug — Hereditary Hemochromatosis
- 2018 Feb — Diagnosis and Management of Pancreatic Cysts
- 2016 Apr — Acute Diarrheal Infections
- 2016 Mar — Nutrition Therapy in the Adult Hospitalized Patient
- 2016 Feb — Liver Disease and Pregnancy
- 2015 Aug — Small Bowel Bleeding
- 2015 Apr — Primary Sclerosing Cholangitis

## Recently added guideline display

The frontend still calls `guidelines-new` and renders the prominent guideline alert banner. This PR changes the display from a strict 30-day filter to the latest 5 alert records so important recently-added records remain visible even if the `detectedAt` timestamp is older or missing.

## Verification

```bash
node --test tests/claude-guidelines.test.js
npm test
npm run lint
npm run build
git diff --check
```

All checks passed locally before PR creation.
