import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../app.js';
import { createGihubAuthHandler } from '../api/gihub-auth.js';

const ORIGIN = 'https://mygihub.com';
const NOW = 1_800_000_000_000;
const REVIEW_TOKEN = 'review-only-secret-at-least-thirty-two-characters';
const env = {
  GIHUB_SESSION_SECRET: 'test-only-session-secret-that-is-at-least-thirty-two-characters',
  ENDOEVAL_AUTH_ORIGIN: 'https://endoeval.com',
  UPSTASH_REDIS_REST_URL: 'https://redis.invalid',
  UPSTASH_REDIS_REST_TOKEN: 'test-redis-secret',
  GIHUB_COMMUNITY_REVIEW_TOKEN: REVIEW_TOKEN,
};
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = () => `${encode({ alg: 'HS256' })}.${encode({ exp: NOW / 1000 + 3600, id: 7, email: 'doctor@example.com' })}.signature`;

async function withAuth(fetchImpl, fn) {
  const handler = createGihubAuthHandler({ fetchImpl, env, now: () => NOW, publicOrigin: ORIGIN });
  const server = createApp(undefined, { gihubAuthHandler: handler }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await fn(`http://127.0.0.1:${server.address().port}`); }
  finally { server.close(); await once(server, 'close'); }
}

function request(base, route, options = {}) {
  return fetch(`${base}/api/gihub-auth/${route}`, {
    ...options,
    headers: { Origin: ORIGIN, Host: 'mygihub.com', 'Content-Type': 'application/json', ...options.headers },
  });
}

const login = (base, password = 'example-password') => request(base, 'login', {
  method: 'POST', body: JSON.stringify({ email:'doctor@example.com', password }),
});

function fakeUpstream(redisResult = 1) {
  const calls = [];
  const fetchImpl = async (url, options) => {
    if (String(url).endsWith('/api/auth/login')) return Response.json({ token: jwt(), user: { id:7, email:'doctor@example.com', name:'Doctor Example' } });
    if (url === env.UPSTASH_REDIS_REST_URL) {
      const command = JSON.parse(options.body);
      calls.push(command);
      if (command[0] === 'EVAL') return Response.json({ result:redisResult });
      if (command[0] === 'ZREVRANGE') return Response.json({ result:[] });
    }
    throw new Error('Unexpected upstream call');
  };
  return { fetchImpl, calls };
}

test('successful GIHub login creates a durable, bounded audit event without secrets', async () => {
  const store = fakeUpstream();
  await withAuth(store.fetchImpl, async base => {
    const response = await login(base);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('set-cookie'), /HttpOnly/);
  });
  assert.equal(store.calls.length, 1);
  assert.equal(store.calls[0][0], 'EVAL');
  assert.match(store.calls[0][1], /redis\.call\('SET'.*'EX'/);
  assert.match(store.calls[0][4], /^gihub:auth:login-event:[a-f0-9-]+$/);
  assert.match(JSON.stringify(store.calls[0]), /doctor@example\.com/);
  assert.doesNotMatch(JSON.stringify(store.calls[0]), /example-password|signature|test-only-session-secret|test-redis-secret/);
});

test('audit storage failure does not issue an unrecorded GIHub session', async () => {
  const store = fakeUpstream(null);
  await withAuth(store.fetchImpl, async base => {
    const response = await login(base);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('login history is not exposed through a public API', async () => {
  const store = fakeUpstream();
  await withAuth(store.fetchImpl, async base => {
    const response = await request(base, 'login-history', { headers:{ Authorization:`Bearer ${REVIEW_TOKEN}` } });
    assert.equal(response.status, 404);
    assert.equal(store.calls.length, 0);
  });
});
