import type { ReactNode } from "react";
import { DRAWING_REFERENCES } from "@/lib/drawingReferences";
const guides: Record<string, ReactNode> = {
  mug: <><ellipse cx="125" cy="47" rx="54" ry="14" /><path d="M71 47v76q54 35 108 0V47M180 66q61-12 44 46q-12 17-44 7" /><path d="M88 119q38 16 75 0" strokeDasharray="4 5" opacity=".35" /></>,
  shoe: <><path d="M53 127q-8-16 10-25l40-14 23-45 21 8 17 36 39 14q45 9 47 33H57Z" /><path d="M57 134h193M121 82l29 9m-36 1 27 10m-37 1 28 10M205 103q-15 9-10 28" /></>,
  stones: <><path d="M35 126q-5-59 50-65q43 0 52 57q-45 25-102 8Z" /><path d="m157 129-12-40 28-40 44 3 28 36-4 37-42 10Z" /><path d="M40 143h213" opacity=".25" /></>,
  leaf: <><path d="M156 138q-90-23-83-91q72-25 107 40q11 21-24 51Z" /><path d="M123 48q-3 66 66 102M127 76l-34-14m49 36-43-10m50 9 12-32m-3 52 19-17" /></>,
  mushroom: <><path d="M70 96q42-101 85 0Zm33 0-6 45q16 8 31 0l-8-45" /><path d="M148 65q37-67 111-29q-13 53-105 41M151 72l91-31" /><path d="M76 151h125" opacity=".25" /></>,
  snail: <><circle cx="122" cy="97" r="35" /><path d="M143 100q-1-32-32-24q-29 18-5 39q24 12 31-10q3-18-15-18q-13 1-10 13" /><path d="M71 139q-1-26 22-16l18 5q50 0 66-18l12 8-9 25H71Zm108-27 8-21m-2 21 17-17M218 85h60l-8 63h-44Z" /></>,
  duck: <><ellipse cx="139" cy="109" rx="62" ry="29" /><circle cx="186" cy="68" r="21" /><path d="m207 62 27 10-27 6M95 105l-26-21 12 34M118 107q21-14 47 0" /><circle cx="192" cy="65" r="2" fill="currentColor" /><path d="M59 151q45-10 87 0m18 0q42-10 85 0" opacity=".45" /></>,
  house: <><path d="M68 81h161v68H68ZM51 81l97-54 97 54M193 54l-7-30 19-3 9 45" /><path d="M132 149v-47h29v47m-69-40h25v24H92Z" /><path d="M53 159h193" opacity=".25" /></>,
  tent: <><path d="M61 99l66-68 75 68Zm66-68v68m0-47-30 47m30-47 36 47M46 114h214" /><path d="m61 126 66 38 75-38m-75 0v38" opacity=".25" strokeDasharray="4 5" /></>,
};
export default function DrawingReference({id, subject}: {id: string; subject: string}) {
  const guide = guides[DRAWING_REFERENCES[id]];
  if (!guide) return null;
  return <details className="mt-4 rounded-xl bg-white/[0.03] p-3" open>
    <summary className="cursor-pointer text-sm font-semibold min-h-8">Sketch reference · show or hide</summary>
    <figure className="mt-2" data-reference-id={id}>
      <svg role="img" aria-label={`Starting shapes for ${subject}`} viewBox="0 0 320 180" className="w-full h-32 sm:h-40 text-[var(--neon-cyan)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{guide}</svg>
      <figcaption className="mt-1 text-xs text-[var(--text-secondary)]">One way to start. Change the shapes and make it yours.</figcaption>
    </figure>
  </details>;
}
