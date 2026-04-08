/**
 * Mapping of categories to their most relevant SEO articles.
 * Used for internal linking on category pages.
 */
export const categoryToArticles: Record<string, { title: string; href: string }[]> = {
  science: [
    { title: "40 Fascinating Science Discussion Topics", href: "/topics/science-discussion-topics" },
    { title: "50 Ethical Dilemma Questions", href: "/topics/ethical-dilemma-questions" },
    { title: "65 Presentation Ideas for School", href: "/topics/presentation-ideas-for-school" },
  ],
  technology: [
    { title: "75 Debate Topics for Students", href: "/topics/debate-topics-for-students" },
    { title: "55 Controversial Topics to Discuss", href: "/topics/controversial-topics-to-discuss" },
    { title: "75 Speech Topics for College", href: "/topics/speech-topics-for-college-students" },
  ],
  philosophy: [
    { title: "50 Deep Philosophical Questions", href: "/topics/deep-philosophical-questions" },
    { title: "50 Ethical Dilemma Questions", href: "/topics/ethical-dilemma-questions" },
    { title: "55 Controversial Topics to Discuss", href: "/topics/controversial-topics-to-discuss" },
  ],
  psychology: [
    { title: "60 Deep Questions for Your Partner", href: "/topics/deep-questions-to-ask-your-partner" },
    { title: "50 Deep Philosophical Questions", href: "/topics/deep-philosophical-questions" },
    { title: "65 Get to Know You Questions", href: "/topics/get-to-know-you-questions-for-adults" },
  ],
  history: [
    { title: "75 Speech Topics for College", href: "/topics/speech-topics-for-college-students" },
    { title: "65 Presentation Ideas for School", href: "/topics/presentation-ideas-for-school" },
    { title: "60 Random Essay Topics for College", href: "/topics/random-essay-topics-for-college" },
  ],
  "art-culture": [
    { title: "40 Creative Writing Prompts for Kids", href: "/topics/writing-prompts-for-kids" },
    { title: "65 Presentation Ideas for School", href: "/topics/presentation-ideas-for-school" },
    { title: "75 Speech Topics for College", href: "/topics/speech-topics-for-college-students" },
  ],
  "food-travel": [
    { title: "65 Funny Conversation Topics", href: "/topics/funny-conversation-topics" },
    { title: "60 Conversation Starters for Couples", href: "/topics/conversation-starters-for-couples" },
    { title: "65 Get to Know You Questions", href: "/topics/get-to-know-you-questions-for-adults" },
  ],
  relationships: [
    { title: "60 Conversation Starters for Couples", href: "/topics/conversation-starters-for-couples" },
    { title: "60 Deep Questions for Your Partner", href: "/topics/deep-questions-to-ask-your-partner" },
    { title: "70 Random Questions to Ask Friends", href: "/topics/random-questions-to-ask-friends" },
  ],
  education: [
    { title: "75 Debate Topics for Students", href: "/topics/debate-topics-for-students" },
    { title: "50 Debate Topics for Middle School", href: "/topics/debate-topics-for-middle-school" },
    { title: "40 Creative Writing Prompts for Kids", href: "/topics/writing-prompts-for-kids" },
  ],
  politics: [
    { title: "55 Controversial Topics to Discuss", href: "/topics/controversial-topics-to-discuss" },
    { title: "75 Debate Topics for Students", href: "/topics/debate-topics-for-students" },
    { title: "50 Ethical Dilemma Questions", href: "/topics/ethical-dilemma-questions" },
  ],
  entertainment: [
    { title: "65 Funny Conversation Topics", href: "/topics/funny-conversation-topics" },
    { title: "80 Would You Rather Questions", href: "/topics/would-you-rather-questions" },
    { title: "70 Random Questions to Ask Friends", href: "/topics/random-questions-to-ask-friends" },
  ],
  sports: [
    { title: "75 Speech Topics for College", href: "/topics/speech-topics-for-college-students" },
    { title: "50 Team Building Questions", href: "/topics/team-building-questions" },
    { title: "65 Get to Know You Questions", href: "/topics/get-to-know-you-questions-for-adults" },
  ],
  business: [
    { title: "50 Team Building Questions", href: "/topics/team-building-questions" },
    { title: "55 Icebreaker Questions for Virtual Meetings", href: "/topics/icebreaker-questions-for-virtual-meetings" },
    { title: "50 Icebreaker Questions for Work", href: "/topics/icebreaker-questions-for-work" },
  ],
  nature: [
    { title: "40 Science Discussion Topics", href: "/topics/science-discussion-topics" },
    { title: "50 Ethical Dilemma Questions", href: "/topics/ethical-dilemma-questions" },
    { title: "65 Presentation Ideas for School", href: "/topics/presentation-ideas-for-school" },
  ],
  health: [
    { title: "60 Deep Questions for Your Partner", href: "/topics/deep-questions-to-ask-your-partner" },
    { title: "50 Deep Philosophical Questions", href: "/topics/deep-philosophical-questions" },
    { title: "40 Science Discussion Topics", href: "/topics/science-discussion-topics" },
  ],
  "weird-fun": [
    { title: "65 Funny Conversation Topics", href: "/topics/funny-conversation-topics" },
    { title: "80 Would You Rather Questions", href: "/topics/would-you-rather-questions" },
    { title: "70 Random Questions to Ask Friends", href: "/topics/random-questions-to-ask-friends" },
  ],
};

/**
 * Mapping of article slugs to relevant mode and category pages.
 * Used for internal linking on article pages.
 */
export const articleToPages: Record<string, { modes: string[]; categories: string[] }> = {
  "debate-topics-for-students": { modes: ["debate"], categories: ["education", "politics", "technology"] },
  "conversation-starters-for-couples": { modes: ["conversation", "icebreaker"], categories: ["relationships", "psychology"] },
  "icebreaker-questions-for-work": { modes: ["icebreaker"], categories: ["business"] },
  "writing-prompts-for-kids": { modes: ["writing"], categories: ["education", "art-culture"] },
  "funny-conversation-topics": { modes: ["conversation"], categories: ["weird-fun", "entertainment"] },
  "deep-philosophical-questions": { modes: ["conversation", "debate"], categories: ["philosophy"] },
  "speech-topics-for-college-students": { modes: ["speech"], categories: ["education", "politics"] },
  "would-you-rather-questions": { modes: ["icebreaker", "conversation"], categories: ["weird-fun", "entertainment"] },
  "controversial-topics-to-discuss": { modes: ["debate", "conversation"], categories: ["politics", "philosophy"] },
  "esl-conversation-topics": { modes: ["conversation"], categories: ["education"] },
  "team-building-questions": { modes: ["icebreaker"], categories: ["business"] },
  "science-discussion-topics": { modes: ["debate", "conversation"], categories: ["science", "nature"] },
  "ethical-dilemma-questions": { modes: ["debate"], categories: ["philosophy", "politics"] },
  "presentation-ideas-for-school": { modes: ["speech"], categories: ["education", "science"] },
  "random-questions-to-ask-friends": { modes: ["conversation", "icebreaker"], categories: ["relationships", "weird-fun"] },
  "debate-topics-for-middle-school": { modes: ["debate"], categories: ["education"] },
  "icebreaker-questions-for-virtual-meetings": { modes: ["icebreaker"], categories: ["business"] },
  "random-essay-topics-for-college": { modes: ["writing"], categories: ["education"] },
  "toastmasters-table-topics": { modes: ["speech"], categories: ["business", "education"] },
  "get-to-know-you-questions-for-adults": { modes: ["icebreaker", "conversation"], categories: ["relationships"] },
  "deep-questions-to-ask-your-partner": { modes: ["conversation"], categories: ["relationships", "psychology"] },
  "impromptu-speech-topics-with-timer": { modes: ["speech"], categories: ["education", "business"] },
  "first-date-conversation-topics": { modes: ["conversation", "icebreaker"], categories: ["relationships"] },
  "debate-topics-for-beginners": { modes: ["debate"], categories: ["education"] },
  "questions-to-ask-at-a-party": { modes: ["icebreaker", "conversation"], categories: ["entertainment", "weird-fun"] },
  "public-speaking-topics-for-beginners": { modes: ["speech"], categories: ["education"] },
  "conversation-topics-for-teens": { modes: ["conversation"], categories: ["education", "relationships"] },
  "couples-game-night-questions": { modes: ["conversation", "icebreaker"], categories: ["relationships", "entertainment"] },
};
