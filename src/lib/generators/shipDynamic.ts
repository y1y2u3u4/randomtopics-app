// "My (least) favorite ship dynamic" stick-figure template.
// Everything is drawn on a canvas: two stick figures per panel, posed by a preset,
// with the two names under their feet and a caption. Optional uploaded pictures replace
// the heads. The card (minus uploads) is stored in the share link after the # sign.

export type Face = "happy" | "grin" | "frown" | "angry" | "smug" | "hearts" | "blush" | "blank" | "cry" | "sleepy";
type ArmKey = "down" | "up" | "crossed" | "point" | "out" | "hip" | "wave" | "fist" | "reach" | "hold";

interface Fig {
  dx: number; // panel-relative x of the feet (0..1)
  facing: 1 | -1;
  scale?: number;
  lift?: number; // raise by this many figure units (jumping, carried)
  front: ArmKey;
  back: ArmKey;
  face: Face;
  ears?: "cat" | "dog";
  tail?: "cat" | "dog";
}

type PropKind = "heart" | "broken" | "spark" | "bolt" | "scribble" | "bubble" | "q" | "sweat" | "anger" | "zzz" | "leash" | "motion";
interface Prop { k: PropKind; x?: number; y?: number; s?: number; t?: string }

export interface Preset {
  id: string;
  label: string;
  emoji: string;
  caption: string;
  a: Fig;
  b: Fig;
  props: Prop[];
}

export const PRESETS: Preset[] = [
  {
    id: "grumpy-sunshine", label: "Grumpy × Sunshine", emoji: "☀️",
    caption: "the grumpy one would commit crimes for the sunny one",
    a: { dx: 0.34, facing: 1, front: "crossed", back: "crossed", face: "frown" },
    b: { dx: 0.66, facing: -1, front: "up", back: "up", face: "grin" },
    props: [{ k: "spark", x: 0.8, y: 0.3, s: 1 }, { k: "spark", x: 0.53, y: 0.27, s: 0.7 }, { k: "spark", x: 0.84, y: 0.55, s: 0.6 }, { k: "anger", x: 0.25, y: 0.3 }],
  },
  {
    id: "enemies-to-lovers", label: "Enemies to lovers", emoji: "🗡️",
    caption: "“I hate you” (derogatory) → “I hate you” (affectionate)",
    a: { dx: 0.32, facing: 1, front: "point", back: "hip", face: "angry" },
    b: { dx: 0.68, facing: -1, front: "hip", back: "hip", face: "smug" },
    props: [{ k: "anger", x: 0.22, y: 0.3 }, { k: "heart", x: 0.5, y: 0.3, s: 0.8 }],
  },
  {
    id: "tall-short", label: "Tall × Short", emoji: "📏",
    caption: "the short one is the scary one",
    a: { dx: 0.36, facing: 1, scale: 1.22, front: "reach", back: "down", face: "happy" },
    b: { dx: 0.6, facing: -1, scale: 0.72, front: "fist", back: "fist", face: "angry" },
    props: [{ k: "anger", x: 0.68, y: 0.42 }],
  },
  {
    id: "falls-first", label: "Falls first, falls harder", emoji: "💘",
    caption: "one of them fell first. the other one fell harder.",
    a: { dx: 0.32, facing: 1, front: "down", back: "down", face: "hearts" },
    b: { dx: 0.68, facing: 1, front: "wave", back: "down", face: "blank" },
    props: [{ k: "heart", x: 0.27, y: 0.27, s: 0.8 }, { k: "heart", x: 0.38, y: 0.22, s: 0.6 }, { k: "heart", x: 0.46, y: 0.3, s: 0.45 }, { k: "q", x: 0.78, y: 0.27 }],
  },
  {
    id: "chaos-calm", label: "Chaos × Calm", emoji: "🌀",
    caption: "the calm one is holding the leash (barely)",
    a: { dx: 0.3, facing: 1, front: "hold", back: "down", face: "sleepy" },
    b: { dx: 0.68, facing: 1, lift: 0.1, front: "up", back: "up", face: "grin" },
    props: [{ k: "leash" }, { k: "scribble", x: 0.68, y: 0.5, s: 1 }, { k: "motion", x: 0.84, y: 0.6 }],
  },
  {
    id: "protective", label: "Protective × Oblivious", emoji: "🛡️",
    caption: "touch them and you won't live to regret it",
    a: { dx: 0.6, facing: 1, front: "out", back: "out", face: "angry" },
    b: { dx: 0.32, facing: 1, front: "wave", back: "down", face: "happy" },
    props: [{ k: "anger", x: 0.72, y: 0.28 }, { k: "spark", x: 0.2, y: 0.32, s: 0.6 }],
  },
  {
    id: "rivals", label: "Rivals", emoji: "⚡",
    caption: "they will compete about literally anything",
    a: { dx: 0.32, facing: 1, front: "fist", back: "fist", face: "angry" },
    b: { dx: 0.68, facing: -1, front: "fist", back: "fist", face: "angry" },
    props: [{ k: "bolt", x: 0.5, y: 0.42, s: 1 }],
  },
  {
    id: "mutual-pining", label: "Mutual pining idiots", emoji: "🫣",
    caption: "both in love. both convinced it's one-sided.",
    a: { dx: 0.33, facing: -1, front: "down", back: "down", face: "blush" },
    b: { dx: 0.67, facing: 1, front: "down", back: "down", face: "blush" },
    props: [{ k: "heart", x: 0.26, y: 0.26, s: 0.6 }, { k: "heart", x: 0.74, y: 0.26, s: 0.6 }, { k: "sweat", x: 0.42, y: 0.36 }, { k: "sweat", x: 0.58, y: 0.36 }],
  },
  {
    id: "retriever-cat", label: "Golden retriever × Black cat", emoji: "🐶",
    caption: "golden retriever energy × black cat energy",
    a: { dx: 0.33, facing: 1, front: "wave", back: "up", face: "grin", ears: "dog", tail: "dog" },
    b: { dx: 0.67, facing: -1, front: "crossed", back: "crossed", face: "smug", ears: "cat", tail: "cat" },
    props: [{ k: "heart", x: 0.48, y: 0.3, s: 0.6 }],
  },
  {
    id: "clingy", label: "Clingy × Pretends to hate it", emoji: "🫂",
    caption: "“get off me” (does not move)",
    a: { dx: 0.44, facing: -1, front: "crossed", back: "crossed", face: "blush" },
    b: { dx: 0.6, facing: -1, front: "hold", back: "hold", face: "hearts" },
    props: [{ k: "heart", x: 0.7, y: 0.28, s: 0.6 }, { k: "bubble", x: 0.24, y: 0.27, t: "ugh" }],
  },
  {
    id: "carry", label: "Refuses to walk", emoji: "🎒",
    caption: "one of them simply refuses to walk anywhere",
    a: { dx: 0.52, facing: 1, front: "down", back: "down", face: "sleepy" },
    b: { dx: 0.44, facing: 1, scale: 0.82, lift: 0.4, front: "up", back: "wave", face: "grin" },
    props: [{ k: "sweat", x: 0.66, y: 0.42 }, { k: "spark", x: 0.3, y: 0.24, s: 0.6 }],
  },
  {
    id: "bickering", label: "Bickering married couple", emoji: "🗯️",
    caption: "argue 24/7. would die for each other.",
    a: { dx: 0.32, facing: 1, front: "point", back: "hip", face: "angry" },
    b: { dx: 0.68, facing: -1, front: "point", back: "hip", face: "angry" },
    props: [{ k: "bubble", x: 0.22, y: 0.24, t: "!!" }, { k: "bubble", x: 0.78, y: 0.24, t: "?!" }],
  },
];

export const PRESET_BY_ID = new Map(PRESETS.map((p) => [p.id, p]));

export const HEADINGS = ["My favorite ship dynamic", "My least favorite ship dynamic"] as const;

export interface Panel { heading: string; preset: string; nameA: string; nameB: string; caption: string }
export interface ShipCard { panels: Panel[]; by: string }

export const LIMITS = { heading: 48, name: 24, caption: 90, by: 30 } as const;
export const PANEL_COUNTS = [1, 2, 4] as const;

export function panelFor(preset: string, heading: string, nameA = "", nameB = ""): Panel {
  const p = PRESET_BY_ID.get(preset) ?? PRESETS[0];
  return { heading, preset: p.id, nameA, nameB, caption: p.caption };
}

export const EXAMPLES: { id: string; label: string; card: ShipCard }[] = [
  {
    id: "fav-least", label: "Favorite vs least favorite",
    card: { by: "", panels: [panelFor("grumpy-sunshine", HEADINGS[0], "Rook", "Sunny"), panelFor("falls-first", HEADINGS[1], "Me", "My crush")] },
  },
  {
    id: "single", label: "One dynamic",
    card: { by: "", panels: [panelFor("chaos-calm", HEADINGS[0], "Ivy", "Max")] },
  },
  {
    id: "four", label: "4 favorite dynamics",
    card: {
      by: "",
      panels: [
        panelFor("enemies-to-lovers", "Enemies to lovers", "A", "B"),
        panelFor("tall-short", "Tall × Short", "A", "B"),
        panelFor("retriever-cat", "Golden retriever × Black cat", "A", "B"),
        panelFor("protective", "Protective × Oblivious", "A", "B"),
      ],
    },
  },
];

export const cloneCard = (c: ShipCard): ShipCard => ({ by: c.by, panels: c.panels.map((p) => ({ ...p })) });

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

function normalize(c: ShipCard): ShipCard {
  const panels = (c.panels ?? []).slice(0, 4).map((p) => ({
    heading: clip(p.heading, LIMITS.heading),
    preset: PRESET_BY_ID.has(p.preset) ? p.preset : PRESETS[0].id,
    nameA: clip(p.nameA, LIMITS.name),
    nameB: clip(p.nameB, LIMITS.name),
    caption: clip(p.caption, LIMITS.caption),
  }));
  while (panels.length && !(PANEL_COUNTS as readonly number[]).includes(panels.length)) panels.pop();
  return { by: clip(c.by, LIMITS.by), panels: panels.length ? panels : [panelFor(PRESETS[0].id, HEADINGS[0])] };
}

function toB64Url(bytes: Uint8Array): string {
  let s = "";
  bytes.forEach((b) => { s += String.fromCharCode(b); });
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(b, (ch) => ch.charCodeAt(0));
}

export function encodeShip(c: ShipCard): string {
  const n = normalize(c);
  return toB64Url(new TextEncoder().encode(JSON.stringify([1, n.by, n.panels.map((p) => [p.heading, p.preset, p.nameA, p.nameB, p.caption])])));
}

export function decodeShip(code: string): ShipCard | null {
  try {
    if (!code || code.length > 3000) return null;
    const d = JSON.parse(new TextDecoder().decode(fromB64Url(code)));
    if (!Array.isArray(d) || d[0] !== 1 || !Array.isArray(d[2])) return null;
    return normalize({ by: d[1], panels: d[2].filter(Array.isArray).map((x: unknown[]) => ({ heading: x[0], preset: x[1], nameA: x[2], nameB: x[3], caption: x[4] }) as Panel) });
  } catch {
    return null;
  }
}

export function shipFromHash(hash: string): ShipCard | null {
  const v = new URLSearchParams(hash.replace(/^#/, "")).get("s");
  return v ? decodeShip(v) : null;
}

// ---------- drawing ----------

const INK = "#1b1b1f";
export const HAND_FONT = `"Comic Sans MS", "Chalkboard SE", "Comic Neue", "Marker Felt", "Segoe Print", cursive`;

// Elbow and hand of the arm on the side the figure faces (figure units, y up is negative).
const ARMS: Record<ArmKey, [number, number, number, number]> = {
  down: [0.07, -0.5, 0.1, -0.36],
  up: [0.16, -0.8, 0.26, -0.96],
  crossed: [0.11, -0.54, -0.07, -0.6],
  point: [0.16, -0.66, 0.33, -0.68],
  out: [0.17, -0.66, 0.33, -0.6],
  hip: [0.14, -0.53, 0.05, -0.42],
  wave: [0.18, -0.72, 0.24, -0.92],
  fist: [0.13, -0.6, 0.22, -0.74],
  reach: [0.17, -0.78, 0.34, -0.88],
  hold: [0.14, -0.56, 0.27, -0.54],
};

interface Placed { fx: number; base: number; u: number; f: 1 | -1 }
const pt = (P: Placed, x: number, y: number): [number, number] => [P.fx + x * P.u * P.f, P.base + y * P.u];

function line(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
}

function heartPath(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.9, y - s * 0.25, x - s * 0.45, y - s * 0.95, x, y - s * 0.45);
  ctx.bezierCurveTo(x + s * 0.45, y - s * 0.95, x + s * 0.9, y - s * 0.25, x, y + s * 0.35);
  ctx.closePath();
}

function drawFace(ctx: CanvasRenderingContext2D, face: Face, cx: number, cy: number, r: number, f: 1 | -1) {
  const lw = ctx.lineWidth;
  const ex = cx + r * 0.22 * f;
  const eL = ex - r * 0.32, eR = ex + r * 0.32, ey = cy - r * 0.12;
  const dot = (x: number, y: number, k = 0.11) => { ctx.beginPath(); ctx.arc(x, y, r * k, 0, Math.PI * 2); ctx.fill(); };
  ctx.fillStyle = INK;
  const mouthY = cy + r * 0.38;
  switch (face) {
    case "happy":
      dot(eL, ey); dot(eR, ey);
      ctx.beginPath(); ctx.arc(ex, cy + r * 0.12, r * 0.32, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      break;
    case "grin":
      ctx.beginPath(); ctx.arc(eL, ey + r * 0.06, r * 0.14, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(eR, ey + r * 0.06, r * 0.14, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex - r * 0.38, cy + r * 0.18); ctx.lineTo(ex + r * 0.38, cy + r * 0.18); ctx.arc(ex, cy + r * 0.18, r * 0.38, 0, Math.PI); ctx.closePath(); ctx.fill();
      break;
    case "frown":
    case "angry":
      dot(eL, ey + r * 0.04); dot(eR, ey + r * 0.04);
      ctx.beginPath(); ctx.arc(ex, mouthY + r * 0.18, r * 0.28, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke();
      if (face === "angry") {
        line(ctx, [[eL - r * 0.18, ey - r * 0.3], [eL + r * 0.14, ey - r * 0.14]]);
        line(ctx, [[eR + r * 0.18, ey - r * 0.3], [eR - r * 0.14, ey - r * 0.14]]);
      } else {
        line(ctx, [[eL - r * 0.16, ey - r * 0.22], [eL + r * 0.14, ey - r * 0.22]]);
        line(ctx, [[eR - r * 0.14, ey - r * 0.22], [eR + r * 0.16, ey - r * 0.22]]);
      }
      break;
    case "smug":
      line(ctx, [[eL - r * 0.15, ey], [eL + r * 0.15, ey]]);
      line(ctx, [[eR - r * 0.15, ey], [eR + r * 0.15, ey]]);
      ctx.beginPath(); ctx.moveTo(ex - r * 0.3 * f, mouthY); ctx.quadraticCurveTo(ex + r * 0.05 * f, mouthY + r * 0.08, ex + r * 0.34 * f, mouthY - r * 0.16); ctx.stroke();
      break;
    case "hearts":
      ctx.fillStyle = "#e5354f";
      heartPath(ctx, eL, ey + r * 0.04, r * 0.3); ctx.fill();
      heartPath(ctx, eR, ey + r * 0.04, r * 0.3); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.arc(ex, cy + r * 0.14, r * 0.3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      break;
    case "blush":
      dot(eL, ey); dot(eR, ey);
      ctx.fillStyle = "rgba(240,110,140,0.55)";
      ctx.beginPath(); ctx.ellipse(eL - r * 0.06, cy + r * 0.2, r * 0.17, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(eR + r * 0.06, cy + r * 0.2, r * 0.17, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK;
      ctx.beginPath(); ctx.moveTo(ex - r * 0.18, mouthY); ctx.quadraticCurveTo(ex - r * 0.09, mouthY - r * 0.1, ex, mouthY); ctx.quadraticCurveTo(ex + r * 0.09, mouthY + r * 0.1, ex + r * 0.18, mouthY); ctx.stroke();
      break;
    case "blank":
      dot(eL, ey, 0.09); dot(eR, ey, 0.09);
      ctx.beginPath(); ctx.arc(ex, mouthY, r * 0.09, 0, Math.PI * 2); ctx.stroke();
      break;
    case "cry":
      dot(eL, ey); dot(eR, ey);
      ctx.strokeStyle = "#3d8bf2";
      line(ctx, [[eL, ey + r * 0.14], [eL, ey + r * 0.5]]);
      line(ctx, [[eR, ey + r * 0.14], [eR, ey + r * 0.5]]);
      ctx.strokeStyle = INK;
      ctx.beginPath(); ctx.arc(ex, mouthY + r * 0.16, r * 0.22, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke();
      break;
    case "sleepy":
      ctx.beginPath(); ctx.arc(eL, ey - r * 0.04, r * 0.13, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(eR, ey - r * 0.04, r * 0.13, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
      line(ctx, [[ex - r * 0.14, mouthY], [ex + r * 0.14, mouthY]]);
      break;
  }
  ctx.lineWidth = lw;
}

function coverDraw(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, r: number) {
  const w = img.naturalWidth || 1, h = img.naturalHeight || 1, s = Math.max((2 * r) / w, (2 * r) / h);
  ctx.drawImage(img, cx - (w * s) / 2, cy - (h * s) / 2, w * s, h * s);
}

function drawFigure(ctx: CanvasRenderingContext2D, fig: Fig, P: Placed, head: HTMLImageElement | null) {
  const [hx, hy] = pt(P, 0, -0.84);
  const r = 0.12 * P.u;
  // tail first so the body covers its root
  if (fig.tail) {
    const [tx, ty] = pt(P, -0.02, -0.4);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    if (fig.tail === "dog") {
      const [ax, ay] = pt(P, -0.2, -0.5);
      ctx.quadraticCurveTo(...pt(P, -0.16, -0.38), ax, ay);
      ctx.stroke();
      line(ctx, [pt(P, -0.27, -0.56), pt(P, -0.32, -0.6)]);
      line(ctx, [pt(P, -0.27, -0.47), pt(P, -0.33, -0.47)]);
    } else {
      ctx.bezierCurveTo(...pt(P, -0.22, -0.36), ...pt(P, -0.12, -0.62), ...pt(P, -0.24, -0.7));
      ctx.stroke();
    }
  }
  line(ctx, [pt(P, 0, -0.72), pt(P, 0, -0.36)]);
  line(ctx, [pt(P, 0.11, 0), pt(P, 0, -0.36), pt(P, -0.11, 0)]);
  const sh = pt(P, 0, -0.64);
  const fa = ARMS[fig.front], ba = ARMS[fig.back];
  line(ctx, [sh, pt(P, fa[0], fa[1]), pt(P, fa[2], fa[3])]);
  line(ctx, [sh, pt(P, -ba[0], ba[1]), pt(P, -ba[2], ba[3])]);
  // head
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  if (head) {
    ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.clip(); coverDraw(ctx, head, hx, hy, r); ctx.restore();
  }
  ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  if (fig.ears === "cat") {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(hx + s * r * 0.85, hy - r * 0.5);
      ctx.lineTo(hx + s * r * 0.75, hy - r * 1.45);
      ctx.lineTo(hx + s * r * 0.2, hy - r * 0.95);
      ctx.fillStyle = INK; ctx.fill(); ctx.stroke();
    }
  } else if (fig.ears === "dog") {
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.fillStyle = "#c8913a";
      ctx.beginPath(); ctx.ellipse(hx + s * r * 1.02, hy + r * 0.05, r * 0.28, r * 0.6, s * 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
  if (!head) drawFace(ctx, fig.face, hx, hy, r, P.f);
}

function drawProp(ctx: CanvasRenderingContext2D, p: Prop, x0: number, y0: number, w: number, h: number, u: number, hand: [number, number], neck: [number, number]) {
  const x = x0 + (p.x ?? 0.5) * w, y = y0 + (p.y ?? 0.5) * h, s = (p.s ?? 1) * u;
  ctx.save();
  switch (p.k) {
    case "heart":
      ctx.fillStyle = "#e5354f"; heartPath(ctx, x, y, s * 0.16); ctx.fill(); ctx.lineWidth *= 0.7; ctx.stroke();
      break;
    case "broken":
      ctx.fillStyle = "#e5354f"; heartPath(ctx, x, y, s * 0.16); ctx.fill();
      ctx.strokeStyle = "#ffffff"; line(ctx, [[x, y - s * 0.07], [x - s * 0.03, y - s * 0.02], [x + s * 0.02, y + s * 0.02], [x, y + s * 0.05]]);
      break;
    case "spark": {
      ctx.fillStyle = "#ffd43b"; ctx.beginPath();
      const R = s * 0.09, rr = R * 0.32;
      for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, k = i % 2 ? rr : R; ctx.lineTo(x + Math.cos(a) * k, y + Math.sin(a) * k); }
      ctx.closePath(); ctx.fill(); ctx.lineWidth *= 0.6; ctx.stroke();
      break;
    }
    case "bolt": {
      const k = s * 0.22;
      ctx.fillStyle = "#ffd43b"; ctx.beginPath();
      [[0.15, -0.5], [-0.25, 0.05], [0, 0.05], [-0.15, 0.5], [0.25, -0.08], [0, -0.08]].forEach(([a, b], i) => (i ? ctx.lineTo(x + a * k, y + b * k) : ctx.moveTo(x + a * k, y + b * k)));
      ctx.closePath(); ctx.fill(); ctx.lineWidth *= 0.7; ctx.stroke();
      break;
    }
    case "scribble": {
      ctx.strokeStyle = "rgba(27,27,31,0.55)"; ctx.lineWidth *= 0.6; ctx.beginPath();
      const R = s * 0.42;
      for (let i = 0; i <= 64; i++) { const a = i * 0.55, rr = R * (0.75 + 0.25 * Math.sin(i * 1.7)); const px = x + Math.cos(a) * rr * 0.8, py = y + Math.sin(a) * rr; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
      break;
    }
    case "bubble": {
      const t = p.t ?? "!!";
      ctx.font = `700 ${Math.round(u * 0.11)}px ${HAND_FONT}`;
      const tw = Math.max(ctx.measureText(t).width, u * 0.12), bw = tw + u * 0.12, bh = u * 0.17;
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bh / 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 1);
      break;
    }
    case "q":
      ctx.fillStyle = INK; ctx.font = `700 ${Math.round(u * 0.16)}px ${HAND_FONT}`; ctx.textAlign = "center"; ctx.fillText("?", x, y);
      break;
    case "sweat":
      ctx.fillStyle = "#6cb6ff"; ctx.beginPath(); ctx.moveTo(x, y - u * 0.05); ctx.quadraticCurveTo(x + u * 0.04, y + u * 0.01, x, y + u * 0.03); ctx.quadraticCurveTo(x - u * 0.04, y + u * 0.01, x, y - u * 0.05); ctx.fill(); ctx.lineWidth *= 0.6; ctx.stroke();
      break;
    case "anger": {
      ctx.strokeStyle = "#e03131"; const k = u * 0.05;
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.beginPath(); ctx.arc(x + sx * k * 1.25, y + sy * k * 1.25, k, sx < 0 ? (sy < 0 ? 0 : 1.5 * Math.PI) : (sy < 0 ? 0.5 * Math.PI : Math.PI), sx < 0 ? (sy < 0 ? 0.5 * Math.PI : 2 * Math.PI) : (sy < 0 ? Math.PI : 1.5 * Math.PI)); ctx.stroke(); }
      break;
    }
    case "zzz":
      ctx.fillStyle = INK; ctx.font = `700 ${Math.round(u * 0.09)}px ${HAND_FONT}`; ctx.fillText("z z Z", x, y);
      break;
    case "motion":
      for (let i = -1; i <= 1; i++) line(ctx, [[x, y + i * u * 0.07], [x + u * 0.12, y + i * u * 0.07]]);
      break;
    case "leash":
      ctx.strokeStyle = "#c0392b"; ctx.beginPath(); ctx.moveTo(hand[0], hand[1]);
      ctx.quadraticCurveTo((hand[0] + neck[0]) / 2, Math.max(hand[1], neck[1]) + u * 0.18, neck[0], neck[1]); ctx.stroke();
      break;
  }
  ctx.restore();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > max && cur) { out.push(cur); cur = w; } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

/** Heads are keyed `${panelIndex}a` / `${panelIndex}b`. */
export type Heads = Record<string, HTMLImageElement | null | undefined>;

export function drawPanel(ctx: CanvasRenderingContext2D, panel: Panel, x: number, y: number, w: number, h: number, heads: Heads, index: number) {
  const preset = PRESET_BY_ID.get(panel.preset) ?? PRESETS[0];
  ctx.save();
  ctx.fillStyle = "#ffffff"; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = INK; ctx.lineWidth = Math.max(3, w * 0.006);
  ctx.strokeRect(x, y, w, h);
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const small = Math.min(w, h);
  ctx.fillStyle = INK; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  const hs = Math.round(Math.min(small * 0.075, (w * 0.9) / Math.max(10, panel.heading.length) * 1.7));
  ctx.font = `800 ${hs}px ${HAND_FONT}`;
  ctx.fillText(fitText(ctx, (panel.heading || "My favorite ship dynamic").toUpperCase(), w * 0.92), x + w / 2, y + h * 0.04 + hs);

  const u = Math.min(h * 0.44, w * 0.62);
  const base = y + h * 0.77;
  ctx.lineWidth = Math.max(3, u * 0.024); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = INK;
  const place = (fg: Fig): Placed => {
    const uu = u * (fg.scale ?? 1);
    return { fx: x + fg.dx * w, base: base - (fg.lift ?? 0) * u, u: uu, f: fg.facing };
  };
  const PA = place(preset.a), PB = place(preset.b);
  const handA = pt(PA, ARMS[preset.a.front][2], ARMS[preset.a.front][3]);
  const neckB = pt(PB, 0, -0.68);
  // Carried figure is drawn first so the carrier stays in front.
  const order: ["a" | "b", Fig, Placed][] = preset.b.lift && preset.b.lift > 0.2 ? [["b", preset.b, PB], ["a", preset.a, PA]] : [["a", preset.a, PA], ["b", preset.b, PB]];
  for (const [k, fg, P] of order) drawFigure(ctx, fg, P, heads[`${index}${k}`] ?? null);
  for (const p of preset.props) { ctx.lineWidth = Math.max(3, u * 0.024); ctx.strokeStyle = INK; drawProp(ctx, p, x, y, w, h, u, handA, neckB); }

  // names under the feet
  const ns = Math.round(small * 0.055);
  ctx.font = `700 ${ns}px ${HAND_FONT}`; ctx.fillStyle = INK; ctx.textAlign = "center";
  const nameY = base + ns * 1.25;
  const nx = (fx: number) => Math.min(Math.max(fx, x + w * 0.16), x + w * 0.84);
  let ax = nx(PA.fx), bx = nx(PB.fx);
  let span = Math.max(w * 0.28, Math.abs(ax - bx) - ns * 0.6);
  if (Math.abs(ax - bx) < w * 0.2) {
    // figures overlap (carry pose): spread the two names side by side, keeping their left/right order
    const mid = (ax + bx) / 2, off = w * 0.14, aRight = PA.fx >= PB.fx;
    ax = mid + (aRight ? off : -off); bx = mid + (aRight ? -off : off); span = w * 0.26;
  }
  if (panel.nameA) ctx.fillText(fitText(ctx, panel.nameA, span), ax, nameY);
  if (panel.nameB) ctx.fillText(fitText(ctx, panel.nameB, span), bx, nameY);

  if (panel.caption) {
    const cs = Math.round(small * 0.045);
    ctx.font = `500 ${cs}px ${HAND_FONT}`; ctx.fillStyle = "#3a3a44";
    const lines = wrap(ctx, panel.caption, w * 0.9).slice(0, 2);
    lines.forEach((l, i) => ctx.fillText(l, x + w / 2, y + h - h * 0.03 - (lines.length - 1 - i) * cs * 1.2));
  }
  ctx.restore();
}

export function cardSize(n: number): [number, number] {
  return n === 1 ? [1080, 1080] : [1080, 1350];
}

export function drawCard(ctx: CanvasRenderingContext2D, card: ShipCard, heads: Heads, footer = "randomtopics.app/ship-dynamic-template") {
  const n = card.panels.length;
  const [W, H] = cardSize(n);
  ctx.fillStyle = "#f4f1ea"; ctx.fillRect(0, 0, W, H);
  const pad = 28, gap = 22, foot = 56;
  const ih = H - pad * 2 - foot;
  const iw = W - pad * 2;
  if (n === 1) drawPanel(ctx, card.panels[0], pad, pad, iw, ih, heads, 0);
  else if (n === 2) card.panels.forEach((p, i) => drawPanel(ctx, p, pad, pad + i * ((ih - gap) / 2 + gap), iw, (ih - gap) / 2, heads, i));
  else card.panels.forEach((p, i) => drawPanel(ctx, p, pad + (i % 2) * ((iw - gap) / 2 + gap), pad + Math.floor(i / 2) * ((ih - gap) / 2 + gap), (iw - gap) / 2, (ih - gap) / 2, heads, i));
  ctx.fillStyle = "#6b6b75"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.font = `600 24px ${HAND_FONT}`;
  const by = card.by.trim();
  ctx.fillText(by ? `${by} · ${footer}` : footer, W / 2, H - pad - 12);
}
