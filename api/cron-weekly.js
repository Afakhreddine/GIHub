import { claudeFetch, redisSet, buildPrompts } from "./cron-shared.js";

const SOURCE_BASES = {
  "news.gastro.org":     "https://news.gastro.org",
  "gastroendonews.com":  "https://www.gastroendonews.com",
  "healio.com":          "https://www.healio.com",
};

function normalizeItemUrls(item) {
  const out = { ...item };
  const srcKey = Object.keys(SOURCE_BASES).find(k => (out.source || "").includes(k));
  for (const field of ["url", "studyUrl"]) {
    const val = out[field];
    if (!val || val.startsWith("http://") || val.startsWith("https://")) continue;
    if (val.startsWith("/") && srcKey) out[field] = SOURCE_BASES[srcKey] + val;
  }
  return out;
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });
  try {
    console.log("Fetching weekly update...");
    const rawItems = await claudeFetch(buildPrompts().weekly, apiKey);
    const allItems = rawItems.map(normalizeItemUrls);

    const guidelineItems = allItems.filter(d => d.type === "Guideline");
    const weeklyItems    = allItems.filter(d => d.type !== "Guideline").slice(0, 10);

    // Guideline items are preserved in the prompt output for awareness, but the
    // Clinical Guidelines repository is now updated only through Hermes GitHub PRs.
    // Do not mutate `gihub:guidelines:*` Redis keys here.

    await redisSet("gihub:weekly", { data: weeklyItems, fetchedAt: Date.now() });
    console.log(`✓ weekly: ${weeklyItems.length} items, ${guidelineItems.length} guideline items noted for manual/Hermes review`);
    return res.status(200).json({ ok: true, count: weeklyItems.length, guidelineItemsNoted: guidelineItems.length });
  } catch (e) {
    console.error("cron-weekly error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
