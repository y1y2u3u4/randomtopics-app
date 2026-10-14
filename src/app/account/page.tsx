import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassroomAccount from "@/components/ClassroomAccount";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <Navbar showLocaleSwitcher={false} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <ClassroomAccount />
      </main>
      <Footer />
    </>
  );
}
