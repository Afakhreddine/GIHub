import { fetchSection, redisSet } from "./cron-shared.js";

export default async function handler(req, res) {
  try {
    const data = await fetchSection("guidelines", process.env.ANTHROPIC_API_KEY);
    await redisSet("gihub:guidelines", { data, fetchedAt: Date.now() });
    return res.status(200).json({ ok: true, section: "guidelines", count: data.length });
  } catch (e) {
    console.error("cron-guidelines error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}