// Repo-managed guideline candidates awaiting explicit review before publication.
// The guideline updater should append verified, non-duplicate candidates here instead of
// leaving them only in cron prose. Approving/publishing appends them to guidelineSupplements.

const guidelineReviewCandidates = [
  {
    org: "AGA",
    year: "2026",
    month: "Sep",
    topic: "Pancreatobiliary",
    urgency: "High",
    title: "AGA Clinical Practice Update on Management of Ampullary Neoplasms: Expert Review",
    summary: "Provides 15 best-practice statements on evaluation, staging, endoscopic papillectomy, surgical referral, adverse-event prevention, and post-resection surveillance for ampullary neoplasms.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42720640/",
    pmid: "42720640",
    doi: "10.1016/j.cgh.2026.07.013",
    source: "PubMed; AGA-commissioned Clinical Practice Update",
    detectedAt: "2026-09-13",
    queuedAt: "2026-10-04",
    status: "candidate-review",
    reviewReason: "Carried forward from the September 13 check. PubMed classifies it as a Practice Guideline and the abstract explicitly verifies AGA commissioning and approval; absent from the live merged repository by PMID, DOI, normalized title, and scope."
  },
  {
    org: "AGA",
    year: "2026",
    month: "Sep",
    topic: "Hepatology",
    urgency: "High",
    title: "AGA Clinical Practice Update on the Evaluation and Management of Metabolic Dysfunction- and Alcohol-Associated Liver Disease: Expert Review",
    summary: "Provides best-practice advice for classifying MetALD, assessing alcohol use and fibrosis risk, counseling abstinence, managing cardiometabolic and nutritional risks, and treating alcohol use disorder.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42776095/",
    pmid: "42776095",
    doi: "10.1016/j.cgh.2026.07.027",
    source: "PubMed; AGA-commissioned Clinical Practice Update",
    detectedAt: "2026-09-27",
    queuedAt: "2026-10-04",
    status: "candidate-review",
    reviewReason: "Carried forward from the September 27 check. PubMed classifies it as a Practice Guideline and the abstract explicitly verifies AGA commissioning and approval; absent from the live merged repository by PMID, DOI, normalized title, and scope."
  },
  {
    org: "AGA",
    year: "2026",
    month: "Sep",
    topic: "Pancreatic Cysts / HCC Surveillance",
    urgency: "Moderate",
    title: "AGA Clinical Practice Update on Surveillance of Pancreatic Cystic Lesions and Hepatocellular Carcinoma in Older Adults: Expert Review",
    summary: "Provides patient-centered best-practice advice on when to continue or discontinue pancreatic cyst and hepatocellular carcinoma surveillance in older adults based on lesion stability, comorbidity, treatment candidacy, and life expectancy.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42820904/",
    pmid: "42820904",
    doi: "10.1016/j.cgh.2026.08.005",
    source: "PubMed; AGA-commissioned Clinical Practice Update",
    detectedAt: "2026-10-04",
    queuedAt: "2026-10-04",
    status: "candidate-review",
    reviewReason: "New this cycle. ArticleDate September 30 and PubMed/Entrez October 1; PubMed classifies it as a Practice Guideline and the abstract explicitly verifies AGA commissioning and approval. It is absent from the live merged repository by PMID, DOI, normalized title, and scope."
  },
  {
    org: "ACG",
    year: "2026",
    month: "Sep",
    topic: "Hereditary Cancer",
    urgency: "High",
    title: "Serrated Polyposis Syndrome: A Review and Consensus Statement by the US Multi-Society Task Force on Colorectal Cancer",
    summary: "Reviews diagnostic criteria, colorectal cancer risk, colon clearing and surveillance, indications for surgery, genetic evaluation, and screening of first-degree relatives in serrated polyposis syndrome.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42814045/",
    pmid: "42814045",
    doi: "10.1053/j.gastro.2026.09.001",
    source: "PubMed / ACG guideline library / AGA clinical guidance",
    detectedAt: "2026-10-04",
    queuedAt: "2026-10-04",
    status: "candidate-review",
    reviewReason: "New this cycle. The ACG guideline library and AGA clinical-guidance index both list this September 30 US Multi-Society Task Force statement, and PubMed classifies it as a Practice Guideline. It is absent from the live merged repository; ACG is used as the schema organization because ACG lists it in its guideline library."
  }
];

export default guidelineReviewCandidates;
