import crypto from 'node:crypto';
import { authenticatedGihubAccount } from './gihub-auth.js';
import { articleTarget, podcastTarget, quizTarget } from '../src/communityTargets.js';
import { communityConfigured, itemKey, listCommunityItems, listPublishedComments, redisCommand, saveCommunityItem, setCommunityItemStatus, targetKey } from '../src/communityStore.js';
import weekly from '../src/data/weekly.js';
import archive from '../src/data/weeklyArchive.js';
import schedule from '../src/data/scheduleResources.js';
import podcasts from '../src/data/weeklyPodcasts.js';
import { isPublicApprovedResource, sanitizeScheduleResourceForPublic } from '../src/scheduleResourcesModel.js';

const TARGETS = new Set([
  ...[...weekly, ...archive].filter(isPublicApprovedResource).map(articleTarget),
  ...Object.values(schedule).flatMap(resource => sanitizeScheduleResourceForPublic(resource).newsAndArticles?.map(articleTarget) || []),
  ...podcasts.map(podcastTarget),
  ...Object.entries(schedule).filter(([, resource]) => resource.quiz?.length).map(([slug]) => quizTarget(slug)),
].filter(Boolean));

function reviewer(req, env) {
  const secret = env.GIHUB_COMMUNITY_REVIEW_TOKEN;
  const actual = req.headers.authorization || '';
  const expected = `Bearer ${secret}`;
  return typeof secret === 'string' && Buffer.byteLength(secret) >= 32 &&
    actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function allowedOrigin(req, env) {
  const origin = env.GIHUB_PUBLIC_ORIGIN || 'https://mygihub.com';
  try { return new URL(origin).origin === origin && req.headers.origin === origin; } catch { return false; }
}

function safeText(value, max) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (text.length > max || Array.from(text).some(character => {
    const code = character.charCodeAt(0);
    return code < 32 && code !== 9 && code !== 10 && code !== 13;
  })) return '';
  return text;
}

export function createCommunityHandler({ env = process.env, fetchImpl = globalThis.fetch, now = Date.now } = {}) {
  const store = { env, fetchImpl };
  const authenticate = req => authenticatedGihubAccount(req, { env, fetchImpl, now });
  return async function community(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (!communityConfigured(env)) return res.status(503).json({ error: 'Community storage is unavailable' });
    try {
      const queue = req.query?.queue;
      if (queue) {
        if (!reviewer(req, env)) return res.status(401).json({ error: 'Reviewer authorization required' });
        if (req.method === 'GET' && ['submissions', 'comments', 'reports'].includes(queue)) {
          const offset = Number(req.query.offset || 0);
          if (!Number.isInteger(offset) || offset < 0 || offset > 10000) return res.status(400).json({ error: 'Invalid offset' });
          const kind = queue === 'comments' ? 'comment' : queue === 'reports' ? 'report' : 'submission';
          const items = await listCommunityItems(kind, itemKey(queue, 'pending'), { ...store, offset, oldestFirst: true });
          return res.status(200).json({ items: items.slice(0, 100), hasMore: items.length > 100 });
        }
        if (req.method === 'PATCH' && ['submissions', 'comments', 'reports'].includes(queue)) {
          if (!allowedOrigin(req, env)) return res.status(403).json({ error: 'Request origin not allowed' });
          const id = req.body?.id;
          const allowed = queue === 'comments' ? ['approved', 'rejected'] : ['reviewed', 'rejected'];
          if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id) || !allowed.includes(req.body?.status)) return res.status(400).json({ error: 'Invalid decision' });
          const updated = await setCommunityItemStatus(queue === 'comments' ? 'comment' : queue === 'reports' ? 'report' : 'submission', id, req.body.status, store);
          if (updated?.conflict) return res.status(409).json({ error: 'Decision conflicts with a previous rejection' });
          return updated ? res.status(200).json({ id: updated.id, status: updated.status }) : res.status(404).json({ error: 'Not found' });
        }
        return res.status(404).json({ error: 'Not found' });
      }
      if (req.method === 'GET') {
        const target = req.query?.target;
        if (typeof target !== 'string' || !TARGETS.has(target)) return res.status(400).json({ error: 'Unknown published content' });
        const items = await listPublishedComments(itemKey('comments', targetKey(target)), store);
        return res.status(200).json({ items: items.map(({ id, target: subject, authorName, body, createdAt }) => ({ id, target: subject, authorName, body, createdAt })) });
      }
      if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
      if (!allowedOrigin(req, env)) return res.status(403).json({ error: 'Request origin not allowed' });
      const account = await authenticate(req);
      if (!account) return res.status(401).json({ error: 'Sign in to participate' });
      const kind = req.body?.kind;
      if (kind === 'submission') {
        const destination = req.body?.destination;
        const description = safeText(req.body?.description, 1500);
        if (!['weekly', 'schedule'].includes(destination) || (description.length < 8 && !/^(?:PMID[:\s]*)?\d{5,9}$/i.test(description))) return res.status(400).json({ error: 'Choose a destination and enter a PMID, DOI, or article description' });
        const record = { id: crypto.randomUUID(), destination, description, authorId: account.user.id, authorName: account.profile.displayName || account.user.name, createdAt: new Date(now()).toISOString(), status: 'pending' };
        const saved = await saveCommunityItem('submission', record, store);
        if (saved === -1) return res.status(409).json({ error: 'You already suggested a similar article recently. Your earlier suggestion was received; add a PMID/DOI or more distinguishing details if this is a different article.' });
        if (saved !== 1) return res.status(429).json({ error: 'Daily contribution limit reached' });
        return res.status(201).json({ id: record.id, status: record.status });
      }
      if (kind === 'comment') {
        const target = req.body?.target;
        const body = safeText(req.body?.body, 2000);
        if (typeof target !== 'string' || !TARGETS.has(target) || body.length < 3) return res.status(400).json({ error: 'Choose published content and enter a comment (3–2000 characters)' });
        const record = { id: crypto.randomUUID(), target, body, authorId: account.user.id, authorName: account.profile.displayName || account.user.name, createdAt: new Date(now()).toISOString(), status: 'approved' };
        if (await saveCommunityItem('comment', record, store) !== 1) return res.status(429).json({ error: 'Daily comment limit reached' });
        const { id, authorName, createdAt } = record;
        return res.status(201).json({ id, target, body, authorName, createdAt, status: 'approved' });
      }
      if (kind === 'report') {
        const commentId = req.body?.commentId;
        const reason = req.body?.reason;
        if (typeof commentId !== 'string' || !/^[a-f0-9-]{36}$/.test(commentId) || !['spam', 'privacy', 'inaccurate', 'abuse', 'other'].includes(reason)) return res.status(400).json({ error: 'Select a valid comment and report reason' });
        const source = await redisCommand(['GET', itemKey('comment', commentId)], store);
        if (!source) return res.status(404).json({ error: 'Comment not found' });
        const comment = JSON.parse(source);
        if (comment.status !== 'approved' || !TARGETS.has(comment.target)) return res.status(404).json({ error: 'Comment not found' });
        const record = { id: crypto.randomUUID(), commentId, target: comment.target, commentBody: comment.body, commentAuthorName: comment.authorName, reason, authorId: account.user.id, createdAt: new Date(now()).toISOString(), status: 'pending' };
        const saved = await saveCommunityItem('report', record, store);
        if (saved === -1) return res.status(409).json({ error: 'Already reported this comment' });
        if (saved !== 1) return res.status(429).json({ error: 'Daily report limit reached' });
        return res.status(201).json({ id: record.id, status: 'pending' });
      }
      return res.status(400).json({ error: 'Unknown community action' });
    } catch {
      return res.status(503).json({ error: 'Community service is temporarily unavailable' });
    }
  };
}

export default createCommunityHandler();
