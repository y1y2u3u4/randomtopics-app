import type { Category, Depth, Mode, Topic } from "@/data/types";

export function filterTopicPool(topics: Topic[], filters: { mode?: Mode | null; category?: Category | null; depth?: Depth | null }) {
  return topics.filter((topic) => (!filters.mode || topic.modes.includes(filters.mode))
    && (!filters.category || topic.category === filters.category)
    && (!filters.depth || topic.depth === filters.depth));
}

/** Finish the current pool before starting another cycle; never mutate history. */
export function drawUnseen<T>(pool: T[], used: ReadonlySet<string>, key: (item: T) => string, count = 1, random = Math.random) {
  const unique = [...new Map(pool.map((item) => [key(item), item])).values()];
  const history = new Set(used);
  const picked: T[] = [];
  const target = Math.max(0, Math.min(Math.floor(count), unique.length));
  while (picked.length < target) {
    const inBatch = new Set(picked.map(key));
    let candidates = unique.filter((item) => !history.has(key(item)) && !inBatch.has(key(item)));
    if (!candidates.length) {
      unique.forEach((item) => history.delete(key(item)));
      picked.forEach((item) => history.add(key(item)));
      candidates = unique.filter((item) => !inBatch.has(key(item)));
    }
    const item = candidates[Math.min(candidates.length - 1, Math.max(0, Math.floor(random() * candidates.length)))];
    picked.push(item);
    history.add(key(item));
  }
  return { picked, used: history };
}
