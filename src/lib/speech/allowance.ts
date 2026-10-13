import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { returnTrialState } from "./returnTrial";

// Match reserve_speech_attempt_v7, including soft-deleted and in-flight attempts.
export async function speechAllowance(db: SupabaseClient, userId: string) {
  const { data: account, error } = await db.from("speech_accounts")
    .select("subscription_active,period_start,period_end,return_trial_at").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  const now = Date.now();
  const paid = Boolean(account?.subscription_active && new Date(account.period_start).getTime() <= now &&
    new Date(account.period_end).getTime() > now);
  let query = db.from("speech_attempts").select("id", { count: "exact", head: true })
    .eq("user_id", userId).neq("status", "failed");
  if (paid) query = query.gte("created_at", account!.period_start);
  const { count, error: countError } = await query;
  if (countError || count === null) throw countError ?? new Error("allowance_unavailable");
  const returnTrial = returnTrialState(account?.return_trial_at, count, paid, now);
  // Purchased one-time pack rounds add to the free allowance (not to a subscription).
  let packs = 0;
  if (!paid) {
    const { data: grants, error: packError } = await db.from("speech_pack_grants").select("credits").eq("user_id", userId);
    if (packError) throw packError;
    packs = (grants ?? []).reduce((n, g) => n + (g.credits as number), 0);
  }
  // Same rule as the SQL: the return-trial round counts once its time has come.
  const returnOpen = Boolean(returnTrial && Date.parse(returnTrial.availableAt) <= now);
  const free = paid ? 40 : returnOpen ? 3 : 2;
  const included = free + packs;
  return { included, remaining: Math.max(0, included - count), paid, ...(packs ? { packCredits: packs } : {}), ...(returnTrial ? { returnTrial } : {}) };
}
