// "My 9" grid maker: search adapters for album, game and anime covers, the
// share-link format and the PNG layout. Covers are hotlinked from the source
// (iTunes, Wikipedia, AniList) and only drawn in the visitor's browser.

export type GridKind = "albums" | "games" | "anime" | "any";

export interface GridItem {
  /** Source id, used in share links. Uploaded images have no id. */
  id?: string;
  title: string;
  subtitle?: string;
  image: string;
  /** Smaller image for the search results, when the source has one. */
  thumb?: string;
}

export type Slots = (GridItem | null)[];

export const SLOT_COUNT = 9;

export interface KindConfig {
  noun: string;
  defaultTitle: string;
  placeholder: string;
  /** Tile height / width. Album art is square; game and anime covers are portrait. */
  aspect: number;
  toolType: string;
  source?: { label: string; href: string };
}

export const KINDS: Record<GridKind, KindConfig> = {
  albums: { noun: "album", defaultTitle: "My 9 Albums", placeholder: "Search an album or artist…", aspect: 1, toolType: "my_9_albums", source: { label: "Apple Music / iTunes", href: "https://www.apple.com/itunes/" } },
  games: { noun: "game", defaultTitle: "My 9 Games", placeholder: "Search a video game…", aspect: 4 / 3, toolType: "my_9_games", source: { label: "Wikipedia", href: "https://en.wikipedia.org/" } },
  anime: { noun: "anime", defaultTitle: "My 9 Anime", placeholder: "Search an anime…", aspect: 4 / 3, toolType: "my_9_anime", source: { label: "AniList", href: "https://anilist.co/" } },
  any: { noun: "picture", defaultTitle: "My 9", placeholder: "", aspect: 1, toolType: "my_9_grid" },
};

type Fetch = typeof fetch;

interface ItunesAlbum { collectionId: number; collectionName: string; artistName: string; artworkUrl100?: string; wrapperType?: string; collectionType?: string }
interface WikiPage { pageid: number; title: string; index?: number; description?: string; thumbnail?: { source: string } }
interface AniMedia { id: number; title: { english: string | null; romaji: string | null }; coverImage: { extraLarge?: string | null; large?: string | null }; startDate?: { year: number | null }; format?: string | null }

const itunesArt = (url: string, size: number) => url.replace(/\/\d+x\d+bb\./, `/${size}x${size}bb.`);

function fromItunes(results: ItunesAlbum[]): GridItem[] {
  return results
    // Singles are listed as albums named "Song - Single"; keep albums and EPs.
    .filter((r) => r.collectionId && r.artworkUrl100 && (r.wrapperType ?? "collection") === "collection" && !/ - Single$/.test(r.collectionName))
    .map((r) => ({
      id: String(r.collectionId),
      title: r.collectionName.replace(/ - EP$/, " (EP)"),
      subtitle: r.artistName,
      image: itunesArt(r.artworkUrl100 as string, 600),
      thumb: itunesArt(r.artworkUrl100 as string, 200),
    }));
}

function fromWiki(pages: Record<string, WikiPage> | undefined): GridItem[] {
  return Object.values(pages ?? {})
    .filter((p) => p.thumbnail?.source)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((p) => ({ id: String(p.pageid), title: p.title.replace(/ \((\d{4} )?video game\)$/, ""), subtitle: p.description, image: p.thumbnail!.source }));
}

function fromAniList(media: AniMedia[]): GridItem[] {
  return media
    .filter((m) => m.coverImage.extraLarge || m.coverImage.large)
    .map((m) => ({
      id: String(m.id),
      title: m.title.english || m.title.romaji || "Untitled",
      subtitle: [m.startDate?.year, m.format?.replace(/_/g, " ")].filter(Boolean).join(" · ") || undefined,
      image: (m.coverImage.extraLarge || m.coverImage.large) as string,
      thumb: m.coverImage.large ?? undefined,
    }));
}

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const wikiParams = (extra: Record<string, string>) =>
  new URLSearchParams({ action: "query", format: "json", origin: "*", prop: "pageimages|description", piprop: "thumbnail", pithumbsize: "480", pilicense: "any", ...extra });

const ANILIST_FIELDS = "id title { english romaji } coverImage { extraLarge large } startDate { year } format";

async function anilist(query: string, variables: Record<string, unknown>, f: Fetch): Promise<AniMedia[]> {
  const res = await f("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList ${res.status}`);
  const json = await res.json();
  return json?.data?.Page?.media ?? [];
}

export async function searchItems(kind: GridKind, q: string, f: Fetch = fetch): Promise<GridItem[]> {
  const term = q.trim();
  if (term.length < 2 || kind === "any") return [];
  if (kind === "albums") {
    const res = await f(`https://itunes.apple.com/search?${new URLSearchParams({ term, entity: "album", media: "music", limit: "24" })}`);
    if (!res.ok) throw new Error(`iTunes ${res.status}`);
    return fromItunes((await res.json()).results ?? []);
  }
  if (kind === "games") {
    const res = await f(`${WIKI_API}?${wikiParams({ generator: "search", gsrsearch: `${term} hastemplate:"Infobox video game"`, gsrlimit: "24" })}`);
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    return fromWiki((await res.json())?.query?.pages);
  }
  return fromAniList(await anilist(
    `query ($q: String) { Page(perPage: 24) { media(search: $q, type: ANIME, sort: SEARCH_MATCH, isAdult: false) { ${ANILIST_FIELDS} } } }`,
    { q: term }, f,
  ));
}

/** Re-fetch the items of a shared grid by source id, keeping slot order. */
export async function lookupItems(kind: GridKind, ids: string[], f: Fetch = fetch): Promise<Map<string, GridItem>> {
  const wanted = [...new Set(ids.filter(Boolean))];
  const out = new Map<string, GridItem>();
  if (!wanted.length || kind === "any") return out;
  let items: GridItem[];
  if (kind === "albums") {
    const res = await f(`https://itunes.apple.com/lookup?${new URLSearchParams({ id: wanted.join(","), entity: "album" })}`);
    items = res.ok ? fromItunes((await res.json()).results ?? []) : [];
  } else if (kind === "games") {
    const res = await f(`${WIKI_API}?${wikiParams({ pageids: wanted.join("|") })}`);
    items = res.ok ? fromWiki((await res.json())?.query?.pages) : [];
  } else {
    items = fromAniList(await anilist(
      `query ($ids: [Int]) { Page(perPage: 9) { media(id_in: $ids, type: ANIME) { ${ANILIST_FIELDS} } } }`,
      { ids: wanted.map(Number) }, f,
    ));
  }
  for (const item of items) if (item.id) out.set(item.id, item);
  return out;
}

const ID_RE = /^\d{1,12}$/;

/** Share link: ?i=id.id._.id (9 positions, "_" = empty or uploaded) &t=title */
export function encodeShare(slots: Slots, title: string, defaultTitle: string): string {
  const params = new URLSearchParams();
  const ids = slots.map((s) => (s?.id && ID_RE.test(s.id) ? s.id : "_"));
  if (ids.some((id) => id !== "_")) params.set("i", ids.join(".").replace(/(\._)+$/, ""));
  if (title.trim() && title.trim() !== defaultTitle) params.set("t", title.trim().slice(0, 60));
  return params.toString();
}

export function decodeShare(search: string): { ids: string[]; title?: string } {
  const params = new URLSearchParams(search);
  const ids = (params.get("i") ?? "").split(".").slice(0, SLOT_COUNT).map((id) => (ID_RE.test(id) ? id : ""));
  while (ids.length < SLOT_COUNT) ids.push("");
  const title = params.get("t")?.slice(0, 60) || undefined;
  return { ids, title };
}

export function placeItem(slots: Slots, item: GridItem, target: number | null): { slots: Slots; index: number } | null {
  const index = target !== null && target >= 0 && target < SLOT_COUNT ? target : slots.findIndex((s) => !s);
  if (index < 0) return null;
  const next = slots.slice();
  next[index] = item;
  return { slots: next, index };
}

export function swapSlots(slots: Slots, a: number, b: number): Slots {
  const next = slots.slice();
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

export interface GridLayout {
  width: number;
  height: number;
  header: number;
  tileW: number;
  tileH: number;
  gap: number;
  pad: number;
  caption: number;
  tiles: { x: number; y: number }[];
}

/** PNG layout: 1080 px wide, title band on top, 3×3 tiles, optional captions. */
export function gridLayout(aspect: number, captions: boolean, hasSubtitle: boolean): GridLayout {
  const width = 1080, pad = 36, gap = 12;
  const tileW = Math.floor((width - pad * 2 - gap * 2) / 3);
  const tileH = Math.round(tileW * aspect);
  const header = hasSubtitle ? 150 : 120;
  const caption = captions ? 54 : 0;
  const tiles = Array.from({ length: SLOT_COUNT }, (_, i) => ({
    x: pad + (i % 3) * (tileW + gap),
    y: header + Math.floor(i / 3) * (tileH + caption + gap),
  }));
  const height = header + 3 * (tileH + caption) + 2 * gap + pad;
  return { width, height, header, tileW, tileH, gap, pad, caption, tiles };
}

/** Source rectangle that crops an image to fill a w×h box (CSS object-fit: cover). */
export function coverCrop(iw: number, ih: number, w: number, h: number): { sx: number; sy: number; sw: number; sh: number } {
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale, sh = h / scale;
  return { sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh };
}
