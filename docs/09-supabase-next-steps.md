# AI 产品尸检馆 - Supabase Next Steps

> 状态：历史接入说明。保留为接入过程记录；当前以仓库实际脚本、`supabase/README.md` 和 `docs/14-current-state.md` 为准。


## 目标
把当前项目从 seed / 静态样本，切到：
- 前台从 Supabase 读案例数据
- 后续可接 GitHub 登录
- 可继续做评论、收藏、提交案例

## 现在代码已经做好的部分
当前代码已改成双模式：
- 如果未配置 Supabase 环境变量 → 自动回退到本地 `case-seeds.ts`
- 如果已配置 Supabase 环境变量 → 优先读取 `public.case_library` view

也就是说：
- 现在不用一次性全部接完
- 你可以先把库建好
- 我后面继续把 seed 数据导入脚本和 Auth / 提交页接上

## 你现在需要做的事

### 1. 创建 Supabase 项目
在 Supabase 新建一个项目。

### 2. 执行 SQL
按顺序执行：
1. `supabase/schema.sql`
2. `supabase/seed.sql`

注意：
- `seed.sql` 里补了 `product_failure_tags` 表
- 还创建了当前前端直接读取的 `public.case_library` view

### 3. 获取环境变量
需要 3 个值：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 4. 把环境变量写进项目
写到项目根目录 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 anon key
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
NEXT_PUBLIC_SITE_URL=https://autopsy.unxai.top
```

### 5. 告诉我已完成
你只要告诉我：
- Supabase 项目已建
- SQL 已跑
- `.env.local` 已填

我下一步会继续直接做：
1. 写 seed -> DB 导入脚本
2. 把当前案例正式导入 Supabase
3. 校验前台已从 Supabase 读数据
4. 再继续接 GitHub 登录 / 提交案例

## 当前数据库还缺的后续项
这些我后面继续补，不需要你现在先做：
- RLS 策略
- GitHub OAuth 配置
- profiles 自动创建
- submissions 审核流
- comments / bookmarks 写权限

## 当前建议
先不要急着做 Auth。
最优先顺序是：
1. 先把案例库真实数据跑通
2. 再接 GitHub 登录
3. 再做提交 / 评论 / 收藏
