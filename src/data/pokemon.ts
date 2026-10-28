// Hand-written Pokémon bank for /random-pokemon-generator: every species from
// #1 Bulbasaur to #1025 Pecharunt with name, National Pokédex number,
// generation and types (current-generation typing: Fairy is applied to
// Clefairy, Mr. Mime, Togepi, etc.). Species only, no alternate forms.
// No images, sprites or official artwork are used anywhere on the page.
// Entries are "Name:Type/Type" in Pokédex order, one block per generation, so
// the dex number is the running index (Gen 1 starts at 1, Gen 2 at 152 ...).

export type PokemonType =
  | "Normal" | "Fire" | "Water" | "Electric" | "Grass" | "Ice" | "Fighting" | "Poison" | "Ground"
  | "Flying" | "Psychic" | "Bug" | "Rock" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy";

export const POKEMON_TYPES: readonly PokemonType[] = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground",
  "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
];

const T: Record<string, PokemonType> = {
  Nor: "Normal", Fir: "Fire", Wat: "Water", Ele: "Electric", Gra: "Grass", Ice: "Ice", Fig: "Fighting", Poi: "Poison",
  Gro: "Ground", Fly: "Flying", Psy: "Psychic", Bug: "Bug", Roc: "Rock", Gho: "Ghost", Dra: "Dragon", Dar: "Dark",
  Ste: "Steel", Fai: "Fairy",
};

export interface Pokemon {
  /** National Pokédex number. */
  dex: number;
  name: string;
  /** Generation 1-9 in which the species debuted. */
  gen: number;
  types: PokemonType[];
  /** Legendary or Mythical (ultra beasts and paradox Pokémon are not counted). */
  special: "" | "legendary" | "mythical";
}

export const GEN_START = [1, 152, 252, 387, 494, 650, 722, 810, 906] as const;
export const GEN_COUNTS = [151, 100, 135, 107, 156, 72, 88, 96, 120] as const;
export const GEN_REGION = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar and Hisui", "Paldea"] as const;

const G1 = `Bulbasaur:Gra/Poi,Ivysaur:Gra/Poi,Venusaur:Gra/Poi,Charmander:Fir,Charmeleon:Fir,Charizard:Fir/Fly,Squirtle:Wat,Wartortle:Wat,Blastoise:Wat,
Caterpie:Bug,Metapod:Bug,Butterfree:Bug/Fly,Weedle:Bug/Poi,Kakuna:Bug/Poi,Beedrill:Bug/Poi,Pidgey:Nor/Fly,Pidgeotto:Nor/Fly,Pidgeot:Nor/Fly,
Rattata:Nor,Raticate:Nor,Spearow:Nor/Fly,Fearow:Nor/Fly,Ekans:Poi,Arbok:Poi,Pikachu:Ele,Raichu:Ele,Sandshrew:Gro,Sandslash:Gro,
Nidoran♀:Poi,Nidorina:Poi,Nidoqueen:Poi/Gro,Nidoran♂:Poi,Nidorino:Poi,Nidoking:Poi/Gro,Clefairy:Fai,Clefable:Fai,Vulpix:Fir,Ninetales:Fir,
Jigglypuff:Nor/Fai,Wigglytuff:Nor/Fai,Zubat:Poi/Fly,Golbat:Poi/Fly,Oddish:Gra/Poi,Gloom:Gra/Poi,Vileplume:Gra/Poi,Paras:Bug/Gra,Parasect:Bug/Gra,
Venonat:Bug/Poi,Venomoth:Bug/Poi,Diglett:Gro,Dugtrio:Gro,Meowth:Nor,Persian:Nor,Psyduck:Wat,Golduck:Wat,Mankey:Fig,Primeape:Fig,
Growlithe:Fir,Arcanine:Fir,Poliwag:Wat,Poliwhirl:Wat,Poliwrath:Wat/Fig,Abra:Psy,Kadabra:Psy,Alakazam:Psy,Machop:Fig,Machoke:Fig,Machamp:Fig,
Bellsprout:Gra/Poi,Weepinbell:Gra/Poi,Victreebel:Gra/Poi,Tentacool:Wat/Poi,Tentacruel:Wat/Poi,Geodude:Roc/Gro,Graveler:Roc/Gro,Golem:Roc/Gro,
Ponyta:Fir,Rapidash:Fir,Slowpoke:Wat/Psy,Slowbro:Wat/Psy,Magnemite:Ele/Ste,Magneton:Ele/Ste,Farfetch'd:Nor/Fly,Doduo:Nor/Fly,Dodrio:Nor/Fly,
Seel:Wat,Dewgong:Wat/Ice,Grimer:Poi,Muk:Poi,Shellder:Wat,Cloyster:Wat/Ice,Gastly:Gho/Poi,Haunter:Gho/Poi,Gengar:Gho/Poi,Onix:Roc/Gro,
Drowzee:Psy,Hypno:Psy,Krabby:Wat,Kingler:Wat,Voltorb:Ele,Electrode:Ele,Exeggcute:Gra/Psy,Exeggutor:Gra/Psy,Cubone:Gro,Marowak:Gro,
Hitmonlee:Fig,Hitmonchan:Fig,Lickitung:Nor,Koffing:Poi,Weezing:Poi,Rhyhorn:Gro/Roc,Rhydon:Gro/Roc,Chansey:Nor,Tangela:Gra,Kangaskhan:Nor,
Horsea:Wat,Seadra:Wat,Goldeen:Wat,Seaking:Wat,Staryu:Wat,Starmie:Wat/Psy,Mr. Mime:Psy/Fai,Scyther:Bug/Fly,Jynx:Ice/Psy,Electabuzz:Ele,
Magmar:Fir,Pinsir:Bug,Tauros:Nor,Magikarp:Wat,Gyarados:Wat/Fly,Lapras:Wat/Ice,Ditto:Nor,Eevee:Nor,Vaporeon:Wat,Jolteon:Ele,Flareon:Fir,
Porygon:Nor,Omanyte:Roc/Wat,Omastar:Roc/Wat,Kabuto:Roc/Wat,Kabutops:Roc/Wat,Aerodactyl:Roc/Fly,Snorlax:Nor,Articuno:Ice/Fly,Zapdos:Ele/Fly,
Moltres:Fir/Fly,Dratini:Dra,Dragonair:Dra,Dragonite:Dra/Fly,Mewtwo:Psy,Mew:Psy`;

const G2 = `Chikorita:Gra,Bayleef:Gra,Meganium:Gra,Cyndaquil:Fir,Quilava:Fir,Typhlosion:Fir,Totodile:Wat,Croconaw:Wat,Feraligatr:Wat,
Sentret:Nor,Furret:Nor,Hoothoot:Nor/Fly,Noctowl:Nor/Fly,Ledyba:Bug/Fly,Ledian:Bug/Fly,Spinarak:Bug/Poi,Ariados:Bug/Poi,Crobat:Poi/Fly,
Chinchou:Wat/Ele,Lanturn:Wat/Ele,Pichu:Ele,Cleffa:Fai,Igglybuff:Nor/Fai,Togepi:Fai,Togetic:Fai/Fly,Natu:Psy/Fly,Xatu:Psy/Fly,
Mareep:Ele,Flaaffy:Ele,Ampharos:Ele,Bellossom:Gra,Marill:Wat/Fai,Azumarill:Wat/Fai,Sudowoodo:Roc,Politoed:Wat,Hoppip:Gra/Fly,Skiploom:Gra/Fly,
Jumpluff:Gra/Fly,Aipom:Nor,Sunkern:Gra,Sunflora:Gra,Yanma:Bug/Fly,Wooper:Wat/Gro,Quagsire:Wat/Gro,Espeon:Psy,Umbreon:Dar,Murkrow:Dar/Fly,
Slowking:Wat/Psy,Misdreavus:Gho,Unown:Psy,Wobbuffet:Psy,Girafarig:Nor/Psy,Pineco:Bug,Forretress:Bug/Ste,Dunsparce:Nor,Gligar:Gro/Fly,
Steelix:Ste/Gro,Snubbull:Fai,Granbull:Fai,Qwilfish:Wat/Poi,Scizor:Bug/Ste,Shuckle:Bug/Roc,Heracross:Bug/Fig,Sneasel:Dar/Ice,Teddiursa:Nor,
Ursaring:Nor,Slugma:Fir,Magcargo:Fir/Roc,Swinub:Ice/Gro,Piloswine:Ice/Gro,Corsola:Wat/Roc,Remoraid:Wat,Octillery:Wat,Delibird:Ice/Fly,
Mantine:Wat/Fly,Skarmory:Ste/Fly,Houndour:Dar/Fir,Houndoom:Dar/Fir,Kingdra:Wat/Dra,Phanpy:Gro,Donphan:Gro,Porygon2:Nor,Stantler:Nor,
Smeargle:Nor,Tyrogue:Fig,Hitmontop:Fig,Smoochum:Ice/Psy,Elekid:Ele,Magby:Fir,Miltank:Nor,Blissey:Nor,Raikou:Ele,Entei:Fir,Suicune:Wat,
Larvitar:Roc/Gro,Pupitar:Roc/Gro,Tyranitar:Roc/Dar,Lugia:Psy/Fly,Ho-Oh:Fir/Fly,Celebi:Psy/Gra`;

const G3 = `Treecko:Gra,Grovyle:Gra,Sceptile:Gra,Torchic:Fir,Combusken:Fir/Fig,Blaziken:Fir/Fig,Mudkip:Wat,Marshtomp:Wat/Gro,Swampert:Wat/Gro,
Poochyena:Dar,Mightyena:Dar,Zigzagoon:Nor,Linoone:Nor,Wurmple:Bug,Silcoon:Bug,Beautifly:Bug/Fly,Cascoon:Bug,Dustox:Bug/Poi,
Lotad:Wat/Gra,Lombre:Wat/Gra,Ludicolo:Wat/Gra,Seedot:Gra,Nuzleaf:Gra/Dar,Shiftry:Gra/Dar,Taillow:Nor/Fly,Swellow:Nor/Fly,Wingull:Wat/Fly,
Pelipper:Wat/Fly,Ralts:Psy/Fai,Kirlia:Psy/Fai,Gardevoir:Psy/Fai,Surskit:Bug/Wat,Masquerain:Bug/Fly,Shroomish:Gra,Breloom:Gra/Fig,
Slakoth:Nor,Vigoroth:Nor,Slaking:Nor,Nincada:Bug/Gro,Ninjask:Bug/Fly,Shedinja:Bug/Gho,Whismur:Nor,Loudred:Nor,Exploud:Nor,
Makuhita:Fig,Hariyama:Fig,Azurill:Nor/Fai,Nosepass:Roc,Skitty:Nor,Delcatty:Nor,Sableye:Dar/Gho,Mawile:Ste/Fai,Aron:Ste/Roc,Lairon:Ste/Roc,
Aggron:Ste/Roc,Meditite:Fig/Psy,Medicham:Fig/Psy,Electrike:Ele,Manectric:Ele,Plusle:Ele,Minun:Ele,Volbeat:Bug,Illumise:Bug,Roselia:Gra/Poi,
Gulpin:Poi,Swalot:Poi,Carvanha:Wat/Dar,Sharpedo:Wat/Dar,Wailmer:Wat,Wailord:Wat,Numel:Fir/Gro,Camerupt:Fir/Gro,Torkoal:Fir,Spoink:Psy,
Grumpig:Psy,Spinda:Nor,Trapinch:Gro,Vibrava:Gro/Dra,Flygon:Gro/Dra,Cacnea:Gra,Cacturne:Gra/Dar,Swablu:Nor/Fly,Altaria:Dra/Fly,
Zangoose:Nor,Seviper:Poi,Lunatone:Roc/Psy,Solrock:Roc/Psy,Barboach:Wat/Gro,Whiscash:Wat/Gro,Corphish:Wat,Crawdaunt:Wat/Dar,
Baltoy:Gro/Psy,Claydol:Gro/Psy,Lileep:Roc/Gra,Cradily:Roc/Gra,Anorith:Roc/Bug,Armaldo:Roc/Bug,Feebas:Wat,Milotic:Wat,Castform:Nor,
Kecleon:Nor,Shuppet:Gho,Banette:Gho,Duskull:Gho,Dusclops:Gho,Tropius:Gra/Fly,Chimecho:Psy,Absol:Dar,Wynaut:Psy,Snorunt:Ice,Glalie:Ice,
Spheal:Ice/Wat,Sealeo:Ice/Wat,Walrein:Ice/Wat,Clamperl:Wat,Huntail:Wat,Gorebyss:Wat,Relicanth:Wat/Roc,Luvdisc:Wat,Bagon:Dra,Shelgon:Dra,
Salamence:Dra/Fly,Beldum:Ste/Psy,Metang:Ste/Psy,Metagross:Ste/Psy,Regirock:Roc,Regice:Ice,Registeel:Ste,Latias:Dra/Psy,Latios:Dra/Psy,
Kyogre:Wat,Groudon:Gro,Rayquaza:Dra/Fly,Jirachi:Ste/Psy,Deoxys:Psy`;

const G4 = `Turtwig:Gra,Grotle:Gra,Torterra:Gra/Gro,Chimchar:Fir,Monferno:Fir/Fig,Infernape:Fir/Fig,Piplup:Wat,Prinplup:Wat,Empoleon:Wat/Ste,
Starly:Nor/Fly,Staravia:Nor/Fly,Staraptor:Nor/Fly,Bidoof:Nor,Bibarel:Nor/Wat,Kricketot:Bug,Kricketune:Bug,Shinx:Ele,Luxio:Ele,Luxray:Ele,
Budew:Gra/Poi,Roserade:Gra/Poi,Cranidos:Roc,Rampardos:Roc,Shieldon:Roc/Ste,Bastiodon:Roc/Ste,Burmy:Bug,Wormadam:Bug/Gra,Mothim:Bug/Fly,
Combee:Bug/Fly,Vespiquen:Bug/Fly,Pachirisu:Ele,Buizel:Wat,Floatzel:Wat,Cherubi:Gra,Cherrim:Gra,Shellos:Wat,Gastrodon:Wat/Gro,Ambipom:Nor,
Drifloon:Gho/Fly,Drifblim:Gho/Fly,Buneary:Nor,Lopunny:Nor,Mismagius:Gho,Honchkrow:Dar/Fly,Glameow:Nor,Purugly:Nor,Chingling:Psy,
Stunky:Poi/Dar,Skuntank:Poi/Dar,Bronzor:Ste/Psy,Bronzong:Ste/Psy,Bonsly:Roc,Mime Jr.:Psy/Fai,Happiny:Nor,Chatot:Nor/Fly,Spiritomb:Gho/Dar,
Gible:Dra/Gro,Gabite:Dra/Gro,Garchomp:Dra/Gro,Munchlax:Nor,Riolu:Fig,Lucario:Fig/Ste,Hippopotas:Gro,Hippowdon:Gro,Skorupi:Poi/Bug,
Drapion:Poi/Dar,Croagunk:Poi/Fig,Toxicroak:Poi/Fig,Carnivine:Gra,Finneon:Wat,Lumineon:Wat,Mantyke:Wat/Fly,Snover:Gra/Ice,Abomasnow:Gra/Ice,
Weavile:Dar/Ice,Magnezone:Ele/Ste,Lickilicky:Nor,Rhyperior:Gro/Roc,Tangrowth:Gra,Electivire:Ele,Magmortar:Fir,Togekiss:Fai/Fly,
Yanmega:Bug/Fly,Leafeon:Gra,Glaceon:Ice,Gliscor:Gro/Fly,Mamoswine:Ice/Gro,Porygon-Z:Nor,Gallade:Psy/Fig,Probopass:Roc/Ste,Dusknoir:Gho,
Froslass:Ice/Gho,Rotom:Ele/Gho,Uxie:Psy,Mesprit:Psy,Azelf:Psy,Dialga:Ste/Dra,Palkia:Wat/Dra,Heatran:Fir/Ste,Regigigas:Nor,Giratina:Gho/Dra,
Cresselia:Psy,Phione:Wat,Manaphy:Wat,Darkrai:Dar,Shaymin:Gra,Arceus:Nor`;

const G5 = `Victini:Psy/Fir,Snivy:Gra,Servine:Gra,Serperior:Gra,Tepig:Fir,Pignite:Fir/Fig,Emboar:Fir/Fig,Oshawott:Wat,Dewott:Wat,Samurott:Wat,
Patrat:Nor,Watchog:Nor,Lillipup:Nor,Herdier:Nor,Stoutland:Nor,Purrloin:Dar,Liepard:Dar,Pansage:Gra,Simisage:Gra,Pansear:Fir,Simisear:Fir,
Panpour:Wat,Simipour:Wat,Munna:Psy,Musharna:Psy,Pidove:Nor/Fly,Tranquill:Nor/Fly,Unfezant:Nor/Fly,Blitzle:Ele,Zebstrika:Ele,
Roggenrola:Roc,Boldore:Roc,Gigalith:Roc,Woobat:Psy/Fly,Swoobat:Psy/Fly,Drilbur:Gro,Excadrill:Gro/Ste,Audino:Nor,Timburr:Fig,Gurdurr:Fig,
Conkeldurr:Fig,Tympole:Wat,Palpitoad:Wat/Gro,Seismitoad:Wat/Gro,Throh:Fig,Sawk:Fig,Sewaddle:Bug/Gra,Swadloon:Bug/Gra,Leavanny:Bug/Gra,
Venipede:Bug/Poi,Whirlipede:Bug/Poi,Scolipede:Bug/Poi,Cottonee:Gra/Fai,Whimsicott:Gra/Fai,Petilil:Gra,Lilligant:Gra,Basculin:Wat,
Sandile:Gro/Dar,Krokorok:Gro/Dar,Krookodile:Gro/Dar,Darumaka:Fir,Darmanitan:Fir,Maractus:Gra,Dwebble:Bug/Roc,Crustle:Bug/Roc,
Scraggy:Dar/Fig,Scrafty:Dar/Fig,Sigilyph:Psy/Fly,Yamask:Gho,Cofagrigus:Gho,Tirtouga:Wat/Roc,Carracosta:Wat/Roc,Archen:Roc/Fly,
Archeops:Roc/Fly,Trubbish:Poi,Garbodor:Poi,Zorua:Dar,Zoroark:Dar,Minccino:Nor,Cinccino:Nor,Gothita:Psy,Gothorita:Psy,Gothitelle:Psy,
Solosis:Psy,Duosion:Psy,Reuniclus:Psy,Ducklett:Wat/Fly,Swanna:Wat/Fly,Vanillite:Ice,Vanillish:Ice,Vanilluxe:Ice,Deerling:Nor/Gra,
Sawsbuck:Nor/Gra,Emolga:Ele/Fly,Karrablast:Bug,Escavalier:Bug/Ste,Foongus:Gra/Poi,Amoonguss:Gra/Poi,Frillish:Wat/Gho,Jellicent:Wat/Gho,
Alomomola:Wat,Joltik:Bug/Ele,Galvantula:Bug/Ele,Ferroseed:Gra/Ste,Ferrothorn:Gra/Ste,Klink:Ste,Klang:Ste,Klinklang:Ste,Tynamo:Ele,
Eelektrik:Ele,Eelektross:Ele,Elgyem:Psy,Beheeyem:Psy,Litwick:Gho/Fir,Lampent:Gho/Fir,Chandelure:Gho/Fir,Axew:Dra,Fraxure:Dra,Haxorus:Dra,
Cubchoo:Ice,Beartic:Ice,Cryogonal:Ice,Shelmet:Bug,Accelgor:Bug,Stunfisk:Gro/Ele,Mienfoo:Fig,Mienshao:Fig,Druddigon:Dra,Golett:Gro/Gho,
Golurk:Gro/Gho,Pawniard:Dar/Ste,Bisharp:Dar/Ste,Bouffalant:Nor,Rufflet:Nor/Fly,Braviary:Nor/Fly,Vullaby:Dar/Fly,Mandibuzz:Dar/Fly,
Heatmor:Fir,Durant:Bug/Ste,Deino:Dar/Dra,Zweilous:Dar/Dra,Hydreigon:Dar/Dra,Larvesta:Bug/Fir,Volcarona:Bug/Fir,Cobalion:Ste/Fig,
Terrakion:Roc/Fig,Virizion:Gra/Fig,Tornadus:Fly,Thundurus:Ele/Fly,Reshiram:Dra/Fir,Zekrom:Dra/Ele,Landorus:Gro/Fly,Kyurem:Dra/Ice,
Keldeo:Wat/Fig,Meloetta:Nor/Psy,Genesect:Bug/Ste`;

const G6 = `Chespin:Gra,Quilladin:Gra,Chesnaught:Gra/Fig,Fennekin:Fir,Braixen:Fir,Delphox:Fir/Psy,Froakie:Wat,Frogadier:Wat,Greninja:Wat/Dar,
Bunnelby:Nor,Diggersby:Nor/Gro,Fletchling:Nor/Fly,Fletchinder:Fir/Fly,Talonflame:Fir/Fly,Scatterbug:Bug,Spewpa:Bug,Vivillon:Bug/Fly,
Litleo:Fir/Nor,Pyroar:Fir/Nor,Flabébé:Fai,Floette:Fai,Florges:Fai,Skiddo:Gra,Gogoat:Gra,Pancham:Fig,Pangoro:Fig/Dar,Furfrou:Nor,
Espurr:Psy,Meowstic:Psy,Honedge:Ste/Gho,Doublade:Ste/Gho,Aegislash:Ste/Gho,Spritzee:Fai,Aromatisse:Fai,Swirlix:Fai,Slurpuff:Fai,
Inkay:Dar/Psy,Malamar:Dar/Psy,Binacle:Roc/Wat,Barbaracle:Roc/Wat,Skrelp:Poi/Wat,Dragalge:Poi/Dra,Clauncher:Wat,Clawitzer:Wat,
Helioptile:Ele/Nor,Heliolisk:Ele/Nor,Tyrunt:Roc/Dra,Tyrantrum:Roc/Dra,Amaura:Roc/Ice,Aurorus:Roc/Ice,Sylveon:Fai,Hawlucha:Fig/Fly,
Dedenne:Ele/Fai,Carbink:Roc/Fai,Goomy:Dra,Sliggoo:Dra,Goodra:Dra,Klefki:Ste/Fai,Phantump:Gho/Gra,Trevenant:Gho/Gra,Pumpkaboo:Gho/Gra,
Gourgeist:Gho/Gra,Bergmite:Ice,Avalugg:Ice,Noibat:Fly/Dra,Noivern:Fly/Dra,Xerneas:Fai,Yveltal:Dar/Fly,Zygarde:Dra/Gro,Diancie:Roc/Fai,
Hoopa:Psy/Gho,Volcanion:Fir/Wat`;

const G7 = `Rowlet:Gra/Fly,Dartrix:Gra/Fly,Decidueye:Gra/Gho,Litten:Fir,Torracat:Fir,Incineroar:Fir/Dar,Popplio:Wat,Brionne:Wat,Primarina:Wat/Fai,
Pikipek:Nor/Fly,Trumbeak:Nor/Fly,Toucannon:Nor/Fly,Yungoos:Nor,Gumshoos:Nor,Grubbin:Bug,Charjabug:Bug/Ele,Vikavolt:Bug/Ele,Crabrawler:Fig,
Crabominable:Fig/Ice,Oricorio:Fir/Fly,Cutiefly:Bug/Fai,Ribombee:Bug/Fai,Rockruff:Roc,Lycanroc:Roc,Wishiwashi:Wat,Mareanie:Poi/Wat,
Toxapex:Poi/Wat,Mudbray:Gro,Mudsdale:Gro,Dewpider:Wat/Bug,Araquanid:Wat/Bug,Fomantis:Gra,Lurantis:Gra,Morelull:Gra/Fai,Shiinotic:Gra/Fai,
Salandit:Poi/Fir,Salazzle:Poi/Fir,Stufful:Nor/Fig,Bewear:Nor/Fig,Bounsweet:Gra,Steenee:Gra,Tsareena:Gra,Comfey:Fai,Oranguru:Nor/Psy,
Passimian:Fig,Wimpod:Bug/Wat,Golisopod:Bug/Wat,Sandygast:Gho/Gro,Palossand:Gho/Gro,Pyukumuku:Wat,Type: Null:Nor,Silvally:Nor,Minior:Roc/Fly,
Komala:Nor,Turtonator:Fir/Dra,Togedemaru:Ele/Ste,Mimikyu:Gho/Fai,Bruxish:Wat/Psy,Drampa:Nor/Dra,Dhelmise:Gho/Gra,Jangmo-o:Dra,
Hakamo-o:Dra/Fig,Kommo-o:Dra/Fig,Tapu Koko:Ele/Fai,Tapu Lele:Psy/Fai,Tapu Bulu:Gra/Fai,Tapu Fini:Wat/Fai,Cosmog:Psy,Cosmoem:Psy,
Solgaleo:Psy/Ste,Lunala:Psy/Gho,Nihilego:Roc/Poi,Buzzwole:Bug/Fig,Pheromosa:Bug/Fig,Xurkitree:Ele,Celesteela:Ste/Fly,Kartana:Gra/Ste,
Guzzlord:Dar/Dra,Necrozma:Psy,Magearna:Ste/Fai,Marshadow:Fig/Gho,Poipole:Poi,Naganadel:Poi/Dra,Stakataka:Roc/Ste,Blacephalon:Fir/Gho,
Zeraora:Ele,Meltan:Ste,Melmetal:Ste`;

const G8 = `Grookey:Gra,Thwackey:Gra,Rillaboom:Gra,Scorbunny:Fir,Raboot:Fir,Cinderace:Fir,Sobble:Wat,Drizzile:Wat,Inteleon:Wat,Skwovet:Nor,Greedent:Nor,
Rookidee:Fly,Corvisquire:Fly,Corviknight:Fly/Ste,Blipbug:Bug,Dottler:Bug/Psy,Orbeetle:Bug/Psy,Nickit:Dar,Thievul:Dar,Gossifleur:Gra,
Eldegoss:Gra,Wooloo:Nor,Dubwool:Nor,Chewtle:Wat,Drednaw:Wat/Roc,Yamper:Ele,Boltund:Ele,Rolycoly:Roc,Carkol:Roc/Fir,Coalossal:Roc/Fir,
Applin:Gra/Dra,Flapple:Gra/Dra,Appletun:Gra/Dra,Silicobra:Gro,Sandaconda:Gro,Cramorant:Fly/Wat,Arrokuda:Wat,Barraskewda:Wat,Toxel:Ele/Poi,
Toxtricity:Ele/Poi,Sizzlipede:Fir/Bug,Centiskorch:Fir/Bug,Clobbopus:Fig,Grapploct:Fig,Sinistea:Gho,Polteageist:Gho,Hatenna:Psy,
Hattrem:Psy,Hatterene:Psy/Fai,Impidimp:Dar/Fai,Morgrem:Dar/Fai,Grimmsnarl:Dar/Fai,Obstagoon:Dar/Nor,Perrserker:Ste,Cursola:Gho,
Sirfetch'd:Fig,Mr. Rime:Ice/Psy,Runerigus:Gro/Gho,Milcery:Fai,Alcremie:Fai,Falinks:Fig,Pincurchin:Ele,Snom:Ice/Bug,Frosmoth:Ice/Bug,
Stonjourner:Roc,Eiscue:Ice,Indeedee:Psy/Nor,Morpeko:Ele/Dar,Cufant:Ste,Copperajah:Ste,Dracozolt:Ele/Dra,Arctozolt:Ele/Ice,
Dracovish:Wat/Dra,Arctovish:Wat/Ice,Duraludon:Ste/Dra,Dreepy:Dra/Gho,Drakloak:Dra/Gho,Dragapult:Dra/Gho,Zacian:Fai,Zamazenta:Fig,
Eternatus:Poi/Dra,Kubfu:Fig,Urshifu:Fig/Dar,Zarude:Dar/Gra,Regieleki:Ele,Regidrago:Dra,Glastrier:Ice,Spectrier:Gho,Calyrex:Psy/Gra,
Wyrdeer:Nor/Psy,Kleavor:Bug/Roc,Ursaluna:Gro/Nor,Basculegion:Wat/Gho,Sneasler:Fig/Poi,Overqwil:Dar/Poi,Enamorus:Fai/Fly`;

const G9 = `Sprigatito:Gra,Floragato:Gra,Meowscarada:Gra/Dar,Fuecoco:Fir,Crocalor:Fir,Skeledirge:Fir/Gho,Quaxly:Wat,Quaxwell:Wat,Quaquaval:Wat/Fig,
Lechonk:Nor,Oinkologne:Nor,Tarountula:Bug,Spidops:Bug,Nymble:Bug,Lokix:Bug/Dar,Pawmi:Ele,Pawmo:Ele/Fig,Pawmot:Ele/Fig,Tandemaus:Nor,
Maushold:Nor,Fidough:Fai,Dachsbun:Fai,Smoliv:Gra/Nor,Dolliv:Gra/Nor,Arboliva:Gra/Nor,Squawkabilly:Nor/Fly,Nacli:Roc,Naclstack:Roc,
Garganacl:Roc,Charcadet:Fir,Armarouge:Fir/Psy,Ceruledge:Fir/Gho,Tadbulb:Ele,Bellibolt:Ele,Wattrel:Ele/Fly,Kilowattrel:Ele/Fly,
Maschiff:Dar,Mabosstiff:Dar,Shroodle:Poi/Nor,Grafaiai:Poi/Nor,Bramblin:Gra/Gho,Brambleghast:Gra/Gho,Toedscool:Gro/Gra,Toedscruel:Gro/Gra,
Klawf:Roc,Capsakid:Gra,Scovillain:Gra/Fir,Rellor:Bug,Rabsca:Bug/Psy,Flittle:Psy,Espathra:Psy,Tinkatink:Fai/Ste,Tinkatuff:Fai/Ste,
Tinkaton:Fai/Ste,Wiglett:Wat,Wugtrio:Wat,Bombirdier:Fly/Dar,Finizen:Wat,Palafin:Wat,Varoom:Ste/Poi,Revavroom:Ste/Poi,Cyclizar:Dra/Nor,
Orthworm:Ste,Glimmet:Roc/Poi,Glimmora:Roc/Poi,Greavard:Gho,Houndstone:Gho,Flamigo:Fly/Fig,Cetoddle:Ice,Cetitan:Ice,Veluza:Wat/Psy,
Dondozo:Wat,Tatsugiri:Dra/Wat,Annihilape:Fig/Gho,Clodsire:Poi/Gro,Farigiraf:Nor/Psy,Dudunsparce:Nor,Kingambit:Dar/Ste,Great Tusk:Gro/Fig,
Scream Tail:Fai/Psy,Brute Bonnet:Gra/Dar,Flutter Mane:Gho/Fai,Slither Wing:Bug/Fig,Sandy Shocks:Ele/Gro,Iron Treads:Gro/Ste,
Iron Bundle:Ice/Wat,Iron Hands:Fig/Ele,Iron Jugulis:Dar/Fly,Iron Moth:Fir/Poi,Iron Thorns:Roc/Ele,Frigibax:Dra/Ice,Arctibax:Dra/Ice,
Baxcalibur:Dra/Ice,Gimmighoul:Gho,Gholdengo:Ste/Gho,Wo-Chien:Dar/Gra,Chien-Pao:Dar/Ice,Ting-Lu:Dar/Gro,Chi-Yu:Dar/Fir,
Roaring Moon:Dra/Dar,Iron Valiant:Fai/Fig,Koraidon:Fig/Dra,Miraidon:Ele/Dra,Walking Wake:Wat/Dra,Iron Leaves:Gra/Psy,Dipplin:Gra/Dra,
Poltchageist:Gra/Gho,Sinistcha:Gra/Gho,Okidogi:Poi/Fig,Munkidori:Poi/Psy,Fezandipiti:Poi/Fai,Ogerpon:Gra,Archaludon:Ste/Dra,
Hydrapple:Gra/Dra,Gouging Fire:Fir/Dra,Raging Bolt:Ele/Dra,Iron Boulder:Roc/Psy,Iron Crown:Ste/Psy,Terapagos:Nor,Pecharunt:Poi/Gho`;

const LEGENDARY = new Set(
  `Articuno Zapdos Moltres Mewtwo Raikou Entei Suicune Lugia Ho-Oh Regirock Regice Registeel Latias Latios Kyogre Groudon Rayquaza Uxie Mesprit Azelf Dialga Palkia Heatran Regigigas Giratina Cresselia Cobalion Terrakion Virizion Tornadus Thundurus Reshiram Zekrom Landorus Kyurem Xerneas Yveltal Zygarde Silvally Cosmog Cosmoem Solgaleo Lunala Necrozma Zacian Zamazenta Eternatus Kubfu Urshifu Regieleki Regidrago Glastrier Spectrier Calyrex Enamorus Wo-Chien Chien-Pao Ting-Lu Chi-Yu Koraidon Miraidon Okidogi Munkidori Fezandipiti Ogerpon Terapagos`
    .split(" ").concat(["Type: Null", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini"]),
);
const MYTHICAL = new Set(
  `Mew Celebi Jirachi Deoxys Phione Manaphy Darkrai Shaymin Arceus Victini Keldeo Meloetta Genesect Diancie Hoopa Volcanion Magearna Marshadow Zeraora Meltan Melmetal Zarude Pecharunt`.split(" "),
);

function parseGen(raw: string, gen: number, start: number): Pokemon[] {
  return raw.replace(/\n/g, "").split(",").map((entry, i) => {
    const cut = entry.lastIndexOf(":");
    const name = entry.slice(0, cut).trim();
    const types = entry.slice(cut + 1).split("/").map((t) => T[t.trim()]);
    return { dex: start + i, name, gen, types, special: LEGENDARY.has(name) ? "legendary" : MYTHICAL.has(name) ? "mythical" : "" } as Pokemon;
  });
}

export const POKEMON: readonly Pokemon[] = [G1, G2, G3, G4, G5, G6, G7, G8, G9].flatMap((raw, i) => parseGen(raw, i + 1, GEN_START[i]));
