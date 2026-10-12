import { lookup } from 'node:dns/promises';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { parsePageMeta } from '@/lib/citations/lookup';
import { ipBlocked, urlAllowed } from '@/lib/citations/safeUrl';

// Reads citation metadata from a public web page for the citation generators.
// Only the parsed fields are returned; nothing is stored or logged.
const MAX_BYTES = 1_500_000;
const MAX_HOPS = 3;
// Local proxies resolve every host to the 198.18/15 benchmark range.
const ALLOW_BENCHMARK = process.env.NODE_ENV !== 'production';

async function resolvesPublic(host: string): Promise<boolean> {
  try {
    const addrs = await lookup(host, { all: true, verbatim: true });
    return addrs.length > 0 && addrs.every((a) => !ipBlocked(a.address, ALLOW_BENCHMARK));
  } catch {
    return false;
  }
}

async function readLimited(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    chunks.push(value);
    if (size > MAX_BYTES) { await reader.cancel(); break; }
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks));
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 'cite-url', { limit: 20, windowSeconds: 60 });
  if (limited) return limited;
  let target = urlAllowed(request.nextUrl.searchParams.get('url') ?? '');
  if (!target) return NextResponse.json({ error: 'Enter a public http(s) web address.' }, { status: 400 });
  try {
    for (let hop = 0; hop <= MAX_HOPS; hop++) {
      if (!(await resolvesPublic(target.hostname))) return NextResponse.json({ error: 'That address is not a public web page.' }, { status: 400 });
      const res = await fetch(target, {
        redirect: 'manual',
        signal: AbortSignal.timeout(7000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RandomTopicsCitation/1.0; +https://randomtopics.app)', Accept: 'text/html,application/xhtml+xml' },
      });
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        const next = urlAllowed(new URL(res.headers.get('location') as string, target).toString());
        if (!next) return NextResponse.json({ error: 'That page redirects somewhere we cannot read.' }, { status: 400 });
        target = next;
        continue;
      }
      if (!res.ok) return NextResponse.json({ error: `The page answered ${res.status}. Fill in the fields by hand.` }, { status: 502 });
      if (!/html|xml/i.test(res.headers.get('content-type') ?? '')) return NextResponse.json({ error: 'That address is not a web page (try the DOI or ISBN instead).' }, { status: 415 });
      const html = await readLimited(res);
      return NextResponse.json({ meta: parsePageMeta(html, target.toString()) }, { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } });
    }
    return NextResponse.json({ error: 'Too many redirects.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Could not reach that page. Fill in the fields by hand.' }, { status: 502 });
  }
}
