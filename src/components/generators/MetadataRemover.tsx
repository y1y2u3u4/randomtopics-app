"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { inspectImage, stripImage, zipFiles, type Category, type Finding, type Report, type StripMode } from "@/lib/metadata/strip";

interface Item {
  id: string;
  name: string;
  size: number;
  url: string;
  bytes: Uint8Array;
  report: Report;
  clean?: { bytes: Uint8Array; report: Report; removed: number };
}

const CATEGORY: Record<Category, { label: string; icon: string }> = {
  location: { label: "Location", icon: "📍" },
  camera: { label: "Camera & device", icon: "📷" },
  ai: { label: "AI generation data", icon: "🤖" },
  credentials: { label: "Content Credentials", icon: "🔏" },
  editing: { label: "Software & editing", icon: "🛠️" },
  other: { label: "Other", icon: "🗂️" },
};
const ORDER: Category[] = ["location", "camera", "ai", "credentials", "editing", "other"];
const MODES: { id: StripMode; label: string; hint: string }[] = [
  { id: "all", label: "Remove all metadata", hint: "Recommended before sharing: location, device, AI prompts, Content Credentials, comments and editing history." },
  { id: "location", label: "Remove location only", hint: "Keeps everything else, including camera details and generation data." },
  { id: "location-camera", label: "Remove location and camera details", hint: "Also empties make, model, lens and serial numbers; keeps the rest." },
];
const MAX_FILES = 50;
const MAX_BYTES = 50 * 1024 * 1024;
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const visible = (f: Finding[]) => f.filter((x) => !/\(kept\)/.test(x.label));

function cleanName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? `${name.slice(0, dot)}-clean${name.slice(dot)}` : `${name}-clean`;
}

function download(name: string, data: Uint8Array, type: string) {
  const url = URL.createObjectURL(new Blob([data as BlobPart], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const mime = (r: Report) => (r.kind === "png" ? "image/png" : r.kind === "webp" ? "image/webp" : "image/jpeg");

function Findings({ findings }: { findings: Finding[] }) {
  const list = visible(findings);
  if (!list.length) return <p className="text-sm text-[var(--neon-cyan)]">No metadata found ✓</p>;
  return (
    <ul className="space-y-2">
      {ORDER.filter((c) => list.some((f) => f.category === c)).map((c) => (
        <li key={c}>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{CATEGORY[c].icon} {CATEGORY[c].label}</p>
          <ul className="mt-1 space-y-1">
            {list.filter((f) => f.category === c).map((f, i) => (
              <li key={`${f.label}-${i}`} className="text-sm text-[var(--text-secondary)] break-words">
                <span className="text-[var(--text-primary)]">{f.label}</span>
                {f.detail && <span className="text-[var(--text-muted)]"> — {f.detail}</span>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default function MetadataRemover() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<StripMode>("all");
  const [note, setNote] = useState("");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef<string[]>([]);

  useEffect(() => () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, MAX_FILES - items.length);
    const added: Item[] = [];
    const skipped: string[] = [];
    for (const file of list) {
      if (file.size > MAX_BYTES) { skipped.push(`${file.name} (over 50 MB)`); continue; }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const report = inspectImage(bytes);
      if (!report.kind) { skipped.push(`${file.name} (not JPG, PNG or WebP)`); continue; }
      const url = URL.createObjectURL(file);
      urls.current.push(url);
      added.push({ id: `${file.name}-${file.size}-${Math.random()}`, name: file.name, size: file.size, url, bytes, report });
    }
    setItems((prev) => [...prev, ...added]);
    setNote(skipped.length ? `Skipped: ${skipped.join(", ")}.` : "");
    if (added.length) track("generate_start", { tool_type: "ai_metadata_remover", result_count: added.length, locale: "en" });
    if (input.current) input.current.value = "";
  };

  const cleanAll = () => {
    let removedTotal = 0;
    const next = items.map((item) => {
      try {
        const bytes = stripImage(item.bytes, mode);
        const report = inspectImage(bytes);
        const removed = Math.max(0, visible(item.report.findings).length - visible(report.findings).length);
        removedTotal += removed;
        return { ...item, clean: { bytes, report, removed } };
      } catch {
        return item;
      }
    });
    setItems(next);
    track("generate_success", { tool_type: "ai_metadata_remover", generator_mode: mode, result_count: next.length, removed: removedTotal, locale: "en" });
  };

  const cleaned = items.filter((i) => i.clean);
  const downloadAll = () => {
    if (cleaned.length === 1) { const i = cleaned[0]; download(cleanName(i.name), i.clean!.bytes, mime(i.report)); return; }
    download("clean-images.zip", zipFiles(cleaned.map((i) => ({ name: cleanName(i.name), data: i.clean!.bytes }))), "application/zip");
  };

  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors disabled:opacity-40";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); void addFiles(e.dataTransfer.files); }}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${drag ? "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.05)]" : "border-white/15"}`}
        >
          <p className="text-lg font-semibold text-[var(--text-primary)]">Drop JPG, PNG or WebP images here</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">Up to {MAX_FILES} files · processed on your device, never uploaded</p>
          <button type="button" onClick={() => input.current?.click()} className="btn-generate mt-4">Choose images</button>
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={(e) => e.target.files && void addFiles(e.target.files)} />
        </div>
        {note && <p className="text-sm text-[var(--neon-pink)] mt-3" aria-live="polite">{note}</p>}

        {items.length > 0 && (
          <>
            <fieldset className="mt-6">
              <legend className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">What to remove</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {MODES.map((m) => (
                  <label key={m.id} className={`rounded-xl border p-3 cursor-pointer text-sm ${mode === m.id ? "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.06)]" : "border-white/10"}`}>
                    <input type="radio" name="strip-mode" className="mr-2" checked={mode === m.id} onChange={() => setMode(m.id)} />
                    <span className="font-semibold text-[var(--text-primary)]">{m.label}</span>
                    <span className="block text-xs text-[var(--text-muted)] mt-1">{m.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap gap-3 mt-4">
              <button type="button" onClick={cleanAll} className="btn-generate">🧹 Remove metadata{items.length > 1 ? ` from ${items.length} images` : ""}</button>
              {cleaned.length > 0 && <button type="button" onClick={downloadAll} className={ghost}>⬇️ Download {cleaned.length > 1 ? `all (${cleaned.length}, .zip)` : "clean copy"}</button>}
              <button type="button" onClick={() => { setItems([]); setNote(""); }} className={ghost}>Clear</button>
            </div>

            <ul className="mt-6 space-y-4" data-metadata-files>
              {items.map((item) => (
                <li key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 grid gap-4 sm:grid-cols-[96px_minmax(0,1fr)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                  <img src={item.url} alt="" className="w-24 h-24 object-cover rounded-lg bg-white/5" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] break-all">{item.name} <span className="text-[var(--text-muted)] font-normal">· {item.report.kind?.toUpperCase()} · {kb(item.size)}</span></p>
                    {item.report.error && <p className="text-sm text-[var(--neon-pink)]">{item.report.error}</p>}
                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] mb-1">Found in the file</p>
                        <Findings findings={item.report.findings} />
                      </div>
                      {item.clean && (
                        <div data-metadata-clean>
                          <p className="text-xs font-bold text-[var(--text-muted)] mb-1">Clean copy · {kb(item.clean.bytes.length)} · {item.clean.removed} removed</p>
                          <Findings findings={item.clean.report.findings} />
                          <button type="button" className={`${ghost} mt-3`} onClick={() => download(cleanName(item.name), item.clean!.bytes, mime(item.report))}>⬇️ Download {cleanName(item.name)}</button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-5">The image itself is copied byte for byte, so quality does not change. Colour profiles are kept. Invisible watermarks inside the pixels (such as Google SynthID) are not metadata and are not removed.</p>
      </div>
    </section>
  );
}
