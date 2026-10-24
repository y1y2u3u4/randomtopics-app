"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { sessionGenerateCount, track } from "@/lib/track";
import type { HostGenerator } from "@/lib/host/pools";

// Host mode entry under the result. Appears after the 3rd generation in this
// tab session (or when returning from Host Pass checkout); everything else
// (prompt pools, Supabase, Stripe) loads only when it is opened.
const HostMode = dynamic(() => import("./HostMode"), { ssr: false });
const SHOW_AFTER = 3;

export default function HostPassEntry({ generator }: { generator: HostGenerator }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [returnSession, setReturnSession] = useState<string | null>(null);
  const viewed = useRef(false);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of this tab's generate count and the Checkout return */
  useEffect(() => {
    const check = () => { if (sessionGenerateCount() >= SHOW_AFTER) setVisible(true); };
    check();
    window.addEventListener("rt:generate", check);
    const params = new URLSearchParams(window.location.search);
    const session = params.get("host_session");
    if (session) {
      params.delete("host_session");
      params.delete("host_return");
      const rest = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`);
      setReturnSession(session);
      setVisible(true);
      setOpen(true);
    }
    return () => window.removeEventListener("rt:generate", check);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!visible || viewed.current) return;
    viewed.current = true;
    track("host_entry_view", { generator, tool_type: "host_mode" });
  }, [visible, generator]);

  if (!visible) return null;
  return (
    <>
      <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm opacity-90">
          <strong>Playing with a group?</strong> Put one big prompt on the TV or projector, with a round timer and no repeats.
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full bg-[#f4ecdf] px-4 py-2 text-sm font-bold text-[#14110f] hover:opacity-90"
          onClick={() => { track("host_entry_click", { generator, tool_type: "host_mode" }); setReturnSession(null); setOpen(true); }}
        >
          ⛶ Host mode
        </button>
      </div>
      {open && <HostMode generator={generator} returnSession={returnSession} onClose={() => setOpen(false)} />}
    </>
  );
}
