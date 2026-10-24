// Class Roster Wheel Pro: pure logic shared by the API route and its tests.
export const WHEEL_MAX_NAMES = 300;
export const WHEEL_MAX_HISTORY = 200;
export const WHEEL_FREE_LISTS = 1;

export interface WheelPick { at: string; pick?: string; groups?: string[][] }

/** Trims, drops blanks and duplicates (case-insensitive), caps length and count. */
export function cleanNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value) {
    if (typeof raw !== "string") continue;
    const name = raw.replace(/\s+/g, " ").trim().slice(0, 60);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) continue;
    seen.add(key);
    out.push(name);
    if (out.length >= WHEEL_MAX_NAMES) break;
  }
  return out;
}

export function cleanListName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.replace(/\s+/g, " ").trim().slice(0, 60);
  return name || null;
}

/** Keeps only drawn names still on the list. */
export function keepDrawn(names: string[], drawn: unknown): string[] {
  const on = new Set(names);
  return Array.isArray(drawn) ? drawn.filter((d): d is string => typeof d === "string" && on.has(d)) : [];
}

/** No-repeat pick: chooses among names not drawn yet; starts a new round when everyone had a turn. */
export function pickNext(names: string[], drawn: string[], rand: () => number) {
  if (!names.length) return null;
  const done = new Set(keepDrawn(names, drawn));
  let pool = names.filter((n) => !done.has(n));
  let round = false;
  if (!pool.length) { pool = names; done.clear(); round = true; }
  const pick = pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
  done.add(pick);
  return { pick, drawn: names.filter((n) => done.has(n)), newRound: round, left: names.length - done.size };
}

/** Random groups of about `size`; leftovers join existing groups instead of forming a tiny one. */
export function makeGroups(names: string[], size: number, rand: () => number): string[][] {
  const n = Math.max(2, Math.min(50, Math.floor(size) || 2));
  const shuffled = [...names];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const count = Math.max(1, Math.floor(shuffled.length / n));
  const groups: string[][] = Array.from({ length: count }, () => []);
  shuffled.forEach((name, i) => groups[i % count].push(name));
  return groups;
}

export function addHistory(history: unknown, entry: WheelPick): WheelPick[] {
  const prev = Array.isArray(history) ? (history as WheelPick[]) : [];
  return [entry, ...prev].slice(0, WHEEL_MAX_HISTORY);
}

/** Free users keep one cloud list with no-repeat picks and history; more lists and groups need Pro. */
export function wheelAllowed(action: "create" | "groups" | "other", hasPlan: boolean, listCount: number): boolean {
  if (hasPlan) return true;
  if (action === "groups") return false;
  if (action === "create") return listCount < WHEEL_FREE_LISTS;
  return true;
}
