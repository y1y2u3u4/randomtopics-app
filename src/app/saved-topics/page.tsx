import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SavedTopicsLibrary from "@/components/SavedTopicsLibrary";

export const metadata: Metadata = {
  title: "Saved Topics & Recent History",
  description: "View the random topics you saved and recently generated in this browser.",
  alternates: { canonical: "/saved-topics" },
  robots: { index: false, follow: true },
};

export default function SavedTopicsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Saved Topics" }]} />
        <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 text-center">
          <h1 className="section-heading text-4xl sm:text-5xl font-extrabold mb-4">
            Your Topic Library
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Revisit favorites and recent results without creating an account.
          </p>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <SavedTopicsLibrary locale="en" />
        </div>
      </main>
      <Footer />
    </>
  );
}
