"use client";

import { useRef, useState } from "react";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import { cleanJokePool, remixPool, pickUnseenJoke, YO_MAMA_THEMES, type CleanJoke, type YoMamaRemix, type YoMamaFilter } from "@/data/yoMama";
import { track } from "@/lib/track";

type Style = "remix" | "clean";
type Action = "both" | "setup" | "ending" | "theme" | "style" | "new_round";
const starter = cleanJokePool("all")[0];
const smallButton = "min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:border-[var(--neon-cyan)]/60 disabled:cursor-not-allowed disabled:opacity-45";

export default function YoMamaRandomizer() {
  const [style, setStyle] = useState<Style>("clean");
  const [theme, setTheme] = useState<YoMamaFilter>("all");
  const [remix, setRemix] = useState<YoMamaRemix>();
  const [clean, setClean] = useState<CleanJoke | undefined>(starter);
  const [revision, setRevision] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [seen, setSeen] = useState(() => ({ remix: new Set<string>(), clean: new Set([starter.id]) }));
  const history = useRef(seen);
  const current = style === "remix" ? remix : clean;
  const pool = style === "remix" ? remixPool(theme) : cleanJokePool(theme);
  const remaining = pool.filter(item => !seen[style].has(item.id)).length;
  const setupRemaining = remix ? remixPool(theme, { ending: remix.ending.id }).some(item => !seen.remix.has(item.id)) : false;
  const endingRemaining = remix ? remixPool(theme, { setup: remix.setup.id }).some(item => !seen.remix.has(item.id)) : false;

  function draw(action: Action, nextStyle = style, nextTheme = theme) {
    const used = new Set(action === "new_round" ? [] : history.current[nextStyle]);
    const candidates = nextStyle === "clean" ? cleanJokePool(nextTheme) : remixPool(nextTheme,
      action === "setup" && remix ? { ending: remix.ending.id } : action === "ending" && remix ? { setup: remix.setup.id } : undefined);
    const result = pickUnseenJoke<CleanJoke | YoMamaRemix>(candidates, used);
    if (!result) {
      if (action === "theme" || action === "style") {
        if (nextStyle === "clean") setClean(undefined); else setRemix(undefined);
      }
      return;
    }
    const params = { tool_type: "yo_mama_randomizer", content_source: "yo_mama_randomizer", action_surface: "yo_mama_tool", result_type: "joke", output_style: nextStyle, category: nextTheme, generation_action: action };
    track("generate_start", params);
    used.add(result.id);
    history.current = { ...history.current, [nextStyle]: used };
    setSeen(history.current);
    if ("setup" in result) setRemix(result); else setClean(result);
    setRevision(value => value + 1);
    setGenerated(true);
    track("generate_success", { ...params, result_count: 1 });
  }

  return <section className="glass-card p-4 sm:p-6 scroll-mt-24" id="yo-mama-tool" aria-label="Yo Mama text randomizer">
    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Joke style">
      {(["clean", "remix"] as const).map(value => <button type="button" key={value} aria-pressed={style === value}
        className={`${smallButton} ${style === value ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]" : ""}`}
        onClick={() => { if (style === value) return; setStyle(value); track("filter_change", { tool_type: "yo_mama_randomizer", filter_name: "style", filter_value: value }); draw("style", value); }}>
        {value === "remix" ? "Absurd remix" : "Clean jokes"}
      </button>)}
    </div>
    <div className="mt-4 min-h-36 rounded-xl border border-[var(--neon-pink)]/25 bg-[var(--neon-pink)]/5 p-4 sm:p-5" aria-live="polite" aria-atomic="true">
      {current ? <>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{generated ? (style === "remix" ? "Your text remix" : "Your clean joke") : "A starter joke"}</p>
        <p className="mt-2 text-xl sm:text-2xl font-bold leading-relaxed break-words" data-yo-mama-result={current.id}>{current.text}</p>
      </> : <p className="text-sm">You have seen every {style === "remix" ? "remix" : "joke"} in this theme. Try another theme, or start a new round.</p>}
    </div>
    <div className="mt-4">
      <button type="button" className="btn-generate w-full min-h-12" onClick={() => draw(remaining ? "both" : "new_round")}>
        {remaining ? (style === "remix" ? "Remix both" : "Another joke") : "Start a new round"}
      </button>
      {style === "remix" && remix && <div className="mt-2 grid grid-cols-2 gap-2">
        <button type="button" className={smallButton} disabled={!setupRemaining} onClick={() => draw("setup")}>New setup</button>
        <button type="button" className={smallButton} disabled={!endingRemaining} onClick={() => draw("ending")}>New ending</button>
      </div>}
    </div>
    {current && <div className="mt-3"><GeneratedResultActions key={`${style}-${revision}`} text={current.text} shareTitle="Yo Mama Randomizer" copyLabel="Copy joke"
      toolType="yo_mama_randomizer" resultType="joke" contentSource="yo_mama_randomizer" actionSurface={`yo_mama_${style}_result`} isPostGenerate={generated} compact /></div>}
    <label className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm font-semibold">
      Theme
      <select aria-label="Joke theme" value={theme} className="min-h-11 w-full sm:w-auto flex-1 rounded-xl border border-white/20 bg-[var(--bg-primary)] px-3 py-2"
        onChange={event => { const value = event.target.value as YoMamaFilter; setTheme(value); track("filter_change", { tool_type: "yo_mama_randomizer", filter_name: "theme", filter_value: value }); draw("theme", style, value); }}>
        <option value="all">All themes{style === "remix" ? " · mix everything" : ""}</option>
        {YO_MAMA_THEMES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </label>
    <p className="mt-2 text-xs text-[var(--text-secondary)]" role="status" data-yo-mama-remaining={remaining}>
      {remaining} of {pool.length} {style === "remix" ? "remixes" : "jokes"} unseen in this theme. {remaining === 0 ? "A new round resets this style across all themes." : "Changing themes keeps your progress."}
    </p>
    <p className="mt-2 text-xs text-[var(--text-secondary)]">{style === "remix" ? "Keep the setup, swap the ending, or remix both. A disabled part has no unseen matches left; try Remix both or another theme." : "Complete, gently silly one-liners. The humor stays on imaginary situations and everyday habits."}</p>
    <p className="mt-2 text-xs text-[var(--text-secondary)]">No repeats within this visit. The starter counts; reloading starts a fresh round.</p>
  </section>;
}
