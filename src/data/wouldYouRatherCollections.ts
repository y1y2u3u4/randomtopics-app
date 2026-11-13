// Holiday would-you-rather decks (2026-11-13). Written in-house.
// Each question is a full either-or dilemma, with no overlap with the main deck.
import type { QotdCategory } from "@/data/questionOfTheDay";

export interface ChoiceGroup { title: string; questions: string[] }
export interface WouldYouRatherCollection {
  slug: "thanksgiving" | "christmas";
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
  related: { href: string; label: string }[];
}

export const WOULD_YOU_RATHER_COLLECTIONS: WouldYouRatherCollection[] = [
  {
    slug: "thanksgiving",
    path: "/would-you-rather/thanksgiving",
    h1: "Thanksgiving Would You Rather Questions",
    title: "Thanksgiving Would You Rather: 48 Table Questions",
    description: "48 Thanksgiving would you rather questions for dinner, class and road trips: cooking, guests, leftovers and silly holiday trade-offs. Free generator and the full clean list.",
    keywords: ["thanksgiving would you rather", "thanksgiving would you rather questions", "would you rather thanksgiving", "funny thanksgiving questions", "thanksgiving dinner game"],
    lead: "These are Thanksgiving dilemmas, not quick food picks. Each one asks you to give something up, so the answer needs a reason. Use them when the plates are full and the easy this-or-that round is over. Every question is clean enough for family, a classroom the week of the holiday, and a work potluck.",
    emoji: "🦃",
    qotdCategory: "funny",
    related: [
      { href: "/this-or-that/thanksgiving", label: "Thanksgiving this or that" },
      { href: "/question-of-the-day/thanksgiving", label: "Thanksgiving question of the day" },
      { href: "/would-you-rather/christmas", label: "Christmas would you rather" },
    ],
    groups: [
      {
        title: "The feast",
        questions: [
          "Would you rather cook the whole Thanksgiving meal alone or wash every dish afterward?",
          "Would you rather eat only side dishes or only desserts for the whole day?",
          "Would you rather have perfect mashed potatoes and dry turkey or perfect turkey and lumpy potatoes?",
          "Would you rather the gravy run out halfway through dinner or the pie run out before your slice?",
          "Would you rather taste every dish while you cook or wait and be surprised at the table?",
          "Would you rather be in charge of the roast or in charge of the pies?",
          "Would you rather eat at 2 p.m. and snack all evening or eat at 8 p.m. after a long wait?",
          "Would you rather have a tiny perfect plate or a huge plate with a little of everything?",
          "Would you rather invent a new side everyone loves or perfect a family recipe that is already famous?",
          "Would you rather have the kitchen to yourself for an hour or three helpful people bumping elbows with you?",
          "Would you rather a guest who 'doesn't eat much' finish the stuffing or a guest who 'loves everything' skip your dish?",
          "Would you rather have leftovers for three days or none at all and a clean fridge?",
        ],
      },
      {
        title: "The gathering",
        questions: [
          "Would you rather host ten people in a small apartment or travel three hours to a big house?",
          "Would you rather sit next to the funniest relative or the quietest one?",
          "Would you rather give the toast or be in charge of the playlist?",
          "Would you rather everyone share one thing they are thankful for or nobody have to speak?",
          "Would you rather a surprise guest arrive with a great story or with an extra dessert?",
          "Would you rather play a board game the whole table argues about or watch a movie half the room has seen?",
          "Would you rather the game go to overtime during dinner or the parade get rained out?",
          "Would you rather be the person who remembers every name or the person who remembers every food allergy?",
          "Would you rather bring back the kids' table for one year or sit at the main table with no escape?",
          "Would you rather the power flicker for ten minutes or the wifi drop for the whole afternoon?",
          "Would you rather take the group photo in the rain or wait until everyone is flushed from the kitchen?",
          "Would you rather one person tell the same story every year or nobody remember the old stories?",
        ],
      },
      {
        title: "Travel and the long weekend",
        questions: [
          "Would you rather leave at dawn to beat traffic or leave at noon and sit in it?",
          "Would you rather sleep on a couch at the host's house or drive home the same night?",
          "Would you rather a storm cancel the trip or a sunny day mean you help with chores?",
          "Would you rather spend Friday in pajamas with leftovers or spend Friday in a packed store?",
          "Would you rather win the wishbone pull or get the last warm roll?",
          "Would you rather pack one dish that travels well or cook something impressive that might not survive the car?",
          "Would you rather the long weekend be completely unscheduled or planned down to the hour?",
          "Would you rather help a neighbor who ran out of an ingredient or be the neighbor who has to ask?",
          "Would you rather write thank-you notes to everyone who cooked or cook next year so they can rest?",
          "Would you rather a family recipe card go missing for a week or a family photo go missing for a week?",
          "Would you rather start a new tradition this year or protect an old one from being changed?",
          "Would you rather the group play touch football or the group take a walk to look at lights?",
        ],
      },
      {
        title: "Silly holiday trade-offs",
        questions: [
          "Would you rather a parade balloon get loose and follow your car or a turkey costume be the only outfit that fits?",
          "Would you rather your plate refill itself or your drink stay perfectly warm all meal?",
          "Would you rather speak only in food puns for the day or wear a giant turkey hat through the whole meal?",
          "Would you rather the potatoes be the only thing that turns out or the pie be the only thing that turns out?",
          "Would you rather find a wishbone in your slice of pie or a cranberry in your mashed potatoes?",
          "Would you rather pause time between dinner and dessert or skip the dishes with a snap of your fingers?",
          "Would you rather every guest bring the same salad or every guest bring a mystery dish with no label?",
          "Would you rather the dog steal one roll or the cat walk through the centerpiece?",
          "Would you rather nap through dessert or stay awake and miss the last play of the game?",
          "Would you rather your dish get a standing ovation or your joke get the biggest laugh of the night?",
          "Would you rather trade kitchens with a professional cook for one day or trade tables with a family that seats twenty?",
          "Would you rather Thanksgiving be a whole weekend of meals or one perfect hour at the table?",
        ],
      },
    ],
    howTo: [
      { name: "No neither", text: "Read the question and make everyone pick. 'Both' and 'neither' do not count. The interesting part is the reason, so ask why once." },
      { name: "Predict the cook", text: "Before the person who cooked answers, everyone else guesses their pick. A point for each correct guess, first to five wins." },
      { name: "One-minute defense", text: "Vote at the same time. The smaller side gets one minute to change one mind, then you vote again." },
    ],
    faq: [
      { question: "What are good Thanksgiving would you rather questions?", answer: "The best ones force a real trade-off about the day: cooking versus dishes, a huge crowd versus a long drive, leftovers versus an empty fridge. Food preferences alone are this or that. A dilemma is would you rather." },
      { question: "Can kids play these?", answer: "Most of them, yes. The feast and silly groups are fine for mixed ages. Skip the travel and hosting questions with younger kids if they would not make sense, or use would you rather for kids for a year-round classroom deck." },
      { question: "Are these safe for a work potluck?", answer: "Yes. They avoid pay, politics, religion and anything about who spent what. Hosting and cooking questions still work when coworkers do not share a family table." },
      { question: "How many should we ask at dinner?", answer: "Four to eight. Read one between courses so the meal keeps moving. If the table wants speed instead of reasons, switch to Thanksgiving this or that." },
    ],
  },
  {
    slug: "christmas",
    path: "/would-you-rather/christmas",
    h1: "Christmas Would You Rather Questions",
    title: "Christmas Would You Rather: 48 Holiday Questions",
    description: "48 Christmas would you rather questions for family, class and parties: gifts, trees, cookies, movies and North Pole trade-offs. Free generator and the full clean list.",
    keywords: ["christmas would you rather", "christmas would you rather questions", "would you rather christmas", "holiday would you rather", "funny christmas questions"],
    lead: "Christmas would you rather works because both options are appealing and both cost you something. These 48 questions cover gifts, the tree, food, movies and a few North Pole hypotheticals. They stay clear of prices, beliefs and anything explicit, so they work with kids, coworkers and a full living room.",
    emoji: "🎄",
    qotdCategory: "funny",
    related: [
      { href: "/this-or-that/christmas", label: "Christmas this or that" },
      { href: "/question-of-the-day/christmas", label: "Christmas question of the day" },
      { href: "/trivia-questions/christmas", label: "Christmas trivia" },
      { href: "/charades/christmas", label: "Christmas charades" },
      { href: "/would-you-rather/thanksgiving", label: "Thanksgiving would you rather" },
    ],
    groups: [
      {
        title: "Gifts",
        questions: [
          "Would you rather give the perfect gift and receive something ordinary or receive the perfect gift and give something ordinary?",
          "Would you rather open every gift in one minute or stretch one small gift across the whole morning?",
          "Would you rather know every gift in advance or be surprised and risk one miss?",
          "Would you rather wrap gifts all December or address cards all December?",
          "Would you rather find a gift you love a week early or wait and wonder until the morning?",
          "Would you rather your stocking be full of snacks or full of tiny useful things?",
          "Would you rather pass a mismatched gift on thoughtfully or donate it and buy nothing new?",
          "Would you rather be the Secret Santa who nails it or the person whose name gets the best gift?",
          "Would you rather a gift arrive a day late and be perfect or a day early and be just okay?",
          "Would you rather make one handmade gift for everyone or buy one excellent gift for one person?",
          "Would you rather the bow be bigger than the box or the box be beautiful with no bow?",
          "Would you rather write a long card or say a short speech when you hand the gift over?",
        ],
      },
      {
        title: "The house and the tree",
        questions: [
          "Would you rather have a real tree that drops needles or an artificial tree that takes an hour to assemble?",
          "Would you rather the lights work on the first try or the topper stay straight all month?",
          "Would you rather decorate only the tree or decorate every room and skip the tree?",
          "Would you rather a calm room with one wreath or a yard full of inflatable characters?",
          "Would you rather take the decorations down on New Year's Day or leave them up until you miss them?",
          "Would you rather the tree smell amazing and block the hallway or fit perfectly and smell like nothing?",
          "Would you rather hang only ornaments with a story or only ornaments that match?",
          "Would you rather a blackout kill the lights for an evening or a pet rearrange the bottom branches?",
          "Would you rather host and have a full house or visit and have nothing to clean?",
          "Would you rather wake up to surprise snow or to a clear day for traveling?",
          "Would you rather read by the tree with cocoa or walk the neighborhood to see lights?",
          "Would you rather your playlist be only carols or only music from holiday movies?",
        ],
      },
      {
        title: "Food, movies and the morning",
        questions: [
          "Would you rather bake cookies for the whole street or cook one impressive dinner for your household?",
          "Would you rather watch the same holiday movie every year or never repeat one?",
          "Would you rather Christmas breakfast be pancakes and chaos or a quiet casserole after presents?",
          "Would you rather eat dessert first or save it for after a long dinner?",
          "Would you rather a gingerbread house look perfect and taste plain or look lopsided and taste great?",
          "Would you rather a table so full people pass plates or a simple meal and a long conversation?",
          "Would you rather be in charge of the music or in charge of the movie?",
          "Would you rather hot cocoa with too many marshmallows or cider with a cinnamon stick?",
          "Would you rather a lights-out board-game night or a movie marathon with every seat taken?",
          "Would you rather cook from a family recipe with one secret step or follow a new recipe exactly?",
          "Would you rather the cookies brown a little and still get eaten or look perfect and stay in the tin?",
          "Would you rather spend the afternoon sledding or build a blanket fort for a movie?",
        ],
      },
      {
        title: "North Pole hypotheticals",
        questions: [
          "Would you rather spend a day organizing a toy workshop or scheduling reindeer flights?",
          "Would you rather deliver gifts silently in one night or have a whole week and be allowed to say hello?",
          "Would you rather your living room grow one size every December or your tree decorate itself?",
          "Would you rather talk with reindeer or understand what every string of lights is humming?",
          "Would you rather a snowman come to life for an hour or a nutcracker dance for an hour?",
          "Would you rather find a note from your future self under the tree or a photo from a Christmas you had forgotten?",
          "Would you rather the wrapping paper recycle itself or the dishes wash themselves after dinner?",
          "Would you rather wear matching pajamas all day or one ridiculous sweater you cannot take off until midnight?",
          "Would you rather every carol you hear be in tune or every light you plug in work on the first try?",
          "Would you rather be the person who remembers every tradition or the person who invents the one everyone keeps?",
          "Would you rather Christmas morning last until noon or Christmas dinner last until everyone is full and still talking?",
          "Would you rather wake up to a quiet house and fresh snow or a loud house and breakfast already started?",
        ],
      },
    ],
    howTo: [
      { name: "Wrapping-paper vote", text: "Hold up the question, count to three, and point to a side of the room. The smaller side defends their pick while the next gift gets wrapped." },
      { name: "Advent round", text: "Ask one question a day from December 1. Write the answers on the back of a paper chain so you can read them on Christmas." },
      { name: "Predict your person", text: "Guess what someone else will pick before they answer. One point per correct guess. Play to eight, then switch to a movie." },
    ],
    faq: [
      { question: "Are these Christmas would you rather questions family-friendly?", answer: "Yes. They cover gifts, decorations, food, movies and imaginary North Pole jobs. There is no romance, scare content or spending-shame. You can read any of them with kids in the room." },
      { question: "What is the difference between these and Christmas this or that?", answer: "This or that is a fast pick, like real tree or artificial tree. Would you rather adds a cost, like a real tree that drops needles or an artificial tree that takes an hour to build. Use this or that for a party round and this page when you want reasons." },
      { question: "Can a class use these in December?", answer: "Yes, as a one-question warm-up. Stick to the food, movie and silly groups if you do not want to talk about gifts. Students pick a side and finish the sentence 'I would rather… because…'." },
      { question: "What should we play after this list?", answer: "Christmas trivia if you want answers that are right or wrong, Christmas charades if you want people out of their chairs, or the Christmas question of the day if you want one prompt each morning." },
    ],
  },
];

export function wouldYouRatherQuestions(c: WouldYouRatherCollection): string[] {
  return c.groups.flatMap((g) => g.questions);
}

export function getWouldYouRatherCollection(slug: WouldYouRatherCollection["slug"]): WouldYouRatherCollection {
  return WOULD_YOU_RATHER_COLLECTIONS.find((c) => c.slug === slug)!;
}
