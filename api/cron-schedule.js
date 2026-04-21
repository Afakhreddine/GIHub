// api/cron-schedule.js — ONE topic per invocation, never times out
// Fetches: guideline (Haiku, from repo), articles + news (Sonnet, web search)

const LECTURE_TOPICS = [
  { slug:"esophageal-strictures-dilation",      label:"Esophageal Strictures & Dilation"        },
  { slug:"non-eoe-inflammatory-esophageal",      label:"Non-EoE Inflammatory Esophageal Diseases" },
  { slug:"barretts-esophagus-therapies",         label:"Barrett's Esophagus Therapies"           },
  { slug:"neuroendocrine-tumors",                label:"Neuroendocrine Tumors (NETs)"            },
  { slug:"gerd-medical-dietary-management",      label:"GERD / Medical & Dietary Management"     },
  { slug:"board-review-esophagus",               label:"Board Review — Esophagus"                },
];

const QUEUE_KEY = "gihub:schedule:queue";

const redisBase = () => process.env.UPSTASH_REDIS_REST_URL;
const redisHdrs = () => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });

async function redisGet(key) {
  const res = await fetch(`${redisBase()}/get/${encodeURIComponent(key)}`, { headers: redisHdrs() });
  if (!res.ok) return null;
  const json = await res.json();
  let val = json.result;
  if (!val) return null;
  for (let i = 0; i < 3; i++) {
    if (typeof val === "object") break;
    try { val = JSON.parse(val); } catch { break; }
  }
  return typeof val === "object" ? val : null;
}

async function redisSet(key, value) {
  const encoded = encodeURIComponent(JSON.stringify(value));
  await fetch(`${redisBase()}/set/${encodeURIComponent(key)}/${encoded}`, {
    method: "POST",
    headers: redisHdrs(),
  });
}

async function redisList(key) {
  const res  = await fetch(`${redisBase()}/lrange/${key}/0/-1`, { headers: redisHdrs() });
  const json = await res.json();
  return Array.isArray(json.result) ? json.result : [];
}

async function redisPop(key) {
  const res  = await fetch(`${redisBase()}/lpop/${key}`, { method: "POST", headers: redisHdrs() });
  const json = await res.json();
  return json.result || null;
}

async function redisPushOne(key, value) {
  await fetch(`${redisBase()}/rpush/${key}/${encodeURIComponent(value)}`, { method: "POST", headers: redisHdrs() });
}

async function redisDel(key) {
  await fetch(`${redisBase()}/del/${key}`, { method: "POST", headers: redisHdrs() });
}

// ── GUIDELINE PICKER (Haiku, no web search, reads from repo) ─────────────────
async function pickGuideline(topicLabel, apiKey) {
  const repo = await redisGet("gihub:guidelines:repo");
  if (!Array.isArray(repo) || repo.length === 0) {
    console.log("  guideline: repo empty, skipping");
    return [];
  }

  const repoSummary = repo.map((g, i) =>
    `${i}: [${g.org} ${g.year}] ${g.topic} — ${g.title}`
  ).join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{
        role: "user",
        content:
          `Which guideline index (0-${repo.length - 1}) is most relevant to a GI lecture on "${topicLabel}"? ` +
          `Reply with only the number, nothing else.\n\n${repoSummary}`,
      }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Haiku error");
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  const idx  = parseInt(text, 10);
  if (isNaN(idx) || idx < 0 || idx >= repo.length) {
    console.log(`  guideline: bad index "${text}", skipping`);
    return [];
  }
  console.log(`  guideline: picked index ${idx} — ${repo[idx].title}`);
  return [repo[idx]];
}

// ── WEB SEARCH (Sonnet) ───────────────────────────────────────────────────────
async function claudeWebSearch(prompt, apiKey) {
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
      max_tokens: 3000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Sonnet error");
  const text  = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");
  return JSON.parse(match[0]);
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  if (!process.env.UPSTASH_REDIS_REST_URL) return res.status(500).json({ error: "Redis not configured" });

  // ?reset=true — clears and re-seeds the queue
  if (req.query?.reset === "true") {
    await redisDel(QUEUE_KEY);
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    return res.status(200).json({ ok: true, action: "reset", queued: LECTURE_TOPICS.map(t => t.slug) });
  }

  // Seed queue if empty
  let queue = await redisList(QUEUE_KEY);
  if (queue.length === 0) {
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    queue = LECTURE_TOPICS.map(t => t.slug);
    console.log("Queue seeded:", queue);
  }

  // Pop ONE slug and process it
  const slug = await redisPop(QUEUE_KEY);
  if (!slug) return res.status(200).json({ ok: true, message: "Queue empty — all topics populated" });

  const lecture = LECTURE_TOPICS.find(t => t.slug === slug);
  if (!lecture) return res.status(200).json({ ok: true, message: `Unknown slug: ${slug}` });

  console.log(`Processing: ${lecture.label}`);

  // Guideline: Haiku, no web search
  let guideline = [];
  try {
    guideline = await pickGuideline(lecture.label, apiKey);
  } catch(e) { console.error("  ✗ guideline:", e.message); }

  // Articles: Sonnet web search
  let articles = [];
  try {
    articles = await claudeWebSearch(
      `Find up to 3 high-impact gastroenterology journal articles published in the past 12 months specifically about "${lecture.label}". ` +
      `Focus on: NEJM, Lancet, Gastroenterology, Gut, AJG, CGH, GIE, Hepatology. ` +
      `Return ONLY a JSON array, no markdown: ` +
      `[{"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}]`,
      apiKey
    );
  } catch(e) { console.error("  ✗ articles:", e.message); }

  // Small delay between Sonnet calls to avoid rate limiting
  await new Promise(r => setTimeout(r, 3000));

  // News: Sonnet web search
  let news = [];
  try {
    news = await claudeWebSearch(
      `Find up to 3 recent GI news items from the past 12 months specifically related to "${lecture.label}". ` +
      `Include FDA approvals, drug approvals, phase 3 trial results, policy changes. ` +
      `Return ONLY a JSON array, no markdown: ` +
      `[{"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}]`,
      apiKey
    );
  } catch(e) { console.error("  ✗ news:", e.message); }

  const content = { guideline, articles, news, fetchedAt: Date.now() };
  console.log(`  ✓ guideline:${guideline.length} articles:${articles.length} news:${news.length}`);
  await redisSet(`gihub:lecture:${slug}`, content);

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining: ${remaining.length}`);

  return res.status(200).json({
    ok: true,
    processed: slug,
    label: lecture.label,
    counts: { guideline: guideline.length, articles: articles.length, news: news.length },
    remaining: remaining.length,
    remainingTopics: remaining,
  });
}
