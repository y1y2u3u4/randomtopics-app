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
const { funnelCounts, funnelRequest, speechEventCoverage } = load("src/lib/speech/report.ts");
const { SPEECH_FUNNELS, SPEECH_EVENTS, SPEECH_JOURNEY_STAGES } = load("src/lib/speech/events.ts");
assert.equal(new Set(SPEECH_EVENTS).size, SPEECH_EVENTS.length);
assert.ok(SPEECH_FUNNELS.every(f => f.steps.length <= 10 && f.steps.every(([,event]) => SPEECH_EVENTS.includes(event))));
assert.equal(new Set(SPEECH_JOURNEY_STAGES.map(([,event]) => event)).size, SPEECH_JOURNEY_STAGES.length);
const coverage = speechEventCoverage([{event:'speech_feedback_start',count:2},{event:'qa_speech_feedback_ready',count:9}]);
assert.equal(coverage.find(r=>r.event==='speech_feedback_start').count,2);
assert.deepEqual(coverage.find(r=>r.event==='speech_feedback_ready'), {label:'反馈生成完成',event:'speech_feedback_ready',count:0,status:'no_events_in_window'});
assert.ok(speechEventCoverage(null).every(r=>r.count===null && r.status==='unavailable'), 'An unavailable report is never zero conversions');
assert.equal(speechEventCoverage([{event:'qa_speech_feedback_ready',count:9},{event:'speech_feedback_start',count:2}],true).find(r=>r.event==='qa_speech_feedback_ready').count,9);
assert.equal(speechEventCoverage([],true).find(r=>r.event==='qa_speech_first_attempt_start').count,0);
console.log('PASS: complete event coverage distinguishes received, window zero and unavailable; QA stays separate; all funnel events are registered.');
const request = funnelRequest(SPEECH_FUNNELS[0], 7);
assert.equal(request.funnel.isOpenFunnel, false);
assert.equal(request.funnel.steps[1].withinDurationFromPriorStep, "86400s");
assert.deepEqual(request.dimensionFilter.filter.inListFilter.values, ["randomtopics.app", "www.randomtopics.app"]);
assert.deepEqual(request.funnel.steps.map(step => step.filterExpression), SPEECH_FUNNELS[0].steps.map(([,eventName]) => ({funnelEventFilter:{eventName}})), 'core funnels must not require unregistered custom event parameters');
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

// A visitor can encounter an entry after their page arrival has fallen outside
// the report window. The exposure cohort must not require that earlier arrival.
const exposure = SPEECH_FUNNELS.find(f => f.key === 'exposure_v4');
const exposureRequest = funnelRequest(exposure, 0);
assert.equal(exposureRequest.funnel.isOpenFunnel, false);
assert.deepEqual(exposureRequest.funnel.steps.map(s => s.filterExpression.funnelEventFilter.eventName), ['speech_entry_v4_view', 'speech_entry_v4_click']);
assert.equal(exposureRequest.funnel.steps[1].withinDurationFromPriorStep, '86400s');
assert.equal(SPEECH_FUNNELS.find(f => f.key === 'entry_v4').steps[0][1], 'speech_entry_v4_page', 'Keep the full acquisition funnel alongside the exposure cohort');
assert.equal(SPEECH_FUNNELS.find(f => f.key === 'plan_bridge').steps[0][1], 'speech_plan_view', 'Feedback from before the priced plan launched is not a plan-exposure denominator');
const rawExposure = {dimensionHeaders:[{name:'funnelStepName'}],metricHeaders:[{name:'activeUsers'},{name:'funnelStepCompletionRate'},{name:'activeUsers'}],rows:[
  {dimensionValues:[{value:'1. 按钮可见一秒'}],metricValues:[{value:'3'},{value:'0.33333333333333331'}]},
  {dimensionValues:[{value:'2. 点击免费练习'}],metricValues:[{value:'1'},{value:'1'}]},
]};
assert.deepEqual(funnelCounts(rawExposure, exposure.steps.map(s => s[0])).map(r => r.users), [3,1], 'Parse observed GA headers and ordered counts without substituting independent event users');
assert.deepEqual(funnelCounts({...rawExposure,rows:rawExposure.rows.slice(0,1)}, exposure.steps.map(s => s[0])).map(r => r.users), [3,0], 'GA omits steps with no users');
console.log('PASS: exposure cohort measures ordered clicks without requiring page arrival, full acquisition is retained, and priced-plan cohorts exclude older feedback.');

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
console.log("PASS: ordered funnel headers, production/event-name filters, private event allowlist, replay failure isolation, preview exclusion and early-event queue.");

const qaEvents = [], qaStorage = new Map();
const qaWindow = { location: {search:'?speech_qa=1'}, dispatchEvent() {} };
const qaTelemetry = load('src/lib/speech/telemetry.ts', {'@/lib/track':{track:(...args)=>qaEvents.push(args)}}, {
  window:qaWindow, sessionStorage:{getItem:k=>qaStorage.get(k),setItem:(k,v)=>qaStorage.set(k,v),removeItem:k=>qaStorage.delete(k)},
  CustomEvent:class { constructor(type, options) {this.type=type;this.detail=options.detail;} },
});
qaTelemetry.trackSpeech('speech_entry_v3_click',{content_source:'speech_hub',entry_surface:'example',email:'private@example.test'});
qaWindow.location.search='';
qaTelemetry.trackSpeech('speech_coach_v3_open',{content_source:'speech_hub'});
qaWindow.location.search='?speech_qa=0';
qaTelemetry.trackSpeech('speech_entry_v3_click',{content_source:'speech_hub',entry_surface:'primary'});
assert.deepEqual(qaEvents.map(e=>e[0]),['qa_speech_entry_v3_click','qa_speech_coach_v3_open','speech_entry_v3_click']);
assert.equal(qaEvents[0][1].entry_surface,'example');
assert.equal(JSON.stringify(qaEvents).includes('private@example'),false);
assert.ok(SPEECH_FUNNELS.every(f=>f.steps.every(([,event])=>!event.startsWith('qa_'))));
console.log('PASS: production QA namespace persists across navigation, explicit exit, private-field exclusion and natural funnel isolation.');

const historyEvents = [], historyCalls = [];
let completeHistory;
let historyResponse;
const history = load('src/lib/speech/historyFeedback.ts', {
  './client': { practiceFetch: async (path, body) => {
    historyCalls.push({path, body});
    return historyResponse();
  } },
  './telemetry': {
    trackSpeech: (event, properties) => historyEvents.push({event, properties}),
    speechErrorCode: error => error.status === 503 ? 'service' : 'client_or_network',
  },
});
const savedAttempt = {id:'PRIVATE_ATTEMPT_ID', transcript:'PRIVATE_TRANSCRIPT', previous_id:null};
const completedAttempt = {...savedAttempt, status:'complete', feedback:{priority:{nextStep:'Add one concrete example.'}}};
historyResponse = () => new Promise(resolve => { completeHistory = resolve; });
const pendingHistory = history.resumeHistoryFeedback(savedAttempt);
assert.deepEqual(historyEvents.map(e=>e.event), ['speech_history_resume','speech_history_feedback_start']);
completeHistory(completedAttempt);
assert.equal(await pendingHistory, completedAttempt, 'Return the saved response so rendering does not depend on a second history request');
assert.deepEqual(historyCalls.map(c=>c.path), ['feedback']);
assert.equal(historyEvents.at(-1).event, 'speech_history_feedback_ready');
assert.equal(historyEvents.at(-1).properties.attempt, 1);
assert.ok(!historyEvents.some(e=>e.event.endsWith('_view')), 'An API success is not a visible result');
assert.ok(!JSON.stringify(historyEvents).includes('PRIVATE_'), 'History recovery telemetry contains no content or IDs');
historyEvents.length = 0;
const serviceError = Object.assign(new Error('unavailable'), {status:503});
historyResponse = () => {throw serviceError;};
await assert.rejects(()=>history.resumeHistoryFeedback({...savedAttempt,previous_id:'PRIVATE_PREVIOUS'}), error=>error===serviceError);
assert.deepEqual(historyEvents.map(e=>e.event), ['speech_history_resume','speech_history_feedback_start','speech_history_feedback_error']);
assert.equal(historyEvents.at(-1).properties.error_code, 'service');
assert.equal(historyEvents.at(-1).properties.attempt, 2);
historyEvents.length = 0;
historyResponse = () => ({...completedAttempt,status:'processing'});
await assert.rejects(()=>history.resumeHistoryFeedback(savedAttempt), /not ready/);
assert.ok(!historyEvents.some(e=>e.event.endsWith('_ready')), 'An incomplete response must not count as recovery');
console.log('PASS: history recovery starts before completion, counts failures separately, returns saved results without a second request, never fabricates views, and omits private content.');
