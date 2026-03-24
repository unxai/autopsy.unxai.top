import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AuthCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
      <div className="panel-strong rounded-[32px] p-10 shadow-soft">
        <div className="eyebrow text-xs text-[var(--accent-blue)]">auth result</div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">登录状态检查</h1>

        <div className="mt-8 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <div><span className="text-[var(--foreground)]">status：</span>{params.status ?? "unknown"}</div>
          <div><span className="text-[var(--foreground)]">error：</span>{params.error ?? "none"}</div>
          <div><span className="text-[var(--foreground)]">user：</span>{user ? (user.email ?? user.id) : "not logged in"}</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
            回首页
          </Link>
          <Link href="/submit" className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
            去提交案例
          </Link>
        </div>
      </div>
    </main>
  );
}
