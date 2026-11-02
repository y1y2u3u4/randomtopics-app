// English name → Japanese: katakana (dictionary first, spelling rules for the
// rest), hiragana, Hepburn romaji and ateji kanji picked by sound. All local.

// Common English first names and surnames with their usual katakana spelling.
const DICT_SOURCE =
  "aaron:アーロン,abigail:アビゲイル,adam:アダム,adams:アダムズ,adeline:アデライン,adrian:エイドリアン,aiden:エイデン,alan:アラン,albert:アルバート," +
  "alex:アレックス,alexander:アレクサンダー,alexandra:アレクサンドラ,alexis:アレクシス,alice:アリス,alicia:アリシア,allen:アレン,allison:アリソン,alyssa:アリッサ," +
  "amanda:アマンダ,amber:アンバー,amelia:アメリア,amy:エイミー,anderson:アンダーソン,andrea:アンドレア,andrew:アンドリュー,angela:アンジェラ,ann:アン,anna:アンナ," +
  "anne:アン,anthony:アンソニー,aria:アリア,ariana:アリアナ,arthur:アーサー,asher:アッシャー,ashley:アシュリー,aubrey:オーブリー,audrey:オードリー,aurora:オーロラ," +
  "austin:オースティン,autumn:オータム,ava:エヴァ,avery:エイヴリー,baker:ベイカー,barbara:バーバラ,bell:ベル,bella:ベラ,ben:ベン,benjamin:ベンジャミン,bennett:ベネット," +
  "beth:ベス,betty:ベティ,blake:ブレイク,bob:ボブ,brandon:ブランドン,brian:ブライアン,brianna:ブリアナ,brittany:ブリトニー,brooke:ブルック,brown:ブラウン,bruce:ブルース," +
  "bryan:ブライアン,caleb:ケイレブ,cameron:キャメロン,camila:カミラ,campbell:キャンベル,carl:カール,carlos:カルロス,carol:キャロル,caroline:キャロライン,carter:カーター," +
  "casey:ケイシー,catherine:キャサリン,charles:チャールズ,charlie:チャーリー,charlotte:シャーロット,chase:チェイス,chloe:クロエ,chris:クリス,christian:クリスチャン," +
  "christina:クリスティーナ,christine:クリスティン,christopher:クリストファー,cindy:シンディ,claire:クレア,clark:クラーク,cody:コーディ,colin:コリン,collins:コリンズ," +
  "connor:コナー,cook:クック,cooper:クーパー,daisy:デイジー,dan:ダン,daniel:ダニエル,dave:デイブ,david:デイビッド,davis:デイビス,dean:ディーン,debbie:デビー,dennis:デニス," +
  "diana:ダイアナ,donald:ドナルド,dorothy:ドロシー,douglas:ダグラス,dylan:ディラン,easton:イーストン,eden:エデン,edward:エドワード,edwards:エドワーズ,eleanor:エレノア," +
  "elena:エレナ,eli:イーライ,elijah:イライジャ,eliza:イライザ,elizabeth:エリザベス,ella:エラ,ellie:エリー,emilia:エミリア,emily:エミリー,emma:エマ,eric:エリック," +
  "ethan:イーサン,eva:エヴァ,evan:エヴァン,evans:エヴァンズ,evelyn:エヴリン,everly:エヴァリー,ezra:エズラ,felix:フェリックス,finn:フィン,fisher:フィッシャー," +
  "foster:フォスター,frank:フランク,freya:フレイヤ,gabriel:ガブリエル,garcia:ガルシア,gary:ゲイリー,george:ジョージ,gianna:ジアナ,grace:グレース,gray:グレイ," +
  "grayson:グレイソン,green:グリーン,gregory:グレゴリー,hailey:ヘイリー,hall:ホール,hannah:ハンナ,harold:ハロルド,harper:ハーパー,harris:ハリス,harry:ハリー," +
  "hayes:ヘイズ,hazel:ヘイゼル,helen:ヘレン,henry:ヘンリー,hill:ヒル,howard:ハワード,hudson:ハドソン,hughes:ヒューズ,hunter:ハンター,isaac:アイザック," +
  "isabella:イザベラ,isabelle:イザベル,isaiah:アイザイア,ivy:アイビー,jack:ジャック,jackie:ジャッキー,jackson:ジャクソン,jacob:ジェイコブ,jade:ジェイド,jake:ジェイク," +
  "james:ジェームズ,jamie:ジェイミー,jane:ジェーン,jasmine:ジャスミン,jason:ジェイソン,jaxon:ジャクソン,jayden:ジェイデン,jeff:ジェフ,jennifer:ジェニファー,jenny:ジェニー," +
  "jeremy:ジェレミー,jerry:ジェリー,jesse:ジェシー,jessica:ジェシカ,jessie:ジェシー,jill:ジル,jim:ジム,jimmy:ジミー,joe:ジョー,john:ジョン,johnson:ジョンソン," +
  "jonathan:ジョナサン,jones:ジョーンズ,jordan:ジョーダン,joseph:ジョセフ,josephine:ジョセフィーン,joshua:ジョシュア,joy:ジョイ,julia:ジュリア,julian:ジュリアン," +
  "julie:ジュリー,justin:ジャスティン,kai:カイ,karen:カレン,kate:ケイト,katherine:キャサリン,kayla:ケイラ,kelly:ケリー,ken:ケン,kennedy:ケネディ,kevin:ケビン,kim:キム," +
  "kimberly:キンバリー,king:キング,kyle:カイル,landon:ランドン,larry:ラリー,laura:ローラ,lauren:ローレン,layla:レイラ,leah:リア,lee:リー,leo:レオ,leon:レオン,levi:リーバイ," +
  "lewis:ルイス,liam:リアム,lily:リリー,lincoln:リンカーン,linda:リンダ,lisa:リサ,logan:ローガン,louis:ルイ,lucas:ルーカス,lucy:ルーシー,luke:ルーク,luna:ルナ," +
  "madeline:マデリン,madison:マディソン,margaret:マーガレット,mark:マーク,martin:マーティン,martinez:マルティネス,mary:メアリー,mason:メイソン,matthew:マシュー,max:マックス," +
  "maya:マヤ,megan:メーガン,melissa:メリッサ,mia:ミア,michael:マイケル,michelle:ミシェル,mike:マイク,mila:ミラ,miles:マイルズ,miller:ミラー,mitchell:ミッチェル," +
  "molly:モリー,moore:ムーア,morgan:モーガン,morris:モリス,murphy:マーフィー,nancy:ナンシー,naomi:ナオミ,natalie:ナタリー,nathan:ネイサン,nelson:ネルソン," +
  "nicholas:ニコラス,nicole:ニコール,nina:ニーナ,noah:ノア,nolan:ノーラン,nora:ノラ,nova:ノヴァ,oliver:オリバー,olivia:オリビア,oscar:オスカー,owen:オーウェン," +
  "paisley:ペイズリー,parker:パーカー,patricia:パトリシア,patrick:パトリック,paul:ポール,penelope:ペネロペ,peter:ピーター,phillips:フィリップス,piper:パイパー,price:プライス," +
  "quinn:クイン,rachel:レイチェル,raymond:レイモンド,rebecca:レベッカ,richard:リチャード,riley:ライリー,robert:ロバート,roberts:ロバーツ,robin:ロビン,rodriguez:ロドリゲス," +
  "rogers:ロジャース,rose:ローズ,ross:ロス,ruby:ルビー,ruth:ルース,ryan:ライアン,sadie:セイディ,sam:サム,samantha:サマンサ,samuel:サミュエル,sara:サラ,sarah:サラ," +
  "scarlett:スカーレット,scott:スコット,sean:ショーン,sebastian:セバスチャン,sienna:シエナ,skylar:スカイラー,smith:スミス,sofia:ソフィア,sophia:ソフィア,sophie:ソフィー," +
  "stella:ステラ,stephanie:ステファニー,steven:スティーブン,stewart:スチュワート,susan:スーザン,taylor:テイラー,theo:セオ,theodore:セオドア,thomas:トーマス,tiffany:ティファニー," +
  "tom:トム,tony:トニー,turner:ターナー,tyler:タイラー,valentina:バレンティナ,victoria:ビクトリア,violet:バイオレット,walker:ウォーカー,walter:ウォルター,ward:ウォード," +
  "wesley:ウェスリー,white:ホワイト,william:ウィリアム,williams:ウィリアムズ,willow:ウィロー,wilson:ウィルソン,wood:ウッド,wright:ライト,wyatt:ワイアット,xavier:ザビエル," +
  "young:ヤング,zach:ザック,zachary:ザカリー,zoe:ゾーイ,zoey:ゾーイ";

export const NAME_DICTIONARY: ReadonlyMap<string, string> = new Map(
  DICT_SOURCE.split(",").map((pair) => pair.split(":") as [string, string]),
);

// ---------- Spelling rules ----------
// A word becomes syllables {c, v}: c is a consonant sound ("", k, s, sh, ch, j,
// ts, f, v, w, y, kw, …), v is a, i, u, e, o or "" (a bare consonant). Extra
// marks: long ("ー"), small tsu (Q) and n (N).
type Unit = { c: string; v: string; long?: boolean } | { mark: "Q" | "N" };

const VOWELS = "aeiou";
// Membership that is false for a missing character ("abc".includes("") is true).
const has = (set: string, ch: string | undefined) => !!ch && set.includes(ch);
const isVowel = (s: string, i: number) => {
  const ch = s[i];
  if (!ch) return false;
  if (VOWELS.includes(ch)) return true;
  // y is a vowel except before another vowel at a syllable start.
  return ch === "y" && i > 0 && !has(VOWELS, s[i + 1]);
};

function prepare(word: string) {
  return word
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .replace(/^kn/, "n").replace(/^wr/, "r").replace(/^ps/, "s").replace(/^gn/, "n").replace(/^x/, "z")
    .replace(/ph/g, "f").replace(/ght/g, "t").replace(/gh$/, "").replace(/^gh/, "g")
    .replace(/tion/g, "shon").replace(/sion/g, "shon").replace(/cia/g, "shia")
    .replace(/mb$/, "m").replace(/mn$/, "m").replace(/que$/, "k").replace(/gue$/, "g")
    .replace(/([aeiou])h$/, "$1") // Hannah, Elijah
    // Final s after a voiced sound is z (Adams → アダムズ, Charles → チャールズ).
    .replace(/([bdglmnrvw])s$/, "$1z").replace(/([^aeiou])es$/, "$1ez").replace(/([aeo]y)s$/, "$1z");
}

// A final e (or e before a final z from -es) that is not pronounced.
const silentE = (s: string, i: number) =>
  s[i] === "e" && i > 1 && !isVowel(s, i - 1) && (i === s.length - 1 || (i === s.length - 2 && s[i + 1] === "z"));

// Reads one vowel group starting at i; returns the syllable vowel(s) and length.
function readVowel(s: string, i: number): { vs: { v: string; long?: boolean }[]; len: number } {
  const two = s.slice(i, i + 2);
  const next = s[i + 2];
  const end = i + 2 >= s.length;
  const table: Record<string, { v: string; long?: boolean }[]> = {
    aa: [{ v: "a", long: true }], ee: [{ v: "i", long: true }], ea: end ? [{ v: "i" }, { v: "a" }] : [{ v: "i", long: true }],
    ie: end ? [{ v: "i", long: true }] : [{ v: "i" }, { v: "e" }],
    oo: next === "k" ? [{ v: "u" }] : [{ v: "u", long: true }], ou: [{ v: "a" }, { v: "u" }], oa: [{ v: "o", long: true }], au: [{ v: "o", long: true }],
    aw: [{ v: "o", long: true }], ai: [{ v: "e" }, { v: "i" }], ay: [{ v: "e" }, { v: "i" }], ey: [{ v: "i", long: true }],
    ei: [{ v: "e" }, { v: "i" }], oi: [{ v: "o" }, { v: "i" }], oy: [{ v: "o" }, { v: "i" }], ue: [{ v: "u", long: true }],
    ew: [{ v: "yu", long: true }], ow: end ? [{ v: "o", long: true }] : [{ v: "a" }, { v: "u" }], ui: [{ v: "u" }, { v: "i" }],
  };
  if (table[two] && !(two === "ow" && has(VOWELS, next))) return { vs: table[two], len: 2 };
  const ch = s[i];
  // R-coloured vowels: ar, or → long; er, ir, ur and an unstressed final -or → aー (Parker, Connor).
  if (s[i + 1] === "r" && !isVowel(s, i + 2) && s[i + 2] !== "r") {
    const finalOr = ch === "o" && i + 2 >= s.length && i > 1;
    const v = ch === "o" && !finalOr ? "o" : "a";
    return { vs: [{ v, long: true }], len: 2 };
  }
  // Silent-e: vowel + one consonant + final e lengthens the vowel (Kate, Mike, Rose, James).
  if (s[i + 2] === "e" && silentE(s, i + 2) && !isVowel(s, i + 1) && ch !== "y") {
    const long: Record<string, { v: string; long?: boolean }[]> = {
      a: [{ v: "e" }, { v: "i" }], i: [{ v: "a" }, { v: "i" }], o: [{ v: "o", long: true }], u: [{ v: "yu", long: true }], e: [{ v: "i", long: true }],
    };
    return { vs: long[ch], len: 1 };
  }
  if (ch === "y") return { vs: [{ v: "i", long: i === s.length - 1 }], len: 1 };
  if (silentE(s, i)) return { vs: [], len: 1 };
  if (ch === "u") {
    // Short u in a closed syllable sounds like "a" (Hunter, Justin).
    const closed = !isVowel(s, i + 1) && (!isVowel(s, i + 2) || i + 2 >= s.length);
    return { vs: [{ v: closed && s[i + 1] ? "a" : "u" }], len: 1 };
  }
  return { vs: [{ v: ch }], len: 1 };
}

function readConsonant(s: string, i: number): { c: string; len: number; stop?: boolean } {
  const three = s.slice(i, i + 3);
  const two = s.slice(i, i + 2);
  const after = (k: number) => s[i + k];
  if (three === "tch") return { c: "ch", len: 3, stop: true };
  if (three === "sch") return { c: "sh", len: 3 };
  if (three === "chr" || three === "chl") return { c: "k", len: 2 };
  if (two === "sh") return { c: "sh", len: 2 };
  if (two === "ch") return { c: "ch", len: 2 };
  if (two === "th") return { c: "s", len: 2 };
  // ck doubles before a vowel or at the end (Jack, Jackie) but not before a consonant (Jackson).
  if (two === "ck") return { c: "k", len: 2, stop: !after(2) || isVowel(s, i + 2) };
  if (two === "qu") return { c: "kw", len: 2 };
  if (two === "wh") return { c: "w", len: 2 };
  if (two === "dg") return { c: "j", len: 2 };
  const ch = s[i];
  const soft = has("eiy", after(1));
  if (ch === "c") return { c: soft ? "s" : "k", len: after(1) === "c" && !soft ? 2 : 1 };
  if (ch === "g") return { c: soft ? "j" : "g", len: after(1) === "g" ? 2 : 1 };
  if (ch === "x") return { c: "x", len: 1 };
  if (ch === "q") return { c: "k", len: 1 };
  if (ch === "l" || ch === "r") return { c: "r", len: after(1) === ch ? 2 : 1 };
  if (ch === "y") return { c: "y", len: 1 };
  const doubled = after(1) === ch;
  return { c: ch, len: doubled ? 2 : 1, stop: doubled && has("ktp", ch) && (!after(2) || silentE(s, i + 2)) };
}

export function wordToUnits(word: string): Unit[] {
  const s = prepare(word);
  const units: Unit[] = [];
  const shortVowelBefore = () => {
    const last = units[units.length - 1];
    return !!last && "v" in last && !!last.v && !last.long;
  };
  let i = 0;
  while (i < s.length) {
    if (isVowel(s, i) && !(s[i] === "y" && i === 0)) {
      const { vs, len } = readVowel(s, i);
      for (const v of vs) units.push({ c: "", v: v.v, long: v.long });
      i += len;
      continue;
    }
    const start = i;
    const read = readConsonant(s, i);
    let c = read.c;
    i += read.len;
    const atEnd = i >= s.length || silentE(s, i);
    // A stop after a short vowel at the end of the word doubles (Jack → ジャック, Max → マックス).
    if ((read.stop || (atEnd && has("ktpx", c[0]))) && shortVowelBefore()) units.push({ mark: "Q" });
    if (c === "x") { units.push({ c: "k", v: "" }); c = "s"; }
    // nn between vowels keeps both sounds (Anna → アンナ).
    if (c === "n" && s[start + 1] === "n" && isVowel(s, i) && !silentE(s, i)) units.push({ mark: "N" });
    if ((c === "n" || (c === "m" && has("bp", s[i]))) && !isVowel(s, i)) { units.push({ mark: "N" }); continue; }
    if (isVowel(s, i) && !silentE(s, i)) {
      const { vs, len: vlen } = readVowel(s, i);
      i += vlen;
      if (vs.length === 0) { units.push({ c, v: "" }); continue; }
      units.push({ c, v: vs[0].v, long: vs[0].long });
      for (const v of vs.slice(1)) units.push({ c: "", v: v.v, long: v.long });
      continue;
    }
    if (silentE(s, i)) i += 1;
    units.push({ c, v: "" });
  }
  return units;
}

// Consonant + vowel → katakana. Missing vowel = bare consonant.
const ROWS: Record<string, Record<string, string>> = {
  "": { a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ", yu: "ユ" },
  k: { a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ", yu: "キュ", "": "ク" },
  g: { a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ", yu: "ギュ", "": "グ" },
  s: { a: "サ", i: "シ", u: "ス", e: "セ", o: "ソ", yu: "シュ", "": "ス" },
  z: { a: "ザ", i: "ジ", u: "ズ", e: "ゼ", o: "ゾ", yu: "ジュ", "": "ズ" },
  sh: { a: "シャ", i: "シ", u: "シュ", e: "シェ", o: "ショ", yu: "シュ", "": "シュ" },
  ch: { a: "チャ", i: "チ", u: "チュ", e: "チェ", o: "チョ", yu: "チュ", "": "チ" },
  j: { a: "ジャ", i: "ジ", u: "ジュ", e: "ジェ", o: "ジョ", yu: "ジュ", "": "ジ" },
  t: { a: "タ", i: "ティ", u: "トゥ", e: "テ", o: "ト", yu: "テュ", "": "ト" },
  d: { a: "ダ", i: "ディ", u: "ドゥ", e: "デ", o: "ド", yu: "デュ", "": "ド" },
  n: { a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ", yu: "ニュ", "": "ン" },
  h: { a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ", yu: "ヒュ", "": "フ" },
  f: { a: "ファ", i: "フィ", u: "フ", e: "フェ", o: "フォ", yu: "フュ", "": "フ" },
  b: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ", yu: "ビュ", "": "ブ" },
  v: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ", yu: "ビュ", "": "ブ" },
  p: { a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ", yu: "ピュ", "": "プ" },
  m: { a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ", yu: "ミュ", "": "ム" },
  y: { a: "ヤ", i: "イ", u: "ユ", e: "イェ", o: "ヨ", yu: "ユ", "": "イ" },
  r: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ", yu: "ル", "": "ル" },
  w: { a: "ワ", i: "ウィ", u: "ウ", e: "ウェ", o: "ウォ", yu: "ユ", "": "ウ" },
  kw: { a: "クワ", i: "クイ", u: "ク", e: "クエ", o: "クオ", yu: "キュ", "": "ク" },
};

function unitsToKatakana(units: Unit[]) {
  let out = "";
  units.forEach((u, idx) => {
    if ("mark" in u) { out += u.mark === "Q" ? "ッ" : "ン"; return; }
    const row = ROWS[u.c] ?? ROWS[""];
    out += row[u.v] ?? row[""] ?? "";
    // Double-length vowels and a final -y/-ey/-ie get a long mark.
    if (u.long && units[idx + 1] && !("mark" in units[idx + 1]) && (units[idx + 1] as { c: string }).c === "" && (units[idx + 1] as { v: string }).v === u.v) return;
    if (u.long) out += "ー";
  });
  return out.replace(/ーー+/g, "ー").replace(/^ッ/, "");
}

export type Converted = { input: string; katakana: string; source: "dictionary" | "rules" };

export function convertWord(word: string): Converted | null {
  const key = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return null;
  const found = NAME_DICTIONARY.get(key);
  if (found) return { input: word, katakana: found, source: "dictionary" };
  const katakana = unitsToKatakana(wordToUnits(key));
  return katakana ? { input: word, katakana, source: "rules" } : null;
}

// ---------- Kana → romaji / hiragana ----------
const KANA_ROMAJI: Record<string, string> = {
  ア: "a", イ: "i", ウ: "u", エ: "e", オ: "o", カ: "ka", キ: "ki", ク: "ku", ケ: "ke", コ: "ko", ガ: "ga", ギ: "gi", グ: "gu", ゲ: "ge", ゴ: "go",
  サ: "sa", シ: "shi", ス: "su", セ: "se", ソ: "so", ザ: "za", ジ: "ji", ズ: "zu", ゼ: "ze", ゾ: "zo", タ: "ta", チ: "chi", ツ: "tsu", テ: "te", ト: "to",
  ダ: "da", ヂ: "ji", ヅ: "zu", デ: "de", ド: "do", ナ: "na", ニ: "ni", ヌ: "nu", ネ: "ne", ノ: "no", ハ: "ha", ヒ: "hi", フ: "fu", ヘ: "he", ホ: "ho",
  バ: "ba", ビ: "bi", ブ: "bu", ベ: "be", ボ: "bo", パ: "pa", ピ: "pi", プ: "pu", ペ: "pe", ポ: "po", マ: "ma", ミ: "mi", ム: "mu", メ: "me", モ: "mo",
  ヤ: "ya", ユ: "yu", ヨ: "yo", ラ: "ra", リ: "ri", ル: "ru", レ: "re", ロ: "ro", ワ: "wa", ヲ: "o", ン: "n", ヴ: "vu",
};
const SMALL: Record<string, string> = { ャ: "ya", ュ: "yu", ョ: "yo", ァ: "a", ィ: "i", ゥ: "u", ェ: "e", ォ: "o" };

/** Splits katakana into morae: base kana plus any small kana that follows. */
export function morae(katakana: string) {
  const list: string[] = [];
  for (const ch of katakana) {
    if (SMALL[ch] && list.length) list[list.length - 1] += ch;
    else list.push(ch);
  }
  return list;
}

function moraRomaji(mora: string) {
  const [base, small] = [mora[0], mora[1]];
  const head = KANA_ROMAJI[base] ?? "";
  if (!small) return head;
  const tail = SMALL[small];
  if ("ャュョ".includes(small)) {
    // キャ → kya, シャ → sha, チャ → cha, ジャ → ja.
    if (/^(shi|chi|ji)$/.test(head)) return head.slice(0, -1) + tail.slice(1);
    return head.slice(0, -1) + tail;
  }
  if (base === "ウ") return "w" + tail; // ウィ wi, ウェ we, ウォ wo
  if (base === "ヴ") return "v" + tail;
  if (base === "テ" || base === "デ") return head[0] + tail; // ティ ti, ディ di
  if (base === "ト" || base === "ド") return head[0] + tail; // トゥ tu
  if (base === "フ") return "f" + tail;
  if (/^(shi|chi|ji)$/.test(head)) return head.slice(0, -1) + tail; // シェ she, ジェ je, チェ che
  if (base === "イ") return "y" + tail; // イェ ye
  return head.replace(/[aiueo]$/, "") + tail;
}

const MACRON: Record<string, string> = { a: "ā", i: "ī", u: "ū", e: "ē", o: "ō" };

export function toRomaji(katakana: string) {
  let out = "";
  const list = morae(katakana);
  list.forEach((m, i) => {
    if (m === "ー") { out = out.replace(/[aiueo]$/, (v) => MACRON[v]); return; }
    if (m === "ッ") { const next = moraRomaji(list[i + 1] ?? ""); out += next.startsWith("ch") ? "t" : next[0] ?? ""; return; }
    if (m === "ン") { out += "n"; return; }
    out += moraRomaji(m);
  });
  return out;
}

export function toHiragana(katakana: string) {
  return [...katakana].map((ch) => {
    const code = ch.charCodeAt(0);
    if (ch === "ヴ") return "ゔ";
    return code >= 0x30a1 && code <= 0x30f6 ? String.fromCharCode(code - 0x60) : ch;
  }).join("");
}

// ---------- Ateji kanji by sound ----------
// Each reading lists up to three kanji used in Japanese names, with meanings.
const KANJI_SOURCE = `
a=亜:Asia|阿:hillside|愛:love
i=伊:this one|衣:robe|偉:greatness
u=宇:universe|羽:feather|雨:rain
e=恵:blessing|絵:picture|江:inlet
o=緒:thread|雄:hero|音:sound
ka=花:flower|佳:excellent|香:fragrance
ki=希:hope|輝:radiance|樹:tree
ku=久:long-lasting|玖:black jade|空:sky
ke=華:splendor|気:spirit|家:home
ko=湖:lake|虎:tiger|子:child
ga=雅:elegance|賀:celebration|我:self
gi=義:justice|技:skill|儀:ceremony
gu=具:complete|宮:shrine
ge=夏:summer|牙:fang|解:understanding
go=悟:enlightenment|護:protection|吾:myself
sa=紗:silk gauze|咲:blossom|佐:helper
shi=詩:poem|志:ambition|紫:purple
su=寿:long life|素:pure|守:guardian
se=世:world|瀬:rapids|星:star
so=蒼:blue|想:thought|素:simple
za=座:seat
ji=慈:compassion|治:peace|路:path
zu=図:plan|瑞:good omen|豆:bean
ze=是:right
zo=蔵:treasure house|造:creation
ta=太:grand|多:plenty|田:rice field
chi=智:wisdom|千:thousand|知:knowledge
tsu=津:harbor|都:capital
te=照:shine|手:hand|天:heaven
to=斗:Big Dipper|登:climb|杜:grove
da=舵:helm|陀:steep hill
de=出:rise|弟:younger brother
do=道:way|努:effort|土:earth
na=奈:Nara|菜:greens|南:south
ni=仁:kindness|丹:crimson|爾:you
nu=布:cloth|努:effort
ne=音:sound|寧:calm|祢:shrine
no=乃:of|野:field|能:talent
ha=葉:leaf|羽:wings|波:wave
hi=陽:sun|妃:princess|飛:flight
fu=風:wind|芙:lotus|富:wealth
he=辺:shore|経:passage
ho=帆:sail|穂:grain|歩:step
ba=馬:horse|芭:banana leaf|場:place
bi=美:beauty|備:readiness|微:subtle
bu=武:warrior|舞:dance|歩:step
be=辺:shore|部:part|米:rice
bo=暮:dusk|菩:bodhi|母:mother
ma=真:truth|麻:hemp|舞:dance
mi=美:beauty|実:fruit|海:sea
mu=夢:dream|武:warrior|霧:mist
me=芽:sprout|恵:blessing|女:woman
mo=萌:bud|茂:lush|望:wish
ya=弥:abundance|夜:night|矢:arrow
yu=優:gentle|結:bond|悠:serene
yo=世:world|代:generation|与:gift
ra=良:good|羅:silk|楽:joy
ri=莉:jasmine|理:reason|里:village
ru=瑠:lapis lazuli|留:stay|流:flow
re=麗:lovely|礼:gratitude|玲:jade chime
ro=露:dew|路:road|朗:bright
wa=和:harmony|輪:circle|倭:old Japan
kya=伽:companion
kyu=久:eternal|球:sphere|弓:bow
kyo=京:capital|恭:respect|響:echo
sha=紗:silk|砂:sand|沙:sandbar
shu=朱:vermilion|珠:pearl|修:discipline
sho=翔:soar|昭:shining|祥:good fortune
cha=茶:tea
chu=宙:cosmos|中:center|忠:loyalty
cho=蝶:butterfly|長:long|兆:omen
ja=蛇:serpent|惹:charm
ju=樹:tree|寿:long life|珠:pearl
jo=如:likeness|助:help|序:beginning
nyo=如:likeness
nyu=柔:gentleness
gyo=暁:dawn|行:journey
gyu=牛:ox
myo=妙:wonder|明:light
ryu=竜:dragon|流:flow|隆:prosperity
ryo=涼:cool breeze|良:goodness|遼:far away
an=安:peace|杏:apricot|庵:retreat
in=音:sound|韻:rhyme|印:seal
un=雲:cloud|運:fortune
en=円:circle|縁:bond|苑:garden
on=恩:grace|温:warmth|音:sound
kan=寛:generous|環:ring|冠:crown
kin=琴:harp|錦:brocade|欣:joy
ken=健:health|剣:sword|賢:wisdom
kon=紺:navy blue|魂:soul
gan=岩:rock|願:wish
gin=銀:silver|吟:song
gen=源:source|玄:mystery|弦:bowstring
san=燦:brilliance|珊:coral|讃:praise
shin=真:truth|心:heart|新:new
sen=泉:spring|仙:sage|千:thousand
son=尊:honor
jin=仁:kindness|迅:swift|神:spirit
zen=善:goodness|禅:Zen|然:nature
tan=丹:crimson|探:quest|端:edge
ten=天:heaven|典:law
ton=敦:sincere
dan=暖:warmth|段:step|弾:spring
den=伝:legend|殿:palace
nan=南:south|楠:camphor tree
han=帆:sail|繁:thriving|範:model
hin=彬:refined
hon=本:origin
ban=万:myriad|晩:evening|磐:boulder
bin=敏:quick|彬:refined
ben=弁:eloquence|勉:diligence
man=満:full|万:myriad|曼:graceful
min=民:people|珉:jade
mon=文:letters|紋:crest|門:gate
ran=蘭:orchid|嵐:storm|藍:indigo
rin=凛:dignity|鈴:bell|林:forest
ren=蓮:lotus|恋:love|廉:honesty
ron=論:reason
wan=湾:bay
jun=純:pure|潤:rich|順:order
shun=瞬:instant|俊:talent|春:spring
kei=恵:blessing|慶:joy|啓:opening
sei=星:star|清:pure|聖:holy
rei=玲:jade chime|麗:lovely|怜:wise
mei=明:bright|銘:inscription
ai=愛:love|藍:indigo|相:together
kai=海:sea|快:delight|魁:pioneer
rai=雷:thunder|来:arrival|礼:courtesy
dai=大:great|台:platform
tai=泰:peace|太:grand
sai=彩:color|才:talent|西:west
mai=舞:dance
bai=梅:plum
gai=凱:triumph
kou=光:light|幸:happiness|航:voyage
sou=蒼:blue|創:creation|爽:fresh
tou=冬:winter|桃:peach|灯:lamp
rou=朗:bright
you=陽:sun|洋:ocean|葉:leaf
yuu=優:gentle|悠:serene|遊:play
jou=丈:strength|城:castle|譲:modesty
`;

type KanjiChoice = { kanji: string; meaning: string };
const KANJI: Record<string, KanjiChoice[]> = Object.fromEntries(
  KANJI_SOURCE.trim().split("\n").map((line) => {
    const [reading, list] = line.split("=");
    return [reading, list.split("|").map((pair) => { const [kanji, meaning] = pair.split(":"); return { kanji, meaning }; })];
  }),
);

// Sounds Japanese names don't use, mapped to the nearest reading for kanji.
function nearest(r: string) {
  const swaps: [RegExp, string][] = [
    [/^ti$/, "chi"], [/^di$/, "ji"], [/^tu$/, "tsu"], [/^du$/, "zu"], [/^f([aieo])$/, "h$1"], [/^v/, "b"], [/^p/, "b"],
    [/^she$/, "se"], [/^je$/, "ji"], [/^che$/, "chi"], [/^ye$/, "e"], [/^w([ieo])$/, "$1"], [/^kw/, "k"], [/^ty/, "ch"], [/^dy/, "j"],
    [/^(k|g|n|h|b|m|r)ya$/, "$1a"], [/^(n|h|b|m|p|r)yu$/, "$1u"], [/^(h|b|m|p)yo$/, "$1o"], [/^si$/, "shi"], [/^zi$/, "ji"],
  ];
  let out = r;
  for (const [re, to] of swaps) out = out.replace(re, to);
  return out;
}

function lookup(r: string) {
  return KANJI[r] ?? KANJI[nearest(r)] ?? (r.endsWith("n") ? KANJI[nearest(r.slice(0, -1))] : undefined);
}

export type KanjiPart = { reading: string; kanji: string; meaning: string };

/** Splits a katakana name into readings that each have a name kanji. */
export function kanjiReadings(katakana: string) {
  const list = morae(katakana).filter((m) => m !== "ッ");
  const out: string[] = [];
  for (let i = 0; i < list.length; i++) {
    const m = list[i];
    if (m === "ー") {
      const prev = out[out.length - 1];
      const longKey = prev && (prev.endsWith("o") ? `${prev}u` : prev.endsWith("u") ? `${prev}u` : prev.endsWith("e") ? `${prev}i` : "");
      if (longKey && KANJI[longKey]) out[out.length - 1] = longKey;
      continue;
    }
    const r = moraRomaji(m);
    if (m === "ン") {
      const prev = out[out.length - 1];
      if (prev && lookup(`${prev}n`) && KANJI[`${nearest(prev)}n`]) out[out.length - 1] = `${nearest(prev)}n`;
      else if (!prev) out.push("on");
      continue;
    }
    // Two morae that read as one kanji (ケイ kei, カイ kai, ヨウ you).
    const next = list[i + 1];
    if (next === "イ" || next === "ウ") {
      const pair = `${nearest(r)}${next === "イ" ? "i" : "u"}`;
      if (KANJI[pair] && list[i + 2] !== "ン") { out.push(pair); i++; continue; }
    }
    out.push(r);
  }
  return out;
}

/** Up to three ateji spellings; spelling k prefers the k-th kanji of each reading. */
export function kanjiSpellings(katakana: string, count = 3): KanjiPart[][] {
  const readings = kanjiReadings(katakana);
  const spellings: KanjiPart[][] = [];
  for (let k = 0; k < count; k++) {
    const used = new Set<string>();
    const parts = readings.map((reading, idx) => {
      const choices = lookup(reading) ?? [];
      // Rotate per position so the three spellings differ, and avoid repeating a kanji in one name.
      const order = choices.map((_, j) => choices[(j + k + (k ? idx : 0)) % choices.length]);
      const pick = order.find((c) => !used.has(c.kanji)) ?? order[0];
      if (pick) used.add(pick.kanji);
      return pick ? { reading, kanji: pick.kanji, meaning: pick.meaning } : null;
    }).filter((p): p is KanjiPart => p !== null);
    const key = parts.map((p) => p.kanji).join("");
    if (parts.length && !spellings.some((s) => s.map((p) => p.kanji).join("") === key)) spellings.push(parts);
  }
  return spellings;
}

// ---------- Whole names ----------
export type NamePart = Converted & { romaji: string; hiragana: string; kanji: KanjiPart[][] };
export type NameResult = { parts: NamePart[]; katakana: string; hiragana: string; romaji: string };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const MAX_NAME_LENGTH = 60;

/** Converts "Emily Johnson" word by word; order "jp" puts the surname (last word) first. */
export function convertName(input: string, order: "western" | "jp" = "western"): NameResult | null {
  const words = input.slice(0, MAX_NAME_LENGTH).split(/[\s\-]+/).filter((w) => /[a-z]/i.test(w)).slice(0, 4);
  const parts = words.map((w) => convertWord(w)).filter((c): c is Converted => c !== null).map((c) => ({
    ...c,
    romaji: capitalize(toRomaji(c.katakana)),
    hiragana: toHiragana(c.katakana),
    kanji: kanjiSpellings(c.katakana),
  }));
  if (!parts.length) return null;
  const ordered = order === "jp" && parts.length > 1 ? [parts[parts.length - 1], ...parts.slice(0, -1)] : parts;
  return {
    parts: ordered,
    // A middle dot (・) separates foreign given and family names in katakana.
    katakana: ordered.map((p) => p.katakana).join("・"),
    hiragana: ordered.map((p) => p.hiragana).join("・"),
    romaji: ordered.map((p) => p.romaji).join(" "),
  };
}
