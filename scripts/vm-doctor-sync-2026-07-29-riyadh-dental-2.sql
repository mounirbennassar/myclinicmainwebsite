-- Four more dental doctors from the same "Doctor's Roster-Updated_Jun22 v4" deck
-- (slides 3-6), following vm-doctor-sync-2026-07-29-riyadh-dental.sql.
--
-- They were missed on the first pass: those four slides carry a stale text layer
-- reading "Dr. Mohammed Marei / Hematology Consultant" on every one, while the
-- real name, title and portrait live inside a pre-rendered card image. Reading
-- the text layer gets you one hematologist four times; reading the images gets
-- you these four dentists.
--
-- Photos are deliberately not set: they'll be uploaded through the dashboard.
-- `gender` is explicit on every row so the avatar fallback is right in the
-- meantime — Dr. Reda Dimashkieh matters here, because doctorAvatar()'s name
-- heuristic has "reda" on its female list and would otherwise show him a
-- woman's illustration.
--
-- Idempotent upsert by slug; the image_url CASE never blanks a photo added from
-- the dashboard after this runs. Applied once by deploy-vm.yml (marker-guarded).
begin;

insert into doctors (slug, name_en, name_ar, image_url, specialty_raw, title_ar, specialties, title, gender, branches, cities, is_active, sort_order, created_at, updated_at)
values
  ('dr-adeeb-marshad',     'Dr. Adeeb Marshad',     'د. أديب مرشد',       NULL, 'Family Dentistry Specialist',          'أخصائي طب أسنان الأسرة',        ARRAY['Dental']::text[], 'Specialist', 'male',   ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-ibrahim-abanmy',    'Dr. Ibrahim Abanmy',    'د. إبراهيم ابانمي',  NULL, 'Dentist',                              'طبيب أسنان',                    ARRAY['Dental']::text[], 'Dentist',    'male',   ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-lara-safi',         'Dr. Lara Safi',         'د. لارا صافي',       NULL, 'Endodontic Specialist',                'أخصائي علاج جذور وعصب الأسنان', ARRAY['Dental']::text[], 'Specialist', 'female', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-reda-dimashkieh',   'Dr. Reda Dimashkieh',   'د. رضا دمشقية',      NULL, 'Prosthodontics and Cosmetic Dentistry', 'أخصائي تركيبات وتجميل الأسنان', ARRAY['Dental']::text[], 'Specialist', 'male',   ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now())
on conflict (slug) do update set
  name_en       = excluded.name_en,
  name_ar       = excluded.name_ar,
  image_url     = case
    when (excluded.image_url is null or excluded.image_url = '')
     and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  specialty_raw = excluded.specialty_raw,
  title_ar      = excluded.title_ar,
  specialties   = excluded.specialties,
  title         = excluded.title,
  gender        = excluded.gender,
  branches      = excluded.branches,
  cities        = excluded.cities,
  is_active     = excluded.is_active,
  updated_at    = now();

commit;
