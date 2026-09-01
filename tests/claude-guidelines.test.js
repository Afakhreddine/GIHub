import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/claude.js";

const ORIGINAL_FETCH = global.fetch;
const ORIGINAL_REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const ORIGINAL_REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
}

function mockRedis(recordsByKey) {
  process.env.UPSTASH_REDIS_REST_URL = "https://redis.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
  global.fetch = async (url) => {
    const key = decodeURIComponent(String(url).split("/get/")[1] || "");
    const value = recordsByKey[key];
    return {
      ok: true,
      async json() {
        return { result: value === undefined ? null : JSON.stringify(value) };
      },
    };
  };
}

afterEach(() => {
  global.fetch = ORIGINAL_FETCH;
  if (ORIGINAL_REDIS_URL === undefined) delete process.env.UPSTASH_REDIS_REST_URL;
  else process.env.UPSTASH_REDIS_REST_URL = ORIGINAL_REDIS_URL;
  if (ORIGINAL_REDIS_TOKEN === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN;
  else process.env.UPSTASH_REDIS_REST_TOKEN = ORIGINAL_REDIS_TOKEN;
});

test("/api/claude serves the existing guideline repository cache", async () => {
  const repo = Array.from({ length: 55 }, (_, index) => ({
    org: index % 2 ? "ACG" : "ASGE",
    year: "2026",
    month: "Aug",
    topic: "Guidelines",
    urgency: "Routine",
    title: `Existing repository guideline ${index + 1}`,
    summary: "Existing cached guideline repository entry.",
    url: `https://example.test/guideline-${index + 1}`,
  }));
  mockRedis({ "gihub:guidelines:repo": repo });

  const req = { method: "POST", body: { type: "content", section: "guidelines", page: "all" } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, repo);
  assert.equal(res.body.total, repo.length);
  assert.equal(res.body.source, undefined);
});

test("/api/claude paginates the existing guideline repository cache", async () => {
  const repo = Array.from({ length: 25 }, (_, index) => ({ title: `Guideline ${index + 1}` }));
  mockRedis({ "gihub:guidelines:repo": repo });

  const req = { method: "POST", body: { type: "content", section: "guidelines", page: 2 } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.page, 2);
  assert.equal(res.body.pages, 2);
  assert.equal(res.body.total, 25);
  assert.deepEqual(res.body.data, repo.slice(20, 25));
});

test("/api/claude serves incremental new-guideline alerts from cache", async () => {
  const alerts = [{ org: "ACG", title: "New incremental guideline" }];
  mockRedis({ "gihub:guidelines:new": alerts });

  const req = { method: "POST", body: { type: "content", section: "guidelines-new" } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, alerts);
});
