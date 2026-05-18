import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { requireCronAuth } from "./cron-auth.js";

function mockRes() {
  const res = { _status: null, _body: null };
  res.status = (code) => { res._status = code; return res; };
  res.json   = (body) => { res._body = body; return res; };
  return res;
}

beforeEach(() => {
  delete process.env.CRON_SECRET;
});

test("returns false and 500 when CRON_SECRET is not configured", () => {
  const res = mockRes();
  const ok = requireCronAuth({ headers: { authorization: "Bearer anything" } }, res);
  assert.equal(ok, false);
  assert.equal(res._status, 500);
  assert.match(res._body.error, /CRON_SECRET not configured/);
});

test("returns false and 401 when Authorization header is missing", () => {
  process.env.CRON_SECRET = "s3cret";
  const res = mockRes();
  const ok = requireCronAuth({ headers: {} }, res);
  assert.equal(ok, false);
  assert.equal(res._status, 401);
  assert.equal(res._body.error, "Unauthorized");
});

test("returns false and 401 when Authorization header is wrong", () => {
  process.env.CRON_SECRET = "s3cret";
  const res = mockRes();
  const ok = requireCronAuth({ headers: { authorization: "Bearer wrong" } }, res);
  assert.equal(ok, false);
  assert.equal(res._status, 401);
});

test("returns false and 401 for missing Bearer prefix", () => {
  process.env.CRON_SECRET = "s3cret";
  const res = mockRes();
  const ok = requireCronAuth({ headers: { authorization: "s3cret" } }, res);
  assert.equal(ok, false);
  assert.equal(res._status, 401);
});

test("returns false and 401 when CRON_SECRET is empty string", () => {
  // Empty CRON_SECRET should be treated as "not configured" so we don't
  // accidentally accept `Bearer ` as valid.
  process.env.CRON_SECRET = "";
  const res = mockRes();
  const ok = requireCronAuth({ headers: { authorization: "Bearer " } }, res);
  assert.equal(ok, false);
  assert.equal(res._status, 500);
});

test("returns true and writes nothing to res when header matches", () => {
  process.env.CRON_SECRET = "s3cret";
  const res = mockRes();
  const ok = requireCronAuth({ headers: { authorization: "Bearer s3cret" } }, res);
  assert.equal(ok, true);
  assert.equal(res._status, null);
  assert.equal(res._body, null);
});

test("does not crash when req.headers is undefined", () => {
  process.env.CRON_SECRET = "s3cret";
  const res = mockRes();
  const ok = requireCronAuth({}, res);
  assert.equal(ok, false);
  assert.equal(res._status, 401);
});
