import "server-only";
import type Stripe from "stripe";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { SPEECH_PRODUCT } from "./billing";

// Guests can subscribe without an email; Stripe Checkout collects one. After
// the buyer signs in with that email (proving they own it), their guest
// purchase and practice move to the signed-in account. Only purchases owned by
// an anonymous account can move, so a verified account's plan is never taken.

const stripeEmail = (email: string) => email.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

export interface ClaimResult { claimed: number }

export async function claimGuestPurchases(api: Stripe, db: SupabaseClient, user: User): Promise<ClaimResult> {
  if (user.is_anonymous || !user.email_confirmed_at || !user.email) return { claimed: 0 };
  const email = user.email.toLowerCase();
  const found = await api.customers.search({
    query: `email:'${stripeEmail(email)}' AND metadata['product']:'${SPEECH_PRODUCT}'`,
    limit: 10,
  });
  const { data: mine, error: mineError } = await db
    .from("speech_accounts").select("customer_id,subscription_active,period_end").eq("user_id", user.id).maybeSingle();
  if (mineError) throw mineError;
  const alreadyPaid = Boolean(mine?.subscription_active && mine.period_end && new Date(mine.period_end).getTime() > Date.now());
  let claimed = 0;
  for (const customer of found.data) {
    if (customer.deleted || (customer.email ?? "").toLowerCase() !== email) continue;
    const owner = customer.metadata.user_id;
    if (!owner) continue;
    if (owner !== user.id) {
      const { data: previous } = await db.auth.admin.getUserById(owner);
      // Never move a plan away from a real (non-guest) account.
      if (previous?.user && !previous.user.is_anonymous) continue;
    }
    if (owner === user.id && mine?.customer_id === customer.id) continue; // already linked
    if (alreadyPaid && mine?.customer_id && mine.customer_id !== customer.id) continue; // keep one plan per account
    const subs = await api.subscriptions.list({ customer: customer.id, status: "all", limit: 20 });
    const sub = subs.data.find((s) => s.metadata.product === SPEECH_PRODUCT && !["canceled", "incomplete_expired"].includes(s.status));
    if (!sub) {
      // Pack-only guest: move the pack rounds, practice and Stripe ownership.
      if (owner === user.id) continue;
      const { count } = await db.from("speech_pack_grants").select("session_id", { count: "exact", head: true }).eq("user_id", owner);
      if (!count) continue;
      await api.customers.update(customer.id, { metadata: { ...customer.metadata, user_id: user.id, claimed_from: owner } });
      const freed = await db.from("speech_accounts").update({ customer_id: null }).eq("user_id", owner);
      if (freed.error) throw freed.error;
      if (!mine?.customer_id) {
        const linked = await db.from("speech_accounts").upsert({ user_id: user.id, customer_id: customer.id }, { onConflict: "user_id" });
        if (linked.error) throw linked.error;
      }
      await db.from("speech_attempts").update({ user_id: user.id }).eq("user_id", owner);
      const packsMoved = await db.from("speech_pack_grants").update({ user_id: user.id }).eq("user_id", owner);
      if (packsMoved.error) throw packsMoved.error;
      claimed++;
      break;
    }

    // Stripe first: later webhooks then target the new owner.
    if (owner !== user.id) {
      await api.customers.update(customer.id, { metadata: { ...customer.metadata, user_id: user.id, claimed_from: owner } });
      await api.subscriptions.update(sub.id, { metadata: { ...sub.metadata, user_id: user.id } });
    }
    const { data: guestRow } = await db
      .from("speech_accounts").select("subscription_id,subscription_active,period_start,period_end,billing_event_time")
      .eq("user_id", owner).maybeSingle();
    // customer_id and subscription_id are unique: free them on the guest row first.
    if (owner !== user.id) {
      const cleared = await db.from("speech_accounts")
        .update({ customer_id: null, subscription_id: null, subscription_active: false })
        .eq("user_id", owner);
      if (cleared.error) throw cleared.error;
    }
    const moved = await db.from("speech_accounts").upsert({
      user_id: user.id,
      customer_id: customer.id,
      subscription_id: sub.id,
      subscription_active: guestRow?.subscription_active ?? sub.status === "active",
      period_start: guestRow?.period_start ?? null,
      period_end: guestRow?.period_end ?? null,
      billing_event_time: guestRow?.billing_event_time ?? 0,
    }, { onConflict: "user_id" });
    if (moved.error) throw moved.error;
    if (owner !== user.id) {
      // Bring the guest's saved practice and pack rounds along.
      await db.from("speech_attempts").update({ user_id: user.id }).eq("user_id", owner);
      const packsMoved = await db.from("speech_pack_grants").update({ user_id: user.id }).eq("user_id", owner);
      if (packsMoved.error) throw packsMoved.error;
    }
    claimed++;
    break;
  }
  return { claimed };
}

/** Email a sign-in link so a guest buyer can keep their plan on any device. */
export async function sendGuestRecoveryLink(db: SupabaseClient, email: string, origin: string) {
  const { error } = await db.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${origin}/speech/account?claim=1` },
  });
  if (error) throw error;
}
