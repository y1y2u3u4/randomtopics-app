import { careerYears, dateLabel, FIVE_ORDER, jerseyColors, type NbaPlayer } from "@/lib/nbaPlayers";

export type ShareFormat = "square" | "story";
const SIZES: Record<ShareFormat, { w: number; h: number; bg: string }> = {
  square: { w: 1080, h: 1080, bg: "/nba/share-square.jpg" },
  story: { w: 1080, h: 1920, bg: "/nba/share-story.jpg" },
};
const FONT = "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Arial Black', system-ui, sans-serif";
const BODY = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, family: string, weight: string, size: number, maxWidth: number) {
  let s = size;
  for (; s > 18; s -= 2) {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
  }
  ctx.font = `${weight} ${s}px ${family}`;
}

export async function renderFiveCanvas(day: number, five: readonly NbaPlayer[], format: ShareFormat): Promise<HTMLCanvasElement> {
  const { w, h, bg } = SIZES[format];
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  try { await document.fonts?.ready; } catch { /* fonts API missing */ }

  // Background: art if it loads, otherwise a solid gradient.
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#1b1030");
  grad.addColorStop(1, "#0b1a33");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const img = await loadImage(bg);
  if (img) {
    const k = Math.max(w / img.width, h / img.height);
    ctx.drawImage(img, (w - img.width * k) / 2, (h - img.height * k) / 2, img.width * k, img.height * k);
  }
  // Dark veil keeps the text readable on any art.
  ctx.fillStyle = "rgba(8,10,22,0.55)";
  ctx.fillRect(0, 0, w, h);

  const pad = 72;
  const top = format === "story" ? 190 : 78;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFE234";
  ctx.font = `700 34px ${BODY}`;
  ctx.fillText(dateLabel(day).toUpperCase(), pad, top);
  ctx.fillStyle = "#FFFFFF";
  fitFont(ctx, "TODAY'S RANDOM STARTING FIVE", FONT, "400", 84, w - pad * 2);
  ctx.fillText("TODAY'S RANDOM STARTING FIVE", pad, top + 92);

  const rowH = format === "story" ? 218 : 132;
  const rowsTop = top + (format === "story" ? 170 : 140);
  five.forEach((p, i) => {
    const y = rowsTop + i * rowH;
    const c = jerseyColors(p);
    ctx.fillStyle = "rgba(10,12,28,0.78)";
    ctx.beginPath();
    ctx.roundRect(pad, y, w - pad * 2, rowH - 18, 22);
    ctx.fill();
    // team-colour jersey tab with the number (or position when no number)
    const tab = rowH - 18;
    ctx.fillStyle = c.primary;
    ctx.beginPath();
    ctx.roundRect(pad, y, tab + 40, tab, 22);
    ctx.fill();
    ctx.fillStyle = c.secondary;
    ctx.fillRect(pad + tab + 30, y, 10, tab);
    ctx.fillStyle = c.text;
    ctx.textAlign = "center";
    ctx.font = `400 ${Math.round(tab * 0.6)}px ${FONT}`;
    ctx.fillText(p.number === null ? p.pos : String(p.number), pad + (tab + 30) / 2, y + tab * 0.72);
    ctx.textAlign = "left";
    const tx = pad + tab + 70;
    const maxW = w - pad - tx - 20;
    ctx.fillStyle = "#FFE234";
    ctx.font = `700 ${format === "story" ? 34 : 28}px ${BODY}`;
    ctx.fillText(`${FIVE_ORDER[i]}  ·  ${p.teams[0]}  ·  ${careerYears(p)}`, tx, y + tab * 0.34);
    ctx.fillStyle = "#FFFFFF";
    fitFont(ctx, p.name, FONT, "400", format === "story" ? 78 : 62, maxW);
    ctx.fillText(p.name, tx, y + tab * 0.8);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 40px ${BODY}`;
  ctx.fillText("randomtopics.app", w / 2, h - (format === "story" ? 150 : 52));
  return canvas;
}

export async function shareFiveImage(day: number, five: readonly NbaPlayer[], format: ShareFormat): Promise<"shared" | "downloaded"> {
  const canvas = await renderFiveCanvas(day, five, format);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("could not encode image");
  const name = `random-nba-starting-five-${format}-${dateLabel(day).replace(/[^A-Za-z0-9]+/g, "-")}.png`;
  const file = new File([blob], name, { type: "image/png" });
  // Phones: open the native share sheet with the image. Desktop: plain download.
  const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  if (touch && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Today's Random Starting Five", url: "https://randomtopics.app/random-nba-player-generator" });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "shared";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}
