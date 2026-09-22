"use client";

import { useState } from "react";
import GeneratedResultActions from "./GeneratedResultActions";
import type { QotdCategory } from "@/data/questionOfTheDay";
import { track } from "@/lib/track";

export default function QotdListActions({ question, category, index }: { question: string; category: QotdCategory; index: number }) {
  const [open, setOpen] = useState(false);
  return <details onToggle={(event) => {
    setOpen(event.currentTarget.open);
    if (event.currentTarget.open) track("qotd_list_open", { tool_type: "question_of_the_day", content_source: "qotd_hub", action_surface: "qotd_list", locale: "en" });
  }} className="mt-2">
    <summary className="inline-flex min-h-11 cursor-pointer items-center text-xs font-semibold text-[var(--neon-cyan)]">Use this question · copy or save</summary>
    {open && <div className="py-2"><GeneratedResultActions text={question} copyLabel="Copy question" shareTitle="Question of the Day"
      saveTopic={{ id: `qotd-${index}`, text: question, category: "relationships", modes: ["conversation", "icebreaker"], depth: category === "deep" ? "deep" : "light", talkingPoints: [] }}
      toolType="question_of_the_day" contentSource="qotd_hub" actionSurface="qotd_list" isPostGenerate={false} showSavedLink compact />
    </div>}
  </details>;
}
