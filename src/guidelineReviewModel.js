const STORAGE_KEY = "gihub_guideline_review_decisions_v1";

export function isGuidelineReviewPath(pathname) {
  return pathname === "/review/guidelines" || pathname === "/review/guidelines/";
}

export function guidelineReviewSourceFromLocation(locationHref) {
  try {
    const url = new URL(locationHref, "https://gi-hub.local");
    const pr = url.searchParams.get("pr") || "";
    return { pr, latest:!pr };
  } catch {
    return { pr:"", latest:true };
  }
}

export function guidelineReviewDataApiPath(source) {
  if (source?.pr) return `/api/schedule-review-data?workflow=guidelines&pr=${encodeURIComponent(source.pr)}`;
  return "/api/schedule-review-data?workflow=guidelines";
}

export function guidelineItemId(item) {
  const pmid = String(item?.pmid || "").trim();
  if (pmid) return `pmid:${pmid}`;
  const doi = String(item?.doi || "").trim().toLowerCase();
  if (doi) return `doi:${doi}`;
  return `${item?.org || ""}|${item?.year || ""}|${item?.title || ""}`;
}

export function filterGuidelineItems(items, { query, org, decision, decisions }) {
  const needle = String(query || "").trim().toLowerCase();
  return (items || []).filter((item) => {
    const searchable = [item.title, item.summary, item.topic, item.org, item.source, item.url, item.pmid, item.doi].filter(Boolean).join(" ").toLowerCase();
    if (needle && !searchable.includes(needle)) return false;
    if (org !== "All" && item.org !== org) return false;
    return decision === "All" || decisions[guidelineItemId(item)] === decision;
  });
}

export function loadGuidelineDecisions(storage) {
  try {
    return JSON.parse(storage?.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function saveGuidelineDecisions(storage, decisions) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // Review remains usable without browser storage.
  }
}

export function guidelineReviewDecisionCounts(items, decisions) {
  const counts = { approved:0, held:0, rejected:0, reviewed:0, total:(items || []).length, unreviewed:0 };
  for (const item of items || []) {
    const decision = decisions[guidelineItemId(item)];
    if (decision === "Approve") counts.approved += 1;
    if (decision === "Hold") counts.held += 1;
    if (decision === "Reject") counts.rejected += 1;
    if (decision) counts.reviewed += 1;
  }
  counts.unreviewed = counts.total - counts.reviewed;
  return counts;
}

export function canPublishGuidelineReview(items, decisions) {
  if (!items?.length) return false;
  const counts = guidelineReviewDecisionCounts(items, decisions);
  return counts.approved > 0 && counts.reviewed === counts.total && counts.unreviewed === 0;
}

export function guidelineToSupplement(item) {
  return {
    org:String(item?.org || "").trim(),
    year:String(item?.year || "").trim(),
    month:String(item?.month || "").trim(),
    topic:String(item?.topic || "").trim(),
    urgency:String(item?.urgency || "Routine").trim(),
    title:String(item?.title || "").trim(),
    summary:String(item?.summary || "").trim(),
    url:String(item?.url || "").trim(),
  };
}

export function buildGuidelineApprovalSummary(items, decisions) {
  const counts = guidelineReviewDecisionCounts(items, decisions);
  const sections = [["Approve", "Approved"], ["Hold", "Hold"], ["Reject", "Rejected"]].map(([decision, label]) => {
    const matching = (items || []).filter((item) => decisions[guidelineItemId(item)] === decision);
    const lines = matching.length
      ? matching.map((item) => `- ${item.title} — ${item.org} ${item.month} ${item.year}\n  ${item.url || item.doi || item.pmid || "No source URL"}`)
      : ["- None"];
    return `*${label} (${matching.length})*\n${lines.join("\n")}`;
  });
  return [
    "Guideline approval summary",
    `${counts.reviewed}/${counts.total} reviewed · ${counts.unreviewed} unreviewed`,
    ...sections,
  ].join("\n\n");
}

export function buildGuidelinePublishPayload(items, decisions) {
  const counts = guidelineReviewDecisionCounts(items, decisions);
  const approvedItems = (items || []).filter((item) => decisions[guidelineItemId(item)] === "Approve");
  return {
    approved: canPublishGuidelineReview(items, decisions),
    counts,
    decisions,
    approvedItems,
    supplements: approvedItems.map(guidelineToSupplement),
    summary: buildGuidelineApprovalSummary(items, decisions),
  };
}
