const STORAGE_KEY = "gihub_weekly_review_decisions_v1";

export function isWeeklyReviewPath(pathname) {
  return pathname === "/review/weekly" || pathname === "/review/weekly/";
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

export function buildApprovalSummary(items, decisions) {
  const groups = [["Approve", "Approved"], ["Hold", "Hold"], ["Reject", "Rejected"]];
  const reviewed = items.filter((item) => decisions[weeklyItemId(item)]);
  const sections = groups.map(([decision, label]) => {
    const matching = items.filter((item) => decisions[weeklyItemId(item)] === decision);
    const lines = matching.length
      ? matching.map((item) => `- ${item.title} — ${item.source} (${item.date})\n  ${item.url || item.studyUrl || "No source URL"}`)
      : ["- None"];
    return `*${label} (${matching.length})*\n${lines.join("\n")}`;
  });
  return [
    "Weekly Update approval summary",
    `${reviewed.length}/${items.length} reviewed · ${items.length - reviewed.length} unreviewed`,
    ...sections,
  ].join("\n\n");
}
