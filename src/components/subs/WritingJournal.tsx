"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PracticeRequestError, speechClient } from "@/lib/speech/client";
import { readLocal, subFetch, trackSub, trackSubUsage, writeLocal } from "@/lib/subs/client";
import { BACKFILL_DAYS, FREE_ENTRIES, MAX_BODY, daysBetween, promptForDay } from "@/lib/subs/journal";
import SubPaywall from "./SubPaywall";
import { useSubPlan } from "./useSubPlan";

interface Entry { day: string; prompt: string; body: string; updated_at: string }
interface Totals { entries: number; streak: number }
interface ListResult { today: string; entries: Entry[]; totals: Totals; access: boolean; freeLeft: number | null }
interface SaveResult { ok: true; totals: Totals; access: boolean; freeLeft: number | null }

const card = "rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5";
const primary = "rounded-full bg-[#f4ecdf] px-5 py-2.5 font-bold text-[#14110f] hover:opacity-90 disabled:opacity-60";
const ghost = "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60";
const draftKey = (day: string) => `journal-draft-${day}`;

function browserDay() {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
const browserZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; } };
function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}
function shiftMonth(month: string, n: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
const dayLabel = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export default function WritingJournal() {
  const plan = useSubPlan("journal");
  const [today, setToday] = useState<string | null>(null);
  const [editDay, setEditDay] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [month, setMonth] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [totals, setTotals] = useState<Totals>({ entries: 0, streak: 0 });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<"limit" | "export" | null>(null);
  const [email, setEmail] = useState("");
  const [mailBusy, setMailBusy] = useState(false);
  const [mailMessage, setMailMessage] = useState<string | null>(null);
  const [known, setKnown] = useState<Record<string, Entry>>({});
  const [ready, setReady] = useState(false);
  const loadedDay = useRef<string | null>(null);

  useEffect(() => {
    const t = browserDay();
    setToday(t);
    setEditDay(t);
    setMonth(t.slice(0, 7));
  }, []);

  const load = useCallback(async (m: string) => {
    try {
      const res = await subFetch<ListResult>("journal", { action: "list", month: m, timeZone: browserZone() });
      if (!res) return;
      setEntries(res.entries);
      setTotals(res.totals);
      setKnown((k) => { const next = { ...k }; for (const e of res.entries) next[e.day] = e; return next; });
    } catch { /* a failed read keeps what is on screen */ }
    setReady(true);
  }, []);

  useEffect(() => { if (month) void load(month); }, [month, load, plan.active]);

  // Fill the editor when the day being edited changes: saved entry, else the local draft.
  useEffect(() => {
    if (!editDay || loadedDay.current === editDay) return;
    const saved = known[editDay];
    const draft = readLocal<string>(draftKey(editDay), "");
    setText(draft || saved?.body || "");
    if (saved || draft || ready) loadedDay.current = editDay;
  }, [editDay, known, ready]);

  const prompt = useMemo(() => (editDay ? promptForDay(editDay) : ""), [editDay]);
  const existing = editDay ? known[editDay] : undefined;
  const limitReached = !plan.active && totals.entries >= FREE_ENTRIES && !existing;
  const freeLeft = Math.max(0, FREE_ENTRIES - totals.entries);
  const guest = !plan.status || plan.status.guest;

  const change = (value: string) => {
    setText(value);
    setMessage(null);
    if (editDay) writeLocal(draftKey(editDay), value);
  };

  const save = async () => {
    if (!editDay || busy) return;
    if (!text.trim()) { setMessage("Write something first."); return; }
    setBusy(true);
    setMessage(null);
    try {
      const first = !readLocal<boolean>("journal-started", false);
      const res = await subFetch<SaveResult>("journal", { action: "save", day: editDay, body: text, timeZone: browserZone() }, true);
      if (!res) throw new Error("Please try again.");
      if (first) { trackSub("journal", "trial_start"); writeLocal("journal-started", true); }
      trackSubUsage("journal_entry_saved", "journal", { entries: res.totals.entries });
      try { localStorage.removeItem(draftKey(editDay)); } catch { /* storage may be blocked */ }
      setTotals(res.totals);
      setKnown((k) => ({ ...k, [editDay]: { day: editDay, prompt, body: text, updated_at: new Date().toISOString() } }));
      setPaywall(null);
      setMessage(editDay === today ? "Saved. See you tomorrow." : "Saved.");
      if (month) await load(month);
      void plan.refresh();
    } catch (error) {
      if (error instanceof PracticeRequestError && error.status === 402) {
        setPaywall("limit");
        setMessage("Your words are still here — they're kept on this device.");
      } else {
        setMessage(error instanceof Error && error.message ? error.message : "Could not save. Your words are kept on this device — try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async (day: string) => {
    if (!window.confirm(`Delete the entry for ${dayLabel(day)}?`)) return;
    try {
      const res = await subFetch<SaveResult>("journal", { action: "delete", day, timeZone: browserZone() });
      if (res) setTotals(res.totals);
      setKnown((k) => { const next = { ...k }; delete next[day]; return next; });
      if (day === editDay) { loadedDay.current = null; setText(""); }
      if (month) await load(month);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete. Please try again.");
    }
  };

  const link = async (existingAccount: boolean) => {
    if (!email.includes("@")) { setMailMessage("Enter your email address."); return; }
    setMailBusy(true);
    setMailMessage(null);
    try {
      const auth = (await speechClient()).auth;
      const redirect = `${window.location.origin}/writing-journal`;
      if (!existingAccount) {
        const { data: { session } } = await auth.getSession();
        if (!session) { setMailMessage("Save your first entry, then add your email."); return; }
      }
      const result = existingAccount
        ? await auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirect } })
        : await auth.updateUser({ email }, { emailRedirectTo: redirect });
      if (result.error) throw result.error;
      setMailMessage("Check your email and tap the link to finish. Your entries will follow you to any device.");
    } catch {
      setMailMessage(existingAccount
        ? "Could not send a sign-in link. Check the address and try again later."
        : "Could not link this email. If you already have an account, use “I already have an account”.");
    } finally {
      setMailBusy(false);
    }
  };

  const exportMonth = async () => {
    if (!month) return;
    if (!plan.active) { setPaywall("export"); return; }
    const win = window.open("", "_blank");
    if (!win) { setMessage("Allow pop-ups to export, or try again."); return; }
    try {
      const res = await subFetch<ListResult>("journal", { action: "list", month, timeZone: browserZone() });
      const list = [...(res?.entries ?? [])].sort((a, b) => a.day.localeCompare(b.day));
      const body = list.length
        ? list.map((e) => `<section><h2>${escapeHtml(dayLabel(e.day))}, ${e.day.slice(0, 4)}</h2><p class="prompt">${escapeHtml(e.prompt)}</p><div class="body">${escapeHtml(e.body)}</div></section>`).join("")
        : "<p>No entries this month.</p>";
      win.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Journal — ${escapeHtml(monthLabel(month))}</title><style>body{font:16px/1.6 Georgia,serif;max-width:680px;margin:2rem auto;padding:0 1rem;color:#111}h1{font-size:1.6rem}h2{font-size:1.1rem;margin:0 0 .2rem}section{margin:0 0 1.6rem;break-inside:avoid-page}.prompt{margin:0 0 .5rem;font-style:italic;color:#555}.body{white-space:pre-wrap}@media print{body{margin:0}}</style></head><body><h1>Journal — ${escapeHtml(monthLabel(month))}</h1>${body}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    } catch {
      win.close();
      setMessage("Could not prepare the export. Please try again.");
    }
  };

  if (!today || !editDay) return <div className={card} aria-busy="true"><p className="opacity-70">Loading today’s prompt…</p></div>;
  const editable = daysBetween(editDay, today) <= BACKFILL_DAYS;
  const showPaywall = paywall === "export" ? true : paywall === "limit" || limitReached;

  return (
    <div className="space-y-5 text-left">
      <section className={card} aria-labelledby="journal-prompt">
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">{editDay === today ? "Today’s prompt" : `Prompt for ${dayLabel(editDay)}`}</p>
        <h2 id="journal-prompt" className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{prompt}</h2>
        <textarea
          value={text}
          onChange={(e) => change(e.target.value)}
          maxLength={MAX_BODY}
          readOnly={!editable}
          rows={9}
          aria-label="Your journal entry"
          placeholder="Start writing. No one else can read this."
          className="mt-4 w-full rounded-xl border border-white/15 bg-black/20 p-3 text-base leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className={primary} disabled={busy || !editable} onClick={save}>{busy ? "Saving…" : existing ? "Update entry" : "Save entry"}</button>
          {editDay !== today && <button type="button" className={ghost} onClick={() => { loadedDay.current = null; setEditDay(today); }}>Back to today</button>}
          <span className="text-sm opacity-70">{text.length.toLocaleString("en-US")} / {MAX_BODY.toLocaleString("en-US")}</span>
        </div>
        {message && <p className="mt-2 text-sm" role="status">{message}</p>}
        {plan.message && <p className="mt-2 text-sm" role="status">{plan.message}</p>}
        {!plan.active && !limitReached && plan.state === "free" && (
          <p className="mt-2 text-xs opacity-70">{freeLeft > 0 ? `${freeLeft} of ${FREE_ENTRIES} free entries left. Reading and editing saved entries stays free.` : "Reading and editing saved entries stays free."}</p>
        )}
      </section>

      {showPaywall && (
        <SubPaywall
          product="journal"
          note={paywall === "export" ? "Exporting a month as a PDF is part of the plan. Your entries stay saved and readable." : "You've written 3 free entries. Your entries stay saved and readable."}
        />
      )}

      <section className="grid grid-cols-2 gap-3" aria-label="Writing stats">
        <div className={card}><p className="text-3xl font-bold">{totals.streak}</p><p className="text-sm opacity-70">day writing streak</p></div>
        <div className={card}><p className="text-3xl font-bold">{totals.entries}</p><p className="text-sm opacity-70">{totals.entries === 1 ? "entry written" : "entries written"}</p></div>
      </section>

      <section className={card} aria-labelledby="journal-entries">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="journal-entries" className="text-lg font-bold">{month ? monthLabel(month) : "Entries"}</h2>
          <div className="flex gap-2">
            <button type="button" className={ghost} aria-label="Previous month" onClick={() => month && setMonth(shiftMonth(month, -1))}>←</button>
            <button type="button" className={ghost} aria-label="Next month" disabled={!month || month >= today.slice(0, 7)} onClick={() => month && setMonth(shiftMonth(month, 1))}>→</button>
            <button type="button" className={ghost} onClick={exportMonth}>Export month as PDF</button>
          </div>
        </div>
        {entries.length === 0 ? (
          <p className="mt-3 text-sm opacity-70">No entries this month yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-white/10">
            {entries.map((e) => (
              <li key={e.day} className="py-3">
                <p className="text-sm font-bold">{dayLabel(e.day)}</p>
                <p className="text-xs italic opacity-70">{e.prompt}</p>
                <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm">{e.body}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className={ghost} onClick={() => { loadedDay.current = null; setEditDay(e.day); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                    {daysBetween(e.day, today) <= BACKFILL_DAYS ? "Edit" : "Read"}
                  </button>
                  <button type="button" className={ghost} onClick={() => remove(e.day)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {guest ? (
        <section className={card} aria-labelledby="journal-email">
          <h2 id="journal-email" className="text-lg font-bold">Keep my journal on any device</h2>
          <p className="mt-1 text-sm opacity-80">Add your email so your entries sync to your phone and laptop and survive a cleared browser. No password — just a link.</p>
          <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void link(false); }}>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/20 p-3 text-base" />
            <button className={primary} disabled={mailBusy}>Add my email</button>
          </form>
          <button type="button" className="mt-2 text-sm underline opacity-80" disabled={mailBusy} onClick={() => void link(true)}>I already have an account — email me a sign-in link</button>
          {mailMessage && <p className="mt-2 text-sm" role="status">{mailMessage}</p>}
        </section>
      ) : plan.status?.email ? (
        <p className="text-sm opacity-70">Synced to {plan.status.email}.</p>
      ) : null}
    </div>
  );
}
