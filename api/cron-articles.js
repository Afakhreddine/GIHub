import { fetchSection, redisSet } from "./cron-shared.js";

export default async function handler(req, res) {
  try {
    const data = await fetchSection("articles", process.env.ANTHROPIC_API_KEY);
    await redisSet("gihub:articles", { data, fetchedAt: Date.now() });
    return res.status(200).json({ ok: true, section: "articles", count: data.length });
  } catch (e) {
    console.error("cron-articles error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}