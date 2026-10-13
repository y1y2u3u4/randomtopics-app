// Logic for the random name picker and the number randomizer. Pure functions
// over an injected RNG so they can be unit-tested.
import { shuffle, type Rng } from "@/lib/randomGenerators";

/** Unbiased integer in [min, max] (inclusive). */
export function randomInt(min: number, max: number, rng: Rng): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export interface NumberDraw { numbers: number[]; error?: string }

export const MAX_NUMBERS = 1000;
export const MAX_RANGE = 1_000_000_000;

/**
 * Draw `count` numbers between min and max. With `unique`, no number repeats
 * (like drawing raffle tickets); without it, each draw is independent (like dice).
 */
export function drawNumbers(min: number, max: number, count: number, unique: boolean, rng: Rng): NumberDraw {
  if (![min, max, count].every(Number.isInteger)) return { numbers: [], error: "Use whole numbers." };
  if (Math.abs(min) > MAX_RANGE || Math.abs(max) > MAX_RANGE) return { numbers: [], error: "Keep numbers between −1,000,000,000 and 1,000,000,000." };
  if (min > max) [min, max] = [max, min];
  if (count < 1) return { numbers: [], error: "Pick at least one number." };
  if (count > MAX_NUMBERS) return { numbers: [], error: `Pick at most ${MAX_NUMBERS} numbers at once.` };
  const size = max - min + 1;
  if (unique && count > size) return { numbers: [], error: `There are only ${size} numbers between ${min} and ${max}. Lower the count or allow repeats.` };
  if (!unique) return { numbers: Array.from({ length: count }, () => randomInt(min, max, rng)) };
  // Small ranges: shuffle the whole range. Large ranges: rejection sampling.
  if (size <= 20_000) return { numbers: shuffle(Array.from({ length: size }, (_, i) => min + i), rng).slice(0, count) };
  const seen = new Set<number>();
  const out: number[] = [];
  while (out.length < count) {
    const n = randomInt(min, max, rng);
    if (!seen.has(n)) { seen.add(n); out.push(n); }
  }
  return { numbers: out };
}

export interface NamePick { picked: string[]; remaining: string[] }

/**
 * Pick `count` names at random. With `removePicked`, winners leave the pool so
 * the next pick never repeats (pass the previous `remaining` back in).
 */
export function pickNames(pool: readonly string[], count: number, removePicked: boolean, rng: Rng): NamePick {
  const n = Math.max(0, Math.min(Math.floor(count), pool.length));
  const order = shuffle(pool, rng);
  const picked = order.slice(0, n);
  if (!removePicked) return { picked, remaining: [...pool] };
  // Remove one occurrence per pick so duplicate names in the list stay fair.
  const remaining = [...pool];
  for (const name of picked) remaining.splice(remaining.indexOf(name), 1);
  return { picked, remaining };
}

/** A random order for everyone, e.g. who presents first. */
export function randomOrder(pool: readonly string[], rng: Rng): string[] {
  return shuffle(pool, rng);
}
