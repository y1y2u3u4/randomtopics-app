"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SpeechFeedback } from "@/lib/speech/schema";
import { focusLabels } from "@/lib/speech/practiceLabels";
import { observeVisibleAction, observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import { SPEECH_REASON_EVENTS, type SpeechReason } from "@/lib/speech/events";
import SpeechPlanTeaser from "./SpeechPlanTeaser";

export type SpeechResult = {
  id: string; transcript: string; feedback: SpeechFeedback; duration: number;
  allowance?: { remaining: number; included: number; paid: boolean };
  correctionsRemaining?: number;
};
const button = "min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
export default function SpeechFeedbackResult({ result, repeated, visible, contentSource, onRetry, onCorrect }: {
  result: SpeechResult; repeated: boolean; visible: boolean; contentSource: string;
  onRetry: () => void; onCorrect: () => void;
}) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  const viewed = useRef(false);
  const retryViewed = useRef(false);
  const f = result.feedback;
  const drill = f.drill;
  const attempt = repeated ? 2 : 1;
  const canRetry = result.allowance?.remaining !== 0;
  useEffect(() => {
    if (!visible || !heading.current || viewed.current) return;
    return observeVisibleContent(heading.current, () => {
      viewed.current = true;
      const props = { content_source: contentSource, attempt };
      trackSpeech("speech_feedback_view", props);
      trackSpeech(repeated ? "speech_retry_feedback_view" : "speech_first_feedback_view", props);
      trackSpeech("speech_feedback_v5_view", props);
      trackSpeech(repeated ? "speech_retry_feedback_v5_view" : "speech_first_feedback_v5_view", props);
      if (repeated) trackSpeech("speech_comparison_view", { ...props, outcome: f.comparison.outcome });
    });
  }, [visible, contentSource, attempt, repeated, f.comparison.outcome]);
  useEffect(() => {
    if (!visible || !retry.current || retryViewed.current) return;
    return observeVisibleAction(retry.current, () => {
      retryViewed.current = true;
      trackSpeech("speech_retry_action_view", { content_source: contentSource, attempt });
    });
  }, [visible, contentSource, attempt]);
  const feedbackReason = (value: SpeechReason) => {
    setReason(value);
    trackSpeech("speech_feedback_reason", { content_source: contentSource, attempt, reason: value });
    trackSpeech(SPEECH_REASON_EVENTS[value], { content_source: contentSource, attempt });
  };
  return <section className="space-y-4" aria-label="Your feedback">
    <h4 ref={heading} className="text-xl font-semibold" tabIndex={-1}>
      {repeated ? "Your progress on this goal" : "One small step for your next answer"}
    </h4>
    {repeated && <div data-clarity-mask="true" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-4">
      <p className="font-semibold">{{ improved: "This change worked", similar: "About the same so far", mixed: "Some progress, with a trade-off", insufficient_evidence: "Not enough evidence to compare", first_attempt: "Your first comparison" }[f.comparison.outcome]}</p>
      <p>{f.comparison.explanation}</p>
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <blockquote><span className="block font-semibold">Before</span>{f.comparison.beforeQuote || (f.comparison.outcome === "insufficient_evidence" ? "Not enough clear evidence to quote." : "This element was not present in the earlier answer.")}</blockquote>
        <blockquote><span className="block font-semibold">Now</span>{f.comparison.afterQuote || "There is not enough clear text to quote."}</blockquote>
      </div>
    </div>}
    {!repeated && <div data-clarity-mask="true" className="space-y-2">
      {(!f.assessment || Object.values(f.assessment).some(item => item.status === "met")) && <p><strong>Keep: </strong>{f.strength.observation}</p>}
      <p><strong>{drill?.kind === "refine" ? "Optional refinement: " : drill?.kind === "check" ? "Check the transcript: " : "Focus: "}</strong>{f.priority.observation}</p>
    </div>}
    {canRetry && <div data-clarity-mask="true" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 p-4 sm:p-5">
      <p className="font-semibold">{repeated && drill?.kind === "refine" ? "Goal reached · another practice is optional" : drill ? `Practice ${focusLabels[drill.target]} · about 20 seconds` : "Practice this one change"}</p>
      <p>{drill?.instruction ?? f.priority.nextStep}</p>
      {drill && <>
        <p className="text-sm text-[var(--text-muted)]">Use this frame with your own words:</p>
        <blockquote className="border-l-2 border-[var(--neon-cyan)]/60 pl-3">{drill.starter}</blockquote>
        <p className="text-sm"><strong>We’ll check: </strong>{drill.successCriterion}</p>
      </>}
      <button ref={retry} type="button" className={`${button} w-full bg-[var(--neon-cyan)] text-black sm:w-auto`} onClick={onRetry}>
        {drill ? "Try this 20-second practice" : "Try this change"}{result.allowance && !result.allowance.paid && result.allowance.remaining > 0 ? " — free" : ""}
      </button>
      {result.allowance && <p className="text-xs text-[var(--text-muted)]">{result.allowance.remaining} {result.allowance.paid ? "included" : "free"} attempt{result.allowance.remaining === 1 ? "" : "s"} remaining. A short practice uses one attempt.</p>}
    </div>}
    <details data-clarity-mask="true" className="rounded-xl border border-white/10 p-4">
      <summary className="cursor-pointer font-semibold">Evidence, structure & transcript</summary>
      <div className="mt-3 space-y-3 text-sm">
        {f.strength.quote && <blockquote><strong>What worked: </strong>“{f.strength.quote}”</blockquote>}
        {f.priority.quote && <blockquote><strong>Focus passage: </strong>“{f.priority.quote}”</blockquote>}
        {repeated && <p>{f.priority.observation}</p>}
        <dl className="space-y-2">{Object.entries(f.structure).map(([key, note]) => <div key={key}><dt className="font-semibold capitalize">{key}</dt><dd>{note}</dd></div>)}</dl>
        <p className="whitespace-pre-wrap">{result.transcript}</p>
        {(result.correctionsRemaining ?? 0) > 0 && <button type="button" className={button} onClick={onCorrect}>Correct a transcription mistake</button>}
      </div>
    </details>
    <p className="text-xs text-[var(--text-muted)]">Feedback assesses the words we heard, not your voice or accent. Check the transcript if something looks wrong.</p>
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span>Was this useful?</span>
      {helpful === null ? [true, false].map(value => <button type="button" key={String(value)} className={button} onClick={() => {
        setHelpful(value); trackSpeech(value ? "speech_feedback_yes" : "speech_feedback_no", { content_source: contentSource, attempt });
      }}>{value ? "Yes" : "Not yet"}</button>) : <span>Thanks for telling us.</span>}
    </div>
    {helpful === false && !reason && <div className="flex flex-wrap gap-2" aria-label="What could be better?">
      {([["inaccurate", "It misread my answer"], ["hard_to_apply", "I don’t know how to apply it"], ["transcription", "The transcript is wrong"]] as const).map(([value, label]) => <button type="button" key={value} className={button} onClick={() => {
        feedbackReason(value); if (value === "transcription" && (result.correctionsRemaining ?? 0) > 0) onCorrect();
      }}>{label}</button>)}
    </div>}
    {!result.allowance?.paid && <SpeechPlanTeaser attempt={attempt} contentSource={contentSource} visible={visible}
      compact={!repeated && canRetry} focusLabel={drill ? focusLabels[drill.target] : undefined} />}
    {result.allowance?.paid && !canRetry && <p className="text-sm">You’ve used this billing month’s included attempts. Your saved feedback is still available. <Link className="underline" href="/speech/account">View your account and renewal date</Link>.</p>}
    <div className="text-sm">
      {!finished ? <button type="button" className={`${button} border-transparent`} onClick={() => {
        setFinished(true); trackSpeech("speech_done_for_now", { content_source: contentSource, attempt });
      }}>Done for now</button> : <div className="space-y-2">
        <p>Your feedback is saved. <Link href={`/speech/account?attempt=${result.id}`} className="underline">Return to this practice</Link>.</p>
        {!reason && <div className="flex flex-wrap gap-2" aria-label="Optional reason for stopping">
          {([["task_complete", "I got what I needed"], ["later", "I’ll practice later"], ["too_much_work", "Too many steps"]] as const).map(([value, label]) => <button type="button" key={value} className={button} onClick={() => feedbackReason(value)}>{label}</button>)}
        </div>}
      </div>}
    </div>
  </section>;
}
