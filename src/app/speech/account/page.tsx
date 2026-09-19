import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SpeechAccount from "@/components/SpeechAccount";
export const metadata: Metadata = {
  title: "Your speech practice",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <SpeechAccount />
      </main>
      <Footer />
    </>
  );
}
