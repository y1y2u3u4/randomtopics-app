// "Roast me in one sentence" — hand-written one-line roasts keyed by habit/personality trait and heat.
// No AI call and no server: picks are deterministic from (trait, heat, index), so a share link
// (#r=…) only carries ids and the name, never free text from strangers.
// House rules for every line: one sentence, starts with "You"/"Your" (so a name can be put in
// front), about habits and choices only — never looks, body, race, religion, gender or health.

export type Heat = "mild" | "spicy" | "savage";
export const HEATS: { id: Heat; label: string; emoji: string; hint: string }[] = [
  { id: "mild", label: "Mild", emoji: "🌶️", hint: "Friendly teasing" },
  { id: "spicy", label: "Spicy", emoji: "🌶️🌶️", hint: "Group-chat safe, still stings" },
  { id: "savage", label: "Savage", emoji: "🔥", hint: "No mercy (still about habits, not looks)" },
];

export interface Trait {
  id: string;
  label: string;
  emoji: string;
  /** Lowercase words/phrases that map free-text descriptions to this trait. */
  aliases: string[];
  lines: Record<Heat, string[]>;
}

const t = (id: string, label: string, emoji: string, aliases: string[], mild: string[], spicy: string[], savage: string[]): Trait =>
  ({ id, label, emoji, aliases, lines: { mild, spicy, savage } });

export const GENERIC_ID = "any";

export const TRAITS: Trait[] = [
  t("late", "Always late", "⏰", ["late", "always late", "never on time", "running late", "tardy"],
    ["You treat “on my way” as a mood, not a location.", "Your calendar is more of a suggestion box."],
    ["You have never once been early, unless the clocks went back.", "Your “five minutes away” has its own time zone."],
    ["You are so late that people schedule your arrival as a separate event.", "Your friends tell you dinner starts an hour early and you still miss the appetizers."]),
  t("gym", "Gym obsessed", "🏋️", ["gym", "lifting", "lift", "gym bro", "gym rat", "workout", "bodybuilding", "protein"],
    ["You call a rest day “active recovery” and then go to the gym anyway.", "Your playlist is just one song called “PR attempt” on repeat."],
    ["You can track every rep but cannot carry a conversation that is not about macros.", "Your personality has sets, reps and a pre-workout warning label."],
    ["You talk about leg day the way other people talk about their divorce.", "Your mirror has seen more of you than your friends have this year."]),
  t("coffee", "Coffee addict", "☕", ["coffee", "caffeine", "latte", "espresso", "starbucks", "iced coffee"],
    ["You say “I can’t function before coffee” like it is a medical condition.", "Your blood type is oat milk latte."],
    ["You spend more on iced coffee each month than on rent, and you still say you are saving.", "Your barista knows your order, your name and your trauma."],
    ["You are not a morning person, you are a caffeine delivery system with legs.", "Your heart rate has its own fan club and they are all worried."]),
  t("gamer", "Gamer", "🎮", ["gamer", "gaming", "video games", "games", "xbox", "playstation", "ps5", "valorant", "fortnite", "league", "minecraft"],
    ["You say “one more game” the way other people say “goodnight”.", "Your sleep schedule respawns at random."],
    ["You have 2,000 hours in one game and still blame your teammates.", "Your K/D ratio is better than your text response rate."],
    ["You have rage-quit more lobbies than you have finished real-life tasks.", "Your gaming chair has more lumbar support than your life plan."]),
  t("crypto", "Crypto bro", "🪙", ["crypto", "bitcoin", "nft", "nfts", "web3", "trading", "trader", "stocks", "day trading"],
    ["You check the charts before you check on your family.", "Your idea of small talk is explaining a blockchain."],
    ["You said “we are so early” in 2021 and you are still saying it.", "Your portfolio and your mood have the same graph."],
    ["You bought the top, sold the bottom and called it a learning experience three times.", "Your financial advisor is a guy named Brayden with laser eyes in his profile picture."]),
  t("overthinker", "Overthinker", "🌀", ["overthink", "overthinker", "overthinking", "anxious", "anxiety", "worry", "worrier"],
    ["You reread your own texts like they are a crime scene.", "Your brain has 47 tabs open and one of them is playing music."],
    ["You have rehearsed a phone call to order pizza more times than actors rehearse Shakespeare.", "Your “quick question” comes with a three-page backstory."],
    ["You can turn a “k” into a full documentary about why everyone secretly hates you.", "Your thoughts have thoughts, and they are all overthinking too."]),
  t("procrastinator", "Procrastinator", "🐢", ["procrastinate", "procrastinator", "procrastination", "lazy", "deadline", "last minute", "putting off"],
    ["You make a to-do list so you can avoid the to-do list.", "Your best work happens at 11:58 p.m."],
    ["You have been “about to start” the same project since two phones ago.", "Your deadlines get closer and your room gets cleaner."],
    ["You would put off your own birthday if someone gave you an extension.", "Your future self has filed a formal complaint against you."]),
  t("selfie", "Selfie / influencer", "🤳", ["selfie", "selfies", "influencer", "instagram", "content creator", "posting", "vlogger", "aesthetic"],
    ["You cannot eat until the food has done a photoshoot.", "Your camera roll is 3,000 takes of the same post."],
    ["You call it “creating content”, your followers call it “another mirror pic”.", "Your ring light has seen more of your emotions than your therapist."],
    ["You would film yourself saving someone’s life and ask them to do a second take.", "Your engagement rate is the only engagement you will be getting this year."]),
  t("foodie", "Foodie", "🍜", ["foodie", "food", "eating", "snacks", "hungry", "cooking", "chef", "restaurants"],
    ["You plan your vacations around where you will eat lunch.", "Your fridge has more sauces than actual food."],
    ["You say “I’m not that hungry” and then order for the whole table.", "Your Google Maps history is just a list of places that do brunch."],
    ["You have rated more restaurants than you have finished books, movies and relationships combined.", "Your love language is stealing fries off other people’s plates."]),
  t("cat", "Cat person", "🐈", ["cat", "cats", "cat person", "cat mom", "cat dad", "kitty"],
    ["You cancel plans because the cat is sitting on you.", "Your camera roll is 90 percent cat and 10 percent accidental screenshots."],
    ["You talk to your cat more than you talk to your family, and the cat ignores you just as much.", "Your cat tolerates you because you know how to open the food."],
    ["You think your cat loves you, but it is just waiting for you to stop moving.", "Your social life is whatever your cat allows between naps."]),
  t("dog", "Dog person", "🐕", ["dog", "dogs", "dog person", "dog mom", "dog dad", "puppy"],
    ["You say “who’s a good boy” more than you say “hello” to people.", "Your dog has a better wardrobe than you do."],
    ["You leave parties early to “check on the dog”, and we all know the dog is fine.", "Your phone background is your dog and so is your personality."],
    ["You have more pictures of your dog than your dog has brain cells, and that is saying something.", "Your dog is the only one who laughs at your jokes, and only because you have treats."]),
  t("night-owl", "Night owl", "🦉", ["night owl", "insomnia", "stay up late", "up late", "3am", "nocturnal", "no sleep"],
    ["You say “I’ll go to bed early tonight” every night like a ritual.", "Your best ideas show up three hours after midnight and leave by breakfast."],
    ["You have seen more sunrises from the wrong side than any farmer.", "Your sleep schedule is just a list of apologies."],
    ["You are not a night owl, you are a raccoon with a phone charger.", "Your alarm has given up and started a support group."]),
  t("anime", "Anime fan", "🍥", ["anime", "manga", "weeb", "otaku", "one piece", "naruto", "jjk"],
    ["You say “just one episode” and then finish the whole arc.", "Your Japanese is limited to the words used in fight scenes."],
    ["You have explained the power system of a show to people who did not ask, twice.", "Your watchlist is longer than your list of real-life goals."],
    ["You think every rejection is just the first arc of your redemption story.", "Your backstory is not tragic, you just watched too many tragic backstories."]),
  t("founder", "Startup founder", "🚀", ["founder", "startup", "entrepreneur", "ceo", "side hustle", "hustle", "business owner", "saas"],
    ["You call a group chat “the team” and a sandwich “a working lunch”.", "Your favorite word is “pivot”, mostly away from earning money."],
    ["You have six domain names, four logos and zero customers.", "Your pitch deck has more slides than your product has users."],
    ["You are not disrupting the industry, you are just making an app for something a spreadsheet already does.", "Your startup has burned through more money than a bonfire made of cash."]),
  t("doomscroll", "Doomscroller", "📱", ["doomscroll", "doomscrolling", "tiktok", "scrolling", "phone addict", "screen time", "reels", "always on phone"],
    ["You open the app “for a second” and come back with a new personality.", "Your thumb gets more cardio than the rest of you."],
    ["You have watched 400 videos about being productive instead of being productive.", "Your screen time report reads like a cry for help."],
    ["You have scrolled so far that the algorithm is now worried about you.", "Your attention span ended halfway through this sentence."]),
  t("texts-back", "Never texts back", "💬", ["never text back", "never texts back", "leaves on read", "ghost", "ghosting", "bad texter", "slow reply", "doesn't reply"],
    ["You reply to texts in seasons, not minutes.", "Your “sorry, just saw this” is always three days late."],
    ["You leave people on read so long their message becomes a historical document.", "Your phone is always in your hand but somehow never “on you”."],
    ["You have ghosted more people than a haunted house.", "Your inbox is where conversations go to die."]),
  t("dating", "Dating apps", "💘", ["dating", "dating app", "dating apps", "tinder", "hinge", "bumble", "single", "situationship"],
    ["You spend an hour picking a username and ten seconds writing your dating bio.", "Your type is anyone who calls replying to a text a major commitment."],
    ["You have matched with half the city and talked to none of them.", "Your situationship has lasted longer than most real relationships."],
    ["You are not unlucky in love, you just keep swiping right on red flags because they look like party lights.", "Your dating history is a group project where you were the only one who did not show up."]),
  t("astrology", "Astrology", "♈", ["astrology", "zodiac", "horoscope", "star sign", "mercury retrograde", "gemini", "scorpio", "leo"],
    ["You blame Mercury retrograde for everything, including your own typos.", "Your first question on a date is “what’s your sign?”."],
    ["You let planets millions of miles away decide whether you text someone back.", "Your excuse for being dramatic is that the moon told you to."],
    ["You know your rising sign but not your own bank balance.", "Your horoscope said “a great week is coming” and it has been lying since 2019."]),
  t("runner", "Runner", "🏃", ["runner", "running", "marathon", "5k", "half marathon", "strava", "jogging"],
    ["You cannot run a mile without posting it to Strava.", "Your idea of fun is waking up before sunrise to be tired on purpose."],
    ["You ran one half marathon and have mentioned it every day since.", "Your running shoes cost more than your entire wardrobe."],
    ["You run away from your problems, literally, at a steady pace, and then upload the route.", "Your marathon medal is the only thing in your life you finished."]),
  t("music", "Music snob", "🎧", ["music", "music snob", "spotify", "vinyl", "playlist", "concerts", "aux", "indie"],
    ["You say “you probably haven’t heard of them” like it is a compliment.", "Your playlists have names longer than the songs."],
    ["You were never given the aux again after the four-minute ambient intro.", "Your Spotify Wrapped is a personality test and you failed it."],
    ["You liked the band before they were famous and you have been insufferable ever since.", "Your vinyl collection is the only thing in your apartment that gets dusted."]),
  t("shopping", "Shopaholic", "🛍️", ["shopping", "shopaholic", "amazon", "online shopping", "shein", "sales", "packages", "buying stuff"],
    ["You say “it was on sale” like it makes the fifth one necessary.", "Your delivery driver knows you better than your neighbors."],
    ["You have a cart full of things you do not need and a bank account full of things you do not have.", "Your closet is full but you still have “nothing to wear”."],
    ["You do not have a spending problem, you have a saving problem, and it is that you never do it.", "Your bank sends you a monthly email that just says “why”."]),
  t("introvert", "Introvert", "🫥", ["introvert", "introverted", "shy", "homebody", "antisocial", "stays home", "quiet"],
    ["You get excited when plans are cancelled.", "Your social battery charges for a week and dies in an hour."],
    ["You need three business days to recover from a birthday party.", "Your idea of an adventure is answering the door for a delivery."],
    ["You have rehearsed leaving a party before you have even arrived at it.", "Your houseplants have a more active social life than you."]),
  t("talker", "Talks too much", "🗣️", ["talker", "talks a lot", "talks too much", "loud", "extrovert", "chatty", "yapper", "yap", "storyteller"],
    ["You tell stories that start in the middle and somehow never end.", "Your voice notes have chapters."],
    ["You promise a quick story and then deliver the unabridged edition.", "Your inside voice is the outside voice of everyone else."],
    ["You talk so much that people pretend to get phone calls just to escape.", "Your friends charge their phones while you tell a story."]),
  t("linkedin", "LinkedIn poster", "💼", ["linkedin", "corporate", "networking", "thought leader", "hustle culture", "grindset", "productivity"],
    ["You turn every breakfast into a lesson about leadership.", "Your out-of-office message has a call to action."],
    ["You wrote a LinkedIn post about how your toddler taught you about B2B sales.", "Your personality is a motivational poster with a ring light."],
    ["You are not a thought leader, you are a guy who reposts quotes with “agree?” at the bottom.", "Your idea of vulnerability is crying in a post about quarterly targets."]),
  t("plants", "Plant parent", "🪴", ["plants", "plant", "plant parent", "plant mom", "plant dad", "gardening", "houseplants"],
    ["You name your plants and forget to water them.", "Your apartment is a jungle and you are the confused tourist."],
    ["You have killed more succulents than a desert drought.", "Your plants are thriving because you are emotionally too busy to overwater them."],
    ["You bought 40 plants to feel alive and now 38 of them are just sticks in pots.", "Your plants are only green because they are jealous of everyone else’s care."]),
  t("traveler", "Traveler", "✈️", ["travel", "traveler", "traveling", "backpacking", "wanderlust", "trip", "digital nomad"],
    ["You mention the trip you took two years ago in every single conversation.", "Your passport has more stamps than your loyalty card."],
    ["You went to Bali once and now you “just can’t do the 9 to 5”.", "Your idea of a budget is a flight you cannot afford to a place you cannot pronounce."],
    ["You are not finding yourself, you are just spending money to get lost in new airports.", "Your travel blog has three readers and two of them are your parents."]),
  t("bookworm", "Bookworm", "📚", ["books", "book", "reading", "reader", "bookworm", "booktok", "library", "kindle"],
    ["You buy books faster than you can read them.", "Your bookshelf is mostly a promise to your future self."],
    ["You have 200 books on your to-read list and you just added three more.", "Your favorite fictional character has more emotional depth than your last relationship."],
    ["You judge people by their bookshelves but your own is half unread BookTok picks.", "Your idea of talking to someone is quoting a book they have not read."]),
  t("perfectionist", "Perfectionist", "📐", ["perfectionist", "perfection", "control freak", "organized", "neat freak", "type a"],
    ["You redo things that were already done because they felt “off”.", "Your notes have notes, color-coded."],
    ["You spent three hours picking a font for a grocery list.", "Your idea of relaxing is reorganizing the drawer you organized yesterday."],
    ["You would rather never finish than finish with a typo.", "Your perfectionism has delayed more projects than every bank holiday combined."]),
  t("online", "Chronically online", "💻", ["chronically online", "online", "terminally online", "reddit", "twitter", "memes", "discord"],
    ["You quote memes in real life and wait for people to laugh.", "Your humor needs a subtitle and a link."],
    ["You have argued with a stranger online for three hours about something you do not care about.", "Your vocabulary is 40 percent words you learned from comment sections."],
    ["You touch grass only when the Wi-Fi goes down.", "Your Discord status is the only thing that ever says you are “away”."]),
  t("student", "Student", "🎓", ["student", "college", "university", "school", "exam", "exams", "studying", "homework", "finals"],
    ["You make a study playlist and then study the playlist.", "Your highlighters have done more work than you this semester."],
    ["You call it “studying” but your textbook has not been opened since you bought it.", "Your sleep schedule is decided entirely by your exam dates."],
    ["You are paying thousands of dollars to nap in a lecture hall.", "Your student loan has a better work ethic than you do."]),
];

const GENERIC: Record<Heat, string[]> = {
  mild: [
    "You have the confidence of someone who has never read the instructions.",
    "You are the human version of a loading screen.",
    "Your vibe is “I meant to do that”.",
    "You bring the energy of someone who replies all.",
  ],
  spicy: [
    "You are proof that a good personality is optional if you have snacks.",
    "Your life story would be a great movie if someone else rewrote it.",
    "You are the reason group projects have peer reviews.",
    "Your decision-making skills are why the rest of us read the reviews first.",
  ],
  savage: [
    "You are like a cloud: when you leave, it is a beautiful day.",
    "Your secrets are safe with me because I never listen when you talk.",
    "You are the reason the instructions on shampoo bottles exist.",
    "You are the human version of a participation trophy.",
  ],
};

export const LIMITS = { name: 24, describe: 140 } as const;
export const MAX_TRAITS = 3;

export const traitById = (id: string): Trait | undefined => TRAITS.find((x) => x.id === id);

/** Lines for a trait at a heat; unknown or generic id → the generic pool. */
export function linesFor(traitId: string, heat: Heat): string[] {
  return traitById(traitId)?.lines[heat] ?? GENERIC[heat];
}

/** Map a free-text description ("always late, gym, coffee") to trait ids, in order of first match. */
export function matchTraits(text: string): string[] {
  const s = ` ${text.toLowerCase().replace(/[^a-z0-9#' ]+/g, " ").replace(/\s+/g, " ")} `;
  if (!s.trim()) return [];
  const hits: { id: string; at: number }[] = [];
  for (const tr of TRAITS) {
    let best = -1;
    for (const a of tr.aliases) {
      const at = s.indexOf(` ${a} `);
      if (at >= 0 && (best < 0 || at < best)) best = at;
      // allow simple plurals ("cats", "games")
      const atPl = s.indexOf(` ${a}s `);
      if (atPl >= 0 && (best < 0 || atPl < best)) best = atPl;
    }
    if (best >= 0) hits.push({ id: tr.id, at: best });
  }
  return hits.sort((a, b) => a.at - b.at).map((h) => h.id);
}

export const cleanName = (name: string): string => name.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim().slice(0, LIMITS.name);

/** Put the name in front: "You are…" → "Sam, you are…". */
export function withName(line: string, name: string): string {
  const n = cleanName(name);
  if (!n) return line;
  return `${n}, ${line.charAt(0).toLowerCase()}${line.slice(1)}`;
}

export interface Roast { trait: string; heat: Heat; index: number; name: string }

export function roastText(r: Roast): string {
  const lines = linesFor(r.trait, r.heat);
  return withName(lines[((r.index % lines.length) + lines.length) % lines.length], r.name);
}

/** Every (trait, index) a set of traits can produce at a heat, in a stable order. */
export function candidates(traits: string[], heat: Heat): { trait: string; index: number }[] {
  const ids = traits.filter((id) => traitById(id));
  const use = ids.length ? ids : [GENERIC_ID];
  return use.flatMap((trait) => linesFor(trait, heat).map((_, index) => ({ trait, index })));
}

/**
 * Next roast for the chosen traits: never repeats until every candidate was shown
 * (`seen` holds "trait:heat:index" keys). `rand` is in [0, 1).
 */
export function nextRoast(traits: string[], heat: Heat, name: string, seen: ReadonlySet<string>, rand: number): Roast {
  const all = candidates(traits, heat);
  const fresh = all.filter((c) => !seen.has(roastKey({ ...c, heat })));
  const pool = fresh.length ? fresh : all;
  const pick = pool[Math.min(pool.length - 1, Math.floor(rand * pool.length))];
  return { trait: pick.trait, heat, index: pick.index, name: cleanName(name) };
}

export const roastKey = (r: { trait: string; heat: Heat; index: number }) => `${r.trait}:${r.heat}:${r.index}`;

// ---- share link (#r=…): ids + name only ----
function toB64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s: string): string {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeRoast(r: Roast): string {
  return toB64Url(JSON.stringify([r.trait, r.heat, r.index, cleanName(r.name)]));
}

export function decodeRoast(code: string): Roast | null {
  try {
    const d = JSON.parse(fromB64Url(code));
    if (!Array.isArray(d) || d.length !== 4) return null;
    const [trait, heat, index, name] = d;
    if (typeof trait !== "string" || (trait !== GENERIC_ID && !traitById(trait))) return null;
    if (!HEATS.some((h) => h.id === heat)) return null;
    if (!Number.isInteger(index) || index < 0 || index >= linesFor(trait, heat).length) return null;
    if (typeof name !== "string") return null;
    return { trait, heat, index, name: cleanName(name) };
  } catch {
    return null;
  }
}

export function roastFromHash(hash: string): Roast | null {
  const m = /(?:^#|&)r=([A-Za-z0-9_-]+)/.exec(hash);
  return m ? decodeRoast(m[1]) : null;
}

// ---- roast of the day: same line for everyone on a UTC date ----
const ALL_SPICY = (): { trait: string; index: number }[] => candidates(TRAITS.map((x) => x.id), "spicy");

export function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

export function roastOfTheDay(date: Date): Roast {
  const all = ALL_SPICY();
  // stride through the pool so consecutive days jump between traits
  const i = (dayNumber(date) * 37) % all.length;
  return { ...all[i], heat: "spicy", name: "" };
}

/** Example roasts shown in page content (SSR, crawlable). */
export const EXAMPLE_ROASTS: { name: string; traits: string[]; heat: Heat; index: number }[] = [
  { name: "Sam", traits: ["late"], heat: "mild", index: 0 },
  { name: "Maya", traits: ["coffee"], heat: "spicy", index: 0 },
  { name: "Leo", traits: ["gamer"], heat: "spicy", index: 0 },
  { name: "Priya", traits: ["overthinker"], heat: "savage", index: 0 },
  { name: "Jordan", traits: ["founder"], heat: "spicy", index: 0 },
  { name: "Alex", traits: ["texts-back"], heat: "savage", index: 0 },
];
