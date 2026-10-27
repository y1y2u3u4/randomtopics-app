import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_DEBATE_TOPICS } from "@/data/turkishTopics";
import { hreflangAlternates } from "@/i18n/config";

const path = "/tr/munazara-konulari";

export const metadata: Metadata = withSocial({
  title: { absolute: "Münazara Konuları — Rastgele Münazara Konusu Seç | Random Topics" },
  description:
    "Münazara konuları: eğitim, teknoloji, toplum ve çevre başlıklarında 40 Türkçe tartışma konusu. Tek tıkla rastgele konu seç, tekrar yok, ücretsiz.",
  alternates: { canonical: path, languages: hreflangAlternates("/debate") },
});

export default function TurkishDebateTopicsPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_DEBATE_TOPICS}
      title="Münazara Konuları"
      lead="Münazara için konu bulamıyor musun? Butona bas, eğitim, teknoloji, toplum, çevre ve eğlenceli kategorilerinden 40 Türkçe münazara konusundan biri gelsin. Sınıf, kulüp ya da arkadaş grubu için tez ve antitez kurmaya hazır sorular."
      howTo={[
        "İstersen bir kategori seç (Eğitim, Teknoloji, Toplum, Çevre, Eğlenceli) ya da Tümü ile devam et.",
        "“Rastgele konu seç” butonuna bas; münazara konusu kartta görünür.",
        "Grubu iki tarafa ayır: biri konuyu savunsun, diğeri karşı çıksın. Taraflar kura ile de seçilebilir.",
        "Her taraf için 2 dakika hazırlık, 1 dakika açılış konuşması ve karşılıklı soru-cevap turu planla.",
      ]}
      faq={[
        {
          question: "Münazara konusu nasıl seçilir?",
          answer:
            "İki tarafın da makul argümanlar bulabileceği, evet ya da hayırla cevaplanabilen bir soru seçilmelidir. “Okullarda not sistemi kaldırılmalı mı?” gibi sorular bunun için uygundur; cevabı belli olan konulardan kaçının.",
        },
        {
          question: "Münazara kaç kişiyle yapılır?",
          answer:
            "En az iki kişi yeterlidir. Sınıfta genellikle her tarafta 2–4 kişilik iki takım kurulur; kalanlar jüri ve zaman tutucu olur.",
        },
        {
          question: "Konular okul için uygun mu?",
          answer:
            "Evet. Konular güncel ve okul ortamına uygundur; Eğlenceli kategorisi ısınma turu için idealdir.",
        },
        {
          question: "Ücretli mi, kayıt gerekiyor mu?",
          answer:
            "Tamamen ücretsizdir ve kayıt gerektirmez. Telefonda ve bilgisayarda tarayıcıdan çalışır.",
        },
      ]}
    />
  );
}
