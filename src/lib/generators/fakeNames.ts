import { LAST_NAMES } from "./lastNames";
import { pick } from "./core";
import { createRng, type Rng } from "@/lib/randomGenerators";

// Fake names and placeholder profiles. Given names are common real names per
// country; surnames come from the last name generator's bank. Contact details
// are safe on purpose: emails use the reserved example.com/.org/.net domains
// (RFC 2606) and phone numbers use ranges set aside for fiction (US/Canada
// 555-0100 to 0199, UK Ofcom drama range 07700 900000 to 900999). No ID
// numbers, card numbers or street addresses are ever generated.

export type FakeGender = "female" | "male";

export interface Nationality {
  id: string;
  label: string;
  flag: string;
  /** Last name bank origins used for this country. */
  origins: string[];
  female: string[];
  male: string[];
  cities: string[];
  country: string;
  phone?: "nanp" | "uk";
  /** Family name is written first in the local language. */
  familyFirst?: boolean;
  /** How surnames change for women (Slavic and Greek languages). */
  feminine?: "slavic" | "greek";
}

export const NATIONALITIES: Nationality[] = [
  { id: "us", label: "American", flag: "🇺🇸", country: "United States", origins: ["english", "irish", "scottish", "german", "italian"], phone: "nanp",
    female: ["Emma", "Olivia", "Ava", "Sophia", "Mia", "Harper", "Abigail", "Emily", "Madison", "Chloe", "Grace", "Hannah", "Lily", "Zoe", "Natalie", "Brooke"],
    male: ["Liam", "Noah", "James", "Ethan", "Mason", "Logan", "Lucas", "Jackson", "Aiden", "Caleb", "Owen", "Wyatt", "Hunter", "Tyler", "Brandon", "Austin"],
    cities: ["New York, NY", "Chicago, IL", "Austin, TX", "Denver, CO", "Seattle, WA", "Atlanta, GA", "Phoenix, AZ", "Boston, MA", "Nashville, TN", "Portland, OR"] },
  { id: "uk", label: "British", flag: "🇬🇧", country: "United Kingdom", origins: ["english", "scottish", "welsh"], phone: "uk",
    female: ["Olivia", "Amelia", "Isla", "Ava", "Freya", "Poppy", "Evie", "Florence", "Imogen", "Harriet", "Millie", "Phoebe", "Rosie", "Eleanor", "Lucy", "Jessica"],
    male: ["Oliver", "George", "Harry", "Arthur", "Jack", "Alfie", "Freddie", "Archie", "Theo", "Oscar", "Charlie", "Henry", "Joshua", "Rhys", "Callum", "Toby"],
    cities: ["London", "Manchester", "Leeds", "Bristol", "Birmingham", "Glasgow", "Edinburgh", "Cardiff", "Liverpool", "Newcastle"] },
  { id: "ie", label: "Irish", flag: "🇮🇪", country: "Ireland", origins: ["irish"],
    female: ["Aoife", "Saoirse", "Niamh", "Ciara", "Sinéad", "Orla", "Róisín", "Caoimhe", "Siobhán", "Clodagh", "Aisling", "Eimear", "Gráinne", "Méabh"],
    male: ["Conor", "Seán", "Cian", "Oisín", "Darragh", "Liam", "Eoin", "Fionn", "Cillian", "Ronan", "Padraig", "Declan", "Tadhg", "Diarmuid"],
    cities: ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kilkenny"] },
  { id: "ca", label: "Canadian", flag: "🇨🇦", country: "Canada", origins: ["english", "french", "scottish", "irish"], phone: "nanp",
    female: ["Olivia", "Charlotte", "Emma", "Chloé", "Léa", "Maya", "Avery", "Sophie", "Ella", "Camille", "Rachel", "Megan", "Hailey", "Jade"],
    male: ["Liam", "Noah", "William", "Benjamin", "Félix", "Logan", "Nathan", "Gabriel", "Samuel", "Ryan", "Matthew", "Thomas", "Owen", "Jacob"],
    cities: ["Toronto, ON", "Vancouver, BC", "Montreal, QC", "Calgary, AB", "Ottawa, ON", "Halifax, NS", "Winnipeg, MB", "Quebec City, QC"] },
  { id: "au", label: "Australian", flag: "🇦🇺", country: "Australia", origins: ["english", "irish", "scottish"],
    female: ["Charlotte", "Matilda", "Isla", "Mia", "Ruby", "Willow", "Sienna", "Chloe", "Zara", "Ivy", "Georgia", "Kayla", "Tahlia", "Jasmine"],
    male: ["Oliver", "Jack", "William", "Lachlan", "Cooper", "Hudson", "Riley", "Mitchell", "Jayden", "Bailey", "Flynn", "Darcy", "Hamish", "Kai"],
    cities: ["Sydney, NSW", "Melbourne, VIC", "Brisbane, QLD", "Perth, WA", "Adelaide, SA", "Hobart, TAS", "Gold Coast, QLD", "Canberra, ACT"] },
  { id: "mx", label: "Mexican", flag: "🇲🇽", country: "Mexico", origins: ["spanish"],
    female: ["Sofía", "Valentina", "Regina", "Ximena", "Camila", "Fernanda", "Renata", "Guadalupe", "Daniela", "Mariana", "Andrea", "Itzel", "Paola", "Lucía"],
    male: ["Santiago", "Mateo", "Diego", "Emiliano", "Leonardo", "José", "Juan Pablo", "Alejandro", "Miguel Ángel", "Luis", "Carlos", "Jorge", "Iker", "Rodrigo"],
    cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Mérida", "Oaxaca", "Querétaro", "Tijuana"] },
  { id: "es", label: "Spanish", flag: "🇪🇸", country: "Spain", origins: ["spanish"],
    female: ["Lucía", "Martina", "Paula", "Carmen", "María", "Alba", "Elena", "Noa", "Claudia", "Laura", "Irene", "Marta", "Nerea", "Ainhoa"],
    male: ["Hugo", "Martín", "Pablo", "Alejandro", "Javier", "Álvaro", "Daniel", "Sergio", "Adrián", "Mario", "Iván", "Manuel", "Jorge", "Rubén"],
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Málaga", "Zaragoza", "Granada"] },
  { id: "br", label: "Brazilian", flag: "🇧🇷", country: "Brazil", origins: ["portuguese"],
    female: ["Ana", "Beatriz", "Larissa", "Juliana", "Gabriela", "Mariana", "Fernanda", "Camila", "Letícia", "Isabela", "Bruna", "Carolina", "Yasmin", "Luana"],
    male: ["João", "Pedro", "Gabriel", "Lucas", "Matheus", "Rafael", "Gustavo", "Felipe", "Bruno", "Thiago", "Rodrigo", "Vinícius", "Caio", "Leonardo"],
    cities: ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Curitiba", "Recife", "Porto Alegre", "Fortaleza"] },
  { id: "fr", label: "French", flag: "🇫🇷", country: "France", origins: ["french"],
    female: ["Camille", "Léa", "Manon", "Chloé", "Inès", "Juliette", "Louise", "Clara", "Margaux", "Élise", "Océane", "Pauline", "Amélie", "Noémie"],
    male: ["Lucas", "Hugo", "Louis", "Gabriel", "Arthur", "Jules", "Théo", "Antoine", "Mathis", "Baptiste", "Maxime", "Nicolas", "Julien", "Clément"],
    cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux", "Lille", "Nantes", "Strasbourg"] },
  { id: "de", label: "German", flag: "🇩🇪", country: "Germany", origins: ["german"],
    female: ["Mia", "Hannah", "Lena", "Leonie", "Anna", "Lea", "Johanna", "Marie", "Sophie", "Katharina", "Julia", "Laura", "Greta", "Paula"],
    male: ["Leon", "Lukas", "Finn", "Jonas", "Paul", "Felix", "Maximilian", "Elias", "Niklas", "Tim", "Jan", "Moritz", "Tobias", "Florian"],
    cities: ["Berlin", "Munich", "Hamburg", "Cologne", "Frankfurt", "Stuttgart", "Leipzig", "Dresden"] },
  { id: "it", label: "Italian", flag: "🇮🇹", country: "Italy", origins: ["italian"],
    female: ["Giulia", "Sofia", "Aurora", "Alice", "Ginevra", "Chiara", "Francesca", "Martina", "Beatrice", "Elena", "Federica", "Alessia", "Valentina", "Sara"],
    male: ["Leonardo", "Francesco", "Alessandro", "Lorenzo", "Matteo", "Andrea", "Gabriele", "Riccardo", "Davide", "Marco", "Luca", "Giuseppe", "Tommaso", "Stefano"],
    cities: ["Rome", "Milan", "Naples", "Turin", "Florence", "Bologna", "Venice", "Palermo"] },
  { id: "nl", label: "Dutch", flag: "🇳🇱", country: "Netherlands", origins: ["dutch"],
    female: ["Emma", "Julia", "Sophie", "Tess", "Fenna", "Sanne", "Lotte", "Anouk", "Femke", "Noor", "Isa", "Lieke", "Maud", "Eva"],
    male: ["Daan", "Sem", "Lucas", "Bram", "Jesse", "Thijs", "Ruben", "Lars", "Stijn", "Joris", "Sven", "Niels", "Bas", "Pieter"],
    cities: ["Amsterdam", "Rotterdam", "Utrecht", "The Hague", "Eindhoven", "Groningen", "Leiden", "Haarlem"] },
  { id: "nordic", label: "Scandinavian", flag: "🇸🇪", country: "Sweden", origins: ["scandinavian"],
    female: ["Alice", "Maja", "Elsa", "Astrid", "Ingrid", "Saga", "Freja", "Linnea", "Sigrid", "Ebba", "Nora", "Ida", "Karin", "Tove"],
    male: ["Erik", "Lars", "Oskar", "Axel", "Nils", "Magnus", "Anders", "Henrik", "Sven", "Leif", "Emil", "Mikkel", "Johan", "Bjørn"],
    cities: ["Stockholm, Sweden", "Gothenburg, Sweden", "Malmö, Sweden", "Oslo, Norway", "Bergen, Norway", "Copenhagen, Denmark", "Aarhus, Denmark", "Uppsala, Sweden"] },
  { id: "pl", label: "Polish", flag: "🇵🇱", country: "Poland", origins: ["polish"], feminine: "slavic",
    female: ["Zuzanna", "Julia", "Maja", "Zofia", "Hanna", "Aleksandra", "Natalia", "Wiktoria", "Agnieszka", "Katarzyna", "Magdalena", "Joanna", "Małgorzata", "Karolina"],
    male: ["Jakub", "Antoni", "Jan", "Szymon", "Filip", "Kacper", "Mateusz", "Piotr", "Tomasz", "Krzysztof", "Paweł", "Michał", "Łukasz", "Wojciech"],
    cities: ["Warsaw", "Kraków", "Gdańsk", "Wrocław", "Poznań", "Łódź"] },
  { id: "ru", label: "Russian", flag: "🇷🇺", country: "Russia", origins: ["russian"], feminine: "slavic",
    female: ["Anastasia", "Maria", "Daria", "Sofia", "Anna", "Ekaterina", "Polina", "Olga", "Natalia", "Svetlana", "Irina", "Tatiana", "Yulia", "Ksenia"],
    male: ["Alexander", "Dmitry", "Maxim", "Ivan", "Mikhail", "Sergei", "Andrei", "Nikolai", "Artyom", "Pavel", "Alexei", "Vladimir", "Yuri", "Kirill"],
    cities: ["Moscow", "Saint Petersburg", "Kazan", "Novosibirsk", "Yekaterinburg", "Sochi"] },
  { id: "gr", label: "Greek", flag: "🇬🇷", country: "Greece", origins: ["greek"], feminine: "greek",
    female: ["Maria", "Eleni", "Katerina", "Sofia", "Georgia", "Dimitra", "Ioanna", "Vasiliki", "Christina", "Anastasia", "Despina", "Athina", "Zoe", "Eirini"],
    male: ["Giorgos", "Dimitris", "Nikos", "Konstantinos", "Yannis", "Christos", "Panagiotis", "Vasilis", "Kostas", "Alexandros", "Stavros", "Thanos", "Michalis", "Spyros"],
    cities: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa", "Volos"] },
  { id: "il", label: "Israeli", flag: "🇮🇱", country: "Israel", origins: ["jewish"],
    female: ["Noa", "Tamar", "Maya", "Shira", "Yael", "Avigail", "Talia", "Michal", "Rivka", "Hila", "Adi", "Liora", "Neta", "Rachel"],
    male: ["David", "Yosef", "Ariel", "Noam", "Eitan", "Daniel", "Itai", "Omer", "Avi", "Yonatan", "Amit", "Lior", "Ido", "Uri"],
    cities: ["Tel Aviv", "Jerusalem", "Haifa", "Be'er Sheva", "Netanya", "Eilat"] },
  { id: "arab", label: "Arab (Middle East)", flag: "🌙", country: "Middle East", origins: ["arabic"],
    female: ["Fatima", "Layla", "Noor", "Mariam", "Aisha", "Yasmin", "Salma", "Huda", "Rania", "Leen", "Dalia", "Amira", "Zainab", "Hana"],
    male: ["Omar", "Ahmed", "Youssef", "Khaled", "Karim", "Ali", "Hamza", "Tariq", "Samir", "Rami", "Faris", "Ibrahim", "Bilal", "Nabil"],
    cities: ["Cairo, Egypt", "Amman, Jordan", "Beirut, Lebanon", "Dubai, UAE", "Riyadh, Saudi Arabia", "Doha, Qatar", "Casablanca, Morocco", "Muscat, Oman"] },
  { id: "in", label: "Indian", flag: "🇮🇳", country: "India", origins: ["indian"],
    female: ["Aanya", "Diya", "Priya", "Ananya", "Kavya", "Isha", "Meera", "Riya", "Sneha", "Pooja", "Lakshmi", "Neha", "Divya", "Aditi"],
    male: ["Aarav", "Vivaan", "Arjun", "Rohan", "Aditya", "Rahul", "Vikram", "Karan", "Siddharth", "Ishaan", "Rajesh", "Amit", "Nikhil", "Varun"],
    cities: ["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur"] },
  { id: "cn", label: "Chinese", flag: "🇨🇳", country: "China", origins: ["chinese"], familyFirst: true,
    female: ["Mei", "Xiu Ying", "Li Na", "Yan", "Jing", "Xiaoling", "Fang", "Hui", "Ying", "Lan", "Yuxi", "Zihan", "Ruoxi", "Xinyi"],
    male: ["Wei", "Jun", "Hao", "Lei", "Ming", "Jian", "Tao", "Bo", "Yang", "Zhiwei", "Haoran", "Yichen", "Zihao", "Jiahao"],
    cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Hangzhou", "Wuhan", "Xi'an"] },
  { id: "jp", label: "Japanese", flag: "🇯🇵", country: "Japan", origins: ["japanese"], familyFirst: true,
    female: ["Yui", "Sakura", "Hina", "Aoi", "Yuna", "Mio", "Rin", "Haruka", "Akari", "Misaki", "Nanami", "Emi", "Ayaka", "Kaori"],
    male: ["Haruto", "Sota", "Yuto", "Ren", "Riku", "Kaito", "Takumi", "Daiki", "Kenta", "Hiroshi", "Shota", "Takeshi", "Yuki", "Kenji"],
    cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo", "Fukuoka", "Nagoya", "Kobe"] },
  { id: "kr", label: "Korean", flag: "🇰🇷", country: "South Korea", origins: ["korean"], familyFirst: true,
    female: ["Ji-woo", "Seo-yeon", "Min-ji", "Ha-eun", "Su-bin", "Ye-jin", "Ji-min", "Da-eun", "Yu-na", "Eun-ji", "Soo-ah", "Hye-jin", "Na-yeon", "Chae-won"],
    male: ["Min-jun", "Seo-jun", "Ji-ho", "Do-yun", "Ha-jun", "Joon-ho", "Hyun-woo", "Jae-won", "Sung-min", "Dong-hyun", "Tae-yang", "Woo-jin", "Ji-hoon", "Sang-woo"],
    cities: ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Jeju City", "Suwon"] },
  { id: "vn", label: "Vietnamese", flag: "🇻🇳", country: "Vietnam", origins: ["vietnamese"], familyFirst: true,
    female: ["Linh", "Mai", "Lan", "Trang", "Thảo", "Hương", "Ngọc", "Anh", "Phương", "Hà", "Vy", "My", "Thu", "Hạnh"],
    male: ["Minh", "Huy", "Nam", "Tuấn", "Khang", "Dũng", "Long", "Phúc", "Quân", "Bảo", "Đức", "Hải", "Sơn", "Trung"],
    cities: ["Hanoi", "Ho Chi Minh City", "Da Nang", "Hue", "Hai Phong", "Can Tho", "Nha Trang"] },
  { id: "ph", label: "Filipino", flag: "🇵🇭", country: "Philippines", origins: ["filipino"],
    female: ["Maria", "Angel", "Princess", "Kristine", "Jasmine", "Nicole", "Mary Joy", "Andrea", "Patricia", "Camille", "Bea", "Trisha", "Rica", "Joanna"],
    male: ["Juan", "Jose", "Mark", "John Paul", "Christian", "Joshua", "Miguel", "Paolo", "Rafael", "Carlo", "Jerome", "Kevin", "Angelo", "Ramon"],
    cities: ["Manila", "Quezon City", "Cebu City", "Davao City", "Makati", "Baguio", "Iloilo City"] },
];

const OCCUPATIONS = [
  "Teacher", "Nurse", "Software developer", "Graphic designer", "Accountant", "Electrician", "Chef", "Pharmacist",
  "Civil engineer", "Marketing manager", "Dentist", "Librarian", "Architect", "Photographer", "Physiotherapist",
  "Data analyst", "Journalist", "Veterinarian", "Paramedic", "Translator", "Barista", "Real estate agent",
  "Lawyer", "Mechanic", "Social worker", "UX researcher", "Carpenter", "Pilot", "Florist", "Personal trainer",
  "Biologist", "Sales representative", "Product manager", "Musician", "Police officer", "Hairdresser",
  "Bookkeeper", "Copywriter", "Plumber", "Event planner",
];
const EMAIL_DOMAINS = ["example.com", "example.org", "example.net"];
export const AGE_RANGES = [
  { id: "18-29", label: "18–29", min: 18, max: 29 },
  { id: "30-49", label: "30–49", min: 30, max: 49 },
  { id: "50-69", label: "50–69", min: 50, max: 69 },
  { id: "70-90", label: "70+", min: 70, max: 90 },
] as const;

export interface FakeNameOptions {
  /** Nationality ids; empty = any. */
  nationality: string[];
  gender: FakeGender | "any";
  age: string;
}

export interface FakeProfile {
  id: string;
  name: string;
  given: string;
  family: string;
  /** Native order for countries that write the family name first. */
  nativeOrder?: string;
  gender: FakeGender;
  nationality: string;
  flag: string;
  surnameOrigin: string;
  surnameMeaning: string;
  username: string;
  email: string;
  phone: string | null;
  birthday: string;
  age: number;
  city: string;
  occupation: string;
}

const lastByOrigin = new Map<string, typeof LAST_NAMES>();
for (const l of LAST_NAMES) lastByOrigin.set(l.origin, [...(lastByOrigin.get(l.origin) ?? []), l]);

/** Women's form of a surname in languages that inflect them. */
export function feminineSurname(name: string, kind: Nationality["feminine"]): string {
  if (kind === "slavic") {
    if (/(ski|cki|dzki)$/.test(name)) return name.slice(0, -1) + "a";
    if (/(ov|ev|ëv|in)$/.test(name)) return name + "a";
    return name;
  }
  if (kind === "greek") {
    if (/(idis|adis)$/.test(name)) return name.slice(0, -2) + "ou";
    if (/os$/.test(name)) return name.slice(0, -2) + "ou";
    if (/(is|as)$/.test(name)) return name.slice(0, -1);
    return name;
  }
  return name;
}

/** ASCII handle part: "Sinéad" → "sinead", "Ji-woo" → "jiwoo". */
export function asciiHandle(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[łŁ]/g, "l").replace(/[øØ]/g, "o").replace(/[đĐ]/g, "d")
    .toLowerCase().replace(/[^a-z0-9]/g, "");
}

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

function phoneFor(kind: Nationality["phone"], rng: Rng): string | null {
  const line = pad(Math.floor(rng() * 100));
  if (kind === "nanp") {
    const area = pick(["212", "312", "415", "512", "617", "720", "206", "404", "416", "604", "514", "403"], rng);
    return `(${area}) 555-01${line}`;
  }
  if (kind === "uk") return `07700 900${pad(Math.floor(rng() * 1000), 3)}`;
  return null;
}

/** One placeholder profile. `today` fixes the age math (for stable examples). */
export function fakeProfile(opts: FakeNameOptions, rng: Rng, today: Date): FakeProfile {
  const pool = opts.nationality.length ? NATIONALITIES.filter((n) => opts.nationality.includes(n.id)) : NATIONALITIES;
  const nat = pick(pool.length ? pool : NATIONALITIES, rng);
  const gender: FakeGender = opts.gender === "any" ? (rng() < 0.5 ? "female" : "male") : opts.gender;
  const given = pick(nat[gender], rng);
  const origin = pick(nat.origins.filter((o) => lastByOrigin.has(o)), rng);
  const last = pick(lastByOrigin.get(origin)!, rng);
  const family = gender === "female" ? feminineSurname(last.name, nat.feminine) : last.name;
  const range = AGE_RANGES.find((r) => r.id === opts.age);
  const age = range ? range.min + Math.floor(rng() * (range.max - range.min + 1)) : 18 + Math.floor(rng() * 60);
  // A birthday that makes the person exactly `age` today.
  const dayOffset = Math.floor(rng() * 365);
  const birth = new Date(Date.UTC(today.getUTCFullYear() - age - 1, today.getUTCMonth(), today.getUTCDate() + 1 + dayOffset));
  const birthday = `${birth.getUTCFullYear()}-${pad(birth.getUTCMonth() + 1)}-${pad(birth.getUTCDate())}`;
  const g = asciiHandle(given), f = asciiHandle(family);
  const n = Math.floor(rng() * 90) + 10;
  const username = pick([`${g}${f.slice(0, 1)}${n}`, `${g}_${f}`, `${f}.${g.slice(0, 1)}${n}`, `${g}${birth.getUTCFullYear() % 100}`], rng);
  const email = `${pick([`${g}.${f}`, `${g}${f}${n}`, `${g.slice(0, 1)}${f}`], rng)}@${pick(EMAIL_DOMAINS, rng)}`;
  return {
    id: `${nat.id}-${gender}-${asciiHandle(given)}-${f}-${birthday}`,
    name: `${given} ${family}`,
    given,
    family,
    nativeOrder: nat.familyFirst ? `${family} ${given}` : undefined,
    gender,
    nationality: nat.label,
    flag: nat.flag,
    surnameOrigin: origin,
    surnameMeaning: last.meaning.en,
    username,
    email,
    phone: phoneFor(nat.phone, rng),
    birthday,
    age,
    city: nat.cities.length ? `${pick(nat.cities, rng)}${nat.cities[0].includes(",") || nat.id === "arab" || nat.id === "nordic" ? "" : `, ${nat.country}`}` : nat.country,
    occupation: pick(OCCUPATIONS, rng),
  };
}

/** A batch of profiles with no duplicate full names. */
export function fakeProfiles(opts: FakeNameOptions, count: number, seed: number, today: Date): FakeProfile[] {
  const rng = createRng(seed);
  const out: FakeProfile[] = [];
  const names = new Set<string>();
  for (let tries = 0; out.length < count && tries < count * 20; tries++) {
    const p = fakeProfile(opts, rng, today);
    if (names.has(p.name)) continue;
    names.add(p.name);
    out.push(p);
  }
  return out;
}

export const FAKE_GIVEN_COUNT = NATIONALITIES.reduce((s, n) => s + n.female.length + n.male.length, 0);
export const FAKE_SURNAME_COUNT = new Set(NATIONALITIES.flatMap((n) => n.origins.flatMap((o) => (lastByOrigin.get(o) ?? []).map((l) => l.name)))).size;

export const CSV_COLUMNS: (keyof FakeProfile)[] = ["name", "given", "family", "gender", "nationality", "age", "birthday", "username", "email", "phone", "city", "occupation"];

export function toCsv(rows: FakeProfile[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [CSV_COLUMNS.join(","), ...rows.map((r) => CSV_COLUMNS.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}
