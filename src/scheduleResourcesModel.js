const MONTH_SCORE = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in", "into", "is", "of", "on", "or", "the", "to", "with",
  "gi", "gastroenterology", "conference", "lecture", "update", "management", "disease", "syndrome", "clinical", "guideline", "guidelines",
]);

const TOPIC_ALIASES = {
  ibs: ["irritable bowel syndrome", "hypnotherapy", "gut brain", "brain-gut", "digital therapeutic"],
  ibd: ["crohn", "crohn's", "ulcerative colitis", "uc", "cd", "inflammatory bowel"],
  "eosinophilic esophagitis": ["eoe", "dupilumab", "esophageal distensibility"],
  "barrett's esophagus": ["barrett", "dysplasia", "ablation", "endoscopic eradication"],
  "pancreatic cancer": ["pancreas", "pancreatic", "ras", "metastatic pancreatic"],
  "hepatitis b": ["hbv", "hbsag", "bepirovirsen", "functional cure"],
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function topicTerms(slug, topic) {
  const raw = [slug, topic].filter(Boolean).join(" ");
  const normalized = normalizeText(raw);
  const words = normalized.split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
  const aliases = TOPIC_ALIASES[normalizeText(topic)] || TOPIC_ALIASES[normalizeText(slug).replace(/ /g, "-")] || [];
  return Array.from(new Set([...words, ...aliases.map(normalizeText).filter(Boolean)]));
}

function scoreTextAgainstTopic(text, slug, topic) {
  const haystack = normalizeText(text);
  const terms = topicTerms(slug, topic);
  let score = 0;
  const matched = [];
  for (const term of terms) {
    if (!term) continue;
    if (haystack.includes(term)) {
      score += term.includes(" ") ? 4 : 2;
      matched.push(term);
    }
  }
  const topicNorm = normalizeText(topic);
  if (topicNorm && haystack.includes(topicNorm)) score += 6;
  return { score, matched: Array.from(new Set(matched)) };
}

function dateScore(item) {
  const year = Number.parseInt(item?.year || "0", 10) || 0;
  const month = MONTH_SCORE[String(item?.month || "").toLowerCase()] || 0;
  return year * 100 + month;
}

function identity(item) {
  const doi = String(item?.doi || item?.studyUrl || item?.url || "").match(/10\.\d{4,9}\/[\w.\-;()/:]+/i)?.[0]?.toLowerCase();
  if (doi) return `doi:${doi}`;
  const pmid = String(item?.pmid || item?.studyUrl || item?.url || "").match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i)?.[1] || String(item?.pmid || "").trim();
  if (pmid) return `pmid:${pmid}`;
  if (item?.url) return `url:${String(item.url).toLowerCase().replace(/[?#].*$/, "").replace(/\/$/, "")}`;
  return `title:${normalizeText(item?.title || item?.headline || "")}`;
}

export function selectMostRecentGuidelinePerSociety(topic, guidelines = []) {
  const bySociety = new Map();
  for (const guideline of guidelines) {
    const text = `${guideline.topic || ""} ${guideline.title || ""} ${guideline.summary || ""}`;
    const relevance = scoreTextAgainstTopic(text, "", topic);
    if (relevance.score < 2) continue;
    const org = guideline.org || guideline.society;
    if (!org) continue;
    const existing = bySociety.get(org);
    if (!existing || dateScore(guideline) > dateScore(existing)) bySociety.set(org, guideline);
  }
  return Array.from(bySociety.values()).sort((a, b) => String(a.org || "").localeCompare(String(b.org || "")));
}

function toNewsArticleRecord(card, sourceRepository, slug, topic, score) {
  const doi = card.doi || String(card.studyUrl || card.url || "").match(/10\.\d{4,9}\/[\w.\-;()/:]+/i)?.[0] || "";
  const pmid = card.pmid || String(card.studyUrl || card.url || "").match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i)?.[1] || "";
  return {
    section: "News and Articles",
    title: card.title || card.headline || "Untitled",
    oneLineSummary: card.oneLineSummary || String(card.summary || "").split(/(?<=[.!?])\s+/).find(Boolean) || "",
    doi,
    pmid,
    source: card.source || sourceRepository,
    sourceRepository,
    url: card.studyUrl || card.url || "",
    date: card.date || "",
    topic: card.topic || topic || "",
    type: card.type || "Article",
    relevanceScore: score,
    relevanceReason: `${card.topic || card.title || "Weekly item"} matches ${topic || slug}`,
  };
}

export function buildNewsAndArticles(slug, topic, currentWeekly = [], weeklyArchive = [], options = {}) {
  const minScore = options.minScore ?? 2;
  const candidates = [
    ...currentWeekly.map(card => ({ card, repo: "weekly" })),
    ...weeklyArchive.map(card => ({ card, repo: "weeklyArchive" })),
  ];
  const seen = new Set();
  return candidates
    .map(({ card, repo }) => {
      const text = `${card.topic || ""} ${card.title || card.headline || ""} ${card.summary || card.oneLineSummary || ""}`;
      const relevance = scoreTextAgainstTopic(text, slug, topic);
      return { card, repo, score: relevance.score };
    })
    .filter(item => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(item => toNewsArticleRecord(item.card, item.repo, slug, topic, item.score))
    .filter(item => {
      const key = identity(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, options.limit ?? 6);
}

export function findUpcomingScheduleTopics(schedule, today = new Date().toISOString().slice(0, 10), horizonDays = 90) {
  const start = new Date(`${today}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + horizonDays);
  return (schedule?.events || [])
    .filter(event => event?.slug && event?.topic && event?.date)
    .filter(event => {
      const date = new Date(`${event.date}T00:00:00Z`);
      return date >= start && date <= end;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function scheduleTopicScreener({ schedule, currentResources = {}, newWeeklyCards = [], today, horizonDays = 90, minScore = 6 }) {
  const upcoming = findUpcomingScheduleTopics(schedule, today, horizonDays);
  const matches = [];
  for (const event of upcoming) {
    for (const card of newWeeklyCards) {
      const text = `${card.topic || ""} ${card.title || card.headline || ""} ${card.summary || card.oneLineSummary || ""}`;
      const relevance = scoreTextAgainstTopic(text, event.slug, event.topic);
      if (relevance.score < minScore) continue;
      const existing = currentResources[event.slug]?.newsAndArticles || [];
      if (existing.some(item => identity(item) === identity(card))) continue;
      matches.push({
        slug: event.slug,
        topic: event.topic,
        eventDate: event.date,
        status: "candidate",
        relevanceScore: relevance.score,
        relevanceReason: `New Weekly Update card matches ${event.topic}${relevance.matched.length ? ` (${relevance.matched.slice(0, 3).join(", ")})` : ""}.`,
        card,
      });
    }
  }
  return { matches, upcomingCount: upcoming.length, screenedCount: newWeeklyCards.length };
}

export function mergeScheduleResourceCandidates(resources = {}, matches = []) {
  const next = structuredClone(resources || {});
  for (const match of matches) {
    const existing = next[match.slug] || { guidelines: [], newsAndArticles: [], quiz: [] };
    const items = existing.newsAndArticles || [];
    const record = {
      ...toNewsArticleRecord(match.card, "weekly", match.slug, match.topic, match.relevanceScore),
      status: match.status || "candidate",
      relevanceReason: match.relevanceReason || "Matched upcoming schedule topic.",
      addedBy: "weekly-cron-screener",
      addedAt: new Date().toISOString().slice(0, 10),
      eventDate: match.eventDate || "",
    };
    if (!items.some(item => identity(item) === identity(record))) items.push(record);
    next[match.slug] = { ...existing, newsAndArticles: items };
  }
  return next;
}

export function validateQuizItem(item) {
  return !!item?.question && Array.isArray(item.options) && item.options.length >= 4 && /^[A-D]$/.test(item.correct || "") && !!item.explanation;
}

export function validateScheduleResource(resource) {
  const errors = [];
  if (!Array.isArray(resource?.guidelines)) errors.push("guidelines must be an array");
  if (!Array.isArray(resource?.newsAndArticles)) errors.push("newsAndArticles must be an array");
  if (!Array.isArray(resource?.quiz) || resource.quiz.length === 0) errors.push("interactive quiz is required");
  if (Array.isArray(resource?.quiz) && resource.quiz.some(item => !validateQuizItem(item))) errors.push("quiz items must include question, four options, correct A-D, and explanation");
  return { valid: errors.length === 0, errors };
}

export function buildLectureResource({ slug, topic, guidelines = [], currentWeekly = [], weeklyArchive = [], existing = {} }) {
  return {
    guidelines: existing.guidelines?.length ? existing.guidelines : selectMostRecentGuidelinePerSociety(topic, guidelines),
    newsAndArticles: existing.newsAndArticles?.length ? existing.newsAndArticles : buildNewsAndArticles(slug, topic, currentWeekly, weeklyArchive),
    quiz: existing.quiz || [],
    quizSourcePdfs: existing.quizSourcePdfs || [],
    fetchedAt: existing.fetchedAt || null,
  };
}

export function buildScheduleResourcesFile(resources) {
  return `// Repo-managed Schedule tab resources.\n// Built by Hermes from guidelines, weekly updates, weeklyArchive, targeted pulls, and AutoContent quizzes.\n\nconst scheduleResources = ${JSON.stringify(resources, null, 2)};\n\nexport default scheduleResources;\n`;
}
