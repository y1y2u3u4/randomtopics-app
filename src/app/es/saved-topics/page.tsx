import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SavedTopicsLibrary from "@/components/SavedTopicsLibrary";

export const metadata: Metadata = {
  title: { absolute: "Temas guardados e historial reciente | RandomTopics" },
  description: "Consulta los temas que guardaste y generaste recientemente en este navegador.",
  alternates: { canonical: "/es/saved-topics" },
  robots: { index: false, follow: true },
};

export default function SavedTopicsPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Temas guardados" }]} />
        <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 text-center">
          <h1 className="section-heading text-4xl sm:text-5xl font-extrabold mb-4">
            Tu biblioteca de temas
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">
            Vuelve a tus favoritos y resultados recientes sin crear una cuenta.
          </p>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <SavedTopicsLibrary locale="es" />
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
