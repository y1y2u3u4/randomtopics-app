import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Conversation Topic Generator - 200+ Conversation Starters",
  description:
    "Generate random conversation topics and starters for any situation. Perfect for dates, parties, networking events, and everyday chats.",
};

export default function ConversationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Conversation Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="conversation"
          title="Conversation Starter Generator"
          subtitle="Generate random conversation topics to break the ice and keep discussions flowing."
        />
      </main>
      <Footer />
    </>
  );
}
