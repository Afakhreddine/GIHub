import test from "node:test";
import assert from "node:assert/strict";
import { resolveGuidelineLink } from "../src/guidelineLinks.js";
import { KNOWN_BROKEN_GUIDELINE_URLS } from "../src/data/knownBrokenGuidelineUrls.js";
import { readFileSync } from "node:fs";

test("all Clinical Guidelines views use the current resolver (including newly added alerts)", () => {
  const source=readFileSync(new URL("../src/App.jsx",import.meta.url),"utf8");
  assert.doesNotMatch(source,/\bresolveUrl\s*\(/);
  assert.match(source,/const alertUrl = resolveGuidelineLink\(alert\)\.url/);
});

const title = "ASGE guideline on the endoscopic management of achalasia";
const dead = "https://www.asge.org/home/resources/publications/guidelines/asge-guideline-achalasia";

test("confirmed dead item-level link opens title-specific PubMed search, clearly labeled as search", () => {
  assert.ok(KNOWN_BROKEN_GUIDELINE_URLS.has(dead));
  const resolved = resolveGuidelineLink({org:"ASGE", title, url:dead});
  assert.equal(resolved.label, "Search PubMed for source ↗");
  assert.equal(new URL(resolved.url).hostname, "pubmed.ncbi.nlm.nih.gov");
  assert.ok(new URL(resolved.url).searchParams.get("term").includes(title));
});

test("valid item-level sources, including Guideline Central, are not overwritten", () => {
  const central = "https://www.guidelinecentral.com/guideline/13311/";
  assert.deepEqual(resolveGuidelineLink({org:"ACG",title:"Colitis",url:central}),{url:central,label:"View source ↗"});
  const valid = "https://pubmed.ncbi.nlm.nih.gov/40121061/";
  assert.deepEqual(resolveGuidelineLink({org:"AGA",title:"CADe",url:valid}),{url:valid,label:"View source ↗"});
});

test("generic index or missing link uses title-specific lookup instead of misleading society landing page", () => {
  for (const url of ["https://gi.org/guidelines/", "https://www.asge.org/home/resources/publications/guidelines", undefined]) {
    const result=resolveGuidelineLink({org:"ASGE",title,url});
    assert.equal(result.label,"Search PubMed for source ↗");
    assert.ok(result.url.includes(encodeURIComponent(title)));
  }
});
