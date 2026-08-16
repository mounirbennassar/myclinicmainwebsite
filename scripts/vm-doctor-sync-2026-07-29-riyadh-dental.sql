-- Six Riyadh dental doctors, from the clinic's "Doctor's Roster-Updated_Jun22 v4"
-- deck (slides 7-12). These are the first dental doctors in Riyadh — every one of
-- the 64 dentists already in the table is Jeddah.
--
-- No photos: the deck carries portraits only on its repeated Hematology template
-- slides (3-6); all six dental slides share one background, wordmark and logo and
-- have no headshot. image_url is therefore left NULL and `gender` is set on every
-- row, so doctorAvatar() picks the right illustration deterministically instead of
-- guessing from the name. Drop a Cloudinary URL in later (doctors/<slug>, cloud
-- ubhucgne) and the avatar gives way to the photo with no code change.
--
-- Idempotent upsert by slug — the image_url CASE never blanks a photo added after
-- this script first ran. email is intentionally excluded (keeps PII out of git).
-- Applied automatically once by deploy-vm.yml (marker file guards re-runs).
begin;

insert into doctors (slug, name_en, name_ar, image_url, specialty_raw, title_ar, specialties, title, gender, branches, cities, is_active, sort_order, created_at, updated_at)
values
  ('dr-raghad-alsaawi',    'Dr. Raghad Alsaawi',    'د. رغد السعوي',       NULL, 'Prosthodontist Consultant',            'استشاري تركيبات وتجميل الأسنان',   ARRAY['Dental']::text[], 'Consultant',       'female', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-abdulmalik-almani', 'Dr. Abdulmalik Almani', 'د. عبد الملك المانع', NULL, 'Endodontic Consultant',                'استشاري علاج جذور وأعصاب الأسنان', ARRAY['Dental']::text[], 'Consultant',       'male',   ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-nora-al-amer',      'Dr. Nora Al-Amer',      'د. نورة العامر',      NULL, 'Orthodontics Consultant',              'استشاري طب تقويم الأسنان',         ARRAY['Dental']::text[], 'Consultant',       'female', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-nora-al-otaibi',    'Dr. Nora Al-Otaibi',    'د. نورا العتيبي',     NULL, 'Oral Maxillofacial Surgery Consultant', 'استشاري طب جراحة الوجه والفكين',   ARRAY['Dental']::text[], 'Consultant',       'female', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-asma-baqais',       'Dr. Asma Baqais',       'د. اسماء باقيس',      NULL, 'Senior Registrar Family Dentistry',    'أخصائي أول طب أسنان الأسرة',       ARRAY['Dental']::text[], 'Senior Registrar', 'female', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now()),
  ('dr-majed-al-madani',   'Dr. Majed Al-Madani',   'د. ماجد المدني',      NULL, 'Restorative Dentistry',                'طب إصلاح الأسنان',                 ARRAY['Dental']::text[], 'Restorative',      'male',   ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, now(), now())
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
