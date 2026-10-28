"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, fromBase64Url, newSeed, parseNames, shuffle, toBase64Url } from "@/lib/randomGenerators";
import { typingTarget, usePreset } from "@/components/generators/QuickSet";
import { GROUP_ROLES, groupCountFor, makeGroups, parsePairs, type GroupResult } from "@/lib/groupRules";
import { makeTeamNames } from "@/lib/generators/teamNames";
import PrintButton from "@/components/PrintButton";

// Shared with /random-team-generator, so a class list saved on either page shows up on both.
const STORAGE_KEY = "rt_team_lists_v1";
const SAMPLE = "Ava\nBen\nChloe\nDiego\nEmma\nFinn\nGrace\nHiro\nIsla\nJonah\nKai\nLuna\nMateo\nNia\nOmar\nPriya";
const COLORS = ["#7c5cff", "#00b8d9", "#1f9d68", "#e2a100", "#e8590c", "#d2405f", "#3b82f6", "#9c36b5"];

function loadLists(): Record<string, string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch { return {}; }
}
function storeLists(lists: Record<string, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lists)); } catch { /* storage blocked */ }
}

const chip = (active: boolean) => `min-h-11 text-sm px-3.5 py-2 rounded-lg border transition-all ${
  active ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]" : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
}`;
const field = "w-full rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--neon-cyan)]/50 outline-none";

/**
 * Random group generator for classes: paste a roster, split by number of groups
 * or group size, add "keep together" / "keep apart" rules, optional fun group
 * names and roles, then project, copy or print.
 */
export default function GroupGenerator() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"groups" | "size">("size");
  const [value, setValue] = useState(4);
  const [togetherText, setTogetherText] = useState("");
  const [apartText, setApartText] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [funNames, setFunNames] = useState(false);
  const [roles, setRoles] = useState(false);
  const [result, setResult] = useState<GroupResult | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [roleOf, setRoleOf] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState("");
  const [lists, setLists] = useState<Record<string, string>>({});
  const [listName, setListName] = useState("");
  const [big, setBig] = useState(false);
  const bigRoot = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);

  const names = useMemo(() => [...new Set(parseNames(text))], [text]);
  const together = useMemo(() => parsePairs(togetherText, names), [togetherText, names]);
  const apart = useMemo(() => parsePairs(apartText, names), [apartText, names]);
  const count = groupCountFor(names.length, mode, value);
  // Rule lines that name fewer than two people from the list (usually a typo).
  const unknownRules = [togetherText, apartText].flatMap((t) => t.split(/\r?\n/)).filter((l) => l.trim() && parsePairs(l, names).length === 0).length;

  useEffect(() => {
    let live = true;
    void Promise.resolve().then(() => {
      if (!live) return;
      setLists(loadLists());
      // Shared result link: ?g=<base64url {n: names, g: [[index...]], m, v}>
      try {
        const raw = new URLSearchParams(window.location.search).get("g");
        const d = raw ? JSON.parse(fromBase64Url(raw) ?? "null") : null;
        if (d && Array.isArray(d.n) && Array.isArray(d.g)) {
          const nm = d.n.slice(0, 300).map(String);
          setText(nm.join("\n"));
          setMode(d.m === "groups" ? "groups" : "size");
          setValue(Math.max(1, Math.min(100, Number(d.v) || 4)));
          setResult({ groups: d.g.map((g: number[]) => g.map((i) => nm[i]).filter(Boolean)), broken: [] } as unknown as GroupResult);
        }
      } catch { /* ignore malformed links */ }
    });
    return () => { live = false; };
  }, []);

  const generate = useCallback((over?: { names?: string[]; mode?: "groups" | "size"; value?: number }, source = "button") => {
    const nm = over?.names ?? names;
    if (nm.length < 2) return;
    const m = over?.mode ?? mode, v = over?.value ?? value;
    const rng = createRng(newSeed());
    const next = makeGroups(nm, groupCountFor(nm.length, m, v), { together: over?.names ? [] : together, apart: over?.names ? [] : apart }, rng);
    setResult(next);
    setLabels(funNames ? makeTeamNames(next.groups.length, "en", rng) : []);
    const r: Record<string, string> = {};
    if (roles) for (const g of next.groups) {
      shuffle(g, rng).forEach((n, i) => { if (i < GROUP_ROLES.length) r[n] = GROUP_ROLES[i]; });
    }
    setRoleOf(r);
    track("generate_success", { tool_type: "random_group_generator", result_count: next.groups.length, requested_count: nm.length, together_rules: together.length, apart_rules: apart.length, broken_rules: next.broken.length, roles, fun_names: funNames });
    track("random_group_generator_use", { tool_type: "random_group_generator", result_count: next.groups.length, requested_count: nm.length, content_source: source });
    setHistory((h) => [next.groups.map((g, i) => `Group ${i + 1}: ${g.join(", ")}`).join("\n"), ...h].slice(0, 5));
    try {
      const idx = new Map(nm.map((n, i) => [n, i]));
      const enc = toBase64Url(JSON.stringify({ n: nm, g: next.groups.map((g) => g.map((n) => idx.get(n) ?? -1)), m, v }));
      window.history.replaceState(null, "", enc.length < 6000 ? `${window.location.pathname}?g=${enc}` : window.location.pathname);
    } catch { /* optional */ }
  }, [names, mode, value, together, apart, funNames, roles]);

  const quick = useCallback((id: string, source: string) => {
    const [kind, num] = id.split("-");
    const m = kind === "groups" ? "groups" : "size", v = Number(num) || 4;
    setMode(m); setValue(v);
    const empty = names.length < 2;
    if (empty) setText(SAMPLE);
    generate({ mode: m, value: v, ...(empty ? { names: parseNames(SAMPLE) } : {}) }, `${source}_${id}`);
    window.setTimeout(() => document.querySelector("[data-group-results]")?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 80);
  }, [names, generate]);
  usePreset("groups", (id) => quick(id, "section"));
  const keyRef = useRef<() => void>(() => {});
  useEffect(() => { keyRef.current = () => generate(undefined, "keyboard"); });
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (document.querySelector("[data-classroom-projector]")) return;
      const combo = (e.ctrlKey || e.metaKey) && e.key === "Enter";
      if (combo || ((e.key === " " || e.key === "Enter") && !typingTarget(e.target) && !e.metaKey && !e.ctrlKey)) { e.preventDefault(); keyRef.current(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const label = (i: number) => labels[i] || `Group ${i + 1}`;
  const groups = result?.groups ?? [];
  const lineFor = (g: string[], i: number) => `${label(i)}: ${g.map((n) => (roleOf[n] ? `${n} (${roleOf[n]})` : n)).join(", ")}`;

  const flashFor = (what: string) => { setFlash(what); setTimeout(() => setFlash(""), 1500); };
  const copy = async () => {
    if (await copyText(groups.map(lineFor).join("\n"))) flashFor("copied");
    track("copy_result", { tool_type: "random_group_generator", result_count: groups.length });
    track("random_group_generator_share", { tool_type: "random_group_generator", share_method: "copy" });
  };
  const copyLink = async () => {
    if (await copyText(window.location.href)) flashFor("link");
    track("random_group_generator_share", { tool_type: "random_group_generator", share_method: "link" });
  };

  const openBig = useCallback(async () => {
    setBig(true);
    track("classroom_projector_open", { content_source: "random_group_generator", deck_size: groups.length });
    try { await document.documentElement.requestFullscreen?.(); } catch { /* not supported */ }
  }, [groups.length]);
  const closeBig = useCallback(() => {
    setBig(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    if (!big) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bigRoot.current?.focus();
    const onFs = () => { if (!document.fullscreenElement) setBig(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) closeBig();
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); generate(undefined, "keyboard"); }
    };
    document.addEventListener("fullscreenchange", onFs);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("fullscreenchange", onFs); window.removeEventListener("keydown", onKey); };
  }, [big, closeBig, generate]);

  const saveList = () => {
    const key = listName.trim();
    if (!key || !names.length) return;
    const next = { ...lists, [key]: names.join("\n") };
    setLists(next); storeLists(next); setListName("");
  };
  const removeList = (key: string) => { const next = { ...lists }; delete next[key]; setLists(next); storeLists(next); };

  const cards = (light: boolean) => (
    <div className={`grid gap-3 ${groups.length > 6 ? "sm:grid-cols-3 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3"}`} data-group-results>
      {groups.map((g, i) => (
        <div key={i} className={`rounded-2xl p-4 border-t-4 ${light ? "bg-white shadow-sm" : "bg-[rgba(255,255,255,0.04)] border border-white/10"}`} style={{ borderTopColor: COLORS[i % COLORS.length] }}>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className={`font-bold ${light ? "text-[#1b1b2f]" : "text-[var(--text-primary)]"}`} style={{ fontSize: light ? "clamp(1.1rem, 2vw, 1.8rem)" : undefined }}>{label(i)}</h3>
            <span className={`text-xs ${light ? "text-[#5b5b70]" : "text-[var(--text-muted)]"}`}>{g.length}</span>
          </div>
          <ul className="mt-2 space-y-1">
            {g.map((n) => (
              <li key={n} className={light ? "text-[#1b1b2f]" : "text-[var(--text-secondary)] text-sm"} style={{ fontSize: light ? "clamp(1rem, 1.7vw, 1.6rem)" : undefined }}>
                {n}{roleOf[n] && <span className={`ml-1.5 text-xs font-semibold ${light ? "text-[#7c5cff]" : "text-[var(--neon-cyan)]"}`}>· {roleOf[n]}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <section id="tool" className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 scroll-mt-20">
      <div className="text-center mb-8">
        <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>Random Group Generator</h1>
        <p className="text-[var(--text-muted)] max-w-2xl mx-auto">Paste your class list and get fair random groups in one click. Keep certain students together or apart, hand out group roles, then put the groups on the board or print them. Free, no sign-up, nothing uploaded.</p>
      </div>

      <div className="glass-card p-5 sm:p-8" data-group-generator>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="group-names" className="text-sm font-semibold text-[var(--text-primary)]">Names — one per line or comma separated</label>
            <textarea id="group-names" value={text} onChange={(e) => setText(e.target.value)} rows={9} placeholder={SAMPLE} className={`${field} mt-2 font-mono`} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>{names.length} {names.length === 1 ? "name" : "names"}</span>
              {!text && <button type="button" onClick={() => setText(SAMPLE)} className="underline hover:text-[var(--text-primary)]">Try a sample class</button>}
              {Object.keys(lists).map((k) => (
                <span key={k} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
                  <button type="button" onClick={() => setText(lists[k])} className="hover:text-[var(--text-primary)]">📋 {k}</button>
                  <button type="button" onClick={() => removeList(k)} aria-label={`Delete ${k}`} className="hover:text-[var(--text-primary)]">×</button>
                </span>
              ))}
            </div>
            {names.length > 0 && (
              <div className="mt-2 flex gap-2">
                <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder="Save as… e.g. Period 3" className={`${field} py-2`} aria-label="List name" />
                <button type="button" onClick={saveList} className="shrink-0 rounded-xl border border-white/15 px-3 text-sm text-[var(--text-primary)]">Save list</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Split by</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => { setMode("size"); setValue(4); }} aria-pressed={mode === "size"} className={chip(mode === "size")}>People per group</button>
                <button type="button" onClick={() => { setMode("groups"); setValue(4); }} aria-pressed={mode === "groups"} className={chip(mode === "groups")}>Number of groups</button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(mode === "size" ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 8]).map((n) => (
                  <button key={n} type="button" onClick={() => setValue(n)} aria-pressed={value === n} className={chip(value === n)}>{mode === "size" && n === 2 ? "Pairs" : mode === "size" && n === 3 ? "Trios" : n}</button>
                ))}
                <input type="number" min={1} max={100} value={value} onChange={(e) => setValue(Math.max(1, Math.min(100, Number(e.target.value) || 1)))} className={`${field} w-20 py-2 text-center`} aria-label={mode === "size" ? "People per group" : "Number of groups"} />
              </div>
              {names.length >= 2 && <p className="mt-2 text-xs text-[var(--text-muted)]">{names.length} names → {count} groups of {Math.floor(names.length / count)}{names.length % count ? `–${Math.ceil(names.length / count)}` : ""}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowRules((s) => !s)} aria-expanded={showRules} className={chip(showRules || together.length + apart.length > 0)}>🔗 Together / apart rules{together.length + apart.length ? ` (${together.length + apart.length})` : ""}</button>
              <button type="button" onClick={() => setRoles((s) => !s)} aria-pressed={roles} className={chip(roles)}>🎭 Group roles</button>
              <button type="button" onClick={() => setFunNames((s) => !s)} aria-pressed={funNames} className={chip(funNames)}>✨ Fun group names</button>
            </div>

            {showRules && (
              <div className="grid gap-3 sm:grid-cols-2" data-group-rules>
                <label className="text-xs text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-primary)]">Keep together</span> — one pair per line
                  <textarea value={togetherText} onChange={(e) => setTogetherText(e.target.value)} rows={3} placeholder={"Ava + Ben\nKai + Luna"} className={`${field} mt-1 font-mono`} aria-label="Keep together" />
                </label>
                <label className="text-xs text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-primary)]">Keep apart</span> — one pair per line
                  <textarea value={apartText} onChange={(e) => setApartText(e.target.value)} rows={3} placeholder={"Diego + Emma\nFinn + Grace"} className={`${field} mt-1 font-mono`} aria-label="Keep apart" />
                </label>
                {unknownRules > 0 && <p className="sm:col-span-2 text-xs text-[#e2a100]">{unknownRules} rule {unknownRules === 1 ? "line uses a name" : "lines use names"} not in the list — check the spelling.</p>}
              </div>
            )}
            {roles && <p className="text-xs text-[var(--text-muted)]">Roles: {GROUP_ROLES.slice(0, Math.min(GROUP_ROLES.length, Math.ceil(names.length / count) || 4)).join(", ")}.</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => generate()} disabled={names.length < 2} className="btn-generate disabled:opacity-50" data-group-generate>{result ? "🔀 Shuffle again" : "🎲 Make groups"}</button>
          {names.length < 2 && <span className="text-xs text-[var(--text-muted)]">Add at least two names.</span>}
        </div>

        {result && (
          <div className="mt-8" aria-live="polite">
            {result.broken.length > 0 && (
              <p className="mb-4 rounded-xl border border-[#e2a100]/40 bg-[rgba(226,161,0,0.08)] px-4 py-3 text-sm text-[var(--text-secondary)]" data-group-broken>
                ⚠️ Couldn&apos;t meet {result.broken.length === 1 ? "this rule" : "these rules"} with {count} groups: {result.broken.map((b) => `${b.pair[0]} ${b.kind === "together" ? "with" : "apart from"} ${b.pair[1]}`).join("; ")}. Try more groups or fewer rules.
              </p>
            )}
            {cards(false)}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => void openBig()} data-projector-open className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-4 py-2 text-sm font-semibold text-[var(--neon-cyan)]">📺 Show on the board</button>
              <button type="button" onClick={() => void copy()} className="min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-primary)]">{flash === "copied" ? "Copied ✓" : "📋 Copy groups"}</button>
              <button type="button" onClick={() => void copyLink()} className="min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-primary)]">{flash === "link" ? "Link copied ✓" : "🔗 Copy result link"}</button>
              <PrintButton heading="Our groups" items={groups.map(lineFor)} label="🖨️ Print groups" />
            </div>
            {history.length > 1 && (
              <details className="mt-3 text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
                <summary className="cursor-pointer text-center">Earlier shuffles ({history.length - 1})</summary>
                {history.slice(1).map((h, i) => <pre key={i} className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 p-2 text-xs font-sans">{h}</pre>)}
              </details>
            )}
          </div>
        )}
      </div>

      {big && (
        <div ref={bigRoot} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Groups — full screen"
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overflow-x-hidden bg-[#fffdf8] text-[#1b1b2f] outline-none" data-classroom-projector="random_group_generator">
          <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-10 pt-4 text-sm text-[#5b5b70]">
            <span className="font-semibold">👥 {groups.length} groups · {names.length} students</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => generate()} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">🔀 Shuffle (Space)</button>
              <button type="button" onClick={closeBig} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">Close ✕</button>
            </div>
          </header>
          <main className="flex-1 px-4 sm:px-10 py-6">{cards(true)}</main>
        </div>
      )}
    </section>
  );
}
