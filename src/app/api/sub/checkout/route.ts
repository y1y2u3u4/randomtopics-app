import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { actor, failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { billingConfiguration, siteUrl, stripe, verifySpeechCustomer, SPEECH_PRODUCT } from "@/lib/speech/billing";
import { SUB_PRODUCTS, subPlan, subProduct } from "@/lib/subs/products";
import { subAccess, subLineItem, SUB_META } from "@/lib/subs/purchases";

// Checkout for the five subscription products. Guests may buy (anonymous
// session); Stripe collects the email and a sign-in link follows payment.
export async function POST(request: Request) {
  try {
    const limited = rateLimit(request as NextRequest, "sub-checkout", { limit: 8, windowSeconds: 600 });
    if (limited) return limited;
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { product?: unknown; plan?: unknown; returnPath?: unknown };
    const product = subProduct(body.product);
    const plan = subPlan(body.plan);
    if (!product || !plan) throw new SpeechError(400, "Choose a plan.");
    const returnPath = typeof body.returnPath === "string" && /^\/[a-z0-9/-]{0,80}$/.test(body.returnPath) ? body.returnPath : SUB_PRODUCTS[product].landing;
    const api = stripe();
    const livemode = billingConfiguration().livemode;
    if ((await subAccess(db, user.id, livemode))[product]) throw new SpeechError(409, "Your plan is already active.");
    const created = await db.from("speech_accounts").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
    if (created.error) throw created.error;
    const account = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).single();
    if (account.error) throw account.error;
    const verifiedEmail = !user.is_anonymous && user.email_confirmed_at && user.email ? user.email : undefined;
    // One Stripe customer per account, shared with the other RandomTopics purchases.
    const customer = account.data.customer_id || (await api.customers.create(
      { ...(verifiedEmail ? { email: verifiedEmail } : {}), metadata: { product: SPEECH_PRODUCT, user_id: user.id } },
      { idempotencyKey: `randomtopics-customer-${user.id}` },
    )).id;
    await verifySpeechCustomer(api, customer, user.id);
    const saved = await db.from("speech_accounts").update({ customer_id: customer }).eq("user_id", user.id);
    if (saved.error) throw saved.error;
    const open = await api.checkout.sessions.list({ customer, status: "open", limit: 100 });
    const reuse = open.data.find((s) => s.client_reference_id === user.id && s.metadata?.product === SUB_META && s.metadata?.sub === product && s.metadata?.plan === plan && s.success_url?.startsWith(`${siteUrl()}${returnPath}?`));
    if (reuse?.url) return response({ url: reuse.url });
    const meta = { product: SUB_META, sub: product, user_id: user.id, plan };
    const back = `${siteUrl()}${returnPath}`;
    const session = await api.checkout.sessions.create(
      {
        customer,
        mode: "subscription",
        line_items: [subLineItem(product, plan)],
        client_reference_id: user.id,
        metadata: meta,
        subscription_data: { metadata: meta },
        // Show the approved USD price; no automatic local-currency conversion.
        adaptive_pricing: { enabled: false },
        success_url: `${back}?sub_session={CHECKOUT_SESSION_ID}`,
        cancel_url: back,
        allow_promotion_codes: false,
        custom_text: { submit: { message: `${SUB_PRODUCTS[product].title} on randomtopics.app. Cancel any time from your account page.` } },
      },
      { idempotencyKey: `randomtopics-sub-v1-${user.id}-${product}-${plan}-${returnPath}-${Math.floor(Date.now() / 1800000)}` },
    );
    if (!session.url) throw new SpeechError(503, "Checkout is temporarily unavailable. Please try again.");
    return response({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
