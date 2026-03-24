create table if not exists public.profiles (
  id uuid primary key,
  username text,
  avatar_url text,
  role text default 'user' check (role in ('user','editor','admin')),
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id bigserial primary key,
  slug text unique not null,
  name text not null
);

create table if not exists public.product_statuses (
  id bigserial primary key,
  key text unique not null,
  label text not null
);

create table if not exists public.failure_tags (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  description text
);

create table if not exists public.products (
  id bigserial primary key,
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  website_url text,
  archive_url text,
  logo_url text,
  cover_image_url text,
  category_id bigint references public.categories(id),
  status_id bigint references public.product_statuses(id),
  summary text,
  visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.autopsies (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  thesis text,
  fact_summary text,
  analysis_summary text,
  fact_points jsonb default '[]'::jsonb,
  analysis_points jsonb default '[]'::jsonb,
  surface_reasons text,
  root_causes text,
  warning_signs text,
  lessons text,
  confidence_level text,
  status text default 'draft' check (status in ('draft','published')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.timelines (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  event_date date,
  event_type text,
  title text not null,
  description text,
  source_url text,
  sort_order integer default 0
);

create table if not exists public.sources (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  title text not null,
  url text,
  source_type text,
  publisher text,
  published_at timestamptz,
  note text
);

create table if not exists public.product_failure_tags (
  product_id bigint not null references public.products(id) on delete cascade,
  failure_tag_id bigint not null references public.failure_tags(id) on delete cascade,
  primary key (product_id, failure_tag_id)
);

create table if not exists public.comments (
  id bigserial primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  user_id uuid not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.bookmarks (
  id bigserial primary key,
  user_id uuid not null,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

create table if not exists public.submissions (
  id bigserial primary key,
  submitter_id uuid,
  product_name text not null,
  website_url text,
  archive_url text,
  description text,
  status_guess text,
  evidence_links jsonb default '[]'::jsonb,
  fact_summary text,
  analysis_summary text,
  note text,
  review_status text default 'pending' check (review_status in ('pending','approved','rejected','needs_more_info')),
  created_at timestamptz default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status_id on public.products(status_id);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_timelines_product_id on public.timelines(product_id);
create index if not exists idx_sources_product_id on public.sources(product_id);
create index if not exists idx_comments_product_id on public.comments(product_id);
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_submissions_review_status on public.submissions(review_status);
