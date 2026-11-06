import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { DE_GENERAL } from "@/data/germanTopics";
import { deCopy } from "@/data/dePageCopy";
import { allLocaleSiblings } from "@/lib/localePages";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const path = "/de";
const COUNT = DE_GENERAL.reduce((n, g) => n + g.topics.length, 0);
const TITLE = "Themen-Generator: Zufälliges Thema per Klick | Random Topics";
const DESCRIPTION = `Themen-Generator auf Deutsch: ein zufälliges Thema für Gespräch, Diskussion, Nachdenken oder Schreiben. ${COUNT} Themen in 5 Kategorien, ohne Wiederholung. Kostenlos, ohne Anmeldung.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: path, languages: hreflangAlternates("/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${path}`, siteName: "Random Topics", locale: "de_DE", type: "website" },
};

export default function DeHomePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={DE_GENERAL}
      englishHref="/"
      title="Themen-Generator"
      lead={`Tippe auf den Button und du bekommst sofort ein zufälliges Thema. ${COUNT} Themen auf Deutsch für Gespräche, Diskussionen, zum Nachdenken oder als Schreibanlass: Such dir eine Kategorie aus oder lass dich von allem überraschen.`}
      buttonLabel="Thema ziehen"
      copy={deCopy("Random Topic Generator", "Thema ziehen")}
      siblings={allLocaleSiblings("de")}
      howTo={[
        "Wähle eine Kategorie (Gespräch, Diskussion, Nachdenken, Schreiben, Alltag) oder lass „Alle“ eingestellt.",
        "Tippe auf „Thema ziehen“: Das Thema erscheint direkt in der Karte.",
        "Gefällt es dir nicht? Zieh einfach das nächste. Ein Thema kommt erst wieder, wenn alle anderen durch sind.",
        "Mit „Kopieren“ schickst du es an deine Gruppe, oder du öffnest unten einen der speziellen Generatoren.",
      ]}
      faq={[
        { question: "Was ist ein Themen-Generator?", answer: "Ein Themen-Generator zieht mit einem Klick ein zufälliges Thema aus einer fertigen Liste. Er hilft, wenn dir für ein Gespräch, eine Diskussionsrunde oder einen Text die Idee fehlt." },
        { question: "Wiederholen sich die Themen?", answer: "Nein. Die Liste wird gemischt, und ein Thema taucht erst wieder auf, wenn alle anderen der gewählten Kategorie gezogen wurden." },
        { question: "Kann ich den Generator im Unterricht oder im Team nutzen?", answer: "Ja. Die Themen sind für Schule, Uni und Büro geeignet. Zeig die Seite per Beamer und lass die Gruppe selbst ziehen." },
        { question: "Kostet das etwas oder muss ich mich anmelden?", answer: "Nein. Der Generator ist kostenlos und braucht keine Anmeldung. Er läuft im Browser auf Handy und Computer." },
      ]}
    />
  );
}
