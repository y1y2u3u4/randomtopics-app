import type { NextRequest } from "next/server";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";
import { qotdTally, validQotdVote } from "@/lib/qotd/vote";

// Anonymous "today's answers" for the question of the day. Stores keyed
// hashes only (browser id, IP); counts are public and cached briefly.
function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { client: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }), key } : null;
}
const hash = (key: string, value: string) => createHmac("sha256", key).update(`qotd-v1:${value}`).digest("hex");
const json = (body: unknown, status = 200, cache = "private, no-store") =>
  Response.json(body, { status, headers: { "Cache-Control": cache, "X-Robots-Tag": "noindex, nofollow" } });

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const vote = validQotdVote(params.get("day"), Number(params.get("q")), 0);
  if (!vote) return json({ error: "Unknown question." }, 400);
  const store = db();
  if (!store) return json({ error: "Results are not available." }, 503);
  const { data, error } = await store.client.rpc("qotd_counts", { p_day: vote.day, p_question: vote.question });
  if (error) return json({ error: "Results are not available." }, 503);
  return json({ counts: qotdTally(data) }, 200, "public, s-maxage=30, stale-while-revalidate=60");
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "qotd-vote", { limit: 20, windowSeconds: 600 });
  if (limited) return limited;
  const body = await request.json().catch(() => null) as { day?: unknown; q?: unknown; choice?: unknown; voter?: unknown } | null;
  const vote = validQotdVote(body?.day, body?.q, body?.choice);
  if (!vote || typeof body?.voter !== "string" || !/^[a-f0-9-]{16,64}$/i.test(body.voter)) return json({ error: "That answer could not be counted." }, 400);
  const store = db();
  if (!store) return json({ error: "Results are not available." }, 503);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const { data, error } = await store.client.rpc("cast_qotd_vote", {
    p_day: vote.day, p_question: vote.question, p_choice: vote.choice,
    p_voter: hash(store.key, body.voter), p_ip: hash(store.key, `${vote.day}:${ip}`),
  });
  if (error) return json({ error: "Results are not available." }, 503);
  return json({ counts: qotdTally(data) });
}
