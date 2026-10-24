// Prompt pools for Host mode. Imported only when Host mode opens, so the large
// data files stay out of the page bundle.
export const HOST_GENERATORS = {
  charades: "Charades",
  "this-or-that": "This or That",
  "would-you-rather": "Would You Rather",
  "truth-or-dare": "Truth or Dare",
  "question-of-the-day": "Question of the Day",
  icebreaker: "Icebreakers",
  debate: "Debate topics",
} as const;
export type HostGenerator = keyof typeof HOST_GENERATORS;

export interface HostCard { text: string; sub?: string }

export async function loadHostPool(generator: HostGenerator): Promise<HostCard[]> {
  switch (generator) {
    case "charades": {
      const { CHARADES_WORDS, CHARADES_CATEGORIES } = await import("@/data/charades");
      const label = new Map(CHARADES_CATEGORIES.map((c) => [c.id, c.label]));
      return CHARADES_WORDS.map((w) => ({ text: w.w, sub: label.get(w.c) ?? undefined }));
    }
    case "this-or-that":
      return (await import("@/data/partyGames")).THIS_OR_THAT.map((text) => ({ text }));
    case "truth-or-dare":
      return (await import("@/data/partyGames")).TRUTH_OR_DARE.map((text) => ({ text }));
    case "would-you-rather":
      return (await import("@/data/partyQuestions")).WOULD_YOU_RATHER.map((text) => ({ text }));
    case "question-of-the-day":
      return (await import("@/data/questionOfTheDay")).QOTD_QUESTIONS.map((q) => ({ text: q.q }));
    case "icebreaker":
    case "debate": {
      const { topics } = await import("@/data/topics");
      return topics.filter((t) => t.modes.includes(generator)).map((t) => ({ text: t.text }));
    }
  }
}

/** Next unseen index (no repeats until reset). Returns null when every prompt was shown. */
export function nextUnseen(size: number, seen: ReadonlySet<number>, random = Math.random): number | null {
  const left = size - seen.size;
  if (left <= 0) return null;
  let k = Math.floor(random() * left);
  for (let i = 0; i < size; i++) {
    if (seen.has(i)) continue;
    if (k === 0) return i;
    k--;
  }
  return null;
}
