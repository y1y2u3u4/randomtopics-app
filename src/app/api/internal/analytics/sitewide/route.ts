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
    const result = await syncSitewideReport();
    if (request.headers.get("accept")?.includes("application/json")) return NextResponse.json(result, { headers });
    return NextResponse.redirect(new URL("/internal/analytics?sitewide=success", request.url), { status: 303, headers });
  } catch (error) {
    if (request.headers.get("accept")?.includes("application/json")) {
      const message = error instanceof Error ? error.message : "";
      const code = /^(sitewide_[a-z_]+(?:_\d{3})?|ga4_report_failed_\d{3}|gsc_query_failed_\d{3})$/.test(message) ? message : "sitewide_sync_failed";
      return NextResponse.json({ error: code }, { status: 503, headers });
    }
    return NextResponse.redirect(new URL("/internal/analytics?sitewide=failed", request.url), { status: 303, headers });
  }
}
