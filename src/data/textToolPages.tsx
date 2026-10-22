import type { ReactNode } from "react";
import type { Variant } from "@/lib/unicodeText";

// Copy for the eight Unicode text-style pages. Every page shares UnicodeTextTool
// and TextToolPage; only the words here (and the style set) change.

export interface TextToolPageData {
  variant: Variant;
  path: string;
  toolType: string;
  name: string;
  heading: [string, string];
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  inShort: string;
  card: string;
  hero?: { src: string; alt: string };
  /** Where the output shows up correctly, platform by platform. */
  works: { where: string; result: string }[];
  howTo: ReactNode[];
  body: ReactNode;
  faq: { question: string; answer: string }[];
}

export const TEXT_TOOL_PAGES: Record<Variant, TextToolPageData> = {
  fancy: {
    variant: "fancy",
    path: "/fancy-text-generator",
    hero: { src: "/generators/hero/fancy-text-generator.webp", alt: "Storybook desk with swirling decorative letters floating from a pen" },
    toolType: "fancy_text_generator",
    name: "Fancy Text Generator",
    heading: ["Fancy Text", "Generator"],
    title: "Fancy Text Generator — 34 Font Styles to Copy & Paste",
    description:
      "Free fancy text generator: type once and see 34 font styles at the same time — bold, cursive, Old English, bubble, vaporwave, small caps, upside down and more. Tap any style to copy it for Instagram, TikTok, Discord or X.",
    keywords: ["fancy text generator", "fancy text", "fancy font generator", "cool text generator", "copy and paste fonts", "instagram fonts", "cursive text generator", "bold text generator"],
    intro: "Type once, see 34 font styles at the same time, and tap any one to copy it. Works in bios, usernames, captions and chats.",
    inShort:
      "A fancy text generator swaps normal letters for look-alike Unicode characters (bold, cursive, Old English, bubble and more), so the styled text survives copy and paste into apps that do not let you pick a font. This one shows 34 styles live as you type, copies any style in one tap, and runs entirely in your browser.",
    card: "random-word-generator",
    works: [
      { where: "Instagram bio & captions", result: "All styles. Bold, cursive and small caps read best." },
      { where: "TikTok & X (Twitter)", result: "All styles. Names are limited in length, so pick a short one." },
      { where: "Discord", result: "All styles in messages, nicknames and server names." },
      { where: "WhatsApp & iMessage", result: "Most styles. Very old phones may show boxes for Thai-style and Canadian Aboriginal." },
      { where: "Google Docs, Word", result: "Shows fine, but spell-check and search treat it as symbols, not letters." },
    ],
    howTo: [
      <><strong>Type or paste your text</strong> into the box. Every style below updates as you type.</>,
      <><strong>Scroll the list</strong> and tap the style you like. It is copied right away.</>,
      <><strong>Paste it</strong> into your bio, username, caption or message.</>,
      <><strong>Share link</strong> copies a link that opens this page with your text already in it.</>,
    ],
    body: (
      <>
        <p>
          Apps like Instagram and TikTok do not have a font menu. What they do accept is any Unicode character, and Unicode includes whole
          alphabets that look like styled fonts: the Mathematical Alphanumeric Symbols block alone has bold, italic, script, Fraktur,
          double-struck, sans-serif and monospace versions of A–Z. This page maps each letter you type to its look-alike, so 𝐁𝐨𝐥𝐝 is really
          a string of bold-letter symbols, not formatting.
        </p>
        <p>
          The trade-off: screen readers may read these symbols one by one or skip them, and search will not match them to normal words. Use
          fancy text for a name or a short highlight, and keep the important words plain.
        </p>
      </>
    ),
    faq: [
      { question: "Is fancy text a real font?", answer: "No. It is a set of Unicode symbols that look like styled letters. That is why it keeps its look when you paste it into an app that has no font settings." },
      { question: "Why do some styles show as boxes?", answer: "The device you are pasting on does not have a font that covers those symbols. Bold, italic, cursive and small caps are the safest; Thai-style, Canadian Aboriginal and some faux styles are the most likely to break on older phones." },
      { question: "Can I use fancy text in my Instagram name?", answer: "Yes, in both the name field and the bio. The @username itself only allows plain letters, numbers, dots and underscores, so fancy text will not work there." },
      { question: "Do numbers and emoji get styled?", answer: "Numbers get styled in bold, double-struck, sans, monospace, bubble and wide styles. Emoji, punctuation and letters with accents are left as they are so they still read correctly." },
      { question: "Is what I type saved or sent anywhere?", answer: "No. The conversion runs in your browser. Nothing you type leaves your device unless you press Share link and send that link yourself." },
    ],
  },

  cursed: {
    variant: "cursed",
    path: "/cursed-text-generator",
    hero: { src: "/generators/hero/cursed-text-generator.webp", alt: "Spooky storybook scene of letters dripping with glitchy marks" },
    toolType: "cursed_text_generator",
    name: "Cursed Text Generator",
    heading: ["Cursed Text", "Generator"],
    title: "Cursed Text Generator — Zalgo Text with a Strength Slider",
    description:
      "Free cursed text (Zalgo) generator with a 1–10 strength slider: 10 styles from subtle glitchy marks to full chaos, rising or dripping. Tap to copy for Discord, Reddit, X or TikTok.",
    keywords: ["cursed text generator", "zalgo text generator", "cursed text", "zalgo text", "creepy zalgo", "glitchy text", "cursed font", "corrupted text generator"],
    intro: "Zalgo text with a strength slider: start subtle, crank it to chaos. Ten cursed styles, each one tap to copy.",
    inShort:
      "Cursed text (Zalgo) stacks Unicode combining marks above, through and below each letter so the words look like they are melting or possessed. This generator lets you set the strength from 1 (a few marks, still readable) to 10 (towering chaos), shows 10 cursed styles at once, and copies any of them in one tap.",
    card: "random-word-generator",
    works: [
      { where: "Discord", result: "Works. Strength 7+ can overlap the line above in chat." },
      { where: "Reddit, X (Twitter)", result: "Works. Every mark counts toward the character limit, so high strength fills a tweet fast." },
      { where: "TikTok & Instagram captions", result: "Works. Names and bios may trim the marks — keep strength at 3–5." },
      { where: "WhatsApp, iMessage", result: "Works, stacks look shorter on iPhone." },
      { where: "Game names (Roblox, Fortnite)", result: "Usually blocked — they only allow plain letters." },
    ],
    howTo: [
      <><strong>Type your text</strong> — a short phrase looks best.</>,
      <><strong>Drag the strength slider.</strong> 2–4 looks eerie but readable; 8–10 is full Zalgo.</>,
      <><strong>Tap a style</strong> to copy: Rising puts marks on top, Dripping hangs them below.</>,
      <><strong>Paste it</strong> anywhere that accepts Unicode.</>,
    ],
    body: (
      <>
        <p>
          Every cursed letter is a normal letter plus combining diacritical marks — the same marks used for accents like é, just piled up. The
          generator picks marks from three groups (above, middle, below) and adds more of them as the strength goes up. Results are seeded
          from your text, so the same text and strength always give the same output — handy when you want to paste the exact same curse
          twice.
        </p>
        <p>
          Many sites only offer a fixed amount of chaos. Here the slider shows you exactly how far to go before the text stops being
          readable, which is usually the point you want for a username or a post title.
        </p>
      </>
    ),
    faq: [
      { question: "What is Zalgo text?", answer: "Zalgo is the internet name for text covered in stacked combining marks. It comes from a 2004 web comic meme about an eldritch being called Zalgo, and the look stuck as the standard “cursed” style." },
      { question: "How do I make the text less messy?", answer: "Move the strength slider down. At 1–3 each letter gets only a few marks, so it still reads clearly but looks wrong." },
      { question: "Why does Discord or X cut my cursed text short?", answer: "Each combining mark is its own character. A 10-letter word at strength 10 can be 150+ characters, so it hits the limit quickly. Lower the strength or use a shorter phrase." },
      { question: "Can cursed text break apps?", answer: "It does not harm your device. Very long Zalgo can overlap nearby lines, which is why some forums strip combining marks." },
      { question: "Is it the same every time?", answer: "Yes. The marks are picked with a seed made from your text and strength, so you can come back and get the identical result." },
    ],
  },

  glitch: {
    variant: "glitch",
    path: "/glitch-text-generator",
    hero: { src: "/generators/hero/glitch-text-generator.webp", alt: "Cozy retro CRT monitor showing colorful split glitch shapes" },
    toolType: "glitch_text_generator",
    name: "Glitch Text Generator",
    heading: ["Glitch Text", "Generator"],
    title: "Glitch Text Generator — Corrupted & Broken Text to Copy",
    description:
      "Free glitch text generator: 9 corrupted, broken and signal-lost styles with a glitch strength slider. Mixes look-alike letters, scanlines and block noise. Tap to copy for gamer tags, Discord and posts.",
    keywords: ["glitch text generator", "glitch text", "glitch font", "corrupted text generator", "broken text generator", "error text", "glitchy font copy and paste"],
    intro: "Broken, corrupted, signal-lost text — nine glitch styles with a strength slider, each copied in one tap.",
    inShort:
      "Glitch text looks like a corrupted file: some letters are swapped for look-alikes from other alphabets, some get struck through or covered in noise. This generator mixes those effects at the strength you choose (1–10), shows 9 glitch styles side by side, and copies any of them in one tap.",
    card: "random-word-generator",
    works: [
      { where: "Discord names & messages", result: "All styles work." },
      { where: "Twitch / YouTube titles", result: "Works. Keep strength under 6 so the title still reads in search." },
      { where: "Instagram & TikTok bios", result: "Works. Scanlines and Slashed are the cleanest." },
      { where: "Steam profile name", result: "Most styles work; Block noise always works." },
      { where: "Console gamer tags (Xbox, PSN)", result: "Blocked — plain letters only." },
    ],
    howTo: [
      <><strong>Type your text</strong>, like a gamer tag or a title.</>,
      <><strong>Set the glitch strength.</strong> Low swaps a few letters; high corrupts most of them.</>,
      <><strong>Tap a style</strong> to copy it. Scanlines and Slashed do not change with strength.</>,
    ],
    body: (
      <>
        <p>
          Unlike Zalgo, which only adds marks, glitch text swaps letters too. Each letter has a chance to become its double-struck, Fraktur,
          monospace or small-caps twin, and a chance to pick up a strike or a mark below — so the word looks like it is flickering between
          fonts. Raise the strength and more letters break.
        </p>
        <p>
          The output is seeded from your text, so it does not reshuffle while you decide. Change one letter and you get a fresh glitch.
        </p>
      </>
    ),
    faq: [
      { question: "What is the difference between glitch text and cursed text?", answer: "Cursed (Zalgo) text keeps the letters and piles marks on them. Glitch text replaces letters with look-alikes from other Unicode alphabets and adds strikes, so it looks corrupted rather than possessed. The Glitch + Zalgo style mixes both." },
      { question: "Which glitch style is easiest to read?", answer: "Scanlines (typewriter letters with a short strike) and Slashed keep every letter recognisable. Glitch mix at strength 2–4 is the best balance." },
      { question: "Can I use glitch text as a gamer tag?", answer: "On Discord, Steam and most PC games, yes. Console networks like Xbox and PlayStation only allow plain letters, numbers and spaces." },
      { question: "Will glitch text count as more characters?", answer: "Styles with marks (Glitch mix, Scanlines, Slashed) add one character per mark. Block noise and Data leak keep the length close to the original." },
    ],
  },

  weird: {
    variant: "weird",
    path: "/weird-text-generator",
    hero: { src: "/generators/hero/weird-text-generator.webp", alt: "Playful alphabet blocks tumbling upside down over a sketchbook" },
    toolType: "weird_text_generator",
    name: "Weird Text Generator",
    heading: ["Weird Text", "Generator"],
    title: "Weird Text Generator — 15 Strange Letter Styles to Copy",
    description:
      "Free weird text generator: 15 strange styles — currency letters, runes, Thai-style, Greek-ish, upside down, backwards, squiggles and aLtErNaTiNg caps. See them all at once and tap to copy.",
    keywords: ["weird text generator", "weird text", "weird fonts", "strange text generator", "odd letters", "weird letters copy and paste", "alternating caps generator"],
    intro: "Letters that look almost right: runes, currency signs, Thai-style, backwards and more. Fifteen weird styles, one tap to copy.",
    inShort:
      "Weird text replaces each letter with a symbol from another script that happens to look like it — ₿ for B, ᚱ for R, ค for a — so the words are still readable but look strange. This page shows 15 weird styles at once, all copied in one tap, without the creepy or scary marks of Zalgo text.",
    card: "random-word-generator",
    works: [
      { where: "Instagram, TikTok, X", result: "All styles work in names, bios and captions." },
      { where: "Discord", result: "All styles work." },
      { where: "Older Android phones", result: "Runes and Canadian Aboriginal may show boxes." },
      { where: "Group chats (WhatsApp, Messenger)", result: "Works. aLtErNaTiNg and Backwards always work." },
    ],
    howTo: [
      <><strong>Type a word or name.</strong> Short words show the effect best.</>,
      <><strong>Pick the weirdness:</strong> currency and Greek-ish stay readable; runes and Canadian Aboriginal are harder.</>,
      <><strong>Tap to copy</strong> and paste it anywhere.</>,
    ],
    body: (
      <>
        <p>
          These are not fonts and not distorted letters: each style borrows real characters from other writing systems — Thai, Greek, runic
          Futhark, currency symbols, Canadian Aboriginal syllabics — chosen because they resemble Latin letters. That is why the result is
          readable at a glance but feels off.
        </p>
        <p>
          The combining styles (Dotted, Squiggle, Arrows below, X above) keep your letters and add a single mark under or over each one — a
          lighter version of cursed text. aLtErNaTiNg caps is the meme style for mocking quotes.
        </p>
      </>
    ),
    faq: [
      { question: "What is weird text used for?", answer: "Usernames that stand out, meme captions, puzzle clues and bios. It looks odd but stays readable, unlike cursed text." },
      { question: "Is weird text the same as a different language?", answer: "No. The characters come from other scripts, but the words are still English — a Thai or Greek reader would see nonsense." },
      { question: "Why does the mocking SpongeBob text start lowercase?", answer: "The meme style alternates starting with a lowercase letter. Type with a space at the start if you want it to begin with a capital." },
      { question: "Are weird letters safe to use in passwords?", answer: "Avoid it. Many sites do not handle these characters the same way on every device, so you could lock yourself out." },
    ],
  },

  creepy: {
    variant: "creepy",
    path: "/creepy-text-generator",
    hero: { src: "/generators/hero/creepy-text-generator.webp", alt: "Haunted attic with an old typewriter and ghostly paper sheets" },
    toolType: "creepy_text_generator",
    name: "Creepy Text Generator",
    heading: ["Creepy Text", "Generator"],
    title: "Creepy Text Generator — Haunted & Dripping Letters to Copy",
    description:
      "Free creepy text generator: 10 eerie styles — creepy letters, dripping, haunted Old English, whisper, mirror writing and possessed Zalgo — with a creepiness slider. Tap to copy for Halloween posts and horror bios.",
    keywords: ["creepy text generator", "creepy text", "creepy font", "creepy letters", "halloween text generator", "haunted font copy and paste", "spooky text generator"],
    intro: "Eerie, haunted, dripping text with a creepiness slider. Ten creepy styles for Halloween posts and horror bios.",
    inShort:
      "Creepy text uses unsettling look-alike letters, haunted blackletter and a little dripping Zalgo to make words feel wrong. This generator shows 10 creepy styles at once, lets you set how much they drip with a 1–10 slider, and copies any style in one tap.",
    card: "random-word-generator",
    works: [
      { where: "Instagram & TikTok (Halloween posts)", result: "All styles. Dripping at 3–5 reads best." },
      { where: "Discord", result: "All styles." },
      { where: "Story & horror titles (Wattpad, AO3)", result: "Haunted Old English and Creepy letters work in titles." },
      { where: "Older phones", result: "Cursed runes may show boxes." },
    ],
    howTo: [
      <><strong>Type a line</strong>, like “something is watching”.</>,
      <><strong>Use the slider</strong> to control the drip on Dripping and Possessed.</>,
      <><strong>Tap a style</strong> to copy it.</>,
    ],
    body: (
      <>
        <p>
          Creepy is quieter than scary. The styles here lean on things that feel slightly wrong: letters swapped for shapes from other
          scripts, whispered superscript, mirror writing, and a few marks dripping from the bottom of each word. Possessed goes full Zalgo
          if you want it.
        </p>
        <p>Tip: mix styles in one caption — a Haunted Old English title and a Whisper line underneath look more unsettling than one style alone.</p>
      </>
    ),
    faq: [
      { question: "What makes text look creepy?", answer: "Letters that are almost right, small marks hanging below the line, and old blackletter shapes. The eye reads the word but notices something is off." },
      { question: "What is the difference between creepy and scary text?", answer: "Creepy styles are subtle and eerie. The scary text generator goes louder: skulls, bloody drips, crossed-out capitals and demonic Zalgo." },
      { question: "Can I use creepy text for a Halloween party invite?", answer: "Yes. Haunted Old English works well in the title. Keep the date, time and address in plain text so everyone can read it." },
      { question: "Why does mirror writing not look flipped?", answer: "Mirror writing reverses the order of the letters. Unicode has no full set of mirrored letters, so the Upside down style is the closest flip." },
    ],
  },

  scary: {
    variant: "scary",
    path: "/scary-text-generator",
    hero: { src: "/generators/hero/scary-text-generator.webp", alt: "Candlelit sealed letter on a windowsill under a full moon" },
    toolType: "scary_text_generator",
    name: "Scary Text Generator",
    heading: ["Scary Text", "Generator"],
    title: "Scary Text Generator — Horror Fonts, Skulls & Bloody Drips",
    description:
      "Free scary text generator: 10 horror styles — bloody drip, demonic Zalgo, skulls, ritual runes, crossed-out capitals and horror Old English — with an intensity slider. Tap to copy for horror titles and Halloween.",
    keywords: ["scary text generator", "scary font", "scary text", "horror text generator", "horror font copy and paste", "bloody text", "demon text generator"],
    intro: "Horror-movie text: bloody drips, skulls, demonic Zalgo and ritual runes, with an intensity slider. Tap to copy.",
    inShort:
      "Scary text uses horror-style blackletter, skull frames, dripping marks and heavy Zalgo to make words look like a horror-movie title. This generator shows 10 scary styles together, sets the intensity from 1 to 10, and copies any style in one tap.",
    card: "random-word-generator",
    works: [
      { where: "YouTube & TikTok titles", result: "Works. Skulls and Horror Old English stay readable in thumbnails." },
      { where: "Discord server names", result: "All styles. Demonic at 10 can be too tall for the sidebar." },
      { where: "Instagram captions", result: "All styles." },
      { where: "Roblox / Minecraft names", result: "Blocked — plain letters only." },
    ],
    howTo: [
      <><strong>Type your title</strong> — two to four words works best.</>,
      <><strong>Set the intensity.</strong> It drives Bloody drip and Demonic.</>,
      <><strong>Tap a style</strong> to copy, then paste.</>,
    ],
    body: (
      <>
        <p>
          The scary set is built for titles: horror films, creepypasta, haunted-house posters and Halloween stream names. Bloody drip hangs
          marks under bold blackletter; Demonic always runs two steps stronger than the slider; Skulls frames capitals with ☠.
        </p>
        <p>For something subtler, try the creepy text generator; for pure Zalgo with full control, use the cursed text generator.</p>
      </>
    ),
    faq: [
      { question: "What is the scariest style here?", answer: "Demonic at intensity 8–10: heavy Zalgo in every direction. Bloody drip is the most “horror poster” look." },
      { question: "Will the scary text show in a YouTube title?", answer: "Yes, YouTube accepts Unicode titles. Heavy Zalgo may be trimmed in some views, so test the title before you publish." },
      { question: "Is there a scary font I can install?", answer: "This tool does not install a font. It outputs symbols, which is why it works in apps where you cannot change the font." },
      { question: "Can I make the text bloody red?", answer: "Unicode carries no colour. Pair the text with a red emoji such as 🩸 or use a red background in your design tool." },
    ],
  },

  strike: {
    variant: "strike",
    path: "/strikethrough-text-generator",
    hero: { src: "/generators/hero/strikethrough-text-generator.webp", alt: "Notebook with scribbled lines neatly crossed out" },
    toolType: "strikethrough_text_generator",
    name: "Strikethrough Text Generator",
    heading: ["Strikethrough Text", "Generator"],
    title: "Strikethrough Text Generator — Cross Out & Underline Text",
    description:
      "Free strikethrough text generator: cross out, slash, tilde strike, underline, double underline, overline and wavy underline — 12 styles you can paste into Instagram, X, Discord or LinkedIn. Tap to copy.",
    keywords: ["strikethrough text generator", "strikethrough text", "cross out text", "underline text generator", "strikethrough font", "line through text copy and paste", "strikethrough instagram"],
    intro: "Cross out or underline any text and paste it where there is no formatting button. Twelve line styles, one tap to copy.",
    inShort:
      "A strikethrough text generator adds a combining line through or under every letter, so the crossed-out look survives copy and paste into Instagram, X, LinkedIn or any app without a formatting toolbar. This page shows 12 line styles — strike, slash, tilde, underline, double underline, overline and more — and copies any of them in one tap.",
    card: "random-word-generator",
    works: [
      { where: "Instagram, TikTok, X", result: "All styles." },
      { where: "LinkedIn posts", result: "All styles — useful for “old price / new price” posts." },
      { where: "Discord", result: "All styles. Discord also has its own ~~strike~~ markdown." },
      { where: "Excel, Google Sheets", result: "Shows, but formulas see symbols, not text." },
    ],
    howTo: [
      <><strong>Type the words</strong> you want to cross out or underline.</>,
      <><strong>Tap a line style</strong> to copy.</>,
      <><strong>Mix it:</strong> “<span className="line-through">old</span> new” — copy just the part you need and type the rest normally.</>,
    ],
    body: (
      <>
        <p>
          Each style uses one Unicode combining mark after every character: U+0336 for a long strike, U+0335 for a short one, U+0338 for a
          slash, U+0332 for an underline, U+0333 for a double underline and U+0305 for an overline. Because the line is part of the text,
          it stays when you paste — no rich-text needed.
        </p>
        <p>
          Spaces are left alone, so the line breaks between words. That keeps line wrapping clean on phones.
        </p>
      </>
    ),
    faq: [
      { question: "How do I cross out text on Instagram?", answer: "Type your text above, tap Strikethrough to copy, and paste it into your caption, bio or comment. Instagram has no strike button, but it keeps the combining line." },
      { question: "Why does the line have gaps between words?", answer: "The line is added to each letter, not to spaces, so it breaks at spaces. That keeps text wrapping correctly." },
      { question: "Can I underline text on X (Twitter)?", answer: "Yes. Copy the Underline or Double underline style and paste it. Each underlined letter counts as two characters." },
      { question: "Does strikethrough text work in Discord?", answer: "Yes. You can also type ~~text~~ in Discord, but the copied version also works in nicknames and channel topics, where markdown does not." },
    ],
  },

  script: {
    variant: "script",
    path: "/subscript-generator",
    hero: { src: "/generators/hero/subscript-generator.webp", alt: "Chalkboard with tiny letters beside a big formula" },
    toolType: "subscript_generator",
    name: "Subscript & Superscript Generator",
    heading: ["Subscript &", "Superscript Generator"],
    title: "Subscript Generator — Superscript & Subscript Text to Copy",
    description:
      "Free subscript and superscript generator: turn text into ₛᵤᵦₛ꜀ᵣᵢₚₜ or ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ, write chemistry formulas like H₂O, exponents like x², and ordinals like 1ˢᵗ. Tap to copy anywhere.",
    keywords: ["subscript generator", "superscript generator", "subscript text", "superscript text", "small text generator", "tiny text generator", "h2o subscript", "exponent copy and paste"],
    intro: "Tiny raised and lowered text for formulas, exponents, footnotes and bios — H₂O, x², 1ˢᵗ — one tap to copy.",
    inShort:
      "A subscript generator swaps characters for the small lowered (₁₂₃) or raised (¹²³) versions in Unicode, so formulas like H₂O and x² paste correctly into chats, posts and documents without formatting. This page has 8 modes, including smart chemistry (only the numbers drop), exponents (anything after ^ goes up) and ordinals.",
    card: "random-word-generator",
    works: [
      { where: "Chat, email, social posts", result: "All modes." },
      { where: "Google Docs, Word, Notion", result: "Works; for long formulas their own superscript button is cleaner." },
      { where: "Spreadsheets", result: "Shows, but the cell becomes text, not a number." },
      { where: "Older Windows fonts", result: "Some subscript letters may show as boxes." },
    ],
    howTo: [
      <><strong>Type normal text</strong> — use <code>^</code> before an exponent (<code>x^2</code>) and write formulas as <code>H2O</code>.</>,
      <><strong>Pick a mode:</strong> Chemistry lowers only numbers, Math exponents raises what follows ^.</>,
      <><strong>Tap to copy</strong> and paste.</>,
    ],
    body: (
      <>
        <p>
          Unicode has a full set of superscript digits and most superscript letters, but only some subscript letters (a, e, h, i, j, k, l,
          m, n, o, p, r, s, t, u, v, x). Letters with no subscript form are left as normal letters, so the subscript style is perfect for
          numbers and formulas and patchy for whole words. Use Tiny lowercase or Small caps when you want whole words small.
        </p>
      </>
    ),
    faq: [
      { question: "How do I type H₂O?", answer: "Type H2O and copy the Chemistry formula style — only the numbers become subscript." },
      { question: "How do I write x squared?", answer: "Type x^2 and copy Math exponents. Anything after ^ up to the next space is raised: x^2 → x², e^-x stays readable too." },
      { question: "Why are some letters not in subscript?", answer: "Unicode never added subscript forms of every letter. Only a, e, h, i, j, k, l, m, n, o, p, r, s, t, u, v and x exist, plus digits and + − = ( )." },
      { question: "Is superscript text the same as “tiny text”?", answer: "Yes. Tiny text generators use the superscript letters. Tiny lowercase gives the most even result because more lowercase superscript letters exist." },
    ],
  },
};
