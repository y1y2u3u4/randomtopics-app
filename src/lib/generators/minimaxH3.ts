import { createRng, type Rng } from "@/lib/randomGenerators";

/**
 * MiniMax H3 (Hailuo 3) video prompt builder. Prompts follow the structure
 * H3 responds to best: reference roles → one-line brief → timed beats →
 * dialogue → sound → look → limits. All word banks are written by us.
 */

export const FIELDS = ["subject", "setting", "camera", "action", "dialogue", "sfx", "music", "look"] as const;
export type Field = (typeof FIELDS)[number];

export const FIELD_LABELS: Record<Field, string> = {
  subject: "Subject",
  setting: "Setting",
  camera: "Camera",
  action: "Action beats",
  dialogue: "Dialogue",
  sfx: "Sound effects",
  music: "Music",
  look: "Look",
};

export const DURATIONS = [5, 6, 10, 15] as const;
export type Duration = (typeof DURATIONS)[number];
export const ASPECTS = ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"] as const;
export type Aspect = (typeof ASPECTS)[number];

export interface Scenario {
  id: string;
  label: string;
  emoji: string;
  /** Noun used in the brief: "a 10-second 16:9 {kind}". */
  kind: string;
  subject: string[];
  setting: string[];
  /** Three-beat arcs: opening, middle, ending. */
  action: [string, string, string][];
  dialogue: string[];
  sfx: string[];
  music: string[];
  look: string[];
  limits: string;
}

export const CAMERAS = [
  "slow dolly-in from a medium shot to a close-up",
  "smooth lateral tracking shot at waist height",
  "handheld follow from behind, then a whip-pan to the face",
  "locked-off tripod wide shot, no camera movement",
  "low-angle push-in that ends looking up at the subject",
  "overhead top-down shot that slowly rotates 45 degrees",
  "crane up from ground level to a high wide view",
  "orbit 180 degrees around the subject at eye level",
  "rack focus from the foreground object to the subject",
  "slow pull-back reveal from an extreme close-up to a wide shot",
  "FPV drone glide through the space, then a gentle stop",
  "Dutch-angle handheld close-up with subtle shake",
];

export const SCENARIOS: Scenario[] = [
  {
    id: "cinematic",
    label: "Cinematic short",
    emoji: "🎬",
    kind: "cinematic film scene",
    subject: ["a tired detective in a wet trench coat", "a young astronaut holding her helmet", "an old lighthouse keeper with a lantern", "a runaway bride in a dusty gown", "a street violinist in a long scarf", "a boy carrying a paper boat"],
    setting: ["a neon-lit alley after rain", "an abandoned train station at dawn", "a wheat field under a storm front", "a rooftop overlooking a foggy city", "a candle-lit library with tall shelves", "a desert highway at golden hour"],
    action: [
      ["the subject stands still, breathing visibly in the cold air", "they turn as a distant sound catches their attention", "they take one decisive step forward and the frame holds"],
      ["the subject looks down at an object in their hand", "they close their fist and look up toward camera", "a gust of wind moves their hair and clothing as they walk off"],
      ["the subject waits beside a flickering light", "a shadow passes behind them and they freeze", "they slowly smile, as if they expected this"],
    ],
    dialogue: ["(quietly) \"I knew you'd come back.\"", "\"It's later than you think.\"", "(to themselves) \"One more time.\"", "\"Don't look behind you.\"", "No dialogue."],
    sfx: ["rain dripping from gutters and a distant siren", "wind across open ground and creaking metal", "footsteps on wet stone and a buzzing neon sign", "a clock ticking and pages turning"],
    music: ["low ambient synth pad that swells at the end", "solo cello, slow and mournful", "no music, sound design only", "sparse piano notes with long reverb"],
    look: ["anamorphic 2.39 look, teal-and-orange grade, soft film grain", "high-contrast noir lighting, deep shadows, wet reflections", "natural golden-hour light, shallow depth of field, 35mm feel", "cool blue moonlight with a single warm practical light"],
    limits: "keep one continuous shot, no cuts, no on-screen text, realistic hands and faces",
  },
  {
    id: "product",
    label: "Product ad",
    emoji: "🛍️",
    kind: "product commercial",
    subject: ["a glass perfume bottle", "a pair of white running shoes", "a matte-black wireless earbud case", "a ceramic coffee mug with steam", "a skincare serum dropper bottle", "a smartwatch with a woven strap"],
    setting: ["a sunlit pale-stone studio set", "a wet black reflective surface", "a pastel seamless backdrop with soft shadows", "a marble kitchen counter in morning light", "a floating set of geometric pedestals", "a misty forest floor with moss"],
    action: [
      ["the product sits centered and catches the light", "it rotates slowly to show the front label area", "it settles into a clean hero packshot"],
      ["water droplets fall in slow motion around the product", "a splash frames it from both sides", "the splash clears and the product gleams"],
      ["a hand places the product into frame", "the camera glides close to show the texture", "the hand leaves and the product rests in a final packshot"],
    ],
    dialogue: ["Voice-over: \"Made for the way you move.\"", "Voice-over: \"Less, but better.\"", "Voice-over: \"Your morning, upgraded.\"", "No dialogue."],
    sfx: ["one soft placement thud and quiet room tone", "slow-motion water splash and droplets", "a subtle click and fabric rustle", "a gentle whoosh on each movement"],
    music: ["minimal electronic beat, upbeat and clean", "warm acoustic guitar loop", "no music, room tone only", "airy ambient chords that resolve on the packshot"],
    look: ["premium commercial photography, soft directional key light, crisp edges", "high-gloss reflections, dark moody palette, rim light", "bright airy pastel palette, diffused light, no harsh shadows", "macro detail, shallow depth of field, slow-motion 120fps feel"],
    limits: "preserve the product's exact shape, color and label layout; no extra products, no added text or logos",
  },
  {
    id: "music",
    label: "Music video / singing",
    emoji: "🎤",
    kind: "music performance clip",
    subject: ["a soul singer in a sequined jacket", "a teenage rapper in a hoodie", "an indie folk singer with an acoustic guitar", "a K-pop style dancer in a white outfit", "a jazz vocalist at a vintage microphone", "a punk drummer with bleached hair"],
    setting: ["a small stage under one warm spotlight", "an empty parking garage with colored lights", "a rooftop at blue hour", "a smoky jazz club with round tables", "a sunflower field in summer", "a karaoke room with disco lights"],
    action: [
      ["close-up as the singer begins the first phrase", "the performer moves closer to the mic with eyes shut", "they hold the last note and open their eyes toward camera"],
      ["the dancer hits a sharp pose on the beat", "a fast combination of moves in sync with the rhythm", "a final freeze as the lights flash"],
      ["the musician tunes up and nods to the beat", "they launch into the chorus with energy", "they laugh and lower the instrument"],
    ],
    dialogue: ["Sings: \"Hold on, the night is young.\"", "Sings: \"I'm not who I was before.\"", "Raps: \"Started from the bottom of the stairs.\"", "Use the supplied audio for vocals only."],
    sfx: ["very low live-room ambience", "crowd cheering softly at the end", "mic feedback blip at the start", "no extra sound effects"],
    music: ["use the uploaded track as the only music", "upbeat pop beat at 120 BPM", "slow R&B groove with bass", "lo-fi hip-hop beat with vinyl crackle"],
    look: ["intimate live-session video, warm amber key light, dark background", "music-video color wash, magenta and cyan gels, haze", "sunny handheld 16mm film look, light leaks", "glossy high-key studio light, clean white set"],
    limits: "realistic mouth movement and breathing; lip-sync matches the vocal timing; do not change the lyrics",
  },
  {
    id: "dialogue",
    label: "Dialogue scene",
    emoji: "💬",
    kind: "two-person dialogue scene",
    subject: ["two old friends meeting after years", "a nervous job candidate and an interviewer", "a couple arguing in a car", "a barista and a regular customer", "a teacher and a student after class", "two astronauts on a space station"],
    setting: ["a corner café with rainy windows", "a parked car at night under a streetlight", "a bright office meeting room", "an empty classroom in afternoon light", "the window module of a space station", "a park bench in autumn"],
    action: [
      ["over-the-shoulder on the first speaker as they deliver the opening line", "cut to the listener reacting with a small pause", "a two-shot as both of them laugh"],
      ["the first person slides an envelope across the table", "the second person opens it and their face changes", "they look up and speak the reply"],
      ["both sit in silence looking forward", "one turns and says the line quietly", "the other finally turns toward them"],
    ],
    dialogue: ["A: \"You kept it all this time?\" B: \"Of course I did.\"", "A: \"So, why should we hire you?\" B: \"Because I never quit.\"", "A: \"We missed the exit.\" B: \"We missed a lot of things.\"", "A: \"The usual?\" B: \"Surprise me today.\""],
    sfx: ["café chatter and cups clinking in the background", "rain on the car roof and wipers", "air-conditioning hum and a pen clicking", "station life-support hum and soft beeps"],
    music: ["no music, natural ambience only", "soft piano that enters on the last line", "light acoustic underscore", "subtle warm strings"],
    look: ["naturalistic indie-film look, soft window light", "warm practical lights, shallow depth of field", "clean corporate look, even lighting", "cool sci-fi palette with white panels"],
    limits: "clear lip-sync on each line, consistent faces across shots, no on-screen subtitles",
  },
  {
    id: "anime",
    label: "Anime style",
    emoji: "🌸",
    kind: "anime-style animated scene",
    subject: ["a schoolgirl with a red scarf", "a young swordsman with a bandaged arm", "a shy boy with a stray cat", "a witch apprentice on a broom", "a giant friendly forest spirit", "a mecha pilot in a cockpit"],
    setting: ["a train platform under cherry blossoms", "a seaside town at sunset", "a rooftop with laundry lines", "a magical forest with glowing spores", "a rainy shopping street with umbrellas", "a city skyline at night"],
    action: [
      ["petals drift past as the character looks up", "a strong breeze lifts their hair and scarf", "they smile and run out of frame"],
      ["the character draws a sword in one fluid motion", "speed lines and a dramatic pose", "the blade glints as the camera pushes in on the eyes"],
      ["the character crouches to offer a hand", "the creature hesitates then steps closer", "both sit together watching the sky"],
    ],
    dialogue: ["(softly) \"I'll find you again, I promise.\"", "\"This time, I won't run.\"", "\"You're not alone anymore.\"", "No dialogue."],
    sfx: ["cicadas and distant train bell", "wind gust and fabric flapping", "sword unsheathing ring", "gentle rain on umbrellas"],
    music: ["emotional piano with strings", "upbeat J-pop opening style", "no music, ambience only", "dreamy music-box melody"],
    look: ["hand-painted 2D anime background, soft cel shading, vivid sky", "dramatic shonen action framing, bold lines, speed lines", "warm Ghibli-inspired watercolor palette", "cyberpunk anime neon palette"],
    limits: "consistent character design throughout, 2D animation only, no photorealism, no text",
  },
  {
    id: "nature",
    label: "Nature / documentary",
    emoji: "🌿",
    kind: "nature documentary shot",
    subject: ["a red fox in fresh snow", "a humpback whale breaching", "a hummingbird at a flower", "a herd of wild horses", "a chameleon on a branch", "a snow leopard on a ridge"],
    setting: ["a frozen pine forest at sunrise", "the open ocean under grey skies", "a tropical garden in morning mist", "windswept grassland", "a rainforest canopy", "a Himalayan rocky ridge"],
    action: [
      ["the animal pauses and listens", "it pounces or moves suddenly", "it settles and looks toward the lens"],
      ["a slow approach through the landscape", "the animal stops at the edge of frame", "a wider reveal of the whole environment"],
      ["extreme close-up of eyes and texture", "the animal turns its head", "pull back to show it in its habitat"],
    ],
    dialogue: ["Narrator: \"Here, every second counts.\"", "Narrator: \"Few humans have ever seen this.\"", "Narrator: \"Winter tests everything.\"", "No narration."],
    sfx: ["crunching snow and soft breath", "ocean swell and whale blow", "rapid wing hum and birdsong", "wind through grass and distant hooves"],
    music: ["no music, natural sound only", "orchestral swell with French horns", "gentle ambient strings", "minimal marimba pattern"],
    look: ["telephoto wildlife look, creamy background blur", "4K documentary realism, natural light", "slow-motion macro detail", "golden backlight with rim on fur"],
    limits: "realistic animal anatomy and movement, no humans, no text",
  },
  {
    id: "horror",
    label: "Horror / suspense",
    emoji: "🕯️",
    kind: "suspense horror scene",
    subject: ["a babysitter alone in a big house", "a hiker lost after dark", "a night-shift nurse", "a child holding a flashlight", "a security guard on patrol", "a woman checking an old attic"],
    setting: ["a dim hallway with one flickering bulb", "a foggy forest trail at night", "an empty hospital corridor", "a basement full of boxes", "a closed shopping mall at 3 a.m.", "a dusty attic with covered furniture"],
    action: [
      ["the character walks slowly, checking behind them", "a door at the end creaks open by itself", "they freeze and the light goes out"],
      ["the flashlight beam sweeps across the room", "something moves at the edge of the beam", "the beam snaps back and nothing is there"],
      ["the character hears a whisper and stops", "they slowly turn their head", "a hard cut to black on their gasp"],
    ],
    dialogue: ["(whispering) \"Hello? Is someone there?\"", "\"That wasn't there before.\"", "(on the phone) \"I think it's in the house.\"", "No dialogue."],
    sfx: ["creaking floorboards and distant dripping", "low drone, heartbeat and a sudden bang", "flickering electrical buzz", "wind howling through gaps"],
    music: ["tense low string drone", "no music, silence then a stinger", "dissonant piano notes", "deep sub-bass pulse"],
    look: ["desaturated cold palette, heavy shadows, film grain", "found-footage handheld look, night vision green", "single warm light source, deep black", "foggy diffused light, muted colors"],
    limits: "no gore, keep the threat unseen, one continuous shot",
  },
  {
    id: "food",
    label: "Food & cooking",
    emoji: "🍜",
    kind: "food commercial",
    subject: ["a bowl of steaming ramen", "a stack of fluffy pancakes with syrup", "a wood-fired margherita pizza", "a chocolate lava cake", "a fresh fruit smoothie", "sizzling street tacos"],
    setting: ["a rustic wooden table by a window", "a busy open kitchen", "a night-market stall with warm bulbs", "a minimal white studio set", "a sunny picnic blanket", "a cozy diner counter"],
    action: [
      ["chopsticks lift noodles in slow motion", "steam curls upward through the backlight", "the bowl rests in a final hero shot"],
      ["syrup pours over the top in a slow ribbon", "a pat of butter melts and slides", "a fork cuts in to show the inside"],
      ["the chef sprinkles the last garnish", "flames or steam flare for a moment", "the plate slides toward camera"],
    ],
    dialogue: ["Voice-over: \"Made fresh, every single day.\"", "Chef: \"Now that's perfect.\"", "No dialogue."],
    sfx: ["sizzling pan and bubbling broth", "slow syrup drip and fork clink", "crackling wood fire", "ice clinking and a blender whir"],
    music: ["warm jazzy guitar", "upbeat ukulele", "no music, cooking sounds only", "lo-fi beat"],
    look: ["macro food photography, warm backlight, visible steam", "bright airy natural light, soft shadows", "moody dark background with a single key light", "vibrant street-food colors, handheld energy"],
    limits: "appetizing realistic textures, no extra people, no text or logos",
  },
  {
    id: "travel",
    label: "Travel vlog",
    emoji: "✈️",
    kind: "travel vlog clip",
    subject: ["a backpacker with a film camera", "a couple on a scooter", "a solo traveler in a straw hat", "a family with a map", "a cyclist with panniers", "a surfer carrying a board"],
    setting: ["a cliffside village above the sea", "a lantern-lit old town street", "a mountain lake at sunrise", "a bustling spice market", "a coastal road with palm trees", "a snowy alpine train window"],
    action: [
      ["the traveler walks into frame and looks around in awe", "they raise a camera to take a photo", "they turn to the lens and grin"],
      ["point-of-view walking through the crowd", "a pause at a stall to taste something", "a laugh and a thumbs-up to camera"],
      ["a wide establishing shot of the place", "a cut to the traveler arriving", "they sit down and take in the view"],
    ],
    dialogue: ["(to camera) \"Okay, this view is unreal.\"", "(to camera) \"Day three and I'm never leaving.\"", "(to camera) \"You have to try this.\"", "No dialogue."],
    sfx: ["seagulls and waves below", "market chatter and sizzling food", "wind and distant church bells", "scooter engine and horns"],
    music: ["upbeat indie pop", "chill acoustic travel beat", "no music, natural ambience", "tropical house"],
    look: ["bright vlog look, natural colors, slight handheld", "warm golden-hour grade, light lens flare", "crisp morning light, high clarity", "cinematic travel film, teal-orange grade"],
    limits: "consistent person throughout, natural movement, no on-screen text",
  },
  {
    id: "sports",
    label: "Sports & action",
    emoji: "🏀",
    kind: "sports action clip",
    subject: ["a streetball player", "a skateboarder", "a sprinter in the blocks", "a boxer in training", "a snowboarder", "a rock climber"],
    setting: ["an outdoor court at dusk", "a concrete skatepark", "an empty stadium track", "a gritty boxing gym", "a powder slope", "a sandstone cliff"],
    action: [
      ["the athlete gets set, focused", "an explosive move in slow motion", "landing or follow-through in real time"],
      ["a quick dribble or approach", "the key move at peak height", "a celebration toward camera"],
      ["close-up of hands chalking or gripping", "the effort shown in full", "exhausted breath and a nod"],
    ],
    dialogue: ["(under their breath) \"Let's go.\"", "Coach: \"Again!\"", "No dialogue."],
    sfx: ["sneaker squeaks and ball bounce", "skate wheels on concrete", "punch impacts and heavy breathing", "wind rush and snow spray"],
    music: ["hard-hitting hip-hop beat", "epic orchestral hit", "no music, raw sound", "driving rock riff"],
    look: ["high-speed slow motion, crisp detail, dramatic light", "gritty high-contrast sports ad", "bright sunny action camera look", "backlit silhouette moments"],
    limits: "realistic body mechanics and physics, consistent athlete, no logos",
  },
];

export const byScenario = new Map(SCENARIOS.map((s) => [s.id, s]));

export type Draft = Record<Field, string>;
export type Locks = Partial<Record<Field, boolean>>;

function pick<T>(list: readonly T[], rng: Rng): T {
  return list[Math.floor(rng() * list.length)];
}

function fieldValue(field: Field, s: Scenario, rng: Rng): string {
  if (field === "camera") return pick(CAMERAS, rng);
  if (field === "action") return pick(s.action, rng).join(" | ");
  return pick(s[field], rng);
}

/** Roll every unlocked field; locked fields keep `prev`'s value. */
export function rollDraft(s: Scenario, seed: number, prev?: Draft, locks: Locks = {}): Draft {
  const rng = createRng(seed);
  const out = {} as Draft;
  for (const f of FIELDS) {
    let v = fieldValue(f, s, rng);
    if (prev && locks[f]) v = prev[f];
    else if (prev && s[f as keyof Scenario] && v === prev[f]) v = fieldValue(f, s, rng);
    out[f] = v;
  }
  return out;
}

export function rerollField(s: Scenario, field: Field, current: Draft, seed: number): Draft {
  const rng = createRng(seed);
  let v = fieldValue(field, s, rng);
  for (let i = 0; i < 4 && v === current[field]; i++) v = fieldValue(field, s, rng);
  return { ...current, [field]: v };
}

/** Split a clip into three timed beats, e.g. 10 s → 0–3, 3–7, 7–10. */
export function beatTimes(d: Duration): [number, number][] {
  const a = Math.round(d * 0.3);
  const b = Math.round(d * 0.7);
  return [[0, a], [a, b], [b, d]];
}

export interface Refs {
  image: boolean;
  video: boolean;
  audio: boolean;
}

export function buildPrompt(s: Scenario, d: Draft, duration: Duration, aspect: Aspect, refs: Refs): string {
  const lines: string[] = [];
  const refLines: string[] = [];
  if (refs.image) refLines.push("Use Image 1 for the subject's identity, appearance and colors.");
  if (refs.video) refLines.push("Use Video 1 only for camera movement and pacing; borrow no people or objects from it.");
  if (refs.audio) refLines.push("Use Audio 1 for the voice and timing.");
  if (refLines.length) lines.push(refLines.join(" "));
  lines.push(`Create a ${duration}-second ${aspect} ${s.kind} of ${d.subject}. Setting: ${d.setting}. Camera: ${d.camera}.`);
  const beats = d.action.split(" | ");
  beatTimes(duration).forEach(([from, to], i) => lines.push(`${from}–${to}s: ${beats[i] ?? beats[beats.length - 1]}.`));
  lines.push(d.dialogue === "No dialogue." || d.dialogue === "No narration." ? "Dialogue: none." : `Dialogue: ${d.dialogue}`);
  lines.push(`Sound: ${d.sfx}. Music: ${d.music}.`);
  lines.push(`Look: ${d.look}.`);
  lines.push(`Limits: ${s.limits}.`);
  return lines.join("\n");
}

/** Total distinct prompts per scenario (excluding duration/aspect/refs). */
export function combos(s: Scenario) {
  return s.subject.length * s.setting.length * CAMERAS.length * s.action.length * s.dialogue.length * s.sfx.length * s.music.length * s.look.length;
}
