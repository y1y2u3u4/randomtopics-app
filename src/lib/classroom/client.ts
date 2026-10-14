"use client";
import { PracticeRequestError, speechClient } from "@/lib/speech/client";
import { track } from "@/lib/track";
import type { ClassroomPurchase } from "./catalog";

export type ClassroomEvent = "classroom_pack_card_view" | "classroom_pack_checkout_start" | "classroom_pack_purchase" | "classroom_present_open" | "classroom_pack_checkout_error" | "classroom_pack_download";

export function trackClassroom(event: ClassroomEvent, params: { pack?: string; page?: string; value?: number; access?: string; format?: string; status_code?: number }) {
  const safe: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "number" && Number.isFinite(v)) safe[k] = v;
    if (typeof v === "string" && /^[a-z0-9/_-]{1,80}$/.test(v)) safe[k] = v;
  }
  track(event, safe);
}

/** Session token, creating a guest session only when `create` is set (checkout). */
async function session(create: boolean) {
  const auth = (await speechClient()).auth;
  const { data } = await auth.getSession();
  if (data.session || !create) return data.session;
  const result = await auth.signInAnonymously();
  if (result.error || !result.data.session) throw new PracticeRequestError("We could not start a secure checkout. Please try again.", false, 503);
  return result.data.session;
}

export async function classroomFetch(path: string, init: { body?: unknown; create?: boolean; optional?: boolean } = {}) {
  const current = await session(init.create === true).catch((error) => { if (init.optional) return null; throw error; });
  if (!current && !init.optional) throw new PracticeRequestError("Open this page in the browser you bought with, or use the sign-in link we emailed you.", false, 401);
  const res = await fetch(`/api/classroom/${path}`, {
    method: init.body ? "POST" : "GET",
    headers: { ...(current ? { Authorization: `Bearer ${current.access_token}` } : {}), "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new PracticeRequestError(result.error || "Please try again.", false, res.status);
  }
  return res;
}

export async function startClassroomCheckout(pack: ClassroomPurchase, page: string) {
  trackClassroom("classroom_pack_checkout_start", { pack, page });
  try {
    const res = await classroomFetch("checkout", { body: { pack }, create: true });
    const { url } = await res.json();
    try { sessionStorage.setItem("rt_classroom_checkout", pack); } catch { /* optional */ }
    window.location.assign(url);
  } catch (error) {
    const status = (error as { status?: number }).status;
    trackClassroom("classroom_pack_checkout_error", { pack, page, ...(typeof status === "number" ? { status_code: status } : {}) });
    throw error;
  }
}

export async function downloadClassroom(pack: string, format: "pptx" | "pdf") {
  const res = await classroomFetch(`download?pack=${encodeURIComponent(pack)}&format=${format}`);
  const { url } = await res.json();
  trackClassroom("classroom_pack_download", { pack, format });
  window.location.assign(url); // Signed, short-lived link; the file downloads as an attachment.
}
