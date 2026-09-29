"use client";
import { createClient } from "@supabase/supabase-js";
import type { Session } from "@supabase/supabase-js";
let client: ReturnType<typeof createClient> | undefined;
let configuration: Promise<{ url: string; key: string; billingAvailable: boolean }> | undefined;
let guestSession: Promise<Session> | undefined;
export class PracticeRequestError extends Error {
  constructor(
    message: string,
    public retryWithNewId = false,
    public status = 0,
  ) {
    super(message);
  }
}
export async function speechClient() {
  if (client) return client;
  const config = await speechConfiguration();
  return (client ??= createClient(config.url, config.key));
}
async function speechConfiguration() {
  configuration ??= fetch("/api/speech/config", { cache: "no-store" }).then(async res => {
    const config = await res.json();
    if (!res.ok || !config.url || !config.key) throw new Error("Practice feedback is not available yet.");
    return config as { url: string; key: string; billingAvailable: boolean };
  }).catch(error => { configuration = undefined; throw error; });
  return configuration;
}
export async function speechBillingAvailable() {
  return (await speechConfiguration()).billingAvailable === true;
}
export async function practiceFetch(
  path: string,
  body?: unknown,
  method?: string,
  options?: { existingSessionOnly?: boolean; timeoutMs?: number },
) {
  const auth = (await speechClient()).auth;
  let {
    data: { session },
  } = await auth.getSession();
  if (!session) {
    if (options?.existingSessionOnly) throw new PracticeRequestError("Reconnect this browser session or sign in with your linked email. Your saved practice has not been replaced.", false, 401);
    guestSession ??= auth
      .signInAnonymously()
      .then((result) => {
        if (result.error || !result.data.session)
          throw new Error(
            "We could not start your free session. Please try again later.",
          );
        return result.data.session;
      })
      .finally(() => {
        guestSession = undefined;
      });
    session = await guestSession;
  }
  const res = await fetch(`/api/speech/${path}`, {
    method: method ?? (body ? "POST" : "GET"),
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    ...(options?.timeoutMs ? { signal: AbortSignal.timeout(options.timeoutMs) } : {}),
  });
  const result = await res.json();
  if (!res.ok)
    throw new PracticeRequestError(
      result.error || "Please try again.",
      result.retryWithNewId === true,
      res.status,
    );
  return result;
}

// Explicit recovery never silently creates a new guest or changes the owner.
export async function reconnectSpeechSession() {
  const auth = (await speechClient()).auth;
  const { data: { session }, error } = await auth.getSession();
  if (error || !session) throw new PracticeRequestError("This session could not be restored. If you linked an email, sign in below. Guest practice cannot be recovered after its browser session is lost.", false, 401);
  const refreshed = await auth.refreshSession();
  if (refreshed.error || !refreshed.data.session) throw new PracticeRequestError("Could not reconnect this session. Try again, or sign in with your linked email.", false, 401);
  if (refreshed.data.session.user.id !== session.user.id) throw new PracticeRequestError("Your account changed. Review the practice and plan in this account before continuing.", false, 409);
}
