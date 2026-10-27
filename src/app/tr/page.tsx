import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_GENERAL_TOPICS } from "@/data/turkishTopics";
import { hreflangAlternates } from "@/i18n/config";
import { allLocaleSiblings } from "@/lib/localePages";

const path = "/tr";

export const metadata: Metadata = withSocial({
  title: { absolute: "Rastgele Konu Seçici — Ücretsiz Türkçe Konu Üretici | Random Topics" },
  description:
    "Rastgele konu seçici: tek tıkla Türkçe sohbet, tartışma, kompozisyon ve sunum konusu. 72 konu, 6 kategori, tekrar yok, kayıt yok, ücretsiz.",
  alternates: { canonical: path, languages: hreflangAlternates("/") },
});

export default function TurkishTopicPickerPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_GENERAL_TOPICS}
      siblings={allLocaleSiblings("tr")}
      title="Rastgele Konu Seçici"
      lead="Butona bas, rastgele bir konu gelsin. Sohbet başlatmak, sınıfta tartışma açmak, kompozisyon yazmak ya da arkadaşlarla oyun oynamak için 6 kategoride 72 Türkçe konu; deste bitene kadar aynı konu tekrar çıkmaz."
      howTo={[
        "İstersen bir kategori seç (Günlük hayat, Teknoloji, Eğitim, Çevre, Eğlenceli, Toplum) ya da Tümü seçeneğinde kal.",
        "“Rastgele konu seç” butonuna bas; konu kartta görünür.",
        "Beğenmezsen tekrar bas. Konuyu “Kopyala” ile panoya alabilirsin.",
        "Çark istersen Rastgele Konu Çarkı, süreli konuşma için 1 Dakika Konuşma Konuları sayfasını kullan.",
      ]}
      faq={[
        {
          question: "Rastgele konu seçici nedir?",
          answer:
            "Önceden hazırlanmış Türkçe konu listesinden tek tıkla rastgele bir konu çeken ücretsiz bir araçtır. Sohbet, münazara, kompozisyon, sunum ve sınıf etkinlikleri için kullanılır.",
        },
        {
          question: "Aynı konu tekrar çıkar mı?",
          answer:
            "Hayır. Seçtiğin kategorideki tüm konular gösterilmeden aynı konu tekrar gelmez; deste bitince yeniden karıştırılır.",
        },
        {
          question: "Öğretmenler sınıfta kullanabilir mi?",
          answer:
            "Evet. Konular okul ortamına uygundur; projeksiyona yansıtıp öğrencilere konu seçtirebilir, Eğitim ve Toplum kategorilerini tartışma dersi için kullanabilirsiniz.",
        },
        {
          question: "Ücretli mi, kayıt gerekiyor mu?",
          answer: "Tamamen ücretsizdir ve kayıt gerektirmez. Telefonda ve bilgisayarda tarayıcıdan çalışır.",
        },
      ]}
    />
  );
}
