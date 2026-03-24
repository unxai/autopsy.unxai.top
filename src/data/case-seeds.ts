export type ProductStatus = "closed" | "inactive" | "pivoted" | "acquired_disappeared" | "zombie";

export type CaseSeed = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  statusLabel: string;
  category: string;
  endedAt: string;
  summary: string;
  factSummary: string;
  analysisSummary: string;
  signal: string;
  thesis: string;
  rootCause: string;
  factPoints: string[];
  analysisPoints: string[];
  warningSigns: string[];
  tags: string[];
  stats: {
    timeline: number;
    sources: number;
    comments: number;
  };
  timeline: Array<{
    date: string;
    title: string;
    note: string;
  }>;
  sources: Array<{
    title: string;
    type: string;
    publisher: string;
    date: string;
  }>;
};

export const caseSeeds: CaseSeed[] = [
  {
    id: 1,
    slug: "humane-ai-pin",
    name: "Humane AI Pin",
    tagline: "硬件野心很大，但产品价值和日常可用性没站住。",
    status: "zombie",
    statusLabel: "名存实亡",
    category: "硬件 / 助手",
    endedAt: "2025 Q4",
    summary: "它试图成为手机之后的下一代个人 AI 入口，但始终没建立稳定的高频使用理由。",
    factSummary: "Humane AI Pin 以独立 AI 硬件入口进入市场，发布后快速迎来高关注，同时在首批交付阶段暴露出续航、延迟、准确率和公共场景可用性问题。",
    analysisSummary: "这个案例更像是“叙事先于价值验证”的典型样本：产品试图替代手机入口，但并没有证明自己能在日常任务中提供更强的闭环。",
    signal: "发布时声量极高，真实使用场景极弱。",
    thesis: "它失败的核心不是硬件做得不够酷，而是没有建立比手机更强的日常入口。",
    rootCause: "伪高频场景 + 使用摩擦高 + 价值主张不稳定。",
    factPoints: [
      "产品以穿戴式 AI 硬件形态发布，并被包装为手机之后的新入口。",
      "首批公开评测集中提到续航、发热、响应延迟和识别准确率问题。",
      "用户与媒体反馈长期围绕“为什么不用手机直接完成”展开。"
    ],
    analysisPoints: [
      "产品试图替代手机，但没有建立更低摩擦的默认使用路径。",
      "概念演示成立，不代表真实日常任务闭环成立。",
      "高热度发布并没有转化为高频、稳定、可复用的使用价值。"
    ],
    warningSigns: ["演示惊艳但复购场景模糊", "硬件交互链路过长", "媒体热度远高于用户口碑"],
    tags: ["PMF 不成立", "交互成本高", "叙事大于日用价值"],
    stats: { timeline: 8, sources: 6, comments: 18 },
    timeline: [
      { date: "2023-11", title: "产品发布前后达到舆论峰值", note: "大量媒体把它塑造成下一代个人 AI 入口，但真实任务闭环仍依赖演示语境。" },
      { date: "2024-04", title: "首批用户反馈暴露使用摩擦", note: "续航、准确率、延迟和公共场景可用性同时成为问题。" },
      { date: "2024-06", title: "口碑开始分裂", note: "普通用户开始回到“为什么不用手机”这个更现实的问题。" },
      { date: "2024-09", title: "叙事重心转向未来更新", note: "对已交付体验的直接回答减少，沟通重心转向路线图。" }
    ],
    sources: [
      { title: "官方发布材料", type: "官方", publisher: "Humane", date: "2023-11" },
      { title: "媒体首发评测汇总", type: "媒体", publisher: "The Verge / MKBHD", date: "2024-04" },
      { title: "用户论坛与社媒反馈摘录", type: "社媒", publisher: "Reddit / X", date: "2024-04 ~ 2024-06" },
      { title: "后续路线说明", type: "官方", publisher: "Humane", date: "2024-09" }
    ]
  },
  {
    id: 2,
    slug: "inflection-pi",
    name: "Inflection / Pi",
    tagline: "产品体验温和出色，但公司资源最终转向更重的基础设施路线。",
    status: "pivoted",
    statusLabel: "转型",
    category: "聊天 / 助手",
    endedAt: "2024 Q1",
    summary: "Pi 的用户层口碑并不差，但公司层面的资源投入与战略选择最终走向了另一条路。",
    factSummary: "Pi 作为面向普通用户的 AI 助手上线后获得不少正面评价，但随后公司高层、资源分配和业务重心逐渐转向更重的模型与基础设施方向。",
    analysisSummary: "这类产品未必败在体验本身，而是败在公司战略与产品路线脱节；当公司不再把产品本身视为核心，产品很难持续投入。",
    signal: "用户层口碑不错，但商业路径和公司战略逐渐脱节。",
    thesis: "Pi 没死于体验差，而是死于公司层面的战略重构。",
    rootCause: "高成本模型路线 + 商业化不清晰 + 公司战略迁移。",
    factPoints: [
      "Pi 上线后在用户体验层获得“更温和、更可聊”的口碑。",
      "随后外界讨论重心逐渐转向 Inflection 的融资、模型和团队变化。",
      "到 2024 年，产品叙事明显弱化，公司重心不再集中在普通消费者产品。"
    ],
    analysisPoints: [
      "单个产品体验再好，也可能被公司级资源调度覆盖。",
      "基础模型竞争会把“陪伴型产品”置于更高成本压力下。",
      "产品方向与公司资本故事错位时，往往先牺牲产品连续性。"
    ],
    warningSigns: ["对外叙事从产品转向模型能力", "高层与团队变动频繁", "重资本投入压力上升"],
    tags: ["战略转向", "成本压力", "产品与公司目标错位"],
    stats: { timeline: 7, sources: 5, comments: 11 },
    timeline: [
      { date: "2023-05", title: "Pi 上线并获得好评", note: "产品被视为更温和、情感化的 AI 助手样本。" },
      { date: "2023-10", title: "资本与基础模型叙事增强", note: "外界对 Inflection 的关注逐渐从产品体验转向模型与资源投入。" },
      { date: "2024-03", title: "战略方向明显偏移", note: "团队和资源安排逐步远离面向普通用户的产品路线。" },
      { date: "2024-04", title: "Pi 的产品叙事被弱化", note: "公司层面的变化让产品本身不再是核心。" }
    ],
    sources: [
      { title: "Pi 官方介绍与发布材料", type: "官方", publisher: "Inflection", date: "2023" },
      { title: "高层变动与交易相关报道", type: "媒体", publisher: "TechCrunch / Bloomberg", date: "2024" },
      { title: "用户讨论与评价汇总", type: "社媒", publisher: "X / Reddit", date: "2023 ~ 2024" }
    ]
  },
  {
    id: 3,
    slug: "artifact-news-summarizer",
    name: "Artifact",
    tagline: "好产品感很强，但作为独立入口的增长和留存天花板明显。",
    status: "closed",
    statusLabel: "已关闭",
    category: "资讯 / 推荐",
    endedAt: "2024 Q1",
    summary: "Artifact 的推荐体验精致，但它没能成为足够强的新入口。",
    factSummary: "Artifact 作为 AI 驱动的资讯推荐与摘要产品上线后，体验层收获不少好评，但团队最终公开承认独立发展的规模空间有限，并停止独立发展。",
    analysisSummary: "它的问题不是产品粗糙，而是“精致体验”仍不足以打破既有分发格局。作为独立入口，它没有建立到不可替代的用户习惯。",
    signal: "体验精致，但独立消费习惯难以长期建立。",
    thesis: "Artifact 的问题不是不够好，而是还不够不可替代。",
    rootCause: "习惯迁移成本高 + 独立分发入口天花板低。",
    factPoints: [
      "Artifact 以 AI 推荐和摘要能力切入资讯消费场景。",
      "产品体验在阅读、推荐和摘要层面持续获得不错评价。",
      "团队在 2024 年公开表示独立发展的路径和规模有限。"
    ],
    analysisPoints: [
      "阅读体验优化不必然等于分发入口地位提升。",
      "用户已有稳定的信息获取路径时，新入口需要更强替代性。",
      "高质量产品也可能输给弱入口和低心智占位。"
    ],
    warningSigns: ["高质量推荐没带来强网络效应", "用户心智不如既有平台强", "价值高但频次不够"],
    tags: ["入口弱势", "留存压力", "不可替代性不足"],
    stats: { timeline: 6, sources: 4, comments: 9 },
    timeline: [
      { date: "2023-01", title: "产品推出并被视为新型资讯应用", note: "AI 推荐与摘要能力带来不错的新鲜感。" },
      { date: "2023-07", title: "产品体验逐步成熟", note: "阅读与推荐体验获得不少好评。" },
      { date: "2024-01", title: "宣布停止独立发展", note: "团队承认产品规模和路径有限。" }
    ],
    sources: [
      { title: "Artifact 关闭说明", type: "官方", publisher: "Artifact", date: "2024" },
      { title: "媒体复盘文章", type: "媒体", publisher: "The Verge / TechCrunch", date: "2024" }
    ]
  },
  {
    id: 4,
    slug: "rabbit-r1",
    name: "Rabbit R1",
    tagline: "用设备承载 agent 叙事，但能力兑现速度没跟上期待。",
    status: "zombie",
    statusLabel: "名存实亡",
    category: "硬件 / Agent",
    endedAt: "2025 Q2",
    summary: "它更像一场围绕 AI 未来入口的概念营销实验，而不是成熟产品。",
    factSummary: "Rabbit R1 在 CES 阶段借助高密度演示迅速获得市场注意，随后在首批交付和媒体上手阶段出现“演示能力”与“实际交付能力”明显落差的争议。",
    analysisSummary: "这类产品的问题往往不是单一功能失灵，而是“路线故事先成立，产品闭环后补”。当兑现节奏追不上预期，叙事会反噬产品。",
    signal: "演示视频比真实交付稳定得多。",
    thesis: "它更像一场围绕 AI 未来入口的概念营销实验，而不是成熟产品。",
    rootCause: "交付落差 + 场景稀薄 + 依赖远未成熟的 agent 体验。",
    factPoints: [
      "Rabbit R1 在发布阶段主要依靠演示和 agent 叙事建立预期。",
      "首批交付后，用户与媒体持续指出能力稳定性与演示差距。",
      "后续舆论焦点从“新入口想象力”转向“能力是否兑现”。"
    ],
    analysisPoints: [
      "当产品价值过度依赖未来能力时，当前版本很容易失去解释力。",
      "硬件作为载体放大了交付压力，因为用户更容易感知“买到的到底是什么”。",
      "概念包装和设备形态不能替代长期可用的服务价值。"
    ],
    warningSigns: ["过度依赖 demo 叙事", "日常使用闭环不清晰", "硬件存在感高于服务价值"],
    tags: ["Agent 兑现不足", "过度承诺", "高期望反噬"],
    stats: { timeline: 7, sources: 7, comments: 14 },
    timeline: [
      { date: "2024-01", title: "CES 期间集中收获关注", note: "Rabbit 通过高密度演示叙事建立了‘Agent 新入口’的高预期。" },
      { date: "2024-04", title: "首批交付后出现体验落差", note: "用户开始发现很多能力依旧脆弱，真实使用链路和演示状态差距明显。" },
      { date: "2024-05", title: "争议转向能力兑现与透明度", note: "市场开始追问：它究竟是成熟产品，还是借设备包装的路线故事。" },
      { date: "2024-08", title: "产品叙事难以脱离概念包装", note: "后续更新并未显著改变公众对其‘概念先行’的判断。" }
    ],
    sources: [
      { title: "Rabbit 官方发布与演示材料", type: "官方", publisher: "Rabbit", date: "2024-01" },
      { title: "首批评测与上手报告", type: "媒体", publisher: "The Verge / YouTube reviewers", date: "2024-04" },
      { title: "用户反馈与功能争议整理", type: "社媒", publisher: "Reddit / X", date: "2024-04 ~ 2024-05" },
      { title: "后续路线与市场讨论", type: "媒体", publisher: "Tech press", date: "2024-08" }
    ]
  },
  {
    id: 5,
    slug: "character-social-companion-spin",
    name: "Character 社交分支实验",
    tagline: "角色陪伴很强，但社交扩展路线始终没有形成稳固产品面。",
    status: "inactive",
    statusLabel: "停更",
    category: "社交 / 角色",
    endedAt: "2025 Q1",
    summary: "强情感体验并不自动等于强平台结构。",
    factSummary: "Character 系列产品的高活跃长期集中在角色陪伴与一对一互动，围绕社区、分享或社交层的扩展尝试并未形成同等强度的独立留存支点。",
    analysisSummary: "单点情感体验可以非常强，但未必自然延展成平台结构。核心玩法越强，扩展模块越容易沦为“看起来合理、实际不刚需”的附属层。",
    signal: "用户高活跃集中在少数玩法，扩展功能黏性弱。",
    thesis: "强情感体验并不自动等于强平台结构。",
    rootCause: "核心体验集中 + 扩展路线不成立 + 运营成本持续上升。",
    factPoints: [
      "用户最高活跃长期集中在一对一角色陪伴和沉浸式互动。",
      "围绕社区、分享、社交层的延展尝试没有建立持续留存。",
      "到后期，外界对这些实验路线的讨论逐步淡出主叙事。"
    ],
    analysisPoints: [
      "高情感黏性不等于高平台扩展性。",
      "用户愿意为核心体验停留，不代表愿意迁移到更复杂的社交结构。",
      "当非核心模块无法自增长时，平台化路线通常会被放弃。"
    ],
    warningSigns: ["新功能讨论热度短促", "用户价值集中在单一主场景", "非核心模块缺乏自增长"],
    tags: ["单点体验过强", "扩展失败", "平台化受阻"],
    stats: { timeline: 5, sources: 3, comments: 6 },
    timeline: [
      { date: "2023-09", title: "角色陪伴成为主要增长点", note: "用户显著偏好一对一陪伴和沉浸式互动，而不是更复杂的社交结构。" },
      { date: "2024-02", title: "扩展玩法尝试未形成新支点", note: "围绕社区、分享或社交层的延展尝试没有建立稳定留存。" },
      { date: "2024-07", title: "主价值继续回流到核心角色体验", note: "用户行为再次证明：最强需求仍集中在单点互动，而非平台结构。" },
      { date: "2025-01", title: "相关实验逐步淡出主叙事", note: "社交扩展路线没有形成独立产品面，最终只剩核心陪伴体验。" }
    ],
    sources: [
      { title: "Character 产品更新与公开说明", type: "官方", publisher: "Character.AI", date: "2023 ~ 2024" },
      { title: "用户行为与社区反馈整理", type: "社媒", publisher: "Reddit / Discord / X", date: "2024" },
      { title: "行业侧对陪伴型 AI 社交化讨论", type: "媒体", publisher: "Tech commentary", date: "2024 ~ 2025" }
    ]
  },
  {
    id: 6,
    slug: "ai-copy-micro-saas-wave",
    name: "AI Copy 微 SaaS 浪潮样本",
    tagline: "大量写作类套壳产品在 2023-2024 年迅速出现又迅速消失。",
    status: "closed",
    statusLabel: "已关闭",
    category: "写作 / SaaS",
    endedAt: "2024 Q4",
    summary: "问题不是有人做错了，而是整个赛道的壁垒本来就太薄。",
    factSummary: "2023 至 2024 年间，大量写作类 AI 微 SaaS 快速上线，随后随着基础模型能力提升、价格竞争加剧和 SEO 红利下降，一批产品陆续停更或关闭。",
    analysisSummary: "这不是个别团队执行失败，而是低壁垒包装层在基础模型快速进化时被整体挤压的赛道级问题。",
    signal: "同质化极高，获客和留存都越来越难。",
    thesis: "问题不是有人做错了，而是整个赛道的壁垒本来就太薄。",
    rootCause: "基础模型吞噬 + 套壳无壁垒 + SEO 红利消退。",
    factPoints: [
      "大量产品以 AI 文案、写作提效、模板生成等能力快速上线。",
      "到 2024 年，基础模型原生写作能力持续抬升。",
      "一批产品在流量、付费和留存压力下悄然停更或关闭。"
    ],
    analysisPoints: [
      "包装层缺乏独立壁垒时，会被底层能力升级快速吞掉。",
      "功能差异难以说清时，市场最终会回到价格战和流量战。",
      "低壁垒赛道的短期爆发，不等于长期可持续。"
    ],
    warningSigns: ["landing page 相似度高", "功能差异很难说清", "价格战迅速恶化"],
    tags: ["套壳脆弱", "被基础模型吞掉", "获客困难"],
    stats: { timeline: 9, sources: 8, comments: 21 },
    timeline: [
      { date: "2023-03", title: "写作类 AI 微 SaaS 快速爆发", note: "大量产品以‘更快生成文案’为核心卖点快速上线。" },
      { date: "2023-09", title: "同质化竞争开始显著加剧", note: "功能列表越来越像，差异逐渐只剩模板、价格和营销语气。" },
      { date: "2024-02", title: "基础模型原生能力不断抬升", note: "用户越来越难理解为何要为单点包装层长期付费。" },
      { date: "2024-10", title: "一批产品悄然停更或关闭", note: "赛道进入低壁垒、低留存、低复利的典型收缩状态。" }
    ],
    sources: [
      { title: "SaaS 赛道观察与关闭案例汇总", type: "媒体", publisher: "Indie Hackers / newsletters", date: "2023 ~ 2024" },
      { title: "用户对写作类 AI 工具替代讨论", type: "社媒", publisher: "X / Reddit", date: "2024" },
      { title: "基础模型能力演进对套壳产品影响", type: "分析", publisher: "Industry commentary", date: "2024" },
      { title: "独立开发者复盘文章", type: "博客", publisher: "Founder blogs", date: "2024" }
    ]
  }
];
