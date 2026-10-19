// 21 Questions decks, written in-house 2026-10. Two ways to play:
//  - "guess": one player secretly picks a thing, the others have 21 yes/no
//    questions to find it. The tool deals the secret and suggests questions.
//  - "know": the get-to-know-you version, 21 open questions drawn one at a
//    time from a friends, couples or kids set.

export type KnowSet = "friends" | "couples" | "kids";

export const KNOW_SETS: { id: KnowSet; label: string; emoji: string }[] = [
  { id: "friends", label: "Friends", emoji: "🧑‍🤝‍🧑" },
  { id: "couples", label: "Couples", emoji: "💞" },
  { id: "kids", label: "Kids", emoji: "🧒" },
];

const list = (s: string) => s.split("|").map((x) => x.trim()).filter(Boolean);

export const KNOW_QUESTIONS: Record<KnowSet, string[]> = {
  friends: list(`
    What is a small thing that instantly makes your day better? |
    Which app on your phone would be hardest to give up for a month? |
    What did you believe as a kid that turned out to be completely wrong? |
    If you could master one skill overnight, which would you pick? |
    What is the best meal you have ever eaten, and where was it? |
    Which song do you never skip? |
    What is something you are weirdly good at? |
    What is the most spontaneous thing you have ever done? |
    Which fictional world would you move to for a year? |
    What is a hill you will die on, even if it is a silly one? |
    What was your first job, and what did it teach you? |
    If you had a free Saturday with no plans and no budget limit, how would you spend it? |
    What is a compliment you still remember years later? |
    Which habit are you proudest of building? |
    What is the worst haircut you have ever had? |
    If your life had a theme tune, what would it be? |
    What do people usually get wrong about you on first meeting? |
    What is the last thing that made you laugh until you cried? |
    Which place have you been to that you would go back to tomorrow? |
    What is something you changed your mind about recently? |
    What is on your bucket list that would surprise people? |
    What was your favourite TV show at age ten? |
    Which three things would you grab if your home were on fire (people and pets are safe)? |
    What would you name a boat if you owned one? |
    Who is someone you would love to have dinner with, living or not? |
    What is the most useful thing you own that cost under ten dollars? |
    What is your go-to karaoke song, or the one you would never sing? |
    What is a tradition from your family you want to keep? |
    Which smell takes you straight back to childhood? |
    What is a goal you are quietly working on right now? |
  `),
  couples: list(`
    What was your very first impression of me? |
    When did you first know you liked me more than as a friend? |
    What is your favourite memory of us so far? |
    Which small thing I do makes you feel most cared for? |
    What is a date you would love us to go on that we have never tried? |
    What is one thing you have always wanted to tell me but never found the moment? |
    Which song reminds you of us? |
    What do you think our biggest strength is as a couple? |
    Where do you picture us living in ten years? |
    What is a habit of mine you secretly find cute? |
    What is a habit of mine you would happily see go? |
    How do you most like to be comforted after a bad day? |
    What is one trip we must take together? |
    What did your parents' relationship teach you about love? |
    What is your idea of a perfect lazy Sunday together? |
    Which of our arguments do you now find funny? |
    What is something new you would like us to learn together? |
    What is the best gift you have ever received from anyone? |
    What makes you feel most appreciated: words, time, help, gifts or touch? |
    What is a fear you have not shared with many people? |
    If we wrote a book about us, what would the title be? |
    What is a tiny moment with me you think about more than I would guess? |
    Which friend of yours do you most want me to get to know better? |
    What is one tradition you want us to start? |
    What is the most romantic thing anyone has done for you? |
    What does a really good week together look like to you? |
    What is something you would like more of from me? |
    What dream did you have as a teenager that you still think about? |
    Which of your childhood toys or games would you show me first? |
    What is your favourite photo of the two of us, and why? |
  `),
  kids: list(`
    If you could have any animal as a pet, even a wild one, what would it be? |
    What is the funniest thing that has ever happened at school? |
    If you were a superhero, what would your power be? |
    What is your favourite food, and what is the yuckiest? |
    If you could visit any place in the world, where would you go? |
    What would you do if you were the grown-up for a day? |
    What is your favourite game to play outside? |
    If you could invent a new holiday, what would people celebrate? |
    What is something you are really good at? |
    Which cartoon or book character would be your best friend? |
    If your bedroom could have one magic feature, what would it be? |
    What is the best present you have ever been given? |
    What makes you feel brave? |
    If you could talk to one animal, which would you choose and what would you ask? |
    What job do you want when you grow up, and why? |
    What is your favourite thing to do on a rainy day? |
    If you could shrink to the size of an ant, where would you explore? |
    What is the silliest word you know? |
    Which season do you like best, and why? |
    If you had a robot helper, what jobs would it do for you? |
    What is something that always makes you laugh? |
    What would you put in a time capsule to open in 20 years? |
    If you could make one new rule at home, what would it be? |
    What is your favourite song to dance to? |
    Who is someone who helps you, and how? |
    If you could be any age for a week, which would you be? |
    What is the coolest thing you have ever seen in nature? |
    What would your dream sandwich have in it? |
    If you could fly, where is the first place you would go? |
    What is one thing you want to learn this year? |
  `),
};

// Guess mode: secret things to think of, sorted by category so the guesser
// can be told "it's an animal / object / place / person-job / food".
export const GUESS_SECRETS: { w: string; c: string }[] = [
  ...list("giraffe | penguin | octopus | hamster | eagle | shark | butterfly | camel | tortoise | dolphin | owl | kangaroo").map((w) => ({ w, c: "Animal" })),
  ...list("toaster | umbrella | bicycle | toothbrush | guitar | backpack | mirror | candle | trampoline | headphones | microwave | skateboard").map((w) => ({ w, c: "Object" })),
  ...list("beach | library | volcano | airport | hospital | the Moon | castle | rainforest | museum | bakery | igloo | lighthouse").map((w) => ({ w, c: "Place" })),
  ...list("pizza | pancake | watermelon | popcorn | sushi | taco | ice cream | broccoli | spaghetti | cupcake | pineapple | cheese").map((w) => ({ w, c: "Food" })),
  ...list("firefighter | astronaut | chef | teacher | pilot | doctor | farmer | magician | lifeguard | detective | dentist | zookeeper").map((w) => ({ w, c: "Job" })),
];

// Yes/no openers that split the possibilities roughly in half. Shown as hints
// for the guesser, in a sensible order (broad first, specific later).
export const GUESS_STARTERS = list(`
  Is it alive? | Is it bigger than a microwave? | Would I find it indoors? |
  Can you eat it? | Is it found in most homes? | Does it need electricity? |
  Can you hold it in one hand? | Is it something a person does as a job? |
  Is it found in nature? | Does it move by itself? | Is it mostly one colour? |
  Would a child use it? | Is it older than 100 years as an idea? | Can it fit in a car? |
  Is it soft? | Does it make a sound? | Is it used outside? | Is it found near water? |
  Would you see it at school? | Does it have legs? | Is it sweet?
`);

export const MAX_QUESTIONS = 21;
