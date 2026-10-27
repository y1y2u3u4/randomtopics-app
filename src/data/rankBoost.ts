// Original supporting content for English pages that rank #5-9 with low CTR
// (200k clicks push, Oct 2026). Titles, H1s, intros and existing FAQ wording on
// those pages are untouched; this adds sections, tables and appended FAQ entries.
// Inline links use [label](/path). Rendered by src/components/RankBoost.tsx.
import type { BoostFaq, BoostSection } from "@/components/RankBoost";

export interface Boost { sections: BoostSection[]; faq: BoostFaq[] }

/* ------------------------------------------------------------------ */
export const CONVERSATION_BOOST: Boost = {
  sections: [
    {
      h2: "Random Topics to Talk About, by Situation",
      id: "topics-by-situation",
      blocks: [
        { t: "p", x: "A topic generator works best when you pick the depth to match the moment. Use this table to choose a filter, then use the example as a model for the kind of opener to expect." },
        {
          t: "table",
          head: ["Situation", "Best filter", "Example opener"],
          rows: [
            ["First date or new friend", "Light to medium", "What is a place you would go back to tomorrow if you could?"],
            ["Friends hanging out", "Light, funny", "What is something you changed your mind about this year?"],
            ["Colleagues and coffee breaks", "Light, work-safe", "What small habit or tool made your week easier lately?"],
            ["Family dinner", "Light to medium", "Which family story gets retold at every holiday, and who tells it best?"],
            ["Long car ride or flight", "Medium", "If we had a free week and a full tank, where would we end up?"],
            ["Language practice (ESL)", "Light, one topic per session", "Describe a meal you would cook for a visitor from another country."],
            ["Late-night talk with a close friend", "Deep", "What are you pretending not to care about right now?"],
          ],
        },
      ],
    },
    {
      h2: "Light, Medium and Deep Conversation Topics",
      blocks: [
        { t: "p", x: "Depth is the most useful filter in the generator. Start one level lighter than you think you need; it is easy to go deeper once people are comfortable, and awkward to climb back out." },
        { t: "h3", x: "Light topics (safe with anyone)" },
        { t: "ul", items: ["Food you could eat every week for a year.", "The best thing you watched, read or played recently.", "A trip, real or imagined, you would plan in detail.", "A skill you picked up by accident."] },
        { t: "h3", x: "Medium topics (friends and good colleagues)" },
        { t: "ul", items: ["A decision that looked small and changed things.", "Something you were bad at that you now enjoy.", "A rule you grew up with and still follow, or broke on purpose.", "What a perfect Sunday looks like for you."] },
        { t: "h3", x: "Deep topics (people you trust)" },
        { t: "ul", items: ["A belief you hold that you could not fully defend.", "What you would do differently if nobody were watching.", "A time someone showed up for you without being asked.", "What you want your life to look like in ten years, and what is in the way."] },
        { t: "p", x: "For a longer deep list with relationship and setting filters, open the [deep conversation question generator](/deep-conversation-question-generator)." },
      ],
    },
    {
      h2: "How to Use a Random Topic Without It Feeling Forced",
      blocks: [
        {
          t: "ol",
          items: [
            "Generate two or three and pick the one that suits the people in front of you. Skipping is part of the method.",
            "Say it like a normal question, not a reading: put it in your own words.",
            "Answer first if the topic is personal. Going first sets the level of detail you hope for.",
            "Use the follow-up point under the topic when the first answer is short.",
            "Let the conversation leave the topic. The generator only starts it; there is no need to come back.",
          ],
        },
      ],
    },
    {
      h2: "Random Conversation Starters for Groups and Games",
      blocks: [
        { t: "p", x: "For two people a single topic is enough. For a table or a team, a structure helps. Try the [icebreaker generator](/icebreaker) for introductions, [would you rather](/would-you-rather) when you want a quick vote, the [hot seat questions](/hot-seat-questions) for rapid-fire turns, or [questions to ask at a party](/topics/questions-to-ask-at-a-party) when guests do not know each other. If you need a broader subject to build a talk or an essay on, use the [random subject generator](/random-subject-generator); for one shared prompt every day, see the [topic of the day](/topic-of-the-day)." },
      ],
    },
  ],
  faq: [
    {
      question: "How do I get a random topic to talk about?",
      answer: "Press the generate button above. You get one random conversation topic with follow-up points. Filter by category and depth first if you want something specific, such as light topics for a first meeting. There is no signup and no limit.",
    },
    {
      question: "What are good random topics to talk about with friends?",
      answer: "Good topics with friends are specific and personal without being heavy: a recent change of mind, a skill you picked up, a trip you would plan, a food you could eat weekly. Use the light or medium depth filter, or see [random questions to ask friends](/topics/random-questions-to-ask-friends).",
    },
    {
      question: "What is the difference between a topic generator and a question generator?",
      answer: "A topic is a subject ('trips you never took'); a question is a ready-to-ask sentence ('Which trip do you still think about?'). This page gives topics with follow-up points. For ready-made questions, use the [random question generator](/question-generator).",
    },
    {
      question: "Can I use a random topic generator to practise speaking?",
      answer: "Yes. Draw one topic, speak about it for one to two minutes without notes, then repeat with the next. For timed practice with scoring cues, use the [impromptu speech topics](/impromptu-speech-topics) or the [table topics generator](/table-topics-generator).",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const WRITING_BOOST: Boost = {
  sections: [
    {
      h2: "Writing Prompts by Goal: What to Write and Where to Start",
      id: "prompts-by-goal",
      blocks: [
        { t: "p", x: "The generator gives you a topic with angles. These examples show how the same kind of prompt turns into different pieces of writing depending on your goal." },
        {
          t: "table",
          head: ["Goal", "Start with", "Example prompt"],
          rows: [
            ["Short story", "A character plus a problem", "A night-shift baker finds a note baked into a loaf that is addressed to her."],
            ["Personal essay", "A moment that changed your mind", "Write about a time you were certain, and then wrong."],
            ["Journal entry", "A feeling, not an event", "What did today ask of you that you did not expect to give?"],
            ["Blog post", "A reader's problem", "The one habit that made your mornings calmer, and how to start it in a week."],
            ["Persuasive essay", "A claim you can argue both ways", "Should phones be banned in classrooms, or taught as a skill?"],
            ["Poem", "One object and one emotion", "A chipped mug, and what it holds besides coffee."],
            ["Descriptive piece", "One place, three senses", "Describe a train station at 5 a.m. using sound, smell and touch only."],
          ],
        },
      ],
    },
    {
      h2: "A 10-Minute Routine for Any Random Writing Prompt",
      blocks: [
        {
          t: "ol",
          items: [
            "Generate a prompt and read the talking points once. Do not shop for a better one yet.",
            "Set a timer for ten minutes and write the first thing that comes, without editing.",
            "Add one constraint if you stall: tell it as a letter, set it in a single room, or write only dialogue.",
            "When the timer ends, underline the single best sentence.",
            "Tomorrow, start from that sentence and expand it to a page.",
          ],
        },
      ],
    },
    {
      h2: "Ways to Twist Any Prompt",
      blocks: [
        { t: "p", x: "A twist keeps a familiar prompt from producing familiar writing:" },
        {
          t: "ul",
          items: [
            "Change the point of view: write from the minor character, the object or the antagonist.",
            "Change the time: the same scene ten years earlier, or one hour later.",
            "Limit the form: exactly 100 words, or a text-message thread, or a list.",
            "Change the first line: begin in the middle of an argument or with a number.",
            "Start with the ending and work backwards to how it happened.",
          ],
        },
      ],
    },
    {
      h2: "Writing Prompt Tools for Every Kind of Writer",
      blocks: [
        { t: "p", x: "Use this generator when you want a topic fast. When you know the format, go straight to a focused tool: [story prompts by genre and length](/story-prompt-generator), the [writing topic generator](/writing-topic-generator) for essay, journal, fiction or blog filters, the [essay topic generator](/essay-topic-generator), or [journal prompts](/journal-prompts). Writers building a cast can draw a full profile with the [random character generator](/random-character-generator) and pick names with the [character name generator](/character-name-generator). Want a single word to build from? Try the [random word generator](/random-word-generator). To keep a daily streak, use the [writing journal](/writing-journal)." },
      ],
    },
  ],
  faq: [
    {
      question: "Is there a writing prompt generator for adults?",
      answer: "Yes. Choose the medium or deep depth filter and a category such as relationships, philosophy or work to get prompts that suit adult writers, then use them for essays, journaling, short fiction or blog posts.",
    },
    {
      question: "How long should I write for each prompt?",
      answer: "Ten to twenty minutes is enough to get past the first idea. Set a timer, keep your hand moving, and stop when it rings. If a prompt pulls you in, keep going and treat the extra time as a bonus.",
    },
    {
      question: "Can I get a random writing prompt every day?",
      answer: "Yes. Come back to this generator any day for a new random prompt, or use the [writing journal](/writing-journal) to get one prompt per day and keep a streak. The [topic of the day](/topic-of-the-day) is another daily option.",
    },
    {
      question: "How do I turn a random topic into an essay?",
      answer: "Take the topic, pick one of its talking points as your angle, and turn that angle into a one-sentence thesis. Then list three supporting points and write one paragraph for each. The [essay topic generator](/essay-topic-generator) works the same way with essay types built in.",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const GROUP_DISCUSSION_BOOST: Boost = {
  sections: [
    {
      h2: "Group Discussion Topics for Students and Freshers",
      id: "gd-topics-for-students",
      blocks: [
        { t: "p", x: "Campus and entry-level rounds usually pick topics everyone has an opinion on, so the panel can judge how you discuss rather than how much you know. These are good practice topics for students and freshers:" },
        {
          t: "ol",
          items: [
            "Should students be allowed to use phones during class?",
            "Is online learning as effective as classroom learning?",
            "Do marks reflect real ability?",
            "Should uniforms be compulsory in colleges?",
            "Is social media making students more informed or more distracted?",
            "Should internships be paid by law?",
            "Is it better to specialise early or keep options open?",
            "Should sports be a compulsory subject?",
            "Are group projects a fair way to grade individuals?",
            "Does a degree still matter more than skills?",
            "Should students vote on part of their school or college rules?",
            "Is competition or cooperation better for learning?",
          ],
        },
      ],
    },
    {
      h2: "Current and Trending GD Topics",
      id: "current-gd-topics",
      blocks: [
        { t: "p", x: "Current-affairs rounds reward a clear definition, two angles and one concrete example. These topics stay relevant because the underlying debates are ongoing; check a recent news source for the latest figures before you quote any." },
        {
          t: "ul",
          items: [
            "Should AI tools be allowed in hiring decisions?",
            "Are deepfakes a bigger threat than fake news ever was?",
            "Gig work: freedom or insecurity?",
            "Should social media have a minimum age limit?",
            "Four-day work week: productivity gain or a luxury?",
            "Should cities limit private cars in central areas?",
            "Is a digital detox realistic for working professionals?",
            "Who should pay for climate adaptation: governments, companies or individuals?",
          ],
        },
      ],
    },
    {
      h2: "Types of GD Topics and How to Approach Each",
      id: "gd-topic-types",
      blocks: [
        {
          t: "table",
          head: ["Type", "What the panel tests", "Example", "Approach"],
          rows: [
            ["Factual", "Awareness and accuracy", "Impact of automation on jobs", "Define, give 2 facts, then implications"],
            ["Opinion-based", "Reasoning and balance", "Should voting be compulsory?", "State a position, give the strongest counter, answer it"],
            ["Abstract", "Creativity and structure", "Is silence golden?", "Define in two ways, pick lenses, land a view"],
            ["Case study", "Decision-making", "A startup must cut costs by 20%", "State the goal, list constraints, propose a rule, choose"],
            ["Situation-based", "Judgement under pressure", "You are stranded on an island with five items", "Set criteria first, then rank options"],
          ],
        },
      ],
    },
    {
      h2: "How a Group Discussion Round Is Structured",
      blocks: [
        {
          t: "table",
          head: ["Stage", "Typical time", "What to do"],
          rows: [
            ["Topic given", "1-2 minutes of thinking", "Jot three points and one example; do not write a script"],
            ["Opening", "First 1-2 minutes", "Frame the topic; open only if your first point is strong"],
            ["Discussion", "10-15 minutes", "Build on others by name, add one new point per turn, invite quiet members"],
            ["Closing", "Last 1-2 minutes", "Summarise the points covered; do not add a brand-new argument"],
          ],
        },
        { t: "p", x: "Timing and panel style vary by institute and company, so treat these as common ranges. Practise the same flow with a timer and friends, or use the [debate topic generator](/debate) for two-sided drills." },
      ],
    },
    {
      h2: "Useful Phrases for a Group Discussion",
      blocks: [
        { t: "ul", items: [
          "Opening: \"Before we start, I would like to define what we mean by this.\"",
          "Adding a point: \"Building on what Priya said, there is another side to this.\"",
          "Disagreeing politely: \"I see your point, but the data points somewhere different.\"",
          "Including others: \"We have not heard from Arjun yet. What do you think?\"",
          "Summarising: \"To sum up, we agreed on two things and differed on one.\"",
        ] },
        { t: "h3", x: "Common mistakes to avoid" },
        { t: "ul", items: ["Speaking first with nothing to say.", "Interrupting, or raising your voice to win.", "Reciting statistics you cannot source.", "Staying silent for most of the round.", "Starting a new argument in the last thirty seconds."] },
        { t: "p", x: "Practise delivery with the [impromptu speech topics](/impromptu-speech-topics), or rehearse a point of view with the [pro and con debate topics](/pro-and-con-debate-topics)." },
      ],
    },
  ],
  faq: [
    {
      question: "What are good group discussion topics for students?",
      answer: "Good student GD topics are familiar and arguable: phones in class, online versus classroom learning, whether marks reflect ability, and paid internships. See the list of 12 student topics on this page and practise with a friend and a timer.",
    },
    {
      question: "What are some current topics for group discussion?",
      answer: "Current topics include AI in hiring, deepfakes, gig work, a minimum age for social media, the four-day work week, and who pays for climate adaptation. Check a recent news source for fresh facts before quoting any numbers.",
    },
    {
      question: "How long does a group discussion last?",
      answer: "Most GD rounds run 10 to 20 minutes, with a short preparation time before and a summary at the end. Panels and colleges vary, so confirm the format in your invitation.",
    },
    {
      question: "What is the difference between a group discussion and a debate?",
      answer: "A group discussion is collaborative: participants build toward a shared view and are judged on content and behaviour. A debate is adversarial: two sides argue assigned positions. Use the [debate generator](/debate) to practise the latter.",
    },
    {
      question: "What are good group decision-making topics?",
      answer: "Group decision topics give the team a goal, limits and options to rank: surviving on an island, choosing a charity budget, or deciding which project to cut. They test how the group agrees on criteria before choosing. For quick practice picks, try the [decision maker](/decision-maker).",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const ETHICAL_DILEMMA_BOOST: Boost = {
  sections: [
    {
      h2: "Famous Moral Dilemma Examples",
      id: "famous-moral-dilemmas",
      blocks: [
        { t: "p", x: "These named dilemmas appear in philosophy classes, psychology courses and interviews. Each tests a different tension, so they make good starting points for a discussion." },
        {
          t: "table",
          head: ["Dilemma", "The setup", "What it tests"],
          rows: [
            ["Trolley problem", "A runaway trolley will kill five people unless you divert it to a track where it kills one.", "Outcomes versus actively causing harm"],
            ["Footbridge variant", "The only way to stop the trolley is to push a stranger off a bridge.", "Why the same numbers can feel different"],
            ["Heinz dilemma", "A man cannot afford a drug that could save his dying wife and considers stealing it.", "Law versus life, used in moral-development research"],
            ["Lifeboat", "An overloaded lifeboat will sink unless someone leaves.", "Fairness, survival and who decides"],
            ["Murderer at the door", "A friend hides in your house and a person with bad intent asks where they are.", "Whether honesty has exceptions"],
            ["Whistleblower", "You find wrongdoing at your employer and reporting it risks your job.", "Loyalty versus public interest"],
            ["Experience machine", "You can plug into a machine that simulates a perfect life that you cannot tell is not real.", "Whether happiness is all that matters"],
          ],
        },
      ],
    },
    {
      h2: "How Different Ethical Theories Answer",
      id: "ethical-theories",
      blocks: [
        { t: "p", x: "Moral dilemmas have no single correct answer, but you can see why people disagree by looking at the major frameworks. Here is how each approaches the trolley problem." },
        {
          t: "table",
          head: ["Framework", "Core question", "Likely view on the trolley problem"],
          rows: [
            ["Utilitarianism", "Which action produces the best overall outcome?", "Divert the trolley; one life lost is better than five"],
            ["Deontology", "Which rules or duties must never be broken?", "Often hesitates: do not use a person merely as a means"],
            ["Virtue ethics", "What would a person of good character do?", "Depends on character: courage, compassion and practical wisdom"],
            ["Care ethics", "Which relationships and responsibilities matter here?", "Asks who the people are and what we owe them"],
            ["Contractualism", "Which principle could everyone reasonably accept?", "Looks for a rule no affected person could reject"],
          ],
        },
      ],
    },
    {
      h2: "Moral Questions to Discuss (Shorter Than a Dilemma)",
      blocks: [
        { t: "p", x: "Not every discussion needs a full scenario. These shorter moral questions work as warm-ups or journal prompts:" },
        {
          t: "ul",
          items: [
            "Is it ever right to lie to protect someone's feelings?",
            "Do we owe more to people close to us than to strangers?",
            "Is it wrong to benefit from a system you did not create?",
            "Should a person be judged by intent or by outcome?",
            "When is it right to break a rule?",
            "Can a private act be wrong if no one is ever harmed or finds out?",
            "How much of our own comfort should we give up to help others?",
          ],
        },
        { t: "p", x: "For philosophy-style prompts see the [philosophical questions](/philosophical-questions) page, or browse [moral dilemma examples](/moral-dilemma-examples) to compare cases." },
      ],
    },
    {
      h2: "Run an Ethical Dilemma Debate",
      blocks: [
        { t: "p", x: "To turn a dilemma into a structured debate, assign two sides, give each three minutes to prepare, then swap and have each side argue the opposite. The [argument generator](/argument-generator) supplies claims to practise with, and the [debate topic generator](/debate) has motions with talking points for both sides. For a quick discussion with students, see [ethical dilemmas for students](/topics/ethical-dilemmas-for-students); for a work setting, use [workplace ethical dilemmas](/topics/workplace-ethical-dilemmas)." },
      ],
    },
  ],
  faq: [
    {
      question: "What are some examples of moral dilemmas?",
      answer: "Classic examples include the trolley problem, the Heinz dilemma, the lifeboat, the murderer at the door and the whistleblower. See the table of famous moral dilemmas above, plus the scenarios in this article.",
    },
    {
      question: "What is the trolley problem?",
      answer: "The trolley problem asks whether you would divert a runaway trolley onto a track that kills one person in order to save five. Its footbridge variant asks whether you would push someone to stop it. People often answer the two versions differently, which is why it is used to study moral intuition.",
    },
    {
      question: "What are good ethical questions to ask?",
      answer: "Good ethical questions make people weigh competing values: honesty versus kindness, loyalty versus fairness, personal gain versus public good. Use a short moral question as a warm-up or one of the dilemmas above to go deeper.",
    },
    {
      question: "How do you debate ethical dilemmas?",
      answer: "Name everyone affected, state the values in tension, argue the strongest case for the side you oppose, then choose and explain how to reduce the remaining harm. Switching sides halfway makes the discussion fairer. The [argument generator](/argument-generator) is useful for practice.",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const TOASTMASTERS_BOOST: Boost = {
  sections: [
    {
      h2: "Table Topics Question Types With Examples",
      id: "table-topics-question-types",
      blocks: [
        { t: "p", x: "A good Table Topics session mixes types so every speaker gets something they can work with. Here are the main types and an original example of each." },
        {
          t: "table",
          head: ["Type", "What it asks of the speaker", "Example"],
          rows: [
            ["Personal story", "Share a short experience", "Tell us about a time you were surprised by kindness."],
            ["Opinion", "Take a side quickly", "Should every workplace have a four-day week?"],
            ["Hypothetical", "Imagine and describe", "You are given a free year to learn anything. What do you choose?"],
            ["Object-based", "Speak about an item", "Describe the object in front of you as if it were a hero in a movie."],
            ["One-word or quote", "Interpret and apply", "\"Fortune favours the bold.\" Where has that been true for you?"],
            ["Role-play", "Speak as someone else", "You are a tour guide in your hometown. Welcome us."],
            ["Light and funny", "Entertain", "Invent a new holiday and explain how we should celebrate it."],
          ],
        },
      ],
    },
    {
      h2: "Themed Table Topics Questions",
      id: "themed-table-topics",
      blocks: [
        { t: "p", x: "A theme gives the meeting a thread. Pick one and use questions like these:" },
        { t: "h3", x: "Travel" },
        { t: "ul", items: ["Describe a place you would visit again for a different reason.", "What do you always pack that others find strange?", "Plan a perfect day in a city you have never visited."] },
        { t: "h3", x: "Career and leadership" },
        { t: "ul", items: ["What is the best feedback you ever received?", "Describe a mentor, and one thing they taught you without saying it.", "What would you change about how meetings are run?"] },
        { t: "h3", x: "Technology" },
        { t: "ul", items: ["Which device could you not live without, and what would replace it?", "What should every teenager know about the internet?", "Predict one thing that will be normal in ten years."] },
        { t: "h3", x: "Holidays and celebrations" },
        { t: "ul", items: ["Which tradition in your family would you pass on first?", "What is the best gift you ever gave?", "Describe a celebration where something went wrong and became the best part."] },
      ],
    },
    {
      h2: "How a Table Topics Session Works",
      id: "how-table-topics-works",
      blocks: [
        {
          t: "ul",
          items: [
            "A Table Topics Master introduces the session and calls on speakers one at a time.",
            "Each speaker receives a question and speaks for about one to two minutes without preparation. Clubs often use green, yellow and red timing cues for 1:00, 1:30 and 2:00; check your club's rules.",
            "Guests and new members are often invited to take part, but taking part is voluntary.",
            "At the end, the evaluator and the timer give feedback and the group may vote for a best speaker.",
          ],
        },
      ],
    },
    {
      h2: "Tips for the Table Topics Master",
      blocks: [
        {
          t: "ol",
          items: [
            "Prepare about two more questions than you have speakers, so you always have a spare.",
            "Avoid yes or no questions: a question that starts with how, what or why gives the speaker room.",
            "Mix easy and challenging questions, and match easier ones to new members.",
            "Read the question once, clearly, and then call the speaker's name so everyone listens.",
            "Keep the theme clear so the session feels connected rather than random.",
          ],
        },
        { t: "p", x: "Need questions on demand? The [table topics generator](/table-topics-generator) draws questions without repeats with a timer. For more practice material, see [impromptu speech topics](/impromptu-speech-topics) and [1-minute speech topics](/1-minute-speech-topics)." },
      ],
    },
  ],
  faq: [
    {
      question: "What makes a good Table Topics question?",
      answer: "A good Table Topics question is open-ended, answerable without special knowledge, and gives the speaker a choice about where to take it. Avoid yes/no questions, trivia and anything that depends on private or sensitive information.",
    },
    {
      question: "How many Table Topics questions do I need for a meeting?",
      answer: "Prepare one question per planned speaker plus two or three spares. A typical session has between six and ten speakers, depending on the meeting length and how many guests attend.",
    },
    {
      question: "How do I write Table Topics for a themed meeting?",
      answer: "Choose the theme, write three or four angles (a personal story, an opinion, an imagining, an object), then turn each into a question that does not need research. The themed sets on this page give examples for travel, careers, technology and holidays.",
    },
    {
      question: "Are there easy Table Topics questions for beginners?",
      answer: "Yes. Start with personal and low-stakes questions such as a favourite place, a recent surprise or a tradition. Add [one-minute speech topics](/1-minute-speech-topics) or the [impromptu speech topics](/impromptu-speech-topics) tool once you are comfortable.",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const TWO_TRUTHS_BOOST: Boost = {
  sections: [
    {
      h2: "Two Truths and a Lie Examples (Complete Sets)",
      id: "two-truths-examples",
      blocks: [
        { t: "p", x: "A complete set has three statements and one lie. The best lies sound as plausible as the truths. These example sets are for different groups; swap in details that are true or false in your own life." },
        {
          t: "table",
          head: ["Setting", "Statement 1", "Statement 2", "Statement 3", "The lie"],
          rows: [
            ["Funny", "I once sneezed while driving and parked in a hedge.", "I can wiggle my ears independently.", "I have never been late to anything.", "3"],
            ["Work", "My first job was washing dishes in a hotel.", "I have visited 14 countries.", "I have worked from a beach for a full week.", "2"],
            ["Adults", "I have run a half marathon.", "I once sat next to a famous actor on a flight without knowing it.", "I speak three languages fluently.", "1"],
            ["School", "I have had my pet since I was five.", "I broke my arm playing a sport.", "I was born in a different country.", "3"],
            ["Icebreaker", "I collected stamps as a child.", "I have met someone I was named after.", "I have been on TV.", "2"],
          ],
        },
      ],
    },
    {
      h2: "How to Write a Good Lie (and Good Truths)",
      blocks: [
        {
          t: "ol",
          items: [
            "Make the lie specific and believable: \"I once met a famous person at an airport\" works better than \"I have been to Mars\".",
            "Make one truth sound like a lie. An unusual but true fact is the best decoy.",
            "Keep all three statements the same length and style.",
            "Avoid giveaways such as hesitating, smiling or putting the lie in the same position every time.",
            "Use details you can explain in one sentence if someone asks.",
          ],
        },
      ],
    },
    {
      h2: "Ways to Play Two Truths and a Lie",
      id: "two-truths-variations",
      blocks: [
        {
          t: "ul",
          items: [
            "Classic: each player reads three statements; the group votes on the lie.",
            "Written: everyone writes statements on slips, the host reads them and the group guesses whose they are.",
            "Remote: use the chat for guesses, and ask the speaker to keep a neutral face.",
            "Scored: players earn a point for each correct guess and for each person who guesses wrong.",
            "Two lies and a truth: the group finds the one truth. It is harder and funnier.",
            "Themed: limit statements to a topic such as travel, childhood or work.",
          ],
        },
        { t: "p", x: "For a full game with themed prompts and a round builder, open the [Two Truths and a Lie game](/two-truths-and-a-lie). More icebreakers: the [icebreaker generator](/icebreaker), [hot seat questions](/hot-seat-questions) and [21 questions](/21-questions)." },
      ],
    },
  ],
  faq: [
    {
      question: "How do you play two truths and a lie?",
      answer: "Each player says three statements about themselves: two true and one false. The group discusses and votes for the one they think is the lie, then the speaker reveals it. Take turns until everyone has played.",
    },
    {
      question: "What makes a good lie in two truths and a lie?",
      answer: "A good lie is plausible, specific and in the same style as your truths. Mix in one unusual truth so that the lie is not the strangest statement.",
    },
    {
      question: "What are good two truths and a lie ideas for adults?",
      answer: "Think about travel stories, first jobs, unusual skills, near misses, and meeting well-known people. Keep it light and avoid anything that would be uncomfortable if it were true.",
    },
    {
      question: "What are good two truths and a lie examples for work?",
      answer: "Work-safe examples include first jobs, places you have lived, hobbies, languages and odd skills. Avoid medical, financial or personal relationship details, which make some colleagues uncomfortable.",
    },
  ],
};

/* ------------------------------------------------------------------ */
export const QUESTION_GENERATOR_BOOST: Boost = {
  sections: [
    {
      h2: "Random Questions by Purpose",
      id: "questions-by-purpose",
      blocks: [
        {
          t: "table",
          head: ["Purpose", "Depth", "Example question"],
          rows: [
            ["Friends", "Light to medium", "What is the best decision you made on a whim?"],
            ["First date", "Light", "What is something you are surprisingly good at?"],
            ["Team icebreaker", "Light", "What was your first job, and what did it teach you?"],
            ["Classroom", "Light", "If you could add one subject to our school, what would it be?"],
            ["Family dinner", "Light to medium", "What is one thing you hope we do together this year?"],
            ["Close partner or friend", "Deep", "What is something you are proud of that you rarely mention?"],
            ["Language practice", "Light", "What does a perfect weekend look like for you?"],
          ],
        },
      ],
    },
    {
      h2: "Random Questions to Ask Friends: 15 to Try",
      id: "random-questions-for-friends",
      blocks: [
        {
          t: "ol",
          items: [
            "What is something you used to believe that turned out to be false?",
            "Which fictional place would you most like to visit?",
            "What is the best meal you have ever had, and who was there?",
            "Which small thing makes a day feel good for you?",
            "What would you do with an extra hour every day?",
            "Which skill would you master overnight if you could?",
            "What is the best advice you ignored?",
            "Who has influenced you most without knowing it?",
            "What is a smell that takes you back to childhood?",
            "What would your autobiography be called?",
            "What is one rule you would add to the world?",
            "What is the most useless talent you have?",
            "Which year would you relive, and why?",
            "What do you want to be known for among friends?",
            "What is on your list of things to try?",
          ],
        },
        { t: "p", x: "More lists: [random questions to ask friends](/topics/random-questions-to-ask-friends), [get to know you questions](/topics/get-to-know-you-questions-for-adults) and [would you rather](/would-you-rather)." },
      ],
    },
    {
      h2: "How to Use Random Questions in a Group",
      blocks: [
        {
          t: "ul",
          items: [
            "Round robin: generate one question, everyone answers in a sentence or two, then move to the next.",
            "Pass the phone: the person who answered generates the next question for their neighbour.",
            "Question jar: generate 10 questions and write each on a slip. Draw one per person.",
            "Pairs: partners swap questions for three minutes, then introduce each other to the group.",
          ],
        },
        { t: "p", x: "For a single shared question every day, use the [question of the day](/question-of-the-day), or the [question of the day for work](/question-of-the-day-for-work) and the [question of the day for students](/question-of-the-day-for-students)." },
      ],
    },
  ],
  faq: [
    {
      question: "Is there a random question generator for friends?",
      answer: "Yes. Choose light or medium depth and use the get-to-know-you or funny categories to get questions that suit friends. You can also browse [random questions to ask friends](/topics/random-questions-to-ask-friends).",
    },
    {
      question: "What is a good random question to ask?",
      answer: "A good random question is open-ended and easy to answer with a story: \"What is the best decision you made on a whim?\" Avoid yes/no questions and anything that feels like an interview.",
    },
    {
      question: "Can I get a random question of the day?",
      answer: "Yes. Use the [question of the day](/question-of-the-day) for one shared question every day, with versions for work and students. This generator is better for many questions at once.",
    },
    {
      question: "How do I answer a random question?",
      answer: "Answer in two or three sentences: give your answer, add one detail or story, then ask the question back to the other person. Short, specific answers keep the conversation moving.",
    },
  ],
};

/* ------------------------------------------------------------------ */
// Generator-shell pages: dynamic tables (built from the generator data) live in
// the page files; the static parts and the appended FAQ live here.
export const JAPANESE_BOOST: Boost = {
  sections: [
    {
      h2: "Common Japanese Name Endings and Elements",
      id: "name-elements",
      blocks: [
        { t: "p", x: "Many Japanese names are built from familiar elements. Knowing a few makes it easier to read a name, guess its gender and build a believable one for a character." },
        {
          t: "table",
          head: ["Element", "Kanji", "Meaning", "Examples"],
          rows: [
            ["-ko", "子", "child", "Yuko, Keiko, Akiko"],
            ["-mi", "美", "beauty", "Yumi, Naomi, Emi"],
            ["-ka", "花 / 香", "flower, fragrance", "Ayaka, Sayaka"],
            ["-to", "斗 / 人", "dipper, person", "Yuto, Kento"],
            ["-ta", "太", "big, thick", "Sota, Kenta, Yuta"],
            ["-suke", "介", "to assist", "Daisuke, Kosuke"],
            ["-ro", "郎", "son, man", "Ichiro, Jiro, Taro"],
            ["-ki", "樹 / 希", "tree, hope", "Haruki, Yuki"],
          ],
        },
      ],
    },
    {
      h2: "Japanese Honorifics: -san, -kun, -chan and More",
      blocks: [
        {
          t: "table",
          head: ["Honorific", "Use", "Example"],
          rows: [
            ["-san", "Neutral and polite; the default for adults", "Tanaka-san"],
            ["-kun", "Familiar, used for boys and younger men, or by a superior", "Haruto-kun"],
            ["-chan", "Affectionate, for children, close friends and pets", "Yui-chan"],
            ["-sama", "Very respectful, for customers and high status", "Okyaku-sama"],
            ["-sensei", "Teachers, doctors and masters of a craft", "Sato-sensei"],
            ["-senpai", "A senior at school or work", "Kobayashi-senpai"],
          ],
        },
      ],
    },
    {
      h2: "How to Choose a Japanese Name for a Character",
      blocks: [
        {
          t: "ol",
          items: [
            "Pick the era and setting: modern names differ from samurai-era ones, and anime names often prefer unusual kanji.",
            "Choose the gender filter, then generate several names and read the meanings.",
            "Match the meaning to your character: Minato (harbor) suits a steady friend, Sora (sky) suits a dreamer.",
            "Pair it with a surname that fits the family's background; place-based surnames suit rural families.",
            "Say the full name aloud in the order your story uses and check it is not already a famous character.",
          ],
        },
        { t: "p", x: "Need the rest of the character? Generate a full profile with the [random character generator](/random-character-generator), or draw a name from another culture with the [character name generator](/character-name-generator), the [western baby name generator](/western-baby-name-generator) or the [band name generator](/band-name-generator)." },
      ],
    },
  ],
  faq: [
    {
      question: "How do I write my own name in Japanese?",
      answer: "Foreign names are usually written in katakana by sound: for example, Emma becomes エマ. This generator creates real Japanese names with kanji and meanings; it does not transliterate your name. For a transliteration, use a katakana converter or ask a Japanese speaker.",
    },
    {
      question: "What are the most common Japanese surnames?",
      answer: "Sato, Suzuki, Takahashi, Tanaka, Ito, Watanabe, Yamamoto and Nakamura are among the most common family names in Japan, and all of them are available in this generator.",
    },
    {
      question: "What is a good Japanese name for a girl or a boy?",
      answer: "Names such as Himari and Yui are popular for girls and Haruto, Sota and Minato for boys. Choose the gender filter and read the kanji meanings to find one that suits your story or your interest.",
    },
    {
      question: "How do I use Japanese honorifics with a name?",
      answer: "Add the honorific after the family name or given name: Tanaka-san, Haruto-kun, Yui-chan. When unsure, use -san, which is polite and neutral. See the honorific table above.",
    },
  ],
};

export const ANIMAL_BOOST: Boost = {
  sections: [
    {
      h2: "Random Animal Games and Activities",
      id: "animal-games",
      blocks: [
        {
          t: "ul",
          items: [
            "Twenty questions: one player draws an animal, the others ask yes/no questions about habitat, size and diet.",
            "Animal charades: act out the animal without sound. The [charades generator](/charades) has an Animals category.",
            "Draw it: sketch the animal in 60 seconds. For other subjects try the [random drawing generator](/random-drawing-generator) or the [Pictionary word generator](/pictionary-word-generator).",
            "Zoo-in-a-bag: write 20 animals on slips and have teams pick one and present three facts.",
            "Team names: draw an animal for each team and add an adjective. The [random team generator](/random-team-generator) can split the group first.",
            "Story starter: make the animal the hero or the villain of a three-sentence story.",
          ],
        },
        { t: "p", x: "Looking for other random picks? Try the [random word generator](/random-word-generator), the [random object generator](/random-object-generator) or the [random color generator](/random-color-generator)." },
      ],
    },
  ],
  faq: [
    {
      question: "How do I get a random animal?",
      answer: "Press Generate and the tool names a random animal with a picture and a fun fact. Use the Type or Where it lives filter to narrow it down, or leave them on All for any animal.",
    },
    {
      question: "Can I get a random animal for a game or a classroom activity?",
      answer: "Yes. Set Easy (kids know it) for young children, generate one animal at a time and use it for guessing games, drawing or a one-page report. Use [charades](/charades) with the Animals category for an acting game.",
    },
    {
      question: "Does the random animal generator repeat animals?",
      answer: "Not until you have seen the whole list for your current filters. Change a filter or press Reset to start fresh.",
    },
  ],
};

export const LASTNAME_BOOST: Boost = {
  sections: [
    {
      h2: "Where Surnames Come From: Four Main Types",
      id: "surname-types",
      blocks: [
        {
          t: "table",
          head: ["Type", "How it started", "Examples"],
          rows: [
            ["Occupational", "A job an ancestor did", "Smith, Miller, Schmidt, Ferrari"],
            ["Patronymic", "Father's name, often with a prefix or suffix", "Johnson, Fernandez, O'Brien, Petrov"],
            ["Locational", "A place or landscape feature", "Hill, Yamamoto, Costa, Lund"],
            ["Descriptive", "A nickname or trait", "Reid (red), Russo (red-haired), Brown"],
          ],
        },
        { t: "p", x: "In the US Census 2010 the most common surnames were Smith, Johnson, Williams, Brown, Jones, Garcia, Miller, Davis, Rodriguez and Martinez. If you want a name that does not clash with a famous person, filter by a less common origin." },
      ],
    },
    {
      h2: "Surnames for Different Settings",
      blocks: [
        {
          t: "ul",
          items: [
            "Modern fiction: choose the origin of your character's family and mix common and distinctive names.",
            "Historical fiction: occupational and locational surnames (Baker, Fletcher, Hill) fit many periods.",
            "Fantasy and games: use a real surname as a base for a clan name, or try the [D&D name generator](/dnd-name-generator), [elf name generator](/elf-name-generator), [Viking name generator](/viking-name-generator) or [vampire name generator](/vampire-name-generator).",
            "Test data and mock-ups: pair with the [fake name generator](/fake-name-generator) for full names.",
            "Japanese characters: use the [Japanese name generator](/japanese-name-generator) for kanji and meanings.",
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "How do I get a random last name?",
      answer: "Press Generate. Leave the origin on All for a random surname from any culture, or pick an origin such as Irish, Italian or Korean. Each result includes its meaning.",
    },
    {
      question: "What are the most common last names?",
      answer: "In the US Census 2010 the ten most common surnames were Smith, Johnson, Williams, Brown, Jones, Garcia, Miller, Davis, Rodriguez and Martinez. Common names vary by country.",
    },
    {
      question: "Is this a last name finder for my family history?",
      answer: "No. It generates real surnames with their origin and meaning for writing, games and teaching. It does not look up where your own family name comes from; a genealogy site can do that.",
    },
    {
      question: "Can I choose a last name by country?",
      answer: "Yes. Use the origin filter to choose from English, Irish, Scottish, Welsh, Italian, Spanish, Portuguese, German, French, Japanese, Chinese, Korean and many more cultures, and select several for a mixed-heritage family.",
    },
  ],
};

export const CHARACTER_BOOST: Boost = {
  sections: [
    {
      h2: "Random Person Generator or Random Character Generator?",
      id: "person-vs-character",
      blocks: [
        { t: "p", x: "If you searched for a random person generator, this tool makes fictional people: a name, a job, a personality, a look, a goal, a secret, a quirk and a flaw. Use it for stories, games and art. If you need placeholder data such as an address or an email for testing, use the [fake person generator](/fake-person-generator) or the [fake identity generator](/fake-identity-generator) instead; they are made for that and use clearly fictional details." },
      ],
    },
    {
      h2: "Using a Random Character for Writing, D&D and Art",
      blocks: [
        {
          t: "ul",
          items: [
            "Fiction: generate three characters, keep the best secret and the best flaw, and combine them into one.",
            "D&D and tabletop NPCs: use the occupation and quirk for a voice, the motivation for a quest hook. Add a race-specific name with the [D&D name generator](/dnd-name-generator).",
            "Original characters (OCs): copy the look and personality into a sketch brief and draw the same person in three outfits.",
            "Roleplay and improv: treat the personality and quirk as a role card and play a scene.",
            "Writing practice: pair the character with a [writing prompt](/writing) and write the opening paragraph.",
          ],
        },
      ],
    },
    {
      h2: "Six Questions That Turn a Random Character Into a Real One",
      blocks: [
        {
          t: "ol",
          items: [
            "What do they want right now, and what are they willing to give up for it?",
            "What stands in their way: a person, a rule or their own flaw?",
            "Who knows their secret, and who would hurt most if it came out?",
            "What would they never do, even to get what they want?",
            "Which object do they carry or keep, and why?",
            "Who do they call at 3 a.m.?",
          ],
        },
        { t: "p", x: "For names that fit a setting, see the [character name generator](/character-name-generator), the [last name generator](/last-name-generator) and the [Japanese name generator](/japanese-name-generator). For superhero-style casts, try the [random Marvel character generator](/random-marvel-character-generator)." },
      ],
    },
  ],
  faq: [
    {
      question: "Is there a random personality generator?",
      answer: "Yes. Every character includes a personality line such as 'dry-witted and fiercely loyal' along with a quirk and a flaw. Generate until you get a personality you like and ignore the other traits if you only need that one.",
    },
    {
      question: "Can I generate a random person for a story?",
      answer: "Yes. Press Generate for a complete fictional person with a name, job, looks, motivation and secret, then use the six questions on this page to develop them into a character.",
    },
    {
      question: "How do I make a random character for D&D?",
      answer: "Generate a character, then use the occupation, quirk and flaw to roleplay them. For race and class names, use the [D&D name generator](/dnd-name-generator). The generator does not set ability scores or classes.",
    },
    {
      question: "Can I use a random character as an art or OC prompt?",
      answer: "Yes. Use the appearance, occupation and quirk as a brief for a drawing, and the secret and motivation to decide the pose or expression.",
    },
  ],
};
