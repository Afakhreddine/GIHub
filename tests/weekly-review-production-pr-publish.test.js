import { test } from "node:test";
import assert from "node:assert/strict";
import { resolvePublishConfig, validatePublishRequest } from "../api/weekly-review-publish.js";

test("production review page can target a specific weekly PR when token is valid", () => {
  const env = {
    WEEKLY_REVIEW_PUBLISH_TOKEN:"review-secret",
    GITHUB_TOKEN:"github-token",
    VERCEL_ENV:"production",
  };
  const req = {
    body:{
      token:"review-secret",
      approved:true,
      approvedItems:[{ title:"Approved card", date:"Sep 1, 2026" }],
      pullNumber:10,
    },
  };
  const config = resolvePublishConfig(env, req.body);
  assert.equal(config.pullNumber, 10);
  assert.equal(validatePublishRequest(req, env).ok, true);
});

test("production review publish still refuses requests without a PR number", () => {
  const env = {
    WEEKLY_REVIEW_PUBLISH_TOKEN:"review-secret",
    GITHUB_TOKEN:"github-token",
    VERCEL_ENV:"production",
  };
  const req = {
    body:{
      token:"review-secret",
      approved:true,
      approvedItems:[{ title:"Approved card", date:"Sep 1, 2026" }],
    },
  };
  const validation = validatePublishRequest(req, env);
  assert.equal(validation.ok, false);
  assert.equal(validation.status, 400);
});
