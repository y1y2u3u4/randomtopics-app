import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/generators/mixtape.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test("styles and examples are valid", () => {
  assert.equal(new Set(lib.STYLES.map((s) => s.id)).size, lib.STYLES.length);
  assert.ok(lib.EXAMPLES.length >= 3);
  for (const ex of lib.EXAMPLES) {
    assert.ok(lib.STYLES.some((s) => s.id === ex.mix.style), ex.id);
    assert.ok(ex.mix.tracks.length >= lib.MIN_SUGGESTED && ex.mix.tracks.length <= lib.MAX_TRACKS, ex.id);
    for (const t of ex.mix.tracks) assert.ok(t.title && t.artist, ex.id);
  }
});

test("encode/decode roundtrip incl. unicode", () => {
  for (const ex of lib.EXAMPLES) assert.deepEqual(lib.decodeMix(lib.encodeMix(ex.mix)), lib.normalize(ex.mix));
  const m = { style: "midnight", title: "Für dich 💌", to: "Ana", from: "Léo", note: "ありがとう — x", tracks: [{ title: "Song & \"quote\"", artist: "Ärtist", url: "https://open.spotify.com/track/abc" }] };
  const code = lib.encodeMix(m);
  assert.match(code, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(lib.decodeMix(code), lib.normalize(m));
});

test("url safety and normalize caps", () => {
  assert.equal(lib.safeMusicUrl("https://www.youtube.com/watch?v=x"), "https://www.youtube.com/watch?v=x");
  assert.equal(lib.safeMusicUrl("http://open.spotify.com/x"), undefined);
  assert.equal(lib.safeMusicUrl("https://evil.com/spotify.com"), undefined);
  assert.equal(lib.safeMusicUrl("https://open.spotify.com.evil.com/x"), undefined);
  assert.equal(lib.safeMusicUrl("javascript:alert(1)"), undefined);
  assert.equal(lib.safeMusicUrl("https://user:pw@open.spotify.com/x"), undefined);
  const many = { tracks: Array.from({ length: 20 }, (_, i) => ({ title: `T${i}`.padEnd(100, "x"), artist: "A", url: "https://evil.com" })) };
  const n = lib.normalize(many);
  assert.equal(n.tracks.length, lib.MAX_TRACKS);
  assert.ok(n.tracks.every((t) => t.title.length <= lib.LIMITS.song && !t.url));
  assert.equal(lib.normalize({ tracks: [{ title: "", artist: "" }, { title: "a", artist: "" }] }).tracks.length, 1);
  assert.equal(lib.styleById(lib.normalize({ style: "nope", tracks: [] }).style).id, lib.STYLES.find((s) => s.id === lib.styleById("nope").id).id);
});

test("decode rejects junk; location parsing", () => {
  for (const bad of ["", "abc", "!!!", "a".repeat(7000), lib.encodeMix({ style: "classic", title: "x", to: "", from: "", note: "", tracks: [] })]) assert.equal(lib.decodeMix(bad), null);
  const code = lib.encodeMix(lib.EXAMPLES[0].mix);
  assert.ok(lib.mixFromLocation(`#m=${code}`, ""));
  assert.ok(lib.mixFromLocation("", `?m=${code}`));
  assert.equal(lib.mixFromLocation("", ""), null);
});

test("sides split and svg escaping", () => {
  const tr = (n) => Array.from({ length: n }, (_, i) => ({ title: `t${i}`, artist: "a" }));
  assert.deepEqual(lib.sides(tr(7)).map((x) => x.length), [4, 3]);
  assert.deepEqual(lib.sides(tr(1)).map((x) => x.length), [1, 0]);
  const svg = lib.cassetteSvg(lib.normalize({ title: "<script>&", to: "\"x\"", from: "y", tracks: tr(2) }));
  assert.ok(svg.startsWith("<svg") && !svg.includes("<script>") && svg.includes("&lt;script&gt;&amp;"));
  assert.ok(lib.cassetteSvg(lib.normalize({ tracks: tr(1) }), { spin: true }).includes("mt-reel"));
  const links = lib.searchLinks({ title: "A B", artist: "C" });
  assert.ok(links.youtube.startsWith("https://www.youtube.com/results?search_query=") && links.spotify.startsWith("https://open.spotify.com/search/"));
});

console.log(`mixtape regression: ${passed} tests passed`);
