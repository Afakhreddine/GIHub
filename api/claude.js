export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // Safely parse body — Vercel sometimes passes it unparsed
  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { type, section, topic } = body || {};
  console.log("Request:", { type, section, topic });

  try {
    if (type === "content") {
      const prompts = {
        guidelines: `List 6 important recent GI/hepatology clinical practice guidelines from ACG, AGA, ASGE, or AASLD published in 2024-2025. Return ONLY a JSON array. Each item must have: org, year, month, topic, urgency (High|Moderate|Routine), title, summary, url.`,
        articles:   `List 5 high-impact gastroenterology research articles from 2025-2026 in major journals. Return ONLY a JSON array. Each item must have: journal, date, topic, impactLevel (Practice-changing|High Impact|Noteworthy), title, authors, summary, url.`,
        news:       `List 5 important recent GI/hepatology news items from 2025-2026 including FDA approvals and policy changes. Return ONLY a JSON array. Each item must have: source, date, category (FDA Approval|Drug News|Research|Industry|Policy), sentiment (Positive|Neutral|Mixed|Negative), headline, summary, url.`,
      };

      if (!prompts[section]) {
        return res.status(400).json({ error: "Invalid section: " + section });
      }

      console.log("Fetching content for section:", section);

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "web-search-2025-03-05",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: "You are a GI medical information curator. Search the web for current information. Return ONLY a valid JSON array with no markdown, no backticks, no extra text.",
          messages: [{ role: "user", content: prompts[section] }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });

      const data = await response.json();
      console.log("Anthropic status:", response.status);

      if (!response.ok) {
        console.error("Anthropic error:", JSON.stringify(data));
        return res.status(response.status).json({ error: data?.error?.message || "Anthropic error" });
      }

      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      console.log("Response text preview:", text.slice(0, 150));

      const match = text.match(/\[[\s\S]*\]/);
      if (!match) return res.status(500).json({ error: "No JSON array in response", raw: text.slice(0, 300) });

      const parsed = JSON.parse(match[0]);
      return res.status(200).json({ data: parsed, cached: false });
    }

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
          max_tokens: 1000,
          system: "You are a gastroenterology board exam question writer. Return ONLY a valid JSON array. No markdown, no backticks.",
          messages: [{
            role: "user",
            content: `Generate 1 board-style MCQ for a GI fellow on "${topic}" based on current ACG/AGA/ASGE guidelines. Return ONLY a JSON array with 1 object: {"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"..."}`
          }],
        }),
      });

      const data = await response.json();
      console.log("Quiz Anthropic status:", response.status);

      if (!response.ok) {
        console.error("Quiz Anthropic error:", JSON.stringify(data));
        return res.status(response.status).json({ error: data?.error?.message || "Anthropic error" });
      }

      const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
      console.log("Quiz text preview:", text.slice(0, 150));

      let parsed = null;
      try { parsed = JSON.parse(text.trim()); } catch {}
      if (!parsed) { const m = text.match(/\[[\s\S]*\]/); if (m) try { parsed = JSON.parse(m[0]); } catch {} }
      if (!parsed) { const m = text.match(/\{[\s\S]*\}/); if (m) try { parsed = [JSON.parse(m[0])]; } catch {} }

      if (!parsed || !parsed.length) {
        return res.status(500).json({ error: "Could not parse quiz response", raw: text.slice(0, 300) });
      }

      return res.status(200).json({ data: parsed });
    }

    return res.status(400).json({ error: "Invalid type: " + type });

  } catch (err) {
    console.error("Unhandled error:", err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
}