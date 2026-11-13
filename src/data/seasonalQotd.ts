import {
  validatePremiumCollection,
  type PremiumCollectionConfig,
  type PremiumDepth,
  type PremiumPromptItem,
} from "@/data/premiumTypes";

// 2026-11-08: monthly and holiday question-of-the-day pages. GSC showed
// "november question of the day", "december question of the day",
// "thanksgiving question of the day" and "christmas question of the day"
// landing on the general /question-of-the-day page at positions 2.8–4.5.
// Each line: audience code | answer time code | prompt | follow-up.
// Audience: K Kids, A Teens & Adults, C Classroom, W Work. Time: s 30 sec, m 1 min, l 3 min.

const AUDIENCE: Record<string, string> = { K: "Kids", A: "Teens & Adults", C: "Classroom", W: "Work" };
const DURATION: Record<string, [string, PremiumDepth]> = {
  s: ["30 sec", "Light"],
  m: ["1 min", "Medium"],
  l: ["3 min", "Deep"],
};
const AUDIENCE_OPTIONS = ["Kids", "Teens & Adults", "Classroom", "Work"];
const DURATION_OPTIONS = ["30 sec", "1 min", "3 min"];

function build(prefix: string, groups: Record<string, string[]>): PremiumPromptItem[] {
  const items: PremiumPromptItem[] = [];
  for (const [category, lines] of Object.entries(groups)) {
    lines.forEach((line, i) => {
      const [a, d, prompt, followUp] = line.split(" | ");
      const [duration, depth] = DURATION[d];
      items.push({
        id: `${prefix}-${category.toLowerCase().replace(/[^a-z]+/g, "-")}-${i + 1}`,
        prompt,
        category,
        audience: AUDIENCE[a],
        useCase: "Question of the Day",
        duration,
        depth,
        followUps: [followUp],
      });
    });
  }
  return items;
}

function filters(categories: string[]): PremiumCollectionConfig["filters"] {
  return [
    { key: "category", label: "Theme", allLabel: "All themes", options: categories },
    { key: "audience", label: "Who is answering", allLabel: "Everyone", options: AUDIENCE_OPTIONS },
    { key: "duration", label: "Answer time", allLabel: "Any answer time", options: DURATION_OPTIONS },
  ];
}

const parentLink = { label: "Today's question of the day", href: "/question-of-the-day" };

const seasonalLinks = (exclude: string) =>
  [
    { label: "November question of the day", href: "/question-of-the-day/november", description: "Thirty days of cozy, grateful and funny fall questions." },
    { label: "December question of the day", href: "/question-of-the-day/december", description: "Winter, year-in-review and kindness prompts for the last month." },
    { label: "Thanksgiving question of the day", href: "/question-of-the-day/thanksgiving", description: "Table questions for dinner, class and team potlucks." },
    { label: "Christmas question of the day", href: "/question-of-the-day/christmas", description: "Traditions, gifts and winter-fun questions for December." },
    { label: "Question of the day for students", href: "/question-of-the-day-for-students", description: "180 grade-aware prompts for the whole school year." },
    { label: "Question of the day for work", href: "/question-of-the-day-for-work", description: "120 professional prompts for Slack, Teams and stand-ups." },
  ].filter((link) => link.href !== exclude).slice(0, 4);

const guide = (season: string): PremiumCollectionConfig["guide"] => ({
  title: `How to run a ${season} question of the day`,
  intro: "Keep it to one question, the same time each day, and let anyone pass. A seasonal theme gives the ritual a reason to feel new without making it longer.",
  steps: [
    { title: "Pick today's question", description: "Use the daily question so the whole group sees the same prompt, or filter by audience and answer time first." },
    { title: "Post or read it once", description: "Write it on the board, drop it in the team channel, or read it at the table. One sentence of context is enough." },
    { title: "Give everyone a turn", description: "Go around the circle or collect replies in a thread. Short answers count; passing is always fine." },
    { title: "Ask one follow-up", description: "Every question comes with a follow-up. Use it when the room is warm, skip it when time is short." },
  ],
});

const qualityNotes = (count: number, season: string) => [
  `All ${count} questions are newly written for ${season} and are not copied from the general question-of-the-day bank.`,
  "Every question is tagged for kids, teens and adults, classrooms or work, plus a 30-second, 1-minute or 3-minute answer time.",
  "Questions avoid money, religion, politics and private family details, so they work with mixed groups and coworkers.",
  "The full list stays visible and printable; the daily pick and the five-day planner are free with no sign-up.",
];

// ─── November ──────────────────────────────────────────────────────────────
const NOVEMBER_QUESTIONS = build("nov", {
  "Gratitude": [
    "K | s | What is one thing you are thankful for today? | Who could you tell about it?",
    "K | m | Who is someone who helps you every day without being asked? | How could you say thank you to them this week?",
    "C | s | Which classroom thing would you miss most if it disappeared tomorrow? | Why does it matter so much?",
    "C | m | What is something a classmate did this month that made school better? | Would you like to tell them?",
    "A | m | What small, ordinary thing are you more grateful for than you used to be? | What changed your mind about it?",
    "A | l | Who taught you something important that you never properly thanked? | What would you say to them now?",
    "W | s | Which tool, habit or shortcut saved you the most time this month? | Who should know about it?",
    "W | m | Who on the team helped you recently in a way they might not realise? | What did their help make possible?",
    "K | s | What is your favourite thing about where you live? | What would you show a visitor first?",
    "A | s | What is a song, book or show you are grateful exists? | When did you first find it?",
  ],
  "Autumn & Cozy": [
    "K | s | Would you rather jump in a leaf pile or build a blanket fort? | What would make it the best one ever?",
    "K | m | If you could invent a new autumn snack, what would it taste like? | What would you call it?",
    "C | s | What is the best sound of November? | Can you describe it without saying what it is?",
    "C | m | If our classroom were a cozy café for one day, what would be on the menu? | What music would play?",
    "A | s | What is your perfect cold-evening drink? | Where would you drink it?",
    "A | m | What does your ideal slow Sunday in November look like? | What would you skip to make it happen?",
    "W | s | Coffee, tea, hot chocolate or something else to get through a dark afternoon? | When do you drink it?",
    "W | m | What small change makes your workspace feel cozier when the days get shorter? | Could the team try it?",
    "K | s | What colour do you think November is? | Why that colour?",
    "A | l | Which autumn memory from childhood still feels vivid? | What makes it stick?",
  ],
  "Reflection": [
    "K | m | What is something new you learned to do this year? | What was the hardest part?",
    "C | m | What is one goal you could still reach before the winter break? | What is the first step?",
    "C | l | What is a mistake from this term that taught you something useful? | How would you handle it now?",
    "A | m | What is one thing you want to finish before the year ends? | What has been stopping you?",
    "A | l | How are you different from who you were last November? | Is that a change you chose?",
    "W | m | What is one project from this year you would like to close out well? | What would 'done' look like?",
    "W | l | What did you learn this year that you wish you had known in January? | How would it have changed your work?",
    "K | s | What made you laugh the most this month? | Can you tell it again?",
    "A | s | What is a habit you want to keep going into December? | What helps it stick?",
    "W | s | What is one word for how this month at work has felt? | What would you like next month's word to be?",
  ],
  "Fun & Silly": [
    "K | s | If a turkey and a pumpkin had a race, who would win? | What would the prize be?",
    "K | m | If you could make one day in November a holiday, what would it celebrate? | How would people celebrate it?",
    "C | s | Would you rather have socks that are always warm or a hat that never blows away? | Why?",
    "C | m | If squirrels could talk, what would they complain about in November? | What would they want from us?",
    "A | s | What is the most overrated autumn tradition? | What should replace it?",
    "A | m | If November had a theme song, what would it be? | Who would sing it?",
    "W | s | Which emoji best describes your week so far? | What would turn it into a better one?",
    "W | m | If our team were a Thanksgiving dish, which one would we be? | Who is the gravy?",
    "K | s | What would a scarecrow do on its day off? | Where would it go?",
    "A | s | Pie or cake, and which flavour? | Is there ever a wrong answer?",
  ],
});

// ─── December ──────────────────────────────────────────────────────────────
const DECEMBER_QUESTIONS = build("dec", {
  "Winter Fun": [
    "K | s | Would you rather build a snowman or have a snowball fight? | What is your secret technique?",
    "K | m | If you could build anything out of snow, what would it be? | How long would it take?",
    "C | s | What is the best thing to do on a snow day? | Who would you do it with?",
    "C | m | If you could design a new winter sport, what would the rules be? | What would players wear?",
    "A | s | Cozy night in or winter night out? | What makes it perfect?",
    "A | m | What is your favourite winter smell? | What memory does it bring back?",
    "W | s | What is your go-to warm lunch in December? | Would you recommend it to the team?",
    "W | m | Where would you go if you could work from anywhere cold and beautiful for a week? | What would you do after work?",
    "K | s | What do you think penguins do for fun? | Would you join them?",
    "A | s | Ice skating, sledding or staying firmly indoors? | Why?",
  ],
  "Year in Review": [
    "K | m | What was the best day you had this year? | What made it so good?",
    "K | s | What is something you got braver about this year? | How did it feel?",
    "C | m | What is the most interesting thing you learned in class this year? | Where could you use it?",
    "C | l | If you could give advice to yourself on the first day of this school year, what would it be? | Would you have listened?",
    "A | m | What is one moment from this year you want to remember in ten years? | How will you keep it?",
    "A | l | What did this year teach you about what you actually need? | What will you do differently next year?",
    "W | m | What is a work win from this year you are quietly proud of? | Who helped make it happen?",
    "W | l | What should we keep, stop and start doing as a team next year? | Which one matters most?",
    "A | s | What was the best thing you read, watched or listened to this year? | Who would you recommend it to?",
    "W | s | Sum up your year at work in three words. | Which word do you want for next year?",
  ],
  "Kindness & Giving": [
    "K | s | What is a kind thing you could do for someone today? | Who would you choose?",
    "K | m | If you could give everyone in your class a non-wrapped gift, like a skill or a feeling, what would it be? | Why that one?",
    "C | s | What is one way we could make school nicer for someone this week? | Can we do it today?",
    "C | m | What is the kindest thing someone has done for you at school? | How did it change your day?",
    "A | m | What is a gift you received that cost nothing but meant a lot? | Who gave it to you?",
    "A | l | What does generosity look like when you have very little time or money? | Who models it well?",
    "W | s | Whose help this year deserves a shout-out? | What would you say in one sentence?",
    "W | m | What is one way the team could make January easier for each other? | Who could start it?",
    "K | s | Would you rather give a present or get one? | Why?",
    "A | s | What is a small kindness from a stranger you still remember? | Have you passed it on?",
  ],
  "Fun & Silly": [
    "K | s | If a reindeer came to school, which class would it like best? | What would it eat at lunch?",
    "K | m | If you could invent a new holiday treat, what would be in it? | What would it be called?",
    "C | s | Would you rather have a snow day every Monday or a pizza party every Friday? | Why?",
    "C | m | If our classroom had a winter mascot, what would it be? | What is its catchphrase?",
    "A | s | What is the worst possible holiday song to have stuck in your head? | Why that one?",
    "A | m | If you hosted a December party with a strange theme, what would the theme be? | What would guests bring?",
    "W | s | Which holiday-movie character would be the best coworker? | Which would be the worst?",
    "W | m | If the team had an end-of-year awards show, what silly category would you add? | Who would win?",
    "K | s | What would a snowman want for a present? | Why?",
    "A | s | Ugly sweater: yes, no, or only ironically? | Do you own one?",
  ],
});

// ─── Thanksgiving ──────────────────────────────────────────────────────────
const THANKSGIVING_QUESTIONS = build("thx", {
  "Gratitude": [
    "K | s | What is one thing that made you smile this week that you are thankful for? | Who was there?",
    "K | m | Who would you like to thank today, and what for? | How could you show it?",
    "C | s | What is something about our class you are thankful for? | Why does it matter to you?",
    "C | m | What is a skill you are thankful someone taught you? | Who taught it to you?",
    "A | m | What are you thankful for this year that you did not expect to be? | When did you notice it?",
    "A | l | What is a hard moment from this year that you are now grateful for? | What did it give you?",
    "W | s | What is one work thing you are thankful for this year? | Who made it possible?",
    "W | m | Who on the team deserves a thank-you that they have not had yet? | What would you thank them for?",
    "K | s | What is your favourite thing about your family or friends? | Have you told them?",
    "A | s | What is a simple pleasure you are grateful for right now? | When did you last enjoy it?",
  ],
  "Food & Table": [
    "K | s | What is the best thing on the Thanksgiving table? | How much of it could you eat?",
    "K | m | If you could add one brand-new dish to Thanksgiving, what would it be? | Would anyone else try it?",
    "C | s | Mashed potatoes or stuffing? | Defend your choice in one sentence.",
    "C | m | If you had to cook a whole Thanksgiving meal with only three ingredients, what would you make? | What would you call it?",
    "A | s | Which Thanksgiving side dish is secretly the best one? | Who makes it best?",
    "A | m | What dish would you bring to a Friendsgiving to impress people? | Is it a family recipe?",
    "W | s | What would you bring to a team potluck? | Could you make it in under an hour?",
    "W | m | If the team ran a Thanksgiving restaurant, who would do which job? | What is the signature dish?",
    "K | s | Pumpkin pie, apple pie or no pie? | What would make it even better?",
    "A | l | What food reminds you most of home, and who made it? | Do you know how to make it yourself?",
  ],
  "Family Stories": [
    "K | m | What is your favourite story someone in your family tells? | Can you tell it?",
    "K | s | What is a tradition you would like to start this Thanksgiving? | Who would join in?",
    "C | m | What is a tradition your family or friends have that others might not know about? | How did it start?",
    "C | l | If you could ask an older relative one question about when they were your age, what would it be? | What do you think they would say?",
    "A | m | What is the funniest thing that has ever happened at a holiday meal you were at? | Who still talks about it?",
    "A | l | What is a family tradition you want to keep going, and one you would happily let go of? | Why those two?",
    "W | m | What is a holiday tradition from where you grew up that the team might not know? | Do you still do it?",
    "W | s | Who traditionally does the dishes where you celebrate? | Is that fair?",
    "A | m | Who is the best storyteller at your table? | What is their best story?",
    "K | s | What game does your family like to play together? | Who usually wins?",
  ],
  "Fun & Games": [
    "K | s | If a turkey could talk, what would it say on Thanksgiving? | Would it be happy?",
    "K | m | If you were in charge of a parade float, what would it look like? | What music would play?",
    "C | s | Would you rather eat Thanksgiving dinner on a boat or in a treehouse? | Who would you invite?",
    "C | m | If the Pilgrims had phones, what would their first post have said? | How many likes would it get?",
    "A | s | Nap after dinner, walk after dinner or straight to dessert? | Do you ever change?",
    "A | m | What would be the most chaotic person to seat next to at Thanksgiving dinner, fictional or real? | Why?",
    "W | s | Which leftover makes the best next-day lunch? | Have you tried it in a sandwich?",
    "W | m | If you could invite any three people, alive or historical, to a Thanksgiving dinner, who would they be? | What would you serve them?",
    "K | s | What would you name a pet turkey? | What tricks would it do?",
    "A | s | Football, a movie or a board game after dinner? | What is the pick this year?",
  ],
});

// ─── Christmas ─────────────────────────────────────────────────────────────
const CHRISTMAS_QUESTIONS = build("xmas", {
  "Traditions": [
    "K | s | What is your favourite part of the holidays? | Why do you love it?",
    "K | m | What holiday tradition would you invent if you could? | When would you do it?",
    "C | s | What is one holiday tradition you look forward to every year? | Who do you do it with?",
    "C | m | How do people celebrate this time of year in different places you know about? | Which would you like to try?",
    "A | m | What is a tradition you did as a kid that you still do now? | Has it changed?",
    "A | l | Which tradition would you pass on to the next generation, and which would you retire? | Why?",
    "W | s | Real tree, fake tree or no tree at all? | Who decides where you celebrate?",
    "W | m | What is a holiday tradition from your hometown the team might not know? | Could we try it?",
    "K | s | When do you think it is OK to start playing holiday music? | Has anyone broken that rule?",
    "A | s | Open one present on Christmas Eve or wait until morning? | Has that rule ever been broken?",
  ],
  "Gifts & Giving": [
    "K | s | What is the best present you have ever given someone? | How did they react?",
    "K | m | If you could give the whole world one present, what would it be? | How would you wrap it?",
    "C | s | What is a gift that costs nothing but would make someone's day? | Who could you give it to?",
    "C | m | If you could start a giving project for our school, what would it be? | Who would it help?",
    "A | m | What is the most thoughtful gift you have ever received? | What made it thoughtful?",
    "A | l | What makes a gift meaningful to you — the price, the effort or the thought behind it? | Has your answer changed over the years?",
    "W | s | What is a good secret-gift idea under a small budget? | Have you ever received it?",
    "W | m | What is the best gift exchange you have been part of? | What made it fun?",
    "K | s | What would you put in a stocking for your best friend? | Why that?",
    "A | s | Wrapping paper, gift bag or no wrapping at all? | Are you a neat wrapper?",
  ],
  "Winter Fun": [
    "K | s | What would you build if it snowed enough to cover the whole street? | Who would help?",
    "K | m | If you could spend a day at the North Pole, what would you do first? | Who would you visit?",
    "C | s | Hot chocolate with marshmallows or without? | What is the best topping?",
    "C | m | If you could design the perfect holiday cookie, what would it look like? | What flavour would it be?",
    "A | s | What is the best holiday movie, and is it the one everyone says? | When do you watch it?",
    "A | m | What does your perfect winter-break day look like from morning to night? | What would you leave out?",
    "W | s | Which holiday drink gets you through December? | Homemade or bought?",
    "W | m | If the team took a winter day out, what should we do? | Who would organise it?",
    "K | s | What is the coziest place in your home in winter? | What do you do there?",
    "A | s | Matching pyjamas: yes or absolutely not? | Who started it?",
  ],
  "Imagination": [
    "K | s | If you were one of Santa's elves, what job would you want? | What would you make?",
    "K | m | If reindeer could talk, what would they say about their job? | Which reindeer would be the funniest?",
    "C | s | If a snowman came to life in our classroom, what would it learn first? | Would it melt?",
    "C | m | If you could write a new holiday story, who would the hero be? | What problem would they solve?",
    "A | m | If you could spend this holiday in any city in the world, where would you go? | What would you do first?",
    "A | l | If you could relive one holiday from your life, which would you pick? | What would you pay more attention to?",
    "W | s | Which holiday-movie character would you hire, and for what job? | Would they pass the interview?",
    "W | m | If our office or team chat got a holiday makeover, what would you change? | What would stay the same?",
    "K | s | What would you leave out for Santa if cookies were not allowed? | Would he like it?",
    "A | s | If you could add one character to a classic holiday movie, who would it be? | How would it change the story?",
  ],
});

function config(input: {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  subtitle: string;
  intro: string;
  categories: string[];
  items: PremiumPromptItem[];
  season: string;
  toolTitle: string;
  faq: { question: string; answer: string }[];
}): PremiumCollectionConfig {
  const path = `/question-of-the-day/${input.slug}`;
  return {
    slug: `question-of-the-day-${input.slug}`,
    path,
    eyebrow: input.eyebrow,
    title: input.title,
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    subtitle: input.subtitle,
    intro: input.intro,
    published: "2026-11-08",
    updated: "2026-11-08",
    source: `qotd_${input.slug}`,
    promptNoun: "question",
    itemCountLabel: `${input.season} questions`,
    filters: filters(input.categories),
    items: input.items,
    tool: {
      title: input.toolTitle,
      description: "The same question for everyone today. Filter by who is answering and how long you have, or build a five-day plan in one click.",
      actionLabel: "Choose Another Question",
      emptyLabel: "Today's question is ready. Use the filters to match the room.",
      copyStyle: "qotd",
      daily: true,
      planner: true,
    },
    guide: guide(input.season),
    faqSchema: true,
    qualityNotes: qualityNotes(input.items.length, input.season),
    parentLink,
    relatedLinks: seasonalLinks(path),
    faq: input.faq,
    library: { category: "education", modes: ["conversation", "icebreaker"] },
  };
}

export const NOVEMBER_QOTD_CONFIG = config({
  slug: "november",
  title: "November Question of the Day",
  metaTitle: "November Question of the Day — 40 Fall QOTD Ideas",
  metaDescription: "A new November question of the day every morning: 40 gratitude, cozy fall, reflection and funny questions for kids, classrooms and work. Free, printable, no sign-up.",
  eyebrow: "Thirty days of fall questions",
  subtitle: "Gratitude, cozy autumn, end-of-year reflection and silly questions — one for every day of November, sorted for kids, classrooms and teams.",
  intro: "November is the month of shorter days, Thanksgiving and the first look back at the year, so a good November question of the day leans into gratitude and coziness without turning every morning into a speech. These 40 original questions cover four themes and four audiences. Everyone sees the same daily question; use the filters when you need a 30-second classroom prompt or a deeper question for a team retro.",
  categories: ["Gratitude", "Autumn & Cozy", "Reflection", "Fun & Silly"],
  items: NOVEMBER_QUESTIONS,
  season: "November",
  toolTitle: "Today's November Question",
  faq: [
    { question: "What is a good question of the day for November?", answer: "Good November questions mix gratitude (who helped you this month?), cozy fall topics (what is your perfect cold-evening drink?) and light reflection on the year. Keep them answerable in under a minute so everyone can join in." },
    { question: "Are these November questions good for kids and classrooms?", answer: "Yes. Every question is tagged Kids, Classroom, Teens & Adults or Work. Filter by Kids or Classroom for school-safe prompts that avoid private family details." },
    { question: "Can I use one question per day for the whole month?", answer: "Yes. The daily question changes each day and is the same for everyone. With 40 questions there are enough for every day of November plus spares; the planner builds a five-day week without repeats." },
    { question: "Is there a Thanksgiving version?", answer: "Yes — the Thanksgiving question of the day page has 40 table, family-story and gratitude questions for the holiday itself." },
  ],
});

export const DECEMBER_QOTD_CONFIG = config({
  slug: "december",
  title: "December Question of the Day",
  metaTitle: "December Question of the Day — 40 Winter QOTD Ideas",
  metaDescription: "A new December question of the day every morning: 40 winter, year-in-review, kindness and funny questions for kids, classrooms and work. Free, printable, no sign-up.",
  eyebrow: "A question for every winter day",
  subtitle: "Winter fun, year-in-review, kindness and silly questions for the last month of the year — sorted for kids, classrooms and teams.",
  intro: "December questions work best when they fit a busy month: quick winter prompts for mornings, kindness questions for the giving season, and a few deeper year-in-review questions for the last week. These 40 original questions are tagged by audience and answer time, and they are written to include everyone whether or not they celebrate a particular holiday.",
  categories: ["Winter Fun", "Year in Review", "Kindness & Giving", "Fun & Silly"],
  items: DECEMBER_QUESTIONS,
  season: "December",
  toolTitle: "Today's December Question",
  faq: [
    { question: "What is a good question of the day for December?", answer: "Mix quick winter questions (snowman or snowball fight?), kindness prompts (whose help this year deserves a shout-out?) and a few year-in-review questions for the final week. Keep most answers under a minute." },
    { question: "Are the December questions holiday-neutral?", answer: "Mostly. Winter, kindness and year-in-review questions work for any group. For Christmas-specific questions, use the Christmas question of the day page." },
    { question: "Can teams use these in Slack or Teams?", answer: "Yes. Filter by Work, copy the question in one click, and paste it into your team channel. The planner builds a Monday-to-Friday set without repeats." },
    { question: "How many December questions are there?", answer: "40 original questions — enough for every day of December with spares — in four themes and three answer times." },
  ],
});

export const THANKSGIVING_QOTD_CONFIG = config({
  slug: "thanksgiving",
  title: "Thanksgiving Question of the Day",
  metaTitle: "Thanksgiving Question of the Day — 40 Table Questions",
  metaDescription: "40 Thanksgiving questions of the day for dinner, class and team potlucks: gratitude, food, family stories and funny questions, sorted for kids and adults. Free, no sign-up.",
  eyebrow: "Questions for the table, the classroom and the team",
  subtitle: "Gratitude, food, family-story and funny questions for Thanksgiving week — from a 30-second classroom prompt to a slow dinner-table conversation.",
  intro: "A Thanksgiving question of the day should get everyone talking without putting anyone on the spot. These 40 original questions go beyond 'what are you thankful for?' with food debates, family-story prompts and silly what-ifs. Use the daily question in class or at work during Thanksgiving week, or filter by Teens & Adults for a dinner-table round.",
  categories: ["Gratitude", "Food & Table", "Family Stories", "Fun & Games"],
  items: THANKSGIVING_QUESTIONS,
  season: "Thanksgiving",
  toolTitle: "Today's Thanksgiving Question",
  faq: [
    { question: "What are good Thanksgiving questions to ask at dinner?", answer: "Start light with a food debate (mashed potatoes or stuffing?), then move to a story question (what is the funniest thing that has happened at a holiday meal?) and finish with a gratitude question. Filter by Teens & Adults and 3 min for slower dinner-table questions." },
    { question: "Are there Thanksgiving questions for kids and classrooms?", answer: "Yes. Filter by Kids or Classroom for short, school-safe questions such as what would a turkey say on Thanksgiving or what new dish would you add." },
    { question: "Can I use these for a work potluck or team meeting?", answer: "Yes. The Work filter has team-safe questions about potluck dishes, holiday traditions and thank-yous that avoid private or family details." },
    { question: "Are the questions free to print?", answer: "Yes. The full list is visible on the page and prints cleanly. No sign-up is needed." },
  ],
});

export const CHRISTMAS_QOTD_CONFIG = config({
  slug: "christmas",
  title: "Christmas Question of the Day",
  metaTitle: "Christmas Question of the Day — 40 Holiday QOTD Ideas",
  metaDescription: "40 Christmas questions of the day for class, family and work: traditions, gifts, winter fun and imagination questions sorted for kids and adults. Free, printable, no sign-up.",
  eyebrow: "A holiday question for every December day",
  subtitle: "Traditions, gift-giving, winter fun and imaginative Christmas questions for classrooms, families and teams — one for each day of the countdown.",
  intro: "Christmas questions are a simple way to fill the countdown with conversation instead of another worksheet or meeting slide. These 40 original questions cover traditions, gifts and giving, winter fun and imagination, each tagged for kids, classrooms, teens and adults or work. The daily question is the same for everyone; filter for a quick 30-second prompt or a slower story question.",
  categories: ["Traditions", "Gifts & Giving", "Winter Fun", "Imagination"],
  items: CHRISTMAS_QUESTIONS,
  season: "Christmas",
  toolTitle: "Today's Christmas Question",
  faq: [
    { question: "What is a good Christmas question of the day?", answer: "Good Christmas questions are quick and inclusive: favourite traditions, the best gift you ever gave, what you would do at the North Pole. Mix light questions with one story question per week." },
    { question: "Are these Christmas questions good for students?", answer: "Yes. Filter by Kids or Classroom for school-safe questions that do not ask about gifts received or family budgets." },
    { question: "Can I use them for a 25-day countdown?", answer: "Yes. There are 40 questions, so you can run one per day from December 1 to 25 and still have spares. The planner builds five days at a time without repeats." },
    { question: "Is there a version for groups that do not celebrate Christmas?", answer: "Use the December question of the day page — its winter, kindness and year-in-review questions work for any group." },
  ],
});

THANKSGIVING_QOTD_CONFIG.relatedLinks = [
  ...THANKSGIVING_QOTD_CONFIG.relatedLinks,
  { label: "Thanksgiving would you rather", href: "/would-you-rather/thanksgiving", description: "48 feast, family and travel dilemmas for the table." },
  { label: "Thanksgiving this or that", href: "/this-or-that/thanksgiving", description: "48 quick holiday picks for dinner, class and the car." },
];
CHRISTMAS_QOTD_CONFIG.relatedLinks = [
  ...CHRISTMAS_QOTD_CONFIG.relatedLinks,
  { label: "Christmas would you rather", href: "/would-you-rather/christmas", description: "48 gift, tree and movie dilemmas for December." },
  { label: "Christmas this or that", href: "/this-or-that/christmas", description: "48 quick Christmas picks for family, class and parties." },
];

export const SEASONAL_QOTD_CONFIGS = [NOVEMBER_QOTD_CONFIG, DECEMBER_QOTD_CONFIG, THANKSGIVING_QOTD_CONFIG, CHRISTMAS_QOTD_CONFIG];

for (const c of SEASONAL_QOTD_CONFIGS) validatePremiumCollection(c, 40);
