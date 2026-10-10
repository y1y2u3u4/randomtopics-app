import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
let owner = 'one', refreshOwner = 'one', refreshError = false, guestCalls = 0, requests = 0;
const session = () => owner ? { user: { id: owner }, access_token: 'fixture-only' } : null;
const client = load('src/lib/speech/client.ts', { '@supabase/supabase-js': { createClient: () => ({ auth: {
  getSession: async () => ({ data: { session: session() }, error: null }),
  refreshSession: async () => ({ data: { session: refreshError ? null : { user: { id: refreshOwner } } }, error: refreshError ? Error('fixture') : null }),
  signInAnonymously: async () => { guestCalls++; return { data: { session: { user: { id: 'guest' }, access_token: 'fixture-only' } } }; },
} }) } });
const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
  if (url === '/api/speech/config') return { ok: true, json: async () => ({ url: 'https://fixture.invalid', key: 'fixture-only' }) };
  requests++;
  return { ok: true, json: async () => ({ attempts: [] }) };
};
try {
  await client.reconnectSpeechSession();
  owner = null;
  await assert.rejects(client.reconnectSpeechSession(), e => e.status === 401);
  await assert.rejects(client.practiceFetch('history', undefined, undefined, { existingSessionOnly: true }), e => e.status === 401);
  assert.equal(guestCalls, 0); assert.equal(requests, 0, 'No history request with a replacement guest');
  owner = 'one'; refreshError = true;
  await assert.rejects(client.reconnectSpeechSession(), e => e.status === 401);
  refreshError = false; refreshOwner = 'two';
  await assert.rejects(client.reconnectSpeechSession(), e => e.status === 409);
  assert.equal(guestCalls, 0, 'Recovery never replaces the owner');
  refreshOwner = 'one'; await client.reconnectSpeechSession();
  await client.practiceFetch('history', undefined, undefined, { existingSessionOnly: true, timeoutMs: 15000 });
  assert.equal(requests, 1);
  owner = null; await client.practiceFetch('history');
  assert.equal(guestCalls, 1, 'The original fresh-visitor path still works');
} finally { globalThis.fetch = originalFetch; }
console.log('PASS: same-owner reconnect, missing/expired session recovery, foreign-owner rejection, no silent guest replacement, and fresh-visitor behavior.');

// Configuration fetches are shared, bounded, and evicted on failure so an
// explicit retry can recover without replacing the current guest account.
const nativeTimeout = AbortSignal.timeout;
let configCalls = 0, waitForAbort = true, receivedTimeout = 0;
const timeoutClient = load('src/lib/speech/client.ts', { '@supabase/supabase-js': { createClient: () => ({ fixture: true }) } });
AbortSignal.timeout = milliseconds => {
  receivedTimeout = milliseconds;
  const controller = new AbortController();
  setTimeout(() => controller.abort(new DOMException('Synthetic timeout', 'TimeoutError')), 5);
  return controller.signal;
};
globalThis.fetch = async (url, options) => {
  assert.equal(url, '/api/speech/config'); configCalls++;
  if (waitForAbort) return new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(options.signal.reason), { once: true });
  });
  return { ok: true, json: async () => ({ url: 'https://fixture.invalid', key: 'fixture-only', billingAvailable: true }) };
};
try {
  const failed = await Promise.allSettled([timeoutClient.speechClient(), timeoutClient.speechBillingAvailable()]);
  assert.equal(configCalls, 1, 'Concurrent initializers share a request');
  assert.equal(receivedTimeout, 15000, 'Configuration cannot hang indefinitely');
  assert.ok(failed.every(result => result.status === 'rejected' && result.reason.name === 'TimeoutError'));
  waitForAbort = false;
  assert.equal((await timeoutClient.speechClient()).fixture, true);
  assert.equal(await timeoutClient.speechBillingAvailable(), true);
  assert.equal(configCalls, 2, 'One recoverable retry, then cached configuration');
} finally { globalThis.fetch = originalFetch; AbortSignal.timeout = nativeTimeout; }
console.log('PASS: shared configuration timeout, rejection eviction, clean retry, cached success.');
