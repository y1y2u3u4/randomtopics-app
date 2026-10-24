import type { NextRequest } from "next/server";
import { randomInt } from "node:crypto";
import { failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { rateLimit } from "@/lib/rateLimit";
import { subContext } from "@/lib/subs/server";
import { addHistory, cleanListName, cleanNames, keepDrawn, makeGroups, pickNext, wheelAllowed } from "@/lib/subs/wheel";

// Class Roster Wheel Pro: saved class lists with no-repeat picks, groups and history (wheel_lists).
type Body = { action?: unknown; id?: unknown; name?: unknown; names?: unknown; size?: unknown };
type Row = { id: string; name: string; names: string[]; drawn: string[]; history: unknown[]; updated_at: string };

const COLUMNS = "id, name, names, drawn, history, updated_at";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const rand = () => randomInt(0, 1_000_000) / 1_000_000;
const paywall = (error: string) => response({ error, paywall: true }, 402);

export async function POST(request: Request) {
  try {
    const { db, user, access } = await subContext(request);
    const body = (await readJson(request).catch(() => ({}))) as Body;
    const lists = async () => {
      const { data, error } = await db.from("wheel_lists").select(COLUMNS).eq("user_id", user.id).order("updated_at", { ascending: false }).limit(50);
      if (error) throw error;
      return (data ?? []) as Row[];
    };
    const hasPlan = async () => (await access()).wheel === true;

    if (body.action === "list") return response({ lists: await lists(), access: await hasPlan() });

    const limited = rateLimit(request as NextRequest, "sub-wheel", { limit: 60, windowSeconds: 60 });
    if (limited) return limited;

    if (body.action === "save") {
      const name = cleanListName(body.name);
      const names = cleanNames(body.names);
      if (!name) throw new SpeechError(400, "Give the list a name.");
      if (names.length < 2) throw new SpeechError(400, "Add at least 2 names.");
      const now = new Date().toISOString();
      if (body.id === undefined || body.id === null) {
        const all = await lists();
        if (!wheelAllowed("create", await hasPlan(), all.length)) return paywall("Saving more than one class list needs Wheel Pro.");
        const { data, error } = await db.from("wheel_lists").insert({ user_id: user.id, name, names, updated_at: now }).select(COLUMNS).single();
        if (error) throw error;
        return response({ list: data, first: all.length === 0 });
      }
      if (typeof body.id !== "string" || !UUID.test(body.id)) throw new SpeechError(400, "Choose a list.");
      const { data: row, error: rowError } = await db.from("wheel_lists").select(COLUMNS).eq("id", body.id).eq("user_id", user.id).maybeSingle();
      if (rowError) throw rowError;
      if (!row) throw new SpeechError(404, "List not found.");
      const { data, error } = await db.from("wheel_lists").update({ name, names, drawn: keepDrawn(names, (row as Row).drawn), updated_at: now }).eq("id", body.id).eq("user_id", user.id).select(COLUMNS).single();
      if (error) throw error;
      return response({ list: data });
    }

    if (typeof body.id !== "string" || !UUID.test(body.id)) throw new SpeechError(400, "Choose a list.");
    const { data: found, error: findError } = await db.from("wheel_lists").select(COLUMNS).eq("id", body.id).eq("user_id", user.id).maybeSingle();
    if (findError) throw findError;
    if (!found) throw new SpeechError(404, "List not found.");
    const row = found as Row;
    const now = new Date().toISOString();
    const write = async (patch: Partial<Row>) => {
      const { data, error } = await db.from("wheel_lists").update({ ...patch, updated_at: now }).eq("id", row.id).eq("user_id", user.id).select(COLUMNS).single();
      if (error) throw error;
      return data as Row;
    };

    if (body.action === "pick") {
      const result = pickNext(row.names, row.drawn, rand);
      if (!result) throw new SpeechError(400, "Add names first.");
      const list = await write({ drawn: result.drawn, history: addHistory(row.history, { at: now, pick: result.pick }) });
      return response({ list, pick: result.pick, newRound: result.newRound, left: result.left });
    }
    if (body.action === "groups") {
      if (!wheelAllowed("groups", await hasPlan(), 0)) return paywall("Random groups need Wheel Pro.");
      const groups = makeGroups(row.names, Number(body.size), rand);
      const list = await write({ history: addHistory(row.history, { at: now, groups }) });
      return response({ list, groups });
    }
    if (body.action === "reset") return response({ list: await write({ drawn: [] }) });
    if (body.action === "delete") {
      const { error } = await db.from("wheel_lists").delete().eq("id", row.id).eq("user_id", user.id);
      if (error) throw error;
      return response({ deleted: row.id });
    }
    throw new SpeechError(400, "Unknown action.");
  } catch (error) {
    return failure(error);
  }
}
