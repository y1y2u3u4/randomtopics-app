# RandomTopics Native Banner 实验

## 上线前状态

工作树分支 `ads/adsterra-native-bottom-1118` 的 HEAD 与本地 `origin/main` 快照均为 `3b23ddd`。本地 `main` 指向较旧的 `e8d1d00`，因此以 `origin/main` 为源码基线。

- `git grep` 检查了 `origin/main` 的 `src`、`public` 和 `.github`。唯一的 Adsterra 加载路径是 Native Banner。Social Bar、Popunder、Smartlink/Direct Link 均无加载路径。
- 11/16 项目交接记录了 randomtopics.app（Adsterra 站点 6203746）的 Native Banner 32301291 为 Active，生产已配置 `NEXT_PUBLIC_ADSTERRA_NATIVE_ID`、`NEXT_PUBLIC_ADSTERRA_NATIVE_SRC`，并验证生产构建含这个单元。11/18 保存的后台快照（11/14–11/18，末日未结束）列出该站 Native 229 展示、$0.04，其余格式无该站记录。此次使用保存的生产证据，未联网复查当前部署和展示。
- 旧 Native 由根布局的 AdSense 发布门控和两个 Native 配置变量共同控制。AdSense 发布变量为 `NEXT_PUBLIC_ADSENSE_ROLLOUT=manual-public-reviewed-v1`，可选的 `NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT` 默认为现有手动 300×250 单元 `8217822741`。Auto ads 使用现有 AdSense SDK 和后台配置。
- `/api/adslot/` 使用 Vercel 国家头，默认排除 US、CA、GB、AU、NZ、IE、EU27、IS、LI、NO、CH（去重后 36 国），未知国家也排除。`ADSTERRA_EXCLUDE_COUNTRIES` 可覆盖。接口私有、no-store，正常开启时用 `rt_adst` 缓存地理判定 24 小时。仅允许广告白名单路由及允许的主机和 URL 参数，保留现有 QA、GPC、iframe 和付费免广告门控。

## 路由与落位

以下是路由配置与本地验证口径。广告填充由各平台决定。新 Native 一列假设三个 Native 变量、现有 AdSense 发布门控及访客资格均满足。

| 路由或条件 | AdSense（前后相同） | 原 Native | 新 Native |
| --- | --- | --- | --- |
| `/`、`/es`、`/writing` 等手动内容位后仍有正文的页面 | 原手动内容位、现有 Auto ads SDK 门控 | 页脚外侧前方 | `main` 末尾，手动位与 Native 之间有正文 |
| `/spin-the-wheel`、`/es/spin-the-wheel` | 原内容位在 FAQ 所在区块之后、现有 Auto ads SDK 门控 | 页脚外侧前方 | 主体内、含 FAQ 的说明区上方，以该区隔开两家广告 |
| `/topics/[slug]`、`/es/topics/[slug]` | 原列表位及条件渲染的 FAQ 后手动内容位、现有 Auto ads SDK 门控 | 页脚外侧前方 | FAQ 后有手动内容位时，优先放在 FAQ 上方；其余按主内容末尾安全位置判断 |
| `/charades`、`/story-prompt-generator` 等有结果位或中段位的页面 | 各路由原有手动位和 Auto ads 门控 | 页脚外侧前方 | 主内容末尾的安全位置；若末尾紧接手动位，向前找一个能用正文隔开的插入点 |
| `/speech`、`/es/speech` 及其他仅启用 Auto ads 的内容页 | 原 Auto ads 门控，speech 原有 vignette 限制 | 有页脚时在页脚外侧前方 | 主内容末尾有合格位置时最多一个；检测到紧邻的 Auto in-page 插槽时撤下 |
| `/speech/account`、`/speech/practice`、`/account`、`/privacy` 等现有广告排除路由 | 无 | 无 | 无 |
| Native 开关关闭、缺配置、无合格正文插入点 | 各路由原有行为 | 旧版本只根据其原门控和页脚落位判断 | 无 |
| 任意路由的 Social Bar、Popunder、Smartlink/Direct Link | — | 无 | 无 |

正文间隔按 DOM 顺序判断。只使用包含正文且未标记隐藏的标题、段落或区块分隔，这也避免把纯留白当内容。对现有和后插入的可识别 Auto in-page 广告节点执行检查。第三方后台配置、生产广告实际填充和屏幕上的浮动广告覆盖情况需要部署后按真实会话确认。DOM 回归验证的是页面结构和广告请求决策。

## 发布与回滚

- 复用已上线 Native Banner 32301291 的 `NEXT_PUBLIC_ADSTERRA_NATIVE_ID` 和 `NEXT_PUBLIC_ADSTERRA_NATIVE_SRC`。新增 `NEXT_PUBLIC_ADSTERRA_NATIVE_ON=1`。无需在 Adsterra 后台新建广告单元。
- 三个变量均为 Next.js 构建时公开变量。关闭时将 `NEXT_PUBLIC_ADSTERRA_NATIVE_ON` 删除或设为 `0`，重新构建并部署。关闭时根布局不挂载 Native，客户端不请求单元，直接访问 `/api/adslot/` 也得不到单元配置。
- 从本版本实际上线后取三个完整日，按相同站点、时区和流量口径比较 AdSense Page RPM（AdSense 收益 ÷ AdSense PV × 1,000）。报告前后窗口、PV、收益和 RPM。若相对下降超过 10%，按上面的开关回滚。此次交付是本地代码与验证，三日观察从后续部署开始。

## 旧问题和确定性回归

| 旧问题 | 本次确定性检查 |
| --- | --- |
| 仅凭已有配置自动开启，无法独立停止实验 | API 和客户端矩阵验证缺开关、设为 0、缺 ID、缺 SRC；API 关闭时不写地理否定缓存 |
| 把第一个 `footer` 当锚点，无法约束正文间隔 | 渲染真实的英、西转盘页面和手动广告组件，断言 Native → FAQ 正文 → AdSense 的 DOM 顺序；普通页、末尾广告、无安全位置另有用例 |
| 路由 effect 独立记录已加载，重复挂载没有文档级上限 | 同文档重复挂载、重复触发可见、后插入 Auto ads 后重挂载均只请求一次 |
| 只扫描单个组件里的禁用格式名称 | 扫描 `src`、`public` 的运行时源码，覆盖禁用格式、Native 变量与唯一根挂载入口 |
| 广告改动涉及已有付费功能的路由布局 | 英、西转盘以锁定的 Wheel Pro 状态渲染并检查可用购买按钮；保留并运行现有 Speech Coach 免费额度和每日上限两个阻断分支的付费按钮回归 |

英文 topics 路由已有渲染阶段 `Date.now()` 触发 `react-hooks/purity` 的 lint 失败，使用 `origin/main` 同一路径源码复现。这个每日内容选择逻辑与本次广告变更无关。

## 验证记录

命令在工作树根执行。以下为末尾输出或空输出时的退出码。

```text
$ npm run ads:test
PASS: 20 advertising runtime lifecycle cases (in-memory DOM, no network).
PASS 141 paid entitlement, route, identity, bounded retry, timeout and lifecycle assertions; no external calls.
adsterra regression ok (97 checks)
adsterra DOM regression ok (env, placement, late Auto ads, single request, Wheel Pro paywall)

$ node scripts/adsterra-regression.mjs
adsterra regression ok (97 checks)

$ node scripts/adsterra-dom-regression.mjs
adsterra DOM regression ok (env, placement, late Auto ads, single request, Wheel Pro paywall)

$ npm run cost:test
PASS: asset headers, ISR floor, ignore wiring, geo deduplication, lazy speech configuration
PASS: 11 build-ignore history, branch, diff and fail-open cases
PASS: 647 TSX files, every Link opts out of prefetch.
PASS: when blocked by quota or daily limit, the pay action appears

$ npm run speech:test
speech health regression: 6 checks passed

$ npm run billing:test
ok - database failure asks Stripe to retry
ok - replayed event reaches the idempotent RPC (no double grant in code)
PASS: 11 host webhook checks

$ npm run subs:test
subs regression: 946 checks passed
subs-bot-regression: 78 checks passed
subs-journal-regression: 39 checks passed
subs-couples-regression: 550 checks passed

$ ./node_modules/.bin/tsc --noEmit --incremental false
(no output, exit 0)

$ ./node_modules/.bin/eslint scripts/adsterra-regression.mjs scripts/adsterra-dom-regression.mjs scripts/lib/load-typescript.mjs src/app/api/adslot/route.ts src/app/spin-the-wheel/page.tsx src/app/es/spin-the-wheel/page.tsx 'src/app/es/topics/[slug]/page.tsx' src/components/AdsterraNative.tsx src/lib/adsterra.ts src/lib/adsterraPlacement.ts
(no output, exit 0)

$ git show 'origin/main:src/app/topics/[slug]/page.tsx' | ./node_modules/.bin/eslint --stdin --stdin-filename 'src/app/topics/[slug]/page.tsx'
✖ 1 problem (1 error, 0 warnings) — Date.now(), line 175, react-hooks/purity

$ ./node_modules/.bin/eslint 'src/app/topics/[slug]/page.tsx'
✖ 1 problem (1 error, 0 warnings) — same line and rule

$ git diff --check
(no output, exit 0)
```

首次 ESLint 批次包含 `package.json`（无匹配配置）和上述英文 topics 页，并发现 DOM 测试 Link fixture 的 `react/no-children-prop`。调整了 fixture，随后按上面的命令通过相关 lint。

## 改动文件

- `src/components/AdsterraNative.tsx`、`src/lib/adsterraPlacement.ts`：主内容定位、广告间隔、文档级单次加载。
- `src/lib/adsterra.ts`、`src/app/api/adslot/route.ts`：开关及关闭时接口行为。
- `src/app/spin-the-wheel/page.tsx`、`src/app/es/spin-the-wheel/page.tsx`、`src/app/topics/[slug]/page.tsx`、`src/app/es/topics/[slug]/page.tsx`：标记现有 FAQ 区块。
- `scripts/adsterra-regression.mjs`、`scripts/adsterra-dom-regression.mjs`、`scripts/lib/load-typescript.mjs`、`package.json`：回归、TSX 离线渲染支持及 `ads:test` 接入。
- `ADS_1118_REPORT.md`：交付证据。
