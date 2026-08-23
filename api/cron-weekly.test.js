import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "./cron-weekly.js";

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

test("legacy cron-weekly endpoint is a no-op after repo migration", async () => {
  const res = mockResponse();
  await handler({ method: "POST" }, res);
  assert.equal(res.statusCode, 410);
  assert.equal(res.body.ok, false);
  assert.match(res.body.error, /repo-managed/i);
});
