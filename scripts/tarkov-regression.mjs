// Tests for /tarkov-random-weapon-generator: weapon/ammo data, kit rolls, locks, share links, daily kit.
// Run: node scripts/tarkov-regression.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "./lib/load-typescript.mjs";

const t = load("src/lib/tarkov.ts");
const rg = load("src/lib/randomGenerators.ts");
const { WEAPONS, AMMO, MAPS, CHALLENGES, CLASSES, DEFAULT_OPTIONS } = t;
let passed = 0;
const test = (name, fn) => { try { fn(); passed++; } catch (e) { console.error(`x ${name}`); throw e; } };

test("178 weapons with unique ids, known classes and an image file each", () => {
  assert.equal(WEAPONS.length, 178);
  assert.equal(new Set(WEAPONS.map((w) => w.id)).size, WEAPONS.length);
  const classes = new Set(CLASSES.map((c) => c.value));
  for (const w of WEAPONS) {
    assert.ok(classes.has(w.cls), w.name);
    assert.ok(fs.existsSync(`public/tarkov/weapons/${w.id}.webp`), `image for ${w.id}`);
    if (w.cls === "melee") assert.equal(w.caliber, "", w.name);
    else assert.ok(w.caliber, w.name);
  }
  for (const n of ["M4A1", "AK-74N", "Mosin Infantry", "SV-98", "MP7A1", "Glock 17", "RSh-12", "Saiga-12K"]) assert.ok(WEAPONS.some((w) => w.name === n), n);
  assert.ok(!WEAPONS.some((w) => /blicky/i.test(w.name)));
});

test("every gun caliber has ammo, and every round's name matches its caliber", () => {
  const cals = new Set(AMMO.map((a) => a.caliber));
  for (const w of WEAPONS) if (w.cls !== "melee") assert.ok(cals.has(w.caliber), `${w.name} ${w.caliber}`);
  assert.equal(new Set(AMMO.map((a) => a.id)).size, AMMO.length, "unique ammo ids");
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const a of AMMO) {
    assert.ok(a.dmg >= 0 && a.pen >= 0, a.name);
    // Round names start with their caliber (e.g. "5.56x45mm M855A1" under "5.56x45mm NATO"); compare the first token.
    const head = norm(a.name.split(" ")[0]);
    assert.ok(norm(a.caliber.split(" ")[0]).startsWith(head), `${a.name} under ${a.caliber}`);
  }
});

test("13 maps and 20 challenges with unique ids", () => {
  assert.equal(MAPS.length, 13);
  assert.equal(new Set(MAPS.map((m) => m.id)).size, 13);
  assert.equal(CHALLENGES.length, 20);
  assert.equal(new Set(CHALLENGES.map((c) => c.id)).size, 20);
});

test("rolls respect classes, caliber and options", () => {
  for (let s = 1; s < 400; s++) {
    const k = t.rollKit(DEFAULT_OPTIONS, rg.createRng(s));
    assert.ok(DEFAULT_OPTIONS.classes.includes(k.weapon.cls));
    assert.ok(k.ammo && k.ammo.caliber === k.weapon.caliber);
    assert.ok(k.att && k.map);
    assert.equal(k.challenges.length, 1);
    assert.equal(k.sidearm, null);
  }
  const pistols = { ...DEFAULT_OPTIONS, classes: ["pistol"], sidearm: true, challenges: 3 };
  for (let s = 1; s < 100; s++) {
    const k = t.rollKit(pistols, rg.createRng(s));
    assert.equal(k.weapon.cls, "pistol");
    assert.equal(k.sidearm, null, "no sidearm when the primary is a pistol");
    assert.ok(k.att.o <= 2, "pistols only get close-range optics");
    assert.equal(new Set(k.challenges).size, 3);
    assert.equal(k.att.s, undefined, "no stock rule on pistols");
  }
  const melee = t.rollKit({ ...DEFAULT_OPTIONS, classes: ["melee"], melee: true }, rg.createRng(5));
  assert.equal(melee.weapon.cls, "melee");
  assert.equal(melee.ammo, null); assert.equal(melee.att, null); assert.equal(melee.melee, null);
  assert.equal(t.rollKit({ ...DEFAULT_OPTIONS, classes: [] }, rg.createRng(1)), null);
});

test("ammo tiers pick from the low or high third by penetration", () => {
  const w = WEAPONS.find((x) => x.name === "M4A1");
  const list = t.ammoFor(w).map((a) => a.pen).sort((a, b) => a - b);
  for (let s = 1; s < 60; s++) {
    assert.ok(t.rollAmmo(w, "budget", rg.createRng(s)).pen <= list[Math.ceil(list.length / 3) - 1]);
    assert.ok(t.rollAmmo(w, "meta", rg.createRng(s)).pen >= list[list.length - Math.ceil(list.length / 3)]);
  }
});

test("locks keep slots; locked ammo is replaced when the caliber changes", () => {
  const base = t.rollKit({ ...DEFAULT_OPTIONS, sidearm: true }, rg.createRng(42));
  const next = t.rollKit({ ...DEFAULT_OPTIONS, sidearm: true }, rg.createRng(7), base, new Set(["weapon", "map", "sidearm"]));
  assert.equal(next.weapon.id, base.weapon.id);
  assert.equal(next.map, base.map);
  assert.equal(next.sidearm.id, base.sidearm.id);
  for (let s = 1; s < 80; s++) {
    const k = t.rollKit(DEFAULT_OPTIONS, rg.createRng(s), base, new Set(["ammo"]));
    assert.equal(k.ammo.caliber, k.weapon.caliber);
    if (k.weapon.caliber === base.weapon.caliber) assert.equal(k.ammo.id, base.ammo.id);
  }
  const r = t.rerollSlot(base, "map", { ...DEFAULT_OPTIONS, sidearm: true }, rg.createRng(3));
  assert.equal(r.weapon.id, base.weapon.id); assert.equal(r.ammo.id, base.ammo.id);
  const rw = t.rerollSlot(base, "weapon", DEFAULT_OPTIONS, rg.createRng(3));
  assert.notEqual(rw.weapon.id, base.weapon.id); assert.equal(rw.map, base.map);
});

test("share links round-trip the exact kit and reject bad input", () => {
  for (let s = 1; s < 200; s++) {
    const k = t.rollKit({ ...DEFAULT_OPTIONS, classes: CLASSES.map((c) => c.value), sidearm: true, melee: true, challenges: 3 }, rg.createRng(s));
    const back = t.kitFromParams(new URLSearchParams(t.kitToParams(k).toString()));
    assert.equal(t.kitText(back), t.kitText(k));
  }
  assert.equal(t.kitFromParams(new URLSearchParams("w=nope")), null);
  const bad = t.kitFromParams(new URLSearchParams("w=m4a1&am=9x19mm-pst-gzh&att=o9m1z3&map=moon&ch=hipfire,xx"));
  assert.equal(bad.weapon.name, "M4A1");
  assert.equal(bad.ammo, null, "ammo of another caliber is dropped");
  assert.deepEqual(bad.att, { m: 1 });
  assert.equal(bad.map, null);
  assert.deepEqual(bad.challenges, ["hipfire"]);
});

test("daily kit is stable per day and differs between days", () => {
  const a = t.dailyKit(20407), b = t.dailyKit(20407), c = t.dailyKit(20408);
  assert.equal(t.kitText(a), t.kitText(b));
  assert.notEqual(t.kitText(a), t.kitText(c));
  assert.equal(a.challenges.length, 2);
  assert.ok(a.map);
});

console.log(`tarkov regression: ${passed} passed`);
