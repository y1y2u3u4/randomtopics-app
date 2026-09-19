import "server-only";
import Stripe from "stripe";
import { SpeechError } from "./server";
export function billingReady() {
  const key = process.env.STRIPE_SECRET_KEY;
  return (
    process.env.SPEECH_BILLING_ENABLED === "true" &&
    !!key &&
    !!process.env.STRIPE_WEBHOOK_SECRET &&
    !!process.env.SPEECH_STRIPE_PRICE_ID &&
    (key.startsWith("sk_test_") ||
      process.env.SPEECH_LIVE_BILLING_ENABLED === "true")
  );
}
export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (
    process.env.SPEECH_BILLING_ENABLED !== "true" ||
    !key ||
    !process.env.STRIPE_WEBHOOK_SECRET ||
    !process.env.SPEECH_STRIPE_PRICE_ID
  )
    throw new SpeechError(503, "Subscriptions are not open yet.");
  if (
    !key.startsWith("sk_test_") &&
    process.env.SPEECH_LIVE_BILLING_ENABLED !== "true"
  )
    throw new SpeechError(503, "Subscriptions are not open yet.");
  return new Stripe(key);
}
export function siteUrl() {
  const url = new URL(
    process.env.SPEECH_SITE_URL || "https://randomtopics.app",
  );
  if (url.protocol !== "https:" && url.hostname !== "localhost")
    throw new SpeechError(503, "Billing is not configured.");
  return url.origin;
}
