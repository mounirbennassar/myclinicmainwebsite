-- Karim Elsayed cannot sign in at portal.myclinic.com.sa (2026-07-25): his
-- account was created after the 2026-07-05 Neon→VM migration, so it exists
-- only in Neon — which is currently unreachable (compute quota exceeded).
-- This upserts him into the VM database so the portal accepts his login.
--
-- Applied once by deploy-vm.yml (marker .applied-<filename>). Idempotent
-- anyway: rerunning refreshes the same password hash.

begin;

insert into team_members (email, name, password_hash, role, roles, is_active)
values (
  'karim.elsayed@myclinic.com.sa',
  'Karim Elsayed',
  '$2b$10$r8w0Sh4ARRZkAKUE.QLwRuUGyiQYu1ow0QHKUEZ2Pvi6q2cXqdzY2',
  'doctors_manager',
  array['doctors_manager'],
  true
)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  is_active     = true,
  -- Keep any roles he already holds; just make sure doctors_manager is one of them.
  roles         = (select array(select distinct r
                                from unnest(team_members.roles || excluded.roles) as r)),
  updated_at    = now();

commit;
