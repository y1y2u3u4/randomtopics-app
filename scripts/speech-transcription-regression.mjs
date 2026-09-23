import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';
const server = load('src/lib/speech/server.ts');
const { transcriptSchema } = load('src/lib/speech/schema.ts');
const original = { fetch: globalThis.fetch, error: console.error, info: console.info, now: Date.now, timeout: AbortSignal.timeout };
const privateText = 'PRIVATE_SPEECH_CONTENT: A short walk helps me think clearly before returning to work.';
const privateAudio = [{ type: 'input_audio', input_audio: { data: 'PRIVATE_AUDIO', format: 'wav' } }];
const provider = (content, extra = {}) => new Response(JSON.stringify({
  choices: [{ message: { content }, finish_reason: 'stop', ...extra }], usage: { total_tokens: 123 },
}));
const valid = () => provider(JSON.stringify({ transcript: privateText }));
const logs = [], recovered = [], requests = [], timeouts = [];
let queue, now, elapsed;
const reset = (responses, elapsedPerCall = 0) => {
  queue = responses; now = 0; elapsed = elapsedPerCall;
  logs.length = 0; recovered.length = 0; requests.length = 0; timeouts.length = 0;
};
try {
  console.error = value => logs.push(JSON.parse(value));
  console.info = value => recovered.push(JSON.parse(value));
  Date.now = () => now;
  AbortSignal.timeout = ms => { timeouts.push(ms); return original.timeout(ms); };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
    requests.push(JSON.parse(options.body)); now += elapsed;
    const next = queue.shift(); assert.ok(next, 'Unexpected extra model request');
    return typeof next === 'function' ? next() : next;
  };
  // Production failed after a single non-JSON model response despite ample time.
  for (const [stage, invalid] of [
    ['content_json', provider('not JSON')],
    ['response_json', new Response('not a JSON envelope')],
    ['model_schema', provider(JSON.stringify({ transcript: null }))],
  ]) {
    reset([invalid, valid()], 3000);
    const result = await server.modelCall(transcriptSchema, 'speech_transcript', 'Transcribe audible English verbatim.', privateAudio);
    assert.equal(result.value.transcript, privateText); assert.equal(requests.length, 2);
    assert.deepEqual(timeouts, [55000, 52000], 'Recovery shares the original deadline');
    assert.equal(logs[0].stage, stage); assert.equal(logs[0].retrying, true);
    assert.equal(recovered.length, 1); assert.equal(recovered[0].operation, 'transcribe');
    assert.equal(result.usage.attempts.length, 2, 'Both provider calls remain accounted for');
    assert.deepEqual(requests[0].messages[1].content, requests[1].messages[1].content);
    assert.equal(requests[1].provider.data_collection, 'deny');
    assert.equal(requests[1].response_format.json_schema.strict, true);
    assert.match(requests[1].messages[0].content, /empty transcript/);
    assert.doesNotMatch(requests[1].messages[0].content, /non-empty explanatory|shorter.*quote/);
    assert.ok(!JSON.stringify([...logs, ...recovered]).includes('PRIVATE'));
  }
  reset([provider('bad'), provider('still bad')]);
  await assert.rejects(() => server.modelCall(transcriptSchema, 'speech_transcript', 'Transcribe.', privateAudio));
  assert.equal(requests.length, 2); assert.deepEqual(logs.map(x => x.retrying), [true, false]);
  assert.equal(recovered.length, 0);
  for (const invalid of [
    new Response('unavailable', { status: 503 }),
    () => { throw new DOMException('PRIVATE_TIMEOUT', 'TimeoutError'); },
    () => { throw new Error('PRIVATE_NETWORK_ERROR'); },
    provider('filtered', { finish_reason: 'content_filter' }),
    provider('refused', { message: { content: 'refused', refusal: 'PRIVATE_REFUSAL' } }),
  ]) {
    reset([invalid]);
    await assert.rejects(() => server.modelCall(transcriptSchema, 'speech_transcript', 'Transcribe.', privateAudio));
    assert.equal(requests.length, 1, 'Provider failures and refusals do not trigger format recovery');
    assert.equal(recovered.length, 0); assert.ok(!JSON.stringify(logs).includes('PRIVATE'));
  }
  reset([provider('bad')], 51000);
  await assert.rejects(() => server.modelCall(transcriptSchema, 'speech_transcript', 'Transcribe.', privateAudio));
  assert.equal(requests.length, 1, 'Do not retry with less than five seconds remaining');

  const wav = Buffer.alloc(44 + 6 * 24000);
  wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(12000, 24); wav.writeUInt32LE(24000, 28); wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(wav.length - 44, 40);
  const id = '6c9f1062-e17e-41df-a5da-ae87db04336f';
  async function routeResult(responses) {
    reset(responses); let reservations = 0; const updates = [];
    const db = {
      rpc: async () => { reservations++; return { data: true, error: null }; },
      from: () => ({ update(value) { updates.push(value); return this; }, eq() { return this; },
        then(resolve) { resolve({ error: null }); } }),
    };
    const route = load('src/app/api/speech/transcribe/route.ts', {
      '@/lib/speech/server': { ...server, actor: async () => ({ db, user: { id: 'PRIVATE_QA_ACCOUNT' } }), networkHash: () => 'qa' },
    });
    const response = await route.POST(new Request('https://example.test/api/speech/transcribe', {
      method: 'POST', body: JSON.stringify({ id, topic: 'Why are short walks useful?', previousId: null,
        qa: true, exposureVersion: 'expanded_v1', entrySource: 'speech_hub', audio: wav.toString('base64') }),
    }));
    return { status: response.status, body: await response.json(), reservations, updates };
  }
  let result = await routeResult([provider('bad'), valid()]);
  assert.equal(result.status, 200); assert.equal(result.body.id, id);
  assert.equal(result.reservations, 1, 'Recovery cannot reserve a second practice attempt');
  assert.equal(result.updates.at(-1).status, 'transcribed');
  assert.equal(result.updates.at(-1).usage.transcription.attempts.length, 2);
  assert.equal(result.updates.at(-1).usage.context.qa, true);
  assert.ok(!result.updates.some(x => x.status === 'failed'));
  result = await routeResult([provider('bad'), provider('bad again')]);
  assert.equal(result.status, 503); assert.equal(result.body.retryWithNewId, true);
  assert.equal(result.reservations, 1); assert.equal(result.updates.at(-1).status, 'failed');
  assert.equal(requests.length, 2); assert.ok(!JSON.stringify(result.body).includes('PRIVATE'));
  for (const responses of [[provider('{"transcript":""}')], [provider('bad'), provider('{"transcript":"[unclear]"}')]]) {
    const expectedCalls = responses.length;
    result = await routeResult(responses);
    assert.equal(result.status, 422, 'Insufficient speech cannot become a success');
    assert.equal(result.body.retryWithNewId, true); assert.equal(result.updates.at(-1).status, 'failed');
    assert.equal(result.reservations, 1); assert.equal(requests.length, expectedCalls);
  }
  assert.ok(!JSON.stringify([...logs, ...recovered]).includes('PRIVATE'));
} finally {
  globalThis.fetch = original.fetch; console.error = original.error; console.info = original.info;
  Date.now = original.now; AbortSignal.timeout = original.timeout;
}
console.log('PASS: bounded transcription format recovery, shared deadline, diagnostics, usage, single reservation, retryable exhaustion, insufficient speech, refusal and privacy.');
