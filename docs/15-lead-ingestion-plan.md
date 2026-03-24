# 15-lead-ingestion-plan

## 当前决定
先保持简单：
- 只采集 RSS / Atom
- 不做正文抓取
- 每天执行一次
- 有新增线索才通知

## 已完成
1. `scripts/import-leads.mjs` 可直接写入 `public.leads`
2. 已接入 OpenClaw cron
3. 当前每日任务：`autopsy-leads-daily`
4. 已有基础能力：
   - URL 归一化
   - source_url 去重
   - 关键词过滤
   - 基础排除词
   - source 级规则
   - 候选产品名提取
   - 导入结果 JSON 输出
   - imported=0 时静默

## 当前采集源
- TechCrunch AI
- The Verge AI
- VentureBeat AI
- AI News
- Hacker News（低优先级，已加额外限制）

## 还需要完善的计划
### P1：稳态可用
1. 观察 3~7 天每日采集结果
2. 记录误报来源最多的是哪几个 feed
3. 根据实际结果继续调 source 级规则
4. 检查 `/review-leads` 的人工审核体验是否顺手

### P2：提高质量
1. 增加更细的 source 白名单 / 黑名单词
2. 优化候选产品名提取
3. 对高噪声来源单独加更严格阈值
4. 增加导入统计（每天导入几条、误报几条）

### P3：流程闭环
1. 增加 lead 质量复盘文档
2. 视审核量决定是否需要自动标签
3. 视实际收益决定是否继续扩 feed 源

## 当前不做
- 正文抓取
- 页面级摘要提取
- 大而复杂的自动分析链路
- 高频 cron

## 建议你的下一步查看点
1. 明天看一次 `/review-leads`
2. 判断新增线索是否值得保留当前 feed 组合
3. 再决定要不要继续提纯或删减来源
