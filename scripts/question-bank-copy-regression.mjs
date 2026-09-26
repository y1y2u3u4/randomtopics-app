import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as React from 'react';
import ts from 'typescript';
import { coreUsageRows } from '../src/lib/coreUsageReport.ts';
const require = createRequire(import.meta.url);
const states = [], events = [], copies = [];
let cursor = 0, outcome = false, finish;
const code = ts.transpileModule(readFileSync(new URL('../src/components/QuestionBank.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const target = { exports: {} };
new Function('require', 'module', 'exports', code)(id => {
  if (id === 'react') return { ...React,
    useState(initial) { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], value => { states[i] = value; }]; },
    useRef(initial) { const i = cursor++; return states[i] ??= { current: initial }; }, useId: () => 'manual-copy',
  };
  if (id === '@/lib/track') return { track: (name, params) => events.push({ name, params }) };
  if (id === '@/lib/clipboard') return { copyText: async text => { copies.push(text); if (outcome === 'pending') return new Promise(resolve => { finish = resolve; }); if (outcome === 'throw') throw Error('blocked'); return outcome; } };
  return require(id);
}, target, target.exports);
const descend = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(descend) : [node, ...descend(node.props?.children)];
const label = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(label).join('') : label(node?.props?.children ?? '');
const questions = ['What makes a good teammate?', 'Which ordinary skill would you teach?'];
const render = () => { cursor = 0; return descend(target.exports.default({ questions, heading: 'Test deck' })); };
const buttons = () => render().filter(n => n.type === 'button');
const fallback = () => render().find(n => n.type === 'textarea');
await buttons()[1].props.onClick();
assert.equal(fallback().props.value, questions[0]);
assert.equal(fallback().props.readOnly, true);
assert.equal(events.at(-1).name, 'bank_question_copy_error');
assert.ok(!events.some(e => e.name === 'copy_question'));
let selected = false; fallback().props.onFocus({ currentTarget: { select() { selected = true; } } }); assert.ok(selected);
outcome = true;
await buttons()[1].props.onClick();
assert.equal(fallback(), undefined);
assert.ok(label(buttons()[1]).includes(questions[0]), 'Successful copy must not hide the question');
assert.equal(events.at(-2).name, 'bank_question_copy');
assert.equal(events.at(-1).name, 'copy_question');
outcome = 'throw'; await buttons()[0].props.onClick();
assert.equal(fallback().props.value, questions.map((q, i) => `${i+1}. ${q}`).join('\n'));
assert.equal(events.at(-1).name, 'bank_deck_copy_error');
outcome = 'pending'; const before = copies.length; const first = buttons()[0].props.onClick();
assert.ok(buttons().every(b => b.props.disabled));
await buttons()[2].props.onClick(); assert.equal(copies.length, before + 1, 'Double click cannot overwrite or race the active payload');
finish(true); await first;
assert.equal(fallback(), undefined); assert.equal(events.at(-2).name, 'bank_deck_copy');
assert.ok(events.every(e => !e.name.includes('generate')));
assert.ok(events.every(e => !JSON.stringify(e.params).includes(questions[0])));
const rows = coreUsageRows([], 'current7', '2026-09-18', '2026-09-24').filter(r => r[4].startsWith('bank_'));
assert.equal(rows.length, 32); assert.ok(rows.every(r => r[7] === 'before_release_no_new_signal'));
console.log('PASS: actual question-bank handlers; failed single/deck copy, unexpected rejection, exact manual payload, retry recovery, preserved visible question, concurrent-click guard, no false success/generation, and release-aware reporting.');
