"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Topic } from "@/data/types";
import { trackSpeech } from "@/lib/speech/telemetry";
import { track } from "@/lib/track";
import { observeVisibleAction, observeVisibleContent } from "@/lib/speech/visibleAction";
import { registerTimerCoach } from "@/lib/speech/timerPractice";

const Coach = dynamic(() => import("./SpeechCoach"), {
  loading: () => <p role="status" className="p-4">Opening your practice…</p>,
});

export default function SpeechCoachEntry({ topics, contentSource, requestTopics, loadingTopics, renderFirstTopic, timerHref = "#speech-practice" }: {
  topics: Topic[];
  contentSource: string;
  requestTopics: () => Promise<Topic[]>;
  loadingTopics: boolean;
  renderFirstTopic?: (actions: ReactNode) => ReactNode;
  timerHref?: string;
}) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [practiceVersion, setPracticeVersion] = useState(0);
  const [fromTimer, setFromTimer] = useState(false);
  const [timerTopic, setTimerTopic] = useState<Topic | null>(null);
  const timerPending = useRef<Topic | null>(null);
  const timerChoice = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const previewSeen = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const example = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);
  const opened = useRef(false);
  const exampleViewed = useRef(false);
  const landed = useRef(false);
  const pending = useRef(false);
  // One entry per source page; keep aria-controls stable across lazy hydration.
  const id = `speech-coach-${contentSource}`;
  const enabled = process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED === "true";
  const busy = starting || loadingTopics;
  const firstTopicId = topics[0]?.id;
  const inlineActions = Boolean(renderFirstTopic);
  const openTimerTopic = useCallback((chosen: Topic) => {
    setTopic(chosen);
    setPracticeVersion(version => version + 1);
    setFromTimer(true);
    setOpen(true);
    setExampleOpen(false);
    setError("");
    setTimerTopic(null);
    timerPending.current = null;
    trackSpeech("speech_timer_coach_open", { content_source: contentSource });
    trackSpeech(opened.current ? "speech_coach_return" : "speech_coach_open", { content_source: contentSource });
    opened.current = true;
  }, [contentSource]);
  useEffect(() => {
    if (!enabled) return;
    return registerTimerCoach(contentSource, {
      topic: topics[0], available: !busy,
      open(chosen) {
        if (pending.current || busy) return false;
        if (!topic) openTimerTopic(chosen);
        else if (topic.id === chosen.id && topic.text === chosen.text) {
          setOpen(true);
          trackSpeech("speech_timer_practice_resume", { content_source: contentSource });
          requestAnimationFrame(() => panel.current?.scrollIntoView({ block: "start", behavior: "instant" }));
        } else {
          timerPending.current = chosen;
          setTimerTopic(chosen);
          setOpen(true);
          trackSpeech("speech_timer_topic_conflict", { content_source: contentSource });
        }
        return true;
      },
    });
  }, [enabled, busy, contentSource, topics, topic, openTimerTopic]);
  useEffect(() => {
    if (!timerTopic) return;
    timerChoice.current?.focus({ preventScroll: true });
    timerChoice.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [timerTopic]);
  useEffect(() => {
    if (!enabled || landed.current) return;
    landed.current = true;
    trackSpeech("speech_page_view", { content_source: contentSource });
    trackSpeech("speech_entry_v3_page", { content_source: contentSource });
    trackSpeech("speech_entry_v4_page", { content_source: contentSource });
    trackSpeech("speech_entry_v5_page", { content_source: contentSource });
    trackSpeech("speech_entry_expanded_page", { content_source: contentSource });
  }, [enabled, contentSource]);
  useEffect(() => {
    if (!enabled || busy || open || viewed.current || !primary.current) return;
    return observeVisibleAction(primary.current, () => {
      viewed.current = true;
      trackSpeech("speech_entry_v3_view", { content_source: contentSource });
      trackSpeech("speech_entry_v4_view", { content_source: contentSource });
      trackSpeech("speech_entry_v5_view", { content_source: contentSource });
      trackSpeech("speech_entry_expanded_view", { content_source: contentSource });
    });
  }, [enabled, busy, open, contentSource, firstTopicId, inlineActions]);
  useEffect(() => {
    if (!enabled || open || !preview.current || previewSeen.current) return;
    return observeVisibleContent(preview.current, () => {
      previewSeen.current = true;
      trackSpeech("speech_entry_v4_example_view", { content_source: contentSource });
    });
  }, [enabled, open, contentSource, firstTopicId, inlineActions]);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus({ preventScroll: true });
    panel.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [open]);
  useEffect(() => {
    if (!exampleOpen) return;
    example.current?.focus({ preventScroll: true });
    example.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [exampleOpen]);

  async function startPractice(surface: "primary" | "example") {
    if (pending.current || busy) return;
    if (open) {
      trackSpeech("speech_coach_hide", { content_source: contentSource });
      setOpen(false);
      return;
    }
    pending.current = true;
    setStarting(true);
    setError("");
    trackSpeech("speech_entry_v3_click", { content_source: contentSource, entry_surface: surface });
    trackSpeech("speech_entry_v4_click", { content_source: contentSource, entry_surface: surface });
    trackSpeech("speech_entry_v5_click", { content_source: contentSource, entry_surface: surface });
    trackSpeech("speech_entry_expanded_click", { content_source: contentSource, entry_surface: surface });
    if (surface === "example") trackSpeech("speech_example_practice", { content_source: contentSource });
    try {
      const chosen = topic ?? topics[0] ?? (await requestTopics())[0];
      if (!chosen) throw new Error("no_topic");
      setTopic(chosen);
      setOpen(true);
      setExampleOpen(false);
      trackSpeech(opened.current ? "speech_coach_return" : "speech_coach_open", { content_source: contentSource });
      if (!opened.current) trackSpeech("speech_coach_v3_open", { content_source: contentSource });
      if (!opened.current) trackSpeech("speech_coach_v4_open", { content_source: contentSource });
      opened.current = true;
    } catch {
      setError("We couldn’t get a topic. Try generating one above, then start your practice.");
      trackSpeech("speech_entry_v3_error", { content_source: contentSource, error_code: "topic_unavailable" });
    } finally {
      pending.current = false;
      setStarting(false);
    }
  }

  if (!enabled) return null;
  const buttonLabel = busy ? "Getting your topic…" : open ? "Hide practice" : topic ? "Continue your practice" :
    topics.length ? "Practice this topic free" : "Get a topic & practice free";
  const actions = <div className={`relative z-10 ${inlineActions ? "mb-5" : "mt-5"}`}>
      {inlineActions && <p className="mb-3 text-sm leading-relaxed text-[var(--text-secondary)]">Give an answer, get one suggestion, then try it once and compare.</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button ref={primary} type="button" disabled={busy} aria-expanded={open} aria-controls={`${id}-practice`}
          onClick={() => void startPractice("primary")}
          className="min-h-12 rounded-xl bg-[var(--neon-cyan)] px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-cyan)] disabled:opacity-60">
          {buttonLabel}
        </button>
        <button type="button" aria-expanded={exampleOpen} aria-controls={`${id}-example`}
          onClick={() => {
            if (!exampleOpen && !exampleViewed.current) {
              exampleViewed.current = true;
              trackSpeech("speech_example_open", { content_source: contentSource });
            }
            setExampleOpen(!exampleOpen);
          }}
          className="min-h-12 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--neon-cyan)]">
          {exampleOpen ? "Hide feedback example" : "See the full example"}
        </button>
      </div>
      {!open && <div ref={preview} className="mt-4 max-w-2xl rounded-xl border border-white/15 bg-black/15 p-3 text-sm leading-relaxed">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Example feedback · illustrative</p>
        <p className="mt-1">“A short walk helps me feel better.”</p>
        <p className="mt-1"><span className="font-semibold text-[var(--neon-cyan)]">A 20-second change:</span> Name one walk and what changed afterward. Re-record just that example and compare.</p>
      </div>}
      <a href={timerHref} onClick={() => track("practice_timer_entry", { tool_type: "speech_practice", content_source: contentSource, locale: "en" })} className="mt-3 inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] underline underline-offset-4">Practice aloud with the timer · no recording</a>
      <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">Two free recorded attempts, including retries. No sign-up or card. Feedback on your words and structure.</p>
    </div>;
  return (
    <section className="mb-6" aria-label="Free speech feedback">
      {renderFirstTopic ? renderFirstTopic(actions) : <div className="rounded-2xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/5 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Your next step · Free speech feedback</p>
        <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">Make your next answer clearer.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Practice this topic. Get one clear suggestion, try it once, and compare your two answers.
        </p>
        {actions}
      </div>}
      {error && <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
      {exampleOpen && <div ref={example} tabIndex={-1} id={`${id}-example`} className="mt-5 space-y-4 rounded-xl border border-white/15 bg-black/20 p-4 outline-none sm:p-5">
        <div><h3 className="font-semibold">What your feedback can look like</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Illustrative example, not an assessment of your speech.</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Example answer</p>
          <blockquote className="mt-2 border-l-2 border-white/25 pl-3 text-sm leading-relaxed">“A short walk makes my day better. It helps me feel better and I think everyone should try it.”</blockquote></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white/5 p-4"><h4 className="text-sm font-semibold text-[var(--neon-cyan)]">Keep this</h4>
            <p className="mt-2 text-sm leading-relaxed">“A short walk makes my day better” gives your listener a clear point from the start.</p></div>
          <div className="rounded-lg bg-white/5 p-4"><h4 className="text-sm font-semibold text-[var(--neon-cyan)]">Change one thing</h4>
            <p className="mt-2 text-sm leading-relaxed">“It helps me feel better” is broad. Add one real moment that shows what changed after a walk.</p></div>
        </div>
        <div><h4 className="text-sm font-semibold">Try again with one concrete detail</h4>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Keep your opening. Describe when you took the walk and how you felt afterward. On your second attempt, compare the two answers to see what changed.</p></div>
        {!open && <button type="button" disabled={busy} onClick={() => void startPractice("example")}
          className="min-h-11 rounded-lg bg-[var(--neon-cyan)] px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-60">
          {busy ? "Getting your topic…" : "Try it with my answer — free"}
        </button>}
      </div>}
      {topic && <div ref={panel} id={`${id}-practice`} hidden={!open} tabIndex={-1} className="outline-none">
        {timerTopic && <div ref={timerChoice} role="region" aria-label="Choose which practice to keep" tabIndex={-1} className="mt-4 space-y-3 rounded-xl border border-amber-300/30 p-4">
          <p className="font-semibold">A different practice is already open.</p>
          <p data-clarity-mask="true" className="text-sm">Timer topic: {timerTopic.text}</p>
          <p className="text-sm">Continue your current practice, or replace it with this topic. Replacing discards any unsent recording in this panel; saved feedback stays in your history.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="min-h-11 rounded-xl border border-white/25 px-4 py-2" onClick={() => {
              timerPending.current = null; setTimerTopic(null);
              trackSpeech("speech_timer_practice_resume", { content_source: contentSource });
            }}>Keep current practice</button>
            <button type="button" className="min-h-11 rounded-xl border border-white/25 px-4 py-2" onClick={() => {
              const chosen = timerPending.current;
              if (chosen) openTimerTopic(chosen);
            }}>Replace with timer topic</button>
          </div>
        </div>}
        <Coach key={practiceVersion} topic={topic} topics={topics} onTopicChange={setTopic} contentSource={contentSource} visible={open} fromTimer={fromTimer} />
      </div>}
    </section>
  );
}
