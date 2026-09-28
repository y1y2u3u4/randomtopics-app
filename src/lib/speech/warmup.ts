import type { Topic } from "@/data/types";

// A local, optional first-practice prompt. Choosing it never calls a model.
export const SPEECH_WARMUP_TOPIC: Topic = {
  id: "speech-everyday-warmup-v1",
  text: "What is one small habit that makes your day better?",
  category: "health",
  modes: ["speech"],
  depth: "light",
  talkingPoints: ["Name the habit", "Describe one time it helped", "Say why it matters to you"],
};

export function isSpeechWarmup(topic: Pick<Topic, "id" | "text">) {
  return topic.id === SPEECH_WARMUP_TOPIC.id && topic.text === SPEECH_WARMUP_TOPIC.text;
}
