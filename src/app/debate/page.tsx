import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Debate Topic Generator - Controversial Discussion Topics",
  description:
    "Generate random debate topics for classroom discussions, debate clubs, and practice rounds. Thought-provoking issues with talking points.",
};

export default function DebatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator
          initialMode="debate"
          title="Debate Topic Generator"
          subtitle="Find thought-provoking debate topics with clear arguments for both sides."
        />
      </main>
      <Footer />
    </>
  );
}
