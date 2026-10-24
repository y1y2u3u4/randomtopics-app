// Team Icebreaker Bot: pure logic (no server-only imports, so scripts can load it).
// Webhook validation, masking, payloads, schedule check, no-repeat question order.
// The question pools are loaded lazily and only by server code (route + cron).

export type BotPlatform = "slack" | "discord" | "teams";
export type BotFrequency = "daily" | "weekdays" | "weekly";

export const BOT_PLATFORMS: BotPlatform[] = ["slack", "discord", "teams"];
export const BOT_FREQUENCIES: BotFrequency[] = ["daily", "weekdays", "weekly"];
export const BOT_MAX_CHANNELS = 3;
export const BOT_TRIAL_DAYS = 7;
export const BOT_LINK = "https://randomtopics.app/slack-icebreaker-bot?utm_source=bot";
export const BOT_LINK_LABEL = "via randomtopics.app";

export const BOT_CATEGORIES = [
  { id: "mixed", label: "Mixed (all of the below)" },
  { id: "work", label: "Work & team" },
  { id: "funny", label: "Funny & light" },
  { id: "deep", label: "Deep & reflective" },
  { id: "this-or-that", label: "This or that" },
  { id: "classroom", label: "Classroom & learning" },
  { id: "kids", label: "Kids & family" },
] as const;
export type BotCategory = (typeof BOT_CATEGORIES)[number]["id"];

export function botCategory(value: unknown): BotCategory | null {
  return BOT_CATEGORIES.find((c) => c.id === value)?.id ?? null;
}
export function botPlatform(value: unknown): BotPlatform | null {
  return BOT_PLATFORMS.find((p) => p === value) ?? null;
}
export function botFrequency(value: unknown): BotFrequency | null {
  return BOT_FREQUENCIES.find((f) => f === value) ?? null;
}
export function botHour(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 23 ? value : null;
}

// ── Webhook URLs ─────────────────────────────────────────────────────────
const TEAMS_SUFFIXES = [".webhook.office.com", ".logic.azure.com", ".environment.api.powerplatform.com"];

/** True only for https webhook URLs on the exact hosts of the chosen platform. */
export function validateWebhook(platform: BotPlatform, raw: unknown): boolean {
  if (typeof raw !== "string" || raw.length < 20 || raw.length > 600 || raw !== raw.trim()) return false;
  let url: URL;
  try { url = new URL(raw); } catch { return false; }
  if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
  const host = url.hostname.toLowerCase();
  const path = url.pathname;
  if (platform === "slack") return host === "hooks.slack.com" && /^\/(services|triggers)\/[^/]+(\/[^/]+)+\/?$/.test(path);
  if (platform === "discord") {
    return (host === "discord.com" || host === "discordapp.com") && /^\/api(\/v\d+)?\/webhooks\/\d{5,25}\/[\w-]{20,}\/?$/.test(path);
  }
  return TEAMS_SUFFIXES.some((s) => host.length > s.length && host.endsWith(s)) && path.length > 1;
}

/** Host plus the last 4 characters; never the whole URL (it is a secret). */
export function maskWebhook(raw: string): string {
  try {
    const url = new URL(raw);
    return `${url.hostname}/…${raw.replace(/\/+$/, "").slice(-4)}`;
  } catch {
    return "…";
  }
}

// ── Messages ─────────────────────────────────────────────────────────────
export function buildPayload(platform: BotPlatform, question: string): unknown {
  if (platform === "slack") return { text: `*${question}*\n<${BOT_LINK}|${BOT_LINK_LABEL}>` };
  if (platform === "discord") {
    return { content: `**${question}**\n[${BOT_LINK_LABEL}](<${BOT_LINK}>)`, allowed_mentions: { parse: [] } };
  }
  return {
    type: "message",
    attachments: [{
      contentType: "application/vnd.microsoft.card.adaptive",
      content: {
        type: "AdaptiveCard",
        version: "1.4",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        body: [
          { type: "TextBlock", text: question, wrap: true, weight: "Bolder", size: "Medium" },
          { type: "TextBlock", text: `[${BOT_LINK_LABEL}](${BOT_LINK})`, wrap: true, size: "Small", isSubtle: true, spacing: "Small" },
        ],
      },
    }],
  };
}

export interface SendResult { ok: boolean; error?: string }

/** POSTs one message. 8s timeout, redirects are never followed, the URL never appears in errors. */
export async function sendWebhook(platform: BotPlatform, url: string, question: string): Promise<SendResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(platform, question)),
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    if (res.status >= 200 && res.status < 300) return { ok: true };
    if (res.status >= 300 && res.status < 400) return { ok: false, error: "The webhook redirected somewhere else, so it was not used. Create a new webhook URL." };
    if (res.status === 404 || res.status === 410) return { ok: false, error: "The webhook was not found (it may have been deleted). Create a new one and paste it here." };
    if (res.status === 401 || res.status === 403) return { ok: false, error: "The webhook was refused. Check that it is still enabled." };
    if (res.status === 429) return { ok: false, error: "The platform is rate limiting this webhook. It will retry on the next schedule." };
    return { ok: false, error: `The platform answered with status ${res.status}.` };
  } catch {
    return { ok: false, error: "Could not reach the webhook (timeout or network error)." };
  }
}

// ── Schedule ─────────────────────────────────────────────────────────────
export interface DueChannel {
  send_hour: number;
  timezone: string;
  frequency: string;
  last_sent_at: string | null;
}

function localParts(at: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, hour: "2-digit", hourCycle: "h23", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { hour: Number(get("hour")), weekday: get("weekday"), day: `${get("year")}-${get("month")}-${get("day")}` };
}

/** Is it this channel's send hour, on a send day, and not yet sent on this local date? */
export function isDue(channel: DueChannel, now: Date = new Date()): boolean {
  let local;
  try { local = localParts(now, channel.timezone); } catch { return false; }
  if (local.hour !== channel.send_hour) return false;
  if (channel.frequency === "weekdays" && (local.weekday === "Sat" || local.weekday === "Sun")) return false;
  if (channel.frequency === "weekly" && local.weekday !== "Mon") return false;
  if (channel.frequency !== "daily" && channel.frequency !== "weekdays" && channel.frequency !== "weekly") return false;
  if (channel.last_sent_at) {
    const last = new Date(channel.last_sent_at);
    if (!Number.isNaN(last.getTime()) && localParts(last, channel.timezone).day === local.day) return false;
  }
  return true;
}

/** Sending is on during the trial or while the owner has a bot plan. */
export function isSending(channel: { active: boolean; trial_ends_at: string }, plan: boolean, now: Date = new Date()): boolean {
  return channel.active && (plan || now.getTime() < new Date(channel.trial_ends_at).getTime());
}

// ── No-repeat order ──────────────────────────────────────────────────────
function hashSeed(text: string): number {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic permutation of 0..n-1 seeded by the channel id. */
export function permutation(channelId: string, length: number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  const random = mulberry32(hashSeed(channelId));
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** The sentCount-th question of this channel: no repeats until the whole pool was used. */
export function questionFor(channelId: string, sentCount: number, pool: readonly string[]): string {
  if (!pool.length) return "What is one thing that made you smile this week?";
  const order = permutation(channelId, pool.length);
  return pool[order[((sentCount % pool.length) + pool.length) % pool.length]];
}

// ── Pools (server only: dynamic import keeps the data out of the page bundle) ──
const unique = (items: string[]) => [...new Set(items.map((q) => q.trim()).filter(Boolean))];

export async function loadPool(category: BotCategory): Promise<string[]> {
  const { QOTD_QUESTIONS } = await import("@/data/questionOfTheDay");
  const byTag = (tag: string) => QOTD_QUESTIONS.filter((q) => q.c === tag).map((q) => q.q);
  const work = async () => {
    const { WORK_QOTD_QUESTIONS } = await import("@/data/premiumQotd");
    return [...byTag("work"), ...WORK_QOTD_QUESTIONS.map((q) => q.prompt)];
  };
  const thisOrThat = async () => {
    const { THIS_OR_THAT_COLLECTIONS, thisOrThatQuestions } = await import("@/data/thisOrThatCollections");
    return THIS_OR_THAT_COLLECTIONS.filter((c) => c.slug === "work" || c.slug === "hard").flatMap(thisOrThatQuestions);
  };
  switch (category) {
    case "work": return unique(await work());
    case "funny": return unique(byTag("funny"));
    case "deep": return unique(byTag("deep"));
    case "classroom": return unique(byTag("classroom"));
    case "kids": return unique(byTag("kids"));
    case "this-or-that": return unique(await thisOrThat());
    default: return unique([...(await work()), ...byTag("funny"), ...byTag("deep"), ...(await thisOrThat())]);
  }
}
