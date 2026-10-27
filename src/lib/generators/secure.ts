// Random numbers from the browser's cryptographic source (crypto.getRandomValues)
// with rejection sampling, so every outcome is exactly equally likely. Falls
// back to Math.random only where Web Crypto is missing (very old browsers).
import type { Rng } from "@/lib/randomGenerators";

/** Unbiased integer in [0, n). */
export function secureInt(n: number): number {
  if (n <= 1) return 0;
  const c = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (!c?.getRandomValues) return Math.floor(Math.random() * n);
  const limit = 0x1_0000_0000 - (0x1_0000_0000 % n);
  const buf = new Uint32Array(1);
  do { c.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % n;
}

/** An Rng ([0,1) floats) that draws from secureInt. */
export const secureRng: Rng = () => secureInt(0x1_0000_0000) / 0x1_0000_0000;

/** Pick an index with probability proportional to its weight. */
export function weightedIndex(weights: readonly number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = (secureInt(1_000_000) / 1_000_000) * total;
  for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r < 0) return i; }
  return weights.length - 1;
}
