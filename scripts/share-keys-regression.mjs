// Every GeneratorUI generator must survive the share-link round trip:
// generate -> encodeShareKeys -> URLSearchParams -> decodeShareKeys -> resolve.
// 2026-11-26: keys containing "~" (business, megacorp, pirate, vampire, dragonborn,
// real names) were split apart by the "~" joiner, so those share links showed nothing.
// Run: node scripts/share-keys-regression.mjs (also part of generators:test)
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "./lib/load-typescript.mjs";

const { encodeShareKeys, decodeShareKeys } = load("src/lib/generators/shareKeys.ts");
let generators = 0, keysChecked = 0, tilde = 0;

test("encode/decode is lossless for awkward keys and tolerates malformed input", () => {
  const keys = ["a~b~c", "100%|x", "plain", "x|y~z", "%7E", "é~ü"];
  const qs = new URLSearchParams({ r: encodeShareKeys(keys) }).toString();
  assert.deepEqual(decodeShareKeys(new URLSearchParams(qs).get("r")), keys);
  assert.deepEqual(decodeShareKeys("ok~bad%E0%A4%A"), ["ok", "bad%E0%A4%A"]);
  assert.equal(decodeShareKeys(Array(80).fill("k").join("~")).length, 50);
});

test("every generator's results come back from a share link", () => {
  for (const file of fs.readdirSync("src/lib/generators").filter((f) => f.endsWith(".ts"))) {
    let mod;
    try { mod = load(`src/lib/generators/${file}`); } catch { continue; }
    for (const [name, g] of Object.entries(mod)) {
      if (!g || typeof g.generate !== "function" || typeof g.resolve !== "function") continue;
      let results = [];
      try { for (let seed = 1; seed <= 6; seed++) results.push(...g.generate({}, 30, [], seed * 7919).results); } catch { continue; }
      if (!results.length || typeof results[0]?.key !== "string") continue;
      generators++;
      const batch = results.slice(0, 50);
      const qs = new URLSearchParams({ r: encodeShareKeys(batch.map((r) => r.key)) }).toString();
      const back = decodeShareKeys(new URLSearchParams(qs).get("r"));
      assert.deepEqual(back, batch.map((r) => r.key), `${file}:${name} keys`);
      for (const r of results) {
        if (r.key.includes("~")) tilde++;
        assert.deepEqual(g.resolve(r.key, {}), r, `${file}:${name} resolves ${r.key}`);
        keysChecked++;
      }
    }
  }
  assert.ok(generators >= 20, `found ${generators} generators`);
  assert.ok(tilde > 0, "covers keys that contain ~");
});

test("GeneratorUI uses the shared encoder, not a bare ~ split/join", () => {
  const src = fs.readFileSync("src/components/generators/GeneratorUI.tsx", "utf8");
  assert.match(src, /decodeShareKeys\(params\.get\("r"\)/);
  assert.match(src, /encodeShareKeys\(nextResults\.map/);
  assert.doesNotMatch(src, /\.split\("~"\)|\.join\("~"\)/);
});

function test(name, fn) { fn(); console.log(`PASS ${name}`); }
console.log(`share-keys regression: ${generators} generators, ${keysChecked} keys (${tilde} with ~)`);
