"use client";
import { useState } from "react";
import type { Topic } from "@/data/types";
import GeneratedResultActions from "./GeneratedResultActions";
import { track } from "@/lib/track";

import { fields, debateDraft } from "@/lib/debatePreparation";

export default function DebatePreparation({ topic }: { topic: Topic }) {
  const [notes, setNotes] = useState(["", "", "", ""]);
  const [started, setStarted] = useState(false);
  const ready = notes.some(note => note.trim());
  return <details className="my-4 rounded-xl border border-white/10 p-4" onToggle={e => { if (e.currentTarget.open) track("debate_prep_open"); }}>
    <summary className="min-h-11 cursor-pointer font-semibold text-[var(--neon-cyan)]">Prepare my argument</summary>
    <p className="text-sm text-[var(--text-muted)] my-3">Write your own case. Research prompts are not verified evidence. Copy your notes before drawing another topic or leaving this page.</p>
    {fields.map((label, i) => <label key={label} className="block my-3 text-sm">{label}<textarea value={notes[i]} maxLength={5000} rows={3} className="block w-full rounded-lg border border-white/20 bg-black/20 p-3 mt-1" onChange={e => {
      const value = e.target.value;
      setNotes(old => old.map((note, j) => i === j ? value : note));
      if (!started && value.trim()) { setStarted(true); track("debate_prep_start"); }
    }} /></label>)}
    {ready && <GeneratedResultActions text={topic.text} copyValue={debateDraft(topic.text, notes)} shareTitle="My debate preparation" copyLabel="Copy my preparation" toolType="debate_preparation" contentSource="debate_hub" actionSurface="debate_preparation" isPostGenerate={false} />}
  </details>;
}
