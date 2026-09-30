"use client";
import { useEffect, useRef, useState } from "react";
import { answerCard } from "@/lib/speech/answerCard";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import type { SpeechResult } from "./SpeechFeedbackResult";

export default function SpeechAnswerCard({ result, repeated, visible, contentSource }: {
  result: SpeechResult; repeated: boolean; visible: boolean; contentSource: string;
}) {
  const card = answerCard({ ...result, repeated });
  const heading = useRef<HTMLHeadingElement>(null), seen = useRef(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!visible || !heading.current || seen.current) return;
    return observeVisibleContent(heading.current, () => {
      seen.current = true;
      trackSpeech("speech_card_view", { content_source: contentSource, attempt: repeated ? 2 : 1, purpose: result.purpose });
    });
  }, [visible, contentSource, repeated, result.purpose]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(card.text);
      setNotice("Copied. Keep it in your own notes for your next practice.");
      trackSpeech("speech_card_copy", { content_source: contentSource, attempt: repeated ? 2 : 1, purpose: result.purpose });
    } catch { setNotice("Copy was unavailable. Open the card below and select the text to copy it."); }
  };
  return <aside aria-label="Your answer card" className="space-y-3 rounded-xl border border-white/20 bg-white/5 p-4" data-clarity-mask="true">
    <h4 ref={heading} className="font-semibold">Take your answer with you</h4>
    <p className="text-sm">Keep your own words and one clear practice goal. This card uses your saved answer; it does not generate a new speech.</p>
    <button type="button" onClick={copy} className="min-h-11 rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold">Copy my practice card</button>
    <p role="status" className="text-sm">{notice}</p>
    <details><summary className="min-h-11 cursor-pointer py-3 text-sm">Read my practice card</summary><pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{card.text}</pre></details>
  </aside>;
}
