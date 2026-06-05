import { claudeFetch, redisSet, buildPrompts } from "./cron-shared.js";

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  try {
    console.log("Fetching weekly update...");
    const data = await claudeFetch(buildPrompts().weekly, apiKey);
    await redisSet("gihub:weekly", { data, fetchedAt: Date.now() });
    console.log(`✓ weekly: ${data.length} items`);
    return res.status(200).json({ ok: true, section: "weekly", count: data.length });
  } catch (e) {
    console.error("cron-weekly error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
