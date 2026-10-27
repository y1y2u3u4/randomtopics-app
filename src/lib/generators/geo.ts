import { COUNTRIES, CONTINENTS, POP_BANDS, type Country } from "@/data/geo/countries";
import { CITIES, type City } from "@/data/geo/cities";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

const bandLabel = (b: number) => POP_BANDS.find((p) => p.id === b)?.label ?? "";

export const countryFilters: FilterGroup[] = [
  { id: "where", label: "Continent", multi: true, options: CONTINENTS.map((c) => ({ value: c, label: c })) },
  { id: "size", label: "Population", multi: true, options: POP_BANDS.map((p) => ({ value: String(p.id), label: p.label })) },
];

export const countryGenerator = listGenerator<Country>({
  items: COUNTRIES,
  key: (c) => c.iso,
  facets: { where: (c) => [c.continent], size: (c) => [String(c.band)] },
  toResult: (c) => ({ key: c.iso, title: c.name, emoji: c.flag, subtitle: `Capital: ${c.capital} · ${c.continent}`, detail: `Population: ${bandLabel(c.band).toLowerCase()}` }),
});

const cityCountries = [...new Map(CITIES.map((c) => [c.iso, c.country])).entries()].sort((a, b) => a[1].localeCompare(b[1], "en"));

export const cityFilters: FilterGroup[] = [
  { id: "where", label: "Continent", multi: true, options: CONTINENTS.map((c) => ({ value: c, label: c })) },
  { id: "origin", label: "Country", multi: true, options: cityCountries.map(([iso, name]) => ({ value: iso, label: name })) },
  { id: "type", label: "Type", options: [{ value: "any", label: "Any city" }, { value: "capital", label: "Capitals only" }] },
];

export const cityGenerator = listGenerator<City>({
  items: CITIES,
  key: (c) => c.id,
  facets: { where: (c) => [c.continent], origin: (c) => [c.iso], type: (c) => (c.capital ? ["any", "capital"] : ["any"]) },
  toResult: (c) => ({ key: c.id, title: c.name, emoji: c.flag, subtitle: `${c.country} · ${c.continent}`, detail: c.capital ? "Capital city" : undefined }),
});

export const COUNTRY_COUNT = COUNTRIES.length;
export const CITY_COUNT = CITIES.length;
export const CITY_COUNTRY_COUNT = cityCountries.length;
