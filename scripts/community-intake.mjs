#!/usr/bin/env node
// Read-only by default. Requires GIHUB_COMMUNITY_REVIEW_TOKEN in the environment.
const base = process.env.GIHUB_COMMUNITY_URL || 'https://mygihub.com';
const token = process.env.GIHUB_COMMUNITY_REVIEW_TOKEN;
if (!token || token.length < 32) {
  console.error('GIHUB_COMMUNITY_REVIEW_TOKEN is missing or too short; intake was not read.');
  process.exitCode = 2;
} else {
  const args = process.argv.slice(2);
  const queue = ['submissions', 'comments', 'reports'].includes(args[0]) ? args[0] : 'submissions';
  const mark = ['mark', 'mark-comment', 'mark-report'].includes(args[0]);
  const chosen = args[0] === 'mark-comment' ? 'comments' : args[0] === 'mark-report' ? 'reports' : queue;
  const headers = { Authorization: `Bearer ${token}`, Origin: new URL(base).origin };
  const items = [];
  let offset = 0;
  try {
    do {
      const url = new URL('/api/community', base);
      url.searchParams.set('queue', chosen);
      if (!mark) url.searchParams.set('offset', String(offset));
      const res = await fetch(url, {
        method: mark ? 'PATCH' : 'GET',
        headers: mark ? { ...headers, 'Content-Type': 'application/json' } : headers,
        ...(mark ? { body: JSON.stringify({ id: args[1], status: args[2] || 'reviewed' }) } : {}),
        redirect: 'error',
      });
      if (!res.ok) throw new Error(`Community intake ${mark ? 'mark' : 'read'} failed (HTTP ${res.status}).`);
      const data = await res.json();
      if (mark) { console.log(JSON.stringify(data)); break; }
      items.push(...data.items);
      offset += data.items.length;
      if (!data.hasMore) { console.log(JSON.stringify({ items }, null, 2)); break; }
      if (offset > 10000) throw new Error('Community queue exceeds pagination limit; review manually.');
    } while (true);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
