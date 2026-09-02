import {
  validateFilterPairCoverage,
  validatePremiumCollection,
  type PremiumCollectionConfig,
  type PremiumDepth,
  type PremiumPromptItem,
} from "@/data/premiumTypes";
import { topics } from "@/data/topics";

type SpeechCategory =
  | "Everyday Life & Personal Growth"
  | "School & Learning"
  | "Work & Leadership"
  | "Technology & Society"
  | "Creativity & Culture";

type SpeechAudience =
  | "Middle & High School"
  | "College Students"
  | "Professionals"
  | "Any Speaker";

type SpeechType = "Informative" | "Persuasive" | "Personal Story" | "How-To";

const CATEGORIES: SpeechCategory[] = [
  "Everyday Life & Personal Growth",
  "School & Learning",
  "Work & Leadership",
  "Technology & Society",
  "Creativity & Culture",
];

const AUDIENCES: SpeechAudience[] = [
  "Middle & High School",
  "College Students",
  "Professionals",
  "Any Speaker",
];

const SPEECH_TYPES: SpeechType[] = ["Informative", "Persuasive", "Personal Story", "How-To"];

const topicMatrix: Record<SpeechCategory, Record<SpeechAudience, Record<SpeechType, string>>> = {
  "Everyday Life & Personal Growth": {
    "Middle & High School": {
      Informative: "Why small habits are easier to keep when they are tied to a visible cue",
      Persuasive: "Schools should protect one period each week for practical life skills",
      "Personal Story": "A small decision that changed the direction of my whole day",
      "How-To": "How to recover a productive afternoon after a bad morning",
    },
    "College Students": {
      Informative: "How sleep changes memory, attention, and the quality of studying",
      Persuasive: "Universities should teach practical decision-making as a required first-year skill",
      "Personal Story": "The moment I realized being busy was not the same as making progress",
      "How-To": "How to turn a semester goal into a weekly system you can maintain",
    },
    Professionals: {
      Informative: "Why context switching can feel productive while quietly reducing output",
      Persuasive: "Workplaces should normalize protected focus blocks instead of rewarding constant availability",
      "Personal Story": "A small professional risk that taught me more than playing safe",
      "How-To": "How to reset priorities when everything on the list appears urgent",
    },
    "Any Speaker": {
      Informative: "Why people underestimate the compound effect of ten focused minutes a day",
      Persuasive: "Ordinary routines deserve as much intentional design as major goals",
      "Personal Story": "A promise I kept to myself when nobody else would have noticed",
      "How-To": "How to design a one-week habit experiment without relying on motivation",
    },
  },
  "School & Learning": {
    "Middle & High School": {
      Informative: "How retrieval practice helps the brain remember more than rereading notes",
      Persuasive: "Students should give more short presentations before they are graded on major ones",
      "Personal Story": "Feedback I did not want to hear but eventually learned to use",
      "How-To": "How to teach an unfamiliar idea to a classmate in three clear steps",
    },
    "College Students": {
      Informative: "Why spacing study sessions works better than one long night of cramming",
      Persuasive: "Every college course should include at least one teach-back assignment",
      "Personal Story": "A course that changed the question I wanted to pursue",
      "How-To": "How to turn a broad research topic into a focused five-minute explanation",
    },
    Professionals: {
      Informative: "How adults learn faster when new knowledge is attached to a real project",
      Persuasive: "Companies should reserve paid time for deliberate learning, not just urgent delivery",
      "Personal Story": "What becoming a beginner again taught me about expertise",
      "How-To": "How to explain a technical idea to a nontechnical audience without talking down to them",
    },
    "Any Speaker": {
      Informative: "How curiosity strengthens memory by giving new facts somewhere to connect",
      Persuasive: "Learning how to learn should be treated as a basic public skill",
      "Personal Story": "A subject I misunderstood until someone explained it in a different way",
      "How-To": "How to explain one complex idea clearly without using slides",
    },
  },
  "Work & Leadership": {
    "Middle & High School": {
      Informative: "How different team roles affect the success of a school project",
      Persuasive: "Student groups should rotate leadership instead of choosing the same person every time",
      "Personal Story": "A group project where listening mattered more than having the best idea",
      "How-To": "How to run a ten-minute team check-in that actually helps the group",
    },
    "College Students": {
      Informative: "How psychological safety changes the way groups share unfinished ideas",
      Persuasive: "All internships that produce real business value should be paid",
      "Personal Story": "A group project that changed my definition of leadership",
      "How-To": "How to divide an ambiguous group assignment without creating resentment",
    },
    Professionals: {
      Informative: "How good teams make decisions when the available evidence is incomplete",
      Persuasive: "Teams should replace recurring status meetings with written updates whenever possible",
      "Personal Story": "A leader who changed their mind and gained rather than lost credibility",
      "How-To": "How to run a short pre-mortem before committing to an important plan",
    },
    "Any Speaker": {
      Informative: "How trust is built through small repeated behaviors rather than one grand gesture",
      Persuasive: "Leaders should say what they do not know before presenting a confident plan",
      "Personal Story": "A moment when I led without having a formal title",
      "How-To": "How to give useful feedback that is specific, fair, and possible to act on",
    },
  },
  "Technology & Society": {
    "Middle & High School": {
      Informative: "How recommendation algorithms learn what to show us next",
      Persuasive: "Schools should teach practical AI literacy before students use generative tools for assignments",
      "Personal Story": "A time technology solved one problem for me but created another",
      "How-To": "How to audit the privacy permissions on a phone in five minutes",
    },
    "College Students": {
      Informative: "How generative AI changes planning, drafting, revising, and fact-checking differently",
      Persuasive: "Students should disclose meaningful AI assistance in academic work",
      "Personal Story": "A digital tool that unexpectedly reshaped how I approached a field of study",
      "How-To": "How to verify an online claim before repeating it in a presentation",
    },
    Professionals: {
      Informative: "How automation shifts work from completing tasks to supervising judgment",
      Persuasive: "Teams should document when AI materially influences a customer-facing decision",
      "Personal Story": "A tool I adopted for speed that came with an unexpected cost",
      "How-To": "How to run a lightweight responsible-AI check before launching a workflow",
    },
    "Any Speaker": {
      Informative: "How convenience technology changes patience, memory, and everyday expectations",
      Persuasive: "Essential services should preserve a usable offline option",
      "Personal Story": "The first technology that stopped feeling magical and became ordinary to me",
      "How-To": "How to reduce notification noise without missing the messages that matter",
    },
  },
  "Creativity & Culture": {
    "Middle & High School": {
      Informative: "How creative constraints can produce more original ideas than unlimited choice",
      Persuasive: "Schools should protect arts funding even when budgets are under pressure",
      "Personal Story": "A story, song, or image that changed how I saw an ordinary experience",
      "How-To": "How to turn one rough idea into a five-minute talk with a beginning, middle, and end",
    },
    "College Students": {
      Informative: "How remix culture changes the meaning of originality and authorship",
      Persuasive: "Universities should give students protected time to make work with no grade attached",
      "Personal Story": "A creative project that failed in a useful way",
      "How-To": "How to use critique without losing the original voice of a project",
    },
    Professionals: {
      Informative: "How storytelling helps people understand decisions that data alone cannot explain",
      Persuasive: "Important meetings should use visual thinking instead of relying only on slide text",
      "Personal Story": "A customer story that changed the way I described a business problem",
      "How-To": "How to turn a page of data into one clear narrative for decision-makers",
    },
    "Any Speaker": {
      Informative: "Why humor travels across cultures imperfectly and what gets lost in translation",
      Persuasive: "Public spaces should reserve room for art created by local communities",
      "Personal Story": "A tradition I chose to keep, change, or reinvent",
      "How-To": "How to analyze a favorite everyday object as a piece of cultural design",
    },
  },
};

const outlineByType: Record<SpeechType, string[]> = {
  Informative: [
    "Hook (0:00–0:30): open with one surprising fact, contrast, or question.",
    "Explain (0:30–3:45): teach two or three connected ideas and make one concrete example do real work.",
    "Land (3:45–5:00): restate the useful takeaway and show where the audience can notice or apply it.",
  ],
  Persuasive: [
    "Position (0:00–0:45): state the change you want and why it matters now.",
    "Case (0:45–3:45): give two reasons, one example, and a fair response to the strongest objection.",
    "Close (3:45–5:00): return to the claim and end with one specific action or decision.",
  ],
  "Personal Story": [
    "Scene (0:00–1:00): place the audience in one specific moment with only the details they need.",
    "Turn (1:00–3:45): show the choice, surprise, mistake, or change rather than summarizing everything.",
    "Meaning (3:45–5:00): explain what changed in your thinking and connect it to the audience.",
  ],
  "How-To": [
    "Outcome (0:00–0:30): show the result and name who the method is for.",
    "Method (0:30–4:00): teach no more than three steps, including one common mistake or live example.",
    "Test (4:00–5:00): recap the steps and give the audience one way to try the method today.",
  ],
};

const depthByType: Record<SpeechType, PremiumDepth> = {
  Informative: "Medium",
  Persuasive: "Deep",
  "Personal Story": "Medium",
  "How-To": "Light",
};

let sequence = 0;
export const FIVE_MINUTE_SPEECH_TOPICS: PremiumPromptItem[] = CATEGORIES.flatMap((category) =>
  AUDIENCES.flatMap((audience) =>
    SPEECH_TYPES.map((speechType) => {
      sequence += 1;
      return {
        id: `five-minute-speech-${String(sequence).padStart(2, "0")}`,
        prompt: topicMatrix[category][audience][speechType],
        category,
        audience,
        useCase: speechType,
        duration: "5 min",
        depth: depthByType[speechType],
        followUps: outlineByType[speechType],
        facilitationTip: "Plan for 30 seconds, speak from keywords rather than a script, and leave the final 30 seconds for a deliberate closing sentence.",
      };
    }),
  ),
);

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const EXISTING_SPEECH_PROMPTS = new Set(
  topics.filter((topic) => topic.modes.includes("speech")).map((topic) => normalize(topic.text)),
);

for (const item of FIVE_MINUTE_SPEECH_TOPICS) {
  if (EXISTING_SPEECH_PROMPTS.has(normalize(item.prompt))) {
    throw new Error(`5-minute-speech-topics: overlaps an existing speech prompt: ${item.prompt}`);
  }
}

export const FIVE_MINUTE_SPEECH_CONFIG: PremiumCollectionConfig = {
  slug: "5-minute-speech-topics",
  path: "/5-minute-speech-topics",
  eyebrow: "Choose, outline, and deliver in one place",
  title: "80 Five-Minute Speech Topics",
  metaTitle: "80 Five-Minute Speech Topics + Practice Timer",
  metaDescription: "Practice with 80 original five-minute speech topics for students and professionals. Filter by audience and speech type, use a timed outline, then start the built-in timer.",
  subtitle: "Original five-minute topics with audience and speech-type filters, a practical three-part outline, no-repeat randomizer, and a timer preset to five minutes.",
  intro: "A five-minute speech is long enough to make one real point but short enough that every sentence needs a job. This collection is designed around that constraint. Each topic comes with a timed opening, body, and closing plan instead of a vague prompt alone. The 80 topics form a complete matrix across five themes, four audiences, and four speech types, so students, club speakers, and professionals can practice the exact kind of short talk they need.",
  published: "2026-09-02",
  updated: "2026-09-02",
  source: "five_minute_speech_collection",
  promptNoun: "topic",
  itemCountLabel: "Original five-minute topics",
  filters: [
    { key: "category", label: "Theme", allLabel: "All themes", options: CATEGORIES },
    { key: "audience", label: "Audience", allLabel: "Any audience", options: AUDIENCES },
    { key: "useCase", label: "Speech type", allLabel: "Any speech type", options: SPEECH_TYPES },
    { key: "depth", label: "Difficulty", allLabel: "Any difficulty", options: ["Light", "Medium", "Deep"] },
  ],
  items: FIVE_MINUTE_SPEECH_TOPICS,
  tool: {
    title: "Generate a Five-Minute Speech Topic",
    description: "Filter by audience, theme, or speech type. Draw without repeats, copy the timed outline, and move directly into the five-minute practice timer.",
    actionLabel: "Give Me a 5-Minute Topic",
    emptyLabel: "Choose a filter or draw from all 80 topics. Every result includes a timed three-part outline.",
    copyStyle: "speech",
    supportLabel: "Five-minute outline",
    timer: true,
    daily: false,
    planner: false,
  },
  guide: {
    title: "A repeatable five-minute speech routine",
    intro: "Use the same preparation rhythm every time. Repetition makes structure automatic, which leaves more attention for clarity, voice, and connection.",
    steps: [
      { title: "Choose one promise", description: "Decide what the audience should understand, believe, remember, or try by the end. A five-minute speech cannot carry several unrelated goals." },
      { title: "Plan three beats", description: "Use the supplied opening, body, and closing timing. Write keywords or evidence, not full sentences, so the delivery stays spoken rather than read." },
      { title: "Run the timer", description: "Take 30 seconds to prepare, select the five-minute preset, and keep speaking through small mistakes. Mark whether the opening, body, or close ran long." },
      { title: "Repeat one variable", description: "Try the same topic again while changing only one thing: a shorter hook, clearer example, stronger transition, or more deliberate final sentence." },
    ],
  },
  qualityNotes: [
    "All 80 topics were written for this collection and are separate from the general speech, Toastmasters, college, persuasive, and informative lists.",
    "The bank covers every combination of five themes, four audiences, and four speech types rather than relabeling one generic pool.",
    "Every topic includes a time-boxed opening, body, and close that fits an actual five-minute delivery.",
    "The page keeps the full crawlable and printable collection alongside the no-repeat generator, timer, copy, save, and share actions.",
  ],
  parentLink: { label: "Speech topic generator and timer", href: "/speech" },
  relatedLinks: [
    { label: "Impromptu speech topics", href: "/impromptu-speech-topics", description: "Practice faster one- and two-minute responses." },
    { label: "Speech topics for college students", href: "/topics/speech-topics-for-college-students", description: "Browse a college-focused long-form collection." },
    { label: "Toastmasters Table Topics", href: "/topics/toastmasters-table-topics", description: "Run a club-style speaking drill with timed feedback." },
  ],
  faq: [
    { question: "How many words fit in a five-minute speech?", answer: "Most speakers deliver roughly 600 to 750 words in five minutes, but a practice speech should be planned in ideas rather than filled to a word target. Pauses, examples, and audience response all change the pace." },
    { question: "How should I structure a five-minute speech?", answer: "Use about 30 to 45 seconds for the opening, three minutes for two or three connected points, and the final minute for the takeaway and close. Every generated topic includes a structure matched to its speech type." },
    { question: "Are these topics suitable for students?", answer: "Yes. Use the Middle & High School or College Students filter. The topics avoid requiring specialist research, private disclosure, or political allegiance, while still leaving room for a substantive point." },
    { question: "Does the generator repeat topics?", answer: "It avoids repeats until every topic matching the selected filters has been used. Changing filters starts a fresh practice set." },
  ],
  library: { category: "education", modes: ["speech"] },
};

validatePremiumCollection(FIVE_MINUTE_SPEECH_CONFIG, 80);
validateFilterPairCoverage(FIVE_MINUTE_SPEECH_CONFIG, "category", "audience", { minimum: 4 });
validateFilterPairCoverage(FIVE_MINUTE_SPEECH_CONFIG, "audience", "useCase", { minimum: 5 });
