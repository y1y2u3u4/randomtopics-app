"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed, createRng } from "@/lib/randomGenerators";
import { MODES, byMode, defaultState, clonePicks, togglePick, surprisePicks, buildPrompt, type Mode, type Picks } from "@/lib/generators/aiPrompt";

const TOOL = "ai_prompt_generator";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)] text-[#0a0a12]"
          : "border-white/15 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60 hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function AiPromptGenerator() {
  const [mode, setMode] = useState<Mode>("image");
  const def = byMode.get(mode)!;
  const [idea, setIdea] = useState(() => defaultState("image").idea);
  const [picks, setPicks] = useState<Picks>(() => defaultState("image").picks);
  const [target, setTarget] = useState(() => defaultState("image").target);
  const [preset, setPreset] = useState<string | null>(() => MODES[0].presets.find((p) => p.idea === MODES[0].defaultIdea)?.id ?? MODES[0].presets[0].id);
  const [copied, setCopied] = useState(false);

  const prompt = buildPrompt(mode, idea, picks, target);
  const targetDef = def.targets.find((t) => t.id === target) ?? def.targets[0];

  const switchMode = (m: Mode) => {
    if (m === mode) return;
    const s = defaultState(m);
    setMode(m);
    setIdea(s.idea);
    setPicks(s.picks);
    setTarget(s.target);
    setPreset(byMode.get(m)!.presets.find((p) => p.idea === s.idea)?.id ?? null);
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "mode", value: m });
  };

  const applyPreset = (id: string) => {
    const p = def.presets.find((x) => x.id === id);
    if (!p) return;
    setIdea(p.idea);
    setPicks(clonePicks(p.picks));
    if (p.target) setTarget(p.target);
    setPreset(id);
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "preset", value: `${mode}:${id}` });
  };

  const toggle = (fieldId: string, optionId: string) => {
    setPicks((cur) => togglePick(mode, cur, fieldId, optionId));
    setPreset(null);
    track("tool_use", { tool_type: TOOL, locale: "en", action: "option", value: `${mode}:${fieldId}` });
  };

  const surprise = () => {
    setPicks((cur) => surprisePicks(mode, cur, createRng(newSeed())));
    setPreset(null);
    track("generate_success", { tool_type: TOOL, locale: "en", mode });
  };

  const copy = async () => {
    const ok = await copyText(prompt);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    track("copy_result", { tool_type: TOOL, locale: "en", mode, target });
  };

  const CopyButton = ({ big }: { big?: boolean }) => (
    <button
      type="button"
      onClick={copy}
      className={`rounded-lg font-bold transition-colors ${big ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs"} bg-[var(--neon-cyan)] text-[#0a0a12] hover:brightness-110`}
    >
      {copied ? "✓ Copied" : "Copy prompt"}
    </button>
  );

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-4 sm:p-7 space-y-4">
        <div role="tablist" aria-label="Prompt type" className="grid grid-cols-3 gap-1 rounded-xl bg-white/5 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === mode}
              onClick={() => switchMode(m.id)}
              className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-bold transition-colors ${
                m.id === mode ? "bg-[var(--neon-cyan)] text-[#0a0a12]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span aria-hidden="true">{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{def.ideaLabel}</span>
          <textarea
            value={idea}
            onChange={(e) => { setIdea(e.target.value); setPreset(null); }}
            placeholder={def.ideaPlaceholder}
            rows={2}
            maxLength={400}
            className="mt-1 w-full resize-y rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)]"
          />
        </label>

        <div className="rounded-xl border border-[var(--neon-cyan)]/40 bg-black/40 p-3 sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex gap-1 overflow-x-auto" role="radiogroup" aria-label="Format for">
              {def.targets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={t.id === target}
                  onClick={() => { setTarget(t.id); track("filter_select", { tool_type: TOOL, locale: "en", filter: "target", value: `${mode}:${t.id}` }); }}
                  className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold ${
                    t.id === target ? "bg-white/15 text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <CopyButton />
          </div>
          <pre aria-live="polite" className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[var(--text-primary)]" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}>
            {prompt}
          </pre>
          <p className="mt-2 text-[11px] text-[var(--text-muted)]">{targetDef.hint}</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Start from an example</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            {def.presets.map((p) => (
              <Chip key={p.id} active={preset === p.id} onClick={() => applyPreset(p.id)}>{p.label}</Chip>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-4">
          {def.fields.map((f) => (
            <div key={f.id}>
              <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                {f.label}
                <span className="ml-1 font-normal text-[var(--text-muted)]">{f.multi ? "· pick any" : "· pick one"}</span>
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
                {f.options.map((opt) => (
                  <Chip key={opt.id} active={(picks[f.id] ?? []).includes(opt.id)} onClick={() => toggle(f.id, opt.id)}>{opt.label}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <CopyButton big />
          <button
            type="button"
            onClick={surprise}
            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/60"
          >
            🎲 Surprise me
          </button>
          <span className="text-xs text-[var(--text-muted)]">Surprise me shuffles the style options and keeps your idea, size and “avoid” list.</span>
        </div>
      </div>
    </section>
  );
}
