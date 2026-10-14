// Exports one printable PDF per classroom pack (teacher guide + cut-out cards
// or weekly sheets) into private/classroom/, using Playwright with local Chrome.
// `--preview DIR` also writes the cover, guide and first content page as one-page PDFs.
// PLAYWRIGHT_MODULE=/path/to/playwright node scripts/classroom/export-pdf.mjs
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { packs } = JSON.parse(readFileSync(resolve(root, "src/data/classroomPacks.json"), "utf8"));
const out = resolve(root, "private/classroom");
mkdirSync(out, { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const chunk = (list, n) => Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));
const clock = (s) => (s % 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : `${s / 60} min`);
const speakLabel = (t) => (t.speak.every((x) => x % 60 === 0) ? `${t.speak[0] / 60}–${t.speak[1] / 60} min` : `${clock(t.speak[0])}–${clock(t.speak[1])}`);

const css = (accent) => `
@page { size: Letter; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #1b1b2f; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; padding: 0.6in 0.6in 0.8in; position: relative; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }
.foot { position: absolute; left: 0.6in; right: 0.6in; bottom: 0.4in; display: flex; justify-content: space-between; font-size: 9pt; color: #6b6b80; }
.kicker { color: ${accent}; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 10pt; }
h1 { font-size: 34pt; line-height: 1.1; margin: .15in 0 .2in; }
h2 { font-size: 20pt; margin: 0 0 .12in; }
h3 { font-size: 13pt; margin: .25in 0 .08in; color: ${accent}; }
p, li { font-size: 11.5pt; line-height: 1.45; }
ul { padding-left: .22in; margin: .05in 0; }
.cover { background: ${accent}; color: #fff; }
.cover .kicker, .cover .foot { color: #fff; }
.cover h1 { font-size: 44pt; margin-top: 2.2in; }
.cover .lead { font-size: 16pt; max-width: 6.5in; }
.box { border: 1.5px solid #e2ddd2; border-radius: 10px; padding: .18in .22in; margin-top: .15in; background: #fffdf8; }
.cover .box { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.5); color: #fff; }
.week-head { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid ${accent}; padding-bottom: .08in; }
.level { font-size: 11pt; color: #6b6b80; }
.day { border-bottom: 1px solid #e2ddd2; padding: .17in 0 .15in; }
.day .meta { font-size: 9.5pt; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: .06em; }
.day .q { font-size: 15pt; font-weight: 700; line-height: 1.3; margin: .05in 0; }
.day .f { font-size: 10.5pt; color: #4b4b60; }
.day .lines { height: .32in; border-bottom: 1px dashed #c9c4b8; margin-top: .06in; }
.grid { display: grid; gap: 0; border-top: 1px dashed #b9b4a8; border-left: 1px dashed #b9b4a8; }
.card { border-right: 1px dashed #b9b4a8; border-bottom: 1px dashed #b9b4a8; padding: .2in .22in; display: flex; flex-direction: column; }
.card .meta { font-size: 8.5pt; font-weight: 700; color: ${accent}; text-transform: uppercase; letter-spacing: .06em; }
.card .q { font-weight: 700; line-height: 1.25; margin: .06in 0 .08in; }
.sides { display: grid; grid-template-columns: 1fr 1fr; gap: .1in; margin-top: auto; }
.side { border-radius: 7px; padding: .07in .1in; font-size: 9.5pt; line-height: 1.35; }
.side b { display: block; font-size: 8pt; letter-spacing: .06em; text-transform: uppercase; margin-bottom: .02in; }
.pro { border: 1.5px solid #1f9d68; } .pro b { color: #1f9d68; }
.con { border: 1.5px solid #d2405f; } .con b { color: #d2405f; }
.timing { margin-top: auto; display: flex; gap: .08in; font-size: 9pt; }
.timing span { border: 1.5px solid ${accent}; border-radius: 6px; padding: .03in .08in; }
.timing span:last-child { background: ${accent}; color: #fff; }
.signal { height: 2.75in; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #fff; margin-bottom: .2in; }
.signal b { font-size: 54pt; } .signal span { font-size: 14pt; }
table { border-collapse: collapse; width: 100%; margin-top: .1in; } td, th { border: 1px solid #e2ddd2; padding: .06in .1in; font-size: 11pt; text-align: left; }
`;

function page(body, n, total, cls = "") {
  return `<section class="page ${cls}">${body}<div class="foot"><span>RandomTopics Classroom Pack · licensed for the buyer's own classes</span><span>${n} / ${total}</span></div></section>`;
}

function render(pack) {
  const pages = [];
  pages.push(`<div class="kicker">RandomTopics · Classroom pack</div><h1>${esc(pack.title)}</h1><p class="lead">${esc(pack.tagline)}</p>
    <div class="box"><b>Inside this PDF</b><ul><li>Teacher guide</li><li>${pack.id === "question-of-the-day" ? "36 weekly sheets (5 school days each)" : "Printable cut-out cards"}</li>${pack.id === "speech" ? "<li>Green / yellow / red timing cards</li>" : ""}</ul>
    <b>Slides</b><p style="margin:.04in 0 0">The editable PPTX has one question per slide. To use Google Slides: open slides.google.com → Blank presentation → File → Import slides → upload the PPTX → Select all → Import. Or present it ad-free at randomtopics.app/classroom/present.</p></div>`);
  let guide = `<div class="kicker">Teacher guide</div><h1 style="font-size:28pt">How to use this pack</h1><h3>What is inside</h3><ul>${pack.intro.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><h3>Running it in class</h3><ul>${pack.teacher.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  if (pack.id === "speech") {
    guide += `<h3>Timing rules</h3><table><tr><th>Level</th><th>Think</th><th>Speak</th><th>Green</th><th>Yellow</th><th>Red</th></tr>${Object.values(pack.timing).map((t) => `<tr><td>${t.label}</td><td>${clock(t.prep)}</td><td>${speakLabel(t)}</td><td>${clock(t.speak[0])}</td><td>${clock(Math.round((t.speak[0] + t.speak[1]) / 2))}</td><td>${clock(t.speak[1])}</td></tr>`).join("")}</table>`;
  }
  if (pack.id === "debate") {
    guide += `<h3>Scoring (out of 20)</h3><table><tr><th>Reasoning</th><th>Evidence & examples</th><th>Rebuttal</th><th>Delivery</th></tr><tr><td>0–5</td><td>0–5</td><td>0–5</td><td>0–5</td></tr></table>`;
  }
  guide += `<h3>Classroom-safe</h3><p>Every question is written for students. Teachers know their class best: skip or rephrase anything that does not fit your group.</p>`;
  pages.push(guide);

  if (pack.id === "question-of-the-day") {
    for (const week of pack.sections) {
      pages.push(`<div class="week-head"><h2>${esc(week.title)}</h2><span class="level">${esc(week.items[0].level)} · ${esc(week.note)}</span></div>` +
        week.items.map((it) => `<div class="day"><div class="meta">${esc(it.label)} · ${esc(it.theme)}</div><div class="q">${esc(it.text)}</div><div class="f"><b>Follow-up:</b> ${esc(it.followUp)}</div><div class="lines"></div></div>`).join(""));
    }
  } else if (pack.id === "debate") {
    for (const section of pack.sections) for (const cards of chunk(section.items, 6)) {
      pages.push(`<div class="kicker">${esc(section.title)}</div><div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(3,2.95in);margin-top:.12in">` +
        cards.map((it) => `<div class="card"><div class="meta">Motion</div><div class="q" style="font-size:14pt">${esc(it.text)}</div><div class="sides"><div class="side pro"><b>For</b>${esc(it.pro)}</div><div class="side con"><b>Against</b>${esc(it.con)}</div></div></div>`).join("") + "</div>");
    }
  } else {
    const items = pack.sections.flatMap((s) => s.items.map((it) => ({ ...it, section: s.title })));
    for (const cards of chunk(items, 10)) {
      pages.push(`<div class="kicker">Impromptu topic cards · cut along the dashed lines</div><div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,1.83in);margin-top:.12in">` +
        cards.map((it) => { const t = pack.timing[it.timing]; return `<div class="card"><div class="meta">${esc(t.label)} · ${esc(it.section)}</div><div class="q" style="font-size:${it.text.length > 50 ? 13 : it.text.length > 14 ? 16 : 24}pt">${esc(it.text)}</div><div class="timing"><span>Think ${clock(t.prep)}</span><span>Speak ${speakLabel(t)}</span></div></div>`; }).join("") + "</div>");
    }
    pages.push(`<div class="kicker">Timekeeper cards</div><h2 style="margin-top:.1in">Hold up each card as the speaker reaches the time</h2>` +
      [["#1f9d68", "GREEN", "Minimum time reached"], ["#e2b100", "YELLOW", "Halfway: start wrapping up"], ["#d2405f", "RED", "Time: finish your sentence"]].map(([c, w, s]) => `<div class="signal" style="background:${c}"><b>${w}</b><span>${s}</span></div>`).join(""));
  }
  const total = pages.length;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(pack.title)}</title><style>${css(pack.color)}</style></head><body>${pages.map((b, i) => page(b, i + 1, total, i === 0 ? "cover" : "")).join("")}</body></html>`;
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
const previewAt = process.argv.indexOf("--preview");
const previewDir = previewAt > 0 ? resolve(process.argv[previewAt + 1]) : null;
if (previewDir) mkdirSync(previewDir, { recursive: true });
try {
  for (const pack of packs) {
    const tab = await browser.newPage();
    await tab.setContent(render(pack), { waitUntil: "load" });
    const options = { format: "Letter", printBackground: true, preferCSSPageSize: true };
    await tab.pdf({ ...options, path: resolve(out, `${pack.id}.pdf`) });
    if (previewDir) for (const [name, range] of [["cover", "1"], ["guide", "2"], ["page", "3"]]) {
      await tab.pdf({ ...options, pageRanges: range, path: resolve(previewDir, `${pack.id}-pdf-${name}.pdf`) });
    }
    await tab.close();
    console.log(resolve(out, `${pack.id}.pdf`));
  }
} finally {
  await browser.close();
}
