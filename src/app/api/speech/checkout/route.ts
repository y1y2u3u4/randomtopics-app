import { actor, failure, response, SpeechError } from "@/lib/speech/server";
import { siteUrl, stripe } from "@/lib/speech/billing";
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    if (user.is_anonymous || !user.email_confirmed_at || !user.email)
      throw new SpeechError(
        401,
        "Verify your email before subscribing so you can recover your purchases.",
      );
    const api = stripe();
    const price = await api.prices.retrieve(
      process.env.SPEECH_STRIPE_PRICE_ID!,
    );
    if (
      !price.active ||
      price.currency !== "usd" ||
      price.unit_amount !== 1200 ||
      price.recurring?.interval !== "month" ||
      price.recurring.interval_count !== 1
    )
      throw new SpeechError(503, "Subscriptions are not configured correctly.");
    await db
      .from("speech_accounts")
      .upsert(
        { user_id: user.id },
        { onConflict: "user_id", ignoreDuplicates: true },
      );
    const account = await db
      .from("speech_accounts")
      .select("customer_id,subscription_id,subscription_active,period_end")
      .eq("user_id", user.id)
      .single();
    if (account.error) throw account.error;
    if (
      account.data.subscription_active &&
      new Date(account.data.period_end).getTime() > Date.now()
    )
      throw new SpeechError(
        409,
        "You already have a subscription. Use Manage subscription.",
      );
    // One customer per account, even for concurrent checkout requests.
    const customer =
      account.data.customer_id ||
      (
        await api.customers.create(
          {
            email: user.email,
            metadata: { product: "randomtopics_speech", user_id: user.id },
          },
          { idempotencyKey: `randomtopics-customer-${user.id}` },
        )
      ).id;
    const saved = await db
      .from("speech_accounts")
      .update({ customer_id: customer })
      .eq("user_id", user.id);
    if (saved.error) throw saved.error;
    const subscriptions = await api.subscriptions.list({
      customer,
      status: "all",
      limit: 100,
    });
    if (
      subscriptions.data.some(
        (s) =>
          s.metadata.product === "randomtopics_speech" &&
          !["canceled", "incomplete_expired"].includes(s.status),
      )
    )
      throw new SpeechError(
        409,
        "A subscription already exists. Use Manage subscription to review it.",
      );
    const openSessions = await api.checkout.sessions.list({
      customer,
      status: "open",
      limit: 100,
    });
    const existing = openSessions.data.find(
      (s) => s.client_reference_id === user.id && s.mode === "subscription",
    );
    if (existing?.url) return response({ url: existing.url });
    const session = await api.checkout.sessions.create(
      {
        customer,
        mode: "subscription",
        line_items: [{ price: price.id, quantity: 1 }],
        client_reference_id: user.id,
        subscription_data: {
          metadata: { product: "randomtopics_speech", user_id: user.id },
        },
        success_url: `${siteUrl()}/speech/account?payment=return`,
        cancel_url: `${siteUrl()}/speech/account`,
        allow_promotion_codes: false,
      },
      {
        idempotencyKey: `randomtopics-checkout-${user.id}-${Math.floor(Date.now() / 1800000)}`,
      },
    );
    return response({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
