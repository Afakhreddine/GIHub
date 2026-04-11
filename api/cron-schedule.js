// Processes ONE lecture topic per invocation — never times out.
// Uses Redis to track a queue of pending topics.
// Run manually once to seed the queue, then Sunday cron drains it one-by-one.
//
// How it works:
//   1. On first run: seeds Redis with all topic slugs as a queue
//   2. Each run: pops one slug from the queue, fetches its content, saves to Redis
//   3. When queue is empty: re-seeds it (for next month if config changed)
//
// To reset for a new month: visit /api/cron-schedule?reset=true

import { LECTURE_TOPICS } from "../src/scheduleConfig.js";
import { redisSet } from "./cron-shared.js";

const QUEUE_KEY = "gihub:schedule:queue";

async function redisList(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/lrange/${key}/0/-1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  const json = await res.json();
  return json.result || [];
}

async function redisPop(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/lpop/${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  const json = await res.json();
  return json.result || null;
}

async function redisPush(key, values) {
  // Push each value individually using pipeline
  for (const val of values) {
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/rpush/${key}/${encodeURIComponent(val)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    });
    if (!res.ok) console.error(`Failed to push ${val}:`, await res.text());
  }
}

async function redisDel(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/del/${key}`;
  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
}

async function fetchTopicContent(label, apiKey) {
  const prompts = {
    guideline: `Search for the single most recent and relevant clinical practice guideline from ACG, AGA, ASGE, or AASLD related to "${label}". Confirm the publication date. Return ONLY a JSON array with 1 object: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"2-3 sentences","url":""}`,
    articles:  `Search for high-impact gastroenterology research articles published in the past 4 weeks specifically related to "${label}". Return up to 5 results sorted newest first. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`,
    news:      `Search for recent GI/hepatology news from the past 4 weeks related to "${label}". Include FDA approvals, drug news, policy changes, or society announcements. Return up to 5 results. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
  };

  const results = {};
  for (const [key, prompt] of Object.entries(prompts)) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
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
          messages: [{ role: "user", content: prompt }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(JSON.stringify(data?.error));
      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const match = text.match(/\[[\s\S]*\]/);
      results[key] = match ? JSON.parse(match[0]) : [];
    } catch (e) {
      console.error(`Failed to fetch ${key} for ${label}:`, e.message);
      results[key] = [];
    }
  }
  return results;
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  if (!process.env.UPSTASH_REDIS_REST_URL) return res.status(500).json({ error: "Redis not configured" });

  // ?reset=true clears the queue and re-seeds (use when updating calendar each month)
  if (req.query?.reset === "true") {
    await redisDel(QUEUE_KEY);
    await redisPush(QUEUE_KEY, LECTURE_TOPICS.map(t => t.slug));
    return res.status(200).json({ ok: true, action: "reset", queued: LECTURE_TOPICS.map(t => t.slug) });
  }

  // Seed queue if empty
  let queue = await redisList(QUEUE_KEY);
  if (queue.length === 0) {
    await redisPush(QUEUE_KEY, LECTURE_TOPICS.map(t => t.slug));
    queue = LECTURE_TOPICS.map(t => t.slug);
    console.log("Queue seeded with", queue.length, "topics");
  }

  // Pop one topic and process it
  const slug = await redisPop(QUEUE_KEY);
  if (!slug) return res.status(200).json({ ok: true, message: "Queue empty, nothing to process" });

  const lecture = LECTURE_TOPICS.find(t => t.slug === slug);
  if (!lecture) return res.status(200).json({ ok: true, message: `Unknown slug: ${slug}` });

  console.log(`Processing topic: ${lecture.label} (${slug})`);
  const content = await fetchTopicContent(lecture.label, apiKey);
  await redisSet(`gihub:lecture:${slug}`, { ...content, fetchedAt: Date.now() });

  const remaining = await redisList(QUEUE_KEY);
  console.log(`✓ Done: ${slug}. Remaining in queue: ${remaining.length}`);

  return res.status(200).json({
    ok: true,
    processed: slug,
    remaining: remaining.length,
    remainingTopics: remaining,
  });
}