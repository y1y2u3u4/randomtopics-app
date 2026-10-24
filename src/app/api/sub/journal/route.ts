import type { NextRequest } from "next/server";
import { failure, readJson, response, SpeechError } from "@/lib/speech/server";
import { rateLimit } from "@/lib/rateLimit";
import { localDay, subContext, validTimeZone } from "@/lib/subs/server";
import { canSave, freeLeft, isDay, isMonth, promptForDay, streak, validateEntry, addDays } from "@/lib/subs/journal";

// Daily Writing Journal. One entry per user per day, stored in journal_entries.
// The prompt kept with an entry is always computed here, never taken from the client.
type Body = { action?: unknown; month?: unknown; day?: unknown; body?: unknown; timeZone?: unknown };

export async function POST(request: Request) {
  try {
    const { db, user, access } = await subContext(request);
    const body = (await readJson(request).catch(() => ({}))) as Body;
    const today = localDay(validTimeZone(body.timeZone) ?? "UTC");

    const totals = async () => {
      const { count, error } = await db.from("journal_entries").select("day", { count: "exact", head: true }).eq("user_id", user.id);
      if (error) throw error;
      const { data, error: dayError } = await db.from("journal_entries").select("day").eq("user_id", user.id).order("day", { ascending: false }).limit(400);
      if (dayError) throw dayError;
      const entries = count ?? 0;
      return { entries, streak: streak((data ?? []).map((r: { day: string }) => r.day), today) };
    };

    if (body.action === "list") {
      let query = db.from("journal_entries").select("day, prompt, body, updated_at").eq("user_id", user.id).order("day", { ascending: false });
      if (body.month !== undefined && body.month !== null) {
        if (!isMonth(body.month)) throw new SpeechError(400, "Choose a valid month.");
        const start = `${body.month}-01`;
        const next = addDays(`${body.month}-28`, 4).slice(0, 7) + "-01";
        query = query.gte("day", start).lt("day", next);
      } else {
        query = query.limit(60);
      }
      const { data, error } = await query;
      if (error) throw error;
      const t = await totals();
      const hasPlan = (await access()).journal === true;
      return response({ today, entries: data ?? [], totals: t, access: hasPlan, freeLeft: hasPlan ? null : freeLeft(t.entries) });
    }

    if (body.action === "save") {
      const limited = rateLimit(request as NextRequest, "sub-journal-save", { limit: 40, windowSeconds: 60 });
      if (limited) return limited;
      const check = validateEntry({ day: body.day, body: body.body }, today);
      if (!check.ok) throw new SpeechError(400, check.error);
      const day = body.day as string;
      const { data: existing, error: existingError } = await db.from("journal_entries").select("day").eq("user_id", user.id).eq("day", day).maybeSingle();
      if (existingError) throw existingError;
      const t = await totals();
      const hasPlan = (await access()).journal === true;
      if (!canSave({ hasPlan, isNewDay: !existing, entryCount: t.entries })) {
        return response({ error: "You've used your 3 free entries.", paywall: true, freeLeft: 0 }, 402);
      }
      const { error } = await db.from("journal_entries").upsert(
        { user_id: user.id, day, prompt: promptForDay(day), body: check.body, updated_at: new Date().toISOString() },
        { onConflict: "user_id,day" },
      );
      if (error) throw error;
      const after = await totals();
      return response({ ok: true, day, prompt: promptForDay(day), totals: after, access: hasPlan, freeLeft: hasPlan ? null : freeLeft(after.entries) });
    }

    if (body.action === "delete") {
      if (!isDay(body.day)) throw new SpeechError(400, "Choose a valid day.");
      const { error } = await db.from("journal_entries").delete().eq("user_id", user.id).eq("day", body.day);
      if (error) throw error;
      const t = await totals();
      const hasPlan = (await access()).journal === true;
      return response({ ok: true, totals: t, access: hasPlan, freeLeft: hasPlan ? null : freeLeft(t.entries) });
    }

    throw new SpeechError(400, "Unknown action.");
  } catch (error) {
    return failure(error);
  }
}
