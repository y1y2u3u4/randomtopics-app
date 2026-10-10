import data from "@/data/generators/foods.json";
import imageIndex from "@/data/generators/foodImages.json";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export interface Food { id: string; name: string; meals: string[]; cuisine: string; diet: string[]; blurb: string }

export const FOODS = data as Food[];
export const FOOD_IMAGES: ReadonlySet<string> = new Set(imageIndex as string[]);

export const CUISINES: Record<string, string> = {
  american: "🇺🇸 American", mexican: "🇲🇽 Mexican", italian: "🇮🇹 Italian", french: "🇫🇷 French", spanish: "🇪🇸 Spanish",
  british: "🇬🇧 British", greek: "🇬🇷 Greek", "middle-eastern": "🧆 Middle Eastern", indian: "🇮🇳 Indian", chinese: "🇨🇳 Chinese",
  japanese: "🇯🇵 Japanese", korean: "🇰🇷 Korean", thai: "🇹🇭 Thai", vietnamese: "🇻🇳 Vietnamese", filipino: "🇵🇭 Filipino",
  caribbean: "🏝️ Caribbean", "latin-american": "🌎 Latin American", african: "🌍 African", german: "🇩🇪 German", "eastern-european": "🥟 Eastern European",
};

export const foodFilters: FilterGroup[] = [
  {
    id: "meal",
    label: "Meal",
    multi: true,
    options: [
      { value: "breakfast", label: "🍳 Breakfast" },
      { value: "lunch", label: "🥪 Lunch" },
      { value: "dinner", label: "🍝 Dinner" },
      { value: "snack", label: "🥨 Snack" },
      { value: "dessert", label: "🍰 Dessert" },
    ],
  },
  { id: "cuisine", label: "Cuisine", multi: true, options: Object.entries(CUISINES).map(([value, label]) => ({ value, label })) },
  {
    id: "diet",
    label: "Diet",
    multi: true,
    options: [
      { value: "vegetarian", label: "🥕 Vegetarian" },
      { value: "vegan", label: "🌱 Vegan" },
      { value: "gluten-free", label: "🌾 Gluten-free" },
    ],
  },
];

export const foodGenerator = listGenerator<Food>({
  items: FOODS,
  key: (f) => f.id,
  facets: { meal: (f) => f.meals, cuisine: (f) => [f.cuisine], diet: (f) => f.diet },
  toResult: (f) => ({
    key: f.id,
    title: f.name,
    subtitle: `${CUISINES[f.cuisine] ?? f.cuisine} · ${f.meals.join(", ")}`,
    detail: f.blurb,
    image: FOOD_IMAGES.has(f.id) ? `/generators/foods/${f.id}.webp` : undefined,
    emoji: "🍽️",
  }),
});
