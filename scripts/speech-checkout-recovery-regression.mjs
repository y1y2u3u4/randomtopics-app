import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
function load(path, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL(`../src/lib/speech/${path}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('exports', ...Object.keys(globals), code)(exports, ...Object.values(globals));
  return exports;
}
const stored = new Map(); let now = 500_000_000;
const storage = { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key) };
const intent = load('checkoutIntent', { localStorage: storage, Date: { now: () => now } });
assert.equal(intent.readCheckoutIntent(), null);
intent.rememberCheckoutIntent(true);
assert.deepEqual(intent.readCheckoutIntent(), { createdAt: now, qa: true });
assert.deepEqual(Object.keys(JSON.parse([...stored.values()][0])), ['createdAt', 'qa'], 'No identity, token, price or entitlement is persisted');
now += 24 * 60 * 60 * 1000;
assert.equal(intent.readCheckoutIntent(), null, 'A stale purchase intent must not be restored');
const key = 'rt_speech_checkout_intent_v1';
for (const value of ['not json', 'null', '{"createdAt":0,"qa":"true"}', JSON.stringify({ createdAt: now + 1, qa: false })]) {
  stored.set(key, value); assert.equal(intent.readCheckoutIntent(), null);
}
intent.rememberCheckoutIntent(false); intent.clearCheckoutIntent(); assert.equal(intent.readCheckoutIntent(), null);
const blocked = load('checkoutIntent', { localStorage: { getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } } });
assert.equal(blocked.readCheckoutIntent(), null); blocked.rememberCheckoutIntent(false); blocked.clearCheckoutIntent();
assert.equal(intent.speechPlanPath, '/speech/account?plan=monthly#speech-plan');
console.log('PASS: intent expires, rejects malformed/future values, works without storage and never persists credentials or authorizes payments.');

let authListener; let inCallback = false; let refreshes = 0; let changes = 0; let waiting = true; let unsubscribed = false;
let nextTimer = 0; const timers = new Map(); const windowListeners = new Map(); const documentListeners = new Map();
const document = { visibilityState: 'visible', addEventListener: (name, cb) => documentListeners.set(name, cb), removeEventListener: name => documentListeners.delete(name) };
const watcher = load('accountChanges', { document,
  window: { addEventListener: (name, cb) => windowListeners.set(name, cb), removeEventListener: name => windowListeners.delete(name) },
  setTimeout: fn => { const id = ++nextTimer; timers.set(id, fn); return id; }, clearTimeout: id => timers.delete(id),
});
const auth = { onAuthStateChange(listener) { authListener = listener; return { data: { subscription: { unsubscribe() { unsubscribed = true; } } } }; } };
const dispose = watcher.watchSpeechAccount(auth, () => { assert.equal(inCallback, false, 'No auth-dependent refresh inside auth dispatch'); refreshes++; }, () => changes++, () => waiting);
const emit = (event, id = 'first-account') => { inCallback = true; authListener(event, id ? { user: { id } } : null); inCallback = false; };
const flush = () => { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(fn => fn()); };
emit('INITIAL_SESSION'); assert.equal(timers.size, 0);
emit('USER_UPDATED'); emit('TOKEN_REFRESHED'); windowListeners.get('focus')();
assert.equal(timers.size, 1, 'Coalesce auth and focus notifications'); assert.equal(refreshes, 0); flush(); assert.equal(refreshes, 1); assert.equal(changes, 0);
emit('SIGNED_IN', 'second-account'); assert.equal(changes, 1, 'Invalidate previous owner immediately'); assert.equal(refreshes, 1); flush(); assert.equal(refreshes, 2);
emit('USER_UPDATED', 'second-account'); emit('SIGNED_OUT', null); assert.equal(changes, 2); assert.equal(timers.size, 1); flush(); assert.equal(refreshes, 3, 'A remote signout must reload the guest account instead of leaving loading UI');
waiting = false; windowListeners.get('focus')(); assert.equal(timers.size, 0);
waiting = true; document.visibilityState = 'hidden'; documentListeners.get('visibilitychange')(); assert.equal(timers.size, 0);
document.visibilityState = 'visible'; documentListeners.get('visibilitychange')(); assert.equal(timers.size, 1);
dispose(); flush(); assert.equal(refreshes, 3); assert.equal(unsubscribed, true); assert.equal(windowListeners.size + documentListeners.size, 0);
emit('USER_UPDATED'); flush(); assert.equal(refreshes, 3);
console.log('PASS: deferred auth refresh, notification coalescing, identity invalidation, cross-tab signout recovery, foreground return and cleanup.');
