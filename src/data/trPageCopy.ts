import type { LocalePageCopy } from "@/components/LocaleToolPage";

// Shared Turkish chrome for the batch-1 /tr pages rendered by LocaleToolPage (2026-10-28).
export function trCopy(englishLabel: string, buttonLabel: string, listHeading = "Tam liste"): LocalePageCopy {
  return {
    lang: "tr",
    currency: "TRY",
    homeHref: "/tr",
    homeLabel: "Ana sayfa",
    meta: "Ücretsiz · kayıt yok · {n} seçenek · Ekim 2026'da güncellendi",
    siblingsHeading: "Diğer Türkçe araçlar",
    howToHeading: "Nasıl kullanılır?",
    listHeading,
    faqHeading: "Sıkça sorulan sorular",
    englishNote: "İngilizce sürüm:",
    englishLabel,
    ui: {
      chooseCategory: "Kategori seç",
      all: "Tümü",
      spinning: "Çark dönüyor…",
      prompt: "Seçmek için butona bas.",
      timeUp: "Süre doldu!",
      spin: "Çarkı çevir",
      startTimer: "1 dakikayı başlat",
      restartTimer: "Süreyi sıfırla",
      copied: "Kopyalandı ✓",
      copy: "Kopyala",
      topicsWord: "seçenek",
      shownWord: "gösterildi",
      noRepeat: "bitene kadar tekrar yok",
      defaultButton: buttonLabel,
    },
  };
}
