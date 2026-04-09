import { redisSet } from "./cron-shared.js";

// Named lecture topics extracted from the calendar
const LECTURE_TOPICS = [
  { slug: "esophageal-strictures-dilation",        label: "Esophageal Strictures & Dilation" },
  { slug: "non-eoe-inflammatory-esophageal",       label: "Non-EoE Inflammatory Esophageal Diseases" },
  { slug: "barretts-esophagus-therapies",          label: "Barrett's Esophagus Therapies" },
  { slug: "neuroendocrine-tumors",                 label: "Neuroendocrine Tumors (NETs)" },
  { slug: "gerd-medical-dietary-management",       label: "GERD / Medical & Dietary Management" },
];

function buildPrompts(label) {
  return {
    guideline: `Search for the single most recent and relevant clinical practice guideline from ACG, AGA, ASGE, or AASLD related to "${label}". Confirm the publication date. Return ONLY a JSON array with 1 object: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"2-3 sentences","url":""}`,

    articles: `Search for high-impact gastroenterology research articles published in the past 4 weeks specifically related to "${label}" in journals including NEJM, Lancet, Gastroenterology, AJG, Gut, CGH, GIE, or Hepatology. Return up to 5 results sorted newest first. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`,

    news: `Search for recent GI and hepatology news from the past 4 weeks specifically related to "${label}". Include FDA approvals, drug development news, policy changes, or society announcements. Return up to 5 results sorted newest first. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
  };
}

async function fetchWithRetry(prompt, apiKey) {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 60000));

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
    if (response.status === 429) { console.log(`Rate limited, retrying...`); continue; }
    if (!response.ok) throw new Error(JSON.stringify(data?.error));

    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) { console.log(`No JSON array, retrying...`); continue; }

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) { console.log(`Empty array, retrying...`); continue; }

    return parsed;
  }
  return []; // Return empty rather than throw — partial results are ok
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const results = {};

  for (const lecture of LECTURE_TOPICS) {
    console.log(`Fetching content for: ${lecture.label}`);
    const prompts = buildPrompts(lecture.label);

    try {
      // Stagger each topic fetch by 2 minutes to avoid rate limits
      if (LECTURE_TOPICS.indexOf(lecture) > 0) {
        await new Promise(r => setTimeout(r, 120000));
      }

      const [guideline, articles, news] = await Promise.all([
        fetchWithRetry(prompts.guideline, apiKey),
        fetchWithRetry(prompts.articles, apiKey),
        fetchWithRetry(prompts.news, apiKey),
      ]);

      const payload = { guideline, articles, news, fetchedAt: Date.now() };
      await redisSet(`gihub:lecture:${lecture.slug}`, payload);
      results[lecture.slug] = { guideline: guideline.length, articles: articles.length, news: news.length };
      console.log(`✓ ${lecture.slug}: saved`);
    } catch (e) {
      console.error(`✗ ${lecture.slug}:`, e.message);
      results[lecture.slug] = { error: e.message };
    }
  }

  return res.status(200).json({ ok: true, results, timestamp: new Date().toISOString() });
}