"use client";
import { useEffect, useRef } from "react";
import { trackSub } from "@/lib/subs/client";
import type { SubProduct } from "@/lib/subs/products";

/** Fires {product}_landing_view once, with the entry page it came from (?from=). */
export default function LandingView({ product, locale = "en" }: { product: SubProduct; locale?: "en" | "es" }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const from = new URLSearchParams(window.location.search).get("from");
    trackSub(product, "landing_view", { locale, ...(from && /^\/[a-z0-9/-]{0,100}$/.test(from) ? { entry_page: from } : {}) });
  }, [product, locale]);
  return null;
}
