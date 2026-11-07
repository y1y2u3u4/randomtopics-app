import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/generators/fourCharacters.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test("examples: ≥3, four filled cells, distinct genres", () => {
  assert.ok(lib.EXAMPLES.length >= 3);
  assert.equal(new Set(lib.EXAMPLES.map((e) => e.id)).size, lib.EXAMPLES.length);
  for (const e of lib.EXAMPLES) {
    assert.equal(e.card.cells.length, lib.CELL_COUNT, e.id);
    assert.ok(e.card.title.length <= lib.LIMITS.title, e.id);
    for (const c of e.card.cells) {
      assert.ok(c.name && c.from && c.line && c.emoji, `${e.id} ${c.name}`);
      assert.ok(!c.image && !c.id, "examples use generated cards, no official art");
      assert.ok(c.line.length <= lib.LIMITS.line && c.name.length <= lib.LIMITS.name, c.name);
    }
  }
});

test("encode/decode roundtrip keeps ids, drops images", () => {
  for (const e of lib.EXAMPLES) assert.deepEqual(lib.decodeCard(lib.encodeCard(e.card)), lib.normalize(e.card));
  const card = { title: "Mes 4 💫", by: "@yū", common: "all \"chaotic\" & <loyal>", cells: [{ id: "127212", name: "Satoru Gojo", from: "JJK", line: "x", emoji: "🌙", image: "https://s4.anilist.co/x.jpg" }] };
  const code = lib.encodeCard(card);
  assert.match(code, /^[A-Za-z0-9_-]+$/);
  assert.ok(!Buffer.from(code, "base64").toString().includes("anilist.co"));
  const back = lib.decodeCard(code);
  assert.equal(back.cells.length, 4);
  assert.equal(back.cells[0].id, "127212");
  assert.equal(back.cells[0].image, undefined);
  assert.equal(back.common, card.common);
  assert.ok(lib.cardFromHash(`#c=${code}`));
});

test("normalize clips, rejects bad ids, pads to 4", () => {
  const n = lib.normalize({ title: "t".repeat(200), cells: [{ name: "n".repeat(99), from: "", line: "l\u0000x", emoji: "", id: "javascript:1" }, ...Array(9).fill({ name: "a" })] });
  assert.equal(n.cells.length, 4);
  assert.equal(n.title.length, lib.LIMITS.title);
  assert.equal(n.cells[0].name.length, lib.LIMITS.name);
  assert.equal(n.cells[0].line, "l x");
  assert.equal(n.cells[0].id, undefined);
  assert.equal(lib.normalize({}).cells.length, 4);
});

test("decode rejects junk and empty cards", () => {
  for (const bad of ["", "zz", "!!!", "a".repeat(5000), lib.encodeCard(lib.blankCard())]) assert.equal(lib.decodeCard(bad), null);
  assert.equal(lib.cardFromHash(""), null);
});

test("portrait svg is escaped and original", () => {
  const svg = lib.portraitSvg({ name: "<b>&", from: "", line: "", emoji: "" }, 0);
  assert.ok(svg.startsWith("<svg") && !svg.includes("<b>") && svg.includes("&lt;"));
  assert.ok(!/<image|href=/.test(svg), "no embedded external art");
  assert.equal(lib.initials("Levi Ackerman"), "LA");
  assert.equal(lib.initials(""), "?");
  assert.deepEqual(lib.paletteFor("x", 1), lib.paletteFor("x", 1));
});

console.log(`four-characters regression: ${passed} tests passed`);
