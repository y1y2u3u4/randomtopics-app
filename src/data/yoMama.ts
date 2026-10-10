export const YO_MAMA_THEMES = [
  { id: "tech", label: "Tech trouble", emoji: "💻" },
  { id: "snacks", label: "Snack time", emoji: "🍿" },
  { id: "organized", label: "Very organized", emoji: "📋" },
  { id: "dramatic", label: "Big entrance", emoji: "🎬" },
  { id: "games", label: "Game night", emoji: "🎲" },
  { id: "cosmic", label: "Space nonsense", emoji: "🪐" },
] as const;
export type YoMamaTheme = typeof YO_MAMA_THEMES[number]["id"];
export type YoMamaFilter = YoMamaTheme | "all";
export type CleanJoke = { id: string; theme: YoMamaTheme; text: string };
export type RemixPart = { id: string; theme: YoMamaTheme; text: string };
export type YoMamaRemix = { id: string; setup: RemixPart; ending: RemixPart; text: string };

// Written for this collection. Keep the joke on an imaginary situation or
// harmless habit; no copied joke feed, personal targets, or remote generation.
const clean: Record<YoMamaTheme, string[]> = {
  tech: [
    "Yo mama names her browser tabs. The one playing music is now grounded.",
    "Yo mama takes so many screenshots, her phone asked if it could just remember things out loud.",
    "Yo mama's password hint says, 'Ask nicely, then bring a biscuit.'",
    "Yo mama closes a pop-up like she's slamming the door on a tiny salesperson.",
    "Yo mama gave her robot vacuum a chore chart. It keeps requesting desk work.",
    "Yo mama's video-call background is another video call where she's finally on time.",
    "Yo mama labels her chargers so carefully, even the mystery cable has a job title.",
    "Yo mama turned on airplane mode and immediately asked her phone for a window seat.",
    "Yo mama's group-chat goodbye has three trailers and a post-credits scene.",
    "Yo mama organizes her apps by how politely they ask for updates.",
    "Yo mama pressed 'save for later' so often, later hired an assistant.",
    "Yo mama's smart speaker says 'please' before giving her the weather.",
  ],
  snacks: [
    "Yo mama packs backup snacks for the backup snacks. The emergency bag has a dessert menu.",
    "Yo mama seasons popcorn so confidently, every kernel thinks it's the main course.",
    "Yo mama brings a cheese board to a picnic and gives each cracker a seating assignment.",
    "Yo mama's cookies cool on a rack with a velvet rope and a guest list.",
    "Yo mama opens a lunchbox like she's revealing the final prize on a game show.",
    "Yo mama's soup is so carefully stirred, the carrots know the dance routine.",
    "Yo mama judges a sandwich by its layers, then writes the bread a performance review.",
    "Yo mama's midnight snack has an opening act. It's usually toast.",
    "Yo mama brings tiny tongs for the tiny snacks. The large tongs feel left out.",
    "Yo mama gives leftover pizza a farewell speech before reheating it.",
    "Yo mama folds a napkin so dramatically, dinner briefly becomes an origami exhibition.",
    "Yo mama calls the last chip a 'limited edition' and suddenly everyone wants it.",
  ],
  organized: [
    "Yo mama's to-do list has a waiting room for tasks that aren't ready to commit.",
    "Yo mama alphabetized the fridge magnets. Now the shopping list has to file an appeal.",
    "Yo mama's spare buttons are organized by the adventures they might have someday.",
    "Yo mama schedules a five-minute break, then sends it a calendar reminder to relax.",
    "Yo mama packs a weekend bag with a table of contents and an index of socks.",
    "Yo mama put a label on the label maker: 'Director of Labels.'",
    "Yo mama's sticky notes hold a morning meeting to decide which one is urgent.",
    "Yo mama tidied the junk drawer so well, the junk had to update its mailing address.",
    "Yo mama made a checklist for going with the flow. Step one is 'locate flow.'",
    "Yo mama color-codes her umbrellas by the kind of drizzle she's expecting.",
    "Yo mama's packing list includes a smaller packing list for the pen.",
    "Yo mama returned a library book with a thank-you note from the bookmark.",
  ],
  dramatic: [
    "Yo mama enters the kitchen like the kettle has been announcing her arrival all morning.",
    "Yo mama says 'guess what' and the room automatically dims the lights.",
    "Yo mama's grocery receipt is so long, she reads it with an intermission.",
    "Yo mama opens the curtains with the confidence of someone unveiling a new continent.",
    "Yo mama tells a story about finding her keys, and the keys get a character arc.",
    "Yo mama's 'quick announcement' has a supporting cast and costume changes.",
    "Yo mama waves goodbye from the driveway until the GPS starts waving back.",
    "Yo mama puts on a scarf like she's accepting an award for excellent weather.",
    "Yo mama narrates a board-game turn like the dice have a documentary crew.",
    "Yo mama's doorbell doesn't ring. It introduces her next guest.",
    "Yo mama pauses before a punchline so long, the punchline orders a chair.",
    "Yo mama turns a simple 'no thanks' into the season finale of a very polite show.",
  ],
  games: [
    "Yo mama plays charades so enthusiastically, the furniture starts guessing.",
    "Yo mama brings a victory speech to a practice round. It has footnotes.",
    "Yo mama's puzzle pieces ask permission before they go missing.",
    "Yo mama calls a coin toss and asks the coin to explain its strategy.",
    "Yo mama wins musical chairs, then invites every chair to the celebration.",
    "Yo mama takes mini golf seriously enough to give the windmill a scouting report.",
    "Yo mama's bingo marker has a warm-up routine and a tiny towel.",
    "Yo mama keeps score at a friendly game, including points for excellent snack sharing.",
    "Yo mama's rock-paper-scissors rock arrived with a manager and a water bottle.",
    "Yo mama celebrates a correct trivia answer like the question just retired her jersey.",
    "Yo mama's chess pawns have a group chat called 'One Step at a Time.'",
    "Yo mama brought a stopwatch to hide-and-seek. It immediately tried to hide.",
  ],
  cosmic: [
    "Yo mama packed for a moon trip and brought an extra moon in case the first one got chilly.",
    "Yo mama gave Saturn a ring organizer. Saturn is still deciding where the big one goes.",
    "Yo mama tells shooting stars to slow down because she hasn't finished her wish.",
    "Yo mama's telescope has a little curtain for when the stars need privacy.",
    "Yo mama visited a comet and asked who was going to tidy up that tail.",
    "Yo mama named a constellation 'Keys, Probably' so she'd always know where to look.",
    "Yo mama's spaceship has a drawer full of containers with no matching lids.",
    "Yo mama invited the whole solar system to dinner. Pluto got the nicest place card.",
    "Yo mama brought a lint roller into space. The asteroid belt suddenly looks very smart.",
    "Yo mama asked a black hole if it was keeping the receipt for all that stuff.",
    "Yo mama sent a postcard from Mars with a reminder to water the plastic plants.",
    "Yo mama's countdown to launch includes 'Has everybody been to the bathroom?'",
  ],
};
export const YO_MAMA_JOKES: CleanJoke[] = YO_MAMA_THEMES.flatMap(({ id }) =>
  clean[id].map((text, index) => ({ id: `ym-${id}-${index + 1}`, theme: id, text })),
);

// Independent, grammar-compatible parts: changing either part produces an
// actual new text remix. The all-themes pool permits deliberate nonsense.
const pieces: Record<YoMamaTheme, { setups: string[]; endings: string[] }> = {
  tech: {
    setups: ["gave the Wi-Fi router a tiny crown", "sent a calendar invite to a toaster", "taught a spreadsheet to tap-dance", "put a robot vacuum in charge of a parade"],
    endings: ["the loading bar wants a standing ovation", "every password comes with a tiny drumroll", "the printer has requested a dressing room", "the delete key is taking a victory lap"],
  },
  snacks: {
    setups: ["hired a waffle to run a detective agency", "entered a jellybean in a spelling contest", "built a drawbridge out of breadsticks", "gave a bowl of soup a backstage pass"],
    endings: ["the popcorn is demanding a plot twist", "a marshmallow has become head of security", "the gravy boat is applying for a sailing license", "every breadcrumb expects a limousine"],
  },
  organized: {
    setups: ["alphabetized a cloud of confetti", "gave Tuesday a laminated instruction sheet", "built a waiting room for lost socks", "scheduled a meeting with a paperclip"],
    endings: ["the stapler is writing its memoirs", "the checklist has added 'become a dragon'", "all the sticky notes are wearing tiny helmets", "the filing cabinet refuses to work without theme music"],
  },
  dramatic: {
    setups: ["rolled out a red carpet for a doorstop", "gave an umbrella its own talk show", "cast a houseplant as the action hero", "announced breakfast through a cardboard trumpet"],
    endings: ["the curtains are asking for an encore", "a lampshade is practicing its acceptance speech", "the doorbell has signed a three-album deal", "the dramatic pause needs a parking space"],
  },
  games: {
    setups: ["challenged a traffic cone to a dance-off", "taught a deck of cards synchronized swimming", "entered a cushion in the pancake Olympics", "made a chess knight captain of a submarine"],
    endings: ["the scoreboard only accepts compliments", "a rubber duck is reviewing the instant replay", "the dice are wearing matching tracksuits", "the trophy insists on being carried by six spoons"],
  },
  cosmic: {
    setups: ["parked a comet beside the recycling bin", "invited a nebula to a pajama party", "sent Saturn a flat-pack bookshelf", "taught the moon how to juggle slippers"],
    endings: ["the asteroid belt has become a conga line", "Mars is asking the kettle for directions", "a shooting star is waiting for the bus", "the entire galaxy wants its lunchbox back"],
  },
};
export const YO_MAMA_SETUPS: RemixPart[] = YO_MAMA_THEMES.flatMap(({ id }) =>
  pieces[id].setups.map((text, index) => ({ id: `setup-${id}-${index + 1}`, theme: id, text })),
);
export const YO_MAMA_ENDINGS: RemixPart[] = YO_MAMA_THEMES.flatMap(({ id }) =>
  pieces[id].endings.map((text, index) => ({ id: `ending-${id}-${index + 1}`, theme: id, text })),
);
export function yoMamaRemix(setup: RemixPart, ending: RemixPart): YoMamaRemix {
  return { id: `${setup.id}/${ending.id}`, setup, ending, text: `Yo mama ${setup.text} — now ${ending.text}.` };
}
export function cleanJokePool(theme: YoMamaFilter) {
  return YO_MAMA_JOKES.filter(joke => theme === "all" || joke.theme === theme);
}
export function remixPool(theme: YoMamaFilter, keep?: { setup?: string; ending?: string }) {
  const setups = YO_MAMA_SETUPS.filter(part => (theme === "all" || part.theme === theme) && (!keep?.setup || part.id === keep.setup));
  const endings = YO_MAMA_ENDINGS.filter(part => (theme === "all" || part.theme === theme) && (!keep?.ending || part.id === keep.ending));
  return setups.flatMap(setup => endings.map(ending => yoMamaRemix(setup, ending)));
}
export function pickUnseenJoke<T extends { id: string }>(pool: readonly T[], seen: ReadonlySet<string>, random = Math.random): T | undefined {
  const eligible = pool.filter(item => !seen.has(item.id));
  if (!eligible.length) return undefined;
  return eligible[Math.min(eligible.length - 1, Math.max(0, Math.floor(random() * eligible.length)))];
}
