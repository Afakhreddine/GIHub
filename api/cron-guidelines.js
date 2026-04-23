// One society per call — no timeouts possible
// Usage:
//   ?society=ASGE   — fetch ASGE guidelines and add to repo
//   ?society=AASLD  — fetch AASLD guidelines and add to repo
//   ?society=AGA    — fetch AGA guidelines and add to repo
//   ?society=ACG    — fetch ACG guidelines and add to repo
//   ?reset=true     — clear the repo
//   (no params)     — weekly update: checks new/updated for all 4 societies one at a time

const REPO_KEY = "gihub:guidelines:repo";

const JSON_SCHEMA = `{"org":"ACG|AGA|ASGE|AASLD","year":"YYYY","month":"full month name","topic":"short topic","urgency":"High|Moderate|Routine","title":"full title","summary":"1-2 sentences","url":"direct link"}`;

const INIT_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and extract ALL clinical practice guidelines and quality indicator documents listed, including both "Guidelines" and "Quality in Endoscopy" sections, published from 2000 to present. For each document confirm the publication year. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/practice-guidelines and extract ALL clinical practice guidelines listed by disease topic, published from 2000 to present. Confirm publication year for each. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AGA:   `Search https://www.guidelinecentral.com/guidelines/aga/ and list ALL AGA clinical practice guidelines published from 2000 to present. Cross-check against https://gastro.org/clinical-guidance. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  ACG:   `Search https://www.guidelinecentral.com/guidelines/acg/ and list ALL ACG clinical practice guidelines published from 2000 to present. Cross-check against https://gi.org/guidelines. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
};

const UPDATE_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and identify any documents listed under "Newly Published" or published in the past 7 days. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/news and identify any new or updated AASLD practice guidelines in the past 7 days. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AGA:   `Check https://gastro.org/clinical-guidance and https://www.guidelinecentral.com/guidelines/aga/ for new AGA guidelines in the past 7 days. Return ONLY a JSON array ([] if none). Each item: ${JSON_SCHEMA}`,
  ACG:   `Check https://gi.org/guidelines and https://www.guidelinecentral.com/guidelines/acg/ for new ACG guidelines in the past 7 days. Return ONLY a JSON array ([] if none). Each item: ${JSON_SCHEMA}`,
};

// ── REDIS ─────────────────────────────────────────────────────────────────────
const rh = () => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });
const ru = p => `${process.env.UPSTASH_REDIS_REST_URL}${p}`;

async function redisGet(key) {
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

async function redisSet(key, value) {
  const res = await fetch(ru(`/set/${key}`), {
    method: "POST",
    headers: { ...rh(), "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`Redis set failed: ${await res.text()}`);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const MONTHS = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};

function sortNewestFirst(arr) {
  return [...arr].sort((a, b) => {
    const aD = parseInt(a.year||0)*100 + (MONTHS[a.month?.toLowerCase()]||0);
    const bD = parseInt(b.year||0)*100 + (MONTHS[b.month?.toLowerCase()]||0);
    return bD - aD;
  });
}

function dedup(arr) {
  const seen = new Set();
  return arr.filter(g => {
    const key = g.title?.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function claudeFetch(prompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-search-2025-03-05",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: "You are a GI medical guideline curator. Fetch and search the web thoroughly. Return ONLY a valid JSON array. No markdown, no backticks, no extra text.",
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // ?reset=true — clear the repo
  if (req.query?.reset === "true") {
    await redisSet(REPO_KEY, []);
    return res.status(200).json({ ok: true, action: "reset", message: "Repository cleared. Now fetch each society: ?society=ASGE, ?society=AASLD, ?society=AGA, ?society=ACG" });
  }

  // ?society=X — fetch one specific society
  const society = req.query?.society?.toUpperCase();
  if (society) {
    if (!INIT_PROMPTS[society]) {
      return res.status(400).json({ error: `Unknown society. Use: ASGE, AASLD, AGA, or ACG` });
    }
    try {
      console.log(`Fetching ${society}...`);
      const fetched = await claudeFetch(INIT_PROMPTS[society], apiKey);
      const existing = (await redisGet(REPO_KEY)) || [];
      const merged = sortNewestFirst(dedup([...existing, ...fetched]));
      await redisSet(REPO_KEY, merged);
      console.log(`✓ ${society}: ${fetched.length} items. Repo total: ${merged.length}`);
      return res.status(200).json({ ok: true, society, fetched: fetched.length, repoTotal: merged.length });
    } catch (e) {
      console.error(`✗ ${society}:`, e.message);
      return res.status(500).json({ ok: false, society, error: e.message });
    }
  }

  // Default: weekly update — checks all 4 for new guidelines
  const existing = (await redisGet(REPO_KEY)) || [];
  const results = {};
  const errors = {};
  let newCount = 0;

  for (const [soc, prompt] of Object.entries(UPDATE_PROMPTS)) {
    try {
      const fetched = await claudeFetch(prompt, apiKey);
      results[soc] = fetched.length;
      newCount += fetched.length;
      if (fetched.length > 0) existing.push(...fetched);
    } catch (e) {
      errors[soc] = e.message;
    }
  }

  if (newCount > 0) {
    const merged = sortNewestFirst(dedup(existing));
    await redisSet(REPO_KEY, merged);
  }

  return res.status(200).json({ ok: true, action: "weekly-update", newGuidelines: newCount, results, errors });
}
