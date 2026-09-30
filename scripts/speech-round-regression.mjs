import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const { nextRound } = load('src/lib/speech/nextRound.ts');
const { assembleFeedback } = load('src/lib/speech/coaching.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const server = load('src/lib/speech/server.ts');
const text = 'A short walk helps me reset. Yesterday I walked by the river. That is why I take a walk each day.';
const met = { status: 'met', quote: 'A short walk helps me reset.', explanation: 'Your view is clear.' };
const assessment = { relevance: met, point: met, example: { ...met, quote: 'Yesterday I walked by the river.' }, ending: { ...met, quote: 'That is why I take a walk each day.' } };
const first = assembleFeedback({ assessment: { ...assessment, example: { status: 'missing', quote: '', explanation: 'No scene was present.' } } }, text);
const improved = validateFeedback(assembleFeedback({ focus: assessment.example, comparison: { outcome: 'improved', beforeQuote: '', afterQuote: assessment.example.quote, explanation: 'You added a concrete scene.' } }, text, first, true), text, text, first);
assert.equal(nextRound(first).mode, 'retry');
assert.equal(nextRound(improved).mode, 'transfer');
for (const outcome of ['similar', 'mixed', 'first_attempt']) assert.equal(nextRound({ ...improved, comparison: { ...improved.comparison, outcome } }).mode, 'retry');
assert.equal(nextRound({ ...improved, comparison: { ...improved.comparison, outcome: 'insufficient_evidence' } }).mode, 'review');
assert.equal(nextRound({ ...improved, assessment: { ...improved.assessment, example: { ...met, status: 'partial' } } }).mode, 'retry', 'Improved alone is not goal attainment');
assert.equal(nextRound({ ...improved, drill: { ...improved.drill, target: 'concise' } }).mode, 'retry', 'Do not invent an unmeasured concision criterion');
const transfer = validateFeedback(assembleFeedback({ assessment }, text, undefined, false, 'example'), text);
assert.equal(transfer.drill.target, 'example'); assert.equal(transfer.comparison.outcome, 'first_attempt');
assert.equal(transfer.comparison.beforeQuote, ''); assert.equal(transfer.scope, 'full');
assert.equal(transfer.assessment.point.status, 'met', 'New topic is assessed fully without comparing different topics');
const wav = Buffer.alloc(44 + 6 * 24000);
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(12000, 24); wav.writeUInt32LE(24000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(wav.length - 44, 40);
const id = '6c9f1062-e17e-41df-a5da-ae87db04336f', sourceId = '126b39ce-1e3d-4b22-a15e-7f38e83fef13';
async function reserve({ source = { topic: 'Old topic', feedback: improved }, body = {}, quota = false } = {}) {
  let reservations = 0, models = 0; const updates = [], filters = [];
  const db = {
    rpc: async () => { reservations++; return quota ? { error: { message: 'quota_exceeded' } } : { data: true }; },
    from: () => ({ select() { return this; }, eq(k,v) { filters.push([k,v]); return this; }, is(k,v) { filters.push([k,v]); return this; },
      single: async () => ({ data: source }), update(v) { updates.push(v); return this; }, then(resolve) { resolve({ error: null }); } }),
  };
  const route = load('src/app/api/speech/transcribe/route.ts', { '@/lib/speech/server': { ...server,
    actor: async () => ({ db, user: { id: 'owner' } }), networkHash: () => 'test',
    modelCall: async () => { models++; return { value: { transcript: text }, model: 'synthetic', usage: {} }; },
  } });
  const r = await route.POST(new Request('https://example.test/api/speech/transcribe', { method: 'POST', body: JSON.stringify({ id, topic: 'New topic', previousId: null, goalSourceId: sourceId, practiceMode: 'full', audio: wav.toString('base64'), qa: true, ...body }) }));
  return { status: r.status, body: await r.json(), reservations, models, updates, filters };
}
let r = await reserve(); assert.equal(r.status, 200); assert.equal(r.models, 1); assert.equal(r.reservations, 1);
assert.ok(r.filters.some(([k,v]) => k === 'user_id' && v === 'owner')); assert.ok(r.filters.some(([k,v]) => k === 'deleted_at' && v === null)); assert.ok(r.filters.some(([k,v]) => k === 'status' && v === 'complete'));
assert.equal(r.updates[0].usage.context.goalTarget, 'example'); assert.equal(r.updates[0].usage.context.goalSourceId, sourceId);
for (const config of [{ source: null }, { source: { topic: 'Old topic', feedback: {} } }, { source: { topic: 'Old topic', feedback: first } }, { body: { topic: 'Old topic' } }, { body: { previousId: sourceId } }, { body: { practiceMode: 'focused' } }]) {
  r = await reserve(config); assert.ok([400,409].includes(r.status)); assert.equal(r.reservations, 0); assert.equal(r.models, 0, 'Invalid, foreign or unavailable source never invokes a model or reserves quota');
}
r = await reserve({ quota: true }); assert.equal(r.status, 402); assert.equal(r.models, 0);
// The actual feedback route uses server-saved context, never a client-supplied target.
let modelCalls = 0, claimCalls = 0, modelInput;
const record = { id, user_id: 'owner', status: 'transcribed', transcript: text, topic: 'New topic', previous_id: null, feedback_calls: 0, usage: { context: { goalTarget: 'example', goalSourceId: sourceId, practiceMode: 'full' } } };
const db = { rpc: async () => { claimCalls++; return { data: true }; }, from: () => {
  let update; return { select() { return this; }, eq() { return this; }, is() { return this; }, update(v) { update=v; return this; }, single: async () => ({ data: { ...record, ...update } }), then(resolve) { resolve({ error: null }); } };
} };
const route = load('src/app/api/speech/feedback/route.ts', { '@/lib/speech/server': { ...server, actor: async () => ({ db, user: { id: 'owner' } }), modelCall: async (schema, name, instruction, input) => { modelCalls++; modelInput=JSON.parse(input); return { value: { assessment }, usage: {}, model: 'synthetic' }; } }, '@/lib/speech/allowance': { speechAllowance: async () => ({ paid: true, included: 40, remaining: 39 }) } });
const response = await route.POST(new Request('https://example.test/api/speech/feedback', { method: 'POST', body: JSON.stringify({ id, transcript: text, goalTarget: 'point' }) }));
const result = await response.json(); assert.equal(response.status, 200); assert.equal(result.feedback.drill.target, 'example'); assert.equal(result.feedback.comparison.outcome, 'first_attempt'); assert.equal(modelCalls, 1); assert.equal(claimCalls, 1); assert.equal(modelInput.previous, null);
console.log('PASS: evidence-based next goals, honest new-topic assessment, owned source validation, quota/no-extra-call guards and server-controlled goal continuity.');

r = await reserve({ body: { goalSourceId: undefined, purpose: 'once' } });
assert.equal(r.status, 200); assert.equal(r.models, 1); assert.equal(r.updates[0].usage.context.purpose, 'once');
r = await reserve({ source: { topic: 'Old topic', feedback: improved, usage: { context: { purpose: 'habit' } } }, body: { purpose: 'explore' } });
assert.equal(r.status, 200); assert.equal(r.updates[0].usage.context.purpose, 'habit', 'Owned transferred goal keeps its saved purpose');
r = await reserve({ body: { purpose: 'private free text' } });
assert.equal(r.status, 400); assert.equal(r.models, 0); assert.equal(r.reservations, 0);
assert.match(nextRound(improved, 'once').why, /finish here/);
assert.match(nextRound(improved, 'habit').why, /different topic/);
assert.equal(nextRound(improved, 'habit').check, improved.drill.successCriterion);
assert.equal(nextRound({ ...improved, comparison: { ...improved.comparison, outcome: 'insufficient_evidence' } }, 'habit').check, undefined);
console.log('PASS: optional purpose validates before any charge, transfers from owned context, and never fabricates an unmet goal.');
