import { actor, failure, readJson, response } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady, siteUrl, stripe } from "@/lib/speech/billing";
import { sendGuestRecoveryLink } from "@/lib/speech/claim";
import { packCredits, reconcilePacks } from "@/lib/speech/packs";

// Confirms one-time pack payments: the return from Checkout passes its session
// id, and every account load reconciles paid sessions that were never granted.
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { sessionId?: unknown };
    const { data: account, error } = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    let granted: number[] = [];
    if (account?.customer_id && billingManagementReady()) {
      const api = stripe(false);
      const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
      granted = await reconcilePacks(api, db, account.customer_id, user.id, billingConfiguration().livemode, sessionId);
      // A guest buyer gets one sign-in link (to the email given to Stripe) so the
      // rounds can be kept on any device. Grants happen once, so this sends once.
      if (granted.length && user.is_anonymous && sessionId) {
        try {
          const paid = await api.checkout.sessions.retrieve(sessionId);
          const email = paid.customer_details?.email;
          if (email) await sendGuestRecoveryLink(db, email, siteUrl());
        } catch {
          // Rounds are already on this device; the email is a convenience.
        }
      }
    }
    return response({ granted, credits: await packCredits(db, user.id) });
  } catch (error) {
    return failure(error);
  }
}
