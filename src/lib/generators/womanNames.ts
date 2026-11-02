import { comboGenerator, pick } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Women's given names with origin, style and a meaning. Entries are written as
// "Name = style = meaning" per origin. Only meanings that are well established
// are included; for Chinese and Korean names the meaning depends on the
// characters, so the commonly intended one is stated.
export type WomanOrigin =
  | "english" | "spanish" | "french" | "italian" | "german" | "irish" | "scandinavian" | "slavic"
  | "greek" | "japanese" | "chinese" | "korean" | "indian" | "arabic" | "african";
export type WomanStyle = "classic" | "modern" | "vintage" | "rare";
export interface WomanName { name: string; origin: WomanOrigin; style: WomanStyle; meaning: string }

const mk = (origin: WomanOrigin, list: string): WomanName[] =>
  list.split("; ").map((e) => { const [name, style, meaning] = e.split(" = "); return { name, origin, style: style as WomanStyle, meaning }; });

export const WOMAN_NAMES: WomanName[] = [
  ...mk("english", "Charlotte = classic = feminine of Charles, \"free man\"; Olivia = modern = Latin, \"olive tree\"; Hazel = modern = the hazel tree; Violet = modern = the purple flower; Ruby = vintage = the red gemstone; Margaret = classic = Greek, \"pearl\"; Harriet = vintage = feminine of Harry, \"home ruler\"; Edith = vintage = Old English, \"prosperous in war\"; Matilda = vintage = Germanic, \"mighty in battle\"; Florence = vintage = Latin, \"flourishing\"; Clara = classic = Latin, \"clear, bright\"; Beatrice = classic = Latin, \"she who brings joy\"; Willow = modern = the willow tree; Ivy = modern = the climbing plant; Wren = rare = a small songbird; Verity = rare = Latin-derived, \"truth\""),
  ...mk("spanish", "Sofía = classic = Greek, \"wisdom\"; Isabella = classic = form of Elizabeth, \"God is my oath\"; Valentina = modern = Latin, \"strong, healthy\"; Camila = modern = Latin, \"young ceremonial attendant\"; Lucía = classic = Latin, \"light\"; Marisol = modern = Spanish, \"sea and sun\"; Carmen = classic = from Hebrew karmel, \"garden, orchard\"; Dolores = vintage = Spanish, \"sorrows\"; Esperanza = vintage = Spanish, \"hope\"; Alma = classic = Spanish, \"soul\"; Paloma = rare = Spanish, \"dove\"; Soledad = vintage = Spanish, \"solitude\"; Luna = modern = Latin, \"moon\"; Mariana = classic = blend of Maria and Ana; Amparo = rare = Spanish, \"shelter, protection\"; Azucena = rare = Spanish, \"white lily\""),
  ...mk("french", "Amélie = classic = Germanic, \"work\"; Camille = modern = Latin, \"ceremonial attendant\"; Colette = vintage = short form of Nicolette, \"victory of the people\"; Margaux = modern = French form of Margaret, \"pearl\"; Odette = vintage = Germanic, \"wealth\"; Manon = modern = pet form of Marie; Océane = modern = French, \"ocean\"; Juliette = classic = diminutive of Julia; Giselle = rare = Germanic, \"pledge\"; Delphine = vintage = Greek, \"dolphin\", or \"from Delphi\"; Rosalie = vintage = from Latin rosa, \"rose\"; Aurélie = classic = Latin, \"golden\"; Capucine = rare = French, \"nasturtium flower\"; Mathilde = vintage = Germanic, \"mighty in battle\"; Sylvie = vintage = Latin, \"of the forest\"; Blanche = vintage = French, \"white\""),
  ...mk("italian", "Giulia = classic = feminine of Julius; Francesca = classic = feminine of Francesco, \"free one\"; Chiara = modern = Italian, \"clear, bright\"; Alessia = modern = feminine of Alexis, \"defender\"; Aurora = modern = Latin, \"dawn\"; Bianca = classic = Italian, \"white\"; Serena = classic = Latin, \"calm, serene\"; Fiammetta = rare = Italian, \"little flame\"; Viola = modern = Latin, \"violet flower\"; Gianna = modern = feminine of Gianni, from Giovanni, \"God is gracious\"; Allegra = rare = Italian, \"cheerful\"; Grazia = vintage = Italian, \"grace\"; Stella = classic = Latin, \"star\"; Rosalba = rare = Italian, \"white rose\"; Annunziata = rare = Italian, \"announced\"; Domenica = vintage = Latin, \"of the Lord\""),
  ...mk("german", "Greta = classic = short form of Margareta, \"pearl\"; Lena = modern = short form of Helena or Magdalena; Emma = classic = Germanic, \"whole, universal\"; Frieda = vintage = Germanic, \"peace\"; Hedwig = rare = Germanic, \"battle strife\"; Liesel = vintage = pet form of Elisabeth; Marlene = vintage = blend of Maria and Magdalene; Sabine = classic = Latin, \"woman of the Sabines\"; Brigitte = vintage = Celtic, \"exalted one\"; Johanna = classic = Hebrew, \"God is gracious\"; Heidi = vintage = short form of Adelheid, \"noble kind\"; Leonie = modern = from Latin leo, \"lion\"; Ilse = vintage = short form of Elisabeth; Mathilda = rare = Germanic, \"mighty in battle\"; Annelie = rare = blend of Anna and Lie; Gertrud = rare = Germanic, \"spear strength\""),
  ...mk("irish", "Aoife = classic = Irish, \"beauty\"; Saoirse = modern = Irish, \"freedom\"; Niamh = classic = Irish, \"bright, radiant\"; Siobhán = classic = Irish form of Joan, \"God is gracious\"; Róisín = classic = Irish, \"little rose\"; Fiona = classic = Gaelic, \"fair, white\"; Isla = modern = from the Scottish island of Islay; Eilidh = modern = Scottish Gaelic form of Helen; Maeve = modern = Irish, \"she who intoxicates\"; Orla = modern = Irish, \"golden princess\"; Sorcha = rare = Irish, \"brightness\"; Caoimhe = modern = Irish, \"gentle, beautiful\"; Ailsa = modern = from the island Ailsa Craig; Elspeth = vintage = Scots form of Elizabeth; Moira = vintage = Irish form of Mary; Tara = vintage = Irish, \"hill\""),
  ...mk("scandinavian", "Astrid = classic = Old Norse, \"divinely beautiful\"; Freya = modern = Norse goddess, \"lady\"; Ingrid = classic = Old Norse, \"Ing is beautiful\"; Sigrid = vintage = Old Norse, \"beautiful victory\"; Linnea = modern = the twinflower; Elsa = classic = short form of Elisabeth; Ida = classic = Germanic, \"industrious\"; Signe = vintage = Old Norse, \"new victory\"; Saga = modern = Swedish, \"story, tale\"; Maja = modern = Scandinavian form of Maria; Thora = rare = Old Norse, \"belonging to Thor\"; Embla = rare = first woman in Norse myth; Liv = modern = Old Norse, \"life\"; Ylva = rare = Swedish, \"she-wolf\"; Frida = vintage = Germanic, \"peace\"; Gunnhild = rare = Old Norse, \"battle\""),
  ...mk("slavic", "Anastasia = classic = Greek, \"resurrection\"; Natalia = classic = Latin, \"birthday of the Lord\"; Milena = modern = Slavic, \"gracious, dear\"; Vesna = modern = Slavic, \"spring\"; Zofia = classic = Polish form of Sophia, \"wisdom\"; Zora = vintage = Slavic, \"dawn\"; Mila = modern = Slavic, \"dear, gracious\"; Irina = classic = Russian form of Irene, \"peace\"; Svetlana = vintage = Russian, \"light\"; Vera = classic = Russian, \"faith\"; Ludmila = vintage = Slavic, \"favor of the people\"; Agnieszka = classic = Polish form of Agnes, \"pure\"; Nadezhda = vintage = Russian, \"hope\"; Olga = vintage = Old Norse via Slavic, \"holy, blessed\"; Oksana = modern = Ukrainian form of Xenia, \"hospitality\"; Radmila = rare = Slavic, \"joyful and dear\""),
  ...mk("greek", "Athena = modern = goddess of wisdom; Eleni = classic = Greek form of Helen; Zoe = modern = Greek, \"life\"; Daphne = classic = Greek, \"laurel\"; Calliope = rare = Greek, \"beautiful voice\"; Thea = modern = Greek, \"goddess\"; Irene = vintage = Greek, \"peace\"; Chloe = modern = Greek, \"green shoot\"; Ariadne = rare = Greek, \"most holy\"; Dimitra = classic = Greek, \"devoted to Demeter\"; Evangelia = vintage = Greek, \"good news\"; Despina = vintage = Greek, \"lady, mistress\"; Phoebe = modern = Greek, \"bright\"; Xenia = rare = Greek, \"hospitality, guest\"; Theodora = vintage = Greek, \"gift of God\"; Eudora = rare = Greek, \"good gift\""),
  ...mk("japanese", "Sakura = modern = \"cherry blossom\"; Hana = classic = \"flower\"; Aiko = classic = \"beloved child\"; Haruka = modern = \"distant\", or \"spring flower\"; Hikari = modern = \"light\"; Yuki = classic = \"snow\", or \"happiness\"; Akari = modern = \"light, glow\"; Misaki = modern = \"beautiful blossom\"; Emi = classic = \"beautiful blessing\"; Rin = modern = \"dignified\"; Kaede = modern = \"maple tree\"; Tsubaki = rare = \"camellia\"; Kiyoko = vintage = \"pure child\"; Michiko = vintage = \"beautiful, wise child\"; Natsumi = modern = \"summer beauty\"; Ayame = rare = \"iris flower\"; Hotaru = rare = \"firefly\"; Keiko = vintage = \"blessed child\""),
  ...mk("chinese", "Mei = classic = \"plum blossom\" or \"beautiful\", depending on the character; Lan = classic = \"orchid\"; Yue = modern = \"moon\"; Jing = classic = \"quiet, still\"; Hui = vintage = \"wise\"; Lian = classic = \"lotus\"; Fang = vintage = \"fragrant\"; Yan = classic = \"swallow\" or \"beautiful\", depending on the character; Ling = classic = \"spirit, delicate\"; Xue = modern = \"snow\"; Qing = modern = \"clear, blue-green\"; Wen = classic = \"refined, cultured\"; Shan = rare = \"coral\"; Chun = vintage = \"spring\"; Zhen = rare = \"precious\""),
  ...mk("korean", "Bora = modern = native Korean, \"purple\"; Haneul = modern = native Korean, \"sky\"; Nari = modern = native Korean, \"lily\"; Areum = modern = native Korean, \"beautiful\"; Byeol = rare = native Korean, \"star\"; Narae = rare = native Korean, \"wings\"; Saebom = rare = native Korean, \"new spring\"; Hana = modern = native Korean, \"one, the first\"; Sarang = rare = native Korean, \"love\"; Gaon = modern = native Korean, \"center, the middle of the world\"; Dasom = rare = native Korean, \"love\"; Seulgi = modern = native Korean, \"wisdom\""),
  ...mk("indian", "Priya = classic = Sanskrit, \"beloved\"; Ananya = modern = Sanskrit, \"unique, without equal\"; Diya = modern = Sanskrit, \"lamp\"; Kavya = modern = Sanskrit, \"poetry\"; Lakshmi = vintage = goddess of wealth and prosperity; Anjali = classic = Sanskrit, \"offering with folded hands\"; Aditi = classic = Sanskrit, \"boundless, free\"; Tara = classic = Sanskrit, \"star\"; Nisha = classic = Sanskrit, \"night\"; Padma = vintage = Sanskrit, \"lotus\"; Kamala = vintage = Sanskrit, \"lotus\"; Malini = vintage = Sanskrit, \"fragrant\"; Shanti = vintage = Sanskrit, \"peace\"; Leela = vintage = Sanskrit, \"divine play\"; Jaya = classic = Sanskrit, \"victory\"; Aadhya = modern = Sanskrit, \"first power\""),
  ...mk("arabic", "Amira = classic = Arabic, \"princess\"; Layla = classic = Arabic, \"night\"; Noor = modern = Arabic, \"light\"; Yasmin = classic = from jasmine; Zahra = classic = Arabic, \"radiant, shining\"; Samira = vintage = Arabic, \"evening companion\"; Aisha = classic = Arabic, \"alive, living\"; Salma = classic = Arabic, \"peaceful, safe\"; Hana = modern = Arabic, \"happiness, bliss\"; Jamila = vintage = Arabic, \"beautiful\"; Huda = vintage = Arabic, \"right guidance\"; Farah = modern = Arabic, \"joy\"; Zainab = classic = Arabic, \"fragrant tree\"; Amal = vintage = Arabic, \"hope\"; Hayat = vintage = Arabic, \"life\"; Iman = modern = Arabic, \"faith\""),
  ...mk("african", "Amara = modern = Igbo, \"grace\"; Nia = modern = Swahili, \"purpose\"; Zuri = modern = Swahili, \"beautiful\"; Imani = modern = Swahili, \"faith\"; Adaeze = classic = Igbo, \"princess, daughter of the king\"; Chidinma = classic = Igbo, \"God is good\"; Ngozi = classic = Igbo, \"blessing\"; Abena = vintage = Akan, \"born on Tuesday\"; Akosua = vintage = Akan, \"born on Sunday\"; Zawadi = rare = Swahili, \"gift\"; Thandiwe = classic = Zulu, \"beloved\"; Naledi = modern = Sotho and Tswana, \"star\"; Palesa = rare = Sotho, \"flower\"; Subira = rare = Swahili, \"patience\"; Selam = rare = Amharic, \"peace\"; Almaz = vintage = Amharic, \"diamond\""),
];

const SURNAMES: Record<WomanOrigin, string[]> = {
  english: "Hartley, Whitaker, Ashworth, Pemberton, Fairfax, Cartwright, Langley, Thornton, Holloway, Prescott".split(", "),
  spanish: "García, Morales, Navarro, Castillo, Ortega, Herrera, Vargas, Delgado, Fuentes, Salazar".split(", "),
  french: "Moreau, Lefèvre, Dubois, Fontaine, Marchand, Girard, Laurent, Beaumont, Delacroix, Roussel".split(", "),
  italian: "Rossi, Moretti, Bellini, Conti, Ferrara, Greco, Marchetti, Lombardi, Vitale, De Luca".split(", "),
  german: "Müller, Becker, Hoffmann, Keller, Brandt, Vogel, Lehmann, Schäfer, Richter, Winkler".split(", "),
  irish: "Murphy, Gallagher, Brennan, MacLeod, Campbell, Fraser, O'Connor, Donnelly, Sinclair, Kavanagh".split(", "),
  scandinavian: "Lindqvist, Johansson, Andersen, Holm, Nygaard, Eriksen, Bergström, Halvorsen, Dahl, Lund".split(", "),
  slavic: "Novak, Kowalska, Petrova, Ivanova, Horvat, Kovač, Sokolova, Wiśniewska, Marković, Volkova".split(", "),
  greek: "Papadopoulou, Georgiou, Nikolaidou, Dimitriou, Karra, Stavrou, Alexiou, Vasiliou, Manolakis, Pappas".split(", "),
  japanese: "Tanaka, Sato, Watanabe, Kobayashi, Nakamura, Hayashi, Yamada, Ishikawa, Fujita, Morita".split(", "),
  chinese: "Wang, Li, Zhang, Chen, Liu, Lin, Huang, Zhou, Wu, Xu".split(", "),
  korean: "Kim, Lee, Park, Choi, Jung, Kang, Cho, Yoon, Jang, Lim".split(", "),
  indian: "Sharma, Patel, Iyer, Reddy, Nair, Gupta, Mehta, Chopra, Banerjee, Kapoor".split(", "),
  arabic: "Haddad, Khalil, Nasser, Mansour, Saleh, Farouk, Rahman, Aziz, Hamdan, Qureshi".split(", "),
  african: "Okafor, Adeyemi, Mensah, Nkosi, Dlamini, Mwangi, Abebe, Kamau, Osei, Diallo".split(", "),
};

export const WOMAN_ORIGINS: { id: WomanOrigin; label: string; short: string; familyFirst?: boolean }[] = [
  { id: "english", label: "🇬🇧 English", short: "English" },
  { id: "spanish", label: "🇪🇸 Spanish / Latin", short: "Spanish / Latin" },
  { id: "french", label: "🇫🇷 French", short: "French" },
  { id: "italian", label: "🇮🇹 Italian", short: "Italian" },
  { id: "german", label: "🇩🇪 German", short: "German" },
  { id: "irish", label: "☘️ Irish / Scottish", short: "Irish / Scottish" },
  { id: "scandinavian", label: "🇸🇪 Scandinavian", short: "Scandinavian" },
  { id: "slavic", label: "🇵🇱 Slavic", short: "Slavic" },
  { id: "greek", label: "🇬🇷 Greek", short: "Greek" },
  { id: "japanese", label: "🇯🇵 Japanese", short: "Japanese", familyFirst: true },
  { id: "chinese", label: "🇨🇳 Chinese", short: "Chinese", familyFirst: true },
  { id: "korean", label: "🇰🇷 Korean", short: "Korean", familyFirst: true },
  { id: "indian", label: "🇮🇳 Indian", short: "Indian" },
  { id: "arabic", label: "🌙 Arabic", short: "Arabic" },
  { id: "african", label: "🌍 African", short: "African" },
];

const STYLES: { id: WomanStyle; label: string; short: string }[] = [
  { id: "classic", label: "Classic", short: "classic" },
  { id: "modern", label: "Modern", short: "modern" },
  { id: "vintage", label: "Vintage", short: "vintage" },
  { id: "rare", label: "Rare", short: "rare" },
];

export const womanFilters: FilterGroup[] = [
  { id: "origin", label: "Origin / culture", multi: true, options: WOMAN_ORIGINS.map((o) => ({ value: o.id, label: o.label })) },
  { id: "style", label: "Era / style", multi: true, options: STYLES.map((s) => ({ value: s.id, label: s.label })) },
];

export const womanGenerator = comboGenerator<WomanName, string>({
  items: WOMAN_NAMES,
  baseKey: (n) => `${n.origin}:${n.name}`,
  facets: { origin: (n) => [n.origin], style: (n) => [n.style] },
  extra: (n, rng) => pick(SURNAMES[n.origin], rng),
  extraKey: (s) => s,
  extraFromKey: (n, key) => (SURNAMES[n.origin].includes(key) ? key : null),
  toResult: (n, surname) => {
    const o = WOMAN_ORIGINS.find((x) => x.id === n.origin)!;
    return {
      title: o.familyFirst ? `${surname} ${n.name}` : `${n.name} ${surname}`,
      subtitle: `${o.label} · ${n.style}${o.familyFirst ? " · family name first" : ""}`,
      detail: `${n.name}: ${n.meaning}`,
    };
  },
  variety: () => 10,
});
