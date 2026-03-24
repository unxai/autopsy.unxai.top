import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { createSubmission } from "./actions";

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const success = params.success === "1";
  const error = params.error;
  const errorMap: Record<string, string> = {
    missing_name: "请填写产品名称",
    missing_status: "请选择你判断的结局",
    missing_fact_summary: "请填写事实摘要",
    missing_analysis_summary: "请填写分析判断",
    invalid_url: "链接格式不正确，请使用 http 或 https",
    invalid_submission: "提交未通过校验",
    too_fast: "提交过快，请稍后再试",
    rate_limited: "提交过于频繁，请 30 秒后再试",
    save_failed: "保存失败，请稍后重试",
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <div className="mb-8">
        <div className="eyebrow text-xs text-[var(--accent-blue)]">submit a case</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">提交案例</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">提交会先进入审核队列。请尽量把公开事实和你的分析判断分开填写，减少混写。为防止滥用，单账号 30 秒内只允许提交 1 次。</p>
      </div>

      {success ? (
        <div className="mb-6 rounded-2xl border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
          提交成功，已进入待审核队列。
        </div>
      ) : null}

      {error ? (
        <div className="mb-6 rounded-2xl border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
          提交失败：{errorMap[error] || error}
        </div>
      ) : null}

      <div className="panel-strong rounded-[32px] p-8 shadow-soft">
        <form action={createSubmission} className="grid gap-6">
          <input type="hidden" name="form_started_at" value={Date.now()} />
          <div className="hidden" aria-hidden="true">
            <label>
              留空
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <Field name="product_name" label="产品名称" placeholder="例如：某个 AI 产品名" required />
          <Field name="website_url" label="官网链接" placeholder="https://..." />
          <Field name="archive_url" label="归档链接 / 停运说明" placeholder="https://..." />
          <StatusSelect />
          <Area name="fact_summary" label="事实摘要" placeholder="只写公开可核对的信息：发生了什么、何时发生、有哪些明确迹象。" required />
          <Area name="analysis_summary" label="分析判断" placeholder="再写你的判断：你认为它为什么失败、转型或停更。" required />
          <Area name="note" label="补充说明" placeholder="其他补充，例如争议点、背景信息、暂时无法归类的线索。" />

          <div className="flex flex-wrap gap-4 pt-2">
            <SubmitButton />
            <Link href="/cases" className="rounded-full border border-[var(--line)] px-6 py-3 text-sm text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
              返回案例库
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <input name={name} required={required} placeholder={placeholder} type={name.includes("url") ? "url" : "text"} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
    </label>
  );
}

function StatusSelect() {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">你判断的结局</span>
      <select name="status_guess" required defaultValue="" className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none">
        <option value="">请选择</option>
        <option value="已关闭">已关闭</option>
        <option value="停更">停更</option>
        <option value="转型">转型</option>
        <option value="名存实亡">名存实亡</option>
      </select>
    </label>
  );
}

function Area({ name, label, placeholder, required = false }: { name: string; label: string; placeholder: string; required?: boolean }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <textarea name={name} required={required} placeholder={placeholder} rows={6} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]" />
    </label>
  );
}
