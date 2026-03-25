import Link from "next/link";
import { type CaseRecord } from "@/lib/repo/cases";
import { StatusBadge, Tag } from "@/components/case-ui";

export function CaseCard({ item }: { item: CaseRecord }) {
  return (
    <Link href={`/cases/${item.id}`} className="panel group rounded-[24px] p-4 transition hover:-translate-y-1 hover:border-[rgba(173,104,79,0.28)] hover:bg-[rgba(24,31,43,0.96)] sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] font-mono text-sm text-[var(--accent-blue)] sm:h-12 sm:w-12">{item.name.slice(0, 2).toUpperCase()}</div>
        <StatusBadge status={item.statusLabel} />
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-2xl">{item.name}</h3>
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

      <div className="mt-5 grid gap-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)] sm:mt-6 sm:gap-3 sm:grid-cols-3">
        <span>结局：{item.endedAt}</span>
        <span>{item.timeline.length} 条时间线</span>
        <span>{item.sources.length} 个来源</span>
      </div>
    </Link>
  );
}
