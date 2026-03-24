import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminActionButton, AdminActionLink } from "@/components/admin-action";
import { AdminSubnav } from "@/components/admin-subnav";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createDraftFromSubmission, reviewSubmission } from "./actions";

export default async function ReviewSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ done?: string; status?: string }>;
}) {
  const supabase = await createClient();
  const profile = await ensureProfile();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="panel rounded-[32px] p-10 text-center">
          <div className="text-3xl font-semibold tracking-[-0.04em]">无访问权限</div>
          <p className="mt-4 text-base leading-8 text-[var(--muted)]">该页面仅对 editor / admin 可见。</p>
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const done = params.done;
  const activeStatus = params.status || "all";

  let query = supabase
    .from("submissions")
    .select(`
      id,
      product_name,
      website_url,
      archive_url,
      evidence_links,
      status_guess,
      fact_summary,
      analysis_summary,
      review_status,
      created_at,
      note,
      submitter_id
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  if (activeStatus !== "all") {
    query = query.eq("review_status", activeStatus);
  }

  const { data: submissions } = await query;

  const { data: allStatuses } = await supabase.from("submissions").select("review_status");
  const counts = (allStatuses || []).reduce<Record<string, number>>((acc, item) => {
    const key = item.review_status || "pending";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const tabs = [
    { key: "all", label: "全部", count: allStatuses?.length || 0 },
    { key: "pending", label: "待审核", count: counts.pending || 0 },
    { key: "approved", label: "已通过", count: counts.approved || 0 },
    { key: "rejected", label: "已拒绝", count: counts.rejected || 0 },
    { key: "needs_more_info", label: "需补充", count: counts.needs_more_info || 0 },
  ];

  const statusLabelMap: Record<string, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    needs_more_info: "需补充",
  };

  const doneMap: Record<string, string> = {
    approved: "已标记通过",
    rejected: "已标记拒绝",
    needs_more_info: "已标记为需补充",
    draft_created: "已生成草稿",
    save_failed: "保存失败",
    draft_create_failed: "创建草稿失败",
    autopsy_seed_failed: "草稿尸检初始化失败",
    submission_not_found: "未找到该提交",
    missing_submission_id: "缺少提交 ID",
  };

  const existingDraftId = done?.startsWith("draft_exists:") ? done.split(":")[1] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">后台</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">提交审核</h1>
        </div>
        <div className="text-sm text-[var(--muted)]">当前身份：{profile.role}</div>
      </div>

      <AdminSubnav current="review-submissions" />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/review-submissions?status=${tab.key}`}
            className={tab.key === activeStatus ? "rounded-full border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-4 py-2 text-sm text-[var(--foreground)]" : "rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>

      {done ? (
        <div className="mb-6 rounded-2xl border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
          {existingDraftId ? (
            <span>
              该提交对应的草稿已存在。
              <Link href={`/drafts/${existingDraftId}`} className="ml-2 underline underline-offset-4">
                直接去草稿
              </Link>
            </span>
          ) : (
            doneMap[done] || done
          )}
        </div>
      ) : null}

      <div className="grid gap-4">
        {submissions?.length ? (
          submissions.map((item) => (
            <div key={item.id} className="panel rounded-[28px] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xl font-semibold text-[var(--foreground)]">{item.product_name}</div>
                <div className="text-sm text-[var(--muted)]">{statusLabelMap[item.review_status] || item.review_status}</div>
              </div>
              <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                <div>状态判断：{item.status_guess || "未填写"}</div>
                <div>提交人：{item.submitter_id || "未知"}</div>
                <div>官网：{item.website_url ? <a href={item.website_url} target="_blank" className="text-[var(--foreground)] underline underline-offset-4">打开</a> : "无"}</div>
                <div>归档：{item.archive_url ? <a href={item.archive_url} target="_blank" className="text-[var(--foreground)] underline underline-offset-4">打开</a> : "无"}</div>
                <div>事实摘要：{item.fact_summary || "无"}</div>
                <div>分析判断：{item.analysis_summary || "无"}</div>
                <div>说明：{item.note || "无"}</div>
                <div>证据数：{Array.isArray(item.evidence_links) ? item.evidence_links.length : 0}</div>
                <div>提交时间：{new Date(item.created_at).toLocaleString("zh-CN", { hour12: false })}</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {item.review_status === "approved" ? (
                  <>
                    <AdminActionLink href="/drafts" tone="secondary">去草稿工作台</AdminActionLink>
                    <span className="inline-flex items-center text-xs text-[var(--muted)]">已通过的提交如果已有草稿，会直接跳转提示。</span>
                  </>
                ) : null}
                <form action={createDraftFromSubmission}>
                  <input type="hidden" name="submission_id" value={item.id} />
                  <AdminActionButton tone="primary">通过并建草稿</AdminActionButton>
                </form>
                <form action={reviewSubmission}>
                  <input type="hidden" name="submission_id" value={item.id} />
                  <input type="hidden" name="review_status" value="approved" />
                  <AdminActionButton tone="secondary">仅标记通过</AdminActionButton>
                </form>
                <form action={reviewSubmission}>
                  <input type="hidden" name="submission_id" value={item.id} />
                  <input type="hidden" name="review_status" value="rejected" />
                  <AdminActionButton tone="danger">拒绝</AdminActionButton>
                </form>
                <form action={reviewSubmission}>
                  <input type="hidden" name="submission_id" value={item.id} />
                  <input type="hidden" name="review_status" value="needs_more_info" />
                  <AdminActionButton tone="secondary">需补充</AdminActionButton>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="panel rounded-[28px] p-8 text-sm text-[var(--muted)]">
            当前筛选条件下没有提交记录。当前筛选：{tabs.find((tab) => tab.key === activeStatus)?.label || activeStatus}。
            {activeStatus !== "all" && (allStatuses?.length || 0) > 0 ? (
              <Link href="/review-submissions" className="ml-2 text-[var(--foreground)] underline underline-offset-4">
                返回查看全部
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
