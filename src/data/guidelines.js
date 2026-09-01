// Repo-managed GIHub guidelines data.
// Update with: node scripts/update-guidelines-data.mjs <guidelines.json>

const guidelines = [
  {
    "org": "ACG",
    "year": "2026",
    "month": "Jul",
    "topic": "Colon",
    "urgency": "High",
    "title": "Colonic Diverticulitis - Guideline",
    "summary": "ACG guidance addressing Colonic Diverticulitis. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000004047"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Jun",
    "topic": "Infectious GI",
    "urgency": "High",
    "title": "Management of Clostridioides difficile infection in adults",
    "summary": "AGA guidance addressing Management of Clostridioides difficile infection in adults. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/management-of-clostridioides-difficile-infection-in-adults/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Jun",
    "topic": "Nutrition/Obesity",
    "urgency": "High",
    "title": "Practice guide on obesity, weight management, education, and resources",
    "summary": "AGA guidance addressing Practice guide on obesity, weight management, education, and resources. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/power-2-0-practice-guide-on-obesity-weight-management-education-and-resources/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "May",
    "topic": "IBD",
    "urgency": "High",
    "title": "Management of Clostridioides difficile infection in IBD",
    "summary": "AGA guidance addressing Management of Clostridioides difficile infection in IBD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/management-of-clostridioides-difficile-infection-in-ibd/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Apr",
    "topic": "Motility",
    "urgency": "High",
    "title": "Diagnosis and management of pediatric functional constipation",
    "summary": "AGA guidance addressing Diagnosis and management of pediatric functional constipation. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/diagnosis-and-management-of-pediatric-functional-constipation/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Apr",
    "topic": "Anorectal",
    "urgency": "High",
    "title": "Diagnosis and treatment of hemorrhoids",
    "summary": "AGA guidance addressing Diagnosis and treatment of hemorrhoids. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/diagnosis-and-treatment-of-hemorrhoids/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Apr",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Risk stratification and emerging surveillance strategies for HCC",
    "summary": "AGA guidance addressing Risk stratification and emerging surveillance strategies for HCC. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/risk-stratification-and-emerging-surveillance-strategies-for-hcc/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Apr",
    "topic": "Endoscopy",
    "urgency": "High",
    "title": "Use of electrosurgery in therapeutic endoscopy",
    "summary": "AGA guidance addressing Use of electrosurgery in therapeutic endoscopy. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/use-of-electrosurgery-in-therapeutic-endoscopy/"
  },
  {
    "org": "ACG",
    "year": "2026",
    "month": "Mar",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Liver: Hepatic Encephalopathy- Guideline",
    "summary": "ACG guidance addressing Liver: Hepatic Encephalopathy. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000003899"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Mar",
    "topic": "General GI",
    "urgency": "High",
    "title": "Clinical care pathway for the risk stratification and management of patients with MASLD",
    "summary": "AGA guidance addressing Clinical care pathway for the risk stratification and management of patients with MASLD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/clinical-care-pathway-for-the-risk-stratification-and-management-of-patients-with-masld/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Feb",
    "topic": "Stomach",
    "urgency": "High",
    "title": "Management of gastric polyps",
    "summary": "AGA guidance addressing Management of gastric polyps. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/management-of-gastric-polyps/"
  },
  {
    "org": "AGA",
    "year": "2026",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "High",
    "title": "Using advanced therapeutic endoscopy to treat patients with IBD",
    "summary": "AGA guidance addressing Using advanced therapeutic endoscopy to treat patients with IBD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://gastro.org/clinical-guidance/using-advanced-therapeutic-endoscopy-to-treat-patients-with-ibd/"
  },
  {
    "org": "ASGE",
    "year": "2026",
    "month": "Jan",
    "topic": "Colon",
    "urgency": "High",
    "title": "ASGE guideline on endoscopic management of benign and malignant colonic strictures",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2026; Volume 104, Issue 2; P164-181",
    "url": "https://www.giejournal.org/article/S0016-5107(26)00210-5/fulltext"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Sep",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Liver: Perioperative Risk Assessment and Management in Patients With Cirrhosis - Guideline",
    "summary": "ACG guidance addressing Liver: Perioperative Risk Assessment and Management in Patients With Cirrhosis. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000003616"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Aug",
    "topic": "IBD",
    "urgency": "High",
    "title": "Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease",
    "summary": "ACG guidance addressing Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000003651"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Jul",
    "topic": "IBD",
    "urgency": "High",
    "title": "Inflammatory Bowel Disease Preventive Care - Guideline",
    "summary": "ACG guidance addressing Inflammatory Bowel Disease Preventive Care. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/fulltext/2025/07000/acg_clinical_guideline_update__preventive_care_in.15.aspx?context=featuredarticles&collectionid=5"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Jun",
    "topic": "IBD",
    "urgency": "High",
    "title": "Crohn’s Disease in Adults - Guideline",
    "summary": "ACG guidance addressing Crohn’s Disease in Adults. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/fulltext/2025/06000/acg_clinical_guideline__management_of_crohn_s.14.aspx?context=featuredarticles&collectionid=2"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Jun",
    "topic": "IBD",
    "urgency": "High",
    "title": "Ulcerative Colitis in Adults- Guideline",
    "summary": "ACG guidance addressing Ulcerative Colitis in Adults. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000003463"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "May",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Liver: Malnutrition and Nutritional Recommendations in Liver Disease- Guideline",
    "summary": "ACG guidance addressing Liver: Malnutrition and Nutritional Recommendations in Liver Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://doi.org/10.14309/ajg.0000000000003379"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Mar",
    "topic": "Stomach",
    "urgency": "High",
    "title": "Diagnosis and Management of Gastric Premalignant Conditions - Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Gastric Premalignant Conditions. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/abstract/9900/acg_clinical_guideline__diagnosis_and_management.1623.aspx"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Acute Liver Failure, Management",
    "summary": "AASLD practice guideline/guidance topic page for Acute Liver Failure, Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/management-acute-liver-failure"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Acute-on-Chronic Liver Failure and the Management",
    "summary": "AASLD practice guideline/guidance topic page for Acute-on-Chronic Liver Failure and the Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/acute-chronic-liver-failure-and-management"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Alcohol-Associated Liver Disease",
    "summary": "AASLD practice guideline/guidance topic page for Alcohol-Associated Liver Disease, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/alcohol-associated-liver-disease"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "High",
    "title": "Ascites, Spontaneous Bacterial Peritonitis and Hepatorenal Syndrome, Management",
    "summary": "AASLD practice guideline/guidance topic page for Ascites, Spontaneous Bacterial Peritonitis and Hepatorenal Syndrome, Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/diagnosis-evaluation-and-management-ascites-spontaneous-bacterial-peritonitis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Autoimmune Hepatitis, Management",
    "summary": "AASLD practice guideline/guidance topic page for Autoimmune Hepatitis, Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/management-autoimmune-hepatitis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Drug, Herbal, and Dietary Supplement-induced Liver Injury",
    "summary": "AASLD practice guideline/guidance topic page for Drug, Herbal, and Dietary Supplement-induced Liver Injury, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/drug-herbal-and-dietary-supplement-induced-liver-injury"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "High",
    "title": "Hemochromatosis, Management",
    "summary": "AASLD practice guideline/guidance topic page for Hemochromatosis, Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/management-hemochromatosis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Hepatic Encephalopathy",
    "summary": "AASLD practice guideline/guidance topic page for Hepatic Encephalopathy, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/hepatic-encephalopathy"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Hepatitis B, Chronic",
    "summary": "AASLD practice guideline/guidance topic page for Hepatitis B, Chronic, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/hepatitis-b"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Hepatitis C, Guidance",
    "summary": "AASLD practice guideline/guidance topic page for Hepatitis C, Guidance, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/hepatitis-c"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Hepatocellular Carcinoma, Management",
    "summary": "AASLD practice guideline/guidance topic page for Hepatocellular Carcinoma, Management, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/management-hepatocellular-carcinoma"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Liver Biopsy",
    "summary": "AASLD practice guideline/guidance topic page for Liver Biopsy, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/liver-biopsy"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Malnutrition, Frailty, and Sarcopenia in Patients with Cirrhosis",
    "summary": "AASLD practice guideline/guidance topic page for Malnutrition, Frailty, and Sarcopenia in Patients with Cirrhosis, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/malnutrition-frailty-and-sarcopenia-patient-cirrhosis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Noninvasive Liver Disease Assessment",
    "summary": "AASLD practice guideline/guidance topic page for Noninvasive Liver Disease Assessment, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/non-invasive-liver-disease-assessment"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Palliative Care and Symptom-Based Management for Decompensated Cirrhosis",
    "summary": "AASLD practice guideline/guidance topic page for Palliative Care and Symptom-Based Management for Decompensated Cirrhosis, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/palliative-care-and-symptom-based-management-decompensated-cirrhosis-0"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Portal Hypertension Bleeding in Cirrhosis, Guidance",
    "summary": "AASLD practice guideline/guidance topic page for Portal Hypertension Bleeding in Cirrhosis, Guidance, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/portal-hypertension-bleeding-cirrhosis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "High",
    "title": "Primary Biliary Cholangitis",
    "summary": "AASLD practice guideline/guidance topic page for Primary Biliary Cholangitis, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/primary-biliary-cholangitis"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "High",
    "title": "Primary Sclerosing Cholangitis and Cholangiocarcinoma",
    "summary": "AASLD practice guideline/guidance topic page for Primary Sclerosing Cholangitis and Cholangiocarcinoma, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/primary-sclerosing-cholangitis-and-cholangiocarcinoma"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Reproductive Health and Liver Disease",
    "summary": "AASLD practice guideline/guidance topic page for Reproductive Health and Liver Disease, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/reproductive-health-and-liver-disease"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "High",
    "title": "TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration",
    "summary": "AASLD practice guideline/guidance topic page for TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/transjugular-intrahepatic-portosystemic-shunt-tips"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "High",
    "title": "Vascular Disorders of the Liver",
    "summary": "AASLD practice guideline/guidance topic page for Vascular Disorders of the Liver, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/vascular-liver-disorders"
  },
  {
    "org": "AASLD",
    "year": "2025",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "High",
    "title": "Wilson Disease, Diagnosis and Treatment",
    "summary": "AASLD practice guideline/guidance topic page for Wilson Disease, Diagnosis and Treatment, included from the official AASLD practice-guidelines disease library.",
    "url": "https://www.aasld.org/practice-guidelines/diagnosis-and-treatment-wilson-disease"
  },
  {
    "org": "ACG",
    "year": "2025",
    "month": "Jan",
    "topic": "Esophagus",
    "urgency": "High",
    "title": "Diagnosis and Management of Eosinophilic Esophagitis (EoE) - Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Eosinophilic Esophagitis (EoE). Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://doi.org/10.14309/ajg.0000000000003194"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "High",
    "title": "American Society for Gastrointestinal Endoscopy guideline on gastrostomy feeding tubes: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: VideoGIE 2025; Volume 10, Issue 1; P1-23 DOI: 10.1016/j.vgie.2024.09.014",
    "url": "https://www.videogie.org/article/S2468-4481(24)00154-1/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "High",
    "title": "American Society for Gastrointestinal Endoscopy guideline on gastrostomy feeding tubes: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2025; Volume 101, Issue 1; P25-35 DOI: 10.1016/j.gie.2024.05.016",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03505-3/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Esophagus",
    "urgency": "High",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the diagnosis and management of GERD: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: VideoGIE 2025; Volume 10, Issue2; P81-137 DOI: 10.1016/j.vgie.2024.10.001",
    "url": "https://www.videogie.org/article/S2468-4481(24)00171-1/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Esophagus",
    "urgency": "High",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the diagnosis and management of GERD: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2025; Volume 101, Issue 2; P267-284 DOI: 10.1016/j.gie.2024.10.008",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03559-4/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "High",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the role of endoscopy in the management of chronic pancreatitis: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2025; Volume 101, Issue 1: E1-53 DOI: 10.1016/j.gie.2024.05.017",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03250-4/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2025",
    "month": "Jan",
    "topic": "Colon",
    "urgency": "High",
    "title": "Optimizing bowel preparation quality for colonoscopy: consensus recommendations by the US Multi-Society Task Force on Colorectal Cancer",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2025; Volume 101, Issue 4; P702-732 DOI: 10.1016/j.gie.2025.02.010",
    "url": "https://www.giejournal.org/article/S0016-5107(25)00080-X/fulltext"
  },
  {
    "org": "ACG",
    "year": "2024",
    "month": "Sep",
    "topic": "Stomach",
    "urgency": "Moderate",
    "title": "Helicobacter pylori Infection - Guideline",
    "summary": "ACG guidance addressing Helicobacter pylori Infection. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/fulltext/2024/09000/acg_clinical_guideline__treatment_of_helicobacter.13.aspx?context=featuredarticles&collectionid=5"
  },
  {
    "org": "ACG",
    "year": "2024",
    "month": "Jul",
    "topic": "Hepatology",
    "urgency": "Moderate",
    "title": "Liver: Focal Liver Lesions - Guideline",
    "summary": "ACG guidance addressing Liver: Focal Liver Lesions. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/fulltext/2024/07000/acg_clinical_guideline__focal_liver_lesions.13.aspx?context=featuredarticles&collectionid=2"
  },
  {
    "org": "ACG",
    "year": "2024",
    "month": "Mar",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "Pancreatitis: Acute - Guideline",
    "summary": "ACG guidance addressing Pancreatitis: Acute. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000002645"
  },
  {
    "org": "ACG",
    "year": "2024",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "Moderate",
    "title": "Liver: Alcohol-Associated Liver Disease- Guideline",
    "summary": "ACG guidance addressing Liver: Alcohol-Associated Liver Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000002572"
  },
  {
    "org": "ASGE",
    "year": "2024",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "American Society for Gastrointestinal Endoscopy guideline on role of endoscopy in the diagnosis and management of solid pancreatic masses: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2024; Volume 100, Issue 5; E1-E78 DOI: 10.1016/j.gie.2024.06.003",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03256-5/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2024",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the role of endoscopy in the diagnosis and management of solid pancreatic masses: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2024; Volume 100, Issue 5; P786-796 DOI: 10.1016/j.gie.2024.06.002",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03255-3/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2024",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the role of endoscopy in the management of chronic pancreatitis: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2024; Volume 100, Issue 4; P584-594 DOI: 10.1016/j.gie.2024.05.016",
    "url": "https://www.giejournal.org/article/S0016-5107(24)03249-8/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2024",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "American Society for Gastrointestinal Endoscopy guideline on the role of therapeutic EUS in the management of biliary tract disorders: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2024; Volume 100, Issue 6; P967-979 DOI: 10.1016/j.gie.2024.03.027",
    "url": "https://www.giejournal.org/article/S0016-5107(24)00188-3/fulltext"
  },
  {
    "org": "ASGE",
    "year": "2024",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "ASGE Guideline on The Role of Therapeutic Endoscopic Ultrasound in the Management of Biliary Tract Disorders: Methodology and Review of Evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2024; Volume 100, Issue 6: E79-135 DOI: 10.1016/j.gie.2024.03.026",
    "url": "https://www.giejournal.org/article/S0016-5107(24)00187-1/fulltext"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Jun",
    "topic": "Motility",
    "urgency": "Moderate",
    "title": "American College of Gastroenterology-American Gastroenterological Association Clinical Practice Guideline: Pharmacological Management of Chronic Idiopathic Constipation - Guideline",
    "summary": "ACG guidance addressing American College of Gastroenterology-American Gastroenterological Association Clinical Practice Guideline: Pharmacological Management of Chronic Idiopathic Constipation. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000002227"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Jun",
    "topic": "Hepatology",
    "urgency": "Moderate",
    "title": "Liver: Acute Liver Failure- Guideline",
    "summary": "ACG guidance addressing Liver: Acute Liver Failure. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000002340"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Mar",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "Diagnosis and Management of Biliary Strictures- Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Biliary Strictures. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2023/03000/ACG_Clinical_Guideline__Diagnosis_and_Management.14.aspx?context=FeaturedArticles&collectionId=5"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Feb",
    "topic": "General GI",
    "urgency": "Moderate",
    "title": "Management of Patients With Acute Lower Gastrointestinal Bleeding -Guideline",
    "summary": "ACG guidance addressing Management of Patients With Acute Lower Gastrointestinal Bleeding -Guideline. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2023/02000/Management_of_Patients_With_Acute_Lower.14.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Jan",
    "topic": "Small Bowel",
    "urgency": "Moderate",
    "title": "Diagnosis and Management of Celiac Disease- Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Celiac Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000002075"
  },
  {
    "org": "ACG",
    "year": "2023",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "Moderate",
    "title": "Diagnosis and Management of Gastrointestinal Subepithelial Lesions- Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Gastrointestinal Subepithelial Lesions. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2023/01000/ACG_Clinical_Guideline__Diagnosis_and_Management.16.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Stomach",
    "urgency": "Moderate",
    "title": "ASGE guideline on endoscopic submucosal dissection for the management of early esophageal and gastric cancers: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 3; P285-305.E38",
    "url": "https://doi.org/10.1016/j.gie.2023.03.030"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Stomach",
    "urgency": "Moderate",
    "title": "ASGE guideline on endoscopic submucosal dissection for the management of early esophageal and gastric cancers: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 3; P271-284",
    "url": "https://doi.org/10.1016/j.gie.2023.03.015"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "ASGE guideline on management of post–liver transplant biliary strictures: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 97, Issue 4; P615637.E11",
    "url": "https://doi.org/10.1016/j.gie.2022.10.006"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "ASGE guideline on management of post–liver transplant biliary strictures: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 97, Issue 4; P607-614",
    "url": "https://doi.org/10.1016/j.gie.2022.10.007"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Advanced Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on post-ERCP pancreatitis prevention strategies: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 97, Issue 2; P163-183.E40",
    "url": "https://doi.org/10.1016/j.gie.2022.09.011"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Advanced Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on post-ERCP pancreatitis prevention strategies: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 97, Issue 2; P153-162",
    "url": "https://doi.org/10.1016/j.gie.2022.10.005"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on the role of endoscopy in the diagnosis of malignancy in biliary strictures of undetermined etiology: methodology and review of evidencesw",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 5; P694-712.E8",
    "url": "https://doi.org/10.1016/j.gie.2022.10.006"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on the role of endoscopy in the diagnosis of malignancy in biliary strictures of undetermined etiology: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 5; P685-693",
    "url": "https://doi.org/10.1016/j.gie.2023.06.005"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on the role of ergonomics for prevention of endoscopy-related injury: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 4; P492-512.E1",
    "url": "https://doi.org/10.1016/j.gie.2023.05.055"
  },
  {
    "org": "ASGE",
    "year": "2023",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Moderate",
    "title": "ASGE guideline on the role of ergonomics for prevention of endoscopy-related injury: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2023; Volume 98, Issue 4; P482-491",
    "url": "https://doi.org/10.1016/j.gie.2023.05.056"
  },
  {
    "org": "ACG",
    "year": "2022",
    "month": "Aug",
    "topic": "Motility",
    "urgency": "Moderate",
    "title": "Gastroparesis - Guideline",
    "summary": "ACG guidance addressing Gastroparesis. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2022/08000/ACG_Clinical_Guideline__Gastroparesis.15.aspx"
  },
  {
    "org": "ACG",
    "year": "2022",
    "month": "Mar",
    "topic": "General GI",
    "urgency": "Moderate",
    "title": "American College of Gastroenterology-Canadian Association of Gastroenterology Clinical Practice Guideline: Management of Anticoagulants and Antiplatelets During Acute Gastrointestinal Bleeding and the Periendoscopic Period - Guideline",
    "summary": "ACG guidance addressing American College of Gastroenterology-Canadian Association of Gastroenterology Clinical Practice Guideline: Management of Anticoagulants and Antiplatelets During Acute Gastrointestinal Bleeding and the Periendoscopic Period. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000001627"
  },
  {
    "org": "ACG",
    "year": "2022",
    "month": "Mar",
    "topic": "Esophagus",
    "urgency": "Moderate",
    "title": "Diagnosis and Management of Barrett's Esophagus - Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Barrett's Esophagus. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://doi.org/10.14309/ajg.0000000000001680"
  },
  {
    "org": "ACG",
    "year": "2022",
    "month": "Feb",
    "topic": "Hepatology",
    "urgency": "Moderate",
    "title": "Acute-on-Chronic Liver Failure -Guidelines",
    "summary": "ACG guidance addressing Acute-on-Chronic Liver Failure -Guidelines. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000001595"
  },
  {
    "org": "ASGE",
    "year": "2022",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "Moderate",
    "title": "ASGE guideline on informed consent for GI endoscopic procedures",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2022; Volume 95, Issue 2; P207-215.E2",
    "url": "https://doi.org/10.1016/j.gie.2021.10.022"
  },
  {
    "org": "ASGE",
    "year": "2022",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "ASGE guideline on screening for pancreatic cancer in individuals with genetic susceptibility: methodology and review of evidence",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2022; Volume 95, Issue 5; P827-854.E3",
    "url": "https://doi.org/10.1016/j.gie.2021.12.002"
  },
  {
    "org": "ASGE",
    "year": "2022",
    "month": "Jan",
    "topic": "Pancreatobiliary",
    "urgency": "Moderate",
    "title": "ASGE guideline on screening for pancreatic cancer in individuals with genetic susceptibility: summary and recommendations",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2022; Volume 95, Issue 5; P817-826",
    "url": "https://doi.org/10.1016/j.gie.2021.12.001"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "Nov",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Diagnosis and Management of Gastroesophageal Reflux Disease - Guideline",
    "summary": "ACG guidance addressing Diagnosis and Management of Gastroesophageal Reflux Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/9900/ACG_Clinical_Guideline_for_the_Diagnosis_and.154.aspx"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "Oct",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Management of Benign Anorectal Disorders - Guideline",
    "summary": "ACG guidance addressing Management of Benign Anorectal Disorders. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000001507"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "May",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Bleeding: Upper Gastrointestinal & Ulcer - Guideline",
    "summary": "ACG guidance addressing Bleeding: Upper Gastrointestinal & Ulcer. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2021/05000/ACG_Clinical_Guideline__Upper_Gastrointestinal_and.14.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "May",
    "topic": "Hepatology",
    "urgency": "Routine",
    "title": "Liver: Idiosyncratic Drug-Induced Liver Injury - Guideline",
    "summary": "ACG guidance addressing Liver: Idiosyncratic Drug-Induced Liver Injury. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2021/05000/ACG_Clinical_Guideline__Diagnosis_and_Management.13.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "May",
    "topic": "Infectious GI",
    "urgency": "Routine",
    "title": "Prevention, Diagnosis, and Treatment of Clostridioides difficile Infections - Guideline",
    "summary": "ACG guidance addressing Prevention, Diagnosis, and Treatment of Clostridioides difficile Infections. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000001278"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "Mar",
    "topic": "Colon",
    "urgency": "Routine",
    "title": "Colorectal Cancer Screening - Guideline",
    "summary": "ACG guidance addressing Colorectal Cancer Screening. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2021/03000/ACG_Clinical_Guidelines__Colorectal_Cancer.14.aspx"
  },
  {
    "org": "ACG",
    "year": "2021",
    "month": "Jan",
    "topic": "Functional GI",
    "urgency": "Routine",
    "title": "Irritable Bowel Syndrome (IBS) Therapy - Guideline",
    "summary": "ACG guidance addressing Irritable Bowel Syndrome (IBS) Therapy. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2021/01000/ACG_Clinical_Guideline__Management_of_Irritable.11.aspx"
  },
  {
    "org": "ASGE",
    "year": "2021",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "ASGE guideline on the management of cholangitis",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2021; Volume 94, Issue 2; P207-221.E14",
    "url": "https://doi.org/10.1016/j.gie.2020.12.032"
  },
  {
    "org": "ASGE",
    "year": "2021",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy in the management of benign and malignant gastroduodenal obstruction",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2021; Volume 93, Issue 2; P309-322.E4",
    "url": "https://doi.org/10.1016/j.gie.2020.07.063"
  },
  {
    "org": "ASGE",
    "year": "2021",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy in the management of malignant hilar obstruction",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2021; Volume 94, Issue 2; P222-234.E22",
    "url": "https://doi.org/10.1016/j.gie.2020.12.035"
  },
  {
    "org": "ACG",
    "year": "2020",
    "month": "Sep",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Achalasia - Guideline",
    "summary": "ACG guidance addressing Achalasia. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2020/09000/ACG_Clinical_Guidelines__Diagnosis_and_Management.18.aspx"
  },
  {
    "org": "ACG",
    "year": "2020",
    "month": "Sep",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Esophageal Physiologic Testing - Guideline",
    "summary": "ACG guidance addressing Esophageal Physiologic Testing. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2020/09000/ACG_Clinical_Guidelines__Clinical_Use_of.19.aspx"
  },
  {
    "org": "ACG",
    "year": "2020",
    "month": "Mar",
    "topic": "Pancreatobiliary",
    "urgency": "Routine",
    "title": "Pancreatitis: Chronic - Guideline",
    "summary": "ACG guidance addressing Pancreatitis: Chronic. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2020/03000/ACG_Clinical_Guideline__Chronic_Pancreatitis.9.aspx?context=FeaturedArticles&collectionId=5"
  },
  {
    "org": "ACG",
    "year": "2020",
    "month": "Feb",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "SIBO - Guideline",
    "summary": "ACG guidance addressing SIBO. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.14309/ajg.0000000000000501"
  },
  {
    "org": "ACG",
    "year": "2020",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "Routine",
    "title": "Liver: Hepatic and Mesenteric Circulation - Guideline",
    "summary": "ACG guidance addressing Liver: Hepatic and Mesenteric Circulation. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2020/01000/ACG_Clinical_Guideline__Disorders_of_the_Hepatic.9.aspx"
  },
  {
    "org": "ASGE",
    "year": "2020",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on minimum staffing requirements for the performance of GI endoscopy",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2020; Volume 91, Issue 4; P723-729.E17",
    "url": "https://doi.org/10.1016/j.gie.2019.12.002"
  },
  {
    "org": "ASGE",
    "year": "2020",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "ASGE guideline on the management of achalasia",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2020; Volume 91, Issue 2; P213-227.E6",
    "url": "https://doi.org/10.1016/j.gie.2019.04.231"
  },
  {
    "org": "ASGE",
    "year": "2020",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy in familial adenomatous polyposis syndromes",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2020; Volume 91, Issue 5; P963-982.E2",
    "url": "https://doi.org/10.1016/j.gie.2020.01.028"
  },
  {
    "org": "ASGE",
    "year": "2020",
    "month": "Jan",
    "topic": "Colon",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy in the management of acute colonic pseudo-obstruction and colonic volvulus",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2020; Volume 91, Issue 2; P228-235",
    "url": "https://doi.org/10.1016/j.gie.2019.09.007"
  },
  {
    "org": "ACG",
    "year": "2019",
    "month": "Aug",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Hemochromatosis: Hereditary - Guideline",
    "summary": "ACG guidance addressing Hemochromatosis: Hereditary. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2019/08000/ACG_Clinical_Guideline__Hereditary_Hemochromatosis.11.aspx"
  },
  {
    "org": "ASGE",
    "year": "2019",
    "month": "Jan",
    "topic": "Esophagus",
    "urgency": "Routine",
    "title": "ASGE guideline on screening and surveillance of Barrett’s esophagus",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2019; Volume 90, Issue 3; P335-359.E2",
    "url": "https://doi.org/10.1016/j.gie.2019.05.012"
  },
  {
    "org": "ASGE",
    "year": "2019",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy for bleeding from chronic radiation proctopathy",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2019; Volume 90, Issue 2; P171-182.E1",
    "url": "https://doi.org/10.1016/j.gie.2019.04.234"
  },
  {
    "org": "ASGE",
    "year": "2019",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline on the role of endoscopy in the evaluation and management of choledocholithiasis",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2019; Volume 89, Issue 6; P1075-1105.E15",
    "url": "https://doi.org/10.1016/j.gie.2018.10.001"
  },
  {
    "org": "ACG",
    "year": "2018",
    "month": "Feb",
    "topic": "Pancreatobiliary",
    "urgency": "Routine",
    "title": "Pancreatic Cysts - Guideline",
    "summary": "ACG guidance addressing Pancreatic Cysts. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2018/04000/ACG_Clinical_Guideline__Diagnosis_and_Management.8.aspx"
  },
  {
    "org": "ASGE",
    "year": "2018",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "ASGE guideline for infection control during GI endoscopy",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2018; Volume 87, Issue 5; P1167-1179",
    "url": "https://doi.org/10.1016/j.gie.2017.12.009"
  },
  {
    "org": "ASGE",
    "year": "2018",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "Guidelines for sedation and anesthesia in GI endoscopy",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2018; Volume 87, Issue 2; P327-337",
    "url": "http://dx.doi.org/10.1016/j.gie.2017.07.018"
  },
  {
    "org": "ACG",
    "year": "2017",
    "month": "Jun",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Dyspepsia - Guideline",
    "summary": "ACG guidance addressing Dyspepsia. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/fulltext/2017/07000/ACG_and_CAG_Clinical_Guideline__Management_of.10.aspx"
  },
  {
    "org": "ACG",
    "year": "2017",
    "month": "Jan",
    "topic": "Hepatology",
    "urgency": "Routine",
    "title": "Liver: Abnormal Liver Chemistries - Guideline",
    "summary": "ACG guidance addressing Liver: Abnormal Liver Chemistries. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2017/01000/ACG_Clinical_Guideline__Evaluation_of_Abnormal.13.aspx"
  },
  {
    "org": "ASGE",
    "year": "2017",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "Guidelines for privileging, credentialing, and proctoring to perform GI endoscopy",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2017; Volume 85, Issue 2; P273–281",
    "url": "http://dx.doi.org/10.1016/j.gie.2016.10.036"
  },
  {
    "org": "ASGE",
    "year": "2017",
    "month": "Jan",
    "topic": "Endoscopy",
    "urgency": "Routine",
    "title": "Quality indicators for gastrointestinal endoscopy units",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: VideoGIE 2017; Volume 2, Issue 6; P119-140",
    "url": "https://doi.org/10.1016/j.vgie.2017.02.007"
  },
  {
    "org": "ACG",
    "year": "2016",
    "month": "Apr",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Diarrheal Infections: Acute - Guideline",
    "summary": "ACG guidance addressing Diarrheal Infections: Acute. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2016/05000/ACG_Clinical_Guideline__Diagnosis,_Treatment,_and.14.aspx"
  },
  {
    "org": "ACG",
    "year": "2016",
    "month": "Mar",
    "topic": "Nutrition/Obesity",
    "urgency": "Routine",
    "title": "Nutrition Therapy in the Adult Hospitalized Patient - Guideline",
    "summary": "ACG guidance addressing Nutrition Therapy in the Adult Hospitalized Patient. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.1038/ajg.2016.28"
  },
  {
    "org": "ACG",
    "year": "2016",
    "month": "Feb",
    "topic": "Hepatology",
    "urgency": "Routine",
    "title": "Liver: Liver Disease and Pregnancy - Guideline",
    "summary": "ACG guidance addressing Liver: Liver Disease and Pregnancy. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2016/02000/ACG_Clinical_Guideline__Liver_Disease_and.15.aspx"
  },
  {
    "org": "ACG",
    "year": "2015",
    "month": "Aug",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Bleeding: Small Bowel - Guideline",
    "summary": "ACG guidance addressing Bleeding: Small Bowel. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2015/09000/ACG_Clinical_Guideline__Diagnosis_and_Management.10.aspx"
  },
  {
    "org": "ACG",
    "year": "2015",
    "month": "Apr",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Primary Sclerosing Cholangitis - Guideline",
    "summary": "ACG guidance addressing Primary Sclerosing Cholangitis. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2015/05000/ACG_Clinical_Guideline__Primary_Sclerosing.10.aspx"
  },
  {
    "org": "ACG",
    "year": "2015",
    "month": "Feb",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "Hereditary Gastrointestinal Cancer Syndromes - Guideline",
    "summary": "ACG guidance addressing Hereditary Gastrointestinal Cancer Syndromes. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://www.doi.org/10.1038/ajg.2014.435"
  },
  {
    "org": "ACG",
    "year": "2015",
    "month": "Jan",
    "topic": "Colon",
    "urgency": "Routine",
    "title": "Colon Ischemia (CI) - Guideline",
    "summary": "ACG guidance addressing Colon Ischemia (CI). Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    "url": "https://journals.lww.com/ajg/Fulltext/2015/01000/ACG_Clinical_Guideline__Epidemiology,_Risk.8.aspx"
  },
  {
    "org": "ASGE",
    "year": "2015",
    "month": "Jan",
    "topic": "General GI",
    "urgency": "Routine",
    "title": "ASGE Position Statement: endoscopic bariatric therapies in clinical practice",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2015; Volume 82, Issue 5; P767–772",
    "url": "http://dx.doi.org/10.1016/j.gie.2015.06.038"
  },
  {
    "org": "ASGE",
    "year": "2012",
    "month": "Jan",
    "topic": "Colon",
    "urgency": "Routine",
    "title": "Guidelines for colonoscopy surveillance after screening and polypectomy: A Consensus Update by the US Multi-Society Task Force on Colorectal Cancer",
    "summary": "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastroenterology 2012; Volume 143, Issue 3; P844-857",
    "url": "http://dx.doi.org/10.1053/j.gastro.2012.06.001"
  }
];

export default guidelines;
