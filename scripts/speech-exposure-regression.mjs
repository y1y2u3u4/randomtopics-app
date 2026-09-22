import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const { SPEECH_EXPOSURE_VERSION } = load("src/lib/speech/exposure.ts");
const { SPEECH_FUNNELS, SPEECH_EVENTS } = load("src/lib/speech/events.ts");
const { funnelRequest } = load("src/lib/speech/report.ts");
const expanded = SPEECH_FUNNELS.find(f => f.key === "expanded_entry");
assert.equal(expanded.steps[0][1], "speech_entry_expanded_view");
assert.deepEqual(funnelRequest(expanded, 0).funnel.steps.map(s => s.filterExpression.funnelEventFilter.eventName),
  ["speech_entry_expanded_view", "speech_entry_expanded_click", "speech_feedback_v5_request", "speech_first_feedback_v5_view"]);
assert.ok(SPEECH_EVENTS.every(name => ("qa_" + name).length <= 40), "QA event names must fit GA4's event-name limit");

// Exercise the real transcription route with synthetic audio and in-memory services.
// No model, database, account creation or payment requests are sent.
const wav = Buffer.alloc(44 + 5 * 24000);
wav.write("RIFF"); wav.writeUInt32LE(wav.length - 8, 4); wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(12000, 24); wav.writeUInt32LE(24000, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write("data", 36); wav.writeUInt32LE(wav.length - 44, 40);
const id = "11111111-1111-4111-8111-111111111111";
class SpeechError extends Error { constructor(status, message) { super(message); this.status = status; } }
async function transcribe(extra) {
  const updates = [];
  const chain = { update(value) { updates.push(value); return this; }, eq() { return this; },
    then(resolve) { resolve({ data: null, error: null }); } };
  const route = load("src/app/api/speech/transcribe/route.ts", {
    "@/lib/speech/server": {
      actor: async () => ({ user: { id: "owner" }, db: { rpc: async () => ({ data: true, error: null }), from: () => chain } }),
      failure: error => Response.json({ error: error.message }, { status: error.status ?? 500 }),
      modelCall: async () => ({ value: { transcript: "A short synthetic sentence for the exposure regression." }, usage: {}, model: "fixture" }),
      networkHash: () => "fixture", readJson: request => request.json(), response: data => Response.json(data), SpeechError,
    },
  });
  const response = await route.POST(new Request("https://example.test/api/speech/transcribe", { method: "POST",
    body: JSON.stringify({ id, topic: "A synthetic test topic", previousId: null, audio: wav.toString("base64"), ...extra }) }));
  assert.equal(response.status, 200, await response.text());
  return updates.filter(update => update.usage).map(update => update.usage.context);
}
const tagged = await transcribe({ exposureVersion: SPEECH_EXPOSURE_VERSION, entrySource: "table_topics_generator", qa: true });
assert.equal(tagged.length, 2, "Save attribution before the model request and preserve it on success");
assert.ok(tagged.every(context => context.entrySource === "table_topics_generator" && context.qa === true && context.exposureVersion === "expanded_v1"));
assert.ok((await transcribe({})).every(context => !("exposureVersion" in context)), "Old clients must not be silently assigned to the new cohort");
assert.ok((await transcribe({ exposureVersion: SPEECH_EXPOSURE_VERSION, entrySource: "private@example.test" })).every(context =>
  context.entrySource === "unknown"), "Arbitrary attribution cannot persist private content or break practice");

const { summarizeSpeechAttempts } = load("src/lib/speech/serverReport.ts", { "./server": {} });
const row = (id, source, qa = false, extra = {}) => ({
  id, user_id: "owner", previous_id: null, status: "complete", created_at: "2026-09-22T04:00:00Z",
  usage: { context: { version: "v5", qa, exposureVersion: "expanded_v1", entrySource: source } }, ...extra,
});
const report = summarizeSpeechAttempts([
  row("first", "impromptu_speech_generator"),
  row("retry", "impromptu_speech_generator", false, { previous_id: "first", created_at: "2026-09-22T04:01:00Z" }),
  row("qa", "table_topics_generator", true),
  row("pending", "table_topics_generator", false, { status: "transcribed" }),
  row("old", "speech_hub", false, { usage: { context: { version: "v5", qa: false } } }),
]);
assert.equal(report.attempts, 4);
assert.equal(report.expandedExposure.attempts, 3, "Expanded cohort excludes old clients and explicit QA");
assert.equal(report.expandedExposure.firstWithCompletedRetry, 1);
assert.equal(report.expandedExposure.sources.find(r => r.source === "impromptu_speech_generator").firstComplete, 1);
assert.equal(report.expandedExposure.sources.find(r => r.source === "table_topics_generator").pending, 1);
assert.equal(report.expandedExposure.sources.find(r => r.source === "table_topics_generator").firstComplete, 0);
assert.equal(JSON.stringify(report).includes('"owner"'), false);
console.log("PASS: expanded ordered funnel, GA event limits, source persistence before/after transcription, old-client separation, private-source rejection and QA-separated outcome aggregates.");

