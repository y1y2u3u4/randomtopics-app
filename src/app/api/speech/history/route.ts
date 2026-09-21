import {
  actor,
  failure,
  readJson,
  response,
  SpeechError,
} from "@/lib/speech/server";
import { z } from "zod";
import { billingManagementReady, billingReady } from "@/lib/speech/billing";
import { latestSpeechPurchase } from "@/lib/speech/purchases";
import { speechAllowance } from "@/lib/speech/allowance";
export async function GET(request: Request) {
  try {
    const { db, user } = await actor(request);
    const requestedId = new URL(request.url).searchParams.get("id");
    if (requestedId && !z.uuid().safeParse(requestedId).success)
      throw new SpeechError(400, "Invalid practice link.");
    let query = db
      .from("speech_attempts")
      .select(
        "id,topic,transcript,duration,feedback,status,previous_id,created_at",
      )
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50);
    if (requestedId) query = query.eq("id", requestedId);
    const { data, error } = await query;
    if (error) throw error;
    const { data: account, error: accountError } = await db
      .from("speech_accounts")
      .select("customer_id,subscription_active,period_start,period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    if (accountError) throw accountError;
    const now = Date.now();
    const active = Boolean(
      account?.subscription_active &&
        new Date(account.period_start).getTime() <= now &&
        new Date(account.period_end).getTime() > now,
    );
    const verified = !user.is_anonymous && Boolean(user.email_confirmed_at);
    // Analytics/provider availability must not prevent access to saved practice.
    const purchase = verified && account?.customer_id
      ? await latestSpeechPurchase(account.customer_id, user.id).catch(() => null)
      : null;
    return response({
      attempts: data,
      allowance: await speechAllowance(db, user.id).catch(() => undefined),
      anonymous: user.is_anonymous === true,
      emailVerified: verified,
      purchase,
      billingAvailable: billingReady(),
      emailAvailable: process.env.SPEECH_EMAIL_ENABLED === "true",
      subscription: {
        active,
        periodEnd: active ? (account?.period_end ?? null) : null,
        manageable: Boolean(
          account?.customer_id &&
            !user.is_anonymous &&
            billingManagementReady(),
        ),
      },
    });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    const { db, user } = await actor(request);
    const parsed = z
      .object({ id: z.uuid() })
      .safeParse(await readJson(request));
    if (!parsed.success) throw new SpeechError(400, "Invalid practice.");
    // Remove content, preserve minimal quota ledger so deletion cannot reset allowance.
    const { data, error } = await db
      .from("speech_attempts")
      .update({
        transcript: null,
        feedback: null,
        topic: "Deleted practice",
        deleted_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.id)
      .eq("user_id", user.id)
      .not("status", "in", "(transcribing,processing)")
      .select("id");
    if (error) throw error;
    if (!data?.length)
      throw new SpeechError(
        409,
        "Practice is processing or no longer available. Refresh and try again.",
      );
    return response({ deleted: true });
  } catch (error) {
    return failure(error);
  }
}
