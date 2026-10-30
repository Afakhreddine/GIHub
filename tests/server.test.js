import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
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
    'gihub-auth',
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

test('Vercel rewrites each same-origin GIHub auth endpoint to the auth function', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  const rewriteMap = new Map(config.rewrites.map(({ source, destination }) => [source, destination]));
  for (const action of ['login', 'logout', 'me', 'profile']) {
    assert.equal(rewriteMap.get(`/api/gihub-auth/${action}`), `/api/gihub-auth?action=${action}`);
  }
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
