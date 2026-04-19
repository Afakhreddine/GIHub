import { claudeFetch, redisSet, PROMPTS } from "./cron-shared.js";

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  try {
    console.log("Fetching news...");
    const data = await claudeFetch(PROMPTS.news, apiKey);
    await redisSet("gihub:news", { data, fetchedAt: Date.now() });
    console.log(`✓ news: ${data.length} items`);
    return res.status(200).json({ ok: true, section: "news", count: data.length });
  } catch (e) {
    console.error("cron-news error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
