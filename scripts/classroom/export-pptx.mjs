// Exports one projector-ready PPTX per classroom pack (one slide per question)
// into private/classroom/. Run after build-content.mjs.
// `--preview DIR` also writes single-slide decks of chosen slides (same code)
// to DIR, so Quick Look can render real previews of the exported slides.
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(import.meta.url);
const PptxGenJS = require("pptxgenjs");
const { packs } = JSON.parse(readFileSync(resolve(root, "src/data/classroomPacks.json"), "utf8"));
const out = resolve(root, "private/classroom");
mkdirSync(out, { recursive: true });

const INK = "1B1B2F", MUTED = "5B5B70", PAPER = "FFFDF8", LINE = "E8E4DA", FONT = "Arial";
const size = (text, base) => (text.length < 45 ? base : text.length < 80 ? base - 4 : text.length < 120 ? base - 8 : base - 12);
const clock = (s) => (s % 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `${s / 60} min`);

// Slide indexes (0 = cover) used for the public previews: two question slides of different levels.
export const PREVIEW_SLIDES = { "question-of-the-day": { a: 3, b: 10 }, debate: { a: 3, b: 25 }, speech: { a: 3, b: 36 } };

async function buildDeck(pack, keep, fileName) {
  const accent = pack.color.slice(1).toUpperCase();
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 × 7.5 in
  pptx.author = "RandomTopics";
  pptx.company = "randomtopics.app";
  pptx.title = pack.title;
  pptx.defineSlideMaster({
    title: "QUESTION",
    background: { color: PAPER },
    objects: [
      { rect: { x: 0, y: 0, w: 0.28, h: 7.5, fill: { color: accent } } },
      { text: { text: "RandomTopics · Classroom", options: { x: 0.7, y: 6.85, w: 6, h: 0.4, fontFace: FONT, fontSize: 12, color: MUTED } } },
    ],
    slideNumber: { x: 12.1, y: 6.85, w: 0.8, h: 0.4, fontFace: FONT, fontSize: 12, color: MUTED, align: "right" },
  });
  // A preview deck runs exactly the same slide code; slides not kept draw into a no-op.
  let index = 0;
  const addSlide = pptx.addSlide.bind(pptx);
  const skipped = { addText() {}, addShape() {}, addNotes() {} };
  pptx.addSlide = (opts) => (!keep || keep(index++) ? addSlide(opts) : skipped);
  const plain = (slide, text, opts) => slide.addText(text, { fontFace: FONT, color: INK, margin: 0, valign: "top", ...opts });

  // Cover
  const cover = pptx.addSlide();
  cover.background = { color: accent };
  plain(cover, "RANDOMTOPICS · CLASSROOM PACK", { x: 0.8, y: 0.8, w: 11.7, h: 0.5, fontSize: 16, bold: true, color: "FFFFFF", charSpacing: 3 });
  plain(cover, pack.title, { x: 0.8, y: 2.0, w: 11.7, h: 2.6, fontSize: 54, bold: true, color: "FFFFFF", valign: "middle" });
  plain(cover, pack.tagline, { x: 0.8, y: 4.8, w: 11.7, h: 1, fontSize: 24, color: "FFFFFF" });
  plain(cover, "randomtopics.app/classroom-packs", { x: 0.8, y: 6.6, w: 11.7, h: 0.4, fontSize: 14, color: "FFFFFF" });

  // How to use
  const guide = pptx.addSlide({ masterName: "QUESTION" });
  plain(guide, "How to use this pack", { x: 0.7, y: 0.6, w: 12, h: 0.8, fontSize: 36, bold: true });
  plain(guide, pack.intro.map((t) => ({ text: t, options: { bullet: { indent: 22 }, breakLine: true } })), { x: 0.7, y: 1.6, w: 5.8, h: 4.9, fontSize: 20, paraSpaceAfter: 10, color: INK, margin: [0, 0, 0, 4] });
  guide.addShape(pptx.ShapeType.roundRect, { x: 6.9, y: 1.55, w: 5.8, h: 5.0, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 }, rectRadius: 0.15 });
  plain(guide, "For the teacher", { x: 7.2, y: 1.8, w: 5.2, h: 0.5, fontSize: 20, bold: true, color: accent });
  plain(guide, pack.teacher.map((t) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: true } })), { x: 7.2, y: 2.4, w: 5.2, h: 4.0, fontSize: 16, paraSpaceAfter: 8, color: INK, margin: [0, 0, 0, 4] });

  for (const section of pack.sections) {
    const divider = pptx.addSlide({ masterName: "QUESTION" });
    plain(divider, section.title, { x: 0.7, y: 2.4, w: 12, h: 1.4, fontSize: 60, bold: true, color: accent, valign: "middle" });
    plain(divider, section.note, { x: 0.7, y: 3.9, w: 11.5, h: 1.2, fontSize: 24, color: MUTED });

    for (const item of section.items) {
      const s = pptx.addSlide({ masterName: "QUESTION" });
      if (pack.id === "question-of-the-day") {
        plain(s, `${item.label.toUpperCase()}  ·  ${item.theme.toUpperCase()}`, { x: 0.7, y: 0.55, w: 12, h: 0.5, fontSize: 16, bold: true, color: accent, charSpacing: 1 });
        plain(s, item.text, { x: 0.7, y: 1.35, w: 11.9, h: 3.9, fontSize: size(item.text, 48), bold: true, valign: "middle" });
        plain(s, [{ text: "Follow-up: ", options: { bold: true, color: accent } }, { text: item.followUp, options: { color: MUTED } }], { x: 0.7, y: 5.45, w: 11.9, h: 0.6, fontSize: 22 });
        plain(s, item.level, { x: 9.9, y: 0.55, w: 2.7, h: 0.5, fontSize: 14, color: MUTED, align: "right" });
        s.addNotes(`${item.label} — ${item.theme} (${item.level}).\nAsk: ${item.text}\nFollow-up: ${item.followUp}`);
      } else if (pack.id === "debate") {
        plain(s, `MOTION  ·  ${item.label.toUpperCase()}`, { x: 0.7, y: 0.55, w: 12, h: 0.5, fontSize: 16, bold: true, color: accent, charSpacing: 1 });
        plain(s, item.text, { x: 0.7, y: 1.2, w: 11.9, h: 2.2, fontSize: size(item.text, 44), bold: true, valign: "middle" });
        for (const [i, side] of [["FOR · Proposition", item.pro, "1F9D68"], ["AGAINST · Opposition", item.con, "D2405F"]].entries()) {
          const x = 0.7 + i * 6.1;
          s.addShape(pptx.ShapeType.roundRect, { x, y: 3.75, w: 5.8, h: 2.75, fill: { color: "FFFFFF" }, line: { color: side[2], width: 2 }, rectRadius: 0.12 });
          plain(s, side[0], { x: x + 0.3, y: 3.95, w: 5.2, h: 0.5, fontSize: 18, bold: true, color: side[2] });
          plain(s, side[1], { x: x + 0.3, y: 4.55, w: 5.2, h: 1.8, fontSize: 22 });
        }
        s.addNotes(`Motion: ${item.text}\nFor: ${item.pro}\nAgainst: ${item.con}\nAsk each side to name the other side's strongest point before rebutting it.`);
      } else {
        const t = pack.timing[item.timing];
        plain(s, `${t.label.toUpperCase()} TOPIC  ·  ${section.title.toUpperCase()}`, { x: 0.7, y: 0.55, w: 12, h: 0.5, fontSize: 16, bold: true, color: accent, charSpacing: 1 });
        plain(s, item.text, { x: 0.7, y: 1.3, w: 11.9, h: 3.8, fontSize: size(item.text, 56), bold: true, valign: "middle" });
        const speak = t.speak.every((x) => x % 60 === 0) ? `${t.speak[0] / 60}–${t.speak[1] / 60} min` : `${clock(t.speak[0])}–${clock(t.speak[1])}`;
        for (const [i, [k, v]] of [["Think", clock(t.prep)], ["Speak", speak]].entries()) {
          const x = 0.7 + i * 3.1;
          s.addShape(pptx.ShapeType.roundRect, { x, y: 5.45, w: 2.85, h: 0.95, fill: { color: i ? accent : "FFFFFF" }, line: { color: accent, width: 2 }, rectRadius: 0.12 });
          plain(s, [{ text: `${k}  `, options: { fontSize: 16, color: i ? INK : MUTED } }, { text: v, options: { fontSize: 26, bold: true } }], { x: x + 0.25, y: 5.45, w: 2.5, h: 0.95, valign: "middle" });
        }
        plain(s, "Green = minimum · Yellow = halfway · Red = time", { x: 7.2, y: 5.45, w: 5.4, h: 0.95, fontSize: 14, color: MUTED, valign: "middle", align: "right" });
        s.addNotes(`Topic: ${item.text}\nTiming: ${t.rule}.\nStructure: Point → Reason → Example → Point again.`);
      }
    }
  }
  const end = pptx.addSlide();
  end.background = { color: accent };
  plain(end, "Want a fresh question?", { x: 0.8, y: 2.4, w: 11.7, h: 1.2, fontSize: 48, bold: true, color: "FFFFFF" });
  plain(end, "Generate more free at randomtopics.app · present this pack ad-free at randomtopics.app/classroom/present", { x: 0.8, y: 3.8, w: 11.7, h: 1.2, fontSize: 22, color: "FFFFFF" });
  await pptx.writeFile({ fileName, compression: true });
  return fileName;
}

for (const pack of packs) console.log(await buildDeck(pack, null, resolve(out, `${pack.id}.pptx`)));
const previewAt = process.argv.indexOf("--preview");
if (previewAt > 0) {
  const dir = resolve(process.argv[previewAt + 1]);
  mkdirSync(dir, { recursive: true });
  for (const pack of packs) for (const [name, n] of Object.entries(PREVIEW_SLIDES[pack.id])) {
    await buildDeck(pack, (i) => i === n, resolve(dir, `${pack.id}-slide-${name}.pptx`));
  }
}
