import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { Discussion } from '../src/Community.jsx';

const comment = { id: '12345678-1234-1234-1234-123456789abc', authorName: 'Dr. Doe', body: 'A useful discussion.', createdAt: '2026-11-04T12:00:00Z' };

test('signed-in reader can report a visible comment and gets confirmation', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://mygihub.com' });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  const calls = [];
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.fetch = async (url, options = {}) => {
      if (options.method === 'POST') calls.push(JSON.parse(options.body));
      return Response.json(options.method === 'POST' ? { id: 'report-1', status: 'pending' } : { items: [comment] });
    };
    const root = createRoot(dom.window.document.getElementById('root'));
    await act(async () => { root.render(<Discussion target="article:pmid:12345678" account={{ user: { id: 1 } }} />); });
    await act(async () => { dom.window.document.querySelector('[aria-expanded]').click(); });
    assert.match(dom.window.document.body.textContent, /A useful discussion/);
    await act(async () => { dom.window.document.querySelector('[aria-label="Report comment by Dr. Doe"]').click(); });
    assert.match(dom.window.document.body.textContent, /Patient privacy/);
    await act(async () => { dom.window.document.querySelector('.community-discussion__thread li form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })); });
    assert.deepEqual(calls, [{ kind: 'report', commentId: comment.id, reason: 'privacy' }]);
    assert.match(dom.window.document.body.textContent, /Report sent to the editorial team/);
    await act(async () => { root.unmount(); });
  } finally {
    Object.assign(globalThis, previous);
    dom.window.close();
  }
});
