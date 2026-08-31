import { verify } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsDashboardData } from "@/lib/googleReporting";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXPORT_PATH = "/api/internal/report-export";
const MAX_CLOCK_SKEW_SECONDS = 90;
const TEMPORARY_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAB0iIeyeqMLy9teNCvYFZ71qTeMLim7aich2E8qw2Cgk=
-----END PUBLIC KEY-----`;

function unauthorized() {
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

export async function GET(request: NextRequest) {
  const timestamp = request.headers.get("x-rt-timestamp") ?? "";
  const nonce = request.headers.get("x-rt-nonce") ?? "";
  const signature = request.headers.get("x-rt-signature") ?? "";
  const timestampSeconds = Number(timestamp);

  if (
    !/^\d{10}$/.test(timestamp) ||
    !/^[a-f0-9]{32}$/.test(nonce) ||
    !Number.isFinite(timestampSeconds) ||
    Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) >
      MAX_CLOCK_SKEW_SECONDS
  ) {
    return unauthorized();
  }

  const message = `GET\n${EXPORT_PATH}\n${timestamp}\n${nonce}`;
  let valid = false;
  try {
    valid = verify(
      null,
      Buffer.from(message),
      TEMPORARY_PUBLIC_KEY,
      Buffer.from(signature, "base64url")
    );
  } catch {
    valid = false;
  }
  if (!valid) return unauthorized();

  try {
    const data = await getAnalyticsDashboardData(true);
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
