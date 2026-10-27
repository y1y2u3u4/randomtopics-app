"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed, createRng, shuffle } from "@/lib/randomGenerators";
import {
  MARVEL_CHARACTERS, TEAMS, SIDES, POWERS, ERAS, NO_FILTERS, eraOf, filterCharacters, draw, byId,
  dayNumber, DAILY_EPOCH, dailyCharacter, dailyClues, isCorrectGuess, characterText,
  type MarvelCharacter, type MarvelFilters, type Side, type Era, type PowerType, type Team,
} from "@/lib/generators/marvel";

const TOOL = "random_marvel_character_generator";
const PAGE_URL = "https://randomtopics.app/random-marvel-character-generator";
const SEEN_KEY = "rt_marvel_seen_v1";
const DAILY_KEY = "rt_marvel_daily_v1";
const STREAK_KEY = "rt_marvel_streak_v1";
const MAX_GUESSES = 4;

type Tab = "generate" | "wheel" | "daily";

// Comic-panel palette: newsprint paper, black ink, one accent per alignment.
const INK = "#17130d";
const PAPER = "#f7f0dc";
const SIDE_COLOR: Record<Side, string> = { hero: "#2f6bff", villain: "#ff3b4e", anti: "#a855f7" };
const HALFTONE: CSSProperties = {
  backgroundImage: `radial-gradient(${INK}22 1.1px, transparent 1.3px)`,
  backgroundSize: "7px 7px",
};

function store<T>(key: string, fallback: T, area: "local" | "session" = "local"): T {
  try {
    const raw = (area === "local" ? localStorage : sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown, area: "local" | "session" = "local") {
  try { (area === "local" ? localStorage : sessionStorage).setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}

const sideLabel = (s: Side) => SIDES.find((x) => x.value === s)!.label;

function CharacterCard({ c, onReroll, locked, onLock }: { c: MarvelCharacter; onReroll?: () => void; locked?: boolean; onLock?: () => void }) {
  const era = eraOf(c.debut);
  const accent = SIDE_COLOR[c.side];
  const [copied, setCopied] = useState(false);
  return (
    <article
      className="relative flex flex-col rounded-md border-[3px] p-4 pt-3 text-left"
      style={{ background: PAPER, color: INK, borderColor: INK, boxShadow: `6px 6px 0 ${accent}` }}
      data-marvel-card={c.id}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-24 rounded-tr-sm opacity-80" style={{ ...HALFTONE, maskImage: "linear-gradient(225deg,#000 20%,transparent 75%)", WebkitMaskImage: "linear-gradient(225deg,#000 20%,transparent 75%)" }} />
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-sm px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white" style={{ background: accent }}>{sideLabel(c.side)}</span>
        {c.mcu && <span className="rounded-sm border-2 px-1.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ borderColor: INK }}>On screen</span>}
      </div>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-black uppercase italic leading-[1.05] tracking-tight">{c.name}</h3>
      <p className="min-h-5 text-sm font-semibold opacity-70">{c.realName && !c.name.includes(c.realName) ? c.realName : " "}</p>
      <p className="mt-2 inline-block self-start border-2 px-2 py-0.5 text-[12px] font-bold" style={{ background: "#ffe14a", borderColor: INK }}>
        First seen {c.debut} · {era.label}
      </p>
      <p className="mt-3 text-[15px] leading-snug">{c.bio}</p>
      <dl className="mt-3 space-y-1 text-[13px]">
        <div><dt className="inline font-extrabold uppercase tracking-wide">Powers: </dt><dd className="inline">{c.abilities}</dd></div>
        <div><dt className="inline font-extrabold uppercase tracking-wide">Teams: </dt><dd className="inline">{c.teams.length ? c.teams.join(", ") : "Solo"}</dd></div>
      </dl>
      {(onReroll || onLock) && (
        <div className="mt-auto flex items-center gap-2 pt-4">
          {onLock && (
            <button type="button" onClick={onLock} aria-pressed={locked} className="rounded border-2 px-2.5 py-1 text-xs font-bold" style={{ borderColor: INK, background: locked ? INK : "transparent", color: locked ? PAPER : INK }}>
              {locked ? "🔒 Kept" : "Keep"}
            </button>
          )}
          {onReroll && !locked && (
            <button type="button" onClick={onReroll} className="rounded border-2 px-2.5 py-1 text-xs font-bold" style={{ borderColor: INK }} aria-label={`Swap ${c.name} for another character`}>↻ Swap</button>
          )}
          <button type="button" className="ml-auto rounded border-2 px-2.5 py-1 text-xs font-bold" style={{ borderColor: INK }}
            onClick={async () => { if (await copyText(characterText(c))) { setCopied(true); setTimeout(() => setCopied(false), 1400); track("copy_result", { tool_type: TOOL, locale: "en" }); } }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}
    </article>
  );
}

function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${active ? "font-bold text-[#0b0b12]" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`}
      style={active ? { background: color ?? "var(--neon-yellow)", borderColor: color ?? "var(--neon-yellow)" } : undefined}>
      {children}
    </button>
  );
}

function Filters({ f, setF, poolSize }: { f: MarvelFilters; setF: (f: MarvelFilters) => void; poolSize: number }) {
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const label = "mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className={label}>Side</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={!f.sides.length} onClick={() => setF({ ...f, sides: [] })}>All</Chip>
          {SIDES.map((s) => <Chip key={s.value} color={SIDE_COLOR[s.value]} active={f.sides.includes(s.value)} onClick={() => setF({ ...f, sides: toggle(f.sides, s.value) })}>{s.plural}</Chip>)}
        </div>
      </div>
      <div>
        <p className={label}>Team</p>
        <select value={f.team} onChange={(e) => setF({ ...f, team: e.target.value as Team | "" })}
          className="w-full rounded-md border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]" aria-label="Team">
          <option value="">Any team</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <p className={label}>First appearance</p>
        <div className="flex flex-wrap gap-2">
          {ERAS.map((e) => <Chip key={e.value} active={f.eras.includes(e.value)} onClick={() => setF({ ...f, eras: toggle(f.eras, e.value as Era) })}><span title={e.range}>{e.label}</span></Chip>)}
        </div>
      </div>
      <div>
        <p className={label}>Power type</p>
        <div className="flex flex-wrap gap-2">
          {POWERS.map((p) => <Chip key={p.value} active={f.powers.includes(p.value)} onClick={() => setF({ ...f, powers: toggle(f.powers, p.value as PowerType) })}>{p.label}</Chip>)}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={f.mcuOnly} onChange={(e) => setF({ ...f, mcuOnly: e.target.checked })} className="h-4 w-4 accent-[var(--neon-yellow)]" />
          Only characters seen in the movies or TV shows
        </label>
        <p className="text-xs text-[var(--text-muted)]" data-marvel-pool>{poolSize} of {MARVEL_CHARACTERS.length} characters match{JSON.stringify(f) !== JSON.stringify(NO_FILTERS) && <> · <button type="button" className="underline" onClick={() => setF(NO_FILTERS)}>clear filters</button></>}</p>
      </div>
    </div>
  );
}

function GenerateMode({ f, pool }: { f: MarvelFilters; pool: MarvelCharacter[] }) {
  const [count, setCount] = useState(3);
  const [ids, setIds] = useState<string[]>(() => draw(MARVEL_CHARACTERS, 3, [], 7).picks.map((c) => c.id));
  const [locked, setLocked] = useState<string[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time restore from sessionStorage and the ?c= share link */
  useEffect(() => {
    setSeen(store<string[]>(SEEN_KEY, [], "session"));
    const shared = new URLSearchParams(window.location.search).get("c");
    const fromLink = shared?.split(",").filter((id) => byId.has(id)).slice(0, 10);
    if (fromLink?.length) { setIds(fromLink); setCount(fromLink.length); }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const remember = useCallback((picked: string[]) => {
    setSeen((prev) => { const next = [...new Set([...prev, ...picked])]; save(SEEN_KEY, next, "session"); return next; });
  }, []);

  const generate = () => {
    const keep = ids.filter((id) => locked.includes(id));
    const need = Math.max(0, count - keep.length);
    const out = draw(pool.filter((c) => !keep.includes(c.id)), need, seen, newSeed());
    const next = [...keep, ...out.picks.map((c) => c.id)];
    setIds(next);
    if (out.cycled) { setSeen(keep); save(SEEN_KEY, keep, "session"); setNote("You've seen every match — starting a fresh round."); }
    else setNote(out.picks.length < need ? `Only ${pool.length} characters match these filters.` : "");
    remember(out.picks.map((c) => c.id));
    track("generate_start", { tool_type: TOOL, requested_count: count, locale: "en" });
    track("generate_success", { tool_type: TOOL, result_count: next.length, result_source: "editorial_pool", locale: "en" });
  };

  const swap = (id: string) => {
    const out = draw(pool.filter((c) => !ids.includes(c.id)), 1, seen, newSeed());
    if (!out.picks[0]) return;
    setIds((prev) => prev.map((x) => (x === id ? out.picks[0].id : x)));
    remember([out.picks[0].id]);
  };

  const shareLink = async () => {
    const url = `${PAGE_URL}?c=${ids.join(",")}`;
    if (await copyText(url)) { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 1500); track("share_click", { tool_type: TOOL, locale: "en" }); }
  };

  const unseen = pool.filter((c) => !seen.includes(c.id)).length;
  return (
    <div>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <div className="flex items-center gap-1 rounded-lg border border-white/10 p-1" role="group" aria-label="How many characters">
          {[1, 3, 5, 10].map((n) => (
            <button key={n} type="button" onClick={() => setCount(n)} aria-pressed={count === n}
              className={`h-9 w-10 rounded-md text-sm font-bold ${count === n ? "bg-white text-[#0b0b12]" : "text-[var(--text-secondary)]"}`}>{n}</button>
          ))}
        </div>
        <button type="button" onClick={generate} disabled={!pool.length} data-marvel-generate
          className="rounded-lg border-[3px] px-7 py-3 font-[family-name:var(--font-display)] text-lg font-black uppercase italic tracking-wide disabled:opacity-40"
          style={{ background: "#ffe14a", color: INK, borderColor: INK, boxShadow: `5px 5px 0 ${SIDE_COLOR.villain}` }}>
          Generate {count === 1 ? "a character" : `${count} characters`}
        </button>
      </div>
      <p className="mt-3 min-h-5 text-center text-xs text-[var(--text-muted)]">
        {note || (seen.length ? `No repeats: ${unseen} of ${pool.length} matches still unseen this session.` : "Keep a card to hold it while you re-roll the rest.")}
        {seen.length > 0 && <> · <button type="button" className="underline" onClick={() => { setSeen([]); save(SEEN_KEY, [], "session"); }}>reset</button></>}
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {ids.map((id) => byId.get(id)).filter(Boolean).map((c) => (
          <CharacterCard key={c!.id} c={c!} locked={locked.includes(c!.id)}
            onLock={() => setLocked((l) => (l.includes(c!.id) ? l.filter((x) => x !== c!.id) : [...l, c!.id]))}
            onReroll={() => swap(c!.id)} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <button type="button" onClick={async () => { if (await copyText(ids.map((id) => characterText(byId.get(id)!)).join("\n"))) setNote("All characters copied ✓"); }}
          className="rounded-md border border-white/15 px-4 py-2 text-[var(--text-secondary)] hover:border-white/40">Copy all</button>
        <button type="button" onClick={shareLink} className="rounded-md border border-white/15 px-4 py-2 text-[var(--text-secondary)] hover:border-white/40">{linkCopied ? "Link copied ✓" : "Copy share link"}</button>
      </div>
      {f.team && <p className="sr-only">Filtered by {f.team}</p>}
    </div>
  );
}

const WHEEL_COLORS = ["#ff3b4e", "#ffe14a", "#2f6bff", "#14b8a6", "#f97316", "#a855f7"];

function WheelMode({ pool }: { pool: MarvelCharacter[] }) {
  const [size, setSize] = useState(12);
  const [slots, setSlots] = useState<MarvelCharacter[]>(() => shuffle(MARVEL_CHARACTERS, createRng(3)).slice(0, 12));
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<MarvelCharacter | null>(null);

  const reload = useCallback((n = size) => {
    setSlots(shuffle(pool, createRng(newSeed())).slice(0, n));
    setWinner(null);
  }, [pool, size]);
  const first = useRef(true);
  /* eslint-disable react-hooks/set-state-in-effect -- refill the wheel when filters change */
  useEffect(() => { if (first.current) { first.current = false; return; } reload(); }, [pool, reload]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const spin = () => {
    if (spinning || slots.length < 2) return;
    const i = Math.floor(Math.random() * slots.length);
    const seg = 360 / slots.length;
    // Pointer sits at the top; rotate so the middle of slot i ends under it.
    const target = 360 - (i * seg + seg / 2);
    const next = angle - (angle % 360) + 360 * 6 + target;
    setWinner(null); setSpinning(true); setAngle(next);
    window.setTimeout(() => { setSpinning(false); setWinner(slots[i]); }, 4200);
    track("tool_use", { tool_type: TOOL, action: "wheel_spin", locale: "en" });
  };

  const seg = 360 / Math.max(slots.length, 1);
  const r = 150;
  const point = (deg: number) => { const a = ((deg - 90) * Math.PI) / 180; return [160 + r * Math.cos(a), 160 + r * Math.sin(a)]; };
  return (
    <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative aspect-square">
          <svg viewBox="0 0 320 320" className="h-full w-full" role="img" aria-label={`Wheel with ${slots.length} Marvel characters`}>
            <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "160px 160px", transition: spinning ? "transform 4.2s cubic-bezier(.12,.75,.16,1)" : "none" }}>
              {slots.map((c, i) => {
                const [x1, y1] = point(i * seg), [x2, y2] = point((i + 1) * seg);
                const mid = i * seg + seg / 2;
                const name = c.name.replace(/\s*\(.*\)$/, "");
                return (
                  <g key={c.id}>
                    <path d={`M160 160 L${x1} ${y1} A${r} ${r} 0 ${seg > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={WHEEL_COLORS[i % WHEEL_COLORS.length]} stroke={INK} strokeWidth="2.5" />
                    <text x="160" y="160" transform={`rotate(${mid - 90} 160 160) translate(${r - 10} 0)`} textAnchor="end" dominantBaseline="middle"
                      fontSize={slots.length > 14 ? 8.5 : 10.5} fontWeight="800" fill={i % WHEEL_COLORS.length === 1 ? INK : "#fff"}>
                      {name.length > 16 ? `${name.slice(0, 15)}…` : name}
                    </text>
                  </g>
                );
              })}
            </g>
            <circle cx="160" cy="160" r="22" fill={PAPER} stroke={INK} strokeWidth="4" />
            <path d="M160 2 L172 26 L148 26 Z" fill={INK} />
          </svg>
          <button type="button" onClick={spin} disabled={spinning} data-marvel-spin
            className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full text-xs font-black uppercase" style={{ color: INK }}>
            {spinning ? "…" : "Spin"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <select value={size} onChange={(e) => { const n = Number(e.target.value); setSize(n); reload(n); }} aria-label="Characters on the wheel"
            className="rounded-md border border-white/10 bg-[var(--bg-secondary)] px-2 py-2 text-[var(--text-primary)]">
            {[6, 8, 12, 16, 20].map((n) => <option key={n} value={n}>{n} on the wheel</option>)}
          </select>
          <button type="button" onClick={() => reload()} className="rounded-md border border-white/15 px-3 py-2 text-[var(--text-secondary)]">New characters</button>
          {winner && <button type="button" onClick={() => { setSlots((s) => s.filter((c) => c.id !== winner.id)); setWinner(null); }} className="rounded-md border border-white/15 px-3 py-2 text-[var(--text-secondary)]">Remove winner</button>}
        </div>
        <button type="button" onClick={spin} disabled={spinning || slots.length < 2}
          className="mx-auto mt-4 block rounded-lg border-[3px] px-8 py-3 font-[family-name:var(--font-display)] text-lg font-black uppercase italic disabled:opacity-50"
          style={{ background: "#ffe14a", color: INK, borderColor: INK, boxShadow: `5px 5px 0 ${SIDE_COLOR.hero}` }}>
          {spinning ? "Spinning…" : "Spin the wheel"}
        </button>
      </div>
      <div aria-live="polite">
        {winner ? <CharacterCard c={winner} /> : (
          <div className="rounded-md border-2 border-dashed border-white/15 p-6 text-sm text-[var(--text-secondary)]">
            <p className="font-bold text-[var(--text-primary)]">The wheel uses your filters.</p>
            <p className="mt-2">Pick a side, team, era or power type above, choose how many slots you want, then spin. Use “Remove winner” to knock characters out round by round — handy for drafts, cosplay picks or deciding who to draw next.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DailyState { day: number; guesses: string[]; solved: boolean; revealed: boolean }
interface Streak { last: number; count: number; best: number }

async function dailyCardBlob(dayIdx: number, c: MarvelCharacter, grid: string, solved: boolean) {
  const w = 1080, h = 1350, canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#0b0b12"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = PAPER; ctx.fillRect(70, 70, w - 140, h - 140);
  ctx.fillStyle = `${INK}22`;
  for (let y = 80; y < 520; y += 18) for (let x = w - 420 + ((y / 18) % 2) * 9; x < w - 80; x += 18) { ctx.beginPath(); ctx.arc(x, y, 3.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.strokeRect(70, 70, w - 140, h - 140);
  ctx.fillStyle = SIDE_COLOR[c.side]; ctx.fillRect(120, 140, 360, 64);
  ctx.fillStyle = "#fff"; ctx.font = "900 34px system-ui, sans-serif"; ctx.fillText(`DAILY #${dayIdx}`, 140, 184);
  ctx.fillStyle = INK; ctx.font = "italic 900 92px system-ui, sans-serif";
  const words = c.name.toUpperCase().split(" "); let line = "", y = 330;
  for (const wd of words) { if (ctx.measureText(`${line} ${wd}`).width > w - 280 && line) { ctx.fillText(line.trim(), 120, y); line = ""; y += 96; } line += ` ${wd}`; }
  ctx.fillText(line.trim(), 120, y);
  ctx.font = "600 40px system-ui, sans-serif"; ctx.fillText(`First seen ${c.debut} · ${eraOf(c.debut).label}`, 120, y + 80);
  ctx.font = "800 64px system-ui, sans-serif"; ctx.fillText(solved ? `Guessed it ${grid}` : `Stumped ${grid}`, 120, y + 220);
  ctx.font = "500 38px system-ui, sans-serif"; ctx.fillStyle = `${INK}cc`;
  ctx.fillText("Can you guess today's Marvel character", 120, h - 250);
  ctx.fillText("in fewer clues?", 120, h - 200);
  ctx.fillStyle = INK; ctx.font = "800 40px system-ui, sans-serif"; ctx.fillText("randomtopics.app/random-marvel-character-generator", 120, h - 120);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function DailyMode() {
  const [day, setDay] = useState(0);
  const [state, setState] = useState<DailyState | null>(null);
  const [streak, setStreak] = useState<Streak>({ last: 0, count: 0, best: 0 });
  const [guess, setGuess] = useState("");
  const [msg, setMsg] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect -- load today's puzzle and streak from localStorage on mount */
  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const saved = store<DailyState | null>(DAILY_KEY, null);
    setState(saved && saved.day === d ? saved : { day: d, guesses: [], solved: false, revealed: false });
    const s = store<Streak>(STREAK_KEY, { last: 0, count: 0, best: 0 });
    setStreak(s.last >= d - 1 ? s : { ...s, count: 0 });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const c = useMemo(() => (day ? dailyCharacter(day) : null), [day]);
  const clues = useMemo(() => (c ? dailyClues(c) : []), [c]);
  const names = useMemo(() => MARVEL_CHARACTERS.map((x) => x.name).sort(), []);
  if (!c || !state) return <p className="mt-6 text-center text-sm text-[var(--text-muted)]">Loading today&apos;s character…</p>;

  const done = state.solved || state.revealed || state.guesses.length >= MAX_GUESSES;
  const shownClues = done ? clues.length : Math.min(clues.length, state.guesses.length + 1);
  const grid = state.guesses.map((g) => (isCorrectGuess(g, c) ? "🟩" : "🟥")).join("") || "⬛";
  const dayIdx = day - DAILY_EPOCH + 1;

  const update = (next: DailyState) => { setState(next); save(DAILY_KEY, next); };
  const submit = () => {
    const g = guess.trim();
    if (!g || done) return;
    const solved = isCorrectGuess(g, c);
    const next = { ...state, guesses: [...state.guesses, g], solved };
    update(next); setGuess("");
    if (solved) {
      const s = { last: day, count: streak.last === day - 1 ? streak.count + 1 : streak.last === day ? streak.count : 1, best: 0 };
      s.best = Math.max(s.count, streak.best);
      setStreak(s); save(STREAK_KEY, s);
    }
    setMsg(solved ? "" : next.guesses.length >= MAX_GUESSES ? "" : "Not quite — here's another clue.");
    track("tool_use", { tool_type: TOOL, action: solved ? "daily_solved" : "daily_guess", locale: "en" });
  };
  const shareText = `Marvel character of the day #${dayIdx}: ${state.solved ? `got it in ${state.guesses.length}/${MAX_GUESSES}` : "stumped"} ${grid}\n${PAGE_URL}`;
  const share = async () => {
    const blob = await dailyCardBlob(dayIdx, c, grid, state.solved);
    if (blob) {
      const file = new File([blob], `marvel-daily-${dayIdx}.png`, { type: "image/png" });
      try {
        if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: shareText }); track("share_click", { tool_type: TOOL, share_method: "native", locale: "en" }); return; }
      } catch (e) { if ((e as Error)?.name === "AbortError") return; }
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    await copyText(shareText);
    setMsg("Card saved and result copied — paste it anywhere.");
    track("share_click", { tool_type: TOOL, share_method: "download", locale: "en" });
  };

  return (
    <div className="mx-auto mt-6 max-w-2xl" data-marvel-daily>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-[family-name:var(--font-display)] text-xl font-black uppercase italic">Character of the day #{dayIdx}</h3>
        <p className="text-xs text-[var(--text-secondary)]">{streak.count > 0 ? `🔥 ${streak.count}-day streak${streak.best > streak.count ? ` · best ${streak.best}` : ""}` : "Solve today to start a streak"}</p>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Guess the character from up to {MAX_GUESSES} clues. A new one at midnight UTC — same for everyone.</p>
      <ol className="mt-4 space-y-3">
        {clues.slice(0, shownClues).map((clue, i) => (
          <li key={i} className="rounded-md border-[3px] px-4 py-3 text-[15px]" style={{ background: PAPER, color: INK, borderColor: INK, boxShadow: `4px 4px 0 ${i === 0 ? "#ffe14a" : SIDE_COLOR.hero}` }}>
            <span className="mr-2 font-black">Clue {i + 1}</span>{clue}
          </li>
        ))}
      </ol>
      {!done ? (
        <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input value={guess} onChange={(e) => setGuess(e.target.value)} list="marvel-names" placeholder="Type a character name" aria-label="Your guess"
            className="min-w-0 flex-1 rounded-md border border-white/15 bg-[var(--bg-secondary)] px-3 py-2.5 text-[var(--text-primary)]" />
          <datalist id="marvel-names">{names.map((n) => <option key={n} value={n} />)}</datalist>
          <button type="submit" className="rounded-md border-[3px] px-4 font-black uppercase" style={{ background: "#ffe14a", color: INK, borderColor: INK }}>Guess</button>
        </form>
      ) : null}
      <p className="mt-2 min-h-5 text-sm text-[var(--text-secondary)]">
        {msg}
        {!done && state.guesses.length > 0 && ` Guesses: ${state.guesses.join(", ")}.`}
        {!done && <> <button type="button" className="underline" onClick={() => update({ ...state, revealed: true })}>Just show me</button></>}
      </p>
      {done && (
        <div className="mt-2">
          <p className="mb-3 font-bold">{state.solved ? `Got it in ${state.guesses.length} ${state.guesses.length === 1 ? "guess" : "guesses"} ${grid}` : `Today's character was…`}</p>
          <CharacterCard c={c} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={share} className="rounded-lg border-[3px] px-5 py-2.5 font-black uppercase italic" style={{ background: "#ffe14a", color: INK, borderColor: INK, boxShadow: `4px 4px 0 ${SIDE_COLOR.villain}` }}>Share my result</button>
            <button type="button" onClick={async () => { if (await copyText(shareText)) setMsg("Result copied ✓"); }} className="rounded-md border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)]">Copy result text</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarvelCharacterGenerator() {
  const [tab, setTab] = useState<Tab>("generate");
  const [f, setF] = useState<MarvelFilters>(NO_FILTERS);
  const pool = useMemo(() => filterCharacters(f), [f]);

  /* eslint-disable react-hooks/set-state-in-effect -- open the tab named in ?mode= */
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("mode");
    if (t === "wheel" || t === "daily") setTab(t);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const pick = (t: Tab) => { setTab(t); track("filter_select", { tool_type: TOOL, filter_name: "mode", filter_value: t, locale: "en" }); };

  const tabs: { id: Tab; label: string }[] = [
    { id: "generate", label: "🎲 Generate" },
    { id: "wheel", label: "🎡 Wheel" },
    { id: "daily", label: "📅 Daily guess" },
  ];
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-7">
        <div className="mb-5 flex justify-center gap-1 rounded-xl border border-white/10 p-1 sm:mx-auto sm:w-fit" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => pick(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold sm:flex-none sm:px-5 ${tab === t.id ? "bg-white text-[#0b0b12]" : "text-[var(--text-secondary)]"}`}>{t.label}</button>
          ))}
        </div>
        {tab !== "daily" && <Filters f={f} setF={setF} poolSize={pool.length} />}
        {tab === "generate" && <GenerateMode f={f} pool={pool} />}
        {tab === "wheel" && <WheelMode pool={pool} />}
        {tab === "daily" && <DailyMode />}
      </div>
    </section>
  );
}
