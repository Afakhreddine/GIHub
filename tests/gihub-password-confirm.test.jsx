import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { createRoot } from 'react-dom/client';
import AuthProfile from '../src/AuthProfile.jsx';

const account = {
  user: { id: 7, email: 'doctor@example.com', name: 'Doctor' },
  profile: { username: '', displayName: '', specialty: '', institution: '', bio: '' },
};

test('GIHub change form blocks mismatched confirmation before sending any password', async () => {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://mygihub.com' });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let requests = 0;
  globalThis.fetch = async () => { requests += 1; return Response.json({ message: 'Password changed' }); };
  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await act(async () => root.render(<AuthProfile initialAccount={account} skipSessionCheck />));
    const form = document.querySelector('form[data-password-change]');
    const current = form.querySelector('[name="currentPassword"]');
    const next = form.querySelector('[name="newPassword"]');
    const confirm = form.querySelector('[name="confirmPassword"]');
    assert.ok(confirm, 'confirmation field must be available');
    await act(async () => {
      current.value = 'old-password'; next.value = 'new-password'; confirm.value = 'new-passw0rd';
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.equal(requests, 0, 'do not send mismatched password to EndoEval');
    assert.match(document.querySelector('[role="alert"]')?.textContent || '', /match/i);
    assert.equal(current.value, '');
    assert.equal(next.value, '');
    assert.equal(confirm.value, '');
  } finally {
    await act(async () => root.unmount());
    for (const [key, value] of Object.entries(previous)) globalThis[key] = value;
    dom.window.close();
  }
});
