"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import {
  GENRES, FIELDS, FIELD_LABELS, DAILY_EPOCH, byGenre, rollIdea, rerollField, logline, ideaText, dayNumber, dailyIdea,
  type Field, type Genre, type Idea, type Locks,
} from "@/lib/generators/bookIdeas";

const TOOL = "book_idea_generator";
const PAGE_URL = "https://randomtopics.app/book-idea-generator";
const SHELF_KEY = "rt-book-shelf";
const STREAK_KEY = "rt-book-daily-streak";

// Reading-room palette: cream paper, sepia ink, genre cloth for the cover.
const PAPER = "#f6f0e2";
const INK = "#2b2118";
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

interface Shelved { g: string; idea: Idea }
interface Streak { last: number; count: number; best: number }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Cover({ g, idea, small = false }: { g: Genre; idea: Idea; small?: boolean }) {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-r-lg rounded-l-sm ${small ? "aspect-[2/3] w-full p-3" : "aspect-[2/3] w-full max-w-[280px] p-6"}`}
      style={{
        background: `linear-gradient(90deg, #00000055 0, #00000010 6%, transparent 9%), ${g.cloth}`,
        color: g.foil,
        boxShadow: small ? "3px 4px 0 #00000033" : "10px 14px 0 #00000026, inset 0 0 0 1px #ffffff14",
        fontFamily: SERIF,
      }}
    >
      <div className="pointer-events-none absolute inset-2 rounded border" style={{ borderColor: `${g.foil}55` }} aria-hidden />
      <p className={`relative text-center uppercase tracking-[0.3em] ${small ? "text-[8px]" : "text-[10px]"}`}>{g.label}</p>
      <div className="relative text-center">
        <p className={`${small ? "text-sm" : "text-2xl sm:text-[28px]"} font-bold leading-tight`}>{idea.title}</p>
        {!small && <p className="mx-auto mt-3 h-px w-16" style={{ background: g.foil }} aria-hidden />}
      </div>
      <p className={`relative text-center italic opacity-80 ${small ? "text-[8px]" : "text-xs"}`}>a novel</p>
    </div>
  );
}

function GenrePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Genre">
      {GENRES.map((g) => {
        const active = g.id === value;
        return (
          <button
            key={g.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(g.id)}
            className="rounded-sm border-l-[6px] px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{
              borderLeftColor: g.cloth,
              background: active ? g.cloth : "#ffffff",
              color: active ? g.foil : INK,
              boxShadow: active ? "0 3px 0 #00000033" : "0 1px 0 #0000001a",
              fontFamily: SERIF,
            }}
          >
            <span aria-hidden>{g.emoji}</span> {g.label}
          </button>
        );
      })}
    </div>
  );
}

function Generator() {
  const [genreId, setGenreId] = useState(GENRES[0].id);
  const g = byGenre.get(genreId)!;
  const [idea, setIdea] = useState<Idea>(() => rollIdea(GENRES[0], 7));
  const [locks, setLocks] = useState<Locks>({});
  const [shelf, setShelf] = useState<Shelved[]>([]);
  const [copied, setCopied] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- restore the saved shelf from localStorage on mount */
  useEffect(() => { setShelf(load<Shelved[]>(SHELF_KEY, [])); }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const generate = (next = g) => {
    const fresh = next.id !== g.id;
    setIdea(rollIdea(next, newSeed(), fresh ? undefined : idea, fresh ? {} : locks));
    if (fresh) setLocks({});
    track("generate_success", { tool_type: TOOL, genre: next.id, locale: "en" });
  };
  const chooseGenre = (id: string) => {
    if (id === genreId) return;
    setGenreId(id);
    generate(byGenre.get(id)!);
    track("filter_select", { tool_type: TOOL, filter_name: "genre", filter_value: id, locale: "en" });
  };
  const reroll = (f: Field) => {
    setIdea(rerollField(g, f, idea, newSeed()));
    track("tool_use", { tool_type: TOOL, action: "reroll_field", field: f, locale: "en" });
  };
  const copy = async () => {
    if (await copyText(ideaText(g, idea))) {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
      track("copy_result", { tool_type: TOOL, genre: genreId, locale: "en" });
    }
  };
  const onShelf = shelf.some((s) => s.idea.title === idea.title && s.g === genreId);
  const shelve = () => {
    const next = onShelf ? shelf.filter((s) => !(s.idea.title === idea.title && s.g === genreId)) : [{ g: genreId, idea }, ...shelf].slice(0, 12);
    setShelf(next); save(SHELF_KEY, next);
    if (!onShelf) track("tool_use", { tool_type: TOOL, action: "save_idea", locale: "en" });
  };

  return (
    <div className="space-y-5">
      <GenrePicker value={genreId} onChange={chooseGenre} />

      <div className="grid items-start gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex justify-center md:block">
          <Cover g={g} idea={idea} />
        </div>

        <div className="rounded-lg border bg-white p-4 sm:p-5" style={{ borderColor: "#2b211822" }}>
          <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">Back cover</p>
          <p className="mt-1 text-lg leading-snug" style={{ fontFamily: SERIF }} aria-live="polite">{cap(logline(idea))}</p>

          <ul className="mt-4 divide-y" style={{ borderColor: "#2b21181a" }}>
            {FIELDS.map((f) => (
              <li key={f} className="flex items-start gap-2 py-2" style={{ borderColor: "#2b211814" }}>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: locks[f] ? g.cloth : "#2b211899" }}>
                    {FIELD_LABELS[f]}{locks[f] ? " · locked" : ""}
                  </p>
                  <p className="text-[15px] leading-snug" style={{ fontFamily: f === "title" ? SERIF : undefined }}>
                    {f === "title" ? idea.title : cap(idea[f])}{f === "twist" ? "." : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label={`${locks[f] ? "Unlock" : "Lock"} ${FIELD_LABELS[f]}`}
                    aria-pressed={!!locks[f]}
                    onClick={() => setLocks((l) => ({ ...l, [f]: !l[f] }))}
                    className="rounded border px-1.5 py-1 text-xs"
                    style={{ borderColor: locks[f] ? g.cloth : "#2b211833", background: locks[f] ? `${g.cloth}18` : "transparent" }}
                  >
                    {locks[f] ? "🔒" : "🔓"}
                  </button>
                  <button
                    type="button"
                    aria-label={`Re-roll ${FIELD_LABELS[f]}`}
                    onClick={() => reroll(f)}
                    disabled={!!locks[f]}
                    className="rounded border px-1.5 py-1 text-xs disabled:opacity-30"
                    style={{ borderColor: "#2b211833" }}
                  >
                    ↻
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => generate()}
              className="rounded-md px-5 py-2.5 text-sm font-bold transition-transform active:scale-95"
              style={{ background: g.cloth, color: g.foil, boxShadow: "0 3px 0 #00000040" }}
            >
              📖 New book idea
            </button>
            <button type="button" onClick={copy} className="rounded-md border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "#2b211844" }}>
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
            <button type="button" onClick={shelve} aria-pressed={onShelf} className="rounded-md border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "#2b211844" }}>
              {onShelf ? "★ On your shelf" : "☆ Save to shelf"}
            </button>
          </div>
          <p className="mt-2 text-xs opacity-60">Lock the parts you like, then press New book idea to re-roll everything else.</p>
        </div>
      </div>

      {shelf.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Your shelf ({shelf.length}/12, saved in this browser)</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {shelf.map((s, i) => {
              const sg = byGenre.get(s.g) ?? GENRES[0];
              return (
                <button
                  key={`${s.g}-${s.idea.title}-${i}`}
                  type="button"
                  onClick={() => { setGenreId(sg.id); setIdea(s.idea); setLocks({}); }}
                  className="text-left transition-transform hover:-translate-y-1"
                  aria-label={`Open ${s.idea.title}`}
                >
                  <Cover g={sg} idea={s.idea} small />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number, align: CanvasTextAlign = "left") {
  ctx.textAlign = align;
  let line = "";
  for (const w of text.split(" ")) {
    if (ctx.measureText(`${line}${w}`).width > max && line) { ctx.fillText(line.trim(), x, y); line = ""; y += lh; }
    line += `${w} `;
  }
  ctx.fillText(line.trim(), x, y);
  return y + lh;
}

async function dailyCardBlob(dayIdx: number, g: Genre, idea: Idea) {
  const w = 1080, h = 1350, canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, w, h);
  // cover
  const cx = 90, cy = 90, cw = 900, ch = 760;
  ctx.fillStyle = g.cloth; ctx.fillRect(cx, cy, cw, ch);
  const spine = ctx.createLinearGradient(cx, 0, cx + 90, 0);
  spine.addColorStop(0, "#00000066"); spine.addColorStop(1, "#00000000");
  ctx.fillStyle = spine; ctx.fillRect(cx, cy, 90, ch);
  ctx.strokeStyle = `${g.foil}88`; ctx.lineWidth = 3; ctx.strokeRect(cx + 24, cy + 24, cw - 48, ch - 48);
  ctx.fillStyle = g.foil;
  ctx.font = `600 30px ${SERIF}`; ctx.textAlign = "center";
  ctx.fillText(`BOOK IDEA OF THE DAY · #${dayIdx} · ${g.label.toUpperCase()}`, w / 2, cy + 100);
  ctx.font = `bold 86px ${SERIF}`;
  const after = wrap(ctx, idea.title, w / 2, cy + 330, cw - 160, 98, "center");
  ctx.fillRect(w / 2 - 60, after - 40, 120, 3);
  ctx.font = `italic 34px ${SERIF}`; ctx.fillText("a novel waiting to be written", w / 2, cy + ch - 70);
  // back cover text
  ctx.fillStyle = INK; ctx.font = `36px ${SERIF}`;
  const y = wrap(ctx, cap(logline(idea)), 100, 940, w - 200, 50);
  ctx.font = `italic 32px ${SERIF}`; ctx.fillStyle = `${INK}bb`;
  wrap(ctx, `Twist: ${idea.twist}.`, 100, y + 16, w - 200, 44);
  ctx.textAlign = "left"; ctx.fillStyle = INK; ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillText("randomtopics.app/book-idea-generator", 100, h - 70);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

function Daily() {
  const [day, setDay] = useState(0);
  const [streak, setStreak] = useState<Streak>({ last: 0, count: 0, best: 0 });
  const [msg, setMsg] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect -- read today's date and the visit streak from localStorage on mount */
  useEffect(() => {
    const d = dayNumber();
    setDay(d);
    const s = load<Streak>(STREAK_KEY, { last: 0, count: 0, best: 0 });
    const count = s.last === d ? s.count : s.last === d - 1 ? s.count + 1 : 1;
    const next = { last: d, count, best: Math.max(s.best, count) };
    setStreak(next); save(STREAK_KEY, next);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!day) return <p className="py-10 text-center text-sm opacity-60">Opening today&apos;s book…</p>;
  const { genre: g, idea } = dailyIdea(day);
  const dayIdx = day - DAILY_EPOCH + 1;
  const shareText = `Book idea of the day #${dayIdx} (${g.label}): "${idea.title}" — ${logline(idea)}\n${PAGE_URL}?mode=daily`;

  const share = async () => {
    const blob = await dailyCardBlob(dayIdx, g, idea);
    if (blob) {
      const file = new File([blob], `book-idea-${dayIdx}.png`, { type: "image/png" });
      try {
        if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], text: shareText }); track("share_click", { tool_type: TOOL, share_method: "native", locale: "en" }); return; }
      } catch (e) { if ((e as Error)?.name === "AbortError") return; }
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    await copyText(shareText);
    setMsg("Cover card saved and text copied — paste it anywhere.");
    track("share_click", { tool_type: TOOL, share_method: "download", locale: "en" });
  };

  return (
    <div className="grid items-start gap-6 md:grid-cols-[280px_1fr]">
      <div className="flex justify-center md:block"><Cover g={g} idea={idea} /></div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">Book idea of the day · #{dayIdx} · {g.label}</p>
        <h3 className="mt-1 text-2xl font-bold" style={{ fontFamily: SERIF }}>{idea.title}</h3>
        <p className="mt-2 text-lg leading-snug" style={{ fontFamily: SERIF }}>{cap(logline(idea))}</p>
        <p className="mt-3 text-[15px]"><strong>Twist:</strong> {cap(idea.twist)}.</p>
        <p className="mt-4 text-sm opacity-70">
          Everyone gets the same idea today; a new one appears at midnight UTC. 🔥 {streak.count}-day streak (best {streak.best}).
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={share} className="rounded-md px-5 py-2.5 text-sm font-bold" style={{ background: g.cloth, color: g.foil, boxShadow: "0 3px 0 #00000040" }}>
            Share today&apos;s cover
          </button>
          <button type="button" onClick={async () => { if (await copyText(ideaText(g, idea))) setMsg("Idea copied ✓"); }} className="rounded-md border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "#2b211844" }}>
            Copy idea
          </button>
        </div>
        {msg && <p className="mt-2 text-sm" role="status">{msg}</p>}
      </div>
    </div>
  );
}

export default function BookIdeaGenerator() {
  const [mode, setMode] = useState<"generate" | "daily">("generate");

  /* eslint-disable react-hooks/set-state-in-effect -- open the tab named in ?mode= */
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("mode") === "daily") setMode("daily");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const tab = (m: typeof mode, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => { setMode(m); track("tool_use", { tool_type: TOOL, action: `tab_${m}`, locale: "en" }); }}
      className="rounded-t-md border border-b-0 px-4 py-2 text-sm font-semibold"
      style={{ background: mode === m ? PAPER : "transparent", color: mode === m ? INK : "#f6f0e2cc", borderColor: mode === m ? "#2b211822" : "transparent", fontFamily: SERIF }}
    >
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl" style={{ background: "#3a2a1c" }}>
      <div className="flex gap-1 px-4 pt-3" role="tablist">
        {tab("generate", "📚 Generate")}
        {tab("daily", "🗓️ Book idea of the day")}
      </div>
      <div className="p-4 sm:p-6" style={{ background: PAPER, color: INK }}>
        {mode === "generate" ? <Generator /> : <Daily />}
      </div>
    </div>
  );
}
