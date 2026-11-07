import { createRng, shuffle, type Rng } from "./randomGenerators";

/** Parse "Ann, Bob" / "Ann - Bob" / "Ann & Bob" lines into blocked pairs. */
export function parseExclusions(text: string, names: readonly string[]): [number, number][] {
  const index = new Map(names.map((n, i) => [n.trim().toLowerCase(), i]));
  const pairs: [number, number][] = [];
  for (const line of text.split(/\r?\n/)) {
    const parts = line.split(/\s*(?:,|&|\+|\band\b|-|–|—|\/)\s*/i).map((p) => p.trim().toLowerCase()).filter(Boolean);
    const ids = parts.map((p) => index.get(p)).filter((i): i is number => i !== undefined);
    for (let a = 0; a < ids.length; a += 1) for (let b = a + 1; b < ids.length; b += 1) if (ids[a] !== ids[b]) pairs.push([ids[a], ids[b]]);
  }
  return pairs;
}

/**
 * Assign each giver one receiver: nobody draws themselves, nobody draws a
 * blocked partner, everyone receives exactly one gift. Random backtracking
 * search; returns null when the rules make a draw impossible.
 */
export function drawSecretSanta(count: number, blocked: readonly [number, number][], seed: number): number[] | null {
  if (count < 2) return null;
  const no = new Set(blocked.flatMap(([a, b]) => [`${a}>${b}`, `${b}>${a}`]));
  const rng: Rng = createRng(seed);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const givers = shuffle(Array.from({ length: count }, (_, i) => i), rng);
    const taken = new Set<number>();
    const result = new Array<number>(count).fill(-1);
    let steps = 0;
    const place = (k: number): boolean => {
      if (k === givers.length) return true;
      if ((steps += 1) > 20000) return false;
      const g = givers[k];
      for (const r of shuffle(Array.from({ length: count }, (_, i) => i), rng)) {
        if (r === g || taken.has(r) || no.has(`${g}>${r}`)) continue;
        taken.add(r);
        result[g] = r;
        if (place(k + 1)) return true;
        taken.delete(r);
        result[g] = -1;
      }
      return false;
    };
    if (place(0)) return result;
  }
  return null;
}
