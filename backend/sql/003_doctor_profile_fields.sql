-- Doctor profile fields that only ever existed in the hardcoded
-- app/doctors-data.ts snapshot (generated 2026-03-26), never in the database.
--
-- The dental and pediatric strips rendered from that file, so they showed data
-- the CMS could not edit. Moving them onto the `doctors` table would have
-- silently dropped ~199 Arabic titles, ~164 Arabic education lists and the
-- languages line — hence these columns. Backfilled by
-- scripts/backfill-doctor-profiles.mjs. Idempotent.

begin;

alter table doctors add column if not exists title_ar text;
alter table doctors add column if not exists qualification_ar text;
alter table doctors add column if not exists languages text;

-- Only consulted when image_url is empty, to pick the fallback illustration.
-- Previously guessed from the name by app/lib/doctor-avatar.ts, which had to be
-- hand-patched per doctor when it guessed wrong; this lets an admin just say.
alter table doctors add column if not exists gender text;
alter table doctors drop constraint if exists doctors_gender_check;
alter table doctors add constraint doctors_gender_check
  check (gender is null or gender in ('female', 'male'));

commit;
