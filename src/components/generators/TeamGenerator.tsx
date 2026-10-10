"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  createRng,
  fromBase64Url,
  makeTeams,
  newSeed,
  parseNames,
  teamCountFor,
  toBase64Url,
  type Person,
} from "@/lib/randomGenerators";
import { makeTeamNames } from "@/lib/generators/teamNames";

type Locale = "en" | "es";

const T = {
  en: {
    names: "Names — one per line (or comma separated)",
    placeholder: "Ava\nBen\nChloe\nDiego\nEmma\nFinn\nGrace\nHiro",
    people: (n: number) => `${n} ${n === 1 ? "person" : "people"}`,
    split: "Split by",
    byTeams: "Number of teams",
    bySize: "People per team",
    teamNames: "Fun team names",
    balance: "Balance teams (gender / skill)",
    balanceHelp: "Tag people below. Tags are spread evenly; skill 1–5 keeps team totals close.",
    tag: "Group",
    level: "Skill",
    tagOptions: [["", "—"], ["girl", "Girl"], ["boy", "Boy"], ["other", "Other"]] as [string, string][],
    generate: "Make teams",
    again: "Shuffle again",
    lockHint: "Tip: tap a name to lock it to its team, then shuffle again.",
    team: (i: number) => `Team ${i + 1}`,
    copy: "Copy teams",
    copied: "Copied ✓",
    share: "Copy share link",
    shared: "Link copied ✓",
    csv: "Download CSV",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    saveAs: "Save this list as…",
    savePlaceholder: "e.g. Period 3",
    save: "Save list",
    saved: "Saved lists",
    remove: "Delete",
    savedNote: "Saved only in this browser — nothing is uploaded.",
    needMore: "Add at least two names to make teams.",
    strength: "skill",
    locked: "locked",
  },
  es: {
    names: "Nombres — uno por línea (o separados por comas)",
    placeholder: "Ana\nBruno\nCarla\nDiego\nElena\nFélix\nGael\nHugo",
    people: (n: number) => `${n} ${n === 1 ? "persona" : "personas"}`,
    split: "Dividir por",
    byTeams: "Número de equipos",
    bySize: "Personas por equipo",
    teamNames: "Nombres de equipo divertidos",
    balance: "Equilibrar equipos (género / nivel)",
    balanceHelp: "Marca a cada persona. Los grupos se reparten por igual y el nivel 1–5 iguala la fuerza total.",
    tag: "Grupo",
    level: "Nivel",
    tagOptions: [["", "—"], ["girl", "Chica"], ["boy", "Chico"], ["other", "Otro"]] as [string, string][],
    generate: "Hacer equipos",
    again: "Mezclar otra vez",
    lockHint: "Consejo: toca un nombre para fijarlo en su equipo y vuelve a mezclar.",
    team: (i: number) => `Equipo ${i + 1}`,
    copy: "Copiar equipos",
    copied: "Copiado ✓",
    share: "Copiar enlace",
    shared: "Enlace copiado ✓",
    csv: "Descargar CSV",
    fullscreen: "Pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    saveAs: "Guardar esta lista como…",
    savePlaceholder: "p. ej. 3.º B",
    save: "Guardar lista",
    saved: "Listas guardadas",
    remove: "Borrar",
    savedNote: "Se guarda solo en este navegador — no se sube nada.",
    needMore: "Añade al menos dos nombres para hacer equipos.",
    strength: "nivel",
    locked: "fijado",
  },
};

interface Meta { tag?: string; level?: number }
interface SharedState { names: string[]; teams: number[][]; labels: string[]; mode: "teams" | "size"; value: number }

const STORAGE_KEY = "rt_team_lists_v1";

function loadLists(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function storeLists(lists: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch {
    /* storage blocked */
  }
}

export default function TeamGenerator({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"teams" | "size">("teams");
  const [value, setValue] = useState(2);
  const [useNames, setUseNames] = useState(true);
  const [balance, setBalance] = useState(false);
  const [meta, setMeta] = useState<Record<string, Meta>>({});
  const [teams, setTeams] = useState<Person[][]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [locks, setLocks] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState("");
  const [lists, setLists] = useState<Record<string, string>>({});
  const [listName, setListName] = useState("");
  const [isFull, setIsFull] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const names = useMemo(() => parseNames(text), [text]);
  const people: Person[] = useMemo(
    () => names.map((name, i) => ({ id: `p${i}`, name, tag: meta[name]?.tag, level: meta[name]?.level })),
    [names, meta],
  );
  const teamCount = teamCountFor(people.length, { mode, value });

  // Saved lists and shared links live in the browser only, so they are read
  // after hydration rather than during render.
  const restore = useCallback(() => {
    setLists(loadLists());
    const d = new URLSearchParams(window.location.search).get("d");
    const decoded = d ? fromBase64Url(d) : null;
    if (!decoded) return;
    try {
      const s = JSON.parse(decoded) as SharedState;
      if (!Array.isArray(s.names) || !Array.isArray(s.teams)) return;
      const ppl = s.names.slice(0, 500).map((name, i) => ({ id: `p${i}`, name: String(name) }));
      setText(ppl.map((p) => p.name).join("\n"));
      setMode(s.mode === "size" ? "size" : "teams");
      setValue(Math.max(1, Number(s.value) || 2));
      setTeams(s.teams.map((ids) => ids.map((i) => ppl[i]).filter(Boolean)));
      setLabels(Array.isArray(s.labels) ? s.labels.map(String) : []);
    } catch {
      /* ignore malformed links */
    }
  }, []);

  useEffect(() => {
    let live = true;
    void Promise.resolve().then(() => live && restore());
    return () => {
      live = false;
    };
  }, [restore]);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const writeShare = useCallback(
    (nextTeams: Person[][], nextLabels: string[]) => {
      const index = new Map(people.map((p, i) => [p.id, i]));
      const payload: SharedState = {
        names,
        teams: nextTeams.map((team) => team.map((p) => index.get(p.id) ?? -1).filter((i) => i >= 0)),
        labels: nextLabels,
        mode,
        value,
      };
      const encoded = toBase64Url(JSON.stringify(payload));
      // Very long rosters would make an unwieldy URL; keep those local only.
      const qs = encoded.length < 6000 ? `?d=${encoded}` : "";
      window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
    },
    [people, names, mode, value],
  );

  const generate = () => {
    if (people.length < 2) return;
    const seed = newSeed();
    const rng = createRng(seed);
    const validLocks = Object.fromEntries(Object.entries(locks).filter(([id, i]) => people.some((p) => p.id === id) && i < teamCount));
    const next = makeTeams(people, { mode, value, balanceTag: balance, balanceLevel: balance, locks: validLocks }, rng);
    const nextLabels = useNames ? (labels.length === next.length && teams.length ? labels : makeTeamNames(next.length, locale, rng)) : [];
    setTeams(next);
    setLabels(nextLabels);
    writeShare(next, nextLabels);
    track("generate_success", { tool_type: "random_team_generator", result_count: next.length, requested_count: people.length, locale, balanced: balance, locked: Object.keys(validLocks).length });
  };

  const toggleLock = (personId: string, teamIndex: number) => {
    setLocks((prev) => {
      const next = { ...prev };
      if (next[personId] === teamIndex) delete next[personId];
      else next[personId] = teamIndex;
      return next;
    });
  };

  const label = (i: number) => labels[i] || t.team(i);

  const tableText = teams.map((team, i) => `${label(i)}: ${team.map((p) => p.name).join(", ")}`).join("\n");

  const flashFor = (what: string) => {
    setFlash(what);
    setTimeout(() => setFlash(""), 1500);
  };

  const downloadCsv = () => {
    const rows = [["team", "name"], ...teams.flatMap((team, i) => team.map((p) => [label(i), p.name]))];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams.csv";
    a.click();
    URL.revokeObjectURL(url);
    track("download_result", { tool_type: "random_team_generator", locale });
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await boardRef.current?.requestFullscreen();
    } catch {
      /* fullscreen not allowed */
    }
  };

  const saveList = () => {
    const key = listName.trim();
    if (!key || names.length === 0) return;
    const next = { ...lists, [key]: names.join("\n") };
    setLists(next);
    storeLists(next);
    setListName("");
  };

  const removeList = (key: string) => {
    const next = { ...lists };
    delete next[key];
    setLists(next);
    storeLists(next);
  };

  const chip = (active: boolean) =>
    `text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
      active
        ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
        : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
    }`;
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const colors = ["var(--neon-pink)", "var(--neon-cyan)", "var(--neon-yellow)", "var(--neon-green)", "var(--neon-purple)", "var(--neon-orange)"];

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <label htmlFor="team-names" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.names}</label>
            <textarea
              id="team-names"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setLocks({});
              }}
              placeholder={t.placeholder}
              rows={9}
              className="mt-2 w-full rounded-xl bg-[var(--bg-secondary)] border border-white/10 p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]/60"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">{t.people(people.length)}</p>
            {Object.keys(lists).length > 0 && (
              <div className="mt-3">
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{t.saved}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(lists).map((key) => (
                    <span key={key} className="inline-flex items-center gap-1 rounded-lg border border-white/10 pl-3 pr-1 py-1 text-sm">
                      <button type="button" onClick={() => { setText(lists[key]); setLocks({}); setTeams([]); }} className="text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]">{key}</button>
                      <button type="button" onClick={() => removeList(key)} aria-label={`${t.remove} ${key}`} className="px-1.5 text-[var(--text-muted)] hover:text-[var(--neon-pink)]">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder={t.savePlaceholder}
                aria-label={t.saveAs}
                className="flex-1 min-w-0 rounded-lg bg-[var(--bg-secondary)] border border-white/10 px-3 py-1.5 text-sm"
              />
              <button type="button" onClick={saveList} disabled={!listName.trim() || names.length === 0} className={`${ghost} disabled:opacity-40`}>{t.save}</button>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">{t.savedNote}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">{t.split}</p>
            <div className="flex flex-wrap gap-2 items-center">
              <button type="button" className={chip(mode === "teams")} onClick={() => setMode("teams")} aria-pressed={mode === "teams"}>{t.byTeams}</button>
              <button type="button" className={chip(mode === "size")} onClick={() => setMode("size")} aria-pressed={mode === "size"}>{t.bySize}</button>
              <input
                type="number"
                min={1}
                max={100}
                value={value}
                onChange={(e) => setValue(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                aria-label={mode === "teams" ? t.byTeams : t.bySize}
                className="w-20 rounded-lg bg-[var(--bg-secondary)] border border-white/10 px-3 py-1.5 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 mt-4 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={useNames} onChange={(e) => { setUseNames(e.target.checked); setLabels([]); }} />
              {t.teamNames}
            </label>
            <label className="flex items-center gap-2 mt-2 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={balance} onChange={(e) => setBalance(e.target.checked)} />
              {t.balance}
            </label>
            {balance && (
              <div className="mt-3">
                <p className="text-xs text-[var(--text-muted)] mb-2">{t.balanceHelp}</p>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5">
                  {[...new Set(names)].map((name) => (
                    <div key={name} className="flex items-center gap-2 px-3 py-1.5 text-sm">
                      <span className="flex-1 truncate text-[var(--text-primary)]">{name}</span>
                      <select
                        aria-label={`${t.tag}: ${name}`}
                        value={meta[name]?.tag ?? ""}
                        onChange={(e) => setMeta((m) => ({ ...m, [name]: { ...m[name], tag: e.target.value || undefined } }))}
                        className="bg-[var(--bg-secondary)] border border-white/10 rounded px-1.5 py-0.5"
                      >
                        {t.tagOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                      <select
                        aria-label={`${t.level}: ${name}`}
                        value={meta[name]?.level ?? ""}
                        onChange={(e) => setMeta((m) => ({ ...m, [name]: { ...m[name], level: e.target.value ? Number(e.target.value) : undefined } }))}
                        className="bg-[var(--bg-secondary)] border border-white/10 rounded px-1.5 py-0.5"
                      >
                        <option value="">{t.level}</option>
                        {[1, 2, 3, 4, 5].map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center mt-6">
          <button type="button" onClick={generate} disabled={people.length < 2} className="btn-generate disabled:opacity-40">
            <span aria-hidden="true">🎲</span> {teams.length ? t.again : t.generate}
          </button>
          {people.length < 2 && <p className="text-xs text-[var(--text-muted)] mt-2">{t.needMore}</p>}
        </div>

        {teams.length > 0 && (
          <>
            <div ref={boardRef} className={`mt-6 ${isFull ? "bg-[var(--bg-primary)] p-8 overflow-auto" : ""}`} data-team-board>
              <div className={`grid gap-4 ${isFull ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {teams.map((team, i) => {
                  const total = team.reduce((s, p) => s + (p.level ?? 0), 0);
                  return (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" style={{ borderTopColor: colors[i % colors.length], borderTopWidth: 3 }}>
                      <p className={`font-bold text-[var(--text-primary)] ${isFull ? "text-3xl" : "text-lg"}`} style={{ fontFamily: "var(--font-display)" }}>
                        {label(i)} <span className="text-xs font-normal text-[var(--text-muted)]">({team.length}{balance && total ? ` · ${t.strength} ${total}` : ""})</span>
                      </p>
                      <ul className="mt-2 space-y-1">
                        {team.map((p) => {
                          const isLocked = locks[p.id] === i;
                          return (
                            <li key={p.id}>
                              <button
                                type="button"
                                onClick={() => toggleLock(p.id, i)}
                                aria-pressed={isLocked}
                                className={`text-left w-full rounded-lg px-2 py-0.5 ${isFull ? "text-2xl" : "text-sm"} ${isLocked ? "text-[var(--neon-yellow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
                              >
                                {isLocked ? "🔒 " : ""}{p.name}
                                {isLocked && <span className="sr-only"> ({t.locked})</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
              {isFull && (
                <div className="flex justify-center gap-3 mt-8">
                  <button type="button" onClick={generate} className="btn-generate">🎲 {t.again}</button>
                  <button type="button" onClick={toggleFullscreen} className={ghost}>{t.exitFullscreen}</button>
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] text-center mt-3">{t.lockHint}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button type="button" className={ghost} onClick={async () => { if (await copyText(tableText)) { flashFor("copy"); track("copy_result", { tool_type: "random_team_generator", locale }); } }}>
                {flash === "copy" ? t.copied : t.copy}
              </button>
              <button type="button" className={ghost} onClick={async () => { if (await copyText(window.location.href)) { flashFor("share"); track("share_click", { tool_type: "random_team_generator", locale }); } }}>
                {flash === "share" ? t.shared : t.share}
              </button>
              <button type="button" className={ghost} onClick={downloadCsv}>{t.csv}</button>
              <button type="button" className={ghost} onClick={toggleFullscreen}>{t.fullscreen}</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
