import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeUrl,
  isIndexUrl,
  identityTokens,
  dedupByIdentity,
} from "../api/guidelines-identity.js";

// ── normalizeUrl ──────────────────────────────────────────────────────────────
test("normalizeUrl strips scheme, www, query, fragment, trailing slash", () => {
  assert.equal(normalizeUrl("https://www.asge.org/foo/"), "asge.org/foo");
  assert.equal(normalizeUrl("HTTP://Gi.Org/Guidelines"), "gi.org/guidelines");
  assert.equal(normalizeUrl("https://gi.org/guidelines/?utm=x"), "gi.org/guidelines");
  assert.equal(normalizeUrl("https://gi.org/guidelines#frag"), "gi.org/guidelines");
  assert.equal(normalizeUrl(""), "");
  assert.equal(normalizeUrl(undefined), "");
});

// ── isIndexUrl ────────────────────────────────────────────────────────────────
test("isIndexUrl detects all four society index pages with and without www.", () => {
  assert.equal(isIndexUrl(normalizeUrl("https://gi.org/guidelines")), true);
  assert.equal(isIndexUrl(normalizeUrl("https://www.gi.org/guidelines/")), true);
  assert.equal(isIndexUrl(normalizeUrl("https://www.asge.org/home/resources/publications/guidelines")), true);
  assert.equal(isIndexUrl(normalizeUrl("https://www.aasld.org/practice-guidelines")), true);
  assert.equal(isIndexUrl(normalizeUrl("https://gastro.org/clinical-guidance")), true);
});

test("isIndexUrl detects guidelinecentral hallucination domain", () => {
  assert.equal(isIndexUrl(normalizeUrl("https://www.guidelinecentral.com/guidelines/acg/123")), true);
});

test("isIndexUrl returns false for item-level URLs", () => {
  assert.equal(isIndexUrl(normalizeUrl("https://pubmed.ncbi.nlm.nih.gov/40701556/")), false);
  assert.equal(isIndexUrl(normalizeUrl("https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext")), false);
});

// ── identityTokens ────────────────────────────────────────────────────────────
test("PubMed URL produces pmid token", () => {
  const tokens = identityTokens({
    org: "AGA", year: "2025", title: "Some Title",
    url: "https://pubmed.ncbi.nlm.nih.gov/40701556/",
  });
  assert.ok(tokens.includes("pmid:40701556"), "expected pmid token");
});

test("Journal article URL produces pii token", () => {
  const tokens = identityTokens({
    org: "AGA", year: "2025", title: "Some Title",
    url: "https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext",
  });
  assert.ok(tokens.some(t => t.startsWith("pii:s0016-5085(25)06013-5")), "expected pii token, got " + JSON.stringify(tokens));
});

test("Item-level URL produces year-bound url token", () => {
  const tokens = identityTokens({
    org: "ASGE", year: "2025", title: "x",
    url: "https://www.asge.org/some/specific/guideline-page",
  });
  assert.ok(tokens.some(t => t.startsWith("url:asge.org/some/specific/guideline-page|2025")), "expected url+year token, got " + JSON.stringify(tokens));
});

test("Index URL is dropped from url tokens", () => {
  const tokens = identityTokens({
    org: "ACG", year: "2025", title: "ACG UC Guideline",
    url: "https://gi.org/guidelines",
  });
  assert.ok(!tokens.some(t => t.startsWith("url:")), "url token should not be added for index pages, got " + JSON.stringify(tokens));
  assert.ok(tokens.some(t => t.startsWith("title:ACG|2025|")), "title fallback should be added");
});

test("ASGE/AASLD index URLs with www. are correctly recognized as index pages (Copilot fix)", () => {
  // Before the www. fix, these would have been treated as item URLs and
  // produced url: tokens, which would have caused false-positive collapse.
  const a = identityTokens({
    org: "ASGE", year: "2025", title: "ASGE Guideline A",
    url: "https://www.asge.org/home/resources/publications/guidelines",
  });
  const b = identityTokens({
    org: "ASGE", year: "2025", title: "ASGE Guideline B",
    url: "https://www.asge.org/home/resources/publications/guidelines",
  });
  assert.ok(!a.some(t => t.startsWith("url:")), "a should not have url token");
  assert.ok(!b.some(t => t.startsWith("url:")), "b should not have url token");
  // Different titles → different title tokens → kept distinct
  const aTitle = a.find(t => t.startsWith("title:"));
  const bTitle = b.find(t => t.startsWith("title:"));
  assert.notEqual(aTitle, bTitle);
});

test("title token is NOT added when pmid is present (Copilot fix)", () => {
  const tokens = identityTokens({
    org: "AGA", year: "2025",
    title: "Some Guideline With A Long Title That Could Otherwise Collide",
    url: "https://pubmed.ncbi.nlm.nih.gov/40701556/",
  });
  assert.ok(tokens.includes("pmid:40701556"));
  assert.ok(!tokens.some(t => t.startsWith("title:")), "title should be skipped when pmid exists, got " + JSON.stringify(tokens));
});

test("title token IS added when only an index URL is present", () => {
  const tokens = identityTokens({
    org: "ACG", year: "2025", title: "ACG Guideline",
    url: "https://gi.org/guidelines",
  });
  assert.ok(tokens.some(t => t.startsWith("title:ACG|2025|")));
});

test("entry with neither URL nor title produces no tokens", () => {
  const tokens = identityTokens({ org: "ACG", year: "2025" });
  assert.equal(tokens.length, 0);
});

// ── dedupByIdentity ───────────────────────────────────────────────────────────
test("collapses duplicate PubMed entries with title casing differences", () => {
  const arr = [
    { org: "AGA", year: "2025", title: "ACG UC Guideline", url: "https://pubmed.ncbi.nlm.nih.gov/40701556/" },
    { org: "AGA", year: "2025", title: "acg uc guideline",  url: "https://pubmed.ncbi.nlm.nih.gov/40701556/" },
  ];
  assert.equal(dedupByIdentity(arr).length, 1);
});

test("collapses duplicate journal articles with different query strings", () => {
  const arr = [
    { org: "AGA", year: "2025", title: "Foo", url: "https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext" },
    { org: "AGA", year: "2025", title: "Foo", url: "https://www.gastrojournal.org/article/S0016-5085(25)06013-5/fulltext?utm=x" },
  ];
  assert.equal(dedupByIdentity(arr).length, 1);
});

test("keeps two distinct PubMed papers with similar titles in same year (Copilot fix)", () => {
  // Before the title-as-fallback fix, both entries would have shared a
  // title: token (same org, year, normalized title prefix) and collapsed
  // despite having unique PMIDs.
  const arr = [
    { org: "AGA", year: "2025", title: "AGA Clinical Practice Guideline on Crohn Disease", url: "https://pubmed.ncbi.nlm.nih.gov/111/" },
    { org: "AGA", year: "2025", title: "AGA Clinical Practice Guideline on Crohn Disease", url: "https://pubmed.ncbi.nlm.nih.gov/222/" },
  ];
  assert.equal(dedupByIdentity(arr).length, 2);
});

test("keeps two distinct ASGE guidelines whose URL falls back to the index page (Copilot fix)", () => {
  // Before the www. fix, both would have produced a url:www.asge.org/... token
  // and the second would have been falsely dropped as a duplicate.
  const arr = [
    { org: "ASGE", year: "2025", title: "ASGE Guideline on GERD", url: "https://www.asge.org/home/resources/publications/guidelines" },
    { org: "ASGE", year: "2025", title: "ASGE Guideline on Sedation", url: "https://www.asge.org/home/resources/publications/guidelines" },
  ];
  assert.equal(dedupByIdentity(arr).length, 2);
});

test("keeps living-guideline revisions across years at the same URL", () => {
  const arr = [
    { org: "AASLD", year: "2020", title: "AASLD HCV Guidance", url: "https://www.aasld.org/specific-guidance-page" },
    { org: "AASLD", year: "2024", title: "AASLD HCV Guidance", url: "https://www.aasld.org/specific-guidance-page" },
  ];
  assert.equal(dedupByIdentity(arr).length, 2);
});

test("collapses two fetches of the same item URL within the same year", () => {
  const arr = [
    { org: "AASLD", year: "2024", title: "AASLD HCV Guidance",   url: "https://www.aasld.org/specific-guidance-page" },
    { org: "AASLD", year: "2024", title: "AASLD HCV Guidance.",  url: "https://www.aasld.org/specific-guidance-page/" },
  ];
  assert.equal(dedupByIdentity(arr).length, 1);
});

test("keeps revisions with different PMIDs (genuine 2018 vs 2024 update)", () => {
  const arr = [
    { org: "ACG", year: "2018", title: "ACG Clinical Guideline UC in Adults", url: "https://pubmed.ncbi.nlm.nih.gov/111/" },
    { org: "ACG", year: "2024", title: "ACG Clinical Guideline UC in Adults", url: "https://pubmed.ncbi.nlm.nih.gov/222/" },
  ];
  assert.equal(dedupByIdentity(arr).length, 2);
});

test("collapses ACG entries with index URL when titles match (the original bug)", () => {
  const arr = [
    { org: "ACG", year: "2025", title: "ACG Clinical Guideline: Management of IBS", url: "https://gi.org/guidelines/" },
    { org: "ACG", year: "2025", title: "ACG Clinical Guideline Management of IBS",  url: "https://gi.org/guidelines"  },
    { org: "ACG", year: "2025", title: "ACG Clinical Guideline: management of ibs", url: "https://gi.org/guidelines/" },
  ];
  assert.equal(dedupByIdentity(arr).length, 1);
});

test("keeps two distinct ACG entries with index URL but different titles", () => {
  const arr = [
    { org: "ACG", year: "2025", title: "ACG Clinical Guideline: Ulcerative Colitis", url: "https://gi.org/guidelines" },
    { org: "ACG", year: "2025", title: "ACG Clinical Guideline: Crohn Disease",      url: "https://gi.org/guidelines" },
  ];
  assert.equal(dedupByIdentity(arr).length, 2);
});

test("drops entries with no identifiable signal", () => {
  const arr = [
    { org: "ACG", year: "2025" }, // no title, no url
    { org: "ACG", year: "2025", title: "Real Title", url: "https://gi.org/guidelines" },
  ];
  assert.equal(dedupByIdentity(arr).length, 1);
});
