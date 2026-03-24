import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminSubnav } from "@/components/admin-subnav";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export default async function DraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; autopsy?: string }>;
}) {
  const supabase = await createClient();
  const profile = await ensureProfile();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/");
  }

  const params = await searchParams;
  const activeState = params.state || "all";
  const activeAutopsy = params.autopsy || "all";

  let query = supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      tagline,
      summary,
      visible,
      updated_at,
      autopsies(status)
    `)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (activeState === "草稿") {
    query = query.eq("visible", false);
  }

  if (activeState === "已发布") {
    query = query.eq("visible", true);
  }

  const { data: draftRows } = await query;
  const { data: allProducts } = await supabase.from("products").select(`
    visible,
    autopsies(status)
  `);

  const total = allProducts?.length || 0;
  const 已发布Count = (allProducts || []).filter((item) => item.visible).length;
  const 草稿Count = total - 已发布Count;

  const tabs = [
    { key: "all", label: "全部", count: total },
    { key: "草稿", label: "草稿", count: 草稿Count },
    { key: "已发布", label: "已发布", count: 已发布Count },
  ];

  const autopsyCounts = (allProducts || []).reduce<Record<string, number>>((acc, item) => {
    const status = Array.isArray(item.autopsies) && item.autopsies[0] ? item.autopsies[0].status || "none" : "none";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const autopsyTabs = [
    { key: "all", label: "全部尸检", count: total },
    { key: "draft", label: "尸检草稿", count: autopsyCounts.draft || 0 },
    { key: "published", label: "尸检已发布", count: autopsyCounts.published || 0 },
    { key: "none", label: "无尸检", count: autopsyCounts.none || 0 },
  ];

  const drafts = (draftRows || []).filter((item) => {
    const autopsyStatus = Array.isArray(item.autopsies) && item.autopsies[0] ? item.autopsies[0].status || "none" : "none";
    return activeAutopsy === "all" ? true : autopsyStatus === activeAutopsy;
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">后台</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">草稿工作台</h1>
        </div>
      </div>

      <AdminSubnav current="drafts" />

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/drafts?state=${tab.key}${activeAutopsy !== "all" ? `&autopsy=${encodeURIComponent(activeAutopsy)}` : ""}`}
            className={tab.key === activeState ? "rounded-full border border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] px-4 py-2 text-sm text-[var(--foreground)]" : "rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {autopsyTabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/drafts?autopsy=${tab.key}${activeState !== "all" ? `&state=${encodeURIComponent(activeState)}` : ""}`}
            className={tab.key === activeAutopsy ? "rounded-full border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-4 py-2 text-sm text-[var(--foreground)]" : "rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]"}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>

      <div className="mb-4 text-sm text-[var(--muted)]">这里按前台发布状态和尸检内容状态双维度筛选，优先处理仍是草稿且尸检未完成的条目。</div>

      <div className="grid gap-4">
        {drafts?.length ? (
          drafts.map((item) => {
            const autopsyStatus = Array.isArray(item.autopsies) && item.autopsies[0] ? item.autopsies[0].status : "none";

            return (
              <div key={item.id} className="panel rounded-[28px] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-[var(--foreground)]">{item.name}</div>
                    <div className="mt-1 text-sm text-[var(--muted)]">/{item.slug}</div>
                  </div>
                  <div className="text-sm text-[var(--muted)]">
                    {item.visible ? "已发布" : "草稿"} · 尸检：{autopsyStatus}
                  </div>
                </div>
                <div className="mt-3 text-sm text-[var(--muted)]">{item.tagline || item.summary || "待补充摘要"}</div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <Link href={`/drafts/${item.id}`} className="text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
                    进入编辑 →
                  </Link>
                  {item.visible ? (
                    <Link href={`/cases/${item.id}`} className="text-[var(--muted)] transition hover:text-[var(--foreground)]">
                      查看前台 →
                    </Link>
                  ) : (
                    <span className="text-[var(--muted)]">未发布</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-[var(--muted)]">最后更新：{new Date(item.updated_at).toLocaleString("zh-CN", { hour12: false })}</div>
              </div>
            );
          })
        ) : (
          <div className="panel rounded-[28px] p-8 text-sm text-[var(--muted)]">
            当前筛选条件下没有记录。
            {(activeState !== "all" || activeAutopsy !== "all") ? (
              <Link href="/drafts" className="ml-2 text-[var(--foreground)] underline underline-offset-4">
                返回查看全部
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
