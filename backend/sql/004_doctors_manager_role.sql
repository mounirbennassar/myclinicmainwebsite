-- Adds the `doctors_manager` role: may manage the doctors directory and nothing
-- else. Until now the only role that could edit doctors was `admin`, which also
-- grants leads, team, reports, UTM and WhatsApp — far more than someone who just
-- maintains the doctor list needs.
--
-- Idempotent.

begin;

alter table team_members drop constraint if exists team_members_role_check;
alter table team_members add constraint team_members_role_check
  check (role in ('super_admin', 'admin', 'agent', 'marketing', 'content_manager', 'doctors_manager'));

commit;
