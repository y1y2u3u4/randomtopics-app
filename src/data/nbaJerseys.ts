// Jersey colours and numbers for the NBA player cards. Unofficial fan tool: no logos, no team fonts.
// Colours are the well-known primary/secondary team colours; `text` is the colour used for the
// number on the primary base (chosen for contrast). Keys use today's franchise names.

export interface TeamColors { primary: string; secondary: string; text: string }

export const TEAM_COLORS: Record<string, TeamColors> = {
  "76ers": { primary: "#006BB6", secondary: "#ED174C", text: "#FFFFFF" },
  Bucks: { primary: "#00471B", secondary: "#EEE1C6", text: "#EEE1C6" },
  Bulls: { primary: "#CE1141", secondary: "#000000", text: "#FFFFFF" },
  Cavaliers: { primary: "#860038", secondary: "#FDBB30", text: "#FDBB30" },
  Celtics: { primary: "#007A33", secondary: "#FFFFFF", text: "#FFFFFF" },
  Clippers: { primary: "#C8102E", secondary: "#1D428A", text: "#FFFFFF" },
  Grizzlies: { primary: "#12173F", secondary: "#5D76A9", text: "#FFFFFF" },
  Hawks: { primary: "#E03A3E", secondary: "#C1D32F", text: "#FFFFFF" },
  Heat: { primary: "#98002E", secondary: "#F9A01B", text: "#FFFFFF" },
  Hornets: { primary: "#1D1160", secondary: "#00788C", text: "#FFFFFF" },
  Jazz: { primary: "#002B5C", secondary: "#F9A01B", text: "#F9A01B" },
  Kings: { primary: "#5A2D81", secondary: "#63727A", text: "#FFFFFF" },
  Knicks: { primary: "#006BB6", secondary: "#F58426", text: "#FFFFFF" },
  Lakers: { primary: "#552583", secondary: "#FDB927", text: "#FDB927" },
  Magic: { primary: "#0077C0", secondary: "#C4CED4", text: "#FFFFFF" },
  Mavericks: { primary: "#00538C", secondary: "#002B5E", text: "#FFFFFF" },
  Nets: { primary: "#000000", secondary: "#FFFFFF", text: "#FFFFFF" },
  Nuggets: { primary: "#0E2240", secondary: "#FEC524", text: "#FEC524" },
  Pacers: { primary: "#002D62", secondary: "#FDBB30", text: "#FDBB30" },
  Pelicans: { primary: "#0C2340", secondary: "#C8102E", text: "#FFFFFF" },
  Pistons: { primary: "#C8102E", secondary: "#1D42BA", text: "#FFFFFF" },
  Raptors: { primary: "#CE1141", secondary: "#000000", text: "#FFFFFF" },
  Rockets: { primary: "#CE1141", secondary: "#C4CED4", text: "#FFFFFF" },
  Spurs: { primary: "#C4CED4", secondary: "#000000", text: "#000000" },
  Suns: { primary: "#1D1160", secondary: "#E56020", text: "#FFFFFF" },
  Thunder: { primary: "#007AC1", secondary: "#EF3B24", text: "#FFFFFF" },
  Timberwolves: { primary: "#0C2340", secondary: "#78BE20", text: "#FFFFFF" },
  "Trail Blazers": { primary: "#E03A3E", secondary: "#000000", text: "#FFFFFF" },
  Warriors: { primary: "#1D428A", secondary: "#FFC72C", text: "#FFC72C" },
  Wizards: { primary: "#002B5C", secondary: "#E31837", text: "#FFFFFF" },
};

// name ; number. The number the player is best known for, with the franchise listed first
// on his card. Anyone whose number is uncertain or changed between teams is left out; those
// cards show the position abbreviation instead.
const NUMBERS_RAW = `
George Mikan;99
Bob Cousy;14
Bill Sharman;21
Paul Arizin;11
Dolph Schayes;4
Vern Mikkelsen;19
Slater Martin;22
Bob Pettit;9
Frank Ramsey;23
Tom Heinsohn;15
Sam Jones;24
K.C. Jones;25
Bill Russell;6
Wilt Chamberlain;13
Elgin Baylor;22
Jerry West;44
Hal Greer;15
Lenny Wilkens;19
John Havlicek;17
Nate Thurmond;42
Willis Reed;19
Rick Barry;24
Billy Cunningham;32
Gail Goodrich;25
Dave Bing;21
Dave DeBusschere;22
Bill Bradley;24
Walt Frazier;10
Elvin Hayes;11
Wes Unseld;41
Kareem Abdul-Jabbar;33
Jerry Sloan;4
Calvin Murphy;23
Rudy Tomjanovich;45
Bob Lanier;16
Nate Archibald;7
Dave Cowens;18
Jo Jo White;10
Paul Silas;35
Bob Dandridge;10
Jamaal Wilkes;52
Dan Issel;44
George Gervin;44
Bill Walton;32
Artis Gilmore;53
Adrian Dantley;4
Alex English;2
Jack Sikma;43
Bernard King;30
Maurice Cheeks;10
Bobby Jones;24
Sidney Moncrief;4
Michael Cooper;21
Magic Johnson;32
Larry Bird;33
Kevin McHale;32
Isiah Thomas;11
Bill Laimbeer;40
Mark Aguirre;24
Mark Eaton;53
Dominique Wilkins;21
James Worthy;42
Byron Scott;4
A.C. Green;45
Ralph Sampson;50
Larry Nance;22
Buck Williams;52
Clyde Drexler;22
Hakeem Olajuwon;34
Michael Jordan;23
Charles Barkley;34
John Stockton;12
Karl Malone;32
Patrick Ewing;33
Chris Mullin;17
Spud Webb;4
Dennis Rodman;10
Brad Daugherty;43
Mark Price;25
Reggie Miller;31
Scottie Pippen;33
Horace Grant;54
Muggsy Bogues;1
Kevin Johnson;7
Mark Jackson;13
Steve Kerr;25
Mitch Richmond;2
Tim Hardaway;10
David Robinson;50
Shawn Kemp;40
Glen Rice;41
Toni Kukoc;7
Robert Horry;25
Gary Payton;20
Larry Johnson;2
Dikembe Mutombo;55
Alonzo Mourning;33
Shaquille O'Neal;32
Penny Hardaway;1
Chris Webber;4
Grant Hill;33
Jason Kidd;5
Kevin Garnett;21
Kobe Bryant;24
Allen Iverson;3
Steve Nash;13
Ray Allen;20
Ben Wallace;3
Peja Stojakovic;16
Tim Duncan;21
Chauncey Billups;3
Tracy McGrady;1
Vince Carter;15
Dirk Nowitzki;41
Paul Pierce;34
Shawn Marion;31
Jason Terry;31
Steve Francis;3
Derek Fisher;2
Rasheed Wallace;30
Joe Johnson;2
Pau Gasol;16
Tony Parker;9
Richard Hamilton;32
Jamal Crawford;11
Marcus Camby;23
Manu Ginobili;20
Yao Ming;11
Amar'e Stoudemire;1
Dwyane Wade;3
LeBron James;23
Carmelo Anthony;15
Brandon Roy;7
Dwight Howard;12
Andre Iguodala;9
Rajon Rondo;9
LaMarcus Aldridge;12
Joakim Noah;13
Serge Ibaka;9
Marc Gasol;33
Derrick Rose;1
Blake Griffin;32
Kemba Walker;15
Lou Williams;23
Chris Paul;3
Russell Westbrook;0
James Harden;13
Kevin Durant;35
Stephen Curry;30
Klay Thompson;11
Draymond Green;23
Kawhi Leonard;2
Damian Lillard;0
Kyle Lowry;7
Jamal Murray;27
Andrew Wiggins;22
Karl-Anthony Towns;32
Kristaps Porzingis;6
Devin Booker;1
Giannis Antetokounmpo;34
Nikola Jokic;15
Joel Embiid;21
Jaylen Brown;7
Jayson Tatum;0
Donovan Mitchell;45
Bam Adebayo;13
Rudy Gobert;27
Domantas Sabonis;11
Fred VanVleet;23
Pascal Siakam;43
Brook Lopez;11
Malcolm Brogdon;13
Zach LaVine;8
Julius Randle;30
Lauri Markkanen;24
Derrick White;9
Marcus Smart;36
Naz Reid;11
Kentavious Caldwell-Pope;1
Trae Young;11
Luka Doncic;77
Shai Gilgeous-Alexander;2
Jaren Jackson Jr.;13
Ja Morant;12
Zion Williamson;1
Tyler Herro;14
Anthony Edwards;5
LaMelo Ball;1
Tyrese Haliburton;0
Cade Cunningham;2
Scottie Barnes;4
Evan Mobley;4
Franz Wagner;22
Chet Holmgren;7
Jalen Williams;8
Paolo Banchero;5
Victor Wembanyama;1
Stephon Castle;5
Danny Ainge;44
Rolando Blackman;22
Manute Bol;10
Boris Diaw;33
Drazen Petrovic;3
Andrew Bogut;6
Khris Middleton;22
Dennis Schroder;17
Paul Westphal;44
Darrell Griffith;35
John Starks;3
Vlade Divac;12
`;

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** player id -> jersey number (0-99). Players not listed have no confident number. */
export const JERSEY_NUMBERS: Record<string, number> = Object.fromEntries(
  NUMBERS_RAW.trim().split("\n").map((l) => {
    const [name, n] = l.split(";");
    return [slug(name), Number(n)];
  }),
);
