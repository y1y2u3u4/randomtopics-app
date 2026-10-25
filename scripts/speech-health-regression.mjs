// Speech failure-rate alert (2026-10-25): >=5 failed and 0 succeeded in the last hour.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const health = load("src/lib/speech/health.ts");
assert.equal(health.speechAlert({ failed: 5, ok: 0 }), true, "5 failed, 0 ok alerts");
assert.equal(health.speechAlert({ failed: 4, ok: 0 }), false, "4 failed does not alert");
assert.equal(health.speechAlert({ failed: 30, ok: 1 }), false, "any success suppresses the alert");
assert.match(health.alertText({ failed: 7, ok: 0 }, new Date("2026-10-25T12:00:00Z")), /^\[speech-alert\].*7 failed/, "alert text");
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
assert.ok(vercel.crons.some((c) => c.path === "/api/cron/speech-health" && c.schedule.split(" ")[1] === "*"), "hourly cron registered");
const route = readFileSync(resolve(root, "src/app/api/cron/speech-health/route.ts"), "utf8");
assert.ok(route.includes("isAuthorized(request)") && route.includes("CRON_SECRET"), "cron requires CRON_SECRET");
console.log("speech health regression: 6 checks passed");
