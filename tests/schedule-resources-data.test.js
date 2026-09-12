import { test } from "node:test";
import assert from "node:assert/strict";
import scheduleResources from "../src/data/scheduleResources.js";
import { CALENDAR_EVENTS } from "../src/scheduleConfig.js";

const clickableSeptemberEvents = CALENDAR_EVENTS.filter(event => event.slug);

test("September schedule topics have repo-managed candidate resources", () => {
  assert.equal(clickableSeptemberEvents.length, 6);

  for (const event of clickableSeptemberEvents) {
    const resource = scheduleResources[event.slug];
    assert.ok(resource, `${event.slug} should have a schedule resource bundle`);
    assert.ok(
      resource.guidelines.length + resource.newsAndArticles.length > 0,
      `${event.slug} should include at least one guideline or news/article resource`,
    );
    assert.equal(resource.resourceStatus, "candidate-review");
    assert.equal(resource.quizStatus, "pending-autocontent-pdf-pull");
    assert.ok(Array.isArray(resource.quiz));
    assert.ok(Array.isArray(resource.quizSourcePdfs));
  }
});

test("IBD and tumor-pathology lectures include current/archived Weekly Update matches", () => {
  assert.ok(
    scheduleResources.ibd.newsAndArticles.some(item => /upadacitinib/i.test(item.title)),
    "IBD should include the upadacitinib Weekly Update card",
  );
  assert.ok(
    scheduleResources["ibd-gi-tumors-pathology"].newsAndArticles.some(item => /Lynch syndrome/i.test(item.title)),
    "IBD/GI tumors pathology should include hereditary CRC archive material",
  );
});

test("sparse schedule topics include targeted online News and Articles candidates", () => {
  for (const event of clickableSeptemberEvents) {
    const resource = scheduleResources[event.slug];
    assert.ok(
      resource.newsAndArticles.length >= 3,
      `${event.slug} should have at least 3 News and Articles candidates after targeted enrichment`,
    );
  }

  assert.ok(
    scheduleResources["gi-bleeding"].newsAndArticles.some(item => item.sourceRepository === "targeted-online-pull"),
    "GI bleeding should include targeted online candidates, not only guideline resources",
  );
  assert.ok(
    scheduleResources["hypertriglyceridemia-acute-pancreatitis"].newsAndArticles.some(item => item.sourceRepository === "targeted-online-pull"),
    "Acute pancreatitis should include targeted online candidates, not only guideline resources",
  );
});
