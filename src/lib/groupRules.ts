// Random groups with seating-chart style rules (2026-10-16): "keep together"
// and "keep apart" pairs on top of an even random split. Pure functions, so
// the regression script can check every guarantee.
import { shuffle, type Rng } from "./randomGenerators";

export const GROUP_ROLES = ["Leader", "Recorder", "Timekeeper", "Reporter", "Materials manager", "Encourager"];

export type Pair = [string, string];
export interface GroupRules { together: Pair[]; apart: Pair[] }
export interface GroupResult {
  groups: string[][];
  /** Rules that could not be met (impossible or contradictory), for a visible warning. */
  broken: { kind: "together" | "apart"; pair: Pair }[];
}

/** Even sizes for n people in k groups: the first n % k groups get one extra. */
export function groupSizes(n: number, k: number): number[] {
  const count = Math.max(1, Math.min(k, Math.max(n, 1)));
  return Array.from({ length: count }, (_, i) => Math.floor(n / count) + (i < n % count ? 1 : 0));
}

/** Parse rule lines like "Ava + Ben" / "Ava, Ben" / "Ava & Ben" into pairs of known names. */
export function parsePairs(text: string, names: readonly string[]): Pair[] {
  const byLower = new Map(names.map((n) => [n.toLowerCase(), n]));
  const out: Pair[] = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/\s*(?:\+|&|,|\/|\band\b)\s*/i).map((p) => byLower.get(p.trim().toLowerCase())).filter((p): p is string => !!p);
    const uniq = [...new Set(parts)];
    // "A + B + C" means every pair among them.
    for (let i = 0; i < uniq.length; i++) for (let j = i + 1; j < uniq.length; j++) out.push([uniq[i], uniq[j]]);
  }
  return out;
}

function clusters(names: readonly string[], together: readonly Pair[]): string[][] {
  const parent = new Map(names.map((n) => [n, n]));
  const find = (x: string): string => { const p = parent.get(x)!; if (p === x) return x; const r = find(p); parent.set(x, r); return r; };
  for (const [a, b] of together) if (parent.has(a) && parent.has(b)) parent.set(find(a), find(b));
  const groups = new Map<string, string[]>();
  for (const n of names) { const r = find(n); groups.set(r, [...(groups.get(r) ?? []), n]); }
  return [...groups.values()];
}

/**
 * Split names into k groups at random. Sizes differ by at most one unless a
 * "together" cluster is bigger than a group. Rules are met whenever possible;
 * otherwise the attempt with the fewest broken rules is returned and the
 * broken rules are listed.
 */
export function makeGroups(names: readonly string[], k: number, rules: GroupRules, rng: Rng, attempts = 300): GroupResult {
  const uniq = [...new Set(names)];
  const known = new Set(uniq);
  const together = rules.together.filter(([a, b]) => a !== b && known.has(a) && known.has(b));
  const apart = rules.apart.filter(([a, b]) => a !== b && known.has(a) && known.has(b));
  const sizes = groupSizes(uniq.length, k);
  const blocks = clusters(uniq, together);
  const enemies = new Map<string, Set<string>>();
  for (const [a, b] of apart) {
    enemies.set(a, (enemies.get(a) ?? new Set()).add(b));
    enemies.set(b, (enemies.get(b) ?? new Set()).add(a));
  }
  const clash = (group: readonly string[], block: readonly string[]) => block.some((p) => group.some((q) => enemies.get(p)?.has(q)));

  let best: string[][] | null = null;
  let bestScore = Infinity;
  for (let t = 0; t < attempts; t++) {
    const caps = shuffle(sizes, rng);
    const groups: string[][] = caps.map(() => []);
    // Big blocks first, random order within the same size.
    const order = shuffle(blocks, rng).sort((a, b) => b.length - a.length);
    let penalty = 0;
    for (const raw of order) {
      const block = shuffle(raw, rng);
      const idx = shuffle(groups.map((_, i) => i), rng);
      const fits = (i: number) => groups[i].length + block.length <= caps[i];
      let pick = idx.find((i) => fits(i) && !clash(groups[i], block));
      if (pick === undefined) {
        // Relax: allow a clash, or overflow the group with the most room.
        pick = idx.find(fits) ?? idx.reduce((m, i) => (caps[i] - groups[i].length > caps[m] - groups[m].length ? i : m), idx[0]);
        penalty += 1;
      }
      groups[pick].push(...block);
    }
    const score = penalty * 1000 + countBroken(groups, apart);
    if (score < bestScore) { best = groups; bestScore = score; }
    if (score === 0) break;
  }
  const groups = (best ?? [uniq.slice()]).map((g) => g);
  const where = new Map<string, number>();
  groups.forEach((g, i) => g.forEach((n) => where.set(n, i)));
  return {
    groups,
    broken: [
      ...together.filter(([a, b]) => where.get(a) !== where.get(b)).map((pair) => ({ kind: "together" as const, pair })),
      ...apart.filter(([a, b]) => where.get(a) === where.get(b)).map((pair) => ({ kind: "apart" as const, pair })),
    ],
  };
}

function countBroken(groups: string[][], apart: readonly Pair[]) {
  const where = new Map<string, number>();
  groups.forEach((g, i) => g.forEach((n) => where.set(n, i)));
  return apart.filter(([a, b]) => where.get(a) === where.get(b)).length;
}

export const groupCountFor = (n: number, mode: "groups" | "size", value: number) =>
  Math.max(1, Math.min(Math.max(n, 1), mode === "groups" ? Math.floor(value) || 1 : Math.ceil(n / Math.max(1, Math.floor(value) || 1))));
