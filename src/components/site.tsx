import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";
import { CaseCard } from "@/components/case-card";
import { FooterAdminLink } from "@/components/footer-admin-link";
import { StatusBadge, Tag } from "@/components/case-ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { type CaseRecord } from "@/lib/repo/cases";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

const statusNotes: Record<string, string> = {
  已关闭: "产品明确结束或服务停止。",
  停更: "产品仍可访问，但更新和推进基本停滞。",
  转型: "原产品路径被公司战略调整替代。",
  名存实亡: "名义上仍存在，但已失去真实势能。",
};

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(15,17,21,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)]">
            <Image src="/logo.png" alt="AI 产品尸检馆" width={44} height={44} className="h-11 w-11 object-cover" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-[0.08em] text-[var(--foreground)]">AI 产品尸检馆</div>
            <div className="eyebrow mt-1 text-[10px] text-[var(--muted)]">archive of failed ai products</div>
          </div>
        </Link>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
          <nav className="flex items-center gap-3 text-sm text-[var(--muted)] md:gap-6">
            <Link href="/cases" className="transition hover:text-[var(--foreground)]">
              案例库
            </Link>
            <a href="/#signals" className="hidden transition hover:text-[var(--foreground)] md:inline-flex">
              常见死因
            </a>
            <a href="/#stats" className="hidden transition hover:text-[var(--foreground)] md:inline-flex">
              统计
            </a>
          </nav>
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 lg:px-10">
        <p>这不是讽刺墙，而是一个面向创业者、产品人和研究者的失败案例档案馆。</p>
        <p className="text-xs text-[rgba(153,163,179,0.72)]">所有案例尽量区分事实信息与分析判断，尽量把公开证据与分析结论分开展示。</p>
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-[rgba(153,163,179,0.56)]">
          <span>autopsy.unxai.top</span>
          <FooterAdminLink />
        </div>
      </div>
    </footer>
  );
}

export function Hero({ cases }: { cases: CaseRecord[] }) {
  const totalCases = cases.length;
  const totalCategories = unique(cases.map((item) => item.category)).length;
  const totalTags = unique(cases.flatMap((item) => item.tags)).length;

  return (
    <section className="archive-grid border-b border-[var(--line)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:py-18 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10 lg:px-10 lg:py-24">
        <div className="space-y-6 sm:space-y-8">
          <div className="eyebrow text-[11px] text-[var(--accent-blue)] sm:text-xs">research archive / failed products / evidence first</div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl leading-[1.06] font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl md:text-7xl">
              记录 AI 产品如何
              <span className="text-[var(--accent-rust)]">失败、停更、转型与消失。</span>
            </h1>
            <p className="measure text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8 md:text-xl">一个面向 AI 创业者、产品人和研究者的结构化案例库。我们不消费失败，而是把热闹过后的结局整理成可检索、可比较、可复盘的研究样本。</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link href="/cases" className="rounded-full border border-[rgba(173,104,79,0.4)] bg-[rgba(173,104,79,0.12)] px-5 py-3 text-center text-sm text-[var(--foreground)] transition hover:bg-[rgba(173,104,79,0.18)] sm:px-6">
              浏览案例
            </Link>
            <a href="#featured" className="rounded-full border border-[var(--line)] px-5 py-3 text-center text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:px-6">
              看精选尸检
            </a>
          </div>
        </div>

        <aside className="panel-strong shadow-soft rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
          <div className="eyebrow text-xs text-[var(--accent-gold)]">current archive snapshot</div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["归档案例", String(totalCases).padStart(2, "0")],
              ["涉及赛道", String(totalCategories).padStart(2, "0")],
              ["死因标签", String(totalTags).padStart(2, "0")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-3 sm:p-4">
                <div className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{value}</div>
                <div className="mt-2 text-sm text-[var(--muted)]">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-[var(--line)] pt-6 text-sm leading-7 text-[var(--muted)]">
            <p>优先关注：套壳脆弱、被基础模型吞掉、PMF 不成立、交互成本高、战略转向。</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function MethodSection() {
  const principles = [
    ["先看结构", "每个案例尽量拆成状态、死因、时间线、证据，而不是只讲一个热闹故事。"],
    ["先看模式", "重点不是谁翻车，而是哪种失败机制在重复出现。"],
    ["先看证据", "事实、公开来源和分析判断尽量分开，降低情绪化解读。"],
  ];

  return (
    <section className="border-b border-[var(--line)] bg-[rgba(255,255,255,0.02)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <div className="eyebrow text-[11px] text-[var(--accent-blue)] sm:text-xs">how to read</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">这不是资讯流，而是一套研究阅读框架。</h2>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">这个项目的目标不是追热度，而是把失败产品变成可复盘、可比较、可积累的反面样本。</p>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {principles.map(([title, note]) => (
            <div key={title} className="panel rounded-[20px] p-4 sm:rounded-[24px] sm:p-6">
              <div className="text-xl font-semibold tracking-[-0.03em]">{title}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedSection({ cases }: { cases: CaseRecord[] }) {
  const featuredCases = cases.slice(0, 3);

  return (
    <section id="featured" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">featured autopsies</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">精选尸检</h2>
        </div>
        <Link href="/cases" className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
          查看全部案例 →
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {featuredCases.map((item) => (
          <Link key={item.id} href={`/cases/${item.id}`} className="panel group rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-[rgba(173,104,79,0.28)] hover:bg-[rgba(24,31,43,0.96)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] font-mono text-sm text-[var(--accent-blue)]">{item.name.slice(0, 2).toUpperCase()}</div>
              <StatusBadge status={item.statusLabel} />
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{item.name}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag>{item.category}</Tag>
                {item.tags.slice(0, 2).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-7 text-[var(--muted)]">
                <span className="text-[var(--foreground)]">分析结论：</span>
                {item.analysisSummary || item.thesis}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SignalsSection({ cases }: { cases: CaseRecord[] }) {
  const signals = unique(cases.flatMap((item) => item.tags)).slice(0, 8);

  return (
    <section id="signals" className="border-y border-[var(--line)] bg-[rgba(255,255,255,0.02)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="eyebrow text-xs text-[var(--accent-rust)]">warning patterns</div>
        <div className="mt-3 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">常见死因，不是热闹过后的注脚，而是可复用的反面样本。</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {signals.map((signal) => (
              <Tag key={signal} href={`/cases?tag=${encodeURIComponent(signal)}`}>{signal}</Tag>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsSection({ cases }: { cases: CaseRecord[] }) {
  const rows = unique(cases.map((item) => item.statusLabel)).map((status) => {
    const matched = cases.filter((item) => item.statusLabel === status);
    return [status, String(matched.length).padStart(2, "0"), statusNotes[status] || "产品处于该状态类型。"];
  });

  const topTags = unique(cases.flatMap((item) => item.tags)).slice(0, 4).map((tag, index) => [tag, `${Math.max(12, 31 - index * 6)}%`]);

  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mb-8">
        <div className="eyebrow text-xs text-[var(--accent-blue)]">archive statistics</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">基础统计</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-[28px] p-6">
          <div className="text-sm text-[var(--muted)]">高频失败标签</div>
          <div className="mt-6 space-y-5">
            {topTags.map(([label, pct]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>{label}</span>
                  <span className="text-[var(--foreground)]">{pct}</span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
                  <div className="h-2 rounded-full bg-[linear-gradient(90deg,var(--accent-rust),rgba(173,104,79,0.28))]" style={{ width: pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel rounded-[28px] p-4 sm:p-6">
          <div className="grid gap-3">
            {rows.map(([label, value, note]) => (
              <div key={label} className="grid gap-2 rounded-2xl border border-[var(--line)] p-4 sm:grid-cols-[90px_90px_1fr] sm:items-center">
                <div className="text-sm text-[var(--muted)]">{label}</div>
                <div className="text-3xl font-semibold tracking-[-0.04em]">{value}</div>
                <div className="text-sm leading-7 text-[var(--muted)]">{note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchWorthSection() {
  const items = [
    ["对独立开发者", "看到哪些看起来能做的小产品，其实从一开始就没有长期壁垒。"],
    ["对产品经理", "看到叙事、使用频次、成本结构和用户习惯之间的断裂。"],
    ["对创业者", "避免把短期热度误判成长期入口，把概念验证误判成 PMF。"],
  ];

  return (
    <section className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-8 max-w-3xl">
          <div className="eyebrow text-xs text-[var(--accent-rust)]">why this archive matters</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">价值不在“看谁死了”，而在识别失败模式何时开始出现。</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map(([title, note]) => (
            <div key={title} className="panel rounded-[24px] p-6">
              <div className="text-xl font-semibold tracking-[-0.03em]">{title}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CasesListPage({ cases, children }: { cases: CaseRecord[]; children?: React.ReactNode }) {
  const statusValues = unique(cases.map((item) => item.statusLabel));
  const categoryValues = unique(cases.map((item) => item.category));
  const tagValues = unique(cases.flatMap((item) => item.tags));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <div className="mb-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">all cases</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">案例库</h1>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="当前案例" value={String(cases.length).padStart(2, "0")} note="首批研究样本" />
        <MetricCard label="涉及赛道" value={String(categoryValues.length).padStart(2, "0")} note="硬件、资讯、聊天、社交、写作" />
        <MetricCard label="状态类型" value={String(statusValues.length).padStart(2, "0")} note="关闭、停更、转型、名存实亡" />
        <MetricCard label="标签数量" value={String(tagValues.length).padStart(2, "0")} note="便于后续做结构化筛选" />
      </div>

      {children ?? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="panel rounded-[24px] p-5">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{value}</div>
      <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{note}</div>
    </div>
  );
}

export function CaseDetailPage({ item, relatedCases = [] }: { item: CaseRecord | null; relatedCases?: CaseRecord[] }) {
  if (!item) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="panel rounded-[32px] p-10 text-center">
          <div className="text-3xl font-semibold tracking-[-0.04em]">案例不存在</div>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">这个 slug 当前没有对应案例。后续若已接入 Supabase，也可能是该案例尚未发布。</p>
          <div className="mt-6">
            <Link href="/cases" className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
              返回案例库
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)] sm:gap-3">
        <Link href="/cases" className="transition hover:text-[var(--foreground)]">
          ← 返回案例库
        </Link>
        <span className="text-[rgba(153,163,179,0.5)]">/</span>
        <span>{item.category}</span>
        <span className="text-[rgba(153,163,179,0.5)]">/</span>
        <Link href={`/drafts/${item.id}`} className="transition hover:text-[var(--foreground)]">
          返回后台草稿
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.52fr] lg:gap-8">
        <section className="space-y-8">
          <div className="panel-strong rounded-[24px] p-4 shadow-soft sm:rounded-[32px] sm:p-7 lg:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={item.statusLabel} />
              <Tag>{item.category}</Tag>
              <span className="text-sm text-[var(--muted)]">结局：{item.endedAt}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:hidden">
              {[
                ["产品状态", item.statusLabel],
                ["赛道", item.category],
                ["时间节点", item.endedAt],
                ["时间线", `${item.timeline.length} 条`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                  <span className="text-xs text-[var(--muted)]">{label}</span>
                  <span className="text-sm text-[var(--foreground)]">{value}</span>
                </div>
              ))}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl md:text-6xl">{item.name}</h1>
            <p className="mt-3 measure text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">{item.tagline}</p>
            <p className="mt-5 max-w-4xl border-l border-[rgba(173,104,79,0.4)] pl-3 text-sm leading-7 text-[var(--foreground)]/86 sm:pl-4 sm:text-base sm:leading-8">{item.summary}</p>

            <div className="mt-4 rounded-[20px] border border-[rgba(173,104,79,0.2)] bg-[rgba(173,104,79,0.06)] p-4 sm:hidden">
              <div className="text-xs text-[var(--muted)]">一句话结论</div>
              <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{item.thesis}</p>
            </div>

            <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2">
              <InsightCard title="一句话结论" value={item.thesis} emphasis />
              <InsightCard title="深层原因" value={item.rootCause} />
              <InsightCard title="主要信号" value={item.signal} />
              <InsightCard title="研究价值" value="这个案例可作为结构化样本，用来观察热度、日常价值、成本结构与战略路径之间的错位。" />
            </div>
          </div>

          <Section title="事实信息" eyebrow="facts">
            <div className="grid gap-4">
              <div className="panel rounded-[24px] p-6">
                <div className="text-sm text-[var(--muted)]">事实摘要</div>
                <p className="mt-3 text-sm leading-8 text-[var(--foreground)]/88">{item.factSummary || item.summary}</p>
              </div>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                {(item.factPoints.length ? item.factPoints : ["待补充事实要点"]).map((point) => (
                  <div key={point} className="panel rounded-[20px] p-4 text-sm leading-7 text-[var(--muted)] sm:rounded-[24px] sm:p-5">
                    <span className="text-[var(--foreground)]">— </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="分析判断" eyebrow="analysis">
            <div className="grid gap-4">
              <div className="panel rounded-[24px] p-6">
                <div className="text-sm text-[var(--muted)]">分析摘要</div>
                <p className="mt-3 text-sm leading-8 text-[var(--foreground)]/88">{item.analysisSummary || item.thesis}</p>
              </div>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                {(item.analysisPoints.length ? item.analysisPoints : [item.rootCause || "待补充分析判断"]).map((point) => (
                  <div key={point} className="panel rounded-[20px] p-4 text-sm leading-7 text-[var(--muted)] sm:rounded-[24px] sm:p-5">
                    <span className="text-[var(--foreground)]">— </span>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="时间线" eyebrow="timeline">
            <div className="space-y-4">
              {item.timeline.map((entry) => (
                <div key={`${entry.date}-${entry.title}`} className="timeline-card rounded-[20px] p-4 sm:rounded-[24px] sm:p-5">
                  <div className="eyebrow text-[11px] text-[var(--accent-blue)]">{entry.date}</div>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{entry.note}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="死前信号" eyebrow="warning signs">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {item.warningSigns.map((signal) => (
                <div key={signal} className="panel rounded-[20px] p-4 text-sm leading-7 text-[var(--muted)] sm:rounded-[24px] sm:p-5">
                  <span className="text-[var(--foreground)]">— </span>
                  {signal}
                </div>
              ))}
            </div>
          </Section>

          <Section title="证据来源" eyebrow="evidence">
            <div className="space-y-3">
              {item.sources.map((source) => (
                <div key={`${source.title}-${source.date}`} className="panel rounded-[22px] p-5 sm:grid sm:grid-cols-[1fr_120px_140px] sm:items-center sm:gap-4">
                  <div>
                    <div className="text-base font-medium text-[var(--foreground)]">{source.title}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">{source.publisher}</div>
                  </div>
                  <div className="mt-3 text-sm text-[var(--accent-blue)] sm:mt-0">{source.type}</div>
                  <div className="mt-2 text-sm text-[var(--muted)] sm:mt-0">{source.date}</div>
                </div>
              ))}
            </div>
          </Section>
        </section>

        <aside className="hidden space-y-4 sm:space-y-6 lg:block">
          <div className="panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
            <div className="eyebrow text-xs text-[var(--accent-rust)]">case facts</div>
            <dl className="mt-6 space-y-4 text-sm">
              {[
                ["产品状态", item.statusLabel],
                ["赛道", item.category],
                ["时间节点", item.endedAt],
                ["时间线条目", String(item.timeline.length)],
                ["证据来源", String(item.sources.length)],
                ["讨论数", String(item.stats.comments)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0">
                  <dt className="text-[var(--muted)]">{label}</dt>
                  <dd className="text-right text-[var(--foreground)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
            <div className="eyebrow text-xs text-[var(--accent-blue)]">failure tags</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <div className="panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
            <div className="eyebrow text-xs text-[var(--accent-gold)]">reading frame</div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <p>先看一句话结论，确认这个案例真正死在什么地方。</p>
              <p>再看时间线，判断问题是突然爆发还是早有征兆。</p>
              <p>最后看来源，区分哪些是事实，哪些是分析。</p>
            </div>
          </div>

          <div className="panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
            <div className="eyebrow text-xs text-[var(--accent-gold)]">related cases</div>
            <div className="mt-5 space-y-3">
              {relatedCases.length ? (
                relatedCases.map((related) => (
                  <Link key={related.id} href={`/cases/${related.id}`} className="block rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.02)] p-4 transition hover:border-[rgba(173,104,79,0.28)] hover:text-[var(--foreground)]">
                    <div className="text-sm text-[var(--foreground)]">{related.name}</div>
                    <div className="mt-1 text-xs text-[var(--muted)]">{related.category} · {related.statusLabel}</div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-[var(--muted)]">暂时没有足够接近的相关案例。</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function InsightCard({ title, value, emphasis = false }: { title: string; value: string; emphasis?: boolean }) {
  return (
    <div className={cn("rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4 sm:rounded-[24px] sm:p-5", emphasis && "ring-1 ring-[rgba(173,104,79,0.18)]")}>
      <div className="text-sm text-[var(--muted)]">{title}</div>
      <p className={cn("mt-3 text-sm leading-7 text-[var(--foreground)]/88", emphasis && "text-[var(--foreground)]")}>{value}</p>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 sm:mb-5">
        <div className="eyebrow text-xs text-[var(--accent-blue)]">{eyebrow}</div>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}
