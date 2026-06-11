import { claudeFetch, redisGet, redisSet, buildPrompts, sortNewestFirst } from "./cron-shared.js";

const NINETY_DAYS = 90 * 24 * 3600 * 1000;

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

function titleMatch(a, b) {
  const norm = s => (s || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const na = norm(a), nb = norm(b);
  const short = na.length < nb.length ? na : nb;
  return short.length > 20 && (na.includes(short.slice(0, 35)) || nb.includes(short.slice(0, 35)));
}

function parseYear(dateStr) {
  if (!dateStr) return String(new Date().getFullYear());
  const d = new Date(dateStr);
  if (!isNaN(d)) return String(d.getFullYear());
  const m = dateStr.match(/\b(20\d\d)\b/);
  return m ? m[1] : String(new Date().getFullYear());
}

function parseMonth(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (!isNaN(d)) return d.toLocaleString("en-US", { month: "long" });
  return "";
}

function deriveOrg(g) {
  const text = ((g.org || "") + " " + (g.title || "") + " " + (g.summary || "")).toLowerCase();
  if (text.includes("acg") || text.includes("american college of gastroenterology")) return "ACG";
  if (text.includes("aga") || text.includes("american gastroenterological association")) return "AGA";
  if (text.includes("asge") || text.includes("american society for gastrointestinal endoscopy")) return "ASGE";
  if (text.includes("aasld") || text.includes("american association for the study of liver")) return "AASLD";
  return "ACG";
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

    // Cross-reference guideline items against the repo
    if (guidelineItems.length > 0) {
      const repo     = (await redisGet("gihub:guidelines:repo")) || [];
      const existing = (await redisGet("gihub:guidelines:new"))  || [];
      const now      = Date.now();
      let repoChanged = false;

      for (const g of guidelineItems) {
        const alreadyInRepo = repo.some(r => titleMatch(r.title, g.title));
        if (!alreadyInRepo) {
          const org   = deriveOrg(g);
          const year  = parseYear(g.date);
          const month = parseMonth(g.date);
          repo.push({ org, year, month, topic: g.topic || "", urgency: "High", title: g.title, summary: g.summary, url: g.studyUrl || g.url || "" });
          existing.push({ org, title: g.title, year, month, detectedAt: now });
          repoChanged = true;
          console.log(`  New guideline detected: [${org}] ${g.title}`);
        }
      }

      if (repoChanged) {
        await redisSet("gihub:guidelines:repo", sortNewestFirst(repo));
        await redisSet("gihub:guidelines:new", existing.filter(n => now - n.detectedAt < NINETY_DAYS));
      }
    }

    await redisSet("gihub:weekly", { data: weeklyItems, fetchedAt: Date.now() });
    console.log(`✓ weekly: ${weeklyItems.length} items, ${guidelineItems.length} guidelines cross-referenced`);
    return res.status(200).json({ ok: true, count: weeklyItems.length, guidelinesProcessed: guidelineItems.length });
  } catch (e) {
    console.error("cron-weekly error:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
