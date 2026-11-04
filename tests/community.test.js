import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp, apiHandlers } from '../app.js';
import { createGihubAuthHandler } from '../api/gihub-auth.js';
import { createCommunityHandler } from '../api/community.js';
import { articleTarget, podcastTarget, quizTarget } from '../src/communityTargets.js';
import weekly from '../src/data/weekly.js';
import podcasts from '../src/data/weeklyPodcasts.js';

const origin = 'https://mygihub.com';
const now = () => 1_800_000_000_000;
const env = { GIHUB_SESSION_SECRET: 'a-test-session-secret-that-is-at-least-thirty-two-chars', ENDOEVAL_AUTH_ORIGIN: 'https://endoeval.com', GIHUB_PUBLIC_ORIGIN: origin, UPSTASH_REDIS_REST_URL: 'https://redis.example.com', UPSTASH_REDIS_REST_TOKEN: 'storage-test-only', GIHUB_COMMUNITY_REVIEW_TOKEN: 'test-review-secret-at-least-thirty-two-characters' };
const profile = { user: { id: 7, email: 'doctor@example.com', name: 'Doctor' }, profile: { username: 'doctor', displayName: 'Dr. Doctor', specialty: '', institution: '', bio: '' } };
const token = `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ exp: 1_800_003_600, id: 7 })).toString('base64url')}.signature`;

function fakeRedis() {
  const strings = new Map();
  const sorted = new Map();
  let writes = 0;
  const fetchImpl = async (url, options) => {
    if (url.startsWith('https://endoeval.com')) {
      return url.endsWith('/login') ? Response.json({ token, user: profile.user }) : Response.json(profile);
    }
    const [command, ...args] = JSON.parse(options.body);
    let result;
    if (command === 'EVAL') {
      const [, , rate, record, index, pending, json, score, id, limit] = args;
      const count = Number(strings.get(rate) || 0) + 1;
      strings.set(rate, String(count));
      result = count > limit ? 0 : 1;
      if (result) {
        strings.set(record, json);
        for (const key of new Set([index, pending])) sorted.set(key, [...(sorted.get(key) || []), { id, score }]);
        writes += 1;
      }
    } else if (command === 'ZREVRANGE' || command === 'ZRANGE') result = [...(sorted.get(args[0]) || [])].sort((a,b)=>command === 'ZRANGE' ? a.score-b.score : b.score-a.score).slice(Number(args[1]), Number(args[2])+1).map(item => item.id);
    else if (command === 'MGET') result = args.map(key => strings.get(key) || null);
    else if (command === 'GET') result = strings.get(args[0]) || null;
    else if (command === 'SET') { strings.set(args[0], args[1]); result = 'OK'; }
    else if (command === 'ZREM') { sorted.set(args[0], (sorted.get(args[0]) || []).filter(item => item.id !== args[1])); result = 1; }
    else throw new Error(`Unexpected Redis ${command}`);
    return Response.json({ result });
  };
  return { fetchImpl, get writes() { return writes; } };
}

async function withServer(run) {
  const redis = fakeRedis();
  const auth = createGihubAuthHandler({ env, fetchImpl: redis.fetchImpl, now, publicOrigin: origin });
  const community = createCommunityHandler({ env, fetchImpl: redis.fetchImpl, now });
  const server = createApp({ ...apiHandlers, community }, { gihubAuthHandler: auth }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await run({ base, redis }); } finally { server.close(); await once(server, 'close'); }
}

const request = (base, path, options = {}) => fetch(`${base}${path}`, { ...options, headers: { Origin: origin, Host: 'mygihub.com', 'X-Forwarded-Proto': 'https', ...options.headers } });
async function login(base) {
  const res = await request(base, '/api/gihub-auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'doctor@example.com', password: 'secret' }) });
  assert.equal(res.status, 200);
  return res.headers.get('set-cookie').split(';', 1)[0];
}
const post = (base, body, cookie, originOverride) => request(base, '/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...(originOverride ? { Origin: originOverride } : {}) }, body: JSON.stringify(body) });
const review = (base, queue, id, status) => request(base, `/api/community?queue=${queue}`, { method: 'PATCH', headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });

test('article contributions require a live account, valid origin and destination; reviewer sees pending items', async () => withServer(async ({ base, redis }) => {
  const payload = { kind: 'submission', destination: 'weekly', description: 'PMID 123456789 from Gut journal' };
  assert.equal((await post(base, payload)).status, 401);
  const cookie = await login(base);
  assert.equal((await post(base, payload, cookie, 'https://evil.example')).status, 403);
  assert.equal((await post(base, { ...payload, destination: 'unknown' }, cookie)).status, 400);
  assert.equal(redis.writes, 0);
  const created = await post(base, payload, cookie);
  assert.equal(created.status, 201);
  const { id } = await created.json();
  assert.equal((await request(base, '/api/community?queue=submissions')).status, 401);
  const queued = await request(base, '/api/community?queue=submissions', { headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}` } });
  assert.equal(queued.status, 200);
  const { items } = await queued.json();
  assert.equal(items[0].description, payload.description);
  assert.equal(items[0].authorId, 7);
  assert.equal((await review(base, 'submissions', id, 'reviewed')).status, 200);
  const cleared = await request(base, '/api/community?queue=submissions', { headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}` } });
  assert.equal((await cleared.json()).items.length, 0);
}));

test('published article, episode and quiz threads stay moderated; unknown and candidate targets rejected', async () => withServer(async ({ base }) => {
  const cookie = await login(base);
  const targets = [articleTarget(weekly[0]), podcastTarget(podcasts[0]), quizTarget('stomach-pathology')];
  for (const target of targets) {
    const created = await post(base, { kind: 'comment', target, body: 'Helpful clinical observation.' }, cookie);
    assert.equal(created.status, 201, target);
    const { id } = await created.json();
    const path = `/api/community?target=${encodeURIComponent(target)}`;
    assert.deepEqual((await (await request(base, path)).json()).items, []);
    assert.equal((await review(base, 'comments', id, 'approved')).status, 200);
    const visible = (await (await request(base, path)).json()).items;
    assert.equal(visible.length, 1);
    assert.equal(visible[0].authorName, 'Dr. Doctor');
    assert.equal(visible[0].body, 'Helpful clinical observation.');
    assert.equal(visible[0].authorId, undefined);
  }
  assert.equal((await post(base, { kind: 'comment', target: 'article:pmid:fake', body: 'Test' }, cookie)).status, 400);
  assert.equal((await request(base, '/api/community?target=podcast%3Afake')).status, 400);
}));

test('community request body is bounded and never silently accepts oversized payloads', async () => withServer(async ({ base }) => {
  const cookie = await login(base);
  const result = await post(base, { kind: 'submission', destination: 'weekly', description: 'a'.repeat(12000) }, cookie);
  assert.equal(result.status, 413);
  assert.equal(result.headers.get('cache-control'), 'no-store');
}));
