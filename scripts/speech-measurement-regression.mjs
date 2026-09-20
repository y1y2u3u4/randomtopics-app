import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "..");
function load(path, overrides = {}, globals = {}) {
  const file = resolve(root, path);
  const fixtureModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function("require", "module", "exports", ...Object.keys(globals), code)((id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith(".") || id.startsWith("@/")) {
      let dependency = id.startsWith("@/") ? resolve(root, "src", id.slice(2)) : resolve(dirname(file), id);
      if (!existsSync(dependency)) dependency += ".ts";
      return load(dependency, overrides, globals);
    }
    return require(id);
  }, fixtureModule, fixtureModule.exports, ...Object.values(globals));
  return fixtureModule.exports;
}
const { funnelCounts, funnelRequest } = load("src/lib/speech/report.ts");
const { SPEECH_FUNNELS } = load("src/lib/speech/events.ts");
const request = funnelRequest(SPEECH_FUNNELS[0], 7);
assert.equal(request.funnel.isOpenFunnel, false);
assert.equal(request.funnel.steps[1].withinDurationFromPriorStep, "86400s");
assert.deepEqual(request.dimensionFilter.filter.inListFilter.values, ["randomtopics.app", "www.randomtopics.app"]);
assert.equal(request.funnel.steps[0].filterExpression.funnelEventFilter.funnelParameterFilterExpression.funnelParameterFilter.stringFilter.value, "speech-v2");
assert.deepEqual(funnelRequest(SPEECH_FUNNELS[0],0).dateRanges,[{startDate:'today',endDate:'today'}]);
const report = {
  dimensionHeaders: [{ name: "funnelStepName" }],
  metricHeaders: [{ name: "funnelStepAbandonments" }, { name: "activeUsers" }],
  rows: [
    { dimensionValues: [{ value: "2. Finish" }], metricValues: [{ value: "3" }, { value: "7" }] },
    { dimensionValues: [{ value: "1. Start" }], metricValues: [{ value: "3" }, { value: "10" }] },
  ],
};
assert.deepEqual(funnelCounts(report, ["Start", "Finish"]), [{ label: "Start", users: 10 }, { label: "Finish", users: 7 }]);
assert.throws(() => funnelCounts({}, ["Start"]), /invalid_funnel_headers/);

const events = [];
const telemetry = load("src/lib/speech/telemetry.ts", { "@/lib/track": { track: (...args) => events.push(args) } }, { window: { clarity() { throw new Error("replay down"); }, __rtReplayActive: true } });
telemetry.trackSpeech("speech_feedback_error", { content_source: "speech_hub", attempt: 2, error_code: "service", transcript: "PRIVATE SPEECH", email: "private@example.test", elapsed_ms: 100 });
assert.equal(events[0][1].attempt, 2);
assert.equal(events[1][0], "speech_issue_service");
assert.equal(JSON.stringify(events).includes("PRIVATE"), false);
assert.equal(JSON.stringify(events).includes("private@example"), false);
assert.equal(telemetry.speechErrorCode({ status: 402 }), "quota");
telemetry.trackSpeech("speech_checkout_redirect", {
  content_source: "speech_account",
  url: "https://checkout.stripe.com/c/pay/SECRET_SESSION",
  customer_id: "cus_PRIVATE",
  email: "private@example.test",
});
assert.deepEqual(events.at(-1), ["speech_checkout_redirect", {
  measurement_version: "speech-v2", content_source: "speech_account",
}]);

const stored = new Map(); const pending = new Map(); const paidEvents = [];
const purchaseTelemetry = load('src/lib/speech/telemetry.ts', {'@/lib/track':{track:(...args)=>paidEvents.push(args)}}, {
  window: {}, localStorage:{getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)},
  sessionStorage:{getItem:k=>pending.get(k),removeItem:k=>pending.delete(k)},
});
const receipt = {transactionId:'a'.repeat(64),value:12,currency:'USD'};
purchaseTelemetry.trackConfirmedSpeechPurchase(receipt);
assert.equal(paidEvents.length,0,'historical payment without this browser checkout must not be attributed');
pending.set('rt_speech_checkout_pending',receipt.transactionId);
purchaseTelemetry.trackConfirmedSpeechPurchase({...receipt,value:0});
assert.equal(paidEvents.length,0);
purchaseTelemetry.trackConfirmedSpeechPurchase(receipt);
purchaseTelemetry.trackConfirmedSpeechPurchase(receipt);
assert.deepEqual(paidEvents.map(e=>e[0]),['speech_payment_confirmed','purchase']);
assert.equal(paidEvents[1][1].transaction_id,receipt.transactionId);
assert.equal(paidEvents[1][1].items[0].price,12);

const sent = []; const local = [];
const fakeWindow = { location: { hostname: "preview.vercel.app", pathname: "/speech", origin: "https://preview.vercel.app" }, gtag: (...args) => sent.push(args), dispatchEvent: (event) => local.push(event) };
const tracker = load("src/lib/track.ts", {}, { window: fakeWindow, document: { title: "Speech", documentElement: { lang: "en" } }, CustomEvent: class { constructor(name, options) { this.type = name; this.detail = options.detail; } } });
tracker.track("speech_entry_view"); assert.equal(sent.length, 0); assert.equal(local.length, 1);
fakeWindow.location.hostname = "randomtopics.app";
fakeWindow.location.origin = "https://randomtopics.app";
tracker.track("speech_entry_view"); assert.equal(sent.length, 1);
fakeWindow.location.pathname = "/internal/analytics";
tracker.track("page_view"); assert.equal(sent.length, 1);
fakeWindow.location.pathname = "/speech";
delete fakeWindow.gtag;
tracker.track("speech_coach_open"); assert.equal(fakeWindow.dataLayer[0][1], "speech_coach_open");
console.log("PASS: ordered funnel headers and unavailable handling, production/version filters, private event allowlist, replay failure isolation, preview exclusion and early-event queue.");
