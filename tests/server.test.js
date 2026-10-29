import test from 'node:test';
import assert from 'node:assert/strict';
import { loadApiHandlers } from '../server.js';

test('server mounts the site and review api handlers and skips helper modules', async () => {
  const handlers = await loadApiHandlers();
  assert.deepEqual(Object.keys(handlers).sort(), [
    'claude',
    'schedule-review-data',
    'schedule-review-publish',
    'weekly-review-data',
    'weekly-review-publish',
  ]);
});

test('retired standalone quiz generation is no longer served', async () => {
  const handlers = await loadApiHandlers();
  let status = null;
  let body = null;
  const res = {
    setHeader() {},
    status(code) { status = code; return this; },
    json(value) { body = value; return this; },
    end() { return this; },
  };
  await handlers.claude({ method:'POST', body:{ type:'quiz', topic:'IBD' }, headers:{} }, res);
  assert.equal(status, 400);
  assert.match(body.error, /Invalid type/);
});
