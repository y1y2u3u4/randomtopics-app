"use client";

import { useState, type CSSProperties } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed, createRng } from "@/lib/randomGenerators";
import {
  SCENARIOS, FIELDS, FIELD_LABELS, DURATIONS, ASPECTS, byScenario, rollDraft, rerollField, buildPrompt, beatTimes,
  type Aspect, type Draft, type Duration, type Field, type Locks, type Refs,
} from "@/lib/generators/minimaxH3";

const TOOL = "minimax_h3_prompt_generator";

// Shot-sheet palette: slate board, chalk text, tally-light amber for "on air".
const SLATE = "#14161a";
const CHALK = "#ece8df";
const TALLY = "#ffb020";
const REC = "#ff4d4d";
const STRIPES: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(135deg, ${CHALK} 0 14px, ${SLATE} 14px 28px)`,
};
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function Pill({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className="rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors"
      style={{
        borderColor: active ? TALLY : "#ffffff22",
        background: active ? TALLY : "transparent",
        color: active ? SLATE : CHALK,
        fontFamily: MONO,
      }}
    >
      {children}
    </button>
  );
}

export default function MinimaxH3PromptGenerator() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = byScenario.get(scenarioId)!;
  const [draft, setDraft] = useState<Draft>(() => rollDraft(SCENARIOS[0], 11));
  const [locks, setLocks] = useState<Locks>({});
  const [duration, setDuration] = useState<Duration>(10);
  const [aspect, setAspect] = useState<Aspect>("16:9");
  const [refs, setRefs] = useState<Refs>({ image: false, video: false, audio: false });
  const [take, setTake] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const prompt = buildPrompt(scenario, draft, duration, aspect, refs);

  const generate = (nextScenario = scenario) => {
    const fresh = nextScenario.id !== scenario.id;
    setDraft(rollDraft(nextScenario, newSeed(), fresh ? undefined : draft, fresh ? {} : locks));
    if (fresh) setLocks({});
    setTake((t) => t + 1);
    track("generate_success", { tool_type: TOOL, scenario: nextScenario.id, duration, aspect, locale: "en" });
  };

  const surprise = () => {
    const rng = createRng(newSeed());
    const next = SCENARIOS[Math.floor(rng() * SCENARIOS.length)];
    setScenarioId(next.id);
    generate(next);
  };

  const chooseScenario = (id: string) => {
    if (id === scenarioId) return;
    setScenarioId(id);
    generate(byScenario.get(id)!);
    track("filter_select", { tool_type: TOOL, filter_name: "scenario", filter_value: id, locale: "en" });
  };

  const reroll = (f: Field) => {
    setDraft(rerollField(scenario, f, draft, newSeed()));
    track("tool_use", { tool_type: TOOL, action: "reroll_field", field: f, locale: "en" });
  };

  const copy = async (text: string, what: string) => {
    if (await copyText(text)) {
      setCopied(what);
      setTimeout(() => setCopied(null), 1600);
      track("copy_result", { tool_type: TOOL, what, scenario: scenarioId, locale: "en" });
    }
  };

  const times = beatTimes(duration);
  const beats = draft.action.split(" | ");

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border" style={{ background: SLATE, color: CHALK, borderColor: "#ffffff1a" }}>
      {/* clapperboard header */}
      <div className="h-4 w-full" style={STRIPES} aria-hidden />
      <div className="grid grid-cols-3 gap-px border-b text-[11px] uppercase tracking-widest" style={{ borderColor: "#ffffff1a", fontFamily: MONO, background: "#ffffff1a" }}>
        <div className="px-3 py-2" style={{ background: SLATE }}>Scene <b style={{ color: TALLY }}>{scenario.label}</b></div>
        <div className="px-3 py-2" style={{ background: SLATE }}>Take <b style={{ color: TALLY }}>{String(take).padStart(2, "0")}</b></div>
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: SLATE }}>
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: REC }} aria-hidden /> {duration}s · {aspect}
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* scenarios */}
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-widest opacity-60" style={{ fontFamily: MONO }}>Scenario</p>
          <div className="flex flex-wrap gap-1.5">
            {SCENARIOS.map((s) => (
              <Pill key={s.id} active={s.id === scenarioId} onClick={() => chooseScenario(s.id)}>
                <span aria-hidden>{s.emoji}</span> {s.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* settings */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-widest opacity-60" style={{ fontFamily: MONO }}>Length</span>
            {DURATIONS.map((d) => <Pill key={d} active={d === duration} onClick={() => setDuration(d)}>{d}s</Pill>)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-widest opacity-60" style={{ fontFamily: MONO }}>Ratio</span>
            {ASPECTS.map((a) => <Pill key={a} active={a === aspect} onClick={() => setAspect(a)}>{a}</Pill>)}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-widest opacity-60" style={{ fontFamily: MONO }}>Refs</span>
            {(["image", "video", "audio"] as const).map((r) => (
              <Pill key={r} active={refs[r]} onClick={() => setRefs((x) => ({ ...x, [r]: !x[r] }))} title={`Add a ${r} reference line`}>
                + {r}
              </Pill>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => generate()}
            className="rounded-lg px-5 py-2.5 text-sm font-bold transition-transform active:scale-95"
            style={{ background: TALLY, color: SLATE }}
          >
            🎬 Generate prompt
          </button>
          <button type="button" onClick={surprise} className="rounded-lg border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "#ffffff33" }}>
            🎲 Surprise scenario
          </button>
          <button type="button" onClick={() => copy(prompt, "prompt")} className="rounded-lg border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: TALLY, color: TALLY }}>
            {copied === "prompt" ? "✓ Copied" : "📋 Copy prompt"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
          {/* shot sheet fields */}
          <ul className="divide-y rounded-xl border" style={{ borderColor: "#ffffff1a" }}>
            {FIELDS.map((f) => (
              <li key={f} className="flex items-start gap-2 px-3 py-2.5" style={{ borderColor: "#ffffff12" }}>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: MONO, color: locks[f] ? TALLY : "#ece8df99" }}>
                    {FIELD_LABELS[f]}{locks[f] ? " · locked" : ""}
                  </p>
                  {f === "action" ? (
                    <ol className="mt-0.5 space-y-0.5 text-sm">
                      {times.map(([a, b], i) => (
                        <li key={i}><span className="mr-1.5 text-xs opacity-60" style={{ fontFamily: MONO }}>{a}–{b}s</span>{beats[i]}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-0.5 text-sm leading-snug">{draft[f]}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`${locks[f] ? "Unlock" : "Lock"} ${FIELD_LABELS[f]}`}
                    aria-pressed={!!locks[f]}
                    onClick={() => setLocks((l) => ({ ...l, [f]: !l[f] }))}
                    className="rounded-md border px-1.5 py-1 text-xs"
                    style={{ borderColor: locks[f] ? TALLY : "#ffffff22", color: locks[f] ? TALLY : CHALK }}
                  >
                    {locks[f] ? "🔒" : "🔓"}
                  </button>
                  <button
                    type="button"
                    aria-label={`Re-roll ${FIELD_LABELS[f]}`}
                    onClick={() => reroll(f)}
                    disabled={!!locks[f]}
                    className="rounded-md border px-1.5 py-1 text-xs disabled:opacity-30"
                    style={{ borderColor: "#ffffff22" }}
                  >
                    ↻
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* script-page preview */}
          <div className="flex flex-col rounded-xl" style={{ background: CHALK, color: SLATE }}>
            <div className="flex items-center justify-between border-b px-4 py-2 text-[11px] uppercase tracking-widest" style={{ borderColor: "#14161a22", fontFamily: MONO }}>
              <span>H3 prompt · {prompt.length} chars</span>
              <button type="button" onClick={() => copy(prompt, "prompt")} className="font-bold underline underline-offset-2">
                {copied === "prompt" ? "copied" : "copy"}
              </button>
            </div>
            <pre className="flex-1 whitespace-pre-wrap break-words px-4 py-3 text-[13px] leading-relaxed" style={{ fontFamily: MONO }} aria-live="polite">
              {prompt}
            </pre>
          </div>
        </div>

        <p className="text-xs opacity-60">
          Paste the prompt into Hailuo 3 / MiniMax H3 (or any tool that runs the model). Lock what you like, re-roll the rest. Unofficial tool, not affiliated with MiniMax.
        </p>
      </div>
    </div>
  );
}
