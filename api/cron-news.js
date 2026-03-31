import { fetchSection, redisSet } from "./cron-shared.js";

export default async function handler(req, res) {
  try {
    const data = await fetchSection("news", process.env.ANTHROPIC_API_KEY);
    await redisSet("gihub:news", { data, fetchedAt: Date.now() });
    return res.status(200).json({ ok: true, section: "news", count: data.length });
  } catch (e) {
    console.error("cron-news error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}