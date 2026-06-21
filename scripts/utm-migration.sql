-- UTM tracking system migration
-- Run in Supabase SQL editor

-- 1. Links table: one row per generated UTM link
create table if not exists public.utm_links (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  destination_url text not null,
  source text not null,
  medium text not null,
  campaign text not null,
  term text,
  content text,
  label text,
  created_by text,
  created_by_id uuid references public.team_members(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists utm_links_slug_idx on public.utm_links (slug);
create index if not exists utm_links_campaign_idx on public.utm_links (campaign);
create index if not exists utm_links_created_at_idx on public.utm_links (created_at desc);

-- 2. Clicks table: one row per short-link visit
create table if not exists public.utm_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.utm_links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  ip_hash text,
  country text
);

create index if not exists utm_clicks_link_id_idx on public.utm_clicks (link_id);
create index if not exists utm_clicks_clicked_at_idx on public.utm_clicks (clicked_at desc);

-- 3. Attribution columns on appointments
alter table public.appointments add column if not exists utm_source text;
alter table public.appointments add column if not exists utm_medium text;
alter table public.appointments add column if not exists utm_campaign text;
alter table public.appointments add column if not exists utm_term text;
alter table public.appointments add column if not exists utm_content text;
alter table public.appointments add column if not exists utm_link_id uuid references public.utm_links(id) on delete set null;
alter table public.appointments add column if not exists referrer text;

create index if not exists appointments_utm_campaign_idx on public.appointments (utm_campaign);
create index if not exists appointments_utm_link_id_idx on public.appointments (utm_link_id);

-- RLS: service role bypasses RLS, so no policies needed if you access via service key.
-- If you have RLS enabled on these tables and access them from anon/authenticated, add policies.
