import crypto from 'node:crypto';
import { redisCommand } from './communityStore.js';

const INDEX = 'gihub:auth:successful-logins';
const RETENTION_SECONDS = 90 * 24 * 60 * 60;

// Keep each event under its own 90-day TTL; a quiet period must not extend PII retention.
const APPEND_LOGIN = `
redis.call('SET', KEYS[2], ARGV[2], 'EX', ARGV[4])
redis.call('ZADD', KEYS[1], ARGV[1], ARGV[5])
redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[3])
redis.call('EXPIRE', KEYS[1], ARGV[4])
return 1`;

export async function recordGihubLogin(user, { env, fetchImpl, now = Date.now } = {}) {
  const timestamp = now();
  const event = {
    id: crypto.randomUUID(),
    userId: user.id,
    email: user.email,
    at: new Date(timestamp).toISOString(),
  };
  const result = await redisCommand([
    'EVAL', APPEND_LOGIN, '2', INDEX, `gihub:auth:login-event:${event.id}`,
    String(timestamp), JSON.stringify(event),
    String(timestamp - RETENTION_SECONDS * 1000), String(RETENTION_SECONDS), event.id,
  ], { env, fetchImpl });
  if (result !== 1) throw new Error('Login audit storage unavailable');
}
