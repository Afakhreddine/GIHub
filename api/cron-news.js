import { claudeFetch, redisGet, redisSet, buildPrompts } from "./cron-shared.js";

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  try {
    console.log("Fetching news...");

    // Read current articles so news doesn't duplicate them
    const articlesCache = await redisGet("gihub:articles");
    const articleTitles = Array.isArray(articlesCache?.data)
      ? articlesCache.data.map(a => a.title).filter(Boolean)
      : [];

    let prompt = buildPrompts().news;
    if (articleTitles.length > 0) {
      prompt +=
        `\n\nThe following research articles are already displayed in the Articles feed. ` +
        `Do NOT include any news item that is primarily reporting on, summarising, or announcing any of these articles:\n` +
        articleTitles.map(t => `- ${t}`).join("\n");
    }

    const data = await claudeFetch(prompt, apiKey);
    await redisSet("gihub:news", { data, fetchedAt: Date.now() });
    console.log(`✓ news: ${data.length} items`);
    return res.status(200).json({ ok: true, section: "news", count: data.length });
  } catch (e) {
    console.error("cron-news error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
