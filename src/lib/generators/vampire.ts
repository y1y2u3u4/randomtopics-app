import data from "@/data/generators/vampireNames.json";
import { comboGenerator, pick } from "./core";
import { GENDER_FILTER } from "./dnd";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export type VampStyle = "classic" | "modern" | "ancient";
type Gender = "male" | "female" | "neutral";
type Format = "full" | "title" | "first";
interface First { name: string; style: VampStyle; gender: Gender; feel: string }
interface Surname { name: string; style: VampStyle }
interface Place { name: string; note: string }
interface Extra { format: Format; surname: Surname | null; title: string; place: Place | null }

export const VAMPIRE_FIRST = data.first as First[];
export const VAMPIRE_SURNAMES = data.surnames as Surname[];
export const VAMPIRE_TITLES = data.titles as Record<Gender, string[]>;
export const VAMPIRE_PLACES = data.places as Place[];
const surBy = new Map(VAMPIRE_SURNAMES.map((s) => [s.name, s]));
const placeBy = new Map(VAMPIRE_PLACES.map((p) => [p.name, p]));

export const VAMPIRE_STYLES: { id: VampStyle; label: string; short: string }[] = [
  { id: "classic", label: "🦇 Classic gothic", short: "Classic gothic" },
  { id: "modern", label: "🌃 Modern", short: "Modern" },
  { id: "ancient", label: "🏺 Ancient", short: "Ancient" },
];

export const vampireFilters: FilterGroup[] = [
  GENDER_FILTER,
  { id: "style", label: "Style", multi: true, options: VAMPIRE_STYLES.map((s) => ({ value: s.id, label: s.label })) },
  {
    id: "format",
    label: "Format",
    options: [
      { value: "full", label: "First name + surname" },
      { value: "title", label: "With title (Countess … of …)" },
      { value: "first", label: "First name only" },
    ],
  },
];

const formatOf = (v?: string): Format => (v === "title" || v === "first" ? v : "full");

export const vampireGenerator = comboGenerator<First, Extra>({
  items: VAMPIRE_FIRST,
  baseKey: (f) => f.name,
  facets: { gender: (f) => [f.gender], style: (f) => [f.style] },
  extra: (f, rng, filters) => {
    const format = formatOf(filters.format?.[0]);
    if (format === "first") return { format, surname: null, title: "", place: null };
    const surname = pick(VAMPIRE_SURNAMES.filter((s) => s.style === f.style), rng);
    if (format === "full") return { format, surname, title: "", place: null };
    return { format, surname, title: pick(VAMPIRE_TITLES[f.gender], rng), place: pick(VAMPIRE_PLACES, rng) };
  },
  extraKey: (e) => [e.format, e.surname?.name ?? "", e.title, e.place?.name ?? ""].join("~"),
  extraFromKey: (f, key) => {
    const [format, sur, title, place] = key.split("~");
    if (format !== "full" && format !== "title" && format !== "first") return null;
    if (format === "first") return { format, surname: null, title: "", place: null };
    const surname = surBy.get(sur);
    if (!surname || surname.style !== f.style) return null;
    if (format === "full") return { format, surname, title: "", place: null };
    const p = placeBy.get(place);
    if (!p || !VAMPIRE_TITLES[f.gender].includes(title)) return null;
    return { format, surname, title, place: p };
  },
  toResult: (f, e) => {
    const base = [e.title, f.name, e.surname?.name].filter(Boolean).join(" ");
    return {
      title: e.place ? `${base} of ${e.place.name}` : base,
      subtitle: `🦇 ${VAMPIRE_STYLES.find((s) => s.id === f.style)?.short} · ${f.gender}`,
      detail: [`${f.name}: ${f.feel}`, e.place ? `${e.place.name}: ${e.place.note}` : ""].filter(Boolean).join(" · "),
    };
  },
  variety: (filters) => {
    const f = formatOf(filters.format?.[0]);
    return f === "first" ? 1 : f === "full" ? Math.floor(VAMPIRE_SURNAMES.length / 3) : Math.floor(VAMPIRE_SURNAMES.length / 3) * VAMPIRE_PLACES.length * 10;
  },
});
