import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';

test('home presents real public GIHub sections and the published episode', () => {
  const html = renderToStaticMarkup(<App initialActive="home" />);
  assert.match(html, /Clinical guidelines/i);
  assert.match(html, /Weekly Update/);
  assert.match(html, /Education/);
  assert.match(html, /Schedule/);
  assert.match(html, /Oct(?:ober)? 15,? 2026|October 15, 2026/);
  assert.doesNotMatch(html, /Novel biologic strategy shows durable response/);
});

test('home shares the subpage header and begins at the clinical guidelines section', () => {
  const home = renderToStaticMarkup(<App initialActive="home" />);
  const guidelines = renderToStaticMarkup(<App initialActive="guidelines" />);
  for (const html of [home, guidelines]) {
    assert.match(html, /aria-label="GIHub home"/);
    assert.match(html, /Gastroenterology Educational Hub/);
    assert.match(html, /⌂ Home/);
    assert.match(html, /⚕️ Clinical Guidelines/);
  }
  assert.equal((home.match(/aria-label="GIHub home"/g) || []).length, 1);
  assert.doesNotMatch(home, /coastal-home__nav/);
  assert.match(home, /<main class="coastal-home"><div class="coastal-home__body"><section class="coastal-home__section" aria-labelledby="coastal-guidelines-title">/);
  assert.doesNotMatch(home, /Stay curious|Stay current|Find what you need|Repository at a glance|coastal-home__hero|coastal-home__pathways/);
  assert.match(home, /Grounded in the source\./);
  assert.match(home, /On the reading list\./);
  assert.match(home, /Coming up next\./);
  assert.match(home, /The Weekly Update, on the go\./);
});

test('deep links continue to render their requested section', () => {
  const weekly = renderToStaticMarkup(<App initialActive="weekly" />);
  assert.match(weekly, /Weekly Update podcasts/);
  const guidelines = renderToStaticMarkup(<App initialActive="guidelines" />);
  assert.match(guidelines, /Clinical Guidelines/);
});
