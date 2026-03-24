import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GitHubLoginButton } from "@/components/github-login-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/");
  }

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <div className="panel-strong rounded-[32px] p-10 shadow-soft">
        <div className="eyebrow text-xs text-[var(--accent-blue)]">github auth</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">登录 AI 产品尸检馆</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">下一阶段会基于 GitHub 登录开放提交案例、收藏和评论。当前先接通最小登录链路。</p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
            登录失败：{error}
          </div>
        ) : null}

        <div className="mt-8">
          <GitHubLoginButton />
        </div>
      </div>
    </main>
  );
}
