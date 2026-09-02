import { QOTD_QUESTIONS } from "@/data/questionOfTheDay";
import { STUDENT_QOTD_QUESTIONS, WORK_QOTD_QUESTIONS } from "@/data/premiumQotd";
import {
  validateFilterPairCoverage,
  validatePremiumCollection,
  type PremiumCollectionConfig,
  type PremiumPromptItem,
} from "@/data/premiumTypes";

type FunnyCategory =
  | "Silly Choices"
  | "Everyday Chaos"
  | "Wild Imagination"
  | "Food & Objects"
  | "Harmless Personality";

type FunnyAudience = "Kids & Families" | "Students" | "Work Teams" | "Friends & Parties";
type FunnyUseCase = "Quick Check-In" | "Poll & Vote" | "Group Share" | "Writing Warm-Up" | "Icebreaker Round";

const CATEGORIES: FunnyCategory[] = [
  "Silly Choices",
  "Everyday Chaos",
  "Wild Imagination",
  "Food & Objects",
  "Harmless Personality",
];

const AUDIENCES: FunnyAudience[] = ["Kids & Families", "Students", "Work Teams", "Friends & Parties"];
const USE_CASES: FunnyUseCase[] = ["Quick Check-In", "Poll & Vote", "Group Share", "Writing Warm-Up", "Icebreaker Round"];

const questionMatrix: Record<FunnyCategory, Record<FunnyAudience, string[]>> = {
  "Silly Choices": {
    "Kids & Families": [
      "Would you rather have elbows that squeak or knees that play tiny drumrolls?",
      "Which family pet would make the funniest mayor, and what would its first rule be?",
      "Would you rather walk backward inside the house or speak in rhymes outside it?",
      "Would you choose shoes that honk or a backpack that giggles whenever it opens?",
      "Would you rather swap breakfast and dinner forever or wear pajamas to every fancy event?",
    ],
    Students: [
      "Would you rather enter every class with theme music or with a round of applause?",
      "Would homework be funnier if it were explained by a dramatic pirate or a bored robot?",
      "Would you rather have a locker that opens after a joke or after a ten-second dance?",
      "Would you choose pencils that are one meter long or erasers that squeak like mice?",
      "Would you rather take a surprise quiz about memes or about mystery cafeteria ingredients?",
    ],
    "Work Teams": [
      "Would you rather receive every update as a movie trailer or as a weather forecast?",
      "Should meetings be named like sitcom episodes or color-coded by the host's mood?",
      "Would you rather get advice from the printer or a performance review from the coffee machine?",
      "Would you choose a camera stuck in sepia mode or a microphone with a stadium echo?",
      "Would you rather write every status update as a haiku or deliver it from a tiny podium?",
    ],
    "Friends & Parties": [
      "Would you rather make every entrance through a fog machine or with a laugh track?",
      "Would you rather use only stickers in the group chat or send every voice note in a new accent?",
      "Would you rather always choose the restaurant or always control the playlist?",
      "Would you choose matching hats for the group or a secret handshake that takes 45 seconds?",
      "Would you rather lose the ability to whisper or have to whisper at every party?",
    ],
  },
  "Everyday Chaos": {
    "Kids & Families": [
      "If missing socks escape on purpose, where do you think they go?",
      "Which household chore deserves dramatic boss-battle music?",
      "If one toy narrated the family's day, which toy would be the least reliable?",
      "If one room in your home could roll away for the afternoon, which room should go sightseeing?",
      "What ridiculous sound should replace the family's morning alarm?",
    ],
    Students: [
      "What brutally honest review would your backpack write about you?",
      "If the school bell could speak, what phrase would it repeat all day?",
      "What award should cafeteria trays give students at the end of lunch?",
      "Which classroom object is secretly most qualified to become the school mascot?",
      "What is the funniest way autocorrect could ruin a homework title?",
    ],
    "Work Teams": [
      "If your inbox sent one automatic honest reply today, what would it say?",
      "Which square belongs in a painfully accurate meeting-bingo card?",
      "Which office object deserves a promotion, and what new title should it receive?",
      "If the next 15-minute meeting became a game show, what would the prize be?",
      "If your largest spreadsheet had an emotion, what emotion would it be expressing?",
    ],
    "Friends & Parties": [
      "Which excuse for arriving late deserves its own trophy category?",
      "Who in a fictional friend group would confidently read the map upside down?",
      "What harmless autocorrect mistake could accidentally improve a group-chat message?",
      "What unnecessary rule would make a simple weekend trip much more dramatic?",
      "If an ordinary plan with friends became a documentary, what would the narrator call it?",
    ],
  },
  "Wild Imagination": {
    "Kids & Families": [
      "If the moon were made of something other than cheese, what would be funniest?",
      "If you could keep one cloud as a pet, what trick would you teach it?",
      "What job would a dragon the size of a sandwich be surprisingly good at?",
      "If you were invisible for ten minutes, what harmless prank would be hardest to resist?",
      "Which animal would drive the funniest school bus, and how would the ride change?",
    ],
    Students: [
      "If a classroom time machine glitched, which lesson would become the strangest?",
      "How would school rules change if the entire building floated on a cloud?",
      "What unexpected hobby would an AI substitute teacher reveal on its first day?",
      "If one textbook became a portal, which chapter would students visit first?",
      "What would happen during passing period if gravity turned off for exactly one minute?",
    ],
    "Work Teams": [
      "If the office became a spaceship, which department would insist on controlling navigation?",
      "If you could clone yourself for one task only, what would the clone immediately complain about?",
      "If an alien asked what your job accomplishes, which part would be hardest to explain?",
      "How would work change if every email had to arrive by tiny carrier pigeon?",
      "If the company mascot came alive for one day, what problem would it try to solve first?",
    ],
    "Friends & Parties": [
      "If your friend group were a movie genre, which genre would require the smallest rewrite?",
      "What completely useless luxury would you bring to a deserted island?",
      "If you could teleport only when doing something embarrassing, how often would you use it?",
      "Which historical era would make the funniest badly organized group vacation?",
      "Which fictional side character would fit into your group better than the main hero?",
    ],
  },
  "Food & Objects": {
    "Kids & Families": [
      "Which breakfast cereal mascot would be the worst babysitter?",
      "If a vegetable became a superhero, what would its least impressive power be?",
      "What kind of weather would a pizza predict?",
      "Which item in the refrigerator would win a family talent show?",
      "If you invented a sandwich named after today, what would be inside it?",
    ],
    Students: [
      "Which cafeteria food would make the strictest school principal?",
      "If your pencil case hosted a podcast, what would its first episode expose?",
      "Which snack would teach the most entertaining class subject?",
      "What surprise item should a school vending machine dispense once a week?",
      "If your notebook planned revenge for being ignored, what would it do?",
    ],
    "Work Teams": [
      "What formal name would make the office coffee machine sound like an executive?",
      "Which award would your desk chair nominate itself to receive?",
      "Which desk snack best represents the team's current energy?",
      "If the main spreadsheet became a restaurant menu, which tab would be the daily special?",
      "What would the title of your favorite work mug's unauthorized biography be?",
    ],
    "Friends & Parties": [
      "Which pizza topping has the most suspicious personality?",
      "If kitchen utensils formed a band, which utensil would demand a solo?",
      "Which snack would you trust most in a completely imaginary emergency?",
      "Which ordinary object would make the worst travel companion on a road trip?",
      "What boring menu item deserves a dramatic new name?",
    ],
  },
  "Harmless Personality": {
    "Kids & Families": [
      "What sound effect should play whenever you enter a room?",
      "Which animal would be your best teammate in a very silly competition?",
      "What superpower would be useful only while doing laundry?",
      "If your nickname came from the last snack you ate, what would everyone call you?",
      "What tiny achievement deserves a trophy in your home this week?",
    ],
    Students: [
      "Which three emojis give the most accurate review of your school day?",
      "What would your harmless habit warning label say?",
      "Which school subject would make the most chaotic roommate?",
      "What oddly specific skill would you demonstrate at a school talent show?",
      "Which fictional character would contribute the least to your next group project?",
    ],
    "Work Teams": [
      "If your workday were a weather forecast, what is the current prediction?",
      "What harmless office superpower would improve your week by exactly ten percent?",
      "What title should someone earn after keeping more than 30 browser tabs open?",
      "Which unofficial role do you usually play in a meeting?",
      "What animal would make the most accurate mascot for your current work style?",
    ],
    "Friends & Parties": [
      "What would the title of your friend group's sitcom be?",
      "Which completely trivial activity could you compete in professionally?",
      "What song should play during your unnecessarily dramatic entrance?",
      "Which harmless opinion could you defend for much longer than anyone wants?",
      "Which everyday object belongs in a tiny museum exhibit about you?",
    ],
  },
};

const followUpsByUseCase: Record<FunnyUseCase, string[]> = {
  "Quick Check-In": [
    "Give the answer in one sentence before explaining it.",
    "Who would probably choose the opposite answer?",
  ],
  "Poll & Vote": [
    "Vote before anyone explains their choice.",
    "What one new rule or detail would change your vote?",
  ],
  "Group Share": [
    "What tiny detail makes your answer especially yours?",
    "Which answer from the group surprised you most?",
  ],
  "Writing Warm-Up": [
    "Write the funniest version of the answer in three sentences.",
    "Add one unexpected but harmless consequence.",
  ],
  "Icebreaker Round": [
    "What does the answer reveal about one harmless quirk?",
    "Invite someone with the opposite answer to defend it.",
  ],
};

let sequence = 0;
export const FUNNY_QOTD_QUESTIONS: PremiumPromptItem[] = CATEGORIES.flatMap((category) =>
  AUDIENCES.flatMap((audience) =>
    questionMatrix[category][audience].map((question, index) => {
      sequence += 1;
      const useCase = USE_CASES[index];
      return {
        id: `funny-qotd-${String(sequence).padStart(3, "0")}`,
        prompt: question,
        category,
        audience,
        useCase,
        duration: index < 2 ? "Under 1 min" : "2–5 min",
        depth: "Light",
        followUps: followUpsByUseCase[useCase],
        facilitationTip: audience === "Work Teams"
          ? "Keep answers optional and workplace-safe; the question should add energy without putting anyone on the spot."
          : audience === "Kids & Families"
            ? "Let everyone pass, avoid turning an answer into teasing, and celebrate unusual reasoning rather than a single funniest person."
            : "Keep the joke attached to the imaginary situation or the speaker's own answer, never to someone else's identity or vulnerability.",
      };
    }),
  ),
);

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const EXISTING_QOTD_PROMPTS = new Set([
  ...QOTD_QUESTIONS.map((item) => normalize(item.q)),
  ...STUDENT_QOTD_QUESTIONS.map((item) => normalize(item.prompt)),
  ...WORK_QOTD_QUESTIONS.map((item) => normalize(item.prompt)),
]);

for (const item of FUNNY_QOTD_QUESTIONS) {
  if (EXISTING_QOTD_PROMPTS.has(normalize(item.prompt))) {
    throw new Error(`funny-question-of-the-day: overlaps an existing QOTD prompt: ${item.prompt}`);
  }
}

export const FUNNY_QOTD_CONFIG: PremiumCollectionConfig = {
  slug: "funny-question-of-the-day",
  path: "/funny-question-of-the-day",
  eyebrow: "A daily laugh without awkward questions",
  title: "100 Funny Questions of the Day",
  metaTitle: "100 Funny Questions of the Day + Random Generator",
  metaDescription: "Use 100 original funny questions of the day for kids, students, work teams, friends and parties. Filter, generate without repeats, copy, share, or build a weekly plan.",
  subtitle: "A family- and workplace-safe daily question, plus 100 original prompts filtered by audience, comic style, activity, and answer time.",
  intro: "A funny question of the day should make answering easier, not make one person the joke. These 100 prompts use silly choices, harmless everyday chaos, imagination, food, and personality quirks to create low-pressure conversation. The collection is independent from the general, student, and work QOTD banks. Everyone sees the same featured question each day, while the filters and no-repeat generator make it easy to choose something that fits a family dinner, classroom, team channel, or party.",
  published: "2026-09-02",
  updated: "2026-09-02",
  source: "funny_qotd_collection",
  promptNoun: "question",
  itemCountLabel: "Original funny daily questions",
  filters: [
    { key: "category", label: "Comedy style", allLabel: "All funny themes", options: CATEGORIES },
    { key: "audience", label: "Audience", allLabel: "Any audience", options: AUDIENCES },
    { key: "useCase", label: "Activity", allLabel: "Any activity", options: USE_CASES },
    { key: "duration", label: "Answer time", allLabel: "Any answer time", options: ["Under 1 min", "2–5 min"] },
  ],
  items: FUNNY_QOTD_QUESTIONS,
  tool: {
    title: "Today's Funny Question",
    description: "Use the shared daily prompt, filter the independent 100-question bank, or create a five-day rotation for class, work, family, or friends.",
    actionLabel: "Give Me a Funny Question",
    emptyLabel: "Today's funny question is ready. Filter by audience or draw from all 100 without repeats.",
    copyStyle: "qotd",
    supportLabel: "Keep the laughs going",
    daily: true,
    planner: true,
  },
  guide: {
    title: "How to make a funny QOTD land well",
    intro: "The best funny prompt is easy to enter, safe to answer, and quick enough that people want another tomorrow. Use this simple rhythm in classrooms, channels, dinners, or parties.",
    steps: [
      { title: "Match the audience", description: "Use the audience filter instead of assuming the same humor works for children, classmates, coworkers, and close friends." },
      { title: "Answer before explaining", description: "Ask for the quick choice first. The explanation usually creates the laugh, while a long setup makes the prompt feel like work." },
      { title: "Laugh with, not at", description: "Keep humor focused on imaginary situations, everyday objects, or your own harmless quirks. Let anyone pass without becoming the next joke." },
      { title: "Stop on a high note", description: "Use one follow-up if the group is engaged, then close. A two-minute ritual that stays fun is more repeatable than a forced ten-minute round." },
    ],
  },
  qualityNotes: [
    "All 100 questions were written for this page and are automatically checked against the general, student, and work QOTD collections for exact overlap.",
    "Every comedy style contains five questions for each of four audiences, and every audience receives every supported activity type.",
    "Prompts avoid appearance, protected characteristics, finances, family structure, romance pressure, medical topics, humiliation, and dares.",
    "The same daily question is stable for all visitors, while random results avoid repeats and the complete collection remains visible and printable.",
  ],
  disclaimer: "Humor is contextual. Preview prompts for the people present, let anyone pass, and skip a question when the situation or group history makes it uncomfortable.",
  parentLink: { label: "General question of the day", href: "/question-of-the-day" },
  relatedLinks: [
    { label: "Question of the day for students", href: "/question-of-the-day-for-students", description: "Use grade-aware morning meeting and classroom prompts." },
    { label: "Question of the day for work", href: "/question-of-the-day-for-work", description: "Choose professional check-ins, onboarding prompts, and weekly plans." },
    { label: "Funny topic generator", href: "/funny", description: "Move from daily questions to a broader random funny topic." },
  ],
  faq: [
    { question: "What is a good funny question of the day?", answer: "It is easy to understand, safe for the intended audience, and funny because of the imagined choice or explanation rather than because someone is embarrassed. Good prompts work in under a minute but leave room for a short story." },
    { question: "Are these questions safe for school and work?", answer: "Use the Students or Work Teams filter. Those prompts avoid private or sensitive disclosure, but a teacher or facilitator should still preview the question for the specific group and let anyone pass." },
    { question: "Can I make a weekly funny QOTD plan?", answer: "Yes. Choose any audience, comedy style, activity, or answer-time filters, then select Build weekly plan to create Monday-through-Friday prompts that can be copied or printed." },
    { question: "Does today's funny question change for different visitors?", answer: "No. The featured question is selected from the UTC date, so everyone receives the same prompt that day. The random generator remains available when the daily question does not fit the setting." },
  ],
  library: { category: "education", modes: ["conversation", "icebreaker"] },
};

validatePremiumCollection(FUNNY_QOTD_CONFIG, 100);
validateFilterPairCoverage(FUNNY_QOTD_CONFIG, "category", "audience", { minimum: 5 });
validateFilterPairCoverage(FUNNY_QOTD_CONFIG, "audience", "useCase", { minimum: 5 });
