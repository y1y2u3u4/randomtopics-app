"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ClassroomBuyButtons from "@/components/ClassroomBuyButtons";
import { CLASSROOM_PACKS, type ClassroomPackId } from "@/lib/classroom/catalog";
import { classroomFetch, trackClassroom } from "@/lib/classroom/client";

type Slide = {
  section: string; label: string; text: string; followUp?: string; level?: string; theme?: string;
  pro?: string; con?: string; timing?: { label: string; prep: number; speak: [number, number]; rule: string };
};
type Deck = { pack: ClassroomPackId; title: string; color: string; full: boolean; total: number; slides: Slide[] };

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Ad-free, full-screen classroom presenter: big text, keyboard paging, optional timer.
// Owners get the whole pack; everyone else the first slides and a way to unlock.
export default function ClassroomPresenter({ pack }: { pack: ClassroomPackId }) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [minutes, setMinutes] = useState(2);
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await classroomFetch(`slides?pack=${pack}`, { optional: true });
        const data = (await res.json()) as Deck;
        setDeck(data);
        if (!opened.current) {
          opened.current = true;
          trackClassroom("classroom_present_open", { pack, access: data.full ? "full" : "preview" });
        }
      } catch {
        setError("The presenter could not load. Check your connection and refresh.");
      }
    })();
  }, [pack]);

  const count = deck ? deck.slides.length + (deck.full ? 0 : 1) : 0;
  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(count - 1, next)));
    setElapsed(0);
    setRunning(false);
  }, [count]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
    } catch { /* not supported (e.g. iOS Safari) */ }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.metaKey || e.ctrlKey) return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(index + 1); }
      else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(index - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(count - 1);
      else if (e.key === "f" || e.key === "F") void toggleFullscreen();
      else if (e.key === "t" || e.key === "T") { setTimerOn(true); setRunning((r) => !r); }
      else if (e.key === "r" || e.key === "R") { setElapsed(0); setRunning(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, count, toggleFullscreen]);

  const info = CLASSROOM_PACKS.find((p) => p.id === pack)!;
  if (error) return <main className="min-h-screen grid place-items-center p-6 text-center"><p role="alert">{error}</p></main>;
  if (!deck) return <main className="min-h-screen grid place-items-center p-6 bg-[#fffdf8] text-[#1b1b2f]"><p>Loading {info.short}…</p></main>;

  const slide = deck.slides[index];
  const timing = slide?.timing;
  const limit = timing ? timing.speak[1] : minutes * 60;
  const shown = timing ? elapsed : Math.max(0, limit - elapsed);
  const signal = timing
    ? elapsed >= timing.speak[1] ? "#d2405f" : elapsed >= (timing.speak[0] + timing.speak[1]) / 2 ? "#e2b100" : elapsed >= timing.speak[0] ? "#1f9d68" : "#5b5b70"
    : elapsed >= limit ? "#d2405f" : limit - elapsed <= 30 ? "#e2b100" : "#1b1b2f";

  return (
    <div ref={root} className="min-h-screen flex flex-col bg-[#fffdf8] text-[#1b1b2f]" style={{ borderLeft: `14px solid ${deck.color}` }} data-classroom-presenter={pack}>
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-10 pt-4 text-sm text-[#5b5b70]">
        <span className="font-semibold" style={{ color: deck.color }}>{info.short}{deck.full ? "" : " · free preview"}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span aria-live="polite">{Math.min(index + 1, count)} / {deck.full ? deck.total : `${deck.slides.length} of ${deck.total}`}</span>
          <button type="button" onClick={() => setTimerOn((v) => !v)} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">{timerOn ? "Hide timer" : "Timer (T)"}</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">Full screen (F)</button>
          <Link href={deck.full ? "/account" : "/classroom-packs"} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">Exit</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-5 sm:px-16 py-8" onClick={(e) => { if ((e.target as HTMLElement).closest("button,a,select")) return; go(index + 1); }}>
        {slide ? (
          <>
            <p className="text-sm sm:text-xl font-bold uppercase tracking-wider" style={{ color: deck.color }}>
              {slide.theme ? `${slide.label} · ${slide.theme}` : slide.pro ? `Motion · ${slide.label}` : `${slide.label} topic · ${slide.section}`}
              {slide.level && <span className="ml-3 normal-case font-normal text-[#5b5b70]">{slide.level}</span>}
            </p>
            <h1 className="mt-4 font-bold leading-tight" style={{ fontSize: slide.text.length > 90 ? "clamp(1.8rem, 4.2vw, 4rem)" : "clamp(2.2rem, 5.6vw, 5.4rem)" }}>{slide.text}</h1>
            {slide.followUp && <p className="mt-8 text-xl sm:text-3xl text-[#5b5b70]"><b style={{ color: deck.color }}>Follow-up:</b> {slide.followUp}</p>}
            {slide.pro && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 text-lg sm:text-2xl">
                <div className="rounded-2xl border-2 border-[#1f9d68] p-5"><b className="block text-base text-[#1f9d68] uppercase tracking-wider">For · Proposition</b>{slide.pro}</div>
                <div className="rounded-2xl border-2 border-[#d2405f] p-5"><b className="block text-base text-[#d2405f] uppercase tracking-wider">Against · Opposition</b>{slide.con}</div>
              </div>
            )}
            {timing && <p className="mt-8 text-xl sm:text-3xl text-[#5b5b70]">{timing.rule}</p>}
          </>
        ) : (
          <div className="max-w-2xl space-y-5" data-classroom-locked>
            <h1 className="text-3xl sm:text-5xl font-bold">That&apos;s the free preview</h1>
            <p className="text-lg sm:text-2xl text-[#5b5b70]">The full pack has {deck.total} slides, plus the editable PPTX and printable PDF. One-time payment, no subscription.</p>
            <div className="rounded-2xl bg-[#1b1b2f] p-5 text-white"><ClassroomBuyButtons pack={pack} page="/classroom/present" /></div>
            <Link href="/classroom-packs" className="underline">Compare classroom packs</Link>
          </div>
        )}
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-10 pb-5">
        <div className="flex gap-2">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="rounded-xl border border-[#d9d4c8] px-5 py-3 text-lg disabled:opacity-40" aria-label="Previous slide">←</button>
          <button type="button" onClick={() => go(index + 1)} disabled={index >= count - 1} className="rounded-xl px-5 py-3 text-lg text-white disabled:opacity-40" style={{ background: deck.color }} aria-label="Next slide">→</button>
        </div>
        {timerOn && slide && (
          <div className="flex flex-wrap items-center gap-3" data-classroom-timer>
            {!timing && (
              <select aria-label="Timer length" value={minutes} onChange={(e) => { setMinutes(Number(e.target.value)); setElapsed(0); }} className="rounded-lg border border-[#d9d4c8] bg-white px-2 py-2">
                {[1, 2, 3, 5, 10].map((m) => <option key={m} value={m}>{m} min</option>)}
              </select>
            )}
            <span className="font-mono text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: signal }} aria-live="off">{clock(shown)}</span>
            <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-lg border border-[#d9d4c8] px-3 py-2">{running ? "Pause" : "Start"}</button>
            <button type="button" onClick={() => { setElapsed(0); setRunning(false); }} className="rounded-lg border border-[#d9d4c8] px-3 py-2">Reset</button>
          </div>
        )}
        <p className="hidden lg:block text-xs text-[#8a8a9a]">← → or Space to move · F full screen · T timer · R reset</p>
      </footer>
    </div>
  );
}
