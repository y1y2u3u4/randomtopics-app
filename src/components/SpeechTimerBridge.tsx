"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Topic } from "@/data/types";
import { getTimerCoach, noServerTimerCoach, subscribeTimerCoach } from "@/lib/speech/timerPractice";
import { observeVisibleAction } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

export default function SpeechTimerBridge({ topic, contentSource }: { topic: Topic | null; contentSource: string }) {
  const coach = useSyncExternalStore(subscribeTimerCoach, () => getTimerCoach(contentSource), noServerTimerCoach);
  const [ownTopic, setOwnTopic] = useState<string | null>(topic ? null : "");
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);
  const action = useRef<HTMLButtonElement>(null);
  const seen = useRef(false);
  const sent = useRef(false);
  const text = (ownTopic ?? topic?.text ?? "").trim();
  const available = Boolean(coach?.available && text && text.length <= 700 && !opened);
  useEffect(() => {
    if (!available || !action.current || seen.current) return;
    return observeVisibleAction(action.current, () => {
      seen.current = true;
      trackSpeech("speech_timer_bridge_view", { content_source: contentSource });
    });
  }, [available, contentSource]);
  if (!coach) return null;
  return <div className="mb-5 space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 p-4 text-sm" aria-label="Feedback on your next recording">
    <h4 className="font-semibold">Want feedback on your next attempt?</h4>
    <p className="text-xs leading-relaxed text-[var(--text-muted)]">This timer did not record your speech. Record a new answer, up to two minutes, for one suggestion on your point, example or ending.</p>
    {ownTopic === null && topic ? <div data-clarity-mask="true">
      <p className="break-words"><strong>Next recording topic: </strong>{topic.text}</p>
      {!opened && <button type="button" className="min-h-11 underline" onClick={() => setOwnTopic(topic.text)}>Use a different topic</button>}
    </div> : <label className="block">Topic for your next recording
      <textarea data-clarity-mask="true" value={ownTopic ?? ""} maxLength={700} rows={2} disabled={opened}
        onChange={event => setOwnTopic(event.target.value)}
        className="mt-2 w-full rounded-lg border border-white/20 bg-black/20 p-3" />
    </label>}
    {opened ? <p role="status">Your practice is open above. <a className="underline" href={`#speech-coach-${contentSource}-practice`}>Return to practice</a></p> :
      <button ref={action} type="button" disabled={!available}
        className="min-h-11 w-full rounded-xl bg-[var(--neon-cyan)] px-4 py-3 font-semibold text-black disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-cyan)]"
        onClick={() => {
          if (sent.current || !available) return;
          const current = getTimerCoach(contentSource);
          if (!current?.available) { setError(true); return; }
          sent.current = true;
          trackSpeech("speech_timer_bridge_click", { content_source: contentSource });
          const selected: Topic = ownTopic === null && topic ? topic : {
            id: crypto.randomUUID(), text, category: "education", modes: ["speech"], depth: "light", talkingPoints: [],
          };
          if (current.open(selected)) { setOpened(true); setError(false); }
          else { sent.current = false; setError(true); }
        }}>Record my next attempt</button>}
    {error && <p role="alert">The practice panel is busy. Try again when it finishes opening.</p>}
    <p className="text-xs leading-relaxed text-[var(--text-muted)]">Two free recorded attempts per account, including retries. After that, an active plan with attempts remaining is required. Nothing records or uploads until you choose it.</p>
  </div>;
}
