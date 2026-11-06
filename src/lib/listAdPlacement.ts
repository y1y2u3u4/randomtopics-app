// Where the one mid-list ad unit goes on a long list page (2026-11-06).
//
// `sizes[i]` is how many list items section i holds. The unit goes right AFTER the first section
// at or beyond the middle of the page where the sections since the middle hold at least `minItems`
// items (a screen or two of reading, roughly 45px per item), so it is never next to the mid-page
// call-to-action button (which sits just before the middle) nor the end-of-list generator button
// (after the last section). Returns -1 when the list is too short: then no mid unit is rendered.
export const LIST_AD_MIN_ITEMS = 8;

export function listAdAfter(sizes: number[], minItems = LIST_AD_MIN_ITEMS): number {
  const n = sizes.length;
  if (n < 3) return -1;
  let items = 0;
  for (let i = Math.floor(n / 2); i <= n - 2; i++) {
    items += sizes[i];
    if (items >= minItems) return i;
  }
  return -1;
}
