# AI 产品尸检馆 - Plan v0.1

> 状态：历史规划文档。用于回看最初阶段计划；当前执行状态以 `docs/14-current-state.md` 为准。


## 总体策略
优先顺序是：
1. 信息架构与数据结构
2. 前台浏览体验
3. Supabase 基础接入
4. 用户互动
5. 后台审核
6. 部署与测试

## 技术栈
- Next.js 16
- TypeScript
- Tailwind CSS
- Supabase（Auth / Postgres / Storage）
- GitHub 登录
- nginx 静态托管

## 当前部署模式
与现有项目保持一致：
- 域名目录：`/data/app/autopsy.unxai.top`
- GitHub 仓库：`aitmp001/autopsy.unxai.top`
- 静态导出：`next export` 等价能力（Next output export）
- nginx 直出静态文件

## 分阶段计划
### Phase 1：静态前台骨架
- 首页
- 列表页
- 详情页
- mock 数据

### Phase 2：真实数据层
- Supabase schema
- seed 数据
- 列表/详情读取真实数据

### Phase 3：用户系统
- GitHub Auth
- profile
- 收藏
- 评论
- 提交案例

### Phase 4：后台与审核
- 案例编辑
- 提交审核
- 标签 / 分类维护
- 来源与时间线维护

### Phase 5：上线与打磨
- SEO
- OG
- 空状态/错误态
- 统计页增强
- 内容补全

## 关键模块
- 首页 Hero + 数据概览
- 案例卡片列表
- 案例详情结构化模块
- 筛选系统
- 统计页
- 提交页
- 管理后台

## 数据建模计划
优先表：
- categories
- product_statuses
- failure_tags
- products
- autopsies
- timelines
- sources
- comments
- bookmarks
- submissions
