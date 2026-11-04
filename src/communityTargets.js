// Stable across Weekly -> Weekly archive and the same article on the Schedule.
export function articleTarget(item) {
  const doi = String(item?.doi || '').trim().toLowerCase().replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '');
  if (doi) return `article:doi:${doi}`;
  const pmid = String(item?.pmid || '').trim();
  if (/^\d+$/.test(pmid)) return `article:pmid:${pmid}`;
  const title = String(item?.title || item?.headline || '').trim().toLowerCase().replace(/\s+/g, ' ');
  return title ? `article:title:${encodeURIComponent(title)}` : '';
}

export function podcastTarget(podcast) { return podcast?.id ? `podcast:${podcast.id}` : ''; }
export function quizTarget(slug) { return slug ? `quiz:${slug}` : ''; }
