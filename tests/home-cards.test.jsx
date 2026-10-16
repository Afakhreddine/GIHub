import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';
import { recentGuidelines } from '../src/homeGuidelines.js';

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

test('teaching card links directly to its schedule lecture panel', () => {
  const html = renderToStaticMarkup(<App initialActive="home" />);
  const links = [...html.matchAll(/<a href="(\/schedule\?lecture=[^"]+)" aria-label="Open lecture resources for ([^"]+)"/g)];
  assert.ok(links.length > 0, 'upcoming lectures should link to their detail panels');
  assert.ok(links.every(([, href]) => href.startsWith('/schedule?lecture=')));
});
