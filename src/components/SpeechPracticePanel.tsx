"use client";

import { useState } from "react";
import type { Topic } from "@/data/types";
import { track } from "@/lib/track";
import GeneratedResultActions from "./GeneratedResultActions";
import SpeechTimer from "./SpeechTimer";

const PREP = [
  { label: "Point", hint: "My answer in one sentence…" },
  { label: "Reason", hint: "I believe this because…" },
  { label: "Example", hint: "One moment or detail that shows this…" },
  { label: "Point again", hint: "The idea I want listeners to remember…" },
];

interface PracticeDraft {
  notes: string[];
  revisionId: string;
}

const EMPTY_DRAFT: PracticeDraft = { notes: ["", "", "", ""], revisionId: "empty" };

function PracticeRound({ topic, contentSource, draft, onNoteChange }: {
  topic?: Topic;
  contentSource: string;
  draft: PracticeDraft;
  onNoteChange: (index: number, value: string) => void;
}) {
  const { notes, revisionId } = draft;
  const outline = PREP.flatMap((step, index) => notes[index].trim() ? [`${step.label}: ${notes[index].trim()}`] : []);
  const completedParts = outline.length;
  const nextStep = PREP.find((_, index) => !notes[index].trim());
  const outlineStatus = completedParts === PREP.length ? "PREP outline — 4 of 4 parts" : `PREP draft — ${completedParts} of 4 parts`;
  return (
    <div>
      {topic && <p className="mb-5 text-lg font-semibold text-[var(--text-primary)]" data-practice-prompt>{topic.text}</p>}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="lg:order-last"><SpeechTimer contentSource={contentSource} selfReview /></div>
      {topic ? (
        <div className="min-w-0">

          {topic.talkingPoints.length ? (
            <details className="mt-3 text-sm text-[var(--text-muted)]">
              <summary className="cursor-pointer py-2">Need an angle? See this topic’s talking points</summary>
              <ul className="list-disc space-y-1 pl-5">{topic.talkingPoints.map((point) => <li key={point}>{point}</li>)}</ul>
            </details>
          ) : null}
          <details className="mt-4">
            <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[var(--neon-cyan)]">Optional PREP notes · {completedParts} of 4 parts</summary>
          <div className="mt-4 rounded-xl border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5 p-3 text-sm">
            <p className="font-semibold text-[var(--text-secondary)]" aria-live="polite">{outlineStatus}</p>
            <p className="mt-1 text-[var(--text-muted)]">
              {nextStep ? `Next: ${nextStep.label}. ${nextStep.hint}` : "Ready to practice: choose a time, speak aloud, then revise any part that felt unclear."}
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PREP.map((step, index) => (
              <label key={step.label} className="text-sm font-semibold text-[var(--text-secondary)]">
                {index + 1}. {step.label}
                <textarea
                  value={notes[index]}
                  onChange={(event) => onNoteChange(index, event.target.value)}
                  placeholder={step.hint}
                  rows={2}
                  maxLength={600}
                  className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm font-normal outline-none focus:border-[var(--neon-cyan)]"
                />
              </label>
            ))}
          </div>
          {completedParts > 0 ? <div className="mt-4">
            <GeneratedResultActions
              text={topic.text}
              copyValue={`Speech practice\n${topic.text}\n\n${outlineStatus}\n${outline.join("\n")}`}
              copyLabel={completedParts === PREP.length ? "Copy practice outline" : "Copy practice draft"}
              shareTitle={completedParts === PREP.length ? "My speech practice outline" : "My speech practice draft"}
              saveTopic={{ ...topic, id: `practice-${topic.id}-${revisionId}`, talkingPoints: [outlineStatus, ...outline] }}
              actionViewIdentity={topic.id}
              toolType="speech_practice"
              contentSource={contentSource}
              isPostGenerate
            />
          </div> : <p className="mt-4 text-sm text-[var(--text-muted)]">Add a few words to any field to copy or save a draft. You can start the timer without notes.</p>}
          </details>
          <p className="mt-3 text-xs text-[var(--text-muted)]">Switch between this batch’s topics without losing your notes. Copy or save before generating a new batch or leaving this page. Notes stay in this open page unless you choose Save.</p>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">Generate a topic above to create your practice outline, or use the timer with a topic of your own.</p>
      )}
      </div>
    </div>
  );
}

export default function SpeechPracticePanel({ topics, contentSource }: { topics: Topic[]; contentSource: string }) {
  const [selectedId, setSelectedId] = useState("");
  const [drafts, setDrafts] = useState<Record<string, PracticeDraft>>({});
  const topic = topics.find((item) => item.id === selectedId) ?? topics[0];
  const draft = topic ? drafts[topic.id] ?? EMPTY_DRAFT : EMPTY_DRAFT;

  const updateNote = (index: number, value: string) => {
    if (!topic) return;
    const notes = draft.notes.map((note, i) => i === index ? value : note);
    const previousCount = draft.notes.filter((note) => note.trim()).length;
    const nextCount = notes.filter((note) => note.trim()).length;
    if (previousCount === 0 && nextCount > 0) {
      track("practice_draft_start", { tool_type: "speech_practice", content_source: contentSource, locale: "en" });
    }
    if (previousCount < PREP.length && nextCount === PREP.length) {
      track("practice_outline_ready", { tool_type: "speech_practice", content_source: contentSource, locale: "en" });
    }
    const revisionId = crypto.randomUUID();
    setDrafts((previous) => ({
      ...previous,
      [topic.id]: { notes, revisionId },
    }));
  };
  return (
    <section id="speech-practice" className="glass-card mb-12 p-5 sm:p-7" aria-labelledby="speech-practice-heading">
      <h2 id="speech-practice-heading" className="text-xl font-bold">Turn your topic into a short speech</h2>
      <p className="mb-5 mt-2 text-sm text-[var(--text-muted)]">Start the timer and speak. Afterward, choose one thing to improve and try again. PREP notes are optional.</p>
      {topics.length > 1 ? (
        <label className="mb-5 block text-sm text-[var(--text-secondary)]">
          Topic to practice
          <select value={topic.id} onChange={(event) => {
            setSelectedId(event.target.value);
            track("practice_topic_select", { tool_type: "speech_practice", content_source: contentSource, locale: "en" });
          }} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[var(--bg-primary)] p-3">
            {topics.map((item) => <option key={item.id} value={item.id}>{item.text}</option>)}
          </select>
        </label>
      ) : null}
      <PracticeRound key={topic?.id ?? "own-topic"} topic={topic} contentSource={contentSource} draft={draft} onNoteChange={updateNote} />
    </section>
  );
}
