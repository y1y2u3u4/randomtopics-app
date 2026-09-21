import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as React from "react";
import ts from "typescript";
import * as bank from "../src/data/charades.ts";
import * as pool from "../src/lib/topicPool.ts";
const require = createRequire(import.meta.url);
const state = [], effects = [], memo = [], events = [], intervals = new Map(), listeners = new Map();
let cursor = 0, now = 0, serial = 0, pending = [];
const changed = (a, b) => !a || a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));
const react = {
  ...React,
  useState(initial) { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], (v) => { state[i] = typeof v === "function" ? v(state[i]) : v; }]; },
  useRef(initial) { const i = cursor++; return state[i] ??= { current: initial }; },
  useMemo(fn, deps) { const i = cursor++; if (changed(memo[i]?.deps, deps)) memo[i] = { deps, value: fn() }; return memo[i].value; },
  useCallback(fn, deps) { return this.useMemo(() => fn, deps); },
  useEffect(fn, deps) { const i = cursor++; if (changed(effects[i]?.deps, deps)) pending.push(() => { effects[i]?.cleanup?.(); effects[i] = { deps, cleanup: fn() }; }); },
};
// Transpiled React calls do not bind `this`.
react.useCallback = (fn, deps) => react.useMemo(() => fn, deps);
const target = { exports: {} };
const source = readFileSync(new URL("../src/components/CharadesGenerator.tsx", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
new Function("require", "module", "exports", "Date", "setInterval", "clearInterval", "document", code)((id) => {
  if (id === "react") return react;
  if (id === "@/data/charades") return bank;
  if (id === "@/lib/topicPool") return pool;
  if (id === "@/lib/track") return { track: (name, params) => events.push({ name, params }) };
  if (id === "./PrintButton") return { default: "print-button" };
  return require(id);
}, target, target.exports, { now: () => now }, (fn) => { intervals.set(++serial, fn); return serial; }, (id) => intervals.delete(id), {
  addEventListener: (name, fn) => listeners.set(name, fn),
  removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
});
const descend = (node) => !node || typeof node !== "object" ? [] : Array.isArray(node) ? node.flatMap(descend) : [node, ...descend(node.props?.children)];
const text = (node) => node == null || typeof node === "boolean" ? "" : typeof node !== "object" ? String(node) : Array.isArray(node) ? node.map(text).join("") : text(node.props?.children);
function render() { cursor = 0; const tree = target.exports.default(); const jobs = pending; pending = []; jobs.forEach((fn) => fn()); return tree; }
const button = (label) => descend(render()).find((n) => n.type === "button" && text(n) === label);
function click(label) { const b = button(label); assert.ok(b, `Button exists: ${label}`); assert.ok(!b.props.disabled, `${label} is enabled`); b.props.onClick(); render(); }
function shown(value) { assert.ok(text(render()).includes(value), `Expected: ${value}`); }
function tick(ms) { now += ms; [...intervals.values()].forEach((fn) => fn()); render(); }
const result = () => text(descend(render()).find((n) => n.props?.["data-charades-result"]));
const count = (name) => events.filter((event) => event.name === name).length;
assert.equal(new Set(bank.CHARADES_WORDS.map((w) => w.w.toLowerCase())).size, 528);
render(); assert.equal(count("generate_success"), 0);
click("Hard"); click("🧸 Kids & Family");
shown("No words match"); assert.equal(button("🎭 Deal a Word").props.disabled, true);
assert.equal(button("Hard (0)").props.disabled, true);
assert.ok(!descend(render()).find((n) => n.type === "print-button"));
click("Use any difficulty"); shown("60 words in this deck");
click("🎭 Deal a Word"); const first = result();
assert.equal(intervals.size, 0, "Deal waits for the actor instead of starting the clock");
click("Hide word"); assert.equal(result(), "Ready to act?");
assert.ok(!text(render()).includes(first), "Hidden answer is removed from the rendered card");
click("Reveal word"); assert.equal(result(), first);
click("Start round"); assert.equal(result(), "Ready to act?");
tick(6000); shown("54s");
now += 350; click("Pause timer"); tick(30_000); shown("54s");
click("Resume timer"); tick(53_649); shown("1s"); tick(1); shown("Time’s up!");
assert.equal(count("timer_complete"), 1); tick(60_000); assert.equal(count("timer_complete"), 1);
click("Restart timer"); now += 65_000; listeners.get("visibilitychange")(); render();
assert.equal(count("timer_complete"), 2);
click("Restart timer"); now += 60_001; click("Pause timer");
assert.equal(count("timer_complete"), 3, "Overdue pause completes rather than leaving a stuck paused timer");
click("Restart timer"); click("30s"); tick(60_000); shown("Read your word first"); assert.equal(count("timer_complete"), 3);
click("Start round"); click("Off"); tick(60_000); shown("Timer off"); assert.equal(count("timer_complete"), 3);
click("All"); click("🧸 Kids & Family"); shown("59 unseen");
const seen = new Set([first]);
for (let i = 1; i < 60; i++) { click("🎭 Next Word"); const word = result(); assert.ok(!seen.has(word), "No duplicate before deck exhaustion, including category switches"); seen.add(word); }
shown("0 unseen"); click("🎭 Next Word"); assert.equal(count("generate_success"), 61);
const print = descend(render()).find((n) => n.type === "print-button");
assert.equal(print.props.items.length, 60); assert.equal(new Set(print.props.items).size, 60);
assert.ok(print.props.items.every((item) => bank.CHARADES_WORDS.some((word) => word.c === "kids-family" && item.startsWith(word.w + " — "))));
click("30s"); click("Start round"); click("🎭 Next Word"); tick(40_000);
assert.equal(count("timer_complete"), 3, "Next word cancels old countdown");
assert.equal(count("timer_start"), 6); assert.equal(count("timer_resume"), 1);
click("Start round"); effects.forEach((effect) => effect?.cleanup?.());
assert.equal(intervals.size, 0); assert.equal(listeners.size, 0);
assert.ok(events.every((event) => !Object.keys(event.params).some((key) => /word_text|answer|prompt/.test(key))), "No word text sent in event payloads");
console.log("PASS: empty-deck recovery, actor-ready timer, hidden answer, precise pause/resume, delayed callbacks, one-time completion, preserved history, exhaustion, filtered print and cleanup.");
