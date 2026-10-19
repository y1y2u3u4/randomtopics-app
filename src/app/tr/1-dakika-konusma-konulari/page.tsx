import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_SPEAKING_TOPICS } from "@/data/turkishTopics";
import { SITE_URL } from "@/i18n/config";

const path = "/tr/1-dakika-konusma-konulari";

export const metadata: Metadata = withSocial({
  title: { absolute: "1 Dakika Konuşma Konuları — Süreli Rastgele Konu | Random Topics" },
  description:
    "1 dakika konuşma konuları: rastgele Türkçe konu seç, 60 saniyelik sayacı başlat. Kolay, orta ve zor seviyede 30 hazırlıksız konuşma konusu, ücretsiz.",
  alternates: { canonical: path, languages: { tr: `${SITE_URL}${path}`, "x-default": `${SITE_URL}${path}` } },
});

export default function TurkishOneMinuteTopicsPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_SPEAKING_TOPICS}
      mode="timer"
      buttonLabel="Konuşma konusu seç"
      title="1 Dakika Konuşma Konuları"
      lead="Rastgele bir konu seç, 1 dakikalık sayacı başlat ve hazırlıksız konuş. Kolay, orta ve zor seviyede 30 Türkçe konu; sınıf içi konuşma etkinlikleri, Türkçe dersi, mülakat provası ve topluluk önünde konuşma pratiği için."
      howTo={[
        "Seviye seç: Kolay (ısınma), Orta (fikir belirt) ya da Zor (hazırlıksız konuşma).",
        "“Konuşma konusu seç” butonuna bas, sonra “1 dakika başlat” butonuna dokun.",
        "60 saniye boyunca konuyu anlat: bir giriş cümlesi, iki örnek ve bir sonuç yeterli.",
        "Süre dolunca sırayı bir sonraki kişiye ver ve yeni konu seç.",
      ]}
      faq={[
        {
          question: "1 dakikada ne kadar konuşulur?",
          answer:
            "Ortalama bir konuşmacı bir dakikada 120–150 kelime söyler. Bu, bir giriş cümlesi, iki kısa örnek ve bir sonuç cümlesi için yeterlidir.",
        },
        {
          question: "Hazırlıksız konuşmada nasıl başlamalıyım?",
          answer:
            "Konuyu kendi cümlenle tekrar ederek başla, sonra tek bir görüş seç ve onu bir kişisel örnekle destekle. Sonunda görüşünü bir cümleyle özetle.",
        },
        {
          question: "Bu konular sınıf etkinliği için uygun mu?",
          answer:
            "Evet. Kolay seviye ilkokul ve ortaokul ısınmaları, orta ve zor seviye lise Türkçe dersi ve münazara hazırlığı için uygundur.",
        },
        {
          question: "Sayaç kendiliğinden başlar mı?",
          answer:
            "Hayır. Konuyu okuduktan sonra hazır olduğunda “1 dakika başlat” butonuna basarsın; istediğin zaman yeniden başlatabilirsin.",
        },
      ]}
    />
  );
}
