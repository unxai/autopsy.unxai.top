# AI 产品尸检馆 - Admin Role Setup

## 目标
让指定账号可以访问：
- `/review-submissions`
- 后续审核后台能力

## 当前规则
只有 `profiles.role` 为以下之一可进入：
- `editor`
- `admin`

## 手动授权方式
用户至少先登录一次，让系统自动创建 `profiles` 记录。

然后在 Supabase SQL Editor 执行：

```sql
update public.profiles
set role = 'admin'
where username = '你的 GitHub 用户名';
```

或者按用户 ID：

```sql
update public.profiles
set role = 'admin'
where id = '用户 UUID';
```

## 查看当前 profiles
```sql
select id, username, role, created_at
from public.profiles
order by created_at desc;
```

## editor 权限
如果不想给 admin，可以改成：

```sql
update public.profiles
set role = 'editor'
where username = '你的 GitHub 用户名';
```
