import { NextRequest, NextResponse } from "next/server";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analyticsAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/internal/analytics", request.url),
    303
  );
  response.cookies.set(ANALYTICS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
