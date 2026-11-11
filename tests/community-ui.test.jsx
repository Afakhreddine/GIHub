import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';
import { ContributionBar, Discussion } from '../src/Community.jsx';
import { articleTarget, guidelineTarget } from '../src/communityTargets.js';
import guidelines from '../src/data/guidelines.js';
import scheduleResources from '../src/data/scheduleResources.js';
import weekly from '../src/data/weekly.js';

const account = { user: { id: 7, name: 'Doctor' }, profile: { displayName: 'Dr. Doctor' } };

test('signed-in contribution bar persists across all main tabs and offers both destinations', () => {
  for (const tab of ['home', 'weekly', 'schedule', 'education', 'profile']) {
    const html = renderToStaticMarkup(<App initialActive={tab} initialAccount={account} />);
    assert.match(html, /Have an article for the Weekly Update or Schedule\?/);
    assert.match(html, /PMID, DOI, or describe the article and journal/);
    assert.match(html, /Weekly Update/);
    assert.match(html, /Schedule/);
  }
  assert.doesNotMatch(renderToStaticMarkup(<App initialActive="weekly" />), /Have an article for the Weekly Update or Schedule\?/);
});

test('weekly, podcast, and quiz discussion buttons say Comment rather than Discuss', () => {
  const weeklyHtml = renderToStaticMarkup(<App initialActive="weekly" initialAccount={account} />);
  assert.match(weeklyHtml, /Comment on this episode/);
  assert.match(weeklyHtml, />Comment<\/button>/);
  assert.doesNotMatch(weeklyHtml, /Discuss this episode|>Discuss<\/button>/);
  const quizHtml = renderToStaticMarkup(<Discussion target="quiz:stomach-pathology" label="Comment on this quiz" account={account} />);
  assert.match(quizHtml, /Comment on this quiz/);
  assert.equal(articleTarget({ doi: 'https://doi.org/10.1234/AB' }), articleTarget({ doi: '10.1234/ab' }));
  assert.match(articleTarget(weekly[0]), /^article:/);
});

test('a repository guideline has the same comment target on the Guidelines page as on Home', async () => {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://mygihub.com/guidelines' });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.fetch = async (url, options = {}) => url === '/api/gihub-auth/me'
      ? Response.json(account)
      : Response.json({ data: options.body?.includes('guidelines-new') ? [] : [guidelines[0]], total: 1 });
    const root = createRoot(dom.window.document.getElementById('root'));
    await act(async () => { root.render(<App initialActive="guidelines" initialAccount={account} />); });
    const target = guidelineTarget(guidelines[0]);
    assert.ok(dom.window.document.querySelector(`[data-community-target="${target}"]`));
    await act(async () => root.unmount());
  } finally {
    Object.assign(globalThis, previous);
    dom.window.close();
  }
});

test('a published Schedule guideline resource keeps its own shared comment thread', async () => {
  const slug = 'appendix-and-anus-pathology';
  const item = scheduleResources[slug].guidelines[0];
  const dom = new JSDOM('<div id="root"></div>', { url: `https://mygihub.com/schedule?lecture=${slug}` });
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch, IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT };
  try {
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    globalThis.fetch = async () => Response.json(account);
    const root = createRoot(dom.window.document.getElementById('root'));
    await act(async () => { root.render(<App initialActive="schedule" initialAccount={account} />); });
    assert.ok(dom.window.document.querySelector(`[data-community-target="${guidelineTarget(item)}"]`));
    await act(async () => root.unmount());
  } finally {
    Object.assign(globalThis, previous);
    dom.window.close();
  }
});

test('signed-out readers see discussions but cannot post; signed-in readers see contribution form', () => {
  const target = articleTarget(weekly[0]);
  const anon = renderToStaticMarkup(<Discussion target={target} label="article" account={null} />);
  assert.match(anon, /article/);
  const contribution = renderToStaticMarkup(<ContributionBar account={account} />);
  assert.match(contribution, /PMID, DOI, or describe the article and journal/);
});
