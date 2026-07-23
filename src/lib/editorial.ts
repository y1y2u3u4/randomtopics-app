import { topics } from "@/data/topics";
import type { Category, Mode, Topic } from "@/data/types";

// Deterministic editorial selection for reference lists: spread picks across
// depth levels so the list shows the range of the pool, not just one register.
// Deterministic (no randomness) so SSR output is stable for crawlers.
function spreadByDepth(pool: Topic[], count: number): Topic[] {
  const byDepth = {
    deep: pool.filter((t) => t.depth === "deep"),
    medium: pool.filter((t) => t.depth === "medium"),
    light: pool.filter((t) => t.depth === "light"),
  };
  const picks = [
    ...byDepth.deep.slice(0, 3),
    ...byDepth.medium.slice(0, 3),
    ...byDepth.light.slice(0, 2),
  ];
  for (const t of pool) {
    if (picks.length >= count) break;
    if (!picks.includes(t)) picks.push(t);
  }
  return picks.slice(0, count);
}

export function pickCategoryTopics(category: Category, count = 8): Topic[] {
  return spreadByDepth(topics.filter((t) => t.category === category), count);
}

export function pickModeTopics(mode: Mode, count = 8): Topic[] {
  return spreadByDepth(topics.filter((t) => t.modes.includes(mode)), count);
}

// Homepage feature: one strong topic from each of the first `count` categories,
// so the front page shows the breadth of the curated database.
export function pickFeaturedTopics(count = 6): Topic[] {
  const seen = new Set<string>();
  const picks: Topic[] = [];
  for (const t of topics) {
    if (picks.length >= count) break;
    if (seen.has(t.category)) continue;
    if (t.depth === "deep" || t.depth === "medium") {
      seen.add(t.category);
      picks.push(t);
    }
  }
  return picks;
}
