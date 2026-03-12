import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funny Random Topic Generator - Hilarious Discussion Topics",
  description:
    "Generate funny, weird, and bizarre random topics guaranteed to make everyone laugh. Perfect for parties, games, and breaking awkward silences.",
};

export default function FunnyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Funny Topics" },
          ]}
        />
        <TopicGenerator
          initialCategory="weird-fun"
          title="Funny Topic Generator"
          subtitle="Hilarious, weird, and wonderfully bizarre topics that'll make everyone crack up."
        />
      </main>
      <Footer />
    </>
  );
}
