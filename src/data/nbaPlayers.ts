// Hand-written NBA player bank for /random-nba-player-generator.
// Only well-known facts. Teams are listed by today's franchise name (Seattle
// SuperSonics stars appear under Thunder, Washington Bullets under Wizards,
// Rochester/Cincinnati Royals under Kings, Syracuse Nationals under 76ers,
// Minneapolis Lakers under Lakers, original Charlotte Hornets under Hornets).
// Years run from the first season's start year to the last season's end year;
// `to: 0` means still active in the 2025-26 season. Where an honor was not
// certain it was left out. Teams show main stops, not full career lists.

export type Position = "PG" | "SG" | "SF" | "PF" | "C";

export interface NbaPlayer {
  id: string;
  name: string;
  pos: Position;
  teams: string[];
  from: number;
  /** Final calendar year of the last season, or 0 if still active. */
  to: number;
  active: boolean;
  honors: string[];
}

export const NBA_TEAMS = [
  "76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets",
  "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans",
  "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards",
] as const;

export const POSITIONS: { value: Position; label: string }[] = [
  { value: "PG", label: "Point guard" },
  { value: "SG", label: "Shooting guard" },
  { value: "SF", label: "Small forward" },
  { value: "PF", label: "Power forward" },
  { value: "C", label: "Center" },
];

export const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020] as const;

// name ; position ; teams (/) ; from ; to (0 = active) ; honors (|)
const RAW = `
George Mikan;C;Lakers;1946;1956;Hall of Fame|Minneapolis Lakers big-man star of the league's first years
Bob Cousy;PG;Celtics;1950;1963;6× champion|1957 MVP
Bill Sharman;SG;Celtics;1950;1961;4× champion|Hall of Fame
Paul Arizin;SF;Warriors;1950;1962;1956 champion|Hall of Fame
Dolph Schayes;PF;76ers;1948;1964;1955 champion|12× All-Star
Neil Johnston;C;Warriors;1951;1959;3× scoring champion
Vern Mikkelsen;PF;Lakers;1950;1959;4× champion
Slater Martin;PG;Lakers/Hawks;1949;1960;5× champion
Bob Pettit;PF;Hawks;1954;1965;2× MVP|1958 champion
Frank Ramsey;SG;Celtics;1954;1964;7× champion
Tom Heinsohn;PF;Celtics;1956;1965;8× champion
Sam Jones;SG;Celtics;1957;1969;10× champion
K.C. Jones;PG;Celtics;1958;1967;8× champion
Clyde Lovellette;C;Lakers/Hawks/Celtics;1953;1964;Champion with three different teams
Bill Russell;C;Celtics;1956;1969;11× champion|5× MVP
Wilt Chamberlain;C;Warriors/76ers/Lakers;1959;1973;4× MVP|Scored 100 points in a game
Elgin Baylor;SF;Lakers;1958;1971;11× All-Star|Hall of Fame
Jerry West;SG;Lakers;1960;1974;1972 champion|1969 Finals MVP
Oscar Robertson;PG;Kings/Bucks;1960;1974;1964 MVP|1971 champion
Walt Bellamy;C;Wizards/Knicks/Pistons;1961;1975;1962 Rookie of the Year|Hall of Fame
Hal Greer;SG;76ers;1958;1973;1967 champion|10× All-Star
Lenny Wilkens;PG;Hawks/Thunder/Cavaliers;1960;1975;Hall of Fame as player and coach
John Havlicek;SF;Celtics;1962;1978;8× champion|Hall of Fame
Nate Thurmond;C;Warriors/Bulls/Cavaliers;1963;1977;7× All-Star|Hall of Fame
Jerry Lucas;PF;Kings/Warriors/Knicks;1963;1974;1964 Rookie of the Year|1973 champion
Willis Reed;C;Knicks;1964;1974;1970 MVP|2× champion
Rick Barry;SF;Warriors/Rockets;1965;1980;1975 champion and Finals MVP
Billy Cunningham;SF;76ers;1965;1976;1967 champion|Hall of Fame
Gail Goodrich;SG;Lakers;1965;1979;1972 champion|Hall of Fame
Chet Walker;SF;76ers/Bulls;1962;1975;1967 champion|Hall of Fame
Dave Bing;PG;Pistons;1966;1978;1967 Rookie of the Year|Hall of Fame
Dave DeBusschere;PF;Pistons/Knicks;1962;1974;2× champion|Hall of Fame
Bill Bradley;SF;Knicks;1967;1977;2× champion|Hall of Fame
Walt Frazier;PG;Knicks;1967;1980;2× champion|Hall of Fame
Earl Monroe;SG;Wizards/Knicks;1967;1980;1973 champion|Hall of Fame
Elvin Hayes;PF;Rockets/Wizards;1968;1984;1978 champion|Hall of Fame
Wes Unseld;C;Wizards;1968;1981;1969 MVP and Rookie of the Year|1978 champion and Finals MVP
Pete Maravich;SG;Hawks/Jazz/Celtics;1970;1980;1977 scoring champion|Hall of Fame
Kareem Abdul-Jabbar;C;Bucks/Lakers;1969;1989;6× MVP|6× champion
Jerry Sloan;SG;Bulls;1965;1976;Hall of Fame as a coach|Bulls guard of the early 1970s
Calvin Murphy;PG;Rockets;1970;1983;Hall of Fame|Famous free-throw shooter
Rudy Tomjanovich;PF;Rockets;1970;1981;Later coached Rockets to 1994 and 1995 titles
Bob Lanier;C;Pistons/Bucks;1970;1984;8× All-Star|Hall of Fame
Nate Archibald;PG;Kings/Celtics;1970;1984;1973 scoring and assists leader|1981 champion
Dave Cowens;C;Celtics;1970;1983;1973 MVP|2× champion
Jo Jo White;PG;Celtics;1969;1981;2× champion|1976 Finals MVP
Paul Silas;PF;Celtics/Suns/Thunder;1964;1980;3× champion
Bob Dandridge;SF;Bucks/Wizards;1969;1982;2× champion
Jamaal Wilkes;SF;Warriors/Lakers;1974;1985;4× champion|Hall of Fame
Julius Erving;SF;Nets/76ers;1971;1987;1981 MVP|1983 champion
Bob McAdoo;C;Clippers/Knicks/Lakers;1972;1986;1975 MVP|2× champion
Dan Issel;C;Nuggets;1970;1985;Hall of Fame|Nuggets scoring leader of the 1970s
George Gervin;SG;Spurs;1972;1986;4× scoring champion|Hall of Fame
Bill Walton;C;Trail Blazers/Celtics;1974;1988;1978 MVP|2× champion
Moses Malone;C;Rockets/76ers;1974;1995;3× MVP|1983 champion and Finals MVP
Artis Gilmore;C;Bulls/Spurs;1976;1988;Hall of Fame|Rebounding and shot-blocking centre
Adrian Dantley;SF;Jazz/Pistons;1976;1991;2× scoring champion|Hall of Fame
Alex English;SF;Nuggets;1976;1991;Led the NBA in points scored in the 1980s|Hall of Fame
Robert Parish;C;Celtics;1976;1997;4× champion|Played a record 1,611 games
Dennis Johnson;SG;Thunder/Suns/Celtics;1976;1990;3× champion|1979 Finals MVP
Jack Sikma;C;Thunder;1977;1991;1979 champion|7× All-Star
Bernard King;SF;Knicks;1977;1993;1985 scoring champion|Hall of Fame
Maurice Cheeks;PG;76ers;1978;1993;1983 champion|Hall of Fame
Bobby Jones;PF;76ers;1974;1986;First Sixth Man of the Year (1983)|1983 champion
Sidney Moncrief;SG;Bucks;1979;1991;2× Defensive Player of the Year
Michael Cooper;SG;Lakers;1978;1990;5× champion|1987 Defensive Player of the Year
Magic Johnson;PG;Lakers;1979;1996;3× MVP|5× champion
Larry Bird;SF;Celtics;1979;1992;3× MVP|3× champion
Kevin McHale;PF;Celtics;1980;1993;3× champion|2× Sixth Man of the Year
Isiah Thomas;PG;Pistons;1981;1994;2× champion|1990 Finals MVP
Bill Laimbeer;C;Pistons;1980;1993;2× champion
Mark Aguirre;SF;Mavericks/Pistons;1981;1994;2× champion with Detroit
Mark Eaton;C;Jazz;1982;1993;2× Defensive Player of the Year
Dominique Wilkins;SF;Hawks;1982;1999;1986 scoring champion|Hall of Fame
James Worthy;SF;Lakers;1982;1994;3× champion|1988 Finals MVP
Byron Scott;SG;Lakers;1983;1997;3× champion
A.C. Green;PF;Lakers;1985;2001;3× champion|Played 1,192 straight games
Ralph Sampson;C;Rockets;1983;1992;1984 Rookie of the Year
Larry Nance;PF;Suns/Cavaliers;1981;1994;Won the first Slam Dunk Contest (1984)
Buck Williams;PF;Nets/Trail Blazers;1981;1998;1982 Rookie of the Year
Clyde Drexler;SG;Trail Blazers/Rockets;1983;1998;1995 champion|Hall of Fame
Hakeem Olajuwon;C;Rockets/Raptors;1984;2002;1994 MVP|2× champion
Michael Jordan;SG;Bulls/Wizards;1984;2003;6× champion|5× MVP
Charles Barkley;PF;76ers/Suns/Rockets;1984;2000;1993 MVP|Hall of Fame
John Stockton;PG;Jazz;1984;2003;All-time leader in assists and steals|Hall of Fame
Karl Malone;PF;Jazz/Lakers;1985;2004;2× MVP|Hall of Fame
Patrick Ewing;C;Knicks;1985;2002;11× All-Star|Hall of Fame
Chris Mullin;SF;Warriors/Pacers;1985;2001;Dream Team member|Hall of Fame
Spud Webb;PG;Hawks/Kings;1985;1998;1986 Slam Dunk Contest champion
Detlef Schrempf;SF;Pacers/Thunder;1985;2001;2× Sixth Man of the Year
Dennis Rodman;PF;Pistons/Spurs/Bulls;1986;2000;5× champion|7× rebounding champion
Brad Daugherty;C;Cavaliers;1986;1994;5× All-Star
Mark Price;PG;Cavaliers;1986;1998;4× All-Star
Reggie Miller;SG;Pacers;1987;2005;Hall of Fame|Spent his whole career with the Pacers
Scottie Pippen;SF;Bulls/Rockets/Trail Blazers;1987;2004;6× champion|Hall of Fame
Horace Grant;PF;Bulls/Magic/Lakers;1987;2004;4× champion
Muggsy Bogues;PG;Hornets;1987;2001;Shortest player in NBA history (5 ft 3)
Kevin Johnson;PG;Suns;1987;2000;Led the Suns to the 1993 Finals
Mark Jackson;PG;Knicks/Pacers;1987;2004;1988 Rookie of the Year
Ron Harper;SG;Bulls/Lakers;1986;2001;5× champion
Steve Kerr;PG;Bulls/Spurs;1988;2003;5× champion
Kenny Smith;PG;Rockets;1987;1997;2× champion
Mitch Richmond;SG;Kings;1988;2002;1989 Rookie of the Year|Hall of Fame
Tim Hardaway;PG;Warriors/Heat;1989;2003;5× All-Star
David Robinson;C;Spurs;1989;2003;1995 MVP|2× champion
Shawn Kemp;PF;Thunder;1989;2003;6× All-Star
Glen Rice;SF;Hornets/Heat/Lakers;1989;2004;2000 champion|1997 All-Star Game MVP
Toni Kukoc;SF;Bulls;1990;2006;3× champion|1996 Sixth Man of the Year
Sam Cassell;PG;Rockets/Celtics;1993;2008;3× champion
Robert Horry;PF;Rockets/Lakers/Spurs;1992;2008;7× champion
Gary Payton;PG;Thunder/Bucks/Lakers/Heat;1990;2007;1996 Defensive Player of the Year|2006 champion
Larry Johnson;PF;Hornets/Knicks;1991;2001;1992 Rookie of the Year
Dikembe Mutombo;C;Nuggets/Hawks/Rockets;1991;2009;4× Defensive Player of the Year
Alonzo Mourning;C;Hornets/Heat;1992;2008;2× Defensive Player of the Year|2006 champion
Shaquille O'Neal;C;Magic/Lakers/Heat;1992;2011;4× champion|2000 MVP
Penny Hardaway;PG;Magic;1993;2007;Led the Magic to the 1995 Finals
Chris Webber;PF;Kings/Warriors;1993;2008;1994 Rookie of the Year
Grant Hill;SF;Pistons/Magic/Suns;1994;2013;1995 co-Rookie of the Year|7× All-Star
Jason Kidd;PG;Nets/Mavericks/Suns;1994;2013;2011 champion|1995 co-Rookie of the Year
Kevin Garnett;PF;Timberwolves/Celtics;1995;2016;2004 MVP|2008 champion
Arvydas Sabonis;C;Trail Blazers;1995;2003;Hall of Fame|Lithuanian legend
Antoine Walker;PF;Celtics;1996;2008;2006 champion
Kobe Bryant;SG;Lakers;1996;2016;5× champion|2008 MVP
Allen Iverson;SG;76ers;1996;2010;2001 MVP|4× scoring champion
Steve Nash;PG;Suns/Mavericks;1996;2015;2× MVP|Hall of Fame
Ray Allen;SG;Bucks/Thunder/Celtics/Heat;1996;2014;2× champion|Hall of Fame
Ben Wallace;C;Pistons;1996;2012;4× Defensive Player of the Year|2004 champion
Peja Stojakovic;SF;Kings;1996;2011;2011 champion|2× Three-Point Contest winner
Tim Duncan;PF;Spurs;1997;2016;5× champion|2× MVP
Chauncey Billups;PG;Pistons/Nuggets;1997;2014;2004 champion and Finals MVP
Tracy McGrady;SG;Magic/Rockets/Raptors;1997;2013;2× scoring champion
Vince Carter;SG;Raptors/Nets/Magic;1998;2020;Played a record 22 seasons|1999 Rookie of the Year
Dirk Nowitzki;PF;Mavericks;1998;2019;2007 MVP|2011 champion and Finals MVP
Paul Pierce;SF;Celtics/Nets;1998;2017;2008 champion and Finals MVP|Hall of Fame
Jalen Rose;SF;Pacers/Bulls;1994;2007;2000 Most Improved Player
Elton Brand;PF;Bulls/Clippers;1999;2016;2000 co-Rookie of the Year
Shawn Marion;SF;Suns/Mavericks;1999;2015;2011 champion
Jason Terry;SG;Hawks/Mavericks;1999;2018;2011 champion|2009 Sixth Man of the Year
Metta World Peace;SF;Pacers/Lakers;1999;2017;2004 Defensive Player of the Year|2010 champion
Steve Francis;PG;Rockets;1999;2008;2000 co-Rookie of the Year
Derek Fisher;PG;Lakers;1996;2014;5× champion
Lamar Odom;PF;Clippers/Lakers;1999;2013;2× champion|2011 Sixth Man of the Year
Rasheed Wallace;PF;Trail Blazers/Pistons;1995;2013;2004 champion
Joe Johnson;SG;Hawks/Nets;2001;2018;7× All-Star
Pau Gasol;PF;Grizzlies/Lakers;2001;2019;2× champion|2002 Rookie of the Year
Tony Parker;PG;Spurs;2001;2019;4× champion|2007 Finals MVP
Tyson Chandler;C;Mavericks/Knicks;2001;2020;2011 champion|2012 Defensive Player of the Year
Mike Miller;SF;Magic/Heat;2000;2017;2× champion|2001 Rookie of the Year
Richard Hamilton;SG;Pistons;1999;2013;2004 champion
Jamal Crawford;SG;Clippers/Bulls;2000;2020;3× Sixth Man of the Year
Marcus Camby;C;Nuggets/Knicks;1996;2013;2007 Defensive Player of the Year
Manu Ginobili;SG;Spurs;2002;2018;4× champion
Yao Ming;C;Rockets;2002;2011;8× All-Star|Hall of Fame
Amar'e Stoudemire;PF;Suns/Knicks;2002;2016;2003 Rookie of the Year
Dwyane Wade;SG;Heat;2003;2019;3× champion|2006 Finals MVP
LeBron James;SF;Cavaliers/Heat/Lakers;2003;0;4× MVP|4× champion
Carmelo Anthony;SF;Nuggets/Knicks;2003;2022;2013 scoring champion
Chris Bosh;PF;Raptors/Heat;2003;2016;2× champion
Brandon Roy;SG;Trail Blazers;2006;2013;2007 Rookie of the Year
Dwight Howard;C;Magic/Lakers;2004;2022;3× Defensive Player of the Year|2020 champion
Andre Iguodala;SF;76ers/Warriors/Heat;2004;2023;4× champion|2015 Finals MVP
Rajon Rondo;PG;Celtics/Lakers;2006;2022;2× champion
LaMarcus Aldridge;PF;Trail Blazers/Spurs;2006;2022;7× All-Star
Joakim Noah;C;Bulls;2007;2020;2014 Defensive Player of the Year
J.R. Smith;SG;Knicks/Cavaliers;2004;2020;2016 champion|2013 Sixth Man of the Year
Serge Ibaka;PF;Thunder/Raptors;2009;2022;2019 champion
Marc Gasol;C;Grizzlies/Raptors;2008;2021;2013 Defensive Player of the Year|2019 champion
Tyreke Evans;SG;Kings;2009;2019;2010 Rookie of the Year
Derrick Rose;PG;Bulls/Knicks;2008;2024;2011 MVP (youngest ever)
Blake Griffin;PF;Clippers/Pistons;2010;2023;2011 Rookie of the Year|2011 Slam Dunk Contest champion
Kemba Walker;PG;Hornets/Celtics;2011;2023;4× All-Star
Lou Williams;SG;Clippers/Hawks;2005;2022;3× Sixth Man of the Year
Kevin Love;PF;Timberwolves/Cavaliers/Heat/Jazz;2008;0;2016 champion
Chris Paul;PG;Pelicans/Clippers/Suns;2005;0;12× All-Star|2006 Rookie of the Year
Russell Westbrook;PG;Thunder/Rockets/Lakers;2008;0;2017 MVP|Triple-double record holder
James Harden;SG;Rockets/Nets/76ers/Clippers;2009;0;2018 MVP|3× scoring champion
Kevin Durant;SF;Thunder/Warriors/Nets/Suns/Rockets;2007;0;2014 MVP|2× champion and Finals MVP
Stephen Curry;PG;Warriors;2009;0;2× MVP|4× champion
Klay Thompson;SG;Warriors/Mavericks;2011;0;4× champion
Draymond Green;PF;Warriors;2012;0;4× champion|2017 Defensive Player of the Year
Kawhi Leonard;SF;Spurs/Raptors/Clippers;2011;0;2× champion and Finals MVP|2× Defensive Player of the Year
Anthony Davis;PF;Pelicans/Lakers/Mavericks;2012;0;2020 champion
Damian Lillard;PG;Trail Blazers/Bucks;2012;0;2013 Rookie of the Year|7× All-Star
Kyrie Irving;PG;Cavaliers/Celtics/Nets/Mavericks;2011;0;2016 champion|2012 Rookie of the Year
Kyle Lowry;PG;Raptors/Heat/76ers;2006;0;2019 champion
Jimmy Butler;SF;Bulls/Timberwolves/Heat/Warriors;2011;0;Led the Heat to the 2020 and 2023 Finals
Paul George;SF;Pacers/Thunder/Clippers/76ers;2010;0;2013 Most Improved Player
Jrue Holiday;PG;Pelicans/Bucks/Celtics/Trail Blazers;2009;0;Champion in 2021 and 2024
Al Horford;C;Hawks/Celtics/Warriors;2007;0;2024 champion
Jamal Murray;PG;Nuggets;2016;0;2023 champion
Aaron Gordon;PF;Magic/Nuggets;2014;0;2023 champion
Andrew Wiggins;SF;Timberwolves/Warriors/Heat;2014;0;2015 Rookie of the Year|2022 champion
Karl-Anthony Towns;C;Timberwolves/Knicks;2015;0;2016 Rookie of the Year
Kristaps Porzingis;C;Knicks/Mavericks/Celtics/Hawks;2015;0;2024 champion
Devin Booker;SG;Suns;2015;0;Scored 70 points in a game
Giannis Antetokounmpo;PF;Bucks;2013;0;2× MVP|2021 champion and Finals MVP
Nikola Jokic;C;Nuggets;2015;0;3× MVP|2023 champion and Finals MVP
Joel Embiid;C;76ers;2016;0;2023 MVP|2022 scoring champion
Jaylen Brown;SG;Celtics;2016;0;2024 champion and Finals MVP
Jayson Tatum;SF;Celtics;2017;0;2024 champion
Donovan Mitchell;SG;Jazz/Cavaliers;2017;0;2018 Slam Dunk Contest champion
Bam Adebayo;C;Heat;2017;0;2× Olympic gold medallist
Rudy Gobert;C;Jazz/Timberwolves;2013;0;4× Defensive Player of the Year
Domantas Sabonis;C;Pacers/Kings;2016;0;2023 rebounding leader
Fred VanVleet;PG;Raptors/Rockets;2016;0;2019 champion
Pascal Siakam;PF;Raptors/Pacers;2016;0;2019 champion|2019 Most Improved Player
Brook Lopez;C;Nets/Bucks/Clippers;2008;0;2021 champion
Malcolm Brogdon;SG;Bucks/Pacers/Celtics/Trail Blazers/Wizards;2016;2025;2017 Rookie of the Year|2023 Sixth Man of the Year
Zach LaVine;SG;Timberwolves/Bulls/Kings;2014;0;2015 and 2016 Slam Dunk Contest champion
Julius Randle;PF;Lakers/Knicks/Timberwolves;2014;0;2021 Most Improved Player
Lauri Markkanen;PF;Bulls/Jazz;2017;0;2023 Most Improved Player
Derrick White;SG;Celtics;2017;0;2024 champion
Marcus Smart;SG;Celtics/Lakers;2014;0;2022 Defensive Player of the Year
Naz Reid;C;Timberwolves;2019;0;2024 Sixth Man of the Year
Kentavious Caldwell-Pope;SG;Lakers/Nuggets;2013;0;Champion in 2020 and 2023
Trae Young;PG;Hawks;2018;0;Led the Hawks to the 2021 Conference Finals
Luka Doncic;PG;Mavericks/Lakers;2018;0;2019 Rookie of the Year|2024 scoring champion
Shai Gilgeous-Alexander;PG;Thunder;2018;0;2025 MVP|2025 champion and Finals MVP
Jaren Jackson Jr.;PF;Grizzlies;2018;0;2023 Defensive Player of the Year
Jalen Brunson;PG;Mavericks/Knicks;2018;0;Led the Knicks to the 2025 Conference Finals
Ja Morant;PG;Grizzlies;2019;0;2020 Rookie of the Year
Zion Williamson;PF;Pelicans;2019;0;#1 pick in 2019
Tyler Herro;SG;Heat;2019;0;2022 Sixth Man of the Year
Anthony Edwards;SG;Timberwolves;2020;0;#1 pick in 2020
LaMelo Ball;PG;Hornets;2020;0;2021 Rookie of the Year
Tyrese Haliburton;PG;Pacers;2020;0;Led the Pacers to the 2025 Finals
Cade Cunningham;PG;Pistons;2021;0;#1 pick in 2021
Scottie Barnes;SF;Raptors;2021;0;2022 Rookie of the Year
Evan Mobley;PF;Cavaliers;2021;0;#3 pick in 2021
Franz Wagner;SF;Magic;2021;0;2023 FIBA World Cup champion with Germany
Chet Holmgren;C;Thunder;2022;0;2025 champion
Jalen Williams;SF;Thunder;2022;0;2025 champion
Paolo Banchero;PF;Magic;2022;0;2023 Rookie of the Year
Victor Wembanyama;C;Spurs;2023;0;2024 Rookie of the Year|#1 pick in 2023
Stephon Castle;SG;Spurs;2024;0;2025 Rookie of the Year
Cooper Flagg;SF;Mavericks;2025;0;#1 pick in 2025
Rick Fox;SF;Celtics/Lakers;1991;2004;3× champion with the Lakers
John Salley;PF;Pistons/Bulls/Lakers;1986;2000;4× champion with three different teams
Danny Ainge;SG;Celtics/Suns;1981;1995;2× champion
Rolando Blackman;SG;Mavericks/Knicks;1981;1994;4× All-Star
Manute Bol;C;Wizards/Warriors;1985;1995;Tallest player in league history (7 ft 7 in), shared with Gheorghe Muresan
Hedo Turkoglu;SF;Kings/Magic/Raptors;2000;2015;2008 Most Improved Player
Boris Diaw;PF;Hawks/Suns/Spurs;2003;2017;2006 Most Improved Player|2014 champion
Gilbert Arenas;PG;Warriors/Wizards;2001;2012;2003 Most Improved Player
Drazen Petrovic;SG;Nets/Trail Blazers;1989;1993;Hall of Fame|Croatian guard and shooter
Andrew Bogut;C;Bucks/Warriors;2005;2019;#1 pick in 2005|2015 champion
Shaun Livingston;PG;Clippers/Warriors;2004;2019;3× champion with the Warriors
Khris Middleton;SF;Bucks/Wizards;2012;0;2021 champion
Bobby Portis;PF;Bulls/Bucks;2015;0;2021 champion
Dennis Schroder;PG;Hawks/Thunder/Lakers;2013;0;2023 FIBA World Cup MVP with Germany
Paul Westphal;PG;Suns/Celtics;1972;1984;1974 champion|Hall of Fame
Darrell Griffith;SG;Jazz;1980;1991;1981 Rookie of the Year
John Starks;SG;Knicks;1988;2002;1997 Sixth Man of the Year
Vlade Divac;C;Lakers/Kings/Hornets;1989;2005;Hall of Fame|Serbian centre
`;

const POS_SET = new Set<string>(["PG", "SG", "SF", "PF", "C"]);

export const NBA_PLAYERS: NbaPlayer[] = RAW.trim()
  .split("\n")
  .map((line) => {
    const [name, pos, teams, from, to, honors] = line.split(";");
    if (!POS_SET.has(pos)) throw new Error(`Bad position for ${name}`);
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name,
      pos: pos as Position,
      teams: teams.split("/"),
      from: Number(from),
      to: Number(to),
      active: Number(to) === 0,
      honors: honors ? honors.split("|") : [],
    };
  });
