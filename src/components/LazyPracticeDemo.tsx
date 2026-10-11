"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The demo (component + its CSS) is fetched only when the visitor scrolls near
// it, so the first screen ships none of it. The placeholder reserves the same
// height to avoid layout shift when the real demo swaps in.
const PracticeDemo = dynamic(() => import("./PracticeDemo"), { ssr: false, loading: () => <Placeholder /> });

function Placeholder() {
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10" aria-hidden="true"><div className="glass-card min-h-[500px] sm:min-h-[405px]" /></div>;
}

export default function LazyPracticeDemo() {
  const anchor = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setNear(true), 0);
      return () => clearTimeout(id);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={anchor}>{near ? <PracticeDemo /> : <Placeholder />}</div>;
}
