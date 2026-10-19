import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_RESEARCH_TOPICS } from "@/data/turkishTopics";
import { SITE_URL } from "@/i18n/config";

const path = "/tr/rastgele-arastirma-konulari";

export const metadata: Metadata = withSocial({
  title: { absolute: "Rastgele Araştırma Konuları — Ödev ve Proje Konusu Seç | Random Topics" },
  description:
    "Rastgele araştırma konuları: fen, sosyal bilimler, teknoloji ve tarih alanlarında 40 Türkçe ödev ve proje konusu. Tek tıkla seç, tekrar yok, ücretsiz.",
  alternates: { canonical: path, languages: { tr: `${SITE_URL}${path}`, "x-default": `${SITE_URL}${path}` } },
});

export default function TurkishResearchTopicsPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_RESEARCH_TOPICS}
      buttonLabel="Araştırma konusu seç"
      title="Rastgele Araştırma Konuları"
      lead="Ödev, proje ya da araştırma raporu için konu mu arıyorsun? Fen ve sağlık, sosyal bilimler, teknoloji, tarih ve kültür alanlarında 40 Türkçe araştırma konusundan birini tek tıkla seç; her konu kaynak bulunabilecek, sınırları belli bir başlık olarak yazıldı."
      howTo={[
        "Dersine uygun alanı seç (Fen ve sağlık, Sosyal bilimler, Teknoloji, Tarih ve kültür).",
        "“Araştırma konusu seç” butonuna bas.",
        "Konuyu daralt: bir yaş grubu, şehir ya da zaman aralığı ekle (ör. “… lise öğrencilerinde”).",
        "Araştırma sorusunu yaz, en az üç güvenilir kaynak bul ve yöntemini belirle.",
      ]}
      faq={[
        {
          question: "İyi bir araştırma konusu nasıl seçilir?",
          answer:
            "İlgini çeken, kaynak bulunabilen ve süren içinde bitirilebilecek kadar dar bir konu seç. Geniş bir başlığı yaş grubu, yer ya da zaman aralığıyla daraltmak işini kolaylaştırır.",
        },
        {
          question: "Bu konular lise ödevleri için uygun mu?",
          answer:
            "Evet. Konular lise ve üniversitenin ilk yılları düşünülerek yazıldı; proje ödevi, performans görevi ve bilim fuarı hazırlığı için başlangıç noktası olarak kullanılabilir.",
        },
        {
          question: "Konuyu nasıl araştırma sorusuna çeviririm?",
          answer:
            "Konuyu “… nasıl etkiler?” ya da “… ile … arasında ilişki var mı?” biçiminde soruya dönüştür. Örneğin “Uyku süresinin öğrenci başarısına etkisi” konusu “Lise öğrencilerinde uyku süresi not ortalamasını etkiler mi?” olabilir.",
        },
        {
          question: "Konular tekrar ediyor mu?",
          answer: "Seçili alandaki tüm konular gösterilene kadar tekrar yoktur.",
        },
      ]}
    />
  );
}
