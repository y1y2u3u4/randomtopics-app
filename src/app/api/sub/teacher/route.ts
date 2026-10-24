import { warmupFor } from "@/lib/subs/teacher";
import { addDays, gradeBand, isDay } from "@/lib/subs/teacherSchedule";

// Public, cacheable warm-up schedule (the same for everyone). Which dates a
// visitor may plan ahead is a plan feature handled on the page.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const grade = gradeBand(url.searchParams.get("grade"));
  const from = url.searchParams.get("from");
  const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 1, 1), 10);
  if (!grade || !isDay(from) || Math.abs(Date.parse(`${from}T00:00:00Z`) - Date.now()) > 400 * 86400000) {
    return Response.json({ error: "Choose a grade and a date." }, { status: 400 });
  }
  const seen = new Set<string>();
  const warmups = [];
  for (let i = 0; warmups.length < days && i < days * 2; i++) {
    const w = warmupFor(addDays(from, i), grade);
    if (seen.has(w.day)) continue;
    seen.add(w.day);
    warmups.push(w);
  }
  return Response.json({ warmups }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
