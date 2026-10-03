export const DRAWING_CATEGORIES = ["everyday", "nature", "animals", "people", "places", "fantasy"] as const;
export type DrawingCategory = typeof DRAWING_CATEGORIES[number];
export type DrawingDifficulty = "easy" | "challenge";
export type DrawingPrompt = { id: string; category: DrawingCategory; difficulty: DrawingDifficulty; text: string; hint: string };
export const DRAWING_PROMPTS: DrawingPrompt[] = [
  {
    "id": "everyday-1",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A chipped mug with a spoon resting across its rim",
    "hint": "Use three values to show the inside of the mug."
  },
  {
    "id": "everyday-2",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A pair of shoes waiting beside a door",
    "hint": "Give each shoe a different angle."
  },
  {
    "id": "everyday-3",
    "category": "everyday",
    "difficulty": "easy",
    "text": "A folded umbrella leaning against a wall",
    "hint": "Look for the long triangle shapes."
  },
  {
    "id": "everyday-4",
    "category": "everyday",
    "difficulty": "easy",
    "text": "Three keys on a ring",
    "hint": "Overlap the keys instead of arranging them in a row."
  },
  {
    "id": "everyday-5",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A glass of water seen through its own shadow",
    "hint": "Distort the edge you see through the glass."
  },
  {
    "id": "everyday-6",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A coat hanging over the back of a chair",
    "hint": "Follow the folds where the fabric bends."
  },
  {
    "id": "everyday-7",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "An open drawer full of small objects",
    "hint": "Choose one focal object and simplify the rest."
  },
  {
    "id": "everyday-8",
    "category": "everyday",
    "difficulty": "challenge",
    "text": "A bicycle reflected in a rain puddle",
    "hint": "Let the reflection break at the ripples."
  },
  {
    "id": "nature-1",
    "category": "nature",
    "difficulty": "easy",
    "text": "A fern frond beginning to uncurl",
    "hint": "Repeat small leaf shapes along a curved stem."
  },
  {
    "id": "nature-2",
    "category": "nature",
    "difficulty": "easy",
    "text": "A smooth stone beside a jagged stone",
    "hint": "Show the contrast with line weight."
  },
  {
    "id": "nature-3",
    "category": "nature",
    "difficulty": "easy",
    "text": "A fallen leaf with a torn edge",
    "hint": "Trace the main vein before the smaller ones."
  },
  {
    "id": "nature-4",
    "category": "nature",
    "difficulty": "easy",
    "text": "A mushroom under a broad leaf",
    "hint": "Use the leaf as a simple frame."
  },
  {
    "id": "nature-5",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A wave curling around a rock",
    "hint": "Leave white space for the foam."
  },
  {
    "id": "nature-6",
    "category": "nature",
    "difficulty": "challenge",
    "text": "Tree roots gripping a hillside",
    "hint": "Use overlapping roots to show depth."
  },
  {
    "id": "nature-7",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A waterfall seen from behind its spray",
    "hint": "Build the scene with three layers."
  },
  {
    "id": "nature-8",
    "category": "nature",
    "difficulty": "challenge",
    "text": "A moonlit garden after rain",
    "hint": "Choose where the moonlight catches wet surfaces."
  },
  {
    "id": "animals-1",
    "category": "animals",
    "difficulty": "easy",
    "text": "A sleepy cat curled into a circle",
    "hint": "Start with one oval and tuck in the paws."
  },
  {
    "id": "animals-2",
    "category": "animals",
    "difficulty": "easy",
    "text": "A snail climbing a flowerpot",
    "hint": "Compare the spiral shell with the straight pot."
  },
  {
    "id": "animals-3",
    "category": "animals",
    "difficulty": "easy",
    "text": "A duck balancing on one foot",
    "hint": "Use a small triangle for the supporting foot."
  },
  {
    "id": "animals-4",
    "category": "animals",
    "difficulty": "easy",
    "text": "A beetle with patterned wings",
    "hint": "Mirror the big shapes, then vary the marks."
  },
  {
    "id": "animals-5",
    "category": "animals",
    "difficulty": "challenge",
    "text": "An owl landing on a branch",
    "hint": "Spread the wings and foreshorten one of them."
  },
  {
    "id": "animals-6",
    "category": "animals",
    "difficulty": "challenge",
    "text": "Two dogs meeting through a fence",
    "hint": "Show their different postures."
  },
  {
    "id": "animals-7",
    "category": "animals",
    "difficulty": "challenge",
    "text": "A fox disappearing into tall grass",
    "hint": "Use gaps in the grass to reveal the silhouette."
  },
  {
    "id": "animals-8",
    "category": "animals",
    "difficulty": "challenge",
    "text": "A school of fish turning together",
    "hint": "Make the nearest fish larger and more detailed."
  },
  {
    "id": "people-1",
    "category": "people",
    "difficulty": "easy",
    "text": "A hand holding a pencil",
    "hint": "Block in the fingers as simple tapered shapes."
  },
  {
    "id": "people-2",
    "category": "people",
    "difficulty": "easy",
    "text": "A person reading beneath a lamp",
    "hint": "Use a rounded silhouette and a rectangle for the book."
  },
  {
    "id": "people-3",
    "category": "people",
    "difficulty": "easy",
    "text": "A runner tying a shoelace",
    "hint": "Find the triangle made by the bent leg."
  },
  {
    "id": "people-4",
    "category": "people",
    "difficulty": "easy",
    "text": "Two mittened hands around a cup",
    "hint": "Focus on the shared outline."
  },
  {
    "id": "people-5",
    "category": "people",
    "difficulty": "challenge",
    "text": "A dancer turning in a loose shirt",
    "hint": "Show motion through the folds and stance."
  },
  {
    "id": "people-6",
    "category": "people",
    "difficulty": "challenge",
    "text": "A street musician seen from a low angle",
    "hint": "Let the instrument overlap the body."
  },
  {
    "id": "people-7",
    "category": "people",
    "difficulty": "challenge",
    "text": "Three people waiting at a bus stop",
    "hint": "Give each figure a different weight shift."
  },
  {
    "id": "people-8",
    "category": "people",
    "difficulty": "challenge",
    "text": "A face lit by a window on one side",
    "hint": "Group the shadow shapes before adding details."
  },
  {
    "id": "places-1",
    "category": "places",
    "difficulty": "easy",
    "text": "A tiny house with a crooked chimney",
    "hint": "Build it from rectangles and triangles."
  },
  {
    "id": "places-2",
    "category": "places",
    "difficulty": "easy",
    "text": "A park bench under a tree",
    "hint": "Use the tree to frame one side."
  },
  {
    "id": "places-3",
    "category": "places",
    "difficulty": "easy",
    "text": "A doorway with climbing plants",
    "hint": "Keep the door simple and vary the leaves."
  },
  {
    "id": "places-4",
    "category": "places",
    "difficulty": "easy",
    "text": "A tent beside a quiet lake",
    "hint": "Repeat the tent shape in its reflection."
  },
  {
    "id": "places-5",
    "category": "places",
    "difficulty": "challenge",
    "text": "A narrow alley at sunset",
    "hint": "Choose a single vanishing point."
  },
  {
    "id": "places-6",
    "category": "places",
    "difficulty": "challenge",
    "text": "A greenhouse filled with large leaves",
    "hint": "Show foreground leaves overlapping the frame."
  },
  {
    "id": "places-7",
    "category": "places",
    "difficulty": "challenge",
    "text": "A train platform viewed from the stairs",
    "hint": "Use the stair rails to guide the eye."
  },
  {
    "id": "places-8",
    "category": "places",
    "difficulty": "challenge",
    "text": "A rooftop garden above a busy street",
    "hint": "Separate the near garden from the far buildings."
  },
  {
    "id": "fantasy-1",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A walking teapot carrying its own cup",
    "hint": "Give the handle a role in its pose."
  },
  {
    "id": "fantasy-2",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A library growing inside a giant tree",
    "hint": "Wrap the shelves around the trunk."
  },
  {
    "id": "fantasy-3",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A dragon mending a torn kite",
    "hint": "Use the claws delicately instead of threateningly."
  },
  {
    "id": "fantasy-4",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A lighthouse on the back of a whale",
    "hint": "Balance the tower against the curved body."
  },
  {
    "id": "fantasy-5",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A floating market tethered to clouds",
    "hint": "Repeat ropes to connect the separate stalls."
  },
  {
    "id": "fantasy-6",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A miniature knight exploring a sewing basket",
    "hint": "Make everyday tools feel monumental."
  },
  {
    "id": "fantasy-7",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A village built inside a broken clock",
    "hint": "Use gears as pathways between homes."
  },
  {
    "id": "fantasy-8",
    "category": "fantasy",
    "difficulty": "challenge",
    "text": "A gardener watering stars in clay pots",
    "hint": "Contrast small bright stars with heavy pots."
  }
];
