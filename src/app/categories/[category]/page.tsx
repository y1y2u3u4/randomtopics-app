import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import { CATEGORIES } from "@/data/types";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  const label = cat?.label ?? "Topics";

  return {
    title: `Random ${label} Topics - ${label} Discussion Ideas & Prompts`,
    description: `Generate random ${label.toLowerCase()} topics for conversations, writing, debates, and more. ${cat?.description ?? "Explore interesting topics."}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  const label = cat?.label ?? "Topics";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator
          initialCategory={category as any}
          title={`${label} Topic Generator`}
          subtitle={cat?.description ?? "Explore interesting topics in this category."}
        />
      </main>
      <Footer />
    </>
  );
}
