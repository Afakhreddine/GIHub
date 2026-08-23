// Shared guideline identity helpers used by repo-managed data validation tests.
// The old API cron updater was removed when guidelines moved to Hermes/GitHub PRs.

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
