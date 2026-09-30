import type { SpeechFeedback } from "./schema";
import { nextRound } from "./nextRound";
import type { SpeechPurpose } from "./purpose";

// Assemble saved evidence only. Never rewrite a user's answer or invent an
// improvement, and never send this private content to analytics or a model.
export function answerCard(input: { transcript: string; feedback: SpeechFeedback; purpose?: SpeechPurpose; topic?: string; repeated: boolean }) {
  const next = nextRound(input.feedback, input.purpose);
  const f = input.feedback;
  const quote = f.strength.quote && input.transcript.includes(f.strength.quote) ? f.strength.quote : null;
  const sections = [
    "My speaking practice card",
    ...(input.topic ? [`Topic: ${input.topic}`] : []),
    input.repeated ? "My short retry (not a complete rewritten speech):" : "My answer:",
    input.transcript,
    ...(quote ? ["Words to keep:", quote] : []),
    "My next practice:", next.title, next.why,
    ...(next.check ? [`Check: ${next.check}`] : []),
    "Feedback is based on the transcript, not voice or accent. Check the words before using this card.",
  ];
  return { text: sections.join("\n\n"), quote, next };
}
