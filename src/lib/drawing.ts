import { DRAWING_PROMPTS, type DrawingPrompt } from "@/data/drawingPrompts";
export function drawingPool(category: string, difficulty: string): DrawingPrompt[] {
  return DRAWING_PROMPTS.filter(p => (category === "all" || p.category === category) && (difficulty === "all" || p.difficulty === difficulty));
}
/** Sample without replacement; callers explicitly start a new round at exhaustion. */
export function pickDrawings(pool: DrawingPrompt[], seen: readonly string[], count: number, random = Math.random): DrawingPrompt[] {
  const available = pool.filter(p => !seen.includes(p.id));
  const picks: DrawingPrompt[] = [];
  const target = Math.min(Math.max(0, Math.floor(count)), available.length);
  for (let i = 0; i < target; i++) {
    const index = Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)));
    picks.push(...available.splice(index, 1));
  }
  return picks;
}
