import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady } from "@/lib/speech/billing";
import { botCategory, isDue, loadPool, questionFor, sendWebhook, type BotCategory, type BotPlatform } from "@/lib/subs/bot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};
const PAGE = 500;
const CONCURRENCY = 5;

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32 || authorization.length > 1_024) return false;
  return safeEqual(authorization, `Bearer ${secret}`);
}

interface Row {
  id: string; user_id: string; platform: BotPlatform; webhook_url: string; category: string; frequency: string;
  send_hour: number; timezone: string; trial_ends_at: string; sent_count: number; last_sent_at: string | null;
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "cron_not_configured" }, { status: 503, headers: PRIVATE_HEADERS });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: PRIVATE_HEADERS });
  }

  try {
    const db = database();
    const livemode = billingManagementReady() ? billingConfiguration().livemode : true;
    const pools = new Map<BotCategory, string[]>();
    const counts = { checked: 0, due: 0, sent: 0, failed: 0, skipped: 0 };

    for (let from = 0; ; from += PAGE) {
      const { data, error } = await db.from("bot_channels")
        .select("id,user_id,platform,webhook_url,category,frequency,send_hour,timezone,trial_ends_at,sent_count,last_sent_at")
        .eq("active", true).order("id").range(from, from + PAGE - 1);
      if (error) throw error;
      const rows = (data ?? []) as Row[];
      counts.checked += rows.length;

      const now = new Date();
      const due = rows.filter((r) => isDue(r, now));
      counts.due += due.length;

      // One query for the owners whose trial is over: do they have a bot plan?
      const expired = [...new Set(due.filter((r) => new Date(r.trial_ends_at) <= now).map((r) => r.user_id))];
      const paid = new Set<string>();
      if (expired.length) {
        const { data: subs, error: subError } = await db.from("product_subscriptions").select("user_id")
          .eq("product", "bot").eq("livemode", livemode).gt("expires_at", now.toISOString()).in("user_id", expired);
        if (subError) throw subError;
        for (const s of subs ?? []) paid.add(s.user_id as string);
      }
      const sendable = due.filter((r) => new Date(r.trial_ends_at) > now || paid.has(r.user_id));
      counts.skipped += due.length - sendable.length;

      let next = 0;
      const worker = async () => {
        while (next < sendable.length) {
          const row = sendable[next++];
          const category = botCategory(row.category) ?? "mixed";
          let pool = pools.get(category);
          if (!pool) { pool = await loadPool(category); pools.set(category, pool); }
          const result = await sendWebhook(row.platform, row.webhook_url, questionFor(row.id, row.sent_count, pool));
          const patch = result.ok
            ? { sent_count: row.sent_count + 1, last_sent_at: new Date().toISOString(), last_error: null }
            : { last_error: result.error ?? "Send failed." };
          const { error: updateError } = await db.from("bot_channels").update(patch).eq("id", row.id);
          if (updateError) counts.failed++;
          else if (result.ok) counts.sent++;
          else counts.failed++;
        }
      };
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, sendable.length) }, worker));

      if (rows.length < PAGE) break;
    }
    return NextResponse.json(counts, { headers: PRIVATE_HEADERS });
  } catch {
    console.error("bot-send cron failed");
    return NextResponse.json({ error: "bot_send_failed" }, { status: 500, headers: PRIVATE_HEADERS });
  }
}
