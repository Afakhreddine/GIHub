import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "./claude.js";
import weekly from "../src/data/weekly.js";

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

test("/api/claude serves weekly update from repo-managed data", async () => {
  const req = { method: "POST", body: { type: "content", section: "weekly" } };
  const res = mockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.source, "repo");
  assert.deepEqual(res.body.data, weekly);
});
