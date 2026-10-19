"use client";
import { useMemo, useState } from "react";
import PrintButton from "@/components/PrintButton";
import { track } from "@/lib/track";
import { AGE_RANGES, NATIONALITIES, fakeProfiles, type FakeGender } from "@/lib/generators/fakeNames";
import { flatRecord, recordsCsv, withExtras, type FakeRecord } from "@/lib/generators/fakeAddresses";

const selectClass = "block w-full mt-2 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--neon-cyan)]/25";
const COUNTS = [1, 10, 25, 50, 100];

export type FakeVariant = "name" | "address" | "identity" | "person";
// One engine, four pages: each page only changes the defaults and wording.
const VARIANTS: Record<FakeVariant, { address: boolean; details: boolean; noun: [string, string]; file: string; path: string; surface: string; country: string }> = {
  name: { address: false, details: false, noun: ["fake name", "fake names"], file: "fake-names", path: "fake-name-generator", surface: "fake_name_generator", country: "Nationality" },
  address: { address: true, details: false, noun: ["fake address", "fake addresses"], file: "fake-addresses", path: "fake-address-generator", surface: "fake_address_generator", country: "Country" },
  identity: { address: true, details: true, noun: ["fake identity", "fake identities"], file: "fake-identities", path: "fake-identity-generator", surface: "fake_identity_generator", country: "Country" },
  person: { address: false, details: true, noun: ["fake person", "fake people"], file: "fake-people", path: "fake-person-generator", surface: "fake_person_generator", country: "Nationality" },
};
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

function profileText(r: FakeRecord, full: boolean): string {
  const p = r.profile, a = r.address, d = r.details;
  if (!full && !a && !d) return p.name;
  return [
    `${p.name}${p.nativeOrder ? ` (${p.nativeOrder})` : ""}`,
    full ? `${p.gender === "female" ? "Female" : "Male"}, ${p.age} (born ${p.birthday})` : null,
    full ? `${p.nationality} · ${p.city}` : null,
    full ? p.occupation : null,
    a ? `Address: ${a.lines.join(", ")}` : null,
    full ? `Username: ${p.username}` : null,
    full ? `Email: ${p.email}` : null,
    full && p.phone ? `Phone: ${p.phone}` : null,
    d ? `Height: ${d.height} · Weight: ${d.weight} · Blood type: ${d.bloodType}` : null,
    d ? `Eyes: ${d.eyeColor} · Hair: ${d.hairColor} · ${d.starSign} · ${d.generation}` : null,
    d ? `Personality: ${d.personality} · Hobby: ${d.hobby} · Favorite color: ${d.favoriteColor}` : null,
  ].filter(Boolean).join("\n");
}

export default function FakeNameGenerator({ variant = "name" }: { variant?: FakeVariant }) {
  const v = VARIANTS[variant];
  const [nationality, setNationality] = useState("any");
  const [gender, setGender] = useState<FakeGender | "any">("any");
  const [age, setAge] = useState("any");
  const [count, setCount] = useState(10);
  const [full, setFull] = useState(true);
  const [seed, setSeed] = useState(FIRST_SEED);
  const [day, setDay] = useState(FIRST_DAY);
  const [copied, setCopied] = useState<string | null>(null);
  const [withAddress, setWithAddress] = useState(v.address);
  const [withDetails, setWithDetails] = useState(v.details);

  const opts = useMemo(() => ({ nationality: nationality === "any" ? [] : [nationality], gender, age }), [nationality, gender, age]);
  const profiles = useMemo(() => fakeProfiles(opts, count, seed, day), [opts, count, seed, day]);
  const rows = useMemo(() => withExtras(profiles, seed, { address: withAddress, details: withDetails }), [profiles, seed, withAddress, withDetails]);
  const params = { action_surface: v.surface, category: nationality, gender, age, count, with_address: withAddress, with_details: withDetails };

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
    if (kind === "csv") download(`${v.file}.csv`, "text/csv", recordsCsv(rows, true));
    else download(`${v.file}.json`, "application/json", JSON.stringify(rows.map((r) => flatRecord(r, true)), null, 2));
    track("fake_names_export", { ...params, format: kind });
  }

  return <section className="glass-card p-4 sm:p-6" aria-label={`${v.noun[0][0].toUpperCase()}${v.noun[0].slice(1)} generator`}>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold">{v.country}<select aria-label={v.country} className={selectClass} value={nationality} onChange={e => setNationality(e.target.value)}>
        <option value="any">🌍 Any ({NATIONALITIES.length} countries)</option>
        {NATIONALITIES.map(n => <option key={n.id} value={n.id}>{n.flag} {v.country === "Country" ? (n.id === "nordic" ? "Sweden, Norway, Denmark" : n.country) : n.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">Gender<select aria-label="Gender" className={selectClass} value={gender} onChange={e => setGender(e.target.value as FakeGender | "any")}>
        <option value="any">Any</option><option value="female">Female</option><option value="male">Male</option>
      </select></label>
      <label className="text-sm font-semibold">Age<select aria-label="Age" className={selectClass} value={age} onChange={e => setAge(e.target.value)}>
        <option value="any">Any (18–77)</option>{AGE_RANGES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
      </select></label>
      <label className="text-sm font-semibold">How many<select aria-label={`How many ${v.noun[1]}`} className={selectClass} value={count} onChange={e => setCount(Number(e.target.value))}>
        {COUNTS.map(n => <option key={n} value={n}>{n}</option>)}
      </select></label>
    </div>
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button type="button" className="btn-generate w-full sm:w-auto" onClick={generate}>{count > 1 ? `Generate ${count} ${v.noun[1]}` : `Generate a ${v.noun[0]}`}</button>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={full} onChange={e => setFull(e.target.checked)} />Full profile</label>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={withAddress} onChange={e => setWithAddress(e.target.checked)} />Address</label>
      <label className="flex items-center gap-2 text-sm min-h-11"><input type="checkbox" checked={withDetails} onChange={e => setWithDetails(e.target.checked)} />Height, star sign &amp; more</label>
    </div>

    <div aria-live="polite" className="mt-5">
      {full || withAddress || withDetails ? <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ profile: p, address: a, details: d }, i) => <li key={p.id} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold leading-snug">{p.flag} {p.name}</p>
              {p.nativeOrder && <p className="text-xs text-[var(--text-secondary)]">Family name first: {p.nativeOrder}</p>}
            </div>
            <button type="button" className="min-h-11 text-sm text-[var(--neon-cyan)] underline underline-offset-4 shrink-0" onClick={() => copy(p.id, profileText(rows[i], full))}>{copied === p.id ? "Copied" : "Copy"}</button>
          </div>
          {a && <address className="mt-2 not-italic text-sm leading-relaxed whitespace-pre-line rounded-lg bg-white/5 px-3 py-2">
            {a.lines.join("\n")}
            <button type="button" className="block mt-1 text-xs text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => copy(`${p.id}-addr`, a.lines.join("\n"))}>{copied === `${p.id}-addr` ? "Copied address" : "Copy address only"}</button>
          </address>}
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-[var(--text-secondary)]">
            {full && <>
              <dt>Age</dt><dd>{p.age} · born {p.birthday}</dd>
              {!a && <><dt>From</dt><dd>{p.city}</dd></>}
              <dt>Job</dt><dd>{p.occupation}</dd>
              <dt>Username</dt><dd className="break-all">{p.username}</dd>
              <dt>Email</dt><dd className="break-all">{p.email}</dd>
              {p.phone && <><dt>Phone</dt><dd>{p.phone}</dd></>}
            </>}
            {d && <>
              <dt>Height</dt><dd>{d.height}</dd>
              <dt>Weight</dt><dd>{d.weight}</dd>
              <dt>Blood</dt><dd>{d.bloodType}</dd>
              <dt>Eyes · hair</dt><dd>{d.eyeColor} · {d.hairColor}</dd>
              <dt>Star sign</dt><dd>{d.starSign} · {d.generation}</dd>
              <dt>Personality</dt><dd>{d.personality}</dd>
              <dt>Hobby</dt><dd>{d.hobby}</dd>
              <dt>Fav. color</dt><dd>{d.favoriteColor}</dd>
            </>}
            {full && <><dt>Surname</dt><dd>{p.surnameMeaning}</dd></>}
          </dl>
        </li>)}
      </ul> : <ol className="grid gap-2 sm:grid-cols-2 list-decimal pl-6">
        {rows.map(({ profile: p }) => <li key={p.id} className="text-base"><span className="font-semibold">{p.name}</span> <span className="text-xs text-[var(--text-secondary)]">{p.flag} {p.gender === "female" ? "F" : "M"}</span>
          {" "}<button type="button" className="text-xs text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => copy(p.id, p.name)}>{copied === p.id ? "Copied" : "Copy"}</button></li>)}
      </ol>}
    </div>

    <div className="mt-5 border-t border-white/10 pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => copy("all", rows.map(r => profileText(r, full)).join(full || withAddress || withDetails ? "\n\n" : "\n"))}>{copied === "all" ? "Copied all" : `📋 Copy all ${rows.length}`}</button>
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => exportAs("csv")}>⬇️ Download CSV</button>
      <button type="button" className="min-h-11 text-[var(--neon-cyan)] underline underline-offset-4" onClick={() => exportAs("json")}>⬇️ Download JSON</button>
      <PrintButton heading={`${v.noun[1][0].toUpperCase()}${v.noun[1].slice(1)}`} intro={`From randomtopics.app/${v.path} — fictional placeholder data`} items={rows.map(r => profileText(r, full).replace(/\n/g, " · "))} label={`🖨️ Print ${rows.length}`} />
    </div>
    <p className="mt-3 text-xs text-[var(--text-secondary)]">Every profile is made up. Emails use the reserved example.com domains and phone numbers use ranges set aside for fiction, so nothing here reaches a real person.{withAddress ? " Addresses use real cities and correctly formatted postcodes but invented street names; any match with a real address is a coincidence, so never ship to them or use them to pass verification." : ""}</p>
  </section>;
}
