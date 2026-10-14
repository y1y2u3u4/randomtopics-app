"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";

// Fake-door test for a teacher "classroom pack". Nothing is for sale: the
// dialog says so plainly and only offers an optional email for the launch note.
export default function ClassroomPackDoor({ page }: { page: "/question-of-the-day" | "/debate" | "/pro-and-con-debate-topics" }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/classroom-waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, page }) });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      track("classroom_pack_email_submit", { page });
    } catch {
      setState("error");
    }
  }
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-4 text-center">
      <button ref={trigger} type="button" data-classroom-pack
        onClick={() => { setOpen(true); track("classroom_pack_click", { page }); }}
        className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 hover:text-[var(--text-primary)] transition-colors">
        🧑‍🏫 Get the classroom pack (slides, printable, ad-free projector mode)
      </button>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4" onClick={close}>
          <div role="dialog" aria-modal="true" aria-labelledby="classroom-pack-title" onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-md p-6 text-left space-y-4 bg-[var(--bg-secondary)]">
            <div className="flex items-start justify-between gap-4">
              <h2 id="classroom-pack-title" className="text-lg font-bold text-[var(--text-primary)]">Coming soon</h2>
              <button ref={closeButton} type="button" onClick={close} aria-label="Close" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none">×</button>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">The classroom pack — ready-made slides, a printable version and an ad-free projector mode — isn’t available yet. Want it? Leave your email and we’ll tell you when it’s ready. Nothing to buy now.</p>
            {state === "done" ? (
              <p role="status" className="text-sm text-[var(--neon-cyan)]">Thanks — we’ll email you once when it’s ready.</p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <label className="block text-sm text-[var(--text-secondary)]">Email address
                  <input type="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/15 bg-black/20 p-3 text-base text-[var(--text-primary)]" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" disabled={state === "sending"} className="btn-generate">{state === "sending" ? "Sending…" : "Tell me when it’s ready"}</button>
                  <button type="button" onClick={close} className="rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-secondary)]">No thanks</button>
                </div>
                {state === "error" && <p role="alert" className="text-sm text-[var(--neon-pink)]">Could not save your email. Please try again.</p>}
                <p className="text-xs text-[var(--text-muted)]">We use your email only for this one launch note.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
