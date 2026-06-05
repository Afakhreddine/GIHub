const PRIORITY_JOURNALS = "NEJM, JAMA, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, American Journal of Gastroenterology, Clinical Gastroenterology and Hepatology, Gastrointestinal Endoscopy, Hepatology, Neurogastroenterology and Motility, World Journal of Gastroenterology, Liver Transplantation, Clinical Liver Disease, Journal of Hepatology, JHEP Reports, and Alimentary Pharmacology & Therapeutics";

function dateWindow() {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 7);
  const fmt = d => d.toISOString().split("T")[0];
  return { today: fmt(today), cutoff: fmt(cutoff) };
}

export function buildPrompts() {
  const { today, cutoff } = dateWindow();
  return {
    weekly:
      `Today is ${today}. Search these three sources for GI and hepatology stories published between ${cutoff} and ${today}: ` +
      `(1) https://news.gastro.org/ — PRIMARY source, search thoroughly. ` +
      `(2) https://www.gastroendonews.com/ ` +
      `(3) https://www.healio.com/gastroenterology ` +
      `RULES: ` +
      `(A) Prioritize in this order: FDA approvals, randomized controlled trial results, society guideline publications — these must appear first. ` +
      `(B) Include exactly 1-2 opinion pieces or how-to/practice articles sourced from news.gastro.org. ` +
      `(C) If the same story (same trial, drug approval, or guideline) appears in 2 or more of the three sources, set multiSource:true and impactLevel to at least "High Impact". ` +
      `(D) For any item reporting on a research study: first check the article body for a direct hyperlink to the study (journal URL, DOI, or PubMed link) and use that as studyUrl. If no link is in the body, search PubMed to find the PMID and use https://pubmed.ncbi.nlm.nih.gov/{PMID}/. Leave studyUrl as empty string only if no study link can be found. ` +
      `(E) EXCLUDE any story whose title contains words like "Highlights", "Roundup", "Recap", "Top Stories", "Best of", or "Coverage from" — these are summaries, not primary news. ` +
      `(F) Return exactly 10 items total, sorted by impact (Practice-changing first, then High Impact, then Noteworthy). ` +
      `STRICT DATE RULE: Every item must have a confirmed publication date between ${cutoff} and ${today}. ` +
      `impactLevel taxonomy: ` +
      `"Practice-changing" = first-in-class FDA approval, landmark RCT in NEJM/Lancet/Gastroenterology, or major society guideline update. ` +
      `"High Impact" = multi-source story, phase 3 trial result, label expansion, or solid RCT. ` +
      `"Noteworthy" = registry analyses, policy news, society announcements, opinion/how-to pieces. ` +
      `Return ONLY a JSON array of exactly 10 items: ` +
      `{"type":"Research|FDA|Guideline|News|Opinion","impactLevel":"Practice-changing|High Impact|Noteworthy","multiSource":false,"date":"","topic":"","title":"","authors":"","source":"","summary":"2-3 sentences","url":"","studyUrl":""}`,
  };
}

export const PROMPTS = buildPrompts();

// ── REDIS HELPERS ─────────────────────────────────────────────────────────────
const rh = () => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });
const ru = p => `${process.env.UPSTASH_REDIS_REST_URL}${p}`;

export async function redisGet(key) {
  const res = await fetch(ru(`/get/${key}`), { headers: rh() });
  const json = await res.json();
  if (!json.result) return null;
  let val = json.result;
  for (let i = 0; i < 3; i++) {
    if (typeof val !== "string") break;
    try { val = JSON.parse(val); } catch { break; }
  }
  return val;
}

export async function redisSet(key, value) {
  const res = await fetch(ru(`/set/${key}`), {
    method: "POST",
    headers: { ...rh(), "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`Redis set failed for ${key}: ${await res.text()}`);
}

// ── CLAUDE FETCH ──────────────────────────────────────────────────────────────
export async function claudeFetch(prompt, apiKey, useWebSearch = true) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: "You are a GI medical curator. Search the web thoroughly and return ONLY a valid JSON array. No markdown, no backticks, no extra text.",
    messages: [{ role: "user", content: prompt }],
  };
  if (useWebSearch) {
    headers["anthropic-beta"] = "web-search-2025-03-05";
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers, body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array found: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

// ── DEDUP + SORT ──────────────────────────────────────────────────────────────
const MONTHS = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};

export function sortNewestFirst(arr) {
  return [...arr].sort((a, b) => {
    const aDate = parseInt(a.year||0)*100 + (MONTHS[a.month?.toLowerCase()]||0);
    const bDate = parseInt(b.year||0)*100 + (MONTHS[b.month?.toLowerCase()]||0);
    return bDate - aDate;
  });
}

export function dedup(arr) {
  const seen = new Set();
  return arr.filter(g => {
    const key = (g.title || g.headline || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
