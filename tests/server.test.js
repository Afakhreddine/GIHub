import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import http from 'node:http';
import { apiHandlers, createApp } from '../app.js';

function requestWithHost(base, route, method, headers) {
  return new Promise((resolve, reject) => {
    const request = http.request(`${base}${route}`, { method, headers }, response => {
      response.resume();
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers }));
    });
    request.on('error', reject);
    request.end();
  });
}

test('www page requests redirect to the canonical sign-in origin before rendering', async () => {
  const server = createApp(apiHandlers, { gihubAuthHandler: (req, res) => res.status(403).json({ error: 'Origin rejected' }) }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const www = await requestWithHost(base, '/profile?from=phone', 'GET', { Host: 'www.mygihub.com' });
    assert.equal(www.status, 302);
    assert.equal(www.headers.location, 'https://mygihub.com/profile?from=phone');
    const canonical = await requestWithHost(base, '/api/gihub-auth/me', 'GET', { Host: 'mygihub.com', 'X-Forwarded-Host': 'www.mygihub.com' });
    assert.equal(canonical.status, 403);
    const post = await requestWithHost(base, '/api/gihub-auth/login', 'POST', { Host: 'www.mygihub.com' });
    assert.equal(post.status, 403); // Do not redirect a credential-bearing POST.
  } finally {
    server.close();
    await once(server, 'close');
  }
});

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
    'community',
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
  for (const action of ['login', 'logout', 'me', 'profile', 'change-password']) {
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
