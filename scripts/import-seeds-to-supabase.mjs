import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { caseSeeds } from "../src/data/case-seeds.ts";

dotenv.config({ path: path.resolve(".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const categorySlugMap = {
  "硬件 / 助手": "hardware-assistant",
  "硬件 / Agent": "hardware-agent",
  "聊天 / 助手": "chat-assistant",
  "资讯 / 推荐": "news-recommendation",
  "社交 / 角色": "social-roleplay",
  "写作 / SaaS": "writing-saas",
};

const statusKeyMap = {
  closed: "closed",
  inactive: "inactive",
  pivoted: "pivoted",
  zombie: "zombie",
};

const tagSlugMap = {
  "PMF 不成立": "pmf-failed",
  "交互成本高": "high-interaction-cost",
  "叙事大于日用价值": "narrative-over-value",
  "战略转向": "strategy-pivot",
  "成本压力": "cost-pressure",
  "产品与公司目标错位": "product-company-mismatch",
  "入口弱势": "weak-entry-point",
  "留存压力": "retention-pressure",
  "不可替代性不足": "insufficient-irreplaceability",
  "Agent 兑现不足": "agent-not-delivered",
  "过度承诺": "overpromise",
  "高期望反噬": "expectation-backfire",
  "单点体验过强": "single-experience-too-strong",
  "扩展失败": "expansion-failed",
  "平台化受阻": "platformization-blocked",
  "套壳脆弱": "wrapper-fragility",
  "被基础模型吞掉": "absorbed-by-foundation-model",
  "获客困难": "acquisition-hard",
};

function safeDate(input) {
  if (!input || input === "待补充") return null;
  if (/^\d{4}-\d{2}$/.test(input)) return `${input}-01`;
  if (/^\d{4}$/.test(input)) return `${input}-01-01`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  return null;
}

async function getMap(table, keyField = "slug") {
  const { data, error } = await supabase.from(table).select(`id, ${keyField}`);
  if (error) throw error;
  return new Map(data.map((item) => [item[keyField], item.id]));
}

async function main() {
  const categoryMap = await getMap("categories");
  const statusMap = await getMap("product_statuses", "key");
  const tagMap = await getMap("failure_tags");

  for (const item of caseSeeds) {
    const categoryId = categoryMap.get(categorySlugMap[item.category]);
    const statusId = statusMap.get(statusKeyMap[item.status]);

    if (!categoryId || !statusId) {
      throw new Error(`Missing category/status mapping for ${item.slug}`);
    }

    const { data: existingProduct, error: productLookupError } = await supabase
      .from("products")
      .select("id")
      .eq("slug", item.slug)
      .maybeSingle();

    if (productLookupError) throw productLookupError;

    let productId = existingProduct?.id;

    const productPayload = {
      slug: item.slug,
      name: item.name,
      tagline: item.tagline,
      description: item.summary,
      category_id: categoryId,
      status_id: statusId,
      summary: item.summary,
      visible: true,
      updated_at: new Date().toISOString(),
    };

    if (!productId) {
      const { data: created, error: createError } = await supabase.from("products").insert(productPayload).select("id").single();
      if (createError) throw createError;
      productId = created.id;
    } else {
      const { error: updateError } = await supabase.from("products").update(productPayload).eq("id", productId);
      if (updateError) throw updateError;
    }

    const { data: existingAutopsy, error: autopsyLookupError } = await supabase
      .from("autopsies")
      .select("id")
      .eq("product_id", productId)
      .maybeSingle();
    if (autopsyLookupError) throw autopsyLookupError;

    const autopsyPayload = {
      product_id: productId,
      fact_summary: item.factSummary,
      analysis_summary: item.analysisSummary,
      fact_points: item.factPoints,
      analysis_points: item.analysisPoints,
      thesis: item.thesis,
      surface_reasons: item.signal,
      root_causes: item.rootCause,
      warning_signs: JSON.stringify(item.warningSigns),
      lessons: item.summary,
      confidence_level: "medium",
      status: "published",
      updated_at: new Date().toISOString(),
    };

    if (!existingAutopsy?.id) {
      const { error } = await supabase.from("autopsies").insert(autopsyPayload);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("autopsies").update(autopsyPayload).eq("id", existingAutopsy.id);
      if (error) throw error;
    }

    await supabase.from("timelines").delete().eq("product_id", productId);
    if (item.timeline.length) {
      const rows = item.timeline.map((entry, idx) => ({
        product_id: productId,
        event_date: safeDate(entry.date),
        event_type: "milestone",
        title: entry.title,
        description: entry.note,
        sort_order: idx,
      }));
      const { error } = await supabase.from("timelines").insert(rows);
      if (error) throw error;
    }

    await supabase.from("sources").delete().eq("product_id", productId);
    if (item.sources.length) {
      const rows = item.sources.map((source) => ({
        product_id: productId,
        title: source.title,
        source_type: source.type,
        publisher: source.publisher,
        published_at: safeDate(source.date),
        note: source.date,
      }));
      const { error } = await supabase.from("sources").insert(rows);
      if (error) throw error;
    }

    await supabase.from("product_failure_tags").delete().eq("product_id", productId);
    const tagIds = item.tags.map((tag) => tagMap.get(tagSlugMap[tag])).filter(Boolean);
    if (tagIds.length) {
      const rows = tagIds.map((failure_tag_id) => ({ product_id: productId, failure_tag_id }));
      const { error } = await supabase.from("product_failure_tags").insert(rows);
      if (error) throw error;
    }

    console.log(`Imported ${item.slug}`);
  }

  const { data, error } = await supabase.from("case_library").select("slug,name,status_label,category_name").limit(20);
  if (error) throw error;

  console.log("\ncase_library preview:");
  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
