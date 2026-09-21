"use client";
import { useEffect, useRef } from "react";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import type { SpeechFeedback } from "@/lib/speech/schema";

export default function SpeechHistorySummary({ nextStep, repeated, comparison, optional = false }: {
  nextStep: string; repeated: boolean; comparison?: SpeechFeedback["comparison"]; optional?: boolean;
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
  return <div className="space-y-2">
    {repeated && comparison && <p><strong>Your progress: </strong>{comparison.explanation}</p>}
    <p ref={element}><strong>{optional ? "Optional practice: " : "Next practice: "}</strong>{nextStep}</p>
  </div>;
}
