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
      `(A) EXCLUDE any story whose title contains "Highlights", "Roundup", "Recap", "Top Stories", "Best of", or "Coverage from" — these are conference/guideline summaries, not primary news. ` +
      `(B) Prioritize in this order: FDA approvals first, then RCT/trial results, then other news. Include exactly 1-2 opinion or how-to pieces from news.gastro.org. ` +
      `(C) If the same story (same trial, drug, or approval) appears in 2 or more sources, set multiSource:true. ` +
      `(D) STUDY LINK — for every item that covers a single research study, you MUST attempt all three steps to find a direct link to the study: ` +
      `Step 1: Fetch the article page and scan the body text for any hyperlink pointing to the study (journal URL, DOI link, PubMed link). ` +
      `Step 2: If not found in body, scroll to the bottom of the article and check the References or Citations section for a link to the study. ` +
      `Step 3: If still not found, search PubMed (https://pubmed.ncbi.nlm.nih.gov/?term={study+title+authors}) to find the PMID and construct https://pubmed.ncbi.nlm.nih.gov/{PMID}/. ` +
      `Set studyUrl to the best link found from any step. Leave studyUrl empty string only if all three steps fail. ` +
      `(E) Items of type "Guideline" are handled separately — include them so the system can cross-reference the guideline repository, but set org to the publishing society (ACG|AGA|ASGE|AASLD). ` +
      `(F) Return up to 12 items total (10 non-guideline + any detected guidelines). STRICT DATE RULE: every item confirmed between ${cutoff} and ${today}. ` +
      `Return ONLY a JSON array: ` +
      `{"type":"Research|FDA|Guideline|News|Opinion","org":"ACG|AGA|ASGE|AASLD|","multiSource":false,"date":"","topic":"","title":"","authors":"","source":"","summary":"2-3 sentences","url":"","studyUrl":""}`,
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
