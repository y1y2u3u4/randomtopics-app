import type { LocalePageCopy } from "@/components/LocaleToolPage";

// Shared Japanese chrome for the standalone /ja pages (2026-11-06 pilot).
export function jaCopy(englishLabel: string, buttonLabel: string, listHeading = "お題の全リスト"): LocalePageCopy {
  return {
    lang: "ja",
    currency: "JPY",
    homeHref: "/ja",
    homeLabel: "ホーム",
    meta: "無料・登録不要・{n}件・2026年11月更新",
    siblingsHeading: "ほかの日本語ツール",
    howToHeading: "使い方",
    listHeading,
    faqHeading: "よくある質問",
    englishNote: "英語版：",
    englishLabel,
    ui: {
      chooseCategory: "カテゴリを選ぶ",
      all: "すべて",
      spinning: "ルーレット回転中…",
      prompt: "ボタンを押して1つ引いてみましょう。",
      timeUp: "時間切れです！",
      spin: "ルーレットを回す",
      startTimer: "1分スタート",
      restartTimer: "タイマーをリセット",
      copied: "コピーしました ✓",
      copy: "コピー",
      topicsWord: "件",
      shownWord: "件表示済み",
      noRepeat: "全部出るまで重複なし",
      defaultButton: buttonLabel,
    },
  };
}

export const JA_SIBLINGS = [
  { href: "/ja", label: "ランダムお題ジェネレーター", detail: "話題やお題をワンクリックで" },
];
