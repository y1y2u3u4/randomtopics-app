import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import * as React from "react";
import * as ideas from "../src/data/twoTruthsIdeas.ts";
import * as round from "../src/lib/twoTruthsRound.ts";
import { INTENT_OWNERS, normalizeQuery } from "../src/lib/growthOpportunities.ts";

const all = ideas.TWO_TRUTHS_IDEA_GROUPS.flatMap((group) => [...group.items]);
assert.equal(ideas.TWO_TRUTHS_IDEA_COUNT, 120);
assert.equal(new Set(all).size, 120, "Every visible statement must be unique");
for (const group of ideas.TWO_TRUTHS_IDEA_GROUPS) {
  assert.equal(group.items.length, 30);
  assert.ok(group.items.every((item) => item.length > 15 && item.length <= 240));
  let used = new Set();
  const seen = [];
  for (let draw = 0; draw < 10; draw += 1) {
    const previous = [...used];
    const result = round.drawStatementIdeas(group.items, used, () => 0.42);
    assert.deepEqual([...used], previous, "Do not mutate React state");
    assert.equal(result.statements.length, 3);
    assert.equal(new Set(result.statements).size, 3);
    used = result.used;
    seen.push(...result.statements);
  }
  assert.equal(new Set(seen).size, 30, "No repeats before exhausting a category");
  assert.equal(round.drawStatementIdeas(group.items, used).statements.length, 3);
}
assert.equal(round.drawStatementIdeas(["one", "one", "two"], new Set()), null);
const partial = round.drawStatementIdeas(["one", "two", "three", "four"], new Set(["one", "two", "three", "outside-pool"]), () => 0);
assert.equal(partial.statements[0], "four", "Consume the last unseen idea before resetting");
assert.equal(new Set(partial.statements).size, 3, "A reset cannot duplicate a statement inside a round");
assert.ok(partial.used.has("outside-pool"), "A filter change must retain other categories' history");
assert.equal(round.isCompleteRound(["One.", "Two!", "Three?"]), true);
for (const invalid of [["", "Two", "Three"], ["One"], ["One", "one.", "Three"], ["I like tea.", " I   like tea . ", "Three"]]) {
  assert.equal(round.isCompleteRound(invalid), false);
}
assert.equal(round.formatPlayerRound([" One. ", "Two.", "Three."]), "Two truths and a lie — which statement is false?\n1. One.\n2. Two.\n3. Three.");
for (const query of ["two truths and a lie ideas", "2 truths and a lie ideas", "funny two truths and a lie examples", "two truths and a lie examples for work"]) {
  assert.equal(INTENT_OWNERS.find((rule) => rule.match.test(normalizeQuery(query)))?.path, "/topics/two-truths-and-a-lie-ideas");
}
assert.equal(INTENT_OWNERS.find((rule) => rule.match.test("two truths and a lie generator")), undefined, "The themed generator has a separate job");

const require = createRequire(import.meta.url);
function loadModule(relativePath, overrides, globals = {}) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const target = { exports: {} };
  new Function("require", "module", "exports", ...Object.keys(globals), code)(
    (id) => Object.hasOwn(overrides, id) ? overrides[id] : require(id), target, target.exports, ...Object.values(globals),
  );
  return target.exports;
}
const article = loadModule("../src/data/seoContent.ts", { "./twoTruthsIdeas": ideas }).SEO_ARTICLES.find((item) => item.slug === "two-truths-and-a-lie-ideas");
assert.deepEqual(article.sections.flatMap((section) => section.items), all, "The printable list and builder must share the same 120 ideas");
assert.equal(article.metaTitle, "120 Two Truths and a Lie Ideas — Good Examples for Work & Fun | RandomTopics", "Keep the established title stable this iteration");
assert.equal(article.publishDate, "2026-07-06", "Do not rewrite publication history");

// Exercise the actual component's event handlers, without a dev server or a DOM dependency.
function descendants(node) {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(descendants);
  return [node, ...descendants(node.props?.children)];
}
const ResultActions = () => null;
function builderHarness() {
  const state = [];
  let cursor = 0;
  const events = [];
  const Component = loadModule("../src/components/TwoTruthsRoundBuilder.tsx", {
    react: { ...React, useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    } },
    "@/data/twoTruthsIdeas": ideas, "@/lib/twoTruthsRound": round,
    "@/lib/track": { track: (name, params) => events.push({ name, params }) },
    "@/components/GeneratedResultActions": { default: ResultActions },
  }).default;
  const render = () => { cursor = 0; return descendants(Component()); };
  return { events, render, actions: () => render().find((node) => node.type === ResultActions)?.props };
}
const harness = builderHarness();
const values = () => harness.render().filter((node) => node.type === "textarea").map((node) => node.props.value);
const selectLie = (index) => harness.render().find((node) => node.props?.["aria-label"] === `Statement ${index + 1} is my lie`).props.onChange();
const draw = () => harness.render().find((node) => node.props?.["data-generate-button"]).props.onClick();
assert.deepEqual(values(), ideas.TWO_TRUTHS_IDEA_GROUPS[0].items.slice(0, 3));
assert.equal(harness.events.length, 0, "Rendering an example is not a generation");
assert.equal(harness.actions(), undefined, "Do not treat an unselected lie as a prepared round");
selectLie(0);
assert.equal(harness.actions().isPostGenerate, false, "Example interactions are not strict post-generation actions");
const initialSavedId = harness.actions().saveTopic.id;
draw();
assert.equal(harness.actions(), undefined, "Drawing resets the selected lie");
assert.equal(new Set(values()).size, 3);
assert.ok(values().every((value) => !ideas.TWO_TRUTHS_IDEA_GROUPS[0].items.slice(0, 3).includes(value)), "Do not repeat the initial example on the first draw");
assert.deepEqual(harness.events.slice(-2).map((event) => event.name), ["generate_start", "generate_success"]);
selectLie(1);
const generatedActions = harness.actions();
assert.equal(generatedActions.isPostGenerate, true);
assert.notEqual(generatedActions.saveTopic.id, initialSavedId);
assert.equal(generatedActions.copyValue, round.formatPlayerRound(values()));
assert.equal(generatedActions.saveTopic.text, generatedActions.copyValue);
assert.deepEqual(generatedActions.saveTopic.talkingPoints, [], "Saved-round copy must not disclose the answer either");
const beforeFilter = values();
harness.render().find((node) => node.type === "select").props.onChange({ target: { value: "students" } });
assert.deepEqual(values(), beforeFilter, "Changing the next-draw filter must not erase edits");
const edit = harness.render().find((node) => node.type === "textarea");
const eventsBeforeEdit = harness.events.length;
edit.props.onChange({ target: { value: "A private test statement unique to this test." } });
assert.equal(harness.events.length, eventsBeforeEdit, "Typing must not emit personal text");
assert.notEqual(harness.actions().saveTopic.id, generatedActions.saveTopic.id, "An edited round must not toggle a previous saved version");
assert.equal(harness.actions().actionViewIdentity, generatedActions.actionViewIdentity, "Typing must not create a new action-view identity");
const reveal = () => harness.render().find((node) => node.props?.["aria-controls"] === "two-truths-answer").props.onClick();
reveal();
assert.equal(harness.render().find((node) => node.props?.id === "two-truths-answer").props.children, "Your chosen lie is statement 2.");
assert.doesNotMatch(harness.actions().copyValue, /Your chosen lie/);
reveal();
assert.equal(harness.render().find((node) => node.props?.id === "two-truths-answer").props.children, "");
draw();
assert.ok(values().every((value) => ideas.TWO_TRUTHS_IDEA_GROUPS[1].items.includes(value)));
assert.ok(harness.events.some((event) => event.name === "repeat_generate"));
assert.doesNotMatch(JSON.stringify(harness.events), /private test statement/);
selectLie(2);
harness.render().find((node) => node.type === "textarea").props.onChange({ target: { value: " " } });
assert.equal(harness.actions(), undefined, "Block incomplete rounds");
const secondSession = builderHarness();
secondSession.render().find((node) => node.props?.["aria-label"] === "Statement 1 is my lie").props.onChange();
assert.notEqual(secondSession.actions().saveTopic.id, initialSavedId, "Different sessions need collision-resistant local save IDs");

let drawn = 0;
let scrolled = 0;
const entryEvents = [];
const Entry = loadModule("../src/components/ArticleGeneratorEntry.tsx", { "@/lib/track": { track: (...args) => entryEvents.push(args) } }, {
  document: { getElementById: () => ({ querySelector: () => ({ click: () => drawn++, focus() {} }), scrollIntoView: () => scrolled++ }) },
  window: { matchMedia: () => ({ matches: true }) },
}).default;
for (const generateOnClick of [false, true]) {
  const anchor = descendants(Entry({ source: "test", surface: "article_middle", generateOnClick })).find((node) => node.type === "a");
  anchor.props.onClick({ preventDefault() {} });
  assert.equal(drawn, generateOnClick ? 1 : 0, "Return-to-round must not overwrite the user's work; existing entry behavior remains unchanged");
}
assert.equal(scrolled, 2);
assert.equal(entryEvents.length, 2);
console.log("PASS: 120 real ideas, no-repeat pools, round validation, article/print parity, actual builder handlers, answer-safe payloads, private analytics, save identity, and non-destructive return links.");
