import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Icebreaker Question Generator - Fun Group Activities",
  description:
    "Generate random icebreaker questions for meetings, team building, classrooms, and social events. Get groups talking instantly.",
};

export default function IcebreakerPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator
          initialMode="icebreaker"
          title="Icebreaker Question Generator"
          subtitle="Fun icebreaker questions to get any group talking, laughing, and connecting."
        />
      </main>
      <Footer />
    </>
  );
}
