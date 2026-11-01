import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { apiHandlers } from '../app.js';

test('every api/*.js handler is mounted, and helper modules are not', async () => {
  const withHandlers = [];
  for (const file of await readdir(new URL('../api/', import.meta.url))) {
    if (!file.endsWith('.js')) continue;
    const mod = await import(`../api/${file}`);
    if (typeof mod.default === 'function') withHandlers.push(file.slice(0, -3));
  }
  assert.deepEqual(Object.keys(apiHandlers).sort(), withHandlers.sort());
  assert.deepEqual(Object.keys(apiHandlers).sort(), [
    'claude',
    'schedule-review-data',
    'schedule-review-publish',
    'weekly-review-data',
    'weekly-review-publish',
  ]);
});

test('app.js loads through require(), as Hostinger\'s lsnode loader does', () => {
  // ERR_REQUIRE_ASYNC_MODULE here means top-level await crept into the graph.
  const require = createRequire(import.meta.url);
  const mod = require('../app.js');
  assert.equal(typeof mod.createApp, 'function');
});

test('retired standalone quiz generation is no longer served', async () => {
  let status = null;
  let body = null;
  const res = {
    setHeader() {},
    status(code) { status = code; return this; },
    json(value) { body = value; return this; },
    end() { return this; },
  };
  await apiHandlers.claude({ method:'POST', body:{ type:'quiz', topic:'IBD' }, headers:{} }, res);
  assert.equal(status, 400);
  assert.match(body.error, /Invalid type/);
});
