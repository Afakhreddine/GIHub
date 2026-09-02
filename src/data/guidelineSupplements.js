// Append-only historical repair supplement for guideline repository/cache gaps.
// The live `gihub:guidelines:repo` cache remains authoritative; these records
// are merged into API responses only when not already present.

const GUIDELINE_SUPPLEMENTS = [
  {
    org: "ASGE",
    year: "2022",
    month: "Jan",
    topic: "General GI",
    urgency: "Moderate",
    title: "ASGE guideline on informed consent for GI endoscopic procedures",
    summary: "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2022; Volume 95, Issue 2; P207-215.E2",
    url: "https://doi.org/10.1016/j.gie.2021.10.022"
  },
  {
    org: "ASGE",
    year: "2020",
    month: "Jan",
    topic: "Endoscopy",
    urgency: "Routine",
    title: "ASGE guideline on minimum staffing requirements for the performance of GI endoscopy",
    summary: "ASGE publication listed in the Standards of Practice guideline library. Citation on the ASGE page: Gastrointest Endosc 2020; Volume 91, Issue 4; P723-729.E17",
    url: "https://doi.org/10.1016/j.gie.2019.12.002"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Jun",
    topic: "Nutrition/Obesity",
    urgency: "High",
    title: "Practice guide on obesity, weight management, education, and resources",
    summary: "AGA guidance addressing Practice guide on obesity, weight management, education, and resources. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/power-2-0-practice-guide-on-obesity-weight-management-education-and-resources/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Jun",
    topic: "Infectious GI",
    urgency: "High",
    title: "Management of Clostridioides difficile infection in adults",
    summary: "AGA guidance addressing Management of Clostridioides difficile infection in adults. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/management-of-clostridioides-difficile-infection-in-adults/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "May",
    topic: "IBD",
    urgency: "High",
    title: "Management of Clostridioides difficile infection in IBD",
    summary: "AGA guidance addressing Management of Clostridioides difficile infection in IBD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/management-of-clostridioides-difficile-infection-in-ibd/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Apr",
    topic: "Endoscopy",
    urgency: "High",
    title: "Use of electrosurgery in therapeutic endoscopy",
    summary: "AGA guidance addressing Use of electrosurgery in therapeutic endoscopy. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/use-of-electrosurgery-in-therapeutic-endoscopy/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Apr",
    topic: "Hepatology",
    urgency: "High",
    title: "Risk stratification and emerging surveillance strategies for HCC",
    summary: "AGA guidance addressing Risk stratification and emerging surveillance strategies for HCC. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/risk-stratification-and-emerging-surveillance-strategies-for-hcc/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Apr",
    topic: "Anorectal",
    urgency: "High",
    title: "Diagnosis and treatment of hemorrhoids",
    summary: "AGA guidance addressing Diagnosis and treatment of hemorrhoids. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/diagnosis-and-treatment-of-hemorrhoids/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Apr",
    topic: "Motility",
    urgency: "High",
    title: "Diagnosis and management of pediatric functional constipation",
    summary: "AGA guidance addressing Diagnosis and management of pediatric functional constipation. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/diagnosis-and-management-of-pediatric-functional-constipation/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Mar",
    topic: "General GI",
    urgency: "High",
    title: "Clinical care pathway for the risk stratification and management of patients with MASLD",
    summary: "AGA guidance addressing Clinical care pathway for the risk stratification and management of patients with MASLD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/clinical-care-pathway-for-the-risk-stratification-and-management-of-patients-with-masld/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Feb",
    topic: "Stomach",
    urgency: "High",
    title: "Management of gastric polyps",
    summary: "AGA guidance addressing Management of gastric polyps. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/management-of-gastric-polyps/"
  },
  {
    org: "AGA",
    year: "2026",
    month: "Jan",
    topic: "Endoscopy",
    urgency: "High",
    title: "Using advanced therapeutic endoscopy to treat patients with IBD",
    summary: "AGA guidance addressing Using advanced therapeutic endoscopy to treat patients with IBD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://gastro.org/clinical-guidance/using-advanced-therapeutic-endoscopy-to-treat-patients-with-ibd/"
  },
  {
    org: "ACG",
    year: "2025",
    month: "Sep",
    topic: "Cirrhosis Perioperative Risk",
    urgency: "High",
    title: "ACG Clinical Guideline: Perioperative Risk Assessment and Management in Patients With Cirrhosis",
    summary: "ACG guideline on perioperative risk assessment and management for patients with cirrhosis undergoing procedures or surgery.",
    url: "https://www.doi.org/10.14309/ajg.0000000000003616"
  },
  {
    org: "ACG",
    year: "2025",
    month: "Aug",
    topic: "IBD",
    urgency: "High",
    title: "Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease",
    summary: "ACG guidance addressing Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://www.doi.org/10.14309/ajg.0000000000003651"
  },
  {
    org: "ACG",
    year: "2025",
    month: "May",
    topic: "Liver Disease Nutrition",
    urgency: "High",
    title: "ACG Clinical Guideline: Malnutrition and Nutritional Recommendations in Liver Disease",
    summary: "ACG guideline addressing malnutrition assessment and nutritional management in patients with chronic liver disease and cirrhosis.",
    url: "https://doi.org/10.14309/ajg.0000000000003379"
  },
  {
    org: "ACG",
    year: "2025",
    month: "Mar",
    topic: "Diagnosis and Management of Gastric Premalignant Conditions",
    urgency: "High",
    title: "ACG Clinical Guideline: Diagnosis and Management of Gastric Premalignant Conditions",
    summary: "ACG guidance addressing Diagnosis and Management of Gastric Premalignant Conditions. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://journals.lww.com/ajg/abstract/9900/acg_clinical_guideline__diagnosis_and_management.1623.aspx"
  },
  {
    org: "ACG",
    year: "2024",
    month: "Jul",
    topic: "Focal Liver Lesions",
    urgency: "Moderate",
    title: "ACG Clinical Guideline: Focal Liver Lesions",
    summary: "ACG guideline on evaluation and management of focal liver lesions, including imaging-based diagnosis and lesion-specific management considerations.",
    url: "https://journals.lww.com/ajg/fulltext/2024/07000/acg_clinical_guideline__focal_liver_lesions.13.aspx?context=featuredarticles&collectionid=2"
  },
  {
    org: "ACG",
    year: "2023",
    month: "Mar",
    topic: "Diagnosis and Management of Biliary Strictures",
    urgency: "Moderate",
    title: "ACG Clinical Guideline: Diagnosis and Management of Biliary Strictures",
    summary: "ACG guidance addressing Diagnosis and Management of Biliary Strictures. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://journals.lww.com/ajg/Fulltext/2023/03000/ACG_Clinical_Guideline__Diagnosis_and_Management.14.aspx?context=FeaturedArticles&collectionId=5"
  },
  {
    org: "ACG",
    year: "2023",
    month: "Jan",
    topic: "Diagnosis and Management of Gastrointestinal Subepithelial Lesions",
    urgency: "Moderate",
    title: "ACG Clinical Guideline: Diagnosis and Management of Gastrointestinal Subepithelial Lesions",
    summary: "ACG guidance addressing Diagnosis and Management of Gastrointestinal Subepithelial Lesions. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://journals.lww.com/ajg/Fulltext/2023/01000/ACG_Clinical_Guideline__Diagnosis_and_Management.16.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    org: "ACG",
    year: "2021",
    month: "May",
    topic: "Drug-Induced Liver Injury",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Diagnosis and Management of Idiosyncratic Drug-Induced Liver Injury",
    summary: "ACG guideline on recognizing, evaluating, and managing idiosyncratic drug-induced liver injury.",
    url: "https://journals.lww.com/ajg/Fulltext/2021/05000/ACG_Clinical_Guideline__Diagnosis_and_Management.13.aspx?context=FeaturedArticles&collectionId=2"
  },
  {
    org: "ACG",
    year: "2020",
    month: "Sep",
    topic: "Achalasia",
    urgency: "Routine",
    title: "ACG Clinical Guidelines: Diagnosis and Management of Achalasia",
    summary: "Guideline addressing diagnosis and treatment of achalasia including manometry, pneumatic dilation, Heller myotomy, POEM, and botulinum toxin where appropriate.",
    url: "https://journals.lww.com/ajg/Fulltext/2020/09000/ACG_Clinical_Guidelines__Diagnosis_and_Management.18.aspx"
  },
  {
    org: "ACG",
    year: "2020",
    month: "Feb",
    topic: "Small Intestinal Bacterial Overgrowth",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Small Intestinal Bacterial Overgrowth",
    summary: "Recommendations for diagnosis and management of small intestinal bacterial overgrowth, including testing strategies and antibiotic treatment considerations.",
    url: "https://www.doi.org/10.14309/ajg.0000000000000501"
  },
  {
    org: "ACG",
    year: "2019",
    month: "Aug",
    topic: "Hereditary Hemochromatosis",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Hereditary Hemochromatosis",
    summary: "ACG guideline on diagnosis, genetic testing, iron assessment, and management of hereditary hemochromatosis.",
    url: "https://journals.lww.com/ajg/Fulltext/2019/08000/ACG_Clinical_Guideline__Hereditary_Hemochromatosis.11.aspx"
  },
  {
    org: "ACG",
    year: "2018",
    month: "Feb",
    topic: "Pancreatic Cysts",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Diagnosis and Management of Pancreatic Cysts",
    summary: "ACG guideline covering evaluation, risk stratification, surveillance, and management of pancreatic cystic lesions including IPMN and mucinous cystic neoplasms.",
    url: "https://journals.lww.com/ajg/Fulltext/2018/04000/ACG_Clinical_Guideline__Diagnosis_and_Management.8.aspx"
  },
  {
    org: "ACG",
    year: "2016",
    month: "Apr",
    topic: "Acute Diarrheal Infections",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Diagnosis, Treatment, and Prevention of Acute Diarrheal Infections in Adults",
    summary: "ACG guideline on evaluation, testing, treatment, and prevention strategies for acute diarrheal infections in adults.",
    url: "https://journals.lww.com/ajg/Fulltext/2016/05000/ACG_Clinical_Guideline__Diagnosis,_Treatment,_and.14.aspx"
  },
  {
    org: "ACG",
    year: "2016",
    month: "Mar",
    topic: "Nutrition Therapy in the Adult Hospitalized Patient",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Nutrition Therapy in the Adult Hospitalized Patient",
    summary: "ACG guidance addressing Nutrition Therapy in the Adult Hospitalized Patient. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://www.doi.org/10.1038/ajg.2016.28"
  },
  {
    org: "ACG",
    year: "2016",
    month: "Feb",
    topic: "Liver Disease and Pregnancy",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Liver Disease and Pregnancy",
    summary: "ACG guideline on evaluation and management of liver disease in pregnancy, including pregnancy-specific liver disorders and chronic liver disease considerations.",
    url: "https://journals.lww.com/ajg/Fulltext/2016/02000/ACG_Clinical_Guideline__Liver_Disease_and.15.aspx"
  },
  {
    org: "ACG",
    year: "2015",
    month: "Aug",
    topic: "Small Bowel Bleeding",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Diagnosis and Management of Small Bowel Bleeding",
    summary: "ACG guideline on diagnostic evaluation and management of suspected small bowel bleeding, including capsule endoscopy, deep enteroscopy, and imaging strategies.",
    url: "https://journals.lww.com/ajg/Fulltext/2015/09000/ACG_Clinical_Guideline__Diagnosis_and_Management.10.aspx"
  },
  {
    org: "ACG",
    year: "2015",
    month: "Apr",
    topic: "Primary Sclerosing Cholangitis",
    urgency: "Routine",
    title: "ACG Clinical Guideline: Primary Sclerosing Cholangitis",
    summary: "ACG guidance addressing Primary Sclerosing Cholangitis. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
    url: "https://journals.lww.com/ajg/Fulltext/2015/05000/ACG_Clinical_Guideline__Primary_Sclerosing.10.aspx"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "General GI",
    urgency: "High",
    title: "Wilson Disease, Diagnosis and Treatment",
    summary: "AASLD practice guideline/guidance topic page for Wilson Disease, Diagnosis and Treatment, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/diagnosis-and-treatment-wilson-disease"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Vascular Disorders of the Liver",
    summary: "AASLD practice guideline/guidance topic page for Vascular Disorders of the Liver, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/vascular-liver-disorders"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "General GI",
    urgency: "High",
    title: "TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration",
    summary: "AASLD practice guideline/guidance topic page for TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/transjugular-intrahepatic-portosystemic-shunt-tips"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Reproductive Health and Liver Disease",
    summary: "AASLD practice guideline/guidance topic page for Reproductive Health and Liver Disease, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/reproductive-health-and-liver-disease"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Pancreatobiliary",
    urgency: "High",
    title: "Primary Biliary Cholangitis",
    summary: "AASLD practice guideline/guidance topic page for Primary Biliary Cholangitis, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/primary-biliary-cholangitis"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Portal Hypertension Bleeding in Cirrhosis, Guidance",
    summary: "AASLD practice guideline/guidance topic page for Portal Hypertension Bleeding in Cirrhosis, Guidance, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/portal-hypertension-bleeding-cirrhosis"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Palliative Care and Symptom-Based Management for Decompensated Cirrhosis",
    summary: "AASLD practice guideline/guidance topic page for Palliative Care and Symptom-Based Management for Decompensated Cirrhosis, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/palliative-care-and-symptom-based-management-decompensated-cirrhosis-0"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Noninvasive Liver Disease Assessment",
    summary: "AASLD practice guideline/guidance topic page for Noninvasive Liver Disease Assessment, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/non-invasive-liver-disease-assessment"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Liver Biopsy",
    summary: "AASLD practice guideline/guidance topic page for Liver Biopsy, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/liver-biopsy"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Hepatocellular Carcinoma, Management",
    summary: "AASLD practice guideline/guidance topic page for Hepatocellular Carcinoma, Management, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/management-hepatocellular-carcinoma"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Hepatitis C, Guidance",
    summary: "AASLD practice guideline/guidance topic page for Hepatitis C, Guidance, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/hepatitis-c"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Hepatitis B, Chronic",
    summary: "AASLD practice guideline/guidance topic page for Hepatitis B, Chronic, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/hepatitis-b"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Hepatic Encephalopathy",
    summary: "AASLD practice guideline/guidance topic page for Hepatic Encephalopathy, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/hepatic-encephalopathy"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "General GI",
    urgency: "High",
    title: "Hemochromatosis, Management",
    summary: "AASLD practice guideline/guidance topic page for Hemochromatosis, Management, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/management-hemochromatosis"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Drug, Herbal, and Dietary Supplement-induced Liver Injury",
    summary: "AASLD practice guideline/guidance topic page for Drug, Herbal, and Dietary Supplement-induced Liver Injury, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/drug-herbal-and-dietary-supplement-induced-liver-injury"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Autoimmune Hepatitis, Management",
    summary: "AASLD practice guideline/guidance topic page for Autoimmune Hepatitis, Management, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/management-autoimmune-hepatitis"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "General GI",
    urgency: "High",
    title: "Ascites, Spontaneous Bacterial Peritonitis and Hepatorenal Syndrome, Management",
    summary: "AASLD practice guideline/guidance topic page for Ascites, Spontaneous Bacterial Peritonitis and Hepatorenal Syndrome, Management, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/diagnosis-evaluation-and-management-ascites-spontaneous-bacterial-peritonitis"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Alcohol-Associated Liver Disease",
    summary: "AASLD practice guideline/guidance topic page for Alcohol-Associated Liver Disease, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/alcohol-associated-liver-disease"
  },
  {
    org: "AASLD",
    year: "2025",
    month: "Jan",
    topic: "Hepatology",
    urgency: "High",
    title: "Acute Liver Failure, Management",
    summary: "AASLD practice guideline/guidance topic page for Acute Liver Failure, Management, included from the official AASLD practice-guidelines disease library.",
    url: "https://www.aasld.org/practice-guidelines/management-acute-liver-failure"
  }
];

export default GUIDELINE_SUPPLEMENTS;
