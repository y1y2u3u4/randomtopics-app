import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { generateTopicsFromLibrary, topicRequest } from '@/lib/topicGenerator';

const MAX_BODY_BYTES = 4096;
export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 'generate-topics', { limit: 15, windowSeconds: 60 });
  if (limited) return limited;

  // Bound streamed input too: old clients need only count and three enum filters.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: 'Invalid topic filters.' }, { status: 400 });
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: 'Request too large.' }, { status: 413 });
      }
      chunks.push(part.value);
    }
    const parsed = topicRequest.safeParse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid topic filters.' }, { status: 400 });
    return NextResponse.json(generateTopicsFromLibrary(parsed.data), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid topic request.' }, { status: 400 });
  } finally {
    reader.releaseLock();
  }
}
