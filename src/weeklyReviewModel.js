const STORAGE_KEY = "gihub_weekly_review_decisions_v1";

export function isWeeklyReviewPath(pathname) {
  return pathname === "/review/weekly" || pathname === "/review/weekly/";
}

export function weeklyReviewSourceFromLocation(locationHref) {
  try {
    const url = new URL(locationHref, "https://gi-hub.local");
    const pr = url.searchParams.get("pr") || "";
    return { pr, latest:!pr };
  } catch {
    return { pr:"", latest:true };
  }
}

export function weeklyReviewDataApiPath(source) {
  if (source?.pr) return `/api/weekly-review-data?pr=${encodeURIComponent(source.pr)}`;
  return "/api/weekly-review-data";
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

export const WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS = [
  "Create a weekly GI journal-style podcast review from these separate article PDFs.",
  "Treat every uploaded PDF as a separate source/article; do not merge them into one document.",
  "Start with a concise theme synthesis: identify common themes across the articles and where they disagree or cover distinct clinical areas.",
  "Then discuss each article separately with title/topic, clinical question, population or evidence type when available, key results, practical GI/hepatology relevance, and limitations.",
  "End with a fellow-facing take-home section: what might change practice now, what is hypothesis-generating, and what needs primary-source/human review.",
  "Tone should be technical but listenable for GI fellows/attendings. Avoid overstating causality or guideline-level implications unless the source supports it.",
].join(" ");

export function weeklyPodcastSourceUrl(item) {
  return String(item?.studyUrl || item?.url || "").trim();
}

export function buildWeeklyPodcastBrief(items, options = {}) {
  const approvedOnly = options.approvedOnly !== false;
  const decisions = options.decisions || {};
  const sourceItems = approvedOnly
    ? items.filter((item) => decisions[weeklyItemId(item)] === "Approve")
    : items;
  const articles = sourceItems
    .map((item) => ({
      title:String(item?.title || "").trim(),
      topic:String(item?.topic || "").trim(),
      type:String(item?.type || "").trim(),
      source:String(item?.source || "").trim(),
      url:weeklyPodcastSourceUrl(item),
      summary:String(item?.summary || "").trim(),
    }))
    .filter((item) => item.title && item.url);
  return {
    ready:articles.length > 0,
    articleCount:articles.length,
    articles,
    autocontent:{
      generate_audio:true,
      generate_quiz:false,
      duration:"default",
      style:"critique",
      audio_instructions:WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS,
    },
    notes:[
      "Hermes must retrieve the original article PDFs for these URLs before calling AutoContent.",
      "Send the original PDF files to AutoContent as separate files; do not send screenshots, summaries, or a combined surrogate PDF unless explicitly approved.",
      "After AutoContent returns the MP3, Hermes sends the podcast back to Ali as a native WhatsApp audio/file attachment.",
    ],
  };
}
