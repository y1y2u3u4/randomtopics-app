import { createRng, type Rng } from "@/lib/randomGenerators";

// ---------- Phrase -> acronym ----------

export interface AcronymOptions {
  skipSmall: boolean;
  periods: boolean;
  upper: boolean;
  numbers: "keep" | "drop";
}

export const DEFAULT_OPTIONS: AcronymOptions = { skipSmall: true, periods: false, upper: true, numbers: "keep" };

/** Small connecting words left out of an acronym when "skip small words" is on. */
export const SMALL_WORDS = ["a", "an", "the", "of", "and", "or", "for", "in", "on", "at", "to", "by", "with", "from"] as const;

export interface AcronymResult { acronym: string; used: { word: string; part: string }[]; skipped: string[] }

export function makeAcronym(phrase: string, o: AcronymOptions = DEFAULT_OPTIONS): AcronymResult {
  const words = (phrase.replace(/['’]/g, "").match(/[\p{L}\p{N}]+/gu) ?? []).filter(Boolean);
  const isNum = (w: string) => /^\p{N}/u.test(w);
  const skipped: string[] = [];
  let used: { word: string; part: string }[] = [];
  for (const w of words) {
    if (isNum(w) && o.numbers === "drop") { skipped.push(w); continue; }
    used.push({ word: w, part: isNum(w) ? w : Array.from(w)[0] });
  }
  if (o.skipSmall) {
    const kept = used.filter((u) => isNum(u.word) || !(SMALL_WORDS as readonly string[]).includes(u.word.toLowerCase()));
    // A phrase made only of small words keeps them rather than producing nothing.
    if (kept.length) {
      used.filter((u) => !kept.includes(u)).forEach((u) => skipped.push(u.word));
      used = kept;
    }
  }
  let parts = used.map((u) => u.part);
  if (o.upper) parts = parts.map((p) => p.toLocaleUpperCase());
  const acronym = o.periods ? parts.map((p) => `${p}.`).join("") : parts.join("");
  return { acronym, used, skipped };
}

// ---------- Letters -> backronym ----------

export type ThemeId = "business" | "funny" | "motivational" | "school" | "tech";
type Pos = "adj" | "noun" | "verb";

// One segment per letter A-Z, separated by "|"; words in a segment are separated by spaces.
const THEMES: Record<ThemeId, { label: string; adj: string; noun: string; verb: string }> = {
  business: {
    label: "Business & team",
    adj: "Agile Adaptive|Bold Bright|Creative Collaborative|Dynamic Dedicated|Efficient Energetic|Focused Flexible|Global Growing|Honest Helpful|Innovative Insightful|Just Joint|Keen Key|Lean Loyal|Motivated Modern|Nimble Notable|Open Organized|Proactive Passionate|Quality Quick|Reliable Resilient|Strategic Smart|Trusted Talented|United Ultimate|Valuable Vibrant|Winning Willing|Xenial|Youthful Yielding|Zealous Zesty",
    noun: "Action Alliance|Business Brand|Collaboration Customers|Delivery Drive|Effort Excellence|Focus Future|Goals Growth|Habits Harmony|Ideas Impact|Journey Judgment|Knowledge Kinship|Leadership Learning|Momentum Mission|Networks Nexus|Outcomes Opportunity|Partnership Performance|Quality Quorum|Results Resources|Success Strategy|Teamwork Trust|Unity Understanding|Value Vision|Workflow Wins|X-factor|Yield Year|Zeal Zenith",
    verb: "Achieve Advance|Build Believe|Create Collaborate|Deliver Drive|Execute Excel|Focus Foster|Grow Gain|Help Harness|Innovate Inspire|Join Juggle|Keep Kindle|Lead Learn|Motivate Make|Navigate Nurture|Optimize Organize|Plan Progress|Qualify Question|Reach Resolve|Support Solve|Trust Thrive|Unite Upgrade|Value Validate|Win Work|X-ray|Yield Yearn|Zoom Zero-in",
  },
  funny: {
    label: "Funny",
    adj: "Awkward Absurd|Bonkers Bouncy|Clumsy Chaotic|Dizzy Dramatic|Eccentric Embarrassing|Fluffy Funky|Goofy Giggly|Hilarious Hungry|Itchy Inflatable|Jolly Jumpy|Kooky Klutzy|Lazy Loud|Mischievous Mushy|Nutty Nosy|Odd Outrageous|Peculiar Pointless|Quirky Quacky|Ridiculous Rowdy|Silly Sneaky|Ticklish Tipsy|Unusual Unbelievable|Vexing Vivid|Wacky Wobbly|Xenial|Yodeling Yummy|Zany Zippy",
    noun: "Avocados Armpits|Burritos Bananas|Cheese Chickens|Donuts Disasters|Elbows Eggplants|Fridges Flamingos|Goblins Giraffes|Hamsters Hiccups|Igloos Iguanas|Jellybeans Jokes|Kazoos Koalas|Llamas Lasagna|Meatballs Mustaches|Noodles Ninjas|Octopuses Onions|Pickles Penguins|Quesadillas Quacks|Raccoons Rockets|Sandwiches Sloths|Tacos Toasters|Unicorns Underpants|Vampires Vegetables|Waffles Walruses|Xylophones X-rays|Yaks Yo-yos|Zombies Zebras",
    verb: "Argue Annoy|Bounce Burp|Chase Cuddle|Dance Dodge|Eat Exaggerate|Flop Fumble|Giggle Gobble|Hug Hiccup|Invent Imitate|Juggle Jiggle|Kick Knit|Laugh Lick|Mumble Mimic|Nap Nibble|Overthink Order|Prank Pounce|Quack Quiver|Roll Rumble|Squeal Snore|Tickle Tumble|Unwrap Unplug|Vanish Vibrate|Wiggle Wobble|X-ray|Yodel Yell|Zoom Zigzag",
  },
  motivational: {
    label: "Motivational",
    adj: "Ambitious Authentic|Brave Bold|Courageous Confident|Determined Driven|Empowered Enthusiastic|Fearless Focused|Grateful Genuine|Hopeful Humble|Inspired Intentional|Joyful Just|Kind Keen|Limitless Loyal|Mindful Motivated|Noble Natural|Optimistic Open|Positive Persistent|Quality Quick-witted|Resilient Radiant|Strong Steady|Tenacious Tireless|Unstoppable Unshakable|Valiant Vibrant|Wise Wholehearted|Xenial|Youthful|Zealous Zestful",
    noun: "Ambition Action|Belief Bravery|Courage Confidence|Dreams Discipline|Effort Energy|Faith Focus|Growth Gratitude|Hope Hustle|Inspiration Integrity|Joy Journey|Kindness Knowledge|Legacy Love|Mindset Momentum|Nerve Nobility|Opportunity Optimism|Passion Purpose|Quest|Resilience Respect|Strength Success|Tenacity Trust|Unity Understanding|Victory Vision|Willpower Wisdom|X-factor|Youth Yearning|Zeal Zest",
    verb: "Aspire Achieve|Believe Begin|Create Commit|Dream Dare|Endure Empower|Fight Flourish|Grow Give|Hope Heal|Inspire Improve|Jump Journey|Keep Kindle|Learn Lead|Motivate Move|Nurture Navigate|Overcome Open|Persevere Push|Question Quicken|Rise Reach|Strive Shine|Thrive Trust|Uplift Unite|Venture Value|Win Work|X-ray|Yearn Yield|Zoom",
  },
  school: {
    label: "School & club",
    adj: "Active Academic|Bright Brilliant|Creative Curious|Diligent Dedicated|Eager Enthusiastic|Friendly Fearless|Gifted Great|Helpful Hardworking|Inclusive Inspired|Joyful Junior|Keen Kind|Lively Local|Motivated Mighty|Nimble Noble|Original Outstanding|Passionate Proud|Quick Quality|Resourceful Responsible|Smart Supportive|Talented Thoughtful|United Unique|Valued Vibrant|Welcoming Wise|Xenial|Young Youthful|Zealous Zesty",
    noun: "Achievers Activities|Brains Buddies|Classmates Community|Discovery Debate|Education Explorers|Friends Fun|Goals Group|Heroes Helpers|Ideas Innovators|Journeys Juniors|Knowledge Kids|Learners Leaders|Members Minds|Neighbors Network|Opportunities Olympians|Pioneers Players|Questions Quizzes|Readers Rangers|Students Scholars|Teams Thinkers|Unity|Volunteers Voices|Writers Wonders|Xylophones|Youth Years|Zeal Zone",
    verb: "Achieve Aim|Build Belong|Create Collaborate|Discover Debate|Explore Excel|Focus Finish|Grow Gather|Help Hustle|Imagine Inspire|Join|Keep Know|Learn Lead|Mentor Meet|Network Nurture|Observe Organize|Participate Practice|Question Quiz|Read Respect|Study Serve|Teach Try|Unite Understand|Volunteer Value|Write Welcome|X-ray|Yell Yield|Zoom",
  },
  tech: {
    label: "Tech",
    adj: "Adaptive Automated|Binary Bold|Cyber Compatible|Digital Distributed|Encrypted Efficient|Fast Flexible|Global Graphical|Hybrid High-speed|Intelligent Interactive|Joint|Key|Logical Low-latency|Modular Mobile|Networked Next-gen|Optimized Open-source|Programmable Portable|Quantum Quick|Reliable Robust|Secure Scalable|Technical Transparent|Universal User-friendly|Virtual Versatile|Wireless Web-based|XML-based|Young|Zippy Zero-latency",
    noun: "Algorithms Apps|Bandwidth Bytes|Code Cloud|Data Devices|Engines Endpoints|Firmware Frameworks|Gateways Graphics|Hardware Hosting|Interfaces Integration|JavaScript Jobs|Kernels Keyboards|Logic Libraries|Machines Modules|Networks Nodes|Operations Output|Platforms Pixels|Queries Queues|Routers Robots|Systems Software|Technology Terminals|Updates Users|Visualization Versions|Websites Widgets|XML X-rays|Yottabytes Yields|Zettabytes Zones",
    verb: "Automate Analyze|Build Boot|Code Compile|Deploy Debug|Encrypt Execute|Fetch Fix|Generate Gather|Host Handle|Integrate Install|Join|Keep Kickstart|Launch Load|Monitor Migrate|Navigate Network|Optimize Operate|Process Program|Query Queue|Render Run|Scale Sync|Test Transmit|Upload Upgrade|Validate Visualize|Write Wrap|X-ray|Yield|Zip Zoom",
  },
};

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];
export const themeLabel = (id: ThemeId) => THEMES[id].label;

const parsed: Record<string, string[][]> = {};
function words(theme: ThemeId, pos: Pos): string[][] {
  const key = `${theme}:${pos}`;
  return (parsed[key] ??= THEMES[theme][pos].split("|").map((seg) => seg.split(" ")));
}

/** Words available for a letter in a theme, by part of speech (used by tests). */
export function wordsFor(theme: ThemeId, pos: Pos, letter: string): string[] {
  return words(theme, pos)[letter.toUpperCase().charCodeAt(0) - 65] ?? [];
}

export const MAX_BACKRONYM_LETTERS = 12;

export function cleanLetters(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, "").slice(0, MAX_BACKRONYM_LETTERS);
}

/** Part-of-speech pattern so the phrase reads like a phrase: adjective, noun, verb, … ending on a noun. */
function slots(n: number, rng: Rng): Pos[] {
  if (n === 1) return ["noun"];
  if (n === 2) return rng() < 0.5 ? ["adj", "noun"] : ["verb", "noun"];
  if (n === 3) return rng() < 0.5 ? ["adj", "noun", "verb"] : ["verb", "adj", "noun"];
  const cycle: Pos[] = ["adj", "noun", "verb"];
  const out = Array.from({ length: n }, (_, i) => cycle[i % 3]);
  out[n - 1] = "noun";
  return out;
}

export interface Backronym { theme: ThemeId; words: string[]; text: string }

/** Ten (or `count`) different phrases for the letters, each drawn from one theme. Same seed, same ideas. */
export function backronyms(letters: string, themes: ThemeId[], count: number, seed: number): Backronym[] {
  const rng = createRng(seed);
  const L = cleanLetters(letters);
  const pool = themes.length ? themes : THEME_IDS;
  if (!L) return [];
  const out: Backronym[] = [];
  const seen = new Set<string>();
  const usedWords = new Set<string>(); // keys are "theme:word"
  let tries = 0;
  const start = Math.floor(rng() * pool.length);
  while (out.length < count && tries < count * 40) {
    const theme = pool[(start + tries) % pool.length];
    tries += 1;
    const pattern = slots(L.length, rng);
    const picked: string[] = [];
    for (let i = 0; i < L.length; i++) {
      const all = wordsFor(theme, pattern[i], L[i]);
      // Prefer words not yet used in this batch, so ideas from the same theme do not look alike.
      const fresh = all.filter((w) => !picked.includes(w) && !usedWords.has(`${theme}:${w}`));
      const fallback = all.filter((w) => !picked.includes(w));
      const list = fresh.length ? fresh : fallback.length ? fallback : all;
      picked.push(list[Math.floor(rng() * list.length)]);
    }
    const text = picked.join(" ");
    if (seen.has(text)) continue;
    seen.add(text);
    picked.forEach((w) => usedWords.add(`${theme}:${w}`));
    out.push({ theme, words: picked, text });
  }
  return out;
}
