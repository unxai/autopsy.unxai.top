import { cache } from "react";
import { caseSeeds, type CaseSeed } from "@/data/case-seeds";
import { createClient } from "@/lib/supabase/server";

export type CaseRecord = CaseSeed;

function sortCases(items: CaseRecord[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export const shouldUseSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const getAllCases = cache(async (): Promise<CaseRecord[]> => {
  if (!shouldUseSupabase) {
    return sortCases(caseSeeds);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_library")
      .select("*")
      .eq("visible", true)
      .order("name", { ascending: true });

    if (error || !data?.length) {
      return sortCases(caseSeeds);
    }

    return data.map(mapViewRowToCaseRecord);
  } catch {
    return sortCases(caseSeeds);
  }
});

export const getCaseById = cache(async (id: number): Promise<CaseRecord | null> => {
  const all = await getAllCases();
  return all.find((item) => item.id === id) ?? null;
});

function mapViewRowToCaseRecord(row: Record<string, unknown>): CaseRecord {
  return {
    id: Number(row.id ?? 0),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    tagline: String(row.tagline ?? ""),
    status: (row.status_key as CaseRecord["status"]) ?? "closed",
    statusLabel: String(row.status_label ?? "已关闭"),
    category: String(row.category_name ?? "未分类"),
    endedAt: String(row.ended_at ?? "待补充"),
    summary: String(row.summary ?? ""),
    factSummary: String(row.fact_summary ?? row.summary ?? ""),
    analysisSummary: String(row.analysis_summary ?? row.thesis ?? ""),
    signal: String(row.signal ?? ""),
    thesis: String(row.thesis ?? ""),
    rootCause: String(row.root_cause ?? ""),
    factPoints: Array.isArray(row.fact_points) ? row.fact_points.map(String) : [],
    analysisPoints: Array.isArray(row.analysis_points) ? row.analysis_points.map(String) : [],
    warningSigns: Array.isArray(row.warning_signs) ? row.warning_signs.map(String) : [],
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    stats: {
      timeline: Number(row.timeline_count ?? 0),
      sources: Number(row.sources_count ?? 0),
      comments: Number(row.comments_count ?? 0),
    },
    timeline: Array.isArray(row.timeline) ? row.timeline.map(mapTimelineRow) : [],
    sources: Array.isArray(row.sources) ? row.sources.map(mapSourceRow) : [],
  };
}

function mapTimelineRow(item: unknown) {
  const row = (item ?? {}) as Record<string, unknown>;
  return {
    date: String(row.date ?? row.event_date ?? "待补充"),
    title: String(row.title ?? ""),
    note: String(row.note ?? row.description ?? ""),
  };
}

function mapSourceRow(item: unknown) {
  const row = (item ?? {}) as Record<string, unknown>;
  return {
    title: String(row.title ?? ""),
    type: String(row.type ?? row.source_type ?? "待补充"),
    publisher: String(row.publisher ?? ""),
    date: String(row.date ?? row.published_at ?? "待补充"),
  };
}
