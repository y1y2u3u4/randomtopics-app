import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rateLimit";

// Waitlist for the classroom pack fake-door test: stores an email and the page.
const PAGES = new Set(["/question-of-the-day", "/debate", "/pro-and-con-debate-topics"]);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,63}$/;

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, "classroom-waitlist", { limit: 5, windowSeconds: 600 });
  if (limited) return limited;
  const body = await request.json().catch(() => null) as { email?: unknown; page?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const page = typeof body?.page === "string" ? body.page : "";
  if (!EMAIL.test(email) || email.length > 254 || !PAGES.has(page)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Unavailable." }, { status: 503 });
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await db.from("classroom_pack_waitlist").upsert({ email, page }, { onConflict: "email,page", ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: "Please try again." }, { status: 503 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
