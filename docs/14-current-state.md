# 14-current-state

## 当前代码状态
当前仓库主干以 `id` 路由为准，旧的 `[slug]` 路由已经废弃并删除：
- `src/app/cases/[id]/page.tsx`
- `src/app/drafts/[id]/page.tsx`
- `src/app/drafts/[id]/actions.ts`

已删除的旧文件：
- `src/app/cases/[slug]/page.tsx`
- `src/app/drafts/[slug]/page.tsx`
- `src/app/drafts/[slug]/actions.ts`

## 当前已打通能力
- 前台首页 / 案例库 / 案例详情
- 登录与基础 profile 自动补齐
- 用户提交案例
- 我的提交
- 后台提交审核
- 后台线索审核
- 草稿详情编辑 / 发布 / 撤回
- RSS 线索导入脚本

## 当前技术判断
项目现在不是“重启开发前的文档仓库”，而是“已经有可运行主干、但还在收口和补闭环”的阶段。

## 当前主要待办
1. 收口部署与运维文档，避免 README / docs / 代码状态不一致
2. 把 OpenClaw cron + 通知链路真正接上
3. 继续提升 lead ingestion 质量（来源扩展、正文抓取、候选产品名提取、失败告警）
4. 补首批真实案例内容，降低 seed/mock 占比
