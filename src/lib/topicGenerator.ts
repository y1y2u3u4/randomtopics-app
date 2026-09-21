import { Category, Mode, Depth } from '@/data/types';
import { z } from 'zod';

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
  count = Math.min(10, Math.max(1, Math.trunc(Number(count) || 1)));
  const schema = z.object({
    topics: z.array(z.object({
      text: z.string().trim().min(1),
      category: z.enum(VALID_CATEGORIES),
      modes: z.array(z.enum(VALID_MODES)).min(1).max(5),
      depth: z.enum(VALID_DEPTHS),
      talkingPoints: z.array(z.string().trim().min(1)).length(3),
    })).length(count),
  });
  const modeInstruction = mode
    ? `All topics must be suitable for "${mode}" mode.`
    : 'Assign 2-3 suitable modes from [conversation, writing, debate, speech, icebreaker] to each topic.';

  const categoryInstruction = category
    ? `All topics must belong to the "${category}" category.`
    : `Assign each topic a category from: ${VALID_CATEGORIES.join(', ')}`;

  const depthInstruction = depth
    ? `All topics must be "${depth}" depth level. Light = casual/fun, Medium = requires some thought, Deep = complex/philosophical.`
    : 'Assign each topic a depth: "light" (casual), "medium" (moderate thought), or "deep" (complex/philosophical).';

  const started = Date.now();
  const budgetMs = 45000;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const remainingMs = budgetMs - (Date.now() - started);
    if (remainingMs <= 0) throw new Error('topic_generation_timeout');
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(remainingMs),
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://randomtopics.app',
        'X-Title': 'Random Topic Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        provider: { require_parameters: true },
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'generated_topics',
            strict: true,
            schema: z.toJSONSchema(schema, { target: 'draft-7' }),
          },
        },
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
            content: `Generate ${count} random topic${count > 1 ? 's' : ''}${mode ? ` for ${mode}` : ''}${category ? ` about ${category}` : ''}${depth ? ` (${depth} depth)` : ''}.` + (attempt === 2 ? ' Return a fresh, complete JSON object matching the schema, without trailing commas or markdown.' : '')
          }
        ],
        temperature: attempt === 1 ? 0.9 : 0.3,
        max_tokens: count * 500 + 500
      })
    });

    // Provider/network failures and refusals do not trigger a second billable call.
    if (!response.ok) throw new Error(`topic_provider_http_${response.status}`);
    let refused = false;
    try {
      const data = await response.json();
      const choice = data.choices?.[0];
      refused = choice?.finish_reason === 'content_filter' || Boolean(choice?.message?.refusal);
      if (refused) throw new Error('topic_provider_refusal');
      const content = choice?.message?.content;
      if (typeof content !== 'string' || choice?.finish_reason === 'length') {
        throw new Error('topic_incomplete_output');
      }
      const jsonContent = content.trim().replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      const parsed: unknown = JSON.parse(jsonContent);
      const { topics } = schema.parse(Array.isArray(parsed) ? { topics: parsed } : parsed);
      return { topics: topics.map((topic, i) => ({ ...topic, id: `ai-${Date.now()}-${i}` })) };
    } catch {
      // Retry malformed output once within the same deadline; never log its contents.
      if (refused) throw new Error('topic_provider_refusal');
      if (attempt === 1 && budgetMs - (Date.now() - started) >= 5000) continue;
      throw new Error('topic_invalid_output');
    }
  }
  throw new Error('topic_invalid_output');
}
