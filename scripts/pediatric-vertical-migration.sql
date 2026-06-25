-- Pediatric section: allow the `pediatric` vertical so /pediatric landing-page
-- leads are tracked separately from general medical and dental leads.
-- Run in the Supabase SQL editor.
--
-- The `vertical` column, its index, and the `appointments_vertical_check`
-- constraint already exist (see dental-vertical-migration.sql). This migration
-- only widens that constraint to also accept 'pediatric'. It is safe to run on
-- live data: existing 'medical' / 'dental' rows continue to satisfy the check.
--
-- Run this BEFORE deploying the code that sends vertical='pediatric', otherwise
-- those inserts would be rejected by the old constraint.

alter table public.appointments
  drop constraint if exists appointments_vertical_check;

alter table public.appointments
  add constraint appointments_vertical_check
  check (vertical in ('medical', 'dental', 'pediatric'));
