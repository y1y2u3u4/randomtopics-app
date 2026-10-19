"use client";
import { useMemo, useState } from "react";
import PrintButton from "@/components/PrintButton";
import { track } from "@/lib/track";
import { AGE_RANGES, NATIONALITIES, fakeProfiles, toCsv, type FakeGender, type FakeProfile } from "@/lib/generators/fakeNames";

const selectClass = "block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25";
const COUNTS = [1, 10, 25, 50, 100];
// Fixed for the first render so server and client draw the same batch.
const FIRST_SEED = 20261019;
const FIRST_DAY = new Date(Date.UTC(2026, 9, 19));

/** Seed and reference date for a new batch (called from the click handler only). */
function freshDraw() {
  return { seed: Math.floor(Math.random() * 2 ** 31), day: new Date() };
}

function download(name: string, type: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function profileText(p: FakeProfile, full: boolean): string {
  if (!full) return p.name;
  return [
    `${p.name}${p.nativeOrder ? ` (${p.nativeOrder})` : ""}`,
    `${p.gender === "female" ? "Female" : "Male"}, ${p.age} (born ${p.birthday})`,
    `${p.nationality} · ${p.city}`,
    p.occupation,
    `Username: ${p.username}`,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : null,
  ].filter(Boolean).join("\n");
}

export default function FakeNameGenerator() {
  const [nationality, setNationality] = useState("any");
  const [gender, setGender] = useState<FakeGender | "any">("any");
  const [age, setAge] = useState("any");
  const [count, setCount] = useState(10);
  const [full, setFull] = useState(true);
  const [seed, setSeed] = useState(FIRST_SEED);
  const [day, setDay] = useState(FIRST_DAY);
  const [copied, setCopied] = useState<string | null>(null);

  const opts = useMemo(() => ({ nationality: nationality === "any" ? [] : [nationality], gender, age }), [nationality, gender, age]);
  const rows = useMemo(() => fakeProfiles(opts, count, seed, day), [opts, count, seed, day]);
  const params = { action_surface: "fake_name_generator", category: nationality, gender, age, count };

  const generate = () => {
    track("generate_start", params);
    const next = freshDraw();
    setSeed(next.seed);
    setDay(next.day);
    track("generate_success", { ...params, result_count: count });
  };
  async function copy(id: string, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1500); } catch { /* Clipboard blocked. */ }
    track("copy_result", { ...params, copy_scope: id === "all" ? "all" : "one" });
  }
  function exportAs(kind: "csv" | "json") {
    if (kind === "csv") download("fake-names.csv", "text/csv", toCsv(rows));
    else download("fake-names.json", "application/json", JSON.stringify(rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => k !== "id"))), null, 2));
    track("fake_names_export", { ...params, format: kind });
  }

  return <section className="glass-card p-4 sm:p-6" aria-label="Fake name generator">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold">Nationality<select aria-label="Nationality" className={selectClass} value={nationality} onChange={e => setNationality(e.target.value)}>
        <option value="any">🌍 Any ({NATIONALITIES.length} countries)</option>
        {NATIONALITIES.map(n => <option key={n.id} value={n.id}>{n.flag} {n.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">Gender<select aria-label="Gender" className={selectClass} value={gender} onChange={e => setGender(e.target.value as FakeGender | "any")}>
        <option value="any">Any</option><option value="female">Female</option><option value="male">Male</option>
      </select></label>
      <label className="text-sm font-semibold">Age<select aria-label="Age" className={selectClass} value={age} onChange={e => setAge(e.target.value)}>
        <option value="any">Any (18–77)</option>{AGE_RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">How many<select aria-label="How many names" className={selectClass} value={count} onChange={e => setCount(Number(e.target.value))}>
        {COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
      </select></label>
    </div>
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button type="button" className="btn-generate w-full sm:w-auto" onClick={generate}>{count > 1 ? `Generate ${count} fake names` : "Generate a fake name"}</button>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={full} onChange={e => setFull(e.target.checked)} />Full profile</label>
    </div>

    <div aria-live="polite" className="mt-5">
      {full ? <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map(p => <li key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold leading-snug">{p.flag} {p.name}</p>
              {p.nativeOrder && <p className="text-xs text-[var(--text-secondary)]">Family name first: {p.nativeOrder}</p>}
            </div>
            <button type="button" className="min-h-11 text-sm text-[var(--neon-cyan)] underline underline-offset-4 shrink-0" onClick={() => copy(p.id, profileText(p, true))}>{copied === p.id ? "Copied" : "Copy"}</button>
          </div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
            <dt>Age</dt><dd>{p.age} · born {p.birthday}</dd>
            <dt>From</dt><dd>{p.city}</dd>
            <dt>Job</dt><dd>{p.occupation}</dd>
            <dt>Username</dt><dd className="break-all">{p.username}</dd>
            <dt>Email</dt><dd className="break-all">{p.email}</dd>
            {p.phone && <><dt>Phone</dt><dd>{p.phone}</dd></>}
            <dt>Surname</dt><dd>{p.surnameMeaning}</dd>
          </dl>
        </li>)}
      </ul> : <ol className="grid gap-2 sm:grid-cols-2 list-decimal pl-6">
        {rows.map(p => <li key={p.id} className="text-base"><span className="font-semibold">{p.name}</span> <span className="text-xs text-[var(--text-secondary)]">{p.flag} {p.gender === "female" ? "F" : "M"}</span>
          {" "}<button type="button" className="text-xs text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => copy(p.id, p.name)}>{copied === p.id ? "Copied" : "Copy"}</button></li>)}
      </ol>}
    </div>

    <div className="mt-5 border-t border-white/10 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => copy("all", rows.map(p => profileText(p, full)).join(full ? "\n\n" : "\n"))}>{copied === "all" ? "Copied all" : `📋 Copy all ${rows.length}`}</button>
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => exportAs("csv")}>⬇️ Download CSV</button>
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => exportAs("json")}>⬇️ Download JSON</button>
      <PrintButton heading="Fake names" intro="From randomtopics.app/fake-name-generator — fictional placeholder data" items={rows.map(p => profileText(p, full).replace(/\n/g, " · "))} label={`🖨️ Print ${rows.length}`} />
    </div>
    <p className="mt-3 text-xs text-[var(--text-secondary)]">Every profile is made up. Emails use the reserved example.com domains and phone numbers use ranges set aside for fiction, so nothing here reaches a real person.</p>
  </section>;
}
