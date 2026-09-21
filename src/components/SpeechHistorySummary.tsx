"use client";
import { useEffect, useRef } from "react";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

export default function SpeechHistorySummary({ nextStep, repeated }: {
  nextStep: string; repeated: boolean;
}) {
  const element = useRef<HTMLParagraphElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    if (!element.current || seen.current) return;
    return observeVisibleContent(element.current, () => {
      seen.current = true;
      trackSpeech("speech_history_feedback_view", { content_source: "speech_account", attempt: repeated ? 2 : 1 });
    });
  }, [repeated]);
  return <p ref={element}><strong>Next practice: </strong>{nextStep}</p>;
}
