-- Lead pipeline: a lead now arrives as 'pending' (untouched, nobody has looked
-- at it yet). 'new' — shown as "Inquiry" in the portal — becomes the FIRST
-- stage an agent moves it to, and the rest of the vocabulary is unchanged.
--
-- Both writers (app/api/appointments/route.ts and backend/app/routers/leads.py)
-- set the status explicitly on insert as well; the column default is the
-- backstop for any other insert path (imports, psql).
--
-- The backfill flips only leads nobody has ever touched: status still 'new'
-- AND status_changed_at is null (every status change since the baseline
-- schema stamps status_changed_at, so a null there means "never actioned").
-- A lead someone deliberately set to Inquiry keeps that status. Reversible:
--   update appointments set status = 'new'
--    where status = 'pending' and status_changed_at is null;
--
-- Replayed on every backend boot (see app/migrate.py) — idempotent: after the
-- first run no row matches the backfill predicate, and the default is a no-op.

begin;

alter table appointments alter column status set default 'pending';

update appointments
   set status = 'pending'
 where status = 'new'
   and status_changed_at is null;

commit;
