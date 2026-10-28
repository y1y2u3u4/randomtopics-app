"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  formatVancouver, knownAbbrev, marker, moveItem, numberedHtml, numberedText,
  type MarkerStyle, type VPerson, type VSource, type VType,
} from "@/lib/citations/vancouver";
import { lookupVancouver } from "@/lib/citations/vancouverLookup";

const TYPES: { id: VType; label: string }[] = [
  { id: "journal", label: "Journal article" },
  { id: "book", label: "Book" },
  { id: "chapter", label: "Book chapter" },
  { id: "web", label: "Webpage" },
  { id: "report", label: "Report" },
  { id: "thesis", label: "Thesis" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const STORAGE_KEY = "rt_citations_vancouver";
const today = () => new Date().toISOString().slice(0, 10);
const blank = (type: VType = "journal"): VSource => ({ type, authors: [{ given: "", family: "" }], title: "", accessed: today() });

interface Saved { id: string; source: VSource }

/** The form edits `given`; PubMed-style initials ("WF") are folded into it. */
const forForm = (s: VSource): VSource => ({
  ...blank(s.type), ...s,
  authors: (s.authors.length ? s.authors : [{ given: "", family: "" }]).map((p) => ({ ...p, given: p.initials ?? p.given, initials: undefined })),
  editors: s.editors?.map((p) => ({ ...p, given: p.initials ?? p.given, initials: undefined })),
  accessed: s.accessed ?? today(),
});

async function copyRich(refs: string[]): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({
        "text/html": new Blob([numberedHtml(refs)], { type: "text/html" }),
        "text/plain": new Blob([numberedText(refs)], { type: "text/plain" }),
      })]);
      return true;
    }
  } catch { /* fall back to plain text */ }
  return copyText(numberedText(refs));
}

export default function VancouverGenerator() {
  const [src, setSrc] = useState<VSource>(() => blank());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "ok" | "error"; text: string }>({ kind: "idle", text: "" });
  const [list, setList] = useState<Saved[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [mark, setMark] = useState<MarkerStyle>("brackets");
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        if (Array.isArray(parsed)) setList(parsed.filter((x) => x && typeof x.id === "string" && x.source && typeof x.source.title === "string"));
      } catch { /* storage blocked or corrupt */ }
    };
    void Promise.resolve().then(restore);
  }, []);
  const saveList = (next: Saved[]) => {
    setList(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
  };

  const set = <K extends keyof VSource>(key: K, value: VSource[K]) => setSrc((s) => ({ ...s, [key]: value }));
  const setPerson = (key: "authors" | "editors", i: number, part: keyof VPerson, value: string | boolean) =>
    setSrc((s) => {
      const people = [...(s[key] ?? [])];
      people[i] = { ...people[i], [part]: value };
      return { ...s, [key]: people };
    });
  const addPerson = (key: "authors" | "editors") => setSrc((s) => ({ ...s, [key]: [...(s[key] ?? []), { given: "", family: "" }] }));
  const removePerson = (key: "authors" | "editors", i: number) => setSrc((s) => ({ ...s, [key]: (s[key] ?? []).filter((_, j) => j !== i) }));

  const cleaned: VSource = useMemo(() => ({
    ...src,
    authors: src.authors.filter((a) => a.family.trim()),
    editors: (src.editors ?? []).filter((a) => a.family.trim()),
  }), [src]);
  const ready = Boolean(cleaned.title.trim());
  const reference = useMemo(() => (ready ? formatVancouver(cleaned) : ""), [cleaned, ready]);
  const guessed = src.type === "journal" && !src.abbrev?.trim() ? knownAbbrev(src.container) : undefined;
  const missingAbbrev = src.type === "journal" && Boolean(src.container?.trim()) && !src.abbrev?.trim() && !guessed;

  const flashMsg = (t: string) => { setFlash(t); window.setTimeout(() => setFlash((f) => (f === t ? "" : f)), 1800); };

  const autofill = async () => {
    setStatus({ kind: "loading", text: "Looking it up…" });
    try {
      const found = await lookupVancouver(query, today());
      setSrc(forForm(found));
      const ab = found.type === "journal" ? (found.abbrev ? ` Journal abbreviation: ${found.abbrev}.` : " No journal abbreviation found — check the NLM Catalog.") : "";
      setStatus({ kind: "ok", text: `Filled in.${ab} Check every field against the source before you copy.` });
      track("generate_success", { tool_type: "citation_vancouver", generator_mode: "autofill", locale: "en" });
    } catch (e) {
      setStatus({ kind: "error", text: e instanceof Error && e.message ? e.message : "Lookup failed — fill in the fields by hand." });
    }
  };

  const addToList = () => {
    if (!ready) return;
    if (editing) {
      saveList(list.map((x) => (x.id === editing ? { ...x, source: cleaned } : x)));
      setEditing(null);
      flashMsg("added");
    } else {
      saveList([...list, { id: `${Date.now()}`, source: cleaned }]);
      flashMsg("added");
    }
    setSrc(blank(src.type)); setQuery(""); setStatus({ kind: "idle", text: "" });
  };

  const refs = list.map((x) => formatVancouver(x.source));
  const copyOne = async (text: string, key: string) => { if (await copyText(text)) { flashMsg(key); track("copy_result", { tool_type: "citation_vancouver", locale: "en" }); } };
  const copyAll = async (rich: boolean) => {
    const ok = rich ? await copyRich(refs) : await copyText(numberedText(refs));
    if (ok) { flashMsg(rich ? "all-rich" : "all"); track("copy_result", { tool_type: "citation_vancouver", locale: "en" }); }
  };
  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const downloadTxt = () => {
    download(new Blob([`References\n\n${numberedText(refs)}\n`], { type: "text/plain;charset=utf-8" }), "vancouver-references.txt");
    track("download_result", { tool_type: "citation_vancouver", format: "txt", locale: "en" });
  };
  const downloadDoc = () => {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>References</title></head><body style="font-family:'Times New Roman',serif;font-size:12pt"><p><b>References</b></p>${numberedHtml(refs)}</body></html>`;
    download(new Blob(["﻿", html], { type: "application/msword" }), "vancouver-references.doc");
    track("download_result", { tool_type: "citation_vancouver", format: "doc", locale: "en" });
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const chip = (active: boolean) => `text-sm px-3 py-1.5 rounded-lg border transition-all ${active ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"}`;
  const ghost = "px-3 py-1.5 rounded-lg text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors disabled:opacity-40";
  const tiny = "px-2 py-1 rounded-md text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 disabled:opacity-30";
  const t = src.type;
  const titleLabel = t === "chapter" ? "Chapter title" : t === "web" ? "Page title" : t === "book" ? "Book title" : t === "report" ? "Report title" : t === "thesis" ? "Thesis title" : "Article title";
  const text = (key: keyof VSource, name: string, placeholder = "", type = "text") => (
    <label className="block"><span className={label}>{name}</span>
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
            {!p.org && <input value={p.given} placeholder="First names or initials" aria-label={`${title} ${i + 1} first name`} onChange={(e) => setPerson(key, i, "given", e.target.value)} className={`${field} flex-1`} />}
            <input value={p.family} placeholder={p.org ? "Organization name" : "Surname"} aria-label={`${title} ${i + 1} surname`} onChange={(e) => setPerson(key, i, "family", e.target.value)} className={`${field} flex-1`} />
            <label className="text-xs text-[var(--text-muted)] flex items-center gap-1 shrink-0" title="The author is an organization"><input type="checkbox" checked={Boolean(p.org)} onChange={(e) => setPerson(key, i, "org", e.target.checked)} /> Org</label>
            <button type="button" onClick={() => removePerson(key, i)} aria-label={`Remove ${title.toLowerCase()} ${i + 1}`} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] px-1">×</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => addPerson(key)} className="text-xs text-[var(--neon-cyan)] mt-2 hover:underline">+ Add {key === "authors" ? "author" : "editor"}</button>
      {key === "authors" && (src.authors.filter((a) => a.family.trim()).length > 6) && <p className="text-xs text-[var(--text-muted)] mt-1">More than six authors: only the first six are printed, followed by “et al.”</p>}
    </div>
  );

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <label htmlFor="vancouver-autofill" className={label}>Autofill from a PMID, DOI, ISBN or web address</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input id="vancouver-autofill" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void autofill(); }}
            placeholder="12140307 · 10.1056/nejmsb020632 · https://…" className={`${field} sm:flex-1 text-base`} autoComplete="off" />
          <button type="button" onClick={autofill} className="btn-generate" disabled={status.kind === "loading" || !query.trim()}>{status.kind === "loading" ? "Looking up…" : "Cite"}</button>
        </div>
        <p className={`text-xs mt-2 min-h-4 ${status.kind === "error" ? "text-[var(--neon-pink)]" : "text-[var(--text-muted)]"}`} aria-live="polite">{status.text || "A PMID or DOI also fills in the NLM journal abbreviation. Or pick a source type and type the details yourself."}</p>

        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Source type">
          {TYPES.map((x) => <button key={x.id} type="button" aria-pressed={t === x.id} className={chip(t === x.id)} onClick={() => set("type", x.id)}>{x.label}</button>)}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-5">
          <div className="space-y-4">
            {people("authors", t === "web" || t === "report" ? "Authors (or the organization)" : "Authors")}
            {text("title", titleLabel)}
            {t === "journal" && text("container", "Journal (full name)")}
            {t === "journal" && (
              <div>
                {text("abbrev", "Journal abbreviation (NLM)", guessed ?? "e.g. N Engl J Med")}
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {guessed ? `Using the NLM abbreviation “${guessed}” until you type one.` : "No periods in the abbreviation. "}
                  {missingAbbrev && <>Not in our short list — the full name is used until you add it. </>}
                  <a href="https://www.ncbi.nlm.nih.gov/nlmcatalog/journals" target="_blank" rel="noopener noreferrer" className="text-[var(--neon-cyan)] hover:underline">Find it in the NLM Catalog</a>
                </p>
              </div>
            )}
            {t === "chapter" && text("container", "Book title")}
            {t === "chapter" && people("editors", "Editors")}
            {t === "web" && text("container", "Website or publisher", "e.g. World Health Organization")}
            <div className="grid grid-cols-3 gap-3">
              {text("year", t === "web" ? "Year published" : "Year", "2024")}
              {(t === "journal" || t === "web") && (
                <label className="block"><span className={label}>Month</span>
                  <select value={src.month ?? ""} onChange={(e) => set("month", e.target.value ? Number(e.target.value) : undefined)} className={field}>
                    <option value="">—</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </label>
              )}
              {(t === "journal" || t === "web") && text("day", "Day", "", "number")}
              {t === "journal" && text("volume", "Volume")}
              {t === "journal" && text("issue", "Issue")}
              {(t === "book" || t === "chapter") && text("edition", "Edition", "2")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(t === "journal" || t === "chapter") && text("pages", "Pages", "284-287")}
              {t !== "journal" && text("publisher", t === "thesis" ? "University" : "Publisher")}
              {t !== "journal" && t !== "web" && text("place", "Place (city)", "New York")}
              {t === "web" && text("place", "Place (city)", "Geneva")}
              {t === "report" && text("detail", "Report number")}
              {t === "thesis" && text("detail", "Kind", "dissertation")}
              {text("doi", "DOI", "10.xxxx/…")}
              {(t === "web" || !src.doi) && text("url", "URL", "https://…")}
              {t === "web" && text("accessed", "Date cited", "", "date")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4" aria-live="polite">
              <p className={label}>Vancouver reference</p>
              <p className="text-[var(--text-primary)] leading-relaxed break-words" data-citation-reference>
                {ready ? reference : <span className="text-[var(--text-muted)]">Your Vancouver citation appears here as you type.</span>}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" className={ghost} disabled={!ready} onClick={() => copyOne(reference, "ref")}>{flash === "ref" ? "Copied ✓" : "Copy"}</button>
                <button type="button" className={ghost} disabled={!ready} onClick={addToList}>{flash === "added" ? "Added ✓" : editing ? "Update reference in list" : "Add to reference list"}</button>
                <button type="button" className={ghost} onClick={() => { setSrc(blank(src.type)); setQuery(""); setEditing(null); setStatus({ kind: "idle", text: "" }); }}>{editing ? "Cancel edit" : "New citation"}</button>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <p className={label}>In-text number</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="In-text number style">
                <button type="button" aria-pressed={mark === "brackets"} className={chip(mark === "brackets")} onClick={() => setMark("brackets")}>[1] brackets</button>
                <button type="button" aria-pressed={mark === "parentheses"} className={chip(mark === "parentheses")} onClick={() => setMark("parentheses")}>(1) parentheses</button>
                <button type="button" aria-pressed={mark === "superscript"} className={chip(mark === "superscript")} onClick={() => setMark("superscript")}>¹ superscript</button>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                This source will be reference <strong className="text-[var(--text-primary)]">{editing ? list.findIndex((x) => x.id === editing) + 1 : list.length + 1}</strong>, cited in the text as <strong className="text-[var(--text-primary)]">{marker(editing ? list.findIndex((x) => x.id === editing) + 1 : list.length + 1, mark)}</strong>. Cite it again with the same number.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10" data-vancouver-list>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">References <span className="text-sm text-[var(--text-muted)]">({list.length}, in order of first citation)</span></h2>
            {list.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button type="button" className={ghost} onClick={() => void copyAll(true)}>{flash === "all-rich" ? "Copied ✓" : "Copy list (numbered, for Word / Docs)"}</button>
                <button type="button" className={ghost} onClick={() => void copyAll(false)}>{flash === "all" ? "Copied ✓" : "Copy plain text"}</button>
                <button type="button" className={ghost} onClick={downloadDoc}>Download .doc</button>
                <button type="button" className={ghost} onClick={downloadTxt}>Download .txt</button>
                <button type="button" className={ghost} onClick={() => { saveList([]); setEditing(null); }}>Clear list</button>
              </div>
            )}
          </div>
          {list.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Add each source as you first cite it — Vancouver numbers references in the order they appear in your text, so this list keeps your order (use the arrows to change it).</p>
          ) : (
            <ol className="space-y-3 list-none p-0">
              {list.map((item, i) => (
                <li key={item.id} className={`flex gap-3 items-start text-[var(--text-secondary)] rounded-lg ${editing === item.id ? "ring-1 ring-[var(--neon-cyan)]/60 p-2" : ""}`}>
                  <span className="w-7 shrink-0 text-right text-[var(--text-primary)] font-semibold">{i + 1}.</span>
                  <p className="flex-1 break-words">{refs[i]}</p>
                  <div className="flex flex-wrap gap-1 justify-end shrink-0 max-w-[11rem]">
                    <button type="button" className={tiny} disabled={i === 0} aria-label={`Move reference ${i + 1} up`} onClick={() => saveList(moveItem(list, i, -1))}>↑</button>
                    <button type="button" className={tiny} disabled={i === list.length - 1} aria-label={`Move reference ${i + 1} down`} onClick={() => saveList(moveItem(list, i, 1))}>↓</button>
                    <button type="button" className={tiny} onClick={() => copyOne(refs[i], `c${item.id}`)}>{flash === `c${item.id}` ? "✓" : "Copy"}</button>
                    <button type="button" className={tiny} onClick={() => { setSrc(forForm(item.source)); setEditing(item.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button>
                    <button type="button" className={tiny} aria-label={`Remove reference ${i + 1}`} onClick={() => { saveList(list.filter((x) => x.id !== item.id)); if (editing === item.id) setEditing(null); }}>×</button>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <p className="text-xs text-[var(--text-muted)] mt-3">Saved only in this browser. PMIDs and DOIs go straight from your browser to PubMed and Crossref; a web address is read once by our server for its title and author.</p>
        </div>
      </div>
    </section>
  );
}
