// One society per call — no timeouts possible
// Usage:
//   ?society=ASGE   — fetch ASGE guidelines and add to repo
//   ?society=AASLD  — fetch AASLD guidelines and add to repo
//   ?society=AGA    — fetch AGA guidelines and add to repo
//   ?society=ACG    — fetch ACG guidelines and add to repo
//   ?reset=true     — clear the repo
//   (no params)     — weekly update: checks new/updated for all 4 societies one at a time

const REPO_KEY = "gihub:guidelines:repo";

const JSON_SCHEMA = `{"org":"ACG|AGA|ASGE|AASLD","year":"YYYY","month":"full month name","topic":"short topic","urgency":"High|Moderate|Routine","title":"full title","summary":"1-2 sentences","url":"direct link"}`;

const INIT_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and extract ALL clinical practice guidelines and quality indicator documents listed, including both "Guidelines" and "Quality in Endoscopy" sections, published from 2000 to present. For each document, search PubMed (https://pubmed.ncbi.nlm.nih.gov/?term={title}+ASGE+Gastrointestinal+Endoscopy) to find its PMID, then use https://pubmed.ncbi.nlm.nih.gov/{PMID}/ as the url field. Confirm the publication year from PubMed. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/practice-guidelines and extract ALL clinical practice guidelines listed by disease topic, published from 2000 to present. Confirm publication year for each. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AGA:   `Fetch all 4 pages of this PubMed search (use &page=1, &page=2, &page=3, &page=4 with &size=200): https://pubmed.ncbi.nlm.nih.gov/?term=%28%22Gastroenterology%22%5BJournal%5D%29+AND+%28Guideline%5BPublication+Type%5D%29&size=200&page=1. From all pages combined, collect the title and PMID for each result. Include ONLY articles whose title contains the word "Guideline" or the phrase "Clinical Practice", and exclude articles from non-AGA organizations (e.g. Canadian Association, Multi-Society Task Force). For each included article, fetch its abstract page at https://pubmed.ncbi.nlm.nih.gov/{PMID}/ and use the abstract text to write a 1-2 sentence summary. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  ACG:   `Fetch https://gi.org/guidelines and extract ALL ACG clinical guidelines and clinical practice updates published from 2000 to present. Confirm the publication year for each. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
};

const UPDATE_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and identify any documents listed under "Newly Published" or published in the past 7 days. For each new document, search PubMed (https://pubmed.ncbi.nlm.nih.gov/?term={title}+ASGE+Gastrointestinal+Endoscopy) to find its PMID, then use https://pubmed.ncbi.nlm.nih.gov/{PMID}/ as the url field. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/news and identify any new or updated AASLD practice guidelines in the past 7 days. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AGA:   `Fetch this PubMed search which filters for AGA guidelines published in the past 7 days: https://pubmed.ncbi.nlm.nih.gov/?term=%28%22Gastroenterology%22%5BJournal%5D%29+AND+%28Guideline%5BPublication+Type%5D%29&datetype=pdat&reldate=7. Include ONLY articles whose title contains "Guideline" or "Clinical Practice", and exclude non-AGA organizations. For any results found, fetch the abstract at https://pubmed.ncbi.nlm.nih.gov/{PMID}/ and use it to write a 1-2 sentence summary. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  ACG:   `Check https://gi.org/guidelines and https://www.guidelinecentral.com/guidelines/acg/ for new ACG guidelines in the past 7 days. Return ONLY a JSON array ([] if none). Each item: ${JSON_SCHEMA}`,
};

// ── REDIS ─────────────────────────────────────────────────────────────────────
const rh = () => ({ Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` });
const ru = p => `${process.env.UPSTASH_REDIS_REST_URL}${p}`;

async function redisGet(key) {
  const res = await fetch(ru(`/get/${key}`), { headers: rh() });
  const json = await res.json();
  if (!json.result) return null;
  let val = json.result;
  for (let i = 0; i < 3; i++) {
    if (typeof val !== "string") break;
    try { val = JSON.parse(val); } catch { break; }
  }
  return val;
}

async function redisSet(key, value) {
  const res = await fetch(ru(`/set/${key}`), {
    method: "POST",
    headers: { ...rh(), "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`Redis set failed: ${await res.text()}`);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
const MONTHS = {january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12};

function sortNewestFirst(arr) {
  return [...arr].sort((a, b) => {
    const aD = parseInt(a.year||0)*100 + (MONTHS[a.month?.toLowerCase()]||0);
    const bD = parseInt(b.year||0)*100 + (MONTHS[b.month?.toLowerCase()]||0);
    return bD - aD;
  });
}

// ── DEDUP ─────────────────────────────────────────────────────────────────────
// Two guidelines are duplicates if they share ANY identity token. Each entry
// gets the strongest signal available; the title fallback is only used when no
// stronger identifier exists, to avoid collapsing distinct publications that
// happen to share an org/year/title-prefix:
//   1. pmid:   PubMed ID. Globally unique per publication, never reused.
//   2. pii:    Journal article identifier (e.g. S0016-5085(25)06013-5).
//   3. url:    Canonical URL bound to year. Year-bound so revisions of
//              "living guidelines" at a stable society URL across years are
//              kept as separate entries.
//   4. title:  Org + year + normalized title prefix. Used ONLY when none of
//              the above are present — typically entries whose `url` is a
//              society index page (gi.org/guidelines etc).
const INDEX_URLS = new Set([
  "gi.org/guidelines",
  "gastro.org/clinical-guidance",
  "asge.org/home/resources/publications/guidelines",
  "aasld.org/practice-guidelines",
]);

const TITLE_STOPWORDS = /\b(the|a|an|on|of|in|for|and|or|with|to)\b/g;

export function normalizeUrl(raw) {
  if (!raw) return "";
  return raw.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");
}

export function isIndexUrl(url) {
  return INDEX_URLS.has(url) || url.includes("guidelinecentral.com");
}

function normalizeTitle(title) {
  return (title || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(TITLE_STOPWORDS, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function identityTokens(g) {
  const tokens = [];
  const url = normalizeUrl(g.url);

  const pmidMatch = url.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/);
  if (pmidMatch) tokens.push(`pmid:${pmidMatch[1]}`);

  const piiMatch = url.match(/(s\d{4}-\d{4}\(\d{2}\)\d+-[\dx])/i);
  if (piiMatch) tokens.push(`pii:${piiMatch[1].toLowerCase()}`);

  if (url && !isIndexUrl(url)) {
    tokens.push(`url:${url}|${g.year || ""}`);
  }

  if (tokens.length === 0) {
    const norm = normalizeTitle(g.title);
    if (norm) {
      tokens.push(`title:${(g.org || "").toUpperCase()}|${g.year || ""}|${norm}`);
    }
  }

  return tokens;
}

export function dedupByIdentity(arr) {
  const seen = new Set();
  return arr.filter(g => {
    const tokens = identityTokens(g);
    if (tokens.length === 0) return false;
    if (tokens.some(t => seen.has(t))) return false;
    tokens.forEach(t => seen.add(t));
    return true;
  });
}

async function claudeFetch(prompt, apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-search-2025-03-05",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 32000,
      system: "You are a GI medical guideline curator. Fetch and search the web thoroughly. Your entire response must be a single valid JSON array starting with '[' and ending with ']'. No preamble, no explanation, no markdown, no backticks — only the JSON array.",
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data?.error));
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  // Try complete array first; if truncated, close it and parse what we have
  const fullMatch = text.match(/\[[\s\S]*\]/);
  if (fullMatch) return JSON.parse(fullMatch[0]);
  const partialMatch = text.match(/\[[\s\S]*/);
  if (partialMatch) {
    try {
      const repaired = partialMatch[0].replace(/,\s*$/, "") + "]";
      return JSON.parse(repaired);
    } catch { /* fall through */ }
  }
  throw new Error(`No JSON array: ${text.slice(0, 200)}`);
}

// ── HANDLER ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // ?dedup=true — remove duplicates from the repo and report
  if (req.query?.dedup === "true") {
    const existing = (await redisGet(REPO_KEY)) || [];
    const after = dedupByIdentity(existing);
    const removed = existing.length - after.length;
    if (removed > 0) {
      await redisSet(REPO_KEY, sortNewestFirst(after));
    }
    return res.status(200).json({ ok: true, action: "dedup", before: existing.length, after: after.length, removed });
  }

  // ?fixlinks=ASGE — re-resolve PubMed URLs for all existing entries from a given org
  if (req.query?.fixlinks) {
    const org = req.query.fixlinks.toUpperCase();
    const existing = (await redisGet(REPO_KEY)) || [];
    const targets = existing.filter(g => g.org?.toUpperCase() === org && !g.url?.includes("pubmed"));
    console.log(`fixlinks: ${targets.length} ${org} entries without PubMed URLs`);
    if (targets.length === 0) {
      return res.status(200).json({ ok: true, action: "fixlinks", org, scanned: 0, fixed: 0 });
    }
    const titleList = targets.map((g, i) => `${i}: ${g.title} (${g.year})`).join("\n");
    const data = await claudeFetch(
      `For each of the following ${org} clinical guidelines, search PubMed to find its PMID. ` +
      `Return a JSON array with one object per guideline in the same order, each with: ` +
      `{"index": <number>, "url": "https://pubmed.ncbi.nlm.nih.gov/<PMID>/"}. ` +
      `If you cannot find a PMID for an entry, use an empty string for url.\n\n${titleList}`,
      apiKey
    );
    let fixed = 0;
    for (const item of (data || [])) {
      const i = item.index;
      if (typeof i === "number" && targets[i] && item.url?.includes("pubmed")) {
        targets[i].url = item.url;
        fixed++;
      }
    }
    const merged = sortNewestFirst(dedupByIdentity(existing));
    if (fixed > 0) await redisSet(REPO_KEY, merged);
    return res.status(200).json({ ok: true, action: "fixlinks", org, scanned: targets.length, fixed });
  }

  // ?reset=true — clear the repo
  if (req.query?.reset === "true") {
    await redisSet(REPO_KEY, []);
    return res.status(200).json({ ok: true, action: "reset", message: "Repository cleared. Now fetch each society: ?society=ASGE, ?society=AASLD, ?society=AGA, ?society=ACG" });
  }

  // ?society=X — fetch one specific society
  const society = req.query?.society?.toUpperCase();
  if (society) {
    if (!INIT_PROMPTS[society]) {
      return res.status(400).json({ error: `Unknown society. Use: ASGE, AASLD, AGA, or ACG` });
    }
    try {
      console.log(`Fetching ${society}...`);
      const fetched = await claudeFetch(INIT_PROMPTS[society], apiKey);
      const existing = (await redisGet(REPO_KEY)) || [];
      const merged = sortNewestFirst(dedupByIdentity([...existing, ...fetched]));
      await redisSet(REPO_KEY, merged);
      console.log(`✓ ${society}: ${fetched.length} items. Repo total: ${merged.length}`);
      return res.status(200).json({ ok: true, society, fetched: fetched.length, repoTotal: merged.length });
    } catch (e) {
      console.error(`✗ ${society}:`, e.message);
      return res.status(500).json({ ok: false, society, error: e.message });
    }
  }

  // Default: weekly update — checks all 4 for new guidelines (past 60 days)
  const existing = (await redisGet(REPO_KEY)) || [];
  console.log(`Weekly update starting. Repo has ${existing.length} existing guidelines.`);
  const results = {};
  const errors = {};
  let newCount = 0;

  for (const [soc, prompt] of Object.entries(UPDATE_PROMPTS)) {
    try {
      console.log(`  Checking ${soc}...`);
      const fetched = await claudeFetch(prompt, apiKey);
      results[soc] = fetched.length;
      newCount += fetched.length;
      if (fetched.length > 0) existing.push(...fetched);
      console.log(`  ✓ ${soc}: ${fetched.length} new`);
    } catch (e) {
      errors[soc] = e.message;
      console.error(`  ✗ ${soc}:`, e.message);
    }
  }

  if (newCount > 0) {
    const merged = sortNewestFirst(dedupByIdentity(existing));
    await redisSet(REPO_KEY, merged);
    console.log(`✓ Repo updated: ${merged.length} total guidelines (+${newCount} new)`);
  } else {
    console.log(`No new guidelines found. Repo unchanged at ${existing.length}.`);
  }

  return res.status(200).json({ ok: true, action: "weekly-update", newGuidelines: newCount, results, errors });
}
