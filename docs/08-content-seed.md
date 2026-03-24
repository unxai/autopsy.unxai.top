# AI 产品尸检馆 - Content Seed

## 首批案例目标
建议首批至少 12 个案例，覆盖：
- 不同赛道
- 不同死因
- 不同结局类型
- 不同知名度层级

## 当前 seed 结构
当前已开始从松散 mock 数据收敛到正式 seed 结构，代码位置：
- `src/data/case-seeds.ts`

统一字段包括：
- slug
- name
- tagline
- status / statusLabel
- category
- endedAt
- summary
- signal
- thesis
- rootCause
- warningSigns
- tags
- stats
- timeline
- sources

## 当前已放入 seed 的样本
- Humane AI Pin
- Inflection / Pi
- Artifact
- Rabbit R1
- Character 社交分支实验
- AI Copy 微 SaaS 浪潮样本

## 下一步内容工作
1. 把 timeline 为空的案例补齐
2. 把 sources 为空的案例补齐
3. 为每个案例准备正式来源链接
4. 收集下一批 6 个候选案例

## 候选方向
- AI 写作类套壳产品
- AI 资讯/推荐类独立入口
- AI 硬件入口实验
- Agent 概念型产品
- 陪伴/角色型社交产品

## 内容原则
- 事实与分析分开
- 尽量有公开来源
- 避免幸灾乐祸
- 优先收录有代表性的失败模式
