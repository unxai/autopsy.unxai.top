# autopsy.unxai.top

AI 产品尸检馆。

一个结构化归档 AI 产品失败、停更、转型案例的研究站点，当前仓库保留可运行代码、Supabase 结构、导入脚本和项目文档。

## 技术栈
- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS 4

## 本地开发
安装依赖：
```bash
pnpm install
```

启动开发环境：
```bash
pnpm dev
```

常用脚本：
```bash
pnpm lint
pnpm build
pnpm start
```

## 环境变量
参考：
- `.env.example`
- `.env.local`

建议先检查 Supabase 相关配置，再启动完整功能。

## 数据与导入
手动执行线索导入：
```bash
node scripts/import-leads.mjs
```

把 seed 数据导入 Supabase：
```bash
node scripts/import-seeds-to-supabase.mjs
```

线索来源配置：
- `config/lead-sources.json`

Supabase 初始化说明：
- `supabase/README.md`

## 目录结构
- `src/app`：页面、路由与 server actions
- `src/components`：UI 组件
- `src/lib`：认证、数据访问、Supabase 封装
- `src/data`：seed 与 mock 数据
- `scripts`：导入与运维脚本
- `supabase`：schema、seed、SQL 文件
- `public`：静态资源
