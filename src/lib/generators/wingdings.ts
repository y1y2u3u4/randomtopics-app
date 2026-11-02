// Wingdings -> Unicode. Code points follow the Wingdings table in the Unicode
// 7.0 character-set mapping (as reproduced on Wikipedia's "Wingdings" page), so the
// output is plain text that can be copied anywhere. ASCII keys only; space stays a space.

export const WINGDINGS_PAIRS: readonly (readonly [string, number])[] = [
  ["!", 0x1F589],
  ["\"", 0x2702],
  ["#", 0x2701],
  ["$", 0x1F453],
  ["%", 0x1F56D],
  ["&", 0x1F56E],
  ["'", 0x1F56F],
  ["(", 0x1F57F],
  [")", 0x2706],
  ["*", 0x1F582],
  ["+", 0x1F583],
  [",", 0x1F4EA],
  ["-", 0x1F4EB],
  [".", 0x1F4EC],
  ["/", 0x1F4ED],
  ["0", 0x1F5C0],
  ["1", 0x1F5C1],
  ["2", 0x1F5CE],
  ["3", 0x1F5CF],
  ["4", 0x1F5D0],
  ["5", 0x1F5C4],
  ["6", 0x23F3],
  ["7", 0x1F5AE],
  ["8", 0x1F5B0],
  ["9", 0x1F5B2],
  [":", 0x1F5B3],
  [";", 0x1F5B4],
  ["<", 0x1F5AB],
  ["=", 0x1F5AC],
  [">", 0x2707],
  ["?", 0x270D],
  ["@", 0x1F58E],
  ["A", 0x270C],
  ["B", 0x1F58F],
  ["C", 0x1F44D],
  ["D", 0x1F44E],
  ["E", 0x261C],
  ["F", 0x261E],
  ["G", 0x261D],
  ["H", 0x1F597],
  ["I", 0x1F590],
  ["J", 0x263A],
  ["K", 0x1F610],
  ["L", 0x2639],
  ["M", 0x1F4A3],
  ["N", 0x1F571],
  ["O", 0x1F3F3],
  ["P", 0x1F3F1],
  ["Q", 0x2708],
  ["R", 0x263C],
  ["S", 0x1F322],
  ["T", 0x2744],
  ["U", 0x1F546],
  ["V", 0x271E],
  ["W", 0x1F548],
  ["X", 0x2720],
  ["Y", 0x2721],
  ["Z", 0x262A],
  ["[", 0x262F],
  ["\\", 0x1F549],
  ["]", 0x2638],
  ["^", 0x2648],
  ["_", 0x2649],
  ["`", 0x264A],
  ["a", 0x264B],
  ["b", 0x264C],
  ["c", 0x264D],
  ["d", 0x264E],
  ["e", 0x264F],
  ["f", 0x2650],
  ["g", 0x2651],
  ["h", 0x2652],
  ["i", 0x2653],
  ["j", 0x1F670],
  ["k", 0x1F675],
  ["l", 0x26AB],
  ["m", 0x1F53E],
  ["n", 0x25FC],
  ["o", 0x1F78F],
  ["p", 0x1F790],
  ["q", 0x2751],
  ["r", 0x2752],
  ["s", 0x1F79F],
  ["t", 0x29EB],
  ["u", 0x25C6],
  ["v", 0x2756],
  ["w", 0x1F799],
  ["x", 0x2327],
  ["y", 0x2BB9],
  ["z", 0x2318],
  ["{", 0x1F3F5],
  ["|", 0x1F3F6],
  ["}", 0x1F676],
  ["~", 0x1F677],
];

/** Other code points that older converters used for the same glyph; accepted when decoding. */
const ALIASES: readonly (readonly [number, string])[] = [
  [0x1f44c, "B"], [0x2620, "N"], [0x1f4a7, "S"], [0x25cf, "l"], [0x25a0, "n"], [0x25a1, "o"],
  [0x2b27, "s"], [0x2b25, "w"], [0x2353, "y"], [0x1f4c1, "0"], [0x1f4c2, "1"], [0x1f4c4, "2"], [0x231b, "6"],
];

const ENCODE = new Map<string, string>(WINGDINGS_PAIRS.map(([k, cp]) => [k, String.fromCodePoint(cp)]));
const DECODE = new Map<string, string>([
  ...ALIASES.map(([cp, k]) => [String.fromCodePoint(cp), k] as [string, string]),
  ...WINGDINGS_PAIRS.map(([k, cp]) => [String.fromCodePoint(cp), k] as [string, string]),
]);

export function symbolFor(ch: string): string | undefined {
  return ENCODE.get(ch);
}

/** Plain text -> Wingdings symbols. Characters with no Wingdings glyph (accents, emoji) pass through. */
export function toWingdings(text: string): string {
  let out = "";
  for (const ch of text) out += ENCODE.get(ch) ?? ch;
  return out;
}

/** Wingdings symbols -> plain text. Variation selectors are ignored; unknown characters pass through. */
export function fromWingdings(text: string): string {
  let out = "";
  for (const ch of text) {
    if (ch === "\uFE0E" || ch === "\uFE0F") continue;
    out += DECODE.get(ch) ?? ch;
  }
  return out;
}

/** Per-character pairs for the "letter under each symbol" view. */
export function wingdingsPairs(text: string): { src: string; sym: string }[] {
  return Array.from(text).map((ch) => ({ src: ch, sym: ENCODE.get(ch) ?? ch }));
}

const range = (from: string, to: string) =>
  Array.from({ length: to.charCodeAt(0) - from.charCodeAt(0) + 1 }, (_, i) => String.fromCharCode(from.charCodeAt(0) + i));
export const UPPER = range("A", "Z");
export const LOWER = range("a", "z");
export const DIGITS = range("0", "9");
export const PUNCT = WINGDINGS_PAIRS.map(([k]) => k).filter((k) => !/[A-Za-z0-9]/.test(k));
