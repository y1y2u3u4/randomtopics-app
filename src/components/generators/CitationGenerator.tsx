"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  MONTHS, apaReferenceList, formatCitation, plainText, sentenceCase, sortForStyle, toHtml,
  type Person, type Segment, type Source, type SourceType, type StyleId,
} from "@/lib/citations/format";
import { detectInput, lookupDoi, lookupIsbn, lookupUrl } from "@/lib/citations/lookup";

export type CitationFamily = "apa" | "asa" | "acs" | "chicago";

const TYPES: { id: SourceType; label: string }[] = [
  { id: "journal", label: "Journal article" },
  { id: "book", label: "Book" },
  { id: "chapter", label: "Book chapter" },
  { id: "web", label: "Website" },
];

const today = () => new Date().toISOString().slice(0, 10);
const blank = (type: SourceType = "journal"): Source => ({ type, authors: [{ given: "", family: "" }], title: "", accessed: today() });

interface Saved { id: string; style: StyleId; source: Source }

function Rich({ segs }: { segs: Segment[] }) {
  return <span dangerouslySetInnerHTML={{ __html: toHtml(segs) }} />;
}

async function copyRich(segs: Segment[][], heading?: string): Promise<boolean> {
  const head = heading ? `<p style="text-align:center;font-weight:bold;margin:0 0 0.5em">${heading}</p>` : "";
  const html = head + segs.map((s) => `<p style="margin:0 0 0.5em 0.5in;text-indent:-0.5in">${toHtml(s)}</p>`).join("");
  const text = (heading ? `${heading}\n\n` : "") + segs.map(plainText).join("\n\n");
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([text], { type: "text/plain" }) })]);
      return true;
    }
  } catch { /* fall back to plain text */ }
  return copyText(text);
}

export default function CitationGenerator({ family }: { family: CitationFamily }) {
  const [chicagoMode, setChicagoMode] = useState<"chicago-nb" | "chicago-ad">("chicago-nb");
  const style: StyleId = family === "chicago" ? chicagoMode : family;
  const storageKey = `rt_citations_${family}`;
  const [src, setSrc] = useState<Source>(() => blank());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "ok" | "error"; text: string }>({ kind: "idle", text: "" });
  const [page, setPage] = useState("");
  const [headline, setHeadline] = useState(family !== "acs");
  const [bulk, setBulk] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const apa = family === "apa";
  /** APA titles are sentence case; convert once and let the writer fix proper nouns in the field. */
  const apaTitles = (x: Source): Source => (apa ? { ...x, title: sentenceCase(x.title), container: x.type === "chapter" && x.container ? sentenceCase(x.container) : x.container } : x);
  const [list, setList] = useState<Saved[]>([]);
  const [flash, setFlash] = useState("");

  // The reference list lives only in this browser.
  useEffect(() => {
    const restore = () => {
      try { const raw = localStorage.getItem(storageKey); if (raw) setList(JSON.parse(raw)); } catch { /* storage blocked */ }
    };
    void Promise.resolve().then(restore);
  }, [storageKey]);
  const saveList = (next: Saved[]) => {
    setList(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage blocked */ }
  };

  const set = <K extends keyof Source>(key: K, value: Source[K]) => setSrc((s) => ({ ...s, [key]: value }));
  const setPerson = (key: "authors" | "editors", i: number, part: keyof Person, value: string | boolean) =>
    setSrc((s) => {
      const people = [...(s[key] ?? [])];
      people[i] = { ...people[i], [part]: value };
      return { ...s, [key]: people };
    });
  const addPerson = (key: "authors" | "editors") => setSrc((s) => ({ ...s, [key]: [...(s[key] ?? []), { given: "", family: "" }] }));
  const removePerson = (key: "authors" | "editors", i: number) => setSrc((s) => ({ ...s, [key]: (s[key] ?? []).filter((_, j) => j !== i) }));

  const cleaned: Source = useMemo(() => ({
    ...src,
    authors: src.authors.filter((a) => a.family.trim()),
    editors: (src.editors ?? []).filter((a) => a.family.trim()),
  }), [src]);
  const ready = Boolean(cleaned.title.trim());
  const number = list.length + 1;
  const out = useMemo(() => formatCitation(style, cleaned, { page, headline, number }), [cleaned, headline, number, page, style]);

  const flashMsg = (t: string) => { setFlash(t); window.setTimeout(() => setFlash((f) => (f === t ? "" : f)), 1800); };

  const autofill = async () => {
    const input = detectInput(query);
    if (input.kind === "unknown") { setStatus({ kind: "error", text: "Paste a DOI (10.xxxx/…), an ISBN or a full web address." }); return; }
    setStatus({ kind: "loading", text: input.kind === "doi" ? "Looking up the DOI on Crossref…" : input.kind === "isbn" ? "Looking up the ISBN on Open Library…" : "Reading the page…" });
    try {
      const found = input.kind === "doi" ? await lookupDoi(input.value) : input.kind === "isbn" ? await lookupIsbn(input.value) : await lookupUrl(input.value, today());
      setSrc(apaTitles({ ...blank(found.type), ...found, authors: found.authors.length ? found.authors : [{ given: "", family: "" }], accessed: found.accessed ?? today() }));
      setStatus({ kind: "ok", text: apa
        ? "Filled in, with titles in APA sentence case — capitalize names of people, places and organizations, then check every field."
        : "Filled in — check every field against the source before you copy." });
      track("generate_success", { tool_type: `citation_${family}`, generator_mode: input.kind, locale: "en" });
    } catch (e) {
      setStatus({ kind: "error", text: e instanceof Error && e.message ? e.message : "Lookup failed — fill in the fields by hand." });
    }
  };

  const copy = async (segs: Segment[][], key: string) => {
    if (await copyRich(segs)) { flashMsg(key); track("copy_result", { tool_type: `citation_${family}`, locale: "en" }); }
  };

  const addToList = () => {
    if (!ready) return;
    saveList([...list, { id: `${Date.now()}`, style, source: cleaned }]);
    flashMsg("added");
  };

  // Reference page: look up many DOIs, ISBNs and URLs at once and add them all.
  const addMany = async () => {
    const lines = bulk.split(/\n+/).map((l) => l.trim()).filter(Boolean).slice(0, 50);
    if (!lines.length) return;
    const added: Saved[] = [];
    const failed: number[] = [];
    for (const [n, line] of lines.entries()) {
      setBulkStatus(`Looking up ${n + 1} of ${lines.length}…`);
      const input = detectInput(line);
      try {
        if (input.kind === "unknown") throw new Error("unknown");
        const found = input.kind === "doi" ? await lookupDoi(input.value) : input.kind === "isbn" ? await lookupIsbn(input.value) : await lookupUrl(input.value, today());
        added.push({ id: `${Date.now()}-${n}`, style, source: apaTitles({ ...found, accessed: found.accessed ?? today() }) });
      } catch { failed.push(n + 1); }
    }
    if (added.length) saveList([...list, ...added]);
    setBulkStatus(`Added ${added.length} of ${lines.length}${failed.length ? ` — could not read line ${failed.join(", ")}; add those by hand above` : ""}. Check each entry, especially capitalization.`);
    if (!failed.length) setBulk("");
    track("generate_success", { tool_type: `citation_${family}`, generator_mode: "bulk", locale: "en" });
  };

  const ordered = sortForStyle(style, list);
  const suffixes = apa ? new Map(apaReferenceList(list).map((x) => [x.item.id, x.suffix])) : new Map<string, string>();
  const refs = ordered.map((item, i) => formatCitation(style, item.source, { headline, number: i + 1, suffix: suffixes.get(item.id) }).reference);
  const listHeading = style === "chicago-nb" ? "Bibliography" : "References";
  const numbered = (segs: Segment[], i: number): Segment[] => (style === "acs" ? [{ t: `(${i + 1}) ` }, ...segs] : segs);

  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const downloadTxt = () => {
    const text = `${listHeading}\n\n${refs.map((r, i) => plainText(numbered(r, i))).join("\n\n")}\n`;
    download(new Blob([text], { type: "text/plain;charset=utf-8" }), `${family}-references.txt`);
    track("download_result", { tool_type: `citation_${family}`, format: "txt", locale: "en" });
  };
  // A reference page Word and Google Docs open as-is: Times New Roman 12 pt,
  // double-spaced, 0.5" hanging indent, bold centered heading (APA 2.12, 9.43).
  const downloadDoc = () => {
    const body = refs.map((r) => `<p style="margin:0 0 0 0.5in;text-indent:-0.5in;line-height:200%">${toHtml(r)}</p>`).join("");
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${listHeading}</title></head><body style="font-family:'Times New Roman',serif;font-size:12pt"><p style="text-align:center;font-weight:bold;line-height:200%;margin:0">${listHeading}</p>${body}</body></html>`;
    download(new Blob(["\ufeff", html], { type: "application/msword" }), `${family}-reference-page.doc`);
    track("download_result", { tool_type: `citation_${family}`, format: "doc", locale: "en" });
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const chip = (active: boolean) => `text-sm px-3 py-1.5 rounded-lg border transition-all ${active ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"}`;
  const ghost = "px-3 py-1.5 rounded-lg text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors disabled:opacity-40";
  const containerLabel = src.type === "journal" ? "Journal" : src.type === "web" ? "Website name" : src.type === "chapter" ? "Book title" : "";
  const input = (key: keyof Source, text: string, placeholder = "", type = "text") => (
    <label className="block"><span className={label}>{text}</span>
      <input type={type} value={(src[key] as string | number | undefined) ?? ""} placeholder={placeholder}
        onChange={(e) => set(key, (type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value) as never)} className={field} />
    </label>
  );

  const people = (key: "authors" | "editors", title: string) => (
    <div>
      <span className={label}>{title}</span>
      <ul className="space-y-2">
        {(src[key] ?? []).map((p, i) => (
          <li key={i} className="flex gap-2 items-center">
            {!p.org && <input value={p.given} placeholder="First / given names" aria-label={`${title} ${i + 1} first name`} onChange={(e) => setPerson(key, i, "given", e.target.value)} className={`${field} flex-1`} />}
            <input value={p.family} placeholder={p.org ? "Organization name" : "Last / family name"} aria-label={`${title} ${i + 1} last name`} onChange={(e) => setPerson(key, i, "family", e.target.value)} className={`${field} flex-1`} />
            <label className="text-xs text-[var(--text-muted)] flex items-center gap-1 shrink-0" title="The author is an organization"><input type="checkbox" checked={Boolean(p.org)} onChange={(e) => setPerson(key, i, "org", e.target.checked)} /> Org</label>
            <button type="button" onClick={() => removePerson(key, i)} aria-label={`Remove ${title.toLowerCase()} ${i + 1}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1">×</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => addPerson(key)} className="text-xs text-[var(--neon-cyan)] mt-2 hover:underline">+ Add {key === "authors" ? "author" : "editor"}</button>
    </div>
  );

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <label htmlFor="cite-autofill" className={label}>Autofill from a DOI, ISBN or web address</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input id="cite-autofill" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void autofill(); }}
            placeholder="10.1086/666082 · 978-0-553-44743-9 · https://…" className={`${field} sm:flex-1 text-base`} autoComplete="off" />
          <button type="button" onClick={autofill} className="btn-generate" disabled={status.kind === "loading"}>{status.kind === "loading" ? "Looking up…" : "Cite"}</button>
        </div>
        <p className={`text-xs mt-2 min-h-4 ${status.kind === "error" ? "text-[var(--neon-pink)]" : "text-[var(--text-muted)]"}`} aria-live="polite">{status.text || "Or pick a source type and type the details yourself."}</p>

        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Source type">
          {TYPES.map((t) => <button key={t.id} type="button" aria-pressed={src.type === t.id} className={chip(src.type === t.id)} onClick={() => set("type", t.id)}>{t.label}</button>)}
          {family === "chicago" && (
            <span className="flex gap-2 sm:ml-auto" role="group" aria-label="Chicago system">
              <button type="button" aria-pressed={chicagoMode === "chicago-nb"} className={chip(chicagoMode === "chicago-nb")} onClick={() => setChicagoMode("chicago-nb")}>Notes &amp; bibliography</button>
              <button type="button" aria-pressed={chicagoMode === "chicago-ad"} className={chip(chicagoMode === "chicago-ad")} onClick={() => setChicagoMode("chicago-ad")}>Author-date</button>
            </span>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-5">
          <div className="space-y-4">
            {people("authors", src.type === "web" ? "Authors (or the organization)" : "Authors")}
            {input("title", src.type === "chapter" ? "Chapter title" : src.type === "web" ? "Page title" : src.type === "book" ? "Book title" : "Article title")}
            {apa && (
              <p className="text-xs text-[var(--text-muted)] -mt-2">
                APA uses sentence case for titles.{" "}
                <button type="button" className="text-[var(--neon-cyan)] hover:underline" onClick={() => setSrc((x) => apaTitles(x))}>Convert to sentence case</button>
                {" "}— then capitalize proper nouns.
              </p>
            )}
            {containerLabel && input("container", containerLabel)}
            {family === "acs" && src.type === "journal" && input("containerShort", "Abbreviated journal title (CASSI)", "e.g. J. Am. Chem. Soc.")}
            {src.type === "chapter" && people("editors", "Editors")}
            <div className="grid grid-cols-3 gap-3">
              {input("year", "Year", "2024")}
              {src.type === "journal" && input("volume", "Volume")}
              {src.type === "journal" && input("issue", "Issue")}
              {src.type === "web" && (
                <label className="block"><span className={label}>Month</span>
                  <select value={src.month ?? ""} onChange={(e) => set("month", e.target.value ? Number(e.target.value) : undefined)} className={field}>
                    <option value="">—</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </label>
              )}
              {src.type === "web" && input("day", "Day", "", "number")}
              {(src.type === "book" || src.type === "chapter") && input("edition", "Edition", "2")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(src.type === "journal" || src.type === "chapter") && input("pages", "Pages", "88–133")}
              {(src.type === "book" || src.type === "chapter") && input("publisher", "Publisher")}
              {(src.type === "book" || src.type === "chapter") && family !== "chicago" && !apa && input("place", "Place (city)", family === "asa" ? "Chicago, IL" : "New York")}
              {input("doi", "DOI", "10.xxxx/…")}
              {(src.type === "web" || !src.doi) && input("url", "URL", "https://…")}
              {src.type === "web" && !apa && input("accessed", "Accessed", "", "date")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4" aria-live="polite">
              <p className={label}>{style === "chicago-nb" ? "Bibliography entry" : "Reference list entry"}</p>
              <p className="text-[var(--text-primary)] leading-relaxed pl-8 -indent-8 break-words" data-citation-reference>
                {ready ? <Rich segs={out.reference} /> : <span className="text-[var(--text-muted)]">Your citation appears here as you type.</span>}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" className={ghost} disabled={!ready} onClick={() => copy([out.reference], "ref")}>{flash === "ref" ? "Copied ✓" : "Copy"}</button>
                <button type="button" className={ghost} disabled={!ready} onClick={addToList}>{flash === "added" ? "Added ✓" : "Add to reference list"}</button>
                <button type="button" className={ghost} onClick={() => { setSrc(blank(src.type)); setQuery(""); setStatus({ kind: "idle", text: "" }); }}>New citation</button>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                {family !== "acs" && <label className="flex items-center gap-2">Page cited <input value={page} onChange={(e) => setPage(e.target.value)} placeholder="95" className={`${field} w-20`} /></label>}
                {family !== "acs" && <label className="flex items-center gap-2"><input type="checkbox" checked={headline} onChange={(e) => setHeadline(e.target.checked)} /> {apa ? "Title case for journal and website names" : "Headline-style capitalization"}</label>}
              </div>
              {out.inText.map((t) => (
                <div key={t.label}>
                  <p className={label}>{t.label}</p>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-[var(--text-primary)] break-words">{ready ? <Rich segs={t.value} /> : "—"}</p>
                    <button type="button" className={ghost} disabled={!ready} onClick={() => copy([t.value], t.label)}>{flash === t.label ? "✓" : "Copy"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {apa && (
          <div className="mt-8 pt-6 border-t border-white/10" data-citation-bulk>
            <label htmlFor="cite-bulk" className={label}>Build a whole reference page: paste several DOIs, ISBNs or URLs, one per line</label>
            <textarea id="cite-bulk" value={bulk} onChange={(e) => setBulk(e.target.value)} rows={4} className={`${field} font-mono`}
              placeholder={"10.1086/666082\n978-0-553-44743-9\nhttps://www.un.org/en/climatechange/what-is-climate-change"} />
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button type="button" className="btn-generate" onClick={() => void addMany()} disabled={!bulk.trim() || bulkStatus.startsWith("Looking")}>Add all to my reference page</button>
              <p className="text-xs text-[var(--text-muted)]" aria-live="polite">{bulkStatus || "Up to 50 sources at a time. They are sorted into APA order automatically."}</p>
            </div>
          </div>
        )}

        {list.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{listHeading} <span className="text-sm text-[var(--text-muted)]">({list.length}, {style === "acs" ? "in citation order" : apa ? "APA 7 order" : "alphabetical"})</span></h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={ghost} onClick={() => apa ? void copyRich(refs, listHeading).then((ok) => ok && flashMsg("all")) : copy(refs.map(numbered), "all")}>{flash === "all" ? "Copied ✓" : "Copy all (keeps italics for Word / Docs)"}</button>
                {apa && <button type="button" className={ghost} onClick={downloadDoc}>Download reference page (.doc)</button>}
                <button type="button" className={ghost} onClick={downloadTxt}>Download .txt</button>
                <button type="button" className={ghost} onClick={() => saveList([])}>Clear list</button>
              </div>
            </div>
            {apa && <p className="text-center font-bold text-[var(--text-primary)] mb-2">References</p>}
            <ol className={apa ? "space-y-3 leading-loose" : "space-y-2"}>
              {ordered.map((item, i) => (
                <li key={item.id} className="flex gap-3 items-start text-[var(--text-secondary)]">
                  <p className="flex-1 pl-8 -indent-8 break-words"><Rich segs={numbered(refs[i], i)} /></p>
                  <button type="button" onClick={() => saveList(list.filter((x) => x.id !== item.id))} aria-label="Remove from list" className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">×</button>
                </li>
              ))}
            </ol>
            <p className="text-xs text-[var(--text-muted)] mt-3">Saved only in this browser. Nothing you cite is sent to us except a web address you ask us to read.</p>
          </div>
        )}
      </div>
    </section>
  );
}
