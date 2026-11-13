import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import App from '../src/App.jsx';

async function renderLecture(slug) {
  const dom = new JSDOM('<div id="root"></div>', { url: `https://mygihub.com/schedule?lecture=${slug}` });
  const previous = { window:globalThis.window, document:globalThis.document, fetch:globalThis.fetch, IS_REACT_ACT_ENVIRONMENT:globalThis.IS_REACT_ACT_ENVIRONMENT };
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.fetch = async () => Response.json({ error:'Not signed in' }, { status:401 });
  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await act(async () => { root.render(<App initialActive="schedule" />); });
    return dom.window.document.body.textContent;
  } finally {
    await act(async () => root.unmount());
    Object.assign(globalThis, previous);
    dom.window.close();
  }
}

test('approved Portal Hypertension resources appear despite a pending quiz', async () => {
  const text = await renderLecture('portal-hypertension');
  assert.match(text, /Portal Hypertension/);
  assert.match(text, /PMID 40689908/);
  assert.match(text, /PMID 41138818/);
  assert.match(text, /A source-based topic quiz has not been completed and approved yet/);
});

test('approved Cirrhosis 101 resources appear despite a pending quiz', async () => {
  const text = await renderLecture('cirrhosis-101');
  assert.match(text, /Cirrhosis/);
  assert.match(text, /PMID 41974013/);
  assert.match(text, /PMID 39908052/);
  assert.match(text, /A source-based topic quiz has not been completed and approved yet/);
});

test('Post-AASLD has separately labeled empty resources and quiz without inventing cards', async () => {
  const text = await renderLecture('post-aasld-update');
  assert.match(text, /Post-AASLD Update/);
  assert.match(text, /No approved guidelines yet/);
  assert.match(text, /No approved articles yet/);
  assert.match(text, /A source-based topic quiz has not been completed and approved yet/);
  assert.doesNotMatch(text, /Run the schedule cron to populate/);
});
