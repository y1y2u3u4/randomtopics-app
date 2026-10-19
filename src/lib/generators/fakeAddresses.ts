import { NATIONALITIES, type FakeProfile } from "./fakeNames";
import { pick } from "./core";
import { createRng, type Rng } from "@/lib/randomGenerators";

// Fictional addresses and personal details for fake profiles. Addresses use
// the profile's real city, the local street style and a postcode in the right
// format and range for that city, but street names are assembled from generic
// words (Willowmere Lane, Lindenweg, rue des Glycines) so they are not anyone's
// home. Details such as star sign and generation are derived from the
// birthday, so every field on a profile agrees with the others.

export interface FakeAddress {
  street: string;
  /** Second address line (apartment, district, ward); may be empty. */
  line2: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  /** Lines in the order a local envelope would show them. */
  lines: string[];
}

export interface FakeDetails {
  height: string;
  heightCm: number;
  weight: string;
  weightKg: number;
  bloodType: string;
  eyeColor: string;
  hairColor: string;
  starSign: string;
  generation: string;
  favoriteColor: string;
  personality: string;
  hobby: string;
}

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const digits = (rng: Rng, n: number) => Array.from({ length: n }, () => Math.floor(rng() * 10)).join("");
const pad = (n: number, w: number) => String(n).padStart(w, "0");
const letters = (rng: Rng, set: string, n: number) => Array.from({ length: n }, () => set[Math.floor(rng() * set.length)]).join("");

const EN_A = ["Willow", "Amber", "Briar", "Cedar", "Hazel", "Linden", "Rowan", "Thistle", "Juniper", "Larch", "Heather", "Alder", "Bramble", "Clover", "Foxglove", "Holly", "Laurel", "Marigold", "Primrose", "Sorrel", "Wren", "Kestrel", "Heron", "Lark", "Finch", "Otter", "Aspen", "Harrow"];
const EN_B = ["mere", "field", "wood", "gate", "croft", "dale", "stone", "water", "bank", "ridge", "haven", "moor", "wick", "brook", "shaw"];
const enStem = (rng: Rng) => `${pick(EN_A, rng)}${pick(EN_B, rng)}`;

type CityRule = { region?: string; post: (rng: Rng) => string };
type Format = (ctx: { rng: Rng; city: string; rule: CityRule | undefined; country: string }) => Omit<FakeAddress, "lines" | "country"> & { lines: string[] };

const range = (lo: number, hi: number, w = 0) => (rng: Rng) => pad(int(rng, lo, hi), w);

const US: Record<string, string> = { "New York": "100", Chicago: "606", Austin: "787", Denver: "802", Seattle: "981", Atlanta: "303", Phoenix: "850", Boston: "021", Nashville: "372", Portland: "972" };
const UK: Record<string, [string[], number, number]> = {
  London: [["N", "E", "SE", "SW", "NW", "W"], 1, 20], Manchester: [["M"], 1, 40], Leeds: [["LS"], 1, 29], Bristol: [["BS"], 1, 16], Birmingham: [["B"], 1, 45],
  Glasgow: [["G"], 1, 80], Edinburgh: [["EH"], 1, 17], Cardiff: [["CF"], 5, 24], Liverpool: [["L"], 1, 37], Newcastle: [["NE"], 1, 15],
};
const UK_INWARD = "ABDEFGHJLNPQRSTUWXYZ";
const IE: Record<string, () => string> = { Cork: () => "T12", Galway: () => "H91", Limerick: () => "V94", Waterford: () => "X91", Kilkenny: () => "R95" };
const CA: Record<string, string> = { Toronto: "M", Vancouver: "V", Montreal: "H", Calgary: "T", Ottawa: "K", Halifax: "B", Winnipeg: "R", "Quebec City": "G" };
const CA_LETTERS = "ABCEGHJKLMNPRSTVWXYZ";
const AU: Record<string, [number, number]> = { Sydney: [2000, 2234], Melbourne: [3000, 3207], Brisbane: [4000, 4179], Perth: [6000, 6199], Adelaide: [5000, 5199], Hobart: [7000, 7099], "Gold Coast": [4207, 4230], Canberra: [2600, 2617] };

const RULES: Record<string, Record<string, CityRule>> = {
  mx: {
    "Mexico City": { region: "CDMX", post: (r) => pad(int(r, 1, 16), 2) + digits(r, 3) }, Guadalajara: { region: "Jal.", post: (r) => "44" + digits(r, 3) },
    Monterrey: { region: "N.L.", post: (r) => "64" + digits(r, 3) }, Puebla: { region: "Pue.", post: (r) => "72" + digits(r, 3) },
    "Mérida": { region: "Yuc.", post: (r) => "97" + digits(r, 3) }, Oaxaca: { region: "Oax.", post: (r) => "68" + digits(r, 3) },
    "Querétaro": { region: "Qro.", post: (r) => "76" + digits(r, 3) }, Tijuana: { region: "B.C.", post: (r) => "22" + digits(r, 3) },
  },
  es: Object.fromEntries(Object.entries({ Madrid: "28", Barcelona: "08", Valencia: "46", Seville: "41", Bilbao: "48", "Málaga": "29", Zaragoza: "50", Granada: "18" }).map(([c, p]) => [c, { post: (r: Rng) => p + "0" + pad(int(r, 1, 50), 2) }])),
  br: {
    "São Paulo": { region: "SP", post: (r) => "0" + int(r, 1, 5) + digits(r, 3) + "-" + digits(r, 3) }, "Rio de Janeiro": { region: "RJ", post: (r) => "2" + int(r, 0, 3) + digits(r, 3) + "-" + digits(r, 3) },
    "Belo Horizonte": { region: "MG", post: (r) => "3" + int(r, 0, 1) + digits(r, 3) + "-" + digits(r, 3) }, Salvador: { region: "BA", post: (r) => "4" + int(r, 0, 1) + digits(r, 3) + "-" + digits(r, 3) },
    Curitiba: { region: "PR", post: (r) => "8" + int(r, 0, 2) + digits(r, 3) + "-" + digits(r, 3) }, Recife: { region: "PE", post: (r) => "5" + int(r, 0, 2) + digits(r, 3) + "-" + digits(r, 3) },
    "Porto Alegre": { region: "RS", post: (r) => "9" + int(r, 0, 1) + digits(r, 3) + "-" + digits(r, 3) }, Fortaleza: { region: "CE", post: (r) => "60" + digits(r, 3) + "-" + digits(r, 3) },
  },
  fr: {
    Paris: { post: (r) => "750" + pad(int(r, 1, 20), 2) }, Lyon: { post: (r) => "6900" + int(r, 1, 9) }, Marseille: { post: (r) => "130" + pad(int(r, 1, 16), 2) },
    Toulouse: { post: (r) => "31" + pick(["000", "100", "200", "300", "400", "500"], r) }, Bordeaux: { post: (r) => "33" + pick(["000", "100", "200", "300", "800"], r) },
    Lille: { post: (r) => "590" + pick(["00", "08"], r) }, Nantes: { post: (r) => "44" + pick(["000", "100", "200", "300"], r) }, Strasbourg: { post: (r) => "67" + pick(["000", "100", "200"], r) },
  },
  de: Object.fromEntries(Object.entries({ Berlin: ["10", "12", "13"], Munich: ["80", "81"], Hamburg: ["20", "22"], Cologne: ["50", "51"], Frankfurt: ["60"], Stuttgart: ["70"], Leipzig: ["04"], Dresden: ["01"] }).map(([c, ps]) => [c, { post: (r: Rng) => pick(ps, r) + digits(r, 3) }])),
  it: Object.fromEntries(Object.entries({ Rome: ["001", "RM"], Milan: ["201", "MI"], Naples: ["801", "NA"], Turin: ["101", "TO"], Florence: ["501", "FI"], Bologna: ["401", "BO"], Venice: ["301", "VE"], Palermo: ["901", "PA"] }).map(([c, [p, prov]]) => [c, { region: prov, post: (r: Rng) => p + pad(int(r, 21, 99), 2) }])),
  nl: Object.fromEntries(Object.entries({ Amsterdam: [1011, 1109], Rotterdam: [3011, 3089], Utrecht: [3511, 3585], "The Hague": [2491, 2599], Eindhoven: [5611, 5658], Groningen: [9711, 9747], Leiden: [2311, 2334], Haarlem: [2011, 2037] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => `${int(r, lo, hi)} ${letters(r, "ABCEGHJKLMNPRTVWXZ", 2)}` }])),
  nordic: {
    Stockholm: { post: (r) => `1${int(r, 11, 29)} ${digits(r, 2)}` }, Gothenburg: { post: (r) => `4${int(r, 11, 26)} ${digits(r, 2)}` }, "Malmö": { post: (r) => `2${int(r, 11, 17)} ${digits(r, 2)}` },
    Uppsala: { post: (r) => `75${int(r, 1, 7)} ${digits(r, 2)}` }, Oslo: { post: range(150, 1295, 4) }, Bergen: { post: range(5003, 5099, 4) },
    Copenhagen: { post: range(1050, 2450, 4) }, Aarhus: { post: range(8000, 8270, 4) },
  },
  pl: Object.fromEntries(Object.entries({ Warsaw: [0, 4], "Kraków": [30, 31], "Gdańsk": [80, 80], "Wrocław": [50, 54], "Poznań": [60, 61], "Łódź": [90, 94] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => `${pad(int(r, lo, hi), 2)}-${digits(r, 3)}` }])),
  ru: Object.fromEntries(Object.entries({ Moscow: ["10", "11", "12"], "Saint Petersburg": ["19"], Kazan: ["420"], Novosibirsk: ["630"], Yekaterinburg: ["620"], Sochi: ["354"] }).map(([c, ps]) => [c, { post: (r: Rng) => { const p = pick(ps, r); return p + digits(r, 6 - p.length); } }])),
  gr: Object.fromEntries(Object.entries({ Athens: [104, 117], Thessaloniki: [541, 564], Patras: [262, 265], Heraklion: [712, 716], Larissa: [412, 415], Volos: [382, 384] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => `${int(r, lo, hi)} ${digits(r, 2)}` }])),
  il: Object.fromEntries(Object.entries({ "Tel Aviv": [61, 69], Jerusalem: [91, 97], Haifa: [31, 35], "Be'er Sheva": [84, 84], Netanya: [42, 42], Eilat: [88, 88] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => `${int(r, lo, hi)}${digits(r, 5)}` }])),
  arab: {
    Cairo: { post: (r) => "11" + digits(r, 3) }, Amman: { post: (r) => "11" + digits(r, 3) }, Beirut: { post: (r) => `${digits(r, 4)} ${digits(r, 4)}` }, Dubai: { post: () => "" },
    Riyadh: { post: (r) => "1" + digits(r, 4) }, Doha: { post: () => "" }, Casablanca: { post: (r) => "20" + digits(r, 3) }, Muscat: { post: (r) => "1" + digits(r, 2) },
  },
  in: Object.fromEntries(Object.entries({ Mumbai: ["4000", "Maharashtra"], Delhi: ["1100", "Delhi"], Bengaluru: ["5600", "Karnataka"], Chennai: ["6000", "Tamil Nadu"], Hyderabad: ["5000", "Telangana"], Pune: ["4110", "Maharashtra"], Kolkata: ["7000", "West Bengal"], Jaipur: ["3020", "Rajasthan"] }).map(([c, [p, st]]) => [c, { region: st, post: (r: Rng) => p + pad(int(r, 1, 99), 2) }])),
  cn: Object.fromEntries(Object.entries({ Beijing: "100", Shanghai: "200", Guangzhou: "510", Shenzhen: "518", Chengdu: "610", Hangzhou: "310", Wuhan: "430", "Xi'an": "710" }).map(([c, p]) => [c, { post: (r: Rng) => p + pad(int(r, 0, 199), 3) }])),
  jp: Object.fromEntries(Object.entries({ Tokyo: [100, 199], Osaka: [530, 559], Kyoto: [600, 616], Yokohama: [220, 247], Sapporo: [60, 6], Fukuoka: [810, 819], Nagoya: [450, 468], Kobe: [650, 658] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => `${pad(lo < hi ? int(r, lo, hi) : int(r, 60, 69), 3)}-${digits(r, 4)}` }])),
  kr: Object.fromEntries(Object.entries({ Seoul: [1, 8], Busan: [46, 49], Incheon: [21, 23], Daegu: [41, 43], Daejeon: [34, 35], Gwangju: [61, 62], "Jeju City": [63, 63], Suwon: [16, 16] }).map(([c, [lo, hi]]) => [c, { post: (r: Rng) => pad(int(r, lo, hi), 2) + digits(r, 3) }])),
  vn: Object.fromEntries(Object.entries({ Hanoi: "10", "Ho Chi Minh City": "70", "Da Nang": "55", Hue: "53", "Hai Phong": "18", "Can Tho": "94", "Nha Trang": "65" }).map(([c, p]) => [c, { post: (r: Rng) => p + digits(r, 4) }])),
  ph: Object.fromEntries(Object.entries({ Manila: [1000, 1018], "Quezon City": [1100, 1129], "Cebu City": [6000, 6000], "Davao City": [8000, 8000], Makati: [1200, 1235], Baguio: [2600, 2600], "Iloilo City": [5000, 5000] }).map(([c, [lo, hi]]) => [c, { post: range(lo, hi, 4) }])),
};

const plain = (street: string, line2: string, cityLine: string, city: string, region: string, postcode: string) =>
  ({ street, line2, city, region, postcode, lines: [street, line2, cityLine].filter(Boolean) });

const FORMATS: Record<string, Format> = {
  us: ({ rng, city }) => {
    const [c, st] = city.split(", ");
    const street = `${int(rng, 100, 9899)} ${enStem(rng)} ${pick(["Street", "Avenue", "Lane", "Drive", "Court", "Road", "Way", "Place"], rng)}`;
    const line2 = rng() < 0.3 ? `Apt ${int(rng, 1, 24)}${pick(["A", "B", "C", "D"], rng)}` : "";
    const zip = (US[c] ?? digits(rng, 3)) + pad(int(rng, 1, 99), 2);
    return plain(street, line2, `${c}, ${st} ${zip}`, c, st, zip);
  },
  uk: ({ rng, city }) => {
    const [areas, lo, hi] = UK[city] ?? [["AB"], 1, 9];
    const pc = `${pick(areas, rng)}${int(rng, lo, hi)} ${int(rng, 1, 9)}${letters(rng, UK_INWARD, 2)}`;
    const street = `${int(rng, 1, 180)} ${enStem(rng)} ${pick(["Road", "Close", "Lane", "Grove", "Crescent", "Gardens", "Street", "Avenue"], rng)}`;
    return plain(street, "", `${city.toUpperCase()} ${pc}`, city, "", pc);
  },
  ie: ({ rng, city }) => {
    const key = IE[city]?.() ?? `D${pad(int(rng, 1, 24), 2)}`;
    const pc = `${key} ${letters(rng, "ACDEFHKNPRTVWXY0123456789", 4)}`;
    const street = `${int(rng, 1, 120)} ${enStem(rng)} ${pick(["Road", "Avenue", "Park", "Close", "Drive", "Court"], rng)}`;
    return plain(street, "", `${city}, ${pc}`, city, `Co. ${city === "Dublin" ? "Dublin" : city}`, pc);
  },
  ca: ({ rng, city }) => {
    const [c, prov] = city.split(", ");
    const L = () => letters(rng, CA_LETTERS, 1);
    const pc = `${CA[c] ?? L()}${int(rng, 1, 9)}${L()} ${int(rng, 1, 9)}${L()}${int(rng, 1, 9)}`;
    const street = prov === "QC" && rng() < 0.7 ? `${int(rng, 100, 8999)}, rue des ${pick(["Érables", "Bouleaux", "Pins", "Mésanges", "Hirondelles", "Lilas"], rng)}` : `${int(rng, 10, 8999)} ${enStem(rng)} ${pick(["Street", "Avenue", "Crescent", "Drive", "Road"], rng)}`;
    const line2 = rng() < 0.3 ? `Unit ${int(rng, 101, 2408)}` : "";
    return plain(street, line2, `${c} ${prov}  ${pc}`, c, prov, pc);
  },
  au: ({ rng, city }) => {
    const [c, st] = city.split(", ");
    const [lo, hi] = AU[c] ?? [2000, 2999];
    const pc = String(int(rng, lo, hi));
    const unit = rng() < 0.3 ? `${int(rng, 1, 30)}/` : "";
    const street = `${unit}${int(rng, 1, 240)} ${enStem(rng)} ${pick(["Street", "Road", "Avenue", "Parade", "Close", "Place", "Crescent"], rng)}`;
    return plain(street, "", `${c.toUpperCase()} ${st} ${pc}`, c, st, pc);
  },
  mx: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `Calle ${pick(["de los Almendros", "de las Golondrinas", "de la Brisa", "de los Tabachines", "de las Jacarandas", "del Colibrí", "de la Ceiba", "de los Naranjos"], rng)} ${int(rng, 1, 999)}`;
    const col = `Col. ${pick(["Jardines del Valle", "Lomas del Sol", "Villa Arboleda", "Residencial Los Pinos", "Real de Alcatraz", "Prados Verdes"], rng)}`;
    return plain(street, col, `${pc} ${city}, ${rule?.region ?? ""}`.replace(/, $/, ""), city, rule?.region ?? "", pc);
  },
  es: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `Calle ${pick(["de los Almendros", "de las Golondrinas", "de la Alborada", "de los Tilos", "de las Amapolas", "de la Hiedra", "del Cierzo", "de la Lavanda"], rng)}, ${int(rng, 1, 120)}`;
    const line2 = `${int(rng, 1, 8)}º ${pick(["A", "B", "C", "D", "izq.", "dcha."], rng)}`;
    return plain(`${street}, ${line2}`, "", `${pc} ${city}`, city, "", pc);
  },
  br: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? `${digits(rng, 5)}-${digits(rng, 3)}`;
    const street = `Rua das ${pick(["Acácias", "Gaivotas", "Palmeiras", "Hortênsias", "Andorinhas", "Mangueiras", "Orquídeas", "Jabuticabeiras"], rng)}, ${int(rng, 10, 2400)}`;
    const line2 = `${rng() < 0.4 ? `Apto ${int(rng, 11, 1204)} - ` : ""}${pick(["Jardim Primavera", "Vila Esperança", "Parque das Flores", "Jardim Aurora", "Vila Serena"], rng)}`;
    return plain(street, line2, `${city} - ${rule?.region ?? ""}, ${pc}`, city, rule?.region ?? "", pc);
  },
  fr: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `${int(rng, 1, 140)}${rng() < 0.1 ? " bis" : ""} ${pick(["rue des Tilleuls", "rue des Glycines", "rue des Mésanges", "allée des Cerisiers", "rue des Hirondelles", "impasse des Coquelicots", "avenue des Peupliers", "rue des Lavandières"], rng)}`;
    return plain(street, "", `${pc} ${city}`, city, "", pc);
  },
  de: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `${pick(["Linden", "Ahorn", "Birken", "Eichen", "Holunder", "Lerchen", "Amsel", "Buchen", "Kastanien", "Rosen"], rng)}${pick(["straße", "weg", "allee", "ring", "gasse"], rng)} ${int(rng, 1, 140)}${rng() < 0.1 ? "a" : ""}`;
    return plain(street, "", `${pc} ${city}`, city, "", pc);
  },
  it: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `${pick(["Via dei Glicini", "Via delle Rondini", "Via dei Platani", "Via dei Ciliegi", "Via degli Ulivi", "Via dei Mandorli", "Via dei Tigli", "Via delle Ortensie"], rng)}, ${int(rng, 1, 180)}`;
    return plain(street, "", `${pc} ${city} ${rule?.region ?? ""}`.trim(), city, rule?.region ?? "", pc);
  },
  nl: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? `${digits(rng, 4)} AB`;
    const street = `${pick(["Linden", "Esdoorn", "Berken", "Kastanje", "Merel", "Lijsterbes", "Wilgen", "Beuken"], rng)}${pick(["straat", "laan", "gracht", "weg", "hof"], rng)} ${int(rng, 1, 220)}${rng() < 0.15 ? `-${pick(["A", "B", "hs", "1"], rng)}` : ""}`;
    return plain(street, "", `${pc} ${city.toUpperCase()}`, city, "", pc);
  },
  nordic: ({ rng, city, rule }) => {
    const [c, country] = city.split(", ");
    const pc = rule?.post(rng) ?? digits(rng, 4);
    const [stems, ends] = country === "Norway" ? [["Bjørke", "Linde", "Eike", "Rogne", "Lerke", "Hassel"], ["veien", "gata"]]
      : country === "Denmark" ? [["Birke", "Linde", "Ege", "Røn", "Lærke", "Hassel"], ["vej", "gade"]]
        : [["Lind", "Björk", "Ek", "Rönn", "Sjö", "Lärk", "Hassel", "Skogs"], ["gatan", "vägen", "stigen"]];
    const street = `${pick(stems, rng)}${pick(ends, rng)} ${int(rng, 1, 90)}`;
    return plain(street, "", `${pc} ${c}`, c, "", pc);
  },
  pl: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? `${digits(rng, 2)}-${digits(rng, 3)}`;
    const street = `ul. ${pick(["Lipowa", "Klonowa", "Brzozowa", "Jaśminowa", "Słoneczna", "Kasztanowa", "Wiśniowa", "Akacjowa"], rng)} ${int(rng, 1, 80)}${rng() < 0.6 ? ` m. ${int(rng, 1, 60)}` : ""}`;
    return plain(street, "", `${pc} ${city}`, city, "", pc);
  },
  ru: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 6);
    const street = `ul. ${pick(["Lipovaya", "Beryozovaya", "Sadovaya", "Solnechnaya", "Klenovaya", "Vishnyovaya", "Ryabinovaya", "Sosnovaya"], rng)}, d. ${int(rng, 1, 90)}, kv. ${int(rng, 1, 220)}`;
    return plain(street, "", `${city}, ${pc}`, city, "", pc);
  },
  gr: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? `${digits(rng, 3)} ${digits(rng, 2)}`;
    const street = `${pick(["Amygdalias", "Elias", "Kyparission", "Platanon", "Dafnis", "Mirtias", "Iasmou", "Kastanias"], rng)} ${int(rng, 1, 120)}`;
    return plain(street, "", `${pc} ${city}`, city, "", pc);
  },
  il: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 7);
    const street = `${pick(["HaRimon", "HaTe'ena", "HaZayit", "HaShaked", "HaDekel", "HaErez", "HaOren", "HaGefen"], rng)} St ${int(rng, 1, 90)}${rng() < 0.5 ? `, Apt ${int(rng, 1, 40)}` : ""}`;
    return plain(street, "", `${city} ${pc}`, city, "", pc);
  },
  arab: ({ rng, city, rule }) => {
    const [c, country] = city.split(", ");
    const pc = rule?.post(rng) ?? "";
    const street = `${rng() < 0.4 ? `Villa ${int(rng, 1, 80)}` : `Building ${int(rng, 1, 240)}, Apt ${int(rng, 1, 60)}`}, ${pick(["Al Yasmin", "Al Nakheel", "Al Zaitoun", "Al Ward", "Al Rayhan", "Al Sidr", "Al Manara", "Al Bustan"], rng)} Street`;
    return plain(street, "", `${c}${pc ? ` ${pc}` : ""}, ${country}`, c, "", pc);
  },
  in: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 6);
    const street = `Flat ${int(rng, 1, 12)}0${int(rng, 1, 8)}, ${pick(["Gulmohar", "Neelkamal", "Shanti", "Sundar", "Kamal", "Anand", "Saraswati", "Ashirwad"], rng)} ${pick(["Apartments", "Residency", "Heights", "Towers"], rng)}`;
    const line2 = `${int(rng, 1, 18)}th Cross, ${pick(["Gulmohar", "Shanti", "Anand", "Kamla", "Saket", "Vasant"], rng)} ${pick(["Nagar", "Colony", "Enclave", "Vihar"], rng)}`.replace(/^1th|^2th|^3th/, (m) => ({ "1th": "1st", "2th": "2nd", "3th": "3rd" })[m] ?? m);
    return plain(street, line2, `${city}, ${rule?.region ?? ""} ${pc}`, city, rule?.region ?? "", pc);
  },
  cn: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 6);
    const street = `Room ${int(rng, 2, 28)}0${int(rng, 1, 6)}, No. ${int(rng, 1, 399)} ${pick(["Yinghua", "Wutong", "Xiangzhang", "Qingshan", "Liuyin", "Hehua", "Songlin", "Guihua"], rng)} Road`;
    const line2 = `${pick(["Xincheng", "Dongfeng", "Huaxi", "Jinyuan", "Hexie", "Mingzhu"], rng)} Subdistrict`;
    return plain(street, line2, `${city} ${pc}, China`, city, "", pc);
  },
  jp: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? `${digits(rng, 3)}-${digits(rng, 4)}`;
    const street = `${int(rng, 1, 5)}-${int(rng, 1, 24)}-${int(rng, 1, 18)} ${pick(["Midorigaoka", "Sakuradai", "Kitayama", "Hoshigaoka", "Aobadai", "Matsugaoka", "Kaedeno", "Hinodecho"], rng)}`;
    const line2 = rng() < 0.4 ? `${pick(["Sakura", "Green", "Sunny", "Maple"], rng)} Heights ${int(rng, 1, 6)}0${int(rng, 1, 9)}` : "";
    return plain(street, line2, `${city} ${pc}`, city, "", pc);
  },
  kr: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 5);
    const street = `${int(rng, 1, 120)}, ${pick(["Haneul", "Narae", "Gaon", "Bitgaram", "Saemmul", "Dasom", "Areum", "Hangyeol"], rng)}-ro ${int(rng, 1, 60)}beon-gil`;
    const line2 = `${pick(["Seo-gu", "Dong-gu", "Nam-gu", "Buk-gu", "Jung-gu"], rng)}`;
    return plain(street, line2, `${city} ${pc}`, city, "", pc);
  },
  vn: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 6);
    const street = `${int(rng, 1, 260)} ${pick(["Hoa Sen", "Hoa Lan", "Cay Me", "Song Xanh", "Binh Minh", "An Phu", "Hong Ha", "Thanh Long"], rng)} Street`;
    const line2 = `${pick(["An Binh", "Phu My", "Tan Lap", "Hoa Thanh", "Minh Khai", "Thanh Xuan"], rng)} Ward`;
    return plain(street, line2, `${city} ${pc}`, city, "", pc);
  },
  ph: ({ rng, city, rule }) => {
    const pc = rule?.post(rng) ?? digits(rng, 4);
    const street = `${int(rng, 1, 380)} ${pick(["Sampaguita", "Narra", "Kalachuchi", "Ilang-Ilang", "Molave", "Dama de Noche", "Acacia", "Camia"], rng)} St.`;
    const line2 = `Brgy. ${pick(["San Isidro", "San Roque", "Santo Niño", "Bagong Silang", "Malinis", "Maligaya"], rng)}`;
    return plain(street, line2, `${city} ${pc}`, city, "", pc);
  },
};

/** The country id a profile was drawn from ("us", "jp", ...). */
export const profileCountry = (p: FakeProfile) => p.id.split("-")[0];

/** A fictional, correctly formatted address in the profile's own city. */
export function fakeAddress(p: FakeProfile, rng: Rng): FakeAddress {
  const nat = NATIONALITIES.find((n) => n.id === profileCountry(p)) ?? NATIONALITIES[0];
  const rawCity = nat.cities.find((c) => p.city.startsWith(c)) ?? nat.cities[0];
  const cityKey = rawCity.split(", ")[0];
  const country = nat.id === "nordic" || nat.id === "arab" ? rawCity.split(", ")[1] : nat.country;
  const rule = RULES[nat.id]?.[cityKey];
  const a = FORMATS[nat.id]({ rng, city: rawCity, rule, country });
  const lines = nat.id === "arab" || nat.id === "cn" ? a.lines : [...a.lines, country];
  return { street: a.street, line2: a.line2, city: a.city, region: a.region, postcode: a.postcode, country, lines };
}

/** Countries with an address format, in the order the page lists them. */
export const ADDRESS_COUNTRIES = NATIONALITIES.filter((n) => FORMATS[n.id]).map((n) => ({ id: n.id, label: n.id === "nordic" ? "Sweden, Norway, Denmark" : n.country, flag: n.flag }));

const SIGNS: [number, number, string][] = [
  [1, 20, "Capricorn"], [2, 19, "Aquarius"], [3, 21, "Pisces"], [4, 20, "Aries"], [5, 21, "Taurus"], [6, 21, "Gemini"],
  [7, 23, "Cancer"], [8, 23, "Leo"], [9, 23, "Virgo"], [10, 23, "Libra"], [11, 22, "Scorpio"], [12, 22, "Sagittarius"], [12, 32, "Capricorn"],
];
/** Western star sign for a YYYY-MM-DD birthday. */
export function starSign(birthday: string): string {
  const [, m, d] = birthday.split("-").map(Number);
  return SIGNS.find(([sm, sd]) => m < sm || (m === sm && d < sd))?.[2] ?? "Capricorn";
}
/** Generation label from birth year (Pew Research boundaries). */
export function generation(birthday: string): string {
  const y = Number(birthday.slice(0, 4));
  if (y >= 2013) return "Gen Alpha";
  if (y >= 1997) return "Gen Z";
  if (y >= 1981) return "Millennial";
  if (y >= 1965) return "Gen X";
  if (y >= 1946) return "Baby Boomer";
  return "Silent Generation";
}

const BLOOD: [string, number][] = [["O+", 37], ["A+", 34], ["B+", 10], ["O-", 6], ["A-", 6], ["AB+", 4], ["B-", 2], ["AB-", 1]];
const EYES_LIGHT = ["Brown", "Blue", "Green", "Hazel", "Gray", "Amber"];
const HAIR_LIGHT = ["Brown", "Dark brown", "Black", "Blonde", "Auburn", "Red", "Light brown"];
const DARK_FEATURES = new Set(["mx", "br", "in", "cn", "jp", "kr", "vn", "ph", "arab", "il", "gr", "it", "es"]);
const COLORS = ["Navy blue", "Forest green", "Burgundy", "Teal", "Mustard yellow", "Lavender", "Coral", "Charcoal", "Sky blue", "Olive", "Plum", "Terracotta"];
const TRAITS = ["curious", "patient", "witty", "organized", "easygoing", "ambitious", "loyal", "thoughtful", "outgoing", "practical", "creative", "calm", "stubborn", "generous", "competitive", "cautious", "optimistic", "reserved"];
const HOBBIES = ["trail running", "baking sourdough", "birdwatching", "rock climbing", "playing chess", "gardening", "film photography", "board games", "cycling", "learning languages", "knitting", "pottery", "fishing", "salsa dancing", "playing guitar", "hiking", "reading mysteries", "video games", "yoga", "cooking spicy food"];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Body, birth-derived and personality details for a profile. */
export function fakeDetails(p: FakeProfile, rng: Rng): FakeDetails {
  const country = profileCountry(p);
  const tall = ["nl", "nordic", "de"].includes(country) ? 4 : ["in", "vn", "ph", "jp", "mx"].includes(country) ? -6 : 0;
  // Sum of three uniforms ≈ normal; women ~163 cm, men ~176 cm before country shift.
  const spread = (rng() + rng() + rng() - 1.5) * 10;
  const heightCm = Math.round((p.gender === "female" ? 163 : 176) + tall + spread);
  const bmi = 19 + rng() * 9;
  const weightKg = Math.round(bmi * (heightCm / 100) ** 2);
  const inches = Math.round(heightCm / 2.54);
  let roll = rng() * 100;
  const bloodType = BLOOD.find(([, w]) => (roll -= w) < 0)?.[0] ?? "O+";
  const dark = DARK_FEATURES.has(country);
  const t1 = pick(TRAITS, rng);
  const t2 = pick(TRAITS.filter((t) => t !== t1), rng);
  return {
    heightCm,
    height: `${heightCm} cm (${Math.floor(inches / 12)}′${inches % 12}″)`,
    weightKg,
    weight: `${weightKg} kg (${Math.round(weightKg * 2.2046)} lb)`,
    bloodType,
    eyeColor: dark && rng() < 0.85 ? "Brown" : pick(EYES_LIGHT, rng),
    hairColor: p.age >= 60 && rng() < 0.6 ? pick(["Gray", "Silver", "White"], rng) : dark && rng() < 0.85 ? pick(["Black", "Dark brown"], rng) : pick(HAIR_LIGHT, rng),
    starSign: starSign(p.birthday),
    generation: generation(p.birthday),
    favoriteColor: pick(COLORS, rng),
    personality: `${cap(t1)} and ${t2}`,
    hobby: cap(pick(HOBBIES, rng)),
  };
}

/** Stable per-profile rng, so toggling address or details never reshuffles names. */
export function extrasRng(p: FakeProfile, seed: number, salt: number): Rng {
  let h = (seed ^ salt) >>> 0;
  for (let i = 0; i < p.id.length; i++) h = Math.imul(h ^ p.id.charCodeAt(i), 16777619) >>> 0;
  return createRng(h);
}

export interface FakeRecord {
  profile: FakeProfile;
  address?: FakeAddress;
  details?: FakeDetails;
}

export function withExtras(rows: FakeProfile[], seed: number, opts: { address: boolean; details: boolean }): FakeRecord[] {
  return rows.map((profile) => ({
    profile,
    address: opts.address ? fakeAddress(profile, extrasRng(profile, seed, 0xadd2)) : undefined,
    details: opts.details ? fakeDetails(profile, extrasRng(profile, seed, 0xde7a)) : undefined,
  }));
}

/** Flat key/value view of a record, used for CSV and JSON export. */
export function flatRecord(r: FakeRecord, full: boolean): Record<string, string | number | null> {
  const p = r.profile;
  const out: Record<string, string | number | null> = full
    ? { name: p.name, given: p.given, family: p.family, gender: p.gender, nationality: p.nationality, age: p.age, birthday: p.birthday, username: p.username, email: p.email, phone: p.phone, city: p.city, occupation: p.occupation }
    : { name: p.name, given: p.given, family: p.family, gender: p.gender, nationality: p.nationality };
  if (r.address) Object.assign(out, { street: r.address.street, address_line2: r.address.line2, address_city: r.address.city, region: r.address.region, postcode: r.address.postcode, country: r.address.country });
  if (r.details) {
    const d = r.details;
    Object.assign(out, { height_cm: d.heightCm, weight_kg: d.weightKg, blood_type: d.bloodType, eye_color: d.eyeColor, hair_color: d.hairColor, star_sign: d.starSign, generation: d.generation, favorite_color: d.favoriteColor, personality: d.personality, hobby: d.hobby });
  }
  return out;
}

export function recordsCsv(rows: FakeRecord[], full: boolean): string {
  if (!rows.length) return "";
  const cols = Object.keys(flatRecord(rows[0], full));
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => { const f = flatRecord(r, full); return cols.map((c) => esc(f[c])).join(","); })].join("\n") + "\n";
}
