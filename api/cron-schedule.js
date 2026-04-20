// api/cron-schedule.js — ONE topic per invocation, never times out

const LECTURE_TOPICS = [
  { slug:"esophageal-strictures-dilation",      label:"Esophageal Strictures & Dilation"        },
  { slug:"non-eoe-inflammatory-esophageal",      label:"Non-EoE Inflammatory Esophageal Diseases" },
  { slug:"barretts-esophagus-therapies",         label:"Barrett's Esophagus Therapies"           },
  { slug:"neuroendocrine-tumors",                label:"Neuroendocrine Tumors (NETs)"            },
  { slug:"gerd-medical-dietary-management",      label:"GERD / Medical & Dietary Management"     },
  { slug:"board-review-esophagus",               label:"Board Review — Esophagus"                },
];

const QUEUE_KEY = "gihub:schedule:queue";

const redisUrl  = path => `${process.env.UPSTASH_REDIS_REST_URL}${path}`;
const redisHdrs = ()   => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });

async function redisList(key) {
  const res  = await fetch(redisUrl(`/lrange/${key}/0/-1`), { headers: redisHdrs() });
  const json = await res.json();
  return Array.isArray(json.result) ? json.result : [];
}
async function redisPop(key) {
  const res  = await fetch(redisUrl(`/lpop/${key}`), { method:"POST", headers: redisHdrs() });
  const json = await res.json();
  return json.result || null;
}
async function redisPushOne(key, value) {
  await fetch(redisUrl(`/rpush/${key}/${encodeURIComponent(value)}`), { method:"POST", headers: redisHdrs() });
}
async function redisDel(key) {
  await fetch(redisUrl(`/del/${key}`), { method:"POST", headers: redisHdrs() });
}
async function redisSet(key, value) {
  await fetch(redisUrl(`/set/${key}`), {
    method:"POST", headers:{ ...redisHdrs(), "Content-Type":"application/json" },
    body: JSON.stringify({ value: JSON.stringify(value) }),
  });
}

async function claudeFetch(prompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01",
               "anthropic-beta":"web-search-2025-03-05" },
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:4000,
      tools:[{ type:"web_search_20250305", name:"web_search" }],
      messages:[{ role:"user", content:prompt }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Claude API error");
  const text = data.content.filter(b => b.type==="text").map(b => b.text).join("");
  const clean = text.replace(/```json|```/g,"").trim();
  return JSON.parse(clean);
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error:"ANTHROPIC_API_KEY not set" });

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
  if (!slug) return res.status(200).json({ ok:true, message:"Queue empty" });

  const lecture = LECTURE_TOPICS.find(t => t.slug === slug);
  if (!lecture) return res.status(200).json({ ok:true, message:`Unknown slug: ${slug}` });

  console.log(`Processing: ${lecture.label}`);

  const [guideline, articles, news] = await Promise.allSettled([
    claudeFetch(`Find the most relevant current GI/gastroenterology clinical guideline for "${lecture.label}". Return a JSON array of 1 item: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"2-3 sentences","url":""}`, apiKey),
    claudeFetch(`Find up to 3 recent high-impact GI journal articles about "${lecture.label}" from the past 6 months. Journals: NEJM, Lancet, Gastroenterology, Gut, AJG, CGH, GIE, Hepatology. Return JSON array: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`, apiKey),
    claudeFetch(`Find up to 3 recent GI news items (FDA approvals, drug news, policy) related to "${lecture.label}" from the past 6 months. Return JSON array: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`, apiKey),
  ]);

  const content = {
    guideline: guideline.status==="fulfilled" ? guideline.value : [],
    articles:  articles.status ==="fulfilled" ? articles.value  : [],
    news:      news.status     ==="fulfilled" ? news.value      : [],
    fetchedAt: Date.now(),
  };

  await redisSet(`gihub:lecture:${slug}`, content);

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining: ${remaining.length}`);

  return res.status(200).json({
    ok:true, processed:slug, label:lecture.label,
    counts:{ guideline:content.guideline.length, articles:content.articles.length, news:content.news.length },
    remaining:remaining.length, remainingTopics:remaining,
  });
}
