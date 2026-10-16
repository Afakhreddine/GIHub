import test from 'node:test';
import assert from 'node:assert/strict';
import { publicTabForPath, publicPathForTab } from '../src/publicRoutes.js';

test('public routes resolve the homepage and each content section', () => {
  assert.equal(publicTabForPath('/'), 'home');
  for (const tab of ['guidelines', 'weekly', 'schedule', 'education']) {
    assert.equal(publicTabForPath(`/${tab}`), tab);
    assert.equal(publicPathForTab(tab), `/${tab}`);
  }
  assert.equal(publicPathForTab('home'), '/');
});

test('nonpublic or unknown paths do not masquerade as a public section', () => {
  assert.equal(publicTabForPath('/review/weekly'), 'home');
  assert.equal(publicTabForPath('/not-a-page'), 'home');
});
