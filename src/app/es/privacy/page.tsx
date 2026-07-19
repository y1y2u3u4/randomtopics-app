import Link from "next/link";
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
              Última actualización: julio de 2026
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

          {/* Advertising */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Publicidad
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              randomtopics.app es gratuito, y la publicidad es lo que lo financia.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                Proveedores externos, incluido Google, utilizan cookies para mostrar
                anuncios basados en tus visitas anteriores a este sitio web o a otros
                sitios web.
              </li>
              <li>
                El uso de cookies de publicidad por parte de Google permite que Google y
                sus socios muestren anuncios basados en tu visita a este sitio y/o a
                otros sitios de Internet.
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Puedes desactivar la publicidad personalizada en la{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                Configuración de anuncios de Google
              </a>
              , o rechazar el uso de cookies de proveedores externos en{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                aboutads.info
              </a>
              .
            </p>
          </section>

          {/* GDPR & CCPA */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tus Derechos (RGPD y CCPA)
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">
                Si te encuentras en el EEE o el Reino Unido (RGPD):
              </strong>{" "}
              la analítica y la publicidad personalizada se basan en tu consentimiento,
              que puedes retirar en cualquier momento desde tu navegador o mediante los
              controles de publicidad indicados arriba. Tienes derecho a acceder,
              rectificar, suprimir o limitar el tratamiento de tus datos personales, y a
              presentar una reclamación ante tu autoridad de control local. Como no
              tenemos cuentas ni almacenamos registros personales, en la mayoría de los
              casos sencillamente no conservamos nada que devolverte.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">
                Si resides en California (CCPA/CPRA):
              </strong>{" "}
              no vendemos tu información personal a cambio de dinero. Mostrar publicidad
              personalizada puede considerarse &quot;compartir&quot; según la legislación
              de California; los enlaces de exclusión anteriores lo detienen. No te
              trataremos de forma distinta por ejercer estos derechos.
            </p>
          </section>

          {/* Children */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Privacidad de los Menores
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Nuestros temas y preguntas están escritos para ser aptos para el aula y
              para toda la familia, y hay profesores que los usan con sus alumnos. El
              sitio está dirigido al público general, no a menores de 13 años, y no
              recopilamos conscientemente información personal de nadie: no hay cuentas,
              formularios ni registros en ninguna parte del sitio. Si crees que un menor
              nos ha facilitado información personal, escríbenos y la eliminaremos.
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
              Si tienes alguna pregunta sobre esta política de privacidad, o una
              solicitud relativa a tus datos, escríbenos a{" "}
              <a
                href="mailto:zhanggongqing1314007@gmail.com"
                className="text-[var(--accent-blue)] hover:underline"
              >
                zhanggongqing1314007@gmail.com
              </a>
              . También puedes contactarnos desde nuestra{" "}
              <Link href="/es/contact" className="text-[var(--accent-blue)] hover:underline">
                página de contacto
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
