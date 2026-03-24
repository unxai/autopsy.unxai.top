-- Seed for autopsy.unxai.top
-- Run after schema.sql

insert into public.categories (slug, name) values
  ('hardware-assistant', '硬件 / 助手'),
  ('hardware-agent', '硬件 / Agent'),
  ('chat-assistant', '聊天 / 助手'),
  ('news-recommendation', '资讯 / 推荐'),
  ('social-roleplay', '社交 / 角色'),
  ('writing-saas', '写作 / SaaS')
on conflict (slug) do update set name = excluded.name;

insert into public.product_statuses (key, label) values
  ('closed', '已关闭'),
  ('inactive', '停更'),
  ('pivoted', '转型'),
  ('zombie', '名存实亡')
on conflict (key) do update set label = excluded.label;

insert into public.failure_tags (slug, name, description) values
  ('pmf-failed', 'PMF 不成立', '没有建立稳定、重复的真实需求。'),
  ('high-interaction-cost', '交互成本高', '任务链路长、使用摩擦大。'),
  ('narrative-over-value', '叙事大于日用价值', '热度和演示高于真实日常价值。'),
  ('strategy-pivot', '战略转向', '公司资源和重点转向其他方向。'),
  ('cost-pressure', '成本压力', '模型、团队或运营成本持续偏高。'),
  ('product-company-mismatch', '产品与公司目标错位', '用户喜欢的产品方向与公司战略不一致。'),
  ('weak-entry-point', '入口弱势', '作为独立入口无法建立足够心智。'),
  ('retention-pressure', '留存压力', '使用频率、复访和长期留存难以站住。'),
  ('insufficient-irreplaceability', '不可替代性不足', '体验不错但没有强到不可替代。'),
  ('agent-not-delivered', 'Agent 兑现不足', '承诺的 agent 能力未在产品中稳定兑现。'),
  ('overpromise', '过度承诺', '预期管理失衡，交付显著低于想象。'),
  ('expectation-backfire', '高期望反噬', '高预期在交付不达标后转化为负面反馈。'),
  ('single-experience-too-strong', '单点体验过强', '价值过于集中在单一玩法。'),
  ('expansion-failed', '扩展失败', '从核心能力扩到平台或新功能未成立。'),
  ('platformization-blocked', '平台化受阻', '未能形成更强的平台结构。'),
  ('wrapper-fragility', '套壳脆弱', '产品壁垒低，易被更底层能力吞掉。'),
  ('absorbed-by-foundation-model', '被基础模型吞掉', '基础模型原生能力替代了包装层。'),
  ('acquisition-hard', '获客困难', '流量和用户获取成本持续上升。')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description;

-- Minimal database view contract for app-side reads.
drop view if exists public.case_library;

create view public.case_library as
select
  p.id,
  p.visible,
  p.slug,
  p.name,
  p.tagline,
  ps.key as status_key,
  ps.label as status_label,
  c.name as category_name,
  coalesce(p.summary, '') as summary,
  coalesce(a.fact_summary, p.summary, '') as fact_summary,
  coalesce(a.analysis_summary, a.thesis, '') as analysis_summary,
  coalesce(a.thesis, '') as thesis,
  coalesce(a.surface_reasons, '') as signal,
  coalesce(a.root_causes, '') as root_cause,
  coalesce(a.fact_points, '[]'::jsonb) as fact_points,
  coalesce(a.analysis_points, '[]'::jsonb) as analysis_points,
  coalesce(
    (
      select jsonb_agg(value)
      from jsonb_array_elements_text(coalesce(a.warning_signs::jsonb, '[]'::jsonb)) as value
    ),
    '[]'::jsonb
  ) as warning_signs,
  coalesce(
    (
      select jsonb_agg(ft.name order by ft.name)
      from public.product_failure_tags pft
      join public.failure_tags ft on ft.id = pft.failure_tag_id
      where pft.product_id = p.id
    ),
    '[]'::jsonb
  ) as tags,
  coalesce(p.updated_at::date::text, '待补充') as ended_at,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'date', coalesce(t.event_date::text, '待补充'),
          'title', t.title,
          'note', coalesce(t.description, '')
        ) order by t.sort_order asc, t.event_date asc nulls last
      )
      from public.timelines t
      where t.product_id = p.id
    ),
    '[]'::jsonb
  ) as timeline,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'title', s.title,
          'type', coalesce(s.source_type, '待补充'),
          'publisher', coalesce(s.publisher, ''),
          'date', coalesce(s.published_at::date::text, '待补充')
        ) order by s.published_at desc nulls last
      )
      from public.sources s
      where s.product_id = p.id
    ),
    '[]'::jsonb
  ) as sources,
  coalesce((select count(*) from public.timelines t where t.product_id = p.id), 0) as timeline_count,
  coalesce((select count(*) from public.sources s where s.product_id = p.id), 0) as sources_count,
  coalesce((select count(*) from public.comments cm where cm.product_id = p.id), 0) as comments_count
from public.products p
left join public.product_statuses ps on ps.id = p.status_id
left join public.categories c on c.id = p.category_id
left join public.autopsies a on a.product_id = p.id and a.status = 'published';

