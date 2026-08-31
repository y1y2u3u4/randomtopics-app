import { NextRequest, NextResponse } from "next/server";
import {
  ANALYTICS_SESSION_COOKIE,
  ANALYTICS_SESSION_MAX_AGE,
  createAnalyticsSession,
  isAnalyticsAuthConfigured,
  verifyDashboardSecret,
} from "@/lib/analyticsAuth";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "analytics-login", {
    limit: 8,
    windowSeconds: 15 * 60,
  });
  if (limited) return limited;

  const destination = new URL("/internal/analytics", request.url);
  if (!isAnalyticsAuthConfigured()) {
    destination.searchParams.set("error", "configuration");
    return NextResponse.redirect(destination, 303);
  }

  const form = await request.formData();
  const secret = String(form.get("secret") ?? "");
  if (!verifyDashboardSecret(secret)) {
    destination.searchParams.set("error", "invalid");
    return NextResponse.redirect(destination, 303);
  }

  const response = NextResponse.redirect(destination, 303);
  response.cookies.set(ANALYTICS_SESSION_COOKIE, createAnalyticsSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ANALYTICS_SESSION_MAX_AGE,
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
