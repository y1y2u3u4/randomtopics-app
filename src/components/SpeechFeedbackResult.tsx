"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SpeechFeedback } from "@/lib/speech/schema";
import { focusLabels } from "@/lib/speech/practiceLabels";
import { nextRound, retryLabels } from "@/lib/speech/nextRound";
import { observeVisibleAction, observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import { SPEECH_REASON_EVENTS, type SpeechReason } from "@/lib/speech/events";
import SpeechPlanTeaser from "./SpeechPlanTeaser";
import SpeechRoundSteps from "./SpeechRoundSteps";
import { purposeLabels, speechPurpose, type SpeechPurpose } from "@/lib/speech/purpose";

export type SpeechResult = {
  id: string; transcript: string; feedback: SpeechFeedback; duration: number;
  allowance?: { remaining: number; included: number; paid: boolean };
  correctionsRemaining?: number;
  purpose?: SpeechPurpose;
};
const button = "min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
export default function SpeechFeedbackResult({ result, repeated, visible, contentSource, onRetry, onCorrect, fromTimer = false, fromWarmup = false }: {
  result: SpeechResult; repeated: boolean; visible: boolean; contentSource: string;
  onRetry: () => void; onCorrect: () => void;
  fromTimer?: boolean;
  fromWarmup?: boolean;
}) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  const evidence = useRef<HTMLDetailsElement>(null);
  const nextAction = useRef<HTMLAnchorElement>(null);
  const nextViewed = useRef(false);
  const viewed = useRef(false);
  const retryViewed = useRef(false);
  const f = result.feedback;
  const drill = f.drill;
  const attempt = repeated ? 2 : 1;
  const purpose = speechPurpose(result.purpose);
  const canRetry = result.allowance?.remaining !== 0;
  const next = nextRound(f, purpose);
  const recovery = helpful === false;
  useEffect(() => {
    if (!visible || !heading.current || viewed.current) return;
    return observeVisibleContent(heading.current, () => {
      viewed.current = true;
      const props = { content_source: contentSource, attempt, purpose };
      trackSpeech("speech_feedback_view", props);
      trackSpeech(repeated ? "speech_retry_feedback_view" : "speech_first_feedback_view", props);
      trackSpeech("speech_feedback_v5_view", props);
      trackSpeech(repeated ? "speech_retry_feedback_v5_view" : "speech_first_feedback_v5_view", props);
      trackSpeech(repeated ? "speech_round_compare_view" : "speech_round_suggestion_view", props);
      if (!repeated && (!canRetry || next.mode === "review")) trackSpeech("speech_first_retry_unavailable_view", {
        ...props, reason: !canRetry ? "quota" : "review",
      });
      if (fromTimer) trackSpeech(repeated ? "speech_timer_retry_view" : "speech_timer_feedback_view", props);
      if (fromWarmup) trackSpeech(repeated ? "speech_warmup_retry_view" : "speech_warmup_feedback_view", props);
      if (repeated) trackSpeech("speech_comparison_view", { ...props, outcome: f.comparison.outcome });
    });
  }, [visible, contentSource, attempt, repeated, f.comparison.outcome, fromTimer, fromWarmup, canRetry, next.mode, purpose]);
  useEffect(() => {
    if (!visible || !retry.current || retryViewed.current) return;
    return observeVisibleAction(retry.current, () => {
      retryViewed.current = true;
      trackSpeech("speech_retry_action_view", { content_source: contentSource, attempt, purpose });
      if (!repeated) trackSpeech("speech_first_retry_action_view", { content_source: contentSource, attempt, purpose,
        outcome: result.allowance ? result.allowance.paid ? "included" : "free" : "unknown" });
    });
  }, [visible, contentSource, attempt, repeated, result.allowance, purpose]);
  useEffect(() => {
    if (!visible || recovery || !nextAction.current || nextViewed.current) return;
    return observeVisibleContent(nextAction.current, () => {
      nextViewed.current = true;
      trackSpeech("speech_round_next_view", { content_source: contentSource, attempt, purpose, outcome: next.mode });
    });
  }, [visible, contentSource, attempt, next.mode, recovery, purpose]);
  const openEvidence = () => {
    if (!evidence.current) return;
    evidence.current.open = true;
    evidence.current.querySelector("summary")?.focus();
    evidence.current.scrollIntoView({ block: "start", behavior: "smooth" });
    trackSpeech("speech_round_evidence_open", { content_source: contentSource, attempt, purpose });
  };
  const feedbackReason = (value: SpeechReason) => {
    setReason(value);
    trackSpeech("speech_feedback_reason", { content_source: contentSource, attempt, purpose, reason: value });
    trackSpeech(SPEECH_REASON_EVENTS[value], { content_source: contentSource, attempt, purpose });
  };
  return <section className="space-y-4" aria-label="Your feedback">
    <SpeechRoundSteps step={repeated ? 4 : 2} />
    {purpose !== "unspecified" && <p className="text-xs text-[var(--text-muted)]">Your purpose: {purposeLabels[purpose]}</p>}
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
      <p><strong>{drill?.kind === "refine" ? "Optional refinement: " : drill?.kind === "check" ? "Check the transcript: " : "Focus: "}</strong>{f.priority.observation}</p>
    </div>}
    {canRetry && next.mode !== "review" && !(repeated && next.mode === "transfer") && <div data-clarity-mask="true" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 p-4 sm:p-5">
      <p className="font-semibold">{drill ? `Practice ${focusLabels[drill.target]} · about 20 seconds` : "Practice this one change"}</p>
      <p>{drill?.instruction ?? f.priority.nextStep}</p>
      {drill && <>
        <p className="text-sm text-[var(--text-muted)]">Use this frame with your own words:</p>
        <blockquote className="border-l-2 border-[var(--neon-cyan)]/60 pl-3">{drill.starter}</blockquote>
        <p className="text-sm"><strong>We’ll check: </strong>{drill.successCriterion}</p>
      </>}
      <button ref={retry} type="button" className={`${button} w-full bg-[var(--neon-cyan)] text-black sm:w-auto`} onClick={() => {
        if (!repeated) trackSpeech("speech_first_retry_click", { content_source: contentSource, attempt, purpose });
        trackSpeech("speech_round_retry_click", { content_source: contentSource, attempt, purpose }); onRetry();
      }}>
        {drill ? retryLabels[drill.target] : "Try this change"}{result.allowance && !result.allowance.paid && result.allowance.remaining > 0 ? " — free" : ""}
      </button>
      {result.allowance && <p className="text-xs text-[var(--text-muted)]">{result.allowance.remaining} {result.allowance.paid ? "included" : "free"} attempt{result.allowance.remaining === 1 ? "" : "s"} remaining. A short practice uses one attempt.</p>}
    </div>}
    {!repeated && <div data-clarity-mask="true" className="space-y-2 text-sm">
      {f.priority.quote ? <blockquote className="rounded-xl border-l-2 border-[var(--neon-cyan)] bg-white/5 p-3">
        <span className="mb-1 block font-semibold">From your answer</span>“{f.priority.quote}”
      </blockquote> : <p className="text-[var(--text-muted)]">{drill?.kind === "refine" ? "This is optional practice, not a missing skill." : "There is no passage to quote for this goal. Check the full transcript if the assessment missed something."}</p>}
    </div>}
    <details ref={evidence} data-clarity-mask="true" className="rounded-xl border border-white/10 p-4">
      <summary className="cursor-pointer font-semibold">Evidence, structure & transcript</summary>
      <div className="mt-3 space-y-3 text-sm">
        {(!f.assessment || Object.values(f.assessment).some(item => item.status === "met")) && <p><strong>Keep: </strong>{f.strength.observation}</p>}
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
        setHelpful(value); trackSpeech(value ? "speech_feedback_yes" : "speech_feedback_no", { content_source: contentSource, attempt, purpose });
      }}>{value ? "Yes" : "Not yet"}</button>) : <span>Thanks for telling us.</span>}
    </div>
    {helpful === false && !reason && <div className="flex flex-wrap gap-2" aria-label="What could be better?">
      {([["inaccurate", "It misread my answer"], ["hard_to_apply", "I don’t know how to apply it"], ["transcription", "The transcript is wrong"]] as const).map(([value, label]) => <button type="button" key={value} className={button} onClick={() => {
        feedbackReason(value); if (value === "transcription" && (result.correctionsRemaining ?? 0) > 0) onCorrect();
      }}>{label}</button>)}
    </div>}
    {recovery && <aside aria-label="Check this feedback" className="space-y-3 rounded-xl border border-amber-400/30 p-4">
      <p className="font-semibold">Let’s make the feedback useful first</p>
      <p className="text-sm">{reason === "hard_to_apply" ? "Use this sentence frame with your own words. You can rehearse it here before recording; reading it or checking your saved answer uses no attempts."
        : "Compare the quoted passage with your full transcript. If the words are correct but the assessment is wrong, you can keep your answer and skip this suggestion."}</p>
      {reason === "hard_to_apply" && drill && <blockquote className="border-l-2 border-amber-400/40 pl-3 text-sm">{drill.starter}</blockquote>}
      <button type="button" className={button} onClick={openEvidence}>Check my transcript and evidence</button>
      {(result.correctionsRemaining ?? 0) > 0 && <button type="button" className={button} onClick={onCorrect}>Correct a transcription mistake</button>}
      <p className="text-xs text-[var(--text-muted)]">{(result.correctionsRemaining ?? 0) > 0 ? "Correcting transcription mistakes does not use another recorded attempt." : "No feedback corrections remain for this recording. You can still review all saved evidence."} You do not need to subscribe to review this result.</p>
    </aside>}
    {(repeated || next.mode === "review") && !recovery && <aside aria-label="Your next round" className="space-y-3 rounded-xl border border-white/15 p-4">
      <h4 className="font-semibold">{next.title}</h4><p className="text-sm">{next.description}</p>
      <p className="text-sm">{next.why}</p>
      {next.check && <p className="text-sm"><strong>Next check: </strong>{next.check}</p>}
      {next.mode === "review" ? <button type="button" className={button} onClick={openEvidence}>Check the evidence</button> :
        <Link ref={nextAction} href={`/speech/practice?attempt=${result.id}&next=1`} className={`${button} inline-flex items-center`}
          onClick={() => trackSpeech("speech_round_next_click", { content_source: contentSource, attempt, purpose, outcome: next.mode })}>
          {!canRetry ? "Preview my next round" : next.mode === "transfer" ? "Choose a new topic for this goal" : "Open my next practice"}
        </Link>}
      {!canRetry && <p className="text-xs text-[var(--text-muted)]">Your goal stays in practice history. {result.allowance?.paid ? "Submitting another recording needs available attempts." : "Your free attempts are used. Another recording requires a plan; reviewing your result stays free."}</p>}
    </aside>}
    {!result.allowance?.paid && !recovery && next.mode !== "review" && <SpeechPlanTeaser attempt={attempt} contentSource={contentSource} visible={visible}
      compact={!repeated && canRetry} purpose={purpose} nextCheck={next.check} onReview={openEvidence} attemptId={result.id} focusLabel={drill ? focusLabels[drill.target] : undefined} />}
    {result.allowance?.paid && !canRetry && <p className="text-sm">You’ve used this billing month’s included attempts. Your saved feedback is still available. <Link className="underline" href="/speech/account">View your account and renewal date</Link>.</p>}
    <div className="text-sm">
      {!finished ? <button type="button" className={`${button} border-transparent`} onClick={() => {
        setFinished(true); trackSpeech("speech_done_for_now", { content_source: contentSource, attempt, purpose });
      }}>Done for now</button> : <div className="space-y-2">
        <p>Your feedback is saved. <Link href={`/speech/account?attempt=${result.id}`} className="underline">Return to this practice</Link>.</p>
        {!reason && <div className="flex flex-wrap gap-2" aria-label="Optional reason for stopping">
          {([["task_complete", "I got what I needed"], ["later", "I’ll practice later"], ["too_much_work", "Too many steps"]] as const).map(([value, label]) => <button type="button" key={value} className={button} onClick={() => feedbackReason(value)}>{label}</button>)}
        </div>}
      </div>}
    </div>
  </section>;
}
