import type { Topic } from "../data/types";

export const handoffSources = {
  home: { path: "/", locale: "en" },
  wheel: { path: "/spin-the-wheel", locale: "en" },
  es_article: { path: "/es/topics/public-speaking-topics-for-beginners", locale: "es" },
} as const;
export type HandoffSource = keyof typeof handoffSources;
export type Handoff = { source: HandoffSource; topic: Topic; at: number };
export const HANDOFF_TTL = 2 * 60 * 60_000;
export function parseHandoff(raw: string | null, now = Date.now()): Handoff | null {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || !Object.hasOwn(handoffSources, value.source) || !Number.isFinite(value.at) || value.at > now || now - value.at > HANDOFF_TTL) return null;
    const t = value.topic;
    const categories = ["science", "technology", "philosophy", "psychology", "history", "art-culture", "food-travel", "relationships", "education", "politics", "entertainment", "sports", "business", "nature", "health", "weird-fun"];
    if (!t || typeof t.id !== "string" || t.id.length > 200 || typeof t.text !== "string" || !t.text.trim() || t.text.length > 3000 || !categories.includes(t.category) || !["light", "medium", "deep"].includes(t.depth) || !Array.isArray(t.modes) || !t.modes.every((m: unknown) => ["conversation", "writing", "debate", "speech", "icebreaker"].includes(String(m))) || !Array.isArray(t.talkingPoints) || t.talkingPoints.length > 20 || !t.talkingPoints.every((p: unknown) => typeof p === "string" && p.length < 3000)) return null;
    return { source: value.source, at: value.at, topic: { id: t.id, text: t.text, category: t.category, modes: t.modes, depth: t.depth, talkingPoints: t.talkingPoints } };
  } catch { return null; }
}
export function handoffKey() {
  const qa = new URLSearchParams(window.location.search).get("usage_qa") === "1" || window.sessionStorage.getItem("rt_usage_qa") === "1";
  return `rt-topic-handoff-v1-${qa ? "qa" : "natural"}`;
}
