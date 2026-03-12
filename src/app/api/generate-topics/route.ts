import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { generateTopicsWithAI } from '@/lib/topicGenerator';
import { Category, Mode, Depth } from '@/data/types';

export async function POST(request: NextRequest) {
  // Rate limit: 15 requests per 60 seconds per IP
  const rateLimitResponse = rateLimit(request, 'generate-topics', {
    limit: 15,
    windowSeconds: 60,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { count = 1, mode = null, category = null, depth = null } = body;

    // Validate count (1-10)
    const validCount = Math.min(Math.max(1, Number(count) || 1), 10);

    const result = await generateTopicsWithAI(
      validCount,
      mode as Mode | null,
      category as Category | null,
      depth as Depth | null
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating topics:', error);
    return NextResponse.json(
      { error: 'Failed to generate topics. Please try again.' },
      { status: 500 }
    );
  }
}
