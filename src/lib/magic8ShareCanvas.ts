import { shareCanvasPng, wrapLines } from "@/lib/shareImage";

const BODY = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** 1080x1080 card: the question, a drawn 8 ball with the answer in its window, and the site URL. */
export function renderMagic8Canvas(question: string, answer: string, subtitle?: string): HTMLCanvasElement {
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

  ctx.fillStyle = "#FFE234";
  ctx.font = `800 46px ${BODY}`;
  ctx.fillText(subtitle || "Magic 8 Ball", s / 2, 92);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 44px ${BODY}`;
  const q = question.trim();
  if (q) {
    const lines = wrapLines(ctx, q, s - 180).slice(0, 3);
    lines.forEach((l, i) => ctx.fillText(l, s / 2, 164 + i * 56));
  }

  const cx = s / 2, cy = 620, r = 330;
  const ball = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
  ball.addColorStop(0, "#4a4a5e");
  ball.addColorStop(0.35, "#15151f");
  ball.addColorStop(1, "#000000");
  ctx.fillStyle = ball;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  // the number-8 badge
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.62, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.font = `800 84px ${BODY}`;
  ctx.fillText("8", cx, cy - r * 0.62 + 30);
  // answer window
  ctx.fillStyle = "#1a2a8a";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 55);
  ctx.lineTo(cx + 200, cy + 150);
  ctx.lineTo(cx - 200, cy + 150);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#E8EEFF";
  let size = 42;
  ctx.font = `700 ${size}px ${BODY}`;
  let lines = wrapLines(ctx, answer, 250);
  while ((lines.length > 3 || lines.some((l) => ctx.measureText(l).width > 270)) && size > 20) {
    size -= 2;
    ctx.font = `700 ${size}px ${BODY}`;
    lines = wrapLines(ctx, answer, 250);
  }
  const lh = size * 1.12;
  const startY = cy + 70 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lh));

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 38px ${BODY}`;
  ctx.fillText("randomtopics.app/magic-8-ball", s / 2, 1010);
  ctx.fillStyle = "#8F97B8";
  ctx.font = `500 22px ${BODY}`;
  ctx.fillText("For fun only. Not affiliated with Mattel or the Magic 8 Ball brand.", s / 2, 1048);
  return canvas;
}

export function shareMagic8Image(question: string, answer: string, subtitle?: string): Promise<"shared" | "downloaded"> {
  return shareCanvasPng(renderMagic8Canvas(question, answer, subtitle), "magic-8-ball.png", "Magic 8 Ball", "https://randomtopics.app/magic-8-ball");
}
