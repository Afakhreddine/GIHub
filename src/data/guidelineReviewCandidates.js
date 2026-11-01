// Repo-managed guideline candidates awaiting explicit review before publication.
// The guideline updater should append verified, non-duplicate candidates here instead of
// leaving them only in cron prose. Approving/publishing appends them to guidelineSupplements.

const guidelineReviewCandidates = [
  {
    org: "AGA",
    year: "2026",
    month: "Oct",
    topic: "Hepatology",
    urgency: "High",
    title: "AGA/AASLD Clinical Practice Guideline on Management of Primary Biliary Cholangitis",
    summary: "Provides six evidence-based recommendations covering antibody testing in AMA-negative suspected PBC, ursodeoxycholic acid first-line therapy, liver-stiffness prognostication, PPAR agonists after inadequate response or intolerance, linerixibat for moderate-to-severe pruritus, and post-transplant UDCA prophylaxis.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42914292/",
    pmid: "42914292",
    doi: "10.1053/j.gastro.2026.08.025",
    source: "PubMed / AGA clinical guidance / AASLD news",
    detectedAt: "2026-10-25",
    queuedAt: "2026-10-25",
    status: "candidate-review",
    reviewReason: "Carried forward from the October 25 review queue. AGA published the joint AGA/AASLD guideline on October 22, and PubMed indexed the Gastroenterology guideline record on October 23 as a Practice Guideline. The live merged repository has no matching PMID, DOI, or title. Its generic AASLD Primary Biliary Cholangitis page represents older guidance, so this medication-focused 2026 joint guideline is a materially updated successor rather than a duplicate."
  },
  {
    org: "AASLD",
    year: "2026",
    month: "Oct",
    topic: "Acute-on-Chronic Liver Failure",
    urgency: "High",
    title: "Acute-on-chronic liver failure: A global multisociety consensus on definitions",
    summary: "Establishes a unified evidence-based framework for ACLF definition, diagnosis, grading, and management, including patient stratification, organ-failure assessment, critical care, and liver-transplantation considerations.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42960623/",
    pmid: "42960623",
    doi: "10.1097/hep.0000000000001891",
    source: "PubMed / AASLD news / Hepatology",
    detectedAt: "2026-11-01",
    queuedAt: "2026-11-01",
    status: "candidate-review",
    reviewReason: "New this cycle. AASLD announced the five-society consensus on October 30, and the article was published online in Hepatology the same day. The live merged repository has no matching PMID, DOI, or normalized title. GIHub's 2024 AASLD ACLF practice guidance remains a distinct predecessor; this 2026 global harmonization provides a new unified definition and framework across AASLD, EASL, APASL, ALEH, and SOLDA rather than duplicating that guidance."
  }
];

export default guidelineReviewCandidates;
