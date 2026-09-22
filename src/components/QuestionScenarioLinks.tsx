"use client";
import Link from "next/link";
import { track } from "@/lib/track";
export const QUESTION_SCENARIOS = [
  { id: "friends", title: "Meet new people", detail: "Get-to-know-you questions for adults", href: "/topics/get-to-know-you-questions-for-adults" },
  { id: "group", title: "Post in a group chat", detail: "Today's question with group-message copy", href: "/question-of-the-day" },
  { id: "classroom", title: "Start a class discussion", detail: "Student questions with grade-aware filters", href: "/question-of-the-day-for-students" },
  { id: "deep", title: "Go deeper with a partner", detail: "Questions written for a closer conversation", href: "/topics/deep-questions-to-ask-your-partner" },
] as const;
export default function QuestionScenarioLinks() {
  return <nav aria-label="Find questions for your situation" className="mt-6 text-left">
    <p className="text-sm font-semibold text-[var(--text-primary)]">Have a situation in mind?</p>
    <p className="mt-1 text-xs text-[var(--text-muted)]">Open a matching collection, or use the general generator below.</p>
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">{QUESTION_SCENARIOS.map(scene => <Link key={scene.id} href={scene.href}
      onClick={() => track(`question_scenario_${scene.id}`, { content_source: "question_generator", locale: "en" })}
      className="rounded-xl border border-white/10 p-4 transition-colors hover:border-[var(--neon-cyan)]/40">
      <span className="block text-sm font-semibold text-[var(--neon-cyan)]">{scene.title} →</span>
      <span className="mt-1 block text-xs text-[var(--text-muted)]">{scene.detail}</span>
    </Link>)}</div>
  </nav>;
}
