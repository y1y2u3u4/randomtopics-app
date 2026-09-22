import assert from 'node:assert/strict';
import { z } from 'zod';
import { load } from './lib/load-typescript.mjs';

const server = load('src/lib/speech/server.ts');
const coach = load('src/lib/speech/coaching.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const diagnostics = load('src/lib/speech/diagnostics.ts');
const { evidenceCoaching } = load('src/lib/speech/evidence.ts');
const transcript = 'A short walk helps me reset. Yesterday I walked beside the river after work. I returned ready for the evening.';
const criterion = { status: 'met', quote: 'A short walk helps me reset.', explanation: 'You explain the benefit of a walk.' };
const good = { assessment: {
  relevance: criterion, point: criterion,
  example: { ...criterion, quote: 'Yesterday I walked beside the river after work.' },
  ending: { ...criterion, quote: 'I returned ready for the evening.' },
} };
const bad = { assessment: { ...good.assessment,
  point: { ...criterion, quote: 'PRIVATE_REJECTED_QUOTE '.repeat(20) },
  example: { ...good.assessment.example, explanation: 'PRIVATE_REJECTED_EXPLANATION '.repeat(20) },
} };
const original = { fetch: globalThis.fetch, error: console.error, info: console.info };
const logs = [];
const requests = [];
const reply = value => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(value) } }], usage: { test: true } }));
const validate = value => validateFeedback(coach.assembleFeedback(value, transcript), transcript);
try {
  const evidence = evidenceCoaching(transcript);
  const encoded = structuredClone(good);
  for (const criterion of Object.values(encoded.assessment)) {
    const id = Object.entries(evidence.sources.current).find(([, quote]) => quote === criterion.quote)?.[0];
    assert.ok(id, 'Short complete source sentences are selectable');
    criterion.quote = id;
  }
  assert.deepEqual(evidence.schema.parse(encoded), good, 'Selected IDs restore the exact original quotations');
  assert.throws(() => evidence.schema.parse(good), 'Raw quote text is not accepted as a made-up evidence ID');
  assert.ok(validate(evidence.schema.parse(encoded)));
  const providerSchema = z.toJSONSchema(evidence.schema, { target: 'draft-7', io: 'input' });
  assert.ok(providerSchema.properties.assessment.properties.point.properties.quote.enum.includes(encoded.assessment.point.quote));
  for (const text of [transcript, ('A long sentence keeps its original wording and punctuation, '.repeat(170)).slice(0, 10000), 'x'.repeat(10000), 'a' + '🙂'.repeat(4900)]) {
    const current = evidenceCoaching(text).sources.current;
    assert.ok(Object.keys(current).length > 0);
    for (const quote of Object.values(current)) assert.ok(quote.length <= 180 && text.includes(quote) && !/\p{Surrogate}/u.test(quote));
  }
  const repeat = evidenceCoaching(transcript, 'An earlier answer used different words.', true);
  const currentId = Object.keys(repeat.sources.current)[0];
  assert.throws(() => repeat.schema.parse({ focus: { ...criterion, quote: currentId }, comparison: {
    outcome: 'improved', beforeQuote: currentId, afterQuote: currentId, explanation: 'A changed thought.',
  } }), 'Current evidence IDs cannot be used as previous evidence');
  console.error = value => logs.push(JSON.parse(value));
  console.info = console.error;
  globalThis.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return reply(requests.length === 1 ? bad : good);
  };
  const result = await server.modelCall(coach.firstAssessmentSchema, 'speech_feedback', coach.coachingInstruction(), transcript, validate);
  assert.equal(requests.length, 2);
  assert.equal(validate(result.value).assessment.point.quote, criterion.quote);
  assert.equal(result.usage.attempts.length, 2);
  assert.ok(requests[0].messages[0].content.includes('240 characters'));
  const recovery = requests[1].messages[0].content;
  assert.match(recovery, /assessment\.point\.quote: at most 240 characters/);
  assert.match(recovery, /assessment\.example\.explanation: at most 300 characters/);
  assert.ok(!recovery.includes('PRIVATE_REJECTED'));
  assert.deepEqual(logs[0].schema_issues, [
    { field: 'assessment.point.quote', code: 'too_big' },
    { field: 'assessment.example.explanation', code: 'too_big' },
  ]);
  assert.equal(logs.at(-1).event, 'speech_service_recovered');

  globalThis.fetch = async () => reply(encoded);
  const selected = await server.modelCall(evidence.schema, 'speech_feedback', coach.coachingInstruction() + evidence.instruction,
    JSON.stringify({ transcript, evidence: evidence.sources }), validate);
  assert.deepEqual(selected.value, good, 'The model boundary parses evidence IDs before grounding validation');

  requests.length = 0;
  logs.length = 0;
  globalThis.fetch = async (_url, options) => { requests.push(JSON.parse(options.body)); return reply(bad); };
  await assert.rejects(() => server.modelCall(coach.firstAssessmentSchema, 'speech_feedback', coach.coachingInstruction(), transcript, validate));
  assert.equal(requests.length, 2, 'Repeated oversized output stays bounded to two calls');
  assert.equal(logs.at(-1).retrying, false);

  requests.length = 0;
  const invented = { assessment: { ...good.assessment, point: { ...criterion, quote: 'Invented evidence.' } } };
  globalThis.fetch = async (_url, options) => { requests.push(JSON.parse(options.body)); return reply(requests.length === 1 ? bad : invented); };
  await assert.rejects(() => server.modelCall(coach.firstAssessmentSchema, 'speech_feedback', coach.coachingInstruction(), transcript, validate), /ungrounded_quote/);
  assert.equal(requests.length, 2, 'Length recovery does not weaken evidence validation');

  // Unknown schema keys and arbitrary error text must never become system instructions.
  const unknown = new z.ZodError([{ code: 'too_big', origin: 'string', maximum: 10, inclusive: true,
    path: ['PRIVATE_FIELD_INJECTION'], message: 'PRIVATE_ERROR_MESSAGE' }]);
  assert.equal(diagnostics.speechLengthRecoveryHint(unknown), '');
  assert.deepEqual(diagnostics.speechSchemaIssues(unknown), [{ field: 'other', code: 'too_big' }]);
  assert.ok(!JSON.stringify(logs).includes('PRIVATE_REJECTED'));
} finally {
  globalThis.fetch = original.fetch;
  console.error = original.error;
  console.info = original.info;
}
console.log('PASS: bounded source excerpt selection, source separation, targeted length recovery, request limits, exact evidence checks, and private diagnostic isolation.');
