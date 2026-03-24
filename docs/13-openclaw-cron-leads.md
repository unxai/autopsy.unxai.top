# OpenClaw Cron for Lead Ingestion

## 目标
让 OpenClaw 定时执行 `scripts/import-leads.mjs`，并在有新线索时通知你。

## 脚本输出
脚本现在输出 JSON：

```json
{
  "imported": 3,
  "titles": ["...", "...", "..."]
}
```

## 建议 cron 逻辑
1. 定时执行：
```bash
cd /data/app/autopsy.unxai.top && /root/.nvm/versions/node/v22.22.1/bin/node scripts/import-leads.mjs
```
2. 读取输出 JSON
3. 如果 `imported > 0`，给当前 Feishu 用户发送通知
4. 文案示例：
   - 新采集到 3 条疑似停运线索，请查看 `/review-leads`
   - 附前 3 条标题

## 当前频率
- 每天一次
- 当前 cron：每天 10:00（Asia/Shanghai）

## 当前状态
已完成基础脚本输出 JSON；仓库内脚本也已补上首轮去重、URL 归一化、基础去噪、候选产品名提取。

OpenClaw cron 已创建：
- 正式每日任务：`autopsy-leads-daily`

当前策略：
- 任务在 isolated session 中执行
- 执行 `node scripts/import-leads.mjs`
- 仅当 `imported > 0` 时向当前 Feishu 会话发送通知
- `imported = 0` 时静默

## 后续可继续做
- 采集失败告警
- 多来源扩展
- 正文抓取与候选产品名提取继续增强
- 自动附上来源摘要
- 持续观察现有 OpenClaw 定时执行与 Feishu 通知链路的稳定性
