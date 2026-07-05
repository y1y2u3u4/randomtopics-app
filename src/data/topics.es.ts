import { Topic } from "./types";
import { topics } from "./topics";
import { topicsEsPart1 } from "./topics.es.part1";
import { topicsEsPart2 } from "./topics.es.part2";
import { topicsEsPart3 } from "./topics.es.part3";
import { topicsEsPart4 } from "./topics.es.part4";
import type { Locale } from "@/i18n/config";

// Merged Spanish translation map (text + talkingPoints) keyed by topic id.
// The 512 entries are produced from the 4 category fragments.
export const topicsEs: Record<string, { text: string; talkingPoints: string[] }> = {
  ...topicsEsPart1,
  ...topicsEsPart2,
  ...topicsEsPart3,
  ...topicsEsPart4,
};

/**
 * Returns the topic database localized to the given locale. English returns the
 * source array untouched; Spanish overlays translated text/talkingPoints while
 * preserving id/category/modes/depth (single source of truth for structure).
 */
export function getLocalizedTopics(locale: Locale): Topic[] {
  if (locale !== "es") return topics;
  return topics.map((t) => {
    const es = topicsEs[t.id];
    return es ? { ...t, text: es.text, talkingPoints: es.talkingPoints } : t;
  });
}
