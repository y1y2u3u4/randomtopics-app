// "Next list" at the end of long list pages (2026-11-06): each list page points at one
// neighbouring list in the same scene, so a finished list becomes another page view
// (and, with AdDocumentBoundary, another fresh ad document) instead of an exit.
// Only public, non-child-directed lists belong here; ring order = reading order per scene.
import AD_PUBLIC_PATHS from "@/data/adPublicPaths.json";

export type NextList = { href: string; label: string };

export const LIST_RINGS: string[][] = [
  // party games
  ["truth-or-dare-questions", "never-have-i-ever-questions", "most-likely-to-questions", "would-you-rather-questions", "this-or-that-questions",
    "two-truths-and-a-lie-ideas", "questions-to-ask-at-a-party", "random-questions-to-ask-friends", "couples-game-night-questions"],
  // conversation
  ["funny-conversation-topics", "conversation-topics-for-teens", "first-date-conversation-topics", "conversation-starters-for-couples",
    "deep-questions-to-ask-your-partner", "get-to-know-you-questions-for-adults", "random-topics-to-talk-about-with-friends",
    "esl-conversation-topics", "book-club-questions"],
  // work
  ["team-building-questions", "icebreaker-questions-for-work", "icebreaker-questions-for-virtual-meetings", "workplace-ethical-dilemmas"],
  // speaking, debate, thinking
  ["toastmasters-table-topics", "impromptu-speech-topics-with-timer", "public-speaking-topics-for-beginners", "speech-topics-for-college-students",
    "debate-topics-for-beginners", "controversial-topics-to-discuss", "science-discussion-topics", "psychology-topics-to-talk-about",
    "random-essay-topics-for-college", "ethical-dilemma-questions", "ethical-dilemmas-for-adults", "deep-philosophical-questions"],
];

// Question-list tools whose full list lives on a /topics page.
const TOOL_TO_LIST: Record<string, string> = {
  "/would-you-rather": "would-you-rather-questions",
  "/this-or-that": "this-or-that-questions",
  "/truth-or-dare": "truth-or-dare-questions",
  "/never-have-i-ever": "never-have-i-ever-questions",
  "/most-likely-to": "most-likely-to-questions",
  "/hot-seat-questions": "random-questions-to-ask-friends",
  "/philosophical-questions": "deep-philosophical-questions",
};

const PUBLIC = new Set<string>(AD_PUBLIC_PATHS);
const LOWER = new Set(["a", "an", "and", "at", "for", "of", "or", "the", "to", "with", "in", "on"]);
function humanize(slug: string) {
  return slug.split("-").map((w, i) => (i > 0 && LOWER.has(w) ? w : w[0].toUpperCase() + w.slice(1))).join(" ").replace(/\bEsl\b/, "ESL");
}

/** The list that follows `path`, or null when the page is not part of a ring. Only returns public sitemap paths. */
export function nextList(path: string): NextList | null {
  const es = path.startsWith("/es/");
  const bare = es ? path.slice(3) : path;
  const isTopic = bare.startsWith("/topics/");
  const slug = isTopic ? bare.slice("/topics/".length) : TOOL_TO_LIST[bare];
  if (!slug) return null;
  const ring = LIST_RINGS.find((r) => r.includes(slug));
  if (!ring) return null;
  const prefix = es ? "/es/topics/" : "/topics/";
  // A topic page points at the list after it; a tool page points at its own full list first.
  const from = isTopic ? ring.indexOf(slug) : ring.indexOf(slug) - 1;
  for (let step = 1; step <= ring.length; step++) {
    const candidate = ring[(from + step + ring.length) % ring.length];
    if (candidate === slug && isTopic) continue;
    const href = prefix + candidate;
    if (PUBLIC.has(href)) return { href, label: humanize(candidate) };
  }
  return null;
}
