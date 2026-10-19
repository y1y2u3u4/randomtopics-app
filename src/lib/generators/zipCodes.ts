import ZIP_STATES from "@/data/zipStates.json";
import type { Rng } from "@/lib/randomGenerators";

// Random US ZIP codes for /random-zip-code-generator. ZIP data lives in
// public/data/zip/<STATE>.json (one shard per state, built by
// scripts/build-zip-data.mjs from GeoNames ∩ Census ZCTA), so the page only
// downloads the states it needs.

/** One shard row: [zip, city, county]. */
export type ZipRow = [string, string, string];

export interface ZipResult {
  zip: string;
  city: string;
  county: string;
  state: string;
  stateName: string;
}

export const US_STATES: { code: string; name: string }[] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"],
  ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"],
  ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
  ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"],
  ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"],
  ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
].map(([code, name]) => ({ code, name }));

export const STATE_NAME: Record<string, string> = Object.fromEntries(US_STATES.map((s) => [s.code, s.name]));

export interface ZipStateSummary {
  count: number;
  first: string;
  last: string;
  city: string;
  sample: string;
}
export const ZIP_STATE_SUMMARY = ZIP_STATES as Record<string, ZipStateSummary>;
export const ZIP_TOTAL = Object.values(ZIP_STATE_SUMMARY).reduce((n, s) => n + s.count, 0);
export const MAX_ZIPS = 50;

export const zipShardUrl = (state: string) => `/data/zip/${state}.json`;

/**
 * Decide how many ZIPs to take from each state. With no state chosen, states
 * are drawn in proportion to how many ZIP codes they have, so a batch looks
 * like the real country (lots of Texas and California, the odd Wyoming).
 */
export function planStates(states: string[], count: number, rng: Rng): Record<string, number> {
  const pool = (states.length ? states : US_STATES.map((s) => s.code)).filter((s) => ZIP_STATE_SUMMARY[s]);
  const plan: Record<string, number> = {};
  if (!pool.length) return plan;
  const total = pool.reduce((n, s) => n + ZIP_STATE_SUMMARY[s].count, 0);
  const n = Math.max(1, Math.min(MAX_ZIPS, Math.floor(count)));
  for (let i = 0; i < n; i++) {
    let r = rng() * total;
    let st = pool[pool.length - 1];
    for (const s of pool) {
      r -= ZIP_STATE_SUMMARY[s].count;
      if (r < 0) { st = s; break; }
    }
    plan[st] = (plan[st] ?? 0) + 1;
  }
  // Never ask a small state for more ZIPs than it has.
  for (const [st, k] of Object.entries(plan)) plan[st] = Math.min(k, ZIP_STATE_SUMMARY[st].count);
  return plan;
}

/** Draw `k` distinct items (partial Fisher–Yates). */
export function drawRows<T>(rows: T[], k: number, rng: Rng): T[] {
  const idx = rows.map((_, i) => i);
  const take = Math.min(k, rows.length);
  for (let i = 0; i < take; i++) {
    const j = i + Math.floor(rng() * (idx.length - i));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, take).map((i) => rows[i]);
}

/** Combine a plan with loaded shards into shuffled results. */
export function pickZips(plan: Record<string, number>, shards: Record<string, ZipRow[]>, rng: Rng): ZipResult[] {
  const out: ZipResult[] = [];
  for (const [st, k] of Object.entries(plan)) {
    for (const [zip, city, county] of drawRows(shards[st] ?? [], k, rng)) {
      out.push({ zip, city, county, state: st, stateName: STATE_NAME[st] ?? st });
    }
  }
  return drawRows(out, out.length, rng);
}

export function sortZips(rows: ZipResult[]): ZipResult[] {
  return [...rows].sort((a, b) => a.zip.localeCompare(b.zip));
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export function zipCsv(rows: ZipResult[]): string {
  const lines = [["zip", "city", "state", "state_name", "county"].join(",")];
  for (const r of rows) lines.push([r.zip, r.city, r.state, r.stateName, r.county].map(csvCell).join(","));
  return lines.join("\n") + "\n";
}

export function zipText(rows: ZipResult[], withPlace: boolean): string {
  return rows.map((r) => (withPlace ? `${r.zip} — ${r.city}, ${r.state}` : r.zip)).join("\n");
}
