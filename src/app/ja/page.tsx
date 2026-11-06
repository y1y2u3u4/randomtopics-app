import type { Metadata } from "next";
import LocaleToolPage from "@/components/LocaleToolPage";
import { JA_GENERAL } from "@/data/japaneseTopics";
import { jaCopy } from "@/data/jaPageCopy";
import { allLocaleSiblings } from "@/lib/localePages";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const path = "/ja";
const COUNT = JA_GENERAL.reduce((n, g) => n + g.topics.length, 0);
const TITLE = "ランダムお題ジェネレーター｜話題・雑談ネタを無料で | Random Topics";
const DESCRIPTION = `ボタン1つで話題やお題をランダムに表示。雑談、ディスカッション、考える系、創作まで${COUNT}件を無料で。登録不要、重複なし。`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: path, languages: hreflangAlternates("/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${path}`, siteName: "Random Topics", locale: "ja_JP", type: "website" },
};

export default function JaHomePage() {
  return (
    <LocaleToolPage
      path={path}
      groups={JA_GENERAL}
      englishHref="/"
      title="ランダムお題ジェネレーター"
      lead={`ボタンを押すだけで、話題やお題がランダムに出ます。雑談のきっかけ、ディスカッション、考える系のテーマ、創作のネタまで${COUNT}件。カテゴリを選んでも、すべてから引いても大丈夫です。`}
      buttonLabel="お題を出す"
      copy={jaCopy("Random Topic Generator", "お題を出す")}
      siblings={allLocaleSiblings("ja")}
      howTo={[
        "カテゴリ（雑談・ディスカッション・考える・創作・日常）を選ぶか、「すべて」のままにします。",
        "「お題を出す」を押すと、カードにお題が表示されます。",
        "気に入らなければもう一度。同じお題は、全部出るまで重複しません。",
        "「コピー」でグループに送れます。下のページから、ゲーム向けのお題も探せます。",
      ]}
      faq={[
        { question: "ランダムお題ジェネレーターとは何ですか？", answer: "用意されたリストから、ボタン1つで話題やお題をランダムに選ぶ無料ツールです。雑談のネタ切れや、話し合い・文章のテーマに困ったときに使えます。" },
        { question: "同じお題が何度も出ますか？", answer: "いいえ。選んだカテゴリのお題をすべて出し切るまで、同じものは出ません。" },
        { question: "授業や会議のアイスブレイクに使えますか？", answer: "はい。学校や職場でも使いやすい内容です。画面を映して、みんなで順番に引いてみてください。" },
        { question: "料金や登録は必要ですか？", answer: "無料で、登録も不要です。スマホでもパソコンでもブラウザからそのまま使えます。" },
      ]}
    />
  );
}
