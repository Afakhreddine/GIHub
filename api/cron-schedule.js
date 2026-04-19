// Self-contained — no imports from src/
// LECTURE_TOPICS is the only thing to keep in sync with src/scheduleConfig.js

const LECTURE_TOPICS = [
  { slug:"esophageal-strictures-dilation",      label:"Esophageal Strictures & Dilation"        },
  { slug:"non-eoe-inflammatory-esophageal",      label:"Non-EoE Inflammatory Esophageal Diseases" },
  { slug:"barretts-esophagus-therapies",         label:"Barrett's Esophagus Therapies"           },
  { slug:"neuroendocrine-tumors",                label:"Neuroendocrine Tumors (NETs)"            },
  { slug:"gerd-medical-dietary-management",      label:"GERD / Medical & Dietary Management"     },
  { slug:"board-review-esophagus",               label:"Board Review — Esophagus"                },
];

const QUEUE_KEY = "gihub:schedule:queue";

// ── REDIS HELPERS ─────────────────────────────────────────────────────────────
function redisUrl(path) {
  return `${process.env.UPSTASH_REDIS_REST_URL}${path}`;
}
function redisHeaders() {
  return { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` };
}

async function redisList(key) {
  const res = await fetch(redisUrl(`/lrange/${key}/0/-1`), { headers: redisHeaders() });
  const json = await res.json();
  return Array.isArray(json.result) ? json.result : [];
}

async function redisPop(key) {
  const res = await fetch(redisUrl(`/lpop/${key}`), { method:"POST", headers: redisHeaders() });
  const json = await res.json();
  return json.result || null;
}

async function redisDel(key) {
  await fetch(redisUrl(`/del/${key}`), { method:"POST", headers: redisHeaders() });
}

async function redisPushOne(key, value) {
  const res = await fetch(redisUrl(`/rpush/${key}/${encodeURIComponent(value)}`), {
    method: "POST",
    headers: redisHeaders(),
  });
  return res.ok;
}

async function redisSet(key, value) {
  const res = await fetch(redisUrl(`/set/${key}`), {
    method: "POST",
    headers: { ...redisHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`Redis set failed for ${key}: ${await res.text()}`);
}

// ── FETCH TOPIC CONTENT ───────────────────────────────────────────────────────
async function fetchOne(prompt, apiKey) {
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
      max_tokens: 2000,
      system: "You are a GI medical curator. Search the web and return ONLY a valid JSON array. No markdown, no backticks, no extra text.",
      messages: [{ role:"user", content:prompt }],
      tools: [{ type:"web_search_20250305", name:"web_search" }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const match = text.match(/\[[\s\S]*\]/);
  return match ? JSON.parse(match[0]) : [];
}

async function fetchTopicContent(label, apiKey) {
  const [guideline, articles, news] = await Promise.allSettled([
    fetchOne(`Search for the most recent relevant clinical practice guideline from ACG, AGA, ASGE, or AASLD related to "${label}". Return ONLY a JSON array with 1 object: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"2-3 sentences","url":""}`, apiKey),
    fetchOne(`Search for high-impact GI research articles published in the past 4 weeks specifically about "${label}". Return up to 5, newest first. JSON array: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`, apiKey),
    fetchOne(`Search for recent GI news from the past 4 weeks related to "${label}". Include FDA approvals, drug news, policy changes. Return up to 5. JSON array: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`, apiKey),
  ]);
  return {
    guideline: guideline.status === "fulfilled" ? guideline.value : [],
    articles:  articles.status  === "fulfilled" ? articles.value  : [],
    news:      news.status      === "fulfilled" ? news.value      : [],
  };
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error:"ANTHROPIC_API_KEY not set" });
  if (!process.env.UPSTASH_REDIS_REST_URL) return res.status(500).json({ error:"Redis not configured" });

  // ?reset=true — clears queue and re-seeds (use when updating calendar each month)
  if (req.query?.reset === "true") {
    await redisDel(QUEUE_KEY);
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    return res.status(200).json({ ok:true, action:"reset", queued:LECTURE_TOPICS.map(t => t.slug) });
  }

  // Seed queue if empty
  let queue = await redisList(QUEUE_KEY);
  if (queue.length === 0) {
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    queue = LECTURE_TOPICS.map(t => t.slug);
    console.log("Queue seeded:", queue);
  }

  // Pop one slug and process it
  const slug = await redisPop(QUEUE_KEY);
  if (!slug) return res.status(200).json({ ok:true, message:"Queue empty" });

  const lecture = LECTURE_TOPICS.find(t => t.slug === slug);
  if (!lecture) return res.status(200).json({ ok:true, message:`Unknown slug: ${slug}` });

  console.log(`Processing: ${lecture.label}`);
  const content = await fetchTopicContent(lecture.label, apiKey);
  await redisSet(`gihub:lecture:${slug}`, { ...content, fetchedAt:Date.now() });

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining: ${remaining.length}`);

  return res.status(200).json({
    ok: true,
    processed: slug,
    label: lecture.label,
    counts: { guideline:content.guideline.length, articles:content.articles.length, news:content.news.length },
    remaining: remaining.length,
    remainingTopics: remaining,
  });
}
