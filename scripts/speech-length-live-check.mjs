// Manual QA with synthetic text only. No auth, database writes, GA events or payments.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { load } from './lib/load-typescript.mjs';
assert.ok(process.env.OPENROUTER_API_KEY, 'A preview model credential is required');
const server = load('src/lib/speech/server.ts');
const coach = load('src/lib/speech/coaching.ts');
const { evidenceCoaching } = load('src/lib/speech/evidence.ts');
const { validateFeedback } = load('src/lib/speech/schema.ts');
const topic = 'Should cities invest in quiet public spaces as well as busy community events?';
const transcript = 'I think cities should support both quiet public spaces and lively community events, because people recover from a difficult week in different ways. A place can be useful without being exciting. Last Saturday I visited a small library after a noisy week at work. I sat beside a window, read a book about gardens, and spent an hour without needing to talk to anyone. By the time I left, I felt ready to cook dinner and call my family. My brother chose a different activity that afternoon. He went to a local music festival with his friends and came home full of stories about the people he met. Neither of us needed the city to decide which activity counted as the better way to relax. We needed affordable choices. There are practical limits, of course. A council cannot build a large library on every street or close a road for a festival every weekend. It could start with a small reading room in an existing community center and a few carefully scheduled outdoor events. It should ask residents which options they use and check whether older people and people with disabilities can get there. These are different needs, but they are not competing definitions of a successful community. A good city gives people room to choose the kind of public life that helps them feel connected.';
const criterion = { status: 'met', quote: 'We needed affordable choices.', explanation: 'You explain why both options matter.' };
const assessment = { relevance: criterion, point: criterion, example: { ...criterion, quote: 'Last Saturday I visited a small library after a noisy week at work.' }, ending: { ...criterion, quote: 'A good city gives people room to choose the kind of public life that helps them feel connected.' } };
const beforeText = 'Cities should offer quiet places and lively events. Last Saturday I enjoyed reading at the library. That is why I';
const beforeCriterion = { status: 'met', quote: 'Cities should offer quiet places and lively events.', explanation: 'You state a clear position.' };
const previous = { transcript: beforeText, feedback: validateFeedback(coach.assembleFeedback({ assessment: {
  relevance: beforeCriterion, point: beforeCriterion,
  example: { ...beforeCriterion, quote: 'Last Saturday I enjoyed reading at the library.' },
  ending: { status: 'partial', quote: 'That is why I', explanation: 'Your closing thought is unfinished.' },
} }, beforeText), beforeText) };
const focused = 'That is why a city should protect both quiet spaces and lively events, so people can choose the public activities that help them feel connected.';
const samples = [
  { name: 'long_first_attempt', text: transcript },
  { name: 'invalid_quote_and_oversized_explanation_recovery', text: transcript,
    bad: { assessment: { ...assessment, point: { ...criterion, quote: transcript }, example: { ...assessment.example, explanation: 'A synthetic explanation that deliberately exceeds the limit. '.repeat(8) } } } },
  { name: 'focused_explanation_recovery', text: focused, previous,
    bad: { focus: { status: 'met', quote: focused, explanation: 'A synthetic explanation that deliberately exceeds the limit. '.repeat(8) }, comparison: { outcome: 'improved', beforeQuote: 'That is why I', afterQuote: focused, explanation: 'Your closing thought now connects both options to the reason people need them.' } } },
];
const original = { fetch: globalThis.fetch, error: console.error, info: console.info };
const results = [];
try {
  for (const sample of samples) {
    const evidence = evidenceCoaching(sample.text, sample.previous?.transcript, Boolean(sample.previous));
    const encodeQuote = (value, source) => Object.entries(source).find(([, quote]) => quote === value)?.[0] ?? value;
    const bad = sample.bad ? structuredClone(sample.bad) : undefined;
    if (bad?.focus) bad.focus.quote = encodeQuote(bad.focus.quote, evidence.sources.current);
    if (bad?.assessment) for (const criterion of Object.values(bad.assessment)) criterion.quote = encodeQuote(criterion.quote, evidence.sources.current);
    if (bad?.comparison) {
      bad.comparison.beforeQuote = encodeQuote(bad.comparison.beforeQuote, evidence.sources.previous);
      bad.comparison.afterQuote = encodeQuote(bad.comparison.afterQuote, evidence.sources.current);
    }
    let requests = 0;
    const diagnostics = [];
    console.error = value => diagnostics.push(JSON.parse(value));
    console.info = console.error;
    globalThis.fetch = async (...args) => {
      requests++;
      if (bad && requests === 1) return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(bad) } }], usage: { synthetic: true } }));
      return original.fetch(...args);
    };
    const started = Date.now();
    let passed = false;
    let outcome;
    try {
      const validate = value => validateFeedback(coach.assembleFeedback(value, sample.text, sample.previous?.feedback, Boolean(sample.previous)), sample.text, sample.previous?.transcript, sample.previous?.feedback);
      const result = await server.modelCall(evidence.schema,
        'speech_feedback', coach.coachingInstruction(sample.previous?.feedback, Boolean(sample.previous)) + evidence.instruction,
        JSON.stringify({ topic, transcript: sample.text, previous: sample.previous, practiceGoal: sample.previous?.feedback.drill, scope: sample.previous ? 'focused' : 'full', evidence: evidence.sources }), validate);
      const feedback = validate(result.value);
      outcome = feedback.comparison.outcome;
      passed = sample.previous ? feedback.assessment.ending.status === 'met' && outcome === 'improved' : feedback.scope === 'full';
    } catch { /* Closed diagnostic categories below are sufficient; never print provider content. */ }
    results.push({ name: sample.name, passed, providerRequests: requests, realProviderRequests: requests - (sample.bad ? 1 : 0), elapsedMs: Date.now() - started, outcome, diagnostics });
  }
} finally {
  globalThis.fetch = original.fetch;
  console.error = original.error;
  console.info = original.info;
}
const report = { generatedAt: new Date().toISOString(), synthetic: true, qa: true, storage: 'No production rows, GA events, email, subscriptions or payments', passed: results.every(r => r.passed), results };
if (process.argv[2]) writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
assert.equal(report.passed, true, 'Synthetic live length checks failed; inspect the closed diagnostics.');
