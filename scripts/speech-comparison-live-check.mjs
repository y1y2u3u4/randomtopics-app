// Manual synthetic QA: no customer input, database writes, analytics or billing.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { load } from './lib/load-typescript.mjs';
assert.ok(process.env.OPENROUTER_API_KEY, 'An authorized preview model credential is required');
const server = load('src/lib/speech/server.ts');
const coach = load('src/lib/speech/coaching.ts');
const { evidenceCoaching } = load('src/lib/speech/evidence.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const topic = 'Why are short walks useful?';
const previousText = 'A short walk helps me reset. It gives me time to think. That is why a walk is useful.';
const met = { status: 'met', quote: previousText, explanation: 'You explain the benefit of walking.' };
const missing = { status: 'missing', quote: '', explanation: 'You explain a benefit without a particular scene.' };
const previous = { transcript: previousText, feedback: coach.assembleFeedback({ assessment: { relevance: met, point: met, example: missing, ending: met } }, previousText) };
const example = 'Yesterday after work, I walked beside the river for ten minutes instead of checking my phone. By the time I reached home, I had worked out how to finish my report.';
const samples = [
  { name: 'target_still_missing', text: 'Walking gives people time to think and helps them relax. That is why walks are useful.', expectedStatus: 'missing' },
  { name: 'missing_target_now_supported', text: example, expectedStatus: 'met' },
  { name: 'empty_current_evidence_recovery', text: example, expectedStatus: 'met', inject: true },
];
const original = { fetch: globalThis.fetch, error: console.error, info: console.info };
const results = [];
try {
  for (const sample of samples) {
    const evidence = evidenceCoaching(sample.text, previousText, true, previous.feedback);
    const diagnostics = []; let requests = 0;
    console.error = value => diagnostics.push(JSON.parse(value)); console.info = console.error;
    globalThis.fetch = async (...args) => {
      requests++;
      if (sample.inject && requests === 1) return Response.json({ choices: [{ message: { content: JSON.stringify({
        focus: missing, comparison: { outcome: 'similar', beforeQuote: '', afterQuote: '', explanation: 'Synthetic unsupported comparison.' },
      }) } }], usage: { synthetic: true } });
      return original.fetch(...args);
    };
    const started = Date.now(); let passed = false; let comparison;
    try {
      const validate = value => validateFeedback(coach.assembleFeedback(value, sample.text, previous.feedback, true), sample.text, previousText, previous.feedback);
      const result = await server.modelCall(evidence.schema, 'speech_feedback', coach.coachingInstruction(previous.feedback, true) + evidence.instruction,
        JSON.stringify({ topic, transcript: sample.text, previous, practiceGoal: previous.feedback.drill, scope: 'focused', evidence: evidence.sources }), validate);
      const feedback = validate(result.value);
      comparison = { outcome: feedback.comparison.outcome, beforePresent: !!feedback.comparison.beforeQuote, afterPresent: !!feedback.comparison.afterQuote };
      passed = feedback.assessment.example.status === sample.expectedStatus &&
        (sample.expectedStatus === 'missing' ? ['similar', 'insufficient_evidence'].includes(comparison.outcome) : comparison.outcome === 'improved') &&
        (!sample.inject || requests === 2 && result.usage.attempts.length === 2);
    } catch { /* Report closed diagnostic categories only. */ }
    results.push({ name: sample.name, passed, providerRequests: requests, realProviderRequests: requests - (sample.inject ? 1 : 0), elapsedMs: Date.now() - started, comparison, diagnostics });
  }
} finally { globalThis.fetch = original.fetch; console.error = original.error; console.info = original.info; }
const report = { generatedAt: new Date().toISOString(), synthetic: true, qa: true, storage: 'No production records, GA events, email, subscriptions or payments', passed: results.every(r => r.passed), results };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
assert.equal(report.passed, true, 'Synthetic comparison verification failed; inspect closed diagnostics');
