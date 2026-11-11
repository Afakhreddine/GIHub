import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import App from '../src/App.jsx';
import weekly from '../src/data/weekly.js';
import { articleTarget } from '../src/communityTargets.js';
import { isPublicApprovedResource } from '../src/scheduleResourcesModel.js';

const account = { user: { id: 7, name: 'Doctor' }, profile: { displayName: 'Doctor' } };
const articles = weekly.filter(isPublicApprovedResource).sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));

test('every public Weekly article exposes an upvote and downvote, guests cannot cast votes', () => {
  const guest = renderToStaticMarkup(<App initialActive="weekly" />);
  assert.equal((guest.match(/aria-label="Upvote /g) || []).length, articles.length);
  assert.equal((guest.match(/aria-label="Downvote /g) || []).length, articles.length);
  assert.match(guest, /Sign in to vote/);
  const signedIn = renderToStaticMarkup(<App initialActive="weekly" initialAccount={account} />);
  assert.match(signedIn, /aria-label="Upvote /);
});

test('vote totals re-rank Weekly cards and a second click removes the reader vote', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://mygihub.com/weekly' });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  const target = articleTarget(articles[articles.length - 1]);
  const votes = { [target]: { score: 4, myVote: 0 } };
  const calls = [];
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.fetch = async (url, options = {}) => {
      if (url === '/api/gihub-auth/me') return Response.json(account);
      if (url === '/api/community?votes=weekly') return Response.json({ votes });
      if (url === '/api/community' && options.method === 'POST') {
        const payload = JSON.parse(options.body);
        calls.push(payload);
        const previousVote = votes[payload.target]?.myVote || 0;
        votes[payload.target] = { score: (votes[payload.target]?.score || 0) + payload.value - previousVote, myVote: payload.value };
        return Response.json({ target: payload.target, ...votes[payload.target] });
      }
      return Response.json({ items: [] });
    };
    const root = createRoot(dom.window.document.getElementById('root'));
    await act(async () => { root.render(<App initialActive="weekly" initialAccount={account} />); });
    const cards = () => [...dom.window.document.querySelectorAll('[data-vote-target]')];
    assert.equal(cards()[0].getAttribute('data-vote-target'), target);
    const up = () => [...dom.window.document.querySelectorAll('button[aria-label^="Upvote"]')].find(button => button.closest('[data-vote-target]')?.getAttribute('data-vote-target') === target);
    await act(async () => up().click());
    assert.deepEqual(calls[0], { kind: 'vote', target, value: 1 });
    assert.equal(up().getAttribute('aria-pressed'), 'true');
    await act(async () => up().click());
    assert.deepEqual(calls[1], { kind: 'vote', target, value: 0 });
    assert.equal(up().getAttribute('aria-pressed'), 'false');
    await act(async () => root.unmount());
  } finally {
    Object.assign(globalThis, previous);
    dom.window.close();
  }
});
