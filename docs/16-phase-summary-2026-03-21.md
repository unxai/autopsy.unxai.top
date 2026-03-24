# 16-phase-summary-2026-03-21

## 本轮收尾结论
autopsy 项目已经从“文档与代码状态不一致、后台流程半断开”推进到“前后台主链路可用、RSS 线索导入可日常运行、后台审核效率明显提升”的状态。

当前更适合进入：
- 短期观察期
- 内容补充期
- 小步迭代期

而不是继续大改架构。

## 这轮实际完成的内容
### 1. 仓库与文档状态收口
- README 已改回真实状态，不再错误宣称“仅保留文档”
- 旧 `[slug]` 路由已正式移除，统一使用 `[id]`
- 新增当前状态文档：`docs/14-current-state.md`

### 2. lead ingestion 打通
- `scripts/import-leads.mjs` 已增强：
  - URL 归一化
  - source_url 去重
  - 基础关键词过滤
  - 基础排除词
  - 候选产品名提取
  - source 级规则支持
- 当前只保留 RSS / Atom 采集，不做正文抓取
- 采集源已扩到：
  - TechCrunch AI
  - The Verge AI
  - VentureBeat AI
  - AI News
  - Hacker News（低优先级）
- OpenClaw cron 已接入
  - 当前正式任务：`autopsy-leads-daily`
  - 每天 10:00（Asia/Shanghai）
  - imported=0 时静默

### 3. 后台审核链路顺了
- `/review-leads`
  - 增加状态筛选 + 来源筛选
  - 增加跳转待审核提交入口
  - 空态更清晰
- lead -> submission
  - 自动带入来源、关键词、原标题、摘要
  - 避免重复转入
- `/review-submissions`
  - 如果草稿已存在，会直接提示并给出去草稿链接
  - 避免重复建草稿
- `/drafts`
  - 增加前台状态 + 尸检状态双维筛选
  - 空态与说明补齐

## 当前可用主流程
1. RSS 每日采集线索进入 `leads`
2. 在 `/review-leads` 审核线索
3. 转成 `submissions`
4. 在 `/review-submissions` 审核提交并生成草稿
5. 在 `/drafts/[id]` 编辑、发布、撤回
6. 前台 `/cases` / `/cases/[id]` 查看结果

## 当前仍未完成的重点
### P1：内容侧
1. 补首批真实案例内容
2. 降低 seed / mock 占比
3. 逐步形成可比较的高质量案例样本

### P2：采集侧
1. 观察 3~7 天 daily RSS 效果
2. 按实际误报继续调 source 级规则
3. 再决定是否删减 feed，而不是继续扩太多

### P3：后台侧
1. 继续看审核路径里是否还有重复动作
2. 按真实使用再补最小必要交互
3. 不建议现在继续堆复杂自动化

## 当前不建议做的事
- 不建议现在上正文抓取
- 不建议现在做复杂自动分析链路
- 不建议把 cron 频率再提上去
- 不建议继续大范围重构路由或数据结构

## 建议的下一阶段工作方式
- 以“观察 + 内容补充”为主
- 功能上只做小修小补
- 等实际线索和审核数据跑出来，再决定下一轮投入点

## 你现在最值得看的三个地方
1. `/review-leads`
2. `/review-submissions`
3. `docs/15-lead-ingestion-plan.md`
