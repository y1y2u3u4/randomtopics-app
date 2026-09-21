import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Match reserve_speech_attempt, including soft-deleted and in-flight attempts.
export async function speechAllowance(db: SupabaseClient, userId: string) {
  const { data: account, error } = await db.from("speech_accounts")
    .select("subscription_active,period_start,period_end").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  const now = Date.now();
  const paid = Boolean(account?.subscription_active && new Date(account.period_start).getTime() <= now &&
    new Date(account.period_end).getTime() > now);
  let query = db.from("speech_attempts").select("id", { count: "exact", head: true })
    .eq("user_id", userId).neq("status", "failed");
  if (paid) query = query.gte("created_at", account!.period_start);
  const { count, error: countError } = await query;
  if (countError || count === null) throw countError ?? new Error("allowance_unavailable");
  const included = paid ? 40 : 2;
  return { included, remaining: Math.max(0, included - count), paid };
}
