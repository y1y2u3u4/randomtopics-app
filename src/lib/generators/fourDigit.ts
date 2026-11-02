export type RandomInt = (maxExclusive: number) => number;

/** Uniform integer in [0, max) from the browser's cryptographic generator (rejection sampling, no modulo bias). */
export const cryptoInt: RandomInt = (max) => {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do crypto.getRandomValues(buf); while (buf[0] >= limit);
  return buf[0] % max;
};

export interface FourDigitOptions {
  count: number;
  /** "pin" = 0000-9999 with leading zeros; "no-zero" = 1000-9999. */
  range: "pin" | "no-zero";
  unique: boolean;
  noRepeatedDigits: boolean;
  avoidWeak: boolean;
  avoidYears: boolean;
}

export const DEFAULT_FOUR_DIGIT: FourDigitOptions = { count: 10, range: "pin", unique: true, noRepeatedDigits: false, avoidWeak: true, avoidYears: false };
export const MAX_COUNT = 100;

/** PINs that are guessed first in practice (all-same digits, simple sequences, repeated pairs and a few famous ones). */
const COMMON = new Set(["1004", "2000", "2001", "1122", "1313", "6969", "4200", "1010", "0101", "1230", "0007", "1337"]);

export function isWeakPin(s: string): boolean {
  const d = Array.from(s, Number);
  if (d.every((x) => x === d[0])) return true; // 0000, 1111 ...
  if (d.every((x, i) => i === 0 || x - d[i - 1] === 1)) return true; // 1234, 0123
  if (d.every((x, i) => i === 0 || d[i - 1] - x === 1)) return true; // 4321, 9876
  if (d[0] === d[2] && d[1] === d[3]) return true; // 1212
  if (d[0] === d[1] && d[2] === d[3]) return true; // 1122, 7733
  return COMMON.has(s);
}

export const looksLikeYear = (n: number) => n >= 1950 && n <= 2030;

export function candidatePool(o: Pick<FourDigitOptions, "range" | "noRepeatedDigits" | "avoidWeak" | "avoidYears">): string[] {
  const out: string[] = [];
  for (let n = o.range === "pin" ? 0 : 1000; n <= 9999; n++) {
    const s = String(n).padStart(4, "0");
    if (o.noRepeatedDigits && new Set(s).size < 4) continue;
    if (o.avoidWeak && isWeakPin(s)) continue;
    if (o.avoidYears && looksLikeYear(n)) continue;
    out.push(s);
  }
  return out;
}

export interface FourDigitResult { numbers: string[]; poolSize: number; note?: string }

export function generateFourDigit(o: FourDigitOptions, rand: RandomInt = cryptoInt): FourDigitResult {
  const pool = candidatePool(o);
  const want = Math.max(1, Math.min(MAX_COUNT, Math.floor(o.count) || 1));
  if (!pool.length) return { numbers: [], poolSize: 0, note: "No numbers match these settings." };
  if (!o.unique) return { numbers: Array.from({ length: want }, () => pool[rand(pool.length)]), poolSize: pool.length };
  const copy = pool.slice();
  const take = Math.min(want, copy.length);
  const numbers: string[] = [];
  for (let i = 0; i < take; i++) {
    const j = i + rand(copy.length - i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
    numbers.push(copy[i]);
  }
  return { numbers, poolSize: pool.length, note: take < want ? `Only ${pool.length} numbers match these settings, so that is all you get.` : undefined };
}
