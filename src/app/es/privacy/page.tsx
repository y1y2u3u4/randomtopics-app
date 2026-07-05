import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Política de Privacidad | Random Topics" },
  description:
    "Política de privacidad de randomtopics.app: Generador de Temas al Azar.",
  alternates: {
    canonical: "/es/privacy",
    languages: hreflangAlternates("/privacy"),
  },
};

export default function PrivacyPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12" lang="es">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Header */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Política de <span className="gradient-text">Privacidad</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Última actualización: marzo de 2026
            </p>
          </section>

          {/* Introduction */}
          <section className="glass-card p-8 space-y-4">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              En <strong className="text-[var(--text-primary)]">randomtopics.app</strong>,
              tu privacidad importa. Esta política explica qué datos recopilamos
              (aviso: muy pocos), cómo los usamos y qué opciones tienes.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Información que Recopilamos
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">No</strong> recopilamos
              ninguna información personal. No hay cuentas de usuario, ni
              formularios de registro, ni recopilación de correos electrónicos en
              este sitio web.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Los únicos datos que reunimos son estadísticas de uso anónimas y
              agregadas a través de Google Analytics (ver más abajo). Esto nos
              ayuda a entender cómo usa la gente la herramienta para poder
              mejorarla.
            </p>
          </section>

          {/* Cookies */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cookies
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Usamos cookies únicamente a través de servicios de terceros:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Google Analytics</strong>{" "}
                &mdash; Usa cookies para recopilar datos de uso anónimos como
                páginas vistas, duración de la sesión y región geográfica
                aproximada. No se recopila ninguna información que permita
                identificarte personalmente.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Google AdSense</strong>{" "}
                &mdash; Puede usar cookies para mostrar anuncios relevantes. Estas
                cookies no te identifican personalmente.
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Puedes desactivar las cookies en la configuración de tu navegador
              en cualquier momento.
            </p>
          </section>

          {/* Local Storage */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Almacenamiento Local
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Usamos el almacenamiento local de tu navegador para guardar tus
              temas favoritos y tu historial de temas. Estos datos permanecen
              íntegramente en tu dispositivo &mdash; nunca se envían a nuestros
              servidores ni se comparten con nadie. Puedes borrarlos en cualquier
              momento desde la configuración de tu navegador.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Servicios de Terceros
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Usamos los siguientes servicios de terceros:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Google Analytics</strong>{" "}
                &mdash; Para estadísticas anónimas de uso del sitio web.{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-blue)] hover:underline"
                >
                  Política de Privacidad de Google
                </a>
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Google AdSense</strong>{" "}
                &mdash; Para mostrar anuncios.{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-blue)] hover:underline"
                >
                  Política de Anuncios de Google
                </a>
              </li>
            </ul>
          </section>

          {/* No Personal Data */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sin Recopilación de Datos Personales
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Para que quede claro: no recopilamos, almacenamos ni procesamos
              ningún dato personal. No hay cuentas de usuario, ni sistemas de
              inicio de sesión, ni listas de correo, ni formularios de contacto
              que recojan información personal. No tenemos ninguna base de datos
              de usuarios.
            </p>
          </section>

          {/* Changes */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cambios en Esta Política
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Podemos actualizar esta política de privacidad de vez en cuando.
              Cualquier cambio se publicará en esta página con una fecha de
              &quot;Última actualización&quot; actualizada.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contacto
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Si tienes alguna pregunta sobre esta política de privacidad, ponte
              en contacto con nosotros a través de nuestro sitio web en{" "}
              <a
                href="https://randomtopics.app"
                className="text-[var(--accent-blue)] hover:underline"
              >
                randomtopics.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
