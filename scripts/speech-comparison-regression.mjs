import assert from 'node:assert/strict';
import { z } from 'zod';
import { load } from './lib/load-typescript.mjs';
const server = load('src/lib/speech/server.ts');
const coach = load('src/lib/speech/coaching.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const { evidenceCoaching } = load('src/lib/speech/evidence.ts');
const { speechLengthRecoveryHint } = load('src/lib/speech/diagnostics.ts');

const previousText = 'A short walk helps me reset. It gives me time to think. That is why a walk is useful.';
const text = 'Walking gives people time to think and helps them relax. That is why walks are useful.';
const met = { status: 'met', quote: previousText, explanation: 'You state the benefit of walking.' };
const missing = { status: 'missing', quote: '', explanation: 'You explain a benefit without a particular scene.' };
const previous = coach.assembleFeedback({ assessment: { relevance: met, point: met, example: missing, ending: met } }, previousText);
assert.equal(previous.drill.target, 'example');
const evidence = evidenceCoaching(text, previousText, true, previous);
const currentId = Object.keys(evidence.sources.current)[0];
const previousId = Object.keys(evidence.sources.previous)[0];
const comparison = { outcome: 'similar', beforeQuote: '', afterQuote: '', explanation: 'Neither answer supplies a particular scene.' };
const blank = { focus: missing, comparison };
// Incident mechanism: the generation schema used to allow this response,
// while the unchanged grounding validator correctly rejected its comparison.
assert.throws(() => validateFeedback(coach.assembleFeedback(blank, text, previous, true), text, previousText, previous), /missing_comparison_evidence/);
assert.equal(evidence.schema.safeParse(blank).success, false, 'Do not offer a comparison with absent current evidence to the model');
const uncertain = { ...blank, comparison: { ...comparison, outcome: 'insufficient_evidence' } };
const validate = value => validateFeedback(coach.assembleFeedback(value, text, previous, true), text, previousText, previous);
assert.equal(validate(evidence.schema.parse(uncertain)).comparison.outcome, 'insufficient_evidence', 'An honest lack of comparison evidence remains a valid result');
for (const outcome of ['improved', 'similar', 'mixed']) {
  const valid = { ...blank, comparison: { ...comparison, outcome, afterQuote: currentId } };
  assert.ok(validate(evidence.schema.parse(valid)), 'Saved missing targets allow absent before evidence only');
  assert.equal(evidence.schema.safeParse({ ...valid, comparison: { ...valid.comparison, afterQuote: '' } }).success, false);
  assert.equal(evidence.schema.safeParse({ ...valid, comparison: { ...valid.comparison, afterQuote: previousId } }).success, false, 'Previous evidence is not current evidence');
}
for (const status of ['met', 'partial', 'unclear', 'not_assessed']) {
  const assessed = { ...previous, assessment: { ...previous.assessment, example: { ...missing, status } } };
  const schema = evidenceCoaching(text, previousText, true, assessed).schema;
  assert.equal(schema.safeParse({ ...blank, comparison: { ...comparison, afterQuote: currentId } }).success, false, 'Only a saved missing target permits an empty before quote');
  assert.ok(schema.safeParse({ ...blank, comparison: { ...comparison, beforeQuote: previousId, afterQuote: currentId } }).success);
  assert.ok(schema.safeParse(uncertain).success);
}
const concise = { ...previous, drill: coach.makeDrill('concise') };
assert.equal(evidenceCoaching(text, previousText, true, concise).schema.safeParse({ ...blank, comparison: { ...comparison, afterQuote: currentId } }).success, false);
const providerSchema = z.toJSONSchema(evidence.schema, { target: 'draft-7', io: 'input' });
assert.equal(providerSchema.properties.comparison.oneOf.length, 2, 'Conditional evidence rules reach the provider schema');
const oversized = evidence.schema.safeParse({ ...uncertain, comparison: { ...uncertain.comparison, explanation: 'x'.repeat(401) } });
assert.equal(oversized.success, false);
assert.match(speechLengthRecoveryHint(oversized.error), /comparison\.explanation: at most 400 characters/, 'Conditional schemas preserve targeted length recovery');
assert.ok(!evidenceCoaching(text).schema.shape.comparison, 'First practice does not generate an unnecessary comparison');

const original = { fetch: globalThis.fetch, error: console.error, info: console.info };
const logs = [], requests = [];
try {
  console.error = value => logs.push(JSON.parse(value)); console.info = console.error;
  async function run(responses) {
    requests.length = 0; logs.length = 0; const writes = []; let claims = 0;
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
      requests.push(JSON.parse(options.body));
      const value = responses.shift(); assert.ok(value, 'No third provider call');
      return Response.json({ choices: [{ message: { content: JSON.stringify(value) } }], usage: { synthetic: true } });
    };
    const id = '6c9f1062-e17e-41df-a5da-ae87db04336f';
    const attempt = { id, status: 'transcribed', feedback_calls: 0, previous_id: 'previous', transcript: text,
      topic: 'Why are short walks useful?', usage: { context: { version: 'v5', qa: true, practiceMode: 'focused' } } };
    const db = { rpc: async () => { claims++; return { data: true, error: null }; }, from: () => ({
      selectedId: null, writing: null, select() { return this; }, is() { return this; },
      eq(k, v) { if (k === 'id') this.selectedId = v; return this; },
      update(v) { this.writing = v; writes.push(v); return this; },
      async single() { return { data: this.writing ? { ...attempt, ...this.writing } : this.selectedId === 'previous' ? { transcript: previousText, feedback: previous } : attempt, error: null }; },
      then(resolve) { resolve({ error: null }); },
    }) };
    const route = load('src/app/api/speech/feedback/route.ts', {
      '@/lib/speech/server': { ...server, actor: async () => ({ db, user: { id: 'synthetic' } }) },
      '@/lib/speech/allowance': { speechAllowance: async () => ({ included: 2, remaining: 0, paid: false }) },
    });
    const response = await route.POST(new Request('https://example.test/api/speech/feedback', { method: 'POST', body: JSON.stringify({ id, transcript: text }) }));
    return { status: response.status, body: await response.json(), claims, writes };
  }
  let result = await run([blank, uncertain]);
  assert.equal(result.status, 200); assert.equal(result.body.feedback.comparison.outcome, 'insufficient_evidence');
  assert.equal(result.body.feedback.assessment.example.status, 'missing', 'No fabricated success when the target remains absent');
  assert.equal(result.claims, 1); assert.equal(requests.length, 2); assert.equal(result.writes.length, 1);
  assert.equal(result.writes[0].usage.feedback.attempts.length, 2);
  assert.equal(result.writes[0].usage.feedbackComparisonVersion, 'conditional_evidence_v1');
  assert.equal(logs[0].stage, 'model_schema'); assert.equal(logs.at(-1).event, 'speech_service_recovered');
  assert.equal(requests[0].messages[1].content, requests[1].messages[1].content);
  assert.match(requests[1].messages[0].content, /afterQuote.*insufficient_evidence/s);
  result = await run([{ ...blank, comparison: { ...comparison, afterQuote: currentId } }]);
  assert.equal(result.status, 200, 'The route passes the saved missing-target context into the generation schema');
  assert.equal(requests.length, 1);
  result = await run([blank, blank]);
  assert.equal(result.status, 503); assert.equal(requests.length, 2);
  assert.equal(result.writes.at(-1).status, 'transcribed', 'Invalid output stays retryable and never becomes fabricated feedback');
} finally { globalThis.fetch = original.fetch; console.error = original.error; console.info = original.info; }
console.log('PASS: comparison evidence is conditional in the model contract, missing-target and insufficient-evidence semantics, strict source validation, one claim and bounded recovery.');
