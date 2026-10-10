import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import * as types from '../src/data/types.ts';
const target = { exports: {} }, data = new Map();
const location = { pathname: '/' };
const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
const code = ts.transpileModule(readFileSync(new URL('../src/lib/topicResultSession.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
new Function('require', 'module', 'exports', 'window', 'sessionStorage', code)(() => types, target, target.exports, { location }, storage);
const { readTopicResult: read, saveTopicResult: save } = target.exports;
const topics = [{ id: 'editorial-1' }, { id: 'editorial-2' }];
const state = { topicIds: ['editorial-1'], usedIds: ['editorial-1'], mode: 'speech', category: 'science', depth: 'light', count: 1 };
save('en:generator:speech:all', { ...state, transcript: 'Synthetic private text', email: 'fixture@example.invalid' });
assert.deepEqual(read('en:generator:speech:all', topics), state);
assert.equal(read('es:generator:speech:all', topics), null, 'Locale isolation');
assert.equal(read('en:wheel:speech', topics), null, 'Tool isolation');
location.pathname = '/speech';
assert.equal(read('en:generator:speech:all', topics), null, 'Route isolation');
location.pathname = '/';
const key = [...data.keys()][0], original = data.get(key), snapshot = JSON.parse(original);
for (const patch of [
  { savedAt: Date.now() - 2 * 60 * 60 * 1000 - 1 }, { savedAt: Date.now() + 60_000 }, { savedAt: 'invalid' },
  { topicIds: [] }, { topicIds: ['unknown'] }, { topicIds: ['editorial-1', 'editorial-1'] },
  { usedIds: ['unknown'] }, { usedIds: ['editorial-1', 'editorial-1'] }, { usedIds: null },
  { mode: 'unknown' }, { category: 'unknown' }, { depth: 'unknown' }, { count: 2 },
  { topicIds: ['editorial-1', 'editorial-2'], count: 1 },
]) {
  data.set(key, JSON.stringify({ ...snapshot, ...patch }));
  assert.equal(read('en:generator:speech:all', topics), null, JSON.stringify(patch));
}
for (const corrupt of ['{', '[]', 'null', '"text"']) {
  data.set(key, corrupt); assert.equal(read('en:generator:speech:all', topics), null);
}
data.set(key, original);
assert.equal(read('en:generator:speech:all', []), null, 'Removed editorial topic is ignored');
storage.getItem = () => { throw Error('blocked'); };
assert.equal(read('en:generator:speech:all', topics), null);
storage.setItem = () => { throw Error('blocked'); };
assert.doesNotThrow(() => save('en:generator:speech:all', state), 'Storage is optional');
assert.deepEqual(Object.keys(snapshot).sort(), ['savedAt', ...Object.keys(state)].sort());
assert.ok(!original.includes('Synthetic private text') && !original.includes('fixture@example.invalid'), 'Only the closed editorial ID schema is serialized');
console.log('PASS: tab-local result snapshots, route/tool/locale isolation, TTL, corpus validation, malformed data and blocked storage.');
