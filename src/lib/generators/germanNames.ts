import { glossed } from "./rootNames";
import { SEX_FILTER, given, realNameGenerator } from "./realNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// German names by era: names popular with babies today, names of the
// post-war generation, and old Germanic names from the Middle Ages. Surnames
// are among the most common in Germany, most from trades.
export const GERMAN_ERAS = [
  { id: "modern", label: "👶 Modern (popular now)", short: "Modern" },
  { id: "classic", label: "📻 Classic (1930s–70s)", short: "Classic" },
  { id: "old", label: "🏰 Old Germanic / medieval", short: "Old Germanic" },
];

export const GERMAN_GIVEN = [
  ...given("modern", "male", "Noah = rest, comfort (Hebrew); Emil = eager, from the Roman name Aemilius; Ben = son (Hebrew); Paul = small (Latin); Leon = lion (Greek); Finn = fair, white (Irish); Elias = my God is Yahweh (Hebrew); Felix = lucky (Latin); Theo = gift of God (Greek); Matteo = gift of God (Italian form of Matthew); Jonas = dove (Hebrew); Maximilian = greatest (Latin); Leo = lion (Latin); Moritz = dark-skinned, from Latin Mauritius; Jakob = held by the heel (Hebrew); Anton = from the Roman family name Antonius; Luis = famous warrior (from Ludwig); Henri = home ruler (from Heinrich)"),
  ...given("modern", "female", "Emilia = eager, from Aemilius (Latin); Mia = mine, beloved (short for Maria); Hannah = grace (Hebrew); Sophia = wisdom (Greek); Emma = whole, universal (Germanic); Mila = gracious, dear (Slavic); Clara = bright, clear (Latin); Lea = weary (Hebrew Leah); Ella = all, entirely (Germanic); Ida = work, labor (Germanic); Frieda = peace (Germanic); Greta = pearl (short for Margarete); Lotta = free (short for Charlotte); Johanna = God is gracious (Hebrew); Mathilda = strength in battle (Germanic); Paula = small (Latin); Marlene = Maria + Magdalena; Lina = short for Karolina, free woman"),
  ...given("classic", "male", "Klaus = victory of the people (from Nikolaus); Jürgen = farmer (from Georg); Wolfgang = path of the wolf; Dieter = people + army; Hans = God is gracious (from Johannes); Günter = battle + army; Helmut = helmet + spirit; Manfred = man of peace; Rolf = famous wolf; Horst = thicket, woodland; Werner = army guard; Karl = free man; Heinz = home ruler (from Heinrich); Gerhard = strong spear; Bernd = brave as a bear (from Bernhard); Rainer = counsel + army; Uwe = from Ove, a Frisian name; Peter = rock (Greek)"),
  ...given("classic", "female", "Ursula = little bear (Latin); Helga = holy, blessed (Norse); Ingrid = beautiful, beloved of the god Ing; Gisela = pledge (Germanic); Renate = reborn (Latin); Brigitte = the exalted one (Celtic); Gabriele = God is my strength (Hebrew); Sabine = a Sabine woman (Latin); Petra = rock (Greek); Karin = pure (from Katharina); Heike = home ruler (Frisian form of Heinrich); Elke = noble (from Adelheid); Gerda = protection, enclosure (Norse); Christa = follower of Christ; Hannelore = Hanna + Eleonore; Doris = Dorian woman (Greek); Erika = ever-ruler, also the heather plant; Waltraud = ruler + strength"),
  ...given("old", "male", "Siegfried = victory + peace; Gunther = battle + army; Konrad = bold counsel; Friedrich = peaceful ruler; Heinrich = ruler of the home; Dietrich = ruler of the people; Ludwig = famous in battle; Wilhelm = will + helmet; Albrecht = noble + bright; Otto = wealth; Lothar = famous army; Eberhard = strong as a boar; Gottfried = peace of God; Hartmut = strong mind; Ulrich = prosperity + power; Bertram = bright raven; Wolfram = wolf + raven; Ruprecht = bright fame"),
  ...given("old", "female", "Adelheid = noble kind; Hildegard = battle + enclosure; Kunigunde = clan + battle; Gertrud = spear + strength; Brunhild = armor + battle; Mechthild = might + battle; Irmgard = whole + enclosure; Hedwig = battle + fight; Walburga = ruler + fortress; Kriemhild = mask + battle; Luitgard = people + protection; Gerlinde = spear + shield of linden wood; Hiltrud = battle + strength; Ottilie = wealth; Sieglinde = victory + shield; Rotraud = fame + strength; Gisela = pledge; Amalberga = work + protection"),
].filter((n, i, all) => all.findIndex((m) => m.name === n.name) === i);

export const GERMAN_SURNAMES = glossed("Müller = miller; Schmidt = smith; Schneider = tailor; Fischer = fisherman; Weber = weaver; Meyer = farm steward; Wagner = wagon maker; Becker = baker; Schulz = village headman; Hoffmann = farmhand at a manor; Koch = cook; Bauer = farmer; Richter = judge; Klein = small; Wolf = wolf; Schröder = tailor, cloth cutter; Neumann = newcomer; Schwarz = black-haired; Zimmermann = carpenter; Braun = brown-haired; Krüger = innkeeper; Hartmann = strong man; Lange = tall; Krause = curly-haired; Lehmann = feudal tenant; Köhler = charcoal burner; Fuchs = fox, often red-haired; Vogel = bird, bird catcher; Jäger = hunter; Berger = lives on a mountain; Engel = angel; Keller = cellar master; Baumann = farmer, builder; Graf = count; Sommer = summer; Brandt = fire, burnt land; Kaiser = emperor; Winkler = shopkeeper on a corner; Stein = stone; Kühn = bold");

const NOBLE = glossed("von Falkenstein = falcon rock; von Rosenberg = rose hill; von Adlerburg = eagle castle; von Eichenwald = oak forest; von Lindenau = linden meadow; von Hohenfels = high rock; von Wolfsberg = wolf hill; von Sternfeld = star field; von Greifenstein = griffin rock; von Schwanenburg = swan castle; von Bärental = bear valley; von Rabenau = raven meadow; von Silberbach = silver brook; von Drachenfels = dragon rock; von Weidenhof = willow court");

export const germanFilters: FilterGroup[] = [
  { id: "era", label: "Era", multi: true, options: GERMAN_ERAS.map((e) => ({ value: e.id, label: e.label })) },
  SEX_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "full", label: "First + last name" },
      { value: "noble", label: "Noble (von …)" },
      { value: "first", label: "First name only" },
    ],
  },
];

export const germanGenerator = realNameGenerator({
  names: GERMAN_GIVEN,
  surnames: GERMAN_SURNAMES,
  eras: GERMAN_ERAS,
  flag: "🇩🇪",
  special: {
    id: "noble",
    pool: () => NOBLE,
    title: (n, s) => `${n.name} ${s.name}`,
    note: (s) => `${s.name}: ${s.meaning}`,
    variety: NOBLE.length,
  },
});
