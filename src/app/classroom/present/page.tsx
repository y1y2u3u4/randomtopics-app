import type { Metadata } from "next";
import ClassroomPresenter from "@/components/ClassroomPresenter";
import { classroomPackId } from "@/lib/classroom/catalog";

export const metadata: Metadata = {
  title: "Classroom presenter",
  robots: { index: false, follow: true },
};

export default async function PresentPage({ searchParams }: { searchParams: Promise<{ pack?: string }> }) {
  const pack = classroomPackId((await searchParams).pack) ?? "question-of-the-day";
  return <ClassroomPresenter pack={pack} />;
}
