// api/claude.js

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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: "Invalid JSON" }); }

  const { type, section, topic, page = 1 } = body || {};
  console.log("Request:", { type, section, topic });

  try {

    // ── CONTENT ───────────────────────────────────────────────────────────
    if (type === "content") {
      if (!section) return res.status(400).json({ error: "Missing section" });

      if (section === "guidelines") {
        const repo = await redisGet("gihub:guidelines:repo");
        if (!Array.isArray(repo) || repo.length === 0)
          return res.status(200).json({ data: [], status: "empty" });
        const PAGE_SIZE = 20;
        const total = repo.length;
        const pages = Math.ceil(total / PAGE_SIZE);
        const start = (page - 1) * PAGE_SIZE;
        const data  = repo.slice(start, start + PAGE_SIZE);
        return res.status(200).json({ data, page, pages, total, ageHours: null });
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
      const cached = await redisGet(`gihub:lecture:${topic}`);
      return res.status(200).json({
        guideline: cached?.guideline || [],
        quiz:      cached?.quiz      || [],
        articles:  cached?.articles  || [],
        news:      cached?.news      || [],
        fetchedAt: cached?.fetchedAt || null,
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
