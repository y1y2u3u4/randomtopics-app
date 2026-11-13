"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SpinWheel from "./SpinWheel";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { fromBase64Url, parseNames, toBase64Url } from "@/lib/randomGenerators";
import { secureInt, weightedIndex } from "@/lib/generators/secure";

const SAMPLE = "Alex\nBlake\nCasey\nDana\nEllis\nFinn\nGray\nHarper";
const SAMPLE_ES = "Ana\nLuis\nCarmen\nDiego\nElena\nMateo\nLucía\nHugo";
const MAX = 200;
const SAVED_KEY = "rt_picker_lists_v1";
const SAVED_KEY_ES = "rt_picker_lists_es_v1";
const LAST_KEY = "rt_picker_last_v1";
const LAST_KEY_ES = "rt_picker_last_es_v1";
const MAX_SAVED = 20;
type Saved = { name: string; text: string };
type WheelLocale = "en" | "es";
const QUICK: { label: string; text: string }[] = [
  { label: "Yes / No", text: "Yes\nNo" },
  { label: "Dinner", text: "Pizza\nTacos\nSushi\nBurgers\nPasta\nCurry\nSalad\nStir fry" },
  { label: "Truth or dare", text: "Truth\nDare" },
  { label: "1 to 10", text: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
  { label: "Who goes first", text: "Player 1\nPlayer 2\nPlayer 3\nPlayer 4" },
];
const QUICK_ES: { label: string; text: string }[] = [
  { label: "Sí / No", text: "Sí\nNo" },
  { label: "Cena", text: "Pizza\nTacos\nSushi\nHamburguesa\nPasta\nCurry\nEnsalada\nSalteado" },
  { label: "Verdad o reto", text: "Verdad\nReto" },
  { label: "Del 1 al 10", text: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
  { label: "Quién empieza", text: "Jugador 1\nJugador 2\nJugador 3\nJugador 4" },
];

const WHEEL_UI = {
  en: {
    aria: (n: number) => `Wheel with ${n} names`,
    needTwo: "Add at least two names to spin the wheel",
    spinning: "Spinning…",
    winner: "Winner",
    pressSpin: "Press Spin to pick a name",
    spinAgain: "Spin again",
    spin: "Spin the wheel",
    namesExtended: "Names or choices on the wheel (",
    names: "Names on the wheel (",
    placeholder: "One name per line\n(or separate with commas)",
    shuffle: "Shuffle",
    sort: "Sort A–Z",
    reset: "Reset",
    clear: "Clear",
    linkCopied: "Link copied ✓",
    copyLink: "Copy link to this wheel",
    savedLists: "Saved lists (kept in this browser)",
    nameThis: "Name this list",
    listName: "List name",
    saved: "Saved ✓",
    save: "Save list",
    delete: (name: string) => `Delete ${name}`,
    quick: "Quick lists",
    import: "Import CSV or TXT",
    importHint: "First column = name, optional second column = weight. Read in your browser, never uploaded.",
    tooBig: "That file is too large (1 MB max).",
    tooFew: "Found fewer than two names in that file.",
    imported: (n: number, file: string) => `Imported ${n} entries from ${file}.`,
    weights: "Give entries different odds (weights)",
    entryWeights: "Entry weights",
    weightFor: (n: string) => `Weight for ${n}`,
    shortcut: "Shortcut: press Ctrl+Enter (Cmd+Enter on Mac) to spin.",
    remove: "Remove the winner after each spin",
    history: (n: number) => `Spin history · ${n} ${n === 1 ? "spin" : "spins"}`,
    clearHistory: "Clear history",
    latest: "Latest first:",
    past: "Past winners: ",
    privacyExtended: "Your lists never leave your browser.",
    privacy: "Your names never leave your browser.",
    fair: " The winner is chosen with your device's secure random generator before the wheel starts turning, so every name has the same chance.",
    defaultList: (n: number) => `List ${n}`,
  },
  es: {
    aria: (n: number) => `Ruleta con ${n} opciones`,
    needTwo: "Añade al menos dos nombres para girar la ruleta",
    spinning: "Girando…",
    winner: "Ganador",
    pressSpin: "Pulsa Girar para elegir un nombre",
    spinAgain: "Girar otra vez",
    spin: "Girar la ruleta",
    namesExtended: "Nombres u opciones en la ruleta (",
    names: "Nombres en la ruleta (",
    placeholder: "Un nombre por línea\n(o sepáralos con comas)",
    shuffle: "Mezclar",
    sort: "Ordenar A–Z",
    reset: "Restablecer",
    clear: "Vaciar",
    linkCopied: "Enlace copiado ✓",
    copyLink: "Copiar enlace de esta ruleta",
    savedLists: "Listas guardadas (se quedan en este navegador)",
    nameThis: "Ponle nombre a la lista",
    listName: "Nombre de la lista",
    saved: "Guardada ✓",
    save: "Guardar lista",
    delete: (name: string) => `Eliminar ${name}`,
    quick: "Listas rápidas",
    import: "Importar CSV o TXT",
    importHint: "La primera columna es el nombre y la segunda, opcional, el peso. Se lee en tu navegador y no se sube.",
    tooBig: "Ese archivo es demasiado grande (máximo 1 MB).",
    tooFew: "En ese archivo hay menos de dos nombres.",
    imported: (n: number, file: string) => `Se importaron ${n} entradas de ${file}.`,
    weights: "Dar distinta probabilidad a cada opción (pesos)",
    entryWeights: "Pesos de las opciones",
    weightFor: (n: string) => `Peso de ${n}`,
    shortcut: "Atajo: pulsa Ctrl+Enter (Cmd+Enter en Mac) para girar.",
    remove: "Quitar al ganador después de cada giro",
    history: (n: number) => `Historial · ${n} ${n === 1 ? "giro" : "giros"}`,
    clearHistory: "Borrar historial",
    latest: "Lo más reciente primero:",
    past: "Ganadores anteriores: ",
    privacyExtended: "Tus listas no salen de tu navegador.",
    privacy: "Tus nombres no salen de tu navegador.",
    fair: " El ganador se elige con el generador aleatorio seguro de tu dispositivo antes de que la ruleta empiece a girar, así que cada nombre tiene la misma probabilidad.",
    defaultList: (n: number) => `Lista ${n}`,
  },
} as const;

export type WheelOfNamesOptions = {
  /** Event prefix: fires {pageId}_use on every spin and {pageId}_share on share. */
  pageId: string;
  /** Adds import (CSV/TXT), per-entry weights, spin counts and Ctrl+Enter to spin. */
  pro?: boolean;
  /** Preloaded entries for a template page. Skips the "last list" restore and save. */
  preset?: string;
  /** Start with "remove the winner after each spin" ticked (raffles, roll calls). */
  removeDefault?: boolean;
  /** Spanish chrome and sample names. English is the default. */
  locale?: WheelLocale;
  /** Replaces the quick-list buttons. Omit to use the locale defaults. */
  quick?: { label: string; text: string }[];
};

const encodeWeights = (names: string[], weights: Record<string, number>) =>
  [...new Set(names)].filter((n) => (weights[n] ?? 1) !== 1).map((n) => `${n.replace(/[\t\n]/g, " ")}\t${weights[n]}`).join("\n");
const decodeWeights = (raw: string) => {
  const out: Record<string, number> = {};
  for (const line of raw.split("\n")) { const [n, w] = line.split("\t"); const v = Math.round(Number(w)); if (n && v >= 1 && v <= 100) out[n] = v; }
  return out;
};

export default function WheelOfNames({ extended }: { extended?: WheelOfNamesOptions } = {}) {
  const locale: WheelLocale = extended?.locale === "es" ? "es" : "en";
  const ui = WHEEL_UI[locale];
  const starter = extended?.preset ?? (locale === "es" ? SAMPLE_ES : SAMPLE);
  const quick = extended?.quick ?? (locale === "es" ? QUICK_ES : QUICK);
  const savedKey = locale === "es" ? SAVED_KEY_ES : SAVED_KEY;
  const lastKey = locale === "es" ? LAST_KEY_ES : LAST_KEY;
  const ev = { tool_type: extended ? extended.pageId : "wheel_of_names", locale };
  const [saved, setSaved] = useState<Saved[]>([]);
  const [listName, setListName] = useState("");
  const ready = useRef(false);
  const pro = Boolean(extended?.pro);
  const preset = extended?.preset;
  const [text, setText] = useState(starter);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [useWeights, setUseWeights] = useState(false);
  const [spins, setSpins] = useState(0);
  const [importMsg, setImportMsg] = useState("");
  const spinRef = useRef<() => void>(() => {});
  const [removeWinner, setRemoveWinner] = useState(Boolean(extended?.removeDefault));
  const [target, setTarget] = useState<{ index: number; nonce: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState("");
  const names = useMemo(() => parseNames(text).slice(0, MAX), [text]);
  // The wheel shows the list as it was when the spin started.
  const [frozen, setFrozen] = useState<string[] | null>(null);
  const shown = frozen ?? names;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("names");
    const decoded = raw ? fromBase64Url(raw) : null;
    if (decoded && parseNames(decoded).length >= 2) {
      void Promise.resolve().then(() => setText(decoded.slice(0, 8000)));
      const wRaw = new URLSearchParams(window.location.search).get("w");
      const wDec = wRaw ? fromBase64Url(wRaw) : null;
      const w = wDec ? decodeWeights(wDec) : {};
      if (Object.keys(w).length) void Promise.resolve().then(() => { setWeights(w); setUseWeights(true); });
      if (new URLSearchParams(window.location.search).get("el") === "1") void Promise.resolve().then(() => setRemoveWinner(true));
    } else if (extended && !preset) {
      try {
        const last = localStorage.getItem(lastKey);
        if (last && parseNames(last).length >= 2) void Promise.resolve().then(() => setText(last.slice(0, 8000)));
      } catch { /* optional */ }
    }
    if (extended) {
      try { const raw = JSON.parse(localStorage.getItem(savedKey) || "[]"); if (Array.isArray(raw)) void Promise.resolve().then(() => setSaved(raw.filter((x) => x && typeof x.name === "string" && typeof x.text === "string").slice(0, MAX_SAVED))); } catch { /* optional */ }
    }
    void Promise.resolve().then(() => { ready.current = true; });
  }, [extended, preset, lastKey, savedKey]);

  useEffect(() => {
    if (!extended || preset || !ready.current) return;
    try { localStorage.setItem(lastKey, text.slice(0, 8000)); } catch { /* optional */ }
  }, [text, extended, preset, lastKey]);
  const persist = (next: Saved[]) => { setSaved(next); try { localStorage.setItem(savedKey, JSON.stringify(next)); } catch { /* optional */ } };
  const saveList = () => {
    const name = listName.trim().slice(0, 40) || ui.defaultList(saved.length + 1);
    if (names.length < 2) return;
    persist([{ name, text }, ...saved.filter((x) => x.name !== name)].slice(0, MAX_SAVED));
    setListName("");
    flashMsg("saved");
  };

  const weightOf = (n: string) => (useWeights ? Math.max(1, Math.min(100, Math.round(weights[n] ?? 1))) : 1);
  const spin = () => {
    if (spinning || names.length < 2) return;
    const index = useWeights ? weightedIndex(names.map(weightOf)) : secureInt(names.length);
    setFrozen(names);
    setWinner("");
    setSpinning(true);
    setTarget({ index, nonce: Date.now() });
  };
  const done = (index: number) => {
    const name = (frozen ?? names)[index];
    setWinner(name);
    setHistory((h) => [name, ...h].slice(0, pro ? 200 : 15));
    setTally((t) => ({ ...t, [name]: (t[name] ?? 0) + 1 }));
    setSpins((n) => n + 1);
    setSpinning(false);
    setFrozen(null);
    if (removeWinner) setText(parseNames(text).filter((n, i) => !(i === index && n === name)).join("\n"));
    track("generate_success", { ...ev, result_count: 1, entries: names.length });
    if (extended) track(`${extended.pageId}_use`, { ...ev, result_count: 1, entries: names.length });
  };
  const flashMsg = (m: string) => { setFlash(m); window.setTimeout(() => setFlash(""), 1500); };
  const share = async () => {
    let url = `${window.location.origin}${window.location.pathname}?names=${toBase64Url(names.join("\n"))}`;
    if (pro) {
      const w = useWeights ? encodeWeights(names, weights) : "";
      if (w) url += `&w=${toBase64Url(w)}`;
      if (removeWinner) url += "&el=1";
    }
    if (await copyText(url)) { flashMsg("link"); track("copy_result", ev); if (extended) track(`${extended.pageId}_share`, { ...ev, share_method: "link" }); }
  };

  const segments = shown.map((label) => ({ label, weight: weightOf(label) }));
  spinRef.current = spin;
  useEffect(() => {
    if (!pro) return;
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); spinRef.current(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pro]);
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_000_000) { setImportMsg(ui.tooBig); return; }
    const { parseWheelFile } = await import("@/lib/wheelImport");
    const res = parseWheelFile(await file.text(), MAX);
    if (res.names.length < 2) { setImportMsg(ui.tooFew); return; }
    setText(res.names.join("\n"));
    if (Object.keys(res.weights).length) { setWeights(res.weights); setUseWeights(true); }
    setImportMsg(ui.imported(res.names.length, file.name.slice(0, 40)));
  };
  const tallyRows = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const btn = "px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-8 grid md:grid-cols-2 gap-6 items-start">
        <div className={extended ? "flex flex-col" : undefined}>
          {shown.length >= 2 ? (
            <div className={extended ? "order-2 w-full max-w-[250px] sm:max-w-[360px] md:max-w-none mx-auto" : undefined}>
            <SpinWheel segments={segments} target={target} onDone={done} ariaLabel={ui.aria(shown.length)} />
            </div>
          ) : (
            <div className={`${extended ? "order-2 " : ""}aspect-square max-w-[360px] mx-auto rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-center p-8 text-[var(--text-muted)]`}>{ui.needTwo}</div>
          )}
          <div className={`text-center ${extended ? "order-3 mt-3 min-h-16" : "mt-4 min-h-20"}`} aria-live="polite">
            {spinning ? <p className="text-xl text-[var(--text-muted)]">{ui.spinning}</p>
              : winner ? <><p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{ui.winner}</p><p className="text-3xl sm:text-4xl font-extrabold gradient-text break-words" style={{ fontFamily: "var(--font-display)" }} data-wheel-winner>{winner}</p></>
              : <p className="text-[var(--text-muted)]">{ui.pressSpin}</p>}
          </div>
          <div className={`flex justify-center ${extended ? "order-1 mb-3 md:order-4 md:mb-0" : ""}`}><button type="button" className="btn-generate" disabled={spinning || names.length < 2} onClick={spin}>🎡 {winner ? ui.spinAgain : ui.spin}</button></div>
        </div>
        <div>
          <label htmlFor="wheel-names" className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{extended ? ui.namesExtended : ui.names}{names.length}{names.length >= MAX ? `, max ${MAX}` : ""})</label>
          <textarea id="wheel-names" value={text} onChange={(e) => setText(e.target.value)} disabled={spinning} rows={10} spellCheck={false}
            className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-[var(--text-primary)] text-base leading-relaxed" placeholder={ui.placeholder} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(names.map((n) => [secureInt(1e9), n] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]).join("\n"))}>{ui.shuffle}</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText([...names].sort((a, b) => a.localeCompare(b, locale === "es" ? "es" : "en")).join("\n"))}>{ui.sort}</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(starter)}>{ui.reset}</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => { setText(""); setWinner(""); }}>{ui.clear}</button>
            <button type="button" className={btn} onClick={share} disabled={names.length === 0}>{flash === "link" ? ui.linkCopied : ui.copyLink}</button>
          </div>
          {extended && (
            <div className="mt-3 rounded-xl border border-white/10 p-3" data-picker-lists>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">{ui.savedLists}</p>
              <div className="flex gap-2">
                <input value={listName} onChange={(e) => setListName(e.target.value)} maxLength={40} placeholder={ui.nameThis} aria-label={ui.listName}
                  className="min-w-0 flex-1 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-1.5 text-base text-[var(--text-primary)]" />
                <button type="button" className={btn} disabled={names.length < 2} onClick={saveList}>{flash === "saved" ? ui.saved : ui.save}</button>
              </div>
              {saved.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {saved.map((l) => (
                    <li key={l.name} className="inline-flex items-center rounded-lg border border-white/10 text-xs">
                      <button type="button" className="px-2.5 py-1.5 hover:text-[var(--neon-cyan)]" disabled={spinning} onClick={() => setText(l.text)}>{l.name} · {parseNames(l.text).length}</button>
                      <button type="button" aria-label={ui.delete(l.name)} className="px-2 py-1.5 text-[var(--text-muted)] hover:text-white" onClick={() => persist(saved.filter((x) => x.name !== l.name))}>×</button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-3 mb-2">{ui.quick}</p>
              <div className="flex flex-wrap gap-2">
                {quick.map((q) => <button key={q.label} type="button" className={btn} disabled={spinning} onClick={() => setText(q.text)}>{q.label}</button>)}
              </div>
            </div>
          )}
          {pro && (
            <div className="mt-3 rounded-xl border border-white/10 p-3 space-y-3" data-wheel-pro>
              <div className="flex flex-wrap items-center gap-2">
                <label className={`${btn} cursor-pointer`}>
                  {ui.import}
                  <input type="file" accept=".txt,.csv,text/plain,text/csv" className="sr-only" disabled={spinning} onChange={(e) => { void importFile(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <span className="text-xs text-[var(--text-muted)]">{ui.importHint}</span>
              </div>
              {importMsg && <p className="text-xs text-[var(--neon-cyan)]" role="status">{importMsg}</p>}
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={useWeights} disabled={spinning} onChange={(e) => setUseWeights(e.target.checked)} /> {ui.weights}</label>
              {useWeights && (
                <ul className="max-h-48 overflow-y-auto space-y-1 pr-1" aria-label={ui.entryWeights}>
                  {[...new Set(names)].map((n) => (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">{n}</span>
                      <input type="number" min={1} max={100} value={weights[n] ?? 1} disabled={spinning} aria-label={ui.weightFor(n)}
                        onChange={(e) => setWeights((w) => ({ ...w, [n]: Math.max(1, Math.min(100, Math.round(Number(e.target.value)) || 1)) }))}
                        className="w-16 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-2 py-1 text-base text-[var(--text-primary)]" />
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-[var(--text-muted)]">{ui.shortcut}</p>
            </div>
          )}
          <label className="flex items-center gap-2 mt-3 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} /> {ui.remove}</label>
          {pro && spins > 0 && (
            <div className="mt-3 rounded-xl border border-white/10 p-3 text-sm text-[var(--text-secondary)]" data-wheel-history>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{ui.history(spins)}</span>
                <button type="button" className="text-xs text-[var(--text-muted)] hover:text-white" onClick={() => { setHistory([]); setTally({}); setSpins(0); }}>{ui.clearHistory}</button>
              </div>
              <p>{tallyRows.map(([n, c]) => `${n} ×${c}`).join(" · ")}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{ui.latest} {history.slice(0, 10).join(" → ")}</p>
            </div>
          )}
          {!pro && history.length > 0 && <p className="text-sm text-[var(--text-secondary)] mt-3"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{ui.past}</span>{history.join(" · ")}</p>}
          <p className="text-xs text-[var(--text-muted)] mt-3">{extended ? ui.privacyExtended : ui.privacy}{ui.fair}</p>
        </div>
      </div>
    </section>
  );
}
