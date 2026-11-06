import test from 'node:test';
import assert from 'node:assert/strict';
import { sortWeeklyByVotes } from '../src/weeklyVotes.js';
import { articleTarget } from '../src/communityTargets.js';

test('weekly articles rank by net votes, preserving newest-first order on ties and leaving inputs untouched', () => {
  const items = [
    { pmid: '11111', date: '2026-11-04' },
    { pmid: '22222', date: '2026-11-03' },
    { pmid: '33333', date: '2026-11-02' },
  ];
  const votes = { [articleTarget(items[1])]: { score: 3 }, [articleTarget(items[2])]: { score: 3 }, [articleTarget(items[0])]: { score: -1 } };
  assert.deepEqual(sortWeeklyByVotes(items, votes).map(item => item.pmid), ['22222', '33333', '11111']);
  assert.deepEqual(sortWeeklyByVotes(items, {}).map(item => item.pmid), ['11111', '22222', '33333']);
  assert.deepEqual(items.map(item => item.pmid), ['11111', '22222', '33333']);
});
