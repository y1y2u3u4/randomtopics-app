// Morning meeting bank (2026-10-16): greeting, sharing question and group
// activity for each school day, in the classic four-part routine (greeting,
// sharing, activity, morning message). All `audience: "kids"`; written for
// grades K–6. The day's set is picked from the date, so the whole class (and
// every refresh that day) sees the same one.

import type { KidsGrade } from "./kidsQuestions";

export interface MorningItem { text: string; audience: "kids"; grades: KidsGrade[] }
export interface MorningStep { name: string; how: string; audience: "kids" }

const ALL: KidsGrade[] = ["k2", "g36"];
const YOUNG: KidsGrade[] = ["k2"];
const OLD: KidsGrade[] = ["g36"];
const items = (grades: KidsGrade[], list: string[]): MorningItem[] => list.map((text) => ({ text, audience: "kids" as const, grades }));
const steps = (list: [string, string][]): MorningStep[] => list.map(([name, how]) => ({ name, how, audience: "kids" as const }));

export const MORNING_GREETINGS: MorningStep[] = steps([
  ["High-five hello", "Turn to the person next to you, say “Good morning, ___!” and give a high five. Pass it around the circle."],
  ["Wave hello", "Each student waves to the person on their left and says their name. Keep the wave going all the way around."],
  ["Elbow bump", "Go around the circle with an elbow bump and “Good morning, ___.”"],
  ["Silent greeting", "No words today! Greet your neighbor with a smile, a nod and a thumbs-up."],
  ["Greeting in another language", "Pick a language for the day — hola, bonjour, konnichiwa, jambo — and greet each other with it."],
  ["Ball toss greeting", "Say “Good morning, ___,” and gently toss a soft ball to that person. Everyone gets one turn."],
  ["Name and a move", "Say your name and do a move (a hop, a spin, a wiggle). The class says “Good morning, ___!” and copies the move."],
  ["Compliment greeting", "Greet your neighbor and give them one kind compliment that is not about clothes or looks."],
  ["Robot greeting", "Greet the person next to you in your best robot voice: “GOOD. MORNING. ___.”"],
  ["Whisper greeting", "Whisper “Good morning, ___” around the circle — can we go all the way without anyone giggling?"],
  ["Animal greeting", "Greet your neighbor as an animal: a roar, a chirp, a meow, then say their name."],
  ["Secret handshake", "Partners make up a three-move handshake and use it to say good morning."],
  ["Mix and mingle", "Walk around the room and greet three people you haven't talked to yet this week."],
  ["Good morning song", "Sing “Good morning to you” and fill in each student's name as you go around the circle."],
  ["Thumbs-up check-in", "Greet your neighbor and show how you feel today: thumbs up, sideways or down. No explaining needed."],
  ["Spider web greeting", "Hold a ball of yarn, greet someone across the circle and pass the yarn to them, holding on to your end. Watch the web grow."],
  ["Opera greeting", "Sing your neighbor's name like an opera star: “Goooood morning, ___!”"],
  ["Fist bump countdown", "Go around the circle with fist bumps. Try to beat yesterday's time!"],
  ["Peace sign hello", "Make a peace sign, say “Peace and good morning, ___,” and pass it on."],
  ["Name rhyme", "Greet your neighbor with a rhyme: “Good morning, Jake, I hope you like cake!” Silly rhymes are welcome."],
  ["Pinky promise greeting", "Link pinkies with your neighbor and promise one kind thing you'll do today."],
  ["Spin the greeting", "The teacher spins and points; that student starts the greeting, and it goes the other way round."],
  ["Wave like the weather", "Greet with a wave that matches today's weather — sunny big waves, rainy little ones."],
  ["Echo greeting", "One student says “Good morning, everyone!” in a funny voice and the whole class echoes it back."],
  ["Toe tap greeting", "Tap toes with your neighbor and say good morning. Keep balance!"],
  ["Hello in sign language", "Learn the sign for “hello” and greet each person in the circle with it."],
  ["Inside–outside circle", "Make two circles facing each other, greet your partner, then the outside circle moves one step."],
  ["Superhero greeting", "Strike a superhero pose and greet your neighbor with your superhero name."],
  ["Good news greeting", "Greet your neighbor and tell them one tiny piece of good news."],
  ["Slow-motion greeting", "Do the whole greeting — wave, smile, words — in slow motion."],
]);

export const MORNING_SHARE: MorningItem[] = [
  ...items(ALL, [
    "What is something that made you smile this week?",
    "If you could have any animal as a class pet, what would it be?",
    "What is your favorite thing to do on a rainy day?",
    "What is one thing you are looking forward to today?",
    "If you could have any superpower for one day, what would it be?",
    "What is your favorite food to eat for breakfast?",
    "What is a game you love to play with friends?",
    "If you could visit any place in the world, where would you go?",
    "What is your favorite book character, and why?",
    "What is something you are really good at?",
    "What is one thing you learned yesterday?",
    "If you were an animal, which one would you be?",
    "What is your favorite season, and why?",
    "What would you do if you were the teacher for a day?",
    "What is something kind someone did for you?",
    "What is your favorite thing to build?",
    "If you could invent a new holiday, what would it celebrate?",
    "What makes a good friend?",
    "What is your favorite sound?",
    "What is something you want to get better at?",
    "If you could eat only one food for a week, what would it be?",
    "What is your favorite place to read?",
    "What do you like to do outside?",
    "What is your favorite song to sing or dance to?",
    "If you could talk to one animal, what would you ask it?",
    "What is something that makes you feel calm?",
    "What is the best thing about our class?",
    "If you had a magic wand, what is one thing you would fix?",
    "What is your favorite thing to draw?",
    "What job would you like to try for a day?",
    "What is something new you tried recently?",
    "If our class had a song, what would it be about?",
    "What is your favorite thing about the weekend?",
    "What would you name a new planet?",
    "What is something you can teach the class?",
    "What is your favorite color today, and why?",
    "If you could fly, where would you go first?",
    "What is something you are thankful for today?",
    "What is your favorite thing to do with your family or friends?",
    "If you could have a robot helper, what would it do?",
    "What is your favorite shape, and where do you see it?",
    "What would you put in a time capsule?",
    "What is the funniest animal you know?",
    "If you could make a new rule for recess, what would it be?",
    "What is your favorite thing about mornings?",
    "What is a smell that makes you happy?",
    "What would you do with a giant box?",
    "If you could be any size for a day, what size would you be?",
    "What do you want to be when you grow up?",
    "What is something brave you have done?",
    "What is your favorite fruit?",
    "What do you like to do when you feel bored?",
    "If you could ask a question to an astronaut, what would it be?",
    "What is a goal you have for this week?",
    "What is your favorite kind of weather?",
    "If you could design a playground, what would you add?",
    "What is something that makes you laugh?",
    "What is your favorite thing we did in class this week?",
    "If you could have dinner with a book character, who would it be?",
    "What would you do on a snow day?",
  ]),
  ...items(YOUNG, [
    "What is your favorite toy?",
    "What noise does your favorite animal make?",
    "What color would you paint the sky if you could?",
    "What is your favorite bedtime story?",
    "What do you like to play on the playground?",
    "What is your favorite shape of pasta?",
    "If you had a pet dinosaur, what would you name it?",
    "What is your favorite letter, and why?",
    "What is the biggest animal you can think of?",
    "Do you like puddles or sunshine better?",
    "What is your favorite kind of cookie?",
    "What would you build with blocks today?",
    "What is your favorite number?",
    "What is something soft you like?",
    "What fruit would you be?",
  ]),
  ...items(OLD, [
    "What is a skill you would like to learn this year?",
    "If you could switch places with anyone in a book for a day, who would it be?",
    "What is a problem in our school you would like to solve?",
    "What is a hobby you would recommend to the class?",
    "What is something you changed your mind about?",
    "What invention do you think the world needs?",
    "If you could start a club, what would it be?",
    "What is a mistake that helped you learn something?",
    "What would you do if you were in charge of the school for a day?",
    "What is a question you have always wondered about?",
    "What is something you are proud of this month?",
    "What makes a team work well together?",
    "If you could ask a scientist one question, what would it be?",
    "What is the best advice you have ever been given?",
    "What would you include in a guidebook for new students?",
  ]),
];

export const MORNING_ACTIVITIES: MorningStep[] = steps([
  ["Four corners", "Name four choices (pizza, tacos, pasta, salad) and point to a corner for each. Students walk to their pick, then share why with someone in the same corner."],
  ["Simon says", "Classic Simon Says with a learning twist: “Simon says touch something shaped like a rectangle.”"],
  ["Count around the circle", "Count around the circle by 1s, 2s or 5s. If someone misses, start again from them."],
  ["Category snap", "Pick a category (animals, colors, foods). Go around the circle naming one each without repeating."],
  ["Zip, zap, zop", "Pass the words zip, zap and zop across the circle with a clap and a point. Speed up each round."],
  ["Mirror, mirror", "Partners face each other; one moves slowly, the other copies like a mirror. Switch after a minute."],
  ["Telephone", "Whisper a short sentence around the circle and see how it changes by the end."],
  ["I spy", "One student spies something in the room and gives clues; others guess."],
  ["Freeze dance", "Play music for 30 seconds of dancing; freeze when it stops. Three rounds."],
  ["Would you rather vote", "Read one would you rather question; students move to the side of the room that matches their choice."],
  ["Alphabet chain", "Go around the circle naming things in alphabetical order: apple, banana, cat…"],
  ["Pass the clap", "Pass one clap around the circle as fast as you can. Try to beat your time."],
  ["Silent line-up", "Line up by birthday month without talking — only gestures allowed."],
  ["Two truths and a dream", "One student shares two true things and one dream; the class guesses the dream."],
  ["Story chain", "Each student adds one sentence to a story started by the teacher."],
  ["Rhyme time", "The teacher says a word; go around the circle saying a rhyming word."],
  ["Guess the sound", "The teacher makes a sound behind a book (crinkle, tap, zip); students guess."],
  ["Stand up if…", "Students stand if the statement is true for them: “Stand up if you have a pet.”"],
  ["Shape hunt", "Find three things in the room shaped like a circle, a square and a triangle."],
  ["Hot and cold", "Hide an object; one student finds it while the class says “warmer” or “colder”."],
  ["Brain break stretch", "Reach high, touch toes, twist, then three deep breaths together."],
  ["Number detective", "The teacher thinks of a number from 1 to 50; students guess and get “higher” or “lower” clues."],
  ["Word of the day", "Learn one new word, act it out, and use it in a sentence."],
  ["This or that", "Read three this-or-that questions; students point left or right for their choice."],
  ["Compliment circle", "Each student gives one kind compliment to the person on their right."],
  ["Charades", "One student acts out an animal or action; the class guesses."],
  ["Spelling clap", "Spell a word together, clapping on vowels and stomping on consonants."],
  ["Riddle of the day", "Read one riddle; give the class 30 seconds to whisper answers to a partner before the reveal."],
  ["Echo rhythm", "The teacher claps a rhythm; the class echoes it back. Make each one a little harder."],
  ["Gratitude round", "Each student names one thing they are grateful for in three words or fewer."],
]);

/** Whole days since 2026-01-01 for a local calendar date (same answer all day). */
export function dayNumber(date: Date): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((local - Date.UTC(2026, 0, 1)) / 86_400_000);
}

const pick = <T,>(list: T[], n: number, offset: number) => list[(((n * 7 + offset) % list.length) + list.length) % list.length];

/** The day's greeting, sharing question and activity. Stable for one calendar day. */
export function morningMeetingFor(date: Date, grade: KidsGrade | "all" = "all") {
  const n = dayNumber(date);
  const share = MORNING_SHARE.filter((q) => grade === "all" || q.grades.includes(grade));
  return {
    day: n,
    greeting: pick(MORNING_GREETINGS, n, 0),
    share: pick(share, n, 3),
    activity: pick(MORNING_ACTIVITIES, n, 11),
  };
}
