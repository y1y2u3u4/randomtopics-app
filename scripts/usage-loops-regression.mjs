import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import * as React from "react";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
function load(path, overrides = {}, globals = {}) {
  const filename = [path, `${path}.ts`, `${path}.tsx`].map((file) => resolve(root, file)).find(existsSync);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const target = { exports: {} };
  new Function("require", "module", "exports", ...Object.keys(globals), code)((id) => {
    if (Object.hasOwn(overrides, id)) return overrides[id];
    if (id.startsWith("@/")) return load(`src/${id.slice(2)}`, overrides, globals);
    if (id.startsWith(".")) return load(resolve(dirname(filename), id), overrides, globals);
    return require(id);
  }, target, target.exports, ...Object.values(globals));
  return target.exports;
}
function descendants(node) {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(descendants);
  return [node, ...descendants(node.props?.children)];
}
function label(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(label).join("");
  return label(node?.props?.children ?? "");
}
const Actions = () => null;
const TopicCard = () => null;
const pool = load("src/lib/topicPool.ts");
const spanish = load("src/data/topics.es.ts");
const types = load("src/data/types.ts");
const dictionaries = load("src/i18n/dictionaries.ts");
function harness(path, props, extra = {}, globals = {}) {
  const state = [], effects = [], events = [];
  let cursor = 0;
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    },
    useMemo: (fn) => fn(), useCallback: (fn) => fn, useEffect: (fn) => effects.push(fn),
    useId: () => "test-copy", useSyncExternalStore: () => "[]",
  };
  const Component = load(path, {
    react,
    "next/link": { default: "a" }, "next/dynamic": { default: () => "speech-panel" },
    "framer-motion": { motion: new Proxy({}, { get: (_, key) => key }), AnimatePresence: "fragment" },
    "@/lib/track": { track: (name, params) => events.push({ name, params }) },
    "@/data/topics.es": spanish, "@/data/types": types, "@/i18n/dictionaries": dictionaries,
    "@/lib/topicPool": pool, "@/lib/topicLibrary": { recordRecentTopics() {}, toggleFavoriteTopic: () => ({ persisted: true, saved: true }) },
    "./GeneratedResultActions": { default: Actions }, "./TopicCard": { default: TopicCard },
    "./PrintButton": { default: "print-button" }, "./SpeechTimer": { default: "speech-timer" },
    ...extra,
  }, { window: { setTimeout() {}, setInterval() {}, clearTimeout() {}, clearInterval() {}, location: { origin: "https://randomtopics.app", pathname: "/question-of-the-day", search: "?private=value" } }, ...globals }).default;
  const render = () => { cursor = 0; effects.length = 0; return descendants(Component(props)); };
  const button = (name) => render().find((node) => node.type === "button" && label(node).trim() === name);
  return { render, button, events, effects, actions: () => render().find((node) => node.type === Actions)?.props };
}

// Pool exhaustion, partial batches, filtered histories, and immutable inputs.
const initial = new Set(["a", "b", "outside"]);
const draw = pool.drawUnseen(["a", "b", "c", "c"], initial, (x) => x, 10, () => 0);
assert.deepEqual(draw.picked, ["c", "a", "b"]);
assert.deepEqual([...initial], ["a", "b", "outside"]);
assert.ok(draw.used.has("outside"));
assert.equal(new Set(draw.picked).size, 3);
assert.deepEqual(pool.drawUnseen([], initial, (x) => x).picked, []);

// Exercise real Spanish UI handlers, including the previously empty philosophy/light case.
const topics = spanish.getLocalizedTopics("es");
assert.equal(pool.filterTopicPool(topics, { mode: "conversation" }).length, 320);
let emptyCombinations = 0;
for (const category of types.CATEGORIES) {
  const h = harness("src/components/TopicGenerator.tsx", { initialMode: "conversation", locale: "es" });
  const categoryButton = h.render().find((node) => node.type === "button" && node.key === category.id);
  categoryButton.props.onClick();
  for (const depth of types.DEPTHS) {
    const choice = h.render().find((node) => node.type === "button" && node.key === depth.id);
    const available = pool.filterTopicPool(topics, { mode: "conversation", category: category.id, depth: depth.id });
    assert.equal(choice.props.disabled, available.length === 0);
    if (!available.length) { emptyCombinations++; continue; }
    choice.props.onClick();
    h.button("10").props.onClick();
    await h.render().find((node) => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick();
    const results = h.render().filter((node) => node.type === TopicCard).map((node) => node.props.topic);
    assert.equal(results.length, Math.min(10, available.length));
    assert.equal(new Set(results.map((item) => item.id)).size, results.length);
    assert.ok(results.every((item) => item.category === category.id && item.depth === depth.id));
    assert.equal(h.events.some((event) => event.name === "generate_error"), false);
    // Clear depth before inspecting the next depth.
    h.render().find((node) => node.type === "button" && node.key === depth.id).props.onClick();
  }
}
assert.equal(emptyCombinations, 7);
const switcher = harness("src/components/TopicGenerator.tsx", { initialMode: "conversation", locale: "es" });
switcher.render().find((node) => node.type === "button" && node.key === "light").props.onClick();
switcher.render().find((node) => node.type === "button" && node.key === "philosophy").props.onClick();
assert.equal(switcher.render().find((node) => node.type === "button" && node.key === "light").props["aria-pressed"], false);
assert.ok(switcher.render().some((node) => label(node).includes("Profundidad restablecida")));

// Today's default is never a generation; random results preserve history across filters.
const qotd = load("src/data/questionOfTheDay.ts");
const day = harness("src/components/QuestionOfTheDay.tsx", { initialIdx: 0, initialDateLabel: "September 12" });
assert.equal(day.actions().isPostGenerate, false);
assert.equal(day.events.length, 0);
assert.equal(day.actions().copyAsGroupMessage, true);
const seen = new Set([qotd.QOTD_QUESTIONS[0].q]);
for (let i = 1; i < qotd.QOTD_QUESTIONS.length; i++) {
  day.button("🎲 Random Question").props.onClick();
  const result = day.actions();
  assert.equal(result.isPostGenerate, true);
  assert.equal(seen.has(result.text), false);
  seen.add(result.text);
}
day.button("✨ Back to today's").props.onClick();
assert.equal(day.actions().isPostGenerate, false);
assert.equal(day.events.filter((event) => event.name === "generate_success").length, 119);

// Party flows expose strict actions only after generating and retain pool history.
const party = harness("src/components/PartyGenerator.tsx", { questions: ["A one", "A two", "B one"], title: "Party test", subtitle: "", emoji: "🎲", filters: [{ id: "a", label: "A", prefix: "A" }] });
assert.equal(party.actions(), undefined);
const partySeen = new Set();
for (let i = 0; i < 3; i++) {
  party.render().find((node) => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick();
  const result = party.actions();
  assert.equal(partySeen.has(result.text), false);
  assert.equal(result.isPostGenerate, true);
  partySeen.add(result.text);
}

// Every Spanish article question has its own two perspectives and follow-up.
const esArticle = load("src/data/seoContent.es.part2.ts").seoArticlesEsPart2.find((article) => article.slug === "controversial-topics-to-discuss");
const support = load("src/data/controversialDiscussion.es.ts").ES_CONTROVERSIAL_SUPPORT;
assert.equal(support.length, 55);
assert.deepEqual(support.map((item) => item.prompt), esArticle.sections.flatMap((section) => section.items));
assert.equal(new Set(support.flatMap((item) => item.items)).size, 165);
assert.ok(support.every((item) => item.items.length === 3 && item.items[0].startsWith("Perspectiva A:") && item.items[2].startsWith("Para profundizar:")));

// Actual action handlers: success, failure, initial-card exclusion, and URL privacy.
let copiedValue = "";
let copySucceeds = false;
const actionProps = { text: "Private question", copyValue: "Private group text", shareTitle: "Question", toolType: "question_of_the_day", contentSource: "qotd_hub", isPostGenerate: false, copyAsGroupMessage: true };
const action = harness("src/components/GeneratedResultActions.tsx", actionProps, { "@/lib/clipboard": { copyText: async (text) => { copiedValue = text; return copySucceeds; }, shareText: async () => ({ status: "aborted" }) } });
await action.button("⧉Copy topic + points").props.onClick();
assert.equal(action.render().find((node) => node.type === "textarea").props.value, "Private group text\nhttps://randomtopics.app/question-of-the-day");
assert.deepEqual(action.events.map((event) => event.name), ["copy_error"]);
copySucceeds = true;
await action.button("⧉Copy topic + points").props.onClick();
assert.equal(action.events.filter((event) => event.name === "post_generate_copy").length, 0);
actionProps.isPostGenerate = true;
await action.render().find((node) => node.type === "button").props.onClick();
assert.equal(action.events.filter((event) => event.name === "post_generate_copy").length, 1);
assert.equal(copiedValue.includes("?"), false);
assert.equal(JSON.stringify(action.events).includes("Private"), false);

// A browser may leave writeText pending indefinitely instead of rejecting it.
// The actual helper must finish and allow the UI to expose its manual fallback.
for (const [nativeResult, legacyResult, expected] of [
  ["success", false, true], ["reject", true, true],
  ["pending", true, true], ["pending", false, false], ["reject", false, false],
]) {
  let removed = false;
  const helper = load("src/lib/clipboard.ts", {}, {
    navigator: { clipboard: { writeText: () => nativeResult === "success" ? Promise.resolve() : nativeResult === "reject" ? Promise.reject(new Error("blocked")) : new Promise(() => {}) } },
    document: {
      createElement: () => ({ value: "", style: {}, setAttribute() {}, select() {}, remove() { removed = true; } }),
      body: { appendChild() {} }, execCommand: () => legacyResult,
    },
    setTimeout: (fn) => setTimeout(fn, 5), clearTimeout,
  });
  assert.equal(await helper.copyText("Example"), expected, `Clipboard ${nativeResult}/${legacyResult}`);
  assert.equal(removed, nativeResult !== "success");
}

// Practice card carries the chosen generated topic and keeps notes out of analytics.
const practice = harness("src/components/SpeechPracticePanel.tsx", { topics: topics.slice(0, 2), contentSource: "speech_hub" });
const firstRound = practice.render().find((node) => typeof node.type === "function");
assert.equal(firstRound.props.topic.id, topics[0].id);
practice.render().find((node) => node.type === "select").props.onChange({ target: { value: topics[1].id } });
const secondRound = practice.render().find((node) => typeof node.type === "function");
assert.equal(secondRound.props.topic.id, topics[1].id);
assert.equal(JSON.stringify(practice.events).includes(topics[1].text), false);
console.log("PASS: all 48 Spanish conversation filters, safe pool exhaustion, QOTD default/random separation, party actions, 55 complete Spanish discussion cards, copy failure recovery, private event payloads, and speech topic selection.");
