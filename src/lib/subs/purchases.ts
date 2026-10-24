import "server-only";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUB_PRODUCTS, SUB_PRODUCT_LIST, subCents, subPlan, subProduct, type SubPlan, type SubProduct } from "./products";

// Five subscription products, priced inline (price_data, USD) like Host Pass.
// Every grant is verified against the paid Checkout session or the live subscription.

export const SUB_META = "randomtopics_sub";
const INTERVAL = { monthly: "month", yearly: "year" } as const;

export function subLineItem(product: SubProduct, plan: SubPlan): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: subCents(product, plan),
      recurring: { interval: INTERVAL[plan] },
      product_data: { name: SUB_PRODUCTS[product].stripeName, metadata: { product: SUB_META, sub: product, plan } },
    },
  };
}

export function matchesSubPrice(price: Stripe.Price | null | undefined, product: SubProduct, plan: SubPlan) {
  if (!price || price.currency !== "usd" || price.unit_amount !== subCents(product, plan)) return false;
  return price.recurring?.interval === INTERVAL[plan] && price.recurring.interval_count === 1;
}

/** Product and plan only for a paid, unmodified session that belongs to this user. */
export function verifiedSubSession(session: Stripe.Checkout.Session, userId: string, livemode: boolean) {
  const product = subProduct(session.metadata?.sub);
  const plan = subPlan(session.metadata?.plan);
  if (!product || !plan) return null;
  if (session.mode !== "subscription" || session.status !== "complete" || session.payment_status !== "paid") return null;
  if (session.metadata?.product !== SUB_META || session.metadata?.user_id !== userId || session.client_reference_id !== userId) return null;
  if (session.livemode !== livemode) return null;
  const items = session.line_items?.data ?? [];
  if (items.length !== 1 || items[0].quantity !== 1 || !matchesSubPrice(items[0].price, product, plan)) return null;
  return { product, plan };
}

/** Writes a subscription's paid-through date. `fresh`: the row is new; `live`: it grants access now. */
export async function syncSub(db: SupabaseClient, subscription: Stripe.Subscription, userId: string, eventTime: number): Promise<{ fresh: boolean; live: boolean }> {
  const product = subProduct(subscription.metadata?.sub);
  const plan = subPlan(subscription.metadata?.plan);
  if (!product || !plan || subscription.metadata?.product !== SUB_META || subscription.metadata?.user_id !== userId) return { fresh: false, live: false };
  const item = subscription.items.data.find((i) => i.quantity === 1 && matchesSubPrice(i.price, product, plan));
  const live = Boolean(item) && ["active", "trialing", "past_due"].includes(subscription.status);
  const expires = live && item ? new Date(item.current_period_end * 1000) : new Date();
  const { data, error } = await db.rpc("sync_product_subscription", {
    p_subscription: subscription.id, p_user: userId, p_product: product, p_plan: plan, p_amount: subCents(product, plan),
    p_livemode: subscription.livemode, p_expires: expires.toISOString(), p_event: eventTime,
  });
  if (error) throw error;
  return { fresh: data === true, live };
}

export interface SubGrant { product: SubProduct; plan: SubPlan; value: number }

/**
 * Syncs every paid subscription session of this customer. Returns the grants that are new,
 * plus the session the buyer just returned from even when the webhook stored it first
 * (the client fires {product}_purchase once per returned session).
 */
export async function reconcileSubs(api: Stripe, db: SupabaseClient, customer: string, userId: string, livemode: boolean, sessionId?: string) {
  const sessions: Stripe.Checkout.Session[] = [];
  if (sessionId && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    sessions.push(await api.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] }));
  }
  const listed = await api.checkout.sessions.list({ customer, status: "complete", limit: 20, expand: ["data.line_items"] });
  for (const s of listed.data) if (!sessions.some((x) => x.id === s.id)) sessions.push(s);
  const granted: SubGrant[] = [];
  for (const s of sessions) {
    if (typeof s.customer === "string" && s.customer !== customer) continue;
    const verified = verifiedSubSession(s, userId, livemode);
    if (!verified) continue;
    const id = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
    if (!id) continue;
    const subscription = await api.subscriptions.retrieve(id);
    if (subscription.livemode !== s.livemode) continue;
    const synced = await syncSub(db, subscription, userId, Math.floor(Date.now() / 1000) - 1);
    if (synced.live && (synced.fresh || s.id === sessionId)) {
      granted.push({ ...verified, value: subCents(verified.product, verified.plan) / 100 });
    }
  }
  return granted;
}

export type SubAccess = Record<SubProduct, boolean>;

export function noAccess(): SubAccess {
  return Object.fromEntries(SUB_PRODUCT_LIST.map((p) => [p, false])) as SubAccess;
}

/** Active products for one or more users (couples: either partner's plan covers the room). */
export async function subAccess(db: SupabaseClient, userIds: string | string[], livemode: boolean): Promise<SubAccess> {
  const ids = (Array.isArray(userIds) ? userIds : [userIds]).filter(Boolean);
  const access = noAccess();
  if (!ids.length) return access;
  const { data, error } = await db.from("product_subscriptions").select("product")
    .in("user_id", ids).eq("livemode", livemode).gt("expires_at", new Date().toISOString());
  if (error) throw error;
  for (const row of data ?? []) {
    const p = subProduct(row.product);
    if (p) access[p] = true;
  }
  return access;
}
