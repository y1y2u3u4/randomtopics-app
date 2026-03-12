import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Speech Topic Generator - Public Speaking Ideas",
  description:
    "Generate random speech topics for presentations, public speaking practice, and Toastmasters. Find your next great speech idea instantly.",
};

export default function SpeechPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Speech Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          title="Speech Topic Generator"
          subtitle="Discover the perfect topic for your next presentation, speech, or public speaking practice."
        />
      </main>
      <Footer />
    </>
  );
}
