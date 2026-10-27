// The 195 countries people mean by "every country in the world": 193 United
// Nations member states plus the two UN observer states (Vatican City and
// Palestine). Flags are built from the ISO 3166-1 code, so there is no image
// to load. Population bands are rounded 2024 estimates, not exact counts.

export type Continent = "Africa" | "Asia" | "Europe" | "North America" | "South America" | "Oceania";
/** 1 = under 1 million, 2 = 1–10 million, 3 = 10–50 million, 4 = 50–100 million, 5 = over 100 million. */
export type PopBand = 1 | 2 | 3 | 4 | 5;

export interface Country { iso: string; name: string; capital: string; continent: Continent; band: PopBand; flag: string }

export const POP_BANDS: { id: PopBand; label: string }[] = [
  { id: 1, label: "Under 1 million" },
  { id: 2, label: "1–10 million" },
  { id: 3, label: "10–50 million" },
  { id: 4, label: "50–100 million" },
  { id: 5, label: "Over 100 million" },
];

export const CONTINENTS: Continent[] = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

export const flagEmoji = (iso: string) => String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

const AF = "Africa", AS = "Asia", EU = "Europe", NA = "North America", SA = "South America", OC = "Oceania";

// ISO | name | capital | continent | band
const ROWS: [string, string, string, Continent, PopBand][] = [
  ["DZ", "Algeria", "Algiers", AF, 3], ["AO", "Angola", "Luanda", AF, 3], ["BJ", "Benin", "Porto-Novo", AF, 3], ["BW", "Botswana", "Gaborone", AF, 2],
  ["BF", "Burkina Faso", "Ouagadougou", AF, 3], ["BI", "Burundi", "Gitega", AF, 3], ["CV", "Cabo Verde", "Praia", AF, 1], ["CM", "Cameroon", "Yaoundé", AF, 3],
  ["CF", "Central African Republic", "Bangui", AF, 2], ["TD", "Chad", "N'Djamena", AF, 3], ["KM", "Comoros", "Moroni", AF, 1], ["CG", "Republic of the Congo", "Brazzaville", AF, 2],
  ["CD", "DR Congo", "Kinshasa", AF, 5], ["CI", "Côte d'Ivoire", "Yamoussoukro", AF, 3], ["DJ", "Djibouti", "Djibouti", AF, 2], ["EG", "Egypt", "Cairo", AF, 5],
  ["GQ", "Equatorial Guinea", "Malabo", AF, 2], ["ER", "Eritrea", "Asmara", AF, 2], ["SZ", "Eswatini", "Mbabane", AF, 2], ["ET", "Ethiopia", "Addis Ababa", AF, 5],
  ["GA", "Gabon", "Libreville", AF, 2], ["GM", "Gambia", "Banjul", AF, 2], ["GH", "Ghana", "Accra", AF, 3], ["GN", "Guinea", "Conakry", AF, 3],
  ["GW", "Guinea-Bissau", "Bissau", AF, 2], ["KE", "Kenya", "Nairobi", AF, 4], ["LS", "Lesotho", "Maseru", AF, 2], ["LR", "Liberia", "Monrovia", AF, 2],
  ["LY", "Libya", "Tripoli", AF, 2], ["MG", "Madagascar", "Antananarivo", AF, 3], ["MW", "Malawi", "Lilongwe", AF, 3], ["ML", "Mali", "Bamako", AF, 3],
  ["MR", "Mauritania", "Nouakchott", AF, 2], ["MU", "Mauritius", "Port Louis", AF, 2], ["MA", "Morocco", "Rabat", AF, 3], ["MZ", "Mozambique", "Maputo", AF, 3],
  ["NA", "Namibia", "Windhoek", AF, 2], ["NE", "Niger", "Niamey", AF, 3], ["NG", "Nigeria", "Abuja", AF, 5], ["RW", "Rwanda", "Kigali", AF, 3],
  ["ST", "São Tomé and Príncipe", "São Tomé", AF, 1], ["SN", "Senegal", "Dakar", AF, 3], ["SC", "Seychelles", "Victoria", AF, 1], ["SL", "Sierra Leone", "Freetown", AF, 2],
  ["SO", "Somalia", "Mogadishu", AF, 3], ["ZA", "South Africa", "Pretoria", AF, 4], ["SS", "South Sudan", "Juba", AF, 3], ["SD", "Sudan", "Khartoum", AF, 3],
  ["TZ", "Tanzania", "Dodoma", AF, 4], ["TG", "Togo", "Lomé", AF, 2], ["TN", "Tunisia", "Tunis", AF, 3], ["UG", "Uganda", "Kampala", AF, 3],
  ["ZM", "Zambia", "Lusaka", AF, 3], ["ZW", "Zimbabwe", "Harare", AF, 3],

  ["AF", "Afghanistan", "Kabul", AS, 3], ["AM", "Armenia", "Yerevan", AS, 2], ["AZ", "Azerbaijan", "Baku", AS, 3], ["BH", "Bahrain", "Manama", AS, 2],
  ["BD", "Bangladesh", "Dhaka", AS, 5], ["BT", "Bhutan", "Thimphu", AS, 1], ["BN", "Brunei", "Bandar Seri Begawan", AS, 1], ["KH", "Cambodia", "Phnom Penh", AS, 3],
  ["CN", "China", "Beijing", AS, 5], ["GE", "Georgia", "Tbilisi", AS, 2], ["IN", "India", "New Delhi", AS, 5], ["ID", "Indonesia", "Jakarta", AS, 5],
  ["IR", "Iran", "Tehran", AS, 4], ["IQ", "Iraq", "Baghdad", AS, 3], ["IL", "Israel", "Jerusalem", AS, 2], ["JP", "Japan", "Tokyo", AS, 5],
  ["JO", "Jordan", "Amman", AS, 3], ["KZ", "Kazakhstan", "Astana", AS, 3], ["KW", "Kuwait", "Kuwait City", AS, 2], ["KG", "Kyrgyzstan", "Bishkek", AS, 2],
  ["LA", "Laos", "Vientiane", AS, 2], ["LB", "Lebanon", "Beirut", AS, 2], ["MY", "Malaysia", "Kuala Lumpur", AS, 3], ["MV", "Maldives", "Malé", AS, 1],
  ["MN", "Mongolia", "Ulaanbaatar", AS, 2], ["MM", "Myanmar", "Naypyidaw", AS, 4], ["NP", "Nepal", "Kathmandu", AS, 3], ["KP", "North Korea", "Pyongyang", AS, 3],
  ["OM", "Oman", "Muscat", AS, 2], ["PK", "Pakistan", "Islamabad", AS, 5], ["PS", "Palestine", "Ramallah (seat of government)", AS, 2], ["PH", "Philippines", "Manila", AS, 5],
  ["QA", "Qatar", "Doha", AS, 2], ["SA", "Saudi Arabia", "Riyadh", AS, 3], ["SG", "Singapore", "Singapore", AS, 2], ["KR", "South Korea", "Seoul", AS, 4],
  ["LK", "Sri Lanka", "Sri Jayawardenepura Kotte", AS, 3], ["SY", "Syria", "Damascus", AS, 3], ["TJ", "Tajikistan", "Dushanbe", AS, 3], ["TH", "Thailand", "Bangkok", AS, 4],
  ["TL", "Timor-Leste", "Dili", AS, 2], ["TR", "Türkiye", "Ankara", AS, 4], ["TM", "Turkmenistan", "Ashgabat", AS, 2], ["AE", "United Arab Emirates", "Abu Dhabi", AS, 2],
  ["UZ", "Uzbekistan", "Tashkent", AS, 3], ["VN", "Vietnam", "Hanoi", AS, 4], ["YE", "Yemen", "Sana'a", AS, 3],

  ["AL", "Albania", "Tirana", EU, 2], ["AD", "Andorra", "Andorra la Vella", EU, 1], ["AT", "Austria", "Vienna", EU, 2], ["BY", "Belarus", "Minsk", EU, 2],
  ["BE", "Belgium", "Brussels", EU, 3], ["BA", "Bosnia and Herzegovina", "Sarajevo", EU, 2], ["BG", "Bulgaria", "Sofia", EU, 2], ["HR", "Croatia", "Zagreb", EU, 2],
  ["CY", "Cyprus", "Nicosia", EU, 2], ["CZ", "Czechia", "Prague", EU, 3], ["DK", "Denmark", "Copenhagen", EU, 2], ["EE", "Estonia", "Tallinn", EU, 2],
  ["FI", "Finland", "Helsinki", EU, 2], ["FR", "France", "Paris", EU, 4], ["DE", "Germany", "Berlin", EU, 4], ["GR", "Greece", "Athens", EU, 3],
  ["HU", "Hungary", "Budapest", EU, 2], ["IS", "Iceland", "Reykjavík", EU, 1], ["IE", "Ireland", "Dublin", EU, 2], ["IT", "Italy", "Rome", EU, 4],
  ["LV", "Latvia", "Riga", EU, 2], ["LI", "Liechtenstein", "Vaduz", EU, 1], ["LT", "Lithuania", "Vilnius", EU, 2], ["LU", "Luxembourg", "Luxembourg City", EU, 1],
  ["MT", "Malta", "Valletta", EU, 1], ["MD", "Moldova", "Chișinău", EU, 2], ["MC", "Monaco", "Monaco", EU, 1], ["ME", "Montenegro", "Podgorica", EU, 1],
  ["NL", "Netherlands", "Amsterdam", EU, 3], ["MK", "North Macedonia", "Skopje", EU, 2], ["NO", "Norway", "Oslo", EU, 2], ["PL", "Poland", "Warsaw", EU, 3],
  ["PT", "Portugal", "Lisbon", EU, 3], ["RO", "Romania", "Bucharest", EU, 3], ["RU", "Russia", "Moscow", EU, 5], ["SM", "San Marino", "San Marino", EU, 1],
  ["RS", "Serbia", "Belgrade", EU, 2], ["SK", "Slovakia", "Bratislava", EU, 2], ["SI", "Slovenia", "Ljubljana", EU, 2], ["ES", "Spain", "Madrid", EU, 3],
  ["SE", "Sweden", "Stockholm", EU, 3], ["CH", "Switzerland", "Bern", EU, 2], ["UA", "Ukraine", "Kyiv", EU, 3], ["GB", "United Kingdom", "London", EU, 4],
  ["VA", "Vatican City", "Vatican City", EU, 1],

  ["AG", "Antigua and Barbuda", "Saint John's", NA, 1], ["BS", "Bahamas", "Nassau", NA, 1], ["BB", "Barbados", "Bridgetown", NA, 1], ["BZ", "Belize", "Belmopan", NA, 1],
  ["CA", "Canada", "Ottawa", NA, 3], ["CR", "Costa Rica", "San José", NA, 2], ["CU", "Cuba", "Havana", NA, 3], ["DM", "Dominica", "Roseau", NA, 1],
  ["DO", "Dominican Republic", "Santo Domingo", NA, 3], ["SV", "El Salvador", "San Salvador", NA, 2], ["GD", "Grenada", "Saint George's", NA, 1], ["GT", "Guatemala", "Guatemala City", NA, 3],
  ["HT", "Haiti", "Port-au-Prince", NA, 3], ["HN", "Honduras", "Tegucigalpa", NA, 3], ["JM", "Jamaica", "Kingston", NA, 2], ["MX", "Mexico", "Mexico City", NA, 5],
  ["NI", "Nicaragua", "Managua", NA, 2], ["PA", "Panama", "Panama City", NA, 2], ["KN", "Saint Kitts and Nevis", "Basseterre", NA, 1], ["LC", "Saint Lucia", "Castries", NA, 1],
  ["VC", "Saint Vincent and the Grenadines", "Kingstown", NA, 1], ["TT", "Trinidad and Tobago", "Port of Spain", NA, 2], ["US", "United States", "Washington, D.C.", NA, 5],

  ["AR", "Argentina", "Buenos Aires", SA, 3], ["BO", "Bolivia", "Sucre (La Paz is the seat of government)", SA, 3], ["BR", "Brazil", "Brasília", SA, 5], ["CL", "Chile", "Santiago", SA, 3],
  ["CO", "Colombia", "Bogotá", SA, 4], ["EC", "Ecuador", "Quito", SA, 3], ["GY", "Guyana", "Georgetown", SA, 1], ["PY", "Paraguay", "Asunción", SA, 2],
  ["PE", "Peru", "Lima", SA, 3], ["SR", "Suriname", "Paramaribo", SA, 1], ["UY", "Uruguay", "Montevideo", SA, 2], ["VE", "Venezuela", "Caracas", SA, 3],

  ["AU", "Australia", "Canberra", OC, 3], ["FJ", "Fiji", "Suva", OC, 1], ["KI", "Kiribati", "South Tarawa", OC, 1], ["MH", "Marshall Islands", "Majuro", OC, 1],
  ["FM", "Micronesia", "Palikir", OC, 1], ["NR", "Nauru", "Yaren", OC, 1], ["NZ", "New Zealand", "Wellington", OC, 2], ["PW", "Palau", "Ngerulmud", OC, 1],
  ["PG", "Papua New Guinea", "Port Moresby", OC, 3], ["WS", "Samoa", "Apia", OC, 1], ["SB", "Solomon Islands", "Honiara", OC, 1], ["TO", "Tonga", "Nuku'alofa", OC, 1],
  ["TV", "Tuvalu", "Funafuti", OC, 1], ["VU", "Vanuatu", "Port Vila", OC, 1],
];

export const COUNTRIES: Country[] = ROWS.map(([iso, name, capital, continent, band]) => ({ iso, name, capital, continent, band, flag: flagEmoji(iso) }));
export const COUNTRY_BY_ISO = new Map(COUNTRIES.map((c) => [c.iso, c]));
export const COUNTRIES_A_TO_Z = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name, "en"));
