const PRIORITY_JOURNALS = "NEJM, JAMA, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, American Journal of Gastroenterology, Clinical Gastroenterology and Hepatology, Gastrointestinal Endoscopy, Hepatology, Neurogastroenterology and Motility, World Journal of Gastroenterology, Liver Transplantation, Clinical Liver Disease, Journal of Hepatology, JHEP Reports, and Alimentary Pharmacology & Therapeutics";

export const PROMPTS = {
  articles: `Search for high-impact gastroenterology and hepatology research articles published in the past 4 weeks. First search only these priority journals: ${PRIORITY_JOURNALS}. If fewer than 10 results are found, expand to other peer-reviewed GI and hepatology journals. For all results, assess impact by cross-referencing mentions in: news.gastro.org, Healio Gastroenterology (healio.com/gastroenterology), and Doximity trending articles in gastroenterology. Prioritize articles mentioned across multiple sources. Among equal articles, prioritize RCTs and phase 3 trials first, then large prospective or multicenter studies, then registry analyses. Sort newest first. Return ONLY a JSON array of up to 10 items: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"1-2 sentences","url":""}`,

  news: `Search for recent GI and hepatology news from the past 2 weeks. Include only: FDA approvals and safety alerts; drug development milestones (phase 2/3 trial results, PDUFA dates, NDA submissions, accelerated approvals, label expansions); health policy and reimbursement changes (CMS, Medicare, Medicaid); society and conference news (AGA, ACG, ASGE, AASLD, DDW). Exclude all primary research articles and study summaries. Confirm publication date for each item. Return ONLY a JSON array of up to 10 items sorted newest first: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
};

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
    model: "claude-sonnet-4-20250514",
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
