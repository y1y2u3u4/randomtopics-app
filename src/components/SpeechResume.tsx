"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { practiceFetch } from "@/lib/speech/client";
import { trackSpeech } from "@/lib/speech/telemetry";
import SpeechCoach from "./SpeechCoach";
import SpeechPlanTeaser from "./SpeechPlanTeaser";
import type { SpeechResult } from "./SpeechFeedbackResult";

export default function SpeechResume({ attemptId }: { attemptId: string }) {
  const [saved, setSaved] = useState<(SpeechResult & { topic: string }) | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    practiceFetch(`history?id=${encodeURIComponent(attemptId)}`).then(data => {
      const attempt = data.attempts?.find((item: { id: string }) => item.id === attemptId);
      if (!attempt || attempt.status !== "complete" || !attempt.feedback) throw new Error("This saved feedback is not available in this browser session. Open your practice history to recover it.");
      if (active) {
        setSaved({ ...attempt, allowance: data.allowance });
        trackSpeech("speech_history_continue", { content_source: "speech_resume", attempt: 2 });
      }
    }).catch(e => { if (active) setError(e instanceof Error ? e.message : "Could not open this practice."); });
    return () => { active = false; };
  }, [attemptId]);
  return <div className="mx-auto max-w-3xl px-4 py-8">
    <Link className="underline" href="/speech/account">Back to practice history</Link>
    <h1 className="mt-5 text-3xl font-bold">Continue one small improvement</h1>
    {error && <p role="alert" className="mt-4">{error}</p>}
    {!saved && !error && <p role="status" className="mt-4">Opening your saved feedback…</p>}
    {saved && (saved.allowance?.remaining === 0 ? <div className="mt-5 space-y-4">
      <p>Your saved feedback is still available. {saved.allowance.paid ? "You’ve used this billing month’s included attempts. Check your account for the renewal date." : "Your free attempts are used; choose a plan to submit another recording."}</p>
      {!saved.allowance.paid && <SpeechPlanTeaser attempt={2} visible contentSource="speech_resume" />}
    </div> : <SpeechCoach topic={{ id: saved.id, text: saved.topic, category: "education", depth: "medium", modes: ["speech"], talkingPoints: [] }}
      topics={[]} onTopicChange={() => {}} contentSource="speech_resume" visible initialPrevious={saved} />)}
  </div>;
}
