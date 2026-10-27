import { createRng } from "@/lib/randomGenerators";
import type { FilterGroup, FilterState, GeneratorResult } from "@/components/generators/GeneratorUI";

// Grammar-safe random sentences: every subject is singular and every verb is
// stored as past/base pairs, so templates never need agreement fixes. A result
// key records which template and which word of each list was used, so shared
// links rebuild the exact sentence.

const split = (s: string) => s.split("|").map((x) => x.trim()).filter(Boolean);

const SUBJECT = split("the baker|my grandmother|a tired pilot|the new neighbor|our cat|a tiny robot|the mayor|a curious child|the old fisherman|an angry chef|a famous painter|the librarian|my little brother|a lost tourist|the night guard|a clumsy wizard|the teacher|a sleepy dragon|the farmer|an honest thief|the captain|a talkative parrot|my best friend|the astronaut|a shy ghost|the mail carrier|an overconfident magician|the village doctor|a hungry bear|the taxi driver");
const OBJECT = split("a giant sandwich|an old umbrella|a glowing map|the last cookie|a broken clock|a silver key|an enormous pumpkin|a secret letter|a rusty bicycle|the loudest trumpet|a jar of buttons|an empty suitcase|a purple kite|the wrong password|a tiny lantern|a stack of pancakes|a mysterious package|the only chair|a wooden spoon|a bag of marbles|a crooked painting|the final puzzle piece|a birthday cake|a heavy backpack|a very long scarf|a map of the stars|a cracked mirror|a basket of apples|a noisy alarm clock|the missing sock");
const PLACE = split("in the garden|behind the old library|on top of the hill|near the harbor|inside a quiet museum|under the bridge|at the end of the road|in the middle of the forest|beside a frozen lake|on the roof|in a crowded market|at the train station|outside the bakery|across the river|in the attic|on a deserted beach|in the town square|below the lighthouse|in the back of the classroom|at the edge of the desert");
const TIME = split("before breakfast|at midnight|during the storm|after the parade|on a rainy Tuesday|just before sunrise|in the middle of winter|while everyone was asleep|on the last day of summer|after lunch|at the stroke of noon|every single morning|late one evening|during the school play");
const ADVERB = split("quietly|suddenly|proudly|carefully|nervously|happily|slowly|loudly|gracefully|stubbornly|politely|secretly");
const VERB = split("painted|paint|carried|carry|found|find|hid|hide|borrowed|borrow|fixed|fix|dropped|drop|polished|polish|counted|count|stole|steal|delivered|deliver|forgot|forget|collected|collect|repaired|repair|tasted|taste|measured|measure|photographed|photograph|traded|trade|guarded|guard|dug up|dig up|lifted|lift|rescued|rescue");
const VERB_PAIRS: [string, string][] = Array.from({ length: VERB.length / 2 }, (_, i) => [VERB[i * 2], VERB[i * 2 + 1]]);
const INTRANS = split("laughed|disappeared|sang|waited|danced|argued|whistled|yawned|wandered|tiptoed|shouted|smiled|stumbled|napped|hummed|trembled");
const LIST = { S: SUBJECT, O: OBJECT, P: PLACE, T: TIME, A: ADVERB, V: VERB_PAIRS, I: INTRANS } as const;
type Slot = keyof typeof LIST;

interface Template { id: string; kind: "everyday" | "funny" | "story" | "question"; text: string }
// {S}=subject {V}=past verb {B}=base verb (same word as V) {O}=object {P}=place {T}=time {A}=adverb {I}=intransitive verb
const TEMPLATES: Template[] = [
  { id: "e1", kind: "everyday", text: "{S} {V} {O} {P}." },
  { id: "e2", kind: "everyday", text: "{S} {V} {O} {T}." },
  { id: "e3", kind: "everyday", text: "{S} {I} {A} {P}." },
  { id: "e4", kind: "everyday", text: "{T}, {S} {V} {O}." },
  { id: "e5", kind: "everyday", text: "{S} {I} {A} {T}." },
  { id: "e6", kind: "everyday", text: "{S} {V} {O} {A}." },
  { id: "f1", kind: "funny", text: "{S} {V} {O} and then {I} {A}." },
  { id: "f2", kind: "funny", text: "{S} {V} {O} {P} because nobody else would." },
  { id: "f3", kind: "funny", text: "Nobody believed {S} when {S2} {V2} {O} {T}." },
  { id: "f4", kind: "funny", text: "{S} {V} {O} {P}, which was a terrible idea." },
  { id: "f5", kind: "funny", text: "{T}, {S} {I} {A} and {V2} {O}." },
  { id: "f6", kind: "funny", text: "{S} promised never to {B} {O} again, but {S2} did it {T}." },
  { id: "s1", kind: "story", text: "{T}, {S} {V} {O} {P}, and nothing was ever the same." },
  { id: "s2", kind: "story", text: "The last thing {S} remembered was {O} {P}." },
  { id: "s3", kind: "story", text: "{S} {I} {A}, then {V2} {O} {P} without a word." },
  { id: "s4", kind: "story", text: "It all began when {S} {V} {O} {T}." },
  { id: "s5", kind: "story", text: "Nobody knew why {S} {V} {O} {P}." },
  { id: "q1", kind: "question", text: "Why did {S} {B} {O} {P}?" },
  { id: "q2", kind: "question", text: "What would happen if {S} {V} {O} {T}?" },
  { id: "q3", kind: "question", text: "Who saw {S} {B} {O} {P}?" },
  { id: "q4", kind: "question", text: "Did {S} really {B} {O} {T}?" },
];
const TPL = new Map(TEMPLATES.map((t) => [t.id, t]));

export const SENTENCE_KINDS: { value: string; label: string }[] = [
  { value: "everyday", label: "Everyday" }, { value: "funny", label: "Funny" }, { value: "story", label: "Story starter" }, { value: "question", label: "Question" },
];
export const sentenceFilters: FilterGroup[] = [{ id: "type", label: "Type", multi: true, options: SENTENCE_KINDS }];

// Placeholders: S, O, P, T, A, V (past), B (base of V), I; S2/V2 draw a second, independent word.
const NAMES: Record<string, { slot: Slot; part?: "past" | "base" }> = {
  S: { slot: "S" }, S2: { slot: "S" }, O: { slot: "O" }, P: { slot: "P" }, T: { slot: "T" }, A: { slot: "A" }, I: { slot: "I" },
  V: { slot: "V", part: "past" }, B: { slot: "V", part: "base" }, V2: { slot: "V", part: "past" },
};

function build(t: Template, idx: Record<string, number>): string {
  let out = t.text.replace(/\{(\w+)\}/g, (_m, name: string) => {
    const spec = NAMES[name];
    const list = LIST[spec.slot] as readonly (string | [string, string])[];
    const item = list[idx[name === "B" ? "V" : name] ?? 0];
    if (Array.isArray(item)) return spec.part === "base" ? item[1] : item[0];
    return item as string;
  });
  out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

const poolFor = (f: FilterState) => TEMPLATES.filter((t) => !(f.type?.length) || f.type.includes(t.kind));

function pickIdx(t: Template, rng: () => number): Record<string, number> {
  const idx: Record<string, number> = {};
  for (const name of t.text.matchAll(/\{(\w+)\}/g)) {
    const n = name[1] === "B" ? "V" : name[1];
    if (idx[n] === undefined) idx[n] = Math.floor(rng() * (LIST[NAMES[n].slot] as readonly unknown[]).length);
  }
  return idx;
}

const encode = (t: Template, idx: Record<string, number>) => `${t.id}.${Object.entries(idx).map(([k, v]) => `${k}_${v}`).join(".")}`;

function resultFor(t: Template, idx: Record<string, number>): GeneratorResult {
  const kindLabel = SENTENCE_KINDS.find((k) => k.value === t.kind)?.label ?? "";
  return { key: encode(t, idx), title: build(t, idx), subtitle: kindLabel };
}

export const SENTENCE_VARIETY = TEMPLATES.length * 30 * 30 * 30;

export const sentenceGenerator = {
  poolSize: (f: FilterState) => poolFor(f).length * 30 * 30 * 30,
  generate(f: FilterState, count: number, used: string[], seed: number) {
    const rng = createRng(seed);
    const pool = poolFor(f);
    const seen = new Set(used);
    const results: GeneratorResult[] = [];
    for (let guard = 0; results.length < count && guard < count * 30; guard++) {
      const t = pool[Math.floor(rng() * pool.length)];
      const r = resultFor(t, pickIdx(t, rng));
      if (seen.has(r.title) || results.some((x) => x.title === r.title)) continue;
      results.push(r);
    }
    return { results, used: [...used, ...results.map((r) => r.title)].slice(-2000) };
  },
  resolve(key: string): GeneratorResult | null {
    const [id, ...parts] = key.split(".");
    const t = TPL.get(id);
    if (!t) return null;
    const idx: Record<string, number> = {};
    for (const p of parts) { const m = /^([A-Z]\d?)_(\d+)$/.exec(p); if (m) idx[m[1]] = Number(m[2]); }
    for (const name of t.text.matchAll(/\{(\w+)\}/g)) {
      const n = name[1] === "B" ? "V" : name[1];
      const len = (LIST[NAMES[n].slot] as readonly unknown[]).length;
      if (idx[n] === undefined || idx[n] >= len) return null;
    }
    return resultFor(t, idx);
  },
};
