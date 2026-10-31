import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { createRoot } from 'react-dom/client';
import AuthProfile from '../src/AuthProfile.jsx';

const account = {
  user: { id: 7, email: 'doctor@example.com', name: 'Doctor' },
  profile: { username: 'doctor_7', displayName: 'Doctor', specialty: '', institution: '', bio: '' },
};

async function mount(run) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://mygihub.com' });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(dom.window.document.getElementById('root'));
  const warnings = [];
  const originalError = console.error;
  console.error = (...args) => { warnings.push(args.join(' ')); };
  try {
    await act(async () => { root.render(<AuthProfile initialAccount={account} skipSessionCheck />); });
    await run(dom.window.document);
    assert.deepEqual(warnings, []);
  } finally {
    console.error = originalError;
    await act(async () => root.unmount());
    for (const [key, value] of Object.entries(previous)) globalThis[key] = value;
    dom.window.close();
  }
}

test('failed logout retains the signed-in account and alerts; successful 204 clears it', async () => {
  await mount(async document => {
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return calls.length === 1
        ? Response.json({ error: 'failed' }, { status: 503 })
        : new Response(null, { status: 204 });
    };
    await act(async () => document.querySelector('button.auth-profile__secondary').click());
    assert.match(document.body.textContent, /Welcome, Doctor/);
    assert.match(document.querySelector('[role="alert"]')?.textContent || '', /sign out/i);
    await act(async () => document.querySelector('button.auth-profile__secondary').click());
    assert.match(document.body.textContent, /Sign in with EndoEval/);
    assert.equal(document.querySelector('button.auth-profile__secondary'), null);
    assert.deepEqual(calls.map(call => [call.url, call.options.method]), [
      ['/api/gihub-auth/logout', 'POST'], ['/api/gihub-auth/logout', 'POST'],
    ]);
  });
});

test('duplicate username 409 gives actionable profile alert and preserves current account', async () => {
  await mount(async document => {
    let body;
    globalThis.fetch = async (_url, options) => {
      body = JSON.parse(options.body);
      return Response.json({ error: 'Username is already taken' }, { status: 409 });
    };
    await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })));
    assert.equal(body.username, 'doctor_7');
    assert.match(document.body.textContent, /Welcome, Doctor/);
    assert.match(document.querySelector('[role="alert"]')?.textContent || '', /username.*taken/i);
  });
});
