// Builds public/data/zip/<STATE>.json for /random-zip-code-generator.
//
// Inputs (download once, pass the paths):
//   GeoNames US postal codes  https://download.geonames.org/export/zip/US.zip  (CC BY 4.0)
//   Census 2023 ZCTA gazetteer https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer/2023_Gaz_zcta_national.zip
//
// Only ZIPs that are also a Census ZCTA are kept, so every ZIP the tool shows
// is a real, populated ZIP Code area (PO-box-only and unique ZIPs drop out).
// Each shard is [zip, city, county][] sorted by ZIP; the list of ZCTAs is
// also written to scripts/data/zcta-2023.txt for the regression test.
//
//   node scripts/build-zip-data.mjs path/to/US.txt path/to/2023_Gaz_zcta_national.txt
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const [geoPath, zctaPath] = process.argv.slice(2);
if (!geoPath || !zctaPath) throw new Error("usage: build-zip-data.mjs US.txt 2023_Gaz_zcta_national.txt");

const zcta = new Set(
  readFileSync(zctaPath, "utf8").split("\n").slice(1).map((l) => l.split("\t")[0].trim()).filter((z) => /^\d{5}$/.test(z)),
);
const STATES = new Set("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" "));
const byState = new Map();
const seen = new Set();
for (const line of readFileSync(geoPath, "utf8").split("\n")) {
  const [, zip, city, , st, county] = line.split("\t");
  if (!zip || !STATES.has(st) || !zcta.has(zip) || seen.has(zip)) continue;
  seen.add(zip);
  if (!byState.has(st)) byState.set(st, []);
  byState.get(st).push([zip, city, county || ""]);
}
mkdirSync("public/data/zip", { recursive: true });
let total = 0;
let largest = 0;
for (const [st, rows] of [...byState].sort()) {
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  const json = JSON.stringify(rows);
  largest = Math.max(largest, json.length);
  if (json.length > 200_000) throw new Error(`${st} shard is ${json.length} bytes`);
  writeFileSync(`public/data/zip/${st}.json`, json);
  total += rows.length;
}
// Per-state summary for the page's reference table: how many ZIPs, the lowest
// and highest ZIP, and the city with the most ZIP codes as an example.
const summary = {};
for (const [st, rows] of [...byState].sort()) {
  const perCity = new Map();
  for (const r of rows) perCity.set(r[1], (perCity.get(r[1]) ?? 0) + 1);
  const city = [...perCity].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  summary[st] = { count: rows.length, first: rows[0][0], last: rows.at(-1)[0], city, sample: rows.find((r) => r[1] === city)[0] };
}
writeFileSync("src/data/zipStates.json", JSON.stringify(summary) + "\n");
writeFileSync("scripts/data/zcta-2023.txt", [...seen].sort().join("\n") + "\n");
console.log(`${total} ZIPs in ${byState.size} shards; largest ${largest} bytes`);
