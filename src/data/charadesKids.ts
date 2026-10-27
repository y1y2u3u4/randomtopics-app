// Kids charades word bank — curated in-house, 2026-10. Every entry is actable without
// speaking, family-safe, and tagged by category and age band.
// d: 1 = ages 3–5 (one picture word, a single obvious move),
//    2 = ages 6–8 (a short action or a two-step idea),
//    3 = ages 9–12 (two-word phrases and stories with a few steps).

export type KidsCharadesCategory =
  | "kids-animals"
  | "kids-actions"
  | "kids-feelings"
  | "kids-food"
  | "kids-helpers"
  | "kids-play"
  | "kids-nature"
  | "kids-pretend";

export const KIDS_CHARADES_CATEGORIES: { id: KidsCharadesCategory; label: string; emoji: string }[] = [
  { id: "kids-animals", label: "Animals", emoji: "🐘" },
  { id: "kids-actions", label: "Everyday actions", emoji: "🪥" },
  { id: "kids-feelings", label: "Feelings & faces", emoji: "😲" },
  { id: "kids-food", label: "Food & drink", emoji: "🍕" },
  { id: "kids-helpers", label: "Jobs & helpers", emoji: "🧑‍🚒" },
  { id: "kids-play", label: "Sports & play", emoji: "⚽" },
  { id: "kids-nature", label: "Nature & weather", emoji: "🌧️" },
  { id: "kids-pretend", label: "Pretend & stories", emoji: "🐉" },
];

export const KIDS_CHARADES_AGE_LABELS = ["Any age", "Ages 3–5", "Ages 6–8", "Ages 9–12"] as const;

type Row = [word: string, difficulty: 1 | 2 | 3];

const BANK: Record<KidsCharadesCategory, Row[]> = {
  "kids-animals": [
    ["Dog", 1], ["Cat", 1], ["Frog", 1], ["Monkey", 1], ["Elephant", 1], ["Bird", 1], ["Fish", 1], ["Snake", 1],
    ["Bunny", 1], ["Duck", 1], ["Lion", 1], ["Cow", 1],
    ["Kangaroo", 2], ["Penguin", 2], ["Giraffe", 2], ["Butterfly", 2], ["Bear", 2], ["Crab", 2], ["Gorilla", 2], ["Bat", 2],
    ["Turtle", 2], ["Horse", 2], ["Owl", 2], ["Dolphin", 2],
    ["Sloth", 3], ["Flamingo", 3], ["Octopus", 3], ["Caterpillar turning into a butterfly", 3], ["Chameleon", 3],
    ["Cat chasing a mouse", 3], ["Dog burying a bone", 3], ["Hummingbird", 3],
  ],
  "kids-actions": [
    ["Jump", 1], ["Run", 1], ["Sleep", 1], ["Eat", 1], ["Clap", 1], ["Dance", 1], ["Swim", 1], ["Sing", 1],
    ["Wave", 1], ["Drink", 1], ["Crawl", 1], ["Hop", 1],
    ["Brush your teeth", 2], ["Wash your hands", 2], ["Put on a coat", 2], ["Tie your shoes", 2], ["Ride a bike", 2],
    ["Read a book", 2], ["Climb a ladder", 2], ["Take a bath", 2], ["Blow bubbles", 2], ["Draw a picture", 2],
    ["Brush your hair", 2], ["Pour a glass of milk", 2],
    ["Pack a school bag", 3], ["Walk a dog in the rain", 3], ["Make your bed", 3], ["Fly a kite", 3], ["Build a sandcastle", 3],
    ["Zip up a sleeping bag", 3], ["Carry a heavy box upstairs", 3], ["Set the table", 3],
  ],
  "kids-feelings": [
    ["Happy", 1], ["Sad", 1], ["Sleepy", 1], ["Angry", 1], ["Hungry", 1], ["Laughing", 1], ["Crying", 1], ["Scared", 1],
    ["Surprised", 2], ["Shy", 2], ["Proud", 2], ["Silly", 2], ["Cold", 2], ["Hot", 2], ["Dizzy", 2], ["Excited", 2],
    ["Embarrassed", 3], ["Nervous", 3], ["Bored", 3], ["Jealous", 3], ["Grumpy", 3], ["Confused", 3],
    ["Tiptoeing so nobody hears", 3], ["Just heard a funny joke", 3],
  ],
  "kids-food": [
    ["Banana", 1], ["Ice cream", 1], ["Pizza", 1], ["Apple", 1], ["Cookie", 1], ["Popcorn", 1], ["Spaghetti", 1], ["Milk", 1],
    ["Pancakes", 2], ["Watermelon", 2], ["Hot dog", 2], ["Corn on the cob", 2], ["Sandwich", 2], ["Birthday cake", 2],
    ["Lollipop", 2], ["Grapes", 2], ["Soup", 2], ["Orange", 2],
    ["Making a sandwich", 3], ["Blowing out birthday candles", 3], ["Eating spicy food", 3], ["Squeezing lemons for lemonade", 3],
    ["Toasting marshmallows", 3], ["Flipping a pancake", 3], ["Picking strawberries", 3], ["Hot chocolate", 3],
  ],
  "kids-helpers": [
    ["Teacher", 1], ["Doctor", 1], ["Firefighter", 1], ["Farmer", 1], ["Chef", 1], ["Pilot", 1], ["Singer", 1], ["Astronaut", 1],
    ["Police officer", 2], ["Mail carrier", 2], ["Dentist", 2], ["Bus driver", 2], ["Painter", 2], ["Librarian", 2],
    ["Gardener", 2], ["Construction worker", 2], ["Hairdresser", 2], ["Vet", 2],
    ["Photographer", 3], ["Lifeguard", 3], ["Magician pulling a rabbit from a hat", 3], ["Scientist", 3], ["Mechanic fixing a car", 3],
    ["Zookeeper feeding a lion", 3], ["Window washer", 3], ["Orchestra conductor", 3],
  ],
  "kids-play": [
    ["Soccer", 1], ["Swing", 1], ["Slide", 1], ["Ball", 1], ["Hide and seek", 1], ["Balloon", 1], ["Skip rope", 1], ["Bubbles", 1],
    ["Basketball", 2], ["Tag", 2], ["Swimming", 2], ["Bowling", 2], ["Hopscotch", 2], ["Trampoline", 2], ["Karate", 2], ["Yo-yo", 2],
    ["Puppet show", 2], ["Playing the drums", 2],
    ["Baseball swing", 3], ["Skateboarding", 3], ["Gymnastics", 3], ["Tug of war", 3], ["Building a block tower", 3],
    ["Playing the piano", 3], ["Musical statues", 3], ["Fishing", 3], ["Surfing", 3],
  ],
  "kids-nature": [
    ["Rain", 1], ["Sun", 1], ["Snow", 1], ["Tree", 1], ["Flower", 1], ["Wind", 1], ["Moon", 1], ["Star", 1],
    ["Rainbow", 2], ["Thunder", 2], ["Volcano", 2], ["Waterfall", 2], ["Mountain", 2], ["Beach", 2], ["Leaf falling", 2], ["Puddle jumping", 2],
    ["Seed growing into a plant", 3], ["Tornado", 3], ["Snowman melting", 3], ["Camping in a tent", 3],
    ["Wave crashing on the shore", 3], ["Planting a garden", 3], ["Waking up a sleeping bear", 3], ["Climbing a mountain", 3],
  ],
  "kids-pretend": [
    ["Robot", 1], ["Superhero", 1], ["Teddy bear", 1], ["Pirate", 1], ["Princess", 1], ["Dinosaur", 1], ["Clown", 1], ["Fairy", 1],
    ["Dragon", 2], ["Mermaid", 2], ["Knight", 2], ["Wizard", 2], ["Cowboy", 2], ["Alien", 2], ["Unicorn", 2], ["Elf", 2],
    ["Rocket ship", 2], ["Treasure hunt", 2],
    ["Dragon guarding treasure", 3], ["Knight fighting a dragon", 3], ["Wizard casting a spell", 3], ["Alien landing on Earth", 3],
    ["Pirate looking through a telescope", 3], ["Robot with a low battery", 3], ["Mermaid brushing her hair", 3],
    ["Superhero stopping a runaway train", 3], ["Giant stomping through a city", 3],
  ],
};

export const KIDS_CHARADES_WORDS: { w: string; c: KidsCharadesCategory; d: 1 | 2 | 3 }[] = (
  Object.entries(BANK) as [KidsCharadesCategory, Row[]][]
).flatMap(([c, rows]) => rows.map(([w, d]) => ({ w, c, d })));
