import {
  validatePremiumCollection,
  type PremiumCollectionConfig,
  type PremiumDepth,
  type PremiumPromptItem,
} from "@/data/premiumTypes";

type StudentAudience = "Elementary" | "Middle School" | "High School";
type StudentCategory =
  | "Belonging & Community"
  | "Creativity & Curiosity"
  | "Learning & Growth"
  | "Feelings & Reflection"
  | "Fun & Imagination";

const studentGroups: Record<StudentCategory, Record<StudentAudience, string[]>> = {
  "Belonging & Community": {
    Elementary: [
      "What is one thing you can do to help a new student feel welcome?",
      "If our class had a flag, what symbol should be on it and why?",
      "Which classroom rule helps everyone learn the most?",
      "Who at school would you like to thank today, and for what?",
      "What is a fair way to decide whose turn comes first?",
      "What could you learn by partnering with someone new?",
      "How can a class make room for people who speak quietly?",
      "Which classroom job would you enjoy doing for everyone?",
      "What tradition should our class start this year?",
      "What is a kind way to solve a disagreement during a game?",
      "What quality makes someone a good teammate?",
      "What small surprise could make the whole class smile?",
    ],
    "Middle School": [
      "What helps a group feel welcoming without forcing anyone to participate?",
      "Which unwritten school rule would you keep, change, or remove?",
      "When have you felt like your idea genuinely mattered to a group?",
      "What is one way students can include someone without making it awkward?",
      "Should a good teammate always agree with the group? Why or why not?",
      "What responsibility comes with being popular or influential at school?",
      "What makes an apology feel sincere rather than automatic?",
      "How can a class disagree strongly and still feel like one community?",
      "What is one school space that could feel more welcoming, and how?",
      "Which matters more in a group project: equal work or work matched to strengths?",
      "What is a tradition students should pass on to the next grade?",
      "How can bystanders change the mood when someone is being left out?",
    ],
    "High School": [
      "What would make students trust one another more at school?",
      "When does fitting in help a community, and when does it erase individuality?",
      "What responsibility do older students have toward younger ones?",
      "Which school decision should students have more power to influence?",
      "How can a group recognize invisible contributions, not only visible leadership?",
      "What makes a school tradition worth preserving?",
      "How should a community respond when a joke makes only some people uncomfortable?",
      "What is one barrier that keeps students from asking for help?",
      "Is belonging something a group gives you, or something you help create?",
      "What would a genuinely inclusive school event look like?",
      "How can students challenge a friend's behavior without ending the friendship?",
      "What is one way your grade could leave the school better than it found it?",
    ],
  },
  "Creativity & Curiosity": {
    Elementary: [
      "If you could add one new room to the school, what would happen there?",
      "What ordinary object would you redesign to make it more fun?",
      "If animals could ask humans one question, what would they ask?",
      "What would you invent to make mornings easier?",
      "If you could study one place in the ocean, where would you choose?",
      "What new flavor would you create, and what would you name it?",
      "If your pencil could remember everything it wrote, what story would it tell?",
      "What question would you ask someone who lived 1,000 years ago?",
      "How could you build a playground using only things found in nature?",
      "If shadows came in colors, what color would yours be today?",
      "What mystery in space would you most like scientists to solve?",
      "What could a robot learn from a child that adults might not teach it?",
    ],
    "Middle School": [
      "What problem at school could be improved with a simple invention?",
      "If you could interview any fictional character, what would you ask first?",
      "What topic have you changed your mind about after learning more?",
      "Which everyday system would be interesting to take apart and understand?",
      "If you designed a museum about life today, what three objects would it display?",
      "What rule of nature would you temporarily change for an experiment?",
      "Which question deserves an answer even if it has no practical use?",
      "How would school change if curiosity mattered more than correct answers?",
      "What could humans learn by observing one animal more carefully?",
      "If you made a documentary, which overlooked story would you tell?",
      "What technology from science fiction feels closest to becoming real?",
      "What is a surprising connection between two subjects you study?",
    ],
    "High School": [
      "What question would you pursue for a year if grades did not matter?",
      "Which familiar problem needs a completely different kind of solution?",
      "If you could observe one historical moment without changing it, which would you choose?",
      "What technology should exist by now but still does not?",
      "Which assumption about teenagers would you test with real research?",
      "What idea sounds impossible today but may feel ordinary in 30 years?",
      "How does creativity change when there are strict constraints?",
      "Which two school subjects should collaborate on one project?",
      "What unanswered scientific question feels personally fascinating to you?",
      "If you curated an exhibit about the 2020s, what would visitors need to understand?",
      "What is one use of AI that people are not discussing enough?",
      "Which local problem could become a meaningful student research project?",
    ],
  },
  "Learning & Growth": {
    Elementary: [
      "What is something you can do now that once felt very hard?",
      "Which mistake taught you something useful?",
      "What helps you keep trying when the first attempt does not work?",
      "What skill would you like to practice for ten minutes every day?",
      "How can you tell when you truly understand something?",
      "What is one question you are proud you asked?",
      "Which kind of feedback helps you improve the most?",
      "What do you do when instructions do not make sense yet?",
      "Who has taught you something without being your teacher?",
      "What subject becomes more interesting when you use it outside school?",
      "What is a good goal for this week that you can actually measure?",
      "How would you encourage a friend who says, 'I am bad at this'?",
    ],
    "Middle School": [
      "What study habit helps you more than people might expect?",
      "When is asking for help a sign of strength?",
      "What is one skill you improved by being patient with yourself?",
      "How do you know when to persist and when to change strategies?",
      "Which mistake should schools make safer for students to admit?",
      "What makes feedback useful instead of discouraging?",
      "Which subject would be easier if it were taught differently?",
      "What is one goal you could make smaller so it is easier to begin?",
      "How does teaching someone else change your own understanding?",
      "What is a better measure of learning than a single test score?",
      "Which distraction is hardest for you to notice while it is happening?",
      "What have you learned recently that connected to something outside school?",
    ],
    "High School": [
      "Which learning strategy do you use because it works, not just because it feels productive?",
      "What ability have you underestimated because it developed slowly?",
      "How should students balance ambitious goals with realistic limits?",
      "What does intellectual courage look like in a classroom?",
      "When did changing your study method matter more than studying longer?",
      "Which kind of failure gives the most useful information?",
      "How can you separate your identity from one disappointing result?",
      "What is one academic skill that will still matter ten years from now?",
      "When is competition motivating, and when does it interfere with learning?",
      "What would you learn differently if you knew nobody would grade it?",
      "Which part of a difficult project should you begin before you feel ready?",
      "What evidence tells you that you are making progress even before results appear?",
    ],
  },
  "Feelings & Reflection": {
    Elementary: [
      "What feeling is easiest for you to recognize, and what does it feel like?",
      "What is one small thing that helped you feel calm recently?",
      "How can you tell when a friend might need some space?",
      "What is something you did this week that made you proud?",
      "What helps you reset after a frustrating moment?",
      "When do you feel most comfortable asking a question?",
      "What is a kind sentence you can say to yourself after a mistake?",
      "What made you feel curious today?",
      "How does your body tell you that you need a break?",
      "What is one good moment from yesterday you want to remember?",
      "What can you do when two feelings show up at the same time?",
      "Who is a trusted person you can talk to when a problem feels too big?",
    ],
    "Middle School": [
      "What helps you notice stress before it becomes overwhelming?",
      "Which emotion is hardest to explain accurately?",
      "What is one boundary that helps friendships stay healthy?",
      "How can you support someone without trying to solve everything for them?",
      "What is a recent moment when you handled something better than the old you would have?",
      "How does comparing yourself with others affect your mood?",
      "What helps you feel like yourself again after a difficult day?",
      "When is it useful to sit with an uncomfortable feeling instead of escaping it?",
      "What is one thing adults misunderstand about the pressure students feel?",
      "How can you disagree without making the disagreement personal?",
      "What is one expectation you would like to loosen for yourself?",
      "Which small habit has the biggest effect on your energy?",
    ],
    "High School": [
      "What does a healthy response to uncertainty look like for you?",
      "Which pressure in your life is useful, and which is only draining?",
      "How can you tell the difference between rest and avoidance?",
      "What is one belief about yourself that may be out of date?",
      "When do you feel most able to be honest without performing for others?",
      "What helps you recover after receiving criticism?",
      "Which emotion tends to hide behind irritation for you?",
      "What would self-respect look like in one decision you are facing?",
      "How can ambition and contentment exist at the same time?",
      "What is one thing you would like your future self to remember about this year?",
      "When is changing your mind a sign of growth rather than inconsistency?",
      "What does asking for help early protect you from later?",
    ],
  },
  "Fun & Imagination": {
    Elementary: [
      "If your backpack had a secret button, what would it do?",
      "Would you rather be able to talk to clouds or understand birds?",
      "If you opened a tiny shop, what unusual thing would you sell?",
      "Which animal would be the funniest school principal?",
      "If today had a sound effect, what would it sound like?",
      "What would you name a new planet covered in playgrounds?",
      "If you could make one food bounce, which food would be funniest?",
      "What three things would you pack for a trip inside a storybook?",
      "If your shoes could choose where to walk, where would they take you?",
      "Which superpower would be useful only at school?",
      "If the classroom pet wrote a report card for the class, what would it say?",
      "What would happen if everyone woke up the size of a pencil?",
    ],
    "Middle School": [
      "If your week were a movie genre, which genre would it be?",
      "What useless talent would make an excellent competition?",
      "If school subjects formed a band, which subject would be the lead singer?",
      "Which fictional world would be fun to visit but terrible to live in?",
      "If you had to replace handshakes with a new greeting, what would it be?",
      "What would your personal warning label say?",
      "If your phone could complain about you, what would it mention first?",
      "Which everyday object deserves a dramatic movie trailer?",
      "If you could make one minor inconvenience disappear forever, which one?",
      "What would be the strangest theme for a school dance?",
      "If your personality were a weather forecast, what is today's forecast?",
      "Which historical figure would be most confused by a group chat?",
    ],
    "High School": [
      "If your current life chapter had an overly dramatic title, what would it be?",
      "Which ordinary skill would you make an Olympic event?",
      "If your search history became a museum exhibit, what would the exhibit be called?",
      "What conspiracy theory about school life could you invent in two minutes?",
      "Which fictional character would be the worst partner for a group project?",
      "If procrastination were a professional sport, what would your training routine be?",
      "What harmless opinion would you defend with unreasonable passion?",
      "If you could rename one day of the week, what would you call it?",
      "Which app would be funniest if it existed in the Middle Ages?",
      "What is the least useful advice you could give your younger self?",
      "If your mood were a playlist title, what would today's playlist be called?",
      "Which school rule would become funniest if taken completely literally?",
    ],
  },
};

const studentUseCases: Record<StudentCategory, string[]> = {
  "Belonging & Community": ["Morning Meeting", "SEL Check-In"],
  "Creativity & Curiosity": ["Writing Warm-Up", "Fun Brain Break"],
  "Learning & Growth": ["Morning Meeting", "Writing Warm-Up"],
  "Feelings & Reflection": ["SEL Check-In", "Writing Warm-Up"],
  "Fun & Imagination": ["Fun Brain Break", "Morning Meeting"],
};

const studentFollowUps: Record<StudentCategory, string[]> = {
  "Belonging & Community": ["What is one action that would make that real?", "How might another student see it differently?"],
  "Creativity & Curiosity": ["What detail would you add first?", "What new question does that idea create?"],
  "Learning & Growth": ["What is one small next step?", "What evidence would show progress?"],
  "Feelings & Reflection": ["What helps in that moment?", "How could someone respond with care?"],
  "Fun & Imagination": ["What would happen next?", "Why did you choose that answer?"],
};

function buildStudentQuestions(): PremiumPromptItem[] {
  const items: PremiumPromptItem[] = [];
  let sequence = 0;
  for (const [category, byAudience] of Object.entries(studentGroups) as [StudentCategory, Record<StudentAudience, string[]>][]) {
    for (const [audience, questions] of Object.entries(byAudience) as [StudentAudience, string[]][]) {
      questions.forEach((question, index) => {
        sequence += 1;
        const deeper = audience === "High School" && index % 3 === 1;
        const duration = deeper ? "3 min" : index % 3 === 0 ? "30 sec" : "1 min";
        const depth: PremiumDepth = deeper ? "Deep" : category === "Fun & Imagination" ? "Light" : "Medium";
        items.push({
          id: `student-qotd-${String(sequence).padStart(3, "0")}`,
          prompt: question,
          category,
          audience,
          useCase: studentUseCases[category][index % studentUseCases[category].length],
          duration,
          depth,
          followUps: [studentFollowUps[category][index % studentFollowUps[category].length]],
          facilitationTip: audience === "Elementary"
            ? "Offer think time and let students answer with a sentence, drawing, gesture, or pass."
            : "Give quiet think time first, keep sharing optional, and invite reasons without grading personal opinions.",
        });
      });
    }
  }
  return items;
}

export const STUDENT_QOTD_QUESTIONS = buildStudentQuestions();

type WorkCategory =
  | "Daily Check-In & Focus"
  | "Fun & Personality"
  | "Connection & Onboarding"
  | "Reflection & Improvement";

const workGroups: Record<WorkCategory, string[]> = {
  "Daily Check-In & Focus": [
    "In one word, how are you arriving today?",
    "What is the one outcome that would make today feel productive?",
    "What could block your progress today, and what help would be useful?",
    "Which task deserves your freshest attention this morning?",
    "What is one small win you want to create before lunch?",
    "How full is your plate today: light, steady, or overloaded?",
    "What is one decision you would like the team to make quickly?",
    "Which piece of work would benefit most from a second pair of eyes?",
    "What are you protecting focus for today?",
    "What is one thing you can finish rather than merely advance today?",
    "Which dependency should the team know about before work begins?",
    "What information would make your next step easier?",
    "What is one meeting or task you can simplify today?",
    "Which customer or teammate need is most important today?",
    "What would make today's workload feel sustainable?",
    "What is one thing you are deliberately not prioritizing today?",
    "Where do you need clarity rather than more effort?",
    "What is the earliest sign that your plan for today is slipping?",
    "Which task has been waiting because its first step is unclear?",
    "What is one useful update the team may not know yet?",
    "What deserves a fast experiment instead of a long discussion?",
    "Where could a five-minute conversation prevent an hour of rework?",
    "What assumption are you relying on today?",
    "Which handoff needs extra care before the end of the day?",
    "What is one way you can make a teammate's work easier today?",
    "Which result matters more than the activity used to produce it?",
    "What is one constraint you need the team to respect today?",
    "What can you do today that your future self will appreciate tomorrow?",
    "Which unfinished item is creating the most mental noise?",
    "What is one reason to feel optimistic about today's work?",
  ],
  "Fun & Personality": [
    "If your workday had an opening theme song, what would it be?",
    "Which fictional character would be surprisingly useful on this team?",
    "What is the most delightfully useless skill you have?",
    "If you could instantly master one hobby by tonight, which would you choose?",
    "What food could you happily eat every week without getting tired of it?",
    "Which ordinary object do you have an unreasonable opinion about?",
    "If your current energy were a weather forecast, what would it say?",
    "What is the best tiny purchase you have made recently?",
    "Which movie or show would you enjoy watching again for the first time?",
    "What is a harmless rule you always break at home?",
    "If your pet or favorite animal joined this meeting, what would it contribute?",
    "Which app would you keep if your phone allowed only three?",
    "What is a boring task you secretly find satisfying?",
    "If you opened a small shop unrelated to your career, what would it sell?",
    "Which snack best represents your working style?",
    "What song reliably improves your mood?",
    "If the team had a mascot, what should it be?",
    "What minor inconvenience would you erase from daily life forever?",
    "Which place would you choose for an imaginary team retreat?",
    "What is one popular thing you have never understood?",
    "If you had to give a ten-minute talk with no preparation, what topic could you handle?",
    "Which fictional invention do you most wish were real?",
    "What is the funniest autocorrect or message mistake you remember?",
    "If today were a holiday, what would people celebrate?",
    "What would your personal loading-screen tip say?",
    "Which household chore would you turn into a competitive sport?",
    "What is a strangely specific thing you are good at remembering?",
    "If you could rename one day of the week, what name would improve it?",
    "Which smell instantly brings back a good memory?",
    "What is one recommendation you are always happy to give?",
  ],
  "Connection & Onboarding": [
    "What is one working preference that helps others collaborate with you?",
    "Which previous experience taught you something useful for this role?",
    "What kind of question do you wish new teammates asked sooner?",
    "What makes you feel included in a meeting?",
    "Which communication channel do you prefer for urgent, complex, and routine topics?",
    "What is one strength you enjoy contributing to a team?",
    "How do you like to receive feedback when work is still in progress?",
    "What context about your role is easy for other teams to miss?",
    "Which part of starting a new job or project is usually hardest?",
    "What is one sign that you trust a team?",
    "Which type of problem do people naturally bring to you?",
    "What helps you speak up when you disagree?",
    "What is one tradition from a past team worth borrowing?",
    "How do you prefer teammates to raise a concern with you?",
    "What is one thing you are curious to learn from this team?",
    "Which accomplishment tells us something important about how you work?",
    "What does a useful one-on-one conversation look like to you?",
    "What is one assumption people sometimes make about your role that is wrong?",
    "When do you do your best focused work?",
    "What helps a remote or hybrid teammate feel present rather than peripheral?",
    "What is one boundary that helps you do sustainable work?",
    "Which team norm should be explained rather than left unwritten?",
    "What do you need before you feel comfortable making a decision independently?",
    "What is one non-work experience that shaped how you collaborate?",
    "How do you usually show appreciation to a teammate?",
    "What kind of recognition feels meaningful to you?",
    "Which project stage gives you the most energy: starting, shaping, finishing, or improving?",
    "What is one thing teammates can rely on you for?",
    "What would help you understand the team's customers more quickly?",
    "Which question would help a new teammate understand our culture honestly?",
  ],
  "Reflection & Improvement": [
    "What is one recent win whose cause we should understand, not just celebrate?",
    "Which part of our process creates more waiting than value?",
    "What did we learn recently that should change the next plan?",
    "Where did clear ownership make a difference this week?",
    "Which decision took longer than its risk justified?",
    "What is one mistake we can make easier to detect next time?",
    "Which team habit is useful in theory but inconsistent in practice?",
    "Where did we solve a symptom instead of the underlying problem?",
    "What is one piece of customer feedback we should act on sooner?",
    "Which handoff worked well, and what made it work?",
    "What work should we stop doing because its purpose is no longer clear?",
    "Where would a smaller experiment have taught us faster?",
    "Which risk did we notice early enough to manage well?",
    "What is one contribution that was important but easy to overlook?",
    "Which meeting produced a decision worth the time it used?",
    "Where did our metric encourage the wrong behavior?",
    "What is one unresolved question we should carry into the next cycle?",
    "Which assumption was challenged by real evidence?",
    "What made collaboration easier across roles or locations?",
    "Where did perfectionism slow a good-enough next step?",
    "Which piece of work became simpler after we clarified the user need?",
    "What should we document while the lesson is still fresh?",
    "Where did we depend too heavily on one person?",
    "What is one experiment we should repeat before drawing a conclusion?",
    "Which decision would benefit from a clear expiration or review date?",
    "What made it easier or harder to raise concerns this week?",
    "Where did we create rework for another team?",
    "Which success can we turn into a repeatable practice?",
    "What is one improvement small enough to try in the next seven days?",
    "What would we explain differently if we had to start this project again?",
  ],
};

const workAudiences = ["Any Team", "Remote Team", "Hybrid Team", "In-Person Team"];
const workUseCases: Record<WorkCategory, string[]> = {
  "Daily Check-In & Focus": ["Daily Check-In", "Team Meeting"],
  "Fun & Personality": ["Team Icebreaker", "Friday Fun"],
  "Connection & Onboarding": ["Onboarding", "Team Meeting"],
  "Reflection & Improvement": ["Retrospective", "Team Meeting"],
};
const workFollowUps: Record<WorkCategory, string[]> = {
  "Daily Check-In & Focus": ["What support or decision would help?", "What is the smallest useful next step?"],
  "Fun & Personality": ["What story is behind that answer?", "Who has a completely different answer?"],
  "Connection & Onboarding": ["What should teammates do with that information?", "Can you share a short example?"],
  "Reflection & Improvement": ["What evidence points to that lesson?", "What would we try differently next time?"],
};

function buildWorkQuestions(): PremiumPromptItem[] {
  const items: PremiumPromptItem[] = [];
  let sequence = 0;
  for (const [category, questions] of Object.entries(workGroups) as [WorkCategory, string[]][]) {
    questions.forEach((question, index) => {
      sequence += 1;
      const isReflection = category === "Reflection & Improvement";
      const duration = index % 5 === 0 ? "30 sec" : isReflection && index % 3 === 1 ? "2 min" : "1 min";
      const depth: PremiumDepth = category === "Fun & Personality"
        ? "Light"
        : isReflection && index % 4 === 1
          ? "Deep"
          : "Medium";
      items.push({
        id: `work-qotd-${String(sequence).padStart(3, "0")}`,
        prompt: question,
        category,
        audience: workAudiences[index % workAudiences.length],
        useCase: workUseCases[category][index % workUseCases[category].length],
        duration,
        depth,
        followUps: [workFollowUps[category][index % workFollowUps[category].length]],
        facilitationTip: category === "Reflection & Improvement"
          ? "Keep the reflection about systems and choices rather than assigning blame to an absent person."
          : "Keep answers optional and short enough that the question warms up the meeting instead of replacing it.",
      });
    });
  }
  return items;
}

export const WORK_QOTD_QUESTIONS = buildWorkQuestions();

export const STUDENT_QOTD_CONFIG: PremiumCollectionConfig = {
  slug: "question-of-the-day-for-students",
  path: "/question-of-the-day-for-students",
  eyebrow: "A full school year of daily prompts",
  title: "Question of the Day for Students",
  metaTitle: "Question of the Day for Students — 180 School Prompts",
  metaDescription: "Use 180 school-safe questions of the day for elementary, middle and high school students, with grade, activity and answer-time filters plus printable weekly plans.",
  subtitle: "One editor-written prompt for every school day, with grade-aware filters for morning meetings, SEL check-ins, writing warm-ups, and brain breaks.",
  intro: "A classroom question of the day works when it is easy to start, safe to pass, and interesting enough to produce more than a one-word answer. This collection includes 180 original questions — enough for a typical school year — with separate elementary, middle school, and high school prompts. The daily question is stable for everyone each day, while the filters and no-repeat generator let teachers match a specific lesson or classroom mood.",
  published: "2026-08-31",
  updated: "2026-08-31",
  source: "student_qotd_collection",
  promptNoun: "question",
  itemCountLabel: "Prompts for a school year",
  filters: [
    { key: "audience", label: "Grade band", allLabel: "All grade bands", options: ["Elementary", "Middle School", "High School"] },
    { key: "category", label: "Theme", allLabel: "All themes", options: ["Belonging & Community", "Creativity & Curiosity", "Learning & Growth", "Feelings & Reflection", "Fun & Imagination"] },
    { key: "useCase", label: "Classroom use", allLabel: "Any activity", options: ["Morning Meeting", "SEL Check-In", "Writing Warm-Up", "Fun Brain Break"] },
    { key: "duration", label: "Answer time", allLabel: "Any answer time", options: ["30 sec", "1 min", "3 min"] },
  ],
  items: STUDENT_QOTD_QUESTIONS,
  tool: {
    title: "Today's Classroom Question",
    description: "Use the same daily prompt across the class, filter for a particular grade or activity, or build a five-day plan in one click.",
    actionLabel: "Choose Another Student Question",
    emptyLabel: "Today's question is ready. Use the filters to build a grade-aware classroom rotation.",
    copyStyle: "classroom",
    daily: true,
    planner: true,
  },
  guide: {
    title: "A five-minute classroom routine",
    intro: "Consistency matters more than a complicated activity. Keep the question visible, make participation safe, and stop while students still want another one tomorrow.",
    steps: [
      { title: "Display one question", description: "Project or read the prompt without adding a long explanation. Use the answer-time filter to match the space in the lesson." },
      { title: "Give quiet think time", description: "Allow 20–30 seconds before hands go up. Students can plan a sentence, jot a note, or draw before sharing." },
      { title: "Share without forcing", description: "Use pairs, a quick circle, or written responses. Make passing normal so reflective prompts do not become public-pressure exercises." },
      { title: "Use one follow-up", description: "Ask the included follow-up only if it helps the group listen or go deeper; end before the ritual consumes the lesson." },
    ],
  },
  qualityNotes: [
    "The bank contains exactly 180 original questions: 60 each for elementary, middle school, and high school.",
    "Prompts avoid asking students to reveal family finances, trauma, medical information, discipline history, or other private experiences.",
    "Every question is tagged by grade, theme, activity, answer time, and depth so filters change the teaching use rather than merely the wording.",
    "The full list remains visible and printable even though the daily and random tools are interactive.",
  ],
  parentLink: { label: "General question of the day", href: "/question-of-the-day" },
  relatedLinks: [
    { label: "Ethical dilemmas for students", href: "/topics/ethical-dilemmas-for-students", description: "Run longer classroom discussions with structured tradeoffs." },
    { label: "Writing prompts for kids", href: "/topics/writing-prompts-for-kids", description: "Turn daily questions into longer creative practice." },
    { label: "Debate topics for students", href: "/topics/debate-topics-for-students", description: "Move from quick sharing to formal argument." },
  ],
  faq: [
    { question: "How many school days does the collection cover?", answer: "It contains 180 unique questions, enough for one prompt on each day of a typical school year. The generator avoids repeats until the matching filtered set has been used." },
    { question: "Are the questions suitable for every grade?", answer: "Questions are separated into elementary, middle school, and high school bands. Teachers should still use their knowledge of the class and may let students pass on any reflective prompt." },
    { question: "How can I create a weekly question plan?", answer: "Choose any grade, theme, activity, or answer-time filters, then select Build weekly plan. The tool produces five questions labeled Monday through Friday that you can copy or print." },
    { question: "Does today's question change for different visitors?", answer: "No. The featured classroom question is selected from the date, so everyone sees the same daily prompt. Random and filtered questions are available when today's prompt does not suit the class." },
  ],
  library: { category: "education", modes: ["conversation", "icebreaker"] },
};

export const WORK_QOTD_CONFIG: PremiumCollectionConfig = {
  slug: "question-of-the-day-for-work",
  path: "/question-of-the-day-for-work",
  eyebrow: "A low-friction ritual for real teams",
  title: "Question of the Day for Work",
  metaTitle: "Question of the Day for Work — 120 Team Prompts",
  metaDescription: "Use 120 professional questions of the day for remote, hybrid and in-person teams, with meeting, onboarding, retrospective and answer-time filters plus Slack-ready copy.",
  subtitle: "Professional daily prompts for check-ins, onboarding, retrospectives, and lighter team connection — formatted for meetings, Slack, and Teams.",
  intro: "The best work question of the day is short, optional, and appropriate for people with different backgrounds and levels of seniority. These 120 original prompts range from a 30-second check-in to a focused retrospective question. Use the stable daily question, filter by team setup and meeting type, or copy a five-day plan directly into Slack or Microsoft Teams.",
  published: "2026-08-31",
  updated: "2026-08-31",
  source: "work_qotd_collection",
  promptNoun: "question",
  itemCountLabel: "Professional team prompts",
  filters: [
    { key: "audience", label: "Team setup", allLabel: "Any team setup", options: ["Any Team", "Remote Team", "Hybrid Team", "In-Person Team"] },
    { key: "category", label: "Theme", allLabel: "All themes", options: ["Daily Check-In & Focus", "Fun & Personality", "Connection & Onboarding", "Reflection & Improvement"] },
    { key: "useCase", label: "Meeting use", allLabel: "Any meeting use", options: ["Daily Check-In", "Team Meeting", "Team Icebreaker", "Friday Fun", "Onboarding", "Retrospective"] },
    { key: "duration", label: "Answer time", allLabel: "Any answer time", options: ["30 sec", "1 min", "2 min"] },
  ],
  items: WORK_QOTD_QUESTIONS,
  tool: {
    title: "Today's Team Question",
    description: "Pick a professional prompt that fits the meeting, copy it in a ready-to-post format, or build a five-day rotation without repeating the same question.",
    actionLabel: "Choose Another Work Question",
    emptyLabel: "Today's team question is ready. Filter the bank when you need a faster check-in, onboarding prompt, or retrospective question.",
    copyStyle: "work",
    daily: true,
    planner: true,
  },
  guide: {
    title: "How to keep a work QOTD useful",
    intro: "A daily prompt should create a small moment of connection or clarity, not become another mandatory performance. Establish the ritual, keep it brief, and vary the purpose across the week.",
    steps: [
      { title: "Match the purpose", description: "Use check-in questions for focus, onboarding questions for working preferences, fun prompts for energy, and retrospective questions for process learning." },
      { title: "Make participation optional", description: "A pass or emoji reaction should be acceptable. Avoid turning a light ritual into an expectation to disclose personal circumstances." },
      { title: "Post in a reusable format", description: "Copy the question into Slack or Teams with one sentence on answer length and a clear time window for asynchronous teams." },
      { title: "Rotate ownership", description: "Invite teammates to choose or post future questions, then retire prompts that feel repetitive, intrusive, or disconnected from the team's work." },
    ],
  },
  qualityNotes: [
    "All 120 questions are newly written for work teams and do not copy the general QOTD, work icebreaker, or team-building articles.",
    "Prompts avoid protected characteristics, family plans, health, compensation, politics, religion, and other information that can create workplace pressure.",
    "Every item is tagged by team setup, theme, meeting use, answer time, and depth; retrospective prompts include blame-free facilitation notes.",
    "Copy, weekly-plan, save, share, print, filter, and repeat-use actions are measured separately from simply viewing the page.",
  ],
  parentLink: { label: "General question of the day", href: "/question-of-the-day" },
  relatedLinks: [
    { label: "Workplace ethical dilemmas", href: "/topics/workplace-ethical-dilemmas", description: "Use structured cases for deeper manager or team training." },
    { label: "Icebreaker questions for work", href: "/topics/icebreaker-questions-for-work", description: "Browse meeting starters for one-off sessions." },
    { label: "Team-building questions", href: "/topics/team-building-questions", description: "Explore working preferences and collaboration." },
  ],
  faq: [
    { question: "What is a good question of the day for work?", answer: "It is short, inclusive, easy to answer without preparation, and safe for coworkers with different backgrounds and levels of authority. The question should fit the purpose of the meeting and allow anyone to pass." },
    { question: "How can remote teams use these questions?", answer: "Post one question in a shared channel, state the expected answer length, and leave a time window for responses across time zones. Use the Remote Team filter for prompts that do not depend on everyone being in the same room." },
    { question: "Can I copy questions into Slack or Microsoft Teams?", answer: "Yes. The copy button adds a ready-to-post Question of the day label. The weekly planner produces Monday-through-Friday prompts you can copy or print." },
    { question: "Should a work QOTD be mandatory?", answer: "Usually no. A lightweight ritual works best when people can answer briefly, react, or pass. Managers should not use responses as performance evidence or pressure employees to disclose private information." },
  ],
  library: { category: "business", modes: ["conversation", "icebreaker"] },
};

validatePremiumCollection(STUDENT_QOTD_CONFIG, 180);
validatePremiumCollection(WORK_QOTD_CONFIG, 120);
