/**
 * Adsterra Native experiment (2026-11-14, ad dispatch item 3): ONE Native unit at the bottom of ad-eligible pages,
 * only for visitors outside the Tier-1 countries. Off by default: until NEXT_PUBLIC_ADSTERRA_NATIVE_SRC and
 * NEXT_PUBLIC_ADSTERRA_NATIVE_ID are both set nothing renders and nothing loads. AdSense placements are untouched.
 * The country decision is server-side (Vercel geo header, /api/adslot/); the static HTML never contains Adsterra code.
 */
export const ADSTERRA_COOKIE = "rt_adst";
export const ADSTERRA_COOKIE_MAX_AGE = 24 * 3600;
/** Cookie value for "no Adsterra for this visitor". Any other value is the visitor's country code. */
export const ADSTERRA_NONE = "-";

// US CA GB AU NZ IE + EEA (EU 27 + IS LI NO) + CH. Overridable with ADSTERRA_EXCLUDE_COUNTRIES (comma list).
export const DEFAULT_EXCLUDED_COUNTRIES: readonly string[] = [
  "US", "CA", "GB", "AU", "NZ", "IE",
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "CH",
];

export function parseCountryList(value: string | undefined): string[] | null {
  if (value === undefined || value.trim() === "") return null;
  return value.split(",").map((c) => c.trim().toUpperCase()).filter((c) => /^[A-Z]{2}$/.test(c));
}

/** Country (ISO-2 from Vercel's geo header) may see Adsterra. Unknown or malformed country = no. */
export function adsterraCountryAllowed(country: string | null | undefined, excludeEnv?: string): boolean {
  const code = (country ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === "XX" || code === "T1") return false;
  const excluded = parseCountryList(excludeEnv) ?? DEFAULT_EXCLUDED_COUNTRIES;
  return !excluded.includes(code);
}

export type AdsterraNative = { src: string; id: string };

/** Both env values present and well-formed (https script URL, container-<key> id); otherwise null = feature off. */
export function adsterraNativeConfig(src: string | undefined, id: string | undefined): AdsterraNative | null {
  const s = (src ?? "").trim(), i = (id ?? "").trim();
  if (!s || !i) return null;
  if (!/^https:\/\/[a-z0-9.-]+\/[A-Za-z0-9_\-/]+\/invoke\.js$/i.test(s)) return null;
  if (!/^container-[A-Za-z0-9_-]+$/.test(i)) return null;
  return { src: s, id: i };
}

/** Same fixed env reads on server and client (NEXT_PUBLIC values are inlined at build time). */
export function adsterraNativeFromEnv(): AdsterraNative | null {
  return adsterraNativeConfig(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC, process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID);
}

/** The visitor's cookie: "" = not asked yet, ADSTERRA_NONE = no ads, else the country code. */
export function adsterraCookie(cookie: string): string {
  const m = cookie.match(/(?:^|;\s*)rt_adst=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}
