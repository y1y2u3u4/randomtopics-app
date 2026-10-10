import data from "@/data/generators/vikingNames.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";
import type { Rng } from "@/lib/randomGenerators";

interface VikingName { name: string; ascii: string; gender: "male" | "female"; meaning: string }
interface Byname { text: string; meaning: string }
interface Extra { father: VikingName | null; byname: Byname | null }

export const VIKING_NAMES = data.names as VikingName[];
export const BYNAMES = data.bynames as Byname[];

// Patronymics are only formed from fathers' names ending in a consonant, where
// the simple genitive -s (Harald → Haraldsson) is correct in modern spelling.
const FATHERS = VIKING_NAMES.filter((n) => n.gender === "male" && /[^aeiouyAEIOUY]$/.test(n.ascii));
const byAscii = new Map(VIKING_NAMES.map((n) => [n.ascii, n]));
const bynameByText = new Map(BYNAMES.map((b) => [b.text, b]));

export function patronymic(father: string, gender: "male" | "female"): string {
  const stem = father.endsWith("s") ? father : `${father}s`;
  return gender === "male" ? `${stem}son` : `${stem}dottir`;
}

export const vikingFilters: FilterGroup[] = [
  {
    id: "gender",
    label: "Gender",
    multi: true,
    options: [
      { value: "male", label: "⚔️ Male" },
      { value: "female", label: "🛡️ Female" },
    ],
  },
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "full", label: "Name + patronymic + byname" },
      { value: "byname", label: "Name + byname" },
      { value: "patronymic", label: "Name + patronymic" },
      { value: "plain", label: "First name only" },
    ],
  },
];

function extraFor(style: string, rng: Rng): Extra {
  return {
    father: style === "full" || style === "patronymic" ? pick(FATHERS, rng) : null,
    byname: style === "full" || style === "byname" ? pick(BYNAMES, rng) : null,
  };
}

export const vikingGenerator = comboGenerator<VikingName, Extra>({
  items: VIKING_NAMES,
  baseKey: (n) => n.ascii,
  facets: { gender: (n) => [n.gender] },
  extra: (_n, rng, filters) => extraFor(filters.style?.[0] ?? "full", rng),
  extraKey: (e) => `${e.father?.ascii ?? ""}|${e.byname?.text ?? ""}`,
  extraFromKey: (_n, key) => {
    const [father, byname] = key.split("|");
    const e: Extra = { father: father ? byAscii.get(father) ?? null : null, byname: byname ? bynameByText.get(byname) ?? null : null };
    if ((father && !e.father) || (byname && !e.byname)) return null;
    return e;
  },
  toResult: (n, e) => {
    const parts = [n.ascii];
    if (e.father) parts.push(patronymic(e.father.ascii, n.gender));
    if (e.byname) parts.push(e.byname.text);
    const detail = [`${n.ascii}: ${n.meaning}`];
    if (e.father) detail.push(`${n.gender === "male" ? "son" : "daughter"} of ${e.father.ascii} (${e.father.meaning})`);
    if (e.byname) detail.push(`${e.byname.text}: ${e.byname.meaning}`);
    return {
      title: parts.join(" "),
      subtitle: `Old Norse: ${n.name} · ${n.gender}`,
      detail: detail.join(" · "),
    };
  },
  variety: (filters) => {
    const style = filters.style?.[0] ?? "full";
    return (style === "full" || style === "patronymic" ? FATHERS.length : 1) * (style === "full" || style === "byname" ? BYNAMES.length : 1);
  },
});
