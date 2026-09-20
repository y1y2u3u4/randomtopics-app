import "server-only";
import Stripe from "stripe";
import { SpeechError } from "./server";

export const SPEECH_PRODUCT = "randomtopics_speech";

// Deliberately no fallback to STRIPE_SECRET_KEY or another application's config.
function configuration() {
  const key = process.env.SPEECH_STRIPE_SECRET_KEY?.trim() || "";
  const keyMode = /^(?:sk|rk)_(test|live)_.+$/.exec(key)?.[1];
  const webhookSecret = process.env.SPEECH_STRIPE_WEBHOOK_SECRET?.trim() || "";
  const productId = process.env.SPEECH_STRIPE_PRODUCT_ID?.trim() || "";
  const priceId = process.env.SPEECH_STRIPE_PRICE_ID?.trim() || "";
  const portalConfiguration =
    process.env.SPEECH_STRIPE_PORTAL_CONFIGURATION_ID?.trim() || "";
  if (
    !keyMode ||
    !webhookSecret.startsWith("whsec_") ||
    !productId.startsWith("prod_") ||
    !priceId.startsWith("price_") ||
    !portalConfiguration.startsWith("bpc_")
  )
    return null;
  try {
    const url = new URL(process.env.SPEECH_SITE_URL || "");
    const localTest =
      keyMode === "test" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname);
    if (
      (url.protocol !== "https:" && !localTest) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== "/"
    )
      return null;
    // A preview must never accept real cards, even if live flags were copied.
    if (keyMode === "live" && process.env.VERCEL_ENV === "preview") return null;
    return {
      key,
      webhookSecret,
      productId,
      priceId,
      portalConfiguration,
      livemode: keyMode === "live",
      origin: url.origin,
    };
  } catch {
    return null;
  }
}

export function billingConfiguration() {
  const config = configuration();
  if (!config) throw new SpeechError(503, "Billing is not configured.");
  return config;
}

export function billingReady() {
  const config = configuration();
  return Boolean(
    config &&
      process.env.SPEECH_BILLING_ENABLED === "true" &&
      process.env.SPEECH_EMAIL_ENABLED === "true" &&
      (!config.livemode || process.env.SPEECH_LIVE_BILLING_ENABLED === "true"),
  );
}

export function billingManagementReady() {
  return configuration() !== null;
}

// Turning off new sales must not stop signed updates or existing users' cancellation.
export function stripe(acceptingPayment = true, options?: Stripe.StripeConfig) {
  if (acceptingPayment && !billingReady())
    throw new SpeechError(503, "Subscriptions are not open yet.");
  return new Stripe(billingConfiguration().key, options);
}

export function siteUrl() {
  return billingConfiguration().origin;
}

export function matchesSpeechPrice(price: Stripe.Price) {
  const config = billingConfiguration();
  const productId =
    typeof price.product === "string" ? price.product : price.product.id;
  return (
    price.id === config.priceId &&
    productId === config.productId &&
    price.livemode === config.livemode &&
    price.currency === "usd" &&
    price.unit_amount === 1200 &&
    price.billing_scheme === "per_unit" &&
    !price.transform_quantity &&
    price.recurring?.interval === "month" &&
    price.recurring.interval_count === 1 &&
    price.recurring.usage_type === "licensed"
  );
}

export async function speechPrice(api: Stripe) {
  const price = await api.prices.retrieve(billingConfiguration().priceId, {
    expand: ["product"],
  });
  const product = price.product;
  if (
    !price.active ||
    !matchesSpeechPrice(price) ||
    typeof product === "string" ||
    product.deleted ||
    !product.active ||
    product.metadata.product !== SPEECH_PRODUCT
  )
    throw new SpeechError(503, "Subscriptions are not configured correctly.");
  return price;
}

export async function verifySpeechCustomer(
  api: Stripe,
  customerId: string,
  userId: string,
) {
  const customer = await api.customers.retrieve(customerId);
  if (
    customer.deleted ||
    customer.livemode !== billingConfiguration().livemode ||
    customer.metadata.product !== SPEECH_PRODUCT ||
    customer.metadata.user_id !== userId
  )
    throw new SpeechError(
      409,
      "This billing account could not be verified. Please contact support.",
    );
  return customer;
}
