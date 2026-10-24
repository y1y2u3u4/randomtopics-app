import "server-only";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { HOST_PLANS, hostPlan, type HostPlan } from "./plans";

// Host Pass purchases. Priced inline (price_data, USD) like the classroom packs;
// every grant is verified against the paid Checkout session or the live
// subscription first.

export const HOST_PRODUCT = "randomtopics_host_pass";

export function hostLineItem(plan: HostPlan): Stripe.Checkout.SessionCreateParams.LineItem {
  const p = HOST_PLANS[plan];
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: p.cents,
      ...("interval" in p ? { recurring: { interval: p.interval } } : {}),
      product_data: { name: p.name, metadata: { product: HOST_PRODUCT, plan } },
    },
  };
}

function matchesPlanPrice(price: Stripe.Price | null | undefined, plan: HostPlan) {
  const p = HOST_PLANS[plan];
  if (!price || price.currency !== "usd" || price.unit_amount !== p.cents) return false;
  return "interval" in p ? price.recurring?.interval === p.interval && price.recurring.interval_count === 1 : !price.recurring;
}

/** The plan only for a paid, unmodified Host Pass session that belongs to this user. */
export function verifiedHostSession(session: Stripe.Checkout.Session, userId: string, livemode: boolean): HostPlan | null {
  const plan = hostPlan(session.metadata?.plan);
  if (!plan) return null;
  if (session.mode !== HOST_PLANS[plan].mode || session.status !== "complete" || session.payment_status !== "paid") return null;
  if (session.metadata?.product !== HOST_PRODUCT || session.metadata?.user_id !== userId || session.client_reference_id !== userId) return null;
  if (session.livemode !== livemode) return null;
  // Check the USD price itself: amount_total could be in another currency.
  const items = session.line_items?.data ?? [];
  if (items.length !== 1 || items[0].quantity !== 1 || !matchesPlanPrice(items[0].price, plan)) return null;
  return plan;
}

/** Writes a subscription's paid-through date. Returns true when it is new. */
export async function syncHostSubscription(db: SupabaseClient, subscription: Stripe.Subscription, userId: string, eventTime: number): Promise<boolean> {
  const plan = hostPlan(subscription.metadata?.plan);
  if (!plan || subscription.metadata?.product !== HOST_PRODUCT || subscription.metadata?.user_id !== userId) return false;
  const item = subscription.items.data.find((i) => i.quantity === 1 && matchesPlanPrice(i.price, plan));
  const live = Boolean(item) && ["active", "trialing", "past_due"].includes(subscription.status);
  // Canceled at period end still runs to the end of the paid period; a deleted
  // or unpaid subscription ends now.
  const expires = live && item ? new Date(item.current_period_end * 1000) : new Date();
  const { data, error } = await db.rpc("sync_host_subscription", {
    p_subscription: subscription.id, p_user: userId, p_plan: plan, p_amount: HOST_PLANS[plan].cents,
    p_livemode: subscription.livemode, p_expires: expires.toISOString(), p_event: eventTime,
  });
  if (error) throw error;
  return data === true && live;
}

async function grantHostSession(api: Stripe, db: SupabaseClient, session: Stripe.Checkout.Session, userId: string, plan: HostPlan): Promise<boolean> {
  if (plan === "pass30") {
    const { data, error } = await db.rpc("grant_host_pass", {
      p_session: session.id, p_user: userId, p_amount: HOST_PLANS.pass30.cents, p_livemode: session.livemode,
    });
    if (error) throw error;
    return data === true;
  }
  const id = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  if (!id) return false;
  const subscription = await api.subscriptions.retrieve(id);
  if (subscription.livemode !== session.livemode) return false;
  return syncHostSubscription(db, subscription, userId, Math.floor(Date.now() / 1000) - 1);
}

/** Grants every paid Host Pass session of this customer not granted yet. Returns the new grants. */
export async function reconcileHost(api: Stripe, db: SupabaseClient, customer: string, userId: string, livemode: boolean, sessionId?: string) {
  const sessions: Stripe.Checkout.Session[] = [];
  if (sessionId && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    sessions.push(await api.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] }));
  }
  const listed = await api.checkout.sessions.list({ customer, status: "complete", limit: 20, expand: ["data.line_items"] });
  for (const s of listed.data) if (!sessions.some((x) => x.id === s.id)) sessions.push(s);
  const granted: HostPlan[] = [];
  for (const s of sessions) {
    if (typeof s.customer === "string" && s.customer !== customer) continue;
    const plan = verifiedHostSession(s, userId, livemode);
    if (plan && (await grantHostSession(api, db, s, userId, plan))) granted.push(plan);
  }
  return granted;
}

export async function hostAccess(db: SupabaseClient, userId: string, livemode: boolean) {
  const { data, error } = await db.from("host_passes").select("plan,expires_at")
    .eq("user_id", userId).eq("livemode", livemode).gt("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: false }).limit(1);
  if (error) throw error;
  const row = data?.[0];
  return { active: Boolean(row), plan: (row?.plan as HostPlan | undefined) ?? null, expiresAt: (row?.expires_at as string | undefined) ?? null };
}
