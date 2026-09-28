import { z } from 'zod';
import { CATEGORIES, DEPTHS, MODES } from '@/data/types';
import { topics } from '@/data/topics';
import { drawUnseen, filterTopicPool } from '@/lib/topicPool';

export const topicRequest = z.object({
  count: z.number().int().min(1).max(10).default(1),
  mode: z.enum(MODES.map(item => item.id)).nullable().default(null),
  category: z.enum(CATEGORIES.map(item => item.id)).nullable().default(null),
  depth: z.enum(DEPTHS.map(item => item.id)).nullable().default(null),
}).strict();

/** Public topic draws never make a billable model request, including old clients. */
export function generateTopicsFromLibrary(input: z.infer<typeof topicRequest>) {
  const pool = filterTopicPool(topics, input);
  return {
    topics: drawUnseen(pool, new Set(), topic => topic.id, input.count).picked,
    source: 'curated_pool' as const,
    availableCount: pool.length,
  };
}
