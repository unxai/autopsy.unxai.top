# AI 产品尸检馆 - Server Deploy

## 为什么要切服务端部署
当前项目已经开始接：
- Supabase 真数据读取
- GitHub OAuth 登录
- 后续评论 / 收藏 / 提交案例

这些能力都依赖：
- 动态路由
- server actions / route handlers
- OAuth callback

因此不能继续使用：
- `output: "export"`

## 当前结论
项目已切为 **Next.js 服务端部署模式**。

## 启动方式
开发：
```bash
pnpm dev
```

生产构建：
```bash
pnpm build
pnpm start
```

默认监听：
- `3000`

## nginx 反代建议
示例：

```nginx
server {
    listen 80;
    server_name autopsy.unxai.top;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 下一步
建议后续我继续补：
1. PM2 / systemd 启动方式
2. GitHub OAuth 配置校验
3. 登录后用户态显示
4. 提交案例页
