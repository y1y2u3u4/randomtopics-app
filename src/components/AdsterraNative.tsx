"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adPageAllowed, adRequestAllowed } from "@/lib/adsense";
import { retireAdDocument } from "@/lib/adsenseClient";
import { ADSTERRA_NONE, adsterraCookie, adsterraNativeFromEnv } from "@/lib/adsterra";
import { NATIVE_PLACEMENT, adsterraInsertionPoint } from "@/lib/adsterraPlacement";
import { observeSpeechAdEntitlement } from "@/lib/speech/adEligibilityClient";
import { adslotConfiguration } from "@/lib/adslotClient";
import { track } from "@/lib/track";

// Ad-eligible route transitions use a fresh document (AdDocumentBoundary).
let nativeRequested = false;

export default function AdsterraNative() {
  const path = usePathname() ?? "/";
  useEffect(() => {
    const config = adsterraNativeFromEnv();
    if (!config || nativeRequested || !adPageAllowed(path)) return;

    let active = true;
    const allowed = () => {
      let qa = true;
      try { qa = sessionStorage.getItem("rt_usage_qa") === "1" || sessionStorage.getItem("rt_speech_qa") === "1"; }
      catch { return false; }
      return active && window.self === window.top && location.pathname === path &&
        adRequestAllowed({ path, host: location.hostname, search: location.search,
          qa, globalPrivacyControl: navigator.globalPrivacyControl === true });
    };
    const main = document.querySelector("main");
    if (!main || !allowed()) return;

    let host: HTMLDivElement | undefined;
    let visibility: IntersectionObserver | undefined;
    let placement: MutationObserver | undefined;
    const remove = () => {
      visibility?.disconnect();
      placement?.disconnect();
      host?.remove();
      host = undefined;
    };
    const mount = (country: string) => {
      if (!allowed() || !entitlement.gate.mayRequest() || nativeRequested || host ||
        document.querySelector(`[data-ad-placement="${NATIVE_PLACEMENT}"]`)) return;
      const before = adsterraInsertionPoint(main);
      if (before === undefined) return;

      host = document.createElement("div");
      host.className = "rt-adst print:hidden";
      host.setAttribute("aria-label", "Advertisement");
      host.setAttribute("data-ad-placement", NATIVE_PLACEMENT);
      host.style.cssText = "min-height:300px;margin:24px auto;max-width:720px;padding:0 16px;text-align:center";
      const label = document.createElement("p");
      label.textContent = "Advertisement";
      label.style.cssText = "font-size:12px;margin:0 0 8px;color:var(--text-muted)";
      const box = document.createElement("div");
      box.id = config.id;
      host.append(label, box);
      main.insertBefore(host, before);

      const positionStillSafe = () => host?.parentElement === main && adsterraInsertionPoint(main) === host.nextElementSibling;
      placement = new MutationObserver(records => {
        if (records.some(record => !host?.contains(record.target)) && !positionStillSafe()) remove();
      });
      placement.observe(main, { childList: true, subtree: true, attributes: true,
        attributeFilter: ["class", "data-ad-slot", "data-ad-placement", "hidden", "aria-hidden"] });

      visibility = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting) || document.hidden || !allowed() || nativeRequested) return;
        if (!positionStillSafe()) { remove(); return; }
        if (!entitlement.gate.begin()) return;
        nativeRequested = true;
        visibility?.disconnect();
        const script = document.createElement("script");
        script.async = true;
        script.src = config.src;
        script.setAttribute("data-cfasync", "false");
        box.appendChild(script);
        track("adsterra_native_load", { country, page_path: path });
      }, { rootMargin: "300px 0px" });
      visibility.observe(host);
    };
    const start = async () => {
      let country = adsterraCookie(document.cookie);
      if (country === ADSTERRA_NONE) return;
      if (!country) {
        try {
          const slot = await adslotConfiguration();
          if (slot.src !== config.src || slot.id !== config.id || !slot.country) return;
          country = slot.country;
        } catch { return; }
      }
      mount(country);
    };
    const entitlement = observeSpeechAdEntitlement({
      changed: state => {
        if (!active) return;
        if (state === "free") void start();
        else if (!nativeRequested) remove();
      },
      retire: () => {
        remove();
        if (active && location.pathname === path) retireAdDocument();
      },
    });
    return () => { active = false; entitlement.dispose(); remove(); };
  }, [path]);
  return null;
}
