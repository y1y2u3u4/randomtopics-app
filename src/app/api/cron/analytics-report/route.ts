import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  analyticsSheetErrorCode,
  syncAnalyticsReportToSheet,
} from "@/lib/analyticsSheet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") ?? "";
  if (!secret || secret.length < 32 || authorization.length > 1_024) return false;
  return safeEqual(authorization, `Bearer ${secret}`);
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET?.trim()) {
    return NextResponse.json(
      { error: "cron_not_configured" },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: PRIVATE_HEADERS }
    );
  }

  try {
    const result = await syncAnalyticsReportToSheet();
    return NextResponse.json(result, { headers: PRIVATE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: analyticsSheetErrorCode(error) },
      { status: 503, headers: PRIVATE_HEADERS }
    );
  }
}
