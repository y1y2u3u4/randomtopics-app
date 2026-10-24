import { actor, failure, readJson, response } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady, siteUrl, stripe } from "@/lib/speech/billing";
import { sendGuestRecoveryLink } from "@/lib/speech/claim";
import { reconcileSubs, subAccess, type SubGrant } from "@/lib/subs/purchases";

// Subscription state. The return from Checkout passes its session id, which
// is reconciled here; `granted` lists plans confirmed by this call (drives
// {product}_purchase once).
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { sessionId?: unknown };
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
    const ready = billingManagementReady();
    const livemode = ready ? billingConfiguration().livemode : true;
    const granted: SubGrant[] = [];
    if (ready && sessionId) {
      const { data: account, error } = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (account?.customer_id) {
        granted.push(...(await reconcileSubs(stripe(false), db, account.customer_id, user.id, livemode, sessionId)));
        if (granted.length && user.is_anonymous) {
          try {
            const session = await stripe(false).checkout.sessions.retrieve(sessionId);
            const email = session.customer_details?.email;
            if (email) await sendGuestRecoveryLink(db, email, siteUrl(), "/account?claim=1");
          } catch {
            // The plan already works in this browser; the email is a convenience.
          }
        }
      }
    }
    const access = await subAccess(db, user.id, livemode);
    return response({ access, granted, guest: user.is_anonymous === true, email: user.is_anonymous ? null : user.email ?? null });
  } catch (error) {
    return failure(error);
  }
}
