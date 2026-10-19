import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_GENERAL_TOPICS } from "@/data/turkishTopics";
import { SITE_URL } from "@/i18n/config";

const path = "/tr/rastgele-konu-carki";

export const metadata: Metadata = withSocial({
  title: { absolute: "Rastgele Konu Çarkı — Çarkı Çevir, Konu Seç | Random Topics" },
  description:
    "Rastgele konu çarkı: çarkı çevir, Türkçe bir sohbet veya tartışma konusu çıksın. Kategori seç, tekrar yok, ücretsiz ve kayıtsız konu çarkı.",
  alternates: { canonical: path, languages: { tr: `${SITE_URL}${path}`, "x-default": `${SITE_URL}${path}` } },
});

export default function TurkishTopicWheelPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_GENERAL_TOPICS}
      mode="wheel"
      title="Rastgele Konu Çarkı"
      lead="Çarkı çevir, rastgele bir konu çıksın. Sınıfta, toplantıda ya da arkadaş grubunda konu seçimini şansa bırakmak için 72 Türkçe konulu ücretsiz konu çarkı; deste bitene kadar konu tekrar etmez."
      howTo={[
        "Bir kategori seç ya da Tümü ile devam et.",
        "“Çarkı çevir” butonuna bas; çark durduğunda konu kartta görünür.",
        "Sıradaki kişi için tekrar çevir. Çıkan konuyu kopyalayıp paylaşabilirsin.",
        "Projeksiyonda açarak bütün sınıfın çarkı görmesini sağlayabilirsin.",
      ]}
      faq={[
        {
          question: "Konu çarkı nasıl çalışır?",
          answer:
            "Çarkı çevirdiğinde araç seçili kategorideki konulardan birini rastgele seçer. Seçim tekrar etmeyen karışık bir desteden yapılır; böylece her konu eşit şansa sahiptir.",
        },
        {
          question: "Çarka kendi seçeneklerimi ekleyebilir miyim?",
          answer:
            "Kendi seçeneklerini yazmak istersen İngilizce arayüzlü Spin the Wheel aracını kullanabilirsin; bu sayfa hazır Türkçe konularla çalışır.",
        },
        {
          question: "Konu çarkı hangi etkinliklerde kullanılır?",
          answer:
            "Sınıf içi konuşma etkinlikleri, münazara ısınması, buz kırıcı oyunlar, toplantı açılışları ve aile sohbetleri için uygundur.",
        },
        {
          question: "Telefonda çalışıyor mu?",
          answer: "Evet, uygulama indirmeden tarayıcıda çalışır ve ücretsizdir.",
        },
      ]}
    />
  );
}
