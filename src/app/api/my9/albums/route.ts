import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { fromDeezer, type DeezerAlbum } from '@/lib/generators/nineGrid';

// Album search/lookup for the My 9 Albums template. Deezer's API has no CORS,
// so this forwards the JSON only; covers are still hotlinked by the browser
// and nothing is stored. Responses are cached at the edge for a day.
const DEEZER = 'https://api.deezer.com';
const CACHE = { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' };

async function deezer(path: string): Promise<unknown> {
  const res = await fetch(`${DEEZER}${path}`, { signal: AbortSignal.timeout(6000), headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`deezer ${res.status}`);
  const json = await res.json();
  if (json && typeof json === 'object' && 'error' in json) throw new Error('deezer error');
  return json;
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, 'my9-albums', { limit: 90, windowSeconds: 60 });
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const q = (params.get('q') ?? '').trim().slice(0, 80);
  const ids = (params.get('ids') ?? '').split(',').map((id) => id.replace(/^d/, '')).filter((id) => /^\d{1,12}$/.test(id)).slice(0, 9);
  try {
    if (ids.length) {
      const albums = await Promise.all(ids.map((id) => deezer(`/album/${id}`).catch(() => null)));
      return NextResponse.json({ items: fromDeezer(albums.filter(Boolean) as DeezerAlbum[]) }, { headers: CACHE });
    }
    if (q.length < 2) return NextResponse.json({ items: [] }, { headers: CACHE });
    const json = (await deezer(`/search/album?${new URLSearchParams({ q, limit: '30' })}`)) as { data?: DeezerAlbum[] };
    return NextResponse.json({ items: fromDeezer(json.data ?? []).slice(0, 24) }, { headers: CACHE });
  } catch {
    // The client falls back to iTunes when this fails.
    return NextResponse.json({ items: [] }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
