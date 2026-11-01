import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizePrChecks, loadPrChecksState } from '../src/githubChecks.js';

const noStatuses = { state:'pending', total_count:0, statuses:[] };
const run = (status, conclusion = null) => ({ status, conclusion });

test('no statuses and no check runs is pending, never success', () => {
  assert.equal(summarizePrChecks(noStatuses, { check_runs:[] }), 'pending');
});

test('GitHub Actions check runs alone can make a PR publishable', () => {
  assert.equal(summarizePrChecks(noStatuses, { check_runs:[run('completed', 'success')] }), 'success');
  assert.equal(summarizePrChecks(noStatuses, { check_runs:[run('completed', 'success'), run('completed', 'skipped')] }), 'success');
});

test('running or failed check runs block publishing', () => {
  assert.equal(summarizePrChecks(noStatuses, { check_runs:[run('in_progress')] }), 'pending');
  assert.equal(summarizePrChecks(noStatuses, { check_runs:[run('completed', 'success'), run('completed', 'failure')] }), 'failure');
});

test('legacy commit statuses (Vercel previews) still count', () => {
  assert.equal(summarizePrChecks({ state:'success', total_count:1 }, { check_runs:[] }), 'success');
  assert.equal(summarizePrChecks({ state:'pending', total_count:1 }, { check_runs:[run('completed', 'success')] }), 'pending');
  assert.equal(summarizePrChecks({ state:'failure', total_count:1 }, { check_runs:[run('completed', 'success')] }), 'failure');
});

test('loadPrChecksState queries both GitHub endpoints for the head sha', async () => {
  const paths = [];
  const fakeFetch = async (config, path) => {
    paths.push(path);
    return path.includes('check-runs') ? { check_runs:[run('completed', 'success')] } : noStatuses;
  };
  assert.equal(await loadPrChecksState(fakeFetch, {}, 'abc123'), 'success');
  assert.deepEqual(paths.sort(), ['/commits/abc123/check-runs?per_page=100', '/commits/abc123/status']);
});
