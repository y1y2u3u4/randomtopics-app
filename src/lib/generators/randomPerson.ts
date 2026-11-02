import names from "@/data/generators/characterNames.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// A random person for stories, games, improv and drawing practice: a job fitted
// to the setting and age, two looks plus a signature piece of clothing, a
// personality, a goal, a secret and a habit. Names come from the shared
// character-name data (read-only). This is not test data: there is no address,
// email or phone number; that is what the fake person generator is for.
export type Setting = "modern" | "historical" | "fantasy" | "scifi";
export type AgeGroup = "teen" | "young" | "adult" | "mid" | "senior";
interface First { name: string; gender: "male" | "female" | "neutral"; genres: string[]; meaning: string }
interface Last { name: string; genres: string[]; meaning: string }
interface Job { job: string; setting: Setting; ages: AgeGroup[] }

const FIRST = names.first as First[];
const LAST = names.last as Last[];

const AGE_CODE: Record<string, AgeGroup> = { t: "teen", y: "young", a: "adult", m: "mid", s: "senior" };
const AGE_RANGE: Record<AgeGroup, [number, number]> = { teen: [13, 17], young: [18, 29], adult: [30, 49], mid: [50, 64], senior: [65, 88] };

const jobs = (setting: Setting, list: string): Job[] =>
  list.split("; ").map((e) => { const [job, codes] = e.split(":"); return { job, setting, ages: codes.split("").map((c) => AGE_CODE[c]) }; });

export const JOBS: Job[] = [
  ...jobs("modern", "Barista:tya; Nurse:yam; Bus driver:yams; Middle-school teacher:yam; Food-truck cook:yam; Freelance illustrator:yam; Delivery rider:ya; Librarian:yams; Electrician:yams; Paralegal:ya; Retired mail carrier:s; Student and part-time cashier:t; Dog walker:tya; Taxi driver:yams; Real-estate agent:am; Tattoo artist:ya; Night-shift security guard:yams; Florist:yams; Software tester:ya; Hospital cleaner:yams; Community-radio host:yams; Paper-route kid:t; Piano tutor:yams; Small-town mayor:ms"),
  ...jobs("historical", "Blacksmith's apprentice:t; Seamstress:yams; Telegraph operator:ya; Printer:yam; Lighthouse keeper:ams; Ship's cook:yam; Street flower seller:tya; Schoolmistress:yam; Apothecary:yams; Railway porter:ya; Midwife:ams; Newspaper boy:t; Lamplighter:yams; Dockworker:yam; Retired sea captain:s; Innkeeper:yams; Clockmaker:yams; Mill worker:tyam; Travelling photographer:ya; Village postmaster:ams"),
  ...jobs("fantasy", "Stable hand:ty; Tavern keeper:yams; Wandering bard:ya; Herbalist:yams; Guard captain:am; Court scribe:yam; Cartographer:yam; Retired adventurer:ms; Blacksmith:yam; Fisher on the river:tyam; Apprentice mage:ty; Caravan driver:yam; Temple keeper:ams; Ratcatcher:ya; Fortune teller:yams; Mapless pathfinder:ya; Bounty hunter:ya; Alchemist's assistant:ty; Village elder:s; Dragon-egg trader:yam"),
  ...jobs("scifi", "Cargo pilot:yam; Ship mechanic:yams; Colony doctor:yam; Hydroponics farmer:yams; Station janitor:yams; Data courier:ya; Asteroid miner:yam; Android repair tech:ya; Retired navigator:s; Cadet at a flight academy:t; Black-market dealer:yam; Xenobiologist:yam; Comms operator:ya; Drone racer:tya; Colony teacher:yam; Customs inspector:ams; Bounty runner:ya; Cook on a long-haul freighter:yams"),
];

const l = (s: string) => s.split("; ");
export const LOOKS = l("a crooked nose, broken once; a scar through one eyebrow; bright freckles across the shoulders; very tall and a little stooped; short, with a wide, quick stride; always a day's stubble; gap between the front teeth; one eye slightly lighter than the other; hair that never stays tied; a long braid down the back; cropped hair, uneven at the edges; heavy-lidded, tired-looking eyes; ink-stained fingertips; a strong laugh line on one side; large, expressive hands; a small birthmark below the ear; sunburned nose; thick eyebrows that do most of the talking; a pale streak in dark hair; round glasses, often pushed up; very upright posture; a limp on bad days; deep dimples; a silver tooth; chapped lips, always chewing them; cheekbones sharp enough to notice; a lopsided smile; hands calloused from work; messy curls; neat grey at the temples");
export const TRAITS = l("patient to a fault; sharp-tongued but kind; a nervous talker; stubbornly honest; endlessly curious; suspicious of free offers; a born storyteller; generous to strangers; hates being late; competitive in small things; quietly proud; always the peacemaker; cheerfully reckless; a worrier who hides it; dry, deadpan humor; loyal to a fault; easily distracted; cannot say no; lonely but sociable; cautious with new people; full of unfinished projects; fiercely protective of the young; overly polite when angry; a good listener");
export const GOALS = l("to repay a debt before it is called in; to be taken seriously by their family; to save enough to leave town; to find a sibling they lost touch with; to finish one thing they started years ago; to win a local contest; to learn a skill they were told they were too old for; to prove an old rival wrong; to get one good night's sleep; to build something that outlasts them; to make peace with a former friend; to be left alone for a year; to see the sea; to protect a younger relative; to earn a promotion without begging; to clear a name; to find a place to call home; to be remembered kindly; to keep a failing business open one more season; to escape a bad reputation");
export const SECRETS = l("has been faking one qualification; is secretly writing a novel; once took the blame for someone else; owes money to the wrong people; reads other people's letters; is afraid of something silly, like birds; has a second life under another name; lied about where they grew up; can't read well and hides it; is saving for a gift they will never give; keeps a keepsake from someone they should have forgotten; knows who did something terrible and has stayed silent; feeds a stray no one else knows about; once ran away from home; has never told anyone they are lonely; is quietly leaving soon; stole something small long ago; is a much better cook or fighter than they admit; made a promise they cannot keep; has a famous relative they never mention");
export const HABITS = l("hums off-key while working; counts coins twice; taps the table three times before speaking; saves leftover bread for birds; writes lists on their hand; wears the same scarf all year; checks the locks twice; apologizes to furniture; never sits with their back to a door; keeps one pocket full of buttons; talks to themselves in a second language; collects free pens; gives nicknames to everyone; sips tea until it's cold; doodles faces in margins; whistles when nervous; tells the same joke too often; tucks notes in books; stands when they're thinking; adjusts their collar when lying");

const WEAR: Record<Setting, string[]> = {
  modern: l("a faded denim jacket; a hoodie two sizes too big; a crisp work shirt with the sleeves rolled; a thrifted band T-shirt; a bright yellow raincoat; worn boots and a canvas tote; a cardigan with a missing button; a lanyard they forgot to take off"),
  historical: l("a patched wool coat; an apron with deep pockets; a hat that's seen better years; a waistcoat with a gold chain; heavy boots dusted with soot; a shawl pinned with a brooch; shirtsleeves and suspenders; a long dark dress with a stained hem"),
  fantasy: l("a travel-stained green cloak; leather bracers worn smooth; a robe with ink on the cuffs; a rope belt with a dozen pouches; a feathered cap; a mismatched pair of gloves; a hooded coat of patched fur; a scarf the color of old wine"),
  scifi: l("a flight jacket with mission patches; coveralls smudged with grease; a rebreather clipped to the belt; a long coat with a glowing collar; a visor pushed up on the forehead; sturdy mag boots; a sleeveless vest with rows of tools; a faded uniform they refuse to replace"),
};

export const SETTINGS: { id: Setting; label: string; short: string }[] = [
  { id: "modern", label: "🏙️ Modern", short: "Modern" },
  { id: "historical", label: "🕰️ Historical", short: "Historical" },
  { id: "fantasy", label: "🐉 Fantasy", short: "Fantasy" },
  { id: "scifi", label: "🚀 Sci-fi", short: "Sci-fi" },
];
export const AGE_GROUPS: { id: AgeGroup; label: string }[] = [
  { id: "teen", label: "Teen (13–17)" },
  { id: "young", label: "Young adult (18–29)" },
  { id: "adult", label: "Adult (30–49)" },
  { id: "mid", label: "Middle-aged (50–64)" },
  { id: "senior", label: "Senior (65+)" },
];

export const personFilters: FilterGroup[] = [
  { id: "where", label: "Setting", multi: true, options: SETTINGS.map((s) => ({ value: s.id, label: s.label })) },
  { id: "level", label: "Age group", multi: true, options: AGE_GROUPS.map((a) => ({ value: a.id, label: a.label })) },
  {
    id: "gender",
    label: "Gender",
    multi: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "neutral", label: "Gender-neutral" },
    ],
  },
];

interface Extra { first: string; last: string; age: number; look1: number; look2: number; wear: number; trait: number; goal: number; secret: number; habit: number }
const firstByName = new Map(FIRST.map((f) => [f.name, f]));
const lastByName = new Map(LAST.map((x) => [x.name, x]));
const NUM_KEYS = ["age", "look1", "look2", "wear", "trait", "goal", "secret", "habit"] as const;

export const personGenerator = comboGenerator<Job, Extra>({
  items: JOBS,
  baseKey: (j) => j.job,
  facets: { where: (j) => [j.setting], level: (j) => j.ages },
  extra: (j, rng, filters) => {
    const rand = (n: number) => Math.floor(rng() * n);
    const wanted = (filters.level ?? []) as AgeGroup[];
    const groups = wanted.length ? j.ages.filter((a) => wanted.includes(a)) : j.ages;
    const [lo, hi] = AGE_RANGE[pick(groups, rng)];
    const genders = filters.gender ?? [];
    let firsts = FIRST.filter((f) => f.genres.includes(j.setting) && (!genders.length || genders.includes(f.gender)));
    if (!firsts.length) firsts = FIRST.filter((f) => f.genres.includes(j.setting));
    const lasts = LAST.filter((x) => x.genres.includes(j.setting));
    const look1 = rand(LOOKS.length);
    let look2 = rand(LOOKS.length - 1);
    if (look2 >= look1) look2++;
    return {
      first: pick(firsts, rng).name,
      last: (lasts.length ? pick(lasts, rng) : pick(LAST, rng)).name,
      age: lo + rand(hi - lo + 1),
      look1, look2,
      wear: rand(WEAR[j.setting].length),
      trait: rand(TRAITS.length), goal: rand(GOALS.length), secret: rand(SECRETS.length), habit: rand(HABITS.length),
    };
  },
  extraKey: (e) => [e.first, e.last, ...NUM_KEYS.map((k) => e[k])].join("."),
  extraFromKey: (j, key) => {
    const p = key.split(".");
    if (p.length !== 2 + NUM_KEYS.length || !firstByName.has(p[0]) || !lastByName.has(p[1])) return null;
    const n = p.slice(2).map(Number);
    if (n.some((x) => !Number.isInteger(x) || x < 0)) return null;
    const [age, look1, look2, wear, trait, goal, secret, habit] = n;
    if (age > 120 || look1 >= LOOKS.length || look2 >= LOOKS.length || wear >= WEAR[j.setting].length) return null;
    if (trait >= TRAITS.length || goal >= GOALS.length || secret >= SECRETS.length || habit >= HABITS.length) return null;
    return { first: p[0], last: p[1], age, look1, look2, wear, trait, goal, secret, habit };
  },
  toResult: (j, e) => ({
    title: `${e.first} ${e.last}, ${e.age}`,
    subtitle: `${j.job} · ${SETTINGS.find((s) => s.id === j.setting)?.short} · ${TRAITS[e.trait]}`,
    detail: [
      `Look: ${LOOKS[e.look1]}; ${LOOKS[e.look2]}; wears ${WEAR[j.setting][e.wear]}`,
      `Goal: ${GOALS[e.goal]}`,
      `Secret: ${SECRETS[e.secret]}`,
      `Habit: ${HABITS[e.habit]}`,
    ].join(" · "),
  }),
  variety: () => 1000,
});
