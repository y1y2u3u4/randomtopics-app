// Regression for the AI metadata remover: real images from sharp with EXIF,
// GPS, XMP, C2PA and Stable Diffusion/ComfyUI text injected, then stripped.
// Run: node scripts/metadata-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import sharp from "sharp";
import { load } from "./lib/load-typescript.mjs";

const m = load("src/lib/metadata/strip.ts", {});
const enc = new TextEncoder();
const u8 = (b) => new Uint8Array(b.buffer ? b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) : b);
const cat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };
const be32 = (n) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n); return b; };
const le32 = (n) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, true); return b; };
const labels = (r) => r.findings.map((f) => f.label);
const has = (r, cat) => r.findings.some((f) => f.category === cat);

const base = sharp({ create: { width: 32, height: 24, channels: 3, background: { r: 200, g: 60, b: 90 } } });
const exif = { IFD0: { Make: "Canon", Model: "EOS R5", Software: "Adobe Firefly" }, IFD3: { GPSLatitudeRef: "N", GPSLatitude: "40/1 26/1 46/1", GPSLongitudeRef: "W", GPSLongitude: "79/1 58/1 56/1" } };
const xmp = `<?xpacket begin=""?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:xmp="http://ns.adobe.com/xap/1.0/" Iptc4xmpExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia" xmp:CreatorTool="Midjourney"/></rdf:RDF></x:xmpmeta>`;

const pixels = async (bytes) => (await sharp(Buffer.from(bytes)).raw().toBuffer()).toString("base64");

/* JPEG */
let jpg = u8(await base.clone().jpeg({ quality: 90 }).withExif(exif).toBuffer());
const app = (marker, payload) => cat(new Uint8Array([0xff, marker, (payload.length + 2) >> 8, (payload.length + 2) & 0xff]), payload);
jpg = cat(jpg.subarray(0, 2), app(0xe1, cat(enc.encode("http://ns.adobe.com/xap/1.0/\0"), enc.encode(xmp))), app(0xeb, cat(enc.encode("JP\0\0\0\0\0\x01jumb"), enc.encode("c2pa.manifest"))), app(0xfe, enc.encode("Made with an AI tool")), jpg.subarray(2));
const jr = m.inspectImage(jpg);
assert.equal(jr.kind, "jpeg");
assert.ok(labels(jr).includes("Camera make") && labels(jr).includes("GPS location"), labels(jr).join(", "));
assert.match(jr.findings.find((f) => f.label === "GPS location").detail, /^40\.4461\d, -79\.9822\d$/);
assert.ok(has(jr, "ai") && has(jr, "credentials"), "AI label and C2PA found");
assert.ok(labels(jr).includes("Comment"));
const jclean = m.stripImage(jpg, "all");
const jcr = m.inspectImage(jclean);
assert.deepEqual(jcr.findings.filter((f) => !/kept/.test(f.label)), [], `left: ${labels(jcr)}`);
assert.equal(await pixels(jclean), await pixels(jpg), "JPEG pixels identical");
assert.equal((await sharp(Buffer.from(jclean)).metadata()).exif, undefined);
// Location only: GPS gone, camera kept, file still decodes.
const jloc = m.stripImage(jpg, "location");
const jlr = m.inspectImage(jloc);
assert.ok(!has(jlr, "location") && labels(jlr).includes("Camera make"), labels(jlr).join(", "));
assert.equal(await pixels(jloc), await pixels(jpg));
assert.equal(m.inspectImage(m.stripImage(jpg, "location-camera")).findings.find((f) => f.label === "Camera make")?.detail, undefined, "camera value emptied");

/* PNG */
let png = u8(await base.clone().png().withExif(exif).toBuffer());
const chunk = (type, data) => { const t = enc.encode(type); const body = cat(t, data); return cat(be32(data.length), body, be32(m.crc32(body))); };
const text = (k, v) => chunk("tEXt", cat(enc.encode(k), new Uint8Array([0]), enc.encode(v)));
const itxt = (k, v) => chunk("iTXt", cat(enc.encode(k), new Uint8Array([0, 0, 0, 0, 0]), enc.encode(v)));
png = cat(png.subarray(0, 33), text("parameters", "a cat astronaut, highly detailed\nSteps: 30, Sampler: Euler a, CFG scale: 7, Seed: 1234"), text("prompt", '{"3":{"class_type":"KSampler"}}'), itxt("XML:com.adobe.xmp", xmp), chunk("caBX", enc.encode("c2pa")), png.subarray(33));
const pr = m.inspectImage(png);
assert.ok(labels(pr).includes("Stable Diffusion generation parameters") && labels(pr).includes("ComfyUI prompt"), labels(pr).join(", "));
assert.ok(has(pr, "credentials") && has(pr, "location"));
const pclean = m.stripImage(png, "all");
assert.deepEqual(m.inspectImage(pclean).findings.filter((f) => !/kept/.test(f.label)), []);
assert.equal(await pixels(pclean), await pixels(png), "PNG pixels identical");
const ploc = m.stripImage(png, "location");
assert.ok(!has(m.inspectImage(ploc), "location") && labels(m.inspectImage(ploc)).includes("Stable Diffusion generation parameters"));
await sharp(Buffer.from(ploc)).metadata();

/* WebP */
let webp = u8(await base.clone().webp({ quality: 90 }).withExif(exif).toBuffer());
const riff = (type, data) => cat(enc.encode(type), le32(data.length), data, data.length & 1 ? new Uint8Array([0]) : new Uint8Array(0));
const wr0 = m.inspectImage(webp);
assert.ok(has(wr0, "location") && labels(wr0).includes("Camera make"), labels(wr0).join(", "));
webp = cat(webp, riff("XMP ", enc.encode(xmp)));
new DataView(webp.buffer).setUint32(4, webp.length - 8, true);
webp[20] |= 0x04;
const wr = m.inspectImage(webp);
assert.ok(has(wr, "ai"));
const wclean = m.stripImage(webp, "all");
assert.deepEqual(m.inspectImage(wclean).findings.filter((f) => !/kept/.test(f.label)), []);
assert.equal(new DataView(wclean.buffer).getUint32(4, true), wclean.length - 8, "RIFF size");
assert.equal(wclean[20] & 0x0c, 0, "VP8X EXIF/XMP flags cleared");
assert.equal(await pixels(wclean), await pixels(webp), "WebP pixels identical");

/* misc */
assert.equal(m.inspectImage(enc.encode("GIF89a....")).kind, null);
const zip = m.zipFiles([{ name: "a.jpg", data: jclean }, { name: "b.png", data: pclean }]);
assert.equal(new DataView(zip.buffer).getUint32(0, true), 0x04034b50);
assert.equal(new DataView(zip.buffer).getUint32(zip.length - 22, true), 0x06054b50);
console.log("✓ metadata remover: JPEG, PNG, WebP inspect/strip/location modes, pixels unchanged");
