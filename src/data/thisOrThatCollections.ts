// This or that inner pages (2026-10-19): couples, hard and work. Written
// in-house; each question is two options, no repeats with the main deck.
import type { QotdCategory } from "@/data/questionOfTheDay";

export interface ChoiceGroup { title: string; questions: string[] }
export interface ThisOrThatCollection {
  slug: "couples" | "hard" | "work";
  path: string;
  h1: string;
  title: string;
  description: string;
  keywords: string[];
  lead: string;
  emoji: string;
  qotdCategory: QotdCategory | "all";
  groups: ChoiceGroup[];
  howTo: { name: string; text: string }[];
  faq: { question: string; answer: string }[];
}

export const THIS_OR_THAT_COLLECTIONS: ThisOrThatCollection[] = [
  {
    slug: "couples",
    path: "/this-or-that/couples",
    h1: "This or That Questions for Couples",
    title: "This or That Questions for Couples: 48 Picks for Date Night",
    description: "48 this or that questions for couples: date night, home life, travel, love languages and a few spicy-but-clean picks. Draw one at random, guess your partner's answer, free.",
    keywords: ["this or that questions for couples", "couples this or that", "this or that for couples", "this or that relationship questions", "date night this or that"],
    lead: "Two options, one partner, no wrong answers. Use these on a date, a long drive or a slow Sunday: read one out, both answer at the same time, then explain. The fun is in the explaining.",
    emoji: "💞",
    qotdCategory: "deep",
    groups: [
      {
        title: "Date night",
        questions: [
          "Fancy dinner out or takeout on the couch?",
          "Movie night or game night?",
          "Plan the date or be surprised?",
          "Dinner and drinks or a picnic in the park?",
          "Dance class or cooking class together?",
          "Rom-com or thriller for date night?",
          "Dress up or stay in pajamas?",
          "Sunset walk or stargazing drive?",
          "Try a new restaurant or go back to our favorite?",
          "Arcade or bowling alley?",
          "Breakfast date or late-night dessert date?",
          "Concert or comedy show?",
        ],
      },
      {
        title: "Home life",
        questions: [
          "Cook together or one cooks, one cleans?",
          "Big dog or small cat?",
          "Clean as you go or one big clean on Saturday?",
          "Separate blankets or share one?",
          "City apartment or house in the countryside?",
          "Wake up early together or sleep in together?",
          "Thermostat warm or cool?",
          "Decorate for every holiday or keep it minimal?",
          "Plan meals for the week or decide each night?",
          "Lazy Sunday or busy Sunday?",
          "Grocery run together or one of us goes?",
          "Couch cuddles or side by side on our phones?",
        ],
      },
      {
        title: "Travel and adventure",
        questions: [
          "Beach resort or road trip?",
          "Plan every detail or figure it out when we land?",
          "Window seat or aisle seat for you?",
          "Camping or a cozy cabin?",
          "Big city break or tiny village?",
          "Long weekend away or one big trip a year?",
          "Museums or food markets?",
          "Hotel or rental apartment?",
          "Sunrise hike or sunset cocktails?",
          "Same place every year or somewhere new every time?",
          "Travel light or pack for every possibility?",
          "Learn the language first or wing it?",
        ],
      },
      {
        title: "Love and us",
        questions: [
          "Love notes or surprise gifts?",
          "Words of affirmation or quality time?",
          "Talk it out right away or cool off first?",
          "Big anniversary party or quiet dinner for two?",
          "Matching outfits or never, ever?",
          "Share a dessert or order your own?",
          "Say I love you first or hear it first?",
          "Remember the first date or the first trip?",
          "Handwritten letter or a long voice message?",
          "Shared playlist or separate headphones?",
          "Couple friends or one-on-one time?",
          "Slow dance in the kitchen or karaoke duet?",
        ],
      },
    ],
    howTo: [
      { name: "Answer at the same time", text: "One of you reads the question, count to three and both say your pick. Matching answers get a high five; different answers get a story." },
      { name: "Predict your partner", text: "Before answering, guess what your partner will pick. One point per correct guess; play to ten." },
      { name: "Ask one follow-up", text: "After every pick, ask “why?” once. Most of the good conversation comes from that single follow-up." },
    ],
    faq: [
      { question: "How do you play this or that as a couple?", answer: "Read a question, both answer at the same time, then each explain your pick in one or two sentences. For a game, guess your partner's answer first and score a point when you're right. Ten questions take about ten minutes." },
      { question: "Are these questions good for a first date?", answer: "Most are. Date night, travel and home life questions are light enough for a first or second date. Save the love and us questions, like love languages and how you handle arguments, for when you know each other a bit better." },
      { question: "Are these couples questions clean?", answer: "Yes. Every question is safe to ask in a restaurant or in front of friends. They are playful, not explicit." },
      { question: "Can we play this with friends?", answer: "Yes. Couples game nights work well: each couple answers, and the other players guess whether the pair will match. The couple with the most matches wins." },
    ],
  },
  {
    slug: "hard",
    path: "/this-or-that/hard",
    h1: "Hard This or That Questions",
    title: "Hard This or That Questions: 48 Tough Choices to Argue About",
    description: "48 hard this or that questions with no easy answer: impossible trade-offs, deep life choices and agonizing food and money picks. Random generator plus the full list, free.",
    keywords: ["hard this or that questions", "difficult this or that questions", "tough this or that questions", "deep this or that questions", "this or that hard choices"],
    lead: "These are the ones people stall on. Every question has two choices that both cost you something, so expect long pauses, mind changes and at least one argument. Perfect for teens, adults and anyone who's bored of coffee or tea.",
    emoji: "🧠",
    qotdCategory: "deep",
    groups: [
      {
        title: "Impossible trade-offs",
        questions: [
          "Know how you die or know when you die?",
          "Be famous for something embarrassing or unknown for something great?",
          "Lose all your photos or lose all your messages?",
          "Always be 10 minutes late or always be 30 minutes early?",
          "Read minds or be invisible?",
          "Never use social media again or never watch TV again?",
          "Relive your best day once or skip your worst day entirely?",
          "Speak every language or play every instrument?",
          "Have no phone for a year or no friends nearby for a year?",
          "Fix one past mistake or see one future moment?",
          "Always say what you think or never speak again?",
          "Be the funniest person in the room or the smartest?",
        ],
      },
      {
        title: "Life choices",
        questions: [
          "Dream job with low pay or boring job with high pay?",
          "Live near family or live in your dream city?",
          "A few close friends or many casual friends?",
          "Stay in one place forever or move every two years?",
          "Be respected or be liked?",
          "Retire at 40 with a little or at 70 with a lot?",
          "Love what you do or love who you do it with?",
          "Know the truth or stay happy?",
          "Start over in a new country or stay where you know everyone?",
          "Be great at one thing or good at everything?",
          "Have more time or more money?",
          "Win an argument or keep the peace?",
        ],
      },
      {
        title: "Food and everyday",
        questions: [
          "Give up cheese forever or give up chocolate forever?",
          "Only breakfast food or only dinner food for life?",
          "No hot showers or no air conditioning?",
          "Give up music or give up movies?",
          "Lose your sense of taste or your sense of smell?",
          "Only eat spicy food or only eat bland food?",
          "Never drink coffee again or never drink soda again?",
          "Always cold or always too hot?",
          "Wi-Fi that always drops or a phone with 10% battery forever?",
          "Give up pizza or give up burgers?",
          "Always wear formal clothes or always wear pajamas?",
          "Sleep only four hours a night or sleep twelve hours a night?",
        ],
      },
      {
        title: "Wild hypotheticals",
        questions: [
          "Travel 100 years into the past or 100 years into the future?",
          "Live on the moon or at the bottom of the ocean?",
          "Talk to animals or speak to people from the past?",
          "Have a rewind button or a pause button for your life?",
          "Meet your future self or your younger self?",
          "Live in a world without music or without color?",
          "Be the first person on Mars or the last person on Earth?",
          "Have a personal chef or a personal driver for life?",
          "Know every answer on a test or never need to sleep?",
          "Lose your memory of the last year or never make memories next year?",
          "Teleport anywhere or fly at walking speed?",
          "Live without the internet or without air travel?",
        ],
      },
    ],
    howTo: [
      { name: "No pass allowed", text: "Everyone must pick. “Neither” and “both” don't count, which is what makes these questions hard." },
      { name: "Thirty-second defense", text: "After the vote, one person from each side gets thirty seconds to win someone over. Re-vote and count who switched." },
      { name: "Hard mode", text: "Add a three-second shot clock. Fast answers on hard questions are the most honest ones." },
    ],
    faq: [
      { question: "What makes a this or that question hard?", answer: "A hard question has two choices that both cost you something you care about, like time and money or truth and happiness. There's no obvious winner, so people have to think and defend their pick." },
      { question: "Are these questions good for teens?", answer: "Yes. They are clean and work for ages 13 and up. Teens tend to love the impossible trade-offs and wild hypotheticals because they spark real debate." },
      { question: "How can I use hard this or that questions in class?", answer: "Use one as a bell-ringer: students pick a side of the room, then one volunteer per side gives a reason. Hard questions push students past “because I like it” toward real reasons, which makes them a gentle debate warm-up." },
      { question: "Where can I find easier questions?", answer: "The main this or that generator has quick everyday picks like coffee or tea, and the kids version has classroom-safe choices for grades K–6." },
    ],
  },
  {
    slug: "work",
    path: "/this-or-that/work",
    h1: "This or That Questions for Work",
    title: "This or That Questions for Work: 48 Team Icebreakers",
    description: "48 this or that questions for work: meetings, remote teams, office life and quick team-building picks. A random generator for stand-ups and the full list to copy, free.",
    keywords: ["this or that questions for work", "work this or that", "this or that icebreaker for work", "this or that questions for coworkers", "team building this or that"],
    lead: "A two-option question is the fastest icebreaker there is: no one has to think of a story, everyone answers in a few seconds and the team learns something. Use one at the start of a meeting, a stand-up or a new-hire welcome.",
    emoji: "💼",
    qotdCategory: "work",
    groups: [
      {
        title: "Meetings and workday",
        questions: [
          "Morning meetings or afternoon meetings?",
          "Camera on or camera off?",
          "Long email or quick call?",
          "Agenda in advance or figure it out live?",
          "Standing desk or comfy chair?",
          "Inbox zero or 3,000 unread?",
          "Slides or a doc?",
          "Start early and leave early or start late and stay late?",
          "Music while working or total silence?",
          "Calendar fully booked or no meetings at all?",
          "Sticky notes or digital to-do list?",
          "Five short breaks or one long lunch?",
        ],
      },
      {
        title: "Remote and office",
        questions: [
          "Work from home or work from the office?",
          "Home office or kitchen table?",
          "Coffee shop or library for a change of scene?",
          "Slack or email?",
          "Video call or phone call?",
          "Hybrid schedule or fully remote?",
          "Commute by train or by bike?",
          "Pajama bottoms or full outfit on video calls?",
          "Pet coworker or plant coworker?",
          "Open office or private cubicle?",
          "Headphones in or always available?",
          "Team chat emojis or plain text?",
        ],
      },
      {
        title: "Team and culture",
        questions: [
          "Team lunch or team happy hour?",
          "Public praise or private thank-you?",
          "Big team or small team?",
          "Plan the offsite or just show up?",
          "Learn a new skill or master the one you have?",
          "Work with a mentor or be a mentor?",
          "Bring snacks or bring jokes?",
          "Office party or extra day off?",
          "Trivia night or escape room for team building?",
          "Brainstorm out loud or think alone first?",
          "Shared playlist or no music in the office?",
          "Birthday cake or birthday half-day?",
        ],
      },
      {
        title: "Career and style",
        questions: [
          "Big company or start-up?",
          "Generalist or specialist?",
          "Ask for forgiveness or ask for permission?",
          "Fast and good enough or slow and perfect?",
          "Lead the project or do the deep work?",
          "Present to the whole company or write the report?",
          "Plan your week on Monday or Sunday night?",
          "Big raise or extra vacation days?",
          "Meet the CEO or meet your hero?",
          "Feedback right away or at the end of the project?",
          "Same job for ten years or new job every three?",
          "Work four ten-hour days or five eight-hour days?",
        ],
      },
    ],
    howTo: [
      { name: "Meeting opener", text: "Read one question at the start of the meeting. Everyone answers in chat or out loud in a single word. It takes under a minute." },
      { name: "Stand-up rotation", text: "Each day a different teammate draws a random question and answers first. Small, consistent and low pressure." },
      { name: "New-hire welcome", text: "Ask the new teammate five questions in a row, then the team answers the same five. Instant common ground." },
    ],
    faq: [
      { question: "Are these this or that questions appropriate for work?", answer: "Yes. Every question avoids politics, religion, money details and personal relationships, so they are safe for coworkers, managers and clients." },
      { question: "How do you use this or that as an icebreaker at work?", answer: "Ask one question at the start of a meeting and have everyone answer in a word or two, out loud or in chat. On video calls, use reactions: thumbs up for the first choice, heart for the second." },
      { question: "How many questions should I ask in a meeting?", answer: "One or two for a regular meeting, five to ten for a team-building session or onboarding. Quick picks keep the energy up; stop while people still want more." },
      { question: "Do you have other icebreakers for work?", answer: "Yes. Try the question of the day for work for a longer daily question, or the would you rather generator for something more playful." },
    ],
  },
];

export function thisOrThatQuestions(c: ThisOrThatCollection): string[] {
  return c.groups.flatMap((g) => g.questions);
}

export function getThisOrThatCollection(slug: ThisOrThatCollection["slug"]): ThisOrThatCollection {
  return THIS_OR_THAT_COLLECTIONS.find((c) => c.slug === slug)!;
}
