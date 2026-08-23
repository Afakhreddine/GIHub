// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "May 20, 2026",
    "topic": "MASLD / Pediatrics",
    "title": "BMI and Metabolic Markers Could Address Steatotic Liver Disease Screening Gap in Youth",
    "authors": "",
    "source": "healio.com",
    "summary": "A new analysis suggests BMI combined with metabolic markers could identify a significant screening 'blind spot' for steatotic liver disease in children and adolescents, where current adult-derived thresholds may miss early disease. Researchers propose pediatric-specific cutoffs for clinical screening algorithms.",
    "url": "https://www.healio.com/news/gastroenterology/20260520/bmi-other-markers-could-address-steatotic-liver-disease-screening-blind-spot-in-youth",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "Practice-changing",
    "multiSource": false,
    "date": "May 25, 2026",
    "topic": "Colorectal Cancer",
    "title": "Adjuvant Chemoimmunotherapy Sets New Standard in Stage III dMMR Colon Cancer",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "Adjuvant atezolizumab plus mFOLFOX6 reduced recurrence risk by approximately 50% versus chemotherapy alone in stage III deficient mismatch repair (dMMR) colon cancer in a phase 3 trial presented at ASCO 2026. This establishes a new standard of care for this molecularly defined subgroup.",
    "url": "https://www.gastroendonews.com/PRN/Article/05-26/Adjuvant-Chemoimmunotherapy-Standard-Stage-III-dMMR-Colon-Cancer/80633",
    "studyUrl": ""
  },
  {
    "type": "FDA",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "May 28, 2026",
    "topic": "Hepatology",
    "title": "FDA Approves Bulevirtide — First-Ever Treatment for Chronic Hepatitis Delta Virus",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "Bulevirtide received FDA approval as the first therapeutic option for chronic hepatitis Delta virus (HDV) infection in the US, administered via once-daily subcutaneous injection. HDV affects an estimated 5% of the 300 million people living with chronic hepatitis B worldwide.",
    "url": "https://www.gastroendonews.com/Hepatology-in-Focus/Article/05-26/fda-approves-hepatitis-delta-treatment-Bulevirtide/80664",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": true,
    "date": "May 21, 2026",
    "topic": "IBD",
    "title": "'Strikingly Better': Co-antibody Combination Tops Golimumab + Guselkumab in Refractory IBD",
    "authors": "",
    "source": "healio.com",
    "summary": "A phase 2 clinical trial demonstrated that a novel co-antibody combination showed significantly superior efficacy over both golimumab and guselkumab in patients with refractory inflammatory bowel disease. Results were presented at Digestive Disease Week 2026.",
    "url": "https://www.healio.com/news/gastroenterology/20260521/strikingly-better-coantibody-combination-tops-golimumab-guselkumab-in-refractory-ibd",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Jun 3, 2026",
    "topic": "Colonoscopy",
    "title": "Narrow-Band Imaging Reduces Serrated Lesion Miss Rate in Multicenter Randomized Trial",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "Enhanced imaging during colonoscopy significantly reduced missed sessile serrated lesions and adenomas in a multicenter RCT of average-risk screening patients. The study supports wider adoption of NBI as a standard quality measure during screening colonoscopy.",
    "url": "https://news.gastro.org/issues/2026/june-2026/narrowband-imaging-may-lower-serrated-lesion-miss-rate/",
    "studyUrl": "https://www.cghjournal.org/article/S1542-3565(26)00055-8/fulltext"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Jun 3, 2026",
    "topic": "EoE",
    "title": "Long-Term Dupilumab Sustains Remission in Refractory Eosinophilic Esophagitis at 72 Weeks",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "The DUPEOETALY trial found that dupilumab maintained histologic and symptomatic remission through 72 weeks in patients with refractory eosinophilic esophagitis, providing the longest-duration efficacy data for a biologic in this condition. Adverse event rates were consistent with earlier follow-up periods.",
    "url": "https://news.gastro.org/issues/2026/june-2026/longterm-dupilumab-associated-with-sustained-remission-in-refractory-eosinophilic-esophagitis/",
    "studyUrl": "https://www.cghjournal.org/article/S1542-3565(26)00273-9/fulltext"
  },
  {
    "type": "FDA",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Jun 3, 2026",
    "topic": "Functional GI",
    "title": "FDA Expands Linzess Approval to Children Age 2+ for Functional Constipation",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "The FDA expanded linaclotide (Linzess) approval to treat functional constipation in children aged 2 years and older, extending access from the prior lower age limit of 6 years based on new pediatric safety and pharmacokinetic data.",
    "url": "https://www.gastroendonews.com/Functional-GI-Disorders/Article/05-26/Constipation-Treatment-FDA-Approves-Linzess-for-Children/80698",
    "studyUrl": ""
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "May 18, 2026",
    "topic": "Colorectal Cancer",
    "title": "Low-Dose Aspirin Cuts Recurrence in PI3K-Mutant Colorectal Cancer",
    "authors": "",
    "source": "gastroendonews.com",
    "summary": "A randomized controlled trial demonstrated that low-dose aspirin significantly reduced recurrence rates versus placebo specifically in patients with PI3K-mutant colorectal cancer, supporting a precision oncology approach to adjuvant aspirin therapy.",
    "url": "https://www.gastroendonews.com/PRN/Article/05-26/Colorectal-Cancer-Aspirin-Low-Dose-Recurrence-Reduction/80557",
    "studyUrl": ""
  },
  {
    "type": "News",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Jun 2, 2026",
    "topic": "IBD",
    "title": "Ulcerative Proctitis May Not Raise Rectal Cancer Risk — Swedish Registry Study",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "A large Swedish registry study found that rectal cancer rates in ulcerative proctitis patients were comparable to the general population over more than a decade of follow-up, challenging the long-held assumption that all IBD subtypes confer elevated colorectal cancer risk.",
    "url": "https://news.gastro.org/issues/2026/june-2026/ulcerative-proctitis-may-not-raise-rectal-cancer-risk/",
    "studyUrl": "https://www.gastrojournal.org/article/S0016-5085(26)00082-X/fulltext"
  },
  {
    "type": "Opinion",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Jun 4, 2026",
    "topic": "MASH / MASLD",
    "title": "MASH Label Expansion Adds Few New Semaglutide Candidates",
    "authors": "",
    "source": "news.gastro.org",
    "summary": "A population-based analysis found that the new MASH indication for semaglutide adds relatively few net new candidates, since most patients with fibrotic liver disease already qualify through existing obesity- or diabetes-related indications. Commentary on real-world prescribing implications.",
    "url": "https://news.gastro.org/issues/2026/june-2026/mash-label-expansion-adds-few-new-semaglutide-candidates/",
    "studyUrl": "https://www.ghadvances.org/article/S2772-5723(26)00033-6/fulltext"
  }
];

export default weekly;
