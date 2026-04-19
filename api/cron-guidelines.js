// Guidelines repository cron — processes ONE society per invocation
//
// Modes:
//   ?init=true   — Seeds queue with all 4 societies for full repo build from 2000
//   ?reset=true  — Clears repo and re-seeds queue (use for full rebuild)
//   (default)    — Pops one society from queue, fetches, merges into repo
//
// For initial build: visit ?init=true once, then trigger default 4 times (2min apart)
// For weekly update: cron runs once, checks one society for new guidelines
//
// Redis keys:
//   gihub:guidelines:repo   — full sorted array of all guidelines
//   gihub:guidelines:queue  — list of societies pending processing

const REPO_KEY  = "gihub:guidelines:repo";
const QUEUE_KEY = "gihub:guidelines:queue";
const SOCIETIES = ["ASGE", "AASLD", "AGA", "ACG"];

const JSON_SCHEMA = `{"org":"ACG|AGA|ASGE|AASLD","year":"YYYY","month":"full month name","topic":"short topic","urgency":"High|Moderate|Routine","title":"full title","summary":"1-2 sentences","url":"direct link"}`;

// ── REDIS HELPERS ─────────────────────────────────────────────────────────────
const rh = () => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });
const ru = p => `${process.env.UPSTASH_REDIS_REST_URL}${p}`;

async function redisGet(key) {
  const res  = await fetch(ru(`/get/${key}`), { headers: rh() });
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

async function redisDel(key) {
  await fetch(ru(`/del/${key}`), { method: "POST", headers: rh() });
}

async function redisLrange(key) {
  const res  = await fetch(ru(`/lrange/${key}/0/-1`), { headers: rh() });
  const json = await res.json();
  return Array.isArray(json.result) ? json.result : [];
}

async function redisLpop(key) {
  const res  = await fetch(ru(`/lpop/${key}`), { method: "POST", headers: rh() });
  const json = await res.json();
  return json.result || null;
}

async function redisRpush(key, value) {
  await fetch(ru(`/rpush/${key}/${encodeURIComponent(value)}`), { method: "POST", headers: rh() });
}

// ── PROMPTS ───────────────────────────────────────────────────────────────────
function initPrompt(society) {
  const p = {
    ASGE: `Fetch https://www.asge.org/home/resources/publications/guidelines and extract ALL clinical practice guidelines and quality indicator documents listed, including both "Guidelines" and "Quality in Endoscopy" sections, published from 2000 to present. For each document confirm the publication year. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,

    AASLD: `Fetch https://www.aasld.org/practice-guidelines and extract ALL clinical practice guidelines listed by disease topic, published from 2000 to present. Confirm publication year for each. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,

    AGA: `Search https://www.guidelinecentral.com/guidelines/aga/ and list ALL AGA clinical practice guidelines published from 2000 to present. Cross-check against https://gastro.org/clinical-guidance to confirm official status and verify publication dates. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,

    ACG: `Search https://www.guidelinecentral.com/guidelines/acg/ and list ALL ACG clinical practice guidelines published from 2000 to present. Cross-check against https://gi.org/guidelines to confirm official status and verify publication dates. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  };
  return p[society];
}

function updatePrompt(society) {
  const p = {
    ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and identify any documents listed under "Newly Published" or published in the past 7 days. Return ONLY a JSON array of new items (empty array [] if none). Each item: ${JSON_SCHEMA}`,
    AASLD: `Fetch https://www.aasld.org/news and identify any new or updated AASLD practice guidelines announced in the past 7 days. Return ONLY a JSON array of new items (empty array [] if none). Each item: ${JSON_SCHEMA}`,
    AGA:   `Check https://gastro.org/clinical-guidance and https://www.guidelinecentral.com/guidelines/aga/ for any new AGA clinical practice guidelines published in the past 7 days. Return ONLY a JSON array of new items (empty array [] if none). Each item: ${JSON_SCHEMA}`,
    ACG:   `Check https://gi.org/guidelines and https://www.guidelinecentral.com/guidelines/acg/ for any new ACG clinical practice guidelines published in the past 7 days. Return ONLY a JSON array of new items (empty array [] if none). Each item: ${JSON_SCHEMA}`,
  };
  return p[society];
}

// ── CLAUDE FETCH ──────────────────────────────────────────────────────────────
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
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: "You are a GI medical guideline curator. Fetch and search the web thoroughly. Return ONLY a valid JSON array. No markdown, no backticks, no extra text.",
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array found: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

// ── DEDUP + SORT ──────────────────────────────────────────────────────────────
function dedup(arr) {
  const seen = new Set();
  return arr.filter(g => {
    const key = g.title?.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const MONTHS = { january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12 };
function sortNewestFirst(arr) {
  return [...arr].sort((a, b) => {
    const aDate = parseInt(a.year||0)*100 + (MONTHS[a.month?.toLowerCase()]||0);
    const bDate = parseInt(b.year||0)*100 + (MONTHS[b.month?.toLowerCase()]||0);
    return bDate - aDate;
  });
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  if (!process.env.UPSTASH_REDIS_REST_URL) return res.status(500).json({ error: "Redis not configured" });

  const isInit  = req.query?.init  === "true";
  const isReset = req.query?.reset === "true";

  // ?reset=true — wipe repo and re-seed queue for full rebuild
  if (isReset) {
    await redisDel(REPO_KEY);
    await redisDel(QUEUE_KEY);
    for (const s of SOCIETIES) await redisRpush(QUEUE_KEY, s);
    return res.status(200).json({ ok:true, action:"reset", message:"Repo cleared. Trigger without params 4 times (2min apart) to rebuild." });
  }

  // ?init=true — seed queue without clearing existing repo
  if (isInit) {
    await redisDel(QUEUE_KEY);
    for (const s of SOCIETIES) await redisRpush(QUEUE_KEY, `init:${s}`);
    const queue = await redisLrange(QUEUE_KEY);
    return res.status(200).json({ ok:true, action:"init", message:"Queue seeded. Trigger without params 4 times (2min apart).", queue });
  }

  // Default: pop one item from queue and process it
  const item = await redisLpop(QUEUE_KEY);
  if (!item) {
    // Queue empty — run weekly update for all societies sequentially
    // (weekly updates are fast — only checking "newly published" sections)
    const existing = await redisGet(REPO_KEY) || [];
    let newCount = 0;
    for (const society of SOCIETIES) {
      try {
        const fetched = await claudeFetch(updatePrompt(society), apiKey);
        if (fetched.length > 0) {
          existing.push(...fetched);
          newCount += fetched.length;
          console.log(`✓ ${society} update: ${fetched.length} new`);
        }
      } catch(e) {
        console.error(`✗ ${society} update:`, e.message);
      }
    }
    if (newCount > 0) {
      const final = sortNewestFirst(dedup(existing));
      await redisSet(REPO_KEY, final);
      console.log(`Weekly update: ${newCount} new guidelines added. Total: ${final.length}`);
    }
    return res.status(200).json({ ok:true, action:"weekly-update", newGuidelines:newCount });
  }

  // Process one queued item
  const isInitItem = item.startsWith("init:");
  const society    = isInitItem ? item.replace("init:", "") : item;
  const prompt     = isInitItem ? initPrompt(society) : updatePrompt(society);

  console.log(`Processing ${society} (${isInitItem ? "init" : "update"})...`);

  try {
    const fetched  = await claudeFetch(prompt, apiKey);
    const existing = await redisGet(REPO_KEY) || [];
    const merged   = sortNewestFirst(dedup([...existing, ...fetched]));
    await redisSet(REPO_KEY, merged);

    const remaining = await redisLrange(QUEUE_KEY);
    console.log(`✓ ${society}: ${fetched.length} fetched. Repo total: ${merged.length}. Queue remaining: ${remaining.length}`);

    return res.status(200).json({
      ok: true,
      society,
      fetched: fetched.length,
      repoTotal: merged.length,
      queueRemaining: remaining.length,
      nextStep: remaining.length > 0 ? "Trigger again in 2 minutes" : "All done!",
    });
  } catch(e) {
    console.error(`✗ ${society}:`, e.message);
    return res.status(500).json({ ok:false, society, error: e.message });
  }
}
