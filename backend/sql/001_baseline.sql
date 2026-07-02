-- MyClinic admin backend schema — migrated from Supabase → Neon Postgres.
-- Idempotent: safe to run multiple times. gen_random_uuid() is built into
-- Postgres 13+ (Neon runs 15/16), so no extension is required.

begin;

-- ── Team members (admin/agent accounts) ──────────────────────────────────
create table if not exists team_members (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  name           text not null,
  password_hash  text not null,
  role           text not null default 'agent' check (role in ('super_admin','admin','agent')),
  allowed_cities text[] default '{}',
  is_active      boolean default true,
  can_export     boolean default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz
);
create index if not exists team_members_email_idx on team_members (email);

-- ── UTM short links ───────────────────────────────────────────────────────
create table if not exists utm_links (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  destination_url text not null,
  source          text not null,
  medium          text not null,
  campaign        text not null,
  term            text,
  content         text,
  label           text,
  created_by      text,
  created_by_id   uuid references team_members(id) on delete set null,
  created_at      timestamptz not null default now()
);
create index if not exists utm_links_slug_idx on utm_links (slug);
create index if not exists utm_links_campaign_idx on utm_links (campaign);
create index if not exists utm_links_created_at_idx on utm_links (created_at desc);

-- ── Appointments / leads ──────────────────────────────────────────────────
create table if not exists appointments (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  city              text,
  name              text,
  phone             text,
  channel           text,
  note              text,
  vertical          text default 'medical',
  service           text,
  created_by        text,
  status            text default 'new',
  status_changed_by text,
  status_changed_at timestamptz,
  assigned_to       uuid,
  assigned_to_name  text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  utm_term          text,
  utm_content       text,
  utm_link_id       uuid references utm_links(id) on delete set null,
  referrer          text
);
create index if not exists appointments_created_at_idx on appointments (created_at desc);
create index if not exists appointments_city_idx on appointments (city);
create index if not exists appointments_assigned_to_idx on appointments (assigned_to);
create index if not exists appointments_status_idx on appointments (status);
create index if not exists appointments_utm_campaign_idx on appointments (utm_campaign);
create index if not exists appointments_utm_link_id_idx on appointments (utm_link_id);

-- ── UTM clicks (one row per short-link visit) ─────────────────────────────
create table if not exists utm_clicks (
  id         uuid primary key default gen_random_uuid(),
  link_id    uuid not null references utm_links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer   text,
  user_agent text,
  ip_hash    text,
  country    text
);
create index if not exists utm_clicks_link_id_idx on utm_clicks (link_id);
create index if not exists utm_clicks_clicked_at_idx on utm_clicks (clicked_at desc);

-- ── Doctors ───────────────────────────────────────────────────────────────
-- One row per unique doctor (deduped from the source export by source_user_id).
-- `specialties` is canonical (for filters + per-specialty landing carousels);
-- `specialty_raw` keeps the original label for display. A doctor can belong to
-- multiple specialties even from a single raw label (e.g. "Family Medicine and
-- Pediatric"), so both `specialties` and `cities` are arrays.
create table if not exists doctors (
  id               uuid primary key default gen_random_uuid(),
  source_user_id   bigint unique,
  source_rec_id    bigint,
  slug             text unique not null,
  name_en          text not null,
  name_ar          text,
  email            text,
  image_url        text,
  qualification_en text,
  specialty_raw    text,
  specialties      text[] default '{}',
  title            text,
  branches         text[] default '{}',
  cities           text[] default '{}',
  is_active        boolean default true,
  sort_order       int default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz
);
create unique index if not exists doctors_slug_idx on doctors (slug);
create index if not exists doctors_specialties_idx on doctors using gin (specialties);
create index if not exists doctors_cities_idx on doctors using gin (cities);
create index if not exists doctors_active_sort_idx on doctors (is_active, sort_order);

commit;
