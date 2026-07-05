import { Locale } from "./config";
import type { Category, Mode } from "@/data/types";

// UI string dictionaries for the app chrome and interactive generators.
// Page-body SEO copy lives in the per-locale page files / data, not here.

export interface UIDict {
  langName: string;
  switchLang: string;
  nav: { funny: string; allCategories: string };
  generator: {
    heroLine1: string;
    heroLine2: string;
    heroSubtitle: string;
    mode: string;
    category: string;
    depth: string;
    count: string;
    all: string;
    allCategory: string;
    any: string;
    generate: string;
    spinning: string;
    noTopicsTitle: string;
    noTopicsBody: string;
    clickPrompt: string;
    clickGenerate: string;
    depthLight: string;
    depthMedium: string;
    depthDeep: string;
  };
  card: { copy: string; copied: string; saveFav: string; removeFav: string };
  party: { firstPrompt: string; generate: string; next: string; copy: string; copied: string; printDeck: string; deckInfo: string };
  wheel: { title: string; subtitle: string; spin: string; spinning: string; spinAgain: string; landedOn: string };
  footer: {
    generators: string;
    categories: string;
    moreCategories: string;
    about: string;
    aboutUs: string;
    privacy: string;
    terms: string;
    press: string;
    allCategories: string;
    topicCollections: string;
    funnyTopics: string;
    embedWidget: string;
    tagline: string;
    argumentGenerator: string;
    tableTopics: string;
    impromptuSpeech: string;
    questionGenerator: string;
    wouldYouRather: string;
    neverHaveIEver: string;
    spinTheWheel: string;
  };
  breadcrumb: { home: string };
  print: { defaultLabel: string; footerNote: (n: number) => string };
}

const en: UIDict = {
  langName: "English",
  switchLang: "Español",
  nav: { funny: "Funny", allCategories: "All Categories" },
  generator: {
    heroLine1: "Random Topic",
    heroLine2: "Generator",
    heroSubtitle:
      "Generate random topics for conversations, writing, debates, speeches, and more. 500+ curated topics across 15+ categories.",
    mode: "Mode",
    category: "Category",
    depth: "Depth",
    count: "Count",
    all: "All",
    allCategory: "All",
    any: "Any",
    generate: "Generate",
    spinning: "Spinning...",
    noTopicsTitle: "No topics found",
    noTopicsBody:
      "Try broadening your filters — select fewer categories or a different mode to discover more topics.",
    clickPrompt: "to get your random topic!",
    clickGenerate: "Click",
    depthLight: "Light",
    depthMedium: "Medium",
    depthDeep: "Deep",
  },
  card: { copy: "Copy topic", copied: "Copied", saveFav: "Save to favorites", removeFav: "Remove from favorites" },
  party: {
    firstPrompt: "Hit the button to get your first question",
    generate: "Generate",
    next: "Next Question",
    copy: "📋 Copy",
    copied: "✅ Copied",
    printDeck: "🖨️ Print deck",
    deckInfo: "questions in this deck · no repeats until you've seen them all",
  },
  wheel: {
    title: "Spin the Wheel",
    subtitle:
      "Give the wheel a spin and let chance pick your topic — 16 categories, one random result every time.",
    spin: "Spin the Wheel",
    spinning: "Spinning...",
    spinAgain: "Spin Again",
    landedOn: "Landed on",
  },
  footer: {
    generators: "Generators",
    categories: "Categories",
    moreCategories: "More Categories",
    about: "About",
    aboutUs: "About Us",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    press: "Press & Media",
    allCategories: "All Categories",
    topicCollections: "Topic Collections",
    funnyTopics: "Funny Topics",
    embedWidget: "Embed This Widget",
    tagline: "Free random topic generator for everyone.",
    argumentGenerator: "Argument Generator",
    tableTopics: "Table Topics",
    impromptuSpeech: "Impromptu Speech",
    questionGenerator: "Question Generator",
    wouldYouRather: "Would You Rather",
    neverHaveIEver: "Never Have I Ever",
    spinTheWheel: "Spin the Wheel",
  },
  breadcrumb: { home: "Home" },
  print: {
    defaultLabel: "🖨️ Save as PDF",
    footerNote: (n) => `Free printable from randomtopics.app — ${n} prompts. Generate more at randomtopics.app`,
  },
};

const es: UIDict = {
  langName: "Español",
  switchLang: "English",
  nav: { funny: "Divertido", allCategories: "Todas las Categorías" },
  generator: {
    heroLine1: "Generador de",
    heroLine2: "Temas",
    heroSubtitle:
      "Genera temas al azar para conversaciones, escritura, debates, discursos y mucho más. Más de 500 temas seleccionados en más de 15 categorías.",
    mode: "Modo",
    category: "Categoría",
    depth: "Profundidad",
    count: "Cantidad",
    all: "Todos",
    allCategory: "Todas",
    any: "Cualquiera",
    generate: "Generar",
    spinning: "Girando...",
    noTopicsTitle: "No se encontraron temas",
    noTopicsBody:
      "Prueba a ampliar los filtros: elige menos categorías o un modo diferente para descubrir más temas.",
    clickPrompt: "para obtener tu tema al azar!",
    clickGenerate: "Haz clic en",
    depthLight: "Ligero",
    depthMedium: "Medio",
    depthDeep: "Profundo",
  },
  card: {
    copy: "Copiar tema",
    copied: "Copiado",
    saveFav: "Guardar en favoritos",
    removeFav: "Quitar de favoritos",
  },
  party: {
    firstPrompt: "Pulsa el botón para obtener tu primera pregunta",
    generate: "Generar",
    next: "Siguiente Pregunta",
    copy: "📋 Copiar",
    copied: "✅ Copiado",
    printDeck: "🖨️ Imprimir mazo",
    deckInfo: "preguntas en este mazo · sin repeticiones hasta verlas todas",
  },
  wheel: {
    title: "Gira la Ruleta",
    subtitle:
      "Gira la ruleta y deja que el azar elija tu tema: 16 categorías, un resultado aleatorio cada vez.",
    spin: "Girar la Ruleta",
    spinning: "Girando...",
    spinAgain: "Girar de Nuevo",
    landedOn: "Cayó en",
  },
  footer: {
    generators: "Generadores",
    categories: "Categorías",
    moreCategories: "Más Categorías",
    about: "Acerca de",
    aboutUs: "Sobre Nosotros",
    privacy: "Política de Privacidad",
    terms: "Términos del Servicio",
    press: "Prensa y Medios",
    allCategories: "Todas las Categorías",
    topicCollections: "Colecciones de Temas",
    funnyTopics: "Temas Divertidos",
    embedWidget: "Insertar este Widget",
    tagline: "Generador de temas al azar gratuito para todos.",
    argumentGenerator: "Generador de Argumentos",
    tableTopics: "Table Topics",
    impromptuSpeech: "Discurso Improvisado",
    questionGenerator: "Generador de Preguntas",
    wouldYouRather: "Qué Prefieres",
    neverHaveIEver: "Yo Nunca",
    spinTheWheel: "Gira la Ruleta",
  },
  breadcrumb: { home: "Inicio" },
  print: {
    defaultLabel: "🖨️ Guardar como PDF",
    footerNote: (n) => `Imprimible gratis de randomtopics.app — ${n} preguntas. Genera más en randomtopics.app`,
  },
};

const DICTS: Record<Locale, UIDict> = { en, es };

export function getDict(locale: Locale): UIDict {
  return DICTS[locale] || en;
}

// --- Mode & category label translations (types.ts holds the English source) ---

export const MODE_LABELS: Record<Locale, Record<Mode, { label: string; short: string; description: string }>> = {
  en: {
    conversation: { label: "Conversation Starters", short: "Conversation", description: "Break the ice and keep conversations flowing" },
    writing: { label: "Writing Prompts", short: "Writing", description: "Spark your creativity with unique writing ideas" },
    debate: { label: "Debate Topics", short: "Debate", description: "Explore both sides of thought-provoking issues" },
    speech: { label: "Speech Topics", short: "Speech", description: "Find the perfect topic for your next presentation" },
    icebreaker: { label: "Icebreakers", short: "Icebreakers", description: "Fun questions to get any group talking" },
  },
  es: {
    conversation: { label: "Iniciadores de Conversación", short: "Conversación", description: "Rompe el hielo y mantén la conversación fluida" },
    writing: { label: "Ideas para Escribir", short: "Escribir", description: "Despierta tu creatividad con ideas de escritura únicas" },
    debate: { label: "Temas de Debate", short: "Debate", description: "Explora ambos lados de cuestiones que invitan a reflexionar" },
    speech: { label: "Temas para Discursos", short: "Discursos", description: "Encuentra el tema perfecto para tu próxima presentación" },
    icebreaker: { label: "Rompehielos", short: "Rompehielos", description: "Preguntas divertidas para hacer hablar a cualquier grupo" },
  },
};

export const CATEGORY_LABELS: Record<Locale, Record<Category, { label: string; description: string }>> = {
  en: {
    science: { label: "Science", description: "Explore the wonders of scientific discovery" },
    technology: { label: "Technology", description: "Discuss the latest in tech and innovation" },
    philosophy: { label: "Philosophy", description: "Ponder life's deepest questions" },
    psychology: { label: "Psychology", description: "Understand the human mind and behavior" },
    history: { label: "History", description: "Learn from the events that shaped our world" },
    "art-culture": { label: "Art & Culture", description: "Explore creative expression across cultures" },
    "food-travel": { label: "Food & Travel", description: "Discover cuisines and destinations worldwide" },
    relationships: { label: "Relationships", description: "Navigate human connections and communication" },
    education: { label: "Education", description: "Rethink how we learn and teach" },
    politics: { label: "Politics", description: "Examine governance and civic life" },
    entertainment: { label: "Entertainment", description: "Dive into movies, music, and pop culture" },
    sports: { label: "Sports", description: "Celebrate athleticism and competition" },
    business: { label: "Business", description: "Explore entrepreneurship and economics" },
    nature: { label: "Nature", description: "Connect with the natural world" },
    health: { label: "Health", description: "Discuss wellness, fitness, and wellbeing" },
    "weird-fun": { label: "Weird & Fun", description: "Embrace the wonderfully bizarre" },
  },
  es: {
    science: { label: "Ciencia", description: "Explora las maravillas del descubrimiento científico" },
    technology: { label: "Tecnología", description: "Habla sobre lo último en tecnología e innovación" },
    philosophy: { label: "Filosofía", description: "Reflexiona sobre las preguntas más profundas de la vida" },
    psychology: { label: "Psicología", description: "Comprende la mente y el comportamiento humano" },
    history: { label: "Historia", description: "Aprende de los acontecimientos que dieron forma a nuestro mundo" },
    "art-culture": { label: "Arte y Cultura", description: "Explora la expresión creativa entre culturas" },
    "food-travel": { label: "Comida y Viajes", description: "Descubre cocinas y destinos de todo el mundo" },
    relationships: { label: "Relaciones", description: "Navega las conexiones humanas y la comunicación" },
    education: { label: "Educación", description: "Repiensa cómo aprendemos y enseñamos" },
    politics: { label: "Política", description: "Examina la gobernanza y la vida cívica" },
    entertainment: { label: "Entretenimiento", description: "Sumérgete en el cine, la música y la cultura pop" },
    sports: { label: "Deportes", description: "Celebra el atletismo y la competición" },
    business: { label: "Negocios", description: "Explora el emprendimiento y la economía" },
    nature: { label: "Naturaleza", description: "Conecta con el mundo natural" },
    health: { label: "Salud", description: "Habla sobre bienestar, forma física y salud" },
    "weird-fun": { label: "Raro y Divertido", description: "Abraza lo maravillosamente extraño" },
  },
};
