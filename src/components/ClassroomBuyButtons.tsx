"use client";
import { useState } from "react";
import { CLASSROOM_PRICES, type ClassroomPackId, type ClassroomPurchase } from "@/lib/classroom/catalog";
import { startClassroomCheckout } from "@/lib/classroom/client";

// Single pack $4.99 or every pack (incl. future packs) $9.99, straight to Stripe Checkout.
export default function ClassroomBuyButtons({ pack, page, showAll = true }: { pack?: ClassroomPackId; page: string; showAll?: boolean }) {
  const [busy, setBusy] = useState<ClassroomPurchase | null>(null);
  const [error, setError] = useState("");
  async function buy(choice: ClassroomPurchase) {
    if (busy) return;
    setBusy(choice);
    setError("");
    try {
      await startClassroomCheckout(choice, page);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Checkout is unavailable right now. Please try again.");
      setBusy(null);
    }
  }
  return (
    <div className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        {pack && (
          <button type="button" disabled={busy !== null} onClick={() => void buy(pack)} data-classroom-buy={pack}
            className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/60 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--neon-cyan)]/10 disabled:opacity-60">
            {busy === pack ? "Opening secure checkout…" : <>Buy this pack · {CLASSROOM_PRICES.single.label}</>}
          </button>
        )}
        {showAll && (
          <button type="button" disabled={busy !== null} onClick={() => void buy("all")} data-classroom-buy="all"
            className="relative min-h-11 rounded-xl bg-[var(--neon-cyan)] px-4 py-3 text-sm font-semibold text-black disabled:opacity-60">
            <span className="absolute -top-2 right-3 rounded-full bg-black px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">Best for teachers</span>
            {busy === "all" ? "Opening secure checkout…" : <>All classroom packs · {CLASSROOM_PRICES.all.label}</>}
          </button>
        )}
      </div>
      <p className="text-xs text-[var(--text-muted)]">One-time payment · no subscription · instant PPTX + PDF download · ad-free presenter mode. All packs includes every pack we add later.</p>
      {error && <p role="alert" className="text-sm text-[var(--neon-pink)]">{error}</p>}
    </div>
  );
}
