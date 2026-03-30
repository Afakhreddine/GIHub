// api/claude.js
// Handles two jobs:
//   POST { type: "content", section: "guidelines"|"articles"|"news" }
//     → returns cached content if fresh (<24h), otherwise fetches via web search
//   POST { type: "quiz", topic: string }
//     → generates a single MCQ using Claude (no web search)

const CACHE = {};   // In-memory cache: { [section]: { data, fetchedAt } }
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const SECTION_PROMPTS = {
  guidelines: `You are a GI medical curator. Using your knowledge up to your training cutoff plus any available information, list the 6 most important recent clinical practice guidelines from ACG, AGA, ASGE, or AASLD in gastroenterology/hepatology from 2024-2025. Return ONLY a JSON array. Each item: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"1-2 sentence summary","url":""}`,
  articles:   `You are a GI medical curator. List 5 high-impact gastroenterology research articles from top journals (Gastroenterology, AJG, Gut, NEJM, Lancet) published in 2025-2026. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"1-2 sentence summary","url":""}`,
  news:       `You are a GI medical curator. List 5 important recent gastroenterology and hepatology news items from 2025-2026 including FDA approvals, drug news, policy changes. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentence summary","url":""}`,
};

const QUIZ_SYSTEM = `You are a gastroenterology board exam question writer. Output ONLY a valid JSON array with one object. No markdown, no backticks, no preamble.`;

async function callAnthropic(system, userPrompt, apiKey, useWebSearch = false) {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
  };

  const body = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: userPrompt }],
  };

  if (useWebSearch) {
    headers["anthropic-beta"] = "web-search-2025-03-05";
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    body.model = "claude-sonnet-4-20250514"; // Web search needs Sonnet
    body.max_tokens = 2000;
  }

  // Retry up to 3 times on 429
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.status === 429) {
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 5000));
        continue;
      }
    }
    if (!res.ok) throw new Error(JSON.stringify(data?.error || data));
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return text;
  }
}

function extractJSON(raw) {
  if (!raw) throw new Error("Empty response");
  // Try direct parse
  try { return JSON.parse(raw.trim()); } catch {}
  // Extract array
  const arrMatch = raw.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch {} }
  // Extract object and wrap
  const objMatch = raw.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return [JSON.parse(objMatch[0])]; } catch {} }
  // Strip backticks
  const clean = raw.replace(/```json|```/gi, "").trim();
  try { return JSON.parse(clean); } catch {}
  throw new Error("Could not parse JSON from: " + raw.slice(0, 200));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const { type, section, topic } = req.body;

  try {
    // ── CONTENT (guidelines / articles / news) ──────────────────────────────
    if (type === "content") {
      if (!SECTION_PROMPTS[section]) return res.status(400).json({ error: "Invalid section" });

      // Return cache if fresh
      const cached = CACHE[section];
      const now = Date.now();
      if (cached && (now - cached.fetchedAt) < CACHE_TTL_MS) {
        console.log(`Serving cached ${section}, age: ${Math.round((now - cached.fetchedAt) / 60000)}min`);
        return res.status(200).json({ data: cached.data, cached: true, fetchedAt: cached.fetchedAt });
      }

      // Fetch fresh via web search
      console.log(`Fetching fresh ${section} via web search...`);
      const raw = await callAnthropic(
        "You are a GI medical information curator. Search the web for current information. Return ONLY a valid JSON array. No markdown, no backticks, no preamble.",
        SECTION_PROMPTS[section],
        apiKey,
        true  // useWebSearch
      );

      const data = extractJSON(raw);
      if (!Array.isArray(data) || data.length === 0) throw new Error("Empty or invalid data returned");

      CACHE[section] = { data, fetchedAt: now };
      console.log(`Cached fresh ${section}: ${data.length} items`);
      return res.status(200).json({ data, cached: false, fetchedAt: now });
    }

    // ── QUIZ ────────────────────────────────────────────────────────────────
    if (type === "quiz") {
      if (!topic) return res.status(400).json({ error: "Missing topic" });

      const prompt = `Generate 1 board-style MCQ for a GI fellow on "${topic}" based on ACG/AGA/ASGE guidelines. Return ONLY a JSON array with 1 object: {"question":"clinical vignette","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A|B|C|D","explanation":"guideline-based explanation"}`;

      const raw = await callAnthropic(QUIZ_SYSTEM, prompt, apiKey, false);
      const data = extractJSON(raw);
      if (!Array.isArray(data) || data.length === 0) throw new Error("Invalid quiz response");

      return res.status(200).json({ data });
    }

    return res.status(400).json({ error: "Invalid request type" });

  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}