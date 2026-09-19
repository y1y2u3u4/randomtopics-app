import { database, response } from "@/lib/speech/server";
import { stripe } from "@/lib/speech/billing";
export async function POST(request: Request) {
  try {
    const api = stripe();
    const body = await request.text();
    if (body.length > 1_000_000) return response({ error: "Too large" }, 413);
    let event;
    try {
      event = api.webhooks.constructEvent(
        body,
        request.headers.get("stripe-signature") || "",
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch {
      return response({ error: "Invalid signature" }, 400);
    }
    if (
      ![
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ].includes(event.type)
    )
      return response({ received: true });
    const object = event.data.object as { id: string };
    // Re-read provider state: do not trust an old webhook's plan or metadata snapshot.
    const subscription = await api.subscriptions.retrieve(object.id);
    if (subscription.metadata.product !== "randomtopics_speech")
      return response({ received: true });
    const userId = subscription.metadata.user_id;
    const item = subscription.items.data.find(
      (item) => item.price.id === process.env.SPEECH_STRIPE_PRICE_ID,
    );
    const customer =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
    const db = database();
    const { data: owner, error: ownerError } = await db
      .from("speech_accounts")
      .select("user_id,billing_event_time")
      .eq("user_id", userId)
      .eq("customer_id", customer)
      .single();
    if (ownerError || !owner)
      return response({ error: "Account not ready" }, 503);
    const { error } = await db
      .from("speech_accounts")
      .update({
        subscription_id: subscription.id,
        subscription_active: Boolean(item && subscription.status === "active"),
        period_start: item
          ? new Date(item.current_period_start * 1000).toISOString()
          : null,
        period_end: item
          ? new Date(item.current_period_end * 1000).toISOString()
          : null,
        billing_event_time: event.created,
      })
      .eq("user_id", userId)
      .eq("customer_id", customer)
      .lte("billing_event_time", event.created);
    if (error) return response({ error: "Please retry" }, 503);
    return response({ received: true });
  } catch {
    return response({ error: "Please retry" }, 503);
  }
}
