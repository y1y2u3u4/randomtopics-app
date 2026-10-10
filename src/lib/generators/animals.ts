import data from "@/data/generators/animals.json";
import imageIndex from "@/data/generators/animalImages.json";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export interface Animal {
  id: string;
  en: string;
  es: string;
  class: "mammal" | "bird" | "reptile" | "amphibian" | "fish" | "invertebrate";
  habitats: string[];
  kids: boolean;
  fact: { en: string; es: string };
}

export const ANIMALS = data as Animal[];
/** ids that have a ChatGPT-made illustration in /public/generators/animals. */
export const ANIMAL_IMAGES: ReadonlySet<string> = new Set(imageIndex as string[]);

const CLASS_LABELS = {
  en: { mammal: "Mammals", bird: "Birds", reptile: "Reptiles", amphibian: "Amphibians", fish: "Fish", invertebrate: "Bugs & sea creatures" },
  es: { mammal: "Mamíferos", bird: "Aves", reptile: "Reptiles", amphibian: "Anfibios", fish: "Peces", invertebrate: "Insectos e invertebrados" },
} as const;

const HABITAT_LABELS = {
  en: { ocean: "🌊 Ocean", farm: "🚜 Farm", pet: "🏠 Pets", jungle: "🌴 Jungle", savanna: "🦁 Savanna", forest: "🌲 Forest", desert: "🏜️ Desert", polar: "❄️ Polar", freshwater: "🏞️ Rivers & lakes", mountain: "⛰️ Mountains", grassland: "🌾 Grassland", wetland: "🪷 Wetland" },
  es: { ocean: "🌊 Mar", farm: "🚜 Granja", pet: "🏠 Mascotas", jungle: "🌴 Selva", savanna: "🦁 Sabana", forest: "🌲 Bosque", desert: "🏜️ Desierto", polar: "❄️ Polar", freshwater: "🏞️ Ríos y lagos", mountain: "⛰️ Montaña", grassland: "🌾 Pradera", wetland: "🪷 Humedal" },
} as const;

export function animalFilters(locale: "en" | "es"): FilterGroup[] {
  return [
    {
      id: "type",
      label: locale === "es" ? "Tipo" : "Type",
      multi: true,
      options: (Object.keys(CLASS_LABELS.en) as Animal["class"][]).map((value) => ({ value, label: CLASS_LABELS[locale][value] })),
    },
    {
      id: "where",
      label: locale === "es" ? "Dónde vive" : "Where it lives",
      multi: true,
      options: (Object.keys(HABITAT_LABELS.en) as (keyof typeof HABITAT_LABELS.en)[]).map((value) => ({ value, label: HABITAT_LABELS[locale][value] })),
    },
    {
      id: "level",
      label: locale === "es" ? "Dificultad" : "Difficulty",
      multi: true,
      options: [
        { value: "kids", label: locale === "es" ? "🧒 Fáciles (para niños)" : "🧒 Easy (kids know it)" },
        { value: "tricky", label: locale === "es" ? "🧠 Difíciles" : "🧠 Tricky" },
      ],
    },
  ];
}

export function animalGenerator(locale: "en" | "es") {
  return listGenerator<Animal>({
    items: ANIMALS,
    key: (a) => a.id,
    facets: {
      type: (a) => [a.class],
      where: (a) => a.habitats,
      level: (a) => [a.kids ? "kids" : "tricky"],
    },
    toResult: (a) => ({
      key: a.id,
      title: a[locale],
      subtitle: `${CLASS_LABELS[locale][a.class]} · ${a.habitats.map((h) => HABITAT_LABELS[locale][h as keyof typeof HABITAT_LABELS.en]?.replace(/^\S+\s/, "") ?? h).join(", ")}`,
      detail: a.fact[locale],
      image: ANIMAL_IMAGES.has(a.id) ? `/generators/animals/${a.id}.webp` : undefined,
      emoji: "🐾",
    }),
  });
}
