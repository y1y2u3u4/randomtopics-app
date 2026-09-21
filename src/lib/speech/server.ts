import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { MODEL } from "./schema";
import { logSpeechFailure, type SpeechFailureStage } from "./diagnostics";

export class SpeechError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function speechReady() {
  return (
    process.env.SPEECH_COACH_ENABLED === "true" &&
    Boolean(
      process.env.OPENROUTER_API_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    )
  );
}
export function database() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new SpeechError(
      503,
      "Practice feedback is not available yet. Your recording stays on this device.",
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function actor(request: Request) {
  if (!speechReady())
    throw new SpeechError(503, "Practice feedback is not available yet.");
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ") || authorization.length > 12000)
    throw new SpeechError(401, "Please reconnect to your practice session.");
  const db = database();
  const { data, error } = await db.auth.getUser(authorization.slice(7));
  if (error || !data.user)
    throw new SpeechError(401, "Please reconnect to your practice session.");
  return { db, user: data.user };
}
export function response(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
export function failure(error: unknown) {
  // Do not log provider responses, transcripts, email addresses or credentials.
  return error instanceof SpeechError
    ? response({ error: error.message }, error.status)
    : response(
        {
          error:
            "We could not finish this request. Your recording is still available; please try again.",
        },
        503,
      );
}
export function networkHash(request: Request) {
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    "local";
  return createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(ip)
    .digest("hex");
}
export async function readJson(request: Request) {
  // Enforce a streamed bound, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) throw new SpeechError(400, "Missing request.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const part = await reader.read();
    if (part.done) break;
    bytes += part.value.length;
    if (bytes > 4_000_000) {
      await reader.cancel();
      throw new SpeechError(
        413,
        "This recording is too large. Please record up to two minutes.",
      );
    }
    chunks.push(part.value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new SpeechError(400, "Invalid request.");
  }
}
export async function modelCall<T>(
  schema: z.ZodType<T>,
  name: "speech_transcript" | "speech_feedback",
  instruction: string,
  content: unknown,
) {
  const started = Date.now();
  let stage: SpeechFailureStage = "model_request";
  let providerStatus: number | undefined;
  try {
    const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(55000),
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://randomtopics.app",
        "X-Title": "RandomTopics Speech Practice",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 4500,
        provider: { data_collection: "deny", require_parameters: true },
        messages: [
          { role: "system", content: instruction },
          { role: "user", content },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name,
            strict: true,
            schema: z.toJSONSchema(schema, { target: "draft-7" }),
          },
        },
      }),
    });
    providerStatus = result.status;
    if (!result.ok) {
      stage = "model_http";
      throw new SpeechError(
        503,
        "The coach is temporarily unavailable. Please try again.",
      );
    }
    stage = "response_json";
    const data = await result.json();
    stage = "content_json";
    const contentValue = JSON.parse(data.choices?.[0]?.message?.content ?? "null");
    stage = "model_schema";
    const value = schema.parse(contentValue);
    return {
      value,
      usage: data.usage ?? {},
      model: data.model ?? MODEL,
    };
  } catch (error) {
    if (stage === "model_request" && error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError")) stage = "model_timeout";
    logSpeechFailure(name === "speech_transcript" ? "transcribe" : "feedback", stage, Date.now() - started, providerStatus);
    throw error;
  }
}
