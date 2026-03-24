import Link from "next/link";
import { type CaseRecord } from "@/lib/repo/cases";
import { StatusBadge, Tag } from "@/components/case-ui";

export function CaseCard({ item }: { item: CaseRecord }) {
  return (
    <Link href={`/cases/${item.id}`} className="panel group rounded-[28px] p-6 transition hover:-translate-y-1 hover:border-[rgba(173,104,79,0.28)] hover:bg-[rgba(24,31,43,0.96)]">
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

      <div className="mt-6 grid gap-3 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)] sm:grid-cols-3">
        <span>{item.endedAt}</span>
        <span>{item.timeline.length} timeline</span>
        <span>{item.sources.length} sources</span>
      </div>
    </Link>
  );
}
