import type { DeckGroup, DeckItem } from "@/components/DeckGenerator";

/** Scattergories-style categories written by the RandomTopics editors. */
export const CATEGORY_GROUPS: DeckGroup[] = [
  { id: "food", label: "Food & drink", emoji: "🍕" },
  { id: "places", label: "Places & travel", emoji: "🗺️" },
  { id: "nature", label: "Animals & nature", emoji: "🌿" },
  { id: "people", label: "People & names", emoji: "🧑" },
  { id: "things", label: "Things around you", emoji: "🧰" },
  { id: "pop", label: "Movies, music & TV", emoji: "🎬" },
  { id: "school", label: "School & work", emoji: "🎓" },
  { id: "sports", label: "Sports & hobbies", emoji: "⚽" },
  { id: "kids", label: "Easy (for kids)", emoji: "🧒" },
  { id: "silly", label: "Silly & creative", emoji: "🤪" },
];

const raw: Record<string, string[]> = {
  food: ["Fruits", "Vegetables", "Pizza toppings", "Breakfast foods", "Desserts", "Sandwiches", "Snacks", "Things on a menu", "Ice cream flavors", "Spices and herbs", "Drinks", "Things you put on toast", "Foods at a picnic", "Candy", "Things in a fridge", "Soups"],
  places: ["Countries", "Cities", "U.S. states", "Things you see at the beach", "Tourist attractions", "Stores and shops", "Rivers, lakes or seas", "Places to go on a date", "Rooms in a house", "Things in a city", "Vacation spots", "Places you need a ticket for", "Things at an airport", "Capital cities", "Islands"],
  nature: ["Animals", "Birds", "Dog breeds", "Sea creatures", "Insects and bugs", "Flowers", "Trees", "Things in the sky", "Weather words", "Zoo animals", "Farm animals", "Things that grow", "Reptiles", "Things in a forest", "Pets"],
  people: ["Boys' names", "Girls' names", "Famous people", "Cartoon characters", "Jobs", "Superheroes", "Historical figures", "Athletes", "Musicians or bands", "Authors", "Fictional villains", "Nicknames", "Family members", "Royalty", "People in uniform"],
  things: ["Things in a kitchen", "Things in a backpack", "Tools", "Things with wheels", "Things that are round", "Things that are cold", "Clothing", "Furniture", "Things you plug in", "Things made of wood", "Things that fly", "Things with buttons", "Things in a bathroom", "Kinds of shoes", "Things you can open", "Things that are sticky", "Gifts", "Things in a toolbox"],
  pop: ["Movie titles", "TV shows", "Songs", "Video games", "Board games", "Book titles", "Things in a fairy tale", "Disney characters", "Musical instruments", "Things at a concert", "Holiday songs", "Cartoons", "Famous quotes", "Magazines or newspapers", "Dances"],
  school: ["School subjects", "School supplies", "Things in a classroom", "Things a teacher says", "Math words", "Science words", "Things in an office", "College majors", "Excuses for being late", "Things you do on a computer", "Languages", "Things in a library", "Elements of the periodic table", "Things at a job interview", "Office supplies"],
  sports: ["Sports", "Sports teams", "Hobbies", "Things you do at the gym", "Olympic events", "Card games", "Camping gear", "Outdoor activities", "Things with a net", "Arts and crafts", "Things you collect", "Ways to exercise", "Things at a stadium", "Sports equipment", "Things you do on a weekend"],
  kids: ["Colors", "Things that are red", "Toys", "Things at a birthday party", "Shapes", "Things at the park", "Things that are soft", "Animals that say a sound", "Things that are yellow", "Body parts", "Things in a toy box", "Things that are loud", "Things you wear in winter", "Things at a farm", "Bedtime things"],
  silly: ["Things you shouldn't say on a first date", "Reasons to call in sick", "Things a pirate might own", "Words that sound funny", "Things you'd find in a wizard's pocket", "Bad names for a pet", "Things that are scary", "Things you shout", "Things a robot would eat", "Excuses for not doing homework", "Names for a band", "Things you'd take to a desert island", "Things that smell bad", "Superpowers", "Things you'd find in a haunted house", "Things that make you laugh"],
};

export const CATEGORY_ITEMS: DeckItem[] = Object.entries(raw).flatMap(([group, list]) =>
  list.map((text, i) => ({ id: `${group}-${i + 1}`, text, group })),
);
