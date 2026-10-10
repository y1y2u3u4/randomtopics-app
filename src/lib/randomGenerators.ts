// Shared, dependency-free logic for the random generator pages (team, animal,
// name generators). Everything here is pure so it can be unit-tested and so a
// shared link (seed + filters in the URL) reproduces exactly the same result.

export type Rng = () => number;

/** Small deterministic PRNG (mulberry32). Same seed → same sequence. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fresh seed for a new draw; kept short so it reads well in a URL. */
export function newSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647) + 1;
}

export function parseSeed(value: string | null | undefined): number | null {
  if (!value || !/^\d{1,10}$/.test(value)) return null;
  const n = Number(value);
  return n > 0 && n <= 4_294_967_295 ? n : null;
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface DrawResult<T> {
  picks: T[];
  /** Keys already shown in the current cycle (including these picks). */
  used: string[];
  /** True when the pool was exhausted and the cycle restarted. */
  cycled: boolean;
}

/**
 * Draw `count` distinct items, never repeating an item until every item in the
 * pool has been shown once. `used` carries the keys shown so far.
 */
export function drawUnique<T>(
  pool: readonly T[],
  count: number,
  key: (item: T) => string,
  used: readonly string[],
  rng: Rng,
): DrawResult<T> {
  const want = Math.max(0, Math.min(Math.floor(count), pool.length));
  if (want === 0) return { picks: [], used: used.slice(), cycled: false };
  const usedSet = new Set(used);
  let fresh = pool.filter((item) => !usedSet.has(key(item)));
  const picks: T[] = [];
  let cycled = false;
  if (fresh.length < want) {
    // Show the remaining unseen items first, then restart the cycle with
    // everything else, so nothing repeats inside a single draw.
    picks.push(...shuffle(fresh, rng));
    const taken = new Set(picks.map(key));
    usedSet.clear();
    fresh = pool.filter((item) => !taken.has(key(item)));
    cycled = true;
  }
  picks.push(...shuffle(fresh, rng).slice(0, want - picks.length));
  for (const p of picks) usedSet.add(key(p));
  return { picks, used: [...usedSet], cycled };
}

/* ------------------------------------------------------------------ */
/* Team generator                                                       */
/* ------------------------------------------------------------------ */

export interface Person {
  id: string;
  name: string;
  /** Optional group label to spread evenly, e.g. "girl" / "boy". */
  tag?: string;
  /** Optional skill level 1–5 to balance team strength. */
  level?: number;
}

export interface TeamOptions {
  /** Either a number of teams, or a target number of people per team. */
  mode: "teams" | "size";
  value: number;
  balanceTag?: boolean;
  balanceLevel?: boolean;
  /** person id → team index that must be kept. */
  locks?: Record<string, number>;
}

/** Parse a pasted list: one name per line, or comma / semicolon separated. */
export function parseNames(text: string): string[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const parts =
    lines.length === 1 && /[,;]/.test(lines[0])
      ? lines[0].split(/[,;]/)
      : lines.flatMap((line) => (/[;]/.test(line) ? line.split(";") : [line]));
  return parts
    .map((p) => p.replace(/^\s*(?:\d+[.)]|[-*•])\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 500);
}

export function teamCountFor(people: number, opts: Pick<TeamOptions, "mode" | "value">): number {
  const value = Math.max(1, Math.floor(opts.value) || 1);
  if (people <= 0) return opts.mode === "teams" ? value : 1;
  const count = opts.mode === "teams" ? value : Math.ceil(people / value);
  return Math.max(1, Math.min(count, people));
}

/**
 * Split people into teams. Guarantees, whenever locks allow it:
 *  - every person appears exactly once,
 *  - team sizes differ by at most one,
 *  - with balanceTag, each tag's count differs by at most one between teams,
 *  - with balanceLevel, strength totals are spread by a greedy snake draft,
 *  - locked people stay on their team.
 */
export function makeTeams(people: readonly Person[], opts: TeamOptions, rng: Rng): Person[][] {
  const n = teamCountFor(people.length, opts);
  const teams: Person[][] = Array.from({ length: n }, () => []);
  if (people.length === 0) return teams;

  const locks = opts.locks ?? {};
  const free: Person[] = [];
  for (const p of people) {
    const idx = locks[p.id];
    if (Number.isInteger(idx) && idx >= 0 && idx < n) teams[idx].push(p);
    else free.push(p);
  }

  const base = Math.floor(people.length / n);
  const extra = people.length % n;
  const atMax = () => teams.filter((t) => t.length >= base + 1).length;
  const hasRoom = (t: Person[]) => t.length < base || (t.length === base && atMax() < extra);
  const levelOf = (p: Person) => (typeof p.level === "number" ? p.level : 3);
  const strength = (t: Person[]) => t.reduce((s, p) => s + levelOf(p), 0);

  // Random order first, so ties are broken fairly and reruns differ.
  let order = shuffle(free, rng);
  if (opts.balanceLevel) order = order.slice().sort((a, b) => levelOf(b) - levelOf(a));
  if (opts.balanceTag) {
    const groups = new Map<string, Person[]>();
    for (const p of order) {
      const key = p.tag?.trim().toLowerCase() || "";
      groups.set(key, [...(groups.get(key) ?? []), p]);
    }
    // Largest tag groups first; untagged people last fill the gaps.
    order = [...groups.entries()]
      .sort((a, b) => (a[0] === "" ? 1 : b[0] === "" ? -1 : b[1].length - a[1].length))
      .flatMap(([, list]) => list);
  }

  const tagCount = (t: Person[], tag: string) =>
    t.filter((p) => (p.tag?.trim().toLowerCase() || "") === tag).length;

  for (const p of order) {
    const tag = p.tag?.trim().toLowerCase() || "";
    let candidates = teams.map((t, i) => i).filter((i) => hasRoom(teams[i]));
    if (candidates.length === 0) candidates = teams.map((t, i) => i);
    const tieBreak = shuffle(candidates, rng);
    tieBreak.sort((a, b) => {
      if (opts.balanceTag && tag) {
        const d = tagCount(teams[a], tag) - tagCount(teams[b], tag);
        if (d !== 0) return d;
      }
      if (opts.balanceLevel) {
        const d = strength(teams[a]) - strength(teams[b]);
        if (d !== 0) return d;
      }
      return teams[a].length - teams[b].length;
    });
    teams[tieBreak[0]].push(p);
  }
  return teams;
}

/* ------------------------------------------------------------------ */
/* URL state helpers                                                    */
/* ------------------------------------------------------------------ */

/** Encode a UTF-8 string as URL-safe base64 (no padding). */
export function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(value: string): string | null {
  try {
    const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** Filter a pool by a list of facets; an empty selection means "all". */
export function filterBy<T>(pool: readonly T[], selected: readonly string[], facets: (item: T) => readonly string[]): T[] {
  if (selected.length === 0) return pool.slice();
  const want = new Set(selected);
  return pool.filter((item) => facets(item).some((f) => want.has(f)));
}

/** Clamp the "how many" control to a sane range. */
export function clampCount(value: unknown, max: number, fallback = 1): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return Math.min(fallback, max);
  return Math.min(n, max);
}
