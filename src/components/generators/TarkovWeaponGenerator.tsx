"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import {
  CLASSES, DEFAULT_OPTIONS, MAPS, WEAPONS, ammoLine, attSlotsFor, challengeById, classLabel, dailyKit, dateLabel, dayNumber,
  kitFromParams, kitText, kitToParams, mapById, rerollSlot, rollKit, weaponImg, weaponPool,
  type AmmoTier, type Kit, type KitOptions, type SlotKey, type Weapon, type WeaponClass,
} from "@/lib/tarkov";

const TOOL = "tarkov_random_weapon_generator";
const PAGE_URL = "https://randomtopics.app/tarkov-random-weapon-generator";
const ACCENT = "#c8b37a";
const INK = "#16130c";
const mono = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontVariantNumeric: "tabular-nums" as const };
const TIERS: { value: AmmoTier; label: string }[] = [
  { value: "any", label: "Any ammo" },
  { value: "budget", label: "Budget (low pen)" },
  { value: "meta", label: "Meta (high pen)" },
];
const TOGGLES: { key: "ammo" | "att" | "map" | "sidearm" | "melee"; label: string }[] = [
  { key: "ammo", label: "Ammo" },
  { key: "att", label: "Attachment rules" },
  { key: "map", label: "Map" },
  { key: "sidearm", label: "Sidearm" },
  { key: "melee", label: "Melee" },
];

const shareUrl = (kit: Kit) => `${PAGE_URL}?${kitToParams(kit).toString()}`;

function WeaponImage({ w, small = false }: { w: Weapon; small?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized 320px WebP renders mirrored from the EFT Wiki
    <img
      src={weaponImg(w)} alt={`${w.name} in-game render`} width={320} height={160} loading="lazy" decoding="async"
      className={`${small ? "h-12 w-24" : "h-28 w-full sm:h-36"} object-contain`}
      style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.55))" }}
    />
  );
}

function SlotRow({ label, slot, locked = false, onLock, onReroll, children }: { label: string; slot: SlotKey; locked?: boolean; onLock?: (s: SlotKey) => void; onReroll?: (s: SlotKey) => void; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 border-t border-white/10 px-4 py-2.5" data-tarkov-slot={slot}>
      <span className="w-20 shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]" style={mono}>{label}</span>
      <div className="min-w-0 flex-1 text-sm text-[var(--text-primary)]">{children}</div>
      {onLock && onReroll && <div className="flex shrink-0 gap-1">
        <button type="button" onClick={() => onReroll(slot)} disabled={locked} aria-label={`Reroll ${label}`} title={`Reroll ${label}`}
          className="rounded-md border border-white/15 px-2 py-1 text-xs disabled:opacity-30 hover:border-white/40">🎲</button>
        <button type="button" onClick={() => onLock(slot)} aria-pressed={locked} aria-label={`${locked ? "Unlock" : "Lock"} ${label}`} title={locked ? "Locked — kept on the next roll" : "Lock this slot"}
          className="rounded-md border px-2 py-1 text-xs"
          style={locked ? { background: ACCENT, color: INK, borderColor: ACCENT } : { borderColor: "rgba(255,255,255,0.15)" }}>{locked ? "🔒" : "🔓"}</button>
      </div>}
    </div>
  );
}

/** Read-only kit card used by the generator, the daily challenge and the server-rendered examples. */
export function KitCard({ kit, locked, onLock, onReroll, label = "Your loadout" }: { kit: Kit; locked?: Set<SlotKey>; onLock?: (s: SlotKey) => void; onReroll?: (s: SlotKey) => void; label?: string }) {
  const w = kit.weapon;
  const interactive = !!onLock && !!onReroll;
  const rp = (slot: SlotKey) => (interactive ? { slot, locked: !!locked?.has(slot), onLock, onReroll } : { slot });
  return (
    <article className="overflow-hidden rounded-2xl border text-left" data-tarkov-kit
      style={{ borderColor: "rgba(200,179,122,0.35)", background: "linear-gradient(160deg, rgba(200,179,122,0.10), rgba(14,14,20,0.94) 55%)" }}>
      <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]" style={mono}>
        <span>{label}</span><span>{classLabel(w.cls)}</span>
      </div>
      <div className="grid items-center gap-2 px-4 pb-3 sm:grid-cols-[1fr_1.1fr]">
        <WeaponImage w={w} />
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-2xl font-extrabold leading-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }} data-tarkov-weapon>{w.name}</h3>
            {w.cls !== "melee" ? (
              <p className="mt-1 text-xs text-[var(--text-secondary)]" style={mono}>{w.caliber}{w.modes ? ` · ${w.modes}` : ""}{w.rof ? ` · ${w.rof} rpm` : ""}</p>
            ) : <p className="mt-1 text-xs text-[var(--text-secondary)]">Melee-only run: no gun, no ammo.</p>}
          </div>
          {interactive && (
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => onReroll!("weapon")} disabled={locked?.has("weapon")} aria-label="Reroll weapon" title="Reroll weapon" className="rounded-md border border-white/15 px-2 py-1 text-xs disabled:opacity-30 hover:border-white/40">🎲</button>
              <button type="button" onClick={() => onLock!("weapon")} aria-pressed={!!locked?.has("weapon")} aria-label={`${locked?.has("weapon") ? "Unlock" : "Lock"} weapon`} className="rounded-md border px-2 py-1 text-xs"
                style={locked?.has("weapon") ? { background: ACCENT, color: INK, borderColor: ACCENT } : { borderColor: "rgba(255,255,255,0.15)" }}>{locked?.has("weapon") ? "🔒" : "🔓"}</button>
            </div>
          )}
        </div>
      </div>
      {kit.ammo && <SlotRow label="Ammo" {...rp("ammo")}><span data-tarkov-ammo>{ammoLine(kit.ammo)}</span></SlotRow>}
      {kit.att && (
        <SlotRow label="Build" {...rp("att")}>
          <ul className="space-y-0.5">
            {attSlotsFor(w).filter((s) => kit.att![s.id] !== undefined).map((s) => (
              <li key={s.id}><span className="text-[var(--text-muted)]">{s.label}:</span> {s.options[kit.att![s.id]]}</li>
            ))}
          </ul>
        </SlotRow>
      )}
      {kit.sidearm && <SlotRow label="Sidearm" {...rp("sidearm")}><span className="flex items-center gap-2"><WeaponImage w={kit.sidearm} small />{kit.sidearm.name} <span className="text-xs text-[var(--text-muted)]" style={mono}>{kit.sidearm.caliber}</span></span></SlotRow>}
      {kit.melee && <SlotRow label="Melee" {...rp("melee")}><span className="flex items-center gap-2"><WeaponImage w={kit.melee} small />{kit.melee.name}</span></SlotRow>}
      {kit.map && <SlotRow label="Map" {...rp("map")}><strong>{mapById(kit.map)?.name}</strong> <span className="text-xs text-[var(--text-muted)]">— {mapById(kit.map)?.note}</span></SlotRow>}
      {kit.challenges.length > 0 && (
        <SlotRow label={kit.challenges.length > 1 ? "Rules" : "Rule"} {...rp("challenges")}>
          <ol className="list-decimal space-y-0.5 pl-4">{kit.challenges.map((id) => <li key={id}>{challengeById(id)?.text}</li>)}</ol>
        </SlotRow>
      )}
    </article>
  );
}

function DailyRaid() {
  const [day, setDay] = useState<number | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date is only known in the browser
    setDay(dayNumber());
  }, []);
  const kit = useMemo(() => (day === null ? null : dailyKit(day)), [day]);
  if (day === null || !kit) return <div className="mx-auto mt-10 h-64 max-w-3xl" aria-hidden="true" data-tarkov-daily-slot />; // daily kit needs the browser date; server renders a sized slot
  const url = shareUrl(kit);
  const text = `Tarkov daily raid challenge · ${dateLabel(day)}\n${kitText(kit)}\n${url}`;
  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 1800); };
  const share = async () => {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ text, url });
        track("share_click", { tool_type: TOOL, share_method: "native", locale: "en", result_source: "daily" });
        return;
      }
    } catch { /* cancelled: fall back to copy */ }
    if (await copyText(text)) { flash("Challenge copied ✓"); track("share_click", { tool_type: TOOL, share_method: "copy", locale: "en", result_source: "daily" }); }
  };
  return (
    <section className="mx-auto mt-10 max-w-3xl px-4 sm:px-6" data-tarkov-daily aria-labelledby="tarkov-daily-title">
      <p className="text-[11px] uppercase tracking-[0.2em]" style={{ ...mono, color: ACCENT }}>Daily raid challenge · {dateLabel(day)}</p>
      <h2 id="tarkov-daily-title" className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Today&rsquo;s raid challenge</h2>
      <p className="mb-4 mt-1 text-sm text-[var(--text-secondary)]">Same kit, map and two rules for every player today (UTC). Run it, extract, and dare your squad to do the same.</p>
      <KitCard kit={kit} label="Daily kit" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={share} className="rounded-lg px-4 py-2 text-sm font-bold" style={{ background: ACCENT, color: INK }}>Share today&rsquo;s challenge</button>
        <a href={url} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-white/40">Open in the generator</a>
        <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
      </div>
    </section>
  );
}

export default function TarkovWeaponGenerator() {
  const [opts, setOpts] = useState<KitOptions>(DEFAULT_OPTIONS);
  const [kit, setKit] = useState<Kit | null>(null);
  const [locked, setLocked] = useState<Set<SlotKey>>(new Set());
  const [note, setNote] = useState("");
  const [rolls, setRolls] = useState(0);

  const poolSize = useMemo(() => weaponPool(opts.classes).length, [opts.classes]);

  // Shared link → show that exact kit; otherwise roll one straight away so the answer is on the first screen.
  useEffect(() => {
    const fromUrl = kitFromParams(new URLSearchParams(window.location.search));
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the shared kit lives in the URL, read once on mount
      setKit(fromUrl);
      setOpts((o) => ({
        ...o, ammo: !!fromUrl.ammo || (o.ammo && fromUrl.weapon.cls === "melee"), att: !!fromUrl.att || (o.att && fromUrl.weapon.cls === "melee"),
        map: !!fromUrl.map, sidearm: !!fromUrl.sidearm, melee: !!fromUrl.melee, challenges: fromUrl.challenges.length,
        classes: o.classes.includes(fromUrl.weapon.cls) ? o.classes : [...o.classes, fromUrl.weapon.cls],
      }));
      track("tool_use", { tool_type: TOOL, action: "open_shared_kit", locale: "en" });
    } else {
      setKit(rollKit(DEFAULT_OPTIONS, createRng(newSeed())));
    }
  }, []);

  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 1800); };

  const roll = (next: KitOptions = opts) => {
    const k = rollKit(next, createRng(newSeed()), kit, locked, kit ? [kit.weapon.id] : []);
    if (!k) return;
    setKit(k);
    setRolls((r) => r + 1);
    track("generate_success", { tool_type: TOOL, result_count: 1, locked_count: locked.size, locale: "en" });
  };

  const reroll = (slot: SlotKey) => {
    if (!kit) return;
    setKit(rerollSlot(kit, slot, opts, createRng(newSeed())));
    track("tool_use", { tool_type: TOOL, action: `reroll_${slot}`, locale: "en" });
  };

  const toggleLock = (slot: SlotKey) => {
    setLocked((prev) => { const n = new Set(prev); if (n.has(slot)) n.delete(slot); else n.add(slot); return n; });
    track("tool_use", { tool_type: TOOL, action: "lock_toggle", locale: "en" });
  };

  const setOpt = <K extends keyof KitOptions>(key: K, value: KitOptions[K]) => {
    const next = { ...opts, [key]: value };
    setOpts(next);
    track("filter_select", { tool_type: TOOL, filter_name: key, filter_value: String(value), locale: "en" });
    // Changing what the kit contains rerolls the parts that are not locked, so the card always matches the options.
    if (kit && weaponPool(next.classes).length > 0) roll(next);
  };

  const toggleClass = (c: WeaponClass) => {
    const has = opts.classes.includes(c);
    const classes = has ? opts.classes.filter((x) => x !== c) : [...opts.classes, c];
    setOpt("classes", classes);
  };
  const setPreset = (classes: WeaponClass[]) => setOpt("classes", classes);

  const copyLink = async () => {
    if (kit && (await copyText(shareUrl(kit)))) { flash("Link copied ✓ — it opens this exact loadout"); track("share_click", { tool_type: TOOL, share_method: "link", locale: "en" }); }
  };
  const copyKit = async () => {
    if (kit && (await copyText(kitText(kit, shareUrl(kit))))) { flash("Loadout copied ✓"); track("copy_result", { tool_type: TOOL, result_count: 1, locale: "en" }); }
  };

  const chip = (on: boolean) =>
    `rounded-lg border px-2.5 py-1.5 text-xs sm:text-sm transition-colors ${on ? "text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`;
  const chipStyle = (on: boolean) => (on ? { borderColor: ACCENT, background: "rgba(200,179,122,0.16)" } : undefined);
  const primaries = CLASSES.filter((c) => c.primary && c.value !== "gl").map((c) => c.value);

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 sm:px-6" data-tarkov-tool>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" data-tarkov-roll onClick={() => roll()} disabled={poolSize === 0}
            className="rounded-xl px-6 py-3 text-base font-extrabold disabled:opacity-40"
            style={{ background: ACCENT, color: INK, fontFamily: "var(--font-display)" }}>
            {rolls === 0 && !kit ? "Roll loadout" : locked.size > 0 ? "Reroll unlocked" : "🎲 Roll loadout"}
          </button>
          <button type="button" onClick={copyLink} disabled={!kit} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-white/40">🔗 Copy share link</button>
          <button type="button" onClick={copyKit} disabled={!kit} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-[var(--text-secondary)] hover:border-white/40">Copy text</button>
          <span role="status" className="text-sm text-[var(--neon-green)]">{note}</span>
        </div>

        <div className="mt-4" aria-live="polite">
          {kit ? <KitCard kit={kit} locked={locked} onLock={toggleLock} onReroll={reroll} /> : <div className="h-72 rounded-2xl border border-white/10" aria-hidden="true" />}
        </div>
        <p className="mt-2 text-xs text-[var(--text-muted)]">🔓 Lock a slot to keep it, 🎲 to reroll just that slot. Locked ammo is swapped if a new gun uses another caliber.</p>

        <details className="mt-4 rounded-2xl border border-white/10 p-4" open data-tarkov-options>
          <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">Options · {poolSize} of {WEAPONS.length} weapons in the pool</summary>
          <div className="mt-3">
            <p className="mb-1.5 text-xs text-[var(--text-muted)]">Weapon classes</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Weapon classes">
              {CLASSES.map((c) => (
                <button key={c.value} type="button" aria-pressed={opts.classes.includes(c.value)} onClick={() => toggleClass(c.value)} className={chip(opts.classes.includes(c.value))} style={chipStyle(opts.classes.includes(c.value))}>{c.short}</button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button type="button" onClick={() => setPreset(primaries)} className="underline text-[var(--text-secondary)]">All primaries</button>
              <button type="button" onClick={() => setPreset(["pistol", "revolver"])} className="underline text-[var(--text-secondary)]">Pistol run</button>
              <button type="button" onClick={() => setPreset(["bolt", "dmr"])} className="underline text-[var(--text-secondary)]">Snipers only</button>
              <button type="button" onClick={() => setPreset(CLASSES.map((c) => c.value))} className="underline text-[var(--text-secondary)]">Everything incl. melee &amp; GL</button>
            </div>
            {poolSize === 0 && <p className="mt-2 text-xs text-[var(--neon-pink)]">Pick at least one class.</p>}
          </div>
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-[var(--text-muted)]">Include</p>
            <div className="flex flex-wrap gap-1.5">
              {TOGGLES.map((t) => (
                <button key={t.key} type="button" aria-pressed={opts[t.key]} onClick={() => setOpt(t.key, !opts[t.key])} className={chip(opts[t.key])} style={chipStyle(opts[t.key])}>{opts[t.key] ? "✓ " : ""}{t.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs text-[var(--text-muted)]">Ammo quality</p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Ammo quality">
                {TIERS.map((t) => (
                  <button key={t.value} type="button" aria-pressed={opts.ammoTier === t.value} disabled={!opts.ammo} onClick={() => setOpt("ammoTier", t.value)} className={`${chip(opts.ammoTier === t.value)} disabled:opacity-40`} style={chipStyle(opts.ammoTier === t.value)}>{t.label}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs text-[var(--text-muted)]">Challenge rules</p>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Number of challenge rules">
                {[0, 1, 2, 3].map((n) => (
                  <button key={n} type="button" aria-pressed={opts.challenges === n} onClick={() => setOpt("challenges", n)} className={chip(opts.challenges === n)} style={chipStyle(opts.challenges === n)}>{n === 0 ? "None" : n}</button>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">Maps in the pool: {MAPS.map((m) => m.name).join(", ")}.</p>
        </details>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">Unofficial fan tool. Not affiliated with or endorsed by Battlestate Games. Weapon images © Battlestate Games, used for identification.</p>
      </section>
      <DailyRaid />
    </>
  );
}
