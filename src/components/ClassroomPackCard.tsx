"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ClassroomBuyButtons from "@/components/ClassroomBuyButtons";
import { CLASSROOM_PACKS, classroomPreviews, type ClassroomPackId } from "@/lib/classroom/catalog";
import { trackClassroom } from "@/lib/classroom/client";
import { observeVisibleContent } from "@/lib/speech/visibleAction";

// Teacher offer under a generator: real exported slides/PDF page, price, buy.
export default function ClassroomPackCard({ pack, page }: { pack: ClassroomPackId; page: string }) {
  const card = useRef<HTMLElement>(null);
  const info = CLASSROOM_PACKS.find((p) => p.id === pack)!;
  useEffect(() => {
    if (!card.current) return;
    return observeVisibleContent(card.current, () => trackClassroom("classroom_pack_card_view", { pack, page }));
  }, [pack, page]);
  return (
    <section ref={card} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10" data-classroom-card={pack}>
      <div className="glass-card p-6 sm:p-8 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">🧑‍🏫 For teachers · classroom pack</p>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-2">{info.title}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{info.description}</p>
        </div>
        <div className="grid grid-cols-3 items-start gap-2 sm:gap-3">
          {classroomPreviews(pack).map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-lg border border-white/10 bg-white">
              <Image src={p.src} alt={`${info.short}: ${p.alt}`} width={p.kind === "PDF" ? 900 : 1200} height={p.kind === "PDF" ? 1165 : 675}
                sizes="(max-width: 640px) 33vw, 240px" className={`w-full ${p.kind === "PDF" ? "aspect-video object-cover object-top" : "h-auto"}`} />
              <figcaption className="sr-only">{p.kind === "PDF" ? "Printable PDF page" : "PPTX slide"}</figcaption>
            </figure>
          ))}
        </div>
        <ul className="grid gap-1 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
          {["Editable PPTX (opens in Google Slides)", "Printable PDF", "Ad-free full-screen presenter"].map((t) => <li key={t}>✓ {t}</li>)}
        </ul>
        <ClassroomBuyButtons pack={pack} page={page} />
        <p className="text-sm">
          <Link href="/classroom-packs" className="text-[var(--neon-cyan)] underline-offset-4 hover:underline">See every classroom pack and the FAQ</Link>
          <span className="text-[var(--text-muted)]"> · </span>
          <Link href={`/classroom/present?pack=${pack}`} className="text-[var(--neon-cyan)] underline-offset-4 hover:underline" rel="nofollow">Try the presenter with 5 free slides</Link>
          <span className="text-[var(--text-muted)]"> · </span>
          <Link href="/account" className="text-[var(--neon-cyan)] underline-offset-4 hover:underline" rel="nofollow">Already bought? Your downloads</Link>
        </p>
      </div>
    </section>
  );
}
