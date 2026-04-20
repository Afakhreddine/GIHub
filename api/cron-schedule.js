// After popping slug, before saving to Redis:

// 1. Load the guidelines repo from Redis
async function redisGet(key) {
  const res = await fetch(`${redisBase()}/get/${encodeURIComponent(key)}`, { headers: redisHdrs() });
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

// 2. Pick best guideline via Haiku
async function pickGuideline(topicSlug, topicLabel, apiKey) {
  const repo = await redisGet("gihub:guidelines:repo");
  if (!Array.isArray(repo) || repo.length === 0) return [];
  
  const repoSummary = repo.map((g, i) =>
    `${i}: [${g.org} ${g.year}] ${g.topic} — ${g.title}`
  ).join("\n");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 10,
      messages: [{
        role: "user",
        content: `Which guideline index (0-${repo.length - 1}) is most relevant to a GI lecture on "${topicLabel}"? Reply with only the number.\n\n${repoSummary}`,
      }],
    }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
  const idx = parseInt(text, 10);
  return (!isNaN(idx) && idx >= 0 && idx < repo.length) ? [repo[idx]] : [];
}
