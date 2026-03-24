import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminActionButton } from "@/components/admin-action";
import { AdminSubnav } from "@/components/admin-subnav";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { convertLeadToSubmission, updateLeadStatus } from "./actions";

export default async function ReviewLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; done?: string; source?: string }>;
}) {
  const supabase = await createClient();
  const profile = await ensureProfile();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) redirect("/login");
  if (!profile || !["editor", "admin"].includes(profile.role)) redirect("/");

  const params = await searchParams;
  const activeStatus = params.status || "all";
  const activeSource = params.source || "all";
  const done = params.done;

  let query = supabase
    .from("leads")
    .select("id, title, source_url, source_site, summary, candidate_product_name, matched_keywords, lead_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeStatus !== "all") {
    query = query.eq("lead_status", activeStatus);
  }

  if (activeSource !== "all") {
    query = query.eq("source_site", activeSource);
  }

  const { data: leads } = await query;
  const { data: allLeads } = await supabase.from("leads").select("lead_status, source_site");

  const counts = (allLeads || []).reduce<Record<string, number>>((acc, item) => {
    acc[item.lead_status] = (acc[item.lead_status] || 0) + 1;
    return acc;
  }, {});

  const tabs = [
    { key: "all", label: "全部", count: allLeads?.length || 0 },
    { key: "new", label: "新线索", count: counts.new || 0 },
    { key: "reviewed", label: "已看过", count: counts.reviewed || 0 },
    { key: "discarded", label: "已忽略", count: counts.discarded || 0 },
    { key: "converted", label: "已转提交", count: counts.converted || 0 },
  ];

  const sources = ["all", ...new Set((allLeads || []).map((item) => item.source_site).filter(Boolean))];

  const doneMap: Record<string, string> = {
    reviewed: "已标记为看过",
    discarded: "已忽略该线索",
    converted: "已转为提交",
    save_failed: "线索状态保存失败",
    convert_failed: "转提交失败",
    missing_params: "缺少必要参数",
    missing_lead_id: "缺少线索 ID",
    lead_not_found: "未找到该线索",
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">后台</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">线索审核</h1>
        </div>
      </div>

      <AdminSubnav current="review-leads" />

      {done ? <div className="mb-6 rounded-2xl border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">{doneMap[done] || done}</div> : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <span>这里处理定时采集到的候选线索，确认后可转成正式提交。转入时会自动带入来源、命中关键词和原标题。</span>
        <Link href="/review-submissions?status=pending" className="text-[var(--foreground)] underline underline-offset-4">
          去看待审核提交
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link key={tab.key} href={`/review-leads?status=${tab.key}${activeSource !== "all" ? `&source=${encodeURIComponent(activeSource)}` : ""}`} className={tab.key === activeStatus ? "rounded-full border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-4 py-2 text-sm text-[var(--foreground)]" : "rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"}>
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {sources.map((source) => (
          <Link
            key={source}
            href={`/review-leads?source=${encodeURIComponent(source)}${activeStatus !== "all" ? `&status=${encodeURIComponent(activeStatus)}` : ""}`}
            className={source === activeSource ? "rounded-full border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-4 py-2 text-sm text-[var(--foreground)]" : "rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"}
          >
            {source === "all" ? "全部来源" : source}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {leads?.length ? (
          leads.map((item) => (
            <div key={item.id} className="panel rounded-[28px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xl font-semibold text-[var(--foreground)]">{item.title}</div>
                <div className="text-sm text-[var(--muted)]">{item.lead_status}</div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <div>候选产品：{item.candidate_product_name || "未识别"}</div>
                <div>来源站点：{item.source_site || "未知"}</div>
                <div>来源链接：<a href={item.source_url} target="_blank" className="text-[var(--foreground)] underline underline-offset-4">打开</a></div>
                <div>摘要：{item.summary || "无"}</div>
                <div>关键词：{Array.isArray(item.matched_keywords) && item.matched_keywords.length ? item.matched_keywords.join(" / ") : "无"}</div>
                <div>抓取时间：{new Date(item.created_at).toLocaleString("zh-CN", { hour12: false })}</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <form action={convertLeadToSubmission}>
                  <input type="hidden" name="lead_id" value={item.id} />
                  <AdminActionButton tone="primary">转为提交</AdminActionButton>
                </form>
                <form action={updateLeadStatus}>
                  <input type="hidden" name="lead_id" value={item.id} />
                  <input type="hidden" name="lead_status" value="reviewed" />
                  <AdminActionButton tone="secondary">标记看过</AdminActionButton>
                </form>
                <form action={updateLeadStatus}>
                  <input type="hidden" name="lead_id" value={item.id} />
                  <input type="hidden" name="lead_status" value="discarded" />
                  <AdminActionButton tone="danger">忽略</AdminActionButton>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="panel rounded-[28px] p-8 text-sm text-[var(--muted)]">
            当前筛选条件下没有线索。
            {(activeStatus !== "all" || activeSource !== "all") ? (
              <Link href="/review-leads" className="ml-2 text-[var(--foreground)] underline underline-offset-4">
                返回查看全部
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
