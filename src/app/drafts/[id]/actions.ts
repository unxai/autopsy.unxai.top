"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

async function requireEditor() {
  const profile = await ensureProfile();
  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/");
  }
  return profile;
}

export async function updateDraft(formData: FormData) {
  const supabase = await createClient();
  await requireEditor();

  const productId = String(formData.get("product_id") || "").trim();
  const autopsyId = String(formData.get("autopsy_id") || "").trim();
  const draftId = String(formData.get("draft_id") || productId).trim();

  const tagline = String(formData.get("tagline") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const websiteUrl = String(formData.get("website_url") || "").trim();
  const archiveUrl = String(formData.get("archive_url") || "").trim();

  const factSummary = String(formData.get("fact_summary") || "").trim();
  const factPoints = toLineList(formData.get("fact_points"));
  const analysisSummary = String(formData.get("analysis_summary") || "").trim();
  const analysisPoints = toLineList(formData.get("analysis_points"));
  const thesis = String(formData.get("thesis") || "").trim();
  const surfaceReasons = String(formData.get("surface_reasons") || "").trim();
  const rootCauses = String(formData.get("root_causes") || "").trim();
  const warningSigns = toLineList(formData.get("warning_signs"));
  const timelineEntries = parseTimelineEntries(formData.get("timeline_entries"));
  const sourceEntries = parseSourceEntries(formData.get("source_entries"));
  const lessons = String(formData.get("lessons") || "").trim();

  if (!productId || !draftId) {
    redirect("/drafts");
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
      tagline: tagline || null,
      summary: summary || null,
      description: description || null,
      website_url: websiteUrl || null,
      archive_url: archiveUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (productError) {
    redirect(`/drafts/${draftId}?done=product_save_failed`);
  }

  if (autopsyId) {
    const { error: autopsyError } = await supabase
      .from("autopsies")
      .update({
        fact_summary: factSummary || null,
        fact_points: factPoints,
        analysis_summary: analysisSummary || null,
        analysis_points: analysisPoints,
        thesis: thesis || null,
        surface_reasons: surfaceReasons || null,
        root_causes: rootCauses || null,
        warning_signs: JSON.stringify(warningSigns),
        lessons: lessons || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", autopsyId);

    if (autopsyError) {
      redirect(`/drafts/${draftId}?done=autopsy_save_failed`);
    }
  }

  const { error: deleteTimelineError } = await supabase.from("timelines").delete().eq("product_id", productId);
  if (deleteTimelineError) {
    redirect(`/drafts/${draftId}?done=timeline_save_failed`);
  }

  if (timelineEntries.length) {
    const { error: timelineError } = await supabase.from("timelines").insert(
      timelineEntries.map((entry, index) => ({
        product_id: Number(productId),
        event_date: entry.eventDate,
        event_type: "milestone",
        title: entry.title,
        description: entry.description,
        sort_order: index,
      })),
    );

    if (timelineError) {
      redirect(`/drafts/${draftId}?done=timeline_save_failed`);
    }
  }

  const { error: deleteSourceError } = await supabase.from("sources").delete().eq("product_id", productId);
  if (deleteSourceError) {
    redirect(`/drafts/${draftId}?done=source_save_failed`);
  }

  if (sourceEntries.length) {
    const { error: sourceError } = await supabase.from("sources").insert(
      sourceEntries.map((entry) => ({
        product_id: Number(productId),
        title: entry.title,
        url: entry.url || null,
        source_type: entry.sourceType || null,
        publisher: entry.publisher || null,
        published_at: entry.publishedAt || null,
        note: entry.note || null,
      })),
    );

    if (sourceError) {
      redirect(`/drafts/${draftId}?done=source_save_failed`);
    }
  }

  redirect(`/drafts/${draftId}?done=saved`);
}

export async function publishDraft(formData: FormData) {
  const supabase = await createClient();
  await requireEditor();

  const productId = String(formData.get("product_id") || "").trim();
  const autopsyId = String(formData.get("autopsy_id") || "").trim();
  const draftId = String(formData.get("draft_id") || productId).trim();

  if (!productId || !draftId) {
    redirect("/drafts");
  }

  const { error: productError } = await supabase
    .from("products")
    .update({ visible: true, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (productError) {
    redirect(`/drafts/${draftId}?done=publish_failed`);
  }

  if (autopsyId) {
    await supabase.from("autopsies").update({ status: "published", updated_at: new Date().toISOString() }).eq("id", autopsyId);
  }

  redirect(`/drafts/${draftId}?done=published`);
}

function toLineList(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTimelineEntries(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [eventDateRaw, titleRaw, ...descriptionParts] = line.split("|").map((item) => item.trim());
      return {
        eventDate: normalizeDate(eventDateRaw),
        title: titleRaw || "待补充标题",
        description: descriptionParts.join(" | ") || null,
      };
    })
    .filter((entry) => entry.title);
}

function parseSourceEntries(value: FormDataEntryValue | null) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [titleRaw, urlRaw, sourceTypeRaw, publisherRaw, publishedAtRaw, ...noteParts] = line.split("|").map((item) => item.trim());
      return {
        title: titleRaw || "待补充标题",
        url: urlRaw || null,
        sourceType: sourceTypeRaw || null,
        publisher: publisherRaw || null,
        publishedAt: normalizeDate(publishedAtRaw),
        note: noteParts.join(" | ") || null,
      };
    })
    .filter((entry) => entry.title);
}

function normalizeDate(value: string) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`;
  if (/^\d{4}$/.test(value)) return `${value}-01-01`;
  return null;
}

export async function unpublishDraft(formData: FormData) {
  const supabase = await createClient();
  await requireEditor();

  const productId = String(formData.get("product_id") || "").trim();
  const autopsyId = String(formData.get("autopsy_id") || "").trim();
  const draftId = String(formData.get("draft_id") || productId).trim();

  if (!productId || !draftId) {
    redirect("/drafts");
  }

  const { error: productError } = await supabase
    .from("products")
    .update({ visible: false, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (productError) {
    redirect(`/drafts/${draftId}?done=unpublish_failed`);
  }

  if (autopsyId) {
    await supabase.from("autopsies").update({ status: "draft", updated_at: new Date().toISOString() }).eq("id", autopsyId);
  }

  redirect(`/drafts/${draftId}?done=unpublished`);
}
