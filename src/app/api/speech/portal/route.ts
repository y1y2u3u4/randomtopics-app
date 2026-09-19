import { actor, failure, response, SpeechError } from "@/lib/speech/server";
import { siteUrl, stripe } from "@/lib/speech/billing";
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    if (user.is_anonymous)
      throw new SpeechError(401, "Sign in to manage your subscription.");
    const { data, error } = await db
      .from("speech_accounts")
      .select("customer_id")
      .eq("user_id", user.id)
      .single();
    if (error || !data?.customer_id)
      throw new SpeechError(404, "No billing account found.");
    const session = await stripe().billingPortal.sessions.create({
      customer: data.customer_id,
      return_url: `${siteUrl()}/speech/account`,
    });
    return response({ url: session.url });
  } catch (error) {
    return failure(error);
  }
}
