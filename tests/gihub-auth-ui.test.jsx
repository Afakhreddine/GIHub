import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';
import AuthProfile from '../src/AuthProfile.jsx';

const account = {
  user: { id: 7, email: 'doctor@example.com', name: 'Dr Example' },
  profile: { username: 'dr_example', displayName: 'Dr. Example', specialty: 'Hepatology', institution: 'City Hospital', bio: 'Clinician educator.' },
};

test('navigation links to a GIHub profile without hiding public educational tabs', () => {
  const html = renderToStaticMarkup(<App initialActive="home" />);
  for (const label of ['Home', 'Clinical Guidelines', 'Weekly Update', 'Education', 'Schedule', 'Profile']) {
    assert.match(html, new RegExp(`>${label}<| ${label}<`));
  }
  assert.match(html, /Grounded in the source\./);
});

test('signed-out profile offers EndoEval login only, with no registration or GIHub password reset', () => {
  const html = renderToStaticMarkup(<AuthProfile initialAccount={null} skipSessionCheck />);
  assert.match(html, /Sign in with EndoEval/);
  assert.match(html, /type="email"/);
  assert.match(html, /type="password"/);
  assert.match(html, /Existing EndoEval users only/);
  assert.match(html, /href="https:\/\/endoeval\.com/);
  assert.match(html, /Change or reset password on EndoEval/);
  assert.doesNotMatch(html, /Register|Create account/);
});

test('signed-in profile exposes editable basic fields and keeps email read-only', () => {
  const html = renderToStaticMarkup(<AuthProfile initialAccount={account} skipSessionCheck />);
  assert.match(html, /<input type="email"[^>]*readOnly=""[^>]*value="doctor@example.com"/);
  assert.match(html, /Email remains your sign-in/);
  assert.match(html, /value="Dr\. Example"/);
  assert.match(html, />Clinician educator\.<\/textarea>/);
  assert.doesNotMatch(html, /Username|name="username"|dr_example|Hepatology|City Hospital|Specialty|Institution/i);
  assert.match(html, /Save profile/);
  assert.match(html, /Sign out/);
});
