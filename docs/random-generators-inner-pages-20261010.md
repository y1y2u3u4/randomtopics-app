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
