import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Each power has a category, a power level and a plain description of what it
// actually does. A weakness is drawn for it so the result is ready to use for a
// character, a story prompt or a "would you rather" debate.
export type PowerCategory = "elemental" | "mind" | "body" | "cosmic" | "weird";
export type PowerTier = "street" | "city" | "world";
interface Power { name: string; category: PowerCategory; tier: PowerTier; does: string }

const powers = (category: PowerCategory, list: string): Power[] =>
  list.split("; ").map((p) => {
    const [name, tier, does] = p.split(" | ");
    return { name, category, tier: tier as PowerTier, does };
  });

export const POWERS: Power[] = [
  ...powers("elemental", "Pyrokinesis | city | create and steer fire, from a candle flame to a wall of heat; Cryokinesis | city | freeze water, air and surfaces, and build ice bridges or shields; Hydrokinesis | city | move any water you can see, from a glass to a river; Aerokinesis | city | push, lift and spin the air, enough to glide or knock people over; Geokinesis | world | shift rock and soil, open the ground or raise stone walls; Electrokinesis | city | store electricity in your body and release it as bolts or pulses; Weather control | world | build storms, clear skies or call lightning over a whole region; Magma body | city | turn your body into slow, glowing lava; Plant growth | street | make plants grow years in seconds and move their roots and vines; Sand shaping | street | turn sand and dust into blades, walls or a moving cloud; Light bending | city | bend light into beams, shields or blinding flashes; Sound blast | street | release your voice as a force that cracks glass and knocks people back; Metal bending | city | shape and move metal as if it were clay; Smoke form | street | turn into smoke to slip through gaps and choke a room; Magnetism | world | pull and push anything magnetic, from coins to cars to satellites; Lava sea | world | open fissures that flood an area with magma; Fog walker | street | call a thick fog and see perfectly inside it; Rain calling | street | make it rain on one spot, for as long as you concentrate; Crystal growth | city | grow hard crystal from any surface for armor or weapons; Heat absorption | street | pull heat out of things to cool, freeze or put out fires"),
  ...powers("mind", "Telepathy | city | hear surface thoughts of anyone within about 50 meters; Telekinesis | city | lift and move objects with your mind, up to the weight of a car; Precognition | world | see flashes of the next 10 seconds of your own future; Mind control | world | give short commands that people must follow for a minute; Photographic memory | street | remember everything you have ever seen or read, perfectly; Illusion casting | city | make other people see and hear things that are not there; Emotion reading | street | sense exactly what anyone near you feels; Psychometry | street | touch an object and see its history; Dream walking | city | enter other people's dreams and talk to them; Memory editing | world | remove or change a single memory in someone's mind; Lie detection | street | always know when someone tells you a lie; Danger sense | street | feel a warning a few seconds before you are harmed; Instant learning | city | master any skill after watching it done once; Astral projection | city | leave your body as an invisible spirit that can travel and spy; Animal speech | street | understand and talk to any animal; Mental shield | street | no one can read, control or trick your mind; Super intelligence | world | think a thousand times faster than a normal person; Pain projection | city | make anyone you look at feel your pain; Language mastery | street | understand and speak every language, including dead ones; Hive mind | world | link the minds of a group so they think and act as one"),
  ...powers("body", "Super strength | city | lift a truck and punch through walls; Super speed | city | run faster than a car and react in a blink; Invulnerability | world | bullets, blades and falls do not harm you; Healing factor | city | recover from any wound in minutes; Shape-shifting | world | take the form of any person or animal you have seen; Elasticity | street | stretch your body like rubber, up to 30 meters; Invisibility | city | become completely unseen, along with what you hold; Flight | city | fly at the speed of a small plane; Wall crawling | street | climb any surface, even upside down; Night vision | street | see clearly in total darkness; Size shifting | city | shrink to ant size or grow to three stories tall; Animal mimicry | street | copy the ability of any animal you touch; Underwater breathing | street | breathe water and swim like a dolphin; Super senses | street | hear a whisper across a stadium and smell a lie; Bone armor | street | grow hard bone plates and spikes from your skin; Duplication | city | split into up to five copies of yourself; Density control | city | become as hard as steel or pass through walls like a ghost; Poison immunity | street | no poison, toxin or illness can harm you; Endless stamina | street | never get tired or need to sleep; Age control | world | stop aging, or turn back your own body's clock"),
  ...powers("cosmic", "Teleportation | world | instantly move to any place you have seen; Time stop | world | freeze time for everyone except yourself for 10 seconds; Time travel | world | travel to any point in the past, once per day; Gravity control | world | make things weightless or crush them under 100× gravity; Portal creation | world | open a doorway between any two places; Star power | world | absorb sunlight and release it as blasts of solar energy; Reality warping | world | change small facts about the world around you; Dimension hopping | world | step into parallel worlds that are slightly different; Black hole creation | world | make a tiny black hole that swallows anything nearby; Cosmic awareness | world | know anything happening anywhere in the universe, briefly; Energy absorption | city | soak up any energy attack and fire it back; Space survival | city | live in the vacuum of space without air or a suit; Matter creation | world | create any simple object out of nothing; Life force sight | street | see how much life is left in any living thing; Probability control | city | make unlikely things happen in your favour; Resurrection | world | come back to life once after you die; Time rewind | world | undo the last 60 seconds for everyone; Star map | street | always know where you are and the way home; Void shield | city | create a sphere of nothing that blocks everything; Planet sense | world | feel every earthquake, storm and volcano on the planet"),
  ...powers("weird", "Toast perfection | street | always make perfect toast, from any bread, with any toaster; Lost item finder | street | instantly know where any lost item is; Parking luck | street | always find a parking space right at the door; Perfect pitch replay | street | perfectly repeat any sound you have ever heard; Plant whisperer | street | make house plants grow faster by talking to them; Never get lost | street | always know the right way to anywhere; Elevator summoning | street | elevators arrive the moment you press the button; Instant nap | street | fall asleep anywhere and wake up fully rested in 10 minutes; Cat magnet | street | every cat in the area wants to be your friend; Weather taste | street | taste tomorrow's weather in the air; Sock matching | street | always find the matching sock; Mood music | street | a soundtrack only you can hear plays to match the moment; Spoiler immunity | street | you can never accidentally learn how a story ends; Wi-Fi sense | street | feel where the strongest signal is; Stop hiccups | street | cure anyone's hiccups by touching them; Talk to furniture | street | chairs and tables tell you who sat on them; Glow on demand | street | make your skin glow like a soft lamp; Perfect timing | city | always arrive exactly when you are needed; Food duplication | city | copy any food you have eaten once; Bubble making | street | make indestructible bubbles that float you short distances"),
];

const WEAKNESSES = [
  "only works while you hold your breath", "stops working when it rains", "costs you one memory each time you use it", "leaves you exhausted for an hour afterwards",
  "anyone touching you gets the power too", "fails if you feel afraid", "only works in the dark", "only works in sunlight", "makes a loud ringing sound every time",
  "works on everyone except the person you love", "can only be used once per day", "causes painful headaches", "only works when you are telling the truth",
  "turns your hair white a little more each use", "stops working near iron", "you have to say the power's name out loud", "it lasts only 30 seconds",
  "it gets weaker the longer you go without sleep", "a random animal follows you for a day after each use", "it only works on Tuesdays",
  "anyone can stop it by saying your full name", "it makes you uncontrollably hungry", "you lose your sense of taste while it is active", "it only works while you are barefoot",
  "your eyes glow so everyone knows you are using it", "it only works within 100 meters of your home", "it hurts the user as much as the target", "loud music cancels it",
];

export const POWER_CATEGORIES: { id: PowerCategory; label: string; short: string }[] = [
  { id: "elemental", label: "🔥 Elemental", short: "Elemental" },
  { id: "mind", label: "🧠 Mind", short: "Mind" },
  { id: "body", label: "💪 Body", short: "Body" },
  { id: "cosmic", label: "🌌 Cosmic", short: "Cosmic" },
  { id: "weird", label: "🤪 Weird & funny", short: "Weird & funny" },
];

export const POWER_TIERS: { id: PowerTier; label: string; short: string }[] = [
  { id: "street", label: "Street level", short: "Street level" },
  { id: "city", label: "City level", short: "City level" },
  { id: "world", label: "World level", short: "World level" },
];

export const superpowerFilters: FilterGroup[] = [
  { id: "category", label: "Category", multi: true, options: POWER_CATEGORIES.map((c) => ({ value: c.id, label: c.label })) },
  { id: "tier", label: "Power level", multi: true, options: POWER_TIERS.map((t) => ({ value: t.id, label: t.label })) },
  {
    id: "weakness",
    label: "Weakness",
    options: [
      { value: "on", label: "Add a weakness" },
      { value: "off", label: "No weakness" },
    ],
  },
];

const tierIcon: Record<PowerTier, string> = { street: "⚡", city: "⚡⚡", world: "⚡⚡⚡" };

export const superpowerGenerator = comboGenerator<Power, string>({
  items: POWERS,
  baseKey: (p) => p.name,
  facets: { category: (p) => [p.category], tier: (p) => [p.tier] },
  extra: (_p, rng, filters) => ((filters.weakness?.[0] ?? "on") === "on" ? pick(WEAKNESSES, rng) : ""),
  extraKey: (w) => w,
  extraFromKey: (_p, key) => (!key || WEAKNESSES.includes(key) ? key : null),
  toResult: (p, w) => ({
    title: p.name,
    subtitle: `${tierIcon[p.tier]} ${POWER_TIERS.find((t) => t.id === p.tier)?.short} · ${POWER_CATEGORIES.find((c) => c.id === p.category)?.short}`,
    detail: [`You can ${p.does}.`, w ? `Weakness: ${w}.` : ""].filter(Boolean).join(" "),
  }),
  variety: (filters) => ((filters.weakness?.[0] ?? "on") === "on" ? WEAKNESSES.length : 1),
});
