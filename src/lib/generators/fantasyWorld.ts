import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Each result is a full world concept: a name with its meaning (the base item),
// plus land, climate, magic, conflict, two factions, a wonder and a story hook.
// Pools are tagged by tone so a dark world never gets a whimsical wonder.
export type WorldTone = "high" | "dark" | "steam" | "mythic" | "whimsy";
export type WorldSize = "continent" | "archipelago" | "kingdom";

interface WorldName { name: string; meaning: string; tone: WorldTone }

const list = (s: string) => s.split("; ");

const NAMES: Record<WorldTone, string> = {
  high: "Aurelmar = golden sea; Valdoran = land of the bright oath; Elythria = song of the first dawn; Caerwynd = fortress of the clear wind; Solenne = the world that kept its sun; Thaloria = crown of green hills; Mirenhal = hall of silver rivers; Ostravane = the high watch; Lunareth = moon-blessed country; Briathorn = thorn of honor; Evenfell = hills at evening; Quillarion = pen-and-sword realm; Hallowmere = holy lake-land; Ardenvale = valley of the old stag; Seraphine Reach = where angels once landed",
  dark: "Morvaine = black vein; Grimhollow = the hungry hollow; Ashenmoor = burned heath; Vael Noctis = night's veil; Dreadmere = lake of fear; Cinderwake = what is left after the fire; Hollowrest = the grave that never filled; Blackthorn Deep = the wood that bites; Sablefen = dark marsh; Umbrath = shadow's throne; Wraithmoor = the haunted moor; Corvane = crow country; Bleakmarrow = bone-deep winter; Nethervale = the valley below; Sorrowgate = where the dead leave",
  steam: "Brasshaven = harbor of brass; Cogsworth = the toothed town; Ironmere = lake of iron; Pistonia = land of the pump; Emberfall Union = fires that never dim; Gaslight Reach = lamp-lit coast; Copperhead Isles = green-roofed islands; Vaporia = the cloud country; Rivetgate = where the rail begins; Clockhaven = hours in harbor; Smokestack Crown = a crown of chimneys; Tinderwick = the lamp that lit the age; Galena = lead-grey stone; Boilerton = the town that sings; Lathewick = turned-metal village",
  mythic: "Anuvar = the first-born land; Kerathos = bull of the sun; Aethra = the upper air; Nimrael = fallen from heaven; Tamuzu = green shoot; Orokai = river of the gods; Khemara = the black earth; Thessarion = the eight-gated; Oumenar = navel of the world; Ishkaran = house of fire; Daruvia = the land between two flames; Sutherem = the south seat of heaven; Ymirhal = hall of the frost giant; Pelagon = the sea-father's court; Ixtabel = the weaving of the sky",
  whimsy: "Pipplewick = a candle that giggles; Marmalade Marches = jam-colored borderlands; Thistledown = seed on the wind; Wobblewood = the forest that sways; Nibbleton Deep = nibbling mouse-land; Fizzlewhistle = bubbles with a tune; Buttonmoor = a heath of lost buttons; Tumbledoo = the cheerful fall; Snicklefritz Isles = islands that giggle; Hobblewhim = the limp that became a dance; Cloudberry Hollow = a berry above the clouds; Lanternberry = sweet light; Poppywhistle = a flower that calls; Muddlemarsh = the happy mess; Twinklebrook = stars in the stream",
};

export const WORLD_NAMES: WorldName[] = (Object.keys(NAMES) as WorldTone[]).flatMap((tone) =>
  list(NAMES[tone]).map((e) => { const [name, meaning] = e.split(" = "); return { name, meaning, tone }; }),
);

const LAND: Record<WorldSize, string[]> = {
  continent: list("A single vast continent split by a mountain spine that is taller on the western side, with rivers that run east for a thousand miles; Two continents joined by a narrow land bridge that every army must cross; A continent shaped like a hand, with five peninsulas each ruled by a different culture; A huge inland basin ringed by cliffs, with all the great cities on the rim and the old ruins in the sunken middle; A continent where a salt desert in the north gives way to jungle in the south over only three days of travel; A broad plain of grass broken by a few tall, flat-topped mesas where the oldest towns sit; A continent cut in two by a rift valley so deep that its floor holds a separate climate; A coastline of high white cliffs with a green forest above them and a labyrinth of caves below; A world-wide river delta where thousands of small channels turn the whole continent into a maze of islets and levees; A continent carried on the back of a mountain range that is slowly moving, so maps go out of date every century").map((s) => s.trim()),
  archipelago: list("Nine hundred islands scattered across a warm shallow sea, linked by tide-roads that appear only at low tide; A ring of volcanic islands around a drowned caldera that holds the capital city; A chain of long, narrow islands like a spine, each one a different climate zone; A lattice of floating reed islands tied together by ropes, rebuilt every spring; Islands that sit on the backs of enormous sleeping sea creatures, which the locals have learned not to wake; A scatter of rocky islets surrounded by deep fog, where a lighthouse is the only safe navigation; Seven large islands and countless atolls, tied together by an old empire's lighthouse chain; A drowned continent whose mountain tops are now islands, with ruins visible beneath the clear water; Islands that rise and sink with the monsoon tides, so the map changes twice a year; A crescent of green islands sheltering a calm inner sea, with a single narrow pass to the open ocean").map((s) => s.trim()),
  kingdom: list("A single realm in a deep river valley, bounded by mountains on three sides and the sea on the fourth; A kingdom built around one enormous lake with a fortress town on every shore; A forest country where the roads are all cut through ancient trees and no one has seen the sky in a day's walk; A walled highland plateau with terraced farms stacked up the slopes; A realm of canyons and bridges, where towns hang from the cliffs and the ground below is a mystery; A coastal strip of marsh, dune and salt pan that is only twenty miles wide but five hundred long; A kingdom made of one great city and the farmland the city can reach in a day; A mountain valley sealed off by a pass that is open only four months of the year; A tidal kingdom on an estuary that doubles in size at low water; A hilltop realm of a thousand small castles, each with its own lord and its own feud").map((s) => s.trim()),
};

const CLIMATE = list("Mild and rainy for most of the year, with a short bright summer that everyone celebrates; Two long dry seasons and one violent storm season that rebuilds the coast; Cold, clear winters and green springs, with snow that falls in the highlands even in summer; A hot, damp climate where mist rises from the forests every dawn; Constant sea wind that bends every tree in the same direction; Four sharp seasons, each lasting exactly ninety days, as though it were a rule; Long winters of three months of darkness, balanced by summers where the sun hardly sets; Dry heat by day and freezing nights, with a daily wind that shifts the sand; Heavy autumn fog that closes the roads for weeks; Almost no seasons at all, only a slow drift from warm and wet to warm and dry; A climate that changes by altitude, from jungle at sea level to ice on the peaks, all within a day's climb; Frequent thunderstorms driven by the mountains, with lightning that strikes the same ridge every night; Gentle trade winds in spring and bitter gales in winter, so sailing is a seasonal craft; Perpetual twilight under a thick ash-colored sky; Warm rain that falls every afternoon at the same hour; A cool, bright climate with endless blue skies and sudden, short-lived snows");

const MAGIC: Record<WorldTone, string[]> = {
  high: list("Source: starlight caught in crystal wells. Cost: each spell dims the well, so mages guard their sources fiercely; Source: the songs of the first elves, kept in living trees. Cost: casters must give up one memory for every great working; Source: oaths. Cost: a sworn word makes magic, and a broken oath leaves a visible scar; Source: leylines under the old roads. Cost: tapping them makes the land lose color for a season; Source: dragons' breath, bound to rings. Cost: the ring-bearer ages one year per use; Source: the sun itself, drawn through lenses. Cost: it works only by day, and night belongs to the other kind of power; Source: names. Cost: every true name you learn makes you lose a bit of your own; Source: sacred groves tended by druid-priests. Cost: each cut tree must be replanted by the same hand"),
  dark: list("Source: the bones of dead gods beneath the soil. Cost: casters slowly turn pale and hear the dead more clearly each year; Source: blood, freely given or taken. Cost: spells run on pain, and the cheapest pain is someone else's; Source: bargains with something in the dark. Cost: the thing always collects, in its own time; Source: grief, distilled into black glass. Cost: the user can no longer feel joy for a day per use; Source: the dying breaths of people near death. Cost: priests of the craft are called to every deathbed, and are not welcome; Source: shadow, bottled in lamps. Cost: the caster's own shadow weakens and one day goes out; Source: a plague that grants gifts to survivors. Cost: the gift is permanent, and so is the contagion; Source: stolen years. Cost: every spell takes a day from someone's life, and the books are balanced in blood"),
  steam: list("Source: aether condensed in glass tubes and burned in engines. Cost: exhaust builds up and gives the sensitive nightmares; Source: lightning harnessed by towers. Cost: storms now strike where they are needed least; Source: alchemical minerals dug from deep pits. Cost: miners go silver-eyed and live short lives; Source: clockwork charms that run on wound will. Cost: they need winding by someone who is willing to give up sleep; Source: runes etched on brass plates. Cost: each plate burns out and must be recast with rare metals; Source: aether-rich coal. Cost: smoke slowly changes the weather; Source: hermetic circuits, inscribed in copper wire. Cost: the guild that holds the patents controls who can cast; Source: pressure-bound spirits in boilers. Cost: they are not always happy about it"),
  mythic: list("Source: the gods' own names, spoken in rites. Cost: each use must be repaid with sacrifice at the proper shrine; Source: ancestors, who answer from the other world. Cost: the living owe them stories, and an unanswered debt becomes a haunting; Source: the cycles of sun and moon. Cost: power waxes and wanes, and rites must follow exactly; Source: heroic deeds, which become sparks of power. Cost: only those who risk their lives for others can use it; Source: sacred animals who give their blessing. Cost: the user must keep the animal's laws all their life; Source: the world-tree and its roots. Cost: each working takes some health from the tree, and the tree is sick; Source: dreams shared with the gods. Cost: sleepers who are too long in the god's dream do not wake; Source: fire stolen from heaven. Cost: the gods keep a list of those who use it"),
  whimsy: list("Source: laughter, which glows in jars. Cost: spells run on joy, and a gloomy mage cannot cast; Source: wishes whispered to dandelions. Cost: every wish comes true in the silliest way possible; Source: tea. Cost: all magic has to be brewed, and the brew takes at least a quarter of an hour; Source: songs, sung in rounds. Cost: it only works if someone else joins in; Source: buttons sewn into coats. Cost: you lose the button if the spell is cast; Source: stories told to a sleepy dragon. Cost: the dragon must be tucked in afterward; Source: the moon's rattle, dropped into puddles. Cost: spells leave small muddy pawprints; Source: friendship. Cost: it doesn't work at all when you are cross with your friends"),
};

const CONFLICT: Record<WorldTone, string[]> = {
  high: list("Two royal houses claim the same sword-bearer's crown, and each has a believable ancestor; The old elf-cities and the young human kingdoms disagree about who owns a sacred river; A prophesied hero has appeared in three different places at once, and all of them are convincing; A great school of magic has closed its doors, and its enemies are gathering outside; A good king is dying with no heir, and every kind of ambition is moving into the court; The border between the mortal world and the fae courts has slipped, and the fae demand rent; A holy order and a thieves' guild are secretly allies, and a young paladin has just discovered it"),
  dark: list("A plague of unquiet dead rises every winter, and the living argue about whether to burn or bury; A tyrant-king rules from a tower no one has seen him leave in thirty years; Wolves and men are at war, and the wolves have begun to speak; The last free city has made a deal with a demon and now the price has come due; A bleak cult is dragging the sun lower each year, and half the nobles belong to it; Famine, and the granaries are full, but locked by the lords; The Church burns anyone with a magical gift, and someone is secretly teaching children to cast"),
  steam: list("A railway baron wants to cut a line through the sacred hills, and the old gods have started to object; Workers in the foundry districts are on strike, and the guilds are hiring sky-pirates to break it; Two nations race to build the first aether-powered airship fleet; A rogue inventor has built an engine that thinks, and now it is asking for citizenship; Colonial governors keep a magical ore as a monopoly, and a rebel movement is arming itself with stolen engines; The old nobility is losing power to merchants and the nobility is willing to hire assassins; A smog-bound capital is slowly poisoning itself, and the people in charge profit from the poison"),
  mythic: list("A god has died, and the pantheon is arguing about who should take their domain; Heroes who once beat monsters now want to rule the people they saved; The sun god's daughter has stopped the sun from setting, and the other gods cannot agree what to do; An oracle has foretold the end of the age on a date that is only three years off; A sea-god has demanded the tribute of a firstborn child from every coast town; Two sibling gods are at war over a mortal they both love; The great flood is coming again, and a few mortals have been chosen to survive it"),
  whimsy: list("The Great Pie Contest has been declared a tie between two rival bakeries, and neither will accept it; All the clocks have stopped at tea-time, and nobody can tell which meal is next; The moon has gone missing and the neighboring country is suspiciously cheerful; Two villages are arguing about whether a certain hill is a hill or a very patient sleeping giant; A grumpy cloud has parked over the capital for a week and will not move on; The royal ducks have formed a union and have demands; The kingdom's only map is wrong in a way that is gradually becoming right"),
};

const FACTION: Record<WorldTone, string[]> = {
  high: list("The Sunwarden Order — knights who guard the pilgrim roads and answer to no king; The Silver Conclave — mages who trade spells for oaths; The House of Lanterns — a noble family that controls the lighthouse chain; The Green Assembly — druids who decide which forests may be cut; The Gilded Quill — scribes, spies and archivists; The Wayfarers' Guild — caravan masters who hold the only reliable maps; The Court of Petals — an elven embassy that moves between the cities; The Ember Choir — priests who tend the flames of the first temples"),
  dark: list("The Pale Court — nobles who have found a way to avoid dying; The Gravewardens — the only people trusted to bury the dead; The Black Chorus — a cult that sings the sun down; The Ashen Hand — veterans turned bandit lords; The Tallow Church — an inquisition that burns what it fears; The Wolf Lords — hunters who bind themselves to the beasts they kill; The Lantern Men — nameless guides who walk travelers through the fog for a price; The Hollow Crown — a council of masked regents who rule in a missing king's name"),
  steam: list("The Brass Concord — guild owners who set the price of everything with a gear in it; The Soot Union — workers who keep the engines running and know all their faults; The Cloud Corsairs — sky pirates who raid freight dirigibles; The Lamplighters — a quiet order of engineers who maintain the city's gas and aether lines; The Ministry of Patents — officials who decide which inventions the public may have; The Velvet Syndicate — smugglers with friends in the highest places; The Orrery Society — scholars studying the real motion of the heavens; The Flintlock Marshals — a mounted police that answers to the Crown"),
  mythic: list("The Temple of Nine Hearths — priests who tend the first fire; The Heroes' Circle — legends too old to retire; The Children of the Bull — nomads who follow the star-herd; The Oracle's Servants — attendants who edit the prophecies before they are read; The Sea-Father's Court — a coral-throned council of sea spirits; The Hundred-Handed — monster-born who guard the gate of the underworld; The Loom Sisters — weavers who actually spin fate; The Ash Pilgrims — penitents who walk the world, atoning for a god's crime"),
  whimsy: list("The Jam Jar Knights — brave, sticky and sworn to protect the preserves; The Grand Order of Hatters — rulers of the capital by a very small margin; The Cloud Shepherds — keepers of herds of sheep-shaped clouds; The Teapot Parliament — a ruling body that meets only to argue about milk; The Guild of Gentle Goblins — mischief-makers with a code of honor; The Moonbeam Messengers — snails who deliver the post, eventually; The Button Counters — accountants of all lost things; The Society of Slightly Haunted Houses — a club for ghosts and their landlords"),
};

const WONDER: Record<WorldTone | "any", string[]> = {
  any: list("A waterfall that falls upward every full moon; A forest where every tree carries a lit lantern fruit; A mountain with a door in it that has never been opened; A lake so still that it shows the sky of a different world; A bridge that appears only to those who need to cross; A city built entirely inside the skeleton of a titan; A field of glass flowers that sing when the wind blows; A tower that can be seen from every place in the world but can be found in none; A river that flows in a perfect circle and returns to its own source; A cliff of mirrors that shows the viewer's older self; A desert of black sand that remembers every footprint; A giant tree whose roots form a hanging garden of streams; A sea that glows with faint pulses of color at night; A standing stone ring that rings like a bell at dawn; A sinkhole with a staircase carved in the wall, going down further than anyone has measured; A hot spring that cures any ill but one chosen at random; A meadow where time passes at a different rate; A cave of echoes that answers in the voices of the dead; A wall of ice that holds a sleeping army; A garden that grows a new map every season"),
  high: list("The Dawn Gate, a ring of white stone where the sunrise appears from another sky; The Thousand Steps, a glowing stair leading to a temple in the clouds"),
  dark: list("The Weeping Pit, a crater from which a distant sobbing can be heard; The Bone Orchard, a field where skeletons grow like crops"),
  steam: list("The Great Engine, a machine the size of a hill that nobody remembers building; The Aether Spire, a tower that draws lightning into a thousand glass coils"),
  mythic: list("The Cradle of Gods, a crater where the first temples still stand; The Pillar of Heaven, a stone shaft that holds the sky up"),
  whimsy: list("The Giggling Geyser, which erupts when someone tells a good joke; The Upside-Down Hill, which you climb down and descend up"),
};

const HOOK: Record<WorldTone, string[]> = {
  high: list("A messenger arrives with a letter sealed by a king who died a hundred years ago; A farm boy finds a sword that glows only in the presence of a particular lie; A rival mage is gathering relics from the oldest ruins, and the heroes realize what for too late; The king's gardener is the last person who knows the true heir's name; A map is found that has a kingdom on it that nobody has heard of"),
  dark: list("A village wakes to find every door marked with the same black handprint; A hanged man is found alive and says he has a message from the other side; A cold-hearted merchant offers a fortune to anyone who will deliver a sealed box unopened; A child tells the party that someone is living in the walls, and the child's parents deny it; A lighthouse keeper's last log entry reads: it's not the sea that's calling"),
  steam: list("A courier delivers an invention that is not supposed to exist, and several people are about to die for it; A cargo ship arrives in port with its crew missing and its engines still running; A factory whistle blows at midnight, and all the workers walk out silently; An old professor's last letter promises that the patent office is hiding a way to power the world free of charge; A dirigible crashes into the roof of the opera house, and its passenger insists the opera must go on"),
  mythic: list("An oracle speaks a prophecy that names the party's least favorite person as the chosen hero; A god walks into a tavern disguised as a beggar and asks for a story; A dead king's ghost begs the party to return his body to a mountain no one can find; A fire that cannot be put out has appeared on the shores, and it is spreading toward the cities; A child is born under three stars at once and each god sends an assassin or a blessing"),
  whimsy: list("A talking goose arrives at the door and demands to see the mayor about a missing teapot; A rainbow lands in the village square and refuses to leave; The baker discovers that her bread is, by sheer accident, magically delicious; The post snails have all gone to the same address and nobody knows why; A cloud with a bad attitude has agreed to leave only if someone can make it laugh"),
};

const TONES: { id: WorldTone; label: string; emoji: string }[] = [
  { id: "high", label: "High fantasy", emoji: "🏰" },
  { id: "dark", label: "Dark fantasy", emoji: "🌑" },
  { id: "steam", label: "Steampunk & flintlock", emoji: "⚙️" },
  { id: "mythic", label: "Mythic & ancient", emoji: "🏺" },
  { id: "whimsy", label: "Whimsical", emoji: "🎈" },
];
const SIZES: { id: WorldSize; label: string; short: string }[] = [
  { id: "continent", label: "🌍 Continent", short: "continent" },
  { id: "archipelago", label: "🏝️ Archipelago", short: "archipelago" },
  { id: "kingdom", label: "👑 Single kingdom", short: "single kingdom" },
];

export const worldFilters: FilterGroup[] = [
  { id: "genre", label: "Tone", multi: true, options: TONES.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })) },
  { id: "size", label: "Size", multi: true, options: SIZES.map((s) => ({ value: s.id, label: s.label })) },
];

interface Extra { size: WorldSize; ids: number[] }
// ids: land, climate, magic, conflict, factionA, factionB, wonder, hook
const wonderPool = (tone: WorldTone) => [...WONDER.any, ...WONDER[tone]];
const idx = (n: number, rng: () => number) => Math.floor(rng() * n);

export const worldGenerator = comboGenerator<WorldName, Extra>({
  items: WORLD_NAMES,
  baseKey: (w) => w.name,
  facets: { genre: (w) => [w.tone] },
  extra: (w, rng, filters) => {
    const sizes = (filters.size?.length ? filters.size : SIZES.map((s) => s.id)) as WorldSize[];
    const size = pick(sizes, rng);
    const fa = idx(FACTION[w.tone].length, rng);
    let fb = idx(FACTION[w.tone].length - 1, rng);
    if (fb >= fa) fb += 1;
    return {
      size,
      ids: [idx(LAND[size].length, rng), idx(CLIMATE.length, rng), idx(MAGIC[w.tone].length, rng), idx(CONFLICT[w.tone].length, rng), fa, fb, idx(wonderPool(w.tone).length, rng), idx(HOOK[w.tone].length, rng)],
    };
  },
  extraKey: (e) => `${e.size[0]}${e.ids.map((n) => n.toString(36)).join("")}`,
  extraFromKey: (w, key) => {
    const size = SIZES.find((s) => s.id[0] === key[0])?.id;
    if (!size || key.length !== 9) return null;
    const ids = key.slice(1).split("").map((c) => parseInt(c, 36));
    const lens = [LAND[size].length, CLIMATE.length, MAGIC[w.tone].length, CONFLICT[w.tone].length, FACTION[w.tone].length, FACTION[w.tone].length, wonderPool(w.tone).length, HOOK[w.tone].length];
    if (ids.some((n, i) => !(n >= 0 && n < lens[i])) || ids[4] === ids[5]) return null;
    return { size, ids };
  },
  toResult: (w, { size, ids }) => {
    const tone = TONES.find((t) => t.id === w.tone)!;
    return {
      title: w.name,
      subtitle: `${tone.emoji} ${tone.label} · ${SIZES.find((s) => s.id === size)!.short}`,
      detail: [
        `Name: “${w.name}” means ${w.meaning}.`,
        `Land: ${LAND[size][ids[0]]}.`,
        `Climate: ${CLIMATE[ids[1]]}.`,
        `Magic: ${MAGIC[w.tone][ids[2]]}.`,
        `Conflict: ${CONFLICT[w.tone][ids[3]]}.`,
        `Factions: ${FACTION[w.tone][ids[4]]}. ${FACTION[w.tone][ids[5]]}.`,
        `Wonder: ${wonderPool(w.tone)[ids[6]]}.`,
        `Hook: ${HOOK[w.tone][ids[7]]}.`,
      ].join("\n"),
    };
  },
  variety: () => 1000,
});
