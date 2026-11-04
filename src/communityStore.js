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
if KEYS[5] ~= KEYS[2] and redis.call('EXISTS', KEYS[5]) == 1 then return -1 end
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], 86400) end
if count > tonumber(ARGV[4]) then return 0 end
redis.call('SET', KEYS[2], ARGV[1])
redis.call('ZADD', KEYS[3], ARGV[2], ARGV[3])
if KEYS[4] ~= KEYS[3] then redis.call('ZADD', KEYS[4], ARGV[2], ARGV[3]) end
if KEYS[5] ~= KEYS[2] then
  redis.call('SET', KEYS[5], '1')
  redis.call('EXPIRE', KEYS[5], 7776000)
end
return 1`;

export async function saveCommunityItem(kind, record, { env, fetchImpl } = {}) {
  const user = String(record.authorId);
  const index = kind === 'submission' ? itemKey('submissions', 'all') :
    kind === 'report' ? itemKey('reports', 'pending') : itemKey('comments', targetKey(record.target));
  const pending = kind === 'submission' ? itemKey('submissions', 'pending') :
    kind === 'report' || record.status === 'approved' ? index : itemKey('comments', 'pending');
  const duplicate = kind === 'report' ? itemKey('report-by-user', `${user}:${record.commentId}`) : itemKey(kind, record.id);
  const options = { env, fetchImpl };
  return redisCommand(['EVAL', INSERT, '5', itemKey(`rate-${kind}`, user), itemKey(kind, record.id), index,
    pending, duplicate, JSON.stringify(record), Date.parse(record.createdAt), record.id,
    kind === 'submission' ? 10 : kind === 'report' ? 5 : 20], options);
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

const TRANSITION = `
local source = redis.call('GET', KEYS[1])
if not source then return nil end
local item = cjson.decode(source)
if item.status == 'rejected' and ARGV[1] ~= 'rejected' then return -1 end
item.status = ARGV[1]
item.reviewedAt = ARGV[2]
local updated = cjson.encode(item)
redis.call('SET', KEYS[1], updated)
redis.call('ZREM', KEYS[2], ARGV[3])
if ARGV[4] == 'comment' and ARGV[1] == 'rejected' then redis.call('ZREM', KEYS[3], ARGV[3]) end
if ARGV[1] == 'rejected' or (ARGV[4] ~= 'comment' and ARGV[1] == 'reviewed') then
  redis.call('EXPIRE', KEYS[1], 7776000)
end
return updated`;

export async function listPublishedComments(index, options = {}) {
  const items = [];
  let offset = 0;
  // Read further pages when older rejected records remain in a legacy index.
  while (items.length < 100 && offset < 10000) {
    const ids = await redisCommand(['ZREVRANGE', index, String(offset), String(offset + 100)], options);
    if (!Array.isArray(ids) || !ids.length) break;
    const records = await redisCommand(['MGET', ...ids.map(id => itemKey('comment', id))], options);
    for (const value of records || []) {
      if (!value) continue;
      try {
        const item = JSON.parse(value);
        if (item.status === 'approved') items.push(item);
      } catch { /* Ignore a corrupt record while keeping pagination aligned. */ }
      if (items.length === 100) break;
    }
    offset += ids.length;
    if (ids.length < 101) break;
  }
  return items;
}

export async function setCommunityItemStatus(kind, id, status, options = {}) {
  const key = itemKey(kind, id);
  const source = await redisCommand(['GET', key], options);
  if (!source) return null;
  const item = JSON.parse(source);
  const pending = itemKey(kind === 'comment' ? 'comments' : kind === 'report' ? 'reports' : 'submissions', 'pending');
  const thread = kind === 'comment' ? itemKey('comments', targetKey(item.target)) : pending;
  const updated = await redisCommand(['EVAL', TRANSITION, '3', key, pending, thread, status, new Date().toISOString(), id, kind], options);
  return updated === -1 ? { conflict: true } : updated ? JSON.parse(updated) : null;
}
