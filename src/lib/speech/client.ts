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
) {
  const auth = (await speechClient()).auth;
  let {
    data: { session },
  } = await auth.getSession();
  if (!session) {
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
