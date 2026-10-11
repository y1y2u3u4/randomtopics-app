"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import "./PracticeDemo.css";

// A 7-second silent loop of the real practice flow (labels and card copy match
// SpeechRoundSteps / SpeechFeedbackResult). Nothing animates until the demo is
// on screen; before that, and under prefers-reduced-motion, it is a static
// poster of the final "compare" step. Example answers are written for the demo,
// not taken from any user recording.

const STEPS = ["Give your answer", "See one suggestion", "Try it once", "Compare answers"] as const;
const TOPIC = "What is something small you learned to do recently?";

function Wave({ live }: { live: boolean }) {
  return (
    <span className={`practice-demo__wave ${live ? "is-live" : ""}`} aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 5) * 90}ms` }} />)}
    </span>
  );
}

export default function PracticeDemo() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const viewed = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let inView = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // demo_view = at least half the demo on screen for one continuous second
    // while the tab is in the foreground; leaving either condition restarts it.
    const sync = () => {
      const qualifies = inView && document.visibilityState === "visible" && !viewed.current;
      if (qualifies && !timer) {
        timer = setTimeout(() => {
          timer = undefined;
          viewed.current = true;
          track("demo_view", { demo: "practice_flow", exposure_rule: "visible_50_1s", content_source: "homepage" });
        }, 1000);
      } else if (!qualifies && timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (inView && !reduce && !started.current) {
        started.current = true;
        setPlaying(true);
        track("demo_play", { demo: "practice_flow", trigger: "auto", content_source: "homepage" });
      }
      sync();
    }, { threshold: [0, 0.5, 1] });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const toggle = () => {
    if (!playing) {
      setPlaying(true);
      setPaused(false);
      started.current = true;
      track("demo_play", { demo: "practice_flow", trigger: "button", content_source: "homepage" });
      return;
    }
    setPaused((p) => !p);
  };

  const state = playing ? (paused ? "is-paused" : "is-playing") : "is-poster";

  return (
    <section ref={root} className="max-w-4xl mx-auto px-4 sm:px-6 pb-10" aria-labelledby="practice-demo-heading">
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 id="practice-demo-heading" className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Turn a topic into speaking practice
            </h2>
            <p className="text-sm text-[var(--text-muted)]">Answer out loud, get one suggestion, try once more and see what changed.</p>
          </div>
          <button type="button" onClick={toggle} className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-lg border border-white/15 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50">
            {!playing ? "▶ Play demo" : paused ? "▶ Resume demo" : "❚❚ Pause demo"}
          </button>
        </div>

        <div className={`practice-demo ${state}`}>
          <ol className="practice-demo__steps" aria-label="Practice steps">
            {STEPS.map((label, i) => <li key={label} className={`practice-demo__step s${i}`}><span>{i + 1}</span>{label}</li>)}
          </ol>

          {/* Frames share one fixed-height stage so nothing shifts as they change. */}
          <div className="practice-demo__stage" aria-hidden={playing ? "true" : undefined}>
            <div className="practice-demo__frame f0">
              <p className="practice-demo__label">Topic</p>
              <p className="practice-demo__topic">{TOPIC}</p>
              <div className="practice-demo__rec"><span className="practice-demo__dot" /> Recording · 0:42 <Wave live /></div>
            </div>
            <div className="practice-demo__frame f1">
              <p className="practice-demo__label">From your answer</p>
              <blockquote className="practice-demo__quote">“I learned to cook omelettes. It was hard at first, and yeah.”</blockquote>
              <p className="practice-demo__card"><strong>Practice this one change · about 20 seconds</strong><br />Add one specific moment that shows why it was hard.</p>
            </div>
            <div className="practice-demo__frame f2">
              <p className="practice-demo__label">Try it once</p>
              <p className="practice-demo__topic">Use your own words — one concrete moment.</p>
              <div className="practice-demo__rec"><span className="practice-demo__dot" /> Recording · 0:20 <Wave live /></div>
            </div>
            <div className="practice-demo__frame f3">
              <p className="practice-demo__result">This change worked</p>
              <div className="practice-demo__compare">
                <blockquote><span>Before</span>“It was hard at first, and yeah.”</blockquote>
                <blockquote><span>Now</span>“My first omelette stuck to the pan, so I watched my grandmother flip one and tried again.”</blockquote>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link href="/speech" onClick={() => track("speech_nav_click", { source: "home_demo", content_source: "homepage" })}
            className="btn-generate inline-flex items-center justify-center gap-2 text-sm">
            🎙️ Try a practice round
          </Link>
          <p className="text-xs text-[var(--text-muted)]">Example answers shown — written for this demo.</p>
        </div>
      </div>
    </section>
  );
}
