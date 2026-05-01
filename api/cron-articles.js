import { claudeFetch, redisSet, buildPrompts } from "./cron-shared.js";

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  try {
    console.log("Fetching articles...");
    const data = await claudeFetch(buildPrompts().articles, apiKey);
    await redisSet("gihub:articles", { data, fetchedAt: Date.now() });
    console.log(`✓ articles: ${data.length} items`);
    return res.status(200).json({ ok: true, section: "articles", count: data.length });
  } catch (e) {
    console.error("cron-articles error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
