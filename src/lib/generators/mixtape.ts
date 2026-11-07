// Mixtape for you: a cassette-style playlist card for a friend.
// The whole mixtape lives in the share link (#m=…, never sent to a server). Pure functions only.

export interface Track { title: string; artist: string; url?: string }
export interface Mixtape { style: string; title: string; to: string; from: string; note: string; tracks: Track[] }
export interface TapeStyle { id: string; label: string; shell: string; label2: string; ink: string; accent: string; window: string; stripe: string }

export const MAX_TRACKS = 12;
export const MIN_SUGGESTED = 6;
export const LIMITS = { title: 40, to: 24, from: 24, note: 200, song: 60, artist: 40, url: 200 } as const;

export const STYLES: TapeStyle[] = [
  { id: "classic", label: "Classic black", shell: "#1d1d22", label2: "#f3ead7", ink: "#1d1d22", accent: "#e8452c", window: "#2c2c33", stripe: "#e8452c" },
  { id: "sunset", label: "Sunset", shell: "#f08a3c", label2: "#fff4e3", ink: "#3b1d0b", accent: "#d6336c", window: "#c9672a", stripe: "#ffc94a" },
  { id: "clear", label: "Clear blue", shell: "#7fb8e6", label2: "#f7fbff", ink: "#12324d", accent: "#2f6fd6", window: "#5d9bd0", stripe: "#2f6fd6" },
  { id: "bubblegum", label: "Bubblegum", shell: "#f5a8c8", label2: "#fff7fb", ink: "#5a1838", accent: "#b8327a", window: "#e087ad", stripe: "#9b7bf0" },
  { id: "cream", label: "Retro cream", shell: "#e9dcc0", label2: "#fffaf0", ink: "#3d3326", accent: "#2e7d5b", window: "#cbbd9f", stripe: "#c0572b" },
  { id: "midnight", label: "Midnight", shell: "#22265c", label2: "#e9ecff", ink: "#161a45", accent: "#ffcc33", window: "#353a7a", stripe: "#ffcc33" },
];
export const styleById = (id: string) => STYLES.find((s) => s.id === id) ?? STYLES[0];

const t = (title: string, artist: string): Track => ({ title, artist });

export const EXAMPLES: { id: string; label: string; mix: Mixtape }[] = [
  {
    id: "roadtrip",
    label: "Road trip",
    mix: {
      style: "sunset", title: "Windows Down", to: "Sam", from: "Alex", note: "For the drive to the coast. Skip nothing.",
      tracks: [t("Mr. Brightside", "The Killers"), t("Go Your Own Way", "Fleetwood Mac"), t("Electric Feel", "MGMT"), t("Life Is a Highway", "Tom Cochrane"), t("Dancing in the Moonlight", "King Harvest"), t("Midnight City", "M83"), t("Take Me Home, Country Roads", "John Denver"), t("Riptide", "Vance Joy")],
    },
  },
  {
    id: "birthday",
    label: "Best friend's birthday",
    mix: {
      style: "bubblegum", title: "Happy Birthday, You", to: "Maya", from: "Jo", note: "Every song here reminds me of a day with you. Happy birthday!",
      tracks: [t("Good as Hell", "Lizzo"), t("Dancing Queen", "ABBA"), t("Shake It Off", "Taylor Swift"), t("Levitating", "Dua Lipa"), t("September", "Earth, Wind & Fire"), t("Walking on Sunshine", "Katrina and the Waves"), t("Count on Me", "Bruno Mars")],
    },
  },
  {
    id: "love",
    label: "Long-distance love",
    mix: {
      style: "midnight", title: "Same Moon", to: "Lena", from: "Theo", note: "Play this when you miss me. 4,312 km is nothing.",
      tracks: [t("Yellow", "Coldplay"), t("Lover", "Taylor Swift"), t("Make You Feel My Love", "Adele"), t("Here Comes the Sun", "The Beatles"), t("Video Games", "Lana Del Rey"), t("Sweet Disposition", "The Temper Trap"), t("Until I Found You", "Stephen Sanchez"), t("At Last", "Etta James")],
    },
  },
  {
    id: "study",
    label: "Study focus",
    mix: {
      style: "cream", title: "Deep Work", to: "Priya", from: "Ken", note: "Finals week survival kit. You've got this.",
      tracks: [t("Clair de Lune", "Claude Debussy"), t("Intro", "The xx"), t("Experience", "Ludovico Einaudi"), t("Holocene", "Bon Iver"), t("Weightless", "Marconi Union"), t("Nuvole Bianche", "Ludovico Einaudi")],
    },
  },
];

export const blankMix = (): Mixtape => ({ style: "classic", title: "", to: "", from: "", note: "", tracks: Array.from({ length: MIN_SUGGESTED }, () => t("", "")) });
export const cloneMix = (m: Mixtape): Mixtape => ({ ...m, tracks: m.tracks.map((x) => ({ ...x })) });

const MUSIC_HOSTS = /^(open\.spotify\.com|spotify\.link|(www\.|m\.|music\.)?youtube\.com|youtu\.be|music\.apple\.com|(www\.|m\.)?soundcloud\.com|on\.soundcloud\.com|(www\.)?deezer\.com|(listen\.)?tidal\.com|[a-z0-9-]+\.bandcamp\.com)$/i;

/** Only https links to known music services are kept (the share link cannot point people anywhere else). */
export function safeMusicUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "https:" || !MUSIC_HOSTS.test(u.hostname) || u.username || u.password) return undefined;
    const s = u.toString();
    return s.length <= LIMITS.url ? s : undefined;
  } catch {
    return undefined;
  }
}

const clip = (s: unknown, n: number) => (typeof s === "string" ? s.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, n) : "");

/** Trim, cap and drop empty tracks — what actually gets shared and drawn. */
export function normalize(m: Partial<Mixtape>): Mixtape {
  const tracks = (Array.isArray(m.tracks) ? m.tracks : [])
    .map((x) => ({ title: clip(x?.title, LIMITS.song), artist: clip(x?.artist, LIMITS.artist), url: safeMusicUrl(typeof x?.url === "string" ? x.url : undefined) }))
    .filter((x) => x.title || x.artist)
    .slice(0, MAX_TRACKS)
    .map((x) => (x.url ? x : { title: x.title, artist: x.artist }));
  return {
    style: styleById(typeof m.style === "string" ? m.style : "").id,
    title: clip(m.title, LIMITS.title),
    to: clip(m.to, LIMITS.to),
    from: clip(m.from, LIMITS.from),
    note: clip(m.note, LIMITS.note),
    tracks,
  };
}

// ---- share link: compact JSON array → UTF-8 → base64url ----
function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}

export function encodeMix(m: Mixtape): string {
  const n = normalize(m);
  const data = [1, n.style, n.title, n.to, n.from, n.note, n.tracks.map((x) => (x.url ? [x.title, x.artist, x.url] : [x.title, x.artist]))];
  return toB64Url(new TextEncoder().encode(JSON.stringify(data)));
}

export function decodeMix(code: string): Mixtape | null {
  try {
    if (!code || code.length > 6000) return null;
    const d = JSON.parse(new TextDecoder().decode(fromB64Url(code)));
    if (!Array.isArray(d) || d[0] !== 1 || !Array.isArray(d[6])) return null;
    const mix = normalize({
      style: d[1], title: d[2], to: d[3], from: d[4], note: d[5],
      tracks: d[6].filter(Array.isArray).map((x: unknown[]) => ({ title: x[0] as string, artist: x[1] as string, url: x[2] as string | undefined })),
    });
    return mix.tracks.length ? mix : null;
  } catch {
    return null;
  }
}

/** Read #m=… (or ?m=… as a fallback) from a location hash/search. */
export function mixFromLocation(hash: string, search = ""): Mixtape | null {
  const h = new URLSearchParams(hash.replace(/^#/, "")).get("m");
  const q = new URLSearchParams(search.replace(/^\?/, "")).get("m");
  return decodeMix(h ?? q ?? "");
}

/** Side A gets the first half (rounded up), Side B the rest. */
export function sides(tracks: Track[]): [Track[], Track[]] {
  const a = Math.ceil(tracks.length / 2);
  return [tracks.slice(0, a), tracks.slice(a)];
}

export const searchLinks = (x: Track) => {
  const q = encodeURIComponent(`${x.title} ${x.artist}`.trim());
  return { youtube: `https://www.youtube.com/results?search_query=${q}`, spotify: `https://open.spotify.com/search/${q}` };
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** The cassette as an SVG string (viewBox 0 0 600 380). Used for the on-page preview and drawn into the PNG. */
export function cassetteSvg(m: Mixtape, opts: { spin?: boolean } = {}): string {
  const s = styleById(m.style);
  const title = esc(cut(m.title || "A mixtape for you", 28));
  const sub = esc(cut([m.to && `for ${m.to}`, m.from && `from ${m.from}`].filter(Boolean).join(" · ") || "made with love", 40));
  const font = "ui-rounded, 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif";
  const reel = (cx: number) => {
    const teeth = [0, 60, 120, 180, 240, 300]
      .map((a) => `<rect x="${cx - 3}" y="${222 - 22}" width="6" height="10" rx="2" fill="${s.window}" transform="rotate(${a} ${cx} 222)"/>`)
      .join("");
    return `<g${opts.spin ? ` class="mt-reel" style="transform-origin:${cx}px 222px"` : ""}><circle cx="${cx}" cy="222" r="34" fill="#f7f3ea"/><circle cx="${cx}" cy="222" r="24" fill="#d9d2c3"/>${teeth}<circle cx="${cx}" cy="222" r="9" fill="${s.window}"/></g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" role="img" aria-label="${title} cassette">
<rect x="6" y="6" width="588" height="368" rx="30" fill="${s.shell}"/>
<rect x="6" y="6" width="588" height="368" rx="30" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="4"/>
<circle cx="34" cy="34" r="7" fill="#000" fill-opacity=".2"/><circle cx="566" cy="34" r="7" fill="#000" fill-opacity=".2"/>
<circle cx="34" cy="346" r="7" fill="#000" fill-opacity=".2"/><circle cx="566" cy="346" r="7" fill="#000" fill-opacity=".2"/>
<rect x="52" y="40" width="496" height="244" rx="16" fill="${s.label2}"/>
<rect x="52" y="40" width="496" height="16" fill="${s.stripe}"/><rect x="52" y="60" width="496" height="6" fill="${s.accent}"/>
<text x="300" y="112" text-anchor="middle" font-family="${font}" font-size="38" font-weight="800" fill="${s.ink}">${title}</text>
<text x="300" y="146" text-anchor="middle" font-family="${font}" font-size="20" fill="${s.ink}" fill-opacity=".75">${sub}</text>
<rect x="150" y="178" width="300" height="88" rx="44" fill="${s.window}"/>
<rect x="232" y="196" width="136" height="52" rx="8" fill="#000" fill-opacity=".35"/>
${reel(196)}${reel(404)}
<text x="76" y="268" font-family="${font}" font-size="22" font-weight="800" fill="${s.accent}">A</text>
<text x="510" y="268" font-family="${font}" font-size="16" font-weight="700" fill="${s.ink}" fill-opacity=".6">${m.tracks.length || 0} songs</text>
<path d="M150 374 L178 306 H422 L450 374 Z" fill="#000" fill-opacity=".18"/>
<circle cx="230" cy="344" r="9" fill="#000" fill-opacity=".3"/><circle cx="370" cy="344" r="9" fill="#000" fill-opacity=".3"/>
</svg>`;
}
