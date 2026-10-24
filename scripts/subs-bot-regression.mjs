// Team Icebreaker Bot: webhook validation, masking, payloads, schedule, no-repeat order, cron auth.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
let checks = 0;
const check = (ok, message) => { assert.ok(ok, message); checks++; };
const bot = load("src/lib/subs/bot.ts");

// ── URL validation ───────────────────────────────────────────────────────
const slack = "https://hooks.slack.com/services/T01234567/B01234567/abcdEFGH1234abcd";
check(bot.validateWebhook("slack", slack), "Slack services URL accepted");
check(bot.validateWebhook("slack", "https://hooks.slack.com/triggers/T01234567/9876543210/abcdef0123456789"), "Slack workflow trigger URL accepted");
for (const bad of [
  slack.replace("https", "http"), "https://hooks.slack.com.evil.com/services/T0/B0/abcdefgh", "https://evil.com/https://hooks.slack.com/services/T0/B0/x",
  "https://user:pw@hooks.slack.com/services/T0/B0/abcdefgh", "https://hooks.slack.com:8443/services/T0/B0/abcdefgh", "https://hooks.slack.com/other/T0/B0/abcdefgh",
  "https://xhooks.slack.com/services/T0/B0/abcdefgh", "https://hooks.slack.com/services/", " " + slack, "",
]) check(!bot.validateWebhook("slack", bad), `Slack rejects ${bad}`);
check(!bot.validateWebhook("slack", 42) && !bot.validateWebhook("slack", null), "Non-strings rejected");
const discord = "https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz_-ABCDEFG";
check(bot.validateWebhook("discord", discord), "Discord URL accepted");
check(bot.validateWebhook("discord", discord.replace("discord.com", "discordapp.com")), "discordapp.com accepted");
check(!bot.validateWebhook("discord", discord.replace("https", "http")), "Discord http rejected");
check(!bot.validateWebhook("discord", discord.replace("discord.com", "discord.com.evil.io")), "Discord lookalike rejected");
check(!bot.validateWebhook("discord", discord.replace("discord.com", "evildiscord.com")), "Discord suffix lookalike rejected");
check(!bot.validateWebhook("discord", slack), "Slack URL rejected for Discord");
check(!bot.validateWebhook("slack", discord), "Discord URL rejected for Slack");
for (const good of [
  "https://contoso.webhook.office.com/webhookb2/abc/IncomingWebhook/def/ghi",
  "https://prod-12.westus.logic.azure.com:443/workflows/abc/triggers/manual/paths/invoke?api-version=2016-06-01&sig=xyz",
  "https://default123.ab.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/abc/triggers/manual/paths/invoke?sig=x",
]) {
  // :443 is the default port and is normalized away by URL
  check(bot.validateWebhook("teams", good), `Teams accepts ${good.slice(0, 50)}`);
}
check(!bot.validateWebhook("teams", "https://webhook.office.com/webhookb2/abc/def/ghijklmn"), "Teams bare suffix host rejected");
check(!bot.validateWebhook("teams", "https://x.webhook.office.com.evil.com/webhookb2/abcdef"), "Teams lookalike rejected");
check(!bot.validateWebhook("teams", "https://evil.com/.logic.azure.com/workflows/abcdef"), "Teams path trick rejected");
check(!bot.validateWebhook("teams", "http://prod-12.westus.logic.azure.com/workflows/abc/def"), "Teams http rejected");
check(!bot.validateWebhook("teams", "https://x." + "a".repeat(600) + ".logic.azure.com/w"), "Too-long URL rejected");

// ── Masking ──────────────────────────────────────────────────────────────
const masked = bot.maskWebhook(slack);
check(masked.startsWith("hooks.slack.com") && masked.endsWith("abcd") && !masked.includes("T01234567") && !masked.includes("services"), "Mask shows host and last 4 only");
check(bot.maskWebhook("not a url") === "…", "Mask of garbage is safe");

// ── Payloads ─────────────────────────────────────────────────────────────
const q = "What is your favourite meeting snack?";
const s = bot.buildPayload("slack", q);
check(typeof s.text === "string" && s.text.includes(q) && s.text.includes("https://randomtopics.app/slack-icebreaker-bot?utm_source=bot"), "Slack payload has text and link");
const d = bot.buildPayload("discord", q);
check(d.content.includes(q) && d.content.includes("randomtopics.app") && d.allowed_mentions.parse.length === 0, "Discord payload has content, link, no mentions");
const t = bot.buildPayload("teams", q);
const card = t.attachments[0];
check(t.type === "message" && card.contentType === "application/vnd.microsoft.card.adaptive" && card.content.type === "AdaptiveCard" && card.content.version === "1.4", "Teams adaptive card envelope");
check(card.content.body[0].text === q && card.content.body.some((b) => b.text.includes("randomtopics.app")), "Teams card body has question and link");

// ── isDue ────────────────────────────────────────────────────────────────
const ch = (o) => ({ send_hour: 9, timezone: "UTC", frequency: "daily", last_sent_at: null, ...o });
const at = (iso) => new Date(iso);
check(bot.isDue(ch({}), at("2026-10-24T09:05:00Z")), "Daily due at the hour");
check(!bot.isDue(ch({}), at("2026-10-24T10:05:00Z")), "Not due in another hour");
check(!bot.isDue(ch({ last_sent_at: "2026-10-24T09:00:10Z" }), at("2026-10-24T09:50:00Z")), "Not due twice on the same local date");
check(bot.isDue(ch({ last_sent_at: "2026-10-23T09:00:10Z" }), at("2026-10-24T09:05:00Z")), "Due again the next day");
check(bot.isDue(ch({ timezone: "America/New_York" }), at("2026-10-24T13:00:00Z")), "New York 09:00 EDT = 13:00 UTC");
check(!bot.isDue(ch({ timezone: "America/New_York" }), at("2026-10-24T09:00:00Z")), "09:00 UTC is 05:00 in New York");
check(bot.isDue(ch({ timezone: "Asia/Tokyo" }), at("2026-10-24T00:10:00Z")), "Tokyo 09:00 = 00:00 UTC");
check(bot.isDue(ch({ timezone: "Asia/Kolkata", send_hour: 14 }), at("2026-10-24T08:40:00Z")), "Half-hour zone: Kolkata 14:10");
// 2026-10-24 is a Saturday, 10-25 Sunday, 10-26 Monday
check(!bot.isDue(ch({ frequency: "weekdays" }), at("2026-10-24T09:00:00Z")), "Weekdays skip Saturday");
check(!bot.isDue(ch({ frequency: "weekdays" }), at("2026-10-25T09:00:00Z")), "Weekdays skip Sunday");
check(bot.isDue(ch({ frequency: "weekdays" }), at("2026-10-26T09:00:00Z")), "Weekdays send Monday");
check(bot.isDue(ch({ frequency: "weekly" }), at("2026-10-26T09:00:00Z")), "Weekly sends Monday");
check(!bot.isDue(ch({ frequency: "weekly" }), at("2026-10-27T09:00:00Z")), "Weekly skips Tuesday");
check(!bot.isDue(ch({ frequency: "weekly", timezone: "Pacific/Auckland" }), at("2026-10-26T09:00:00Z")), "Local hour is used (Auckland is 22:00 then, not 09:00)");
check(bot.isDue(ch({ frequency: "weekly", timezone: "Pacific/Auckland", send_hour: 22 }), at("2026-10-26T09:00:00Z")), "Auckland Monday 22:00 local is due");
check(!bot.isDue(ch({ timezone: "Not/AZone" }), at("2026-10-24T09:00:00Z")), "Bad time zone never due");
check(!bot.isDue(ch({ frequency: "hourly" }), at("2026-10-24T09:00:00Z")), "Unknown frequency never due");
const nowT = at("2026-10-24T09:00:00Z");
check(bot.isSending({ active: true, trial_ends_at: "2026-10-30T00:00:00Z" }, false, nowT), "Sending during trial");
check(!bot.isSending({ active: true, trial_ends_at: "2026-10-20T00:00:00Z" }, false, nowT), "Stops after trial without a plan");
check(bot.isSending({ active: true, trial_ends_at: "2026-10-20T00:00:00Z" }, true, nowT), "Plan keeps sending after trial");
check(!bot.isSending({ active: false, trial_ends_at: "2026-10-30T00:00:00Z" }, true, nowT), "Paused channel never sends");

// ── No-repeat order ──────────────────────────────────────────────────────
const pool = Array.from({ length: 37 }, (_, i) => `Question ${i}`);
const seen = new Set();
for (let i = 0; i < pool.length; i++) seen.add(bot.questionFor("channel-a", i, pool));
check(seen.size === pool.length, "A full cycle covers the whole pool before any repeat");
check(bot.questionFor("channel-a", 5, pool) === bot.questionFor("channel-a", 5 + pool.length, pool), "Order cycles after the pool is used");
check(bot.questionFor("channel-a", 3, pool) === bot.questionFor("channel-a", 3, pool), "Deterministic");
const orderA = pool.map((_, i) => bot.questionFor("channel-a", i, pool)).join("|");
const orderB = pool.map((_, i) => bot.questionFor("channel-b", i, pool)).join("|");
check(orderA !== orderB, "Different channels get different orders");
check(typeof bot.questionFor("x", 0, []) === "string", "Empty pool falls back");

// ── Real pools ───────────────────────────────────────────────────────────
for (const c of bot.BOT_CATEGORIES) {
  const p = await bot.loadPool(c.id);
  check(p.length >= 20 && new Set(p).size === p.length, `Pool ${c.id} has ${p.length} unique questions`);
}
check(bot.BOT_CATEGORIES.length >= 5 && bot.BOT_CATEGORIES.length <= 7, "5-7 categories");
check(bot.botCategory("work") === "work" && bot.botCategory("nope") === null && bot.botHour(24) === null && bot.botHour(0) === 0 && bot.botHour(9.5) === null, "Input validators");

// ── Cron auth (read from source) ─────────────────────────────────────────
const cron = readFileSync(resolve(root, "src/app/api/cron/bot-send/route.ts"), "utf8");
check(/timingSafeEqual/.test(cron) && /CRON_SECRET/.test(cron) && /Bearer \$\{secret\}/.test(cron), "Cron compares Bearer CRON_SECRET with timingSafeEqual");
check(/secret\.length < 32/.test(cron) && /status: 401/.test(cron) && /status: 503/.test(cron), "Cron rejects short/missing secrets and unauthorized callers");
check(cron.indexOf("isAuthorized(request)") < cron.indexOf("database()"), "Auth runs before any database access");
check(/maxDuration = 60/.test(cron) && /CONCURRENCY = 5/.test(cron), "Bounded duration and concurrency");
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
check(vercel.crons.some((c) => c.path === "/api/cron/bot-send" && c.schedule === "0 * * * *"), "Hourly cron registered");
check(vercel.crons.some((c) => c.path === "/api/cron/analytics-report"), "Analytics cron kept");

// ── API route source guards ──────────────────────────────────────────────
const api = readFileSync(resolve(root, "src/app/api/sub/bot/route.ts"), "utf8");
check(!/webhook_url: row\.webhook_url/.test(api) && !/webhookUrl: row/.test(api), "List view never returns the raw webhook URL");
check(/BOT_MAX_CHANNELS/.test(api) && /validTimeZone/.test(api) && /\.eq\("user_id", user\.id\)/.test(api), "Channel cap, time zone check and owner scoping present");
const lib = readFileSync(resolve(root, "src/lib/subs/bot.ts"), "utf8");
check(/redirect: "manual"/.test(lib) && /AbortSignal\.timeout\(8000\)/.test(lib), "Sends use manual redirects and an 8s timeout");

console.log(`subs-bot-regression: ${checks} checks passed`);
