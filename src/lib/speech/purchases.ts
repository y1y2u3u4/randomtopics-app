import "server-only";
import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { billingConfiguration, billingManagementReady, SPEECH_PRODUCT, stripe } from "./billing";

export const purchaseTransactionId = (sessionId: string) =>
  createHash("sha256").update(`randomtopics:${sessionId}`).digest("hex");

export function isSpeechCheckout(session: Stripe.Checkout.Session) {
  const config = billingConfiguration();
  return session.livemode === config.livemode && session.mode === "subscription" &&
    session.metadata?.product === SPEECH_PRODUCT && session.metadata?.price_id === config.priceId &&
    Boolean(session.client_reference_id && session.client_reference_id === session.metadata?.user_id);
}

export function isPaidSpeechCheckout(session: Stripe.Checkout.Session) {
  return isSpeechCheckout(session) && session.status === "complete" &&
    session.payment_status === "paid" && session.currency === "usd" && session.amount_total === 1200;
}

// A return URL is never evidence of payment. Read this owner's paid session from Stripe.
export async function latestSpeechPurchase(customer: string, userId: string) {
  if (!billingManagementReady()) return null;
  const sessions = await stripe(false).checkout.sessions.list({ customer, status: "complete", limit: 100 });
  const paid = sessions.data.find(s => isPaidSpeechCheckout(s) && s.client_reference_id === userId);
  if (!paid) return null;
  return {
    transactionId: purchaseTransactionId(paid.id),
    value: 12,
    currency: "USD" as const,
    // Cohort time, not the time money settled.
    checkoutCreatedAt: new Date(paid.created * 1000).toISOString(),
  };
}

export type CheckoutConversionReport = {
  available: boolean; complete: boolean; live: boolean; generatedAt: string; start: string;
  days: number; checkouts: number; paid: number; paidCustomers: number; firstPaidCustomers: number;
  repeatPaidCheckouts: number; open: number; expired: number; unpaidComplete: number; grossUsd: number;
};

// Read-only Stripe truth, including buyers who never returned to the website.
// Cohorts use Checkout creation time; these are not daily settlement or net-revenue figures.
export async function checkoutConversionReport(days = 1): Promise<CheckoutConversionReport> {
  days = [1, 7, 28].includes(days) ? days : 1;
  const now = Date.now();
  const start = now - days * 86400000;
  const result: CheckoutConversionReport = {
    available: false, complete: false, live: false, generatedAt: new Date(now).toISOString(),
    start: new Date(start).toISOString(), days, checkouts: 0, paid: 0, paidCustomers: 0,
    firstPaidCustomers: 0, repeatPaidCheckouts: 0, open: 0, expired: 0, unpaidComplete: 0, grossUsd: 0,
  };
  if (!billingManagementReady()) return result;
  const api = stripe(false);
  result.live = billingConfiguration().livemode;
  const sessions: Stripe.Checkout.Session[] = [];
  let after: string | undefined;
  // Full history is needed to distinguish a first purchase from a return purchase.
  for (let page = 0; page < 100; page++) {
    const batch = await api.checkout.sessions.list({ limit: 100, ...(after ? { starting_after: after } : {}) });
    sessions.push(...batch.data.filter(isSpeechCheckout));
    if (!batch.has_more) { result.complete = true; break; }
    if (!batch.data.length) break;
    after = batch.data[batch.data.length - 1].id;
  }
  const firstPaid = new Map<string, string>();
  for (const s of [...sessions].sort((a, b) => a.created - b.created || a.id.localeCompare(b.id))) {
    if (isPaidSpeechCheckout(s) && !firstPaid.has(s.client_reference_id!)) firstPaid.set(s.client_reference_id!, s.id);
  }
  const paidUsers = new Set<string>();
  const firstUsers = new Set<string>();
  for (const s of sessions.filter(s => s.created * 1000 >= start && s.created * 1000 <= now)) {
    result.checkouts++;
    if (isPaidSpeechCheckout(s)) {
      result.paid++;
      paidUsers.add(s.client_reference_id!);
      if (firstPaid.get(s.client_reference_id!) === s.id) firstUsers.add(s.client_reference_id!);
      else result.repeatPaidCheckouts++;
    } else if (s.status === "open") result.open++;
    else if (s.status === "expired") result.expired++;
    else if (s.status === "complete") result.unpaidComplete++;
  }
  result.paidCustomers = paidUsers.size;
  result.firstPaidCustomers = firstUsers.size;
  result.grossUsd = result.paid * 12;
  result.available = true;
  return result;
}
