import { database, response } from "@/lib/speech/server";
import {
  billingConfiguration,
  matchesSpeechPrice,
  siteUrl,
  stripe,
  SPEECH_PRODUCT,
} from "@/lib/speech/billing";
import { sendGuestRecoveryLink } from "@/lib/speech/claim";
import { HOST_PRODUCT, syncHostSubscription } from "@/lib/host/purchases";
import { SUB_META, syncSub } from "@/lib/subs/purchases";
export async function POST(request: Request) {
  try {
    const api = stripe(false);
    const config = billingConfiguration();
    const body = await request.text();
    if (body.length > 1_000_000) return response({ error: "Too large" }, 413);
    let event;
    try {
      event = api.webhooks.constructEvent(
        body,
        request.headers.get("stripe-signature") || "",
        config.webhookSecret,
      );
    } catch {
      return response({ error: "Invalid signature" }, 400);
    }
    if (event.livemode !== config.livemode)
      return response({ error: "Wrong billing environment" }, 400);
    if (
      ![
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ].includes(event.type)
    )
      return response({ received: true });
    const object = event.data.object as {
      id: string;
      metadata?: Record<string, string>;
    };
    // Host Pass subscriptions: renewals extend, cancellation/deletion ends access.
    if (object.metadata?.product === HOST_PRODUCT) {
      const subscription = await api.subscriptions.retrieve(object.id);
      if (subscription.metadata.product !== HOST_PRODUCT || subscription.livemode !== config.livemode)
        return response({ received: true });
      const customer = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const db = database();
      const { data: owner, error: ownerError } = await db.from("speech_accounts").select("user_id")
        .eq("user_id", subscription.metadata.user_id).eq("customer_id", customer).maybeSingle();
      if (ownerError || !owner) return response({ error: "Account not ready" }, 503);
      await syncHostSubscription(db, subscription, owner.user_id, event.created);
      return response({ received: true });
    }
    // Subscription products (teacher, bot, journal, couples, wheel): same rules.
    if (object.metadata?.product === SUB_META) {
      const subscription = await api.subscriptions.retrieve(object.id);
      if (subscription.metadata.product !== SUB_META || subscription.livemode !== config.livemode)
        return response({ received: true });
      const customer = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const db = database();
      const { data: owner, error: ownerError } = await db.from("speech_accounts").select("user_id")
        .eq("user_id", subscription.metadata.user_id).eq("customer_id", customer).maybeSingle();
      if (ownerError || !owner) return response({ error: "Account not ready" }, 503);
      await syncSub(db, subscription, owner.user_id, event.created);
      return response({ received: true });
    }
    // Filter the signed snapshot before fetching any other application's objects.
    if (object.metadata?.product !== SPEECH_PRODUCT)
      return response({ received: true });
    // Re-read provider state: do not trust an old webhook's plan or metadata snapshot.
    const subscription = await api.subscriptions.retrieve(object.id);
    if (
      subscription.metadata.product !== SPEECH_PRODUCT ||
      subscription.livemode !== config.livemode
    )
      return response({ received: true });
    const userId = subscription.metadata.user_id;
    const item = subscription.items.data.find(
      (item) => item.quantity === 1 && matchesSpeechPrice(item.price),
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
    // A guest bought without an email: send a sign-in link to the address they
    // gave Stripe so the plan can be kept and recovered. Once per subscription;
    // a failure here never blocks the billing update above.
    if (item && subscription.status === "active" && subscription.metadata.recovery_email !== "sent") {
      try {
        const { data: ownerUser } = await db.auth.admin.getUserById(userId);
        if (ownerUser?.user?.is_anonymous) {
          const customerRecord = await api.customers.retrieve(customer);
          const email = !customerRecord.deleted ? customerRecord.email : null;
          if (email) {
            await sendGuestRecoveryLink(db, email, siteUrl());
            await api.subscriptions.update(subscription.id, { metadata: { ...subscription.metadata, recovery_email: "sent" } });
          }
        }
      } catch {
        // Stripe retries are not needed for the email; the buyer can also use "Sign in".
      }
    }
    return response({ received: true });
  } catch {
    return response({ error: "Please retry" }, 503);
  }
}
