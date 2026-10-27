import { createRng, type Rng } from "@/lib/randomGenerators";

/**
 * Book idea generator: genre word banks written by us. A book idea is a
 * title, protagonist, setting, conflict and twist; the logline is built
 * from the protagonist, setting and conflict so it always agrees with them.
 */

export const FIELDS = ["title", "protagonist", "setting", "conflict", "twist"] as const;
export type Field = (typeof FIELDS)[number];
export const FIELD_LABELS: Record<Field, string> = {
  title: "Title",
  protagonist: "Protagonist",
  setting: "Setting",
  conflict: "Conflict",
  twist: "Twist",
};

export interface Genre {
  id: string;
  label: string;
  emoji: string;
  /** Cover cloth and foil colors. */
  cloth: string;
  foil: string;
  titleAdj: string[];
  titleNoun: string[];
  titlePlace: string[];
  protagonist: string[];
  setting: string[];
  /** "[inciting]; [goal] before [stakes]" pieces; goal[i] answers inciting[i]. */
  inciting: string[];
  goal: string[];
  stakes: string[];
  twist: string[];
}

const TITLE_PATTERNS = [
  (a: string, n: string) => `The ${a} ${n}`,
  (_a: string, n: string, p: string) => `The ${n} of ${p}`,
  (a: string, n: string) => `${a} ${n}s`,
  (_a: string, n: string, p: string) => `A ${n} for ${p}`,
  (a: string, _n: string, p: string) => `${p} Is ${a}`,
  (_a: string, n: string) => `Before the ${n}`,
];

export const GENRES: Genre[] = [
  {
    id: "fantasy", label: "Fantasy", emoji: "🐉", cloth: "#2f4a3a", foil: "#e8c56a",
    titleAdj: ["Hollow", "Silver", "Thornbound", "Last", "Sleeping", "Ashen", "Wandering", "Starless"],
    titleNoun: ["Crown", "Key", "Orchard", "Oath", "Lantern", "Tide", "Map", "Bell"],
    titlePlace: ["Embers", "the Drowned Kings", "Hollowmere", "Seven Winters", "the Glass Wood", "Vael"],
    protagonist: ["a disgraced royal cartographer", "a stable girl who can hear metal", "an aging hedge witch with one spell left", "a twin who inherited the wrong half of a curse", "a bridge troll studying to be a lawyer", "a thief who steals memories for rent"],
    setting: ["a kingdom built on the back of a sleeping giant", "a city where the canals flow uphill", "a forest that moves one mile every night", "an island library guarded by retired dragons", "a mountain monastery above the clouds", "a border town between two warring seasons"],
    inciting: ["finds a map that redraws itself every dawn", "is blamed for the death of the last dragon", "accidentally breaks a thousand-year treaty", "wakes up with the queen's shadow attached to them", "hears the old gods arguing in a well", "is chosen by a sword that has never picked a hero"],
    goal: ["they must cross three enemy kingdoms", "they must find the true heir", "they must undo the spell", "they must win a contest of riddles against death", "they must return a stolen star", "they must rebuild a broken crown"],
    stakes: ["the next full moon", "winter swallows the realm", "the giant wakes", "their name is erased from every record", "magic runs out for good", "the war of seasons begins"],
    twist: ["the villain is their future self trying to warn them", "the map was drawing the reader, not the land", "the dragon is alive and is the real heir", "magic is powered by forgotten memories — theirs", "the prophecy was mistranslated and names the mentor", "the kingdom is a dream of the sleeping giant"],
  },
  {
    id: "romance", label: "Romance", emoji: "💌", cloth: "#7a2e3a", foil: "#f3d1c4",
    titleAdj: ["Accidental", "Borrowed", "Second", "Sweet", "Reckless", "Unwritten", "Midsummer", "Perfect"],
    titleNoun: ["Summer", "Proposal", "Letter", "Bakery", "Deal", "Wedding", "Promise", "Road Trip"],
    titlePlace: ["Paris in the Rain", "Cherry Lane", "the Lighthouse", "Lake Mirren", "Hotel Calloway", "Two"],
    protagonist: ["a wedding planner who doesn't believe in love", "a grumpy bookshop owner", "a chef with a ruined reputation", "a florist allergic to roses", "a retired pop star hiding in a small town", "a divorce lawyer on her sister's wedding committee"],
    setting: ["a seaside town during tourist season", "a snowed-in mountain lodge", "a rival food truck parked across the street", "a Tuscan vineyard at harvest", "a London flat share with a strict rota", "a cross-country train with no Wi-Fi"],
    inciting: ["is forced to fake a relationship with their rival", "inherits half a house with a stranger", "gets stuck planning their ex's wedding", "loses a bet and must date whoever the town chooses", "keeps finding love letters addressed to someone else", "is assigned a co-host they publicly insulted"],
    goal: ["they must keep the act going for one summer", "they must sell the house together", "they must survive the wedding without falling for the best man", "they must win the town festival", "they must find who wrote the letters", "they must make the show a hit"],
    stakes: ["the truth comes out at the wedding", "the deadline to sell", "their best friend's big day", "the season ends", "the letters stop arriving", "the network cancels them"],
    twist: ["the rival wrote the letters years ago", "the fake relationship was the other person's plan all along", "they already met as kids at summer camp", "the stranger is the pen pal they lost touch with", "the ex wants them back — and they finally say no", "the bet was rigged by their grandmother"],
  },
  {
    id: "mystery", label: "Mystery", emoji: "🔍", cloth: "#1f2a44", foil: "#d9d4c5",
    titleAdj: ["Silent", "Missing", "Quiet", "Locked", "Crooked", "Seventh", "Unlucky", "Borrowed"],
    titleNoun: ["Witness", "Guest", "Clue", "Room", "Alibi", "Portrait", "Key", "Hour"],
    titlePlace: ["Blackwater Manor", "Platform Nine", "the Last Train", "Harrow Bay", "Room 214", "the Orchard"],
    protagonist: ["a retired crossword setter", "a small-town vet with a photographic memory", "a hotel night porter", "a true-crime podcaster who has never solved anything", "a librarian who reads people like books", "a rookie detective on her first day"],
    setting: ["a snowed-in country house", "an overnight sleeper train", "a sleepy seaside village", "an exclusive island retreat", "a closed museum after hours", "a 1920s jazz club"],
    inciting: ["finds a body in a locked room", "receives a crossword that predicts a murder", "is the last person to see a guest alive", "notices a painting has changed overnight", "gets a voicemail from a woman declared dead", "discovers every clock in the village stopped at 3:12"],
    goal: ["they must find the killer among six suspects", "they must decode the remaining clues", "they must clear their own name", "they must expose the forger", "they must find her before the killer does", "they must work out what happened at 3:12"],
    stakes: ["the snow melts and the killer leaves", "the train reaches the last station", "the police close the case", "the next puzzle is published", "the storm cuts the island off", "the village festival"],
    twist: ["the victim staged the whole thing", "the detective's partner is the one leaving the clues", "there were two murders and two killers", "the narrator has been lying from page one", "the 'dead' woman is investigating too", "the crime happened decades ago, and this is a re-enactment"],
  },
  {
    id: "scifi", label: "Sci-fi", emoji: "🚀", cloth: "#14304a", foil: "#7fe0e0",
    titleAdj: ["Quiet", "Infinite", "Last", "Hollow", "Orbital", "Synthetic", "Distant", "Red"],
    titleNoun: ["Signal", "Colony", "Engine", "Archive", "Drift", "Protocol", "Station", "Machine"],
    titlePlace: ["Europa", "the Outer Ring", "Kepler Nine", "the Deep Sky", "New Lagos", "Tomorrow"],
    protagonist: ["a cargo pilot with debt in three systems", "an AI therapist who wants to quit", "a botanist on a dying generation ship", "a clone who finds their original alive", "a teenage hacker in a flooded megacity", "a time-loop survivor on day 4,012"],
    setting: ["a generation ship 200 years from Earth", "an ocean colony under the ice of Europa", "a megacity where sleep is sold by the hour", "a mining station on a rogue moon", "Earth after the internet was switched off", "a space elevator under construction"],
    inciting: ["picks up a signal from a ship lost a century ago", "discovers the colony's sky is a screen", "is framed for shutting down the station AI", "wakes from cryosleep 80 years too late", "finds their memories were rented to someone else", "receives orders from a future version of the fleet"],
    goal: ["they must reach the signal's source", "they must convince the colony of the truth", "they must restart the AI", "they must find out who stayed awake", "they must get their memories back", "they must change the past without breaking it"],
    stakes: ["oxygen runs out in 30 days", "the colony votes to stay", "the station falls out of orbit", "the ship reaches its destination", "the memories are deleted", "the timeline collapses"],
    twist: ["the lost ship is their own, from the future", "the colonists are the aliens", "the AI framed itself to stop a worse crime", "Earth never sent the ship — it escaped", "they are the copy, not the original", "the signal is a warning they will send"],
  },
  {
    id: "thriller", label: "Thriller", emoji: "🗝️", cloth: "#2b2b2b", foil: "#e94b3c",
    titleAdj: ["Perfect", "Final", "Silent", "Dark", "Burned", "Hidden", "Last", "Cold"],
    titleNoun: ["Lie", "Witness", "Passenger", "Contract", "House", "Exit", "Code", "Ransom"],
    titlePlace: ["Midnight", "Platform Four", "the Lake House", "Zurich", "Flight 22", "Nowhere"],
    protagonist: ["a court interpreter", "a burned-out bodyguard", "a forensic accountant", "a mother with a past she erased", "an air traffic controller", "a journalist under witness protection"],
    setting: ["an overnight flight across the Atlantic", "a remote lake house with no signal", "a Swiss private bank", "a high-rise in a blackout", "a small town where everyone has a secret", "a cruise ship in a storm"],
    inciting: ["translates a confession nobody else understood", "is hired to protect the person they once failed", "finds one wrong number in a billion-dollar ledger", "sees their own face on a missing-person poster", "hears a pilot's coded distress call", "receives an envelope with tomorrow's headline"],
    goal: ["they must get the evidence out", "they must keep the client alive", "they must follow the money", "they must find out who they were", "they must land the plane", "they must stop the story from coming true"],
    stakes: ["dawn", "the trial starts", "the auditors arrive", "their family finds out", "the fuel runs out", "the presses roll"],
    twist: ["the client hired the assassin", "the protagonist wrote the ledger years ago", "the poster is real and they are the kidnapper", "the hijacker is an undercover agent", "the headline was planted by the protagonist's editor", "the safe house belongs to the enemy"],
  },
  {
    id: "horror", label: "Horror", emoji: "🕯️", cloth: "#3a1416", foil: "#cfc6b0",
    titleAdj: ["Hungry", "Pale", "Whispering", "Hollow", "Rotten", "Smiling", "Drowned", "Crawling"],
    titleNoun: ["House", "Doll", "Choir", "Well", "Guest", "Fog", "Garden", "Mirror"],
    titlePlace: ["Elm Hollow", "the Lower Floors", "Bitter Creek", "the Night Shift", "Room Zero", "the Marsh"],
    protagonist: ["a night-shift nurse", "a realtor selling an impossible house", "a babysitter on her last job", "a folklore student", "a widower who moves to the coast", "a camp counselor"],
    setting: ["a hospital wing closed since 1974", "a house with one more room every night", "a fishing village where no one leaves after dark", "a summer camp beside a drained lake", "an apartment block where the lifts go to floor -6", "a farmhouse surrounded by corn that hums"],
    inciting: ["hears their name called on the hospital intercom", "finds a door that wasn't on the floor plan", "is told never to answer the knocking", "records a choir singing under the lake", "meets neighbors who look exactly like their family", "finds the camp's photos show one extra child every year"],
    goal: ["they must find what the voice wants", "they must sell the house before closing day", "they must keep the children inside until sunrise", "they must finish the recording", "they must find their real family", "they must find out who the extra child is"],
    stakes: ["the last night of the season", "the house claims the buyers", "the knocking stops", "the lake fills again", "the copies replace them", "the next photo is taken"],
    twist: ["the protagonist has been dead the whole time", "the house is protecting them from what's outside", "the knocking is the children's parents", "the choir is the town's founders", "they are the copy", "the extra child is the counselor, decades ago"],
  },
  {
    id: "childrens", label: "Children's", emoji: "🧸", cloth: "#2f6d8f", foil: "#ffd84a",
    titleAdj: ["Very Small", "Brave", "Grumpy", "Sleepy", "Wobbly", "Upside-Down", "Hiccuping", "Moonlit"],
    titleNoun: ["Dragon", "Penguin", "Cloud", "Robot", "Bear", "Snail", "Tugboat", "Owl"],
    titlePlace: ["Bedtime", "Puddle Lane", "the Moon", "Grandma's Garden", "the Lost Socks", "Tuesday"],
    protagonist: ["a shy little dragon who sneezes bubbles", "a penguin who wants to fly", "a robot learning to tell jokes", "a girl who can talk to clouds", "a snail late for the big race", "a sock who lost its pair"],
    setting: ["a town where it rains lemonade on Fridays", "the bottom of a toy box", "a forest school for animals", "a lighthouse at the edge of the map", "a city in the clouds", "Grandpa's messy shed"],
    inciting: ["finds a lost star in the garden", "is invited to a party nobody else knows about", "accidentally swaps places with a cat", "discovers the moon has a hiccup", "is told they are too small to help", "gets a map from a talking teapot"],
    goal: ["they must take it home before morning", "they must find the party", "they must swap back by teatime", "they must cure the hiccups", "they must save the festival", "they must follow the map"],
    stakes: ["bedtime", "the party ends", "Mum gets home", "the tide comes in", "the big parade", "the sun comes up"],
    twist: ["the star wanted to stay and becomes a nightlight", "the party was a surprise for them", "the cat liked being a child more", "the hiccups were the moon laughing", "being small was exactly what was needed", "the teapot was Grandma all along"],
  },
  {
    id: "ya", label: "YA", emoji: "🎒", cloth: "#5a3a8a", foil: "#ffb3d1",
    titleAdj: ["Electric", "Ordinary", "Golden", "Invisible", "Restless", "Brilliant", "Wild", "Unwritten"],
    titleNoun: ["Summer", "Academy", "Rebellion", "Secret", "Contest", "Heart", "Year", "Crown"],
    titlePlace: ["Us", "Westbrook High", "the Last Semester", "Starfall", "the Lost Girls", "Seventeen"],
    protagonist: ["a scholarship kid at an elite academy", "a girl who can see everyone's expiry date", "the understudy who never gets a role", "a boy who wakes up famous", "a teen running a secret radio station", "the last kid picked for everything"],
    setting: ["a boarding school on a cliff", "a city where powers appear at sixteen", "a summer theater camp", "a town that resets every graduation day", "a reality show for future leaders", "a desert school for weather-makers"],
    inciting: ["is accused of cheating in the school's deadliest contest", "sees their best friend's expiry date is tomorrow", "finds the lead actor missing on opening night", "becomes the face of a revolution by accident", "broadcasts a secret that wasn't hers", "gets a power nobody's ever had"],
    goal: ["they must win anyway", "they must change fate", "they must find the lead and save the show", "they must choose a side", "they must find who leaked it", "they must hide it from the academy"],
    stakes: ["the final round", "midnight", "curtain up", "the election", "graduation", "the testing day"],
    twist: ["the contest was designed to find a traitor", "the date was theirs, not their friend's", "the understudy was the real target", "the revolution was a marketing campaign", "the secret was planted by their mentor", "the power is borrowed from someone who wants it back"],
  },
  {
    id: "historical", label: "Historical", emoji: "🏛️", cloth: "#5b4a2f", foil: "#eadbb2",
    titleAdj: ["Last", "Forgotten", "Lost", "Paper", "Iron", "Winter", "Silk", "Secret"],
    titleNoun: ["Daughter", "Letter", "Garden", "Map", "Bookseller", "Voyage", "Embroiderer", "Printer"],
    titlePlace: ["Constantinople", "Paris", "the Silk Road", "Kyoto", "1919", "the Thames"],
    protagonist: ["a female printer in 1600s London", "a codebreaker's younger sister in 1942", "a silk trader's widow", "a lighthouse keeper's daughter in 1880", "a court painter in Edo Japan", "a nurse on the Western Front"],
    setting: ["plague-era London", "Bletchley Park in wartime", "a caravan on the Silk Road", "a Cornish lighthouse", "Kyoto in 1700", "a field hospital in 1917"],
    inciting: ["prints a pamphlet that names a traitor", "finds a coded letter in their brother's coat", "is cheated of their late spouse's fortune", "rescues a survivor who refuses to give his name", "is ordered to paint a lie for the shogun", "hides a wounded enemy soldier"],
    goal: ["they must prove it's true", "they must crack it alone", "they must win it back at the great market", "they must learn who he is", "they must hide the truth in the painting", "they must get him home"],
    stakes: ["the king's men find the press", "the invasion", "the caravan reaches the city", "the storm season", "the painting is unveiled", "the armistice"],
    twist: ["the traitor is their father", "the letter was written for them", "their spouse faked their death", "the survivor is the heir to the estate", "the shogun knew and wanted the truth hidden", "the soldier is their lost brother's friend"],
  },
  {
    id: "literary", label: "Literary", emoji: "🖋️", cloth: "#3d4a4f", foil: "#f0ead8",
    titleAdj: ["Small", "Quiet", "Borrowed", "Ordinary", "Unfinished", "Late", "Beautiful", "Lonely"],
    titleNoun: ["Hours", "Weather", "Rooms", "Inheritance", "Distance", "Kindness", "Animals", "Seasons"],
    titlePlace: ["Home", "Elsewhere", "Our Mothers", "the Interior", "a Small Town", "August"],
    protagonist: ["a piano tuner losing his hearing", "three sisters selling their mother's house", "a translator who forgot her first language", "a man who answers letters to Santa", "a retired teacher on her first holiday alone", "a son returning for his father's funeral"],
    setting: ["a fishing town in decline", "a family house full of boxes", "Lisbon in a heatwave", "a post office in the Arctic", "a cruise won in a raffle", "a farm nobody wants to inherit"],
    inciting: ["finds their father's unsent letters", "discovers their mother had another family", "receives a book they translated with a stranger's notes", "gets a letter from a child they can't stop thinking about", "meets the person they almost married", "is left the farm on one condition"],
    goal: ["they must decide whether to read them", "they must decide who keeps the house", "they must find the reader", "they must answer honestly", "they must choose who they want to be", "they must stay one full year"],
    stakes: ["the house sells", "the last summer", "the book goes out of print", "Christmas", "the cruise ends", "the year runs out"],
    twist: ["the letters were addressed to them", "the other family was the narrator's", "the notes were written by their younger self", "the child is now an adult writing back", "they realize they never wanted either life", "the condition was their father's apology"],
  },
];

export const byGenre = new Map(GENRES.map((g) => [g.id, g]));

export type Idea = Record<Field, string>;
export type Locks = Partial<Record<Field, boolean>>;

function pick<T>(list: readonly T[], rng: Rng): T {
  return list[Math.floor(rng() * list.length)];
}

function fieldValue(f: Field, g: Genre, rng: Rng): string {
  switch (f) {
    case "title": return pick(TITLE_PATTERNS, rng)(pick(g.titleAdj, rng), pick(g.titleNoun, rng), pick(g.titlePlace, rng));
    case "conflict": {
      const i = Math.floor(rng() * g.inciting.length);
      return `${g.inciting[i]}; ${g.goal[i]} before ${pick(g.stakes, rng)}`;
    }
    default: return pick(g[f], rng);
  }
}

export function rollIdea(g: Genre, seed: number, prev?: Idea, locks: Locks = {}): Idea {
  const rng = createRng(seed);
  const out = {} as Idea;
  for (const f of FIELDS) out[f] = prev && locks[f] ? prev[f] : fieldValue(f, g, rng);
  return out;
}

export function rerollField(g: Genre, f: Field, idea: Idea, seed: number): Idea {
  const rng = createRng(seed);
  let v = fieldValue(f, g, rng);
  for (let i = 0; i < 4 && v === idea[f]; i++) v = fieldValue(f, g, rng);
  return { ...idea, [f]: v };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** "When a stable girl … in a city …, finds …; they must … before …" → one readable sentence. */
export function logline(idea: Idea): string {
  const [inciting, rest] = idea.conflict.split("; ");
  return `In ${idea.setting}, ${idea.protagonist} ${inciting} — and ${rest}.`;
}

export function ideaText(g: Genre, idea: Idea): string {
  return [
    `${idea.title} (${g.label})`,
    logline(idea).replace(/^./, (c) => c.toUpperCase()),
    `Protagonist: ${cap(idea.protagonist)}`,
    `Setting: ${cap(idea.setting)}`,
    `Twist: ${cap(idea.twist)}.`,
  ].join("\n");
}

export function dayNumber(date = new Date()) {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

/** Day 1 of the daily book idea (2026-10-27). */
export const DAILY_EPOCH = 20_753;

export function dailyIdea(day: number) {
  const g = GENRES[((day % GENRES.length) + GENRES.length) % GENRES.length];
  return { genre: g, idea: rollIdea(g, 0x626f6f6b ^ day) };
}

export function combos(g: Genre) {
  return TITLE_PATTERNS.length * g.titleAdj.length * g.titleNoun.length * g.protagonist.length * g.setting.length * g.inciting.length * g.stakes.length * g.twist.length;
}
