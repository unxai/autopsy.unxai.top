import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export default async function MySubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const supabase = await createClient();
  await ensureProfile();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const success = params.success === "1";

  const { data: submissions } = await supabase
    .from("submissions")
    .select("id, product_name, website_url, archive_url, status_guess, fact_summary, analysis_summary, review_status, created_at, note")
    .eq("submitter_id", user.id)
    .order("created_at", { ascending: false });

  const statusMap: Record<string, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    needs_more_info: "需补充",
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">my submissions</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">我的提交</h1>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/submit" className="transition hover:text-[var(--foreground)]">
            继续提交
          </Link>
          <Link href="/cases" className="transition hover:text-[var(--foreground)]">
            浏览案例库
          </Link>
        </div>
      </div>

      {success ? (
        <div className="mb-6 rounded-2xl border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
          提交成功，已进入审核队列。
        </div>
      ) : null}

      <div className="mb-6 text-sm text-[var(--muted)]">这里会显示你提交过的案例、当前审核状态，以及你当时附带的基本信息。</div>

      <div className="panel rounded-[32px] p-6">
        <div className="grid gap-3">
          {submissions?.length ? (
            submissions.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--line)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-lg font-medium text-[var(--foreground)]">{item.product_name}</div>
                  <div className="text-sm text-[var(--muted)]">{statusMap[item.review_status] || item.review_status}</div>
                </div>
                <div className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  <div>状态判断：{item.status_guess || "未填写"}</div>
                  <div>官网：{item.website_url || "无"}</div>
                  <div>归档：{item.archive_url || "无"}</div>
                  <div>事实摘要：{item.fact_summary || "无"}</div>
                  <div>分析判断：{item.analysis_summary || "无"}</div>
                  <div>补充说明：{item.note || "无"}</div>
                </div>
                <div className="mt-2 text-xs text-[var(--muted)]">提交时间：{new Date(item.created_at).toLocaleString("zh-CN", { hour12: false })}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-[var(--muted)]">
              你还没有提交过案例。<Link href="/submit" className="ml-2 text-[var(--foreground)] underline underline-offset-4">去提交</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
