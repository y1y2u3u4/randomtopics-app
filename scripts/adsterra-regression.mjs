import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
eq(lib.adsterraNativeFromEnv(), null); // env unset in test run
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC = src;
eq(lib.adsterraNativeFromEnv(), null); // only one of two
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID = id;
eq(lib.adsterraNativeFromEnv(), { src, id });
delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC; delete process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID;

eq(lib.adsterraCookie("a=1; rt_adst=IN; b=2"), "IN");
eq(lib.adsterraCookie("rt_adst=-"), "-");
eq(lib.adsterraCookie("x=1"), "");

// Route: only allowed countries get the script; cookie always set.
const json = (body) => ({ body, headers: new Map(), cookies: { set(...a) { this.last = a; } } });
const route = load("src/app/api/adslot/route.ts", { "next/server": { NextResponse: { json } } });
const call = async (country) => {
  const res = await route.GET({ headers: { get: (k) => (k === "x-vercel-ip-country" ? country : null) }, nextUrl: { protocol: "https:" } });
  res.headers = { set() {} };
  return res;
};
// Unconfigured: nothing for anyone.
eq((await call("IN")).body, {});
eq((await call("IN")).cookies.last[1], "-");
process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC = src; process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_ID = id;
eq((await call("IN")).body, { src, id, country: "IN" });
eq((await call("IN")).cookies.last[1], "IN");
eq((await call("US")).body, {});
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
const comp = readFileSync(resolve(root, "src/components/AdsterraNative.tsx"), "utf8");
for (const needle of ["adPageAllowed", "adRequestAllowed", "observeSpeechAdEntitlement", "window.self !== window.top", "rt_usage_qa", "globalPrivacyControl", "adsterra_native_load", "[path]"]) {
  assert.ok(comp.includes(needle), needle); count++;
}
for (const banned of ["popunder", "socialbar", "direct", "<script"]) { assert.ok(!comp.toLowerCase().includes(banned), banned); count++; }
const track = readFileSync(resolve(root, "src/lib/track.ts"), "utf8");
assert.match(track, /"adsterra_native_load"/); assert.match(track, /"generations", "country"\]/); count += 2;
console.log(`adsterra regression ok (${count} checks)`);
