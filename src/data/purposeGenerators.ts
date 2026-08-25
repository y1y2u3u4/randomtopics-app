export interface PurposePrompt {
  text: string;
  category: string;
  level: string;
  angle: string;
}

export interface PurposeGeneratorConfig {
  slug: string;
  name: string;
  emoji: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  actionLabel: string;
  resultLabel: string;
  applicationCategory: string;
  keywords: string[];
  prompts: PurposePrompt[];
  intro: string;
  uses: { heading: string; description: string }[];
  steps: string[];
  faq: { question: string; answer: string }[];
  relatedLinks: { label: string; href: string; emoji: string }[];
}

export const PURPOSE_GENERATORS = {
  learning: {
    slug: "random-learning-topic-generator",
    name: "Random Learning Topic Generator",
    emoji: "🧠",
    title: "Random Learning Topic Generator",
    metaTitle: "Random Learning Topic Generator — Learn Something New",
    metaDescription:
      "Generate a random topic to learn about by subject and difficulty. Get a focused learning question plus a practical starting angle. Free, instant, no signup.",
    subtitle:
      "Pick a subject and difficulty, then get a focused topic to explore — with a starting question that turns curiosity into a short learning session.",
    actionLabel: "Give Me a Topic to Learn",
    resultLabel: "Your learning topic",
    applicationCategory: "EducationApplication",
    keywords: [
      "random learning topic generator",
      "random topic to learn about generator",
      "random topic to study",
      "learn something new generator",
      "random study topic generator",
    ],
    prompts: [
      { text: "How do vaccines train the immune system?", category: "Science", level: "Beginner", angle: "Explain the roles of antigens, antibodies, and immune memory with one everyday analogy." },
      { text: "Why does time move differently near massive objects?", category: "Science", level: "Advanced", angle: "Start with general relativity, then compare clocks on Earth and GPS satellites." },
      { text: "How do coral reefs support ocean life?", category: "Science", level: "Beginner", angle: "Map the food, shelter, and coastal-protection services of one reef ecosystem." },
      { text: "What makes CRISPR able to edit genes?", category: "Science", level: "Intermediate", angle: "Trace how guide RNA and Cas enzymes find, cut, and repair a DNA sequence." },
      { text: "Why did cities first develop around rivers?", category: "History", level: "Beginner", angle: "Compare water, trade, farming, and defense in two early civilizations." },
      { text: "How did the printing press change who held power?", category: "History", level: "Intermediate", angle: "Follow one idea from cheaper books to religious, scientific, or political change." },
      { text: "What caused the Bronze Age collapse?", category: "History", level: "Advanced", angle: "Evaluate invasion, drought, trade failure, and political instability as interacting causes." },
      { text: "How did standardized time zones become necessary?", category: "History", level: "Beginner", angle: "Connect local solar time to railways, schedules, and international coordination." },
      { text: "Why do people follow social norms nobody wrote down?", category: "Society", level: "Intermediate", angle: "Use one familiar norm to examine rewards, punishment, imitation, and belonging." },
      { text: "How does a city decide where public money goes?", category: "Society", level: "Beginner", angle: "Follow a budget from taxes through competing priorities to a final public service." },
      { text: "What makes misinformation spread faster than corrections?", category: "Society", level: "Advanced", angle: "Compare emotion, novelty, identity, algorithms, and the continued-influence effect." },
      { text: "Why do languages borrow words from one another?", category: "Society", level: "Beginner", angle: "Find five borrowed words and connect each to trade, migration, conquest, or culture." },
      { text: "How does compound interest grow money and debt?", category: "Practical Skills", level: "Beginner", angle: "Calculate a small example over five years and compare two interest rates." },
      { text: "How can you evaluate whether an online source is reliable?", category: "Practical Skills", level: "Beginner", angle: "Build a five-step check using authorship, evidence, date, motive, and corroboration." },
      { text: "What makes a habit easier to keep?", category: "Practical Skills", level: "Intermediate", angle: "Design one habit using cues, friction, rewards, and a realistic fallback version." },
      { text: "How do electricity prices change during the day?", category: "Practical Skills", level: "Advanced", angle: "Connect demand, generation costs, grids, storage, and time-of-use pricing." },
      { text: "How do recommendation algorithms predict what you will like?", category: "Technology", level: "Intermediate", angle: "Compare content-based and collaborative filtering with a movie example." },
      { text: "What happens when you type a web address and press Enter?", category: "Technology", level: "Beginner", angle: "Trace DNS, network requests, servers, and browser rendering in order." },
      { text: "How does public-key encryption protect a private message?", category: "Technology", level: "Advanced", angle: "Use locks as an analogy, then explain where the analogy stops working." },
      { text: "Why can an AI model sound confident and still be wrong?", category: "Technology", level: "Intermediate", angle: "Distinguish prediction from knowledge and identify three ways to verify an answer." },
      { text: "Why do some songs create tension before resolving?", category: "Arts & Culture", level: "Beginner", angle: "Listen for harmony, rhythm, repetition, and expectation in one familiar song." },
      { text: "How does a film director guide the viewer's attention?", category: "Arts & Culture", level: "Intermediate", angle: "Analyze framing, lighting, movement, sound, and editing in one scene." },
      { text: "Why do myths from distant cultures share similar patterns?", category: "Arts & Culture", level: "Advanced", angle: "Compare universal experience, cultural exchange, and archetype theories." },
      { text: "How does translation change a poem?", category: "Arts & Culture", level: "Intermediate", angle: "Compare two translations for meaning, rhythm, sound, and cultural context." },
    ],
    intro:
      "A useful random learning topic should be broad enough to spark curiosity but focused enough to explore in one sitting. This generator pairs every topic with a starting angle, so you can move from 'I want to learn something' to a concrete question without opening twenty unrelated tabs.",
    uses: [
      { heading: "Daily curiosity", description: "Spend 15 minutes following the starting angle and write down three facts plus one new question." },
      { heading: "Study breaks", description: "Switch subjects deliberately when your main course feels stale, while still practicing research and recall." },
      { heading: "Family or classroom learning", description: "Generate one topic for the group, let everyone investigate a different angle, then compare findings." },
    ],
    steps: ["Choose a subject or leave it on Any subject.", "Set the difficulty to match the time and background you have.", "Generate one, three, or five learning topics.", "Use the starting angle as your first search or note heading."],
    faq: [
      { question: "What is a random learning topic generator?", answer: "It is a tool that chooses a focused subject for you to explore and pairs it with a concrete starting question. The randomness removes the decision step while the filters keep the result useful." },
      { question: "How long should I spend learning each topic?", answer: "A beginner topic works well as a 10–20 minute curiosity session. Intermediate and advanced topics are better for 30–60 minutes or several sessions. Stop by writing a short summary from memory." },
      { question: "Can students use these as study topics?", answer: "Yes. Students can filter by subject and difficulty, then use the angle as a mini research task, presentation warm-up, or independent-learning prompt." },
      { question: "Are the generated topics fact-checked answers?", answer: "The topics are editor-written prompts, not completed answers. Verify what you learn with reliable primary or educational sources and compare more than one source for disputed claims." },
    ],
    relatedLinks: [
      { emoji: "🧪", label: "Random Subject Generator", href: "/random-subject-generator" },
      { emoji: "🔬", label: "Science Topics", href: "/categories/science" },
      { emoji: "📚", label: "Education Topics", href: "/categories/education" },
    ],
  },
  writing: {
    slug: "writing-topic-generator",
    name: "Writing Topic Generator",
    emoji: "✍️",
    title: "Writing Topic Generator",
    metaTitle: "Writing Topic Generator — Random Topics to Write About",
    metaDescription:
      "Generate random topics to write about for essays, journals, stories, and blogs. Filter by writing type and depth, then copy a focused angle. Free and instant.",
    subtitle:
      "Choose what you are writing, set the depth, and get a topic with a usable angle — for essays, journals, fiction, and blog posts.",
    actionLabel: "Generate Writing Topics",
    resultLabel: "Your writing topic",
    applicationCategory: "WritingApplication",
    keywords: ["writing topic generator", "random topics to write about", "random topic generator to write about", "give me a random topic to write about", "topic generator for writing"],
    prompts: [
      { text: "Should schools replace some exams with long-term projects?", category: "Essay", level: "Quick", angle: "Compare what each method measures, how fair it is, and how it changes student behavior." },
      { text: "Does convenience make modern life better or merely faster?", category: "Essay", level: "Deep", angle: "Define convenience, then weigh saved time against dependence, waste, and lost skills." },
      { text: "What responsibility do platforms have for addictive design?", category: "Essay", level: "Focused", angle: "Separate user choice from design incentives and propose a practical standard." },
      { text: "Should public transport be free in large cities?", category: "Essay", level: "Focused", angle: "Evaluate cost, access, congestion, emissions, and who benefits most." },
      { text: "When does protecting tradition prevent necessary change?", category: "Essay", level: "Deep", angle: "Use one tradition as a case study and distinguish identity from habit." },
      { text: "Is boredom a problem to solve or a useful mental state?", category: "Essay", level: "Quick", angle: "Contrast attention, creativity, restlessness, and constant digital stimulation." },
      { text: "A small choice I made that changed an ordinary day", category: "Journal", level: "Quick", angle: "Reconstruct the choice, the immediate consequence, and what you noticed afterward." },
      { text: "Something I have outgrown without realizing it", category: "Journal", level: "Focused", angle: "Describe the old pattern, the evidence of change, and what replaces it now." },
      { text: "The difference between the life I schedule and the life I value", category: "Journal", level: "Deep", angle: "Compare your calendar with your stated priorities and identify one mismatch." },
      { text: "A conversation I keep rehearsing but have not had", category: "Journal", level: "Focused", angle: "Write both sides, name what is at stake, and choose the smallest honest opening." },
      { text: "What 'enough' would look like in one part of my life", category: "Journal", level: "Deep", angle: "Pick time, money, achievement, or attention and define a concrete stopping point." },
      { text: "Three tiny details I want to remember from this week", category: "Journal", level: "Quick", angle: "Capture one sensory detail, one person, and one moment that almost went unnoticed." },
      { text: "Every night, one window in the abandoned tower lights up", category: "Fiction", level: "Quick", angle: "Begin with the first person who decides to climb the tower." },
      { text: "A translator realizes the peace treaty says two different things", category: "Fiction", level: "Deep", angle: "Build the conflict around whether the mistake was accidental, deliberate, or prophetic." },
      { text: "A town votes to erase one shared memory", category: "Fiction", level: "Focused", angle: "Choose the memory, the reason for erasing it, and the person who refuses." },
      { text: "A courier must deliver a package that whispers their name", category: "Fiction", level: "Quick", angle: "Set a rule for what happens if the package is opened before delivery." },
      { text: "People can rent a different personality for one day", category: "Fiction", level: "Deep", angle: "Follow someone who chooses a personality that does not want to leave." },
      { text: "The world's most accurate weather app predicts emotions instead", category: "Fiction", level: "Focused", angle: "Show how one forecast changes a relationship or public event." },
      { text: "What beginners misunderstand about learning a difficult skill", category: "Blog", level: "Focused", angle: "Use one skill to turn three common mistakes into practical advice." },
      { text: "A practical guide to making a recurring task less annoying", category: "Blog", level: "Quick", angle: "Break the task into friction points and test one small improvement for each." },
      { text: "What I changed my mind about after trying it for 30 days", category: "Blog", level: "Focused", angle: "State the original belief, the experiment, the evidence, and the revised conclusion." },
      { text: "The hidden tradeoff inside a popular productivity tip", category: "Blog", level: "Deep", angle: "Identify who the advice helps, what it ignores, and when not to use it." },
      { text: "How to compare two options without pretending there is one winner", category: "Blog", level: "Deep", angle: "Build a decision matrix around different users, constraints, and priorities." },
      { text: "Five questions to ask before buying a tool or subscription", category: "Blog", level: "Quick", angle: "Focus on the problem, frequency, switching cost, alternatives, and exit plan." },
    ],
    intro:
      "This writing topic generator is organized by the actual thing you need to produce. Essay results suggest an argument, journal results invite reflection, fiction results add a story constraint, and blog results promise a useful reader outcome. Every result includes an angle so it can become a first paragraph or outline instead of another vague idea.",
    uses: [
      { heading: "Assignments and practice essays", description: "Generate a focused claim, then turn the angle into three body paragraphs and a counterargument." },
      { heading: "Journaling", description: "Choose Quick for a ten-minute entry or Deep when you want a question worth revisiting." },
      { heading: "Stories and content", description: "Use the angle as a constraint: it adds tension to fiction and a clear reader promise to blog posts." },
    ],
    steps: ["Choose Essay, Journal, Fiction, or Blog.", "Pick how quick or deep you want the topic to be.", "Generate up to five options and copy the strongest one.", "Turn the supplied angle into a thesis, scene, or outline."],
    faq: [
      { question: "How is this different from a writing prompt generator?", answer: "A prompt may tell you how to begin, while a topic names what the piece is about. This tool does both: it gives a focused topic and a suggested angle you can develop." },
      { question: "Can I use the topics for school essays?", answer: "Yes. Filter to Essay and choose a depth. Check the assignment rules, narrow the wording to your course, and support your final argument with credible sources." },
      { question: "What should I do after generating a topic?", answer: "Write one sentence that states your main idea, list three supporting points, then draft for ten minutes before judging the result. The supplied angle can become that initial outline." },
      { question: "Will the generator repeat topics?", answer: "Each click samples from the matching editor-written pool without duplicates inside the current result set. You can keep generating freely and copy any result you want to save." },
    ],
    relatedLinks: [
      { emoji: "📝", label: "Writing Prompt Hub", href: "/writing" },
      { emoji: "🎓", label: "Essay Topic Generator", href: "/essay-topic-generator" },
      { emoji: "📓", label: "Journal Prompts", href: "/journal-prompts" },
    ],
  },
  research: {
    slug: "research-topic-generator",
    name: "Research Topic Generator",
    emoji: "🔎",
    title: "Research Topic Generator",
    metaTitle: "Research Topic Generator — Random Research Ideas",
    metaDescription:
      "Generate focused research topic ideas by field and difficulty. Each result includes a researchable question and scope note for papers or projects. Free, no signup.",
    subtitle:
      "Generate a researchable question by field and difficulty, with a scope note that helps you turn the idea into a realistic paper or project.",
    actionLabel: "Generate Research Ideas",
    resultLabel: "Your research question",
    applicationCategory: "EducationApplication",
    keywords: ["research topic generator", "random topic generator for research", "random research topics", "research question generator", "research paper topic generator"],
    prompts: [
      { text: "How accurately can wearable devices detect changes in sleep quality?", category: "Science & Technology", level: "Beginner", angle: "Compare one consumer device with a sleep diary over a small, clearly defined sample." },
      { text: "How does generative AI change the time students spend on different writing stages?", category: "Science & Technology", level: "Intermediate", angle: "Measure planning, drafting, revising, and fact-checking separately rather than total time alone." },
      { text: "What makes heat-pump adoption differ between similar neighborhoods?", category: "Science & Technology", level: "Advanced", angle: "Control for income while comparing housing type, information, incentives, and installer access." },
      { text: "How do interface defaults affect privacy choices?", category: "Science & Technology", level: "Intermediate", angle: "Compare opt-in and opt-out designs with the same wording and number of steps." },
      { text: "Can low-cost air sensors identify school-day pollution patterns?", category: "Science & Technology", level: "Beginner", angle: "Track one pollutant at arrival, lunch, and dismissal across several days." },
      { text: "How do explanations change trust in automated decisions?", category: "Science & Technology", level: "Advanced", angle: "Compare simple, technical, and example-based explanations after identical outcomes." },
      { text: "How does remote work affect informal mentoring for early-career employees?", category: "Society & Work", level: "Intermediate", angle: "Compare frequency, accessibility, and usefulness of unplanned guidance across work arrangements." },
      { text: "What predicts whether residents participate in local public meetings?", category: "Society & Work", level: "Beginner", angle: "Examine timing, childcare, awareness, perceived influence, and online access in one community." },
      { text: "How do salary-transparency policies affect job-application behavior?", category: "Society & Work", level: "Advanced", angle: "Compare application volume and applicant mix before and after a policy change." },
      { text: "How do short-form videos shape perceptions of unfamiliar places?", category: "Society & Work", level: "Intermediate", angle: "Code recurring themes in a sample and compare them with longer-form travel information." },
      { text: "Which features make public spaces feel welcoming to teenagers?", category: "Society & Work", level: "Beginner", angle: "Combine observation with short interviews about seating, lighting, cost, rules, and transport." },
      { text: "How does algorithmic scheduling affect hourly workers' ability to plan?", category: "Society & Work", level: "Advanced", angle: "Measure notice time, schedule changes, income variation, and caregiving conflicts." },
      { text: "Do retrieval quizzes improve long-term recall more than rereading?", category: "Education", level: "Beginner", angle: "Teach the same short material to two groups and test again after a delay." },
      { text: "How does feedback timing affect revision quality?", category: "Education", level: "Intermediate", angle: "Compare immediate and delayed feedback using the same rubric and writing task." },
      { text: "What helps first-generation students use office hours?", category: "Education", level: "Advanced", angle: "Study awareness, belonging, scheduling, prior experience, and the effect of explicit invitations." },
      { text: "Does choice of example change how students understand a math concept?", category: "Education", level: "Intermediate", angle: "Hold the method constant while varying familiar, abstract, and real-world contexts." },
      { text: "How do classroom seating patterns affect who speaks?", category: "Education", level: "Beginner", angle: "Count participation across two seating arrangements while tracking group size and lesson type." },
      { text: "How does AI-assisted feedback affect students' ability to self-edit later?", category: "Education", level: "Advanced", angle: "Distinguish immediate text improvement from unaided performance on a later task." },
      { text: "Which messages best reduce contamination in recycling bins?", category: "Environment & Health", level: "Beginner", angle: "Test positive, corrective, and image-based signs at comparable collection points." },
      { text: "How does tree shade affect pedestrian route choice on hot days?", category: "Environment & Health", level: "Intermediate", angle: "Compare route observations with temperature, distance, and time-of-day data." },
      { text: "Who benefits most from urban low-emission zones?", category: "Environment & Health", level: "Advanced", angle: "Map air-quality, travel-time, cost, and displacement effects across neighborhoods." },
      { text: "Does visible calorie information change meal choice consistently?", category: "Environment & Health", level: "Intermediate", angle: "Compare stated intention with actual selection and account for price and hunger." },
      { text: "What prevents households from using food scraps before they spoil?", category: "Environment & Health", level: "Beginner", angle: "Interview about planning, storage, date labels, portions, and confidence in leftovers." },
      { text: "How do wildfire warnings influence evacuation timing?", category: "Environment & Health", level: "Advanced", angle: "Compare message source, specificity, prior experience, transport, and trust." },
    ],
    intro:
      "A strong research topic is not merely interesting: it names a relationship you can investigate within the time, data, and methods available. These prompts are written as questions and include a scope note, making them easier to turn into a paper proposal than broad subjects such as 'AI' or 'climate change.'",
    uses: [
      { heading: "Research papers", description: "Use the question as a starting hypothesis, then review recent literature before fixing your final wording." },
      { heading: "Class projects", description: "Choose Beginner for an observable local study or Intermediate for a project with comparison and controls." },
      { heading: "Thesis brainstorming", description: "Use Advanced prompts to identify interacting variables, then narrow the population, place, and period." },
    ],
    steps: ["Choose a field related to your course or available data.", "Select a difficulty that fits your method and deadline.", "Generate several questions and check which has accessible evidence.", "Narrow the population, place, period, and variables before committing."],
    faq: [
      { question: "What makes a good research topic?", answer: "It should be specific, answerable with evidence, connected to existing scholarship, and realistic for your time and access. A useful topic names a relationship or comparison rather than only a broad subject." },
      { question: "Can I use a generated question as my final title?", answer: "Treat it as a starting point. Search recent literature, confirm that evidence is available, and narrow the population, location, period, or variables before submitting a proposal." },
      { question: "What is the difference between Beginner and Advanced?", answer: "Beginner prompts can often be explored with observation, a small survey, or a simple comparison. Advanced prompts involve more variables, controls, longitudinal data, or difficult causal questions." },
      { question: "Does this generator provide sources?", answer: "No. It generates editor-written research questions and scope notes. Use your library databases, primary records, scholarly search tools, and your instructor's source requirements to build the evidence base." },
    ],
    relatedLinks: [
      { emoji: "🧠", label: "Learning Topic Generator", href: "/random-learning-topic-generator" },
      { emoji: "🧪", label: "Random Subject Generator", href: "/random-subject-generator" },
      { emoji: "🎓", label: "College Essay Topics", href: "/topics/random-essay-topics-for-college" },
    ],
  },
  presentation: {
    slug: "presentation-topic-generator",
    name: "Presentation Topic Generator",
    emoji: "📊",
    title: "Presentation Topic Generator",
    metaTitle: "Presentation Topic Generator — Random Presentation Ideas",
    metaDescription:
      "Generate presentation topic ideas by audience and difficulty. Each result includes a clear angle for school, work, science, or culture presentations. Free, no signup.",
    subtitle:
      "Pick an audience and difficulty, then get a presentation-ready idea with a clear angle you can turn into slides.",
    actionLabel: "Generate Presentation Ideas",
    resultLabel: "Your presentation idea",
    applicationCategory: "EducationApplication",
    keywords: ["presentation topic generator", "random topic generator for presentations", "random presentation topics", "presentation ideas generator", "random powerpoint topic generator"],
    prompts: [
      { text: "Why sleep is a learning tool, not lost study time", category: "School", level: "Easy", angle: "Use a three-slide structure: what sleep does, what lack of sleep changes, and one habit to try." },
      { text: "How a local place changed over the last fifty years", category: "School", level: "Moderate", angle: "Build a visual before-and-after story using maps, photos, interviews, or public records." },
      { text: "Should schools teach practical finance as a required subject?", category: "School", level: "Advanced", angle: "Present the need, competing curriculum priorities, evidence, and a realistic course outline." },
      { text: "The science behind one everyday illusion", category: "School", level: "Easy", angle: "Show the illusion first, collect guesses, then reveal the visual or cognitive mechanism." },
      { text: "How one invention changed an ordinary routine", category: "School", level: "Moderate", angle: "Trace the routine before, during adoption, and today, including one unexpected consequence." },
      { text: "What a historical decision can teach us about modern tradeoffs", category: "School", level: "Advanced", angle: "Set the context, compare available options, explain the decision, then assess it with hindsight." },
      { text: "A process at work that could lose one unnecessary step", category: "Work", level: "Easy", angle: "Show the current process, the friction, the proposed change, and one success measure." },
      { text: "What customer complaints reveal beyond the complaint itself", category: "Work", level: "Moderate", angle: "Group complaint themes and connect each to a root cause and prevention step." },
      { text: "When automation improves a workflow — and when it makes it brittle", category: "Work", level: "Advanced", angle: "Compare a stable repetitive task with an exception-heavy task and propose decision criteria." },
      { text: "Three lessons from a project that did not go as planned", category: "Work", level: "Easy", angle: "Use expectation, signal, response, and changed practice instead of assigning blame." },
      { text: "How to make a metric useful instead of merely visible", category: "Work", level: "Moderate", angle: "Connect a metric to a decision, owner, review rhythm, and potential gaming behavior." },
      { text: "The hidden cost of switching between tasks", category: "Work", level: "Advanced", angle: "Combine research, a day-in-the-life example, and a small team experiment." },
      { text: "Why the sky changes color at sunrise and sunset", category: "Science", level: "Easy", angle: "Use a simple light-scattering diagram and compare midday with a long path through the atmosphere." },
      { text: "How cities can stay cooler during heat waves", category: "Science", level: "Moderate", angle: "Compare trees, reflective roofs, shade, water, and building design with local examples." },
      { text: "What scientists can and cannot conclude from a correlation", category: "Science", level: "Advanced", angle: "Use a memorable correlation, identify confounders, and redesign the study for stronger inference." },
      { text: "How antibiotics work and why resistance spreads", category: "Science", level: "Easy", angle: "Separate bacteria from viruses, show selection pressure, and end with responsible-use actions." },
      { text: "How a battery stores and releases energy", category: "Science", level: "Moderate", angle: "Follow electrons and ions through charging and discharging using one labeled diagram." },
      { text: "What makes climate models useful despite uncertainty", category: "Science", level: "Advanced", angle: "Explain model testing, ranges, scenarios, and the difference between uncertainty and ignorance." },
      { text: "How a popular food traveled across cultures", category: "Culture", level: "Easy", angle: "Map ingredients, migration, adaptation, and the different meanings the dish holds today." },
      { text: "What a movie remake changes for a new audience", category: "Culture", level: "Moderate", angle: "Compare one scene's setting, character, conflict, and cultural assumptions across versions." },
      { text: "Who gets to decide what belongs in a museum?", category: "Culture", level: "Advanced", angle: "Frame ownership, preservation, access, colonial history, and repatriation through one object." },
      { text: "Why certain sounds become linked to places or generations", category: "Culture", level: "Easy", angle: "Use three audio examples to connect technology, memory, identity, and daily life." },
      { text: "How translation changes humor", category: "Culture", level: "Moderate", angle: "Compare wordplay, timing, cultural reference, and adaptation using two short examples." },
      { text: "How platforms influence which culture becomes visible", category: "Culture", level: "Advanced", angle: "Analyze recommendation incentives, creator strategy, language, and the tension between reach and flattening." },
    ],
    intro:
      "A presentation topic has to work aloud and on slides. Every idea here has a visual or argumentative angle, so you can build a beginning, middle, and end instead of filling slides with disconnected facts. Filter by audience to keep the examples and stakes appropriate.",
    uses: [
      { heading: "School presentations", description: "Choose Easy for a short informative talk or Advanced for a claim that needs sources and counterarguments." },
      { heading: "Work presentations", description: "Generate a problem worth solving, then organize the deck around evidence, options, recommendation, and next step." },
      { heading: "Speaking practice", description: "Create one slide per part of the supplied angle and rehearse the transitions with the speech timer." },
    ],
    steps: ["Choose the audience or subject area.", "Match the difficulty to your time, length, and research requirements.", "Generate a few ideas and select the one with the clearest audience benefit.", "Use the supplied angle as the first draft of your slide outline."],
    faq: [
      { question: "What makes a good presentation topic?", answer: "It should matter to the audience, fit the allotted time, support a clear takeaway, and offer evidence or visuals. The best topic is narrower than a broad subject and can be summarized in one sentence." },
      { question: "How do I turn a generated idea into slides?", answer: "Start with the angle supplied by the generator. Create an opening that states why it matters, two or three evidence sections, and a close with the main takeaway or action." },
      { question: "Can I use these ideas for a five-minute presentation?", answer: "Yes. Choose Easy, limit yourself to one central point and three supporting slides, then rehearse. Moderate and Advanced ideas work better for longer or research-based presentations." },
      { question: "Are the topics suitable for PowerPoint or Google Slides?", answer: "Yes. They are tool-independent and designed to have a visual or evidence-based structure. You can use them in PowerPoint, Google Slides, Keynote, Canva, or a spoken presentation without slides." },
    ],
    relatedLinks: [
      { emoji: "🎤", label: "Speech Generator & Timer", href: "/speech" },
      { emoji: "🏫", label: "75 School Presentation Topics", href: "/topics/presentation-ideas-for-school" },
      { emoji: "⏱️", label: "Impromptu Speech Topics", href: "/impromptu-speech-topics" },
    ],
  },
} satisfies Record<string, PurposeGeneratorConfig>;

export type PurposeGeneratorKey = keyof typeof PURPOSE_GENERATORS;
