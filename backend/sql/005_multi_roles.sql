-- A team member holds a SET of roles, not one. "Agent + Content Manager" is a
-- real person: they work the leads pipeline and write the blog. Under the old
-- single `role` column the only way to express that was to pick one and lose the
-- other half of their job.
--
-- `roles` is now the source of truth. `role` is kept as a DERIVED column holding
-- the highest-authority role (see primaryRole() in app/lib/roles.ts), because:
--   * it is the label stamped on leads ("Sara Ahmed (Admin)"),
--   * FastAPI falls back to the JWT's `role` claim when the DB is unreachable,
--   * it keeps a code-only rollback possible.
-- Every write path sets both. Nothing should ever read `role` to make an access
-- decision — that is what `roles` is for.

alter table team_members add column if not exists roles text[] not null default '{}';

-- Backfill before the constraint lands, or every pre-existing row fails it.
update team_members set roles = array[role] where cardinality(roles) = 0;

-- No empty set (a member with no roles can sign in and see nothing, which reads
-- as a bug), and no role outside the known vocabulary. Mirrors ROLES in
-- app/lib/roles.ts and backend/app/security.py.
alter table team_members drop constraint if exists team_members_roles_check;
alter table team_members add constraint team_members_roles_check
  check (
    cardinality(roles) > 0
    and roles <@ array['super_admin','admin','agent','marketing','content_manager','doctors_manager']::text[]
  );
