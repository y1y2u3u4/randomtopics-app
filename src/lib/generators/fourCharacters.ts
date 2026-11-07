// "4 characters I like" — a 2×2 card. State is shared in the URL hash (#c=…), nothing is stored.
// Searched characters keep their AniList id so a shared link can reload the picture; uploaded
// pictures stay on the device. Cells without a picture get an original generated portrait card.

export interface Cell {
  /** AniList character id (from search). */
  id?: string;
  name: string;
  from: string;
  line: string;
  emoji: string;
  /** Runtime only (search result or uploaded blob URL); never encoded. */
  image?: string;
}
export interface Card { title: string; by: string; common: string; cells: Cell[] }

export const CELL_COUNT = 4;
export const LIMITS = { title: 50, by: 30, common: 90, name: 40, from: 40, line: 70, emoji: 8 } as const;
export const DEFAULT_TITLE = "4 Characters I Like";

/** Archetype emojis for the generated portrait cards. */
export const EMOJIS = ["⭐", "🗡️", "🔥", "🌙", "👑", "🧠", "💀", "🦊", "🌸", "🎮", "🃏", "🛡️", "🪄", "🐉", "☕", "🎧"];

export const emptyCell = (): Cell => ({ name: "", from: "", line: "", emoji: "" });
export const blankCard = (): Card => ({ title: DEFAULT_TITLE, by: "", common: "", cells: Array.from({ length: CELL_COUNT }, emptyCell) });
export const cloneCard = (c: Card): Card => ({ ...c, cells: c.cells.map((x) => ({ ...x })) });

const cell = (name: string, from: string, line: string, emoji: string): Cell => ({ name, from, line, emoji });

export const EXAMPLES: { id: string; label: string; card: Card }[] = [
  {
    id: "anime",
    label: "Anime",
    card: {
      title: "4 Anime Characters I Like", by: "", common: "They all hide how much they care.",
      cells: [
        cell("Satoru Gojo", "Jujutsu Kaisen", "Annoying, unbeatable, secretly a great teacher", "🌙"),
        cell("Levi Ackerman", "Attack on Titan", "Cleans obsessively, fights like a storm", "🗡️"),
        cell("Anya Forger", "Spy x Family", "Reads minds, still fails every test", "🥜"),
        cell("Nami", "One Piece", "The only adult on that ship", "🍊"),
      ],
    },
  },
  {
    id: "games",
    label: "Video games",
    card: {
      title: "4 Game Characters I Like", by: "", common: "Tired heroes who keep going anyway.",
      cells: [
        cell("Geralt of Rivia", "The Witcher 3", "Says “hmm” and means ten things", "🐺"),
        cell("Aloy", "Horizon Zero Dawn", "Curious first, brave second", "🏹"),
        cell("Kratos", "God of War", "Learning to be a dad, one axe at a time", "🪓"),
        cell("Isabelle", "Animal Crossing", "Unreasonably positive about my town", "🐶"),
      ],
    },
  },
  {
    id: "screen",
    label: "Movies & TV",
    card: {
      title: "4 Characters I Like (Movies & TV)", by: "", common: "Weird on purpose.",
      cells: [
        cell("Wednesday Addams", "Wednesday", "Zero smiles, full commitment", "🖤"),
        cell("Shrek", "Shrek", "Layers. Like an onion.", "🧅"),
        cell("Loki", "Loki", "Chaos with character development", "🃏"),
        cell("Paddington", "Paddington", "Politest bear in London", "🧸"),
      ],
    },
  },
  {
    id: "books",
    label: "Books",
    card: {
      title: "4 Book Characters I Like", by: "", common: "Smartest person in the room, never the loudest.",
      cells: [
        cell("Hermione Granger", "Harry Potter", "Read the whole book before class", "📚"),
        cell("Sherlock Holmes", "Sherlock Holmes stories", "Notices everything, explains nothing", "🔎"),
        cell("Bilbo Baggins", "The Hobbit", "Just wanted second breakfast", "🍄"),
        cell("Katniss Everdeen", "The Hunger Games", "Volunteered and never looked back", "🏹"),
      ],
    },
  },
];

const CONTROL = /[\u0000-\u001f\u007f]/g;
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.replace(CONTROL, " ").trim().slice(0, n) : "");
const cleanId = (v: unknown) => (typeof v === "string" && /^\d{1,9}$/.test(v) ? v : undefined);

export function normalize(c: Partial<Card>): Card {
  const cells = Array.isArray(c.cells) ? c.cells.slice(0, CELL_COUNT) : [];
  while (cells.length < CELL_COUNT) cells.push(emptyCell());
  return {
    title: clip(c.title, LIMITS.title),
    by: clip(c.by, LIMITS.by),
    common: clip(c.common, LIMITS.common),
    cells: cells.map((x) => {
      const o: Cell = { name: clip(x?.name, LIMITS.name), from: clip(x?.from, LIMITS.from), line: clip(x?.line, LIMITS.line), emoji: clip(x?.emoji, LIMITS.emoji) };
      const id = cleanId(x?.id);
      if (id) o.id = id;
      return o;
    }),
  };
}

export const filledCount = (c: Card) => c.cells.filter((x) => x.name || x.image).length;

function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(b, (ch) => ch.charCodeAt(0));
}

export function encodeCard(c: Card): string {
  const n = normalize(c);
  const data = [1, n.title, n.by, n.common, n.cells.map((x) => [x.name, x.from, x.line, x.emoji, x.id ?? ""])];
  return toB64Url(new TextEncoder().encode(JSON.stringify(data)));
}

export function decodeCard(code: string): Card | null {
  try {
    if (!code || code.length > 4000) return null;
    const d = JSON.parse(new TextDecoder().decode(fromB64Url(code)));
    if (!Array.isArray(d) || d[0] !== 1 || !Array.isArray(d[4])) return null;
    const card = normalize({
      title: d[1], by: d[2], common: d[3],
      cells: d[4].filter(Array.isArray).map((x: unknown[]) => ({ name: x[0] as string, from: x[1] as string, line: x[2] as string, emoji: x[3] as string, id: (x[4] as string) || undefined })),
    });
    return card.cells.some((x) => x.name) ? card : null;
  } catch {
    return null;
  }
}

export function cardFromHash(hash: string): Card | null {
  const v = new URLSearchParams(hash.replace(/^#/, "")).get("c");
  return v ? decodeCard(v) : null;
}

/** Stable colors for a generated portrait card. */
const PALETTES = [
  ["#ff6b9a", "#7b4dff"], ["#00c2ff", "#2b5cff"], ["#ffb347", "#ff5e62"], ["#38ef7d", "#11998e"],
  ["#f7797d", "#c471ed"], ["#fbd786", "#f7797d"], ["#4facfe", "#00f2fe"], ["#a18cd1", "#fbc2eb"],
];
export function paletteFor(seed: string, index: number): [string, string] {
  let h = index * 7;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const p = PALETTES[h % PALETTES.length];
  return [p[0], p[1]];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Original portrait card (no character art): gradient, sparkles, emoji or initials. 300×400. */
export function portraitSvg(c: Cell, index: number): string {
  const [a, b] = paletteFor(c.name || String(index), index);
  const mark = c.emoji || initials(c.name);
  const big = c.emoji ? 150 : 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">`
    + `<defs><linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`
    + `<rect width="300" height="400" fill="url(#g${index})"/>`
    + `<circle cx="150" cy="185" r="105" fill="#ffffff" fill-opacity="0.18"/>`
    + `<path d="M40 60l6 14 14 6-14 6-6 14-6-14-14-6 14-6z M250 300l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="#ffffff" fill-opacity="0.55"/>`
    + `<text x="150" y="${c.emoji ? 238 : 228}" text-anchor="middle" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Helvetica Neue',Arial,sans-serif" font-weight="800" font-size="${big}" fill="#ffffff">${esc(mark)}</text>`
    + `<text x="150" y="365" text-anchor="middle" font-family="'Helvetica Neue',Arial,sans-serif" font-weight="800" font-size="22" letter-spacing="4" fill="#ffffff" fill-opacity="0.75">#${index + 1}</text>`
    + `</svg>`;
}
