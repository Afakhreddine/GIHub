export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { system, prompt, useSearch } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const body = {
      model: "claude-sonnet-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    };

    if (system) body.system = system;

    if (useSearch) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }

    const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
    console.log("API key present:", !!apiKey, "length:", apiKey?.length, "prefix:", apiKey?.slice(0,10));

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-search-2025-03-05",
    };

    console.log("Calling Anthropic API, useSearch:", useSearch);

    // Retry up to 2 times on 429
    let response, data;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      data = await response.json();
      if (response.status !== 429) break;
      const wait = (attempt + 1) * 3000;
      console.log(`429 rate limit, retrying in ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
    }

    if (!response.ok) {
      console.error("Anthropic status:", response.status);
      console.error("Anthropic error body:", JSON.stringify(data));
      return res.status(response.status).json({ error: data });
    }

    // Extract all text blocks, including after tool use
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    console.log("Raw response length:", text.length);
    console.log("Raw response preview:", text.slice(0, 200));

    if (!text) {
      console.error("Empty text from API. Full content:", JSON.stringify(data.content));
      return res.status(500).json({ error: "Empty response from Claude" });
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error("Handler exception:", err);
    return res.status(500).json({ error: err.message });
  }
}