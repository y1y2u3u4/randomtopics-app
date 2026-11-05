"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { adPageAllowed, adRequestAllowed } from "@/lib/adsense";
import { loadAdSense, pageSettled, setAdEligibility, showAdPrivacyChoices, retireAdDocument } from "@/lib/adsenseClient";
import { observeSpeechAdEntitlement } from "@/lib/speech/adEligibilityClient";

// Auto ads (anchor, vignette, Auto in-page) on public pages that have no manual
// unit. Same gates as ArticleAdvertisement: page list, host, no query, QA flag,
// GPC, consent and the paid ad-free entitlement. It pushes no manual slot and
// reserves no space, so page layout is unchanged.
export default function AdAutoBootstrap() {
  const path = usePathname();
  const [choicesReady, setChoicesReady] = useState(false);
  useEffect(() => {
    // Pages with the manual unit already run the same runtime from that unit.
    if (!adPageAllowed(path) || document.querySelector('[data-ad-placement="public-content"]')) return;
    let active = true, started = false;
    const allowed = () => {
      let qa = true;
      try { qa = sessionStorage.getItem("rt_usage_qa") === "1" || sessionStorage.getItem("rt_speech_qa") === "1"; }
      catch { return false; }
      return active && location.pathname === path && adRequestAllowed({ path, host: location.hostname,
        search: location.search, qa, globalPrivacyControl: navigator.globalPrivacyControl === true });
    };
    if (!allowed()) return;
    pageSettled();
    // Speech practice (Auto ads since 2026-11-05): no full-screen vignette on
    // links out of a practice round. Anchor and in-page placements only.
    let vignetteGuard: MutationObserver | undefined;
    if (/^(\/es)?\/speech(\/|$)/.test(path)) {
      const mark = () => document.querySelectorAll("a:not([data-google-vignette])").forEach(link => link.setAttribute("data-google-vignette", "false"));
      mark();
      vignetteGuard = new MutationObserver(mark);
      vignetteGuard.observe(document.body, { childList: true, subtree: true });
    }
    const messaging: NonNullable<Window["googlefc"]> = window.googlefc ??= {};
    const callbacks: NonNullable<NonNullable<Window["googlefc"]>["callbackQueue"]> = messaging.callbackQueue ??= [];
    callbacks.push({ CONSENT_API_READY: () => {
      window.__tcfapi?.("addEventListener", 2, (data, success) => {
        if (active) setChoicesReady(success && data?.gdprApplies === true && Boolean(window.googlefc?.showRevocationMessage));
      });
    } });
    const start = () => {
      if (started || !allowed() || !entitlement.gate.mayRequest() || document.hidden) return;
      if (!entitlement.gate.begin()) return;
      started = true;
      void loadAdSense().catch(() => { /* Failed ads must not interrupt the page. */ });
    };
    let frame: number | undefined;
    const entitlement = observeSpeechAdEntitlement({
      changed: state => {
        if (!active) return;
        setAdEligibility(state === "free" && allowed());
        if (state === "free") {
          if (frame !== undefined) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(start);
        }
      },
      retire: () => {
        setAdEligibility(false);
        if (location.pathname === path) retireAdDocument();
      },
    });
    document.addEventListener("visibilitychange", start);
    return () => {
      active = false;
      vignetteGuard?.disconnect();
      if (frame !== undefined) cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      entitlement.dispose();
    };
  }, [path]);

  // Where consent applies (EEA/UK), keep a way to reopen the choices message.
  if (!choicesReady) return null;
  const locale = path.match(/^\/(es|pt)(\/|$)/)?.[1];
  return <div className="relative z-[1] pb-6 text-center text-xs print:hidden">
    <button type="button" className="min-h-11 px-3 underline underline-offset-4 text-[var(--text-muted)]" onClick={showAdPrivacyChoices}>
      {locale === "es" ? "Opciones de privacidad publicitaria" : locale === "pt" ? "Opções de privacidade de anúncios" : "Advertising privacy choices"}
    </button>
  </div>;
}
