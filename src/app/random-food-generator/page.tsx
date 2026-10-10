import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FoodGenerator from "@/components/generators/FoodGenerator";
import { CUISINES, FOODS } from "@/lib/generators/foods";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-food-generator";
const TITLE = "Random Food Generator — What Should I Eat Today?";
const DESCRIPTION = `Can't decide what to eat? The random food generator picks from ${FOODS.length}+ real dishes from ${Object.keys(CUISINES).length} cuisines. Filter by breakfast, lunch, dinner, snack or dessert, cuisine and vegetarian, vegan or gluten-free.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random food generator", "what should i eat", "what to eat today", "random meal generator", "random dinner generator", "food picker", "random dish generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the random food generator decide what I should eat?",
    answer: `It picks at random from ${FOODS.length}+ well-known dishes that match your filters — meal, cuisine and diet. Each result has a one-line description so you know what you're getting. Dishes don't repeat until you've seen everything that matches.`,
  },
  {
    question: "Can I get only vegetarian, vegan or gluten-free ideas?",
    answer:
      "Yes. Choose a diet filter to see only dishes that are vegetarian, vegan or gluten-free in their usual recipe. Always check the actual ingredients if you have an allergy — recipes vary between restaurants and cooks.",
  },
  {
    question: "Can it pick dinner ideas from a specific cuisine?",
    answer:
      "Pick Dinner and one or more cuisines — for example Thai and Mexican — and generate three options. It's a quick way to settle a takeout debate or plan a week of meals.",
  },
  {
    question: "How do people use a random food picker?",
    answer:
      "To end the 'I don't know, what do you want?' loop, to plan meals for the week, to choose a dish to learn to cook, for food-themed party games, or for a cuisine-of-the-week challenge.",
  },
];

export default function RandomFoodGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Food Generator"
      heading={["Random Food", "Generator"]}
      intro={`What should you eat today? Let chance decide — ${FOODS.length}+ real dishes from ${Object.keys(CUISINES).length} cuisines, filtered by meal and diet.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/this-or-that", label: "This or that questions" },
        { href: "/would-you-rather", label: "Would you rather" },
        { href: "/categories/food-travel", label: "Food & travel topics" },
      ]}
      content={
        <>
          <SectionTitle>End the &quot;what do you want to eat?&quot; loop</SectionTitle>
          <p>
            Decision fatigue is real, and dinner is where it peaks. This <strong>random food generator</strong> answers &quot;what should I
            eat today?&quot; with a real dish — pad thai, shakshuka, chicken adobo, a croque monsieur — plus a line on what it is. Not feeling
            it? Generate again; the same dish won&apos;t come back until you&apos;ve seen them all.
          </p>
          <SectionTitle>Filter to what you can actually have</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Meal</strong> — breakfast, lunch, dinner, snacks or desserts.</li>
            <li><strong>Cuisine</strong> — {Object.values(CUISINES).slice(0, 10).map((c) => c.replace(/^\S+\s/, "")).join(", ")} and more.</li>
            <li><strong>Diet</strong> — vegetarian, vegan or gluten-free in the usual recipe.</li>
          </ul>
          <SectionTitle>Ways to use it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Weekly meal plan</strong> — generate seven dinners and shop once.</li>
            <li><strong>Learn to cook</strong> — pick one new dish a week from a cuisine you&apos;ve never tried.</li>
            <li><strong>Party games</strong> — food rounds of <Link href="/this-or-that" className={linkClass}>this or that</Link> or{" "}
              <Link href="/would-you-rather" className={linkClass}>would you rather</Link>.</li>
          </ul>
        </>
      }
    >
      <FoodGenerator />
    </GeneratorPageShell>
  );
}
