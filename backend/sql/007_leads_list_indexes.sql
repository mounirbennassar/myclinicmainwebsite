-- Indexes for the lead list (GET /api/appointments, app/lib/leads-query.ts).
--
-- The portal no longer downloads every lead and filters in the browser: the
-- vertical / city / agent / status predicates, the free-text search, the
-- paging and the stat counts all run in SQL now. Each composite index below
-- pairs a filter column with `created_at desc` so a filtered page is served
-- straight off the index in list order, with no sort and no heap scan of the
-- rows that did not match. The first one indexes the same
-- coalesce(vertical, 'medical') expression the query uses, because legacy rows
-- carry a NULL vertical and belong to the medical view.
--
-- Replayed on EVERY backend boot (backend/app/migrate.py), so everything here
-- is idempotent (`if not exists`) and must never fail — a failing migration
-- crash-loops the backend container (see the note in 005_multi_roles.sql).
--
-- The search box does `name ilike '%q%' or phone like '%q%'`, which a b-tree
-- cannot serve; pg_trgm's GIN trigram indexes can. The extension needs the
-- contrib package on the server and CREATE privilege on the database, and a
-- managed or minimal Postgres may offer neither. So the extension and the two
-- trigram indexes sit inside a DO block that swallows any error: where
-- pg_trgm is unavailable the search degrades to a sequential ILIKE scan
-- (still correct, just slower) instead of taking the whole backend down.

begin;

create index if not exists appointments_vertical_created_idx
  on appointments ((coalesce(vertical, 'medical')), created_at desc);
create index if not exists appointments_city_created_idx
  on appointments (city, created_at desc);
create index if not exists appointments_assigned_created_idx
  on appointments (assigned_to, created_at desc);
create index if not exists appointments_status_created_idx
  on appointments (status, created_at desc);

do $$
begin
  create extension if not exists pg_trgm;
  create index if not exists appointments_name_trgm_idx
    on appointments using gin (name gin_trgm_ops);
  create index if not exists appointments_phone_trgm_idx
    on appointments using gin (phone gin_trgm_ops);
exception when others then
  raise notice 'pg_trgm unavailable (%): name/phone search will use a sequential ILIKE scan', sqlerrm;
end
$$;

commit;
