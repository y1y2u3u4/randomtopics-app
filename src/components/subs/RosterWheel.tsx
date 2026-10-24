"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PracticeRequestError } from "@/lib/speech/client";
import { readLocal, subFetch, trackSub, trackSubUsage, writeLocal } from "@/lib/subs/client";
import SubPaywall from "./SubPaywall";
import { useSubPlan } from "./useSubPlan";

interface WheelPick { at: string; pick?: string; groups?: string[][] }
interface WheelList { id: string; name: string; names: string[]; drawn: string[]; history: WheelPick[]; updated_at: string }

const UI = {
  en: {
    heading: "Class roster wheel",
    sub: "Paste your class list and pick a student at random. Free, nothing to install.",
    names: "Names (one per line or comma-separated)",
    placeholder: "Ava\nBen\nCarlos\nDiana",
    pick: "Pick a name",
    noRepeat: "Skip names already picked",
    left: (n: number) => `${n} left this round`,
    round: "Everyone had a turn — new round.",
    listName: "List name",
    listPlaceholder: "Period 2",
    save: "Save to the cloud",
    saved: "Saved — open it on any device.",
    update: "Save changes",
    lists: "Your lists",
    newList: "New list",
    groups: "Make groups of",
    makeGroups: "Make groups",
    history: "Pick history",
    reset: "Start a new round",
    remove: "Delete list",
    pro: "Wheel Pro",
    active: "Wheel Pro active · no ads",
    free: "Free: one saved list with no-repeat picks and history. Wheel Pro adds more lists and random groups.",
    paywallNote: "Your first saved list stays free. Wheel Pro unlocks more lists and random groups.",
    groupLabel: (i: number) => `Group ${i}`,
    needTwo: "Add at least 2 names.",
    error: "Something went wrong. Please try again.",
  },
  es: {
    heading: "Ruleta de nombres para la clase",
    sub: "Pega la lista de tu clase y elige un alumno al azar. Gratis, sin instalar nada.",
    names: "Nombres (uno por línea o separados por comas)",
    placeholder: "Ana\nBruno\nCarlos\nDiana",
    pick: "Elegir un nombre",
    noRepeat: "No repetir nombres ya elegidos",
    left: (n: number) => `Quedan ${n} en esta ronda`,
    round: "Ya salieron todos: nueva ronda.",
    listName: "Nombre de la lista",
    listPlaceholder: "2.º B",
    save: "Guardar en la nube",
    saved: "Guardada: ábrela en cualquier dispositivo.",
    update: "Guardar cambios",
    lists: "Tus listas",
    newList: "Lista nueva",
    groups: "Hacer grupos de",
    makeGroups: "Hacer grupos",
    history: "Historial",
    reset: "Empezar nueva ronda",
    remove: "Borrar lista",
    pro: "Wheel Pro",
    active: "Wheel Pro activo · sin anuncios",
    free: "Gratis: una lista guardada con elecciones sin repetir e historial. Wheel Pro añade más listas y grupos al azar.",
    paywallNote: "Tu primera lista guardada sigue gratis. Wheel Pro desbloquea más listas y grupos al azar.",
    groupLabel: (i: number) => `Grupo ${i}`,
    needTwo: "Añade al menos 2 nombres.",
    error: "Algo salió mal. Inténtalo de nuevo.",
  },
};

function parseNames(text: string) {
  const seen = new Set<string>();
  return text.split(/[\n,]/).map((n) => n.replace(/\s+/g, " ").trim()).filter((n) => {
    const k = n.toLowerCase();
    if (!n || seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 300);
}

export default function RosterWheel({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = UI[locale];
  const plan = useSubPlan("wheel", locale === "es"
    ? { thanks: "Wheel Pro activado. ¡Gracias!", pending: "Aún no pudimos confirmar el pago. Si pagaste, recarga la página en un minuto." }
    : { thanks: "Wheel Pro is on — thank you!", pending: "We could not confirm the payment yet. If you paid, reload this page in a minute." });
  const [text, setText] = useState("");
  const [listName, setListName] = useState("");
  const [noRepeat, setNoRepeat] = useState(true);
  const [localDrawn, setLocalDrawn] = useState<string[]>([]);
  const [pick, setPick] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [lists, setLists] = useState<WheelList[]>([]);
  const [current, setCurrent] = useState<WheelList | null>(null);
  const [groups, setGroups] = useState<string[][] | null>(null);
  const [size, setSize] = useState(4);
  const [busy, setBusy] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const section = useRef<HTMLElement>(null);
  const opened = useRef(false);

  useEffect(() => { setText(readLocal("rt_roster_names", "")); }, []);

  useEffect(() => {
    const el = section.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { trackSub("wheel", "entry_view", { entry_page: location.pathname, locale }); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [locale]);

  const refresh = useCallback(async () => {
    const res = await subFetch<{ lists: WheelList[] }>("wheel", { action: "list" }).catch(() => null);
    if (res) setLists(res.lists);
  }, []);
  useEffect(() => { void refresh(); }, [refresh, plan.active]);

  // The Pro panel counts as the product's landing view; the click that opens it is the entry click.
  const openPro = () => {
    if (opened.current) return;
    opened.current = true;
    trackSub("wheel", "entry_click", { entry_page: location.pathname, locale });
    trackSub("wheel", "landing_view", { entry_page: location.pathname, locale });
  };

  const names = current ? current.names : parseNames(text);
  const drawn = current ? current.drawn : localDrawn;
  const left = names.filter((n) => !drawn.includes(n)).length;

  const run = async <T,>(fn: () => Promise<T>) => {
    setBusy(true);
    setNote(null);
    try { return await fn(); }
    catch (error) {
      if (error instanceof PracticeRequestError && error.status === 402) setPaywall(true);
      else setNote(error instanceof Error && error.message ? error.message : t.error);
      return null;
    } finally { setBusy(false); }
  };

  const pickName = async () => {
    setGroups(null);
    if (names.length < 2) { setNote(t.needTwo); return; }
    if (current) {
      const res = await run(() => subFetch<{ list: WheelList; pick: string; newRound: boolean }>("wheel", { action: "pick", id: current.id }));
      if (!res) return;
      setCurrent(res.list);
      setPick(res.pick);
      if (res.newRound) setNote(t.round);
      return;
    }
    let pool = noRepeat ? names.filter((n) => !localDrawn.includes(n)) : names;
    let base = noRepeat ? localDrawn : [];
    if (!pool.length) { pool = names; base = []; setNote(t.round); } else setNote(null);
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setPick(chosen);
    setLocalDrawn(noRepeat ? [...base, chosen] : []);
  };

  const save = async () => {
    openPro();
    const clean = parseNames(text);
    if (clean.length < 2) { setNote(t.needTwo); return; }
    const name = listName.trim() || t.listPlaceholder;
    const res = await run(() => subFetch<{ list: WheelList; first?: boolean }>("wheel", { action: "save", id: current?.id ?? null, name, names: clean }, true));
    if (!res) return;
    if (res.first && !plan.active) trackSub("wheel", "trial_start", { locale });
    trackSubUsage("wheel_list_saved", "wheel", { names: clean.length, locale });
    setCurrent(res.list);
    setNote(t.saved);
    await refresh();
  };

  const makeGroups = async () => {
    openPro();
    if (!current) { await save(); return; }
    const res = await run(() => subFetch<{ list: WheelList; groups: string[][] }>("wheel", { action: "groups", id: current.id, size }));
    if (!res) return;
    setCurrent(res.list);
    setGroups(res.groups);
    setPick(null);
  };

  const choose = (list: WheelList | null) => {
    setCurrent(list);
    setText(list ? list.names.join("\n") : "");
    setListName(list ? list.name : "");
    setPick(null);
    setGroups(null);
    setNote(null);
    setPaywall(false);
  };

  const action = async (name: "reset" | "delete") => {
    if (!current) return;
    const res = await run(() => subFetch<{ list?: WheelList }>("wheel", { action: name, id: current.id }));
    if (!res) return;
    if (name === "delete") { choose(null); await refresh(); } else if (res.list) setCurrent(res.list);
  };

  return (
    <section ref={section} id="class-roster-wheel" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-xl font-bold sm:text-2xl">{t.heading}</h2>
          {plan.active && <span className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">{t.active}</span>}
        </div>
        <p className="mt-1 text-sm opacity-80">{t.sub}</p>
        {plan.message && <p className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-sm" role="status">{plan.message}</p>}

        {lists.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label={t.lists}>
            <span className="text-xs uppercase tracking-wide opacity-70">{t.lists}</span>
            {lists.map((l) => (
              <button key={l.id} type="button" onClick={() => choose(l)} aria-pressed={current?.id === l.id}
                className={`rounded-full px-3 py-1 text-sm ${current?.id === l.id ? "bg-[#f4ecdf] text-[#14110f] font-semibold" : "border border-white/15 hover:bg-white/10"}`}>{l.name}</button>
            ))}
            <button type="button" onClick={() => choose(null)} className="rounded-full border border-dashed border-white/25 px-3 py-1 text-sm hover:bg-white/10">+ {t.newList}</button>
          </div>
        )}

        <label className="mt-4 block text-sm font-semibold" htmlFor="roster-names">{t.names}</label>
        <textarea id="roster-names" rows={5} value={text} placeholder={t.placeholder}
          onChange={(e) => { setText(e.target.value); writeLocal("rt_roster_names", e.target.value); if (!current) setLocalDrawn([]); }}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 p-3 text-sm" />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={pickName} disabled={busy} className="rounded-full bg-[#f4ecdf] px-5 py-2 text-sm font-bold text-[#14110f] hover:opacity-90 disabled:opacity-50">🎯 {t.pick}</button>
          {!current && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={noRepeat} onChange={(e) => { setNoRepeat(e.target.checked); setLocalDrawn([]); }} /> {t.noRepeat}
            </label>
          )}
          {(current || noRepeat) && names.length > 1 && <span className="text-xs opacity-70">{t.left(left || names.length)}</span>}
        </div>

        {pick && <p className="mt-4 rounded-xl bg-white/10 p-4 text-center text-3xl font-extrabold" aria-live="polite">{pick}</p>}
        {note && <p className="mt-3 text-sm opacity-80" role="status">{note}</p>}

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-sm font-semibold">{t.pro}</p>
          <p className="mt-1 text-xs opacity-70">{t.free}</p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="text-sm">
              <span className="block text-xs opacity-70">{t.listName}</span>
              <input value={listName} onChange={(e) => setListName(e.target.value)} placeholder={t.listPlaceholder} maxLength={60}
                className="mt-1 rounded-lg border border-white/15 bg-black/20 px-2 py-1 text-sm" />
            </label>
            <button type="button" onClick={save} disabled={busy} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50">☁️ {current ? t.update : t.save}</button>
            <label className="text-sm">
              <span className="block text-xs opacity-70">{t.groups}</span>
              <input type="number" min={2} max={50} value={size} onChange={(e) => setSize(Number(e.target.value) || 2)}
                className="mt-1 w-16 rounded-lg border border-white/15 bg-black/20 px-2 py-1 text-sm" />
            </label>
            <button type="button" onClick={makeGroups} disabled={busy} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50">👥 {t.makeGroups}</button>
          </div>

          {paywall && !plan.active && <div className="mt-4"><SubPaywall product="wheel" locale={locale} note={t.paywallNote} /></div>}

          {groups && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {groups.map((g, i) => (
                <div key={i} className="rounded-xl border border-white/10 p-3 text-sm">
                  <p className="font-semibold">{t.groupLabel(i + 1)}</p>
                  <p className="mt-1 opacity-80">{g.join(", ")}</p>
                </div>
              ))}
            </div>
          )}

          {current && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <button type="button" onClick={() => action("reset")} className="underline opacity-80 hover:opacity-100">{t.reset}</button>
                <button type="button" onClick={() => action("delete")} className="underline opacity-80 hover:opacity-100">{t.remove}</button>
              </div>
              {current.history.length > 0 && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold">{t.history} ({current.history.length})</summary>
                  <ol className="mt-2 max-h-56 space-y-1 overflow-y-auto text-sm opacity-80">
                    {current.history.slice(0, 50).map((h, i) => (
                      <li key={`${h.at}-${i}`}>
                        <span className="opacity-60">{new Date(h.at).toLocaleString(locale === "es" ? "es" : "en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>{" "}
                        {h.pick ?? (h.groups ? h.groups.map((g) => g.join(", ")).join(" | ") : "")}
                      </li>
                    ))}
                  </ol>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
