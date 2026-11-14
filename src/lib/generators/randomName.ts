import { comboGenerator, pick } from "./core";
import { NATIONALITIES, feminineSurname, type FakeGender } from "./fakeNames";
import { LAST_NAMES, type LastName } from "./lastNames";
import { filterBy } from "@/lib/randomGenerators";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

// First + last names for the plain "random name generator": every first name is
// a common given name for one country, every last name comes from that
// country's surname bank, so the pairs sound natural. Surnames carry meanings.

interface Item { nat: (typeof NATIONALITIES)[number]; gender: FakeGender; given: string }

const byOrigin = new Map<string, LastName[]>();
for (const l of LAST_NAMES) byOrigin.set(l.origin, [...(byOrigin.get(l.origin) ?? []), l]);
const surnamesFor = (nat: Item["nat"]) => nat.origins.flatMap((o) => byOrigin.get(o) ?? []);

export const RANDOM_NAME_ITEMS: Item[] = NATIONALITIES.flatMap((nat) =>
  (["female", "male"] as const).flatMap((gender) => nat[gender].map((given) => ({ nat, gender, given }))),
);

const NAT_ES: Record<string, string> = {
  us: "Estados Unidos", uk: "Reino Unido", ie: "Irlanda", ca: "Canadá", au: "Australia",
  mx: "México", es: "España", br: "Brasil", fr: "Francia", de: "Alemania", it: "Italia",
  nl: "Países Bajos", nordic: "Escandinavia", pl: "Polonia", ru: "Rusia", gr: "Grecia",
  il: "Israel", arab: "Mundo árabe", in: "India", cn: "China", jp: "Japón", kr: "Corea",
  vn: "Vietnam", ph: "Filipinas",
};

export const randomNameFilters: FilterGroup[] = [
  { id: "gender", label: "Gender", multi: true, options: [{ value: "female", label: "Female" }, { value: "male", label: "Male" }] },
  { id: "origin", label: "Origin", multi: true, options: NATIONALITIES.map((n) => ({ value: n.id, label: `${n.flag} ${n.label}` })) },
  { id: "style", label: "Show", options: [{ value: "full", label: "First + last name" }, { value: "first", label: "First name only" }, { value: "last", label: "Last name only" }] },
];

export function randomNameFiltersFor(locale: "en" | "es" = "en"): FilterGroup[] {
  if (locale === "en") return randomNameFilters;
  return [
    { id: "gender", label: "Género", multi: true, options: [{ value: "female", label: "Mujer" }, { value: "male", label: "Hombre" }] },
    { id: "origin", label: "Origen", multi: true, options: NATIONALITIES.map((n) => ({ value: n.id, label: `${n.flag} ${NAT_ES[n.id] ?? n.label}` })) },
    { id: "style", label: "Mostrar", options: [{ value: "full", label: "Nombre y apellido" }, { value: "first", label: "Solo el nombre" }, { value: "last", label: "Solo el apellido" }] },
  ];
}

export const randomNameGenerator = comboGenerator<Item, LastName | null>({
  items: RANDOM_NAME_ITEMS,
  baseKey: (i) => `${i.nat.id}:${i.gender}:${i.given}`,
  facets: { gender: (i) => [i.gender], origin: (i) => [i.nat.id] },
  extra: (i, rng) => pick(surnamesFor(i.nat), rng),
  extraKey: (l) => l?.name ?? "",
  extraFromKey: (i, key) => surnamesFor(i.nat).find((l) => l.name === key) ?? null,
  toResult: () => ({ title: "" }),
  variety: (f) => {
    const nats = f.origin?.length ? NATIONALITIES.filter((n) => f.origin.includes(n.id)) : NATIONALITIES;
    return Math.max(1, Math.round(nats.reduce((s, n) => s + surnamesFor(n).length, 0) / nats.length));
  },
});

function render(key: string, style: string, locale: "en" | "es") {
  const [natId, gender, given, last] = [...key.split("|")[0].split(":"), key.split("|")[1] ?? ""] as [string, FakeGender, string, string];
  const nat = NATIONALITIES.find((n) => n.id === natId);
  const l = surnamesFor(nat!).find((x) => x.name === last);
  if (!nat || !l) return null;
  const family = gender === "female" ? feminineSurname(l.name, nat.feminine) : l.name;
  const full = nat.familyFirst ? `${family} ${given}` : `${given} ${family}`;
  const title = style === "first" ? given : style === "last" ? family : full;
  const origin = locale === "es" ? NAT_ES[nat.id] ?? nat.label : nat.label;
  const who = locale === "es" ? (gender === "female" ? "mujer" : "hombre") : gender;
  return { key, title, subtitle: `${nat.flag} ${origin} · ${who}`, detail: `${family}: ${l.meaning[locale]}` };
}

function namesApi(locale: "en" | "es") {
  return {
    poolSize: (f: FilterState) => {
      if ((f.style?.[0] ?? "full") === "full") return randomNameGenerator.poolSize(f);
      return filterBy(filterBy(RANDOM_NAME_ITEMS, f.gender ?? [], (i) => [i.gender]), f.origin ?? [], (i) => [i.nat.id]).length;
    },
    generate(f: FilterState, count: number, used: string[], seed: number) {
      const style = f.style?.[0] ?? "full";
      const out = randomNameGenerator.generate(f, count, used, seed);
      return { used: out.used, results: out.results.map((r) => render(r.key, style, locale)).filter((r): r is NonNullable<ReturnType<typeof render>> => r !== null) };
    },
    resolve: (key: string, f: FilterState) => render(key, f.style?.[0] ?? "full", locale),
  };
}

const nameApis = { en: namesApi("en"), es: namesApi("es") };

export function randomNamesFor(locale: "en" | "es" = "en") {
  return nameApis[locale];
}

export const randomNames = nameApis.en;
