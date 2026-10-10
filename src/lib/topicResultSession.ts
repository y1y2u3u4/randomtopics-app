import { CATEGORIES, DEPTHS, MODES, type Category, type Depth, type Mode, type Topic } from "@/data/types";

export interface TopicResultSession {
  topicIds: string[];
  usedIds: string[];
  mode: Mode | null;
  category: Category | null;
  depth: Depth | null;
  count: number;
}

const MAX_AGE = 2 * 60 * 60 * 1000;
const key = (scope: string) => `rt_result_v1:${scope}:${window.location.pathname}`;

// Tab-local, bounded snapshots of editorial IDs only. Never store a transcript,
// account, checkout, arbitrary text, or URL query, and never emit an event here.
export function saveTopicResult(scope: string, result: TopicResultSession): void {
  const { topicIds, usedIds, mode, category, depth, count } = result;
  try { sessionStorage.setItem(key(scope), JSON.stringify({ savedAt: Date.now(), topicIds, usedIds, mode, category, depth, count })); }
  catch { /* Storage is optional; generation and copying still work. */ }
}

export function readTopicResult(scope: string, topics: Topic[]): TopicResultSession | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key(scope)) || "null");
    if (!value || !Number.isFinite(value.savedAt) || Date.now() - value.savedAt < 0 || Date.now() - value.savedAt > MAX_AGE) return null;
    const ids = new Set(topics.map(topic => topic.id));
    const validIds = (items: unknown, limit: number): items is string[] => Array.isArray(items)
      && items.length <= limit && new Set(items).size === items.length && items.every(id => typeof id === "string" && ids.has(id));
    if (!validIds(value.topicIds, 10) || !value.topicIds.length || !validIds(value.usedIds, topics.length)) return null;
    if (value.mode !== null && !MODES.some(mode => mode.id === value.mode)) return null;
    if (value.category !== null && !CATEGORIES.some(category => category.id === value.category)) return null;
    if (value.depth !== null && !DEPTHS.some(depth => depth.id === value.depth)) return null;
    if (![1, 3, 5, 10].includes(value.count) || value.topicIds.length > value.count) return null;
    return { topicIds: value.topicIds, usedIds: value.usedIds, mode: value.mode, category: value.category, depth: value.depth, count: value.count };
  } catch { return null; }
}
