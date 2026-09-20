import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { aggregateGscPageRows } from "../src/lib/gscPageAggregation.ts";

// Exercise the actual page-event reducer with synthetic GA rows, without credentials.
const require = createRequire(import.meta.url);
const source = readFileSync(new URL("../src/lib/googleReporting.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const target = { exports: {} };
const rows = [
  ["/speech", "practice_draft_start", 9, 7],
  ["/speech", "practice_outline_ready", 4, 3],
  ["/speech", "timer_start", 12, 8],
  ["/speech", "timer_complete", 6, 4],
  ["/es/topics/most-likely-to-questions", "party_round_complete", 8, 6],
  ["/es/topics/most-likely-to-questions", "party_round_skip", 2, 1],
  ["/question-of-the-day-for-work", "weekly_plan_replace", 5, 2],
].map(([path, event, count, users]) => ({ dimensionValues: [{ value: path }, { value: event }], metricValues: [{ value: String(count) }, { value: String(users) }, { value: "1" }] }));
let request;
new Function("require", "module", "exports", "testReport", `${compiled}\nrunGaReport = testReport; module.exports.testFunnel = getGaGrowthPageFunnel;`)((id) => {
  if (id === "server-only") return {};
  if (id === "@/lib/gscPageAggregation") return { aggregateGscPageRows };
  if (id === "@/lib/speech/events") return {};
  if (id === "@/lib/speech/report") return {};
  return require(id);
}, target, target.exports, async (options) => { request = options; return { rows }; });
const pages = await target.exports.testFunnel();
const events = request.dimensionFilter.andGroup.expressions[1].filter.inListFilter.values;
for (const row of rows) assert.ok(events.includes(row.dimensionValues[1].value));
assert.deepEqual(request.dimensions, ["pagePath", "eventName"]);
const speech = pages.get("/speech");
assert.deepEqual([speech.practiceDraftStarts, speech.practiceDraftUsers, speech.practiceOutlinesReady, speech.practiceOutlineUsers, speech.timerStarts, speech.timerCompletes], [9, 7, 4, 3, 12, 6]);
assert.equal(speech.successes, 0, "Draft readiness is not a generated topic");
assert.equal(speech.postGenerateCopyUsers, 0, "Readiness is not a conversion");
const party = pages.get("/es/topics/most-likely-to-questions");
assert.deepEqual([party.partyRoundCompletes, party.partyRoundUsers, party.partyRoundSkips, party.practiceDraftStarts], [8, 6, 2, 0]);
assert.equal(pages.get("/question-of-the-day-for-work").weeklyPlanReplacements, 5);
console.log("PASS: practice and round events enter page reporting as counts/users, with no fabricated generation or ordered funnel.");
