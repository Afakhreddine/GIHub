import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import crypto from 'node:crypto';
import { createApp, apiHandlers } from '../app.js';
import { createGihubAuthHandler } from '../api/gihub-auth.js';
import { createCommunityHandler } from '../api/community.js';
import { articleTarget, podcastTarget, quizTarget } from '../src/communityTargets.js';
import weekly from '../src/data/weekly.js';
import { isPublicApprovedResource } from '../src/scheduleResourcesModel.js';
import podcasts from '../src/data/weeklyPodcasts.js';
import { itemKey, targetKey } from '../src/communityStore.js';

const origin = 'https://mygihub.com';
const now = () => 1_800_000_000_000;
const env = { GIHUB_SESSION_SECRET: 'a-test-session-secret-that-is-at-least-thirty-two-chars', ENDOEVAL_AUTH_ORIGIN: 'https://endoeval.com', GIHUB_PUBLIC_ORIGIN: origin, UPSTASH_REDIS_REST_URL: 'https://redis.example.com', UPSTASH_REDIS_REST_TOKEN: 'storage-test-only', GIHUB_COMMUNITY_REVIEW_TOKEN: 'test-review-secret-at-least-thirty-two-characters' };
const profile = { user: { id: 7, email: 'doctor@example.com', name: 'Doctor' }, profile: { username: 'doctor', displayName: 'Dr. Doctor', specialty: '', institution: '', bio: '' } };
const token = `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ exp: 1_800_003_600, id: 7 })).toString('base64url')}.signature`;

function sameSignals(a, b) {
  if (a.doi && b.doi) return a.doi === b.doi;
  if (a.pmid && b.pmid) return a.pmid === b.pmid;
  if (a.exact === b.exact) return true;
  if (a.tokens.length < 5 || b.tokens.length < 5) return false;
  const shared = b.tokens.filter(word => a.tokens.includes(word)).length;
  return shared >= 5 && shared / Math.min(a.tokens.length, b.tokens.length) >= 0.8 && shared / Math.max(a.tokens.length, b.tokens.length) >= 0.7;
}

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
    if (command === 'EVAL' && args[1] === '3') {
      const [, , record, pending, thread, status, reviewedAt, id, kind] = args;
      const item = strings.has(record) ? JSON.parse(strings.get(record)) : null;
      if (!item) result = null;
      else if (item.status === 'rejected' && status !== 'rejected') result = -1;
      else {
        result = JSON.stringify({ ...item, status, reviewedAt });
        strings.set(record, result);
        sorted.set(pending, (sorted.get(pending) || []).filter(entry => entry.id !== id));
        if (kind === 'comment' && status === 'rejected') sorted.set(thread, (sorted.get(thread) || []).filter(entry => entry.id !== id));
      }
    } else if (command === 'EVAL') {
      const [, , rate, record, index, pending, duplicate, recent, json, score, id, limit, , identity] = args;
      if (duplicate !== record && strings.has(duplicate)) return Response.json({ result: -1 });
      if (recent !== index && (sorted.get(recent) || []).some(entry => Number(score) - Number(entry.score) <= 600000 && sameSignals(JSON.parse(identity), JSON.parse(entry.id)))) return Response.json({ result: -1 });
      const count = Number(strings.get(rate) || 0) + 1;
      strings.set(rate, String(count));
      result = count > limit ? 0 : 1;
      if (result) {
        strings.set(record, json);
        if (duplicate !== record) strings.set(duplicate, '1');
        for (const key of new Set([index, pending])) sorted.set(key, [...(sorted.get(key) || []), { id, score }]);
        if (recent !== index) sorted.set(recent, [...(sorted.get(recent) || []), { id: identity, score }]);
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
  function seedComment(record, score) {
    strings.set(itemKey('comment', record.id), JSON.stringify(record));
    const index = itemKey('comments', targetKey(record.target));
    sorted.set(index, [...(sorted.get(index) || []), { id: record.id, score }]);
    if (record.status === 'pending') sorted.set(itemKey('comments', 'pending'), [...(sorted.get(itemKey('comments', 'pending')) || []), { id: record.id, score }]);
  }
  return { fetchImpl, seedComment, get writes() { return writes; } };
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
  assert.equal((await post(base, { ...payload, description: '1234567' }, cookie)).status, 201);
  assert.equal((await review(base, 'submissions', id, 'reviewed')).status, 200);
  const cleared = await request(base, '/api/community?queue=submissions', { headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}` } });
  const remaining = (await cleared.json()).items;
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].description, '1234567');
}));

test('a near-duplicate article lead from the same account enters review only once', async () => withServer(async ({ base, redis }) => {
  const cookie = await login(base);
  const first = { kind: 'submission', destination: 'weekly', description: 'Recent article on fecal calprotectin for chronic diarrhea and IBD, was done in China' };
  assert.equal((await post(base, first, cookie)).status, 201);
  const second = { ...first, description: 'Recent study on fecal calprotectin and chronic diarrhea/IBD. Done in China in hospitalized patients' };
  const duplicate = await post(base, second, cookie);
  assert.equal(duplicate.status, 409);
  assert.match((await duplicate.json()).error, /already suggested/i);
  assert.equal(redis.writes, 1);
  assert.equal((await post(base, { ...second, destination: 'schedule' }, cookie)).status, 201);
}));

test('identical simultaneous submissions are atomically deduplicated', async () => withServer(async ({ base, redis }) => {
  const cookie = await login(base);
  const lead = { kind: 'submission', destination: 'weekly', description: 'PMID 123456789' };
  const responses = await Promise.all([post(base, lead, cookie), post(base, lead, cookie)]);
  assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
  assert.equal(redis.writes, 1);
}));

test('simultaneous differently worded suggestions for the same article create one lead', async () => withServer(async ({ base, redis }) => {
  const cookie = await login(base);
  const a = { kind: 'submission', destination: 'weekly', description: 'Recent article on fecal calprotectin for chronic diarrhea and IBD, was done in China' };
  const b = { ...a, description: 'Recent study on fecal calprotectin and chronic diarrhea/IBD. Done in China in hospitalized patients' };
  const responses = await Promise.all([post(base, a, cookie), post(base, b, cookie)]);
  assert.deepEqual(responses.map(response => response.status).sort(), [201, 409]);
  assert.equal(redis.writes, 1);
}));

test('different Arabic suggestions do not collide in the exact duplicate key', async () => withServer(async ({ base }) => {
  const cookie = await login(base);
  const first = { kind: 'submission', destination: 'weekly', description: 'مراجعة سريرية عن تنظير القولون' };
  assert.equal((await post(base, first, cookie)).status, 201);
  assert.equal((await post(base, { ...first, description: 'دراسة جديدة عن علاج التهاب الكبد' }, cookie)).status, 201);
}));

test('distinct DOI leads remain separate even with similar descriptions', async () => withServer(async ({ base }) => {
  const cookie = await login(base);
  const first = { kind: 'submission', destination: 'weekly', description: 'China IBD fecal calprotectin chronic diarrhea DOI 10.1234/first' };
  assert.equal((await post(base, first, cookie)).status, 201);
  assert.equal((await post(base, { ...first, description: 'China IBD fecal calprotectin chronic diarrhea DOI 10.1234/second' }, cookie)).status, 201);
}));

test('published article, episode and quiz threads appear immediately; reported comments can be hidden', async () => withServer(async ({ base }) => {
  const cookie = await login(base);
  const targets = [articleTarget(weekly.find(isPublicApprovedResource)), podcastTarget(podcasts[0]), quizTarget('stomach-pathology')];
  for (const target of targets) {
    const created = await post(base, { kind: 'comment', target, body: 'Helpful clinical observation.' }, cookie);
    assert.equal(created.status, 201, target);
    const { id } = await created.json();
    const path = `/api/community?target=${encodeURIComponent(target)}`;
    const visible = (await (await request(base, path)).json()).items;
    assert.equal(visible.length, 1);
    assert.equal(visible[0].authorName, 'Dr. Doctor');
    assert.equal(visible[0].body, 'Helpful clinical observation.');
    assert.equal(visible[0].authorId, undefined);
    const report = await post(base, { kind: 'report', commentId: id, reason: 'privacy' }, cookie);
    assert.equal(report.status, 201);
    assert.equal((await post(base, { kind: 'report', commentId: id, reason: 'privacy' }, cookie)).status, 409);
    const flagged = await request(base, '/api/community?queue=reports', { headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}` } });
    assert.equal(flagged.status, 200);
    const reports = (await flagged.json()).items;
    assert.ok(reports.some(item => item.commentId === id && item.commentBody === 'Helpful clinical observation.'));
    assert.equal((await post(base, { kind: 'report', commentId: id, reason: 'free-text-not-allowed' }, cookie)).status, 400);
    assert.equal((await post(base, { kind: 'report', commentId: id, reason: 'privacy' })).status, 401);
    assert.equal((await review(base, 'comments', id, 'rejected')).status, 200);
    assert.deepEqual((await (await request(base, path)).json()).items, []);
    const ticket = reports.find(item => item.commentId === id);
    assert.equal((await review(base, 'reports', ticket.id, 'reviewed')).status, 200);
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

test('Redis-backed daily contribution limit rejects an eleventh write', async () => withServer(async ({ base, redis }) => {
  const cookie = await login(base);
  const payload = i => ({ kind: 'submission', destination: 'weekly', description: `PMID ${123450000 + i}` });
  for (let i = 0; i < 10; i += 1) assert.equal((await post(base, payload(i), cookie)).status, 201);
  assert.equal((await post(base, payload(10), cookie)).status, 429);
  assert.equal(redis.writes, 10);
}));

test('report limit rejects a sixth distinct comment without creating a ticket', async () => withServer(async ({ base, redis }) => {
  const cookie = await login(base);
  const target = articleTarget(weekly.find(isPublicApprovedResource));
  for (let i = 0; i < 6; i += 1) {
    const comment = await post(base, { kind: 'comment', target, body: `Observation ${i}` }, cookie);
    assert.equal(comment.status, 201);
    const { id } = await comment.json();
    const report = await post(base, { kind: 'report', commentId: id, reason: 'spam' }, cookie);
    assert.equal(report.status, i === 5 ? 429 : 201);
  }
  assert.equal(redis.writes, 11);
}));

test('old visible comments survive more than a page of rejected thread records', async () => withServer(async ({ base, redis }) => {
  const target = articleTarget(weekly.find(isPublicApprovedResource));
  const older = { id: crypto.randomUUID(), target, status: 'approved', body: 'Older useful comment', authorName: 'Dr. Doe', createdAt: '2026-11-04T00:00:00Z' };
  redis.seedComment(older, 1);
  for (let i = 2; i <= 102; i += 1) redis.seedComment({ ...older, id: crypto.randomUUID(), status: 'rejected' }, i);
  const result = await request(base, `/api/community?target=${encodeURIComponent(target)}`);
  assert.equal(result.status, 200);
  assert.deepEqual((await result.json()).items.map(item => item.id), [older.id]);
}));

test('legacy pending comment approval clears the queue and a rejected comment cannot be restored', async () => withServer(async ({ base, redis }) => {
  const target = articleTarget(weekly.find(isPublicApprovedResource));
  const id = crypto.randomUUID();
  redis.seedComment({ id, target, status: 'pending', body: 'Previously pending comment', authorName: 'Dr. Doe' }, 1);
  assert.equal((await review(base, 'comments', id, 'approved')).status, 200);
  const queue = await request(base, '/api/community?queue=comments', { headers: { Authorization: `Bearer ${env.GIHUB_COMMUNITY_REVIEW_TOKEN}` } });
  assert.deepEqual((await queue.json()).items, []);
  assert.equal((await review(base, 'comments', id, 'rejected')).status, 200);
  assert.equal((await review(base, 'comments', id, 'approved')).status, 409);
  assert.deepEqual((await (await request(base, `/api/community?target=${encodeURIComponent(target)}`)).json()).items, []);
}));
