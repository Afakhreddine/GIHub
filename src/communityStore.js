import crypto from 'node:crypto';

export function communityConfigured(env = globalThis.process.env) {
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

export async function redisCommand(command, { env = globalThis.process.env, fetchImpl = globalThis.fetch } = {}) {
  if (!communityConfigured(env)) throw new Error('Community storage is unavailable');
  const response = await fetchImpl(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command), redirect: 'error', signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('Community storage is unavailable');
  const body = await response.json();
  if (body.error) throw new Error('Community storage is unavailable');
  return body.result;
}

export function itemKey(kind, id) { return `gihub:community:${kind}:${id}`; }
export function targetKey(target) { return crypto.createHash('sha256').update(target).digest('hex'); }

const INSERT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], 86400) end
if count > tonumber(ARGV[4]) then return 0 end
redis.call('SET', KEYS[2], ARGV[1])
redis.call('ZADD', KEYS[3], ARGV[2], ARGV[3])
if KEYS[4] ~= KEYS[3] then redis.call('ZADD', KEYS[4], ARGV[2], ARGV[3]) end
return 1`;

export async function saveCommunityItem(kind, record, { env, fetchImpl } = {}) {
  const user = String(record.authorId);
  const index = kind === 'submission' ? itemKey('submissions', 'all') : itemKey('comments', targetKey(record.target));
  const options = { env, fetchImpl };
  const saved = await redisCommand(['EVAL', INSERT, '4', itemKey(`rate-${kind}`, user), itemKey(kind, record.id), index,
    itemKey(kind === 'comment' ? 'comments' : 'submissions', 'pending'),
    JSON.stringify(record), Date.parse(record.createdAt), record.id, kind === 'submission' ? 10 : 20], options);
  return saved === 1;
}

export async function listCommunityItems(kind, index, { env, fetchImpl, offset = 0, oldestFirst = false } = {}) {
  const options = { env, fetchImpl };
  const ids = await redisCommand([oldestFirst ? 'ZRANGE' : 'ZREVRANGE', index, String(offset), String(offset + 100)], options);
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const records = await redisCommand(['MGET', ...ids.map(id => itemKey(kind, id))], options);
  return (records || []).flatMap(value => {
    try { return value ? [JSON.parse(value)] : []; } catch { return []; }
  });
}

export async function setCommunityItemStatus(kind, id, status, options = {}) {
  const key = itemKey(kind, id);
  const source = await redisCommand(['GET', key], options);
  if (!source) return null;
  const item = JSON.parse(source);
  const updated = { ...item, status, reviewedAt: new Date().toISOString() };
  await redisCommand(['SET', key, JSON.stringify(updated)], options);
  if (status !== 'pending') await redisCommand(['ZREM', itemKey(kind === 'comment' ? 'comments' : 'submissions', 'pending'), id], options);
  return updated;
}
