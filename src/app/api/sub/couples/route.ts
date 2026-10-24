import type { NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { rateLimit } from "@/lib/rateLimit";
import { localDay, subContext, validTimeZone } from "@/lib/subs/server";
import {
  canAnswerToday, cleanAnswer, coupleLang, dayIndex, daysBothAnswered, isMember, joinCheck, questionForDay,
  roomCode, shapeToday, streak, trialDaysLeft, trialOpen, validCode, type CoupleLang,
} from "@/lib/subs/couples";

const HISTORY_PAGE = 20;

interface Room { id: string; code: string; owner_id: string; partner_id: string | null; lang: CoupleLang; timezone: string; created_at: string }
const ROOM_COLUMNS = "id,code,owner_id,partner_id,lang,timezone,created_at";

async function roomOf(db: SupabaseClient, userId: string): Promise<Room | null> {
  const { data, error } = await db.from("couple_rooms").select(ROOM_COLUMNS)
    .or(`owner_id.eq.${userId},partner_id.eq.${userId}`).order("created_at", { ascending: false }).limit(1);
  if (error) throw error;
  return ((data ?? [])[0] as Room | undefined) ?? null;
}

async function roomByCode(db: SupabaseClient, code: string): Promise<Room | null> {
  const { data, error } = await db.from("couple_rooms").select(ROOM_COLUMNS).eq("code", code).maybeSingle();
  if (error) throw error;
  return (data as Room | null) ?? null;
}

/** The caller's room: the code when given (members only), otherwise their own room. */
async function memberRoom(db: SupabaseClient, userId: string, code: unknown): Promise<Room> {
  const room = code === undefined || code === "" ? await roomOf(db, userId) : await (async () => { const c = validCode(code); return c ? roomByCode(db, c) : null; })();
  if (!room || !isMember(room, userId)) throw new SpeechError(404, "We could not find your room. Start one, or open the invite link again.");
  return room;
}

function publicRoom(room: Room, userId: string) {
  return { code: room.code, lang: room.lang, owner: room.owner_id === userId, partnerJoined: Boolean(room.partner_id), createdAt: room.created_at };
}

async function today(db: SupabaseClient, room: Room, userId: string, access: (ids: string[]) => Promise<Record<string, boolean>>) {
  const day = localDay(room.timezone);
  const index = dayIndex(room.created_at, day, room.timezone);
  const [todayRows, streakRows, plan] = await Promise.all([
    db.from("couple_answers").select("user_id,answer").eq("room_id", room.id).eq("day", day),
    db.from("couple_answers").select("day,user_id").eq("room_id", room.id).order("day", { ascending: false }).limit(1500),
    access([room.owner_id, room.partner_id].filter((x): x is string => Boolean(x))),
  ]);
  if (todayRows.error) throw todayRows.error;
  if (streakRows.error) throw streakRows.error;
  const trial = trialOpen(room.created_at, day, room.timezone);
  const hasPlan = Boolean(plan.couples);
  const shaped = shapeToday((todayRows.data ?? []) as { user_id: string; answer: string }[], userId);
  return {
    room: publicRoom(room, userId),
    day,
    dayNumber: index + 1,
    question: questionForDay(room.id, index, room.lang),
    ...shaped,
    streak: streak(daysBothAnswered((streakRows.data ?? []) as { day: string; user_id: string }[]), day),
    trial,
    trialDaysLeft: trialDaysLeft(room.created_at, day, room.timezone),
    access: hasPlan,
    canAnswer: canAnswerToday(trial, hasPlan),
  };
}

export async function POST(request: Request) {
  try {
    const { db, user, access } = await subContext(request);
    const body = (await readJson(request).catch(() => ({}))) as { action?: unknown; code?: unknown; answer?: unknown; lang?: unknown; timeZone?: unknown; before?: unknown };
    const action = body.action;
    const planOf = async (ids: string[]) => (await access(ids)) as unknown as Record<string, boolean>;

    if (action === "create") {
      const limited = rateLimit(request as NextRequest, "couples-create", { limit: 10, windowSeconds: 3600 });
      if (limited) return limited;
      const existing = await roomOf(db, user.id);
      if (existing) return response(await today(db, existing, user.id, planOf));
      const timezone = validTimeZone(body.timeZone) ?? "UTC";
      for (let attempt = 0; attempt < 4; attempt++) {
        const { data, error } = await db.from("couple_rooms").insert({ code: roomCode(), owner_id: user.id, lang: coupleLang(body.lang), timezone }).select(ROOM_COLUMNS).single();
        if (!error) return response({ ...(await today(db, data as Room, user.id, planOf)), created: true });
        if (error.code !== "23505") throw error;
        const raced = await roomOf(db, user.id);
        if (raced) return response(await today(db, raced, user.id, planOf));
      }
      throw new SpeechError(503, "We could not create the room. Please try again.");
    }

    if (action === "join") {
      // Codes are 62^12: guessing is hopeless, but keep attempts slow anyway.
      const limited = rateLimit(request as NextRequest, "couples-join", { limit: 12, windowSeconds: 600 });
      if (limited) return limited;
      const code = validCode(body.code);
      const room = code ? await roomByCode(db, code) : null;
      const mine = room ? await roomOf(db, user.id) : null;
      const ownsOther = Boolean(mine && room && mine.id !== room.id);
      const verdict = joinCheck(room, user.id, ownsOther);
      if (!verdict.ok) return response({ error: verdict.error }, verdict.status);
      let joined = room!;
      if (!verdict.already) {
        const { data, error } = await db.from("couple_rooms").update({ partner_id: user.id }).eq("id", room!.id).is("partner_id", null).select(ROOM_COLUMNS).maybeSingle();
        if (error) throw error;
        if (!data) return response({ error: "This room already has two people." }, 409);
        joined = data as Room;
      }
      return response({ ...(await today(db, joined, user.id, planOf)), joined: !verdict.already });
    }

    if (action === "today") {
      const found = body.code === undefined || body.code === "" ? await roomOf(db, user.id) : await memberRoom(db, user.id, body.code);
      if (!found) return response({ room: null });
      return response(await today(db, found, user.id, planOf));
    }

    if (action === "answer") {
      const limited = rateLimit(request as NextRequest, "couples-answer", { limit: 30, windowSeconds: 600 });
      if (limited) return limited;
      const text = cleanAnswer(body.answer);
      if (!text) return response({ error: "Write between 1 and 2000 characters." }, 400);
      const room = await memberRoom(db, user.id, body.code);
      const day = localDay(room.timezone);
      const trial = trialOpen(room.created_at, day, room.timezone);
      if (!trial) {
        const plan = await planOf([room.owner_id, room.partner_id].filter((x): x is string => Boolean(x)));
        if (!canAnswerToday(trial, Boolean(plan.couples))) return response({ paywall: true, error: "The free 3 days are over. Choose a plan to keep answering together." }, 402);
      }
      const { error } = await db.from("couple_answers").insert({ room_id: room.id, day, user_id: user.id, answer: text });
      if (error) {
        if (error.code === "23505") return response({ error: "You already answered today." }, 409);
        throw error;
      }
      return response(await today(db, room, user.id, planOf));
    }

    if (action === "history") {
      const room = await memberRoom(db, user.id, body.code);
      const day = localDay(room.timezone);
      const before = typeof body.before === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.before) && body.before < day ? body.before : day;
      const { data, error } = await db.from("couple_answers").select("day,user_id,answer").eq("room_id", room.id).lt("day", before).order("day", { ascending: false }).limit(400);
      if (error) throw error;
      const rows = (data ?? []) as { day: string; user_id: string; answer: string }[];
      const days = daysBothAnswered(rows).reverse();
      const page = days.slice(0, HISTORY_PAGE);
      const items = page.map((d) => {
        const shaped = shapeToday(rows.filter((r) => r.day === d), user.id);
        return { day: d, question: questionForDay(room.id, dayIndex(room.created_at, d, room.timezone), room.lang), mine: shaped.answers!.mine, theirs: shaped.answers!.theirs };
      });
      const hasMore = days.length > HISTORY_PAGE || rows.length === 400;
      return response({ items, hasMore, next: items.length ? items[items.length - 1].day : null });
    }

    return response({ error: "Unknown action." }, 400);
  } catch (error) {
    return failure(error);
  }
}
