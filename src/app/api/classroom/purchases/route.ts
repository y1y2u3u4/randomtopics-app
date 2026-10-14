import { actor, failure, readJson, response } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady, siteUrl, stripe } from "@/lib/speech/billing";
import { sendGuestRecoveryLink } from "@/lib/speech/claim";
import { classroomAccess, reconcileClassroom } from "@/lib/classroom/purchases";

// Confirms classroom pack payments: the return from Checkout passes its session
// id, and every /account load reconciles paid sessions that were never granted.
// A guest buyer gets one sign-in link (to the email given to Stripe) so the
// downloads can be found from the email on any device.
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    const body = (await readJson(request).catch(() => ({}))) as { sessionId?: unknown };
    const { data: account, error } = await db.from("speech_accounts").select("customer_id").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    const granted: string[] = [];
    if (account?.customer_id && billingManagementReady()) {
      const fresh = await reconcileClassroom(stripe(false), db, account.customer_id, user.id, billingConfiguration().livemode,
        typeof body.sessionId === "string" ? body.sessionId : undefined);
      for (const { session, purchase } of fresh) {
        granted.push(purchase);
        const email = session.customer_details?.email;
        if (!user.is_anonymous || !email) continue;
        try {
          await sendGuestRecoveryLink(db, email, siteUrl(), "/account?claim=1");
          await db.from("classroom_purchases").update({ email_sent: true }).eq("session_id", session.id);
        } catch {
          // The downloads are already on this device; the email is a convenience.
        }
      }
    }
    const access = await classroomAccess(db, user.id);
    return response({ granted, owned: access.owned, all: access.all, guest: user.is_anonymous === true });
  } catch (error) {
    return failure(error);
  }
}
