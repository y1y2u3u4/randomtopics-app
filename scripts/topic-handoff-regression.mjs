import assert from "node:assert/strict";
import { parseHandoff, HANDOFF_TTL } from "../src/lib/topicHandoff.ts";
import { debateDraft } from "../src/lib/debatePreparation.ts";
import { drawUnseen } from "../src/lib/topicPool.ts";
import { coreUsageEvents } from "../src/lib/coreUsage.ts";
import { CORE_USAGE_STAGES, coreUsageRows } from "../src/lib/coreUsageReport.ts";
const now = 1_800_000_000_000;
const topic = { id: "fixture", text: "¿Cómo aprender de los errores?", category: "education", modes: ["speech"], depth: "light", talkingPoints: ["A personal example"] };
const pack = (extra = {}) => JSON.stringify({ source: "es_article", topic, at: now, ...extra });
assert.deepEqual(parseHandoff(pack(), now).topic, topic);
for (const raw of [null, "broken", pack({ source: "https://evil.example" }), pack({ source: "toString" }), pack({ at: now + 1 }), pack({ at: now - HANDOFF_TTL - 1 }), pack({ topic: { ...topic, category: "invented" } }), pack({ topic: { ...topic, talkingPoints: [12] } })]) assert.equal(parseHandoff(raw, now), null);
assert.equal(debateDraft("Motion", ["  Claim  ", "", "Need a source", ""]), "Motion\n\nMy position and reason:\nClaim\n\nEvidence I still need to verify:\nNeed a source");
assert.equal(debateDraft("Motion", ["", " ", "", ""]), "Motion", "Never export empty placeholders");
const pool = ["a", "b", "c"];
let used = new Set(), output = [];
for (let i = 0; i < 4; i++) { const draw = drawUnseen(pool, used, x => x, 1, () => 0); used = draw.used; output.push(draw.picked[0]); }
assert.deepEqual(output, ["a", "b", "c", "a"]);
const blocked = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); }, removeItem() { throw Error("blocked"); } };
const derive = (path, event, params) => coreUsageEvents(path, event, params, blocked, blocked, now);
assert.deepEqual(derive("/spin-the-wheel", "copy_result", { action_surface: "spin_result" }), ["post_spin_copy"]);
assert.deepEqual(derive("/spin-the-wheel", "copy_result", { action_surface: "editorial_card" }), []);
assert.deepEqual(derive("/debate", "copy_error", { action_surface: "debate_preparation" }), ["debate_prep_copy_error"]);
assert.deepEqual(derive("/es/speech", "timer_first_start", { content_source: "handoff_es_article" }), ["handoff_es_article_timer_first_start"]);
assert.deepEqual(derive("/speech", "copy_result", { content_source: "handoff_home" }), ["handoff_home_copy"]);
assert.ok(CORE_USAGE_STAGES.every(([, name]) => `qa_${name}`.length <= 40));
assert.ok(coreUsageRows([["current7", "2026-09-22", "2026-09-28", "/spin-the-wheel", "qa_post_spin_copy", 1, 1]], "current7", "2026-09-22", "2026-09-28").every(row => row[5] === 0));
console.log("PASS: exact topic payload, malformed/expired handoff rejection, clean draft export, unseen wheel cycle, source-specific success/error, restored-result exclusion, QA event limits and reporting separation.");

// Editorial motions must retain their exact bank text and never count as generation.
const { MOTION_PREPARATION } = await import('../src/data/motionPreparation.ts');
const { readFileSync } = await import('node:fs');
const motionPage = readFileSync(new URL('../src/app/debate/motions/page.tsx', import.meta.url), 'utf8');
assert.equal(new Set(MOTION_PREPARATION.map(item => item.id)).size, 3);
for (const item of MOTION_PREPARATION) {
  assert.ok(motionPage.includes(JSON.stringify(item.motion)), 'Preparation uses an exact existing motion');
  assert.equal(debateDraft(item.motion, ['My own reason', '', '', '']), `${item.motion}\n\nMy position and reason:\nMy own reason`);
}
for (const action of ['copy', 'share']) {
  assert.deepEqual(derive('/debate/motions', `${action}_result`, { action_surface: 'debate_motion_preparation' }), [`motion_prep_${action}`]);
  assert.deepEqual(derive('/debate/motions', `${action}_error`, { action_surface: 'debate_motion_preparation' }), [`motion_prep_${action}_error`]);
}
assert.deepEqual(derive('/debate', 'copy_result', { action_surface: 'debate_motion_preparation' }), []);
assert.deepEqual(derive('/debate/motions', 'generate_success', { action_surface: 'debate_motion_preparation' }), []);
const beforeRelease = coreUsageRows([], 'current7', '2026-09-18', '2026-09-24').filter(row => row[4].startsWith('motion_prep_'));
assert.equal(beforeRelease.length, 6);
assert.ok(beforeRelease.every(row => row[7] === 'before_release_no_new_signal'));
assert.ok(coreUsageRows([], 'current7', '2026-09-27', '2026-10-03').filter(row => row[4].startsWith('motion_prep_')).every(row => row[7] === 'no_events_in_window'));
console.log('PASS: editorial motion identity, own-note-only export, isolated motion actions and release-aware reporting.');
