import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as React from "react";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(path, overrides = {}) {
  const code = ts.transpileModule(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const target = { exports: {} };
  new Function("require", "module", "exports", code)((id) => overrides[id] ?? require(id), target, target.exports);
  return target.exports;
}
function nodes(node) {
  if (!node || typeof node !== "object") return [];
  return Array.isArray(node) ? node.flatMap(nodes) : [node, ...nodes(node.props?.children)];
}
function label(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (node?.props?.["aria-hidden"]) return "";
  return Array.isArray(node) ? node.map(label).join("") : label(node?.props?.children ?? "");
}
const Actions = () => null;
function harness(groups) {
  const state = [], events = [];
  let cursor = 0;
  const Component = load("src/components/SpanishPartyRound.tsx", {
    react: { ...React, useMemo: (fn) => fn(), useState(initial) {
      const key = cursor++;
      if (!(key in state)) state[key] = typeof initial === "function" ? initial() : initial;
      return [state[key], (value) => { state[key] = typeof value === "function" ? value(state[key]) : value; }];
    } },
    "@/components/GeneratedResultActions": { default: Actions },
    "@/lib/topicPool": load("src/lib/topicPool.ts"),
    "@/lib/track": { track: (name, params) => events.push({ name, params }) },
  }).default;
  const render = () => { cursor = 0; return nodes(Component({ groups })); };
  return {
    render, events,
    click: (text) => render().find((node) => node.type === "button" && label(node).trim() === text).props.onClick(),
    group: (value) => render().find((node) => node.type === "select").props.onChange({ target: { value } }),
    action: (surface) => render().find((node) => node.type === Actions && node.props.actionSurface === surface)?.props,
  };
}

const article = load("src/data/seoContent.es.part5.ts").seoArticlesEsPart5.find((item) => item.slug === "most-likely-to-questions");
const groups = article.sections.map((section) => ({ label: section.heading, items: section.items }));
assert.equal(new Set(groups.flatMap((group) => group.items)).size, 100);
const h = harness(groups);
assert.equal(h.action("party_round_question"), undefined);
assert.equal(h.action("party_round_collection"), undefined);
assert.equal(h.events.length, 0, "Default screen is not a generated result");
h.group("group_3");
h.click("Preparar ronda");
const original = h.action("party_round_collection");
const roundItems = original.saveTopic.talkingPoints.slice(1);
assert.equal(roundItems.length, 5);
assert.equal(new Set(roundItems).size, 5);
assert.ok(roundItems.every((item) => groups[3].items.includes(item)));
assert.equal(original.copyAsGroupMessage, true);
assert.equal(original.isPostGenerate, true);
assert.equal(h.events.filter((event) => event.name === "generate_success").length, 1);
assert.equal(h.events.find((event) => event.name === "generate_success").params.result_count, 5);

const current = h.action("party_round_question").text;
h.group("group_2");
h.click("10");
assert.equal(h.action("party_round_question").text, current, "Preparing filters preserves the active round");
assert.equal(h.action("party_round_collection").copyValue, original.copyValue);
h.click("Saltar esta pregunta");
const revised = h.action("party_round_collection");
assert.equal(revised.saveTopic.talkingPoints.length, 5);
assert.equal(revised.copyValue.includes(current), false, "Skipped prompts must not be copied or saved");
assert.notEqual(revised.saveTopic.id, original.saveTopic.id, "Edited selection cannot retain the old saved identity");
for (let i = 0; i < 3; i++) h.click("Ya jugamos · siguiente");
h.click("Terminar ronda");
assert.equal(h.action("party_round_question"), undefined);
assert.equal(h.events.filter((event) => event.name === "generate_success").length, 1, "Navigation is not generation");
assert.equal(h.events.filter((event) => event.name === "party_round_complete").length, 1);
assert.equal(h.events.find((event) => event.name === "party_round_complete").params.played_count, 4);
assert.equal(h.events.find((event) => event.name === "party_round_complete").params.skipped_count, 1);
h.click("Preparar otra ronda");
assert.equal(h.action("party_round_collection").saveTopic.talkingPoints.length, 11);
assert.ok(h.action("party_round_collection").saveTopic.talkingPoints.slice(1).every((item) => groups[2].items.includes(item)));
for (let i = 0; i < 10; i++) h.click("Saltar esta pregunta");
assert.equal(h.action("party_round_collection"), undefined, "An empty selection has no false export action");
assert.equal(h.events.filter((event) => event.name === "party_round_complete").length, 2);
assert.ok(!JSON.stringify(h.events).includes("¿Quién"), "Analytics must never include question content");

const cycle = harness(groups);
cycle.click("10");
const seen = new Set();
for (let index = 0; index < 10; index++) {
  cycle.click(index ? "Preparar otra ronda" : "Preparar ronda");
  for (const question of cycle.action("party_round_collection").saveTopic.talkingPoints.slice(1)) {
    assert.equal(seen.has(question), false, "New rounds keep history until all 100 prompts have been selected");
    seen.add(question);
  }
}
assert.equal(seen.size, 100);
assert.equal(cycle.events.some((event) => event.name === "party_round_complete"), false, "Replacing a round does not count as finishing it");

const sparse = harness([{ label: "Sparse", items: ["A", "B", "B"] }]);
sparse.click("10");
sparse.click("Preparar ronda");
assert.equal(sparse.action("party_round_collection").saveTopic.talkingPoints.length, 3);
assert.equal(sparse.events.find((event) => event.name === "generate_success").params.result_count, 2);
const empty = harness([]);
assert.equal(empty.render().find((node) => node.type === "button" && node.props["data-generate-button"]).props.disabled, true);
console.log("Spanish party round regression passed: real 100-question corpus, category/size preservation, skip/export, completion, sparse pools and private analytics.");
