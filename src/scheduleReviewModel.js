const STORAGE_KEY = "gihub_schedule_review_decisions_v1";

export function isScheduleReviewPath(pathname) {
  return pathname === "/review/schedule" || pathname === "/review/schedule/";
}

export function isReviewHomePath(pathname) {
  return pathname === "/review" || pathname === "/review/";
}

export function scheduleReviewSourceFromLocation(locationHref) {
  try {
    const url = new URL(locationHref, "https://gi-hub.local");
    const pr = url.searchParams.get("pr") || "";
    return { pr, latest:!pr };
  } catch {
    return { pr:"", latest:true };
  }
}

export function scheduleReviewDataApiPath(source) {
  if (source?.pr) return `/api/schedule-review-data?pr=${encodeURIComponent(source.pr)}`;
  return "/api/schedule-review-data";
}

export function scheduleReviewItemId(item) {
  return `${item.slug}|${item.kind}|${item.title}|${item.url || item.pmid || item.doi || ""}`;
}

export function flattenScheduleResources(resources = {}) {
  return Object.entries(resources || {}).flatMap(([slug, resource]) => {
    const topic = resource.topic || slug;
    const guidelineItems = (resource.guidelines || []).map((item, index) => ({
      ...item,
      slug,
      kind:"Guideline",
      topic:item.topic || topic,
      title:item.title || "Untitled guideline",
      summary:item.summary || item.oneLineSummary || "",
      source:item.org || item.source || "Guideline",
      date:[item.month, item.year].filter(Boolean).join(" "),
      reviewIndex:index,
    }));
    const newsItems = (resource.newsAndArticles || []).map((item, index) => ({
      ...item,
      slug,
      kind:"News and Articles",
      topic:item.topic || topic,
      title:item.title || item.headline || "Untitled article",
      summary:item.oneLineSummary || item.summary || "",
      source:item.source || item.sourceRepository || "Source",
      date:item.date || "",
      reviewIndex:index,
    }));
    return [...guidelineItems, ...newsItems];
  });
}

export function isNewScheduleSearchCard(item) {
  return item?.kind === "News and Articles" && item?.sourceRepository === "targeted-online-pull";
}

export function flattenScheduleReviewItems(resources = {}) {
  return flattenScheduleResources(resources).filter(isNewScheduleSearchCard);
}

export function filterScheduleReviewItems(items, { query, slug, kind, decision, decisions }) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    const searchable = [item.title, item.summary, item.topic, item.source, item.kind, item.slug, item.relevanceReason].filter(Boolean).join(" ").toLowerCase();
    if (needle && !searchable.includes(needle)) return false;
    if (slug !== "All" && item.slug !== slug) return false;
    if (kind !== "All" && item.kind !== kind) return false;
    return decision === "All" || decisions[scheduleReviewItemId(item)] === decision;
  });
}

export function loadScheduleDecisions(storage) {
  try {
    return JSON.parse(storage?.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function saveScheduleDecisions(storage, decisions) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // Keep sandbox usable when storage is unavailable.
  }
}

export function scheduleReviewDecisionCounts(items, decisions) {
  const counts = { approved:0, held:0, rejected:0, reviewed:0, total:items.length, unreviewed:0 };
  for (const item of items) {
    const decision = decisions[scheduleReviewItemId(item)];
    if (decision === "Approve") counts.approved += 1;
    if (decision === "Hold") counts.held += 1;
    if (decision === "Reject") counts.rejected += 1;
    if (decision) counts.reviewed += 1;
  }
  counts.unreviewed = counts.total - counts.reviewed;
  return counts;
}

export function canPublishScheduleReview(items, decisions) {
  if (!items.length) return false;
  const counts = scheduleReviewDecisionCounts(items, decisions);
  return counts.approved > 0 && counts.reviewed === counts.total && counts.unreviewed === 0;
}

export function buildScheduleApprovalSummary(items, decisions) {
  const groups = [["Approve", "Approved"], ["Hold", "Hold"], ["Reject", "Rejected"]];
  const counts = scheduleReviewDecisionCounts(items, decisions);
  const sections = groups.map(([decision, label]) => {
    const matching = items.filter((item) => decisions[scheduleReviewItemId(item)] === decision);
    const lines = matching.length
      ? matching.map((item) => `- [${item.slug}] ${item.kind}: ${item.title} — ${item.source}\n  ${item.url || (item.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/` : "No source URL")}`)
      : ["- None"];
    return `*${label} (${matching.length})*\n${lines.join("\n")}`;
  });
  return [
    "Schedule resource approval summary",
    `${counts.reviewed}/${items.length} reviewed · ${counts.unreviewed} unreviewed`,
    ...sections,
  ].join("\n\n");
}

export function buildSchedulePublishPayload(items, decisions) {
  const counts = scheduleReviewDecisionCounts(items, decisions);
  return {
    approved: canPublishScheduleReview(items, decisions),
    counts,
    decisions,
    approvedItems: items.filter((item) => decisions[scheduleReviewItemId(item)] === "Approve"),
    summary: buildScheduleApprovalSummary(items, decisions),
  };
}
