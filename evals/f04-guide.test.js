import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("app.js", "utf8");

test("F-04-1: THE SYSTEM SHALL show Business Credit and Treasury Management", () => {
  assert.match(app, /name:\s*"Business Credit"/);
  assert.match(app, /name:\s*"Treasury Management"/);
});

test("F-04-2: WHEN an intern selects an area, THE SYSTEM SHALL display its summary and at least one conversation starter", () => {
  const businessCredit = app.match(
    /name:\s*"Business Credit"[\s\S]*?summary:\s*"([^"]+)"[\s\S]*?conversationStarters:\s*\[([\s\S]*?)\]/
  );

  const treasuryManagement = app.match(
    /name:\s*"Treasury Management"[\s\S]*?summary:\s*"([^"]+)"[\s\S]*?conversationStarters:\s*\[([\s\S]*?)\]/
  );

  assert.ok(
    businessCredit,
    "Business Credit must have a summary and conversation starters"
  );

  assert.ok(
    treasuryManagement,
    "Treasury Management must have a summary and conversation starters"
  );

  assert.ok(businessCredit[1].trim().length > 0);
  assert.ok(businessCredit[2].includes('"'));

  assert.ok(treasuryManagement[1].trim().length > 0);
  assert.ok(treasuryManagement[2].includes('"'));
});

test("F-04-3: WHEN an intern selects a different area, THE SYSTEM SHALL show the newly selected area's content", () => {
  assert.match(
    app,
    /option\.addEventListener\("click",\s*\(\)\s*=>\s*showBusinessArea\(area\)\)/
  );

  assert.match(
    app,
    /guideDetail\.replaceChildren\(\)/
  );

  assert.match(
    app,
    /option\.setAttribute\("aria-pressed",\s*String\(option\.dataset\.areaId === area\.id\)\)/
  );
});

test("F-04-4: THE SYSTEM SHALL label each summary as illustrative", () => {
  assert.match(
    app,
    /Illustrative summary only\. Not an official role description or transfer recommendation\./
  );
});

test("F-04 integration: GET /entries remains available", async () => {
  const API = process.env.API;

  assert.ok(
    API,
    "Set API to the deployed Worker URL before running the API test"
  );

  const response = await fetch(`${API}/entries`);

  assert.equal(response.status, 200);

  const entries = await response.json();

  assert.ok(Array.isArray(entries));
});