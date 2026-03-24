import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminActionButton, AdminActionLink } from "@/components/admin-action";
import { AdminSubnav } from "@/components/admin-subnav";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { SourceEditor, TimelineEditor } from "@/components/structured-list-editor";
import { publishDraft, unpublishDraft, updateDraft } from "./actions";

export default async function DraftDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const { id } = await params;
  const qs = await searchParams;
  const productId = Number(id);
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

  if (!Number.isFinite(productId)) {
    redirect("/drafts");
  }

  const { data: product } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      tagline,
      description,
      summary,
      website_url,
      archive_url,
      visible,
      updated_at,
      autopsies(id, thesis, fact_summary, analysis_summary, fact_points, analysis_points, surface_reasons, root_causes, warning_signs, lessons, confidence_level, status),
      timelines(id, event_date, title, description, sort_order),
      sources(id, title, url, source_type, publisher, published_at, note)
    `)
    .eq("id", productId)
    .order("sort_order", { foreignTable: "timelines", ascending: true })
    .order("published_at", { foreignTable: "sources", ascending: false })
    .maybeSingle();

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="panel rounded-[32px] p-10 text-center">
          <div className="text-3xl font-semibold tracking-[-0.04em]">草稿不存在</div>
          <div className="mt-6">
            <Link href="/drafts" className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--foreground)] transition hover:text-[var(--accent-rust)]">
              返回草稿工作台
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const autopsy = Array.isArray(product.autopsies) ? product.autopsies[0] : null;

  const doneMap: Record<string, string> = {
    saved: "草稿已保存",
    published: "已发布到前台",
    unpublished: "已撤回为草稿",
    product_save_failed: "产品草稿保存失败",
    autopsy_save_failed: "尸检草稿保存失败",
    publish_failed: "发布失败",
    unpublish_failed: "撤回发布失败",
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow text-xs text-[var(--accent-blue)]">后台</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">{product.name}</h1>
          <p className="mt-3 text-base leading-8 text-[var(--muted)]">{product.tagline || "待补充一句话简介"}</p>
        </div>
        <Link href="/drafts" className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
          返回草稿工作台
        </Link>
      </div>

      <AdminSubnav current="drafts" />

      {qs.done ? (
        <div className="mb-6 rounded-2xl border border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] px-5 py-4 text-sm text-[var(--foreground)]">
          {doneMap[qs.done] || qs.done}
          {qs.done === "published" ? (
            <span className="ml-3 inline-flex gap-3">
              <Link href={`/cases/${product.id}`} className="underline underline-offset-4">
                立即查看前台
              </Link>
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form action={updateDraft} className="space-y-6">
          <input type="hidden" name="product_id" value={product.id} />
          <input type="hidden" name="autopsy_id" value={autopsy?.id || ""} />
          <input type="hidden" name="draft_id" value={product.id} />

          <div className="panel rounded-[28px] p-6">
            <div className="eyebrow text-xs text-[var(--accent-blue)]">产品信息</div>
            <div className="mt-5 grid gap-4">
              <Field name="tagline" label="一句话简介" defaultValue={product.tagline || ""} />
              <Field name="website_url" label="官网链接" defaultValue={product.website_url || ""} />
              <Field name="archive_url" label="归档 / 停运说明链接" defaultValue={product.archive_url || ""} />
              <Area name="summary" label="案例摘要" defaultValue={product.summary || ""} rows={4} />
              <Area name="description" label="补充描述" defaultValue={product.description || ""} rows={6} />
            </div>
          </div>

          <div className="panel rounded-[28px] p-6">
            <div className="eyebrow text-xs text-[var(--accent-rust)]">尸检内容</div>
            <div className="mt-5 grid gap-4">
              <Area name="fact_summary" label="事实摘要" defaultValue={autopsy?.fact_summary || ""} rows={4} />
              <Area name="fact_points" label="事实要点（每行一条）" defaultValue={toMultilineList(autopsy?.fact_points)} rows={5} />
              <Area name="analysis_summary" label="分析摘要" defaultValue={autopsy?.analysis_summary || ""} rows={4} />
              <Area name="analysis_points" label="分析要点（每行一条）" defaultValue={toMultilineList(autopsy?.analysis_points)} rows={5} />
              <Area name="thesis" label="一句话结论" defaultValue={autopsy?.thesis || ""} rows={3} />
              <Area name="surface_reasons" label="表层原因" defaultValue={autopsy?.surface_reasons || ""} rows={4} />
              <Area name="root_causes" label="深层原因" defaultValue={autopsy?.root_causes || ""} rows={4} />
              <Area name="warning_signs" label="预警信号（每行一条）" defaultValue={toMultilineList(parseJsonList(autopsy?.warning_signs))} rows={4} />
              <Area name="lessons" label="可复用教训" defaultValue={autopsy?.lessons || ""} rows={4} />
            </div>
          </div>

          <div className="panel rounded-[28px] p-6">
            <div className="eyebrow text-xs text-[var(--accent-blue)]">时间线</div>
            <div className="mt-3 text-sm text-[var(--muted)]">改成分条编辑，减少手动写分隔符出错。</div>
            <div className="mt-5 grid gap-4">
              <TimelineEditor name="timeline_entries" initialValue={toTimelineLines(product.timelines)} />
            </div>
          </div>

          <div className="panel rounded-[28px] p-6">
            <div className="eyebrow text-xs text-[var(--accent-gold)]">证据来源</div>
            <div className="mt-3 text-sm text-[var(--muted)]">来源改成逐条填写，保留原有保存格式兼容。</div>
            <div className="mt-5 grid gap-4">
              <SourceEditor name="source_entries" initialValue={toSourceLines(product.sources)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <AdminActionButton tone="secondary">保存草稿</AdminActionButton>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="panel rounded-[28px] p-6">
            <div className="eyebrow text-xs text-[var(--accent-gold)]">发布</div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
              <p>先保存内容，再决定是否发布到前台。</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {product.visible ? (
                <form action={unpublishDraft}>
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="autopsy_id" value={autopsy?.id || ""} />
                  <input type="hidden" name="draft_id" value={product.id} />
                  <AdminActionButton tone="danger">撤回发布</AdminActionButton>
                </form>
              ) : (
                <form action={publishDraft}>
                  <input type="hidden" name="product_id" value={product.id} />
                  <input type="hidden" name="autopsy_id" value={autopsy?.id || ""} />
                  <input type="hidden" name="draft_id" value={product.id} />
                  <AdminActionButton tone="primary">发布到前台</AdminActionButton>
                </form>
              )}
              {product.visible ? (
                <AdminActionLink href={`/cases/${product.id}`} tone="secondary">预览前台</AdminActionLink>
              ) : null}
            </div>
          </div>

          <div className="panel rounded-[28px] p-6 text-sm text-[var(--muted)]">
            <div>前台状态：{product.visible ? "已发布" : "草稿"}</div>
            <div className="mt-2">内容状态：{autopsy?.status || "none"}</div>
            <div className="mt-2">最后更新：{new Date(product.updated_at).toLocaleString("zh-CN", { hour12: false })}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <input name={name} defaultValue={defaultValue} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none" />
    </label>
  );
}

function Area({ name, label, defaultValue, rows }: { name: string; label: string; defaultValue: string; rows: number }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={rows} className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--foreground)] outline-none" />
    </label>
  );
}

function toMultilineList(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value.map((item) => String(item ?? "").trim()).filter(Boolean).join("\n");
}

function parseJsonList(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toTimelineLines(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return [row.event_date || "", row.title || "", row.description || ""].map((part) => String(part ?? "").trim()).join(" | ");
    })
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");
}

function toSourceLines(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return [row.title || "", row.url || "", row.source_type || "", row.publisher || "", row.published_at || "", row.note || ""]
        .map((part) => String(part ?? "").trim())
        .join(" | ");
    })
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");
}
