import { NextRequest, NextResponse } from "next/server";
import { hasAnalyticsSession } from "@/lib/analyticsAuth";
import { syncSitewideReport } from "@/lib/sitewideReporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };

export async function POST(request: NextRequest) {
  if (!(await hasAnalyticsSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers });
  if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({ error: "invalid_origin" }, { status: 403, headers });
  try {
    await syncSitewideReport();
    return NextResponse.redirect(new URL("/internal/analytics?sitewide=success", request.url), { status: 303, headers });
  } catch {
    return NextResponse.redirect(new URL("/internal/analytics?sitewide=failed", request.url), { status: 303, headers });
  }
}
