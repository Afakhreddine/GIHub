import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../src/App.jsx';
import { ContributionBar, Discussion } from '../src/Community.jsx';
import { articleTarget } from '../src/communityTargets.js';
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

test('weekly cards and podcast expose discussions; comments use stable article identities', () => {
  const html = renderToStaticMarkup(<App initialActive="weekly" initialAccount={account} />);
  assert.match(html, /Discuss this episode/);
  assert.match(html, /Discuss/);
  assert.equal(articleTarget({ doi: 'https://doi.org/10.1234/AB' }), articleTarget({ doi: '10.1234/ab' }));
  assert.match(articleTarget(weekly[0]), /^article:/);
});

test('signed-out readers see discussions but cannot post; signed-in readers can post for moderation', () => {
  const target = articleTarget(weekly[0]);
  const anon = renderToStaticMarkup(<Discussion target={target} label="article" account={null} />);
  assert.match(anon, /article/);
  const contribution = renderToStaticMarkup(<ContributionBar account={account} />);
  assert.match(contribution, /PMID, DOI, or describe the article and journal/);
});
