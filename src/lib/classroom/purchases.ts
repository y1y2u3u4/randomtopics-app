import "server-only";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { classroomPrice, classroomPurchase, ownedPacks, CLASSROOM_PACKS, type ClassroomPurchase } from "./catalog";

// One-time classroom pack purchases. Priced inline (price_data) like the speech
// packs; every grant is verified against the paid Checkout session first.

export const CLASSROOM_PRODUCT = "randomtopics_classroom_pack";
/**
 * Private Supabase Storage bucket with the exported files at v1/<pack>.<pptx|pdf>.
 * The repository is public, so the files are never committed: rebuild them with
 * `npm run classroom:build` and upload private/classroom/* to this bucket.
 */
export const CLASSROOM_BUCKET = "classroom-packs";

export function classroomName(purchase: ClassroomPurchase) {
  if (purchase === "all") return "RandomTopics Classroom Packs · All packs (incl. future packs)";
  return `RandomTopics Classroom Pack · ${CLASSROOM_PACKS.find((p) => p.id === purchase)!.title}`;
}

export function classroomLineItem(purchase: ClassroomPurchase): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: classroomPrice(purchase).cents,
      product_data: { name: classroomName(purchase), metadata: { product: CLASSROOM_PRODUCT, pack: purchase } },
    },
  };
}

/** The pack only for a paid, unmodified classroom session that belongs to this user. */
export function verifiedClassroom(session: Stripe.Checkout.Session, userId: string, livemode: boolean): ClassroomPurchase | null {
  const purchase = classroomPurchase(session.metadata?.pack);
  if (!purchase) return null;
  if (session.mode !== "payment" || session.status !== "complete" || session.payment_status !== "paid") return null;
  if (session.metadata?.product !== CLASSROOM_PRODUCT || session.metadata?.user_id !== userId || session.client_reference_id !== userId) return null;
  if (session.livemode !== livemode) return null;
  // Check the USD price itself: with adaptive pricing amount_total may be in the buyer's currency.
  const items = session.line_items?.data ?? [];
  if (items.length !== 1 || items[0].quantity !== 1) return null;
  const price = items[0].price;
  if (!price || price.currency !== "usd" || price.unit_amount !== classroomPrice(purchase).cents) return null;
  return purchase;
}

export async function grantClassroom(db: SupabaseClient, session: Stripe.Checkout.Session, userId: string, purchase: ClassroomPurchase): Promise<boolean> {
  const { data, error } = await db.rpc("grant_classroom_pack", {
    p_session: session.id, p_user: userId, p_pack: purchase,
    p_amount: classroomPrice(purchase).cents, p_livemode: session.livemode,
  });
  if (error) throw error;
  return data === true;
}

/** Grants every paid classroom session of this customer not granted yet. Returns the new grants. */
export async function reconcileClassroom(api: Stripe, db: SupabaseClient, customer: string, userId: string, livemode: boolean, sessionId?: string) {
  const sessions: Stripe.Checkout.Session[] = [];
  if (sessionId && /^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) {
    sessions.push(await api.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] }));
  }
  const listed = await api.checkout.sessions.list({ customer, status: "complete", limit: 20, expand: ["data.line_items"] });
  for (const s of listed.data) if (!sessions.some((x) => x.id === s.id)) sessions.push(s);
  const granted: { session: Stripe.Checkout.Session; purchase: ClassroomPurchase }[] = [];
  for (const s of sessions) {
    if (typeof s.customer === "string" && s.customer !== customer) continue;
    const purchase = verifiedClassroom(s, userId, livemode);
    if (purchase && (await grantClassroom(db, s, userId, purchase))) granted.push({ session: s, purchase });
  }
  return granted;
}

export async function classroomPurchases(db: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await db.from("classroom_purchases").select("pack").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.pack as string);
}

export async function classroomAccess(db: SupabaseClient, userId: string) {
  const purchases = await classroomPurchases(db, userId);
  return { purchases, owned: ownedPacks(purchases), all: purchases.includes("all") };
}
