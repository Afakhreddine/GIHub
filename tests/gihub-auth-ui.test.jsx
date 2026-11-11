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

test('navigation says Sign in to guests and Profile to signed-in readers', () => {
  const guest = renderToStaticMarkup(<App initialActive="home" />);
  for (const label of ['Home', 'Clinical Guidelines', 'Weekly Update', 'Education', 'Schedule', 'Sign in']) {
    assert.match(guest, new RegExp(`>${label}<| ${label}<`));
  }
  assert.doesNotMatch(guest, /👤 Profile<\/button>/);
  const signedIn = renderToStaticMarkup(<App initialActive="home" initialAccount={account} />);
  assert.match(signedIn, /👤 Profile<\/button>/);
  assert.doesNotMatch(signedIn, /👤 Sign in<\/button>/);
  assert.match(guest, /Grounded in the source\./);
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

test('signed-in profile keeps personal fields collapsed behind Edit profile', () => {
  const html = renderToStaticMarkup(<AuthProfile initialAccount={account} skipSessionCheck />);
  assert.match(html, /Welcome, Dr\. Example/);
  assert.match(html, />Edit profile<\/button>/);
  assert.doesNotMatch(html, /<input type="email"|<textarea|Save profile|Email remains your sign-in/);
  assert.doesNotMatch(html, /Username|dr_example|Hepatology|City Hospital|Specialty|Institution/i);
  assert.match(html, /Sign out/);
});
