import {
  validatePremiumCollection,
  type PremiumCollectionConfig,
  type PremiumDepth,
  type PremiumPromptItem,
} from "@/data/premiumTypes";
import { topics } from "@/data/topics";

const CATEGORIES = [
  "Everyday Life",
  "Fun & Silly",
  "Opinions & Debate",
  "Personal Stories",
  "School & Learning",
  "Work & Ideas",
] as const;
type Category = (typeof CATEGORIES)[number];

const AUDIENCES = ["Students", "Adults", "Any Speaker"] as const;
const TYPES = ["Describe", "Opinion", "Story", "Explain"] as const;
type SpeechType = (typeof TYPES)[number];

// Four topics per speech type, per category. Written for this page: each one has a single point
// that can be made in about 150 spoken words.
const BANK: Record<Category, Record<SpeechType, string[]>> = {
  "Everyday Life": {
    Describe: [
      "Your ideal ten minutes of quiet in the morning",
      "The sound of a place you walk through every day",
      "The most comfortable spot in your home",
      "What your kitchen smells like at dinner time",
    ],
    Opinion: [
      "Why a short walk beats scrolling during a break",
      "Whether handwritten notes still matter",
      "Why queues teach us something useful",
      "Whether mornings or evenings are better for thinking",
    ],
    Story: [
      "The last time you were truly lost and what happened",
      "A small kindness from a stranger that you still remember",
      "A meal that went wrong and turned out better",
      "The day your plans changed completely",
    ],
    Explain: [
      "How to make a decent cup of tea or coffee",
      "How to pack a bag in under five minutes",
      "Why we yawn and why it spreads",
      "How to say no politely",
    ],
  },
  "Fun & Silly": {
    Describe: [
      "A pet that rules the house like a tiny boss",
      "The world's most useless superpower",
      "A theme park built entirely around one food",
      "A day in the life of a sock that lost its pair",
    ],
    Opinion: [
      "Whether pineapple belongs on pizza, settled once and for all",
      "Why every home should have one very silly hat",
      "Whether cats or dogs would make better mayors",
      "Why dancing in the kitchen counts as exercise",
    ],
    Story: [
      "The funniest thing that ever happened at a family gathering",
      "A time you laughed at the worst possible moment",
      "How an animal once outsmarted you",
      "The weirdest gift you have ever received",
    ],
    Explain: [
      "How to survive a zombie apocalypse using only kitchen items",
      "How to win at hide and seek every time",
      "How a made-up holiday could become a real tradition",
      "How to tell a joke so it actually lands",
    ],
  },
  "Opinions & Debate": {
    Describe: [
      "A rule you would change if you ran your town for a day",
      "What a fair world looks like at a school lunch table",
      "The best public space you have ever visited",
      "A future city you would be happy to live in",
    ],
    Opinion: [
      "Should homework be replaced by projects",
      "Should everyone learn a second language",
      "Are phones in class a tool or a distraction",
      "Is it better to be good at one thing or okay at many",
    ],
    Story: [
      "A time you changed your mind and why",
      "An argument you lost and what you learned from it",
      "A moment you stood up for someone",
      "A disagreement that ended in a better idea",
    ],
    Explain: [
      "How to disagree without making it personal",
      "Why both sides of an argument often have a point",
      "How to spot a one-sided headline",
      "How to give feedback so someone actually uses it",
    ],
  },
  "Personal Stories": {
    Describe: [
      "Your earliest clear memory",
      "The person who taught you the most, in three details",
      "A place that feels like home even though it is not",
      "A photograph that tells a whole story",
    ],
    Opinion: [
      "Why failing early is a gift",
      "Whether childhood heroes should stay heroes",
      "Why traditions are worth keeping",
      "Whether you should go with your gut or the facts",
    ],
    Story: [
      "The bravest thing you have done, even if small",
      "A time you were nervous and did it anyway",
      "A moment you felt proud for no one but yourself",
      "How you met your best friend",
    ],
    Explain: [
      "How a hobby changed the way you see the world",
      "What you would tell a younger you in one minute",
      "How you handle a really bad day",
      "How you learned to ask for help",
    ],
  },
  "School & Learning": {
    Describe: [
      "The best teacher you ever had",
      "A subject you did not expect to love",
      "The perfect study spot",
      "A school trip you will never forget",
    ],
    Opinion: [
      "Should school start later in the day",
      "Is it better to learn from mistakes or from examples",
      "Should every student have to learn to cook",
      "Do exams measure learning or memory",
    ],
    Story: [
      "A time you taught someone something",
      "The moment a hard idea suddenly made sense",
      "A group project that went surprisingly well",
      "Your first day at a new school, club or team",
    ],
    Explain: [
      "How to remember anything with a simple memory trick",
      "How to make a first draft without freezing",
      "How to prepare for a test in one evening",
      "How to read a long chapter faster without skimming",
    ],
  },
  "Work & Ideas": {
    Describe: [
      "Your dream workday from start to finish",
      "An invention the world needs next year",
      "The best team you have been part of",
      "A tool that quietly improved your work",
    ],
    Opinion: [
      "Are meetings better standing up",
      "Should every job include one hour a week for learning",
      "Is it better to ask for forgiveness or permission",
      "Is remote work good for creativity",
    ],
    Story: [
      "A mistake at work that taught you something lasting",
      "A time you had to explain something complicated to a customer",
      "The best advice a boss or mentor ever gave you",
      "A first job you still think about",
    ],
    Explain: [
      "How to give a clear update in sixty seconds",
      "How to start a hard conversation",
      "How to say what you do at a party without jargon",
      "How to prioritise when everything feels urgent",
    ],
  },
};

const OUTLINE: Record<SpeechType, string[]> = {
  Describe: [
    "Hook (0:00–0:10): name the subject and one vivid detail.",
    "Detail (0:10–0:45): give two or three senses or specifics, not a list of adjectives.",
    "Close (0:45–1:00): say why it matters to you in one sentence.",
  ],
  Opinion: [
    "Claim (0:00–0:10): say your view in one sentence.",
    "Reasons (0:10–0:45): one strong reason, one quick example.",
    "Close (0:45–1:00): repeat the claim and end on what you would do about it.",
  ],
  Story: [
    "Scene (0:00–0:15): when and where, with one detail.",
    "Turn (0:15–0:45): the moment something changed.",
    "Point (0:45–1:00): what it taught you, in one line.",
  ],
  Explain: [
    "Promise (0:00–0:10): say what the audience will be able to do or understand.",
    "Steps (0:10–0:45): at most three steps or ideas, with one example.",
    "Recap (0:45–1:00): repeat the three points in a single sentence.",
  ],
};

const DEPTH: Record<SpeechType, PremiumDepth> = { Describe: "Light", Story: "Light", Explain: "Medium", Opinion: "Medium" };

let seq = 0;
export const ONE_MINUTE_SPEECH_TOPICS: PremiumPromptItem[] = CATEGORIES.flatMap((category) =>
  TYPES.flatMap((type) =>
    BANK[category][type].map((prompt, i) => {
      seq += 1;
      return {
        id: `one-minute-speech-${String(seq).padStart(2, "0")}`,
        prompt,
        category,
        audience: AUDIENCES[(seq + i) % 3],
        useCase: type,
        duration: "1 min",
        depth: DEPTH[type],
        followUps: OUTLINE[type],
        facilitationTip: "Take 15 seconds to choose one point, then speak. Stop on your closing sentence, not when the timer runs out.",
      };
    }),
  ),
);

const normalize = (v: string) => v.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const EXISTING = new Set(topics.filter((t) => t.modes.includes("speech")).map((t) => normalize(t.text)));
for (const item of ONE_MINUTE_SPEECH_TOPICS) {
  if (EXISTING.has(normalize(item.prompt))) throw new Error(`1-minute-speech-topics: overlaps an existing speech prompt: ${item.prompt}`);
}

const COUNT = ONE_MINUTE_SPEECH_TOPICS.length;

export const ONE_MINUTE_SPEECH_CONFIG: PremiumCollectionConfig = {
  slug: "1-minute-speech-topics",
  path: "/1-minute-speech-topics",
  eyebrow: "Pick a topic, start the clock, talk for 60 seconds",
  title: `${COUNT} Random Topics to Talk About for 1 Minute`,
  metaTitle: `1 Minute Speech Topics: ${COUNT} Random Topics to Talk About`,
  metaDescription: `Random topics to talk about for 1 minute: ${COUNT} one-minute speech topics for students and adults, each with a 60-second outline and a built-in 1-minute timer. Free random topic generator.`,
  subtitle: `Need random topics to talk about for 1 minute? Press the button for a topic, take 15 seconds to choose one point, then start the 60-second timer. Every topic is small enough to cover in about 150 words, comes with a three-beat outline, and never repeats until you have seen them all.`,
  intro: `A one-minute talk has room for one idea, so a good topic is narrow and concrete. This collection has ${COUNT} topics across six themes and four kinds of talk: describe something, give an opinion, tell a short story or explain how something works. Each comes with a timed outline split into an opening, a middle and a close. Use it for Just-a-Minute games, class warm-ups, interview practice, Toastmasters-style drills or filling a quiet moment at a meeting. For faster, no-prep answers see the impromptu speech topics; for a full talk see the five-minute speech topics.`,
  published: "2026-10-27",
  updated: "2026-10-27",
  source: "one_minute_speech_collection",
  promptNoun: "topic",
  itemCountLabel: "One-minute topics",
  speechMinutes: 1,
  faqSchema: true,
  filters: [
    { key: "category", label: "Theme", allLabel: "All themes", options: [...CATEGORIES] },
    { key: "audience", label: "Audience", allLabel: "Any audience", options: [...AUDIENCES] },
    { key: "useCase", label: "Kind of talk", allLabel: "Any kind of talk", options: [...TYPES] },
    { key: "depth", label: "Difficulty", allLabel: "Any difficulty", options: ["Light", "Medium"] },
  ],
  items: ONE_MINUTE_SPEECH_TOPICS,
  tool: {
    title: "Generate a One-Minute Speech Topic",
    description: "Filter by theme, audience or kind of talk. Draw without repeats, copy the 60-second outline, and run the one-minute timer.",
    actionLabel: "Give Me a 1-Minute Topic",
    emptyLabel: `Choose a filter or draw from all ${COUNT} topics. Every result includes a three-beat 60-second outline.`,
    copyStyle: "speech",
    supportLabel: "One-minute outline",
    timer: true,
    daily: false,
    planner: false,
  },
  guide: {
    title: "A 60-second routine that works",
    intro: "Sixty seconds goes fast. Use the same short routine every time and the structure becomes automatic.",
    steps: [
      { title: "Choose one point", description: "Decide the single thing you want the listener to remember. A minute cannot carry two." },
      { title: "Open with a detail", description: "Skip greetings and warm-ups. Start with the surprising fact, the scene or your claim." },
      { title: "Run the timer", description: "Start the one-minute timer and keep going through small slips. Do not restart; just carry on." },
      { title: "Finish on purpose", description: "End with a closing sentence you planned, even if you have a few seconds left. A clean stop sounds confident." },
    ],
  },
  qualityNotes: [
    `All ${COUNT} topics were written for this page and are separate from the impromptu, five-minute and Toastmasters lists.`,
    "Each theme has the same four kinds of talk, so you can switch type without losing the theme.",
    "Every topic includes a time-boxed outline that fits a real 60-second delivery.",
    "The full list stays on the page to read or print, alongside the no-repeat generator, timer, copy, save and share actions.",
  ],
  parentLink: { label: "Speech topic generator and timer", href: "/speech" },
  relatedLinks: [
    { label: "Impromptu speech topics", href: "/impromptu-speech-topics", description: "No-prep topics for one- and two-minute responses." },
    { label: "1 minute impromptu speech topics", href: "/impromptu-speech-topics/1-minute", description: "Quick-fire prompts with a no-prep timer." },
    { label: "5 minute speech topics", href: "/5-minute-speech-topics", description: "Step up to a full five-minute talk with an outline." },
    { label: "Toastmasters table topics", href: "/topics/toastmasters-table-topics", description: "Club-style 1–2 minute speaking drills." },
  ],
  faq: [
    { question: "How many words is a 1-minute speech?", answer: "About 130 to 160 words at a natural speaking pace. Plan around one point and one example, not a word count, because pauses and emphasis use up the time." },
    { question: "What are good random topics to talk about for 1 minute?", answer: "Narrow, concrete topics work best: a place you know well, a quick opinion, a short story or a three-step explanation. This page has 96 across six themes, each with a 60-second outline." },
    { question: "How do I practise talking for a minute without running out of things to say?", answer: "Pick one point before you start, then use the opening, middle and close in the outline. If you dry up, add a concrete example or a detail you can see or hear." },
    { question: "Is there a one-minute topic wheel or random topic picker?", answer: "Yes. The generator above is a random picker that avoids repeats. Press the button for a topic, then use the built-in timer. You can filter by theme, audience or kind of talk." },
    { question: "How is this different from impromptu speech topics?", answer: "Impromptu topics are meant to be answered with no prep at all. These come with a short outline and a recommended 15 seconds of planning, which is closer to a Just-a-Minute game or a short presentation." },
  ],
  library: { category: "education", modes: ["speech"] },
};

validatePremiumCollection(ONE_MINUTE_SPEECH_CONFIG, 96);
