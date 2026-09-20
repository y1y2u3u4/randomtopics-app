import { hasAnalyticsSession } from "@/lib/analyticsAuth";
import { checkoutConversionReport } from "@/lib/speech/purchases";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
export async function GET(request: Request) {
  if (!(await hasAnalyticsSession())) return Response.json({ error: "unauthorized" }, { status: 401, headers });
  try {
    const days = Number(new URL(request.url).searchParams.get("days") || "1");
    return Response.json(await checkoutConversionReport(days), { headers });
  } catch {
    return Response.json({ error: "payment_reporting_unavailable" }, { status: 503, headers });
  }
}
