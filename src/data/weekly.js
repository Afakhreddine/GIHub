// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "FDA",
    "impactLevel": "Practice-changing",
    "multiSource": false,
    "date": "Aug 26, 2026",
    "topic": "Pancreatic Cancer",
    "title": "FDA approves first RAS-targeted therapy for metastatic pancreatic cancer",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "FDA approval supported by the randomized open-label phase 3 RASolute 302 trial; Adults with metastatic pancreatic ductal adenocarcinoma after prior systemic therapy or not candidates for multiagent therapy; 500. Median overall survival was 13.2 vs 6.7 months (HR 0.40, 95% CI 0.30-0.53). Median progression-free survival was 7.2 vs 3.6 months (HR 0.49, 95% CI 0.38-0.64). First FDA-approved therapy directly targeting active RAS in the most common form of pancreatic cancer; indication and toxicity require patient-specific review. Limitation: Open-label trial; 15% of chemotherapy-assigned patients did not start treatment; sponsor funded and analyzed the study. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/august-2026/fda-approves-first-rastargeted-therapy-for-metastatic-pancreatic-cancer/",
    "studyUrl": "https://www.nejm.org/doi/full/10.1056/NEJMoa2605555"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 28, 2026",
    "topic": "IBS",
    "title": "Smartphone hypnotherapy misses noninferiority threshold in IBS trial",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "Multicenter three-arm randomized controlled noninferiority trial; Patients aged 17-73 years with Rome IV irritable bowel syndrome; 230. Response was 33.3% with smartphone therapy vs 48.1% in person; difference -14.7 percentage points (95% CI -29.3 to 0.9), failing the -10% noninferiority margin. At six months, both hypnotherapy approaches outperformed psychoeducation, but the smartphone-vs-in-person difference was not significant. Digital hypnotherapy may expand access but cannot be assumed equivalent to therapist-delivered care and should follow clinical screening. Limitation: Missing diary data, lower-than-planned completion, adherence differences, and selection bias limit interpretation. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/august-2026/smartphone-hypnotherapy-misses-noninferiority-threshold-in-ibs-trial/",
    "studyUrl": "https://gut.bmj.com/content/early/2026/07/23/gutjnl-2026-338385"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 27, 2026",
    "topic": "Hereditary Colorectal Cancer",
    "title": "Lynch syndrome surveillance linked to lower mortality, but not fewer cancers",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "National registry-linked retrospective observational cohort; English patients with pathogenic mismatch-repair gene variants and no colorectal cancer before Lynch syndrome diagnosis; 4,732. More frequent surveillance was not associated with lower colorectal cancer incidence or fewer late-stage cancers. Colonoscopy every three years or less was associated with lower colorectal cancer mortality, but only 22 colorectal cancer deaths occurred. Supports continued timely high-quality Lynch surveillance while cautioning against assuming shorter intervals alone prevent cancer. Limitation: Observational design, healthy-screenee bias, interval averaging, missing colonoscopy-quality data, and residual confounding preclude causal inference. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/august-2026/lynch-syndrome-surveillance-linked-to-lower-mortality-but-not-fewer-cancers/",
    "studyUrl": "https://doi.org/10.1136/gutjnl-2025-337379"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 26, 2026",
    "topic": "Fecal Incontinence",
    "title": "Noninvasive neuromodulation reduces fecal incontinence in phase 3 trial",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "Multicenter double-blind sham-controlled phase 3 randomized trial; Adults with fecal incontinence refractory to conservative treatment; 109. Response occurred in 66% with 2,400 pulses and 81% with 3,600 pulses vs 32% with sham. No serious adverse events were attributed to treatment. Promising noninvasive option before invasive therapies, but dosing, durability, and implementation need confirmation. Limitation: Durability is unknown, few men were enrolled, and the treatment administrator was unblinded. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/august-2026/noninvasive-neuromodulation-reduces-fecal-incontinence-in-phase-3-trial/",
    "studyUrl": "https://www.gastrojournal.org/article/S0016-5085(26)06828-9/fulltext"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 28, 2026",
    "topic": "IBD",
    "title": "Upadacitinib linked to higher remission after UC therapy failure",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "Retrospective multicenter real-world comparative cohort; Adults with moderate-to-severe ulcerative colitis after failure of at least one advanced therapy; 312. Week-16 remission was 48% with upadacitinib vs 27% with each comparator. Adjusted odds favored upadacitinib, but week-52 biochemical and endoscopic analyses were exploratory with substantial missing data. May inform sequencing after advanced-therapy failure but does not establish comparative efficacy as a randomized trial would. Limitation: Retrospective nonrandomized treatment selection, differential drug availability, and missing longer-term outcome data. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/august-2026/upadacitinib-linked-to-higher-remission-after-uc-therapy-failure/",
    "studyUrl": "https://www.cghjournal.org/article/S1542-3565(26)00561-6/pdf"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 27, 2026",
    "topic": "Gastric Cancer Prevention",
    "title": "Daily consumption of sugary drinks linked to more than double risk for gastric cancer",
    "authors": "",
    "source": "healio.com",
    "summary": "Prospective analysis of two long-running US cohorts; Nurses' Health Study and Health Professionals Follow-up Study participants; 112,284; 278 gastric cancers over 3,204,001 person-years. Daily consumption was associated with HR 2.45 (95% CI 1.49-4.04) for gastric cancer. No association was detected for artificially sweetened beverages. Supports general counseling to limit sugary drinks, but this single observational association does not prove gastric-cancer prevention. Limitation: No Helicobacter pylori or family-history data, self-reported diet, predominantly White health-professional cohorts, and observational residual confounding. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20260826/daily-consumption-of-sugary-drinks-linked-to-more-than-double-risk-for-gastric-cancer",
    "studyUrl": "https://www.ghadvances.org/article/S2772-5723(26)00218-9/fulltext"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Aug 27, 2026",
    "topic": "Eosinophilic Esophagitis",
    "title": "Dupilumab can improve esophageal distensibility in EoE",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "Placebo-controlled treatment analysis reported by a subscription-gated news source; Adults with eosinophilic esophagitis; Not reported in accessible source summary. The accessible publisher summary reports significant improvement in distensibility versus placebo and improved endoscopic and histologic outcomes at 24 weeks. Potentially useful mechanistic and clinical efficacy update, pending direct source review. Limitation: Full article and direct study citation were not accessible; no studyUrl is supplied. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.gastroendonews.com/Esophageal-Disorders/Article/08-26/Dupilumab-Improves-Esophageal-Distensibility-in-EoE/81285",
    "studyUrl": ""
  }
];

export default weekly;
