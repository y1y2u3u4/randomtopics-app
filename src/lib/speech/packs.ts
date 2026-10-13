import "server-only";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";

// One-time speech feedback packs (replace the $12/month offer for new users).
// Priced inline with price_data so no Stripe catalogue change is needed; every
// grant is verified against the paid Checkout session before credits are added.

export const PACK_PRODUCT = "randomtopics_speech_pack";
export const PACKS = {
  5: { credits: 5, amount: 299, name: "RandomTopics Speech Feedback · 5 rounds" },
  20: { credits: 20, amount: 699, name: "RandomTopics Speech Feedback · 20 rounds" },
} as const;
export type PackSize = keyof typeof PACKS;

export function packSize(value: unknown): PackSize | null {
  const n = Number(value);
  return n === 5 || n === 20 ? n : null;
}

export function packLineItem(pack: PackSize): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: PACKS[pack].amount,
      product_data: { name: PACKS[pack].name, metadata: { product: PACK_PRODUCT, pack: String(pack) } },
    },
  };
}

/** True only for a paid, unmodified pack session that belongs to this user. */
export function verifiedPack(session: Stripe.Checkout.Session, userId: string, livemode: boolean): PackSize | null {
  const pack = packSize(session.metadata?.pack);
  if (!pack) return null;
  if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") return null;
  if (session.metadata?.product !== PACK_PRODUCT || session.metadata?.user_id !== userId || session.client_reference_id !== userId) return null;
  if (session.livemode !== livemode) return null;
  // Check the USD price itself: with adaptive pricing amount_total may be in the buyer's currency.
  const items = session.line_items?.data ?? [];
  if (items.length !== 1 || items[0].quantity !== 1) return null;
  const price = items[0].price;
  if (!price || price.currency !== "usd" || price.unit_amount !== PACKS[pack].amount) return null;
  return pack;
}

export async function grantPack(db: SupabaseClient, session: Stripe.Checkout.Session, userId: string, pack: PackSize): Promise<boolean> {
  const { data, error } = await db.rpc("grant_speech_pack", {
    p_session: session.id, p_user: userId, p_pack: pack, p_credits: PACKS[pack].credits,
    p_amount: PACKS[pack].amount, p_livemode: session.livemode,
  });
  if (error) throw error;
  return data === true;
}

/**
 * Grant every paid pack session of this customer that has not been granted yet
 * (covers buyers who closed the tab before returning). Returns the newly granted packs.
 */
export async function reconcilePacks(api: Stripe, db: SupabaseClient, customer: string, userId: string, livemode: boolean, sessionId?: string): Promise<PackSize[]> {
  const sessions: Stripe.Checkout.Session[] = [];
  if (sessionId && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    sessions.push(await api.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] }));
  }
  const listed = await api.checkout.sessions.list({ customer, status: "complete", limit: 20, expand: ["data.line_items"] });
  for (const s of listed.data) if (!sessions.some((x) => x.id === s.id)) sessions.push(s);
  const granted: PackSize[] = [];
  for (const s of sessions) {
    if (typeof s.customer === "string" && s.customer !== customer) continue;
    const pack = verifiedPack(s, userId, livemode);
    if (pack && (await grantPack(db, s, userId, pack))) granted.push(pack);
  }
  return granted;
}

export async function packCredits(db: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await db.from("speech_pack_grants").select("credits").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).reduce((n, r) => n + (r.credits as number), 0);
}
