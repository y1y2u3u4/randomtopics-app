// Inspect and remove image metadata in the browser, without re-encoding.
// JPEG: drop APPn/COM segments (EXIF, XMP, IPTC, C2PA/JUMBF, comments).
// PNG: drop text/eXIf/tIME/caBX chunks (incl. Stable Diffusion & ComfyUI prompts).
// WebP: drop EXIF/XMP/C2PA chunks and fix the VP8X flags and RIFF size.
// Pixels are copied byte for byte, so image quality never changes. Colour
// profiles (ICC) are kept because removing them can shift colours.
// Invisible watermarks embedded in the pixels (e.g. SynthID) are NOT metadata
// and are not touched.

export type ImageKind = "jpeg" | "png" | "webp";
export type Category = "location" | "camera" | "ai" | "credentials" | "editing" | "other";
export type StripMode = "all" | "location" | "location-camera";

export interface Finding { category: Category; label: string; detail?: string }
export interface Report { kind: ImageKind | null; findings: Finding[]; error?: string }

const ascii = (b: Uint8Array, start: number, len: number) => String.fromCharCode(...b.subarray(start, start + len));
const latin1 = (b: Uint8Array) => { let s = ""; for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192)); return s; };
const utf8 = (b: Uint8Array) => new TextDecoder("utf-8", { fatal: false }).decode(b);
const short = (s: string, n = 240) => (s.length > n ? `${s.slice(0, n)}…` : s);

export function detectKind(b: Uint8Array): ImageKind | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b.length > 8 && b[0] === 0x89 && ascii(b, 1, 3) === "PNG") return "png";
  if (b.length > 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") return "webp";
  return null;
}

/* --------------------------------- TIFF / EXIF --------------------------------- */

const TAGS: Record<number, { label: string; category: Category }> = {
  0x010f: { label: "Camera make", category: "camera" },
  0x0110: { label: "Camera model", category: "camera" },
  0x0131: { label: "Software", category: "editing" },
  0x0132: { label: "Date modified", category: "other" },
  0x013b: { label: "Artist", category: "other" },
  0x8298: { label: "Copyright", category: "other" },
  0x9003: { label: "Date taken", category: "other" },
  0x927c: { label: "Maker notes (camera-specific data)", category: "camera" },
  0x9286: { label: "User comment", category: "other" },
  0xa430: { label: "Camera owner name", category: "camera" },
  0xa431: { label: "Camera serial number", category: "camera" },
  0xa433: { label: "Lens make", category: "camera" },
  0xa434: { label: "Lens model", category: "camera" },
  0xa435: { label: "Lens serial number", category: "camera" },
  0x010e: { label: "Image description", category: "other" },
};
/** Tags zeroed by the "location + camera" option. */
const CAMERA_TAGS = new Set([0x010f, 0x0110, 0x927c, 0xa430, 0xa431, 0xa433, 0xa434, 0xa435]);
const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8, 11: 4, 12: 8 };

interface Entry { tag: number; type: number; count: number; entryOffset: number; valueOffset: number; size: number }

function tiffReader(t: Uint8Array) {
  if (t.length < 8) return null;
  const le = t[0] === 0x49 && t[1] === 0x49;
  if (!le && !(t[0] === 0x4d && t[1] === 0x4d)) return null;
  const dv = new DataView(t.buffer, t.byteOffset, t.byteLength);
  const u16 = (o: number) => dv.getUint16(o, le);
  const u32 = (o: number) => dv.getUint32(o, le);
  const ifd = (offset: number): Entry[] => {
    if (offset <= 0 || offset + 2 > t.length) return [];
    const n = u16(offset);
    const out: Entry[] = [];
    for (let i = 0; i < n && offset + 2 + i * 12 + 12 <= t.length; i++) {
      const e = offset + 2 + i * 12;
      const type = u16(e + 2), count = u32(e + 4);
      const size = (TYPE_SIZE[type] ?? 1) * count;
      const valueOffset = size <= 4 ? e + 8 : u32(e + 8);
      out.push({ tag: u16(e), type, count, entryOffset: e, valueOffset, size: Math.min(size, Math.max(0, t.length - valueOffset)) });
    }
    return out;
  };
  return { le, u16, u32, ifd, first: u32(4) };
}

function readString(t: Uint8Array, e: Entry): string {
  return utf8(t.subarray(e.valueOffset, e.valueOffset + e.size)).replace(/\0+$/g, "").trim();
}

function gpsSummary(t: Uint8Array, entries: Entry[], r: NonNullable<ReturnType<typeof tiffReader>>): string | undefined {
  const get = (tag: number) => entries.find((e) => e.tag === tag);
  const coord = (e?: Entry) => {
    if (!e || e.type !== 5 || e.count < 3) return null;
    const v = [0, 1, 2].map((i) => { const d = r.u32(e.valueOffset + i * 8 + 4); return d ? r.u32(e.valueOffset + i * 8) / d : 0; });
    return v[0] + v[1] / 60 + v[2] / 3600;
  };
  const lat = coord(get(2)), lon = coord(get(4));
  if (lat == null || lon == null) return undefined;
  const ns = get(1) ? String.fromCharCode(t[get(1)!.valueOffset]) : "N";
  const ew = get(3) ? String.fromCharCode(t[get(3)!.valueOffset]) : "E";
  return `${(ns === "S" ? -lat : lat).toFixed(5)}, ${(ew === "W" ? -lon : lon).toFixed(5)}`;
}

/** List what a TIFF/EXIF block contains. */
export function inspectTiff(t: Uint8Array, findings: Finding[]) {
  const r = tiffReader(t);
  if (!r) { findings.push({ category: "other", label: "EXIF block" }); return; }
  const walk = (entries: Entry[]) => {
    for (const e of entries) {
      const known = TAGS[e.tag];
      if (known) findings.push({ category: known.category, label: known.label, detail: e.type === 2 ? short(readString(t, e), 120) || undefined : undefined });
      if (e.tag === 0x8769) walk(r.ifd(r.u32(e.entryOffset + 8)));
      if (e.tag === 0x8825) {
        const gps = r.ifd(r.u32(e.entryOffset + 8));
        if (gps.length) findings.push({ category: "location", label: "GPS location", detail: gpsSummary(t, gps, r) });
      }
    }
  };
  walk(r.ifd(r.first));
}

/** Zero GPS (and optionally camera) data in place; the TIFF structure stays valid. */
export function scrubTiff(t: Uint8Array, mode: StripMode): Uint8Array {
  const out = t.slice();
  const r = tiffReader(out);
  if (!r) return out;
  const zero = (start: number, len: number) => { if (start >= 0 && start + len <= out.length) out.fill(0, start, start + len); };
  const walk = (offset: number) => {
    for (const e of r.ifd(offset)) {
      if (e.tag === 0x8769) walk(r.u32(e.entryOffset + 8));
      if (e.tag === 0x8825) {
        const gpsOffset = r.u32(e.entryOffset + 8);
        const gps = r.ifd(gpsOffset);
        for (const g of gps) if (g.size > 4) zero(g.valueOffset, g.size);
        // Empty the GPS directory: zero entries, count and next-IFD pointer.
        zero(gpsOffset, 2 + gps.length * 12 + 4);
      }
      if (mode === "location-camera" && CAMERA_TAGS.has(e.tag)) zero(e.size > 4 ? e.valueOffset : e.entryOffset + 8, e.size > 4 ? e.size : 4);
    }
  };
  walk(r.first);
  return out;
}

/* ------------------------------------ XMP ------------------------------------ */

function inspectXmp(xml: string, findings: Finding[]) {
  findings.push({ category: "editing", label: "XMP metadata", detail: `${xml.length.toLocaleString("en-US")} characters` });
  const source = /DigitalSourceType[^>]*?(?:>|=")\s*([^<"]+)/i.exec(xml)?.[1] ?? "";
  if (/trainedAlgorithmicMedia|compositeWithTrainedAlgorithmicMedia|algorithmicMedia/i.test(source)) {
    findings.push({ category: "ai", label: "AI-generated label (IPTC digital source type)", detail: source.split("/").pop() });
  }
  const tool = /(?:CreatorTool|softwareAgent)[^>]*?(?:>|=")\s*([^<"]+)/i.exec(xml)?.[1];
  if (tool) findings.push({ category: "editing", label: "Creator tool", detail: short(tool.trim(), 120) });
  if (/c2pa|contentauth|stds\.schema/i.test(xml)) findings.push({ category: "credentials", label: "Content Credentials reference (C2PA) in XMP" });
  if (/GPSLatitude/i.test(xml)) findings.push({ category: "location", label: "GPS location in XMP" });
  if (/(?:<|:)(?:prompt|Prompt)\b/.test(xml)) findings.push({ category: "ai", label: "Prompt text in XMP" });
}

/* ------------------------------------ JPEG ------------------------------------ */

interface Segment { marker: number; start: number; end: number; dataStart: number }

function jpegSegments(b: Uint8Array): { segments: Segment[]; scanStart: number } | null {
  const segments: Segment[] = [];
  let o = 2;
  while (o + 4 <= b.length) {
    if (b[o] !== 0xff) return null;
    let marker = b[o + 1];
    while (marker === 0xff && o + 2 < b.length) { o++; marker = b[o + 1]; } // fill bytes
    if (marker === 0xda || marker === 0xd9) return { segments, scanStart: o };
    const len = (b[o + 2] << 8) | b[o + 3];
    if (len < 2 || o + 2 + len > b.length) return null;
    segments.push({ marker, start: o, end: o + 2 + len, dataStart: o + 4 });
    o += 2 + len;
  }
  return null;
}

const isRemovableJpeg = (b: Uint8Array, s: Segment) => {
  if (s.marker === 0xfe) return true; // comment
  if (s.marker < 0xe0 || s.marker > 0xef) return false;
  if (s.marker === 0xe0) return !ascii(b, s.dataStart, 5).startsWith("JFIF"); // keep JFIF header
  if (s.marker === 0xe2 && ascii(b, s.dataStart, 11) === "ICC_PROFILE") return false; // keep colour profile
  if (s.marker === 0xee && ascii(b, s.dataStart, 5) === "Adobe") return false; // colour transform flag, needed to decode CMYK
  return true;
};

function inspectJpeg(b: Uint8Array, findings: Finding[]) {
  const parsed = jpegSegments(b);
  if (!parsed) throw new Error("This JPEG looks damaged.");
  for (const s of parsed.segments) {
    const head = ascii(b, s.dataStart, 32);
    const data = b.subarray(s.dataStart, s.end);
    if (s.marker === 0xe1 && head.startsWith("Exif\0")) inspectTiff(data.subarray(6), findings);
    else if (s.marker === 0xe1 && head.startsWith("http://ns.adobe.com/xap/1.0/")) inspectXmp(utf8(data.subarray(29)), findings);
    else if (s.marker === 0xe1 && head.startsWith("http://ns.adobe.com/xmp/extension/")) findings.push({ category: "editing", label: "Extended XMP" });
    else if (s.marker === 0xed) findings.push({ category: "other", label: "IPTC / Photoshop data" });
    else if (s.marker === 0xeb) findings.push({ category: "credentials", label: /c2pa/.test(latin1(data)) ? "Content Credentials manifest (C2PA)" : "JUMBF data box" });
    else if (s.marker === 0xfe) findings.push({ category: "other", label: "Comment", detail: short(utf8(data), 160) });
    else if (s.marker === 0xe2 && head.startsWith("ICC_PROFILE")) findings.push({ category: "other", label: "Colour profile (kept)" });
    else if (s.marker === 0xe2 && head.startsWith("MPF")) findings.push({ category: "camera", label: "Multi-picture data (embedded previews)" });
    else if (isRemovableJpeg(b, s)) findings.push({ category: "other", label: `APP${s.marker - 0xe0} data` });
  }
}

function stripJpeg(b: Uint8Array, mode: StripMode): Uint8Array {
  const parsed = jpegSegments(b);
  if (!parsed) throw new Error("This JPEG looks damaged.");
  const parts: Uint8Array[] = [b.subarray(0, 2)];
  for (const s of parsed.segments) {
    const isExif = s.marker === 0xe1 && ascii(b, s.dataStart, 5) === "Exif\0";
    if (mode !== "all") {
      if (isExif) {
        const header = b.subarray(s.start, s.dataStart + 6);
        parts.push(header, scrubTiff(b.subarray(s.dataStart + 6, s.end), mode));
      } else if (s.marker === 0xe1 && /GPS/.test(latin1(b.subarray(s.dataStart, s.end)))) {
        continue; // XMP that carries GPS goes too
      } else parts.push(b.subarray(s.start, s.end));
      continue;
    }
    if (!isRemovableJpeg(b, s)) parts.push(b.subarray(s.start, s.end));
  }
  parts.push(b.subarray(parsed.scanStart));
  return concat(parts);
}

/* ------------------------------------- PNG ------------------------------------- */

interface Chunk { type: string; start: number; end: number; dataStart: number; length: number }

function pngChunks(b: Uint8Array): Chunk[] {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const out: Chunk[] = [];
  let o = 8;
  while (o + 12 <= b.length) {
    const length = dv.getUint32(o);
    const type = ascii(b, o + 4, 4);
    const end = o + 12 + length;
    if (end > b.length) throw new Error("This PNG looks damaged.");
    out.push({ type, start: o, end, dataStart: o + 8, length });
    o = end;
    if (type === "IEND") break;
  }
  return out;
}

const PNG_TEXT = new Set(["tEXt", "iTXt", "zTXt"]);
const PNG_REMOVE = new Set(["tEXt", "iTXt", "zTXt", "eXIf", "tIME", "caBX", "c2pa"]);

function pngText(b: Uint8Array, c: Chunk): { key: string; value: string } {
  const d = b.subarray(c.dataStart, c.dataStart + c.length);
  const nul = d.indexOf(0);
  const key = latin1(d.subarray(0, nul < 0 ? d.length : nul));
  if (c.type === "tEXt") return { key, value: latin1(d.subarray(nul + 1)) };
  if (c.type === "iTXt") {
    const compressed = d[nul + 1] === 1;
    let p = nul + 3;
    p = d.indexOf(0, p) + 1; // language tag
    p = d.indexOf(0, p) + 1; // translated keyword
    return { key, value: compressed ? "(compressed text)" : utf8(d.subarray(p)) };
  }
  return { key, value: "(compressed text)" };
}

function inspectPng(b: Uint8Array, findings: Finding[]) {
  for (const c of pngChunks(b)) {
    if (PNG_TEXT.has(c.type)) {
      const { key, value } = pngText(b, c);
      if (key === "XML:com.adobe.xmp") { inspectXmp(value, findings); continue; }
      if (key === "parameters") findings.push({ category: "ai", label: "Stable Diffusion generation parameters", detail: short(value) });
      else if (key === "prompt" || key === "workflow") findings.push({ category: "ai", label: `ComfyUI ${key}`, detail: short(value, 160) });
      else if (/^(Dream|sd-metadata|invokeai_metadata|generation_data|Comment)$/i.test(key) && /prompt|seed|steps|sampler/i.test(value)) findings.push({ category: "ai", label: `AI generation data (${key})`, detail: short(value) });
      else findings.push({ category: /Software/i.test(key) ? "editing" : "other", label: `Text: ${key}`, detail: short(value, 160) });
    } else if (c.type === "eXIf") inspectTiff(b.subarray(c.dataStart, c.dataStart + c.length), findings);
    else if (c.type === "caBX" || c.type === "c2pa") findings.push({ category: "credentials", label: "Content Credentials manifest (C2PA)" });
    else if (c.type === "tIME") findings.push({ category: "other", label: "Last-modified time" });
    else if (c.type === "iCCP") findings.push({ category: "other", label: "Colour profile (kept)" });
  }
}

function stripPng(b: Uint8Array, mode: StripMode): Uint8Array {
  const parts: Uint8Array[] = [b.subarray(0, 8)];
  for (const c of pngChunks(b)) {
    if (mode === "all" && PNG_REMOVE.has(c.type)) continue;
    if (mode !== "all" && c.type === "eXIf") {
      const data = scrubTiff(b.subarray(c.dataStart, c.dataStart + c.length), mode);
      parts.push(pngChunk("eXIf", data));
      continue;
    }
    parts.push(b.subarray(c.start, c.end));
  }
  return concat(parts);
}

/* ------------------------------------ WebP ------------------------------------ */

function webpChunks(b: Uint8Array): Chunk[] {
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const out: Chunk[] = [];
  let o = 12;
  while (o + 8 <= b.length) {
    const type = ascii(b, o, 4);
    const length = dv.getUint32(o + 4, true);
    const end = o + 8 + length + (length & 1);
    if (o + 8 + length > b.length) throw new Error("This WebP looks damaged.");
    out.push({ type, start: o, end: Math.min(end, b.length), dataStart: o + 8, length });
    o = end;
  }
  return out;
}

function inspectWebp(b: Uint8Array, findings: Finding[]) {
  for (const c of webpChunks(b)) {
    if (c.type === "EXIF") {
      let t = b.subarray(c.dataStart, c.dataStart + c.length);
      if (ascii(t, 0, 6) === "Exif\0\0") t = t.subarray(6);
      inspectTiff(t, findings);
    } else if (c.type === "XMP ") inspectXmp(utf8(b.subarray(c.dataStart, c.dataStart + c.length)), findings);
    else if (c.type === "C2PA") findings.push({ category: "credentials", label: "Content Credentials manifest (C2PA)" });
    else if (c.type === "ICCP") findings.push({ category: "other", label: "Colour profile (kept)" });
  }
}

function stripWebp(b: Uint8Array, mode: StripMode): Uint8Array {
  const parts: Uint8Array[] = [];
  for (const c of webpChunks(b)) {
    if (mode === "all" && (c.type === "EXIF" || c.type === "XMP " || c.type === "C2PA")) continue;
    if (mode !== "all" && c.type === "EXIF") {
      const raw = b.subarray(c.dataStart, c.dataStart + c.length);
      const pre = ascii(raw, 0, 6) === "Exif\0\0" ? 6 : 0;
      parts.push(riffChunk("EXIF", concat([raw.subarray(0, pre), scrubTiff(raw.subarray(pre), mode)])));
      continue;
    }
    if (mode !== "all" && c.type === "XMP " && /GPS/.test(latin1(b.subarray(c.dataStart, c.dataStart + c.length)))) continue;
    parts.push(b.slice(c.start, c.end));
  }
  // VP8X flags: bit 3 = EXIF, bit 2 = XMP. Clear the ones we removed.
  const kept = new Set(parts.map((p) => ascii(p, 0, 4)));
  const vp8x = parts.find((p) => ascii(p, 0, 4) === "VP8X");
  if (vp8x) {
    if (!kept.has("EXIF")) vp8x[8] &= ~0x08;
    if (!kept.has("XMP ")) vp8x[8] &= ~0x04;
  }
  const body = concat(parts);
  const head = new Uint8Array(12);
  head.set(b.subarray(0, 12));
  new DataView(head.buffer).setUint32(4, body.length + 4, true);
  return concat([head, body]);
}

/* ---------------------------------- helpers ---------------------------------- */

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
export function crc32(bytes: Uint8Array, crc = 0xffffffff): number {
  let c = crc;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function riffChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(8 + data.length + (data.length & 1));
  for (let i = 0; i < 4; i++) out[i] = type.charCodeAt(i);
  new DataView(out.buffer).setUint32(4, data.length, true);
  out.set(data, 8);
  return out;
}

/* ------------------------------------ API ------------------------------------ */

export function inspectImage(bytes: Uint8Array): Report {
  const kind = detectKind(bytes);
  if (!kind) return { kind: null, findings: [], error: "Not a JPG, PNG or WebP image." };
  const findings: Finding[] = [];
  try {
    if (kind === "jpeg") inspectJpeg(bytes, findings);
    else if (kind === "png") inspectPng(bytes, findings);
    else inspectWebp(bytes, findings);
  } catch (e) {
    return { kind, findings, error: e instanceof Error ? e.message : "Could not read this file." };
  }
  return { kind, findings };
}

export function stripImage(bytes: Uint8Array, mode: StripMode = "all"): Uint8Array {
  const kind = detectKind(bytes);
  if (kind === "jpeg") return stripJpeg(bytes, mode);
  if (kind === "png") return stripPng(bytes, mode);
  if (kind === "webp") return stripWebp(bytes, mode);
  throw new Error("Not a JPG, PNG or WebP image.");
}

/** Minimal ZIP (stored, no compression) for batch downloads. */
export function zipFiles(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const enc = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, f.data.length, true); lv.setUint32(22, f.data.length, true); lv.setUint16(26, name.length, true);
    local.set(name, 30);
    const central = new Uint8Array(46 + name.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, f.data.length, true); cv.setUint32(24, f.data.length, true); cv.setUint16(28, name.length, true);
    cv.setUint32(42, offset, true);
    central.set(name, 46);
    locals.push(local, f.data);
    centrals.push(central);
    offset += local.length + f.data.length;
  }
  const dir = concat(centrals);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
  ev.setUint32(12, dir.length, true); ev.setUint32(16, offset, true);
  return concat([...locals, dir, end]);
}
