// Autofill for the citation generators: DOI → Crossref, ISBN → Open Library,
// URL → our /api/cite/url route (page citation_* / Open Graph / JSON-LD tags).
// Crossref and Open Library are called straight from the browser (CORS).
import { cleanText, parsePerson, type Person, type Source, type SourceType } from "./format";

export type InputKind = "doi" | "isbn" | "url" | "unknown";

const DOI_RE = /\b(10\.\d{4,9}\/[^\s"<>]+)/i;

export function detectInput(raw: string): { kind: InputKind; value: string } {
  const s = raw.trim();
  const doi = DOI_RE.exec(s.replace(/^https?:\/\/(dx\.)?doi\.org\//i, ""));
  if (doi && (/doi\.org\//i.test(s) || /^doi:/i.test(s) || s.startsWith("10."))) return { kind: "doi", value: doi[1].replace(/[.,;]$/, "") };
  const digits = s.replace(/^isbn(-1[03])?:?\s*/i, "").replace(/[\s-]/g, "");
  if (/^(97[89]\d{10}|\d{9}[\dX])$/i.test(digits) && isbnValid(digits)) return { kind: "isbn", value: digits.toUpperCase() };
  if (/^https?:\/\/[^\s]+\.[^\s]+/i.test(s)) {
    const inUrl = DOI_RE.exec(s);
    if (inUrl && /doi\.org|\/doi\//i.test(s)) return { kind: "doi", value: inUrl[1].replace(/[.,;]$/, "") };
    return { kind: "url", value: s };
  }
  if (doi) return { kind: "doi", value: doi[1] };
  return { kind: "unknown", value: s };
}

export function isbnValid(isbn: string): boolean {
  if (isbn.length === 13) {
    const sum = [...isbn].reduce((acc, d, i) => acc + Number(d) * (i % 2 ? 3 : 1), 0);
    return sum % 10 === 0;
  }
  if (isbn.length === 10) {
    const sum = [...isbn].reduce((acc, d, i) => acc + (d.toUpperCase() === "X" ? 10 : Number(d)) * (10 - i), 0);
    return sum % 11 === 0;
  }
  return false;
}

/* ------------------------------ Crossref ------------------------------ */

interface CrossrefPerson { given?: string; family?: string; name?: string }
export interface CrossrefWork {
  type?: string;
  title?: string[];
  subtitle?: string[];
  "container-title"?: string[];
  "short-container-title"?: string[];
  author?: CrossrefPerson[];
  editor?: CrossrefPerson[];
  volume?: string;
  issue?: string;
  page?: string;
  "article-number"?: string;
  issued?: { "date-parts"?: (number | null)[][] };
  publisher?: string;
  "publisher-location"?: string;
  edition?: string;
  "edition-number"?: string;
  DOI?: string;
  URL?: string;
}

const people = (list?: CrossrefPerson[]): Person[] =>
  (list ?? []).map((p) => (p.family ? { given: cleanText(p.given), family: cleanText(p.family) } : p.name ? { given: "", family: cleanText(p.name), org: true } : null)).filter(Boolean) as Person[];

const CHAPTER_TYPES = new Set(["book-chapter", "book-section", "book-part", "reference-entry"]);
const BOOK_TYPES = new Set(["book", "monograph", "edited-book", "reference-book"]);

export function fromCrossref(w: CrossrefWork): Source {
  const type: SourceType = CHAPTER_TYPES.has(w.type ?? "") ? "chapter" : BOOK_TYPES.has(w.type ?? "") ? "book" : w.type === "posted-content" ? "web" : "journal";
  const [year, month, day] = w.issued?.["date-parts"]?.[0] ?? [];
  const title = [cleanText(w.title?.[0]), cleanText(w.subtitle?.[0])].filter(Boolean).join(": ");
  const short = cleanText(w["short-container-title"]?.[0]);
  return {
    type,
    authors: people(w.author),
    editors: people(w.editor),
    title,
    container: cleanText(w["container-title"]?.[0]),
    // Only keep an abbreviation (a CASSI-style short title has periods).
    containerShort: short.includes(".") ? short : undefined,
    volume: cleanText(w.volume) || undefined,
    issue: cleanText(w.issue) || undefined,
    pages: cleanText(w.page) || cleanText(w["article-number"]) || undefined,
    year: year ? String(year) : undefined,
    month: type === "web" && month ? month : undefined,
    day: type === "web" && day ? day : undefined,
    publisher: cleanText(w.publisher) || undefined,
    place: cleanText(w["publisher-location"]) || undefined,
    edition: cleanText(w["edition-number"] ?? w.edition) || undefined,
    doi: cleanText(w.DOI) || undefined,
  };
}

/* ---------------------------- Open Library ---------------------------- */

export interface OpenLibraryBook {
  title?: string;
  subtitle?: string;
  authors?: { name?: string }[];
  publishers?: { name?: string }[];
  publish_places?: { name?: string }[];
  publish_date?: string;
}

export function fromOpenLibrary(b: OpenLibraryBook): Source {
  return {
    type: "book",
    authors: (b.authors ?? []).map((a) => parsePerson(a.name ?? "")).filter(Boolean) as Person[],
    title: [cleanText(b.title), cleanText(b.subtitle)].filter(Boolean).join(": "),
    publisher: cleanText(b.publishers?.[0]?.name) || undefined,
    place: cleanText(b.publish_places?.[0]?.name) || undefined,
    year: /\b(1[5-9]|20)\d{2}\b/.exec(b.publish_date ?? "")?.[0],
  };
}

/* ------------------------------ web pages ------------------------------ */

export interface PageMeta {
  title?: string;
  authors?: string[];
  site?: string;
  date?: string;
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  firstPage?: string;
  lastPage?: string;
}

const attr = (tag: string, name: string) => new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(tag)?.slice(2).find((v) => v !== undefined);

/** Read citation_*, Dublin Core, Open Graph and JSON-LD metadata from a page's HTML. */
export function parsePageMeta(html: string, pageUrl: string): PageMeta {
  const meta = new Map<string, string[]>();
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = (attr(m[0], "name") ?? attr(m[0], "property") ?? "").toLowerCase();
    const content = attr(m[0], "content");
    if (key && content) meta.set(key, [...(meta.get(key) ?? []), cleanText(content)]);
  }
  const first = (...keys: string[]) => keys.map((k) => meta.get(k)?.[0]).find(Boolean);
  const out: PageMeta = { url: pageUrl };
  out.title = first("citation_title", "dc.title", "og:title", "twitter:title");
  out.authors = meta.get("citation_author") ?? meta.get("dc.creator") ?? meta.get("author") ?? meta.get("article:author")?.filter((a) => !/^https?:/.test(a));
  out.site = first("og:site_name", "citation_journal_title", "application-name");
  out.date = first("citation_publication_date", "citation_date", "citation_online_date", "article:published_time", "dc.date", "date", "pubdate");
  out.doi = first("citation_doi", "dc.identifier")?.replace(/^doi:/i, "");
  if (out.doi && !/^10\./.test(out.doi)) out.doi = undefined;
  out.journal = first("citation_journal_title");
  out.volume = first("citation_volume");
  out.issue = first("citation_issue");
  out.firstPage = first("citation_firstpage");
  out.lastPage = first("citation_lastpage");
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const json = JSON.parse(m[1]);
      const nodes = (Array.isArray(json) ? json : json["@graph"] ?? [json]) as Record<string, unknown>[];
      for (const n of nodes) {
        if (!n || typeof n !== "object" || !/Article|BlogPosting|Report|WebPage|ScholarlyArticle/i.test(String(n["@type"] ?? ""))) continue;
        out.title ??= cleanText(String(n.headline ?? n.name ?? "")) || undefined;
        out.date ??= typeof n.datePublished === "string" ? n.datePublished : undefined;
        if (!out.authors?.length && n.author) {
          const list = (Array.isArray(n.author) ? n.author : [n.author]) as ({ name?: string } | string)[];
          out.authors = list.map((a) => cleanText(typeof a === "string" ? a : a?.name ?? "")).filter(Boolean);
        }
        const pub = n.publisher as { name?: string } | undefined;
        out.site ??= pub?.name ? cleanText(pub.name) : undefined;
      }
    } catch { /* ignore malformed JSON-LD */ }
  }
  out.title ??= cleanText(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]) || undefined;
  if (out.title && out.site) out.title = out.title.replace(new RegExp(`\\s*[|–—-]\\s*${out.site.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i"), "");
  return out;
}

export function fromPageMeta(m: PageMeta, today: string): Source {
  const d = /^(\d{4})(?:[-/](\d{1,2})(?:[-/](\d{1,2}))?)?/.exec(m.date ?? "");
  const journal = m.journal && (m.volume || m.firstPage);
  return {
    type: journal ? "journal" : "web",
    authors: (m.authors ?? []).flatMap((a) => a.split(/\s*;\s*|\s+and\s+/)).map(parsePerson).filter(Boolean).slice(0, 25) as Person[],
    title: cleanText(m.title),
    container: journal ? m.journal : m.site,
    volume: m.volume,
    issue: m.issue,
    pages: m.firstPage ? [m.firstPage, m.lastPage].filter(Boolean).join("–") : undefined,
    year: d?.[1],
    month: d?.[2] ? Number(d[2]) : undefined,
    day: d?.[3] ? Number(d[3]) : undefined,
    doi: m.doi,
    url: m.url,
    accessed: today,
  };
}

/* ------------------------------ fetchers ------------------------------ */

type Fetch = typeof fetch;

export async function lookupDoi(doi: string, f: Fetch = fetch): Promise<Source> {
  const res = await f(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(res.status === 404 ? "No record for that DOI." : `Crossref ${res.status}`);
  return fromCrossref((await res.json()).message as CrossrefWork);
}

export async function lookupIsbn(isbn: string, f: Fetch = fetch): Promise<Source> {
  const key = `ISBN:${isbn}`;
  const res = await f(`https://openlibrary.org/api/books?${new URLSearchParams({ bibkeys: key, format: "json", jscmd: "data" })}`);
  if (!res.ok) throw new Error(`Open Library ${res.status}`);
  const book = (await res.json())[key] as OpenLibraryBook | undefined;
  if (!book) throw new Error("No book found for that ISBN.");
  return fromOpenLibrary(book);
}

export async function lookupUrl(url: string, today: string, f: Fetch = fetch): Promise<Source> {
  const res = await f(`/api/cite/url?${new URLSearchParams({ url })}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? "Could not read that page.");
  const meta = json.meta as PageMeta;
  // Scholarly pages often expose their DOI; Crossref has the cleanest record.
  if (meta.doi) {
    try { return { ...(await lookupDoi(meta.doi, f)), url: meta.url }; } catch { /* fall back to page tags */ }
  }
  return fromPageMeta(meta, today);
}
