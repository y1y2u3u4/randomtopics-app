import assert from "node:assert/strict";
import { load } from "./lib/load-typescript.mjs";

const lib = load("src/lib/generators/aiPrompt.ts");
const rng = load("src/lib/randomGenerators.ts");
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test("three modes with targets, presets and unique ids", () => {
  assert.deepEqual(lib.MODES.map((m) => m.id), ["image", "video", "writing"]);
  for (const m of lib.MODES) {
    assert.ok(m.targets.length >= 2 && m.presets.length >= 4, m.id);
    const fids = m.fields.map((f) => f.id);
    assert.equal(new Set(fids).size, fids.length, `${m.id} field ids`);
    for (const f of m.fields) assert.equal(new Set(f.options.map((o) => o.id)).size, f.options.length, `${m.id}.${f.id}`);
    for (const p of m.presets) {
      for (const [fid, ids] of Object.entries(p.picks)) {
        const f = m.fields.find((x) => x.id === fid);
        assert.ok(f, `${m.id}/${p.id} unknown field ${fid}`);
        assert.ok(f.multi || ids.length <= 1, `${m.id}/${p.id} single field ${fid}`);
        for (const id of ids) assert.ok(f.options.some((o) => o.id === id), `${m.id}/${p.id} ${fid}:${id}`);
      }
      for (const t of m.targets) {
        const out = lib.buildPrompt(m.id, p.idea, p.picks, t.id);
        assert.ok(out.includes(p.idea), `${m.id}/${p.id}/${t.id} keeps idea`);
        assert.ok(!/undefined|null|\s,|,,|\.\./.test(out), `${m.id}/${p.id}/${t.id} clean: ${out}`);
      }
    }
  }
});

test("midjourney uses --ar and --no; sd has negative prompt; chatgpt plain", () => {
  const picks = { style: ["photo"], aspect: ["16:9"], avoid: ["text", "watermark"] };
  const mj = lib.buildPrompt("image", "a cat", picks, "midjourney");
  assert.match(mj, /^photorealistic photo of a cat/);
  assert.match(mj, / --ar 16:9 --no text, watermark$/);
  const sd = lib.buildPrompt("image", "a cat", picks, "sd");
  assert.match(sd, /\nNegative prompt: text, watermark, lowres/);
  const gpt = lib.buildPrompt("image", "a cat", picks, "chatgpt");
  assert.match(gpt, /^Create a photorealistic photo of a cat\./);
  assert.match(gpt, /Aspect ratio: 16:9 \(landscape\)\. Avoid: text, watermark\.$/);
  assert.ok(!gpt.includes("--"));
});

test("video sound line only for sound target", () => {
  const picks = { duration: ["8"], aspect: ["9:16"], style: ["cinematic"], shot: ["wide"], sound: ["ambient"] };
  const a = lib.buildPrompt("video", "waves at dawn", picks, "sound");
  const b = lib.buildPrompt("video", "waves at dawn", picks, "silent");
  assert.match(a, /^An 8-second 9:16 cinematic live-action video\. Wide shot of waves at dawn\./);
  assert.match(a, /Sound: natural ambient sound\./);
  assert.ok(!b.includes("Sound:"));
});

test("writing structured and paragraph", () => {
  const picks = { task: ["email"], role: ["copywriter"], audience: ["customers"], tone: ["friendly", "concise"], length: ["100"], extras: ["cta"] };
  const s = lib.buildPrompt("writing", "our new app", picks, "structured");
  assert.equal(s.split("\n")[0], "Role: Act as a senior copywriter.");
  assert.ok(s.includes("Task: Write an email about our new app."));
  assert.ok(s.includes("Tone: friendly and concise."));
  const p = lib.buildPrompt("writing", "our new app", picks, "paragraph");
  assert.ok(!p.includes("\n"));
  assert.ok(p.startsWith("Act as a senior copywriter. Write an email about our new app for potential customers."));
});

test("empty idea falls back, empty picks still valid", () => {
  for (const m of lib.MODES) for (const t of m.targets) {
    const out = lib.buildPrompt(m.id, "   ", {}, t.id);
    assert.ok(out.includes(m.defaultIdea), `${m.id}/${t.id}`);
    assert.ok(out.length > 10);
  }
});

test("toggle: single switches/clears, multi adds/removes, unknown ignored", () => {
  let p = {};
  p = lib.togglePick("image", p, "style", "anime");
  p = lib.togglePick("image", p, "style", "photo");
  assert.deepEqual(p.style, ["photo"]);
  p = lib.togglePick("image", p, "style", "photo");
  assert.deepEqual(p.style, []);
  p = lib.togglePick("image", p, "mood", "cozy");
  p = lib.togglePick("image", p, "mood", "epic");
  assert.deepEqual(p.mood, ["cozy", "epic"]);
  p = lib.togglePick("image", p, "mood", "cozy");
  assert.deepEqual(p.mood, ["epic"]);
  assert.equal(lib.togglePick("image", p, "nope", "x"), p);
});

test("surprise keeps locked fields and is deterministic per seed", () => {
  const base = lib.defaultState("image").picks;
  const a = lib.surprisePicks("image", base, rng.createRng(42));
  const b = lib.surprisePicks("image", base, rng.createRng(42));
  assert.deepEqual(a, b);
  assert.deepEqual(a.aspect, base.aspect);
  assert.deepEqual(a.avoid, base.avoid);
  assert.equal(a.style.length, 1);
});

test("default state matches a preset and has huge combination counts", () => {
  for (const m of lib.MODES) {
    const s = lib.defaultState(m.id);
    assert.ok(m.presets.some((p) => p.idea === s.idea), m.id);
    assert.ok(lib.combos(m.id) > 1e6, `${m.id} combos`);
  }
});

console.log(`ai-prompt regression: ${passed} passed`);
