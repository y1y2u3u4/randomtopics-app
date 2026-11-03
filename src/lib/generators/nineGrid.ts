// "My 9" grid maker: search adapters for album, song, game, show, artist, anime,
// manga and character covers, the share-link format and the PNG layout. Covers
// are hotlinked from the source (Deezer, iTunes, Wikipedia, TVmaze, AniList) and only
// drawn in the visitor's browser.

export type GridKind = "albums" | "songs" | "artists" | "games" | "movies" | "shows" | "anime" | "manga" | "characters" | "books" | "any";

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
  albums: { noun: "album", defaultTitle: "My 9 Albums", placeholder: "Search an album or artist…", aspect: 1, toolType: "my_9_albums", source: { label: "Deezer and iTunes", href: "https://www.deezer.com/" } },
  games: { noun: "game", defaultTitle: "My 9 Games", placeholder: "Search a video game…", aspect: 4 / 3, toolType: "my_9_games", source: { label: "Wikipedia", href: "https://en.wikipedia.org/" } },
  movies: { noun: "movie", defaultTitle: "My 9 Movies", placeholder: "Search a movie…", aspect: 4 / 3, toolType: "my_9_movies", source: { label: "Wikipedia", href: "https://en.wikipedia.org/" } },
  anime: { noun: "anime", defaultTitle: "My 9 Anime", placeholder: "Search an anime…", aspect: 4 / 3, toolType: "my_9_anime", source: { label: "AniList", href: "https://anilist.co/" } },
  books: { noun: "book", defaultTitle: "My 9 Books", placeholder: "Search a book or author…", aspect: 4 / 3, toolType: "my_9_books", source: { label: "Wikipedia", href: "https://en.wikipedia.org/" } },
  songs: { noun: "song", defaultTitle: "My 9 Songs", placeholder: "Search a song or artist…", aspect: 1, toolType: "my_9_songs", source: { label: "iTunes", href: "https://music.apple.com/" } },
  artists: { noun: "artist", defaultTitle: "My 9 Artists", placeholder: "Search a singer, band or rapper…", aspect: 1, toolType: "my_9_artists", source: { label: "Wikipedia", href: "https://en.wikipedia.org/" } },
  shows: { noun: "show", defaultTitle: "My 9 Shows", placeholder: "Search a TV show or series…", aspect: 4 / 3, toolType: "my_9_shows", source: { label: "TVmaze", href: "https://www.tvmaze.com/" } },
  manga: { noun: "manga", defaultTitle: "My 9 Manga", placeholder: "Search a manga or manhwa…", aspect: 4 / 3, toolType: "my_9_manga", source: { label: "AniList", href: "https://anilist.co/" } },
  characters: { noun: "character", defaultTitle: "My 9 Characters", placeholder: "Search an anime, manga or game character…", aspect: 4 / 3, toolType: "my_9_characters", source: { label: "AniList", href: "https://anilist.co/" } },
  any: { noun: "picture", defaultTitle: "My 9", placeholder: "", aspect: 1, toolType: "my_9_grid" },
};

type Fetch = typeof fetch;

interface ItunesAlbum { collectionId: number; collectionName: string; artistName: string; artworkUrl100?: string; wrapperType?: string; collectionType?: string }
interface ItunesSong { trackId: number; trackName: string; artistName: string; artworkUrl100?: string; wrapperType?: string; kind?: string }
interface WikiPage { pageid: number; title: string; index?: number; description?: string; thumbnail?: { source: string } }
// AniList format codes that read badly as-is; anime codes (TV, MOVIE, OVA) stay.
const ANILIST_FORMAT: Record<string, string> = { MANGA: "Manga", ONE_SHOT: "One-shot", NOVEL: "Light novel", TV_SHORT: "TV short", MUSIC: "Music video" };
interface AniMedia { id: number; title: { english: string | null; romaji: string | null }; coverImage: { extraLarge?: string | null; large?: string | null }; startDate?: { year: number | null }; format?: string | null }
interface TvmazeShow { id: number; name: string; premiered?: string | null; network?: { name?: string } | null; webChannel?: { name?: string } | null; image?: { medium?: string; original?: string } | null }
interface AniCharacter { id: number; name: { full: string | null }; image: { large?: string | null; medium?: string | null }; media?: { nodes: { title: { english: string | null; romaji: string | null } }[] } }

export interface DeezerAlbum { id: number; title: string; artist?: { name?: string }; cover_xl?: string; cover_big?: string; cover_medium?: string; record_type?: string }

/** Deezer album JSON → grid items. Ids carry a "d" prefix so older iTunes share links still resolve. */
export function fromDeezer(albums: DeezerAlbum[]): GridItem[] {
  return albums
    .filter((a) => a && a.id && (a.cover_xl || a.cover_big) && a.record_type !== "single")
    .map((a) => ({
      id: `d${a.id}`,
      // "Physical Graffiti (Remaster)" → "Physical Graffiti"
      title: a.title.replace(/\s*[([][^)\]]*(remaster|deluxe|edition|anniversary|expanded|version|mix)[^)\]]*[)\]]\s*$/i, "") || a.title,
      subtitle: a.artist?.name,
      image: (a.cover_xl || a.cover_big) as string,
      thumb: a.cover_medium || undefined,
    }));
}

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

function fromItunesSongs(results: ItunesSong[]): GridItem[] {
  return results
    .filter((r) => r.trackId && r.artworkUrl100 && (r.wrapperType ?? "track") === "track" && (r.kind ?? "song") === "song")
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName.replace(/\s*[([](feat\.|with |remaster)[^)\]]*[)\]]\s*$/i, "") || r.trackName,
      subtitle: r.artistName,
      image: itunesArt(r.artworkUrl100 as string, 600),
      thumb: itunesArt(r.artworkUrl100 as string, 200),
    }));
}

function fromTvmaze(shows: TvmazeShow[]): GridItem[] {
  return shows
    .filter((s) => s && s.id && s.image?.original)
    .map((s) => ({
      id: String(s.id),
      title: s.name,
      subtitle: [s.premiered?.slice(0, 4), s.network?.name ?? s.webChannel?.name].filter(Boolean).join(" · ") || undefined,
      image: s.image!.original as string,
      thumb: s.image!.medium,
    }));
}

function fromWiki(pages: Record<string, WikiPage> | undefined): GridItem[] {
  return Object.values(pages ?? {})
    .filter((p) => p.thumbnail?.source)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    // Drop disambiguators such as "(2006 film)", "(novel)" or "(video game)".
    .map((p) => ({ id: String(p.pageid), title: p.title.replace(/ \([^)]*\)$/, ""), subtitle: p.description, image: p.thumbnail!.source }));
}

function fromAniList(media: AniMedia[]): GridItem[] {
  return media
    .filter((m) => m.coverImage.extraLarge || m.coverImage.large)
    .map((m) => ({
      id: String(m.id),
      title: m.title.english || m.title.romaji || "Untitled",
      subtitle: [m.startDate?.year, m.format && (ANILIST_FORMAT[m.format] ?? m.format.replace(/_/g, " "))].filter(Boolean).join(" · ") || undefined,
      image: (m.coverImage.extraLarge || m.coverImage.large) as string,
      thumb: m.coverImage.large ?? undefined,
    }));
}

function fromAniCharacters(chars: AniCharacter[]): GridItem[] {
  return chars
    .filter((c) => c.image.large && !/\/default\.jpg$/.test(c.image.large))
    .map((c) => {
      const t = c.media?.nodes?.[0]?.title;
      return { id: String(c.id), title: c.name.full || "Unknown", subtitle: (t && (t.english || t.romaji)) || undefined, image: c.image.large as string, thumb: c.image.medium ?? undefined };
    });
}

const WIKI_API = "https://en.wikipedia.org/w/api.php";
/** Wikipedia infobox that marks an article as the right kind of work. */
const WIKI_INFOBOX: Partial<Record<GridKind, string>> = { games: "Infobox video game", movies: "Infobox film", books: "Infobox book", artists: "Infobox musical artist" };
const ANILIST_TYPE: Partial<Record<GridKind, "ANIME" | "MANGA">> = { anime: "ANIME", manga: "MANGA" };
const wikiParams = (extra: Record<string, string>) =>
  new URLSearchParams({ action: "query", format: "json", origin: "*", prop: "pageimages|description", piprop: "thumbnail", pithumbsize: "480", pilicense: "any", ...extra });

const ANILIST_FIELDS = "id title { english romaji } coverImage { extraLarge large } startDate { year } format";
const ANILIST_CHARACTER_FIELDS = "id name { full } image { large medium } media(perPage: 1, sort: POPULARITY_DESC) { nodes { title { english romaji } } }";

async function anilistPage(query: string, variables: Record<string, unknown>, f: Fetch) {
  const res = await f("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`AniList ${res.status}`);
  const json = await res.json();
  return json?.data?.Page ?? {};
}
const anilist = async (query: string, variables: Record<string, unknown>, f: Fetch): Promise<AniMedia[]> => (await anilistPage(query, variables, f)).media ?? [];
const anilistCharacters = async (query: string, variables: Record<string, unknown>, f: Fetch): Promise<AniCharacter[]> => (await anilistPage(query, variables, f)).characters ?? [];

export async function searchItems(kind: GridKind, q: string, f: Fetch = fetch): Promise<GridItem[]> {
  const term = q.trim();
  if (term.length < 2 || kind === "any") return [];
  if (kind === "albums") {
    // Deezer's catalog search is far better than iTunes' for classic albums, but its API
    // has no CORS, so it goes through our cached JSON route; iTunes is the fallback.
    try {
      const res = await f(`/api/my9/albums?${new URLSearchParams({ q: term })}`);
      if (res.ok) {
        const items: GridItem[] = (await res.json()).items ?? [];
        if (items.length) return items;
      }
    } catch { /* fall back to iTunes */ }
    const res = await f(`https://itunes.apple.com/search?${new URLSearchParams({ term, entity: "album", media: "music", limit: "24" })}`);
    if (!res.ok) throw new Error(`iTunes ${res.status}`);
    return fromItunes((await res.json()).results ?? []);
  }
  if (kind === "songs") {
    const res = await f(`https://itunes.apple.com/search?${new URLSearchParams({ term, entity: "song", media: "music", limit: "24" })}`);
    if (!res.ok) throw new Error(`iTunes ${res.status}`);
    return fromItunesSongs((await res.json()).results ?? []);
  }
  if (kind === "shows") {
    // Wikipedia has no poster for many big series (non-free title cards), so TV uses TVmaze.
    const res = await f(`https://api.tvmaze.com/search/shows?${new URLSearchParams({ q: term })}`);
    if (!res.ok) throw new Error(`TVmaze ${res.status}`);
    return fromTvmaze(((await res.json()) as { show: TvmazeShow }[]).map((r) => r.show));
  }
  if (kind === "characters") {
    return fromAniCharacters(await anilistCharacters(
      `query ($q: String) { Page(perPage: 24) { characters(search: $q, sort: [SEARCH_MATCH, FAVOURITES_DESC]) { ${ANILIST_CHARACTER_FIELDS} } } }`,
      { q: term }, f,
    ));
  }
  const infobox = WIKI_INFOBOX[kind];
  if (infobox) {
    const res = await f(`${WIKI_API}?${wikiParams({ generator: "search", gsrsearch: `${term} hastemplate:"${infobox}"`, gsrlimit: "24" })}`);
    if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
    return fromWiki((await res.json())?.query?.pages);
  }
  return fromAniList(await anilist(
    `query ($q: String, $type: MediaType) { Page(perPage: 24) { media(search: $q, type: $type, sort: SEARCH_MATCH, isAdult: false) { ${ANILIST_FIELDS} } } }`,
    { q: term, type: ANILIST_TYPE[kind] ?? "ANIME" }, f,
  ));
}

/** Re-fetch the items of a shared grid by source id, keeping slot order. */
export async function lookupItems(kind: GridKind, ids: string[], f: Fetch = fetch): Promise<Map<string, GridItem>> {
  const wanted = [...new Set(ids.filter(Boolean))];
  const out = new Map<string, GridItem>();
  if (!wanted.length || kind === "any") return out;
  let items: GridItem[];
  if (kind === "albums") {
    const deezer = wanted.filter((id) => id.startsWith("d"));
    const itunes = wanted.filter((id) => !id.startsWith("d"));
    const [a, b] = await Promise.all([
      deezer.length ? f(`/api/my9/albums?${new URLSearchParams({ ids: deezer.join(",") })}`).then((r) => (r.ok ? r.json() : { items: [] })).then((j) => (j.items ?? []) as GridItem[]).catch(() => []) : [],
      itunes.length ? f(`https://itunes.apple.com/lookup?${new URLSearchParams({ id: itunes.join(","), entity: "album" })}`).then((r) => (r.ok ? r.json() : { results: [] })).then((j) => fromItunes(j.results ?? [])).catch(() => []) : [],
    ]);
    items = [...a, ...b];
  } else if (kind === "songs") {
    const res = await f(`https://itunes.apple.com/lookup?${new URLSearchParams({ id: wanted.join(","), entity: "song" })}`);
    items = res.ok ? fromItunesSongs((await res.json()).results ?? []) : [];
  } else if (kind === "shows") {
    // TVmaze has no batch lookup; nine small cached requests.
    const shows = await Promise.all(wanted.map((id) => f(`https://api.tvmaze.com/shows/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)));
    items = fromTvmaze(shows.filter(Boolean));
  } else if (kind === "characters") {
    items = fromAniCharacters(await anilistCharacters(
      `query ($ids: [Int]) { Page(perPage: 9) { characters(id_in: $ids) { ${ANILIST_CHARACTER_FIELDS} } } }`,
      { ids: wanted.map(Number) }, f,
    ));
  } else if (WIKI_INFOBOX[kind]) {
    const res = await f(`${WIKI_API}?${wikiParams({ pageids: wanted.join("|") })}`);
    items = res.ok ? fromWiki((await res.json())?.query?.pages) : [];
  } else {
    items = fromAniList(await anilist(
      `query ($ids: [Int], $type: MediaType) { Page(perPage: 9) { media(id_in: $ids, type: $type) { ${ANILIST_FIELDS} } } }`,
      { ids: wanted.map(Number), type: ANILIST_TYPE[kind] ?? "ANIME" }, f,
    ));
  }
  for (const item of items) if (item.id) out.set(item.id, item);
  return out;
}

const ID_RE = /^d?\d{1,12}$/;

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

/** PNG layout: 1080×1080 (or 1080×1920 for stories), title band, 3×3 tiles centred, optional captions. */
export function gridLayout(aspect: number, captions: boolean, hasSubtitle: boolean, height = 1080): GridLayout {
  const width = 1080, pad = 36, gap = 12;
  const titleBand = hasSubtitle ? 150 : 120;
  const caption = captions ? 54 : 0;
  const fitH = Math.floor((height - titleBand - pad - gap * 2 - caption * 3) / 3);
  const fitW = Math.floor((width - pad * 2 - gap * 2) / 3);
  const tileH = Math.min(fitH, Math.floor(fitW * aspect));
  const tileW = Math.floor(tileH / aspect);
  // Tall canvases centre the title + grid block vertically.
  const block = titleBand + tileH * 3 + caption * 3 + gap * 2 + pad;
  const header = titleBand + Math.max(0, Math.floor((height - block) / 2));
  const left = Math.round((width - (tileW * 3 + gap * 2)) / 2);
  const tiles = Array.from({ length: SLOT_COUNT }, (_, i) => ({
    x: left + (i % 3) * (tileW + gap),
    y: header + Math.floor(i / 3) * (tileH + caption + gap),
  }));
  return { width, height, header, tileW, tileH, gap, pad, caption, tiles };
}

/** Source rectangle that crops an image to fill a w×h box (CSS object-fit: cover). */
export function coverCrop(iw: number, ih: number, w: number, h: number): { sx: number; sy: number; sw: number; sh: number } {
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale, sh = h / scale;
  return { sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh };
}
