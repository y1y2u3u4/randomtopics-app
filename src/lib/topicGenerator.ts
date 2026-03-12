import { Category, Mode, Depth } from '@/data/types';

export interface GeneratedTopic {
  id: string;
  text: string;
  category: Category;
  modes: Mode[];
  depth: Depth;
  talkingPoints: string[];
}

export interface GenerateTopicsResult {
  topics: GeneratedTopic[];
}

const VALID_CATEGORIES: Category[] = [
  'science', 'technology', 'philosophy', 'psychology', 'history',
  'art-culture', 'food-travel', 'relationships', 'education', 'politics',
  'entertainment', 'sports', 'business', 'nature', 'health', 'weird-fun'
];

const VALID_MODES: Mode[] = ['conversation', 'writing', 'debate', 'speech', 'icebreaker'];
const VALID_DEPTHS: Depth[] = ['light', 'medium', 'deep'];

export async function generateTopicsWithAI(
  count: number = 1,
  mode: Mode | null = null,
  category: Category | null = null,
  depth: Depth | null = null
): Promise<GenerateTopicsResult> {
  const modeInstruction = mode
    ? `All topics must be suitable for "${mode}" mode.`
    : 'Assign 2-3 suitable modes from [conversation, writing, debate, speech, icebreaker] to each topic.';

  const categoryInstruction = category
    ? `All topics must belong to the "${category}" category.`
    : `Assign each topic a category from: ${VALID_CATEGORIES.join(', ')}`;

  const depthInstruction = depth
    ? `All topics must be "${depth}" depth level. Light = casual/fun, Medium = requires some thought, Deep = complex/philosophical.`
    : 'Assign each topic a depth: "light" (casual), "medium" (moderate thought), or "deep" (complex/philosophical).';

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://randomtopics.app',
      'X-Title': 'Random Topic Generator'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `You are a creative topic generator that produces engaging, thought-provoking discussion topics.
Generate ${count} unique topic(s) that are interesting, specific, and inspire real conversation.

${modeInstruction}
${categoryInstruction}
${depthInstruction}

Each topic needs:
- "text": A compelling topic statement or question (10-20 words). Be specific, not generic. Bad: "Social media" Good: "Should social media platforms be required to verify users' real identities?"
- "category": One of the valid categories
- "modes": Array of 2-3 suitable modes from [conversation, writing, debate, speech, icebreaker]
- "depth": One of "light", "medium", "deep"
- "talkingPoints": Exactly 3 specific discussion angles or sub-questions

Return ONLY a JSON object: { "topics": [...] }
No additional text or markdown.`
        },
        {
          role: 'user',
          content: `Generate ${count} random topic${count > 1 ? 's' : ''}${mode ? ` for ${mode}` : ''}${category ? ` about ${category}` : ''}${depth ? ` (${depth} depth)` : ''}.`
        }
      ],
      temperature: 0.9,
      max_tokens: count * 300 + 200
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to generate topics');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content generated');
  }

  let jsonContent = content.trim();
  if (jsonContent.startsWith('```')) {
    jsonContent = jsonContent.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  const parsed = JSON.parse(jsonContent);
  const rawTopics = parsed.topics || (Array.isArray(parsed) ? parsed : []);

  const topics: GeneratedTopic[] = rawTopics.map((t: any, i: number) => ({
    id: `ai-${Date.now()}-${i}`,
    text: String(t.text || ''),
    category: VALID_CATEGORIES.includes(t.category) ? t.category : 'weird-fun',
    modes: Array.isArray(t.modes)
      ? t.modes.filter((m: string) => VALID_MODES.includes(m as Mode))
      : ['conversation'],
    depth: VALID_DEPTHS.includes(t.depth) ? t.depth : 'medium',
    talkingPoints: Array.isArray(t.talkingPoints)
      ? t.talkingPoints.slice(0, 4).map(String)
      : [],
  }));

  return { topics };
}
