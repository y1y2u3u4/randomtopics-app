// Unicode text styles for the fancy / cursed / glitch / strikethrough / subscript
// pages. Everything is a pure string transform so the result can be pasted into
// Instagram bios, Discord, TikTok and games that block custom fonts: the "font"
// is really a different Unicode character for each letter.

export type Variant = "fancy" | "cursed" | "glitch" | "weird" | "creepy" | "scary" | "strike" | "script";

export interface TextStyle {
  id: string;
  label: string;
  /** Where this style pastes cleanly (shown as a small hint). */
  note?: string;
  transform: (text: string, strength: number) => string;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

/** Map A–Z/a–z/0–9 onto a contiguous Mathematical Alphanumeric block, with per-letter holes patched. */
function mathAlpha(upperStart: number, lowerStart: number, digitStart: number | null, holes: Record<string, string> = {}) {
  const map: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    map[UPPER[i]] = String.fromCodePoint(upperStart + i);
    map[LOWER[i]] = String.fromCodePoint(lowerStart + i);
  }
  if (digitStart !== null) for (let i = 0; i < 10; i++) map[DIGITS[i]] = String.fromCodePoint(digitStart + i);
  return { ...map, ...holes };
}

function charMap(from: string, to: string[]) {
  const map: Record<string, string> = {};
  [...from].forEach((c, i) => { if (to[i]) map[c] = to[i]; });
  return map;
}

const mapWith = (map: Record<string, string>) => (text: string) => [...text].map((c) => map[c] ?? c).join("");

export const MAPS = {
  bold: mathAlpha(0x1d400, 0x1d41a, 0x1d7ce),
  italic: mathAlpha(0x1d434, 0x1d44e, null, { h: "ℎ" }),
  boldItalic: mathAlpha(0x1d468, 0x1d482, null),
  script: mathAlpha(0x1d49c, 0x1d4b6, null, {
    B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ",
  }),
  boldScript: mathAlpha(0x1d4d0, 0x1d4ea, null),
  fraktur: mathAlpha(0x1d504, 0x1d51e, null, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" }),
  boldFraktur: mathAlpha(0x1d56c, 0x1d586, null),
  doubleStruck: mathAlpha(0x1d538, 0x1d552, 0x1d7d8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" }),
  sans: mathAlpha(0x1d5a0, 0x1d5ba, 0x1d7e2),
  sansBold: mathAlpha(0x1d5d4, 0x1d5ee, 0x1d7ec),
  sansItalic: mathAlpha(0x1d608, 0x1d622, null),
  sansBoldItalic: mathAlpha(0x1d63c, 0x1d656, null),
  monospace: mathAlpha(0x1d670, 0x1d68a, 0x1d7f6),
  fullwidth: mathAlpha(0xff21, 0xff41, 0xff10),
  circled: { ...mathAlpha(0x24b6, 0x24d0, null), ...charMap(DIGITS, ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"]) },
  circledDark: { ...charMap(UPPER + LOWER, [..."🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"]), ...charMap(DIGITS, [..."⓿❶❷❸❹❺❻❼❽❾"]) },
  squared: charMap(UPPER + LOWER, [..."🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"]),
  squaredDark: charMap(UPPER + LOWER, [..."🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"]),
  smallCaps: charMap(LOWER + UPPER, [..."ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ"]),
  superscript: charMap(LOWER + UPPER + DIGITS + "+-=()", [..."ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾"]),
  // Unicode has no subscript for every letter; unmapped ones stay as they are.
  subscript: charMap("aehijklmnoprstuvx" + DIGITS + "+-=()", [..."ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓ₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎"]),
  upsideDown: charMap(LOWER + UPPER + DIGITS + ".,!?'\"()[]{}<>&_", [..."ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ᗺƆᗡƎℲ⅁HIſꓘ˥WNOԀῸᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙'¡¿,„)(][}{><⅋‾"]),
  bubbleFaux: charMap(LOWER, [..."ค๒ς๔єŦﻮђเןкɭ๓ภ๏קợгรՇยשฬאץչ"]),
  currency: charMap(LOWER, [..."₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ"]),
  greekish: charMap(LOWER, [..."αвcdєfghíjklmnσpqrstuvwхчz"]),
  runic: charMap(LOWER, [..."ᚨᛒᚲᛞᛖᚠᚷᚺᛁᛃᚲᛚᛗᚾᛟᛈᛩᚱᛊᛏᚢᚡᚹᛪᛃᛉ"]),
  cjkish: charMap(LOWER, [..."卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ɋ尺丂ㄒㄩᐯ山乂ㄚ乙"]),
  creepyLetters: charMap(LOWER, [..."ąცƈɖɛʄɠɧıʝƙƖɱŋơ℘զཞʂɬų۷ῳҳყʑ"]),
  gothicFaux: charMap(LOWER, [..."ᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭YᘔᗩᗷᑕᗪEᖴGᕼIᒍKᒪᗰᑎOᑭᑫᖇᔕTᑌᐯᗯ᙭Yᘔ"]),
} satisfies Record<string, Record<string, string>>;

const lowerFirst = (fn: (t: string) => string) => (t: string) => fn(t.toLowerCase());

/** Combine a mark after every visible character (strikethrough, underline, slash…). */
export function combine(text: string, mark: string): string {
  return [...text].map((c) => (c === " " || c === "\n" ? c : c + mark)).join("");
}

// Zalgo marks: above, middle and below the letter.
const ZALGO_UP = [..."̍̎̄̅̿̑̆̐͒͗͑̇̈̊͂̓̈́͊͋͌̃̂̌͐̀́̋̏̒̓̔̽̉ͣͤͥͦͧͨͩͪͫͬͭͮͯ̾͛͆̚"];
const ZALGO_MID = [..."̴̵̶̡̢̧̨̛̀́̕͘͏̸̷͜͟͢͝͞͠͡҉"];
const ZALGO_DOWN = [..."̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎͓͔͕͖͙͚̣ͅ"];

/** Small deterministic PRNG so the same input always gives the same cursed text (stable previews, no hydration mismatch). */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Zalgo text. `strength` 1–10 sets how many marks each letter gets.
 * `parts` picks which directions to stack (up / mid / down).
 */
export function zalgo(text: string, strength = 5, parts: { up?: boolean; mid?: boolean; down?: boolean } = { up: true, mid: true, down: true }, salt = 0): string {
  const r = rng(hash(text) + salt * 7919);
  const level = Math.max(1, Math.min(10, Math.round(strength)));
  const n = (max: number) => Math.floor(r() * max * (level / 10)) + (level >= 3 ? 1 : 0);
  return [...text]
    .map((c) => {
      if (c === " " || c === "\n") return c;
      let out = c;
      const add = (pool: string[], count: number) => { for (let i = 0; i < count; i++) out += pool[Math.floor(r() * pool.length)]; };
      if (parts.up) add(ZALGO_UP, n(8));
      if (parts.mid) add(ZALGO_MID, Math.min(2, n(3)));
      if (parts.down) add(ZALGO_DOWN, n(8));
      return out;
    })
    .join("");
}

/** Glitch: mixes look-alike letters from several alphabets and drops in a few combining marks. */
export function glitch(text: string, strength = 5, salt = 0): string {
  const r = rng(hash(text) + 31 + salt * 104729);
  const pools = [MAPS.bold, MAPS.monospace, MAPS.fraktur, MAPS.doubleStruck, MAPS.sansBold, MAPS.currency, MAPS.creepyLetters];
  const level = Math.max(1, Math.min(10, strength)) / 10;
  return [...text]
    .map((c) => {
      if (c === " " || c === "\n") return c;
      let out = c;
      if (r() < 0.35 + level * 0.5) {
        const pool = pools[Math.floor(r() * pools.length)] as Record<string, string>;
        out = pool[c] ?? pool[c.toLowerCase()] ?? c;
      }
      if (r() < level * 0.6) out += ZALGO_MID[Math.floor(r() * ZALGO_MID.length)];
      if (r() < level * 0.4) out += ZALGO_DOWN[Math.floor(r() * ZALGO_DOWN.length)];
      return out;
    })
    .join("");
}

const reverse = (t: string) => [...t].reverse().join("");
const flip = (t: string) => reverse(mapWith(MAPS.upsideDown)(t));
const spaced = (t: string) => [...t].join(" ");
const wrapEach = (left: string, right: string) => (t: string) => [...t].map((c) => (c === " " ? c : `${left}${c}${right}`)).join("");

function s(id: string, label: string, transform: (t: string, strength: number) => string, note?: string): TextStyle {
  return { id, label, transform, note };
}
const m = (key: keyof typeof MAPS) => mapWith(MAPS[key]);

const FANCY: TextStyle[] = [
  s("bold", "Bold serif", m("bold"), "Instagram, X, TikTok"),
  s("italic", "Italic serif", m("italic")),
  s("bold-italic", "Bold italic", m("boldItalic")),
  s("script", "Cursive script", m("script"), "Popular for bios"),
  s("bold-script", "Bold cursive", m("boldScript")),
  s("fraktur", "Old English (Fraktur)", m("fraktur")),
  s("bold-fraktur", "Bold Old English", m("boldFraktur")),
  s("double-struck", "Double-struck", m("doubleStruck")),
  s("sans-bold", "Bold sans", m("sansBold")),
  s("sans-italic", "Italic sans", m("sansItalic")),
  s("sans-bold-italic", "Bold italic sans", m("sansBoldItalic")),
  s("monospace", "Typewriter", m("monospace")),
  s("fullwidth", "Vaporwave wide", m("fullwidth")),
  s("small-caps", "Small caps", m("smallCaps")),
  s("circled", "Bubble", m("circled")),
  s("circled-dark", "Dark bubble", m("circledDark")),
  s("squared", "Squares", m("squared")),
  s("squared-dark", "Dark squares", m("squaredDark")),
  s("superscript", "Tiny text", m("superscript")),
  s("upside-down", "Upside down", flip),
  s("mirror", "Backwards", reverse),
  s("thai", "Thai-style", lowerFirst(m("bubbleFaux"))),
  s("currency", "Currency", lowerFirst(m("currency"))),
  s("greekish", "Greek-ish", lowerFirst(m("greekish"))),
  s("asian", "Asian-style", lowerFirst(m("cjkish"))),
  s("gothic-faux", "Canadian Aboriginal", lowerFirst(m("gothicFaux"))),
  s("strike", "Strikethrough", (t) => combine(t, "̶")),
  s("underline", "Underline", (t) => combine(t, "̲")),
  s("sparkle", "Sparkles", (t) => `✧･ﾟ: ${m("script")(t)} :･ﾟ✧`),
  s("hearts", "Hearts", (t) => `♡ ${m("italic")(t)} ♡`),
  s("stars", "Stars", (t) => `★彡 ${m("sansBold")(t)} 彡★`),
  s("brackets", "Brackets", wrapEach("【", "】")),
  s("wavy", "Wavy", (t) => `˜”*°•.˜”*°• ${t} •°*”˜.•°*”˜`),
  s("spaced", "Spaced out", (t) => spaced(m("fullwidth")(t))),
];

const CURSED: TextStyle[] = [
  s("zalgo", "Classic Zalgo", (t, k) => zalgo(t, k), "Discord, Reddit, X"),
  s("zalgo-up", "Rising (marks above)", (t, k) => zalgo(t, k, { up: true })),
  s("zalgo-down", "Dripping (marks below)", (t, k) => zalgo(t, k, { down: true })),
  s("zalgo-mid", "Crossed out", (t, k) => zalgo(t, k, { mid: true }, 2)),
  s("zalgo-up-down", "Stretched", (t, k) => zalgo(t, k, { up: true, down: true }, 3)),
  s("cursed-fraktur", "Cursed Old English", (t, k) => zalgo(m("fraktur")(t), k, undefined, 4)),
  s("cursed-script", "Cursed cursive", (t, k) => zalgo(m("script")(t), k, undefined, 5)),
  s("cursed-flip", "Cursed upside down", (t, k) => zalgo(flip(t), k, undefined, 6)),
  s("cursed-small", "Cursed small caps", (t, k) => zalgo(m("smallCaps")(t), k, undefined, 7)),
  s("cursed-mono", "Cursed typewriter", (t, k) => zalgo(m("monospace")(t), k, undefined, 8)),
];

const GLITCH: TextStyle[] = [
  s("glitch", "Glitch mix", (t, k) => glitch(t, k), "Gaming names, Discord"),
  s("glitch-2", "Corrupted", (t, k) => glitch(t, k, 1)),
  s("glitch-3", "Signal lost", (t, k) => glitch(t, k, 2)),
  s("glitch-zalgo", "Glitch + Zalgo", (t, k) => zalgo(glitch(t, k, 3), Math.max(1, k - 3), { up: true, down: true })),
  s("glitch-strike", "Scanlines", (t) => combine(m("monospace")(t), "̵")),
  s("glitch-slash", "Slashed", (t) => combine(t, "̸")),
  s("glitch-wide", "Broken vaporwave", (t, k) => glitch(m("fullwidth")(t), k, 4)),
  s("glitch-blocks", "Block noise", (t, k) => [...t].map((c, i) => (c !== " " && (hash(t) + i * 13) % (12 - k) === 0 ? "▓" : c)).join("")),
  s("glitch-binary", "Data leak", (t) => [...t].map((c, i) => (c === " " ? " " : i % 3 === 1 ? MAPS.monospace[c] ?? c : c)).join("") + " ░▒▓"),
];

const WEIRD: TextStyle[] = [
  s("currency", "Currency letters", lowerFirst(m("currency")), "Works in most bios"),
  s("thai", "Thai-style", lowerFirst(m("bubbleFaux"))),
  s("asian", "Asian-style", lowerFirst(m("cjkish"))),
  s("runic", "Runes", lowerFirst(m("runic"))),
  s("greekish", "Greek-ish", lowerFirst(m("greekish"))),
  s("gothic-faux", "Canadian Aboriginal", lowerFirst(m("gothicFaux"))),
  s("upside-down", "Upside down", flip),
  s("mirror", "Backwards", reverse),
  s("brackets", "Boxed", wrapEach("【", "】")),
  s("parens", "Parentheses", wrapEach("(", ")")),
  s("dots", "Dotted", (t) => combine(t, "̤")),
  s("wave", "Squiggle", (t) => combine(t, "̰")),
  s("arrows", "Arrows below", (t) => combine(t, "͢")),
  s("x-above", "X above", (t) => combine(t, "̽")),
  s("alternating", "aLtErNaTiNg", (t) => [...t].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("")),
];

const CREEPY: TextStyle[] = [
  s("creepy", "Creepy letters", lowerFirst(m("creepyLetters")), "Halloween posts"),
  s("creepy-drip", "Dripping", (t, k) => zalgo(lowerFirst(m("creepyLetters"))(t), Math.min(k, 6), { down: true }, 11)),
  s("creepy-fraktur", "Haunted Old English", m("fraktur")),
  s("creepy-bold-fraktur", "Bold haunted", m("boldFraktur")),
  s("creepy-runic", "Cursed runes", lowerFirst(m("runic"))),
  s("creepy-whisper", "Whisper", (t) => m("superscript")(t.toLowerCase())),
  s("creepy-flip", "Upside down", flip),
  s("creepy-mirror", "Mirror writing", reverse),
  s("creepy-spider", "Spider web", (t) => `🕸 ${m("fraktur")(t)} 🕷`),
  s("creepy-zalgo", "Possessed", (t, k) => zalgo(t, k, undefined, 12)),
];

const SCARY: TextStyle[] = [
  s("scary-blood", "Bloody drip", (t, k) => zalgo(m("boldFraktur")(t), Math.min(k, 6), { down: true }, 21), "Horror titles"),
  s("scary-fraktur", "Horror Old English", m("fraktur")),
  s("scary-demon", "Demonic", (t, k) => zalgo(t, Math.min(10, k + 2), undefined, 22)),
  s("scary-skull", "Skulls", (t) => `☠ ${m("sansBold")(t.toUpperCase())} ☠`),
  s("scary-crossed", "Crossed out", (t) => combine(t.toUpperCase(), "̸")),
  s("scary-creepy", "Creepy letters", lowerFirst(m("creepyLetters"))),
  s("scary-dark", "Dark squares", m("squaredDark")),
  s("scary-runic", "Ritual runes", lowerFirst(m("runic"))),
  s("scary-flip", "Upside down", flip),
  s("scary-whisper", "Last words", (t) => `${m("superscript")(t.toLowerCase())}…`),
];

const STRIKE: TextStyle[] = [
  s("strike", "Strikethrough", (t) => combine(t, "̶"), "Works almost everywhere"),
  s("strike-short", "Short strike", (t) => combine(t, "̵")),
  s("slash", "Slash through", (t) => combine(t, "̸")),
  s("tilde", "Tilde strike", (t) => combine(t, "̴")),
  s("underline", "Underline", (t) => combine(t, "̲")),
  s("double-underline", "Double underline", (t) => combine(t, "̳")),
  s("overline", "Overline", (t) => combine(t, "̅")),
  s("over-under", "Over + under", (t) => combine(combine(t, "̅"), "̲")),
  s("strike-bold", "Bold strikethrough", (t) => combine(m("bold")(t), "̶")),
  s("dotted-under", "Dotted underline", (t) => combine(t, "̤")),
  s("wavy-under", "Wavy underline", (t) => combine(t, "̰")),
  s("x-strike", "X'd out", (t) => combine(t, "̽")),
];

const SCRIPT: TextStyle[] = [
  s("superscript", "Superscript", m("superscript"), "Footnotes, x², tiny bios"),
  s("subscript", "Subscript", m("subscript"), "H₂O, CO₂ — some letters have no subscript"),
  s("small-caps", "Small caps", m("smallCaps")),
  s("super-lower", "Tiny lowercase", (t) => m("superscript")(t.toLowerCase())),
  s("chemistry", "Chemistry formula", (t) => t.replace(/(\d+)/g, (d) => m("subscript")(d))),
  s("exponents", "Math exponents", (t) => t.replace(/\^(\S+)/g, (_, x: string) => m("superscript")(x))),
  s("ordinal", "Ordinals (1ˢᵗ, 2ⁿᵈ)", (t) => t.replace(/(\d)(st|nd|rd|th)\b/gi, (_, d: string, x: string) => d + m("superscript")(x.toLowerCase()))),
  s("trademark", "Trademark style", (t) => `${t}™`),
];

export const STYLE_SETS: Record<Variant, TextStyle[]> = {
  fancy: FANCY,
  cursed: CURSED,
  glitch: GLITCH,
  weird: WEIRD,
  creepy: CREEPY,
  scary: SCARY,
  strike: STRIKE,
  script: SCRIPT,
};

/** Variants whose output depends on the strength slider. */
export const HAS_STRENGTH: Record<Variant, boolean> = {
  fancy: false, cursed: true, glitch: true, weird: false, creepy: true, scary: true, strike: false, script: false,
};

export const DEFAULT_TEXT: Record<Variant, string> = {
  fancy: "Random Topics",
  cursed: "it is behind you",
  glitch: "system error",
  weird: "weird text",
  creepy: "something is watching",
  scary: "do not look back",
  strike: "this is wrong",
  script: "H2O and x^2 on the 1st",
};

/** The text-style pages, in tab order. */
export const TEXT_TOOLS: { variant: Variant; href: string; label: string }[] = [
  { variant: "fancy", href: "/fancy-text-generator", label: "Fancy" },
  { variant: "cursed", href: "/cursed-text-generator", label: "Cursed" },
  { variant: "glitch", href: "/glitch-text-generator", label: "Glitch" },
  { variant: "weird", href: "/weird-text-generator", label: "Weird" },
  { variant: "creepy", href: "/creepy-text-generator", label: "Creepy" },
  { variant: "scary", href: "/scary-text-generator", label: "Scary" },
  { variant: "strike", href: "/strikethrough-text-generator", label: "Strikethrough" },
  { variant: "script", href: "/subscript-generator", label: "Sub / superscript" },
];
