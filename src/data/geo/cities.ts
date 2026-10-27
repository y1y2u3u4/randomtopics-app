// Real cities of the world: every national capital that also appears in the
// country list, plus larger or well-known cities for countries people ask
// about most. Each city points at a country in countries.ts, so the flag and
// continent always agree.
import { COUNTRY_BY_ISO, type Continent } from "./countries";

export interface City { id: string; name: string; iso: string; country: string; continent: Continent; flag: string; capital: boolean }

// Name | country ISO code. A country's capital is flagged automatically.
const RAW = `
Algiers DZ|Oran DZ|Luanda AO|Porto-Novo BJ|Gaborone BW|Ouagadougou BF|Yaoundé CM|Douala CM|Kinshasa CD|Lubumbashi CD|Abidjan CI|Cairo EG|Alexandria EG|Luxor EG|Addis Ababa ET|Accra GH|Kumasi GH|Nairobi KE|Mombasa KE|Antananarivo MG|Bamako ML|Marrakesh MA|Casablanca MA|Rabat MA|Fez MA|Maputo MZ|Windhoek NA|Lagos NG|Abuja NG|Kano NG|Kigali RW|Dakar SN|Mogadishu SO|Cape Town ZA|Johannesburg ZA|Durban ZA|Pretoria ZA|Khartoum SD|Dar es Salaam TZ|Dodoma TZ|Zanzibar City TZ|Tunis TN|Kampala UG|Lusaka ZM|Harare ZW|Victoria Falls ZW|Port Louis MU|Victoria SC|Tripoli LY|Djibouti DJ|Banjul GM|Freetown SL|Monrovia LR|Lomé TG|Libreville GA|Niamey NE|N'Djamena TD|Lilongwe MW|Asmara ER|Praia CV
Kabul AF|Yerevan AM|Baku AZ|Manama BH|Dhaka BD|Chittagong BD|Thimphu BT|Phnom Penh KH|Siem Reap KH|Beijing CN|Shanghai CN|Guangzhou CN|Shenzhen CN|Chengdu CN|Hong Kong CN|Xi'an CN|Hangzhou CN|Tbilisi GE|Mumbai IN|New Delhi IN|Bengaluru IN|Kolkata IN|Chennai IN|Jaipur IN|Hyderabad IN|Jakarta ID|Denpasar ID|Surabaya ID|Bandung ID|Tehran IR|Isfahan IR|Shiraz IR|Baghdad IQ|Jerusalem IL|Tel Aviv IL|Haifa IL|Tokyo JP|Osaka JP|Kyoto JP|Yokohama JP|Sapporo JP|Hiroshima JP|Amman JO|Petra JO|Astana KZ|Almaty KZ|Kuwait City KW|Beirut LB|Kuala Lumpur MY|George Town MY|Malé MV|Ulaanbaatar MN|Naypyidaw MM|Yangon MM|Kathmandu NP|Pyongyang KP|Muscat OM|Karachi PK|Lahore PK|Islamabad PK|Manila PH|Cebu City PH|Doha QA|Riyadh SA|Jeddah SA|Mecca SA|Singapore SG|Seoul KR|Busan KR|Colombo LK|Damascus SY|Bangkok TH|Chiang Mai TH|Phuket TH|Ankara TR|Istanbul TR|Izmir TR|Dubai AE|Abu Dhabi AE|Tashkent UZ|Samarkand UZ|Hanoi VN|Ho Chi Minh City VN|Da Nang VN|Sana'a YE|Vientiane LA|Bishkek KG|Dushanbe TJ|Ashgabat TM|Dili TL|Bandar Seri Begawan BN
Tirana AL|Andorra la Vella AD|Vienna AT|Salzburg AT|Minsk BY|Brussels BE|Bruges BE|Antwerp BE|Sarajevo BA|Sofia BG|Zagreb HR|Dubrovnik HR|Split HR|Nicosia CY|Prague CZ|Brno CZ|Copenhagen DK|Aarhus DK|Tallinn EE|Helsinki FI|Paris FR|Marseille FR|Lyon FR|Nice FR|Bordeaux FR|Berlin DE|Munich DE|Hamburg DE|Frankfurt DE|Cologne DE|Athens GR|Thessaloniki GR|Heraklion GR|Budapest HU|Reykjavík IS|Dublin IE|Cork IE|Galway IE|Rome IT|Milan IT|Venice IT|Florence IT|Naples IT|Turin IT|Riga LV|Vilnius LT|Luxembourg City LU|Valletta MT|Chișinău MD|Monaco MC|Podgorica ME|Amsterdam NL|Rotterdam NL|Utrecht NL|Skopje MK|Oslo NO|Bergen NO|Tromsø NO|Warsaw PL|Kraków PL|Gdańsk PL|Lisbon PT|Porto PT|Bucharest RO|Cluj-Napoca RO|Moscow RU|Saint Petersburg RU|Kazan RU|Belgrade RS|Novi Sad RS|Bratislava SK|Ljubljana SI|Madrid ES|Barcelona ES|Valencia ES|Seville ES|Bilbao ES|Granada ES|Stockholm SE|Gothenburg SE|Bern CH|Zurich CH|Geneva CH|Kyiv UA|Lviv UA|Odesa UA|London GB|Manchester GB|Edinburgh GB|Glasgow GB|Liverpool GB|Cardiff GB|Belfast GB|Vatican City VA|San Marino SM|Vaduz LI
Toronto CA|Vancouver CA|Montreal CA|Ottawa CA|Calgary CA|Quebec City CA|San José CR|Havana CU|Santo Domingo DO|San Salvador SV|Guatemala City GT|Antigua Guatemala GT|Port-au-Prince HT|Tegucigalpa HN|Kingston JM|Mexico City MX|Guadalajara MX|Monterrey MX|Cancún MX|Oaxaca MX|Managua NI|Panama City PA|Nassau BS|Port of Spain TT|Bridgetown BB|Belmopan BZ|New York City US|Los Angeles US|Chicago US|Houston US|Miami US|San Francisco US|Seattle US|Boston US|Washington, D.C. US|Las Vegas US|New Orleans US|Honolulu US|Anchorage US|Austin US|Denver US
Buenos Aires AR|Córdoba AR|Mendoza AR|La Paz BO|Sucre BO|Santa Cruz de la Sierra BO|São Paulo BR|Rio de Janeiro BR|Brasília BR|Salvador BR|Manaus BR|Santiago CL|Valparaíso CL|Bogotá CO|Medellín CO|Cartagena CO|Quito EC|Guayaquil EC|Georgetown GY|Asunción PY|Lima PE|Cusco PE|Arequipa PE|Paramaribo SR|Montevideo UY|Caracas VE|Maracaibo VE
Sydney AU|Melbourne AU|Brisbane AU|Perth AU|Adelaide AU|Canberra AU|Hobart AU|Darwin AU|Auckland NZ|Wellington NZ|Christchurch NZ|Queenstown NZ|Suva FJ|Port Moresby PG|Apia WS|Nuku'alofa TO|Port Vila VU|Honiara SB|South Tarawa KI|Majuro MH|Palikir FM|Funafuti TV|Yaren NR|Ngerulmud PW
`;

export const CITIES: City[] = RAW.split(/[|\n]/).map((s) => s.trim()).filter(Boolean).map((entry) => {
  const iso = entry.slice(-2);
  const raw = entry.slice(0, -2).trim();
  const country = COUNTRY_BY_ISO.get(iso);
  if (!country) throw new Error(`Unknown country code in city list: ${entry}`);
  const name = raw;
  return { id: `${iso}-${name}`, name, iso, country: country.name, continent: country.continent, flag: country.flag, capital: country.capital === name };
});
