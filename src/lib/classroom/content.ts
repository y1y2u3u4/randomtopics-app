import "server-only";
import content from "@/data/classroomPacks.json";
import type { ClassroomPackId } from "./catalog";

export type ClassroomSlide = {
  section: string;
  label: string;
  text: string;
  followUp?: string;
  level?: string;
  theme?: string;
  pro?: string;
  con?: string;
  timing?: { label: string; prep: number; speak: [number, number]; rule: string };
};

type Pack = (typeof content.packs)[number];

/** Questions anyone can present before buying. */
export const PREVIEW_SLIDES = 5;

export function classroomContent(id: ClassroomPackId): Pack {
  const pack = content.packs.find((p) => p.id === id);
  if (!pack) throw new Error(`Unknown classroom pack ${id}`);
  return pack;
}

export function classroomSlides(id: ClassroomPackId): ClassroomSlide[] {
  const pack = classroomContent(id);
  const timing = (pack as { timing?: Record<string, ClassroomSlide["timing"]> }).timing;
  return pack.sections.flatMap((section) =>
    section.items.map((raw) => {
      const item = raw as Record<string, string>;
      return {
        section: section.title,
        label: item.label,
        text: item.text,
        ...(item.followUp ? { followUp: item.followUp, level: item.level, theme: item.theme } : {}),
        ...(item.pro ? { pro: item.pro, con: item.con } : {}),
        ...(item.timing && timing ? { timing: timing[item.timing] } : {}),
      };
    }),
  );
}
