// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 18, 2026",
    "topic": "Colorectal Cancer",
    "title": "Neoadjuvant nivolumab plus ipilimumab reaches 100% 3-year disease-free survival in dMMR colon cancer trial",
    "authors": "",
    "source": "news.gastro.org / The Lancet",
    "summary": "In the single-arm NICHE-2 phase 2 trial, all 111 per-protocol patients with resectable stage II-III dMMR colon cancer were alive and disease-free at a median 58.7 months after short-course neoadjuvant ipilimumab plus nivolumab, with 100% 3-year disease-free survival and 68% pathologic complete response. The durability supports early multidisciplinary consideration, but all patients underwent surgery and the historical-control design does not establish that colectomy can be omitted. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/neoadjuvant-nivolumab-plus-ipilimumab-reaches-100-3year-diseasefree-survival-in-dmmr-colon-cancer-trial/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42906564/"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 19, 2026",
    "topic": "MASLD / MASH",
    "title": "Routine labs flag nearly 1 in 4 patients in Stockholm as high risk for MASH",
    "authors": "",
    "source": "news.gastro.org / Clinical Gastroenterology and Hepatology",
    "summary": "In a 162,456-person Stockholm cohort without recorded MASLD/MASH, the Fibrotic NASH Index classified 23% as high risk; that group had a 2% 5-year major adverse liver outcome incidence and about 4.6-fold higher adjusted hazard than the low-risk group. Routine labs may identify higher-risk patients, but retrospective coding, absent histologic confirmation, and low absolute event rates mean FNI should not be used as a stand-alone diagnosis or referral mandate. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/routine-labs-flag-nearly-1-in-4-patients-in-stockholm-as-high-risk-for-mash/",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42946109/"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 17, 2026",
    "topic": "Hepatocellular Carcinoma",
    "title": "HCC surveillance may be cost-effective at lower incidence in alcohol-associated cirrhosis",
    "authors": "",
    "source": "news.gastro.org / Clinical Gastroenterology and Hepatology",
    "summary": "A U.S. microsimulation found semiannual ultrasound plus AFP became cost-effective in compensated alcohol-associated cirrhosis at annual HCC incidence near 0.45 per 100 person-years, with ICERs of $18,952/QALY for active drinkers and $56,000/QALY for abstinent patients. The model supports not withholding surveillance solely for ongoing alcohol use, but its assumptions, U.S.-specific costs, and small per-patient QALY gains limit direct clinical inference. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/hcc-surveillance-may-be-costeffective-at-lower-incidence-in-alcoholassociated-cirrhosis/",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.09.035"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 16, 2026",
    "topic": "Crohn’s Disease Prevention",
    "title": "Whole-food diet lowers calprotectin in trial of relatives at risk for Crohn’s",
    "authors": "",
    "source": "news.gastro.org / Gastroenterology",
    "summary": "In a 29-person randomized crossover trial of first-degree relatives at increased Crohn’s risk, adjusted fecal calprotectin was 37% lower during an 8-week whole-food diet than during usual-diet periods, and 71% versus 27% achieved at least a 50% reduction after the first period. This is proof of biomarker modification, not disease prevention, and the very small open-label study, short periods, and no washout do not justify prescribing a restrictive diet to prevent Crohn’s disease. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/wholefood-diet-lowers-calprotectin-in-trial-of-relatives-at-risk-for-crohns/",
    "studyUrl": "https://doi.org/10.1053/j.gastro.2026.10.376"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 19, 2026",
    "topic": "Ulcerative Colitis",
    "title": "Vedolizumab associated with more steroid-free disease stability than anti-TNF therapy in UC",
    "authors": "",
    "source": "healio.com / JAMA Network Open",
    "summary": "In a 3,263-patient Swedish cohort, vedolizumab initiators spent 67% of follow-up quarters in steroid-free disease stability versus 60% with infliximab, and 70% versus 67% in the adalimumab comparison, while hospitalization and colectomy did not differ significantly. This may be a first-line positioning tiebreaker, but observational treatment selection, residual confounding, and absent endoscopic or biomarker data preclude a causal efficacy claim. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20261118/tiebreaker-not-a-knockout-vedolizumab-tops-antitnf-for-steroidfree-stability-in-uc",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42789265/"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 17, 2026",
    "topic": "Ulcerative Colitis",
    "title": "Rifamycin gel achieves clinical remission in nearly 50% of patients with distal UC",
    "authors": "",
    "source": "healio.com / Cosmo press release",
    "summary": "Topline results from a 76-patient randomized phase 2 trial reported 6-week clinical remission in 46.2% with rifamycin 1% topical gel versus 14.3% with placebo (P=.019), with no serious adverse event judged treatment-related. The rectal gel is promising, but the manufacturer release reported only 60 completers and no full peer-reviewed paper or verifiable direct study link, so the result is not practice-ready. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20261116/rifamycin-gel-achieves-clinical-remission-in-nearly-50-of-patients-with-distal-uc",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 16, 2026",
    "topic": "MASLD / Cirrhosis",
    "title": "Current screening methods may underestimate MASLD cirrhosis risk in younger adults",
    "authors": "",
    "source": "healio.com / Clinical Gastroenterology and Hepatology",
    "summary": "In a biopsy-enriched cohort of 2,395 adults with MASLD, 30% of the 53 patients with cirrhosis before age 50 had FIB-4 below 1.3; among younger adults, diabetes carried adjusted odds of 3.74 and a high genetic risk score odds of 2.33 for cirrhosis. A reassuring FIB-4 may not end evaluation when metabolic risk is severe, but the predominantly White cohort, few younger cases, and unvalidated genetic strategy limit generalizability. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.healio.com/news/gastroenterology/20261113/current-screening-methods-may-underestimate-risk-for-masld-cirrhosis-in-younger-adults",
    "studyUrl": "https://pubmed.ncbi.nlm.nih.gov/42749101/"
  },
  {
    "type": "Opinion",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 20, 2026",
    "topic": "Acute-on-Chronic Liver Failure",
    "title": "A global consensus definition of acute-on-chronic liver failure: A major step forward for hepatology",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "This expert commentary explains the five-society ACLF framework, which requires bilirubin at least 5 mg/dL, INR at least 1.5, advanced chronic liver disease, and at least one extrahepatic organ dysfunction or failure. A shared definition may improve recognition, prognostication, transplant referral, and trial comparability, but the editorial interpretation and underlying consensus still require prospective validation; the formal consensus was routed to Guidelines review. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://news.gastro.org/issues/2026/november-2026/a-global-consensus-definition-of-acuteonchronic-liver-failure-a-major-step-forward-for-hepatology/",
    "studyUrl": "https://doi.org/10.1097/HEP.0000000000001891"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Nov 18, 2026",
    "topic": "Obesity / Bariatric Surgery",
    "title": "Bariatric surgery more cost-effective than GLP-1s across payer groups",
    "authors": "",
    "source": "gastroendonews.com / ASMBS 2026",
    "summary": "In an all-payer claims study of 90,769 patients presented at ASMBS 2026, sleeve gastrectomy was associated with mean 2-year savings of $12,794 versus continuous GLP-1 therapy, approaching $19,000 in Medicaid, while gastric bypass saved about $4,000 overall. The finding informs value discussions but is not a clinical efficacy comparison because the conference report lacks a verifiable publication, follow-up was only 2 years, and claims data omitted diabetes remission and other downstream outcomes. Source verified; AI-assisted summary requires human review before merge.",
    "url": "https://www.gastroendonews.com/PRN/Article/11-26/Bariatric-Surgery-More-Cost-Effective-Than-GLP-1s/82182",
    "studyUrl": ""
  }
];

export default weekly;
