import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Writing Prompt Generator - Creative Writing Ideas",
  description:
    "Generate random writing prompts for stories, essays, blog posts, and creative writing exercises. 500+ unique prompts across 15+ categories.",
};

export default function WritingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator
          initialMode="writing"
          title="Writing Prompt Generator"
          subtitle="Spark your creativity with random writing prompts across every genre and topic."
        />
      </main>
      <Footer />
    </>
  );
}
