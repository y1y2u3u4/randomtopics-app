import { actor, failure, response, SpeechError } from "@/lib/speech/server";
import { subscriptionAdFree } from "@/lib/speech/adEntitlement";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // No session is a signed-out visitor, not a newly created guest account.
    // An invalid/expired supplied credential must never fall back to this case.
    if (!request.headers.has("authorization")) {
      return response({ version: "speech-ad-v1", audience: "signed_out", adFree: false });
    }
    const { db, user } = await actor(request);
    const { data, error } = await db.from("speech_accounts")
      .select("subscription_active,period_start,period_end")
      .eq("user_id", user.id).maybeSingle();
    if (error) throw new SpeechError(503, "Advertising eligibility is unavailable.");
    if (subscriptionAdFree(data)) return response({ version: "speech-ad-v1", audience: "verified_session", adFree: true });
    // A classroom pack purchase also removes ads for that account or guest browser.
    const classroom = await db.from("classroom_purchases").select("session_id", { count: "exact", head: true }).eq("user_id", user.id);
    if (classroom.error) throw new SpeechError(503, "Advertising eligibility is unavailable.");
    return response({ version: "speech-ad-v1", audience: "verified_session", adFree: (classroom.count ?? 0) > 0 });
  } catch (error) {
    return failure(error);
  }
}
