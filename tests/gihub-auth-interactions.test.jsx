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

test('wrong current password clears both inputs but keeps signed-in profile and actionable alert', async () => {
  await mount(async document => {
    globalThis.fetch = async () => Response.json({ error: 'Current password is incorrect' }, { status: 401 });
    const form = document.querySelector('form[data-password-change]');
    const current = form.querySelector('[name="currentPassword"]');
    const next = form.querySelector('[name="newPassword"]');
    const confirm = form.querySelector('[name="confirmPassword"]');
    await act(async () => {
      current.value = 'wrong-password';
      next.value = 'new-password';
      confirm.value = 'new-password';
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.equal(current.value, '');
    assert.equal(next.value, '');
    assert.equal(confirm.value, '');
    assert.match(document.body.textContent, /Welcome, Doctor/);
    assert.match(document.querySelector('[role="alert"]')?.textContent || '', /current password is incorrect/i);
  });
});

test('signed-in password form submits only credentials, clears fields and preserves profile on success', async () => {
  await mount(async document => {
    const calls = [];
    globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json({ message: 'Password changed' }); };
    const form = document.querySelector('form[data-password-change]');
    assert.ok(form);
    const current = form.querySelector('[name="currentPassword"]');
    const next = form.querySelector('[name="newPassword"]');
    const confirm = form.querySelector('[name="confirmPassword"]');
    await act(async () => {
      current.value = 'old-password';
      next.value = 'new-password';
      confirm.value = 'new-password';
      form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    });
    assert.deepEqual(calls.map(call => [call.url, call.options.method, JSON.parse(call.options.body)]), [
      ['/api/gihub-auth/change-password', 'POST', { currentPassword: 'old-password', newPassword: 'new-password' }],
    ]);
    assert.equal(current.value, '');
    assert.equal(next.value, '');
    assert.equal(confirm.value, '');
    assert.match(document.body.textContent, /Welcome, Doctor/);
    assert.match(document.querySelector('[role="status"]')?.textContent || '', /password changed/i);
  });
});

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

test('invalid profile values show a field-neutral validation message', async () => {
  await mount(async document => {
    globalThis.fetch = async () => Response.json({ error: 'Invalid profile' }, { status: 400 });
    await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })));
    const alert = document.querySelector('[role="alert"]')?.textContent || '';
    assert.match(alert, /profile field lengths/i);
    assert.doesNotMatch(alert, /username|specialty|institution/i);
  });
});

test('hidden profile fields are preserved on save and conflict errors do not mention removed fields', async () => {
  await mount(async document => {
    let body;
    globalThis.fetch = async (_url, options) => {
      body = JSON.parse(options.body);
      return Response.json({ error: 'Username is already taken' }, { status: 409 });
    };
    await act(async () => document.querySelector('form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true })));
    assert.deepEqual(body, account.profile);
    assert.match(document.body.textContent, /Welcome, Doctor/);
    assert.doesNotMatch(document.body.textContent, /Username|Specialty|Institution/i);
    assert.match(document.querySelector('[role="alert"]')?.textContent || '', /profile could not be saved/i);
  });
});
