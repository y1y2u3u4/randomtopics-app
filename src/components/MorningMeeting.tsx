"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";
import ClassroomProjector from "./ClassroomProjector";
import { morningMeetingFor } from "@/data/morningMeeting";
import { KIDS_GRADES, type KidsGrade } from "@/data/kidsQuestions";

const DAY = 86_400_000;
// Local calendar day as "y-m-d" (stable string, so React sees no change within a day);
// null while server-rendering, so the static HTML never bakes in a build-time date.
const subscribe = () => () => {};
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const chip = (active: boolean) => `min-h-11 text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
  active
    ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
    : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
}`;

// Today's morning meeting: greeting, sharing question, activity and a morning
// message. Chosen from the visitor's local date, so the whole class — and every
// refresh that day — gets the same set; the arrows look ahead or back a day.
export default function MorningMeeting() {
  const dayKey = useSyncExternalStore(subscribe, localDay, () => null);
  const [offset, setOffset] = useState(0);
  const [grade, setGrade] = useState<KidsGrade | "all">("all");
  const [projecting, setProjecting] = useState(false);
  const [copied, setCopied] = useState(false);

  const date = useMemo(() => {
    if (!dayKey) return null;
    const [y, m, d] = dayKey.split("-").map(Number);
    return new Date(new Date(y, m, d, 12).getTime() + offset * DAY);
  }, [dayKey, offset]);
  const set = date ? morningMeetingFor(date, grade) : null;
  const message = date ? `Good morning, friends! Today is ${fmt(date)}. Today we will learn, try our best and be kind. Share time question: ${set!.share.text}` : "";

  const cards = set ? [
    { kicker: "1 · Greeting", title: set.greeting.name, body: set.greeting.how },
    { kicker: "2 · Sharing", title: set.share.text, body: "Go around the circle, or ask three volunteers. Listeners can ask one follow-up question." },
    { kicker: "3 · Group activity", title: set.activity.name, body: set.activity.how },
    { kicker: "4 · Morning message", title: message, body: "Read it together, then point to one word everyone can find." },
  ] : [];

  const move = (d: number) => {
    setOffset((o) => o + d);
    track("morning_meeting_day_change", { content_source: "morning_meeting", value: d });
  };
  const copy = async () => {
    const text = cards.map((c) => `${c.kicker}: ${c.title}\n${c.body}`).join("\n\n");
    const ok = await copyText(text).catch(() => false);
    setCopied(ok);
    track(ok ? "copy_question" : "bank_question_copy_error", { content_source: "morning_meeting" });
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
      <div className="text-center mb-8">
        <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>Morning Meeting Questions</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">A ready-made morning meeting for every school day: greeting, sharing question, group activity and morning message. Same set for the whole class all day — no planning needed.</p>
      </div>

      <div className="glass-card p-6 sm:p-10" data-morning-meeting>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Grade level">
          {[{ id: "all" as const, label: "Grades K–6" }, ...KIDS_GRADES].map((g) => (
            <button key={g.id} type="button" aria-pressed={grade === g.id} className={chip(grade === g.id)}
              onClick={() => { setGrade(g.id); track("filter_select", { content_source: "morning_meeting", filter_name: "grade", filter_value: g.id }); }}>{g.label}</button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-2">
          <button type="button" onClick={() => move(-1)} className="min-h-11 rounded-xl border border-white/10 px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Previous day">← Day before</button>
          <p className="text-center text-sm font-semibold text-[var(--text-primary)]" aria-live="polite" data-meeting-date>
            {date ? (offset === 0 ? `Today · ${fmt(date)}` : fmt(date)) : "Loading today’s meeting…"}
          </p>
          <button type="button" onClick={() => move(1)} className="min-h-11 rounded-xl border border-white/10 px-3 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label="Next day">Next day →</button>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {(cards.length ? cards : [1, 2, 3, 4].map((n) => ({ kicker: `${n}`, title: "", body: "" }))).map((c, i) => (
            <li key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 min-h-[8rem]">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">{c.kicker}</p>
              <p className="mt-2 text-base sm:text-lg font-semibold text-[var(--text-primary)] break-words" data-meeting-card={i}>{c.title}</p>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{c.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button type="button" disabled={!cards.length} data-projector-open className="btn-generate disabled:opacity-50"
            onClick={() => { setProjecting(true); track("classroom_projector_open", { content_source: "morning_meeting", deck_size: 4 }); }}>
            <span>📺</span> Project today’s meeting
          </button>
          <button type="button" onClick={copy} disabled={!cards.length} className="min-h-11 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-[var(--text-primary)] disabled:opacity-50">
            {copied ? "✓ Copied" : "📋 Copy for my plan book"}
          </button>
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-4">Refresh as often as you like — today’s set stays the same. Tomorrow brings a new one.</p>
      </div>
      {projecting && cards.length > 0 && (
        <ClassroomProjector deck={cards.map((c, i) => (i === 0 || i === 2 ? `${c.title} — ${c.body}` : c.title))} kickers={cards.map((c) => c.kicker)} title={`Morning meeting · ${fmt(date!)}`} source="morning_meeting" color="#e2a100" onClose={() => setProjecting(false)} />
      )}
    </section>
  );
}
