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

function PracticeRound({ topic, contentSource }: { topic?: Topic; contentSource: string }) {
  const [notes, setNotes] = useState(["", "", "", ""]);
  const [revisionId, setRevisionId] = useState("template");
  const outline = PREP.map((step, index) => `${step.label}: ${notes[index].trim() || step.hint}`);
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
      {topic ? (
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[var(--text-primary)]" data-practice-prompt>{topic.text}</p>
          {topic.talkingPoints.length ? (
            <details className="mt-3 text-sm text-[var(--text-muted)]">
              <summary className="cursor-pointer py-2">Need an angle? See this topic’s talking points</summary>
              <ul className="list-disc space-y-1 pl-5">{topic.talkingPoints.map((point) => <li key={point}>{point}</li>)}</ul>
            </details>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PREP.map((step, index) => (
              <label key={step.label} className="text-sm font-semibold text-[var(--text-secondary)]">
                {index + 1}. {step.label}
                <textarea
                  value={notes[index]}
                  onChange={(event) => {
                    setNotes((previous) => previous.map((note, i) => i === index ? event.target.value : note));
                    setRevisionId(crypto.randomUUID());
                  }}
                  placeholder={step.hint}
                  rows={2}
                  maxLength={600}
                  className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm font-normal outline-none focus:border-[var(--neon-cyan)]"
                />
              </label>
            ))}
          </div>
          <div className="mt-4">
            <GeneratedResultActions
              text={topic.text}
              copyValue={`Speech practice\n${topic.text}\n\n${outline.join("\n")}`}
              copyLabel="Copy practice outline"
              shareTitle="My speech practice outline"
              saveTopic={{ ...topic, id: `practice-${topic.id}-${revisionId}`, talkingPoints: outline }}
              actionViewIdentity={topic.id}
              toolType="speech_practice"
              contentSource={contentSource}
              isPostGenerate
            />
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">Jot down a few words, then speak using the timer. Copy or save your outline before choosing another topic.</p>
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">Generate a topic above to create your practice outline, or use the timer with a topic of your own.</p>
      )}
      <SpeechTimer contentSource={contentSource} />
    </div>
  );
}

export default function SpeechPracticePanel({ topics, contentSource }: { topics: Topic[]; contentSource: string }) {
  const [selectedId, setSelectedId] = useState("");
  const topic = topics.find((item) => item.id === selectedId) ?? topics[0];
  return (
    <section id="speech-practice" className="glass-card mb-12 p-5 sm:p-7" aria-labelledby="speech-practice-heading">
      <h2 id="speech-practice-heading" className="text-xl font-bold">Turn your topic into a short speech</h2>
      <p className="mb-5 mt-2 text-sm text-[var(--text-muted)]">Prepare with Point, Reason, Example, Point — then practice aloud.</p>
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
      <PracticeRound key={topic?.id ?? "own-topic"} topic={topic} contentSource={contentSource} />
    </section>
  );
}
