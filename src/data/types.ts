export type Category =
  | "science"
  | "technology"
  | "philosophy"
  | "psychology"
  | "history"
  | "art-culture"
  | "food-travel"
  | "relationships"
  | "education"
  | "politics"
  | "entertainment"
  | "sports"
  | "business"
  | "nature"
  | "health"
  | "weird-fun";

export type Mode =
  | "conversation"
  | "writing"
  | "debate"
  | "speech"
  | "icebreaker";

export type Depth = "light" | "medium" | "deep";

export interface Topic {
  id: string;
  text: string;
  category: Category;
  modes: Mode[];
  depth: Depth;
  talkingPoints: string[];
}

export interface CategoryInfo {
  id: Category;
  label: string;
  emoji: string;
  description: string;
}

export interface ModeInfo {
  id: Mode;
  label: string;
  emoji: string;
  description: string;
  slug: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "science", label: "Science", emoji: "🔬", description: "Explore the wonders of scientific discovery" },
  { id: "technology", label: "Technology", emoji: "💻", description: "Discuss the latest in tech and innovation" },
  { id: "philosophy", label: "Philosophy", emoji: "🤔", description: "Ponder life's deepest questions" },
  { id: "psychology", label: "Psychology", emoji: "🧠", description: "Understand the human mind and behavior" },
  { id: "history", label: "History", emoji: "📜", description: "Learn from the events that shaped our world" },
  { id: "art-culture", label: "Art & Culture", emoji: "🎨", description: "Explore creative expression across cultures" },
  { id: "food-travel", label: "Food & Travel", emoji: "🍕", description: "Discover cuisines and destinations worldwide" },
  { id: "relationships", label: "Relationships", emoji: "💬", description: "Navigate human connections and communication" },
  { id: "education", label: "Education", emoji: "📚", description: "Rethink how we learn and teach" },
  { id: "politics", label: "Politics", emoji: "🏛️", description: "Examine governance and civic life" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬", description: "Dive into movies, music, and pop culture" },
  { id: "sports", label: "Sports", emoji: "⚽", description: "Celebrate athleticism and competition" },
  { id: "business", label: "Business", emoji: "💼", description: "Explore entrepreneurship and economics" },
  { id: "nature", label: "Nature", emoji: "🌿", description: "Connect with the natural world" },
  { id: "health", label: "Health", emoji: "❤️", description: "Discuss wellness, fitness, and wellbeing" },
  { id: "weird-fun", label: "Weird & Fun", emoji: "🤪", description: "Embrace the wonderfully bizarre" },
];

export const MODES: ModeInfo[] = [
  {
    id: "conversation",
    label: "Conversation Starters",
    emoji: "💬",
    description: "Break the ice and keep conversations flowing",
    slug: "conversation",
  },
  {
    id: "writing",
    label: "Writing Prompts",
    emoji: "✍️",
    description: "Spark your creativity with unique writing ideas",
    slug: "writing",
  },
  {
    id: "debate",
    label: "Debate Topics",
    emoji: "⚔️",
    description: "Explore both sides of thought-provoking issues",
    slug: "debate",
  },
  {
    id: "speech",
    label: "Speech Topics",
    emoji: "🎤",
    description: "Find the perfect topic for your next presentation",
    slug: "speech",
  },
  {
    id: "icebreaker",
    label: "Icebreakers",
    emoji: "🧊",
    description: "Fun questions to get any group talking",
    slug: "icebreaker",
  },
];

export const DEPTHS: { id: Depth; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "medium", label: "Medium" },
  { id: "deep", label: "Deep" },
];
