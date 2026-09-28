import Link from "next/link";
import type { Metadata } from "next";
import { z } from "zod";
import SpeechResume from "@/components/SpeechResume";
import { topics } from "@/data/topics";
export const metadata: Metadata = { title: "Continue your speech practice", robots: { index: false, follow: false } };
export default async function PracticePage({ searchParams }: { searchParams: Promise<{ attempt?: string; next?: string }> }) {
  const { attempt, next } = await searchParams;
  if (!z.uuid().safeParse(attempt).success) return <div className="p-8"><p>Choose a saved answer to continue.</p><Link href="/speech/account" className="underline">Open practice history</Link></div>;
  return <SpeechResume attemptId={attempt!} next={next === "1"} topics={topics.filter(topic => topic.modes.includes("speech") && topic.depth === "light").slice(0, 12)} />;
}
