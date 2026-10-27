import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";
import TurkishToolPage from "@/components/TurkishToolPage";
import { TR_CONVERSATION_TOPICS } from "@/data/turkishTopics";
import { hreflangAlternates } from "@/i18n/config";

const path = "/tr/sohbet-konulari";

export const metadata: Metadata = withSocial({
  title: { absolute: "Sohbet Konuları — Rastgele Sohbet Konusu ve Sorular | Random Topics" },
  description:
    "Sohbet konuları: arkadaşlarla, ailenle ya da yeni tanıştığın biriyle konuşacak 40 Türkçe sohbet sorusu. Tek tıkla rastgele konu seç, tekrar yok, ücretsiz.",
  alternates: { canonical: path, languages: hreflangAlternates("/conversation") },
});

export default function TurkishConversationTopicsPage() {
  return (
    <TurkishToolPage
      path={path}
      groups={TR_CONVERSATION_TOPICS}
      title="Sohbet Konuları"
      lead="Konuşacak bir şey bulamadığında butona bas. Hafif ve eğlenceli sorulardan derin sohbetlere kadar 5 kategoride 40 Türkçe sohbet konusu; arkadaşlarla, ailenle ya da yeni tanıştığın biriyle konuşmayı açmak için."
      howTo={[
        "Bir kategori seç ya da Tümü ile devam et.",
        "“Rastgele konu seç” butonuna bas; sohbet sorusu kartta görünür.",
        "Önce sen cevap ver, böylece karşındaki kişi rahatlar; sonra soruyu ona çevir.",
        "Sohbet durulunca tekrar bas. Soruyu “Kopyala” ile mesajlaşmaya yapıştırabilirsin.",
      ]}
      faq={[
        {
          question: "Sohbet açmak için hangi konular iyi?",
          answer:
            "Günlük hayattan açık uçlu sorular en iyisidir: yemek, dizi, tatil, hafta sonu planı. Evet-hayırla bitmeyen sorular hikâye anlatmayı kolaylaştırır.",
        },
        {
          question: "Yeni tanıştığım biriyle hangi konuları konuşmalıyım?",
          answer:
            "Hafif ve Seyahat kategorileriyle başla. Derin sorulara sohbet ısındıktan sonra geç.",
        },
        {
          question: "Mesajlaşmada kullanabilir miyim?",
          answer:
            "Evet. “Kopyala” butonuyla soruyu alıp WhatsApp veya başka bir uygulamada gönderebilirsin.",
        },
        {
          question: "Konular tekrar eder mi?",
          answer:
            "Hayır. Liste karıştırılır ve seçili kategorideki tüm konular gösterilmeden aynı konu gelmez.",
        },
      ]}
    />
  );
}
