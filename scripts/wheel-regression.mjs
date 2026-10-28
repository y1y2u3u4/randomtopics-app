// Tests for the wheel family: CSV/TXT import, weights, template data integrity.
// Run: node scripts/wheel-regression.mjs
import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const imp = load("src/lib/wheelImport.ts");
const tpl = load("src/data/wheelTemplates.ts");
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };

test("plain TXT: one name per line, numbering stripped", () => {
  assert.deepEqual(imp.parseWheelFile("1. Ava\n2) Ben\n- Cy\n\n").names, ["Ava", "Ben", "Cy"]);
});
test("CSV: header skipped, quoted commas kept, weights read", () => {
  const r = imp.parseWheelFile('name,weight\n"Smith, Jo",3\nAva,2\nBen\nZed,abc\nBig,500');
  assert.deepEqual(r.names, ["Smith, Jo", "Ava", "Ben", "Zed", "Big"]);
  assert.deepEqual(r.weights, { "Smith, Jo": 3, Ava: 2, Big: 100 });
});
test("BOM, semicolons and tabs", () => {
  assert.deepEqual(imp.parseWheelFile("﻿Ava;2\nBen;1").names, ["Ava", "Ben"]);
  assert.deepEqual(imp.parseWheelFile("Ava\t4\nBen\t1").weights, { Ava: 4, Ben: 1 });
});
test("max entries respected", () => {
  assert.equal(imp.parseWheelFile(Array.from({ length: 300 }, (_, i) => `n${i}`).join("\n"), 200).names.length, 200);
});
test("templates: unique slugs, 40-80 word direct answers, 5+ steps, FAQ, preset 2+ lines", () => {
  const slugs = new Set();
  for (const t of tpl.WHEEL_TEMPLATES) {
    assert.ok(!slugs.has(t.slug)); slugs.add(t.slug);
    const words = t.inShort.trim().split(/\s+/).length;
    assert.ok(words >= 40 && words <= 80, `${t.slug} inShort has ${words} words`);
    assert.ok(t.faq.length >= 5 && t.howTo.length >= 4 && t.preset.split("\n").length >= 2);
    assert.ok(t.title.length <= 70, `${t.slug} title length`);
    assert.ok(t.description.length <= 200);
    assert.ok(/^[a-z_]+$/.test(t.pageId));
  }
});
console.log(`wheel-regression: ${passed} tests passed`);
