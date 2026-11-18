import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/adsterra.ts");
let count = 0;
const eq = (a, b) => { assert.deepEqual(a, b); count++; };

// Country decision: default exclusion list, unknown = no.
for (const c of ["US", "CA", "GB", "AU", "NZ", "IE", "DE", "FR", "ES", "IT", "NL", "SE", "PL", "NO", "IS", "LI", "CH", "us", " gb "]) eq(lib.adsterraCountryAllowed(c), false);
for (const c of ["IN", "PH", "BR", "MX", "ID", "NG", "PK", "VN", "TR", "ZA", "SG", "JP"]) eq(lib.adsterraCountryAllowed(c), true);
for (const c of [undefined, null, "", "XX", "T1", "USA", "1", "U"]) eq(lib.adsterraCountryAllowed(c), false);
eq(new Set(lib.DEFAULT_EXCLUDED_COUNTRIES).size, 36); // 6 named + EU27 (IE once) + IS LI NO + CH
// Override list replaces the default (US allowed only if the owner removes it).
eq(lib.adsterraCountryAllowed("US", "BR"), true);
eq(lib.adsterraCountryAllowed("BR", "br, in"), false);
eq(lib.adsterraCountryAllowed("IN", "br, in"), false);
eq(lib.adsterraCountryAllowed("PH", "br, in"), true);
eq(lib.adsterraCountryAllowed("US", ""), false);       // empty override falls back to default
eq(lib.adsterraCountryAllowed("US", "  "), false);
eq(lib.parseCountryList("de, fr ,,x1"), ["DE", "FR"]);

// Switch: both env values, well-formed, else off.
const src = "https://pl123.example-cdn.com/abcdef0123456789/invoke.js", id = "container-abcdef0123456789";
eq(lib.adsterraNativeConfig(src, id), { src, id });
for (const [s, i] of [[undefined, id], [src, undefined], ["", id], [src, ""], ["  ", id], [src, "  "], [undefined, undefined],
  ["http://pl1.x.com/k/invoke.js", id], ["https://pl1.x.com/k/other.js", id], [src, "abc"], [src, "container-<x>"], ["javascript:alert(1)", id]])
  eq(lib.adsterraNativeConfig(s, i), null);
// Adsterra's current "Get code" output has no /invoke.js suffix (randomtopics unit 32301291, 2026-11-16): must be accepted.
const bare = "https://bauval.org/21/e4fcd4adc4ddb7fd627f4e44bc5f884c";
eq(lib.adsterraNativeConfig(bare, "container-e4fcd4adc4ddb7fd627f4e44bc5f884c"), { src: bare, id: "container-e4fcd4adc4ddb7fd627f4e44bc5f884c" });
for (const s of ["http://bauval.org/21/e4fc", "https://bauval.org/", "https://bauval.org/21/k/other.js", "https://bauval.org/21/k?x=1"]) eq(lib.adsterraNativeConfig(s, id), null);
delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ON;
delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC;
delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID;
eq(lib.adsterraNativeFromEnv(), null);
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ON = "1";
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC = src;
eq(lib.adsterraNativeFromEnv(), null);
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID = id;
eq(lib.adsterraNativeFromEnv(), { src, id });
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ON = "0";
eq(lib.adsterraNativeFromEnv(), null);
eq(lib.adsterraCookie("a=1; rt_adst=IN; b=2"), "IN");
eq(lib.adsterraCookie("rt_adst=-"), "-");
eq(lib.adsterraCookie("x=1"), "");

// Route: only allowed countries get the script; the off state writes no geo cookie.
const json = (body) => ({ body, headers: new Map(), cookies: { set(...a) { this.last = a; } } });
const route = load("src/app/api/adslot/route.ts", { "next/server": { NextResponse: { json } } });
const call = async (country) => {
  const res = await route.GET({ headers: { get: (k) => (k === "x-vercel-ip-country" ? country : null) }, nextUrl: { protocol: "https:" } });
  eq(res.headers.get("Cache-Control"), "private, no-store");
  return res;
};
// Unconfigured: nothing for anyone.
eq((await call("IN")).body, {});
eq((await call("IN")).cookies.last, undefined);
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ON = "1";
eq((await call("IN")).body, { src, id, country: "IN" });
eq((await call("IN")).cookies.last[1], "IN");
eq((await call("US")).body, {});
eq((await call("US")).cookies.last[1], "-");
eq((await call("DE")).body, {});
eq((await call(null)).body, {});
eq((await call("IN")).cookies.last[2].maxAge, 86400);
process.env.ADSTERRA_EXCLUDE_COUNTRIES = "IN";
eq((await call("IN")).body, {});
eq((await call("US")).body, { src, id, country: "US" });
delete process.env.ADSTERRA_EXCLUDE_COUNTRIES;
delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC; delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID;

// Wiring: layout mounts it only when AdSense ads and the env switch are on; component uses the AdSense gates; no static script.
const root = resolve(import.meta.dirname, "..");
const layout = readFileSync(resolve(root, "src/app/layout.tsx"), "utf8");
assert.match(layout, /adsEnabled && adsterraNativeFromEnv\(\) && <AdsterraNative \/>/); count++;
for (const dir of ["src", "public"]) {
  for (const file of readdirSync(resolve(root, dir), { recursive: true })) {
    if (!/\.(?:[cm]?[jt]sx?|html)$/.test(file)) continue;
    const code = readFileSync(resolve(root, dir, file), "utf8");
    assert.doesNotMatch(code, /pop[-_ ]?under|social[-_ ]?bar|smart[-_ ]?link|adsterra[-_ ]+direct/i, file);
    if (file !== "lib/adsterra.ts") assert.doesNotMatch(code, /NEXT_PUBLIC_ADSTERRA_/i, file);
    if (file !== "app/layout.tsx") assert.doesNotMatch(code, /<AdsterraNative\b/, file);
  }
}
const track = readFileSync(resolve(root, "src/lib/track.ts"), "utf8");
assert.match(track, /"adsterra_native_load"/); assert.match(track, /"generations", "country"\]/); count += 2;
console.log(`adsterra regression ok (${count} checks)`);
