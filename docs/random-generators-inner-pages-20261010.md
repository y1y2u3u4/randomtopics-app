# RandomTopics 追加内页需求：随机分组和名字、随机生成器族（2026-10-10）

来源：关键词机会挖掘会话，10/10 夜间扫描（Similarweb TopSites，美国，28 天自然点击）。分级库：`/Users/shiliu/project/outputs/benchmark-site-keywords-2026-10-03/tier-all-2026-10-10.json`。用户 10/10 同意放进 randomtopics.app。

## 站点现状
randomtopics.app（仓库 y1y2u3u4/randomtopics-app，public），英文 + 西语，204 个网址。已有：随机话题、辩论和演讲题、写作和研究题、随机物品 / 州 / 画画题、band / dragon / country 名字生成器、yo mama randomizer、charades、journal prompts；已有付费口语练习（不要动现有付费和免费额度）。约 1.2 万自然流量，Authority Score 13。

## 要做的页面
| 优先级 | 主词 | 28 天点击 | 难度 | 现在谁在拿 | URL | 页面要点 |
|---|---|---|---|---|---|---|
| P0 | **random team generator** | 14,061（月量 1.8 万） | D1 | randomlists 6,594、pickerwheel 4,577 | `/random-team-generator/` | 粘贴名单 → 按队数或每队人数随机分；可按「平衡」（标记男女 / 水平后均匀分配）；队名自动生成（复用名字生成器）；投屏全屏模式；重抽、锁定某人；导出或复制分组表；保存班级名单（localStorage，不登录）。同页覆盖 random group generator、team picker |
| P0 | **random animal generator** | 17,659 | D1 | randomlists、randomspinwheel | `/random-animal-generator/` | 每个动物配图 + 一句趣闻；可筛选（哺乳、鸟、海洋、农场、儿童常见）；可用于画画题、猜谜（和 /random-drawing-generator/ 互链） |
| P0 | **last name generator** / surname generator | 22,848 / 4,094 | D1 | name-generator.org.uk、randomlists | `/last-name-generator/` | 按国家或文化来源（英、爱尔兰、意大利、西语、日、韩等）生成，附含义和来源；同页覆盖 surname |
| P1 | dnd name generator | 9,937 | D1 | fantasynamegenerators、dndnamegenerator.cc | `/dnd-name-generator/` | 按种族（精灵、矮人、半兽人、提夫林……）和性别；和 dragon / gnome 页互链 |
| P1 | viking name generator | 9,259 | D1 | fantasynamegenerators、reedsy | `/viking-name-generator/` | 男女名 + 称号（the Bold 等）+ 含义 |
| P1 | character name generator | 7,572 | D1 | name-generator.org.uk、reedsy | `/character-name-generator/` | 给写作用：按类型（奇幻、科幻、现代）+ 名和姓；和写作题页互链 |
| P1 | random character generator | 4,684 | D1 | rangen、randomgenerator.com.au | `/random-character-generator/` | 名字 + 性格 + 外貌 + 动机 + 秘密，写作和角色扮演用 |
| P2 | gnome name generator | 2,733 | D1 | fantasynamegenerators | `/gnome-name-generator/` | 同 dnd 模板 |
| P2 | random food generator | 1,544 | D1 | codebeautify、randommer | `/random-food-generator/` | 「今天吃什么」：按餐别、菜系；配图 |
| P2 | writing prompt generator | 1,544 | D1 | 小站 | 并入已有 `/writing-topic-generator/` 或新开 `/writing-prompt-generator/` | 先查站内是否重复，避免自相竞争 |
| P2 | random letter generator | 36,600 | D3b（偏难） | pickerwheel、randomwordgenerator | `/random-letter-generator/` | 简单页即可（大写 / 小写 / 排除字母 / 一次多个），给拼字和课堂游戏用 |
| P2 | charades generator | 2,806 | D3b | randomwordgenerator、rainypad | 加深已有 `/charades/` | 加难度、主题和计时；title 覆盖 charades generator |

西语：P0 页各做一个 /es/ 版本（generador de equipos aleatorios 等），沿用站内现有做法。

## 规格（全部页面）
- 打开即可用：首屏就是生成器，点一次出结果；结果可复制、可分享链接（参数编码进 URL）。
- 内容层：每页 300–600 字说明（怎么用、典型场景、FAQ），FAQ 结构化数据；「更新日期」。
- 数据：名字和动物等词库放仓库里的 JSON（不用 AI 实时生成，零成本、可测试）；每个词库 ≥ 300 条，名字附含义。
- 图片：动物、食物等需要配图时，**一律用 ChatGPT 网页版（Claude in Chrome）出图**，不要用 API 图像模型；统一风格（扁平插画），压缩成 WebP，放 public/。
- 互链：新页之间、和已有的话题生成器 / 名字生成器互链；首页或 /categories/ 加「Random generators」分组。
- 不影响现有付费功能和免费额度。

## 验收
- 单元测试：分组算法（人数均分、平衡分组、锁定成员）、每个生成器的过滤条件和不重复抽取。
- 新页面进 sitemap（含 /es/ 版本），上线后 IndexNow 推送，Search Console 请求编入索引（配额约每天 10 个，按优先级分批）。
- 完成后在 `/Users/shiliu/project/opportunity-hub/sites/randomtopics/inner-page-backlog.md` 记录状态（已上线 / 未做及原因）。

---

## 追加需求：冷知识题库内页（2026-10-13，weekly-opportunity-to-prd）

**目标**：站里已有话题、辩论、charades、paranoia 等派对 / 课堂题库，但没有 trivia（冷知识问答）专页。trivia 的受众（老师、聚会主持、家庭游戏夜）和本站重叠，能复用「题库 JSON + 一键抽题 + 投屏模式」的现有做法，零 API 成本。10 月正好赶上 Halloween trivia 季节词。

### T.1 为什么做（数据）
Similarweb TopSites 美国 28 天点击（`tier-all-2026-10-13.json`）；月量和 KD 来自 Semrush（10/12 小站赢家反查 `winner-new-kw-20261012.json`）。

| 词 | 28 天点击 | 谁在拿 | 难度 / KD | 优先级 |
|---|---|---|---|---|
| trivia questions | 20,790（月量 69,755） | today.com 10,693（51%）、quizandsurveymaster.com 3,680、rd.com 3,665 | D1 / 38 | P0 |
| trivia questions and answers | 月量 40,500 | 同族（媒体文章为主） | KD **26** | P0（同页覆盖） |
| trivia maker | 1,625 | triviamaker.com 1,342 | D1 / 53 / CPC $1.48 | P1 |
| math trivia | 1,534 | mashupmath.com 746、watercoolertrivia | D1 / 33 | P1（分类页） |
| trivia generator | 441 | randomtriviagenerator.com 250、triviamaker 120 | D1 / 33 / CPC $2.28 | P0（同页覆盖） |
| halloween trivia、christmas trivia 等季节词 | 未测 | 媒体清单文章 | — | P1（10 月先做 Halloween） |

头部是媒体清单文章（today.com、rd.com：一篇 100 题的长文，不能抽题、不能计分），工具型页面很少 → 我们用「可玩的题库」去打「静态清单」。

### T.2 页面清单
| URL | 内容 | 主词 | 优先级 |
|---|---|---|---|
| /trivia-questions/ | 首屏抽题器：选分类和难度 → 出题 → 点「显示答案」；主持模式（全屏、计时、计分板 2–8 队）；下面放 100 题静态清单（带答案，可折叠），兼顾「questions and answers」的阅读意图 | trivia questions、trivia questions and answers、trivia generator | P0 |
| /trivia-questions/{分类}/ | general、kids、math、science、history、geography、movies、music、sports、food，各 ≥ 60 题 | math trivia 等 | P1 |
| /trivia-questions/halloween/ | 万圣节专题 ≥ 50 题（10/31 前上线） | halloween trivia | P1（加急到 10/20 前） |
| /trivia-maker/ | 自己出题：输入题目和答案 → 生成可分享的答题链接（题目编码进 URL，不存服务器、不登录） | trivia maker | P1 |

西语：/es/preguntas-de-trivia/ 做 P0 页一个版本（沿用站内做法），分类页先不做。

### T.3 规格
- 题库放仓库 JSON（`src/data/trivia/*.json`），每题：题干、答案、2–3 个干扰项（可切换选择题 / 问答）、分类、难度、一句解释。总量 ≥ 800 题。
- **准确性**：题目原创撰写，不抄 today.com、rd.com 等清单原文；每题解释里写依据，有争议或会过时的（「现任…」「最新…」）不收。上线前抽 50 题人工复核。
- 不收政治、宗教、灾难、真人隐私类题目；儿童分类只收适合 8–12 岁的内容。
- 每页一句话简短答案 + 300–500 字说明 + FAQ 结构化数据 + 「更新日期」。
- 不影响现有付费功能和免费额度。

### T.4 竞品对标与超过竞品的一点
| 竞品 | 强项 | 弱项 |
|---|---|---|
| today.com / rd.com | 权威媒体、题多 | 静态长文、广告多，不能抽题和计分 |
| quizandsurveymaster.com | 有题库 | 插件推广页，体验一般 |
| triviamaker.com | 能出题 | 要注册，免费版限制多 |
**超过的一点**：首屏能直接开一局（主持模式 + 计时 + 多队计分），自己出题不用注册。

### T.5 图片需求（docs/art-requests.json，由 daily-inner-page-polish 用 ChatGPT 网页版出图）
/trivia-questions/ 1 张主视觉（扁平插画：问答卡片 + 计分板）；Halloween 页 1 张；分类页共用图标风格，每类 1 个小图标（10 个）。

### T.6 验收（编号 T）
- T1 抽题不重复（一局内）、分类和难度筛选正确、计分板加减分正确，有单元测试。
- T2 /trivia-maker/ 分享链接能完整还原题目，题目里有特殊字符也不出错。
- T3 题库 ≥ 800 题，JSON 结构校验通过；抽检 50 题人工复核记录写进 PR 描述。
- T4 新页进 sitemap，IndexNow 推送，进 `opportunity-hub/steward/indexing/queue.md`。
- T5 完成后更新 `opportunity-hub/sites/randomtopics/inner-page-backlog.md`。

### T.7 上线顺序
第一批：/trivia-questions/ + /trivia-questions/halloween/（10/20 前）；第二批：10 个分类页 + 西语；第三批：/trivia-maker/。

## 追加需求：课堂场景内页（2026-10-15，daily-site-inner-page-scan，复盘插队）

**目标**：10/15 复盘：classroom.google.com 一周 61 个会话带来 249 次关键事件（上周 7 次），老师把我们的页面分享进课堂，转化很高；10/14 已上线 classroom packs（$4.99/包）。现有课堂相关词（high school debate topics、group discussion topics、5-minute speech topics for students、question of the day for students）**都已有页面且排在第 5–9 名**，缺的是**按「给孩子 / 给学生」改写的问答游戏页**和老师每天要用的晨会类页面。全部复用现有生成器引擎和题库，零 API 成本；每页加「投屏模式」和 classroom pack 入口。

### CL.1 为什么做（数据）
数据源说明：3UE（Semrush / Similarweb）今天未登录，**没有月搜索量和 KD**。下表是 Google Trends 美国近 12 个月相对热度（同图对比）；对照词 group discussion topics 本站 GSC 28 天 951 次展示、排名 7.1。前排结果是 Google 实测（10/15，gl=us）。

| 词 | 相对热度（对照 group discussion topics = 1） | Google 前排 | 本站现状 | 优先级 |
|---|---|---|---|---|
| this or that for kids | 约 12 倍（近 8 周更高） | todaysparent、mentimeter、care.com、tellmecards、roommomrescue（**全是文章列表，没有工具**） | 只有通用 /this-or-that | P0 |
| would you rather questions for kids | 约 4 倍 | 同类亲子 / 教育博客 | 只有通用 /would-you-rather | P0 |
| get to know you questions for students | 约 0.8 倍，近 8 周 1.7 倍（开学季） | panoramaed、boredteachers、twinkl、briskteaching、ziplet | 只有成人版 /topics/get-to-know-you-questions-for-adults | P0 |
| morning meeting questions | 约 1.6 倍 | weareteachers、centervention、scholastic、glitterinthird | 无（/question-of-the-day-for-students 部分重叠） | P1 |
| riddles for kids | 约 12 倍 | 待测 | 无 | P1（新题库，工作量中） |
| journal prompts for kids | 约 0.4 倍 | — | 有 /journal-prompts、/topics/writing-prompts-for-kids | 不新开，给已有页加「for kids」筛选和标题 |
| classroom timer | 约 10 倍 | online-stopwatch、classroomscreen、toytheater、classroomtimers.app | 无 | P2（大品牌占位，难；可做成「题目 + 计时」投屏组合） |
| bell ringer questions、brain break ideas、debate topics for kids | 很小 | — | — | 不做（量小） |

### CL.2 页面清单
| URL | 内容 | 主词 | 批次 |
|---|---|---|---|
| `/this-or-that/kids/` | 儿童版二选一：只用适合 6–12 岁的题（无恋爱、无成人话题），按年级段筛选；投屏模式（大字、方向键翻题、「站到教室左边 / 右边」玩法说明） | this or that for kids、this or that questions for kids | 1 |
| `/would-you-rather/kids/` | 儿童版 would you rather，同上；可打印 1 页 PDF（免费 10 题，完整版接 classroom pack） | would you rather questions for kids | 1 |
| `/topics/get-to-know-you-questions-for-students/` | 按年级段（K–5、6–8、9–12）的认识同学问题，开学第一周、换座位后、线上课三种用法 | get to know you questions for students、first day of school questions | 1 |
| `/morning-meeting-questions/` | 晨会问题生成器：每天一题（按日期固定，全班同一题）+ 分享环节 + 活动建议，投屏模式；和 /question-of-the-day-for-students 互链但角度不同（晨会流程） | morning meeting questions、morning meeting greeting ideas | 2 |
| `/riddles-for-kids/` | 儿童谜语：点开看答案、按难度筛、投屏抢答模式；题库 ≥200 条，原创或公有领域改写 | riddles for kids、riddles for kids with answers | 2 |
| （改已有页）`/journal-prompts` | 加「Kids」筛选和 title 里的 for kids | journal prompts for kids | 2 |
| `/classroom-timer/` | 计时器 + 随机题组合（讨论 2 分钟、发言 1 分钟），全屏投屏 | classroom timer | 3 |

### CL.3 各页规格
- 儿童版题库从现有题库里**筛 + 人工复核**，加 `audience: kids` 标记；不得出现恋爱、暴力、酒精、政治话题；每页写「适合年龄」。
- 每页首屏就是生成器（点一下出一题），下面是 30–50 条可复制的列表（给搜「questions list」的人）、玩法、FAQ。
- 投屏模式复用 classroom packs 的大字展示；每页一个不打扰的「完整课堂包 $4.99」入口（已有支付，不改价格和支付流程）。
- 英文先做；西语第二批（/es/ 下同结构）。

### CL.4 技术实现要求
- 复用现有 this-or-that / would-you-rather / question-of-the-day 生成器组件与题库 JSON，只加受众筛选；不新增 API、不改 Stripe、不改广告配置。
- 进 sitemap，IndexNow 推送，加 og:image（沿用 `scripts/og/render-generator-og.mjs`）。

### CL.5 导航与互链
- /classroom-packs 顶部加「免费课堂工具」一栏链接这 5 页；/this-or-that、/would-you-rather 顶部加「Kids version」切换；/categories/education 加入口。

### CL.6 竞品对标与超过竞品的一点
| 页 | 前 3 名 | 他们有 | 我们多一点 |
|---|---|---|---|
| this or that for kids | todaysparent、care.com、tellmecards | 长列表文章 | 能直接投屏玩、按年级筛、一键随机 |
| get to know you for students | panoramaed、boredteachers、twinkl | 列表 / 付费 PDF | 按年级段 + 投屏 + 免费打印 |
| morning meeting | weareteachers、centervention、scholastic | 文章 | 每天固定一题 + 流程卡片，老师不用备课 |

图片：每页 1 张主视觉（课堂扁平插画，ChatGPT 网页版出图），写进 `docs/art-requests.json`。

### CL.7 验收（编号 CL）
- CL1 新页全部 200，进 sitemap，IndexNow 推送，进 `opportunity-hub/steward/indexing/queue.md`。
- CL2 儿童版题库全部带 audience 标记，人工抽检 100 题记录在 PR 描述；不含成人话题。
- CL3 投屏模式：全屏、大字、方向键翻题可用；375px 宽无横向滚动。
- CL4 /morning-meeting-questions/ 同一天刷新得到同一题。
- CL5 不改价格、支付、广告逻辑；`npm run generators:test` 和构建全绿。
- CL6 完成后更新 `opportunity-hub/sites/randomtopics/inner-page-backlog.md`。

### CL.8 上线顺序
第 1 批：this-or-that/kids、would-you-rather/kids、get-to-know-you-questions-for-students；第 2 批：morning-meeting-questions、riddles-for-kids、journal-prompts 改标题；第 3 批：classroom-timer。
