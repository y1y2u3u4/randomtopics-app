import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import * as React from "react";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
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
function harness(path, props, extras = {}, globals = {}) {
  const state = [], events = [], copies = [];
  let cursor = 0, copyAllowed = true;
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    },
    useMemo: (fn) => fn(), useCallback: (fn) => fn,
    useSyncExternalStore: () => "[]",
  };
  const Component = load(path, {
    react,
    "@/components/PrintButton": { default: "print-button" },
    "@/components/WeeklyQuestionPlanner": { default: "weekly-planner" },
    "@/lib/track": { track: (name, params) => events.push({ name, params }) },
    "@/lib/clipboard": { copyText: async (text) => { copies.push(text); return copyAllowed; } },
    "@/lib/topicLibrary": { toggleFavoriteTopic: () => ({ saved: true, persisted: true }), recordRecentTopics() {} },
    ...extras,
  }, {
    window: { setTimeout() {}, location: { origin: "https://randomtopics.app", pathname: "/question-of-the-day-for-work", search: "?private=never-export" } },
    navigator: { clipboard: { writeText: async (text) => copies.push(text) } },
    ...globals,
  }).default;
  const render = () => { cursor = 0; return descendants(Component(props)); };
  const button = (text) => render().find((node) => node.type === "button" && label(node).trim() === text);
  const days = () => render().filter((node) => node.props["data-plan-day"]);
  return { render, button, days, copies, events, failCopy: () => { copyAllowed = false; } };
}

const { STUDENT_QOTD_CONFIG: students, WORK_QOTD_CONFIG: work } = load("src/data/premiumQotd.ts");
const lib = load("src/lib/weeklyQuestionPlan.ts");
for (const config of [students, work]) {
  const initial = config.items[0];
  const h = harness("src/components/WeeklyQuestionPlanner.tsx", { config, pool: config.items, current: initial });
  assert.equal(h.events.length, 0, "Viewing a default prompt never generates a plan or a question");
  assert.equal(h.days().length, 0);
  h.button("Start with current question").props.onClick();
  assert.equal(h.days().length, 5);
  assert.ok(label(h.days()[0]).includes(initial.prompt), "Selected prompt is kept on Monday");
  const before = h.days().map(label);
  h.render().find((node) => node.props["aria-label"] === "Replace Wednesday question").props.onClick();
  const after = h.days().map(label);
  assert.notEqual(after[2], before[2]);
  for (const index of [0, 1, 3, 4]) assert.equal(after[index], before[index], "Replacing one day keeps the other days");
  assert.equal(h.events.filter((event) => event.name === "generate_success" || event.name.startsWith("post_generate_")).length, 0);
  await h.button("Copy weekly plan").props.onClick();
  assert.equal(h.events.filter((event) => event.name === "weekly_plan_copy").length, 1);
  assert.ok(h.copies[0].includes(initial.prompt));
  for (const text of initial.followUps) assert.ok(h.copies[0].includes(text));
  assert.ok(h.copies[0].endsWith(`https://randomtopics.app${config.path}`));
  assert.ok(!h.copies[0].includes("never-export"));
  assert.ok(h.copies[0].includes("answer or pass"));
  const print = h.render().find((node) => node.type === "print-button");
  assert.equal(print.props.items.length, 5);
  assert.ok(print.props.items[0].includes(initial.followUps[0]));
  assert.ok(print.props.items[0].includes(initial.facilitationTip));
  h.failCopy();
  await h.button("Plan copied ✓").props.onClick();
  assert.equal(h.events.filter((event) => event.name === "weekly_plan_copy").length, 1, "Blocked copying adds no false success");
  assert.equal(h.events.at(-1).name, "weekly_plan_copy_error");
  assert.equal(h.render().find((node) => node.type === "textarea").props.value, h.copies.at(-1));
  h.button("Build weekly plan").props.onClick();
  assert.equal(h.render().some((node) => node.type === "textarea"), false, "Regenerating clears stale fallback text");
  assert.equal(h.events.some((event) => JSON.stringify(event.params).includes(initial.prompt)), false, "Analytics exclude question text");
}

// A narrow audience/category must not silently borrow outside its filtered pool.
const narrow = students.items.slice(0, 3);
const small = harness("src/components/WeeklyQuestionPlanner.tsx", { config: students, pool: narrow, current: students.items[8] });
assert.equal(small.button("Start with current question"), undefined, "An out-of-filter prompt cannot anchor a plan");
small.button("Build weekly plan").props.onClick();
assert.equal(small.days().length, 3);
assert.ok(small.render().some((node) => label(node).includes("3-day plan")));
assert.ok(small.render().filter((node) => node.props["aria-label"]?.startsWith("Replace ")).every((node) => node.props.disabled));
const plan = lib.buildWeeklyQuestionPlan(narrow);
assert.equal(new Set(plan.map((item) => item.id)).size, 3);
assert.equal(lib.replaceWeeklyQuestion(plan, narrow, 0), plan);
assert.deepEqual(lib.buildWeeklyQuestionPlan([]), []);

// Actual premium handlers: default actions and returning to today's prompt stay out of strict counts.
const twoItems = work.items.slice(0, 2);
const premium = harness("src/components/PremiumPromptTool.tsx", { config: { ...work, items: twoItems }, initialItemId: twoItems[0].id }, {}, { Math: Object.assign(Object.create(Math), { random: () => 0.5 }) });
assert.equal(premium.events.length, 0);
await premium.button("Copy for Slack / Teams").props.onClick();
assert.equal(premium.events.some((event) => event.name.startsWith("post_generate_")), false);
// Generate both corpus items, leaving the non-default visible; both IDs are now in draw history.
for (let i = 0; i < 2; i++) {
  premium.render().find((node) => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick();
}
assert.ok(premium.button("Back to today's"));
premium.button("Back to today's").props.onClick();
const strictBefore = premium.events.filter((event) => event.name === "post_generate_copy").length;
await premium.button("Copy for Slack / Teams").props.onClick();
assert.equal(premium.events.filter((event) => event.name === "post_generate_copy").length, strictBefore);

// A blocked copy from an actual generated prompt preserves the complete manual payload
// without adding broad or strict success; sharing's clipboard fallback follows the same rule.
premium.render().find((node) => node.type === "button" && node.props.className?.includes("btn-generate")).props.onClick();
premium.failCopy();
const successBeforeFailure = premium.events.filter((event) => ["copy_result", "post_generate_copy", "share_result", "post_generate_share"].includes(event.name)).length;
await premium.button("Copy for Slack / Teams").props.onClick();
assert.equal(premium.events.at(-1).name, "copy_error");
assert.equal(premium.render().find((node) => node.type === "textarea").props.value, premium.copies.at(-1));
assert.ok(premium.copies.at(-1).includes("Follow-up:"));
await premium.button("Share").props.onClick();
assert.equal(premium.events.at(-1).name, "share_error");
assert.equal(premium.render().find((node) => node.type === "textarea").props.value, premium.copies.at(-1));
assert.ok(premium.copies.at(-1).endsWith("https://randomtopics.app/question-of-the-day-for-work"));
assert.equal(premium.events.filter((event) => ["copy_result", "post_generate_copy", "share_result", "post_generate_share"].includes(event.name)).length, successBeforeFailure);
console.log("Weekly plan regression passed: current-question anchor, single-day replacement, complete exports, blocked-copy recovery, sparse filters, default-action attribution.");
