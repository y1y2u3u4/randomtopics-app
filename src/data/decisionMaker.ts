// Starter lists and the "decision of the day" bank for /decision-maker.
// Everything here is plain data so the page can render the tool server-side.

export interface DecisionPreset { id: string; label: string; question: string; options: string[] }

export const DEFAULT_PRESET: DecisionPreset = {
  id: "dinner", label: "🍕 Dinner", question: "What should we eat tonight?", options: ["Pizza", "Tacos", "Sushi", "Burgers", "Pad thai", "Salad"],
};

export const PRESETS: DecisionPreset[] = [
  DEFAULT_PRESET,
  { id: "movie", label: "🎬 Movie night", question: "What kind of movie?", options: ["Comedy", "Horror", "Rom-com", "Action", "Documentary", "Animated"] },
  { id: "weekend", label: "🌤️ Weekend", question: "What should I do this weekend?", options: ["Hike", "Museum", "Stay in", "Brunch", "Road trip", "Board games"] },
  { id: "chores", label: "🧹 Who does it", question: "Who does the dishes?", options: ["Alex", "Sam", "Jordan", "Riley"] },
  { id: "workout", label: "💪 Workout", question: "Today's workout?", options: ["Run", "Yoga", "Weights", "Swim", "Rest day"] },
  { id: "date", label: "💞 Date night", question: "Date night idea?", options: ["Cook together", "Mini golf", "Picnic", "Karaoke", "Stargazing"] },
];

// One fun, low-stakes decision per day (same for every visitor that day).
export const DAILY_DECISIONS: { question: string; options: string[] }[] = [
  { question: "Pizza or tacos tonight?", options: ["Pizza", "Tacos"] },
  { question: "Morning person or night owl for a day?", options: ["Sunrise walk", "Midnight snack"] },
  { question: "What should you learn this week?", options: ["A card trick", "A new recipe", "10 words in a new language", "A song on any instrument"] },
  { question: "Beach day or mountain day?", options: ["Beach", "Mountains"] },
  { question: "Which tiny adventure today?", options: ["Take a new route home", "Try a new snack", "Text an old friend", "Go outside for 15 minutes"] },
  { question: "Coffee or tea this afternoon?", options: ["Coffee", "Tea", "Hot chocolate"] },
  { question: "What should you watch tonight?", options: ["A classic movie", "A documentary", "One episode of something new", "Nothing — read instead"] },
  { question: "Cook or order in?", options: ["Cook", "Order in"] },
  { question: "Which room gets a 10-minute tidy?", options: ["Kitchen", "Bedroom", "Desk", "Car"] },
  { question: "Pancakes or waffles this weekend?", options: ["Pancakes", "Waffles"] },
  { question: "Which song genre for the drive?", options: ["90s hits", "Jazz", "Lo-fi", "Musicals", "Country"] },
  { question: "How do you spend a free hour?", options: ["Nap", "Walk", "Hobby", "Call someone"] },
  { question: "Dogs or cats (just for today)?", options: ["Dogs", "Cats"] },
  { question: "Which dessert wins?", options: ["Ice cream", "Brownie", "Cheesecake", "Fruit"] },
  { question: "What should you draw in 5 minutes?", options: ["Your shoe", "A dragon", "Your view", "A self-portrait"] },
  { question: "Sweet or savory breakfast?", options: ["Sweet", "Savory"] },
  { question: "Which small kindness today?", options: ["Leave a nice review", "Compliment a stranger", "Make someone coffee", "Send a thank-you note"] },
  { question: "Board game or video game night?", options: ["Board game", "Video game"] },
  { question: "Which cuisine for lunch?", options: ["Mexican", "Japanese", "Italian", "Indian", "Thai"] },
  { question: "Early night or one more chapter?", options: ["Early night", "One more chapter"] },
  { question: "What's today's 20-minute workout?", options: ["Walk", "Stretch", "Dance", "Bodyweight circuit"] },
  { question: "Window seat or aisle seat?", options: ["Window", "Aisle"] },
  { question: "Which new thing to taste this week?", options: ["A new fruit", "A new cheese", "A new tea", "A new sauce"] },
  { question: "Phone-free hour: when?", options: ["First hour of the day", "Lunch", "Before bed"] },
  { question: "Summer or winter forever?", options: ["Summer", "Winter"] },
  { question: "Which corner of your city to explore?", options: ["A park you've never visited", "A new café", "The library", "A local market"] },
  { question: "Superpower for a day?", options: ["Flying", "Invisibility", "Teleporting", "Talking to animals"] },
  { question: "Soup or sandwich?", options: ["Soup", "Sandwich"] },
  { question: "What should you finally finish?", options: ["That book", "That show", "That project", "That email"] },
  { question: "Sunrise or sunset photo?", options: ["Sunrise", "Sunset"] },
  { question: "Which playlist for chores?", options: ["Throwbacks", "Podcasts", "Movie soundtracks", "Silence"] },
];

export function dailyIndex(d = new Date()): number {
  const day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return day % DAILY_DECISIONS.length;
}
