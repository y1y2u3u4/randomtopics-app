import { actor, failure, readJson, response } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady, stripe } from "@/lib/speech/billing";
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
      granted = await reconcilePacks(stripe(false), db, account.customer_id, user.id, billingConfiguration().livemode,
        typeof body.sessionId === "string" ? body.sessionId : undefined);
    }
    return response({ granted, credits: await packCredits(db, user.id) });
  } catch (error) {
    return failure(error);
  }
}
