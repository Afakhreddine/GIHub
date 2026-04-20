// api/claude.js — serves all content from Redis + handles quiz + lecture

async function redisGet(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.result) return null;
  // Handle double-stringify
  let val = json.result;
  try { val = JSON.parse(val); } catch {}
  if (typeof val === "string") try { val = JSON.parse(val); } catch {}
  return val;
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

    // ── CONTENT: read from Redis ──────────────────────────────────────────
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

    // ── LECTURE: guideline from repo (keyword match) + articles/news from Redis ──
    if (type === "lecture") {
      if (!topic) return res.status(400).json({ error: "Missing topic slug" });

      const cached = await redisGet(`gihub:lecture:${topic}`);
      const repo   = await redisGet("gihub:guidelines:repo");

      let guideline = [];
      if (Array.isArray(repo) && repo.length > 0) {
        const STOPWORDS = new Set([
          "and","the","for","with","from","that","this","into","versus",
          "related","management","diagnosis","treatment","clinical",
          "practice","guideline","guidelines","update","disease","diseases",
        ]);
        const topicWords = topic.replace(/-/g, " ").toLowerCase().split(" ")
          .filter(w => w.length > 2 && !STOPWORDS.has(w));

        const scored = repo.map(g => {
          const titleLower   = (g.title   || "").toLowerCase();
          const topicLower   = (g.topic   || "").toLowerCase();
          const summaryLower = (g.summary || "").toLowerCase();
          const titleMatches   = topicWords.filter(w => titleLower.includes(w)).length;
          const topicMatches   = topicWords.filter(w => topicLower.includes(w)).length;
          const summaryMatches = topicWords.filter(w => summaryLower.includes(w)).length;
          const score = (titleMatches * 3) + (topicMatches * 2) + summaryMatches;
          return { ...g, _score: score };
        }).filter(g => g._score > 0);

        scored.sort((a, b) => b._score - a._score);

        if (scored.length > 0) {
          const { _score, ...best } = scored[0];
          guideline = [best];
        }
      }

      return res.status(200).json({
        guideline,
        articles:  cached?.articles  || [],
        news:      cached?.news      || [],
        fetchedAt: cached?.fetchedAt || null,
      });
    }

    // ── QUIZ (on-demand, Claude Haiku, no web search) ─────────────────────
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
