import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/claude.js";
import guidelines from "../src/data/guidelines.js";

function mockResponse() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
  };
  return res;
}

test("/api/claude serves guidelines from repo-managed data", async () => {
  const req = { method: "POST", body: { type: "content", section: "guidelines", page: "all" } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.source, "repo");
  assert.deepEqual(res.body.data, guidelines);
  assert.equal(res.body.total, guidelines.length);
});

test("/api/claude no longer serves Redis guideline-new alerts", async () => {
  const req = { method: "POST", body: { type: "content", section: "guidelines-new" } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.data, []);
});
