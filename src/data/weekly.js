// Repo-managed GIHub weekly update data.
// Update with: node scripts/update-weekly-data.mjs <weekly.json>

const weekly = [
  {
    "type": "Research",
    "impactLevel": "Practice-changing",
    "multiSource": false,
    "date": "Oct 9, 2026",
    "topic": "Crohn's Disease",
    "title": "PROFILE follow-up links anti-TNF at diagnosis to fewer surgeries in Crohn disease",
    "authors": "Noor NM, Sharip MT, Zheng H, et al.",
    "source": "AGA GI & Hepatology News",
    "summary": "Five-year follow-up of the 386-patient PROFILE randomized trial found Crohn's-related surgery in 3% with infliximab plus an immunomodulator from diagnosis versus 13% with conventional step-up care (absolute risk reduction 10 percentage points; NNT 9; adjusted HR for step-up 5.23). Stricturing or penetrating progression was 7% versus 17%, and hospitalization was 11% versus 21%; however, follow-up after week 48 was retrospective, treatment reverted to local practice, and event counts were low. For appropriate patients with newly diagnosed moderate-to-severe Crohn's disease, the data strengthen the case for effective combination therapy at diagnosis rather than waiting for step-up failure.",
    "url": "https://news.gastro.org/issues/2026/october-2026/profile-followup-links-antitnf-at-diagnosis-to-fewer-crohns-surgeries/",
    "studyUrl": "https://doi.org/10.1016/S2468-1253(26)00192-5"
  },
  {
    "type": "Research",
    "impactLevel": "Practice-changing",
    "multiSource": false,
    "date": "Oct 8, 2026",
    "topic": "Gastric Cancer",
    "title": "Perioperative durvalumab improved survival in phase 3 gastric cancer trial",
    "authors": "Janjigian YY, Al-Batran SE, Wainberg ZA, et al.",
    "source": "AGA GI & Hepatology News",
    "summary": "In the 948-patient global phase 3 MATTERHORN trial, three-year overall survival was 69% with perioperative durvalumab plus FLOT versus 62% with placebo plus FLOT, corresponding to a 22% reduction in the risk of death during follow-up. Pathologic complete response was 19% versus 7%, grade 3-4 adverse events were 72% versus 71%, and immune-mediated events were 23% versus 7%; subgroup analyses were exploratory and the sponsor helped design and report the trial. The survival benefit supports perioperative durvalumab plus FLOT as a new option for fit patients with resectable gastric or gastroesophageal-junction adenocarcinoma.",
    "url": "https://news.gastro.org/issues/2026/october-2026/perioperative-durvalumab-improved-survival-in-phase-3-gastric-cancer-trial/",
    "studyUrl": "https://doi.org/10.1016/S0140-6736(26)01254-7"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Jan 9, 2026",
    "topic": "Endoscopic Resection",
    "title": "Resection Depth of Underwater Versus Conventional Endoscopic Mucosal Resection for Intermediate-Sized Colorectal Tumors",
    "authors": "Tamaru Y, Miyakawa A, Shimura H, et al.",
    "source": "American Journal of Gastroenterology",
    "summary": "In a four-center noninferiority randomized trial of 217 patients with 10–20 mm colorectal lesions, mean depth was 1,689 μm with underwater EMR versus 1,432 μm with conventional EMR (difference 257 μm; 95% CI −120 to 633). This supports comparable histologic depth without injection, but depth is a surrogate rather than recurrence or cancer outcomes. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.14309/ajg.0000000000003913",
    "studyUrl": "https://doi.org/10.14309/ajg.0000000000003913"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Nov 21, 2025",
    "topic": "Acute-on-Chronic Liver Failure",
    "title": "Empirical Antifungal Therapy Improves Survival in Patients With Acute-on-Chronic Liver Failure With Suspected Invasive Fungal Infections: A Pragmatic Randomized Trial",
    "authors": "Verma N, Valsan A, Garg P, et al.",
    "source": "American Journal of Gastroenterology",
    "summary": "In a 216-patient pragmatic randomized trial of hospitalized ACLF patients with predefined suspicion of invasive fungal infection, 28-day survival was 35% with immediate empirical antifungals versus 13% with investigation-driven preemptive therapy (reported HR 0.64; 95% CI 0.47–0.88). Consider early treatment alongside diagnostic and stewardship protocols in comparably high-risk settings; the single high-burden setting limits generalization to all ACLF patients. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.14309/ajg.0000000000003832",
    "studyUrl": "https://doi.org/10.14309/ajg.0000000000003832"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Dec 9, 2025",
    "topic": "Eosinophilic Esophagitis",
    "title": "An Eosinophilic Esophagitis Endoscopic Reference Score Threshold of 2 or Less Is Robust for Assessing Endoscopic Response to Treatment of Eosinophilic Esophagitis",
    "authors": "Reed CC, Aleman S, Weir AA, et al.",
    "source": "American Journal of Gastroenterology",
    "summary": "In a retrospective cohort of 333 topical-steroid-treated EoE patients, 219 met a post-treatment EREFS threshold of 2 or less; histologic response was 74% versus 23% above that threshold. EREFS ≤2 is a practical endoscopic response marker, not a substitute for biopsy or symptom assessment, and this single-cohort association needs external validation. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.14309/ajg.0000000000003876",
    "studyUrl": "https://doi.org/10.14309/ajg.0000000000003876"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Dec 16, 2025",
    "topic": "Hepatocellular Carcinoma",
    "title": "Association of Sodium-Glucose Cotransporter-2 Inhibitors With Reduced Hepatocellular Carcinoma Risk in Patients With Type 2 Diabetes",
    "authors": "Choi J, Nguyen VH, Przybyszewski E, et al.",
    "source": "American Journal of Gastroenterology",
    "summary": "In a two-center observational new-user cohort, 6,733 weighted SGLT2-inhibitor initiators had lower HCC risk than sulfonylurea initiators (subdistribution HR 0.44; 95% CI 0.25–0.79) or DPP-4-inhibitor initiators (0.53; 95% CI 0.30–0.93) over a median 3.9 years. Residual confounding precludes a chemoprevention claim; choose diabetes drugs by established indications rather than promising HCC protection. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.14309/ajg.0000000000003889",
    "studyUrl": "https://doi.org/10.14309/ajg.0000000000003889"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Early Colorectal Cancer",
    "title": "Long-Term Outcomes After Endoscopic Submucosal Dissection for T1 Colorectal Cancer: A Multicenter Prospective Study",
    "authors": "Hamada T, Kuwai T, Kamigaichi Y, et al.",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "In a Japanese multicenter prospective cohort of 383 T1 CRC patients after ESD, no recurrences occurred in 102 low-risk patients, versus 10 recurrences among 281 high-risk patients. Among high-risk patients, five-year local recurrence was 6.8% without versus 0% with additional surgery; nonrandomized surgery selection and few events leave distant-metastasis and survival benefit uncertain. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.02.027",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.02.027"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Irritable Bowel Syndrome",
    "title": "Disparities in Health Care Seeking and Physician Diagnosis of Irritable Bowel Syndrome: Results From a United States Survey",
    "authors": "Almario CV, Liu J, Higgins C, et al.",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "Among 5,414 US survey respondents meeting Rome IV IBS criteria, 71.6% sought care and just 32.9% of care-seekers reported a clinician IBS diagnosis; women sought care more often than men (73.3% vs 68.7%). The survey identifies access and diagnosis gaps but self-report and cross-sectional design cannot establish their causes; apply equitable diagnostic evaluation. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.03.008",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.03.008"
  },
  {
    "type": "Opinion",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Cannabinoid Hyperemesis",
    "title": "Management of Nausea and Vomiting in a Cannabis User",
    "authors": "Frazier RD, Hasler WL",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "This CGH clinical-practice article reviews cannabis-associated nausea and vomiting, emphasizing that cannabinoid hyperemesis is only one diagnosis and overlaps with cyclic vomiting syndrome and other causes. Take a nonjudgmental exposure history, assess alternative etiologies, and discuss cannabis cessation when hyperemesis is suspected; this is a practical review, not a new treatment trial. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.04.023",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.04.023"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Esophageal Adenocarcinoma",
    "title": "Clinical Outcomes After Endoscopic Management of Low-Risk and High-Risk T1b Esophageal Adenocarcinoma: A Patient-Level Pooled Analysis of International Studies",
    "authors": "Kamboj AK, Dilmaghani S, Goyal R, et al.",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "A pooled patient-level analysis of seven studies (216 patients) after endoscopic resection found extraluminal metastases in 2% of low-risk versus 11% of high-risk T1b esophageal adenocarcinoma (median follow-up 48 months). Endoscopic eradication may suit carefully selected low-risk disease, but high-risk pathology requires multidisciplinary counseling; the pooled cohort is small and not randomized. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.05.030",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.05.030"
  },
  {
    "type": "Research",
    "impactLevel": "Noteworthy",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Diverticulitis",
    "title": "Natural Language Processing Algorithm Accurately Classifies Diverticulitis-Related Complications and Predicts Long-Term Outcomes",
    "authors": "Ma W, Wu Y, Challa PK, et al.",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "A CT-report NLP model classified diverticulitis features with positive and negative predictive values of 82.8%–99.9%; among 16,349 detected cases, severe recurrence risk rose with severe complications (adjusted HR 3.02) or chronic complications (5.41) versus uncomplicated disease. This is useful for cohort ascertainment and risk research, not a prospectively validated bedside decision rule; external validation is needed. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.03.009",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.03.009"
  },
  {
    "type": "Research",
    "impactLevel": "High Impact",
    "multiSource": false,
    "date": "Oct 2026",
    "topic": "Colonoscopy Surveillance",
    "title": "Association Between Index Adenomas and Advanced Findings at Third Colonoscopy: Data From the New Hampshire Colonoscopy Registry",
    "authors": "Javidi DJ, Dairi O, MacKenzie TA, et al.",
    "source": "Clinical Gastroenterology and Hepatology",
    "summary": "Among 3,171 registry patients with a polyp-free first surveillance exam, those with an advanced adenoma or at least five adenomas at index had higher advanced-finding risk at second surveillance than those without index adenomas (adjusted rate ratio 2.12; 95% CI 1.06–4.25). Index findings remain informative after a negative surveillance exam, but observational data do not independently set a new colonoscopy interval. AI-assisted summary; human review required before publication.",
    "url": "https://doi.org/10.1016/j.cgh.2026.03.018",
    "studyUrl": "https://doi.org/10.1016/j.cgh.2026.03.018"
  }
];

export default weekly;
