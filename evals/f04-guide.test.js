import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { runInNewContext } from "node:vm";

const app = fs.readFileSync("app.js", "utf8");

class TestElement {
  constructor(tagName = "div") {
    this.tagName = tagName;
    this.children = [];
    this.attributes = new Map();
    this.dataset = {};
    this.listeners = new Map();
    this.hidden = false;
    this.value = "";
    this._textContent = "";
  }

  get textContent() {
    return this._textContent + this.children.map(child => child.textContent).join("");
  }

  set textContent(value) {
    this._textContent = String(value);
    this.children = [];
  }

  append(...children) {
    this._textContent = "";
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this._textContent = "";
    this.children = [...children];
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  click() {
    this.listeners.get("click")?.();
  }

  querySelectorAll(selector) {
    return selector === "button"
      ? this.children.filter(child => child.tagName === "button")
      : [];
  }
}

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

test("F-04-5: WHEN an intern selects a guide area, THE SYSTEM SHALL keep the directory available through GET /entries without writing entries", async () => {
  const API = process.env.API;

  assert.ok(
    API,
    "Set API to the deployed Worker URL before running the API test"
  );

  const ids = [
    "note-form",
    "note-input",
    "note-list",
    "note-error",
    "save-status",
    "empty-state",
    "guide-options",
    "guide-detail",
  ];
  const elements = new Map(ids.map(id => [id, new TestElement()]));
  const document = {
    getElementById: id => elements.get(id),
    createElement: tagName => new TestElement(tagName),
  };
  const requests = [];
  let initialLoad;
  const appFetch = (url, options = {}) => {
    const pathname = new URL(url).pathname;
    const method = options.method || "GET";
    requests.push({ pathname, method });
    const request = fetch(`${API}${pathname}`, options);
    if (!initialLoad) initialLoad = request.then(response => response.clone());
    return request;
  };

  runInNewContext(app, { document, fetch: appFetch });
  const initialResponse = await initialLoad;
  assert.equal(initialResponse.status, 200);
  assert.ok(Array.isArray(await initialResponse.json()));

  const options = elements.get("guide-options").children;
  assert.equal(options.length, 2);
  assert.equal(options[0].children[0].textContent, "Business Credit");
  assert.equal(options[1].children[0].textContent, "Treasury Management");

  options[0].click();
  assert.match(elements.get("guide-detail").textContent, /evaluate a borrower/);
  assert.equal(options[0].attributes.get("aria-pressed"), "true");

  options[1].click();
  assert.match(elements.get("guide-detail").textContent, /cash flow/);
  assert.equal(options[0].attributes.get("aria-pressed"), "false");
  assert.equal(options[1].attributes.get("aria-pressed"), "true");

  assert.deepEqual(requests, [{ pathname: "/entries", method: "GET" }]);

  const response = await fetch(`${API}/entries`);
  assert.equal(response.status, 200);
  const entries = await response.json();
  assert.ok(Array.isArray(entries));
});
