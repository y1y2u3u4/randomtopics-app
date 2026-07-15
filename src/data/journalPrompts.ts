// Journal prompt bank — curated in-house, 2026-07. Reflection questions rather
// than story starters (that's /writing). Tagged by category for the generator.

export type JournalCategory =
  | "self-discovery"
  | "gratitude"
  | "morning"
  | "evening"
  | "growth"
  | "creativity";

export interface JournalPrompt {
  p: string;
  c: JournalCategory;
}

export const JOURNAL_CATEGORIES: { id: JournalCategory; label: string; emoji: string }[] = [
  { id: "self-discovery", label: "Self-Discovery", emoji: "🧭" },
  { id: "gratitude", label: "Gratitude", emoji: "🙏" },
  { id: "morning", label: "Morning Pages", emoji: "🌅" },
  { id: "evening", label: "Evening Reflection", emoji: "🌙" },
  { id: "growth", label: "Growth & Goals", emoji: "🌱" },
  { id: "creativity", label: "Creative Sparks", emoji: "✨" },
];

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  // ── Self-discovery ──────────────────────────────────────────────────────
  { p: "What do you wish more people understood about you?", c: "self-discovery" },
  { p: "When do you feel most like yourself — and who are you with when it happens?", c: "self-discovery" },
  { p: "What's a belief you held strongly five years ago that has softened or changed?", c: "self-discovery" },
  { p: "Which compliment do you have the hardest time accepting, and why?", c: "self-discovery" },
  { p: "What are you pretending not to know about your current situation?", c: "self-discovery" },
  { p: "If your energy had a dashboard, what drains the battery fastest? What charges it?", c: "self-discovery" },
  { p: "What's something you do only when nobody's watching?", c: "self-discovery" },
  { p: "Describe yourself in the third person, kindly — the way a good friend would.", c: "self-discovery" },
  { p: "What part of your daily routine is actually someone else's expectation?", c: "self-discovery" },
  { p: "What did you love doing at age ten? Where did that love go?", c: "self-discovery" },
  { p: "Which emotion do you find hardest to sit with, and how do you usually escape it?", c: "self-discovery" },
  { p: "What's a boundary you know you need but haven't set yet?", c: "self-discovery" },
  { p: "Whose approval are you still chasing, and what would happen if you stopped?", c: "self-discovery" },
  { p: "What do you owe your younger self an apology for? Write it.", c: "self-discovery" },
  { p: "If you could keep only three values, which survive — and which surprised you by not making the cut?", c: "self-discovery" },
  { p: "What's the story you tell about yourself that might not be true anymore?", c: "self-discovery" },
  { p: "Where in your life are you performing instead of living?", c: "self-discovery" },
  { p: "What would you do differently if you knew nobody would judge you?", c: "self-discovery" },
  { p: "What's your relationship with silence?", c: "self-discovery" },
  { p: "Which version of you — from which year — would be proudest of you today? Which would be most confused?", c: "self-discovery" },

  // ── Gratitude ───────────────────────────────────────────────────────────
  { p: "List three tiny things from today that you'd miss if they were gone tomorrow.", c: "gratitude" },
  { p: "Who did something for you this week that they didn't have to do?", c: "gratitude" },
  { p: "What's something your body did for you today that you didn't thank it for?", c: "gratitude" },
  { p: "Write about an object you own that's quietly made your life better for years.", c: "gratitude" },
  { p: "What's a hard thing from your past that you're now — strangely — grateful for?", c: "gratitude" },
  { p: "Who taught you something that you still use almost every day?", c: "gratitude" },
  { p: "What's free in your life that would be worth paying a fortune for?", c: "gratitude" },
  { p: "Describe a meal you'll remember for a long time — what made it more than food?", c: "gratitude" },
  { p: "What's something about where you live that visitors love and you've stopped noticing?", c: "gratitude" },
  { p: "Write a thank-you note to someone who will never read it.", c: "gratitude" },
  { p: "What ability do you have now that you once wished for?", c: "gratitude" },
  { p: "Who believed in you before the evidence existed?", c: "gratitude" },
  { p: "What's the best thing that happened this month that cost nothing?", c: "gratitude" },
  { p: "Which of your five senses gave you the most joy today?", c: "gratitude" },
  { p: "What's a mistake that redirected your life somewhere better?", c: "gratitude" },

  // ── Morning pages ───────────────────────────────────────────────────────
  { p: "What would make today feel like a win by 9 p.m.?", c: "morning" },
  { p: "What's the one thing you're most likely to avoid today — and what's the two-minute version of starting it?", c: "morning" },
  { p: "How do you want to feel at the end of today? What one choice makes that more likely?", c: "morning" },
  { p: "What's on your mind before the day has had a chance to interfere? Brain-dump it all.", c: "morning" },
  { p: "If today had a theme song, what would it be — and what does that tell you?", c: "morning" },
  { p: "What's one conversation you should have today instead of putting off?", c: "morning" },
  { p: "Finish the sentence: 'Today I give myself permission to…'", c: "morning" },
  { p: "What's yesterday's leftover worry, and does it deserve a seat in today?", c: "morning" },
  { p: "Pick one word to steer today. Why that word?", c: "morning" },
  { p: "What would 'taking care of future you' look like before noon?", c: "morning" },
  { p: "What are you looking forward to today — and if the answer is nothing, what tiny thing could you plant?", c: "morning" },
  { p: "Who could you make feel seen today with one small message?", c: "morning" },
  { p: "What's the most important thing on your list — and is it actually on your list?", c: "morning" },
  { p: "If energy were currency, what's worth spending on today and what's a scam?", c: "morning" },
  { p: "What tiny discomfort, if you did it first, would make the whole day lighter?", c: "morning" },

  // ── Evening reflection ──────────────────────────────────────────────────
  { p: "What surprised you today?", c: "evening" },
  { p: "What drained you today, and what does that pattern look like across the week?", c: "evening" },
  { p: "What moment from today would you keep in a jar?", c: "evening" },
  { p: "What did you handle better today than you would have a year ago?", c: "evening" },
  { p: "If today were a chapter, what would its title be?", c: "evening" },
  { p: "What's one thing you saw today that you'd have missed if you'd been on your phone?", c: "evening" },
  { p: "Who made your day 1% better, even accidentally?", c: "evening" },
  { p: "What are you carrying to bed that you could set down on this page instead?", c: "evening" },
  { p: "What did you say yes to today that you should have said no to — or the reverse?", c: "evening" },
  { p: "What's unfinished from today, and is that okay?", c: "evening" },
  { p: "Rate today honestly, 1-10. What would have moved it one point higher?", c: "evening" },
  { p: "What made you laugh today?", c: "evening" },
  { p: "What did you learn today that you didn't know at breakfast?", c: "evening" },
  { p: "Where were you brave today, even in a small way?", c: "evening" },
  { p: "Write tomorrow's you a one-line note to read in the morning.", c: "evening" },

  // ── Growth & goals ──────────────────────────────────────────────────────
  { p: "What's the smallest next step on the goal you keep postponing?", c: "growth" },
  { p: "What skill would change everything if you were 20% better at it?", c: "growth" },
  { p: "What are you practicing daily — on purpose or by accident? (You're always practicing something.)", c: "growth" },
  { p: "What would you attempt if failure cost nothing but pride?", c: "growth" },
  { p: "Whose life, three years ahead of yours, looks like the path you want? What are they doing daily?", c: "growth" },
  { p: "What feedback have you received more than once that you keep dismissing?", c: "growth" },
  { p: "What's a habit you've successfully built before — and what actually made it stick?", c: "growth" },
  { p: "What does 'success' mean this year, in one sentence, without using money or titles?", c: "growth" },
  { p: "What are you doing when you procrastinate — and what is it protecting you from?", c: "growth" },
  { p: "If your future self could veto one of your current habits, which goes first?", c: "growth" },
  { p: "What's the difference between being busy and being useful, in your actual week?", c: "growth" },
  { p: "What deadline would you set today if you truly believed you'd meet it?", c: "growth" },
  { p: "What did you quit that you're glad you quit? What might deserve the same treatment?", c: "growth" },
  { p: "Write the one-paragraph review of your year as you want December to describe it.", c: "growth" },
  { p: "What's one thing you know you should automate, delegate, or delete?", c: "growth" },

  // ── Creative sparks ─────────────────────────────────────────────────────
  { p: "Describe your morning through the eyes of your coffee mug.", c: "creativity" },
  { p: "Invent a holiday the world actually needs. How is it celebrated?", c: "creativity" },
  { p: "Write a letter from your 80-year-old self to you, today, about what mattered.", c: "creativity" },
  { p: "If your neighborhood were a character in a novel, who would it be?", c: "creativity" },
  { p: "Describe a color to someone who has never seen it.", c: "creativity" },
  { p: "What would your pet write in its diary about you today?", c: "creativity" },
  { p: "Take the last text you sent and write the story that happens because of it.", c: "creativity" },
  { p: "Design your perfect room. Money is irrelevant; describe every corner.", c: "creativity" },
  { p: "Write about an ordinary object as if it were the most valuable artifact in a museum.", c: "creativity" },
  { p: "If sounds had flavors, what does your favorite song taste like?", c: "creativity" },
  { p: "Rewrite a boring moment from today as the opening scene of a thriller.", c: "creativity" },
  { p: "What would the road outside your home say if it could talk about what it's seen?", c: "creativity" },
  { p: "Invent a word for a feeling that doesn't have one yet. Define it, use it in a sentence.", c: "creativity" },
  { p: "Describe your week as a weather report.", c: "creativity" },
  { p: "You find a door in your home you've never noticed. Write what's behind it.", c: "creativity" },
];
