import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Every catchphrase is a hand-written template with up to two slots ({a}, {b})
// filled from a small pool chosen so that every combination reads naturally.
export type CatchCat = "hero" | "villain" | "sidekick" | "streamer" | "sports" | "motto" | "brand";
interface Template { id: string; cat: CatchCat; text: string; who: string }
interface Pools { a: string[]; b: string[] }

const w = (s: string) => s.split(", ");

const POOLS: Record<CatchCat, Pools> = {
  hero: {
    a: w("the city, the old bridge, the last light, this crew, hope, the gate, the harbor, the school, my word, the north wall, the signal fire, home"),
    b: w("the dark, the storm, the fear, the tyrant, the plague, the flood, the silence, the siege, the cold, the doubt, the shadow, the tide"),
  },
  villain: {
    a: w("the throne, your kingdom, the crown, this city, the final key, the old magic, your secrets, the moonlit vault, the last star, the sunken gate"),
    b: w("your hope, your plan, your little rebellion, your courage, your armor, your favorite tower, your last chance, your bright idea, your alliance, your confidence, your good luck"),
  },
  sidekick: {
    a: w("snacks, a nap, one more episode, second breakfast, extra cheese, a very small hat, the good chair, a fire exit, a tiny sword, emotional support"),
    b: w("my left shoe, the map, the plan, the wifi, my sense of direction, the soup, my confidence, the horse, my knee, the door"),
  },
  streamer: {
    a: w("chat, squad, you lovely chaos goblins, night owls, legends, gremlins, friends, team"),
    b: w("next stream, tomorrow, this weekend, Friday, same time next week, Monday, next time, eight sharp"),
  },
  sports: {
    a: w("the home crowd, the whole stadium, the entire arena, the visiting end, the student section, the cheap seats, the north stand, the whole town"),
    b: w("the rookie, the captain, the keeper, the veteran, the sprinter, the underdog, the goalie, the anchor, Number Nine"),
  },
  motto: {
    a: w("kindness, curiosity, patience, courage, hard work, stubborn hope, honesty, rest, practice, quiet confidence, gratitude, humor"),
    b: w("doubt, worry, noise, excuses, drama, hurry, regret, fear, procrastination, perfectionism, comparison"),
  },
  brand: {
    a: w("freshness, comfort, speed, simplicity, quality, flavor, safety, joy, clarity, warmth"),
    b: w("every morning, every day, every time, on time, on your terms, to your door, with care, without fuss"),
  },
};

const t = (cat: CatchCat, list: string): Template[] =>
  list.split("\n").filter(Boolean).map((row, i) => {
    const [text, who] = row.split(" // ");
    return { id: `${cat}${i + 1}`, cat, text, who };
  });

export const CATCH_TEMPLATES: Template[] = [
  ...t("hero", `Not on my watch. Not while {a} still stands. // A hero who has just run out of room to retreat
Stand behind me. {b} ends tonight. // A veteran protector stepping in front of the group
I've faced {b} before, and I'm still here. // A battle-worn hero calming a nervous team
Today, we fight for {a}. // A captain rallying the squad before the final push
If {b} wants {a}, it has to come through me. // A guardian blocking the only doorway
Hold the line. {a} is counting on us. // A commander on the wall at dawn
Fear is just {b} wearing a mask. // A mentor talking a rookie out of panic
Some fight for glory. I fight for {a}. // A quiet hero answering a boastful rival
Light the beacon. {b} is coming and we're ready. // A lookout who has been waiting all night`),
  ...t("villain", `Did you really think {b} would stop me? // A smug mastermind who planned for everything
{a} was always going to be mine. // A throne-hungry schemer at the moment of victory
Delicious. Now bring me {a}. // A dramatic dark lord with a henchman nearby
Kneel, and I might spare {b}. // A tyrant offering a very bad deal
I've waited a thousand years for {a}. I can wait one more night. // An ancient villain who loves a slow reveal
Admire it while you can. {b} will not last the night. // A villain standing on the balcony at the finale
Oh, hero. Did you think {b} was the end of the story? // A mastermind unveiling the second plan
Cute. Let me show you what it looks like when {b} breaks. // A cold rival who enjoys the moment too much
Everything you love is only a stepping stone to {a}. // A gloating antagonist in the villain monologue`),
  ...t("sidekick", `I didn't come here for heroics. I came for {a}. // A reluctant companion who is mostly here for the food
Quick question: is {b} supposed to be on fire? // A sidekick noticing the problem a little too late
Bold plan. Zero chance. Do we have time for {a}? // A cheerful pessimist at the start of the mission
I have a bad feeling about {b}. // The nervous friend who is always right
Not to panic anyone, but {b} is gone. // A sidekick delivering terrible news calmly
Plot twist: I'm only here for {a}. // A comic-relief friend who never claimed to be brave
We can fix this. Right after {a}. // A sidekick with fixed priorities
In my defense, {b} looked fine yesterday. // A lovable disaster explaining the latest mess
Fun fact: {a} solves most problems, except {b}. // A chatty sidekick with questionable life advice`),
  ...t("streamer", `That's the stream! Thanks for hanging out, {a}. // A streamer ending a late session
Stay hydrated, stay kind, and I'll see you {b}. // A cozy streamer signing off for the night
Clip it, {a}. That was not supposed to work. // A gamer after an accidental perfect play
Welcome back to the chaos, {a}. // A high-energy streamer opening the show
If you're new, welcome. If you're not, {a}, you know the drill. // A variety streamer greeting both new and regular viewers
We go again {b}. Don't be late. // A streamer with a strict schedule and a sense of humor
Smash that follow, but only if you mean it, {a}. // A YouTuber who hates pushy sign-offs
GG, {a}. Take care of each other until {b}. // A friendly esports streamer closing out the night`),
  ...t("sports", `And {b} takes it all the way down the line! // A play-by-play announcer on a fast break
Hold on to your seats, because {b} is on the move! // A radio commentator as the pace picks up
Unbelievable! {b} has done it again! // A commentator after a last-second finish
Never count out {b}. Never. // A veteran analyst defending the underdog
{a} is on its feet, and that is the sound of belief! // An announcer describing a roaring stadium
That's the kind of finish that makes {a} lose its voice. // A broadcaster calling a game-winning moment
Tell me that wasn't art. {b} just painted it. // A color commentator admiring a perfect play
This game isn't over until {b} says it's over. // A coach-turned-commentator in the final minutes
Ladies and gentlemen, {b} has entered the building! // A ring-style announcer introducing a star`),
  ...t("motto", `Lead with {a}; the rest follows. // Someone with a clear compass and a tidy desk
Do the work. Let {a} do the talking. // A craftsperson who lets results speak
Choose {a} over {b}. // A personal motto for a hard decision
Make room for {a}, even on busy days. // A calm person with a packed calendar
Small steps, big {a}. // A coach, teacher or friend who believes in slow progress
Walk through {b} anyway. // Someone who has done the scary thing before
I trade {b} for {a} every single day. // A person who keeps their goals visible
Be so full of {a} that {b} has no room. // A positive, unshakeable friend
Even {b} can't outrun {a}. // A runner, writer or founder keeping going
Where there is {a}, {b} shrinks. // A quiet leader with steady habits`),
  ...t("brand", `{a}, delivered {b}. // A delivery or subscription brand's promise
Made for people who care about {a}. // A product page headline for a thoughtful brand
Where {a} comes standard. // A café, hotel or service that sets a high bar
Less hassle. More {a}. // A modern service tagline
The {a} you can trust. // A trustworthy local business
{a}, {b}. That's the promise. // A small brand that keeps its word
Because {a} should be easy. // A friendly app or tool slogan
Real {a}, for real life. // A down-to-earth consumer brand
Trusted for {a}, loved for the details. // A craft brand with loyal customers`),
];

export const CATCH_CATS: { id: CatchCat; label: string; short: string; emoji: string }[] = [
  { id: "hero", label: "🦸 Hero", short: "Hero", emoji: "🦸" },
  { id: "villain", label: "🦹 Villain", short: "Villain", emoji: "🦹" },
  { id: "sidekick", label: "🤪 Funny sidekick", short: "Funny sidekick", emoji: "🤪" },
  { id: "streamer", label: "🎮 Streamer sign-off", short: "Streamer", emoji: "🎮" },
  { id: "sports", label: "🏟️ Sports announcer", short: "Sports announcer", emoji: "🏟️" },
  { id: "motto", label: "🧭 Personal motto", short: "Personal motto", emoji: "🧭" },
  { id: "brand", label: "🏷️ Brand slogan", short: "Brand slogan", emoji: "🏷️" },
];

export const catchFilters: FilterGroup[] = [
  { id: "category", label: "Category", multi: true, options: CATCH_CATS.map((c) => ({ value: c.id, label: c.label })) },
];

const fill = (text: string, a: string, b: string) => text.replace("{a}", a).replace("{b}", b);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/([.!?] )([a-z])/g, (_m, p, c) => p + c.toUpperCase());
interface Extra { i: number; j: number }

/** Total number of distinct catchphrases the generator can produce. */
export const CATCH_TOTAL = new Set(
  CATCH_TEMPLATES.flatMap((tpl) => {
    const p = POOLS[tpl.cat];
    return p.a.flatMap((a) => p.b.map((b) => cap(fill(tpl.text, a, b))));
  }),
).size;

export const catchGenerator = comboGenerator<Template, Extra>({
  items: CATCH_TEMPLATES,
  baseKey: (tpl) => tpl.id,
  facets: { category: (tpl) => [tpl.cat] },
  extra: (tpl, rng) => {
    const p = POOLS[tpl.cat];
    const a = pick(p.a, rng);
    const b = pick(p.b, rng);
    return { i: p.a.indexOf(a), j: p.b.indexOf(b) };
  },
  extraKey: (e) => `${e.i}.${e.j}`,
  extraFromKey: (tpl, key) => {
    const m = /^(\d+)\.(\d+)$/.exec(key);
    const p = POOLS[tpl.cat];
    if (!m || +m[1] >= p.a.length || +m[2] >= p.b.length) return null;
    return { i: +m[1], j: +m[2] };
  },
  toResult: (tpl, { i, j }) => {
    const p = POOLS[tpl.cat];
    const cat = CATCH_CATS.find((c) => c.id === tpl.cat)!;
    return {
      title: cap(fill(tpl.text, p.a[i], p.b[j])),
      subtitle: `${cat.emoji} ${cat.short}`,
      detail: `Who would say it: ${tpl.who}.`,
    };
  },
  variety: (filters) => {
    const cats = filters.category?.length ? (filters.category as CatchCat[]) : (Object.keys(POOLS) as CatchCat[]);
    return Math.round(cats.reduce((n, c) => n + POOLS[c].a.length * POOLS[c].b.length, 0) / cats.length);
  },
});
