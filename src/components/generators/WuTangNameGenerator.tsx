"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { MAX_INPUT_LENGTH, nameFor, pairKey, randomName, readShareParams, shareUrl, type WuName } from "@/lib/generators/wuTang";

const TOOL = "wu_tang_name_generator";
const CARD = 1080;
const RECENT = 60;

type Shown = { result: WuName; input: string | null };

/** Largest font size (px) at which `text` fits `maxWidth`. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, start: number, family: string): number {
  let size = start;
  ctx.font = `900 ${size}px ${family}`;
  while (size > 40 && ctx.measureText(text).width > maxWidth) {
    size -= 4;
    ctx.font = `900 ${size}px ${family}`;
  }
  return size;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function drawCard(canvas: HTMLCanvasElement, shown: Shown) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { result, input } = shown;
  const W = CARD;
  const gold = "#f5c518";
  const family = "Impact, 'Arial Black', 'Helvetica Neue', Arial, sans-serif";
  canvas.width = W;
  canvas.height = W;

  // Background: near-black with a soft gold glow and diagonal stripes.
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, W, W);
  const glow = ctx.createRadialGradient(W / 2, W * 0.45, 40, W / 2, W * 0.45, W * 0.7);
  glow.addColorStop(0, "rgba(245,197,24,0.22)");
  glow.addColorStop(1, "rgba(245,197,24,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, W);
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = gold;
  ctx.lineWidth = 18;
  for (let x = -W; x < W * 2; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + W, W);
    ctx.stroke();
  }
  ctx.restore();

  // Frame.
  ctx.strokeStyle = gold;
  ctx.lineWidth = 10;
  ctx.strokeRect(40, 40, W - 80, W - 80);
  ctx.lineWidth = 3;
  ctx.strokeRect(62, 62, W - 124, W - 124);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Kicker.
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `700 34px ${family}`;
  const kicker = input ? `${input.toUpperCase()} IS NOW KNOWN AS` : "MY WU-STYLE NAME IS";
  ctx.fillText(kicker.length > 46 ? "MY WU-STYLE NAME IS" : kicker, W / 2, 190);

  // The name, two big lines.
  const maxW = W - 200;
  const firstText = result.first.toUpperCase();
  const secondText = result.second.toUpperCase();
  const size = Math.min(fitFont(ctx, firstText, maxW, 190, family), fitFont(ctx, secondText, maxW, 190, family));
  ctx.font = `900 ${size}px ${family}`;
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = gold;
  ctx.fillText(firstText, W / 2, 400);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(secondText, W / 2, 400 + size * 1.02);
  ctx.shadowBlur = 0;

  let y = 400 + size * 1.02 + size * 0.7;
  if (result.flourish) {
    ctx.fillStyle = gold;
    ctx.font = `700 52px ${family}`;
    ctx.fillText(result.flourish.toUpperCase(), W / 2, y);
    y += 70;
  }

  // Origin line.
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `italic 400 32px Georgia, 'Times New Roman', serif`;
  for (const line of wrap(ctx, result.origin, W - 220)) {
    ctx.fillText(line, W / 2, Math.min(y, W - 260));
    y += 44;
  }

  // Footer bar.
  ctx.fillStyle = gold;
  ctx.fillRect(62, W - 170, W - 124, 108);
  ctx.fillStyle = "#0b0b0b";
  ctx.font = `900 40px ${family}`;
  ctx.fillText("WHAT'S YOUR WU-STYLE NAME?", W / 2, W - 132);
  ctx.font = `700 26px ${family}`;
  ctx.fillText("randomtopics.app/wu-tang-name-generator", W / 2, W - 90);
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

function fileName(result: WuName): string {
  return `${result.full.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-wu-name.png`;
}

export default function WuTangNameGenerator() {
  const [input, setInput] = useState("");
  const [shown, setShown] = useState<Shown | null>(null);
  const [flash, setFlash] = useState("");
  const [fallback, setFallback] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recent = useRef<string[]>([]);

  const remember = (r: WuName) => {
    recent.current = [pairKey(r), ...recent.current].slice(0, RECENT);
  };

  const writeUrl = (next: Shown) => {
    try {
      const url = shareUrl(window.location.origin, next.input ? { name: next.input } : { code: next.result.code });
      window.history.replaceState(window.history.state, "", url.slice(window.location.origin.length));
    } catch { /* URL sync is best-effort */ }
  };

  // Restore a shared result after mount (the server HTML stays canonical).
  useEffect(() => {
    const restored = readShareParams(window.location.search);
    if (!restored) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from the share URL
    setShown(restored);
    if (restored.input) setInput(restored.input);
    remember(restored.result);
    track("shared_result_open", { tool_type: TOOL, result_type: restored.input ? "name" : "random" });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shown) return;
    drawCard(canvas, shown);
  }, [shown]);

  const flashMsg = (what: string) => {
    setFlash(what);
    setTimeout(() => setFlash(""), 1800);
  };

  const fromName = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = input.replace(/\s+/g, " ").trim();
    const result = nameFor(clean);
    if (!result) return;
    const next = { result, input: clean };
    setShown(next);
    remember(result);
    writeUrl(next);
    track("generate_success", { tool_type: TOOL, result_count: 1, result_source: "name_hash", locale: "en" });
  };

  const fromRandom = () => {
    const result = randomName(Math.random, new Set(recent.current));
    const next = { result, input: null };
    setShown(next);
    remember(result);
    writeUrl(next);
    track("generate_success", { tool_type: TOOL, result_count: 1, result_source: "random", locale: "en" });
  };

  const link = useCallback(() => {
    if (!shown) return "";
    return shareUrl("https://randomtopics.app", shown.input ? { name: shown.input } : { code: shown.result.code });
  }, [shown]);

  const copyName = async () => {
    if (!shown) return;
    if (await copyText(`My Wu-Tang name is ${shown.result.full} — ${link()}`)) {
      flashMsg("copy");
      track("copy_result", { tool_type: TOOL, locale: "en" });
    }
  };

  const copyLink = async () => {
    if (!shown) return;
    if (await copyText(link())) {
      flashMsg("link");
      track("share_result", { tool_type: TOOL, result_type: shown.input ? "name" : "random", share_method: "copy_link" });
    } else setFallback(link());
  };

  const download = (blob: Blob, result: WuName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName(result);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const shareCard = async (mode: "share" | "download") => {
    const canvas = canvasRef.current;
    if (!canvas || !shown) return;
    const blob = await canvasBlob(canvas);
    if (!blob) return;
    if (mode === "share") {
      const file = new File([blob], fileName(shown.result), { type: "image/png" });
      const data = { files: [file], title: "My Wu-Tang name", text: `My Wu-Tang name is ${shown.result.full}. Get yours: ${link()}` };
      if (typeof navigator.share === "function" && navigator.canShare?.(data)) {
        try {
          await navigator.share(data);
          track("share_result", { tool_type: TOOL, result_type: "card", share_method: "native_file" });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
    }
    download(blob, shown.result);
    flashMsg("download");
    track("share_result", { tool_type: TOOL, result_type: "card", share_method: "download" });
  };

  const btn = "px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/60 hover:text-[var(--text-primary)] transition-colors";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <form onSubmit={fromName} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="wu-name-input" className="sr-only">Your name</label>
          <input
            id="wu-name-input"
            type="text"
            value={input}
            maxLength={MAX_INPUT_LENGTH}
            autoComplete="given-name"
            placeholder="Type your name (e.g. Alex)"
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 min-w-0 bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-yellow)]"
          />
          <button type="submit" disabled={!input.trim()} className="btn-generate disabled:opacity-40 !px-6">
            Get my Wu name
          </button>
        </form>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
          <span>Same name, same result — every time.</span>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={fromRandom} className="text-[var(--neon-yellow)] hover:underline font-semibold">
            🎲 {shown && !shown.input ? "Roll another random name" : "Give me a random Wu name"}
          </button>
        </div>

        <div aria-live="polite" className="mt-6">
          {shown ? (
            <div className="rounded-2xl border border-[var(--neon-yellow)]/30 bg-black/40 p-6 sm:p-8 text-center">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
                {shown.input ? <>Wu-Tang name for <span className="text-[var(--text-primary)]">{shown.input}</span></> : "Random Wu-Tang name"}
              </p>
              <p className="text-4xl sm:text-6xl font-extrabold leading-tight break-words" style={{ fontFamily: "var(--font-display)" }}>
                <span className="block text-[var(--neon-yellow)]">{shown.result.first}</span>
                <span className="block text-[var(--text-primary)]">{shown.result.second}</span>
              </p>
              {shown.result.flourish && <p className="text-lg text-[var(--neon-yellow)] mt-1 font-semibold">{shown.result.flourish}</p>}
              <p className="text-sm text-[var(--text-secondary)] italic mt-4 max-w-md mx-auto">{shown.result.origin}</p>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <button type="button" onClick={() => shareCard("share")} className={btn}>📤 Share card</button>
                <button type="button" onClick={() => shareCard("download")} className={btn}>{flash === "download" ? "Saved!" : "⬇️ Download PNG"}</button>
                <button type="button" onClick={copyLink} className={btn}>{flash === "link" ? "Link copied!" : "🔗 Copy link"}</button>
                <button type="button" onClick={copyName} className={btn}>{flash === "copy" ? "Copied!" : "📋 Copy name"}</button>
              </div>
              {fallback && (
                <input readOnly value={fallback} onFocus={(e) => e.currentTarget.select()} aria-label="Share link"
                  className="mt-3 w-full bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)]" />
              )}
              <canvas ref={canvasRef} width={CARD} height={CARD} aria-label={`Share card: ${shown.result.full}`}
                className="mt-6 mx-auto w-full max-w-[320px] h-auto rounded-xl border border-white/10" />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-[var(--text-muted)]">
              Enter your name to reveal your Wu-Tang name — or roll a random one.
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-center text-[var(--text-muted)] mt-3">Unofficial fan tool. Not affiliated with Wu-Tang Clan.</p>
    </section>
  );
}
