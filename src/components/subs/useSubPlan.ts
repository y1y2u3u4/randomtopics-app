"use client";
import { useCallback, useEffect, useState } from "react";
import { readLocal, subStatus, takeReturnSession, trackSub, writeLocal, type SubStatus } from "@/lib/subs/client";
import type { SubProduct } from "@/lib/subs/products";

export type PlanState = "checking" | "active" | "free";

/**
 * Plan state for one product. Handles the return from Stripe Checkout:
 * {product}_purchase fires only when the server confirmed a new paid
 * subscription in this call (it confirms each one once).
 */
export function useSubPlan(product: SubProduct, labels = { thanks: "Your plan is on — thank you!", pending: "We could not confirm the payment yet. If you paid, reload this page in a minute." }) {
  const [state, setState] = useState<PlanState>("checking");
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await subStatus();
    setStatus(next);
    setState(next?.access[product] ? "active" : "free");
    return next;
  }, [product]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = takeReturnSession();
      let next = await subStatus(session ?? undefined);
      for (let i = 0; session && !next?.access[product] && i < 3; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        next = await subStatus(session);
        if (cancelled) return;
      }
      if (cancelled) return;
      const bought = next?.granted.find((g) => g.product === product);
      if (bought) {
        // Once per returned Checkout session, even if the page is reopened from history.
        const key = `rt_sub_purchase_${session ?? "sync"}`;
        if (!readLocal(key, false)) { writeLocal(key, true); trackSub(product, "purchase", { plan: bought.plan, value: bought.value }); }
        setMessage(labels.thanks);
      } else if (session && !next?.access[product]) {
        setMessage(labels.pending);
      }
      setStatus(next);
      setState(next?.access[product] ? "active" : "free");
    })();
    return () => { cancelled = true; };
    // labels are static copy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  return { state, active: state === "active", status, message, setMessage, refresh };
}
