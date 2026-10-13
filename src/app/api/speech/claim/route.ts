import { actor, failure, response } from "@/lib/speech/server";
import { billingManagementReady, stripe } from "@/lib/speech/billing";
import { claimGuestPurchases } from "@/lib/speech/claim";

// Called after a guest buyer signs in through the emailed link: moves their
// guest purchase (matched by the verified email on the Stripe customer).
export async function POST(request: Request) {
  try {
    const { db, user } = await actor(request);
    if (user.is_anonymous || !user.email_confirmed_at || !billingManagementReady()) return response({ claimed: 0 });
    return response(await claimGuestPurchases(stripe(false), db, user));
  } catch (error) {
    return failure(error);
  }
}
