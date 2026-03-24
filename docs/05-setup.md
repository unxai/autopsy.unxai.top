# AI 产品尸检馆 - Setup

> 状态：历史部署草案。本文保留早期静态导出方案；当前部署方式请改看 `docs/10-server-deploy.md`。


## 基础信息
- 域名：`autopsy.unxai.top`
- 项目目录：`/data/app/autopsy.unxai.top`
- GitHub：`https://github.com/aitmp001/autopsy.unxai.top`
- 服务器 IP：`43.134.36.254`

## 部署方式
与现有项目保持一致：
- 静态导出
- nginx 托管静态目录
- HTTPS 使用现有服务器方案

## 当前站点结构
- 源码目录：`/data/app/autopsy.unxai.top`
- 导出目录：`/data/app/autopsy.unxai.top/out`

## nginx 方向
当前应与其他站点一致：
- `server_name autopsy.unxai.top`
- `root /data/app/autopsy.unxai.top/out`
- `try_files $uri $uri/ /index.html;`

## Supabase 计划配置
环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 说明
当前 OpenClaw Feishu 会话的 elevated 尚未稳定验证可用于系统级部署，因此部署层面要和 OpenClaw 权限配置一起收敛。
