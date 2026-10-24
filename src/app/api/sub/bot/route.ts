import type { NextRequest } from "next/server";
import { failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { rateLimit } from "@/lib/rateLimit";
import { subContext, validTimeZone } from "@/lib/subs/server";
import {
  BOT_MAX_CHANNELS, BOT_TRIAL_DAYS, botCategory, botFrequency, botHour, botPlatform, isSending, loadPool,
  maskWebhook, questionFor, sendWebhook, validateWebhook, type BotPlatform,
} from "@/lib/subs/bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Row {
  id: string; platform: BotPlatform; webhook_url: string; label: string; category: string; frequency: string;
  send_hour: number; timezone: string; trial_ends_at: string; sent_count: number; last_sent_at: string | null;
  last_error: string | null; active: boolean; created_at: string;
}
const COLUMNS = "id,platform,webhook_url,label,category,frequency,send_hour,timezone,trial_ends_at,sent_count,last_sent_at,last_error,active,created_at";

function view(row: Row, plan: boolean) {
  return {
    id: row.id, platform: row.platform, label: row.label, category: row.category, frequency: row.frequency,
    sendHour: row.send_hour, timezone: row.timezone, masked: maskWebhook(row.webhook_url),
    trialEndsAt: row.trial_ends_at, sentCount: row.sent_count, lastSentAt: row.last_sent_at, lastError: row.last_error,
    active: row.active, sending: isSending(row, plan),
  };
}

/** Sends one question now (does not count towards the schedule) and records the outcome. */
async function sendNow(db: Awaited<ReturnType<typeof subContext>>["db"], row: Row) {
  const pool = await loadPool((botCategory(row.category) ?? "mixed"));
  const question = questionFor(row.id, row.sent_count, pool);
  const result = await sendWebhook(row.platform, row.webhook_url, question);
  await db.from("bot_channels").update({ last_error: result.ok ? null : result.error ?? "Send failed." }).eq("id", row.id);
  return { ...result, question };
}

export async function POST(request: Request) {
  try {
    const { db, user, access } = await subContext(request);
    const body = (await readJson(request).catch(() => ({}))) as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    const plan = (await access()).bot;

    const load = async (): Promise<Row[]> => {
      const { data, error } = await db.from("bot_channels").select(COLUMNS).eq("user_id", user.id).order("created_at");
      if (error) throw error;
      return (data ?? []) as Row[];
    };
    const owned = async (id: unknown) => {
      if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) throw new SpeechError(400, "Unknown channel.");
      const { data, error } = await db.from("bot_channels").select(COLUMNS).eq("id", id).eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (!data) throw new SpeechError(404, "Unknown channel.");
      return data as Row;
    };

    if (action === "list") {
      const rows = await load();
      return response({ access: plan, channels: rows.map((r) => view(r, plan)), max: BOT_MAX_CHANNELS });
    }

    const limited = rateLimit(request as NextRequest, action === "test" ? "sub-bot-test" : "sub-bot-write", action === "test" ? { limit: 6, windowSeconds: 600 } : { limit: 30, windowSeconds: 600 });
    if (limited) return limited;

    if (action === "add") {
      const platform = botPlatform(body.platform);
      if (!platform) throw new SpeechError(400, "Choose Slack, Discord or Teams.");
      const url = typeof body.webhookUrl === "string" ? body.webhookUrl.trim() : "";
      if (!validateWebhook(platform, url)) {
        throw new SpeechError(400, platform === "slack" ? "That is not a Slack webhook URL (it starts with https://hooks.slack.com/services/…)."
          : platform === "discord" ? "That is not a Discord webhook URL (it looks like https://discord.com/api/webhooks/<id>/<token>)."
          : "That is not a Teams workflow webhook URL (https and a .webhook.office.com, .logic.azure.com or .environment.api.powerplatform.com host).");
      }
      const category = botCategory(body.category);
      const frequency = botFrequency(body.frequency);
      const hour = botHour(body.sendHour);
      const timezone = validTimeZone(body.timezone);
      if (!category) throw new SpeechError(400, "Choose a question category.");
      if (!frequency) throw new SpeechError(400, "Choose how often to post.");
      if (hour === null) throw new SpeechError(400, "Choose an hour between 0 and 23.");
      if (!timezone) throw new SpeechError(400, "Choose a valid time zone.");
      const label = typeof body.label === "string" ? body.label.trim().slice(0, 60) : "";

      const existing = await load();
      if (existing.length >= BOT_MAX_CHANNELS) throw new SpeechError(400, `You can have up to ${BOT_MAX_CHANNELS} channels.`);
      const trialEnd = existing.length
        ? existing.map((r) => r.trial_ends_at).sort()[0]
        : new Date(Date.now() + BOT_TRIAL_DAYS * 86_400_000).toISOString();

      const { data, error } = await db.from("bot_channels").insert({
        user_id: user.id, platform, webhook_url: url, label, category, frequency, send_hour: hour, timezone, trial_ends_at: trialEnd,
      }).select(COLUMNS).single();
      if (error) throw error;
      const row = data as Row;

      let sent = false;
      let sendError: string | null = null;
      if (isSending(row, plan)) {
        const result = await sendNow(db, row);
        sent = result.ok;
        sendError = result.ok ? null : result.error ?? "Send failed.";
        row.last_error = sendError;
      }
      return response({ channel: view(row, plan), first: existing.length === 0, sent, error: sendError });
    }

    if (action === "update") {
      const row = await owned(body.id);
      const patch: Record<string, unknown> = {};
      if (body.category !== undefined) { const v = botCategory(body.category); if (!v) throw new SpeechError(400, "Choose a question category."); patch.category = v; }
      if (body.frequency !== undefined) { const v = botFrequency(body.frequency); if (!v) throw new SpeechError(400, "Choose how often to post."); patch.frequency = v; }
      if (body.sendHour !== undefined) { const v = botHour(body.sendHour); if (v === null) throw new SpeechError(400, "Choose an hour between 0 and 23."); patch.send_hour = v; }
      if (body.timezone !== undefined) { const v = validTimeZone(body.timezone); if (!v) throw new SpeechError(400, "Choose a valid time zone."); patch.timezone = v; }
      if (body.label !== undefined) patch.label = typeof body.label === "string" ? body.label.trim().slice(0, 60) : "";
      if (body.active !== undefined) patch.active = body.active === true;
      if (body.webhookUrl !== undefined) {
        const url = typeof body.webhookUrl === "string" ? body.webhookUrl.trim() : "";
        if (!validateWebhook(row.platform, url)) throw new SpeechError(400, "That webhook URL does not match the platform.");
        patch.webhook_url = url;
        patch.last_error = null;
      }
      if (!Object.keys(patch).length) throw new SpeechError(400, "Nothing to update.");
      const { data, error } = await db.from("bot_channels").update(patch).eq("id", row.id).eq("user_id", user.id).select(COLUMNS).single();
      if (error) throw error;
      return response({ channel: view(data as Row, plan) });
    }

    if (action === "remove") {
      const row = await owned(body.id);
      const { error } = await db.from("bot_channels").delete().eq("id", row.id).eq("user_id", user.id);
      if (error) throw error;
      return response({ removed: true });
    }

    if (action === "test") {
      const row = await owned(body.id);
      if (!isSending(row, plan)) throw new SpeechError(402, "Your free week is over. Pick a plan to keep the bot posting.");
      const result = await sendNow(db, row);
      if (!result.ok) throw new SpeechError(502, result.error ?? "The webhook did not accept the message.");
      return response({ sent: true });
    }

    throw new SpeechError(400, "Unknown action.");
  } catch (error) {
    return failure(error);
  }
}
