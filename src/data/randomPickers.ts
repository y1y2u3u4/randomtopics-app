export type PickerKind = "object" | "state" | "country";
export type PickerItem = { id: string; name: string; group: string; detail: string; capital?: string };
/** Original, distinct everyday physical objects. No abstract nouns or borrowed prompt pool. */
export const OBJECT_ITEMS: PickerItem[] = [
  {
    "id": "home-1",
    "name": "Cushion",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-2",
    "name": "Table lamp",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-3",
    "name": "Wall clock",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-4",
    "name": "Doormat",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-5",
    "name": "Picture frame",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-6",
    "name": "Blanket",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-7",
    "name": "Laundry basket",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-8",
    "name": "Coat hanger",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-9",
    "name": "Mirror",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-10",
    "name": "Armchair",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-11",
    "name": "Curtain",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "home-12",
    "name": "Vase",
    "group": "home",
    "detail": "Use it as a still-life subject or describe its shape."
  },
  {
    "id": "kitchen-1",
    "name": "Spoon",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-2",
    "name": "Fork",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-3",
    "name": "Mixing bowl",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-4",
    "name": "Whisk",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-5",
    "name": "Rolling pin",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-6",
    "name": "Colander",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-7",
    "name": "Measuring cup",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-8",
    "name": "Teapot",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-9",
    "name": "Cutting board",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-10",
    "name": "Oven mitt",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-11",
    "name": "Spatula",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "kitchen-12",
    "name": "Jar",
    "group": "kitchen",
    "detail": "Try a quick sketch from the side or from above."
  },
  {
    "id": "desk-1",
    "name": "Pencil",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-2",
    "name": "Notebook",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-3",
    "name": "Paper clip",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-4",
    "name": "Stapler",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-5",
    "name": "Ruler",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-6",
    "name": "Eraser",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-7",
    "name": "Envelope",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-8",
    "name": "Highlighter",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-9",
    "name": "Binder clip",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-10",
    "name": "Tape dispenser",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-11",
    "name": "Desk calendar",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "desk-12",
    "name": "Calculator",
    "group": "desk",
    "detail": "Use it as a prop for a drawing or guessing game."
  },
  {
    "id": "workshop-1",
    "name": "Hammer",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-2",
    "name": "Screwdriver",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-3",
    "name": "Wrench",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-4",
    "name": "Paintbrush",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-5",
    "name": "Sandpaper",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-6",
    "name": "Tape measure",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-7",
    "name": "Wooden block",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-8",
    "name": "Hex nut",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-9",
    "name": "Bolt",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-10",
    "name": "Spirit level",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-11",
    "name": "Clamp",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "workshop-12",
    "name": "Toolbox",
    "group": "workshop",
    "detail": "Look for straight edges, curves and how its parts fit together."
  },
  {
    "id": "outdoors-1",
    "name": "Pinecone",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-2",
    "name": "Acorn",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-3",
    "name": "Pebble",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-4",
    "name": "Leaf",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-5",
    "name": "Flowerpot",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-6",
    "name": "Watering can",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-7",
    "name": "Garden glove",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-8",
    "name": "Rake",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-9",
    "name": "Bird feeder",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-10",
    "name": "Frisbee",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-11",
    "name": "Jump rope",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "outdoors-12",
    "name": "Picnic basket",
    "group": "outdoors",
    "detail": "Sketch its outline, then add one texture."
  },
  {
    "id": "travel-1",
    "name": "Backpack",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-2",
    "name": "Suitcase",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-3",
    "name": "Compass",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-4",
    "name": "Sunglasses",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-5",
    "name": "Water bottle",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-6",
    "name": "Luggage tag",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-7",
    "name": "Umbrella",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-8",
    "name": "Travel pillow",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-9",
    "name": "Binoculars",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-10",
    "name": "Map",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-11",
    "name": "Flashlight",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  },
  {
    "id": "travel-12",
    "name": "Sleeping bag",
    "group": "travel",
    "detail": "Imagine how you would pack it or use it on a journey."
  }
];
/** Census four-region membership, USPS two-letter codes; states only, excluding DC/territories. */
export const STATE_ITEMS: PickerItem[] = [
  {
    "id": "AL",
    "name": "Alabama",
    "group": "south",
    "detail": "AL",
    "capital": "Montgomery"
  },
  {
    "id": "AK",
    "name": "Alaska",
    "group": "west",
    "detail": "AK",
    "capital": "Juneau"
  },
  {
    "id": "AZ",
    "name": "Arizona",
    "group": "west",
    "detail": "AZ",
    "capital": "Phoenix"
  },
  {
    "id": "AR",
    "name": "Arkansas",
    "group": "south",
    "detail": "AR",
    "capital": "Little Rock"
  },
  {
    "id": "CA",
    "name": "California",
    "group": "west",
    "detail": "CA",
    "capital": "Sacramento"
  },
  {
    "id": "CO",
    "name": "Colorado",
    "group": "west",
    "detail": "CO",
    "capital": "Denver"
  },
  {
    "id": "CT",
    "name": "Connecticut",
    "group": "northeast",
    "detail": "CT",
    "capital": "Hartford"
  },
  {
    "id": "DE",
    "name": "Delaware",
    "group": "south",
    "detail": "DE",
    "capital": "Dover"
  },
  {
    "id": "FL",
    "name": "Florida",
    "group": "south",
    "detail": "FL",
    "capital": "Tallahassee"
  },
  {
    "id": "GA",
    "name": "Georgia",
    "group": "south",
    "detail": "GA",
    "capital": "Atlanta"
  },
  {
    "id": "HI",
    "name": "Hawaii",
    "group": "west",
    "detail": "HI",
    "capital": "Honolulu"
  },
  {
    "id": "ID",
    "name": "Idaho",
    "group": "west",
    "detail": "ID",
    "capital": "Boise"
  },
  {
    "id": "IL",
    "name": "Illinois",
    "group": "midwest",
    "detail": "IL",
    "capital": "Springfield"
  },
  {
    "id": "IN",
    "name": "Indiana",
    "group": "midwest",
    "detail": "IN",
    "capital": "Indianapolis"
  },
  {
    "id": "IA",
    "name": "Iowa",
    "group": "midwest",
    "detail": "IA",
    "capital": "Des Moines"
  },
  {
    "id": "KS",
    "name": "Kansas",
    "group": "midwest",
    "detail": "KS",
    "capital": "Topeka"
  },
  {
    "id": "KY",
    "name": "Kentucky",
    "group": "south",
    "detail": "KY",
    "capital": "Frankfort"
  },
  {
    "id": "LA",
    "name": "Louisiana",
    "group": "south",
    "detail": "LA",
    "capital": "Baton Rouge"
  },
  {
    "id": "ME",
    "name": "Maine",
    "group": "northeast",
    "detail": "ME",
    "capital": "Augusta"
  },
  {
    "id": "MD",
    "name": "Maryland",
    "group": "south",
    "detail": "MD",
    "capital": "Annapolis"
  },
  {
    "id": "MA",
    "name": "Massachusetts",
    "group": "northeast",
    "detail": "MA",
    "capital": "Boston"
  },
  {
    "id": "MI",
    "name": "Michigan",
    "group": "midwest",
    "detail": "MI",
    "capital": "Lansing"
  },
  {
    "id": "MN",
    "name": "Minnesota",
    "group": "midwest",
    "detail": "MN",
    "capital": "Saint Paul"
  },
  {
    "id": "MS",
    "name": "Mississippi",
    "group": "south",
    "detail": "MS",
    "capital": "Jackson"
  },
  {
    "id": "MO",
    "name": "Missouri",
    "group": "midwest",
    "detail": "MO",
    "capital": "Jefferson City"
  },
  {
    "id": "MT",
    "name": "Montana",
    "group": "west",
    "detail": "MT",
    "capital": "Helena"
  },
  {
    "id": "NE",
    "name": "Nebraska",
    "group": "midwest",
    "detail": "NE",
    "capital": "Lincoln"
  },
  {
    "id": "NV",
    "name": "Nevada",
    "group": "west",
    "detail": "NV",
    "capital": "Carson City"
  },
  {
    "id": "NH",
    "name": "New Hampshire",
    "group": "northeast",
    "detail": "NH",
    "capital": "Concord"
  },
  {
    "id": "NJ",
    "name": "New Jersey",
    "group": "northeast",
    "detail": "NJ",
    "capital": "Trenton"
  },
  {
    "id": "NM",
    "name": "New Mexico",
    "group": "west",
    "detail": "NM",
    "capital": "Santa Fe"
  },
  {
    "id": "NY",
    "name": "New York",
    "group": "northeast",
    "detail": "NY",
    "capital": "Albany"
  },
  {
    "id": "NC",
    "name": "North Carolina",
    "group": "south",
    "detail": "NC",
    "capital": "Raleigh"
  },
  {
    "id": "ND",
    "name": "North Dakota",
    "group": "midwest",
    "detail": "ND",
    "capital": "Bismarck"
  },
  {
    "id": "OH",
    "name": "Ohio",
    "group": "midwest",
    "detail": "OH",
    "capital": "Columbus"
  },
  {
    "id": "OK",
    "name": "Oklahoma",
    "group": "south",
    "detail": "OK",
    "capital": "Oklahoma City"
  },
  {
    "id": "OR",
    "name": "Oregon",
    "group": "west",
    "detail": "OR",
    "capital": "Salem"
  },
  {
    "id": "PA",
    "name": "Pennsylvania",
    "group": "northeast",
    "detail": "PA",
    "capital": "Harrisburg"
  },
  {
    "id": "RI",
    "name": "Rhode Island",
    "group": "northeast",
    "detail": "RI",
    "capital": "Providence"
  },
  {
    "id": "SC",
    "name": "South Carolina",
    "group": "south",
    "detail": "SC",
    "capital": "Columbia"
  },
  {
    "id": "SD",
    "name": "South Dakota",
    "group": "midwest",
    "detail": "SD",
    "capital": "Pierre"
  },
  {
    "id": "TN",
    "name": "Tennessee",
    "group": "south",
    "detail": "TN",
    "capital": "Nashville"
  },
  {
    "id": "TX",
    "name": "Texas",
    "group": "south",
    "detail": "TX",
    "capital": "Austin"
  },
  {
    "id": "UT",
    "name": "Utah",
    "group": "west",
    "detail": "UT",
    "capital": "Salt Lake City"
  },
  {
    "id": "VT",
    "name": "Vermont",
    "group": "northeast",
    "detail": "VT",
    "capital": "Montpelier"
  },
  {
    "id": "VA",
    "name": "Virginia",
    "group": "south",
    "detail": "VA",
    "capital": "Richmond"
  },
  {
    "id": "WA",
    "name": "Washington",
    "group": "west",
    "detail": "WA",
    "capital": "Olympia"
  },
  {
    "id": "WV",
    "name": "West Virginia",
    "group": "south",
    "detail": "WV",
    "capital": "Charleston"
  },
  {
    "id": "WI",
    "name": "Wisconsin",
    "group": "midwest",
    "detail": "WI",
    "capital": "Madison"
  },
  {
    "id": "WY",
    "name": "Wyoming",
    "group": "west",
    "detail": "WY",
    "capital": "Cheyenne"
  }
];
const namingParts = {
  fantasy: { starts: ["Astra", "Vely", "Cael", "Oryn", "Elar", "Thal", "Ilyr", "Mora"], ends: ["dor", "ia", "eth", "ara", "on", "en"], note: "An imagined map name with flowing sounds." },
  modern: { starts: ["Arden", "Bel", "Cor", "Dalen", "Esten", "Ner", "Val", "Or"], ends: ["ia", "ara", "ena", "ora", "an", "on"], note: "A short invented name for a contemporary fictional setting." },
  scifi: { starts: ["Axo", "Zeno", "Kyr", "Vexo", "Talo", "Nyx", "Iono", "Syra"], ends: ["ris", "yon", "vek", "tar", "na", "xis"], note: "An invented name for a future nation or off-world setting." },
};
/** Exclude exact English territory/country names from the runtime's Unicode locale data.
 * This is not a trademark, cultural-suitability or resemblance check. */
const realNames = new Set(["Turkey", "Czech Republic", "Vatican City", "United States", "United Kingdom", "Russia", "South Korea", "North Korea"].map(s => s.toLowerCase()));
const territoryNames = new Intl.DisplayNames(["en"], { type: "region" });
for (let a = 65; a <= 90; a++) for (let b = 65; b <= 90; b++) {
  const code = String.fromCharCode(a, b), name = territoryNames.of(code);
  if (name && name !== code) realNames.add(name.toLowerCase());
}
export const COUNTRY_ITEMS: PickerItem[] = Object.entries(namingParts).flatMap(([group, parts]) => parts.starts.flatMap((start, i) => parts.ends.map((end, j) => ({id: `${group}-${i}-${j}`, name: start + end, group, detail: parts.note})))).filter(p => !realNames.has(p.name.toLowerCase()));
export function pickerItems(kind: PickerKind): PickerItem[] { return kind === "object" ? OBJECT_ITEMS : kind === "state" ? STATE_ITEMS : COUNTRY_ITEMS; }
export function pickerPool(kind: PickerKind, group: string, contiguous = false): PickerItem[] {
  return pickerItems(kind).filter(p => (group === "all" || p.group === group) && !(kind === "state" && contiguous && ["AK", "HI"].includes(p.id)));
}
export function pickItems(pool: PickerItem[], seen: readonly string[], count: number, random = Math.random): PickerItem[] {
  const available = pool.filter(p => !seen.includes(p.id)), target = Math.min(available.length, Math.max(0, Math.floor(count))), chosen: PickerItem[] = [];
  for (let i = 0; i < target; i++) chosen.push(...available.splice(Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length))), 1));
  return chosen;
}
export function countryDisplay(name: string, form: string) { return form === "kingdom" ? `Kingdom of ${name}` : form === "republic" ? `Republic of ${name}` : name; }
