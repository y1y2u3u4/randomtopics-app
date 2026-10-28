// Wheel template pages: one real URL per search phrasing, each with a preloaded wheel.
// Rendered by src/components/generators/WheelTemplatePage.tsx.

export interface WheelTemplate {
  slug: string;
  /** Analytics prefix: fires {pageId}_use / {pageId}_share. */
  pageId: string;
  title: string;
  description: string;
  /** H1 in two parts (second part gets the gradient). */
  heading: [string, string];
  name: string;
  /** One line under the H1. */
  intro: string;
  /** 40-80 word direct answer ("In short"). */
  inShort: string;
  preset: string;
  removeDefault?: boolean;
  keywords: string[];
  emoji: string;
  /** Card text in the template library. */
  blurb: string;
  howTo: string[];
  uses: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  related: { href: string; label: string }[];
  ogLine: string;
  ogChips: [string, string, string];
  ogPaper: string[];
  /** Optional closing paragraph with extra context. */
  more?: string;
}

const NAMES12 = "Alex\nBlake\nCasey\nDana\nEllis\nFinn\nGray\nHarper\nIndy\nJules\nKai\nLane";

export const WHEEL_TEMPLATES: WheelTemplate[] = [
  {
    slug: "food-wheel",
    pageId: "food_wheel",
    title: "Food Wheel — Spin to Pick What to Eat Tonight",
    description:
      "Can't decide what to eat? Spin the food wheel for a dinner idea. Edit the foods, add your favourite takeaways, give some dishes better odds and share the wheel. Free, no signup.",
    heading: ["Food", "Wheel"],
    name: "Food Wheel",
    intro: "Spin to decide what to eat. Swap in your own dishes, takeaways or cuisines.",
    inShort:
      "Press Spin and the food wheel picks a meal at random from the 12 dishes on it. Replace them with what is actually in your kitchen or on your delivery app, give favourites extra weight, and tick remove the winner to rule out what you already ate. Free, no signup, and your list stays in your browser.",
    preset: "Pizza\nTacos\nSushi\nBurgers\nPasta\nCurry\nRamen\nSalad\nStir fry\nBBQ\nSandwiches\nDumplings",
    keywords: ["food wheel", "what to eat wheel", "dinner wheel", "what should i eat wheel", "food picker wheel", "random food wheel", "lunch wheel"],
    emoji: "🍜",
    blurb: "What to eat tonight: dinner, lunch, takeaway",
    howTo: [
      "Look at the 12 starter dishes on the wheel and delete any you don't want. Type your own, one per line.",
      "Press Spin the wheel (or Ctrl+Enter). The wheel lands on a meal.",
      "Not feeling it? Tick Remove the winner and spin again to rule that dish out for tonight.",
      "Want it to lean toward favourites? Switch on weights and give the dishes you love a higher number.",
      "Press Copy link to this wheel to send the same list to whoever is eating with you.",
    ],
    uses: [
      { title: "Dinner at home", text: "List what you can actually cook from the fridge, so any result is a meal you can make in 30 minutes." },
      { title: "Takeaway and delivery", text: "Put your usual restaurants on the wheel. The wheel decides, so nobody has to argue about it." },
      { title: "Date night or group meals", text: "Add cuisines instead of dishes (Thai, Italian, Mexican, Korean) and then pick the restaurant second." },
      { title: "Meal planning", text: "Tick Remove the winner and spin seven times to fill a week of dinners without repeats." },
    ],
    faq: [
      { question: "What should I eat today?", answer: "Spin the wheel above. It starts with 12 common dinners, and the result is a random draw where every dish has the same chance. If the answer disappoints you, that tells you what you actually wanted." },
      { question: "Can I put my own foods on the wheel?", answer: "Yes. Edit the box next to the wheel, one dish per line, or import a TXT or CSV file. The wheel redraws as you type." },
      { question: "How do I stop it picking the same food again?", answer: "Tick Remove the winner after each spin. Every result leaves the wheel until you press Reset." },
      { question: "Can I make pizza more likely than salad?", answer: "Turn on weights and give pizza a higher number. A dish with weight 3 has three times the chance of one with weight 1." },
      { question: "Is this different from the random food generator?", answer: "The random food generator suggests dishes from our own database with cuisine filters. This wheel only uses the list you give it, so it suits real choices from your own kitchen or takeaway app." },
    ],
    related: [
      { href: "/random-food-generator", label: "Random food generator" },
      { href: "/decision-maker", label: "Decision maker" },
      { href: "/picker-wheel", label: "Picker wheel" },
      { href: "/yes-or-no-wheel", label: "Yes or no wheel" },
    ],
    ogLine: "Spin to decide what to eat tonight",
    ogChips: ["12 starter dishes", "Your own list", "Weights and no repeats"],
    ogPaper: ["Pizza", "Tacos", "✓ <b>Ramen</b>", "Curry", "Dumplings"],
  },
  {
    slug: "name-wheel",
    pageId: "name_wheel",
    title: "Name Wheel — Random Name Spinner for Any List",
    description:
      "A name wheel that picks a random name from your list. Paste names or import a CSV, spin, remove winners after each spin and share the wheel with a link. Free, no signup, nothing uploaded.",
    heading: ["Name", "Wheel"],
    name: "Name Wheel",
    intro: "Paste your names, spin the name wheel and let chance pick one.",
    inShort:
      "Paste or import a list of names, press Spin and the name wheel lands on one at random, with the same chance for every name unless you set weights. Remove winners as you go to pick a whole order, check the spin history, and copy a link that reopens the same wheel. Free, with nothing uploaded.",
    preset: NAMES12,
    keywords: ["name wheel", "random name wheel", "name spinner", "spin the wheel names", "name picker wheel", "name wheel generator"],
    emoji: "🏷️",
    blurb: "Pick a random name from any list",
    howTo: [
      "Replace the sample names with yours: type one per line, paste from a spreadsheet column, or import a CSV or TXT file.",
      "Check the slices on the wheel. Typos create separate entries, so fix them first.",
      "Press Spin the wheel. The winner is shown in large type under the wheel.",
      "Tick Remove the winner after each spin to draw everyone once, or leave it off so names can come up again.",
      "Press Copy link to this wheel to share the exact list, with any weights you set.",
    ],
    uses: [
      { title: "Meetings and stand-ups", text: "Spin to decide who goes first, who takes notes or who presents next." },
      { title: "Teams and friends", text: "Chores, who pays, who drives: put the names in and let the wheel settle it." },
      { title: "Streams and giveaways", text: "Paste entrants, spin on screen, then share the link so people can see the list." },
      { title: "Shortlists", text: "Narrowing a list of baby names or pet names? Spin repeatedly with removal on to rank your top picks." },
    ],
    faq: [
      { question: "How do I make a name wheel?", answer: "Type or paste your names in the box, one per line. They appear on the wheel straight away, and you can import a CSV or TXT file for long lists." },
      { question: "Is the name wheel really random?", answer: "Yes. The winner is chosen first with your device's secure random number generator and the wheel is animated to land on it, so length and position of a name make no difference." },
      { question: "Can I give one name better odds?", answer: "Yes, with weights: switch them on and raise the number next to a name. You can also type a name twice." },
      { question: "Can I share my name wheel with someone?", answer: "Press Copy link to this wheel. The names (and weights) are packed into the link itself, so nothing is stored on a server." },
      { question: "What is the difference from the wheel of names page?", answer: "Same engine. The Wheel of Names page is the plain version; this page starts with a ready sample list and the extra options (import, weights, history) switched on." },
    ],
    related: [
      { href: "/wheel-of-names", label: "Wheel of names" },
      { href: "/random-name-picker", label: "Random name picker" },
      { href: "/raffle-wheel", label: "Raffle wheel" },
      { href: "/random-team-generator", label: "Random team generator" },
    ],
    ogLine: "Paste names, spin, share the link",
    ogChips: ["Paste or import CSV", "Weights", "Spin history"],
    ogPaper: ["Alex", "Blake", "✓ <b>Casey</b>", "Dana", "Ellis"],
  },
  {
    slug: "spin-the-wheel-custom",
    pageId: "spin_the_wheel_custom",
    title: "Spin the Wheel Custom — Make Your Own Wheel Online",
    description:
      "Make a custom spin the wheel in seconds: type your own entries, import a CSV, set weights, remove winners and share the wheel by link. Free, no signup, no app.",
    heading: ["Custom Spin", "the Wheel"],
    name: "Spin the Wheel Custom",
    intro: "Build your own wheel: your entries, your odds, your rules.",
    inShort:
      "Type or import your own entries, press Spin and the custom wheel picks one. You can set a different weight for each entry, remove winners after each spin, keep a spin history and copy a link that reopens your wheel anywhere. Free, no signup, and nothing leaves your browser.",
    preset: "Movie night\nBoard games\nGo for a walk\nBake cookies\nKaraoke\nPicnic\nVideo call a friend\nCook something new",
    keywords: ["spin the wheel custom", "custom spin the wheel", "make your own wheel", "custom wheel", "create a spinning wheel", "custom wheel spinner"],
    emoji: "🎛️",
    blurb: "Your own entries, weights and rules",
    howTo: [
      "Clear the sample entries (press Clear) or edit them. One entry per line.",
      "Optional: import a CSV or TXT file. The first column is the entry, the second can be a weight.",
      "Optional: switch on weights and give entries a number from 1 to 100. Slice width follows the weight.",
      "Press Spin the wheel or Ctrl+Enter. The result and a spin count appear below.",
      "Copy the link to save or share the wheel. Saved lists keep your wheels in this browser.",
    ],
    uses: [
      { title: "Games and challenges", text: "Truth or dare forfeits, party game rounds or workout moves: any list can be a wheel." },
      { title: "Prizes with different odds", text: "Weight the grand prize low and the small prizes high, then show the wheel on screen." },
      { title: "Decisions", text: "Weekend plans, gifts, places to travel. Remove winners to rank the whole list." },
      { title: "Classroom review", text: "Put vocabulary or review topics on the wheel and spin for the next question." },
    ],
    faq: [
      { question: "How do I make a custom spin the wheel?", answer: "Type your entries into the box beside the wheel, one per line. The wheel changes as you type. Press Spin when you are ready." },
      { question: "Can I save a custom wheel?", answer: "Yes. Name the list and press Save list to keep it in this browser, or press Copy link to this wheel to save the link anywhere." },
      { question: "Can I upload a file?", answer: "Yes. Import a CSV or TXT file with one entry per row. It is read inside your browser and never uploaded." },
      { question: "How do weights work?", answer: "Each entry has a number from 1 to 100. An entry with weight 4 gets a slice four times as wide as an entry with weight 1, and four times the chance of winning." },
      { question: "Is there a limit on entries?", answer: "Up to 200 entries. Past about 30 the slice labels are hidden so the wheel stays readable, but every entry is in the draw." },
      { question: "Can I use it on my phone?", answer: "Yes. It works on phones and tablets, and with reduced motion enabled the wheel skips the long animation." },
    ],
    related: [
      { href: "/spin-the-wheel", label: "Spin the wheel (topics)" },
      { href: "/picker-wheel", label: "Picker wheel" },
      { href: "/wheel-of-names", label: "Wheel of names" },
      { href: "/decision-maker", label: "Decision maker" },
    ],
    ogLine: "Your entries, your odds, your wheel",
    ogChips: ["Import CSV or TXT", "Per-entry weights", "Share by link"],
    ogPaper: ["Movie night", "Board games", "✓ <b>Karaoke</b>", "Picnic", "Walk"],
  },
  {
    slug: "random-wheel",
    pageId: "random_wheel",
    title: "Random Wheel — Spin a Wheel for a Random Pick",
    description:
      "A random wheel for numbers, names or choices. Press spin, get a fair random result, then edit the wheel to anything you like. Free, no signup, shareable by link.",
    heading: ["Random", "Wheel"],
    name: "Random Wheel",
    intro: "Spin a random wheel. Numbers to start, any list you like next.",
    inShort:
      "The random wheel starts with the numbers 1 to 12. Press Spin and it lands on one, with the same chance for each. Replace the numbers with names, choices or anything else you want, set weights if some should come up more, and copy a link to share. Free, no signup, nothing uploaded.",
    preset: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12",
    keywords: ["random wheel", "random wheel spinner", "random wheel picker", "random number wheel", "wheel random", "random spinner wheel"],
    emoji: "🎲",
    blurb: "Numbers or anything: a fair random spin",
    howTo: [
      "Press Spin the wheel to get a random number from 1 to 12.",
      "To change the range, edit the list: delete numbers or type more. The quick lists offer 1 to 10 in one click.",
      "To use words instead of numbers, replace the list with your own entries.",
      "Turn on Remove the winner after each spin to draw numbers without repeats, such as for bingo-style calls.",
    ],
    uses: [
      { title: "Random numbers with a show", text: "Use it to choose a number between 1 and 12, a seat, a question number or a lottery-style ball." },
      { title: "Turn order", text: "Number the players, spin with removal on and the order the numbers come out is the turn order." },
      { title: "Games", text: "Replace the numbers with forfeits, categories or letters for party games." },
    ],
    faq: [
      { question: "What is a random wheel?", answer: "A wheel divided into slices where a random draw decides which slice wins. Here the draw happens first with a secure random generator, then the wheel animates to the winner." },
      { question: "Is a random wheel fair?", answer: "Yes. Every slice has the same chance unless you turn on weights yourself." },
      { question: "How do I change the numbers?", answer: "Edit the list next to the wheel. Type one entry per line, or press the 1 to 10 quick list." },
      { question: "Can I get a random number between 1 and 100?", answer: "Our number randomizer handles ranges up to millions. On the wheel, import a list of numbers, though more than about 30 slices hide their labels." },
      { question: "Can I draw without repeats?", answer: "Yes. Tick Remove the winner after each spin and each result leaves the wheel." },
    ],
    related: [
      { href: "/number-randomizer", label: "Number randomizer" },
      { href: "/dice-roller", label: "Dice roller" },
      { href: "/picker-wheel", label: "Picker wheel" },
      { href: "/spin-the-wheel-custom", label: "Custom wheel" },
    ],
    ogLine: "A fair random spin: numbers or anything",
    ogChips: ["1 to 12 to start", "Edit to any list", "No repeats option"],
    ogPaper: ["3", "7", "✓ <b>11</b>", "4", "9"],
  },
  {
    slug: "classroom-name-picker-wheel",
    pageId: "classroom_name_picker_wheel",
    title: "Classroom Name Picker Wheel — Call on Students at Random",
    description:
      "A name picker wheel for the classroom. Paste your class list, spin to call on a student, remove names so everyone gets a turn, and keep your roll saved in your browser. Free for teachers.",
    heading: ["Classroom Name", "Picker Wheel"],
    name: "Classroom Name Picker Wheel",
    intro: "Paste your class list and spin to call on a student, one turn each.",
    inShort:
      "Paste your class list, press Spin and the wheel picks a student at random. Remove the winner is on by default, so everyone gets a turn before anyone is called twice. Save the roll for each class in your browser, import it from a CSV, and use fair random selection to avoid accusations of favourites.",
    preset: "Student 1\nStudent 2\nStudent 3\nStudent 4\nStudent 5\nStudent 6\nStudent 7\nStudent 8\nStudent 9\nStudent 10",
    removeDefault: true,
    keywords: ["classroom name picker wheel", "student name picker wheel", "class roll call wheel", "random student picker wheel", "teacher name wheel", "classroom wheel"],
    emoji: "🏫",
    blurb: "Call on students fairly, one turn each",
    howTo: [
      "Replace Student 1 to 10 with your class list: paste a column from your roster, or import a CSV or TXT file.",
      "Check that Remove the winner after each spin is ticked (it is by default).",
      "Show the wheel on the board and press Spin the wheel. Call on the student whose name appears.",
      "When the wheel is empty or you want a new round, press Reset or load the saved list again.",
      "Save each class under its own name (Period 2, Year 5B). Lists stay in this browser, so use first names or initials.",
    ],
    uses: [
      { title: "Cold calling", text: "Everyone gets asked once before anyone is asked twice, so the wheel is fair and quick." },
      { title: "Presentation order", text: "Spin with removal on until the wheel is empty. The order the names came out is the running order." },
      { title: "Helpers and jobs", text: "Spin for line leader, materials monitor or who answers the next question." },
      { title: "Group work", text: "Spin repeatedly to build groups by hand, or use the random team generator to split a whole class at once." },
    ],
    faq: [
      { question: "How do I pick a random student in class?", answer: "Paste the class list into the box, press Spin and call on the student the wheel lands on. With Remove the winner on, each student is picked once per round." },
      { question: "Are student names stored anywhere?", answer: "No. Names stay in your browser. Saved lists use your browser's local storage on this device. There is no account and nothing is uploaded. Using first names or initials is a good habit." },
      { question: "How do I make sure everyone gets a turn?", answer: "Leave Remove the winner after each spin ticked. Each picked student leaves the wheel until you press Reset." },
      { question: "Can I import my roster from a spreadsheet?", answer: "Yes. Export the name column as CSV or TXT and use Import CSV or TXT. The file is read in your browser and not uploaded." },
      { question: "Can I spin on a projector or smartboard?", answer: "Yes. The wheel and winner are large and readable on a projector, and reduced-motion settings are respected." },
    ],
    related: [
      { href: "/random-name-picker", label: "Random name picker" },
      { href: "/random-team-generator", label: "Random team generator" },
      { href: "/wheel-of-names", label: "Wheel of names" },
      { href: "/question-of-the-day-for-students", label: "Question of the day for students" },
    ],
    ogLine: "Call on students fairly, one turn each",
    ogChips: ["No repeats by default", "Import a class roll", "Saved in your browser"],
    ogPaper: ["Student 1", "Student 2", "✓ <b>Student 3</b>", "Student 4", "Student 5"],
  },
  {
    slug: "raffle-wheel",
    pageId: "raffle_wheel",
    title: "Raffle Wheel — Pick Giveaway Winners with a Spin",
    description:
      "A raffle wheel for giveaways and prize draws. Paste your entrants, spin for each prize, remove winners so nobody wins twice, and share the entry list by link. Free, no signup.",
    heading: ["Raffle", "Wheel"],
    name: "Raffle Wheel",
    intro: "Paste your entrants, then spin once per prize.",
    inShort:
      "Paste your raffle entries, one per line, and press Spin. The wheel picks a winner at random and, by default, removes them so nobody wins two prizes. Give extra tickets with weights, import entries from a CSV and share a link to the list so entrants can check it. Free, no signup, nothing uploaded.",
    preset: "Ticket 101\nTicket 102\nTicket 103\nTicket 104\nTicket 105\nTicket 106\nTicket 107\nTicket 108\nTicket 109\nTicket 110",
    removeDefault: true,
    keywords: ["raffle wheel", "giveaway wheel", "raffle spinner", "prize wheel", "random winner picker wheel", "giveaway winner picker"],
    emoji: "🎟️",
    blurb: "Draw giveaway and raffle winners on screen",
    howTo: [
      "Replace the sample tickets with your entrants: names, ticket numbers or social handles, one per line.",
      "Want to give someone extra tickets? Switch on weights, or import a CSV whose second column is the ticket count.",
      "Press Spin the wheel for the first prize. The winner is announced in large type.",
      "Winners are removed automatically, so spin again for each remaining prize.",
      "Copy the link to the wheel and post it, so entrants can open the same list and see their name is on it.",
    ],
    uses: [
      { title: "Giveaways on stream", text: "Share your screen, spin live and let the audience see every entry on the wheel." },
      { title: "Office and school raffles", text: "Number tickets or list names, then spin for each prize in turn." },
      { title: "Charity draws", text: "Use ticket-count weights so a donor with 5 tickets has 5 times the chance of someone with 1." },
      { title: "Prize order", text: "Spin until the wheel is empty to create a full ranking of winners, first prize to last." },
    ],
    faq: [
      { question: "How do I pick a raffle winner online?", answer: "Paste the entries into the box, one per line, and press Spin. The wheel picks a random winner and shows the name under the wheel." },
      { question: "Is the raffle wheel fair?", answer: "Yes. The winner is chosen with your device's secure random generator before the wheel starts turning, so every ticket has the same chance. Weights change that only if you set them." },
      { question: "How do I stop the same person winning twice?", answer: "Remove the winner after each spin is ticked by default. Untick it if one person may win several prizes." },
      { question: "Can I give people multiple tickets?", answer: "Yes. Either type the name once per ticket, or turn on weights and set the ticket count." },
      { question: "Can entrants check the list?", answer: "Press Copy link to this wheel. The list is packed into the link, so anyone who opens it sees the same entries." },
      { question: "Are there legal rules for giveaways?", answer: "Rules differ by country and platform, and some places treat paid raffles as gambling. Read your local rules and the platform's promotion terms before you run one." },
    ],
    related: [
      { href: "/wheel-of-names", label: "Wheel of names" },
      { href: "/random-name-picker", label: "Random name picker" },
      { href: "/name-wheel", label: "Name wheel" },
      { href: "/number-randomizer", label: "Number randomizer" },
    ],
    ogLine: "Draw giveaway winners, one prize per spin",
    ogChips: ["No repeat winners", "Extra tickets via weights", "Shareable entry list"],
    ogPaper: ["Ticket 101", "Ticket 102", "✓ <b>Ticket 107</b>", "Ticket 104", "Ticket 109"],
  },
];

/** The full wheel family, for the template library and cross-links. */
export const WHEEL_FAMILY: { href: string; label: string; emoji: string; blurb: string }[] = [
  { href: "/wheel-of-names", label: "Wheel of Names", emoji: "🎡", blurb: "Spin a wheel of your own names" },
  { href: "/picker-wheel", label: "Picker Wheel", emoji: "🎯", blurb: "Names or choices, saved lists" },
  { href: "/yes-or-no-wheel", label: "Yes or No Wheel", emoji: "✅", blurb: "Yes, no or maybe, with a tally" },
  { href: "/random-name-picker", label: "Random Name Picker", emoji: "🎩", blurb: "Draw names from a hat" },
  ...WHEEL_TEMPLATES.map((t) => ({ href: `/${t.slug}`, label: t.name, emoji: t.emoji, blurb: t.blurb })),
  { href: "/decision-maker", label: "Decision Maker", emoji: "🧭", blurb: "Choose between 3 or more options" },
];
