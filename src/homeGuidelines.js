// The published guideline repository records publication month/year (not an exact day).
// Keep original order for guidelines within the same month.
export function recentGuidelines(items, limit = 3) {
  return items
    .map((item, index) => ({ item, index, date: Date.parse(`${item.month} 1, ${item.year}`) }))
    .filter(({ item, date }) => item.title && /^https?:\/\//i.test(item.url || '') && Number.isFinite(date))
    .sort((a, b) => b.date - a.date || a.index - b.index)
    .slice(0, limit)
    .map(({ item }) => item);
}
