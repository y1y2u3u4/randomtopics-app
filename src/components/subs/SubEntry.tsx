"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sessionGenerateCount } from "@/lib/track";
import { trackSub } from "@/lib/subs/client";
import type { SubProduct } from "@/lib/subs/products";

const SHOW_AFTER = 1;

/**
 * One paid entry under a result. `after="generate"` shows it after the 1st
 * generation in this tab session; `after="view"` (pages without a generator)
 * renders it in place below the fold and counts the view when it scrolls in.
 */
export default function SubEntry({ product, href, text, cta, after = "generate", locale = "en" }: {
  product: SubProduct; href: string; text: React.ReactNode; cta: string; after?: "generate" | "view"; locale?: "en" | "es";
}) {
  const [visible, setVisible] = useState(after === "view");
  const [from, setFrom] = useState("");
  const viewed = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time read of this tab's generate count and path */
  useEffect(() => {
    setFrom(window.location.pathname);
    if (after !== "generate") return;
    const check = () => { if (sessionGenerateCount() >= SHOW_AFTER) setVisible(true); };
    check();
    window.addEventListener("rt:generate", check);
    return () => window.removeEventListener("rt:generate", check);
  }, [after]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const el = box.current;
    if (!visible || viewed.current || !el) return;
    const fire = () => {
      if (viewed.current) return;
      viewed.current = true;
      trackSub(product, "entry_view", { entry_page: window.location.pathname, locale });
    };
    if (typeof IntersectionObserver === "undefined") { fire(); return; }
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { fire(); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [visible, product, locale]);

  if (!visible) return null;
  return (
    <div ref={box} className="mx-auto mt-4 flex max-w-2xl flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left" data-sub-entry={product}>
      <p className="text-sm opacity-90">{text}</p>
      <Link
        href={from ? `${href}?from=${encodeURIComponent(from)}` : href}
        className="shrink-0 rounded-full bg-[#f4ecdf] px-4 py-2 text-sm font-bold text-[#14110f] hover:opacity-90"
        onClick={() => trackSub(product, "entry_click", { entry_page: from, locale })}
      >
        {cta}
      </Link>
    </div>
  );
}
