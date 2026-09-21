import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import * as React from "react";
import ts from "typescript";

// Run the real component with a controlled clock and delayed browser callbacks.
const require = createRequire(import.meta.url);
const state = [], effects = [], events = [], intervals = new Map(), listeners = new Map();
let cursor = 0, now = 0, serial = 0, pending = [];
const changed = (a, b) => !a || a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));
const react = {
  ...React,
  useState(initial) {
    const i = cursor++;
    if (!(i in state)) state[i] = initial;
    return [state[i], (value) => { state[i] = typeof value === "function" ? value(state[i]) : value; }];
  },
  useRef(initial) { const i = cursor++; return state[i] ??= { current: initial }; },
  useCallback(fn) { return fn; },
  useEffect(fn, deps) {
    const i = cursor++;
    if (changed(effects[i]?.deps, deps)) pending.push(() => {
      effects[i]?.cleanup?.();
      effects[i] = { deps, cleanup: fn() };
    });
  },
};
const target = { exports: {} };
const code = ts.transpileModule(readFileSync(new URL("../src/components/SpeechTimer.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
new Function("require", "module", "exports", "Date", "setInterval", "clearInterval", "document", code)((id) => {
  if (id === "react") return react;
  if (id === "@/i18n/config") return { defaultLocale: "en" };
  if (id === "@/lib/track") return { track: (name, params) => events.push({ name, params }) };
  if (id === "framer-motion") return { motion: new Proxy({}, { get: (_, key) => key }), AnimatePresence: "fragment" };
  return require(id);
}, target, target.exports, { now: () => now }, (fn) => { intervals.set(++serial, fn); return serial; }, (id) => intervals.delete(id), {
  addEventListener: (name, fn) => listeners.set(name, fn),
  removeEventListener: (name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); },
});
const descend = (node) => !node || typeof node !== "object" ? [] : Array.isArray(node) ? node.flatMap(descend) : [node, ...descend(node.props?.children)];
const text = (node) => node == null || typeof node === "boolean" ? "" : typeof node !== "object" ? String(node) : Array.isArray(node) ? node.map(text).join("") : text(node.props?.children);
function render() {
  cursor = 0;
  const tree = target.exports.default({ contentSource: "speech_hub", toastmastersCues: true, selfReview: true });
  const jobs = pending; pending = []; jobs.forEach((fn) => fn());
  return tree;
}
function click(label) {
  const button = descend(render()).find((n) => n.type === "button" && text(n) === label);
  assert.ok(button, `Button exists: ${label}`); button.props.onClick(); render();
}
function tick(ms) { now += ms; [...intervals.values()].forEach((fn) => fn()); render(); }
function shown(value) { assert.ok(text(render()).includes(value), `Expected timer display ${value}; got ${text(render())}`); }
const completions = () => events.filter((e) => e.name === "timer_complete").length;

click("▶ Start");
tick(6000); // One callback after six real seconds, not six callbacks.
shown("0:54");
now += 350;
click("⏸ Pause");
tick(30_000);
shown("0:54");
click("▶ Start");
tick(53_649);
shown("0:01");
tick(1);
shown("Time's Up!");
assert.equal(completions(), 1, "Pause preserves fractional seconds and excludes paused time");
shown("Choose one change, then try again");
click("Add one concrete example");
assert.equal(events.filter((event) => event.name === "practice_self_review").length, 1);
assert.equal(events.find((event) => event.name === "practice_self_review").params.review_focus, "example");
tick(10_000);
assert.equal(completions(), 1);
click("▶ Restart");
shown("1:00"); shown("This attempt: add one concrete example.");
now += 65_000;
listeners.get("visibilitychange")?.(); render();
shown("Time's Up!");
assert.equal(completions(), 2, "Returning to an expired timer completes immediately");
click("↺ Reset");
click("2 min");
click("▶ Start");
tick(60_000); shown("Green · 1:00 reached");
tick(30_000); shown("Yellow · 1:30 reached");
tick(30_000); shown("Red · 2:00 reached");
assert.equal(completions(), 3);
click("▶ Restart");
now += 120_001; // Pause before the throttled callback runs must still complete.
click("⏸ Pause");
shown("Time's Up!");
assert.equal(completions(), 4);
click("↺ Reset");
click("5 min"); shown("5:00");
click("▶ Start");
tick(250);
click("↺ Reset");
tick(400_000); shown("5:00");
assert.equal(completions(), 4, "Reset cancels completion");
click("▶ Start");
effects.forEach((effect) => effect?.cleanup?.());
assert.equal(intervals.size, 0, "Unmount cleans up timer");
assert.equal(listeners.size, 0, "Unmount cleans up visibility handler");
console.log("PASS: timer catches up delayed callbacks, preserves pause precision, completes once, resets, restarts, and keeps timing cues accurate.");
