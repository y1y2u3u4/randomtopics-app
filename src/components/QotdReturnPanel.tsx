"use client";
import { useEffect, useState } from "react";
import PrintButton from "@/components/PrintButton";
import { QOTD_QUESTIONS, qotdIndexForDate } from "@/data/questionOfTheDay";
import { saveHint, weekdayDates, type SaveHint } from "@/lib/qotd/streak";
import { track } from "@/lib/track";

// Under the question on /question-of-the-day (2026-11-06): inline "keep this page handy"
// tip and the printable Monday-Friday plan for classrooms. Both sit in fixed-height boxes
// (no layout shift) and are filled after hydration because they depend on the visitor's
// date and device. No popups: nothing here appears over the page.
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const HINT_TEXT: Record<SaveHint, string> = {
  ios: "Tap the Share button, then Add to Home Screen, and tomorrow's question is one tap away.",
  android: "Open the browser menu (⋮), then Add to Home screen, and tomorrow's question is one tap away.",
  desktop: "Press Ctrl+D (⌘+D on a Mac) to bookmark this page and check the new question each morning.",
  installed: "You're using the home-screen version. A new question arrives every midnight.",
};

export default function QotdReturnPanel() {
  const [hint, setHint] = useState<SaveHint | null>(null);
  const [week, setWeek] = useState<{ day: string; date: string; q: string }[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let standalone = false;
      try { standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true; } catch { /* default: browser tab */ }
      setHint(saveHint(navigator.userAgent, standalone));
      setWeek(weekdayDates(new Date()).map((d) => ({ day: WEEKDAY.format(d), date: DAY.format(d), q: QOTD_QUESTIONS[qotdIndexForDate(d)].q })));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const items = week.map((w) => `${w.day} (${w.date}): ${w.q}`);
  return (
    <section aria-labelledby="qotd-week" className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 print:hidden" data-qotd-return>
      <p className="min-h-[3.5rem] rounded-xl border border-white/10 px-4 py-3 text-sm text-[var(--text-secondary)]" data-qotd-save-hint>
        {hint ? <><span aria-hidden="true">📌 </span><strong className="text-[var(--text-primary)]">Keep it handy.</strong> {HINT_TEXT[hint]}</> : null}
      </p>
      <div className="glass-card mt-4 p-5 sm:p-6">
        <h2 id="qotd-week" className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>This week&apos;s 5 questions</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">One for each school day, the same questions this page shows. Print them for the board or a class handout.</p>
        <ol className="mt-4 min-h-[22rem] space-y-3 text-sm text-[var(--text-secondary)] sm:min-h-[15rem]" data-qotd-week>
          {week.map((w) => (
            <li key={w.day} className="flex gap-3">
              <span className="w-24 shrink-0 font-bold text-[var(--neon-cyan)]">{w.day.slice(0, 3)} <span className="font-normal text-[var(--text-muted)]">{w.date}</span></span>
              <span>{w.q}</span>
            </li>
          ))}
        </ol>
        <div className="mt-2 min-h-11" onClick={() => track("qotd_week_print", { tool_type: "question_of_the_day", content_source: "qotd_week_plan", locale: "en" })}>
          {week.length > 0 && <PrintButton heading="This week's 5 questions" items={items} intro="Question of the Day, Monday to Friday. randomtopics.app/question-of-the-day" label="Print this week's 5 questions" />}
        </div>
      </div>
    </section>
  );
}
