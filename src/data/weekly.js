// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Sep 2026",
    "topic": "IBD / Chronic Diarrhea",
    "title": "The Diagnostic Accuracy of Fecal Calprotectin for Colonoscopic Abnormalities in Patients With Chronic Diarrhea",
    "authors": "Liu X et al.",
    "source": "J Gastroenterol Hepatol",
    "summary": "In a prospective study across 15 centers in China (556 patients with chronic diarrhea and 152 nondiarrhea controls), fecal calprotectin identified IBD with an AUC of 0.929 at an optimal cutoff of 157.0 μg/g; its AUC for colorectal inflammation was 0.896. Accuracy for high-risk adenomas was limited (AUC 0.587), and the abstract does not establish whether participants were hospitalized. Source verified against PubMed; AI-assisted summary requires human review before publication.",
    "url": "https://doi.org/10.1111/jgh.70591",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42476609/",
    "pmid": "42476609",
    "sourceRepository": "community-suggestion",
    "status": "candidate",
    "suggestionId": "7cdfd46a24124eed",
    "matchStatus": "confirmed",
    "matchReason": "Contributor confirmed this 2026 Chinese multicenter chronic-diarrhea study; its abstract does not establish hospitalization."
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 10, 2026",
    "topic": "Post-polypectomy Surveillance",
    "title": "Data support extending surveillance to 5 years after high-risk adenoma removal",
    "authors": "",
    "source": "healio.com / New England Journal of Medicine",
    "summary": "In a 10,799-patient randomized noninferiority trial, interim CRC incidence at 5.5 years was 0.77% when first surveillance occurred at 5 years versus 0.82% at 3 years; the upper 99.12% confidence bound was 0.68 percentage points. This may support de-escalation, but the prespecified primary endpoint is at 10 years and the noninferiority margin was 0.7 percentage points. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20261109/data-support-extending-surveillance-to-5-years-after-highrisk-adenoma-removal",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42748427/"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 9, 2026",
    "topic": "Eosinophilic Esophagitis",
    "title": "Diffuse esophageal eosinophilia tied to more severe EoE, lower steroid response",
    "authors": "",
    "source": "news.gastro.org / Clinical Gastroenterology and Hepatology",
    "summary": "In a single-center cohort of 888 patients with EoE, histologic response to topical corticosteroids occurred in 51% with diffuse disease versus 70% with proximal-only and 67% with distal-only disease; the adjusted odds ratio for response was 0.47. Separate proximal and distal biopsies may add prognostic context, but retrospective design, off-label steroid formulations, and provider-documented symptoms limit treatment-selection conclusions. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/diffuse-esophageal-eosinophilia-tied-to-more-severe-eoe-lower-steroid-response/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42863780/"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 11, 2026",
    "topic": "Ulcerative Colitis",
    "title": "Vedolizumab may prolong time to first ulcerative colitis-related complication",
    "authors": "",
    "source": "healio.com / UEG Week 2026 abstract",
    "summary": "The randomized VERDICT treat-to-target trial reported that almost 60% achieved their assigned steroid-free target by 48 weeks and that targeting disease clearance prolonged time to a UC-related complication versus targeting symptomatic remission. The accessible conference report omitted sample size, hazard ratio, event counts, and confidence intervals, so the signal is important but not yet practice-ready. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20261109/vedolizumab-may-prolong-time-to-first-ulcerative-colitis-related-complication",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 9, 2026",
    "topic": "Hepatitis B",
    "title": "Long-term data show durable functional cure after bepirovirsen for HBV",
    "authors": "",
    "source": "gastroendonews.com / The Liver Meeting 2026 abstract",
    "summary": "In pooled B-Well follow-up, 19% of bepirovirsen-treated patients achieved functional cure at week 72 and 91% of those maintained it at week 96; among patients with baseline HBsAg at or below 1,000 IU/mL, 26% achieved cure and 91% maintained it. This selected-responder conference analysis extends rather than replaces the primary B-Well result already in the Weekly archive and had no concurrent durability-stage comparator. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.gastroendonews.com/Hepatology-in-Focus/Article/10-26/Bepirovirsen-Demonstrates-Durable-Functional-Cure-in-HBV/82138",
    "studyUrl": ""
  },
  {
    "type": "News",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 11, 2026",
    "topic": "Nutrition / Practice Management",
    "title": "Medicare adds specialty code for physician nutrition specialists",
    "authors": "",
    "source": "news.gastro.org / CMS",
    "summary": "CMS specialty code F7 can now identify qualified physician nutrition specialists as a primary or secondary specialty and went live in Medicare systems on Oct. 5. The designation may clarify enrollment and claims identity for gastroenterologists with nutrition expertise, but it creates no new Medicare benefit or payment guarantee and its downstream effects are unknown. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/medicare-adds-specialty-code-for-physician-nutrition-specialists/",
    "studyUrl": ""
  }
];

export default weekly;
