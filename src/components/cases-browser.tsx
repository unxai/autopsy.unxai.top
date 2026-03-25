"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { CaseRecord } from "@/lib/repo/cases";
import { CaseCard } from "@/components/case-card";

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function CasesBrowser({
  cases,
  initialStatus = "全部",
  initialCategory = "全部",
  initialTag = "全部",
}: {
  cases: CaseRecord[];
  initialStatus?: string;
  initialCategory?: string;
  initialTag?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>(initialStatus);
  const [category, setCategory] = useState<string>(initialCategory);
  const [tag, setTag] = useState<string>(initialTag);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const statusValues = ["全部", ...unique(cases.map((item) => item.statusLabel))];
  const categoryValues = ["全部", ...unique(cases.map((item) => item.category))];
  const tagValues = ["全部", ...unique(cases.flatMap((item) => item.tags))];

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    status === "全部" ? next.delete("status") : next.set("status", status);
    category === "全部" ? next.delete("category") : next.set("category", category);
    tag === "全部" ? next.delete("tag") : next.set("tag", tag);
    const query = next.toString();
    router.replace(query ? `/cases?${query}` : "/cases", { scroll: false });
  }, [status, category, tag, router, searchParams]);

  useEffect(() => {
    setMobileFiltersOpen(false);
  }, [status, category, tag]);

  const filtered = useMemo(() => {
    return cases.filter((item) => {
      if (status !== "全部" && item.statusLabel !== status) return false;
      if (category !== "全部" && item.category !== category) return false;
      if (tag !== "全部" && !item.tags.includes(tag)) return false;
      return true;
    });
  }, [cases, status, category, tag]);

  const activeFilterCount = [status, category, tag].filter((value) => value !== "全部").length;

  function clearFilters() {
    setStatus("全部");
    setCategory("全部");
    setTag("全部");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((open) => !open)}
          className="panel flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left"
          aria-expanded={mobileFiltersOpen}
          aria-controls="cases-mobile-filters"
        >
          <div>
            <div className="text-sm text-[var(--foreground)]">筛选条件</div>
            <div className="mt-1 text-xs text-[var(--muted)]">
              {activeFilterCount ? `已启用 ${activeFilterCount} 项筛选` : "当前未启用筛选"}
            </div>
          </div>
          <span className="text-sm text-[var(--muted)]">{mobileFiltersOpen ? "收起" : "展开"}</span>
        </button>

        {mobileFiltersOpen ? (
          <div id="cases-mobile-filters" className="panel mt-3 rounded-[24px] p-4">
            <div className="space-y-5 text-sm">
              <FilterGroup title="状态" values={statusValues} active={status} onChange={setStatus} />
              <FilterGroup title="赛道" values={categoryValues} active={category} onChange={setCategory} />
              <FilterGroup title="死因标签" values={tagValues} active={tag} onChange={setTag} />
            </div>
          </div>
        ) : null}
      </div>

      <aside className="panel hidden h-fit rounded-[24px] p-4 lg:block lg:rounded-[28px] lg:p-6">
        <div className="eyebrow text-xs text-[var(--accent-rust)]">筛选</div>
        <div className="mt-6 space-y-6 text-sm">
          <FilterGroup title="状态" values={statusValues} active={status} onChange={setStatus} />
          <FilterGroup title="赛道" values={categoryValues} active={category} onChange={setCategory} />
          <FilterGroup title="死因标签" values={tagValues} active={tag} onChange={setTag} />
        </div>
      </aside>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <div className="space-y-1">
            <div>
              当前结果：{filtered.length} 个案例
              {tag !== "全部" ? ` · 标签：${tag}` : ""}
              {status !== "全部" ? ` · 状态：${status}` : ""}
              {category !== "全部" ? ` · 赛道：${category}` : ""}
            </div>
            <div className="text-xs text-[rgba(153,163,179,0.72)]">默认按结束时间倒序，最新结局优先展示</div>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-[var(--line)] px-4 py-2 transition hover:text-[var(--foreground)]"
          >
            清空筛选
          </button>
        </div>

        {filtered.length ? (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-2">
            {filtered.map((item) => (
              <CaseCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="panel rounded-[28px] p-8 text-sm leading-7 text-[var(--muted)]">
            当前筛选条件下没有命中案例。你可以
            <button type="button" onClick={() => setTag("全部")} className="mx-1 underline underline-offset-4">
              去掉标签限制
            </button>
            或
            <Link href="/cases" className="ml-1 underline underline-offset-4 text-[var(--foreground)]">
              返回全部案例
            </Link>
            。
          </div>
        )}
      </section>
    </div>
  );
}

function FilterGroup({
  title,
  values,
  active,
  onChange,
}: {
  title: string;
  values: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-3 text-[var(--foreground)]">{title}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button key={value} type="button" onClick={() => onChange(value)} className="bg-transparent text-left">
            <span className={value === active ? "inline-flex rounded-full border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-3 py-1 text-xs text-[var(--foreground)]" : "inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--muted)]"}>
              {value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
