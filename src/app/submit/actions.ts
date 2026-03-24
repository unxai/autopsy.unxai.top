"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createSubmission(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  const formStartedAt = Number(formData.get("form_started_at") || 0);
  const honeypot = String(formData.get("company") || "").trim();
  const productName = String(formData.get("product_name") || "").trim();
  const websiteUrl = String(formData.get("website_url") || "").trim();
  const archiveUrl = String(formData.get("archive_url") || "").trim();
  const statusGuess = String(formData.get("status_guess") || "").trim();
  const factSummary = String(formData.get("fact_summary") || "").trim();
  const analysisSummary = String(formData.get("analysis_summary") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (honeypot) {
    redirect("/submit?error=invalid_submission");
  }

  if (!formStartedAt || Date.now() - formStartedAt < 2500) {
    redirect("/submit?error=too_fast");
  }

  if (!productName) {
    redirect("/submit?error=missing_name");
  }

  if (!statusGuess) {
    redirect("/submit?error=missing_status");
  }

  if (!factSummary) {
    redirect("/submit?error=missing_fact_summary");
  }

  if (!analysisSummary) {
    redirect("/submit?error=missing_analysis_summary");
  }

  const isValidUrl = (value: string) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!isValidUrl(websiteUrl) || !isValidUrl(archiveUrl)) {
    redirect("/submit?error=invalid_url");
  }

  const evidenceLinks = [websiteUrl, archiveUrl].filter(Boolean);

  const recentCutoff = new Date(Date.now() - 30 * 1000).toISOString();
  const { data: recentByUser } = await supabase
    .from("submissions")
    .select("id")
    .eq("submitter_id", user.id)
    .gte("created_at", recentCutoff)
    .limit(1);

  if ((recentByUser?.length || 0) >= 1) {
    redirect("/submit?error=rate_limited");
  }

  const { data: existingRecent } = await supabase
    .from("submissions")
    .select("id")
    .eq("submitter_id", user.id)
    .eq("product_name", productName)
    .eq("website_url", websiteUrl || null)
    .eq("archive_url", archiveUrl || null)
    .eq("status_guess", statusGuess || null)
    .eq("fact_summary", factSummary || null)
    .eq("analysis_summary", analysisSummary || null)
    .eq("note", note || null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingRecent?.id) {
    redirect("/my-submissions?success=1");
  }

  const { error } = await supabase.from("submissions").insert({
    submitter_id: user.id,
    product_name: productName,
    website_url: websiteUrl || null,
    archive_url: archiveUrl || null,
    status_guess: statusGuess || null,
    fact_summary: factSummary || null,
    analysis_summary: analysisSummary || null,
    note: note || null,
    evidence_links: evidenceLinks,
  });

  if (error) {
    redirect("/submit?error=save_failed");
  }

  redirect("/my-submissions?success=1");
}
