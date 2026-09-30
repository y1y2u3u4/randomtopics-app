"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { practiceFetch, speechClient } from "@/lib/speech/client";
import { watchSpeechAccount } from "@/lib/speech/accountChanges";
import { trackSpeech } from "@/lib/speech/telemetry";
import { nextRound } from "@/lib/speech/nextRound";
import type { Topic } from "@/data/types";
import SpeechCoach from "./SpeechCoach";
import SpeechPlanTeaser from "./SpeechPlanTeaser";
import type { SpeechResult } from "./SpeechFeedbackResult";
import { speechPurpose } from "@/lib/speech/purpose";
import SpeechReturnTrial from "./SpeechReturnTrial";

export default function SpeechResume({ attemptId, next = false, topics = [] }: { attemptId: string; next?: boolean; topics?: Topic[] }) {
  const [saved, setSaved] = useState<(SpeechResult & { topic: string }) | null>(null);
  const [chosen, setChosen] = useState<Topic | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true, version = 0, waitingForAllowance = true, reported = false;
    let unwatch: (() => void) | undefined;
    const load = async () => {
      const ticket = ++version;
      try {
        const data = await practiceFetch(`history?id=${encodeURIComponent(attemptId)}`);
        if (!active || ticket !== version) return;
        const attempt = data.attempts?.find((item: { id: string }) => item.id === attemptId);
        if (!attempt || attempt.status !== "complete" || !attempt.feedback) throw new Error("This saved feedback is not available in this browser session. Open your practice history to recover it.");
        waitingForAllowance = data.allowance?.remaining === 0;
        // A same-account refresh must not unmount an active recording/result
        // merely because that recording just consumed the last attempt.
        setSaved(current => current && current.allowance?.remaining !== 0 ? current : { ...attempt, allowance: data.allowance });
        setError("");
        if (!reported) {
          reported = true;
          trackSpeech("speech_history_continue", { content_source: "speech_resume", attempt: 2, purpose: speechPurpose(attempt.purpose) });
        }
      } catch (e) { if (active && ticket === version) { setSaved(null); setError(e instanceof Error ? e.message : "Could not open this practice."); } }
    };
    setSaved(null); setChosen(null); setError("");
    void load();
    speechClient().then(client => {
      if (!active) return;
      unwatch = watchSpeechAccount(client.auth, () => void load(), () => {
        version++; waitingForAllowance = true; setSaved(null); setChosen(null);
      }, () => waitingForAllowance);
    }).catch(() => {});
    return () => { active = false; version++; unwatch?.(); };
  }, [attemptId]);
  const goal = saved ? nextRound(saved.feedback, speechPurpose(saved.purpose)) : null;
  const transfer = next && goal?.mode === "transfer";
  const choices = saved ? topics.filter(topic => topic.text.trim() !== saved.topic.trim()) : [];
  const topic: Topic | null = saved ? transfer ? chosen ?? choices[0] ?? null : {
    id: saved.id, text: saved.topic, category: "education", depth: "medium", modes: ["speech"], talkingPoints: [],
  } : null;
  return <div className="mx-auto max-w-3xl px-4 py-8">
    <Link className="underline" href="/speech/account">Back to practice history</Link>
    <h1 className="mt-5 text-3xl font-bold">{next && goal ? goal.title : "Continue one small improvement"}</h1>
    {next && goal && <div className="mt-3 space-y-2 text-sm"><p>{goal.description}</p><p>{goal.why}</p>
      {goal.check && <p><strong>Next check: </strong>{goal.check}</p>}</div>}
    {error && <p role="alert" className="mt-4">{error}</p>}
    {!saved && !error && <p role="status" className="mt-4">Opening your saved feedback…</p>}
    {saved && <SpeechReturnTrial allowance={saved.allowance} attemptId={saved.id} visible purpose={speechPurpose(saved.purpose)} contentSource="speech_resume" />}
    {saved && next && goal?.mode === "review" && <details open data-clarity-mask="true" className="mt-5 space-y-3 rounded-xl border border-white/15 p-4">
      <summary className="cursor-pointer font-semibold">Your saved transcript and evidence</summary>
      <p>{saved.feedback.priority.observation}</p>
      {saved.feedback.priority.quote && <blockquote>“{saved.feedback.priority.quote}”</blockquote>}
      <p className="whitespace-pre-wrap text-sm">{saved.transcript}</p>
      <p className="text-sm">If the words are right but the assessment is wrong, skip the suggestion. Checking this result uses no attempts.</p>
    </details>}
    {saved && (saved.allowance?.remaining === 0 ? <div className="mt-5 space-y-4">
      {topic && <p><strong>{transfer ? "Suggested new topic: " : "Your topic: "}</strong>{topic.text}</p>}
      <p>Your saved feedback is still available. {saved.allowance.paid ? "You’ve used this billing month’s included attempts. Check your account for the renewal date." : saved.allowance.returnTrial?.state === "scheduled" ? "Your extra free recording opens at the time shown above. Return here after that time; choose a plan only if you want more practice before then." : "Your free attempts are used; choose a plan to submit another recording. Return through practice history to continue this goal."}</p>
      {!saved.allowance.paid && goal?.mode !== "review" && <SpeechPlanTeaser attempt={2} attemptId={saved.id} purpose={speechPurpose(saved.purpose)} nextCheck={goal?.check} visible contentSource="speech_resume" />}
    </div> : topic ? <SpeechCoach key={`${saved.id}-${transfer ? "transfer" : "retry"}`} topic={topic}
      topics={transfer ? choices : []} onTopicChange={setChosen} contentSource="speech_resume" visible
      initialPrevious={transfer ? undefined : saved}
      returnTrial={saved.allowance?.returnTrial?.state === "available"}
      carriedGoal={transfer && goal?.target ? { sourceId: saved.id, target: goal.target, purpose: speechPurpose(saved.purpose) } : undefined} />
      : <p className="mt-4">No different topic is available. Choose a practice from your history.</p>)}
  </div>;
}
