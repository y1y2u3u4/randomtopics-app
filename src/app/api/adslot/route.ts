import { NextResponse, type NextRequest } from "next/server";
import { ADSTERRA_COOKIE, ADSTERRA_COOKIE_MAX_AGE, ADSTERRA_NONE, adsterraCountryAllowed, adsterraNativeFromEnv } from "@/lib/adsterra";

export const dynamic = "force-dynamic";

/**
 * Adsterra Native experiment (src/lib/adsterra.ts): script URL and container id only for allowed (non Tier-1) countries.
 * Everyone else, unknown countries and an unconfigured site get {} and a one-day "no ads" cookie.
 * Paid/ad-free entitlement is checked in the browser (same observer AdSense uses), so this route stays stateless.
 */
export async function GET(req: NextRequest) {
  const config = adsterraNativeFromEnv();
  const country = (req.headers.get("x-vercel-ip-country") ?? "").toUpperCase();
  const ok = config && adsterraCountryAllowed(country, process.env.ADSTERRA_EXCLUDE_COUNTRIES);
  const res = NextResponse.json(ok ? { ...config, country } : {});
  res.headers.set("Cache-Control", "private, no-store");
  res.cookies.set(ADSTERRA_COOKIE, ok ? country : ADSTERRA_NONE, {
    path: "/", maxAge: ADSTERRA_COOKIE_MAX_AGE, sameSite: "lax", secure: req.nextUrl.protocol === "https:",
  });
  return res;
}
