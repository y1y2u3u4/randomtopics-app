import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const storage = new Map(), previousStorage = globalThis.localStorage;
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
const { readHistoryReturn, rememberHistoryReturn, clearHistoryReturn } = load('src/lib/speech/historyReturn.ts');
const id = '11111111-1111-4111-8111-111111111111', key = 'rt_speech_history_return_v1';
try {
  assert.equal(readHistoryReturn(), null);
  rememberHistoryReturn(id, true);
  assert.equal(readHistoryReturn().attemptId, id); assert.equal(readHistoryReturn().qa, true);
  assert.deepEqual(Object.keys(readHistoryReturn()).sort(), ['attemptId', 'createdAt', 'qa']);
  for (const invalid of [null, {}, {attemptId: 'private content', createdAt: Date.now(), qa: false},
    {attemptId: id, createdAt: Date.now()+10000, qa: false},
    {attemptId: id, createdAt: Date.now()-86400000, qa: true},
    {attemptId: id, createdAt: Date.now(), qa: 'true'}]) {
    storage.set(key, JSON.stringify(invalid)); assert.equal(readHistoryReturn(), null); assert.equal(storage.has(key), false);
  }
  rememberHistoryReturn('invalid', false); assert.equal(storage.has(key), false);
  rememberHistoryReturn(id, false); clearHistoryReturn(); assert.equal(readHistoryReturn(), null);
  storage.set(key, '{'); assert.equal(readHistoryReturn(), null);
  globalThis.localStorage = { getItem() {throw Error('blocked')}, setItem() {throw Error('blocked')}, removeItem() {throw Error('blocked')} };
  assert.equal(readHistoryReturn(), null); rememberHistoryReturn(id, true); clearHistoryReturn();
} finally { globalThis.localStorage = previousStorage; }
console.log('PASS: minimal opaque history reference, QA continuity, expiry, malformed input and blocked-storage fallback.');
