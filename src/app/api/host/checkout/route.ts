import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { actor, failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { billingConfiguration, siteUrl, stripe, verifySpeechCustomer, SPEECH_PRODUCT } from "@/lib/speech/billing";
import { HOST_PLANS, hostPlan } from "@/lib/host/plans";
import { hostAccess, hostLineItem, HOST_PRODUCT } from "@/lib/host/purchases";

// Host Pass checkout. Guests may buy (anonymous session); Stripe collects the
// email and a sign-in link follows payment (see /api/host/status).
export async function POST(request: Request) {
  try {
    const limited = rateLimit(request as NextRequest, "host-checkout", { limit: 8, windowSeconds: 600 });
    if (limited) return limited;
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { plan?: unknown; returnPath?: unknown };
    const plan = hostPlan(body.plan);
    if (!plan) throw new SpeechError(400, "Choose a Host Pass plan.");
    const returnPath = typeof body.returnPath === "string" && /^\/[a-z0-9/-]{0,80}$/.test(body.returnPath) ? body.returnPath : "/";
    const api = stripe();
    const livemode = billingConfiguration().livemode;
    const access = await hostAccess(db, user.id, livemode);
    if (access.active && access.plan !== "pass30") throw new SpeechError(409, "Your Host Pass subscription is already active.");
    if (access.active && HOST_PLANS[plan].mode === "subscription") throw new SpeechError(409, "Your Host Pass is already active.");
    const created = await db.from("speech_accounts").upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });
    if (created.error) throw created.error;
    const account = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).single();
    if (account.error) throw account.error;
    const verifiedEmail = !user.is_anonymous && user.email_confirmed_at && user.email ? user.email : undefined;
    // One Stripe customer per account, shared with the speech and classroom purchases.
    const customer = account.data.customer_id || (await api.customers.create(
      { ...(verifiedEmail ? { email: verifiedEmail } : {}), metadata: { product: SPEECH_PRODUCT, user_id: user.id } },
      { idempotencyKey: `randomtopics-customer-${user.id}` },
    )).id;
    await verifySpeechCustomer(api, customer, user.id);
    const saved = await db.from("speech_accounts").update({ customer_id: customer }).eq("user_id", user.id);
    if (saved.error) throw saved.error;
    const mode = HOST_PLANS[plan].mode;
    const open = await api.checkout.sessions.list({ customer, status: "open", limit: 100 });
    const reuse = open.data.find((s) => s.client_reference_id === user.id && s.mode === mode && s.metadata?.product === HOST_PRODUCT && s.metadata?.plan === plan && s.success_url?.includes(`host_return=${encodeURIComponent(returnPath)}`));
    if (reuse?.url) return response({ url: reuse.url });
    const meta = { product: HOST_PRODUCT, user_id: user.id, plan };
    const back = `${siteUrl()}${returnPath}`;
    const session = await api.checkout.sessions.create(
      {
        customer,
        mode,
        line_items: [hostLineItem(plan)],
        client_reference_id: user.id,
        metadata: meta,
        ...(mode === "payment" ? { payment_intent_data: { metadata: meta } } : { subscription_data: { metadata: meta } }),
        // Show the approved USD price; no automatic local-currency conversion.
        adaptive_pricing: { enabled: false },
        success_url: `${back}?host_session={CHECKOUT_SESSION_ID}&host_return=${encodeURIComponent(returnPath)}`,
        cancel_url: back,
        allow_promotion_codes: false,
        custom_text: { submit: { message: mode === "payment"
          ? "One payment, no renewal. Host mode (fullscreen, timer, no repeats, no ads) stays on for 30 days on randomtopics.app."
          : "Host mode (fullscreen, timer, no repeats, no ads) on randomtopics.app. Cancel any time from your account page." } },
      },
      { idempotencyKey: `randomtopics-host-v1-${user.id}-${plan}-${returnPath}-${Math.floor(Date.now() / 1800000)}` },
    );
    if (!session.url) throw new SpeechError(503, "Checkout is temporarily unavailable. Please try again.");
    return response({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
