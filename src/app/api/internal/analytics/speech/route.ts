import { hasAnalyticsSession } from "@/lib/analyticsAuth";
import { getSpeechReport } from "@/lib/googleReporting";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
export async function GET(request: Request) {
  if (!(await hasAnalyticsSession())) return Response.json({ error: "unauthorized" }, { status: 401, headers });
  const query = new URL(request.url).searchParams;
  try {
    return Response.json(await getSpeechReport(query.get("days") === "28" ? 28 : 7, query.get("refresh") === "1"), { headers });
  } catch {
    return Response.json({ error: "speech_reporting_unavailable" }, { status: 503, headers });
  }
}
