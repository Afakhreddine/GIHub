import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';
import { recentGuidelines } from '../src/homeGuidelines.js';
import { articleTarget, guidelineTarget, lectureTarget } from '../src/communityTargets.js';
import guidelineSupplements from '../src/data/guidelineSupplements.js';
import weekly from '../src/data/weekly.js';
import { isPublicApprovedResource } from '../src/scheduleResourcesModel.js';
import { CALENDAR_EVENTS } from '../src/scheduleConfig.js';

test('home selects the three latest published guidelines by month/year, not file order', () => {
  const item = (title, month, year, url = 'https://example.org/source') => ({ title, month, year, url });
  const records = [item('old', 'Jan', '2024'), item('newest', 'Oct', '2026'), item('invalid source', 'Nov', '2026', 'javascript:alert(1)'), item('second', 'Sep', '2026'), item('third', 'Aug', '2026'), item('fourth', 'Jul', '2026')];
  assert.deepEqual(recentGuidelines(records).map(g => g.title), ['newest', 'second', 'third']);
  assert.deepEqual(recentGuidelines([item('first tie', 'Sep', '2026'), item('second tie', 'Sep', '2026')]).map(g => g.title), ['first tie', 'second tie']);
});

test('home guideline and weekly cards are entire source links without source buttons', () => {
  const html = renderToStaticMarkup(<App initialActive="home" />);
  assert.equal((html.match(/class="coastal-home__card"/g) || []).length, 3);
  assert.match(html, /<a class="coastal-home__card" href="https:\/\//);
  assert.match(html, /<a class="coastal-home__weekly-item" href="https:\/\//);
  assert.doesNotMatch(html, /View source|Read source/);
  assert.match(html, /The Weekly Update, on the go\./);
});

test('home comments use the identical article and guideline targets as their sections without nested links', () => {
  const home = renderToStaticMarkup(<App initialActive="home" />);
  const firstGuideline = recentGuidelines(guidelineSupplements)[0];
  assert.match(home, new RegExp(`data-community-target="${guidelineTarget(firstGuideline)}"`));
  assert.match(home, new RegExp(`data-community-target="${articleTarget(weekly.find(isPublicApprovedResource))}"`));
  assert.equal((home.match(/data-community-target="guideline:/g) || []).length, 3);
  assert.equal((home.match(/data-community-target="article:/g) || []).length, 3);
  assert.doesNotMatch(home, /<a[^>]*><button/);
});

test('an upcoming lecture has the same comment thread on Home and its Schedule detail', () => {
  const RealDate = globalThis.Date;
  const fixedNow = RealDate.parse('2026-11-04T12:00:00');
  globalThis.Date = class FixedDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [fixedNow])); }
    static now() { return fixedNow; }
  };
  try {
    const event = CALENDAR_EVENTS.find(item => item.date >= '2026-11-04' && item.slug && item.topic);
    const target = lectureTarget(event.slug);
    const home = renderToStaticMarkup(<App initialActive="home" />);
    assert.match(home, new RegExp(`data-community-target="${target}"`));
    const previous = globalThis.window;
    try {
      globalThis.window = { location: { search: `?lecture=${event.slug}` } };
      const schedule = renderToStaticMarkup(<App initialActive="schedule" />);
      assert.match(schedule, new RegExp(`data-community-target="${target}"`));
    } finally { globalThis.window = previous; }
  } finally { globalThis.Date = RealDate; }
});

test('teaching card links directly to its schedule lecture panel', () => {
  const RealDate = globalThis.Date;
  const fixedNow = RealDate.parse('2026-10-01T12:00:00');
  globalThis.Date = class FixedDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [fixedNow])); }
    static now() { return fixedNow; }
  };
  try {
    const html = renderToStaticMarkup(<App initialActive="home" />);
    const links = [...html.matchAll(/<a href="(\/schedule\?lecture=[^"]+)" aria-label="Open lecture resources for ([^"]+)"/g)];
    assert.ok(links.length > 0, 'upcoming lectures should link to their detail panels');
    assert.ok(links.every(([, href]) => href.startsWith('/schedule?lecture=')));
  } finally {
    globalThis.Date = RealDate;
  }
});
