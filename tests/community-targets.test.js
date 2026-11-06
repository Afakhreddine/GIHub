import test from 'node:test';
import assert from 'node:assert/strict';
import { guidelineTarget, lectureTarget } from '../src/communityTargets.js';

test('the same guideline retains its thread across Home, Guidelines, and Schedule', () => {
  const home = { org: 'AGA', year: '2026', title: ' Crohn Disease  ' };
  const section = { org: 'AGA', year: 2026, title: 'Crohn   Disease', url: 'https://journal.example/updated' };
  assert.equal(guidelineTarget(home), guidelineTarget(section));
  assert.notEqual(guidelineTarget(home), guidelineTarget({ ...section, year: 2025 }));
  assert.notEqual(guidelineTarget(home), guidelineTarget({ ...section, org: 'ACG' }));
  assert.equal(guidelineTarget({ title: '' }), '');
});

test('the lecture thread is tied to a stable published slug', () => {
  assert.equal(lectureTarget('appendix-and-anus-pathology'), 'lecture:appendix-and-anus-pathology');
  assert.equal(lectureTarget(''), '');
});
