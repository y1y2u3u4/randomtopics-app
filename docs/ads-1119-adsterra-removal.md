# RandomTopics Adsterra 移除

## 范围

- 在 `remove-adsterra` 工作树操作，起点 `HEAD` 和本地 `origin/main` 均为 `6b953818b7d589bd5b937435767c5986d7d92c2b`。复用已有 `node_modules` 符号链接。未安装依赖、提交、推送或部署。
- `gh pr diff 111 -R y1y2u3u4/facetwin` 因 GitHub API 连接失败而退出 1。通过 `git -C /Users/shiliu/project/facetwin show dd633f9` 查看本地 #111 合并提交，沿用删除运行时、补全站标记扫描、保留受限购买入口验证的方法。
- 根布局撤掉 Native 挂载。英、西语 topics 与转盘模板清除 Native 专用 FAQ 标记。删除 Native 客户端、放置逻辑、环境变量读取、地理缓存及 `/api/adslot/`，并移除加载事件。
- `QuestionBankSections` 的 `adSlot` 更名为 `listAd`，保留 `PublicAdPlacement`、位置和间距。浏览器历史探针的 `adSlots` 输出字段更名为 `adPlacements`，保留原选择器。源代码和 Next 配置中没有 Adsterra CSP 条目，现有 AdSense fixture CSP 保持原样。各 AdSense 回归文件和 `public/ads.txt` 均无差异。
- `ads:test` 用 `scripts/no-adsterra-regression.mjs` 替换两支旧回归。新检查扫描 `src/`、`public/` 的路径和文本内容及 Next 配置，单独静态核对根布局、英西首页、topics 和转盘共七个模板。它锁定现有的唯一 ads.txt 卖方记录，以发现域名未带厂商名的卖方记录，并用真实组件渲染英西语 Wheel Pro 受限状态，断言购买按钮启用。`cost:test` 另覆盖 Speech Coach 的免费额度和每日上限状态。`billing:test` 验证本地账单和购买逻辑。

## 旧实现的问题与回归

| 观察 | 本次验证 |
| --- | --- |
| Native 通过运行时创建脚本，静态 HTML 检查会漏掉客户端挂载或公共资源中的接入 | 扫描源码及公共文本、已知域名、接口路径、旧 cookie、脚本和槽位标记 |
| Wheel Pro 受限时的购买按钮断言放在第三方广告 DOM 回归内 | 移到持续执行的新回归，英西语各检查实际输出中的启用按钮 |
| Native 地理请求去重混入通用成本回归 | 删除专属断言，继续验证并发 Speech 配置只请求一次 |
| 通用 `adSlot` 名称也匹配旧接口的清理表达式 | 使用实际用途命名，现有手动广告位置仍由 142 条 keep-playing、列表广告与回流断言所在的回归验证 |

## 改动文件

| 动作 | 文件 |
| --- | --- |
| 删除运行时 | `src/components/AdsterraNative.tsx`、`src/lib/adsterra.ts`、`src/lib/adsterraPlacement.ts`、`src/lib/adslotClient.ts`、`src/app/api/adslot/route.ts` |
| 删除旧回归 | `scripts/adsterra-regression.mjs`、`scripts/adsterra-dom-regression.mjs` |
| 更新路由及组件 | `src/app/layout.tsx`、`src/app/spin-the-wheel/page.tsx`、`src/app/es/spin-the-wheel/page.tsx`、`src/app/topics/[slug]/page.tsx`、`src/app/es/topics/[slug]/page.tsx`、`src/components/QuestionBankSections.tsx`、`src/lib/track.ts` |
| 更新验证入口 | `package.json`、`scripts/bill-cost-regression.mjs`、`scripts/initial-history-browser.mjs` |
| 新增 | `scripts/no-adsterra-regression.mjs`、`docs/ads-1119-adsterra-removal.md` |

## 命令和输出

在工作树根目录运行。Node v25.5.0，npm 11.8.0。

```text
$ npm run ads:test
PASS: ad public paths in sync (469 of 518 sitemap paths allowed)
PASS: 646 TSX files, every Link opts out of prefetch.
PASS: 293 advertising configuration, privacy and route assertions (no network).
PASS: 142 keep-playing, list-ad placement and daily-return assertions (no network).
PASS 167 US interface, GPP segment, opt-out and EU/non-EU policy assertions; no network.
PASS: 20 advertising runtime lifecycle cases (in-memory DOM, no network).
PASS 141 paid entitlement, route, identity, bounded retry, timeout and lifecycle assertions; no external calls.
PASS: 7 layout and English/Spanish route templates statically contain no vendor script or slot markers.
PASS: src/, public/ and Next config have no vendor markers. ads.txt retains the exact AdSense seller record.
PASS: blocked Wheel Pro shows an enabled purchase button in English and Spanish.
(exit 0)


$ npm run billing:test
ok - other event types are acknowledged without reads
ok - database failure asks Stripe to retry
ok - replayed event reaches the idempotent RPC (no double grant in code)
PASS: 11 host webhook checks
(exit 0)

$ npm run cost:test
PASS: asset headers, ISR floor, ignore wiring, lazy speech configuration
PASS: 11 build-ignore history, branch, diff and fail-open cases
PASS: 646 TSX files, every Link opts out of prefetch.
PASS: when blocked by quota or daily limit, the pay action appears
(exit 0)

$ npx tsc --noEmit
(无输出)
(exit 0)

$ npm run lint
  54 |     rotRef.current = next;
> 55 |     setSpinning(true);
     |     ^^^^^^^^^^^ Avoid calling setState() directly within an effect
  56 |     setRotation(next);
  57 |     const ms = reduced ? 50 : duration * 1000 + 80;
  58 |     const id = window.setTimeout(() => { setSpinning(false); doneRef.current(target.index); }, ms);  react-hooks/set-state-in-effect

✖ 24 problems (19 errors, 5 warnings)
(exit 1)

$ npx next build

> Build error occurred
Error: Turbopack build failed with 2 errors:
[next]/internal/font/google/outfit_46d08b63.module.css
next/font: error:
Failed to fetch `Outfit` from Google Fonts.


[next]/internal/font/google/plus_jakarta_sans_df8da7a2.module.css
next/font: error:
Failed to fetch `Plus Jakarta Sans` from Google Fonts.


    at ignore-listed frames
(exit 1)

```

## 基线复跑

```text
$ git stash push -u -m 'RandomTopics Adsterra removal baseline proof'
Saved working directory and index state On remove-adsterra: RandomTopics Adsterra removal baseline proof

$ git status --short --branch
## remove-adsterra...origin/main

$ git rev-parse HEAD origin/main
6b953818b7d589bd5b937435767c5986d7d92c2b
6b953818b7d589bd5b937435767c5986d7d92c2b

$ npm run lint
✖ 24 problems (19 errors, 5 warnings)
(exit 1)

$ cmp /tmp/randomtopics-rm-baseline-lint.log /tmp/randomtopics-rm-lint.log
(无输出，exit 0)

$ npx next build

> Build error occurred
Error: Turbopack build failed with 2 errors:
[next]/internal/font/google/outfit_46d08b63.module.css
next/font: error:
Failed to fetch `Outfit` from Google Fonts.


[next]/internal/font/google/plus_jakarta_sans_df8da7a2.module.css
next/font: error:
Failed to fetch `Plus Jakarta Sans` from Google Fonts.


    at ignore-listed frames
(exit 1)

$ cmp /tmp/randomtopics-rm-baseline-build.log /tmp/randomtopics-rm-build.log
(无输出，exit 0)

$ curl --connect-timeout 4 -sS -I https://fonts.googleapis.com
curl: (6) Could not resolve host: fonts.googleapis.com

$ git stash pop 'stash@{0}'
Dropped stash@{0} (f6fb720c41b55065b9a123349a808b8e3e9331dd)
```

两次 lint 和两次构建的完整日志分别逐字节相同。Lint 包含英文 topics 页第 175 行渲染阶段调用 `Date.now()` 的 `react-hooks/purity` 错误，以及其他既有错误。构建在两个 Google Fonts 下载请求失败后退出。本次保留相关业务与字体配置。

## 最终残留检查

```text
$ git grep -inE 'adsterra|highperformanceformat|effectivegatecpm|profitableratecpm|highperformancecpm|adslot' -- . ':!*.md' ':!docs' > /tmp/randomtopics-adsterra-before.txt
$ wc -l < /tmp/randomtopics-adsterra-before.txt
106

$ git grep -inE 'adsterra|highperformanceformat|effectivegatecpm|profitableratecpm|highperformancecpm|adslot' -- . ':!*.md' ':!docs'
package.json:16:    "ads:test": "node scripts/ad-public-paths.mjs && node scripts/link-prefetch-regression.mjs && node scripts/adsense-regression.mjs && node scripts/keep-playing-regression.mjs && node scripts/us-ad-signal-regression.mjs && node scripts/adsense-client-regression.mjs && node scripts/speech-ad-entitlement-regression.mjs && node scripts/no-adsterra-regression.mjs",

$ git grep --untracked -inE 'adsterra|highperformanceformat|effectivegatecpm|profitableratecpm|highperformancecpm|adslot' -- . ':!*.md' ':!docs'
package.json:16:    "ads:test": "node scripts/ad-public-paths.mjs && node scripts/link-prefetch-regression.mjs && node scripts/adsense-regression.mjs && node scripts/keep-playing-regression.mjs && node scripts/us-ad-signal-regression.mjs && node scripts/adsense-client-regression.mjs && node scripts/speech-ad-entitlement-regression.mjs && node scripts/no-adsterra-regression.mjs",
scripts/no-adsterra-regression.mjs:10:const vendor = /adsterra|highperformanceformat|effectivegatecpm|profitableratecpm|highperformancecpm|adslot|bauval\.org|asiafilm\.org|rt_adst|\/invoke\.js\b|\batOptions\b/i;

$ git diff --exit-code -- public/ads.txt 'scripts/adsense*' scripts/ad-public-paths.mjs scripts/speech-ad-entitlement-regression.mjs
(无输出，exit 0)

$ git diff --check
(无输出，exit 0)
```

匹配行数从 106 降至 1 条已追踪行。加上尚未追踪的新脚本，工作树共 2 条匹配，均用于新增检查。运行时匹配为 0。验证限于本地源码和回归，生产配置及页面尚未验证。
