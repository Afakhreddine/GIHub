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
    reviewReason: "New this cycle. AGA published the joint AGA/AASLD guideline on October 22, and PubMed indexed the Gastroenterology guideline record on October 23 as a Practice Guideline. The live merged repository has no matching PMID, DOI, or title. Its generic AASLD Primary Biliary Cholangitis page represents older guidance, so this medication-focused 2026 joint guideline is a materially updated successor rather than a duplicate."
  }
];

export default guidelineReviewCandidates;
