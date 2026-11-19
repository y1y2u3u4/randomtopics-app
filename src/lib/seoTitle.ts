/** Google shows ~60-70 chars. Article metaTitles end with " | RandomTopics"; when the full
 * string is over the limit, drop the brand so the keyword phrase is not truncated
 * (onpage-audit 2026-11-19: /es/topics/random-essay-topics-for-college rendered 98 chars). */
export const TITLE_MAX = 70;
const BRAND = " | RandomTopics";

export function seoTitle(metaTitle: string): string {
  if (metaTitle.length <= TITLE_MAX) return metaTitle;
  return metaTitle.endsWith(BRAND) ? metaTitle.slice(0, -BRAND.length) : metaTitle;
}
