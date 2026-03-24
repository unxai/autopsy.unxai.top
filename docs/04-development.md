# AI 产品尸检馆 - Development

> 状态：历史开发记录。部分内容仍可参考，但部署方式与当前主干能力已发生变化；当前状态以 `docs/14-current-state.md` 为准。


## 当前状态
项目已从 brainstorm 进入真实开发阶段。

## 已完成
- 项目初始化（Next.js 16 + TS + Tailwind）
- 首页静态版
- 案例列表页静态版
- 案例详情页静态版
- mock 数据结构
- 静态导出适配
- Supabase 基础 scaffold
- schema.sql 初版
- seed-cases.json 初版
- 项目文档体系建立
- 正式 seed 数据结构初版：`src/data/case-seeds.ts`
- `mock.ts` 已改为从正式 seed 派生
- GitHub 仓库初始化与同步
- 项目目录与域名统一为 `autopsy.unxai.top`

## 当前代码结构
- `src/app/` 页面
- `src/components/` 页面级组件
- `src/data/case-seeds.ts` 正式 seed 数据
- `src/data/mock.ts` 前台消费层
- `src/lib/supabase/` Supabase scaffold
- `supabase/schema.sql` 数据表结构
- `docs/` 产品与开发文档

## 下一步开发顺序
1. 补齐 seed 数据中的 timeline / sources
2. 收集并落入更多真实案例
3. 设计 seed -> Supabase 的导入方式
4. 接 Supabase 读取
5. 加 GitHub 登录
6. 做提交案例页
7. 做评论 / 收藏
8. 做最小后台

## 当前技术判断
由于当前项目要与现有站点部署方式保持一致，因此优先采用：
- 静态导出
- nginx 直出
- 后续通过 Supabase 提供数据与 Auth

## 风险提示
如果后续强依赖服务端鉴权与动态能力，需要重新评估纯静态部署边界。当前阶段先把内容骨架与公开浏览体验做扎实。
