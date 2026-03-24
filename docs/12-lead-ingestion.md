# Lead Ingestion

## 目标
定时采集疑似“停运 / 停更 / 下线 / shutdown / sunset”相关新闻线索，进入 `leads` 表，再在 `/review-leads` 审核。

## 已有内容
- 表结构：`supabase/leads.sql`
- 审核页：`/review-leads`
- 脚本：`scripts/import-leads.mjs`
- 配置：`config/lead-sources.json`

## 当前采集方式
- 读取 RSS / Atom feed
- 按关键词过滤标题和摘要
- 去重写入 `public.leads`（按 `source_url`）

## 运行前提
`.env.local` 需要：

```bash
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 手动运行
```bash
cd /data/app/autopsy.unxai.top
node scripts/import-leads.mjs
```

## 建议定时执行
当前按“简单优先”策略，先每天执行一次：

```bash
cd /data/app/autopsy.unxai.top && /root/.nvm/versions/node/v22.22.1/bin/node scripts/import-leads.mjs
```

## 当前增强
- feed 已扩到 TechCrunch AI / The Verge AI / VentureBeat AI / AI News / Hacker News
- feed 配置已升级为可携带 source 级规则
- 关键词已补充 `shutting down`、`sunsetting`、`cease operations`、`winding down`、`停止服务`
- 已增加基础排除词、URL 归一化、脚本内去重、候选产品名提取
- Hacker News 已按低优先级来源处理，要求标题中必须出现强停运信号，并过滤 `Show HN` / `Ask HN` / `Launch HN` / `Who is hiring`

## 下一步建议
1. 增加更细的来源级规则（例如 HN 权重更低）
2. 增加正文抓取和候选产品名抽取
3. 增加 lead -> draft 直转能力
4. 增加失败告警与采集质量统计
