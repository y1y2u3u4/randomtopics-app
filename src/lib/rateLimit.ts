import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

let cleanupInterval: ReturnType<typeof setInterval> | null = null;
function ensureCleanup() {
  if (!cleanupInterval) {
    cleanupInterval = setInterval(cleanup, 60_000);
  }
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

export function rateLimit(
  req: NextRequest,
  prefix: string,
  config: RateLimitConfig
): NextResponse | null {
  ensureCleanup();

  const ip = getClientIP(req);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
    return null;
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  entry.count++;
  return null;
}
