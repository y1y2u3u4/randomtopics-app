import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import * as React from "react";
import ts from "typescript";

const require = createRequire(import.meta.url);
const state = [], events = [];
let cursor = 0, revision = 0;
const Actions = () => null;
const target = { exports: {} };
const code = ts.transpileModule(readFileSync(new URL("../src/components/SpeechPracticePanel.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
new Function("require", "module", "exports", "crypto", code)((id) => {
  if (id === "react") return {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    },
  };
  if (id === "@/lib/track") return { track: (name, params) => events.push({ name, params }) };
  if (id === "./GeneratedResultActions") return { default: Actions };
  if (id === "./SpeechTimer") return { default: "speech-timer" };
  return require(id);
}, target, target.exports, { randomUUID: () => `draft-${++revision}` });
const Panel = target.exports.default;
const topics = ["A private question", "Another private question"].map((text, i) => ({
  id: `topic-${i}`, text, category: "education", modes: ["speech"], depth: "light", talkingPoints: ["Starter angle"],
}));
const props = { topics, contentSource: "speech_hub" };
const descend = (node) => !node || typeof node !== "object" ? [] : Array.isArray(node)
  ? node.flatMap(descend) : [node, ...descend(node.props?.children)];
function render() {
  cursor = 0;
  const panel = descend(Panel(props));
  const round = panel.find((node) => typeof node.type === "function");
  return [...panel, ...descend(round.type(round.props))];
}
const actions = () => render().find((node) => node.type === Actions)?.props;
const edit = (index, value) => render().filter((node) => node.type === "textarea")[index].props.onChange({ target: { value } });
const select = (id) => render().find((node) => node.type === "select").props.onChange({ target: { value: id } });
const notes = () => render().filter((node) => node.type === "textarea").map((node) => node.props.value);

assert.equal(actions(), undefined, "An untouched template cannot be copied or saved as a user's outline");
edit(0, "   ");
assert.equal(actions(), undefined, "Whitespace cannot unlock draft actions");
assert.equal(events.length, 0);
edit(0, "  My private point  ");
assert.equal(actions().copyLabel, "Copy practice draft");
assert.ok(actions().copyValue.includes("PREP draft — 1 of 4 parts\nPoint: My private point"));
assert.equal(actions().copyValue.includes("I believe this because"), false, "Placeholders must never become exported content");
assert.deepEqual(actions().saveTopic.talkingPoints, ["PREP draft — 1 of 4 parts", "Point: My private point"]);
const firstDraftId = actions().saveTopic.id;

select(topics[1].id);
assert.equal(actions(), undefined);
edit(1, "A second private reason");
const secondDraftId = actions().saveTopic.id;
select(topics[0].id);
assert.deepEqual(notes(), ["  My private point  ", "", "", ""]);
assert.equal(actions().saveTopic.id, firstDraftId, "Returning to an unchanged draft keeps its saved identity");
edit(1, "A private reason");
edit(2, "A private example");
edit(3, "My private closing point");
assert.equal(actions().copyLabel, "Copy practice outline");
assert.ok(actions().copyValue.includes("PREP outline — 4 of 4 parts"));
assert.equal(actions().saveTopic.talkingPoints.length, 5);
assert.notEqual(actions().saveTopic.id, firstDraftId, "Editing a saved draft creates a new saveable revision");
assert.equal(events.filter((event) => event.name === "practice_outline_ready").length, 1);
edit(3, "My revised private closing point");
assert.equal(events.filter((event) => event.name === "practice_outline_ready").length, 1, "Ordinary typing must not repeatedly count outline readiness");
select(topics[1].id);
assert.equal(actions().saveTopic.id, secondDraftId);
assert.deepEqual(notes(), ["", "A second private reason", "", ""]);

// Exercise the actual generation completion handler. Even a repeated topic ID
// must produce a fresh panel key, resetting drafts, selection, and timer together.
const generatorState = [], generatorEvents = [];
let generatorLocale = "es";
let generatorCursor = 0;
const generatorOverrides = {
  react: {
    ...React,
    useState(initial) {
      const index = generatorCursor++;
      if (!(index in generatorState)) generatorState[index] = typeof initial === "function" ? initial() : initial;
      return [generatorState[index], (value) => { generatorState[index] = typeof value === "function" ? value(generatorState[index]) : value; }];
    },
    useRef(initial) {
      const index = generatorCursor++;
      if (!(index in generatorState)) generatorState[index] = { current: initial };
      return generatorState[index];
    },
    useMemo: (fn) => fn(), useCallback: (fn) => fn, useEffect() {}, useId: () => "fixture-filters",
  },
  "next/link": { default: "a" },
  "next/dynamic": { default: () => "practice-panel" },
  "framer-motion": { motion: new Proxy({}, { get: (_, key) => key }), AnimatePresence: "fragment" },
  "@/data/topics.es": { getLocalizedTopics: () => [topics[0]] },
  "./TopicCard": { default: "topic-card" },
  "@/lib/track": { track(name, params) { generatorEvents.push({name, params}); } },
  "@/lib/topicLibrary": { recordRecentTopics() {} },
};
function loadGeneratorModule(file) {
  const filename = [file, `${file}.ts`, `${file}.tsx`].find(existsSync);
  const transpiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", transpiled)((id) => {
    if (Object.hasOwn(generatorOverrides, id)) return generatorOverrides[id];
    if (id.startsWith("@/")) return loadGeneratorModule(resolve(import.meta.dirname, "../src", id.slice(2)));
    if (id.startsWith(".")) return loadGeneratorModule(resolve(dirname(filename), id));
    return require(id);
  }, loaded, loaded.exports);
  return loaded.exports;
}
const Generator = loadGeneratorModule(resolve(import.meta.dirname, "../src/components/TopicGenerator.tsx")).default;
function renderGenerator() {
  generatorCursor = 0;
  return descend(Generator({ initialMode: "speech", locale: generatorLocale, speechPractice: true }));
}
const generatedPanel = () => renderGenerator().find((node) => node.type === "practice-panel");
const initialKey = generatedPanel().key;
for (let generation = 0; generation < 2; generation++) {
  const previousKey = generatedPanel().key;
  await renderGenerator().find((node) => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick();
  assert.notEqual(generatedPanel().key, previousKey, "Every new batch must remount practice even when the same topic is drawn again");
  assert.equal(generatedPanel().props.topics[0].id, topics[0].id);
}
assert.notEqual(generatedPanel().key, initialKey);
// Match React's keyed remount and verify the previous selected topic is released.
state.length = 0;
props.topics = [...topics];
assert.equal(actions(), undefined, "A new topic must not inherit another topic's notes");
assert.equal(render().find((node) => node.type === "select").props.value, topics[0].id);
assert.deepEqual(notes(), ["", "", "", ""], "A repeated topic ID starts without the previous batch's private notes");
edit(0, "New private note");
assert.equal(Object.keys(state[1]).length, 1);
assert.equal(events.some((event) => event.name === "generate_success"), false);
assert.equal(JSON.stringify(events).includes("private"), false, "Notes and prompts must not enter analytics");
assert.ok(events.every((event) => Object.keys(event.params).sort().join(",") === "content_source,locale,tool_type"));
console.log("PASS: speech drafts preserve batch selections, omit blank hints, export real notes, keep revision identities, and emit private-safe readiness events.");

// The actual English completion handler must work offline, with a synchronous
// guard for two clicks before React has committed the next render.
generatorState.length = 0;
generatorEvents.length = 0;
generatorLocale = "en";
const originalFetch = globalThis.fetch;
let englishNetworkCalls = 0;
globalThis.fetch = async () => { englishNetworkCalls++; throw Error("English topic selection must be offline"); };
try {
  const draw = renderGenerator().find(node => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick;
  await Promise.all([draw(), draw()]);
  assert.equal(generatedPanel().props.topics[0].id, topics[0].id);
  const successes = generatorEvents.filter(e => e.name === "generate_success");
  assert.equal(successes.length, 1, "A same-tick double click completes only one draw");
  assert.equal(successes[0].params.result_source, "curated_pool");
  assert.equal(successes[0].params.provider_requests, 0);
  assert.equal(englishNetworkCalls, 0);
  assert.equal(JSON.stringify(generatorEvents).includes("private"), false);
} finally { globalThis.fetch = originalFetch; }
console.log("PASS: actual English generation handler works offline and deduplicates same-tick clicks.");
