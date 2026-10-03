// Repo-managed guideline candidates awaiting explicit review before publication.
// The guideline updater should append verified, non-duplicate candidates here instead of
// leaving them only in cron prose. Approving/publishing appends them to guidelineSupplements.

const guidelineReviewCandidates = [
  {
    org: "ACG",
    year: "2026",
    month: "Sep",
    topic: "Hereditary Cancer",
    urgency: "High",
    title: "ACG Clinical Guideline: Diagnosis and Management of Adenomatous Colorectal Polyposis Syndromes",
    summary: "Provides updated recommendations for identifying hereditary adenomatous colorectal polyposis syndromes, selecting and timing germline genetic testing, and reducing colorectal and extracolonic cancer risk through endoscopic, surgical, and chemopreventive strategies.",
    url: "https://pubmed.ncbi.nlm.nih.gov/42683623/",
    pmid: "42683623",
    doi: "10.14309/ajg.0000000000004105",
    source: "PubMed / ACG guideline library",
    detectedAt: "2026-09-06",
    queuedAt: "2026-10-03",
    status: "candidate-review",
    reviewReason: "Verified ACG Practice Guideline; not a duplicate of the 2014 hereditary GI cancer guideline or ASGE FAP guidance. Needs explicit approval before publication."
  }
];

export default guidelineReviewCandidates;
