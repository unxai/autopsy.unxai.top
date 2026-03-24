#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv();

const root = process.cwd();
const configPath = path.join(root, "config", "lead-sources.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const keywordMatchers = ["shutdown", "shutting down", "sunset", "sunsetting", "discontinued", "discontinue", "layoff", "停运", "停更", "下线", "关闭", "停止服务", "cease operations", "winding down"];
const blockedTitleMatchers = [
  /融资/i,
  /funding/i,
  /raises?\b/i,
  /launch(es|ed)?\b/i,
  /announce(s|d)?\b/i,
  /release(s|d)?\b/i,
  /feature(s|d)?\b/i,
  /update(s|d)?\b/i,
  /benchmark/i,
  /leaderboard/i,
  /api/i,
  /model/i,
  /newsletter/i,
];
const stopwords = new Set(["AI", "The", "A", "An", "And", "Of", "For", "To", "In", "On", "App", "Tool", "Startup", "Product"]);

function stripCdata(text = "") {
  return text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1").trim();
}

function decodeXml(text = "") {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pick(tag, input) {
  const match = input.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(stripCdata(match[1]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()) : "";
}

function parseItems(xml) {
  const items = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => {
    const raw = match[0];
    return {
      title: pick("title", raw),
      link: pick("link", raw),
      summary: pick("description", raw),
    };
  });

  const entries = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => {
    const raw = match[0];
    const linkMatch = raw.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
    return {
      title: pick("title", raw),
      link: linkMatch?.[1] || "",
      summary: pick("summary", raw) || pick("content", raw),
    };
  });

  return [...items, ...entries];
}

function matchedKeywords(text) {
  const lower = text.toLowerCase();
  return keywordMatchers.filter((word) => lower.includes(word.toLowerCase()));
}

function normalizeUrl(input = "") {
  try {
    const url = new URL(input);
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref|source|fbclid|gclid)/i.test(key)) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return input.trim();
  }
}

function shouldSkipItem(item, feed = {}) {
  const title = `${item.title || ""}`.trim();
  const summary = `${item.summary || ""}`.trim();
  const lowerHaystack = `${title}\n${summary}`.toLowerCase();
  const hasHardSignal = keywordMatchers.some((word) => lowerHaystack.includes(word.toLowerCase()));
  const requireTitlePatterns = Array.isArray(feed.requireTitlePatterns) ? feed.requireTitlePatterns : [];
  const blockedTitlePatterns = Array.isArray(feed.blockedTitlePatterns) ? feed.blockedTitlePatterns : [];

  if (!title || !item.link) return true;
  if (title.length < 8) return true;
  if (!hasHardSignal) return true;
  if (blockedTitleMatchers.some((pattern) => pattern.test(title) && !hasHardSignal)) {
    return true;
  }
  if (blockedTitlePatterns.some((pattern) => title.toLowerCase().includes(String(pattern).toLowerCase()))) {
    return true;
  }
  if (requireTitlePatterns.length && !requireTitlePatterns.some((pattern) => title.toLowerCase().includes(String(pattern).toLowerCase()))) {
    return true;
  }
  if (/openai|google|microsoft|meta|anthropic/i.test(title) && !/(shutdown|sunset|discontinued|shutting down|停运|停更|下线|关闭|停止服务)/i.test(title)) {
    return true;
  }
  return false;
}

function extractCandidateProductName(title = "") {
  const clean = title
    .replace(/[:：｜|\-–—].*$/, "")
    .replace(/\b(shutdown|sunset|discontinued|layoff|停运|停更|下线|关闭)\b.*$/i, "")
    .trim();

  const tokens = clean.split(/\s+/).filter(Boolean);
  const picked = tokens.filter((token) => /^[A-Za-z0-9.+_-]{2,}$/.test(token) && !stopwords.has(token));
  return (picked.slice(0, 4).join(" ") || clean).slice(0, 120);
}

async function main() {
  const config = JSON.parse(await fs.readFile(configPath, "utf8"));
  const results = [];

  for (const feed of config.feeds || []) {
    try {
      const response = await fetch(feed.url, {
        headers: {
          "user-agent": "autopsy-lead-bot/0.1",
          accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        },
      });

      if (!response.ok) continue;
      const xml = await response.text();
      const items = parseItems(xml);

      for (const item of items) {
        if (shouldSkipItem(item, feed)) continue;

        const normalizedUrl = normalizeUrl(item.link);
        const haystack = `${item.title}\n${item.summary}`;
        const hits = matchedKeywords(haystack);
        if (!hits.length || !normalizedUrl || !item.title) continue;

        results.push({
          title: item.title.trim(),
          source_url: normalizedUrl,
          source_site: feed.name,
          summary: item.summary.slice(0, 500),
          candidate_product_name: extractCandidateProductName(item.title),
          matched_keywords: hits,
          lead_status: "new",
        });
      }
    } catch (error) {
      console.error(`feed failed: ${feed.name}`, error.message);
    }
  }

  if (!results.length) {
    console.log(JSON.stringify({ imported: 0, titles: [] }, null, 2));
    return;
  }

  const dedupedResults = Array.from(new Map(results.map((item) => [item.source_url, item])).values());
  const sourceUrls = dedupedResults.map((item) => item.source_url);
  const { data: existing } = await supabase.from("leads").select("source_url").in("source_url", sourceUrls);
  const existingSet = new Set((existing || []).map((item) => item.source_url));
  const fresh = dedupedResults.filter((item) => !existingSet.has(item.source_url));

  if (!fresh.length) {
    console.log(JSON.stringify({ imported: 0, titles: [] }, null, 2));
    return;
  }

  const { error } = await supabase.from("leads").insert(fresh);
  if (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        imported: fresh.length,
        titles: fresh.slice(0, 5).map((item) => item.title),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
