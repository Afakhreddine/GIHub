// api/cron-schedule.js — ONE topic per invocation, fetches articles + news only

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

async function redisList(key) {
  const res  = await fetch(`${redisBase()}/lrange/${key}/0/-1`, { headers: redisHdrs() });
  const json = await res.json();
  return Array.isArray(json.result) ? json.result : [];
}
async function redisPop(key) {
  const res  = await fetch(`${redisBase()}/lpop/${key}`, { method:"POST", headers: redisHdrs() });
  const json = await res.json();
  return json.result || null;
}
async function redisPushOne(key, value) {
  await fetch(`${redisBase()}/rpush/${key}/${encodeURIComponent(value)}`, { method:"POST", headers: redisHdrs() });
}
async function redisDel(key) {
  await fetch(`${redisBase()}/del/${key}`, { method:"POST", headers: redisHdrs() });
}
async function redisSet(key, value) {
  await fetch(`${redisBase()}/set/${key}`, {
    method:"POST",
    headers: { ...redisHdrs(), "Content-Type":"application/json" },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
}

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
  if (!res.ok) throw new Error(data.error?.message || "Claude API error");
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in response");
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  // ?reset=true — clears and re-seeds the queue
  if (req.query?.reset === "true") {
    await redisDel(QUEUE_KEY);
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    return res.status(200).json({ ok:true, action:"reset", queued:LECTURE_TOPICS.map(t=>t.slug) });
  }

  // Seed queue if empty
  let queue = await redisList(QUEUE_KEY);
  if (queue.length === 0) {
    for (const t of LECTURE_TOPICS) await redisPushOne(QUEUE_KEY, t.slug);
    queue = LECTURE_TOPICS.map(t => t.slug);
  }

  // Pop ONE slug and process it
  const slug = await redisPop(QUEUE_KEY);
  if (!slug) return res.status(200).json({ ok:true, message:"Queue empty — all topics populated" });

  const lecture = LECTURE_TOPICS.find(t => t.slug === slug);
  if (!lecture) return res.status(200).json({ ok:true, message:`Unknown slug: ${slug}` });

  console.log(`Processing: ${lecture.label}`);

  // Fetch articles and news in parallel (guideline comes from repo at read time)
  const [articles, news] = await Promise.allSettled([
    claudeWebSearch(
      `Find up to 3 high-impact gastroenterology journal articles published in the past 12 months specifically about "${lecture.label}". ` +
      `Focus on journals: NEJM, Lancet, Gastroenterology, Gut, AJG, CGH, GIE, Hepatology. ` +
      `Return ONLY a JSON array, no markdown: [{"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}]`,
      apiKey
    ),
    claudeWebSearch(
      `Find up to 3 recent GI news items from the past 12 months specifically related to "${lecture.label}". ` +
      `Include FDA approvals, drug approvals, phase 3 trial results, policy changes relevant to this topic. ` +
      `Return ONLY a JSON array, no markdown: [{"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}]`,
      apiKey
    ),
  ]);

  const content = {
    articles:  articles.status === "fulfilled" ? articles.value : [],
    news:      news.status     === "fulfilled" ? news.value     : [],
    fetchedAt: Date.now(),
  };

  // Log any failures
  if (articles.status === "rejected") console.error(`✗ articles for ${slug}:`, articles.reason?.message);
  if (news.status     === "rejected") console.error(`✗ news for ${slug}:`,     news.reason?.message);

  await redisSet(`gihub:lecture:${slug}`, content);

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining: ${remaining.length}`);

  return res.status(200).json({
    ok: true,
    processed: slug,
    label: lecture.label,
    counts: { articles: content.articles.length, news: content.news.length },
    remaining: remaining.length,
    remainingTopics: remaining,
  });
}
