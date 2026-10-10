/** Authored seed names and finite local recipes. No third-party name corpus or API. */
export type NameKind = "band" | "dragon";
export type NameRecipe = {
  id: string; kind: NameKind; style: string; length: string; name: string;
  seedPattern?: string; pronunciation?: string; title?: string; detail: string;
};
export const NAME_STYLES = {
  band: [
    { id: "indie", label: "Indie & alternative", note: "Soft textures and unexpected everyday images for a guitar-led or intimate project." },
    { id: "rock", label: "Rock & punk", note: "Hard consonants, street-level images and energetic contrasts for a loud project." },
    { id: "electronic", label: "Electronic", note: "Signals, light and motion for a synth-led or rhythm-focused project." },
  ],
  dragon: [
    { id: "ember", label: "Ember", note: "An imagined fire-country dragon: warm vowels, firm endings and a landscape shaped by heat." },
    { id: "tide", label: "Tide", note: "An imagined sea-country dragon: flowing sounds and a home among channels, reefs and rain." },
    { id: "gale", label: "Gale", note: "An imagined sky-country dragon: quick sounds and a home among wind, cloud and high paths." },
    { id: "stone", label: "Stone", note: "An imagined mountain dragon: grounded sounds and a home among ridges, caverns and old roads." },
  ],
} as const;

// Each row pairs a complete starting name with one explicit seed-word recipe.
// A seed is never sent away, treated as an instruction, or silently ignored.
const bandRows: Record<string, string[][]> = {
  indie: [
    ["Paperwake|{seed}wake", "Mossradio|{seed}radio", "Velvetide|{seed}tide", "Porchlighten|{seed}light", "Juniperal|{seed}al", "Windowbloom|{seed}bloom", "Linenweather|{seed}weather", "Thimbleglow|{seed}glow", "Hushmeadow|{seed}meadow", "Petalshift|{seed}shift", "Orchardelle|{seed}elle", "Dapplewell|{seed}well"],
    ["Velvet Switchyard|{seed} Switchyard", "Paper Orchard|Paper {seed}", "Juniper Static|{seed} Static", "Window Weather|Window {seed}", "Linen Satellites|{seed} Satellites", "Quiet Turntables|Quiet {seed}", "Pocket Sundials|Pocket {seed}", "Moss Telegram|{seed} Telegram", "Porcelain Echoes|{seed} Echoes", "Clover Cinema|{seed} Cinema", "Lantern Neighbors|{seed} Neighbors", "Sunday Footnotes|Sunday {seed}"],
    ["Letters after Lanterns|{seed} after Lanterns", "Under Paper Skies|Under {seed} Skies", "The Velvet Detour|The {seed} Detour", "Windows without Weather|{seed} without Weather", "Postcards from Porches|Postcards from {seed}", "A Quiet Turntable|A Quiet {seed}", "Orchards at Closing|{seed} at Closing", "Between Two Sundials|Between Two {seed}", "Clover in Stereo|{seed} in Stereo", "The Linen Parade|The {seed} Parade", "Neighbors of Noon|Neighbors of {seed}", "Small Hours Cinema|Small {seed} Cinema"],
  ],
  rock: [
    ["Rivetwake|{seed}rivet", "Brakeroar|{seed}roar", "Asphaltide|{seed}ride", "Voltgrit|{seed}grit", "Knucklerail|{seed}rail", "Cinderclash|{seed}clash", "Rustsignal|{seed}signal", "Rumbleforge|{seed}forge", "Sparklatch|{seed}latch", "Ironstutter|{seed}stutter", "Riffquarry|{seed}quarry", "Gravelrush|{seed}rush"],
    ["Rivet Parade|{seed} Parade", "Basement Voltage|{seed} Voltage", "Asphalt Choir|{seed} Choir", "Broken Turnstile|Broken {seed}", "Copper Outcry|{seed} Outcry", "Rumble Ledger|{seed} Ledger", "Gravel Anthem|{seed} Anthem", "Static Stairwell|{seed} Stairwell", "Rust Confetti|{seed} Confetti", "Midnight Ratchet|{seed} Ratchet", "Tin Barricade|Tin {seed}", "Spark District|{seed} District"],
    ["No Quiet Exits|No Quiet {seed}", "The Rivet Parade|The {seed} Parade", "Noise after Closing|{seed} after Closing", "Out past Asphalt|Out past {seed}", "Borrowed Basement Thunder|Borrowed {seed} Thunder", "Three Bent Antennas|Three Bent {seed}", "Static on Stairs|{seed} on Stairs", "Last Copper Signal|Last {seed} Signal", "Rumble without Permission|{seed} without Permission", "The Gravel Circuit|The {seed} Circuit", "Sparks below Streetlights|{seed} below Streetlights", "Rivets before Sunrise|{seed} before Sunrise"],
  ],
  electronic: [
    ["Prismora|{seed}ora", "Lumaspan|{seed}span", "Phasebloom|{seed}phase", "Haloframe|{seed}frame", "Vectorglow|{seed}vector", "Neonfold|{seed}fold", "Pixelharbor|{seed}harbor", "Chromaloop|{seed}loop", "Signaldawn|{seed}dawn", "Pulsearc|{seed}arc", "Gridripple|{seed}ripple", "Hertzpetal|{seed}hertz"],
    ["Prism Relay|{seed} Relay", "Neon Estuary|{seed} Estuary", "Soft Voltage|Soft {seed}", "Pixel Weather|Pixel {seed}", "Velour Circuit|{seed} Circuit", "Signal Garden|{seed} Garden", "Phase Lantern|{seed} Lantern", "Chrome Drift|{seed} Drift", "Quiet Vector|Quiet {seed}", "Lumen Transit|{seed} Transit", "Pulse Terrace|{seed} Terrace", "Glass Frequency|{seed} Frequency"],
    ["After the Signal|After the {seed}", "The Prism Ferry|The {seed} Ferry", "Gardens of Voltage|Gardens of {seed}", "Noon in Pixels|{seed} in Pixels", "Under Neon Water|Under {seed} Water", "Soft Light Transit|Soft {seed} Transit", "A Moving Frequency|A Moving {seed}", "Between Two Pulses|Between Two {seed}", "Signals from Glass|Signals from {seed}", "The Quiet Vector|The Quiet {seed}", "Chrome after Rain|{seed} after Rain", "Lanterns in Phase|{seed} in Phase"],
  ],
};

export const BAND_NAMES: NameRecipe[] = Object.entries(bandRows).flatMap(([style, lengths]) => lengths.flatMap((rows, index) => rows.map((row, i) => {
  const [name, seedPattern] = row.split("|");
  return { id: `band-${style}-${index + 1}-${i}`, kind: "band", style, length: String(index + 1), name, seedPattern,
    detail: NAME_STYLES.band.find(s => s.id === style)!.note };
})));

const dragonRows = {
  ember: {
    names: ["Varek|VAH-rek", "Zharo|ZHAH-roh", "Urvek|OOR-vek", "Cazra|KAZ-rah", "Fyran|FEER-an", "Korax|KOR-aks", "Varethon|VAH-reh-thon", "Zharavex|ZHAH-rah-veks", "Urvekora|oor-veh-KOR-ah", "Cazravel|KAZ-rah-vel", "Fyrandor|FEER-an-dor", "Korathen|KOR-ah-then"],
    titles: ["Keeper of the Coal Orchard", "the Lantern Furnace", "Watcher of the Red Causeway", "the Cinder Cartographer", "Guardian of the Warm Vault", "the Copper Dawn", "Heir to the Ash Stair", "the Kiln beneath Winter", "Warden of the Glass Volcano", "the Last Hearthlight", "Sleeper in the Ember Well", "the Sunken Forge"],
  },
  tide: {
    names: ["Neril|NEH-ril", "Oshra|OSH-rah", "Veylo|VAY-loh", "Sulen|SOO-len", "Mareq|mah-REK", "Ishven|ISH-ven", "Nerivane|NEH-rih-vayn", "Oshravel|OSH-rah-vel", "Veylorin|VAY-loh-rin", "Sulentha|soo-LEN-thah", "Maroviel|mah-roh-vee-EL", "Ishveran|ISH-veh-ran"],
    titles: ["Keeper of the Pearl Causeway", "the Rainbound Bell", "Watcher of the Turning Reef", "the Saltglass Pilgrim", "Guardian of the Tidal Archive", "the Silver Undertow", "Heir to the Drowned Orchard", "the Lantern under Water", "Warden of the Blue Narrows", "the Mistbound Compass", "Sleeper in the Shell Vault", "the Harbor without Shore"],
  },
  gale: {
    names: ["Aevik|AY-vik", "Tazri|TAZ-ree", "Shyven|SHY-ven", "Oryth|OR-ith", "Veska|VES-kah", "Zelir|ZEH-leer", "Aevorath|AY-voh-rath", "Tazriven|TAZ-rih-ven", "Shyverel|SHY-veh-rel", "Orythen|OR-ih-then", "Veskarin|VES-kah-rin", "Zelivora|zeh-lih-VOR-ah"],
    titles: ["Keeper of the Cloud Stair", "the Kitebound Herald", "Watcher of the Pale Horizon", "the Thunder Cartographer", "Guardian of the Open Spire", "the Unwritten Wind", "Heir to the High Crossing", "the Bell above Rain", "Warden of the Storm Orchard", "the Featherless Comet", "Sleeper on the Sky Bridge", "the Last Updraft"],
  },
  stone: {
    names: ["Drovak|DROH-vak", "Kelun|KEH-loon", "Bravik|BRAH-vik", "Torven|TOR-ven", "Gorath|GOR-ath", "Ruzek|ROO-zek", "Drovalen|DROH-vah-len", "Kelundor|KEH-loon-dor", "Bravorek|BRAH-voh-rek", "Toraveth|TOR-ah-veth", "Goruneth|GOH-roo-neth", "Ruzekhan|ROO-zeh-kan"],
    titles: ["Keeper of the Basalt Garden", "the Mountain Lantern", "Watcher of the Buried Road", "the Granite Scribe", "Guardian of the Hollow Crown", "the Patient Avalanche", "Heir to the Deep Stair", "the Door beneath the Ridge", "Warden of the Crystal Quarry", "the Stonebound Compass", "Sleeper in the Iron Orchard", "the Valley Remembered"],
  },
};

export const DRAGON_NAMES: NameRecipe[] = Object.entries(dragonRows).flatMap(([style, group]) => group.names.map((row, i) => {
  const [name, pronunciation] = row.split("|");
  return { id: `dragon-${style}-${i}`, kind: "dragon", style, length: name.length <= 6 ? "short" : "long", name, pronunciation,
    title: group.titles[i], detail: NAME_STYLES.dragon.find(s => s.id === style)!.note };
}));
export const NAME_CORPUS_VERSION = 1;
export function nameRecipes(kind: NameKind): NameRecipe[] { return kind === "band" ? BAND_NAMES : DRAGON_NAMES; }
