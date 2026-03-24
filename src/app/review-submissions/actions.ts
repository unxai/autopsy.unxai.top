"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export async function reviewSubmission(formData: FormData) {
  const supabase = await createClient();
  const profile = await ensureProfile();

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/");
  }

  const submissionId = String(formData.get("submission_id") || "").trim();
  const reviewStatus = String(formData.get("review_status") || "").trim();

  if (!submissionId || !reviewStatus) {
    redirect("/review-submissions");
  }

  const { error } = await supabase
    .from("submissions")
    .update({ review_status: reviewStatus })
    .eq("id", submissionId);

  if (error) {
    redirect("/review-submissions?done=save_failed");
  }

  redirect(`/review-submissions?done=${encodeURIComponent(reviewStatus)}`);
}

export async function createDraftFromSubmission(formData: FormData) {
  const supabase = await createClient();
  const profile = await ensureProfile();

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/");
  }

  const submissionId = String(formData.get("submission_id") || "").trim();
  if (!submissionId) {
    redirect("/review-submissions?done=missing_submission_id");
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("id, product_name, website_url, archive_url, status_guess, fact_summary, analysis_summary, note")
    .eq("id", submissionId)
    .maybeSingle();

  if (!submission) {
    redirect("/review-submissions?done=submission_not_found");
  }

  const slug = submission.product_name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const { data: statuses } = await supabase.from("product_statuses").select("id, label");
  const fallbackStatus = statuses?.find((item) => item.label === "停更") || statuses?.[0];
  const matchedStatus = statuses?.find((item) => item.label === submission.status_guess);
  const statusId = matchedStatus?.id || fallbackStatus?.id;

  const { data: firstCategory } = await supabase.from("categories").select("id").limit(1).maybeSingle();

  const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
  let productId = existing?.id;

  if (productId) {
    await supabase.from("submissions").update({ review_status: "approved" }).eq("id", submissionId);
    redirect(`/review-submissions?done=${encodeURIComponent(`draft_exists:${productId}`)}`);
  }

  if (!productId) {
    const { data: created, error: createError } = await supabase
      .from("products")
      .insert({
        slug,
        name: submission.product_name,
        tagline: submission.note || "待补充 tagline",
        description: submission.note || null,
        website_url: submission.website_url || null,
        archive_url: submission.archive_url || null,
        category_id: firstCategory?.id || null,
        status_id: statusId || null,
        summary: submission.note || null,
        visible: false,
      })
      .select("id")
      .single();

    if (createError) {
      redirect(`/review-submissions?done=${encodeURIComponent("draft_create_failed")}`);
    }

    productId = created.id;
  }

  const seedFactSummary = submission.fact_summary || submission.note || "待补充事实摘要";
  const seedAnalysisSummary = submission.analysis_summary || submission.note || "待补充分析判断";

  await supabase.from("sources").delete().eq("product_id", productId);

  const initialSources = [
    submission.website_url
      ? {
          product_id: productId,
          title: `${submission.product_name} 官网`,
          url: submission.website_url,
          source_type: "官网",
          publisher: submission.product_name,
          published_at: null,
          note: "由提交表单带入",
        }
      : null,
    submission.archive_url
      ? {
          product_id: productId,
          title: `${submission.product_name} 归档 / 停运说明`,
          url: submission.archive_url,
          source_type: "归档",
          publisher: submission.product_name,
          published_at: null,
          note: "由提交表单带入",
        }
      : null,
  ].filter(Boolean);

  if (initialSources.length) {
    await supabase.from("sources").insert(initialSources);
  }

  const { error: autopsyError } = await supabase.from("autopsies").upsert({
    product_id: productId,
    fact_summary: seedFactSummary,
    analysis_summary: seedAnalysisSummary,
    fact_points: [],
    analysis_points: [],
    thesis: submission.note || "待补充结论",
    surface_reasons: submission.status_guess || null,
    root_causes: submission.note || null,
    warning_signs: JSON.stringify([]),
    lessons: submission.note || null,
    confidence_level: "low",
    status: "draft",
  });

  if (autopsyError) {
    redirect(`/review-submissions?done=${encodeURIComponent("autopsy_seed_failed")}`);
  }

  await supabase.from("submissions").update({ review_status: "approved" }).eq("id", submissionId);

  redirect(`/drafts/${productId}?done=${encodeURIComponent("saved")}`);
}
