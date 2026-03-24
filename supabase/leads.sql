create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text not null,
  source_site text,
  summary text,
  candidate_product_name text,
  matched_keywords text[] default '{}',
  lead_status text not null default 'new' check (lead_status in ('new', 'reviewed', 'discarded', 'converted')),
  created_at timestamptz not null default now()
);

create unique index if not exists leads_source_url_key on public.leads (source_url);
create index if not exists leads_status_created_idx on public.leads (lead_status, created_at desc);
