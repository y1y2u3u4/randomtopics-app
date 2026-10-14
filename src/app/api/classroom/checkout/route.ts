import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { actor, failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { siteUrl, stripe, verifySpeechCustomer, SPEECH_PRODUCT } from "@/lib/speech/billing";
import { classroomPurchase, ownedPacks } from "@/lib/classroom/catalog";
import { classroomLineItem, classroomPurchases, CLASSROOM_PRODUCT } from "@/lib/classroom/purchases";

// One-time classroom pack checkout. Guests may buy: Stripe collects the email
// and a sign-in link to the downloads follows payment (see /api/classroom/purchases).
export async function POST(request: Request) {
  try {
    const limited = rateLimit(request as NextRequest, "classroom-checkout", { limit: 8, windowSeconds: 600 });
    if (limited) return limited;
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { pack?: unknown };
    const purchase = classroomPurchase(body.pack);
    if (!purchase) throw new SpeechError(400, "Choose a classroom pack.");
    const bought = await classroomPurchases(db, user.id);
    if (bought.includes("all") || (purchase !== "all" && ownedPacks(bought).includes(purchase)))
      throw new SpeechError(409, "You already own this pack. Open your downloads.");
    const api = stripe();
    const created = await db.from("speech_accounts").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
    if (created.error) throw created.error;
    const account = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).single();
    if (account.error) throw account.error;
    const verifiedEmail = !user.is_anonymous && user.email_confirmed_at && user.email ? user.email : undefined;
    // One Stripe customer per account, shared with speech feedback purchases.
    const customer = account.data.customer_id || (await api.customers.create(
      { ...(verifiedEmail ? { email: verifiedEmail } : {}), metadata: { product: SPEECH_PRODUCT, user_id: user.id } },
      { idempotencyKey: `randomtopics-customer-${user.id}` },
    )).id;
    await verifySpeechCustomer(api, customer, user.id);
    const saved = await db.from("speech_accounts").update({ customer_id: customer }).eq("user_id", user.id);
    if (saved.error) throw saved.error;
    const open = await api.checkout.sessions.list({ customer, status: "open", limit: 100 });
    const reuse = open.data.find((s) => s.client_reference_id === user.id && s.mode === "payment" && s.metadata?.product === CLASSROOM_PRODUCT && s.metadata?.pack === purchase);
    if (reuse?.url) return response({ url: reuse.url });
    const meta = { product: CLASSROOM_PRODUCT, user_id: user.id, pack: purchase };
    const session = await api.checkout.sessions.create(
      {
        customer,
        mode: "payment",
        line_items: [classroomLineItem(purchase)],
        client_reference_id: user.id,
        metadata: meta,
        payment_intent_data: { metadata: meta },
        success_url: `${siteUrl()}/account?classroom_session={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl()}/classroom-packs`,
        allow_promotion_codes: false,
      },
      { idempotencyKey: `randomtopics-classroom-v1-${user.id}-${purchase}-${Math.floor(Date.now() / 1800000)}` },
    );
    if (!session.url) throw new SpeechError(503, "Checkout is temporarily unavailable. Please try again.");
    return response({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
