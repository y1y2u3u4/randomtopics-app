// AI prompt generator: build image, video and ChatGPT-writing prompts from combinable options.
// Pure functions only — the page renders the default prompt on the server, the client re-builds it live.
import type { Rng } from "@/lib/randomGenerators";

export type Mode = "image" | "video" | "writing";

export interface Option { id: string; label: string; text: string }
export interface Field { id: string; label: string; multi?: boolean; options: Option[] }
export interface Target { id: string; label: string; hint: string }
export interface Preset { id: string; label: string; idea: string; picks: Picks; target?: string }
export interface ModeDef {
  id: Mode;
  label: string;
  emoji: string;
  ideaLabel: string;
  ideaPlaceholder: string;
  defaultIdea: string;
  fields: Field[];
  targets: Target[];
  presets: Preset[];
}

/** Field id → chosen option ids (single fields hold at most one). */
export type Picks = Record<string, string[]>;

const o = (id: string, label: string, text = label.toLowerCase()): Option => ({ id, label, text });

const ASPECT: Field = {
  id: "aspect",
  label: "Aspect ratio",
  options: [o("1:1", "1:1 square", "1:1"), o("16:9", "16:9 wide", "16:9"), o("9:16", "9:16 vertical", "9:16"), o("4:5", "4:5 portrait", "4:5"), o("3:2", "3:2 photo", "3:2")],
};

const ASPECT_WORDS: Record<string, string> = { "1:1": "square", "16:9": "landscape", "9:16": "vertical", "4:5": "portrait", "3:2": "landscape" };

export const MODES: ModeDef[] = [
  {
    id: "image",
    label: "Image",
    emoji: "🖼️",
    ideaLabel: "What should the image show?",
    ideaPlaceholder: "e.g. a fox reading a book in a cozy library",
    defaultIdea: "a red fox reading a book in a cozy library",
    fields: [
      {
        id: "style",
        label: "Style",
        options: [
          o("photo", "Photo", "photorealistic photo"),
          o("cinematic", "Cinematic still", "cinematic film still"),
          o("digital", "Digital painting", "digital painting"),
          o("anime", "Anime", "anime illustration"),
          o("watercolor", "Watercolor", "watercolor painting"),
          o("oil", "Oil painting", "oil painting"),
          o("3d", "3D render", "3D render"),
          o("pixel", "Pixel art", "pixel art"),
          o("vector", "Flat vector", "flat vector illustration"),
          o("lineart", "Line art", "black-and-white line art"),
          o("isometric", "Isometric", "isometric illustration"),
          o("product", "Product shot", "studio product photo"),
          o("logo", "Logo", "minimal logo design"),
          o("comic", "Comic", "comic book panel"),
        ],
      },
      {
        id: "shot",
        label: "Shot & lens",
        options: [
          o("closeup", "Close-up", "close-up"),
          o("portrait85", "85mm portrait", "85mm portrait, shallow depth of field"),
          o("wide", "Wide shot", "wide establishing shot"),
          o("lowangle", "Low angle", "low-angle shot"),
          o("overhead", "Overhead", "overhead flat lay"),
          o("macro", "Macro", "macro shot"),
          o("aerial", "Aerial", "aerial view"),
          o("35mm", "35mm film", "shot on 35mm film"),
        ],
      },
      {
        id: "lighting",
        label: "Lighting",
        options: [
          o("golden", "Golden hour", "golden hour light"),
          o("studio", "Soft studio", "soft studio lighting"),
          o("neon", "Neon", "neon lighting"),
          o("rim", "Dramatic rim", "dramatic rim light"),
          o("overcast", "Overcast", "soft overcast light"),
          o("candle", "Candlelight", "warm candlelight"),
          o("moon", "Moonlight", "cool moonlight"),
          o("backlit", "Backlit", "backlit, glowing edges"),
        ],
      },
      {
        id: "mood",
        label: "Mood",
        multi: true,
        options: [o("cozy", "Cozy"), o("epic", "Epic"), o("calm", "Calm"), o("mysterious", "Mysterious"), o("playful", "Playful"), o("melancholic", "Melancholic"), o("futuristic", "Futuristic"), o("whimsical", "Whimsical")],
      },
      {
        id: "color",
        label: "Colors",
        options: [
          o("pastel", "Pastel", "pastel colors"),
          o("vibrant", "Vibrant", "vibrant saturated colors"),
          o("tealorange", "Teal & orange", "teal and orange color grade"),
          o("earthy", "Earthy", "earthy muted tones"),
          o("mono", "Monochrome", "monochrome palette"),
          o("bw", "Black & white", "black and white"),
        ],
      },
      {
        id: "composition",
        label: "Composition",
        options: [
          o("thirds", "Rule of thirds", "rule-of-thirds composition"),
          o("centered", "Centered", "centered symmetrical composition"),
          o("negative", "Negative space", "lots of negative space"),
          o("leading", "Leading lines", "leading lines"),
        ],
      },
      {
        id: "detail",
        label: "Finish",
        multi: true,
        options: [o("detailed", "Highly detailed", "highly detailed"), o("sharp", "Sharp focus", "sharp focus"), o("grain", "Film grain", "subtle film grain"), o("minimal", "Minimal", "clean and minimal"), o("texture", "Rich texture", "rich textures")],
      },
      ASPECT,
      {
        id: "avoid",
        label: "Avoid",
        multi: true,
        options: [o("text", "No text", "text"), o("watermark", "No watermark", "watermark"), o("blur", "No blur", "blur"), o("hands", "No extra fingers", "extra fingers"), o("people", "No people", "people"), o("frame", "No border", "border")],
      },
    ],
    targets: [
      { id: "chatgpt", label: "ChatGPT / GPT Image", hint: "Plain sentences — also good for Gemini (Nano Banana), Copilot and Ideogram." },
      { id: "midjourney", label: "Midjourney", hint: "Comma phrases plus --ar and --no parameters." },
      { id: "sd", label: "Stable Diffusion / Flux", hint: "Comma tags plus a separate negative prompt." },
    ],
    presets: [
      { id: "storybook", label: "Cozy illustration", idea: "a red fox reading a book in a cozy library", picks: { style: ["digital"], shot: ["wide"], lighting: ["candle"], mood: ["cozy", "whimsical"], color: ["earthy"], detail: ["detailed"], aspect: ["4:5"], avoid: ["text", "watermark"] } },
      { id: "product", label: "Product photo", idea: "a glass bottle of cold brew coffee on a stone counter", picks: { style: ["product"], shot: ["closeup"], lighting: ["studio"], color: ["earthy"], detail: ["sharp"], aspect: ["4:5"], avoid: ["text", "watermark"] } },
      { id: "anime", label: "Anime portrait", idea: "a girl with silver hair holding an umbrella in the rain", picks: { style: ["anime"], shot: ["portrait85"], lighting: ["neon"], mood: ["melancholic"], color: ["vibrant"], aspect: ["9:16"], avoid: ["text"] } },
      { id: "logo", label: "Logo", idea: "a mountain and a coffee cup for a café called Summit", picks: { style: ["logo"], composition: ["negative"], color: ["mono"], detail: ["minimal"], aspect: ["1:1"], avoid: ["watermark"] } },
      { id: "fantasy", label: "Fantasy landscape", idea: "a floating castle above a sea of clouds", picks: { style: ["digital"], shot: ["wide"], lighting: ["golden"], mood: ["epic"], detail: ["detailed"], aspect: ["16:9"] } },
      { id: "thumbnail", label: "YouTube thumbnail", idea: "a surprised hiker finding a hidden waterfall", picks: { style: ["photo"], shot: ["closeup"], lighting: ["backlit"], color: ["vibrant"], composition: ["thirds"], aspect: ["16:9"], avoid: ["text"] } },
    ],
  },
  {
    id: "video",
    label: "Video",
    emoji: "🎬",
    ideaLabel: "What happens in the clip?",
    ideaPlaceholder: "e.g. a skateboarder jumping a staircase at sunset",
    defaultIdea: "a skateboarder landing a jump down a city staircase",
    fields: [
      {
        id: "style",
        label: "Style",
        options: [
          o("cinematic", "Cinematic", "cinematic live-action"),
          o("documentary", "Documentary", "handheld documentary"),
          o("commercial", "Commercial", "polished product commercial"),
          o("anime", "Anime", "anime"),
          o("3d", "3D animation", "3D animated"),
          o("stopmotion", "Stop motion", "stop-motion"),
          o("musicvideo", "Music video", "music video"),
          o("vintage", "Vintage 16mm", "vintage 16mm film"),
        ],
      },
      {
        id: "shot",
        label: "Shot",
        options: [o("wide", "Wide", "wide shot"), o("medium", "Medium", "medium shot"), o("closeup", "Close-up", "close-up"), o("aerial", "Drone", "aerial drone shot"), o("pov", "POV", "first-person POV shot"), o("tracking", "Tracking", "tracking shot")],
      },
      {
        id: "camera",
        label: "Camera move",
        options: [
          o("static", "Locked off", "static locked-off camera"),
          o("pushin", "Slow push-in", "slow push-in"),
          o("pullout", "Pull out", "slow pull-out"),
          o("orbit", "Orbit", "smooth orbit around the subject"),
          o("pan", "Pan", "slow pan from left to right"),
          o("handheld", "Handheld", "handheld camera with light shake"),
          o("crane", "Crane up", "crane up and over"),
          o("follow", "Follow", "following the subject"),
        ],
      },
      {
        id: "lighting",
        label: "Lighting",
        options: [o("golden", "Golden hour", "golden hour sunlight"), o("night", "Night city", "night city lights"), o("studio", "Studio", "clean studio lighting"), o("overcast", "Overcast", "soft overcast daylight"), o("neon", "Neon", "neon glow"), o("fire", "Firelight", "flickering firelight")],
      },
      {
        id: "mood",
        label: "Mood",
        multi: true,
        options: [o("energetic", "Energetic"), o("dreamy", "Dreamy"), o("tense", "Tense"), o("joyful", "Joyful"), o("serene", "Serene"), o("eerie", "Eerie")],
      },
      {
        id: "pace",
        label: "Pacing",
        options: [o("slowmo", "Slow motion", "slow motion"), o("realtime", "Real time", "real-time speed"), o("timelapse", "Time-lapse", "time-lapse"), o("fast", "Fast cuts", "fast, punchy rhythm")],
      },
      {
        id: "sound",
        label: "Sound",
        multi: true,
        options: [o("ambient", "Ambient", "natural ambient sound"), o("sfx", "Sound effects", "crisp sound effects"), o("music", "Music", "upbeat background music"), o("dialogue", "Dialogue", "one short line of dialogue"), o("silent", "No audio", "no audio")],
      },
      { id: "duration", label: "Length", options: [o("5", "5 s", "5"), o("8", "8 s", "8"), o("10", "10 s", "10")] },
      { ...ASPECT, options: ASPECT.options.filter((x) => ["16:9", "9:16", "1:1"].includes(x.id)) },
      {
        id: "avoid",
        label: "Avoid",
        multi: true,
        options: [o("text", "No on-screen text", "on-screen text"), o("cuts", "No cuts", "cuts"), o("morph", "No morphing", "morphing or warping"), o("logos", "No logos", "logos")],
      },
    ],
    targets: [
      { id: "sound", label: "Veo / Sora (with sound)", hint: "Includes a sound line — Veo 3 and Sora 2 generate audio." },
      { id: "silent", label: "Kling / Runway / Pika", hint: "Drops the sound line for models that make silent clips." },
    ],
    presets: [
      { id: "skate", label: "Street sports", idea: "a skateboarder landing a jump down a city staircase", picks: { style: ["cinematic"], shot: ["tracking"], camera: ["follow"], lighting: ["golden"], mood: ["energetic"], pace: ["slowmo"], sound: ["sfx", "ambient"], duration: ["8"], aspect: ["16:9"], avoid: ["text", "morph"] } },
      { id: "drone", label: "Drone travel shot", idea: "a turquoise lagoon surrounded by limestone cliffs", picks: { style: ["cinematic"], shot: ["aerial"], camera: ["crane"], lighting: ["golden"], mood: ["serene"], pace: ["realtime"], sound: ["ambient"], duration: ["8"], aspect: ["16:9"], avoid: ["text"] } },
      { id: "ad", label: "Product ad", idea: "a pair of white sneakers splashing through a puddle", picks: { style: ["commercial"], shot: ["closeup"], camera: ["orbit"], lighting: ["studio"], mood: ["energetic"], pace: ["slowmo"], sound: ["sfx", "music"], duration: ["5"], aspect: ["9:16"], avoid: ["text", "logos"] } },
      { id: "anime", label: "Anime scene", idea: "two rivals facing each other on a windy rooftop", picks: { style: ["anime"], shot: ["medium"], camera: ["pushin"], lighting: ["golden"], mood: ["tense"], pace: ["realtime"], sound: ["ambient"], duration: ["8"], aspect: ["16:9"], avoid: ["morph"] } },
      { id: "vlog", label: "Talking vlog", idea: "a woman in a sunny kitchen saying good morning to the camera", picks: { style: ["documentary"], shot: ["medium"], camera: ["handheld"], lighting: ["overcast"], mood: ["joyful"], sound: ["dialogue", "ambient"], duration: ["8"], aspect: ["9:16"], avoid: ["text"] } },
    ],
  },
  {
    id: "writing",
    label: "ChatGPT writing",
    emoji: "✍️",
    ideaLabel: "Topic or details",
    ideaPlaceholder: "e.g. our new budgeting app for students",
    defaultIdea: "how to start running when you are a complete beginner",
    fields: [
      {
        id: "task",
        label: "Task",
        options: [
          o("blog", "Blog post", "Write a blog post"),
          o("email", "Email", "Write an email"),
          o("social", "Social post", "Write a social media post"),
          o("linkedin", "LinkedIn post", "Write a LinkedIn post"),
          o("essay", "Essay", "Write an essay"),
          o("product", "Product description", "Write a product description"),
          o("summary", "Summary", "Summarize"),
          o("explain", "Explanation", "Explain"),
          o("outline", "Outline", "Create an outline"),
          o("ideas", "Ideas list", "Brainstorm ideas"),
          o("cover", "Cover letter", "Write a cover letter"),
          o("rewrite", "Rewrite", "Rewrite and improve this text"),
        ],
      },
      {
        id: "role",
        label: "Act as",
        options: [
          o("writer", "Expert writer", "an expert writer"),
          o("copywriter", "Copywriter", "a senior copywriter"),
          o("teacher", "Teacher", "a patient teacher"),
          o("editor", "Editor", "a sharp editor"),
          o("marketer", "Marketer", "a marketing strategist"),
          o("coach", "Career coach", "an experienced career coach"),
          o("tech", "Technical writer", "a technical writer"),
        ],
      },
      {
        id: "audience",
        label: "Audience",
        options: [o("beginners", "Beginners", "complete beginners"), o("pros", "Busy professionals", "busy professionals"), o("customers", "Customers", "potential customers"), o("students", "Students", "high-school students"), o("kids", "Kids (10)", "a 10-year-old"), o("execs", "Executives", "executives")],
      },
      {
        id: "tone",
        label: "Tone",
        multi: true,
        options: [o("friendly", "Friendly"), o("professional", "Professional"), o("persuasive", "Persuasive"), o("witty", "Witty"), o("empathetic", "Empathetic"), o("concise", "Concise"), o("academic", "Academic")],
      },
      {
        id: "format",
        label: "Format",
        options: [o("paragraphs", "Short paragraphs", "short paragraphs"), o("bullets", "Bullet points", "bullet points"), o("steps", "Step by step", "numbered steps"), o("headings", "With headings", "headings and subheadings"), o("table", "Table", "a table"), o("qa", "Q&A", "questions and answers")],
      },
      {
        id: "length",
        label: "Length",
        options: [o("100", "~100 words", "about 100 words"), o("300", "~300 words", "about 300 words"), o("800", "~800 words", "about 800 words"), o("5", "5 items", "exactly 5 items"), o("1p", "1 paragraph", "one paragraph")],
      },
      {
        id: "extras",
        label: "Extras",
        multi: true,
        options: [
          o("questions", "Ask me questions first", "Before you start, ask me up to 3 questions if anything important is missing."),
          o("versions", "Give 3 versions", "Give me 3 different versions."),
          o("examples", "Include examples", "Include concrete examples."),
          o("jargon", "No jargon", "Avoid jargon and buzzwords."),
          o("cta", "End with a call to action", "End with a clear call to action."),
          o("sources", "Flag facts to check", "Mark any facts or numbers I should double-check."),
        ],
      },
    ],
    targets: [
      { id: "structured", label: "Structured", hint: "Role, task, context and format on separate lines — easy to edit. Works in ChatGPT, Claude and Gemini." },
      { id: "paragraph", label: "One paragraph", hint: "The same instructions as a single paragraph." },
    ],
    presets: [
      { id: "cold", label: "Cold email", idea: "introducing our bookkeeping service to small café owners", picks: { task: ["email"], role: ["copywriter"], audience: ["customers"], tone: ["friendly", "concise"], format: ["paragraphs"], length: ["100"], extras: ["cta", "versions"] } },
      { id: "blog", label: "Blog post", idea: "how to start running when you are a complete beginner", picks: { task: ["blog"], role: ["writer"], audience: ["beginners"], tone: ["friendly"], format: ["headings"], length: ["800"], extras: ["examples"] } },
      { id: "linkedin", label: "LinkedIn post", idea: "what I learned shipping my first side project", picks: { task: ["linkedin"], role: ["writer"], audience: ["pros"], tone: ["professional", "witty"], format: ["paragraphs"], length: ["300"], extras: ["jargon"] } },
      { id: "eli10", label: "Explain like I'm 10", idea: "how the internet works", picks: { task: ["explain"], role: ["teacher"], audience: ["kids"], tone: ["friendly"], format: ["steps"], length: ["300"], extras: ["examples", "jargon"] } },
      { id: "study", label: "Study notes", idea: "the causes of World War I", picks: { task: ["summary"], role: ["teacher"], audience: ["students"], tone: ["concise"], format: ["bullets"], length: ["300"], extras: ["sources"] } },
    ],
  },
];

export const byMode = new Map(MODES.map((m) => [m.id, m]));

/** Default state for a mode: the first preset's picks and the mode's default idea. */
export function defaultState(mode: Mode): { idea: string; picks: Picks; target: string } {
  const m = byMode.get(mode)!;
  const first = m.presets.find((p) => p.idea === m.defaultIdea) ?? m.presets[0];
  return { idea: m.defaultIdea, picks: clonePicks(first.picks), target: m.targets[0].id };
}

export function clonePicks(p: Picks): Picks {
  return Object.fromEntries(Object.entries(p).map(([k, v]) => [k, [...v]]));
}

/** Toggle one option: single fields switch (or clear when tapped again), multi fields add/remove. */
export function togglePick(mode: Mode, picks: Picks, fieldId: string, optionId: string): Picks {
  const field = byMode.get(mode)!.fields.find((f) => f.id === fieldId);
  if (!field || !field.options.some((x) => x.id === optionId)) return picks;
  const cur = picks[fieldId] ?? [];
  const has = cur.includes(optionId);
  const next = field.multi ? (has ? cur.filter((x) => x !== optionId) : [...cur, optionId]) : has ? [] : [optionId];
  return { ...picks, [fieldId]: next };
}

/** Random picks for every field except locked ones (aspect/length/avoid keep their current values). */
export function surprisePicks(mode: Mode, picks: Picks, rng: Rng): Picks {
  const keep = new Set(["aspect", "duration", "avoid", "length", "extras"]);
  const out = clonePicks(picks);
  for (const f of byMode.get(mode)!.fields) {
    if (keep.has(f.id)) continue;
    const a = f.options[Math.floor(rng() * f.options.length)].id;
    if (!f.multi) { out[f.id] = [a]; continue; }
    let b = f.options[Math.floor(rng() * f.options.length)].id;
    if (b === a) b = "";
    out[f.id] = rng() < 0.5 || !b ? [a] : [a, b];
  }
  return out;
}

function texts(mode: Mode, picks: Picks, fieldId: string): string[] {
  const field = byMode.get(mode)!.fields.find((f) => f.id === fieldId);
  if (!field) return [];
  return (picks[fieldId] ?? []).map((id) => field.options.find((x) => x.id === id)?.text).filter((t): t is string => Boolean(t));
}

const one = (mode: Mode, picks: Picks, id: string) => texts(mode, picks, id)[0] ?? "";
const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const article = (s: string) => ((/^[aeiou]/i.test(s) && !/^(one|uni|use)/i.test(s)) || /^(8|11|18)\b|^(8|11|18)-/.test(s) ? "an" : "a");
export const cleanIdea = (s: string) => s.replace(/\s+/g, " ").trim().replace(/[.\s]+$/, "").slice(0, 400);

function imagePrompt(idea: string, picks: Picks, target: string): string {
  const m: Mode = "image";
  const style = one(m, picks, "style");
  const shot = one(m, picks, "shot");
  const light = one(m, picks, "lighting");
  const moods = texts(m, picks, "mood");
  const color = one(m, picks, "color");
  const comp = one(m, picks, "composition");
  const finish = texts(m, picks, "detail");
  const aspect = one(m, picks, "aspect");
  const avoid = texts(m, picks, "avoid");
  if (target === "midjourney") {
    const parts = [style ? `${style} of ${idea}` : idea, shot, light, moods.length ? `${list(moods)} mood` : "", color, comp, ...finish].filter(Boolean);
    return `${parts.join(", ")}${aspect ? ` --ar ${aspect}` : ""}${avoid.length ? ` --no ${avoid.join(", ")}` : ""}`;
  }
  if (target === "sd") {
    const tags = [idea, style, shot, light, ...moods.map((x) => `${x} mood`), color, comp, ...finish].filter(Boolean);
    const neg = [...avoid, "lowres", "jpeg artifacts", "deformed"];
    return `${tags.join(", ")}\nNegative prompt: ${neg.join(", ")}${aspect ? `\nAspect ratio: ${aspect}` : ""}`;
  }
  const lead = style ? `Create ${article(style)} ${style} of ${idea}.` : `Create an image of ${idea}.`;
  const lines = [
    lead,
    shot && `Framing: ${shot}.`,
    light && `Lighting: ${light}.`,
    moods.length ? `Mood: ${list(moods)}.` : "",
    color && `Colors: ${color}.`,
    comp && `Composition: ${comp}.`,
    finish.length ? `Finish: ${list(finish)}.` : "",
    aspect && `Aspect ratio: ${aspect} (${ASPECT_WORDS[aspect]}).`,
    avoid.length ? `Avoid: ${avoid.join(", ")}.` : "",
  ].filter(Boolean);
  return lines.join(" ");
}

function videoPrompt(idea: string, picks: Picks, target: string): string {
  const m: Mode = "video";
  const style = one(m, picks, "style");
  const shot = one(m, picks, "shot");
  const cam = one(m, picks, "camera");
  const light = one(m, picks, "lighting");
  const moods = texts(m, picks, "mood");
  const pace = one(m, picks, "pace");
  const sound = texts(m, picks, "sound");
  const dur = one(m, picks, "duration");
  const aspect = one(m, picks, "aspect");
  const avoid = texts(m, picks, "avoid");
  const head = [dur && `${dur}-second`, aspect, style, "video"].filter(Boolean).join(" ");
  const lines = [
    `${cap(article(head))} ${head}.`,
    `${cap(shot || "shot")} of ${idea}.`,
    cam && `Camera: ${cam}.`,
    light && `Lighting: ${light}.`,
    moods.length ? `Mood: ${list(moods)}.` : "",
    pace && `Pacing: ${pace}.`,
    target === "sound" && sound.length ? `Sound: ${list(sound)}.` : "",
    avoid.length ? `Avoid: ${avoid.join(", ")}.` : "",
  ].filter(Boolean);
  return lines.join(" ");
}

function writingPrompt(idea: string, picks: Picks, target: string): string {
  const m: Mode = "writing";
  const task = one(m, picks, "task") || "Write a piece";
  const role = one(m, picks, "role");
  const aud = one(m, picks, "audience");
  const tones = texts(m, picks, "tone");
  const format = one(m, picks, "format");
  const len = one(m, picks, "length");
  const extras = texts(m, picks, "extras");
  const about = task.startsWith("Rewrite") ? `${task}: ${idea}` : `${task} about ${idea}`;
  if (target === "paragraph") {
    const s = [
      role && `Act as ${role}.`,
      `${about}${aud ? ` for ${aud}` : ""}.`,
      tones.length ? `Use a ${list(tones)} tone.` : "",
      format || len ? `Format it as ${[format, len].filter(Boolean).join(", ")}.` : "",
      ...extras,
    ].filter(Boolean);
    return s.join(" ");
  }
  const lines = [
    role && `Role: Act as ${role}.`,
    `Task: ${about}.`,
    aud && `Audience: ${aud}.`,
    tones.length ? `Tone: ${list(tones)}.` : "",
    format && `Format: ${format}.`,
    len && `Length: ${len}.`,
    ...extras,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildPrompt(mode: Mode, ideaRaw: string, picks: Picks, target: string): string {
  const def = byMode.get(mode)!;
  const idea = cleanIdea(ideaRaw) || def.defaultIdea;
  if (mode === "image") return imagePrompt(idea, picks, target);
  if (mode === "video") return videoPrompt(idea, picks, target);
  return writingPrompt(idea, picks, target);
}

/** Number of distinct option combinations for a mode (single fields: options+1 for none; multi: 2^n). */
export function combos(mode: Mode): number {
  return byMode.get(mode)!.fields.reduce((n, f) => n * (f.multi ? 2 ** f.options.length : f.options.length + 1), 1);
}
