import { actor, failure, readJson, response } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady, siteUrl, stripe } from "@/lib/speech/billing";
import { sendGuestRecoveryLink } from "@/lib/speech/claim";
import { hostAccess, reconcileHost } from "@/lib/host/purchases";
import type { HostPlan } from "@/lib/host/plans";

// Host Pass state. The return from Checkout passes its session id; a buyer
// without an active pass also reconciles paid sessions that were never granted.
// `granted` lists passes confirmed by this call (drives host_purchase).
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { sessionId?: unknown };
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
    const ready = billingManagementReady();
    const livemode = ready ? billingConfiguration().livemode : true;
    let access = await hostAccess(db, user.id, livemode);
    const granted: HostPlan[] = [];
    if (ready && (sessionId || !access.active)) {
      const { data: account, error } = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (account?.customer_id) {
        granted.push(...(await reconcileHost(stripe(false), db, account.customer_id, user.id, livemode, sessionId)));
        if (granted.length) access = await hostAccess(db, user.id, livemode);
        if (granted.length && user.is_anonymous && sessionId) {
          try {
            const session = await stripe(false).checkout.sessions.retrieve(sessionId);
            const email = session.customer_details?.email;
            if (email) await sendGuestRecoveryLink(db, email, siteUrl(), "/account?claim=1");
          } catch {
            // Host mode already works in this browser; the email is a convenience.
          }
        }
      }
    }
    return response({ ...access, granted, guest: user.is_anonymous === true });
  } catch (error) {
    return failure(error);
  }
}
