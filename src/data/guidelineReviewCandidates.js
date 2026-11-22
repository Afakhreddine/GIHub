// Repo-managed guideline candidates awaiting explicit review before publication.
// The guideline updater should append verified, non-duplicate candidates here instead of
// leaving them only in cron prose. Approving/publishing appends them to guidelineSupplements.

const guidelineReviewCandidates = [
  {
    org: "AGA",
    year: "2026",
    month: "Nov",
    topic: "Liver Diagnostics",
    urgency: "Moderate",
    title: "AGA Clinical Practice Update on the Role of Liver Biopsy: Commentary",
    summary: "Reviews evidence and best practices for liver biopsy in liver diseases, abnormal liver tests, and liver masses, including the role of noninvasive testing and biopsy approaches. The AGA Institute commissioned and approved this Clinical Practice Update for timely clinical guidance.",
    url: "https://pubmed.ncbi.nlm.nih.gov/43062379/",
    pmid: "43062379",
    doi: "10.1016/j.cgh.2026.09.015",
    source: "PubMed / Clinical Gastroenterology and Hepatology",
    detectedAt: "2026-11-20",
    queuedAt: "2026-11-22",
    status: "candidate-review",
    reviewReason: "New this cycle. PubMed indexed this AGA Clinical Practice Update on November 20 after online publication on November 19. The abstract verifies that it was commissioned and approved by the AGA Institute CPU Committee and AGA Governing Board, and PubMed classifies it as a Practice Guideline. The 441-record live merged repository has no matching PMID, DOI, normalized title, or AGA liver-biopsy update. Its distinct AGA scope is not a duplicate of the older generic AASLD Liver Biopsy topic record. The previously queued AASLD hepatitis delta EXPO was approved and published in PR #110, so it was removed from the active review queue."
  }
];

export default guidelineReviewCandidates;
