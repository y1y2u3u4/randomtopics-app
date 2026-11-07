// Pure helpers for the single-elimination bracket maker. Slots hold entrant
// indexes (or -1 for a bye); picks[r][m] holds the chosen winner's index.

export const BRACKET_SIZES = [4, 8, 16, 32, 64] as const;

export function bracketSizeFor(n: number): number {
  for (const s of BRACKET_SIZES) if (n <= s) return s;
  return BRACKET_SIZES[BRACKET_SIZES.length - 1];
}

/** First-round slots with byes spread so no match is bye vs bye. */
export function buildSlots(order: readonly number[], size: number): number[] {
  const byes = Math.max(0, size - order.length);
  const slots: number[] = [];
  let k = 0;
  for (let m = 0; m < size / 2; m += 1) {
    if (m < byes) slots.push(order[k++] ?? -1, -1);
    else slots.push(order[k++] ?? -1, order[k++] ?? -1);
  }
  return slots;
}

export function roundCount(size: number): number {
  return Math.round(Math.log2(size));
}

/** Resolve every match: who plays and who (if anyone yet) wins. */
export function resolveBracket(slots: readonly number[], picks: readonly (readonly number[])[]) {
  const rounds: { a: number; b: number; winner: number }[][] = [];
  const total = roundCount(slots.length);
  for (let r = 0; r < total; r += 1) {
    const matches: { a: number; b: number; winner: number }[] = [];
    const count = slots.length / 2 ** (r + 1);
    for (let m = 0; m < count; m += 1) {
      const a = r === 0 ? slots[2 * m] : rounds[r - 1][2 * m].winner;
      const b = r === 0 ? slots[2 * m + 1] : rounds[r - 1][2 * m + 1].winner;
      const pick = picks[r]?.[m] ?? -1;
      let winner = -1;
      if (r === 0 && a >= 0 && b < 0) winner = a;
      else if (r === 0 && b >= 0 && a < 0) winner = b;
      else if (pick >= 0 && (pick === a || pick === b) && a >= 0 && b >= 0) winner = pick;
      matches.push({ a, b, winner });
    }
    rounds.push(matches);
  }
  return rounds;
}

export function roundName(r: number, total: number): string {
  const left = total - r;
  if (left === 1) return "Final";
  if (left === 2) return "Semifinals";
  if (left === 3) return "Quarterfinals";
  return `Round ${r + 1}`;
}
