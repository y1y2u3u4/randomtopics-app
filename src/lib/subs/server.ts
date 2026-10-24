import "server-only";
import { actor } from "@/lib/speech/server";
import { billingConfiguration, billingManagementReady } from "@/lib/speech/billing";
import { subAccess } from "./purchases";

/** Signed-in (or guest) caller plus the billing mode, for the product APIs. */
export async function subContext(request: Request) {
  const { db, user } = await actor(request);
  const livemode = billingManagementReady() ? billingConfiguration().livemode : true;
  return { db, user, livemode, access: (userIds: string | string[] = user.id) => subAccess(db, userIds, livemode) };
}

/** Today's date (YYYY-MM-DD) in an IANA time zone; falls back to UTC. */
export function localDay(timeZone: string, at = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(at);
  } catch {
    return at.toISOString().slice(0, 10);
  }
}

export function validTimeZone(value: unknown): string | null {
  if (typeof value !== "string" || value.length < 1 || value.length > 64) return null;
  try { new Intl.DateTimeFormat("en-US", { timeZone: value }); return value; } catch { return null; }
}
