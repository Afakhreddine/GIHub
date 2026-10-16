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

test('deep links continue to render their requested section', () => {
  const weekly = renderToStaticMarkup(<App initialActive="weekly" />);
  assert.match(weekly, /Weekly Update podcasts/);
  const guidelines = renderToStaticMarkup(<App initialActive="guidelines" />);
  assert.match(guidelines, /Clinical Guidelines/);
});
