# Supabase SQL（最可用版本）

只保留两步：

## 1. 初始化结构
执行：
- `supabase/schema.sql`

包含：
- 所有核心表
- 已含 facts / analysis 新字段

## 2. 初始化基础数据与前台 view
执行：
- `supabase/seed.sql`

包含：
- categories
- product_statuses
- failure_tags
- `public.case_library` view

## 当前规则
新库只跑：
1. `schema.sql`
2. `seed.sql`

不再保留升级迁移说明，不再区分历史库路径。
