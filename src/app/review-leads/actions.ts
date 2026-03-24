"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

async function requireEditor() {
  const profile = await ensureProfile();
  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/");
  }
}

export async function updateLeadStatus(formData: FormData) {
  const supabase = await createClient();
  await requireEditor();

  const leadId = String(formData.get("lead_id") || "").trim();
  const leadStatus = String(formData.get("lead_status") || "").trim();

  if (!leadId || !leadStatus) {
    redirect("/review-leads?done=missing_params");
  }

  const { error } = await supabase.from("leads").update({ lead_status: leadStatus }).eq("id", leadId);
  if (error) {
    redirect("/review-leads?done=save_failed");
  }

  redirect(`/review-leads?done=${encodeURIComponent(leadStatus)}`);
}

export async function convertLeadToSubmission(formData: FormData) {
  const supabase = await createClient();
  await requireEditor();

  const leadId = String(formData.get("lead_id") || "").trim();
  if (!leadId) {
    redirect("/review-leads?done=missing_lead_id");
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("id, title, source_url, source_site, summary, candidate_product_name, matched_keywords, lead_status")
    .eq("id", leadId)
    .maybeSingle();

  if (!lead) {
    redirect("/review-leads?done=lead_not_found");
  }

  if (lead.lead_status === "converted") {
    redirect("/review-leads?done=converted");
  }

  const productName = lead.candidate_product_name || lead.title;
  const sourceNote = `线索来源：${lead.source_site || "未知来源"}`;
  const keywordNote = Array.isArray(lead.matched_keywords) && lead.matched_keywords.length ? `命中关键词：${lead.matched_keywords.join(" / ")}` : null;
  const factSummary = lead.summary || sourceNote;
  const analysisSummary = `这是一条待人工判断的线索，当前仅根据来源标题和摘要初步收录，尚未完成失败原因分析。`;
  const note = [sourceNote, keywordNote, lead.title ? `原始标题：${lead.title}` : null, lead.summary || null]
    .filter(Boolean)
    .join("\n\n");

  const { data: existingSubmission } = await supabase
    .from("submissions")
    .select("id")
    .eq("product_name", productName)
    .eq("archive_url", lead.source_url)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSubmission?.id) {
    await supabase.from("leads").update({ lead_status: "converted" }).eq("id", leadId);
    redirect("/review-leads?done=converted");
  }

  const { error: submissionError } = await supabase.from("submissions").insert({
    product_name: productName,
    archive_url: lead.source_url,
    fact_summary: factSummary,
    analysis_summary: analysisSummary,
    note,
    review_status: "pending",
    status_guess: null,
    evidence_links: [lead.source_url],
  });

  if (submissionError) {
    redirect("/review-leads?done=convert_failed");
  }

  await supabase.from("leads").update({ lead_status: "converted" }).eq("id", leadId);
  redirect("/review-leads?done=converted");
}
