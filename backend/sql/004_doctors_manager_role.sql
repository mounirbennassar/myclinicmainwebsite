-- Adds the `doctors_manager` role: may manage the doctors directory and nothing
-- else. Until now the only role that could edit doctors was `admin`, which also
-- grants leads, team, reports, UTM and WhatsApp — far more than someone who just
-- maintains the doctor list needs.
--
-- Idempotent.

begin;

-- (moved) team_members_role_check is owned by 005_multi_roles.sql — see the
-- note in 002: migrations re-run on every boot, so only the newest file may
-- assert the role vocabulary.
select 1;

commit;
