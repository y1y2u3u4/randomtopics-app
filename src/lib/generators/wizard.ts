import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Wizard names are built from an old-sounding root (the school of magic it
// hints at) plus an ending, then given an epithet or the tower they study in.
// Every part has a meaning, so a name can be read back as a short backstory.
export type WizardSchool = "elemental" | "arcane" | "necromancer" | "druid" | "illusionist";
type Gender = "male" | "female" | "neutral";
interface Part { part: string; meaning: string }
interface WizardName { name: string; school: WizardSchool; gender: Gender; meaning: string }
interface Epithet { text: string; school: WizardSchool; meaning: string }

const parts = (list: string): Part[] => list.split(", ").map((p) => { const [part, meaning] = p.split(":"); return { part, meaning }; });

const ROOTS: Record<WizardSchool, Part[]> = {
  elemental: parts("Ignar:fire, Pyr:flame, Aquil:water, Ventar:wind, Terr:earth, Fulg:lightning, Calor:heat, Nimb:storm cloud, Glac:ice, Sol:sun"),
  arcane: parts("Lex:word, Scrib:writing, Arcan:secret, Liber:book, Numer:number, Astr:star, Sigil:sign, Codex:old book, Run:rune, Quill:pen"),
  necromancer: parts("Mort:death, Noct:night, Umbr:shadow, Ossar:bone, Cinar:grave ash, Lich:corpse, Tenebr:darkness, Vesper:dusk, Thanat:death-song, Sepul:tomb"),
  druid: parts("Silv:forest, Quer:oak, Fenn:fern, Bram:bramble, Lun:moon, Ros:dew, Verd:green, Hollin:holly, Ash:ash tree, Faun:wild"),
  illusionist: parts("Mir:mirror, Vel:veil, Fantas:vision, Somn:dream, Prism:prism, Spect:ghost-image, Lumin:light, Echo:echo, Mask:mask, Iris:rainbow"),
};

const ENDINGS: Record<Gender, Part[]> = {
  male: parts("ius:keeper, an:master, eth:son, orin:speaker, us:bearer, ander:walker"),
  female: parts("a:daughter, ara:keeper, ine:singer, elle:little, wyn:fair, essa:seeker"),
  neutral: parts("is:seeker, en:born, el:sign, yr:of"),
};

const join = (root: string, end: string) => {
  const r = root.replace(/[aeiou]$/, (v) => (/^[aeiouy]/.test(end) ? "" : v));
  return r + (/[aeiou]$/.test(r) && /^[aeiou]/.test(end) ? end.slice(1) : end);
};

export const WIZARD_NAMES: WizardName[] = (Object.keys(ROOTS) as WizardSchool[]).flatMap((school) =>
  ROOTS[school].flatMap((r) =>
    (Object.keys(ENDINGS) as Gender[]).flatMap((gender) =>
      ENDINGS[gender].map((e) => ({ name: join(r.part, e.part), school, gender, meaning: `${r.meaning} ${e.meaning}` })),
    ),
  ),
).filter((n, i, all) => all.findIndex((m) => m.name === n.name) === i);

const epithets = (school: WizardSchool, list: string): Epithet[] => list.split("; ").map((e) => { const [text, meaning] = e.split(" = "); return { text, school, meaning }; });

export const WIZARD_EPITHETS: Epithet[] = [
  ...epithets("elemental", "the Stormbound = once survived a lightning strike and kept the spark; the Ember-Handed = cannot touch paper without scorching it; of the Seventh Flame = keeper of a fire lit before the kingdom was founded; the Tidecaller = can pull the sea back for one breath; Ashcloak = wears a robe that smoulders but never burns; the Frost-Tongued = every word comes out as cold mist; of the Glass Desert = turned a battlefield into glass; the Windwright = builds castles out of moving air; Thunderstaff = staff cracks like thunder when struck on stone; the Quake-Born = born during an earthquake that split a city"),
  ...epithets("arcane", "the Archivist = has read every book in the Great Library twice; of the Silver Tower = teaches in the oldest school of magic; the Runewright = carves spells into stone that last a thousand years; Inkfinger = fingers stained by a century of spell-writing; the Lexicant = can unmake a spell by saying its true name; of the Hundred Keys = holds keys to locked rooms no one remembers; the Starreader = predicts storms and wars from the night sky; the Unwritten = erased their own name from every record; of the Sealed Library = guards the books too dangerous to read; the Cipher = speaks only in riddles and equations"),
  ...epithets("necromancer", "the Pale = has not seen the sun in forty years; Gravewhisper = hears the dead talking under the ground; of the Barrow Hills = lives among the ancient burial mounds; the Bone-Singer = can make old bones dance; Nightveil = is invisible on moonless nights; the Last Breath = arrives at deathbeds before the healer does; of the Black Lantern = carries a lamp that gives off darkness; the Hollow-Eyed = traded sight for the power to see ghosts; Ravenkeeper = sends messages with dead crows; the Unburied = was declared dead three times"),
  ...epithets("druid", "the Green = moss grows wherever they sleep; Oakheart = swore an oath to a tree older than the world; of the Mistwood = lives in a forest that hides itself; the Moon-Touched = grows stronger as the moon fills; Thornweaver = grows walls of thorns in a single night; the Wild-Spoken = speaks with wolves and foxes; of the Standing Stones = guards a ring of stones that hum at midnight; the Rootbound = cannot leave their forest for more than a day; Dewfoot = leaves no tracks, only dew; the Seedkeeper = carries a seed from every extinct tree"),
  ...epithets("illusionist", "the Many-Faced = no two people describe them the same way; of the Mirror Court = performs for kings who never know what is real; the Dreamweaver = visits people in their sleep; Velvet-Voice = makes any lie sound true; the Vanishing = disappears halfway through every conversation; of the Painted Hall = lives in a palace that may not exist; the Lantern-Eyed = can make you see colours that do not exist; Smokeword = speaks in shapes made of smoke; the Twice-Seen = always appears in two places at once; the Masker = has a mask for every person they have ever met"),
];

export const WIZARD_SCHOOLS: { id: WizardSchool; label: string; short: string }[] = [
  { id: "elemental", label: "🔥 Elemental", short: "Elemental" },
  { id: "arcane", label: "📜 Arcane scholar", short: "Arcane scholar" },
  { id: "necromancer", label: "💀 Necromancer", short: "Necromancer" },
  { id: "druid", label: "🌿 Druid / nature", short: "Druid" },
  { id: "illusionist", label: "🪞 Illusionist", short: "Illusionist" },
];

export const wizardFilters: FilterGroup[] = [
  { id: "school", label: "School of magic", multi: true, options: WIZARD_SCHOOLS.map((s) => ({ value: s.id, label: s.label })) },
  GENDER_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "epithet", label: "Name + epithet" },
      { value: "first", label: "First name only" },
    ],
  },
];

const epithetBy = new Map(WIZARD_EPITHETS.map((e) => [e.text, e]));

export const wizardGenerator = comboGenerator<WizardName, Epithet | null>({
  items: WIZARD_NAMES,
  baseKey: (n) => n.name,
  facets: { school: (n) => [n.school], gender: (n) => [n.gender] },
  extra: (n, rng, filters) => ((filters.style?.[0] ?? "epithet") === "epithet" ? pick(WIZARD_EPITHETS.filter((e) => e.school === n.school), rng) : null),
  extraKey: (e) => e?.text ?? "",
  extraFromKey: (n, key) => {
    if (!key) return null;
    const e = epithetBy.get(key);
    return e && e.school === n.school ? e : null;
  },
  toResult: (n, e) => ({
    title: e ? `${n.name} ${e.text}` : n.name,
    subtitle: `🪄 ${WIZARD_SCHOOLS.find((s) => s.id === n.school)?.short} · ${n.gender}`,
    detail: [`${n.name}: "${n.meaning}"`, e ? `${e.text}: ${e.meaning}` : ""].filter(Boolean).join(" · "),
  }),
  variety: (filters) => ((filters.style?.[0] ?? "epithet") === "epithet" ? Math.floor(WIZARD_EPITHETS.length / WIZARD_SCHOOLS.length) : 1),
});
