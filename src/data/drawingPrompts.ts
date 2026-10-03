export const DRAWING_CATEGORIES = ["everyday", "nature", "animals", "people", "places", "fantasy"] as const;
export type DrawingCategory = typeof DRAWING_CATEGORIES[number];
export type DrawingDifficulty = "easy" | "challenge";
export type DrawingPrompt = { id: string; category: DrawingCategory; difficulty: DrawingDifficulty; text: string; hint: string };
export const DRAWING_PROMPTS: DrawingPrompt[] = [
  {
    "id": "everyday-1",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A mug with a curved handle",
    "hint": "Start with a tall U for the cup and a wide oval at the top. Add a small loop for the handle."
  },
  {
    "id": "everyday-2",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A high-top sneaker seen from the side",
    "hint": "Start with a long rounded shape for the sole. Add a low curve over the toe and a taller curve at the heel."
  },
  {
    "id": "everyday-3",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A folded umbrella leaning against a wall",
    "hint": "Draw a long, narrow triangle leaning to one side. Add a hooked handle and a straight wall line behind it."
  },
  {
    "id": "everyday-4",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A single key with a round head",
    "hint": "Draw a circle for the head and a narrow rectangle for the shaft. Add two little teeth at the end."
  },
  {
    "id": "everyday-5",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A glass of water casting a long shadow",
    "hint": "Draw two ovals joined by straight sides for the glass. Add a water line and a pale oval shadow stretching away from the light."
  },
  {
    "id": "everyday-6",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A coat hanging over the back of a chair",
    "hint": "Draw a rectangle for the chair back. Drape a wide coat shape over it, then add a few curved lines where the cloth folds."
  },
  {
    "id": "everyday-7",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "An open drawer full of small objects",
    "hint": "Start with a wide, shallow box for the drawer. Add one clearly outlined object, then smaller circles and rectangles around it."
  },
  {
    "id": "everyday-8",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A bicycle reflected in a rain puddle",
    "hint": "Start with two circles for the wheels and a triangle between them. Repeat those shapes upside down below, with gaps for water ripples."
  },
  {
    "id": "nature-1",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A fern frond beginning to uncurl",
    "hint": "Draw a curved stem ending in a loose spiral. Add pairs of small leaves below the curl, making them smaller near the top."
  },
  {
    "id": "nature-2",
    "category": "nature",
    "difficulty": "easy",
    "text": "A smooth stone beside a jagged stone",
    "hint": "Outline one round rock and one with pointed corners. Make the lower edges a little darker."
  },
  {
    "id": "nature-3",
    "category": "nature",
    "difficulty": "easy",
    "text": "A leaf with a curved stem",
    "hint": "Start with a long oval that comes to a point. Draw a curved line down its middle, then add small side veins."
  },
  {
    "id": "nature-4",
    "category": "nature",
    "difficulty": "easy",
    "text": "A mushroom beside a broad leaf",
    "hint": "Start with a half-circle cap and a short stalk. Add a broad leaf alongside it and draw one line down the middle."
  },
  {
    "id": "nature-5",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A wave curling around a rock",
    "hint": "Draw a rounded rock and a large C-shaped wave curling around it. Leave small blank patches along the crest for foam."
  },
  {
    "id": "nature-6",
    "category": "nature",
    "difficulty": "challenge",
    "text": "Tree roots gripping a hillside",
    "hint": "Draw a sloping ground line and a short tree trunk. Spread curved roots down the slope, letting some pass behind others."
  },
  {
    "id": "nature-7",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A waterfall seen from behind its spray",
    "hint": "Draw two long edges for the falling water and rocks on each side. Add pale dots and short curves in front for spray."
  },
  {
    "id": "nature-8",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A moonlit garden after rain",
    "hint": "Start with a curved path between two rows of plants. Add a moon above and leave thin bright edges on leaves facing it."
  },
  {
    "id": "animals-1",
    "category": "animals",
    "difficulty": "easy",
    "text": "A sleepy cat curled into a circle",
    "hint": "Draw a large oval body and a smaller round head tucked against it. Add two triangle ears, closed eyes and a tail curved around the body."
  },
  {
    "id": "animals-2",
    "category": "animals",
    "difficulty": "easy",
    "text": "A snail beside a flowerpot",
    "hint": "Draw a circle for the shell and a long low shape for the body. Put them beside a flowerpot made from two sloping lines."
  },
  {
    "id": "animals-3",
    "category": "animals",
    "difficulty": "easy",
    "text": "A duck floating on still water",
    "hint": "Start with a big oval body and a small round head. Add a triangle beak and two curved water lines."
  },
  {
    "id": "animals-4",
    "category": "animals",
    "difficulty": "easy",
    "text": "A beetle with patterned wings",
    "hint": "Draw an oval body with a line down the middle. Add a small round head, three legs on each side and a few spots on the wings."
  },
  {
    "id": "animals-5",
    "category": "animals",
    "difficulty": "challenge",
    "text": "An owl landing on a branch",
    "hint": "Draw an oval body above a branch and two wide wings. Make the nearer wing larger, then add feet reaching for the branch."
  },
  {
    "id": "animals-6",
    "category": "animals",
    "difficulty": "challenge",
    "text": "Two dogs meeting through a fence",
    "hint": "Draw two oval bodies facing each other, with circles for heads. Add fence bars between them; give one dog an upright tail and the other a lowered head."
  },
  {
    "id": "animals-7",
    "category": "animals",
    "difficulty": "challenge",
    "text": "A fox disappearing into tall grass",
    "hint": "Draw an oval body, a pointed head and a bushy tail. Add tall grass in front, hiding parts of the legs and body."
  },
  {
    "id": "animals-8",
    "category": "animals",
    "difficulty": "challenge",
    "text": "A school of fish turning together",
    "hint": "Draw one large oval fish with a triangle tail. Add smaller fish behind it, pointing their heads along the same curved path."
  },
  {
    "id": "people-1",
    "category": "people",
    "difficulty": "challenge",
    "text": "A hand holding a pencil",
    "hint": "Draw a rounded rectangle for the palm and two straight lines for the pencil. Add short bent finger shapes wrapping around it."
  },
  {
    "id": "people-2",
    "category": "people",
    "difficulty": "challenge",
    "text": "A person reading beneath a lamp",
    "hint": "Start with an oval head and a rounded seated body. Put a rectangle book in front, then add a lamp above and to one side."
  },
  {
    "id": "people-3",
    "category": "people",
    "difficulty": "challenge",
    "text": "A runner tying a shoelace",
    "hint": "Start with a small head above a curved back. Draw a triangle for the bent leg, then two arms reaching toward the shoe."
  },
  {
    "id": "people-4",
    "category": "people",
    "difficulty": "easy",
    "text": "Two mittened hands around a cup",
    "hint": "Draw a tall U for the cup with an oval rim. Add one rounded mitten on each side, each with a small thumb curve touching the cup."
  },
  {
    "id": "people-5",
    "category": "people",
    "difficulty": "challenge",
    "text": "A dancer turning in a loose shirt",
    "hint": "Draw a curved line for the body and an oval head above it. Add bent arms and legs, then a loose shirt with one edge swinging outward."
  },
  {
    "id": "people-6",
    "category": "people",
    "difficulty": "challenge",
    "text": "A street musician seen from a low angle",
    "hint": "Place a large instrument shape in front of a standing figure. Make the shoes larger and the head smaller to suggest looking up from below."
  },
  {
    "id": "people-7",
    "category": "people",
    "difficulty": "challenge",
    "text": "Three people waiting at a bus stop",
    "hint": "Draw three oval heads beside a bus-stop pole. Add simple bodies: one upright, one leaning, and one with a bent knee."
  },
  {
    "id": "people-8",
    "category": "people",
    "difficulty": "challenge",
    "text": "A face lit by a window on one side",
    "hint": "Draw an oval face with a light line down the middle. Place the eyes, nose and mouth, then softly shade the side away from the window."
  },
  {
    "id": "places-1",
    "category": "places",
    "difficulty": "easy",
    "text": "A tiny house with a crooked chimney",
    "hint": "Start with a rectangle and a triangle roof. Add a door, one window, and a chimney leaning a little to one side."
  },
  {
    "id": "places-2",
    "category": "places",
    "difficulty": "easy",
    "text": "A park bench seen from the side, under a tree",
    "hint": "Use two long rectangles for the bench and two short legs. Add a trunk with a rounded leafy top."
  },
  {
    "id": "places-3",
    "category": "places",
    "difficulty": "easy",
    "text": "A doorway with climbing plants",
    "hint": "Draw a tall rectangle for the door and a small round handle. Add a winding line beside the frame, with pairs of oval leaves along it."
  },
  {
    "id": "places-4",
    "category": "places",
    "difficulty": "easy",
    "text": "A tent beside a quiet lake",
    "hint": "Start with a triangle for the tent. Add a horizontal lake line and a faint upside-down triangle in the water."
  },
  {
    "id": "places-5",
    "category": "places",
    "difficulty": "challenge",
    "text": "A narrow alley at sunset",
    "hint": "Pick one spot where the alley meets in the distance. Angle the edges of both walls toward that spot."
  },
  {
    "id": "places-6",
    "category": "places",
    "difficulty": "challenge",
    "text": "A greenhouse filled with large leaves",
    "hint": "Draw a rectangle with a triangle roof for the greenhouse. Add its frame lines, then large leaf shapes covering parts of the frame."
  },
  {
    "id": "places-7",
    "category": "places",
    "difficulty": "challenge",
    "text": "A train platform viewed from the stairs",
    "hint": "Draw a few wide stair edges at the bottom and rails on either side. Let them lead toward a long platform with a small train beside it."
  },
  {
    "id": "places-8",
    "category": "places",
    "difficulty": "challenge",
    "text": "A rooftop garden above a busy street",
    "hint": "Draw a wide rooftop edge and large plant pots in front. Add smaller building rectangles beyond it and tiny cars on the street below."
  },
  {
    "id": "fantasy-1",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A walking teapot carrying its own cup",
    "hint": "Draw a round teapot with a spout and lid. Add two bent legs and use the handle as an arm holding a small U-shaped cup."
  },
  {
    "id": "fantasy-2",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A library growing inside a giant tree",
    "hint": "Draw a thick tree trunk with an open doorway. Add curved shelves inside, then small book rectangles and branches above."
  },
  {
    "id": "fantasy-3",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A dragon mending a torn kite",
    "hint": "Draw an oval dragon body, a long tail and a small head. Place a diamond kite between its claws, with a torn edge and a patch."
  },
  {
    "id": "fantasy-4",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A lighthouse on the back of a whale",
    "hint": "Draw a long oval whale with a tail at one end. Place a narrow lighthouse on its back and add a beam of light from the top."
  },
  {
    "id": "fantasy-5",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A floating market tethered to clouds",
    "hint": "Draw three small market stalls on separate floating platforms. Add soft cloud shapes above them and ropes joining each platform to a cloud."
  },
  {
    "id": "fantasy-6",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A miniature knight exploring a sewing basket",
    "hint": "Start with a large basket rim and a giant spool of thread. Add a tiny helmeted figure beside them and a needle taller than the knight."
  },
  {
    "id": "fantasy-7",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A village built inside a broken clock",
    "hint": "Draw a large broken clock face with a jagged opening. Put tiny houses inside and connect them with paths across the gears."
  },
  {
    "id": "fantasy-8",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A gardener watering stars in clay pots",
    "hint": "Draw three small plant pots, each holding a star on a stem. Add a simple gardener beside them with a tilted watering can."
  }
];

export const DEFAULT_DRAWING_PROMPT = DRAWING_PROMPTS[0];
