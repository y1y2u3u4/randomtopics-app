import { NextRequest, NextResponse } from "next/server";
import { probeReportingAccess } from "@/lib/googleReporting";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, "analytics-health", {
    limit: 12,
    windowSeconds: 60,
  });
  if (limited) return limited;

  const result = await probeReportingAccess();
  const ok = result.ga4.ok && result.searchConsole.ok;
  return NextResponse.json(result, {
    status: ok ? 200 : 503,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
