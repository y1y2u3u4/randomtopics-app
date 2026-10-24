"use client";
import { useEffect, useRef, useState } from "react";
import { startSubCheckout, trackSub } from "@/lib/subs/client";
import { SUB_PRODUCTS, usd, type SubPlan, type SubProduct } from "@/lib/subs/products";

const ES_INCLUDES: Partial<Record<SubProduct, { title: string; includes: string[] }>> = {
  couples: { title: "Pregunta diaria en pareja", includes: ["Una pregunta al día para los dos", "Las respuestas se revelan cuando los dos contestaron", "Historial compartido y racha", "Un plan cubre a los dos", "Sin anuncios en randomtopics.app"] },
  wheel: { title: "Ruleta de lista de clase Pro", includes: ["Guarda listas de clase y ábrelas en cualquier dispositivo", "Sin repetir hasta que todos hayan salido", "Grupos aleatorios con un clic", "Historial de sorteos", "Sin anuncios en randomtopics.app"] },
};

const UI = {
  en: { month: "/month", year: "/year", save: (n: number) => `save ${n}%`, opening: "Opening checkout…", cancel: "Cancel any time. Prices in USD.", error: "Checkout could not open. Please try again." },
  es: { month: "/mes", year: "/año", save: (n: number) => `ahorra ${n}%`, opening: "Abriendo el pago…", cancel: "Cancela cuando quieras. Precios en USD.", error: "No se pudo abrir el pago. Inténtalo de nuevo." },
};

/** Inline (never blocking) plan picker for one product: monthly or yearly, USD. */
export default function SubPaywall({ product, locale = "en", heading, note }: { product: SubProduct; locale?: "en" | "es"; heading?: string; note?: string }) {
  const p = SUB_PRODUCTS[product];
  const copy = locale === "es" ? ES_INCLUDES[product] : undefined;
  const ui = UI[locale];
  const [busy, setBusy] = useState<SubPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const viewed = useRef(false);
  const saving = Math.round((1 - p.yearly / (p.monthly * 12)) * 100);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackSub(product, "paywall_view", { locale });
  }, [product, locale]);

  // Back from Stripe restores this page from the bfcache with the button still busy.
  useEffect(() => {
    const restore = (e: PageTransitionEvent) => { if (e.persisted) setBusy(null); };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  const choose = async (plan: SubPlan) => {
    setError(null);
    setBusy(plan);
    trackSub(product, "plan_select", { plan, locale });
    try {
      await startSubCheckout(product, plan);
    } catch (e) {
      setBusy(null);
      setError(e instanceof Error && e.message ? e.message : ui.error);
    }
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-5 text-left" data-sub-paywall={product}>
      <p className="text-lg font-bold">{heading ?? copy?.title ?? p.title}</p>
      {note && <p className="mt-1 text-sm opacity-80">{note}</p>}
      <ul className="mt-3 space-y-1 text-sm">
        {(copy?.includes ?? p.includes).map((line) => <li key={line}>✓ {line}</li>)}
      </ul>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button type="button" disabled={busy !== null} onClick={() => choose("monthly")}
          className="rounded-xl border border-white/20 px-4 py-3 font-bold hover:bg-white/10 disabled:opacity-60">
          {busy === "monthly" ? ui.opening : `${usd(p.monthly)}${ui.month}`}
        </button>
        <button type="button" disabled={busy !== null} onClick={() => choose("yearly")}
          className="rounded-xl bg-[#f4ecdf] px-4 py-3 font-bold text-[#14110f] hover:opacity-90 disabled:opacity-60">
          {busy === "yearly" ? ui.opening : `${usd(p.yearly)}${ui.year} · ${ui.save(saving)}`}
        </button>
      </div>
      <p className="mt-2 text-xs opacity-70">{ui.cancel}</p>
      {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
    </div>
  );
}
