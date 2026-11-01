// Ready-made word lists for the bingo card generator. Every list has at least
// 30 entries so a 5x5 card (24 squares + free space) can be shuffled into many
// different cards. Keep entries short: they have to fit a printed square.
export type BingoStyle = "classic" | "christmas" | "winter" | "ink";

export interface BingoTheme {
  id: string;
  label: string;
  emoji: string;
  title: string;
  style: BingoStyle;
  words: string[];
}

export const BINGO_THEMES: BingoTheme[] = [
  {
    id: "christmas",
    label: "Christmas",
    emoji: "🎄",
    title: "Christmas Bingo",
    style: "christmas",
    words: [
      "Santa", "Reindeer", "Snowman", "Candy cane", "Stocking", "Mistletoe", "Gingerbread", "Elf", "Sleigh", "Wreath",
      "Ornament", "Hot cocoa", "Present", "Star", "Jingle bells", "Holly", "Snowflake", "Fireplace", "Cookies & milk", "Tinsel",
      "Chimney", "Angel", "North Pole", "Ugly sweater", "Nutcracker", "Candle", "Carolers", "Rudolph", "Wrapping paper", "Christmas tree",
      "Eggnog", "Mittens", "Sledding", "Bow", "Lights", "Advent calendar", "Gift tag", "Polar bear", "Toy workshop", "Pinecone",
    ],
  },
  {
    id: "christmas-movie",
    label: "Christmas movie",
    emoji: "🎬",
    title: "Christmas Movie Bingo",
    style: "christmas",
    words: [
      "Snow starts falling", "Big-city job left behind", "Hot cocoa scene", "Ugly sweater", "Mistletoe kiss", "Small-town festival", "Baking cookies", "Is Santa real?",
      "Family inn in trouble", "Christmas tree lot", "Ice skating", "Christmas miracle", "Wise kid", "Matching pajamas", "Snowball fight", "Ex shows up",
      "Gingerbread contest", "Carolers at the door", "Sleigh ride", "Last-minute shopping", "Power goes out", "Puppy with a bow", "Fake relationship", "Kiss interrupted",
      "Letter to Santa", "Grumpy neighbor softens", "Plaid flannel", "Tree lighting", "Stranded by snow", "Says \"Christmas spirit\"", "Missed flight", "Ornament with a memory",
    ],
  },
  {
    id: "office-party",
    label: "Holiday party",
    emoji: "🥂",
    title: "Holiday Party Bingo",
    style: "christmas",
    words: [
      "Wears reindeer antlers", "Secret Santa reveal", "Boss gives a speech", "Spills a drink", "Ugly sweater", "Gift card gift", "Mug as a gift", "Someone sings",
      "Photo booth selfie", "\"Where did the year go?\"", "Talks about work anyway", "Leaves early", "Re-gifted present", "Year-end deadline", "Dances first", "Mistletoe joke",
      "Brings homemade cookies", "Santa hat", "Plays music from a phone", "Same story twice", "White elephant steal", "Matching outfits", "Toast to the team", "Eats the last cookie",
      "Takes a group photo", "Forgets someone's name", "Light-up sweater", "Talks about vacation plans", "Gift costs over the limit", "Candy cane", "Hot cocoa bar", "Sparkly outfit",
    ],
  },
  {
    id: "winter",
    label: "Winter",
    emoji: "❄️",
    title: "Winter Bingo",
    style: "winter",
    words: [
      "Snowman", "Sled", "Ice skates", "Mittens", "Hot chocolate", "Igloo", "Penguin", "Polar bear", "Snowflake", "Icicle",
      "Scarf", "Boots", "Snow angel", "Fireplace", "Blanket", "Earmuffs", "Snowball", "Pine tree", "Cardinal", "Wool hat",
      "Shovel", "Skis", "Snowplow", "Owl", "Full moon", "Soup", "Log cabin", "Footprints", "Frost", "Candle", "Snowboard", "Marshmallows",
    ],
  },
  {
    id: "thanksgiving",
    label: "Thanksgiving",
    emoji: "🦃",
    title: "Thanksgiving Bingo",
    style: "classic",
    words: [
      "Turkey", "Pumpkin pie", "Stuffing", "Cranberry sauce", "Mashed potatoes", "Gravy", "Corn", "Football", "Parade", "Fall leaves",
      "Acorn", "Cornucopia", "Apple pie", "Grateful", "Family", "Nap", "Wishbone", "Dinner rolls", "Green beans", "Sweet potato",
      "Harvest", "Scarecrow", "Hayride", "Leftovers", "Gobble gobble", "Feast", "Thankful", "Pecan pie", "Squash", "Kids' table", "Apple cider", "Napkin rings",
    ],
  },
  {
    id: "new-year",
    label: "New Year's Eve",
    emoji: "🎆",
    title: "New Year's Eve Bingo",
    style: "classic",
    words: [
      "Countdown", "Confetti", "Fireworks", "Resolution", "Party hat", "Noisemaker", "Sparkling cider", "Ball drop", "Midnight kiss", "Auld Lang Syne",
      "Glitter", "Balloons", "Clock", "New calendar", "Sparkler", "Streamers", "Group selfie", "Dancing", "Snack table", "Pajamas",
      "\"Happy New Year!\"", "Toast", "Party horn", "Tiara", "Disco ball", "Stays up late", "Best moment of the year", "Gold", "Silver", "Party games", "Photo booth", "Falls asleep early",
    ],
  },
  {
    id: "baby-shower",
    label: "Baby shower",
    emoji: "🍼",
    title: "Baby Shower Bingo",
    style: "classic",
    words: [
      "Diapers", "Bottle", "Pacifier", "Onesie", "Rattle", "Stroller", "Crib", "Bib", "Teddy bear", "Blanket",
      "Car seat", "Baby monitor", "Booties", "Lullaby", "Wipes", "Socks", "Baby bath", "Mobile", "Burp cloth", "High chair",
      "Board book", "Swaddle", "Diaper bag", "Teether", "Nursery", "Sun hat", "Bunny", "Rubber duck", "Stork", "Baby name ideas", "Sleep sack", "Baby lotion",
    ],
  },
  {
    id: "bridal-shower",
    label: "Bridal shower",
    emoji: "💍",
    title: "Bridal Shower Bingo",
    style: "classic",
    words: [
      "Ring", "Veil", "Bouquet", "Toasting glasses", "Something blue", "Apron", "Kitchen gadget", "Stand mixer", "Picture frame", "Candles",
      "Towels", "Honeymoon", "Recipe card", "Cookbook", "Ribbon bouquet", "Wedding dress", "Shoes", "Cake", "Flowers", "Love note",
      "Photo album", "Vase", "Blender", "Throw pillow", "Bridesmaid", "Bride-to-be", "Monogram", "Robe", "Wine glasses", "Bakeware", "Date night jar", "Champagne",
    ],
  },
  {
    id: "find-someone",
    label: "Find someone who",
    emoji: "🙋",
    title: "Find Someone Who…",
    style: "classic",
    words: [
      "Has a pet", "Was born in another country", "Plays an instrument", "Has run a race", "Speaks 3 languages", "Has been on TV", "Is an only child", "Loves spicy food",
      "Has broken a bone", "Can whistle a song", "Doesn't like chocolate", "Has met a celebrity", "Has a twin", "Was born in December", "Has visited 3 continents", "Can juggle",
      "Is left-handed", "Has a garden", "Reads before bed", "Likes pineapple on pizza", "Has a nickname", "Bakes bread", "Has camped outdoors", "Drinks tea, not coffee",
      "Wears glasses", "Has coached a team", "Has climbed a mountain", "Has a signature dish", "Watches anime", "Can do a cartwheel", "Has moved 5+ times", "Collects something",
    ],
  },
  {
    id: "meeting",
    label: "Meeting",
    emoji: "💻",
    title: "Meeting Bingo",
    style: "classic",
    words: [
      "\"Can you hear me?\"", "\"You're on mute\"", "\"Let's circle back\"", "\"Can you see my screen?\"", "Dog barks", "\"Take this offline\"", "\"Quick question\"", "\"Hard stop\"",
      "Someone joins late", "Frozen video", "\"Action items\"", "\"Low-hanging fruit\"", "\"Touch base\"", "Kid walks in", "\"Next slide, please\"", "Echo",
      "\"As per my last email\"", "\"Bandwidth\"", "\"Deep dive\"", "\"Going forward\"", "\"Ping me\"", "\"Who just joined?\"", "\"We're at time\"", "Camera off",
      "\"Let's park that\"", "\"Win-win\"", "\"Move the needle\"", "\"By end of day\"", "Talks while muted", "Wrong window shared", "Coffee refill", "\"Any questions?\"",
    ],
  },
  {
    id: "road-trip",
    label: "Road trip",
    emoji: "🚗",
    title: "Road Trip Bingo",
    style: "classic",
    words: [
      "Gas station", "Cow", "Horse", "Red car", "Motorcycle", "Bridge", "Tunnel", "Train", "School bus", "Stop sign",
      "Police car", "Fire truck", "Billboard", "Water tower", "Barn", "Big truck", "Out-of-state plate", "Speed limit sign", "Rest stop", "Bicycle",
      "Airplane", "Flag", "Windmill", "River", "Mountain", "Dog in a car", "RV", "Traffic cone", "Traffic light", "Motel sign", "Tractor", "Lake",
    ],
  },
  {
    id: "sight-words",
    label: "Sight words",
    emoji: "📚",
    title: "Sight Word Bingo",
    style: "classic",
    words: [
      "the", "and", "a", "to", "said", "in", "he", "I", "of", "it", "was", "you", "they", "on", "she", "is", "for", "at", "his", "but",
      "that", "with", "all", "we", "can", "are", "up", "had", "my", "her", "what", "there", "out", "this", "have", "go", "see", "like", "look", "come",
    ],
  },
];
