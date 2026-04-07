const PROMPTS = {
  guidelines: `Search for clinical guidelines published by ACG, AGA, ASGE, or AASLD in the current year first, then prior years if needed. For each guideline found, confirm its publication date before including it. Return only the 10 most recently published, sorted newest to oldest. Do not stop searching after finding 10 results — verify that no more recent guidelines exist before finalizing the list. Return ONLY a JSON array. Each item: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"1-2 sentences","url":""}`,

  articles: `Search for high-impact gastroenterology and hepatology research articles published in the past 4 weeks in these journals: NEJM, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, American Journal of Gastroenterology, Clinical Gastroenterology and Hepatology, Gastrointestinal Endoscopy, and Hepatology. Return the 10 most impactful results. Prioritize RCTs and phase 3 trials first, then large prospective or multicenter studies, then registry analyses. Sort by publication date, newest first. Confirm each article was published within the past 4 weeks before including it. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences describing study design and key finding","url":""}`,

  news: `Search for recent GI and hepatology news from the past 2 weeks. Include items from these categories: FDA approvals and safety alerts; drug development news (phase 2/3 trial results, PDUFA dates, NDA submissions, accelerated approvals, label expansions); health policy and reimbursement changes (CMS, Medicare, Medicaid); GI society and conference news (AGA, ACG, ASGE, AASLD, DDW). Exclude primary research articles and study summaries. Confirm publication date for each item — only include items from the past 2 weeks. Return 10 items sorted newest first. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
};

export async function fetchSection(section, apiKey) {
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  // Retry up to 3 times with 60s delay on empty results or rate limit
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      console.log(`Retry ${attempt} for ${section} after 60s...`);
      await new Promise(r => setTimeout(r, 60000));
    }

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

    // Retry on rate limit
    if (response.status === 429) {
      console.log(`Rate limited on attempt ${attempt}, retrying...`);
      continue;
    }

    if (!response.ok) throw new Error(JSON.stringify(data?.error));

    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      console.log(`No JSON array on attempt ${attempt}, retrying...`);
      continue;
    }

    const parsed = JSON.parse(match[0]);

    // Retry if empty array returned
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.log(`Empty array on attempt ${attempt}, retrying...`);
      continue;
    }

    console.log(`✓ ${section}: ${parsed.length} items on attempt ${attempt}`);
    return parsed;
  }

  throw new Error(`Failed to get results for ${section} after 3 attempts`);
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