// Repo-managed guideline candidates awaiting explicit review before publication.
// The guideline updater should append verified, non-duplicate candidates here instead of
// leaving them only in cron prose. Approving/publishing appends them to guidelineSupplements.

const guidelineReviewCandidates = [
  {
    org: "AASLD",
    year: "2026",
    month: "Nov",
    topic: "Viral Hepatitis",
    urgency: "High",
    title: "AASLD EXPO: Diagnosis and management of hepatitis delta virus (HDV) infection",
    summary: "Recommends one-time HDV antibody screening for all HBsAg-positive individuals, confirmatory HDV RNA testing, fibrosis assessment and six-month HCC surveillance for chronic HDV, and consideration of bulevirtide-based therapy for adults with compensated disease.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42992835/",
    pmid: "42992835",
    doi: "10.1097/HEP.0000000000001909",
    source: "PubMed / AASLD news / Hepatology",
    detectedAt: "2026-11-08",
    queuedAt: "2026-11-08",
    status: "candidate-review",
    reviewReason: "New this cycle. AASLD announced its second Expert-Based Practice Opinion on November 6, and PubMed indexed it the same day. The abstract verifies that the AASLD Practice Guidelines Committee commissioned the document and that it contains clinical screening, surveillance, and treatment statements. The 440-record live merged repository has no matching PMID, DOI, normalized title, or hepatitis delta guideline, so this is not a duplicate. The previously queued PBC guideline is already published, and the ACLF consensus was explicitly rejected in PR #81, so neither remains in the active review queue."
  }
];

export default guidelineReviewCandidates;
