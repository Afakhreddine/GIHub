const PROMPTS = {
  guidelines: `Search the web for the 6 most recent clinical practice guidelines from ACG, AGA, ASGE, or AASLD in gastroenterology/hepatology published in 2024-2025. Return ONLY a JSON array. Each item: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"1-2 sentences","url":""}`,
  articles:   `Search the web for 5 high-impact gastroenterology research articles published in the past 4 weeks in Gastroenterology, AJG, Gut, NEJM, or Lancet. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"1-2 sentences","url":""}`,
  news:       `Search the web for 5 recent gastroenterology/hepatology news items from the past 2 weeks including FDA approvals and policy changes. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
};

export async function fetchSection(section, apiKey) {
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
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
      system: "You are a GI medical curator. Search the web and return ONLY a valid JSON array. No markdown, no backticks, no extra text.",
      messages: [{ role: "user", content: PROMPTS[section] }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`No JSON array in response: ${text.slice(0, 200)}`);
  return JSON.parse(match[0]);
}

export async function redisSet(key, value) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(value)),
  });
  if (!res.ok) throw new Error(`Redis set failed: ${await res.text()}`);
}