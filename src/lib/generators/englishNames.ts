import { glossed } from "./rootNames";
import { SEX_FILTER, given, realNameGenerator } from "./realNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// English names by era: names topping UK and US baby lists now, Victorian
// and early-1900s classics, and Old English (Anglo-Saxon) names. Surnames
// are common English ones, most from trades, places or a father's name.
export const ENGLISH_ERAS = [
  { id: "modern", label: "👶 Modern (popular now)", short: "Modern" },
  { id: "classic", label: "🎩 Victorian & classic", short: "Classic" },
  { id: "old", label: "🛡️ Old English / Anglo-Saxon", short: "Old English" },
];

export const ENGLISH_GIVEN = [
  ...given("modern", "male", "Oliver = olive tree (Latin); Noah = rest, comfort (Hebrew); George = farmer (Greek); Arthur = possibly bear (Celtic); Leo = lion (Latin); Theodore = gift of God (Greek); Jack = God is gracious (from John); Harry = home ruler (from Henry); Oscar = deer lover or God's spear; Freddie = peaceful ruler (from Frederick); Archie = truly brave (from Archibald); Alfie = elf counsel (from Alfred); Hudson = son of Hugh; Ezra = help (Hebrew); Jude = praised (Hebrew); Rowan = little red one (Irish); Grayson = son of the steward; Finley = fair-haired warrior (Scottish)"),
  ...given("modern", "female", "Olivia = olive tree (Latin); Amelia = work (Germanic); Isla = island (Scottish); Ava = bird or life (Latin/Hebrew); Lily = the lily flower; Freya = lady (Norse); Ivy = the evergreen climbing plant; Willow = the willow tree; Grace = grace, goodness; Evie = life (from Eve); Poppy = the poppy flower; Harper = harp player; Charlotte = free (French); Rosie = rose; Daisy = day's eye (Old English); Matilda = mighty in battle; Sienna = orange-red, from the Italian city; Aurora = dawn (Latin)"),
  ...given("classic", "male", "William = resolute protector; Edward = rich guardian; Albert = noble + bright; Frederick = peaceful ruler; Walter = army ruler; Charles = free man; Thomas = twin (Aramaic); Richard = brave ruler; Robert = bright fame; Ernest = serious, resolute; Herbert = bright army; Percy = from a Norman place name; Stanley = stony meadow; Clifford = ford by a cliff; Leonard = lion + brave; Reginald = counsel + power; Harold = army ruler; Cecil = blind, from the Roman name Caecilius"),
  ...given("classic", "female", "Elizabeth = God is my oath (Hebrew); Margaret = pearl (Greek); Mary = from Hebrew Miriam; Dorothy = gift of God (Greek); Florence = flourishing (Latin); Beatrice = she who brings happiness (Latin); Victoria = victory (Latin); Alice = noble (Germanic); Mabel = lovable (Latin); Violet = the violet flower; Agnes = pure, holy (Greek); Ethel = noble (Old English); Hilda = battle (Germanic); Constance = steadfast (Latin); Joan = God is gracious; Winifred = blessed reconciliation (Welsh); Edith = prosperous in war (Old English); Clara = bright, clear (Latin)"),
  ...given("old", "male", "Alfred = elf counsel; Edmund = rich protector; Godric = God's power; Oswald = god + power; Aelfric = elf ruler; Leofric = dear ruler; Wulfstan = wolf + stone; Eadric = rich ruler; Cuthbert = famous + bright; Edgar = rich spear; Aethelstan = noble stone; Osric = god + ruler; Edwin = rich friend; Wystan = battle stone; Hereward = army guard; Wilfrid = will + peace; Godwin = good friend; Aethelred = noble counsel"),
  ...given("old", "female", "Aethelflaed = noble beauty; Eadgyth = rich + war; Hild = battle; Mildred = gentle strength; Aelfgifu = elf gift; Eadburh = rich fortress; Godgifu = gift of God (Lady Godiva); Wynflaed = joy + beauty; Leofrun = dear secret; Aethelthryth = noble strength; Cyneburh = royal fortress; Osgyth = god + war; Eadgifu = rich gift; Frideswide = peace + strong; Wulfrun = wolf + secret; Aelfthryth = elf strength; Ealdgyth = old + war; Seaxburh = knife + fortress"),
].filter((n, i, all) => all.findIndex((m) => m.name === n.name) === i);

export const ENGLISH_SURNAMES = glossed("Smith = metal worker; Jones = son of John; Taylor = tailor; Brown = brown-haired; Williams = son of William; Wilson = son of Will; Johnson = son of John; Walker = cloth fuller who trod wool; Wright = craftsman, builder; Thompson = son of Thomas; White = fair-haired; Hughes = son of Hugh; Green = lived by the village green; Hall = worked at the manor hall; Wood = lived by a wood; Harris = son of Harry; Clarke = clerk, scribe; Cooper = barrel maker; King = played the king in a pageant, or served one; Baker = baker; Turner = worked a lathe; Hill = lived on a hill; Ward = guard, watchman; Moore = lived by a moor; Carter = cart driver; Fletcher = arrow maker; Thatcher = roofer; Chapman = merchant; Fowler = bird catcher; Archer = bowman; Mason = stone worker; Shepherd = sheep herder; Fisher = fisherman; Miller = miller; Bishop = served a bishop; Knight = a knight's servant; Bell = bell ringer, or lived by the bell; Brooks = lived by a brook; Ashford = ford by ash trees; Hawthorne = hawthorn hedge; Whitfield = white field");

export const englishFilters: FilterGroup[] = [
  { id: "era", label: "Era", multi: true, options: ENGLISH_ERAS.map((e) => ({ value: e.id, label: e.label })) },
  SEX_FILTER,
  {
    id: "style",
    label: "Name style",
    options: [
      { value: "full", label: "First + last name" },
      { value: "middle", label: "First + middle + last" },
      { value: "first", label: "First name only" },
    ],
  },
];

const byGender = { male: ENGLISH_GIVEN.filter((n) => n.gender === "male"), female: ENGLISH_GIVEN.filter((n) => n.gender === "female") };

export const englishGenerator = realNameGenerator({
  names: ENGLISH_GIVEN,
  surnames: ENGLISH_SURNAMES,
  eras: ENGLISH_ERAS,
  flag: "🇬🇧",
  special: {
    id: "middle",
    // Classic middle names come from the classic and modern lists of the same gender.
    pool: (n) => byGender[n.gender].filter((m) => m.name !== n.name && m.era !== "old"),
    withSurname: true,
    title: (n, s, surname) => `${n.name} ${s.name} ${surname?.name ?? ""}`.trim(),
    note: (s) => `${s.name} (middle): ${s.meaning}`,
    variety: 34,
  },
});
