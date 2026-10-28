import { shareCanvasPng, wrapLines } from "@/lib/shareImage";

const BODY = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number, start: number, min: number, weight = 700) {
  let size = start;
  let lines: string[] = [];
  for (; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px ${BODY}`;
    lines = wrapLines(ctx, text, maxW);
    if (lines.length <= maxLines) break;
  }
  return { size, lines };
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function base(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; s: number } {
  const s = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  const bg = ctx.createLinearGradient(0, 0, s, s);
  bg.addColorStop(0, "#14122b");
  bg.addColorStop(1, "#0a1a30");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, s, s);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  return { canvas, ctx, s };
}

function footer(ctx: CanvasRenderingContext2D, s: number, path: string) {
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 36px ${BODY}`;
  ctx.fillText(`randomtopics.app${path}`, s / 2, 1030);
}

/** 1080x1080 "would you rather" card: two option panels and, if any, this device's vote counts. */
export function renderWyrCanvas(a: string, b: string, votes?: [number, number]): HTMLCanvasElement {
  const { canvas, ctx, s } = base();
  ctx.fillStyle = "#FFE234";
  ctx.font = `800 54px ${BODY}`;
  ctx.fillText("Would you rather...", s / 2, 112);
  const panels: [string, string, number][] = [[cap(a), "#0b7285", 170], [cap(b), "#a61e4d", 590]];
  panels.forEach(([text, color, y], i) => {
    roundRect(ctx, 80, y, s - 160, 330, 36);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = `800 34px ${BODY}`;
    ctx.fillText(i === 0 ? "A" : "B", s / 2, y + 62);
    ctx.fillStyle = "#FFFFFF";
    const { size, lines } = fitText(ctx, text, s - 280, 4, 56, 30);
    const lh = size * 1.18;
    const top = y + 175 - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, k) => ctx.fillText(l, s / 2, top + k * lh));
    if (votes) {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = `700 32px ${BODY}`;
      ctx.fillText(`${votes[i]} vote${votes[i] === 1 ? "" : "s"}`, s / 2, y + 305);
    }
  });
  ctx.beginPath();
  ctx.arc(s / 2, 505, 52, 0, Math.PI * 2);
  ctx.fillStyle = "#14122b";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#FFE234";
  ctx.stroke();
  ctx.fillStyle = "#FFE234";
  ctx.font = `800 40px ${BODY}`;
  ctx.fillText("OR", s / 2, 520);
  if (votes) {
    ctx.fillStyle = "#8F97B8";
    ctx.font = `500 24px ${BODY}`;
    ctx.fillText("Votes from the people playing on this device", s / 2, 995);
  }
  footer(ctx, s, "/topics/would-you-rather-questions");
  return canvas;
}

/** 1080x1080 truth-or-dare card: big TRUTH or DARE label, the prompt and, optionally, whose turn it was. */
export function renderTodCanvas(kind: "truth" | "dare", text: string, player?: string): HTMLCanvasElement {
  const { canvas, ctx, s } = base();
  const color = kind === "truth" ? "#22d3ee" : "#ff2d78";
  roundRect(ctx, 70, 70, s - 140, s - 200, 44);
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `900 120px ${BODY}`;
  ctx.fillText(kind === "truth" ? "TRUTH" : "DARE", s / 2, 250);
  if (player) {
    ctx.fillStyle = "#FFE234";
    ctx.font = `800 42px ${BODY}`;
    ctx.fillText(`${player}'s turn`, s / 2, 320);
  }
  ctx.fillStyle = "#FFFFFF";
  const { size, lines } = fitText(ctx, text, s - 260, 8, 64, 30);
  const lh = size * 1.22;
  const top = 560 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, k) => ctx.fillText(l, s / 2, top + k * lh));
  footer(ctx, s, "/topics/truth-or-dare-questions");
  return canvas;
}

export function shareWyrImage(a: string, b: string, votes?: [number, number]) {
  return shareCanvasPng(renderWyrCanvas(a, b, votes), "would-you-rather.png", "Would You Rather", "https://randomtopics.app/topics/would-you-rather-questions");
}
export function shareTodImage(kind: "truth" | "dare", text: string, player?: string) {
  return shareCanvasPng(renderTodCanvas(kind, text, player), "truth-or-dare.png", "Truth or Dare", "https://randomtopics.app/topics/truth-or-dare-questions");
}
