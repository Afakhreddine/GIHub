// Serves content from Upstash Redis cache (populated by daily cron)
// Also handles quiz question generation via Claude Haiku (no web search)

async function redisGet(key) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (!json.result) return null;
  // Unwrap up to 2 layers of stringification to handle both old and new format
  let val = json.result;
  for (let i = 0; i < 2; i++) {
    if (typeof val !== "string") break;
    try { val = JSON.parse(val); } catch { return null; }
  }
  return (val && typeof val === "object") ? val : null;
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

  const { type, section, topic } = body || {};
  console.log("Request:", { type, section, topic });

  try {
    // ── CONTENT: read from Redis cache ────────────────────────────────────
    if (type === "content") {
      if (!["guidelines", "articles", "news"].includes(section)) {
        return res.status(400).json({ error: "Invalid section: " + section });
      }

      const cached = await redisGet(`gihub:${section}`);
      if (cached && Array.isArray(cached.data) && cached.data.length > 0) {
        const ageHours = Math.round((Date.now() - cached.fetchedAt) / 3600000);
        console.log(`Serving Redis cache for ${section}, age: ${ageHours}h`);
        return res.status(200).json({ data: cached.data, fetchedAt: cached.fetchedAt, ageHours });
      }

      // No cache yet — return empty so frontend uses static fallback
      console.log(`No cache for ${section}, returning empty`);
      return res.status(200).json({ data: [], fetchedAt: null, ageHours: null });
    }

    // ── QUIZ: Claude Haiku, no web search ─────────────────────────────────
    if (type === "quiz") {
      if (!topic) return res.status(400).json({ error: "Missing topic" });

      console.log("Generating quiz for topic:", topic);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          system: "You are a gastroenterology board exam question writer. Return ONLY a valid JSON array with one object. No markdown, no backticks.",
          messages: [{
            role: "user",
            content: `Write 1 clinical vignette MCQ for a GI fellow on "${topic}" based on current ACG/AGA/ASGE guidelines. Return a JSON array with 1 object: {"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"..."}`,
          }],
        }),
      });

      const data = await response.json();
      console.log("Quiz Anthropic status:", response.status);

      if (!response.ok) {
        console.error("Quiz error:", JSON.stringify(data));
        return res.status(response.status).json({ error: data?.error?.message || "Claude error" });
      }

      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      console.log("Quiz response preview:", text.slice(0, 150));

      let parsed = null;
      try { parsed = JSON.parse(text.trim()); } catch {}
      if (!parsed) { const m = text.match(/\[[\s\S]*\]/); if (m) try { parsed = JSON.parse(m[0]); } catch {} }
      if (!parsed) { const m = text.match(/\{[\s\S]*\}/); if (m) try { parsed = [JSON.parse(m[0])]; } catch {} }

      if (!parsed?.length) {
        return res.status(500).json({ error: "Could not parse quiz response", raw: text.slice(0, 200) });
      }
      return res.status(200).json({ data: parsed });
    }

    return res.status(400).json({ error: "Invalid type: " + type });

  } catch (err) {
    console.error("Unhandled error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}