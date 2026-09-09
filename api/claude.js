// api/claude.js
import guidelineSupplements from "../src/data/guidelineSupplements.js";
import weekly from "../src/data/weekly.js";
import weeklyArchive from "../src/data/weeklyArchive.js";
import scheduleResources from "../src/data/scheduleResources.js";
import { buildLectureResource } from "../src/scheduleResourcesModel.js";

async function redisGet(key) {
  const res = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
    { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  let val = json.result;
  if (!val) return null;
  for (let i = 0; i < 3; i++) {
    if (typeof val === "object") break;
    try { val = JSON.parse(val); } catch { break; }
  }
  return typeof val === "object" ? val : null;
}

function normalizedGuidelineToken(item) {
  const raw = `${item?.org || ""} ${item?.year || ""} ${item?.title || ""} ${item?.topic || ""}`.toLowerCase();
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(acg|american college of gastroenterology|clinical|practice|guidelines?|guideline|diagnosis|management|treatment|update|and|of|the|with|in|for|patients|adult|adults)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function guidelineIdentity(item) {
  const url = String(item?.url || "").toLowerCase();
  const pmid = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/)?.[1];
  if (pmid) return `pmid:${pmid}`;
  const doi = url.match(/10\.\d{4,9}\/[^?#\s]+/i)?.[0];
  if (doi) return `doi:${doi.toLowerCase()}`;
  const pii = url.match(/s\d{4}-\d{4}\(\d{2}\)\d+-[\dx]/i)?.[0];
  if (pii) return `pii:${pii.toLowerCase()}`;
  return `${item?.org || ""}:${item?.year || ""}:${normalizedGuidelineToken(item)}`;
}

function isDuplicateGuidelineToken(existingToken, token) {
  if (!existingToken || !token) return false;
  if (existingToken === token) return true;
  const knownEquivalentScopes = [
    "benign malignant colonic strictures",
  ];
  return knownEquivalentScopes.some(scope => existingToken.includes(scope) && token.includes(scope));
}

function canonicalizeGuideline(item) {
  const token = normalizedGuidelineToken(item);
  const org = String(item?.org || "").toUpperCase();
  if (org === "ASGE" && item?.year === "2026" && token.includes("benign malignant colonic strictures")) {
    return {
      ...item,
      month: "Aug",
      topic: "Colonic Strictures",
      title: "American Society for Gastrointestinal Endoscopy guideline on endoscopic management of benign and malignant colonic strictures",
      summary: "ASGE guideline providing evidence-based recommendations for endoscopic management of benign and malignant colonic strictures, including dilation, stenting, and procedural selection.",
      url: "https://pubmed.ncbi.nlm.nih.gov/42240543/"
    };
  }
  return item;
}

export function dedupeGuidelines(items) {
  const existing = new Set();
  const tokens = [];
  const deduped = [];

  for (const raw of items || []) {
    const item = canonicalizeGuideline(raw);
    const identity = guidelineIdentity(item);
    const token = normalizedGuidelineToken(item);
    const duplicateByToken = tokens.some(existingToken => isDuplicateGuidelineToken(existingToken, token));
    if (existing.has(identity) || duplicateByToken) continue;
    deduped.push(item);
    existing.add(identity);
    tokens.push(token);
  }

  return deduped;
}

function mergeGuidelineSupplements(repo) {
  return dedupeGuidelines([...(repo || []), ...guidelineSupplements]);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: "Invalid JSON" }); }

  const { type, section, topic, page = 1 } = body || {};
  console.log("Request:", { type, section, topic });

  try {

    // ── CONTENT ───────────────────────────────────────────────────────────
    if (type === "content") {
      if (!section) return res.status(400).json({ error: "Missing section" });

      if (section === "guidelines-new") {
        const cached = await redisGet("gihub:guidelines:new");
        const data = Array.isArray(cached) ? cached : [];
        return res.status(200).json({ data });
      }

      if (section === "guidelines") {
        const repo = await redisGet("gihub:guidelines:repo");
        if (!Array.isArray(repo) || repo.length === 0) {
          const fallback = mergeGuidelineSupplements([]);
          return res.status(200).json({ data: fallback, total: fallback.length, status: "fallback" });
        }
        const guidelines = mergeGuidelineSupplements(repo);
        if (page === "all") {
          return res.status(200).json({ data: guidelines, total: guidelines.length });
        }
        const PAGE_SIZE = 20;
        const total = guidelines.length;
        const pages = Math.ceil(total / PAGE_SIZE);
        const start = (page - 1) * PAGE_SIZE;
        const data  = guidelines.slice(start, start + PAGE_SIZE);
        return res.status(200).json({ data, page, pages, total, ageHours: null });
      }

      if (section === "weekly") {
        return res.status(200).json({ data: weekly, total: weekly.length, source: "repo" });
      }

      const cached = await redisGet(`gihub:${section}`);
      if (!cached || !Array.isArray(cached.data) || cached.data.length === 0)
        return res.status(200).json({ data: [], status: "empty" });
      const ageHours = cached.fetchedAt
        ? Math.round((Date.now() - cached.fetchedAt) / 3_600_000)
        : null;
      return res.status(200).json({ data: cached.data, ageHours });
    }

    // ── LECTURE ───────────────────────────────────────────────────────────
    if (type === "lecture") {
      if (!topic) return res.status(400).json({ error: "Missing topic slug" });
      const repoResource = scheduleResources?.[topic];
      if (repoResource) {
        return res.status(200).json({
          guideline: repoResource.guidelines || [],
          guidelines: repoResource.guidelines || [],
          newsAndArticles: repoResource.newsAndArticles || [],
          quiz: repoResource.quiz || [],
          quizSourcePdfs: repoResource.quizSourcePdfs || [],
          fetchedAt: repoResource.fetchedAt || null,
          source: "repo"
        });
      }

      const cached = await redisGet(`gihub:lecture:${topic}`);
      if (cached) {
        return res.status(200).json({
          guideline: cached.guideline || [],
          guidelines: cached.guideline || [],
          newsAndArticles: cached.newsAndArticles || [
            ...(cached.articles || []).map(a => ({ ...a, title:a.title, source:a.journal || a.source, oneLineSummary:a.summary })),
            ...(cached.news || []).map(n => ({ ...n, title:n.title || n.headline, oneLineSummary:n.summary })),
          ],
          quiz:      cached.quiz      || [],
          articles:  cached.articles  || [],
          news:      cached.news      || [],
          fetchedAt: cached.fetchedAt || null,
          source: "redis"
        });
      }

      const label = String(body.label || topic).replace(/-/g, " ");
      const generated = buildLectureResource({
        slug: topic,
        topic: label,
        guidelines: mergeGuidelineSupplements([]),
        currentWeekly: weekly,
        weeklyArchive,
      });
      return res.status(200).json({
        guideline: generated.guidelines || [],
        guidelines: generated.guidelines || [],
        newsAndArticles: generated.newsAndArticles || [],
        quiz: generated.quiz || [],
        quizSourcePdfs: generated.quizSourcePdfs || [],
        fetchedAt: null,
        source: "repo-derived"
      });
    }

    // ── QUIZ ──────────────────────────────────────────────────────────────
    if (type === "quiz" || type === "lecture-quiz") {
      const quizTopic = body.topic;
      if (!quizTopic) return res.status(400).json({ error: "Missing topic" });

      const isLecture = type === "lecture-quiz";
      const prompt = isLecture
        ? `Write exactly 5 clinical MCQs for a GI fellow testing the content of this guideline: "${quizTopic}". ` +
          `Return ONLY a JSON array of 5 objects, no markdown: ` +
          `[{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"..."}]`
        : `Write 1 clinical vignette MCQ for a GI fellow on "${quizTopic}" based on current ACG/AGA/ASGE guidelines. ` +
          `Return ONLY a JSON array of 1 object, no markdown: ` +
          `[{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"..."}]`;

      const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
      if (!apiKey) return res.status(500).json({ error: "API key not configured" });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Claude error" });

      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      const clean = text.replace(/```json|```/g, "").trim();
      let parsed = null;
      try { parsed = JSON.parse(clean); } catch {}
      if (!parsed) { const m = clean.match(/\[[\s\S]*\]/); if (m) try { parsed = JSON.parse(m[0]); } catch {} }
      if (!parsed?.length) return res.status(500).json({ error: "Could not parse quiz", raw: text.slice(0, 200) });
      return res.status(200).json({ data: parsed });
    }

    return res.status(400).json({ error: "Invalid type: " + type });

  } catch (err) {
    console.error("Unhandled error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
