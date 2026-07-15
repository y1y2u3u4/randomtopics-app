// Question of the Day bank — curated in-house, 2026-07. One thoughtful,
// all-ages question per day, rotating deterministically by day-of-year.
// Tagged by audience so the page can render crawlable themed lists.

export type QotdCategory = "classroom" | "work" | "kids" | "deep" | "funny";

export interface QotdQuestion {
  q: string;
  c: QotdCategory;
}

export const QOTD_CATEGORIES: { id: QotdCategory; label: string; emoji: string }[] = [
  { id: "classroom", label: "Classroom", emoji: "🏫" },
  { id: "work", label: "Work & Teams", emoji: "💼" },
  { id: "kids", label: "Kids & Family", emoji: "🧒" },
  { id: "deep", label: "Deep & Reflective", emoji: "🌌" },
  { id: "funny", label: "Funny & Light", emoji: "😄" },
];

export const QOTD_QUESTIONS: QotdQuestion[] = [
  // ── Classroom (morning-meeting friendly) ────────────────────────────────
  { q: "If you could instantly master one school subject, which would you pick and why?", c: "classroom" },
  { q: "What's something you learned outside of school that everyone should know?", c: "classroom" },
  { q: "If our class wrote a book together, what should it be about?", c: "classroom" },
  { q: "What invention do you think the world will have by the time you graduate?", c: "classroom" },
  { q: "Which historical figure would be the most interesting substitute teacher?", c: "classroom" },
  { q: "If you could rename this school anything, what would you call it?", c: "classroom" },
  { q: "What's one question you wish teachers asked more often?", c: "classroom" },
  { q: "If you could add one class to the schedule that doesn't exist yet, what would it teach?", c: "classroom" },
  { q: "What's the best mistake you've ever made — one that taught you something?", c: "classroom" },
  { q: "If aliens visited our classroom today, what would you show them first?", c: "classroom" },
  { q: "What does a perfect school day look like, hour by hour?", c: "classroom" },
  { q: "Which book, movie, or game world would make the best field trip?", c: "classroom" },
  { q: "What's something hard you can do now that you couldn't do a year ago?", c: "classroom" },
  { q: "If you were principal for a week, what's your first new rule?", c: "classroom" },
  { q: "What job do you think won't exist in 20 years — and what will replace it?", c: "classroom" },
  { q: "What's one small thing someone did that made your week better?", c: "classroom" },
  { q: "If you could ask the smartest person in history one question, what is it?", c: "classroom" },
  { q: "Would you rather be the best player on a losing team or the worst on a winning team?", c: "classroom" },
  { q: "What's something everyone in this room probably has in common?", c: "classroom" },
  { q: "If today had a soundtrack, what song is playing right now?", c: "classroom" },
  { q: "What's a skill you'd love to see added to the report card?", c: "classroom" },
  { q: "If you could freeze time for one hour a day, what would you do with it?", c: "classroom" },
  { q: "What's the most interesting thing you've ever found?", c: "classroom" },
  { q: "Which season would you cancel if you had to lose one, and why?", c: "classroom" },

  // ── Work & Teams (Slack / standup friendly) ─────────────────────────────
  { q: "What's the best piece of career advice you've ever received?", c: "work" },
  { q: "If your job had an honest tagline, what would it be?", c: "work" },
  { q: "What's one tool you use daily that you'd fight to keep?", c: "work" },
  { q: "What's a small win from this week that nobody clapped for?", c: "work" },
  { q: "If you had a fully paid month to learn anything, what would you study?", c: "work" },
  { q: "What did you want to be at age 10 — and how close did you land?", c: "work" },
  { q: "What's the most useful thing you learned in your first job?", c: "work" },
  { q: "Coffee order as a personality test: what's yours and what does it say?", c: "work" },
  { q: "What's one meeting you'd delete from every calendar forever?", c: "work" },
  { q: "If our team were a band, who plays what — and what's our name?", c: "work" },
  { q: "What's your most productive hour of the day, honestly?", c: "work" },
  { q: "What's a skill on your resume that never gets used but you're proud of?", c: "work" },
  { q: "Describe your work style in exactly three words.", c: "work" },
  { q: "What's the best team you've ever been on — what made it work?", c: "work" },
  { q: "If you could automate one part of your day, what goes first?", c: "work" },
  { q: "What's a 'boring' skill that has quietly paid off the most?", c: "work" },
  { q: "What's your favorite way to celebrate finishing something big?", c: "work" },
  { q: "Remote, office, or hybrid — and what's the real reason?", c: "work" },
  { q: "What's one thing this team does better than any team you've seen?", c: "work" },
  { q: "What would you present at a company talent show?", c: "work" },
  { q: "What's the strangest job that exists that you know of?", c: "work" },
  { q: "If your inbox could talk, what would it complain about?", c: "work" },
  { q: "What's your 'I've made it' milestone — the small one, not the big one?", c: "work" },
  { q: "Which fictional boss would you actually work for?", c: "work" },

  // ── Kids & Family (dinner-table friendly) ───────────────────────────────
  { q: "If your pet could talk for one day, what's the first thing it would say?", c: "kids" },
  { q: "What superpower would be the most fun for exactly one hour?", c: "kids" },
  { q: "If you opened a restaurant, what would you serve and what's it called?", c: "kids" },
  { q: "What's the best smell in the whole world?", c: "kids" },
  { q: "If you could shrink to the size of an ant for a day, where would you explore?", c: "kids" },
  { q: "What animal would make the funniest school teacher?", c: "kids" },
  { q: "If your toys came alive at night, which one is the leader?", c: "kids" },
  { q: "What would you build if you had a million LEGO bricks?", c: "kids" },
  { q: "If you could eat only one food for a whole week, what survives the test?", c: "kids" },
  { q: "What's the silliest word you know — and can you use it in a sentence?", c: "kids" },
  { q: "If our family had a flag, what would be on it?", c: "kids" },
  { q: "Would you rather have a dragon or be a dragon?", c: "kids" },
  { q: "What's something grown-ups do that makes no sense to you?", c: "kids" },
  { q: "If you found a door in a tree, would you go in? What's inside?", c: "kids" },
  { q: "What sound do you think the moon would make if it could?", c: "kids" },
  { q: "If bedtime were cancelled tonight, what's your plan?", c: "kids" },
  { q: "Which cartoon character would be the best babysitter?", c: "kids" },
  { q: "If you could invent a new holiday, what are we celebrating?", c: "kids" },
  { q: "What's the best thing about being exactly the age you are?", c: "kids" },
  { q: "If your shoes could take you anywhere in one step, where to first?", c: "kids" },
  { q: "What would a playground on the moon need?", c: "kids" },
  { q: "If you could talk to babies, what would you ask them?", c: "kids" },
  { q: "What's your favorite family memory from this year so far?", c: "kids" },
  { q: "If vegetables tasted like candy, which one would you eat first?", c: "kids" },

  // ── Deep & Reflective ───────────────────────────────────────────────────
  { q: "What's something you believe that most people around you don't?", c: "deep" },
  { q: "If you could relive one ordinary day — not a special one — which would you pick?", c: "deep" },
  { q: "What's the kindest thing a stranger has ever done for you?", c: "deep" },
  { q: "Which of your habits would you not wish on anyone — and which would you gift to everyone?", c: "deep" },
  { q: "What's a question you're still too young to answer, no matter your age?", c: "deep" },
  { q: "If your life had chapters, what would this one be titled?", c: "deep" },
  { q: "What's something you've forgiven that you never announced?", c: "deep" },
  { q: "When did you last change your mind about something important?", c: "deep" },
  { q: "What do you hope is true?", c: "deep" },
  { q: "What's the difference between being smart and being wise, in your own words?", c: "deep" },
  { q: "Which version of you would today's you thank — and for what?", c: "deep" },
  { q: "If memories had weight, which one of yours is heaviest? Which is lightest?", c: "deep" },
  { q: "What are you slowly getting better at that nobody notices?", c: "deep" },
  { q: "What would you do differently if nobody ever found out either way?", c: "deep" },
  { q: "What's a tradition you want to start rather than inherit?", c: "deep" },
  { q: "What's the most useful thing pain has taught you?", c: "deep" },
  { q: "If you could know one truth about the universe, what would you ask?", c: "deep" },
  { q: "Whose life did you change without meaning to?", c: "deep" },
  { q: "What does 'enough' look like for you?", c: "deep" },
  { q: "What's something beautiful you saw recently that you didn't photograph?", c: "deep" },
  { q: "Which word do you hope people use when they describe you?", c: "deep" },
  { q: "What part of your daily life will seem strange in fifty years?", c: "deep" },
  { q: "What did you almost do — and do you regret not doing it?", c: "deep" },
  { q: "If you wrote one sentence for your future self to read every morning, what is it?", c: "deep" },

  // ── Funny & Light ───────────────────────────────────────────────────────
  { q: "What's the most ridiculous fact you know off the top of your head?", c: "funny" },
  { q: "If animals could file complaints, which one has the strongest case against humans?", c: "funny" },
  { q: "What food do you refuse to share, no exceptions, not even family?", c: "funny" },
  { q: "What would be the worst superpower to have?", c: "funny" },
  { q: "If your life had a laugh track, when would it have played today?", c: "funny" },
  { q: "What's the weirdest thing you've ever eaten and pretended to enjoy?", c: "funny" },
  { q: "Which emoji do you use way too much, and what does that say about you?", c: "funny" },
  { q: "If you were a kitchen appliance, which one are you and why?", c: "funny" },
  { q: "What's a hill you'll die on that absolutely does not matter?", c: "funny" },
  { q: "What's the most embarrassing song you'd defend in public?", c: "funny" },
  { q: "If your pet reviewed you online, how many stars — and what's the review?", c: "funny" },
  { q: "What everyday object would make the worst murder-mystery weapon?", c: "funny" },
  { q: "What's the laziest thing you've ever done that you're secretly proud of?", c: "funny" },
  { q: "If you had a warning label, what would it say?", c: "funny" },
  { q: "Which fictional food do you most wish were real?", c: "funny" },
  { q: "What's the pettiest thing that instantly ruins your mood?", c: "funny" },
  { q: "If sneezes had customizable sounds, what would you set yours to?", c: "funny" },
  { q: "What's the worst advice you've ever received — that you followed anyway?", c: "funny" },
  { q: "If you could rename any animal, which one gets a better name?", c: "funny" },
  { q: "What's your NPC catchphrase — the thing you say on repeat?", c: "funny" },
  { q: "Which household chore would you pay real money to never do again?", c: "funny" },
  { q: "What's the most dramatic thing you've done because you were slightly hungry?", c: "funny" },
  { q: "If Monday were a person, what would you say to them?", c: "funny" },
  { q: "What's the strangest compliment you've ever received?", c: "funny" },
];

/** Deterministic index for "today's question" — same for every visitor on a
 * given local date, cycling through the whole bank over ~4 months. */
export function qotdIndexForDate(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000);
  return (d.getFullYear() * 366 + dayOfYear) % QOTD_QUESTIONS.length;
}
