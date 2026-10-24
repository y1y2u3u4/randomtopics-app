"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { readLocal, trackSub, trackSubUsage, writeLocal } from "@/lib/subs/client";
import { addDays, GRADE_BANDS, gradeBand, mondayOf, type GradeBand } from "@/lib/subs/teacherSchedule";
import SubPaywall from "./SubPaywall";
import { useSubPlan } from "./useSubPlan";

interface Warmup { day: string; kind: string; label: string; prompt: string; task: string }

const TRIAL_DAYS = 3;
const TRIAL_KEY = "rt_teacher_trial";

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function longDate(day: string) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
}
async function fetchWarmups(grade: GradeBand, from: string, days: number): Promise<Warmup[]> {
  const res = await fetch(`/api/sub/teacher?grade=${grade}&from=${from}&days=${days}`);
  if (!res.ok) throw new Error("Could not load warm-ups.");
  return ((await res.json()) as { warmups: Warmup[] }).warmups;
}
/** Plain text that pastes cleanly into a Google Classroom post or question. */
function classroomText(items: Warmup[]) {
  return items.map((w) => `Warm-up — ${longDate(w.day)}\n${w.label}: ${w.prompt}\nTask: ${w.task}`).join("\n\n");
}

export default function TeacherWarmups() {
  const plan = useSubPlan("teacher", { thanks: "Teacher Warm-ups is on — thank you! Ads are off while your plan is active.", pending: "We could not confirm the payment yet. If you paid, reload this page in a minute." });
  const [grade, setGrade] = useState<GradeBand>("g68");
  const [today, setToday] = useState<Warmup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [presenting, setPresenting] = useState<Warmup | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [weekOpen, setWeekOpen] = useState(false);
  const [trialStart, setTrialStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [week, setWeek] = useState<string | null>(null);
  const [weekItems, setWeekItems] = useState<Warmup[] | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of saved grade, trial and the clock */
  useEffect(() => {
    setGrade(gradeBand(readLocal("rt_teacher_grade", "g68")) ?? "g68");
    setTrialStart(readLocal<number | null>(TRIAL_KEY, null));
    setNow(Date.now());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    let cancelled = false;
    fetchWarmups(grade, localToday(), 1)
      .then((items) => { if (!cancelled) { setToday(items[0] ?? null); setError(null); } })
      .catch(() => { if (!cancelled) setError("Could not load today's warm-up. Please try again."); });
    return () => { cancelled = true; };
  }, [grade]);

  const trialLeft = trialStart && now ? Math.max(0, Math.ceil((trialStart + TRIAL_DAYS * 86400000 - now) / 86400000)) : null;
  const pro = plan.active || (trialLeft !== null && trialLeft > 0);

  useEffect(() => {
    if (!weekOpen || !pro || !week) return;
    let cancelled = false;
    fetchWarmups(grade, week, 5)
      .then((items) => { if (!cancelled) setWeekItems(items); })
      .catch(() => { if (!cancelled) setError("Could not load the week. Please try again."); });
    return () => { cancelled = true; };
  }, [weekOpen, pro, week, grade]);

  const chooseGrade = (g: GradeBand) => { setGrade(g); writeLocal("rt_teacher_grade", g); };

  const openWeek = useCallback(() => {
    setWeekOpen(true);
    setWeek((w) => w ?? mondayOf(localToday()));
    if (!plan.active && trialStart === null) {
      const started = Date.now();
      writeLocal(TRIAL_KEY, started);
      setTrialStart(started);
      setNow(started);
      trackSub("teacher", "trial_start");
    }
  }, [plan.active, trialStart]);

  const present = useCallback((w: Warmup) => {
    setPresenting(w);
    trackSubUsage("teacher_present", "teacher", { grade, kind: w.kind });
  }, [grade]);

  useEffect(() => {
    if (!presenting) return;
    const el = stage.current;
    el?.requestFullscreen?.().catch(() => { /* fixed overlay still covers the screen */ });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPresenting(null); };
    const onExit = () => { if (!document.fullscreenElement) setPresenting(null); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onExit);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onExit);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [presenting]);

  const copy = async (key: string, value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(key); setTimeout(() => setCopied(null), 2000); } catch { setCopied(null); }
  };

  return (
    <div className="mx-auto max-w-3xl text-left">
      {plan.message && <p className="mb-3 rounded-xl bg-white/10 px-4 py-2 text-sm" role="status">{plan.message}</p>}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Grade band">
        {GRADE_BANDS.map((g) => (
          <button key={g.id} type="button" onClick={() => chooseGrade(g.id)} aria-pressed={grade === g.id}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${grade === g.id ? "bg-[#f4ecdf] text-[#14110f]" : "border border-white/15 hover:bg-white/10"}`}>
            {g.label}
          </button>
        ))}
        {plan.active && <span className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">Plan active · no ads</span>}
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        {today ? (
          <>
            <p className="text-xs uppercase tracking-wide opacity-70">{longDate(today.day)} · {today.label}</p>
            <p className="mt-2 text-xl font-bold sm:text-2xl">{today.prompt}</p>
            <p className="mt-2 text-sm opacity-80">{today.task}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => present(today)} className="rounded-full bg-[#f4ecdf] px-4 py-2 text-sm font-bold text-[#14110f] hover:opacity-90">⛶ Present fullscreen</button>
              <button type="button" onClick={() => copy("today", classroomText([today]))} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">
                {copied === "today" ? "Copied ✓" : "Copy for Google Classroom"}
              </button>
            </div>
          </>
        ) : (
          <p className="opacity-70">{error ?? "Loading today's warm-up…"}</p>
        )}
      </div>

      <div className="mt-6">
        {!weekOpen ? (
          <button type="button" onClick={openWeek} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">
            📅 Plan the whole week{plan.active ? "" : ` · ${TRIAL_DAYS} days free`}
          </button>
        ) : pro && week ? (
          <section aria-label="Week planner" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => { setWeekItems(null); setWeek(addDays(week, -7)); }} className="rounded-full border border-white/15 px-3 py-1 text-sm hover:bg-white/10" aria-label="Previous week">←</button>
              <p className="text-sm font-semibold">Week of {longDate(week)}</p>
              <button type="button" onClick={() => { setWeekItems(null); setWeek(addDays(week, 7)); }} className="rounded-full border border-white/15 px-3 py-1 text-sm hover:bg-white/10" aria-label="Next week">→</button>
              <label className="ml-auto text-sm">
                <span className="sr-only">Jump to a date</span>
                <input type="date" className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-sm"
                  onChange={(e) => { if (e.target.value) { setWeekItems(null); setWeek(mondayOf(e.target.value)); } }} />
              </label>
            </div>
            {!plan.active && trialLeft !== null && <p className="mt-2 text-xs opacity-70">Free trial: {trialLeft} day{trialLeft === 1 ? "" : "s"} left.</p>}
            <ol className="mt-3 space-y-3">
              {(weekItems ?? []).map((w) => (
                <li key={w.day} className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs uppercase tracking-wide opacity-70">{longDate(w.day)} · {w.label}</p>
                  <p className="mt-1 font-semibold">{w.prompt}</p>
                  <p className="mt-1 text-sm opacity-80">{w.task}</p>
                  <button type="button" onClick={() => present(w)} className="mt-2 text-sm underline opacity-80 hover:opacity-100">Present</button>
                </li>
              ))}
              {!weekItems && <li className="opacity-70">Loading the week…</li>}
            </ol>
            {weekItems && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => copy("week", classroomText(weekItems))} className="rounded-full bg-[#f4ecdf] px-4 py-2 text-sm font-bold text-[#14110f] hover:opacity-90">
                  {copied === "week" ? "Copied ✓" : "Copy the week for Google Classroom"}
                </button>
                <button type="button" onClick={() => window.print()} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">Print</button>
              </div>
            )}
          </section>
        ) : plan.state === "checking" ? (
          <p className="text-sm opacity-70">Checking your plan…</p>
        ) : (
          <SubPaywall product="teacher" note="Your free trial of the week planner has ended. Today's warm-up stays free." />
        )}
      </div>

      {presenting && (
        <div ref={stage} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#14110f] p-8 text-center text-[#f4ecdf]" role="dialog" aria-label="Warm-up presenter">
          <p className="text-lg uppercase tracking-widest opacity-70 sm:text-2xl">{presenting.label}</p>
          <p className="mt-6 max-w-5xl text-3xl font-extrabold leading-tight sm:text-6xl">{presenting.prompt}</p>
          <p className="mt-8 text-lg opacity-80 sm:text-2xl">{presenting.task}</p>
          <button type="button" onClick={() => setPresenting(null)} className="absolute right-4 top-4 rounded-full border border-white/30 px-4 py-2 text-sm">Close (Esc)</button>
        </div>
      )}
    </div>
  );
}
