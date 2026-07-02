-- Adds the marketing / content_manager roles and the content CMS tables
-- (blog + news posts, editable site pages). Idempotent.

begin;

-- ── Extend the team role set ──────────────────────────────────────────────
alter table team_members drop constraint if exists team_members_role_check;
alter table team_members add constraint team_members_role_check
  check (role in ('super_admin','admin','agent','marketing','content_manager'));

-- ── Blog + news posts ─────────────────────────────────────────────────────
create table if not exists posts (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in ('blog','news')),
  slug            text unique not null,
  title_en        text not null,
  title_ar        text,
  excerpt_en      text,
  excerpt_ar      text,
  body_en         text,
  body_ar         text,
  cover_image_url text,
  tags            text[] default '{}',
  status          text not null default 'draft' check (status in ('draft','published','archived')),
  published_at    timestamptz,
  author_id       uuid references team_members(id) on delete set null,
  author_name     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz
);
create index if not exists posts_type_status_idx on posts (type, status, published_at desc);
create index if not exists posts_slug_idx on posts (slug);

-- ── CMS-managed site pages ────────────────────────────────────────────────
create table if not exists site_pages (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  title_en         text not null,
  title_ar         text,
  body_en          text,
  body_ar          text,
  meta_description text,
  status           text not null default 'draft' check (status in ('draft','published')),
  updated_by       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz
);
create index if not exists site_pages_slug_idx on site_pages (slug);

commit;
