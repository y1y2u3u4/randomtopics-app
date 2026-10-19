// Pictionary word and phrase bank — written in-house, 2026-10. Every entry is
// drawable without letters or numbers, family-safe, and tagged by theme and
// difficulty. d: 1 = easy (one simple object or action, kids can draw it),
// 2 = medium (needs a scene or two parts), 3 = hard (idiom, abstract, or
// several ideas at once). Movie entries are titles; the guessers only need to
// name the film.

export type PictionaryTheme = "animals" | "objects" | "actions" | "movies";
export type PictionaryLevel = 1 | 2 | 3;

export interface PictionaryEntry {
  w: string;
  t: PictionaryTheme;
  d: PictionaryLevel;
}

export const PICTIONARY_THEMES: { id: PictionaryTheme; label: string; emoji: string; tip: string }[] = [
  { id: "animals", label: "Animals", emoji: "🐘", tip: "Draw the one feature nobody else has first: the trunk, the shell, the long neck. Add the habitat only if the team is stuck." },
  { id: "objects", label: "Objects", emoji: "🔦", tip: "Start with the outline, then draw it being used. A hand holding the handle often gets the guess faster than more detail." },
  { id: "actions", label: "Actions", emoji: "🏃", tip: "Use a stick figure and motion lines. Draw the thing the person is using (a rope, a board, a ball) so the action has context." },
  { id: "movies", label: "Movies", emoji: "🎬", tip: "Draw a frame around your picture to say \"movie\", then sketch the most famous scene or character shape, never the title letters." },
];

const LEVELS: Record<PictionaryLevel, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
export const levelLabel = (d: PictionaryLevel) => LEVELS[d];

const bank = (t: PictionaryTheme, d: PictionaryLevel, list: string) =>
  list.split(";").map((w) => w.trim()).filter(Boolean).map((w) => ({ w, t, d }));

export const PICTIONARY_WORDS: PictionaryEntry[] = [
  ...bank("animals", 1, "cat; dog; fish; bird; snake; cow; pig; duck; frog; horse; bee; spider; turtle; rabbit; elephant; giraffe; lion; mouse; snail; owl"),
  ...bank("animals", 2, "octopus; penguin; kangaroo; crab; bat; camel; zebra; peacock; flamingo; jellyfish; squirrel; hedgehog; dolphin; crocodile; porcupine; swan; seahorse; ladybug; butterfly; starfish; shark; monkey"),
  ...bank("animals", 3, "platypus; chameleon; armadillo; anteater; narwhal; sloth; moose; walrus; pufferfish; hammerhead shark; praying mantis; axolotl; koala; hermit crab; stingray; mole; woodpecker; lobster"),

  ...bank("objects", 1, "ball; cup; chair; key; sun; book; hat; shoe; clock; umbrella; spoon; bed; door; phone; glasses; candle; kite; balloon; car; lamp"),
  ...bank("objects", 2, "ladder; scissors; toothbrush; backpack; bicycle; guitar; telescope; light bulb; headphones; sandwich; anchor; hourglass; paintbrush; microphone; tent; lighthouse; wheelbarrow; padlock; envelope; camera; rocket; treasure chest"),
  ...bank("objects", 3, "compass; magnifying glass; chandelier; sewing machine; typewriter; stethoscope; parachute; windmill; mousetrap; accordion; periscope; roller skates; fire hydrant; pocket knife; trampoline; snow globe; vending machine; metronome"),

  ...bank("actions", 1, "jump; run; swim; sleep; eat; dance; sing; cry; laugh; wave; clap; read; kick; throw; climb; fly; sneeze; yawn; brush teeth; fishing"),
  ...bank("actions", 2, "juggling; skateboarding; surfing; knitting; ice skating; bowling; shoveling snow; blowing bubbles; walking the dog; taking a selfie; flipping pancakes; building a snowman; mowing the lawn; painting a wall; rowing a boat; playing tennis; doing yoga; washing dishes; tying shoes; sweeping; hula hooping; waterskiing"),
  ...bank("actions", 3, "sleepwalking; daydreaming; procrastinating; babysitting; hitchhiking; sunbathing; bungee jumping; eavesdropping; window shopping; skydiving; parallel parking; brainstorming; hiccuping; tightrope walking; snorkeling; carving a pumpkin; changing a tire; ice fishing"),

  ...bank("movies", 1, "Finding Nemo; Toy Story; Frozen; The Lion King; Cars; Up; Shrek; Jaws; Spider-Man; Batman; Ghostbusters; Star Wars; Jurassic Park; Titanic; The Wizard of Oz; Aladdin; Moana; Ratatouille; Kung Fu Panda; Ice Age"),
  ...bank("movies", 2, "Back to the Future; Home Alone; The Little Mermaid; Beauty and the Beast; Harry Potter; Pirates of the Caribbean; King Kong; Monsters, Inc.; Despicable Me; Cinderella; Snow White; Pinocchio; The Jungle Book; Planet of the Apes; Men in Black; Night at the Museum; Charlie and the Chocolate Factory; Inside Out; Coco; Zootopia; Mary Poppins; Godzilla"),
  ...bank("movies", 3, "The Matrix; Inception; The Sixth Sense; Gravity; Twister; Cast Away; The Godfather; Psycho; Groundhog Day; Edward Scissorhands; Life of Pi; Gone with the Wind; The Truman Show; Free Willy; The Birds; Raiders of the Lost Ark; Honey, I Shrunk the Kids; Chicken Run"),
];

// Phrases are 2–4 words. Easy ones are a literal scene, medium ones a scene
// with a twist, hard ones idioms that have to be drawn literally.
export const PICTIONARY_PHRASES: PictionaryEntry[] = [
  ...bank("animals", 1, "dog chasing its tail; fish in a bowl; bird in a nest; frog on a log; bee on a flower; pig in mud; duck in a pond; cat in a box"),
  ...bank("animals", 2, "elephant taking a shower; penguin on ice; monkey eating a banana; spider spinning a web; snake in the grass; horse wearing boots; bear catching fish; owl at midnight"),
  ...bank("animals", 3, "fish out of water; elephant in the room; raining cats and dogs; busy as a bee; wolf in sheep's clothing; night owl; hold your horses; butterflies in stomach"),

  ...bank("objects", 1, "ice cream cone; birthday cake; paper airplane; flat tire; hot air balloon; full moon; open book; snowy mountain"),
  ...bank("objects", 2, "broken umbrella; melting candle; message in a bottle; piggy bank; alarm clock ringing; treasure map; leaky faucet; tangled headphones"),
  ...bank("objects", 3, "time flies; piece of cake; break the ice; spill the beans; hit the books; couch potato; glass half full; light at the end"),

  ...bank("actions", 1, "brushing your teeth; riding a bike; eating pizza; climbing a tree; jumping rope; walking in rain; kicking a ball; flying a kite"),
  ...bank("actions", 2, "catching a bus; baking cookies; building a sandcastle; waiting in line; roasting marshmallows; slipping on ice; taking out trash; reading in bed"),
  ...bank("actions", 3, "burning the midnight oil; walking on eggshells; jumping to conclusions; beating around the bush; under the weather; on thin ice; head in the clouds; back to square one"),

  ...bank("movies", 1, "popcorn at the movies; superhero cape; pirate ship; magic wand; flying carpet; haunted house; rocket launch; dinosaur footprint"),
  ...bank("movies", 2, "red carpet; car chase; sword fight; alien spaceship; secret agent; time machine; talking snowman; robot army"),
  ...bank("movies", 3, "plot twist; happy ending; behind the scenes; slow motion; special effects; opening night; box office hit; standing ovation"),
];

export const wordsIn = (list: PictionaryEntry[], theme: PictionaryTheme | "all", level: PictionaryLevel | 0) =>
  list.filter((e) => (theme === "all" || e.t === theme) && (level === 0 || e.d === level));
