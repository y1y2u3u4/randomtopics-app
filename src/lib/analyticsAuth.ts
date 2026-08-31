import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ANALYTICS_SESSION_COOKIE = "rt_analytics_session";
export const ANALYTICS_SESSION_MAX_AGE = 60 * 60 * 24 * 90;

function getDashboardSecret(): string | null {
  const secret = process.env.ANALYTICS_DASHBOARD_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}
function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function isAnalyticsAuthConfigured(): boolean {
  return getDashboardSecret() !== null;
}

export function verifyDashboardSecret(candidate: string): boolean {
  const secret = getDashboardSecret();
  if (!secret || candidate.length > 512) return false;
  return safeEqual(candidate, secret);
}

export function createAnalyticsSession(): string {
  const secret = getDashboardSecret();
  if (!secret) throw new Error("analytics_auth_not_configured");

  const expiresAt = Math.floor(Date.now() / 1000) + ANALYTICS_SESSION_MAX_AGE;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifyAnalyticsSession(value?: string): boolean {
  if (!value) return false;
  const secret = getDashboardSecret();
  if (!secret) return false;

  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  return safeEqual(parts[2], signPayload(payload, secret));
}

export async function hasAnalyticsSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAnalyticsSession(
    cookieStore.get(ANALYTICS_SESSION_COOKIE)?.value
  );
}
