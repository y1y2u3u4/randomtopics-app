import assert from 'node:assert/strict';
import { load } from './lib/load-typescript.mjs';

const { generateTopicsWithAI } = load('src/lib/topicGenerator.ts');
const topic = {
  text: 'How could a small community make its public spaces more welcoming?',
  category: 'education', modes: ['speech', 'conversation'], depth: 'medium',
  talkingPoints: ['Who uses the space?', 'What prevents access?', 'What could change?'],
};
const valid = JSON.stringify({ topics: [topic] });
const originalFetch = globalThis.fetch;
const originalNow = Date.now;
const originalTimeout = AbortSignal.timeout;
let requests, clock, timeouts;
function scenario(replies) {
  requests = []; clock = 1000; timeouts = [];
  Date.now = () => clock;
  AbortSignal.timeout = (ms) => { timeouts.push(ms); return new AbortController().signal; };
  globalThis.fetch = async (_url, init) => {
    requests.push(JSON.parse(init.body));
    const reply = replies[requests.length - 1];
    assert.ok(reply, 'No extra provider request');
    clock += reply.elapsed ?? 0;
    if (reply.networkError) throw new TypeError('network unavailable');
    return {
      ok: !reply.status, status: reply.status ?? 200,
      json: async () => {
        if (reply.invalidEnvelope) throw new SyntaxError('sensitive provider response');
        return { choices: [{ finish_reason: reply.finish ?? 'stop', message: { content: reply.content ?? valid, refusal: reply.refusal } }] };
      },
    };
  };
}
try {
  scenario([{}]);
  assert.equal((await generateTopicsWithAI()).topics[0].text, topic.text);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].response_format.type, 'json_schema');
  assert.equal(requests[0].provider.require_parameters, true);

  // Production failures included trailing commas and missing separators.
  for (const content of ['{"topics": [null,]}', '{"topics": [null null]}', '{"topics": []}', JSON.stringify({ topics: [{ ...topic, text: ' ' }] })]) {
    scenario([{ content, elapsed: 12000 }, {}]);
    assert.equal((await generateTopicsWithAI()).topics.length, 1);
    assert.equal(requests.length, 2);
    assert.deepEqual(timeouts, [45000, 33000], 'Both calls share one deadline');
  }
  scenario([{ invalidEnvelope: true }, {}]);
  assert.equal((await generateTopicsWithAI()).topics.length, 1);
  scenario([{ finish: 'length' }, {}]);
  assert.equal((await generateTopicsWithAI()).topics.length, 1);
  assert.equal(requests.length, 2, 'Truncated output is regenerated even if it parses');

  scenario([{ content: 'PRIVATE_OUTPUT_ONE' }, { content: 'PRIVATE_OUTPUT_TWO' }]);
  await assert.rejects(generateTopicsWithAI(), { message: 'topic_invalid_output' });
  assert.equal(requests.length, 2);

  scenario([{ content: 'broken', elapsed: 41000 }]);
  await assert.rejects(generateTopicsWithAI(), { message: 'topic_invalid_output' });
  assert.equal(requests.length, 1, 'Do not retry without enough time');

  for (const reply of [{ status: 429 }, { status: 401 }, { networkError: true }, { refusal: 'blocked' }, { finish: 'content_filter' }]) {
    scenario([reply]);
    await assert.rejects(generateTopicsWithAI());
    assert.equal(requests.length, 1, 'Do not retry HTTP errors, network errors or refusals');
  }

  scenario([{ content: JSON.stringify({ topics: [topic, topic] }) }]);
  assert.equal((await generateTopicsWithAI(2.8)).topics.length, 2);
  assert.equal(requests[0].response_format.json_schema.schema.properties.topics.minItems, 2);
  scenario([{ content: '```json\n' + JSON.stringify([topic]) + '\n```' }]);
  assert.equal((await generateTopicsWithAI()).topics.length, 1, 'Retain fenced/array response compatibility');
  console.log('PASS: structured topic output, malformed JSON recovery, count/shape validation, shared deadline, refusal/HTTP limits and sanitized errors.');
} finally {
  globalThis.fetch = originalFetch;
  Date.now = originalNow;
  AbortSignal.timeout = originalTimeout;
}
