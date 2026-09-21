import { response, speechReady } from "@/lib/speech/server";
import { billingReady } from "@/lib/speech/billing";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!speechReady())
    return response({ error: "Practice feedback is not available yet." }, 503);
  // Only the public anon key, never the service role key. RLS blocks direct table access.
  return response({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    billingAvailable: billingReady(),
  });
}
