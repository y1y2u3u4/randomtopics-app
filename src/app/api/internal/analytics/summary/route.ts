import { NextRequest, NextResponse } from "next/server";
import { hasAnalyticsSession } from "@/lib/analyticsAuth";
import { getAnalyticsDashboardData } from "@/lib/googleReporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await hasAnalyticsSession())) {
    return NextResponse.json(
      { error: "unauthorized" },
      {
        status: 401,
        headers: {
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    );
  }

  try {
    const forceRefresh = request.nextUrl.searchParams.get("refresh") === "1";
    const data = await getAnalyticsDashboardData(forceRefresh);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "reporting_unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    );
  }
}
