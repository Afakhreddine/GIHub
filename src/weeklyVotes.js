import { articleTarget } from './communityTargets.js';

// Rank only already-published Weekly cards. Missing scores keep the old newest-first order.
export function sortWeeklyByVotes(items, votes = {}) {
  return items.map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const score = item => Number(votes[articleTarget(item)]?.score) || 0;
      return score(b.item) - score(a.item) ||
        (Date.parse(b.item.date) || 0) - (Date.parse(a.item.date) || 0) || a.index - b.index;
    })
    .map(({ item }) => item);
}
