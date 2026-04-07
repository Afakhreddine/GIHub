const PROMPTS = {
  guidelines: `Search for clinical guidelines published by ACG, AGA, ASGE, or AASLD in the current year first, then prior years if needed. For each guideline found, confirm its publication date before including it. Return only the 10 most recently published, sorted newest to oldest. Do not stop searching after finding 10 results — verify that no more recent guidelines exist before finalizing the list. Return ONLY a JSON array. Each item: {"org":"","year":"","month":"","topic":"","urgency":"High|Moderate|Routine","title":"","summary":"1-2 sentences","url":""}`,
  articles: `Search for the 10 most high-impact gastroenterology and hepatology research articles published in the past 4 weeks in the following journals: NEJM, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, AJG, Clinical Gastroenterology and Hepatology, GIE, and Hepatology. Prioritize by study design in this order: RCTs and phase 3 trials first, then large prospective or multicenter cohort studies, then registry-based analyses. Deprioritize review articles and expert opinion pieces unless they represent a major society guideline or care pathway update. To assess impact, cross-reference findings against these three sources before finalizing the list: news.gastro.org (AGA's official newspaper — editorial selection signals clinical relevance), Healio Gastroenterology (healio.com/gastroenterology — tracks clinician reading patterns), Doximity trending articles in gastroenterology (physician peer-sharing signal). For each article, provide: journal, publication date, study design and key finding in 2-3 sentences. Sort by date with most recent first. Confirm publication dates before including — do not include articles outside the 4-week window. Return ONLY a JSON array. Each item: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`,
  news: `Search for the 10 most recent GI and hepatology news items from the past 2 weeks. Include only the following categories: FDA approvals and safety alerts; drug development milestones (phase 2/3 trial results, PDUFA dates, NDA submissions, accelerated approvals, label expansions); health policy and reimbursement changes (CMS, Medicare, Medicaid, ACA); society and conference news (AGA, ACG, ASGE, AASLD meetings, DDW, new tools or resources launched by GI societies). Exclude all primary research articles, journal publications, and study summaries — even if they appear in GI news outlets. Then fetch the full text of each qualifying article individually to confirm its date and category before including it. Only include items with confirmed publication dates within the past 2 weeks. Return ONLY a JSON array. Each item: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
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