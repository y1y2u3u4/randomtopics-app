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
