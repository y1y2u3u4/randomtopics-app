import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/speech/server";
import { ALERT_WINDOW_MINUTES, alertText, speechAlert } from "@/lib/speech/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

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

async function count(statuses: string[], since: string): Promise<number> {
  const { count: n, error } = await database().from("speech_attempts")
    .select("id", { count: "exact", head: true })
    .in("status", statuses).gte("created_at", since);
  if (error) throw error;
  return n ?? 0;
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json({ error: "cron_not_configured" }, { status: 503, headers: PRIVATE_HEADERS });
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: PRIVATE_HEADERS });
  }
  try {
    const now = new Date();
    const since = new Date(now.getTime() - ALERT_WINDOW_MINUTES * 60_000).toISOString();
    const health = { failed: await count(["failed"], since), ok: await count(["complete", "transcribed"], since) };
    const alert = speechAlert(health);
    let notified = false;
    if (alert) {
      const text = alertText(health, now);
      // Shows up in Vercel runtime logs; optional Slack/Discord-compatible webhook if configured.
      console.error(text);
      const webhook = process.env.SPEECH_ALERT_WEBHOOK?.trim();
      if (webhook?.startsWith("https://")) {
        notified = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, content: text }),
          redirect: "manual",
          signal: AbortSignal.timeout(8000),
        }).then((res) => res.ok, () => false);
      }
    }
    return NextResponse.json({ ...health, alert, notified }, { headers: PRIVATE_HEADERS });
  } catch {
    console.error("[speech-alert] speech-health cron failed");
    return NextResponse.json({ error: "speech_health_failed" }, { status: 500, headers: PRIVATE_HEADERS });
  }
}
