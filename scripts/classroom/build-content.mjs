// Builds src/data/classroomPacks.json from the existing question banks.
// Question of the Day: the 180 student questions in premiumQotd.ts.
// Speech: /impromptu-speech-topics groups (work/interview group left out).
// Debate: motions rewritten from the debate topics in topics.ts, each with a
// starting point for both sides. Run: node scripts/classroom/build-content.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const read = (p) => readFileSync(resolve(root, p), "utf8");

function objectAfter(src, marker) {
  const start = src.indexOf("{", src.indexOf(marker));
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}" && --depth === 0) return Function(`return (${src.slice(start, i + 1)})`)();
  }
  throw new Error(`No object after ${marker}`);
}

// ── Question of the Day: 36 weeks × 5 themed days ────────────────────────
const premium = read("src/data/premiumQotd.ts");
const groups = objectAfter(premium, "const studentGroups");
const followUps = objectAfter(premium, "const studentFollowUps");
const DAYS = [
  ["Monday", "Belonging & Community"],
  ["Tuesday", "Creativity & Curiosity"],
  ["Wednesday", "Learning & Growth"],
  ["Thursday", "Feelings & Reflection"],
  ["Friday", "Fun & Imagination"],
];
const BANDS = [
  ["Elementary", "All grades"],
  ["Middle School", "Grades 6+"],
  ["High School", "Grades 9+"],
];
const weeks = [];
for (let w = 0; w < 36; w++) {
  const [band, level] = BANDS[w % 3];
  const slot = Math.floor(w / 3);
  weeks.push({
    title: `Week ${w + 1}`,
    note: level === "All grades" ? "Gentle questions any grade can answer." : `Deeper questions, best for ${level.toLowerCase()}.`,
    items: DAYS.map(([day, theme], d) => {
      const text = groups[theme][band][slot];
      if (!text) throw new Error(`Missing ${theme} ${band} ${slot}`);
      return { id: `w${w + 1}d${d + 1}`, text, label: `Day ${w * 5 + d + 1} · ${day}`, theme, level, followUp: followUps[theme][slot % 2] };
    }),
  });
}

// ── Speech & impromptu ────────────────────────────────────────────────────
const impromptuSrc = ts.transpileModule(read("src/data/impromptuTopics.ts"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const impromptu = {};
Function("exports", impromptuSrc)(impromptu);
// Not for a mixed-age classroom: adult money topics and a grief prompt.
const SPEECH_SKIP = new Set(["Should everyone have a side hustle?", "Should tipping be replaced by higher wages?", "The hardest goodbye I've said"]);
const TIMING = {
  warmup: { label: "Warm-up", prep: 30, speak: [30, 60], rule: "30 seconds to think · speak for 30 seconds to 1 minute" },
  story: { label: "Story", prep: 60, speak: [60, 120], rule: "1 minute to think · speak for 1–2 minutes" },
  argue: { label: "Argue", prep: 60, speak: [120, 180], rule: "1 minute to think · speak for 2–3 minutes" },
};
const SPEECH_ORDER = [
  ["one-word", "warmup"], ["funny", "warmup"], ["school", "story"], ["personal", "story"],
  ["hypotheticals", "story"], ["opinions", "argue"], ["quotes", "argue"],
];
const speechSections = SPEECH_ORDER.map(([id, timing]) => {
  const g = impromptu.IMPROMPTU_GROUPS.find((x) => x.id === id);
  if (!g) throw new Error(`Missing impromptu group ${id}`);
  return {
    title: g.title === "For students" ? "School life" : g.title,
    note: `${TIMING[timing].label}: ${TIMING[timing].rule}. ${g.note.replace("Ages 10 and up; works for speech class and morning meetings.", "Ages 10 and up.")}`,
    timing,
    items: g.topics.filter((t) => !SPEECH_SKIP.has(t)).map((text, i) => ({ id: `${id}-${i + 1}`, text, label: TIMING[timing].label, timing })),
  };
});

// ── Debate: three levels, 20 motions each ────────────────────────────────
const m = (motion, pro, con) => ({ motion, pro, con });
const DEBATE = [
  {
    title: "Starter motions", grades: "Grades 6–8", note: "Everyday school and life questions. Students can argue from their own experience.",
    motions: [
      m("Homework should be optional in middle school.", "Rest, family time and hobbies matter for learning; practice can happen in class.", "Homework builds study habits and shows teachers who needs help early."),
      m("Students should be allowed to grade their teachers.", "Students see every lesson and know what actually helps them learn.", "Ratings could reward easy or popular teachers instead of good teaching."),
      m("Phones should be banned during the school day.", "Fewer distractions and less online drama during lessons and breaks.", "Phones help in emergencies and can be useful learning tools."),
      m("School should start later in the morning.", "Teenagers focus better when they get more sleep.", "A later finish clashes with sports, clubs, jobs and family schedules."),
      m("Every student should learn to code.", "Coding teaches step-by-step problem solving and opens future careers.", "School time is limited; art, music or languages may matter more for some students."),
      m("School uniforms should be required.", "Less pressure about clothes and a stronger sense of school identity.", "Uniforms limit self-expression and can cost families extra money."),
      m("Video games do more good than harm for kids.", "Games build teamwork, quick thinking and persistence.", "Too much gaming can replace sleep, exercise, reading and homework."),
      m("Recess should be longer.", "Play and movement help students focus when they return to class.", "Longer recess means less time for lessons and support."),
      m("The book is always better than the movie.", "Books give more detail and let readers imagine the world themselves.", "Films can bring a story to people who would never read it and add music and images."),
      m("Zoos do more good than harm.", "Zoos protect endangered species and help visitors care about animals.", "Animals lose space, freedom and natural behavior in captivity."),
      m("Esports should count as a real sport.", "Esports demand skill, practice, teamwork and strategy.", "Sport should involve real physical effort and fitness."),
      m("Students should choose their own homework.", "Choice makes students more motivated and lets them practice what they need.", "Students might pick the easiest work and skip important practice."),
      m("Every school should teach money skills.", "Budgeting and saving are skills everyone uses for life.", "Families or other subjects may already cover money; time is limited."),
      m("Philosophy should be taught in elementary school.", "Big questions teach children to think clearly and listen to others.", "Young children need reading and math basics first."),
      m("Kids under 16 should not have social media accounts.", "Younger users are more exposed to pressure, comparison and strangers online.", "Social media helps kids stay connected and learn; teaching safe use works better than a ban."),
      m("Extinct animals should be brought back.", "We could undo past damage and learn a lot about science and nature.", "The money could protect animals that are endangered right now."),
      m("Time outdoors is better for your mood than the gym.", "Fresh air, nature and daylight help people feel calmer.", "Gyms work in any weather and make it easy to build a routine."),
      m("Breakfast is the most important meal of the day.", "Eating in the morning gives energy and focus for school.", "What and how much you eat all day matters more than the timing."),
      m("Streaming shows should release one episode a week.", "Weekly episodes give everyone time to talk about the story together.", "Viewers should be free to watch at their own pace."),
      m("Group projects are better than working alone.", "Groups teach teamwork and combine different strengths.", "Grades can be unfair when some members do most of the work."),
    ],
  },
  {
    title: "Core motions", grades: "Grades 9–12", note: "Real-world questions with evidence on both sides. Good for class debates and essays.",
    motions: [
      m("The voting age should be lowered to 16.", "Sixteen-year-olds work, pay some taxes and live with long-term decisions.", "Most 16-year-olds are still in school and may vote the way their families do."),
      m("College athletes should be paid.", "Athletes bring in money for colleges and spend as many hours as a job.", "Scholarships already pay for school; paying salaries could hurt smaller sports."),
      m("Colleges should stop using standardized tests for admission.", "One test day can reflect test prep and family income more than ability.", "A shared test helps compare students from very different schools."),
      m("Students should take a gap year before college.", "A year of work or service builds maturity and clearer goals.", "Students can lose study habits and momentum, and gap years cost money."),
      m("Schools should switch to a four-day week.", "Longer days and a free day can improve rest and attendance.", "Families need childcare on the fifth day and longer days are tiring."),
      m("Lab-grown meat should replace farmed meat.", "It could cut animal suffering and the land and water farming uses.", "It is still expensive and unproven at scale, and people trust traditional food."),
      m("Cities should create legal walls for street art.", "Legal walls turn vandalism into public art and give young artists a space.", "Property owners and residents should decide how their streets look."),
      m("Movie theaters are worth saving.", "A shared big-screen experience cannot be copied at home.", "Streaming is cheaper and more accessible for most people."),
      m("Humanities deserve as much school funding as STEM.", "History, art and literature teach judgment, empathy and communication.", "STEM jobs are in high demand, so funding should follow need."),
      m("Self-driving cars should be allowed on all public roads.", "Computers do not get tired or distracted like human drivers.", "The technology still makes mistakes, and it is unclear who is responsible."),
      m("People should have the right to repair their own devices.", "Repairs save money and reduce electronic waste.", "Unofficial repairs can be unsafe and weaken security."),
      m("All elected officials should have term limits.", "Term limits bring in new ideas and reduce the power of long-time insiders.", "Voters should decide; experienced leaders know how to get things done."),
      m("Elections should use ranked-choice voting.", "Voters can rank their honest favorite without wasting a vote.", "Ranking many candidates is confusing and slows down counting."),
      m("Space exploration should wait until problems on Earth are solved.", "The money could fund climate, health and poverty programs now.", "Space research produces technology that helps people on Earth."),
      m("Social media does more harm than good for teenagers.", "It can increase comparison, distraction and lost sleep.", "It helps teens find community, information and creative outlets."),
      m("Professional athletes should speak out on social issues.", "A large platform can raise awareness for important causes.", "Fans come for the sport, and athletes may not be experts on the issue."),
      m("Schools should use games to teach core subjects.", "Games make practice engaging and give instant feedback.", "Points and rewards can distract from deep understanding."),
      m("It is acceptable to lie to protect someone's feelings.", "Small kind lies can protect relationships and avoid needless hurt.", "Honesty builds trust; people deserve the truth to make their own choices."),
      m("Every student should do community service to graduate.", "Service builds responsibility and connects students to their community.", "Required service is no longer voluntary and burdens students who already work."),
      m("Remote work is better than working in an office.", "No commute, more flexibility and access to jobs anywhere.", "Teams learn, mentor and collaborate better in person."),
    ],
  },
  {
    title: "Advanced motions", grades: "Grades 11–12 · debate club", note: "Policy and values questions that reward research. Ideal for Public Forum or Lincoln-Douglas practice.",
    motions: [
      m("Governments should regulate artificial intelligence now.", "Rules set early can prevent harm before the technology spreads further.", "Early rules may slow innovation and quickly become outdated."),
      m("A four-year college degree is still worth the cost.", "Graduates tend to have more job options and lifetime earning potential.", "Rising costs and debt make apprenticeships and other paths more sensible for many."),
      m("Voting should be mandatory.", "Results would reflect the whole population, not only the most motivated.", "Freedom includes the choice not to vote; uninformed votes add noise."),
      m("The Electoral College should be replaced by a national popular vote.", "Every vote would count equally, wherever someone lives.", "The current system makes candidates pay attention to smaller states."),
      m("Governments should introduce a universal basic income.", "A guaranteed income gives security as automation changes work.", "It is very expensive and may reduce the incentive to work."),
      m("Big tech platforms should be regulated like public utilities.", "Essential services with huge market power need public oversight.", "Regulation could reduce competition, innovation and free choice."),
      m("Facial recognition should be banned in public spaces.", "Constant identification threatens privacy and can misidentify people.", "It can help find missing people and solve serious crimes."),
      m("Museums should return artifacts to their countries of origin.", "Cultural objects taken without consent belong to the communities that made them.", "Major museums preserve objects and make them available to visitors worldwide."),
      m("AI-generated images should be able to win art competitions.", "Art is about the final result and the human choices behind the prompt.", "Competitions exist to reward human skill and effort."),
      m("Governments should invest heavily in nuclear fusion research.", "Fusion could provide clean, almost unlimited energy.", "The money would cut emissions faster if spent on technology that works today."),
      m("Gene editing to prevent serious disease should be allowed in embryos.", "It could end inherited diseases that cause great suffering.", "Changes pass to future generations and risks are still unknown."),
      m("Sugary drinks should be taxed like tobacco.", "A tax lowers consumption and funds health programs.", "It costs low-income families the most and limits personal choice."),
      m("CEO pay should be capped as a multiple of average worker pay.", "Huge pay gaps are unfair and can damage trust and morale.", "Companies need to compete for talent; caps may push leaders elsewhere."),
      m("Social media companies should remove false information.", "Platforms that spread false claims at scale should take responsibility.", "Deciding what is false gives private companies too much power over speech."),
      m("Governments should be allowed to monitor online activity to prevent crime.", "Monitoring can stop serious crimes before they happen.", "Mass monitoring threatens privacy and can be abused."),
      m("Planned obsolescence should be illegal.", "Products built to fail waste money and create e-waste.", "Defining planned failure is difficult; cheaper short-life products have buyers."),
      m("Open-source AI does more good than harm.", "Open models let researchers check for flaws and spread the benefits widely.", "Anyone, including people with harmful goals, can use powerful tools."),
      m("Schools should stop grouping students by ability.", "Mixed classes avoid labelling students and raise expectations for everyone.", "Grouping lets teachers match the pace to what each student needs."),
      m("Governments should prioritize future generations over current voters.", "Today's choices on climate and debt shape the world children will inherit.", "Governments must first answer to the people alive and voting now."),
      m("Self-driving cars should be programmed to protect pedestrians over passengers.", "Pedestrians did not choose the risk of riding in the car.", "Few people would buy a car designed to sacrifice them."),
    ],
  },
];
const debateSections = DEBATE.map((level, l) => ({
  title: `${level.title} · ${level.grades}`,
  note: level.note,
  items: level.motions.map((x, i) => ({ id: `l${l + 1}-${i + 1}`, text: x.motion, label: `${level.title} · ${level.grades}`, pro: x.pro, con: x.con })),
}));

const packs = [
  {
    id: "question-of-the-day",
    title: "Question of the Day — 180 Days for the School Year",
    short: "Question of the Day · 180 days",
    tagline: "A ready-made bell-ringer for every school day, grouped by week.",
    color: "#E0306A",
    intro: [
      "One question per school day: 36 weeks × 5 days.",
      "Each weekday has a theme: Community Monday, Curious Tuesday, Growth Wednesday, Reflection Thursday, Fun Friday.",
      "Every slide shows a follow-up question for a second round of answers.",
      "Levels rotate each week: All grades, Grades 6+, Grades 9+.",
    ],
    teacher: [
      "Put the slide up as students arrive. Give 1 minute of quiet thinking or writing.",
      "Invite 3–5 answers, then ask the follow-up on the slide.",
      "Students can always pass. Thank answers rather than judging them.",
      "Teaching younger students? Use the All grades weeks and replay them later in the year.",
    ],
    sections: weeks,
  },
  {
    id: "debate",
    title: "Debate Topics Classroom Pack",
    short: "Debate Topics · 60 motions",
    tagline: "60 classroom-safe motions in three levels, each with a starting point for both sides.",
    color: "#0B8A93",
    intro: [
      "60 motions: Starter (grades 6–8), Core (grades 9–12) and Advanced (grades 11–12, debate club).",
      "Each motion has a starting point for the proposition (for) and the opposition (against).",
      "The prompts are where students start. Their own reasons and evidence come next.",
    ],
    teacher: [
      "20-minute format: 5 min prep → 2 min opening each side → 1 min rebuttal each → 3 min questions from the class → 1 min closing each → vote.",
      "Assign sides at random so students practise arguing a view they do not hold.",
      "Ask each side to explain the other side's best argument before rebutting it.",
      "Score on reasoning, evidence, rebuttal and delivery, not on which side wins.",
    ],
    sections: debateSections,
  },
  {
    id: "speech",
    title: "Speech & Impromptu Topics Pack",
    short: "Speech & Impromptu · 100+ topics",
    tagline: "Over 100 impromptu speech topics, each with a timing rule.",
    color: "#D9730D",
    intro: [
      "Warm-up topics: 30 seconds to think, 30 seconds to 1 minute to speak.",
      "Story topics: 1 minute to think, 1–2 minutes to speak.",
      "Argue topics: 1 minute to think, 2–3 minutes to speak.",
      "Timing cards: green at the minimum time, yellow at the midpoint, red at the maximum.",
    ],
    teacher: [
      "Structure for every speech (PREP): Point → Reason → Example → Point again.",
      "Start the year with Warm-up topics and move on to Argue topics once students are confident.",
      "Use the presenter-mode timer, or assign a student timekeeper with green, yellow and red cards.",
      "Give one 'glow' (something that worked) and one 'grow' (something to try next time) after each speech.",
    ],
    timing: TIMING,
    sections: speechSections,
  },
];

for (const p of packs) p.count = p.sections.reduce((n, s) => n + s.items.length, 0);
const ids = new Set();
for (const p of packs) for (const s of p.sections) for (const it of s.items) {
  const key = `${p.id}:${it.id}`;
  if (ids.has(key)) throw new Error(`Duplicate ${key}`);
  ids.add(key);
}
writeFileSync(resolve(root, "src/data/classroomPacks.json"), JSON.stringify({ version: 1, packs }, null, 1) + "\n");
console.log(packs.map((p) => `${p.id}: ${p.count}`).join("\n"));
