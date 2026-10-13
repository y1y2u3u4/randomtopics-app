// "Keep playing" recommendations at the bottom of every tool page. Each tool
// belongs to one or more groups; a page recommends three tools from its own
// groups, in the order listed, starting after itself so neighbours differ.

export type ToolGroup = "party" | "classroom" | "speaking" | "names" | "creative" | "my9" | "citation";

export interface RelatedTool { href: string; label: string; emoji: string; blurb: string; groups: ToolGroup[] }

export const RELATED_TOOLS: RelatedTool[] = [
  { href: "/charades", label: "Charades Generator", emoji: "🎭", blurb: "528 words with a round timer", groups: ["party", "classroom"] },
  { href: "/this-or-that", label: "This or That", emoji: "⚖️", blurb: "Quick two-choice questions", groups: ["party", "classroom"] },
  { href: "/would-you-rather", label: "Would You Rather", emoji: "🤔", blurb: "Dilemmas for any group", groups: ["party"] },
  { href: "/truth-or-dare", label: "Truth or Dare", emoji: "🎲", blurb: "Family-safe to spicy", groups: ["party"] },
  { href: "/never-have-i-ever", label: "Never Have I Ever", emoji: "🙊", blurb: "Statements for game night", groups: ["party"] },
  { href: "/most-likely-to", label: "Most Likely To", emoji: "👉", blurb: "Who in the room would…", groups: ["party"] },
  { href: "/two-truths-and-a-lie", label: "Two Truths and a Lie", emoji: "🕵️", blurb: "Icebreaker with examples", groups: ["party", "classroom"] },
  { href: "/spin-the-wheel", label: "Spin the Wheel", emoji: "🎡", blurb: "Pick a topic or a person", groups: ["party", "classroom"] },
  { href: "/yo-mama-randomizer", label: "Yo Mama Randomizer", emoji: "😂", blurb: "Clean roast jokes", groups: ["party"] },
  { href: "/hot-seat-questions", label: "Hot Seat Questions", emoji: "🔥", blurb: "Rapid-fire questions", groups: ["party", "classroom"] },
  { href: "/random-name-picker", label: "Random Name Picker", emoji: "🎩", blurb: "Draw names, no repeats", groups: ["classroom", "party"] },
  { href: "/number-randomizer", label: "Number Randomizer", emoji: "🔢", blurb: "Random numbers in any range", groups: ["classroom", "party"] },
  { href: "/random-team-generator", label: "Random Team Generator", emoji: "👥", blurb: "Split names into fair teams", groups: ["classroom", "party"] },
  { href: "/random-word-generator", label: "Random Word Generator", emoji: "🔠", blurb: "Words for games and writing", groups: ["classroom", "creative"] },
  { href: "/random-letter-generator", label: "Random Letter Generator", emoji: "🔤", blurb: "A–Z for Scattergories", groups: ["classroom", "party"] },
  { href: "/speech", label: "Speech Topic Generator", emoji: "🎤", blurb: "Topics + practice timer", groups: ["speaking", "classroom"] },
  { href: "/impromptu-speech-topics", label: "Impromptu Speech Topics", emoji: "⏱️", blurb: "120 no-research topics", groups: ["speaking", "classroom"] },
  { href: "/debate", label: "Debate Topic Generator", emoji: "⚔️", blurb: "300+ motions with both sides", groups: ["speaking", "classroom"] },
  { href: "/table-topics-generator", label: "Table Topics Generator", emoji: "🗣️", blurb: "Toastmasters practice", groups: ["speaking"] },
  { href: "/presentation-topic-generator", label: "Presentation Topic Generator", emoji: "📊", blurb: "Topics for class presentations", groups: ["speaking", "classroom"] },
  { href: "/essay-topic-generator", label: "Essay Topic Generator", emoji: "📝", blurb: "Essay ideas by type", groups: ["classroom", "creative"] },
  { href: "/research-topic-generator", label: "Research Topic Generator", emoji: "🔬", blurb: "Research ideas by subject", groups: ["classroom", "citation"] },
  { href: "/random-subject-generator", label: "Random Subject Generator", emoji: "📚", blurb: "Pick a school subject", groups: ["classroom"] },
  { href: "/random-state-generator", label: "Random State Generator", emoji: "🗽", blurb: "US states with facts", groups: ["classroom"] },
  { href: "/question-of-the-day", label: "Question of the Day", emoji: "☀️", blurb: "One good question daily", groups: ["classroom", "party"] },
  { href: "/writing", label: "Writing Prompt Generator", emoji: "✍️", blurb: "500+ prompts to write about", groups: ["creative", "classroom"] },
  { href: "/random-drawing-generator", label: "Random Drawing Generator", emoji: "✏️", blurb: "Things to draw today", groups: ["creative", "classroom"] },
  { href: "/random-color-generator", label: "Random Color Generator", emoji: "🎨", blurb: "Palettes, lock and copy", groups: ["creative"] },
  { href: "/random-animal-generator", label: "Random Animal Generator", emoji: "🦊", blurb: "Animals with fun facts", groups: ["creative", "classroom"] },
  { href: "/random-food-generator", label: "Random Food Generator", emoji: "🍜", blurb: "What should I eat?", groups: ["creative", "party"] },
  { href: "/random-character-generator", label: "Random Character Generator", emoji: "🎭", blurb: "Name, traits and a secret", groups: ["creative", "names"] },
  { href: "/fantasy-map-maker", label: "Fantasy Map Maker", emoji: "🗺️", blurb: "Random worlds as PNG", groups: ["creative", "names"] },
  { href: "/random-object-generator", label: "Random Object Generator", emoji: "🧸", blurb: "Everyday objects", groups: ["creative", "classroom"] },
  { href: "/dnd-name-generator", label: "D&D Name Generator", emoji: "🐉", blurb: "Fantasy names by race", groups: ["names"] },
  { href: "/character-name-generator", label: "Character Name Generator", emoji: "✒️", blurb: "Names for stories", groups: ["names", "creative"] },
  { href: "/viking-name-generator", label: "Viking Name Generator", emoji: "🛡️", blurb: "Old Norse names", groups: ["names"] },
  { href: "/japanese-name-generator", label: "Japanese Name Generator", emoji: "🎌", blurb: "Kanji, kana and meaning", groups: ["names"] },
  { href: "/gnome-name-generator", label: "Gnome Name Generator", emoji: "⚙️", blurb: "Names, nicknames, clans", groups: ["names"] },
  { href: "/western-baby-name-generator", label: "Western Baby Name Generator", emoji: "🤠", blurb: "Cowboy & country names", groups: ["names"] },
  { href: "/last-name-generator", label: "Last Name Generator", emoji: "🏷️", blurb: "Surnames with meanings", groups: ["names"] },
  { href: "/dragon-name-generator", label: "Dragon Name Generator", emoji: "🐲", blurb: "Names for dragons", groups: ["names"] },
  { href: "/band-name-generator", label: "Band Name Generator", emoji: "🎸", blurb: "Names for your band", groups: ["names", "party"] },
  { href: "/country-name-generator", label: "Country Name Generator", emoji: "🏳️", blurb: "Fictional nations", groups: ["names", "creative"] },
  { href: "/ai-metadata-remover", label: "AI Metadata Remover", emoji: "🧹", blurb: "Strip EXIF, GPS and prompts", groups: ["creative", "my9"] },
  { href: "/my-9-albums", label: "My 9 Albums", emoji: "💿", blurb: "3×3 album cover grid", groups: ["my9"] },
  { href: "/my-9-games", label: "My 9 Games", emoji: "🎮", blurb: "3×3 favorite games", groups: ["my9"] },
  { href: "/my-9-movies", label: "My 9 Movies", emoji: "🎬", blurb: "3×3 favorite movies", groups: ["my9"] },
  { href: "/my-9-anime", label: "My 9 Anime", emoji: "🌸", blurb: "3×3 favorite anime", groups: ["my9"] },
  { href: "/my-9-books", label: "My 9 Books", emoji: "📚", blurb: "3×3 favorite books", groups: ["my9"] },
  { href: "/my-9-grid", label: "My 9 Grid Maker", emoji: "🔳", blurb: "Any 9 pictures", groups: ["my9", "creative"] },
  { href: "/asa-citation-generator", label: "ASA Citation Generator", emoji: "📑", blurb: "ASA 7th from a DOI", groups: ["citation"] },
  { href: "/acs-citation-generator", label: "ACS Citation Generator", emoji: "🧪", blurb: "Numbered ACS references", groups: ["citation"] },
  { href: "/chicago-citation-generator", label: "Chicago Citation Generator", emoji: "📚", blurb: "Notes and bibliography", groups: ["citation"] },
];

/** When a group has fewer than three other tools, continue with these. */
const FALLBACK: Partial<Record<ToolGroup, ToolGroup[]>> = {
  citation: ["speaking", "creative"],
  my9: ["creative", "party"],
  names: ["creative"],
  speaking: ["classroom"],
};

export function keepPlaying(path: string, count = 3): RelatedTool[] {
  const self = RELATED_TOOLS.find((t) => t.href === path);
  if (!self) return [];
  const picked: RelatedTool[] = [];
  const groups = [...self.groups, ...self.groups.flatMap((g) => FALLBACK[g] ?? [])];
  for (const g of groups) {
    const members = RELATED_TOOLS.filter((t) => t.groups.includes(g));
    const start = members.indexOf(self);
    // Start after the current page so neighbouring pages recommend different tools.
    const ordered = start >= 0 ? [...members.slice(start + 1), ...members.slice(0, start)] : members;
    for (const t of ordered) {
      if (picked.length >= count) return picked;
      if (t !== self && !picked.includes(t)) picked.push(t);
    }
  }
  return picked;
}
