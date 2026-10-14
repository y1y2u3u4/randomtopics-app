# 上线走查 2026-10-14（randomtopics.app）

按 `~/.claude/skills/web-saas-builder/references/prelaunch-walkthrough.md` 执行。浏览器操作用 Claude in Chrome，只开一个标签页，结束后关闭。

## 一、机器扫描
- 全站 120 页（管家 10/14 跑的，`opportunity-hub/steward/launch-check/2026-10-14/randomtopics.app.txt`）：严重 0。
  - 「中」16 条，其中 15 条是西班牙语单词「todo」（意思是「全部」）被当成 TODO 误报，不改，建议脚本只匹配大写 TODO。
  - 剩下 1 条是 /stats 的「Coming soon」，已改：没有使用数据时整个 Usage Insights 区块不显示。
- 今天的新页面单页扫描（`--only`）：
  - /random-movie-generator、/wu-tang-name-generator：严重 0、中 0、低 0。
  - /apa-citation-generator：标题 80 字符，偏长，已缩短为「APA Citation Generator (7th Ed.) — Free Reference Page Maker」。
  - /classroom-packs：标题 74 字符、描述 208 字符，偏长，已缩短（标题 60 字符、描述 154 字符，H1 不变）。
- 「低」里还有 22 个老页面没有 og:image，记为待办，不在这次范围内。

## 二、人工走查（普通用户视角）

### 课堂包（今天上线）
- /classroom-packs：
  - 价格 $4.99 / $9.99 在落地页、生成器卡片、条款页和 Stripe 上一致。
  - 正文里 7 个站内链接全部 200。
- 不登录购买：点「All classroom packs · $9.99」直接进 Stripe 正式收银台，显示「RandomTopics Classroom Packs · All packs (incl. future packs)」，US$9.99。停在付款前，没有付款。
- 发现并修复：
  1. 回头的买家找不到下载入口：网站导航里没有 /account。已在落地页的「全部课堂包」卡片下和每张课堂版卡片上加「Already bought? Your downloads」链接。
  2. Stripe 收银台没写付款后去哪下载。已在付款按钮下加一句说明：付款后回到 randomtopics.app/account 下载 PPTX 和 PDF，同时会发一封登录链接邮件，换设备也能下载。
- 下载说明：/account 页有 PPTX、PDF 两个下载按钮、Google Slides 导入步骤，以及「在另一台设备上买的？」发登录链接的表单。

### 一次性演讲包
- /speech/account（游客）：显示「还剩 2 次」和两个包（$2.99 / $6.99）。点 $2.99 能进 Stripe 正式收银台，在今天早些时候的走查里已截图。
- 发现并修复：
  1. **文案和实际不符**：页面写「付款后给你发登录链接」，但一次性包买完后之前并不会发这封邮件（只有订阅会发）。已补上：游客买包、次数发放成功后，系统给 Stripe 收到的邮箱发一次登录链接（`/api/speech/packs`）。
  2. 文案还写着「keep this plan」「want the plan」，现在已经没有月度订阅可买了。已改成「your rounds」「the rounds」。
  3. Stripe 收银台同样加了付款后说明：次数会自动加到你的练习账号，并且会发登录链接邮件。

### 首页（冻结到 10/26，只记录不改）
- 首屏：标题、简介、Generate 按钮都在首屏。95 个站内链接全部 200，控制台没有报错。
- 问题（待 10/26 动效实验结束后处理）：点 Generate 后结果出现在约 1,289px 处，电脑屏幕首屏看不到，页面也不会自动滚过去。建议出结果后滚到结果卡片。

### /question-of-the-day（流量第一的生成器页）
- 首屏：今日问题、复制、收藏、分享都在首屏。81 个链接全部 200。复制、随机一题都可用。
- 问题并已修：「Random Question」按钮在问题卡片下方，点了以后新问题出现在卡片里，但卡片已经滚出屏幕，看起来像没反应。已改为：问题卡片不在视口内时，自动平滑滚到卡片。文案没改。

### /spin-the-wheel（流量第二的生成器页）
- 79 个链接全部 200，控制台没有报错，转盘转完会显示类别和题目。
- 问题并已修：在 757px 高的电脑屏幕上，「Spin the Wheel」按钮在 946px，首屏看不到。已改：
  - 屏幕高度不超过 900px 时，隐藏顶部的装饰横幅；
  - 标题区上下留白缩小；
  - 转盘最大边长改为 46vh。
  - 文案没改。

### 手机宽度 375px
- 用 375px 宽的 iframe 检查了今天的新页（APA、电影、Wu-Tang），都没有横向滚动。
- 合并后在线上复查了改动的页面（见下方「复查」）。

## 三、复查（线上，PR #124 + #125 合并后）
- /spin-the-wheel：在 1300×757 的电脑窗口里，Spin 按钮底部在 735px，在首屏内。
  - #124 后还是 780px，所以在 #125 里把转盘上限改成 40vh，并收紧了卡片内边距。
- /question-of-the-day：点「Random Question」后确实调用了滚到卡片。
  - 测试用的标签页在后台，平滑滚动不会播放动画；用 block: center 模拟后，卡片位于 267–490px，在视口中间。
- 手机宽度 375px：/classroom-packs、/spin-the-wheel、/question-of-the-day 首屏都能看到核心按钮，没有横向滚动。
- 新页单页扫描：严重 0、中 0。标题和描述偏长的两条已缩短。

截图（docs/launch-check-2026-10-14/）：
- mobile-375-classroom-spin-qotd.jpg：手机宽度下三页的首屏。
- desktop-spin-the-wheel-first-screen.jpg：电脑首屏，Spin 按钮可见。
- stripe-classroom-all-9.99.jpg：Stripe 正式收银台（全部课堂包，US$9.99），没有付款。

## 待办（不在这次范围）
- 首页 Generate 的结果在首屏外：等 10/26 首页冻结结束后再处理。
- 22 个老页面没有 og:image。
- 走查脚本会把西班牙语「todo」误报成 TODO，建议只匹配大写 TODO。
