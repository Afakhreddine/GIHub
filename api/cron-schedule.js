// api/cron-schedule.js — ONE topic per invocation, never times out
// Fetches: guidelines (Haiku, from repo), articles, news (Sonnet, web search), quiz (Haiku)

const LECTURE_TOPICS = [
  { slug:"irritable-bowel-syndrome",           label:"IBS"                                  },
  { slug:"ai-for-gi-update",                   label:"AI for GI Update"                     },
  { slug:"gastric-submucosal-lesions",          label:"Gastric Submucosal Lesions"           },
  { slug:"postoperative-anatomy-pitfalls",      label:"Postoperative Anatomy and Pitfalls"   },
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

// ── GUIDELINE PICKER (Haiku, no web search, returns all strong matches) ───────
async function pickGuidelines(topicLabel, apiKey) {
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
      max_tokens: 20,
      messages: [{
        role: "user",
        content:
          `List the indices (0-${repo.length - 1}) of ALL guidelines that are strongly and directly relevant to a GI lecture on "${topicLabel}". ` +
          `Only include guidelines with a clear topical match — do not include loosely related ones. ` +
          `Reply with only a comma-separated list of numbers, nothing else. If none match well, reply with the single best index.\n\n${repoSummary}`,
      }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Haiku error");
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();

  const indices = text.split(",")
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n) && n >= 0 && n < repo.length);

  if (indices.length === 0) {
    console.log(`  guideline: no valid indices in "${text}", skipping`);
    return [];
  }

  const picked = indices.map(i => repo[i]);
  console.log(`  guideline: picked ${indices.length} — ${picked.map(g => g.title).join(" | ")}`);
  return picked;
}

// ── QUIZ GENERATOR (Haiku, factual recall from guideline content) ─────────────
async function generateQuiz(guidelines, topicLabel, apiKey) {
  if (!guidelines || guidelines.length === 0) return [];

  const MONTHS = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};
  const newest = guidelines.slice().sort((a, b) => {
    const aScore = parseInt(a.year||0)*100 + (MONTHS[a.month?.toLowerCase()]||0);
    const bScore = parseInt(b.year||0)*100 + (MONTHS[b.month?.toLowerCase()]||0);
    return bScore - aScore;
  })[0];

  const guidelineContext = `${newest.org} ${newest.year} — ${newest.title}: ${newest.summary}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-7",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content:
          `Using the following GI guideline, generate five high-difficulty multiple choice questions for a gastroenterology fellow self-assessment. ` +
          `No clinical vignettes. Every question must be derived from a verbatim quote in the guideline text. ` +
          `Target exclusively: specific numerical thresholds and cutoffs, treatment algorithm decision points and step sequences, scoring systems and their interpretation, ` +
          `dosing regimens and monitoring intervals, red flag criteria with exact definitions, quality indicator metrics, and specific grade or strength of recommendations. ` +
          `Questions must be specific and technical — not definitional or conceptual. ` +
          `Distractors must be medically plausible near-misses (adjacent numbers, similar drug names, wrong algorithm step, inverted thresholds). ` +
          `The explanation must cite the verbatim guideline text that supports the correct answer. ` +
          `Return ONLY a JSON array of 5 objects, no markdown:\n` +
          `[{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"..."}]\n\n` +
          `Guidelines:\n${guidelineContext}`,
      }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Haiku quiz error");
  const text  = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON array in quiz response");
  return JSON.parse(match[0]);
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
      model: "claude-sonnet-4-6",
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

  // 1. Guidelines — Haiku picks all strong matches from repo
  let guideline = [];
  try {
    guideline = await pickGuidelines(lecture.label, apiKey);
  } catch(e) { console.error("  ✗ guideline:", e.message); }

  // 2. Quiz — Haiku generates 5 factual recall questions from the guideline(s)
  let quiz = [];
  try {
    quiz = await generateQuiz(guideline, lecture.label, apiKey);
    console.log(`  quiz: ${quiz.length} questions generated`);
  } catch(e) { console.error("  ✗ quiz:", e.message); }

  // 3. Articles — Sonnet web search, explicitly excludes guidelines
  let articles = [];
  try {
    articles = await claudeWebSearch(
      `Find up to 3 high-impact original research articles published in the past 12 months specifically about "${lecture.label}". ` +
      `Only include primary research: RCTs, cohort studies, meta-analyses. ` +
      `Do NOT include clinical practice guidelines, consensus statements, or expert reviews. ` +
      `Focus on journals: NEJM, Lancet, Gastroenterology, Gut, AJG, CGH, GIE, Hepatology. ` +
      `Return ONLY a JSON array, no markdown: ` +
      `[{"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}]`,
      apiKey
    );
  } catch(e) { console.error("  ✗ articles:", e.message); }

  // Small delay between Sonnet calls to avoid rate limiting
  await new Promise(r => setTimeout(r, 3000));

  // 4. News — Sonnet web search
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

  const content = { guideline, quiz, articles, news, fetchedAt: Date.now() };
  console.log(`  ✓ guideline:${guideline.length} quiz:${quiz.length} articles:${articles.length} news:${news.length}`);
  await redisSet(`gihub:lecture:${slug}`, content);

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining: ${remaining.length}`);

  return res.status(200).json({
    ok: true,
    processed: slug,
    label: lecture.label,
    counts: { guideline: guideline.length, quiz: quiz.length, articles: articles.length, news: news.length },
    remaining: remaining.length,
    remainingTopics: remaining,
  });
}
