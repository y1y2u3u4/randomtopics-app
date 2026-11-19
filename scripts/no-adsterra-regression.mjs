import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { load } from "./lib/load-typescript.mjs";

const root = resolve(import.meta.dirname, "..");
const vendor = /adsterra|highperformanceformat|effectivegatecpm|profitableratecpm|highperformancecpm|adslot|bauval\.org|asiafilm\.org|rt_adst|\/invoke\.js\b|\batOptions\b/i;
const seller = "google.com, pub-1513206179290827, DIRECT, f08c47fec0942fa0";
const routeSources = [
  "layout.tsx",
  "page.tsx",
  "es/page.tsx",
  "topics/[slug]/page.tsx",
  "es/topics/[slug]/page.tsx",
  "spin-the-wheel/page.tsx",
  "es/spin-the-wheel/page.tsx",
].map(file => `src/app/${file}`);

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

function inspect(file) {
  assert.doesNotMatch(file, vendor, `Forbidden path: ${file}`);
  assert.doesNotMatch(read(file), vendor, `Forbidden integration: ${file}`);
}

for (const file of routeSources) inspect(file);
console.log(`PASS: ${routeSources.length} layout and English/Spanish route templates statically contain no vendor script or slot markers.`);

const checkedRoutes = new Set(routeSources);
const textFile = /\.(?:[cm]?[jt]sx?|json|html?|css|scss|svg|m?ya?ml|toml|sh|py|txt|xml|webmanifest|sql|mdx?)$/i;
function scan(directory) {
  for (const entry of readdirSync(join(root, directory), { withFileTypes: true })) {
    const file = join(directory, entry.name);
    assert.doesNotMatch(file, vendor, `Forbidden path: ${file}`);
    if (entry.isDirectory()) {
      scan(file);
    } else if (!checkedRoutes.has(file) && (textFile.test(entry.name) || /^\.env(?:\.|$)/.test(entry.name))) {
      inspect(file);
    }
  }
}
scan("src");
scan("public");
inspect("next.config.ts");
assert.deepEqual(read("public/ads.txt").trim().split(/\r?\n/), [seller]);
console.log("PASS: src/, public/ and Next config have no vendor markers. ads.txt retains the exact AdSense seller record.");

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const wheel = "src/components/subs/RosterWheel.tsx";
const states = [...read(wheel).matchAll(/const \[(\w+),[^\]]+\] = useState/g)].map(match => match[1]);
assert.ok(states.includes("paywall"), "Wheel Pro blocked render fixture must set paywall state");
const SubPaywall = load("src/components/subs/SubPaywall.tsx", { "@/lib/subs/client": {} }).default;

for (const [locale, cadence] of [["en", "month"], ["es", "mes"]]) {
  let index = 0;
  const RosterWheel = load(wheel, {
    react: {
      ...React,
      useState(initial) {
        const state = states[index++];
        return React.useState(state === "paywall" ? true : initial);
      },
    },
    "./SubPaywall": { __esModule: true, default: SubPaywall },
    "./useSubPlan": { useSubPlan: () => ({ active: false }) },
    "@/lib/speech/client": {},
    "@/lib/subs/client": {},
  }).default;
  const html = renderToStaticMarkup(React.createElement(RosterWheel, { locale }));
  const buttons = parse(html).querySelectorAll('[data-sub-paywall="wheel"] button:not([disabled])');
  assert.ok(buttons.some(button => button.text.trim().endsWith(`/${cadence}`)), `${locale}: blocked Wheel Pro shows an enabled purchase button`);
}
console.log("PASS: blocked Wheel Pro shows an enabled purchase button in English and Spanish.");
