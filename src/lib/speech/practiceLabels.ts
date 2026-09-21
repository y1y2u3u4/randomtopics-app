import type { SpeechFocus } from "./schema";

export const focusLabels: Record<SpeechFocus, string> = {
  relevance: "answering the question", point: "a clear point", example: "a concrete example",
  ending: "a complete ending", concise: "a shorter answer",
};

