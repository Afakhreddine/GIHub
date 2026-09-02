const STORAGE_KEY = "gihub_weekly_review_decisions_v1";

export function isWeeklyReviewPath(pathname) {
  return pathname === "/review/weekly" || pathname === "/review/weekly/";
}

export function weeklyReviewSourceFromLocation(locationHref) {
  try {
    const url = new URL(locationHref, "https://gi-hub.local");
    return { pr:url.searchParams.get("pr") || "" };
  } catch {
    return { pr:"" };
  }
}

export function weeklyItemId(item) {
  return `${item.date}|${item.title}`;
}

export function filterWeeklyItems(items, { query, type, decision, decisions }) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    const searchable = [item.title, item.summary, item.topic, item.source, item.type, item.authors].filter(Boolean).join(" ").toLowerCase();
    if (needle && !searchable.includes(needle)) return false;
    if (type !== "All" && item.type !== type) return false;
    return decision === "All" || decisions[weeklyItemId(item)] === decision;
  });
}

export function loadDecisions(storage) {
  try {
    return JSON.parse(storage?.getItem(STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

export function saveDecisions(storage, decisions) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // The sandbox remains usable when storage is unavailable.
  }
}

export function weeklyReviewDecisionCounts(items, decisions) {
  const counts = { approved:0, held:0, rejected:0, reviewed:0, total:items.length, unreviewed:0 };
  for (const item of items) {
    const decision = decisions[weeklyItemId(item)];
    if (decision === "Approve") counts.approved += 1;
    if (decision === "Hold") counts.held += 1;
    if (decision === "Reject") counts.rejected += 1;
    if (decision) counts.reviewed += 1;
  }
  counts.unreviewed = counts.total - counts.reviewed;
  return counts;
}

export function canPublishWeeklyReview(items, decisions) {
  if (!items.length) return false;
  const counts = weeklyReviewDecisionCounts(items, decisions);
  return counts.approved > 0 && counts.reviewed === counts.total && counts.unreviewed === 0;
}

export function buildApprovalSummary(items, decisions) {
  const groups = [["Approve", "Approved"], ["Hold", "Hold"], ["Reject", "Rejected"]];
  const counts = weeklyReviewDecisionCounts(items, decisions);
  const sections = groups.map(([decision, label]) => {
    const matching = items.filter((item) => decisions[weeklyItemId(item)] === decision);
    const lines = matching.length
      ? matching.map((item) => `- ${item.title} — ${item.source} (${item.date})\n  ${item.url || item.studyUrl || "No source URL"}`)
      : ["- None"];
    return `*${label} (${matching.length})*\n${lines.join("\n")}`;
  });
  return [
    "Weekly Update approval summary",
    `${counts.reviewed}/${items.length} reviewed · ${counts.unreviewed} unreviewed`,
    ...sections,
  ].join("\n\n");
}

export function buildPublishPayload(items, decisions) {
  const counts = weeklyReviewDecisionCounts(items, decisions);
  return {
    approved: canPublishWeeklyReview(items, decisions),
    counts,
    decisions,
    approvedItems: items.filter((item) => decisions[weeklyItemId(item)] === "Approve"),
    summary: buildApprovalSummary(items, decisions),
  };
}
