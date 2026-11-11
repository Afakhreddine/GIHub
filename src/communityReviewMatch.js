// A PMID identifies a real record, not necessarily the contributor's intended study.
export function validCommunitySource(item) {
  if (item?.sourceRepository !== "community-suggestion") return true;
  const pmid = String(item.pmid || "");
  if (!/^\d{6,9}$/.test(pmid) || !["confirmed", "provisional"].includes(item.matchStatus) || !item.suggestionId) return false;
  try {
    const url = new URL(item.studyUrl || item.url || "");
    return url.protocol === "https:" && url.hostname === "pubmed.ncbi.nlm.nih.gov" && url.pathname === `/${pmid}/` && !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function validCommunityApprovals(items, decisions, idForItem) {
  const selected = new Set();
  for (const [index, item] of items.entries()) {
    if (decisions[idForItem(item, index)] !== "Approve" || item.sourceRepository !== "community-suggestion") continue;
    if (!validCommunitySource(item) || selected.has(item.suggestionId)) return false;
    selected.add(item.suggestionId);
  }
  return true;
}
