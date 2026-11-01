import { KNOWN_BROKEN_GUIDELINE_URLS } from "./data/knownBrokenGuidelineUrls.js";

const GENERIC_INDEX_URLS = new Set([
  "https://gi.org/guidelines",
  "https://gastro.org/clinical-guidance",
  "https://www.asge.org/home/resources/publications/guidelines",
  "https://www.aasld.org/practice-guidelines",
]);

/** Preserve specific sources; never silently send a card to an unrelated society homepage. */
export function resolveGuidelineLink(item) {
  const url = item.url?.trim();
  const isIndex = url && (GENERIC_INDEX_URLS.has(url.replace(/\/$/, "")) ||
    /\/pages\/default\.aspx(?:\?.*)?$/i.test(url) ||
    /^https:\/\/journals\.lww\.com\/[^/]+\/?$/i.test(url));
  if (url && !isIndex && !KNOWN_BROKEN_GUIDELINE_URLS.has(url)) {
    return { url, label: "View source ↗" };
  }
  if (item.title) {
    // A specific search is honest about uncertainty; it is not a verified one-to-one citation.
    return {
      url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(item.title)}`,
      label: "Search PubMed for source ↗",
    };
  }
  return { url: null, label: "Source unavailable" };
}
