-- Doctors sync generated from Neon on 2026-07-11.
-- Purpose: bring the VM's Postgres in line with Neon — inserts the dentists added
-- 2026-07-08 (missing on the VM, which was migrated 2026-07-05) and sets the new
-- Cloudinary photo URLs uploaded 2026-07-11 for 47 previously photo-less doctors.
-- Idempotent upsert by slug. The image_url CASE keeps the VM's existing Cloudinary
-- URLs (bamc→Cloudinary rewrite done on the VM only) and never blanks an image.
-- email is intentionally excluded (not needed by the site; keeps PII out of git).
-- Applied automatically once by deploy-vm.yml (marker file guards re-runs).
begin;
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1be66eac-b9bc-439a-bad9-3a82fde97d8e'::uuid, NULL, NULL, 'dr-abdelrahman-alhilou', 'Dr. Abdelrahman Alhilou', 'د. عبدالرحمن الحلو', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-abdelrahman-alhilou', 'Doctorate of Endodontics - USA', 'Endodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:46.533Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('107cfa7f-aba2-40e2-a358-e41984e1d060'::uuid, 4775, 5637478329, 'dr-abdulaziz-alalwan', 'Dr. Abdulaziz Alalwan', 'د. عبدالعزيز العلوان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdulazizAlalwan.jpg', 'Fellowship in Adolescent Medicine', 'Family & Adolescent Medicine Consultant', ARRAY['Family Medicine','Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b64e4b2b-b18e-4e60-95ae-e38fc3d4645c'::uuid, 5496, 5637514327, 'dr-abdulaziz-alhumoud', 'Dr. Abdulaziz Alhumoud', 'د. عبدالعزيز الحمود', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Saudi Board in Internal Medicine', 'Internal Medicine Senior Specialist', ARRAY['Internal Medicine']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('bc66ba39-2522-4757-8daf-1da981eae24f'::uuid, 5280, 5637506093, 'dr-abdulaziz-alhuwaymil', 'Dr. Abdulaziz Alhuwaymil', 'د. عبدالعزيز الهويمل', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Abdulaziz_Alhuwaymil.jpg', 'Saudi Board of Radiology Canadian Fellowship in MSK Imaging & Interventional', 'Interventional & Pain Management Consultant', '{}'::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a2d8645f-6caf-4133-bf12-9a0c6f0ea5d6'::uuid, 5745, 5637530827, 'dr-abdulaziz-aljohani', 'Dr. Abdulaziz Aljohani', 'د. عبدالعزيز الجهني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'German Board in Ophthalmology and Eye Surgery and European Fellowship in Ophthalmology and Eye Surgery', 'Ophthalmology Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ae1f6c05-81b1-4931-9be9-31d9d81a2b94'::uuid, 5580, 5637521826, 'dr-abdulaziz-alsubaie', 'Dr. Abdulaziz Alsubaie', 'د. عبدالعزيز السبيعي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Abdulaziz Alsubaie.jpg', 'Canadian Fellowship in Infectious Diseases', 'Internal Medicine and Infectious Diseases Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ae1928d9-81c8-4b26-aaa7-dfd3cd96b862'::uuid, 3927, 5637422830, 'dr-abdulhaq-suliman', 'Dr. Abdulhaq Suliman', 'د. عبدالحق  سليمان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Master of science in family medicine', 'Resident Family Medicine', ARRAY['Family Medicine']::text[], '', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('deccf635-d9dc-4228-b1c4-21ed9b95c456'::uuid, 158, 5637149076, 'dr-abdulkareem-samman', 'Dr. Abdulkareem Samman', 'د. عبدالكريم سمان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAbdelkareemSamman.jpg', 'American Canadian Board of Pediatrics Canadian Fellowship in Pediatric Congenital Cardiac Defect', 'Pediatric & Pediatric Cardiology Consultant', ARRAY['Cardiology','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9999b82f-4b4c-4e5d-9a4c-9a00944c69fd'::uuid, 4005, 5637428826, 'dr-abdullah-abdullah', 'Dr. Abdullah Abdullah', 'د. عبدالله عبدالله', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdullah Abdullah.jpeg', 'American and Canadian Board of Vascular Surgery', 'Vascular and Endovascular Surgery Consultant', ARRAY['General & Bariatric Surgery']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8f4fa973-4931-433a-b15b-9c657f628283'::uuid, 5498, 5637514328, 'dr-abdullah-alkutbi', 'Dr. Abdullah Alkutbi', 'د. عبدالله الكتبي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdullah.Alkutbi.jpg', 'Canadian Fellowship In Stroke Neurology', 'Neurology and vascular Neurology Consultant', ARRAY['General & Bariatric Surgery','Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9dc6f2bc-56c7-4466-ad0d-05bf648e0d37'::uuid, 5493, 5637513576, 'dr-abdullah-almaghraby', 'Dr. Abdullah Almaghraby', 'د. عبدالله المغربي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdullahAlmaghraby.jpg', 'American Fellowship Training in Pediatric Endocrinology', 'Pediatrics and Pediatric Endocrinology Consultant', ARRAY['Endocrinology & Diabetes','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c38bd303-cb98-4cef-a91d-a83503deef9a'::uuid, 3005, 5637311076, 'dr-abdullah-baatiyyah', 'Dr. Abdullah Baatiyyah', 'د. عبدالله باعطيه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdullahBaatiyah1.png', 'Saudi Board of Internal Medicine', 'Internal Medicine Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('46c0d861-a38b-467b-a47d-bcfb7fe5dd8a'::uuid, 2982, 5637307327, 'dr-abdullah-bahakim', 'Dr. Abdullah Bahakim', 'د. عبدالرحمن باحكيم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdullahBahakim.png', 'French Board of Otolaryngology Head Neck Surgery Canadian Fellowship in Rhinology Endoscopic Skull Base Surgery', 'ENT Rhinology and Endoscopic Skull Base Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('261f43f1-391f-4aca-a887-35e3f1c7a868'::uuid, 159, 5637160326, 'dr-abdullah-khafagy', 'Dr. Abdullah Khafagy', 'د. عبدالله خفاجي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAbdullahKhafagy.jpg', 'American Board of Family, Occupational & Environmental Medicine', 'Family and Occupational Medicine Consultant', ARRAY['Family Medicine','Occupational Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('532dd358-5f77-4942-b9f5-54f60c445baa'::uuid, 4784, 5637478346, 'dr-abdulmajeed-alghamdi', 'Dr. Abdulmajeed Alghamdi', 'د. عبدالمجيد الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdulmajeed.Alghamdi.jpg', 'German Fellowship in Endourology & Robotic Surgery European & German Board of Urology', 'Urology Consultant', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dcda585b-2c30-4135-86de-8fc31d4407ec'::uuid, 3015, 5637311077, 'dr-abdulqawi-mansari', 'Dr. Abdulqawi Mansari', 'د. عبدالقوي المنصري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdulqawi.Almansari.jpg', 'American Board of Endocrinology, Diabetes & Metabolism, American Board of Internal Medicine', 'Endocrinology and Diabetes Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('efbfaf34-6b92-465c-8ad4-41ee371e6db3'::uuid, 3080, 5637320084, 'dr-abdulrahman-alamoudi', 'Dr. Abdulrahman Alamoudi', 'د. عبدالرحمن العمودي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdulrahmanAlamoudi1.png', 'Saudi Board of Internal Medicine Fellowship in Endocrine', 'Internal Medicine and Endocrinology and Diabetes and Obesity Consultant', ARRAY['Endocrinology & Diabetes','Internal Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8e5b8796-1482-499f-88fc-723d836c2f24'::uuid, 4486, 5637458916, 'dr-abdulrahman-albabtain', 'Dr. Abdulrahman Albabtain', 'د. عبدالرحمن البابطين', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdulrahmanAlBabtain.jpg', 'Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6df62943-5f90-422c-8afc-47a7918887ff'::uuid, 4684, 5637466367, 'dr-abdulrahman-alqahtani', 'Dr. Abdulrahman Alqahtani', 'د. عبدالرحمن القحطاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAbdulrahmanAlQahtani.png', 'Saudi Board in Neurology American Board in Neuromuscular Disorders & Electromyography Canadian Fellowship in Neuromuscular Medicine', 'Neurology & Neuromuscular Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('296e9e83-4fd7-46f6-99f4-2cbbc8ed3b87'::uuid, 4790, 5637482826, 'dr-abdulrahman-bahhari', 'Dr. Abdulrahman Bahhari', 'د. عبدالرحمن بحاري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdulrahmanAlbahhari.png', 'Psychology Specialist', 'Psychology Specialist', ARRAY['Psychiatry & Psychology']::text[], 'Specialist', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2f7e5eeb-e5ea-4aec-8c01-e0101e236fa6'::uuid, 4971, 5637490326, 'dr-abdulrahman-hawari', 'Dr. Abdulrahman Hawari', 'د. عبدالرحمن حواري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdulrahman.Hawari.jpg', 'Saudi Board of Pediatrics', 'Pediatric Sr. Specialist', ARRAY['Pediatrics']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d51782b5-03d8-4455-8113-3ca70971505c'::uuid, NULL, NULL, 'dr-abdulrahman-tehsin', 'Dr. Abdulrahman Tehsin', 'د. عبدالرحمن تحسين', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-abdulrahman-tehsin', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:46.778Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d218a1e8-b1b4-421a-91d2-35a8832c63d4'::uuid, 3286, 5637344912, 'dr-abdulrahman-watfah', 'Dr. Abdulrahman Watfah', 'د. عبدالرحمن وطفه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Abdulrahman.Watfah.jpeg', 'Masters Degree in Otolaryngology', 'ENT Specialist', ARRAY['ENT']::text[], 'Specialist', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f9383807-6d45-4a5e-bd6b-811b35d3c22d'::uuid, 5518, 5637515077, 'dr-abdulwahab-bawahab', 'Dr. Abdulwahab Bawahab', 'د. عبدالوهاب باوهاب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Dr. AbdulwahabBawahab.jpg', 'German Board in Internal Medicine', 'Endocrinology Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('677e13c4-1a7a-4282-860f-5477e9aed675'::uuid, 4748, 5637476826, 'dr-abeer-aljahdali', 'Dr. Abeer Aljahdali', 'د. عبير الجحدلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Ophthalmology King Khaled Eye Specialist Hospital Fellowship in Medical Retina & Uveitis', 'Ophthalmology Medical Retina & Uveitis Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b37b0dfc-2701-4ac5-be6c-b53f12465c85'::uuid, 5693, 5637527826, 'dr-abeer-saleh', 'Dr. Abeer Saleh', 'د. عبير صالح', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/femaleDoctor.jpg', 'Saudi board of family medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7a3297d1-71b8-478c-9ef9-c7d4103ab65d'::uuid, 5367, 5637506265, 'dr-abir-al-badrani', 'Dr. Abir Albadrani', 'د. عبير البدراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.AbirAlbadrani.jpg', 'Saudi & Arab Board of Obstetrics & Gynecology British Fellowship in Gynecological Oncology', 'Gynecological Oncology, Minimale Invasive Surgery & Aesthetic Gynecological Consultant', ARRAY['Dermatology & Cosmetics','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9dbdc136-2c17-45be-8f60-eeb8a237f7a0'::uuid, NULL, NULL, 'dr-abrar-almarghalani', 'Abrar Almarghalani', 'د. أبرار المرغلاني', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-abrar-almarghalani', 'American Fellowship in Esthetic and Restorative Dentistry
Master''s Degree in Dental Materials Science', 'Sr. Registrar In Operative & Esthetic Dentistry', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:46.926Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a9a3b421-94dd-4b1d-97c7-ffdb5c3618d0'::uuid, 2995, 5637308078, 'dr-adhwaa-khudhary', 'Dr. Adhwaa Khudhary', 'د. اضواء خضري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Adhwaa.Khudhary.jpeg', 'Saudi Board of Ob&Gyn Canadian Fellowship in Reproductive Endocrinology Infertility and Laparoscopic', 'Obstetrics and Gynecology Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9e20143d-3208-4598-b080-920ff5134d09'::uuid, 312, 5637176826, 'dr-adil-alsulami', 'Dr. Adil Alsulami', 'د. عادل السلمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAdilAlsulami.jpg', 'Irish Fellowship in Respiratory of Royal College of Physicians', 'Pulmonary Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('3c158b81-5a70-49ef-b6a7-da17bacc7889'::uuid, 2911, 5637285576, 'dr-afnan-aboalwa', 'Dr. Afnan Aboalwa', 'د. افنان ابو علوا', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AfnanAboalwa.png', 'Arab & Saudi Board of Family Medicine, Saudi Fellowship in Diabetes, Breastfeeding Consultant', 'Family Medicine and Diabetes Consultant', ARRAY['Endocrinology & Diabetes','Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('96f32f6f-e3e6-4c83-9760-01edbb56e514'::uuid, 5134, 5637498596, 'dr-ahmad-almousa', 'Dr. Ahmad Almousa', 'د. احمد الموسى', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American Fellowship in Laser & Dermatosurgery Saudi Board of Dermatology', 'Dermatology, Laser & Dermatosurgery Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f2372e30-3fcf-46b9-9791-12267e185025'::uuid, 5590, 5637523329, 'dr-ahmad-alshahrani', 'Dr. Ahmad Alshahrani', 'د. احمد الشهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AhmedAlshahrani.jpg', 'Saudi Board of Internal Medicine , KFSHRC', 'Internal Medicine', ARRAY['Internal Medicine']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6a73051c-662f-4734-be81-de10445408ce'::uuid, 5486, 5637512079, 'dr-ahmad-bakhsh', 'Dr. Ahmad Bakhsh', 'د. احمد بخش', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American & Canadian Board of Pediatrics – University of Toronto, American Fellowship in Pediatric Rheumatology – Harvard University', 'Pediatric & Pediatric Rheumatology Consultant', ARRAY['Pediatrics','Rheumatology']::text[], 'Consultant', ARRAY['Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('91c4283e-4604-47f4-b0a5-b6b4135a6ab4'::uuid, 3081, 5637320085, 'dr-ahmad-imam', 'Dr. Ahmad Imam', 'د. احمد امام', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AhmedImam.jpg', 'American Board of Endocrinology Diabetes Metabolism American Board of Internal Medicine', 'Endocrinology and Diabetes Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('02e90354-0dd5-490d-995c-6f7f640b7d09'::uuid, 5490, 5637512083, 'dr-ahmed-alsayed', 'Dr. Ahmed Alsayed', 'د. احمد السيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Saudi and King Saud University Board, Otolaryngology, Head & Neck Surgery KSU clinical Fellowship in Rhinology & Skull Base Surgery', 'ENT Rhinology & Endoscopic Skull Base Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Tahlia','Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1b2bd871-fcaa-44d9-a376-c41e0497af28'::uuid, 5632, 5637524846, 'dr-ahmed-alshaer', 'Dr. Ahmed Alshaer', 'د. احمد الشاعر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AhmedAlShaerApp.jpg', 'Canadian board of Internal Medicine, Canadian fellowship in Endocrinology', 'Endocrinology and Diabetes Senior Specialist', ARRAY['Endocrinology & Diabetes']::text[], 'Senior Specialist', ARRAY['Al Tahlia','Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6ceaa9a0-509f-44cb-8300-c9ad1ca6eb2e'::uuid, 5068, 5637497076, 'dr-ahmed-altoub', 'Dr. Ahmed Altoub', 'د. احمد الطوب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American Board of Podiatric Foot & Ankle Surgery', 'Podiatry & Diabetic Foot Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0abd1913-4413-4098-a566-400858b42d0a'::uuid, 165, 5637147581, 'dr-ahmed-alwazzan', 'Dr. Ahmed Alwazzan', 'د. احمد الوزان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Ahmed.Wazzan.png', 'Canadian Board of Obstetrics and Gynecology Canadian Fellowship in Oncology and Laparoscopy', 'Obstetrics and Gynecology Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c4572f31-9459-4d23-8f88-c7244b31dcfc'::uuid, 151, 5637144576, 'dr-ahmed-alzahrani', 'Dr. Ahmed Alzahrani', 'د. احمد الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AhmedAlZahrani.png', 'American Fellowship in SurgeryCanadian Fellowship in Oncology Surgery Hepatobiliary Pancreatic Surgery and Bariatric Surgery', 'General Laparoscopic and Bariatric Surgery Consultant', ARRAY['General & Bariatric Surgery']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cdba59bc-567c-4a1a-8d5b-0e99c3bf9c74'::uuid, 3420, 5637367333, 'dr-ahmed-baabdallah', 'Dr. Ahmed Baabdallah', 'د. احمد باعبدالله', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AhmedBaabdallah.jpg', 'Saudi, European and Arab Board of Dermatology Laser and Aesthetic Medicine', 'Dermatology and Aesthetic Medicine Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e4cf68aa-d9e9-4d22-bdfc-af5bae29d3e3'::uuid, 351, 5637189576, 'dr-ahmed-bamaga', 'Dr. Ahmed Bamaga', 'د. احمد بامقا', '/doctors/dr-ahmed-bamaga.webp', 'Americana and Canadian Board of Neurology Child Neurology and Neuromuscular Medicine', 'Pediatric Neurology and Adult and Pediatric Neuromuscular Medicine Consultant', ARRAY['Neurology','Pediatrics','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('55875d44-1de7-4132-95ac-ef2ec944e7bd'::uuid, 3504, 5637435625, 'dr-ahmed-basndwah', 'Dr. Ahmed Basndwah', 'د. احمد باسندوه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Saudi Board of Neurology  Canadian Fellowship in Movement Disorders', 'Neurology and Movement Disorders Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('aa13ae4d-db15-4d49-b467-826b76b1f3a7'::uuid, 3255, 5637342576, 'dr-ahmed-elguindy', 'Dr. Ahmed Elguindy', 'د. احمد الجندي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Ahmed.Elguindy.jpeg', 'Doctorate of Orthopedic Surgery & Traumatology - Cairo French Fellowship in Knee Surgery & Sports Traumatology', 'Orthopedic, Knee Surgery & Sports Traumatology Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Khalidiyyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e52fc9fb-7bd7-4137-ba9d-15ef10897d61'::uuid, NULL, NULL, 'dr-ahmed-elsayed', 'Dr. Ahmed Elsayed', 'د. أحمد السيد', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ahmed-elsayed', 'Master of Prosthodontics- Marmara University/Türkiye', 'Prosthodontist', ARRAY['Dental']::text[], '', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.062Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('19faa080-5a59-4bc1-a134-fb435cb0de4a'::uuid, NULL, NULL, 'dr-ahmed-ghannam', 'Dr. Ahmed Ghannam', 'د.أحمد غنام', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ahmed-ghannam', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.232Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fe8e16ad-99c0-465d-a62d-ae48a44a223e'::uuid, 164, 5637146077, 'dr-ahmed-hashish', 'Dr. Ahmed Hashish', 'د. احمد حشيش', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAhmedHashish.jpg', 'Master’s Degree in Otorhinolaryngology', 'ENT Specialist', ARRAY['ENT']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1ee01726-182a-438e-ac6b-4954ae14cbc3'::uuid, 3625, 5637386861, 'dr-ahmed-mohamed', 'Dr. Ahmed Mohamed', 'د. احمد محمد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Egyptian Fellowship in Family Medicine', 'Family Medicine Sr Specialist', ARRAY['Family Medicine']::text[], 'Senior Specialist', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cf447dec-31a9-4740-a562-891fe6a257f6'::uuid, 5514, 5637515076, 'dr-ahmed-sheikh', 'Dr. Ahmed Sheikh', 'د. احمد شيخ', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Ahmed.Sheikh.jpg', 'Fellowship in Diabetes & Obesity Management (USA).  British, Saudi & Arab Board of Family Medicine', 'Diabetes, Obesity & Family Medicine Consultant', ARRAY['Endocrinology & Diabetes','Family Medicine']::text[], 'Consultant', ARRAY['Obhour','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('283b8a97-7055-4e2f-93c1-f8d6ffa2abe5'::uuid, NULL, NULL, 'dr-ahmed-younis', 'Dr. Ahmed Younis', 'د. أحمد يونس', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ahmed-younis', 'Master’s Degree in Endodontics', 'Endodontic Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.383Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('438aa19d-d4cb-4a4e-a3d6-d9f835708210'::uuid, 3710, 5637398079, 'dr-ahmed-zmi', 'Dr. Ahmed Zmi', 'د. احمد زمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.AhmedZmi.jpg', 'Egyptian Board  of Otorhinolaryngology', 'ENT Sr Specialist', ARRAY['ENT']::text[], 'Senior Specialist', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a22e50b2-5d37-4528-ba49-0cbab3db6f3c'::uuid, NULL, NULL, 'dr-ahood-aldahri', 'Dr. Ahood Aldahri', 'د. عهود الدهري', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ahood-aldahri', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.529Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1eb2c89d-8670-4471-bf8b-13b7d70d36e0'::uuid, 5619, 5637524081, 'dr-akram-bukhari', 'Dr. Akram Bukhari', 'د. اكرم بخاري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AkramBukhari.jpg', 'African and Canadian Boards in Urology', 'Urology', ARRAY['Urology']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('70070297-cde4-4c65-802d-c010a2b1d433'::uuid, 5694, 5637527827, 'dr-alaa-alrehaily', 'Dr. Alaa Alrehaily', 'د. الاء الرحيلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AlaaAlrehily.jpg', 'Royal College of Physicians And Surgeons of Canada Fellowship General Internal Medicine, Canadian Clinical Fellowship in Bariatric, Thrombosis, and Perioperative Medicine', 'General Internal Medicine And Thrombosis Medicine Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8bd1e1eb-8dcc-4663-8174-7b777c6dfe62'::uuid, NULL, NULL, 'dr-alaa-babeer', 'Dr. Alaa Babeer', 'د. علاء بابعير', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-alaa-babeer', 'Doctorate of Science in Endodontics - USA', 'Endodontist Sr. Specialist', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.885Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('83d0a8c5-7e56-4bba-9949-6be8b3975d7e'::uuid, NULL, NULL, 'dr-alaa-kabbarah', 'Alaa Kabbarah', 'علاء كباره', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-alaa-kabbarah', 'Candaian Board in Dental Public Health', 'Consultant Dental Public health', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.005Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d739c1b4-f5b7-4fde-b85e-a52dd8a653b3'::uuid, NULL, NULL, 'dr-alaa-samman', 'Dr. Alaa Samman', 'د. علاء السمان', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-alaa-samman', 'Board Certificate in Orthodontics', 'Orthodontic Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:47.766Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c83d4634-3359-43b2-986b-06dbe32e69cb'::uuid, NULL, NULL, 'dr-alamuddin-bakhit', 'Dr. Alamuddin Bakhit', 'د. علم الدين بخيت', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-alamuddin-bakhit', 'Doctorate in Endodontics – Japan', 'Endodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.128Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a55679f2-b857-4080-9489-51d5fa558b6a'::uuid, 3490, 5637378576, 'dr-albaraa-alqassimi', 'Dr. Albaraa Alqassimi', 'د. البراء القاسمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AlbaraaAlqassimi.jpg', 'Saudi Board of Ophthalmology King Khaled Eye Specialist Hospital Fellowship in Cornea Cataract  Re', 'Cornea Cataract and Refractive Surgery Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('acedef6d-1c50-4525-a9c1-3fc24450eb18'::uuid, 5735, 5637529331, 'dr-ali-bassi', 'Dr. Ali Bassi', 'د. على باصي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AliBassi.jpg', 'Canadian Board in Obstetrics & Gynecology Canadian Board in Gynecology Oncology', 'Obstetric & Gynecology, Gynecologic Oncologist Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dd3e3efe-6750-4f8c-9bb6-8ccf1dbad7a6'::uuid, 4837, 5637482078, 'dr-ali-bin-mahfooz', 'Dr. Ali Bin Mahfooz', 'د. علي بن محفوظ', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AliBinMahfooz.jpg', 'Canadian Fellowship in Neurourology & Urodynamics', 'Consultant of Urology', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e3af2a9e-d111-426a-bc51-e0484487a122'::uuid, NULL, NULL, 'dr-ali-elatrouni', 'Dr. Ali Elatrouni', 'د. علي العطروني', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ali-elatrouni', 'French Board of Oral Maxillo Facial Surgery', 'Oral Maxillo Facial Surgery & implantology Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.246Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('66ad73c0-9fc3-4b63-bc1e-2de9dbd3a40f'::uuid, 2862, 5637272826, 'dr-almotasimbellah-rayes', 'Dr. Almotasimbellah Rayes', 'د. المعتصم بالله ريس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Rayes.jpg', 'Canadian Fellowship in Maternal-Fetal Medicine High-Risk Pregnancy', 'Obstetrics & Gynecology Consultant Maternal-Fetal Medicine Subspeciality', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('96a67b3a-b7fd-4d8d-b9b8-41529ad71002'::uuid, 220, 5637155827, 'dr-amal-alandejani', 'Amal Alandejani', 'امال الانديجاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AmalAlandejani.jpg', 'Masters Degree in Clinical Nutrition  Public Health Diploma in Sports Nutrition Weight Loss and Obes', 'Sr Clinical Dietitian', ARRAY['Nutrition']::text[], 'Dietitian', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('15755444-abb4-4b1e-9d9d-04895af71905'::uuid, 3978, 5637427386, 'dr-amer-khojah', 'Dr. Amer Khojah', 'د. عامر خوجه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Amer.khojah.jpg', 'American Board of Pediatric Rheumatology American Board of Allergy & Immunology', 'Pediatric Allergy Immunology & Pediatric Rheumatology  Consultant', ARRAY['Allergy & Immunology','Pediatrics','Rheumatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2e697d10-ea34-4c25-88fe-a94b0bc4ab1b'::uuid, 3974, 5637427329, 'dr-amira-eltawdy', 'Dr. Amira Eltawdy', 'د. اميرة التاودي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AmiraEltawdy.jpg', 'German International Board of Skin Pathology Doctorate and Masters Degree in Dermatology Egypt', 'Dermatology Aesthetics Medicine Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a09603b0-500a-45f9-8317-17855f54a567'::uuid, NULL, NULL, 'dr-ammar-almarghlani', 'Dr. Ammar Almarghlani', 'د. عمار المرغلاني', '/doctors/ammar-almarghlani.webp', 'American Board of Periodontology and Implant Dentistry
Fellowship of Royal College of Dentists in Canada in Periodontics', 'Consultant in Periodontics and Implant Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.381Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('bfd3df95-7b2d-4bd8-b463-29ebbbf5daa8'::uuid, NULL, NULL, 'dr-amr-azhari', 'Dr. Amr Azhari', 'د. عمرو أزهري', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-amr-azhari', 'Doctorate of Philosophy in Community Oral Health-USA', 'Consultant in Restorative and Cosmetic Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.499Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5ebe51eb-4cae-4893-854d-f65d770b807d'::uuid, 5170, 5637499327, 'dr-amro-albaz', 'Dr. Amro Albaz', 'د. عمرو الباز', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Amro.Albaz.jpg', 'Saudi Board of OrthSurgery Saudi Fellowship in Spine Surgery', 'Orthopedic & Spine Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('eea9e145-3348-457d-b471-6e4c60b3eb99'::uuid, 5491, 5637512826, 'dr-amro-hamdi', 'Dr. Amro Hamdi', 'د. عمرو حمدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Fellowship in Hand and Wrist Surgery - Canada', 'Orthopedic Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('53b3a088-fccd-4c85-9b58-ebeb20bc0402'::uuid, 3758, 5637386826, 'dr-anan-khattab', 'Dr. Anan Khattab', 'د. عنان خطاب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Bachelor’s Degree in Speech Language & Hearing Disorders', 'Speech Language Assessment Specialist', ARRAY['Audio-vestibular & Speech']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0014d8a8-68fb-489d-b84d-1fe25e921c5b'::uuid, NULL, NULL, 'dr-anhar-basunbul', 'Dr. Anhar Basunbul', 'د. أنهار باسنبل', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-anhar-basunbul', 'American Board of Prosthodontics-Maxillofacial Prosthodontics & Oral Oncology
Doctorate of Prosthodontics Restorative Biomaterials - USA', 'Maxillofacial Prosthodontics & Oral Oncology Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.620Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('95492d6b-a97d-4d6f-b28d-a7b79a3c71db'::uuid, 5488, 5637512081, 'dr-anmar-fatani', 'Dr. Anmar Fatani', 'د. انمار فطاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.AnmarFatani.jpg', 'Saudi Board in Neurology', 'Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Tahlia','Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('abab0105-1a0b-4dbc-ad9c-3fc2abcfd70d'::uuid, 3422, 5637367332, 'dr-aseel-alghanemi', 'Dr. Aseel Alghanemi', 'د. اسيل الغانمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AseelAlghanemi.png', 'Saudi and Arab Board of Family Medicine, Canadian Fellowship in Palliative Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('213ec8d8-bdeb-4547-8ae3-68a9850a233e'::uuid, 5710, 5637527853, 'dr-ashraf-aljahdali', 'Dr. Ashraf Aljahdali', 'د. اشرف الجحدلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AshrafAljahdali.jpg', 'German Board In Ophthalmology', 'Consultant In Ophthalmology', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('319bd956-4118-4d6b-b2a8-d66f0bc9c912'::uuid, 3079, 5637320082, 'dr-ashraf-warsi', 'Dr. Ashraf Warsi', 'د. اشرف وارسي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AshrafWarsi.png', 'American & Canadian Board of Internal Medicine American & Canadian Board of Adult Hematology Clinical Fellowship in Thrombosis', 'Hematology Consultant', ARRAY['Hematology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dca5ef64-c8a6-482d-9361-7d765c7cf3e7'::uuid, 385, 5637195576, 'dr-asim-alshanberi', 'Dr. Asim Alshanberi', 'د. عاصم الشنبري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrAsimAlshanberi.png', 'American Board of Family Medicine, American Fellowship in Geriatric Medicine', 'Family and GeriaMedicine Consultant', ARRAY['Family Medicine','Geriatric Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('09fa4253-4365-4495-9eea-d3e69ec0faba'::uuid, 4827, 5637480593, 'dr-assad-almotowa', 'Dr. Assad Almotowa', 'د. اسعد المطوع', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'British Fellowship in Orthopedic & Spine Surgery American Fellowship in Trauma & Fractures', 'Orthopedics Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('151ab1d0-4fd1-452d-b3c6-3103eb14fb9b'::uuid, 5061, 5637494830, 'dr-assoc-prof-mohammed-alsofiani', 'Assoc. Prof. Mohammed Alsofiani', 'بروفيسور مشارك. محمد السفياني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedAlsofiani.png', 'Associate Professor at King Saud University & at John Hopkins University USA Fellowship in Endocrinology', 'Endocrinology & Diabetes Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('275b458a-eb21-4a3a-9cec-557902764423'::uuid, 4675, 5637467201, 'dr-ayedh-alghamdi', 'Dr. Ayedh Alghamdi', 'د. عايض الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AyedhAlGhamdi.jpg', 'Canadian Fellowship in Psychosomatic Medicine', 'Psychiatry & Psychotherapy & Psychosomatic Medicine Consultant', ARRAY['Psychiatry & Psychology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c1c05255-e8ed-4d4d-8d99-9fbdd3cb4b1e'::uuid, 3373, 5637363576, 'dr-ayman-awlia', 'Dr. Ayman Awlia', 'د. ايمن اوليا', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AymanAwliya.png', 'Canadian Board of Orthopedic Surgery Canadian Fellowship in Upper Limb Surgery Canadian Fellowship', 'Orthopedic Upper Limb and Comprehensive Knee Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b5727980-21b5-40a9-8bc4-908bc4d92900'::uuid, 2920, 5637287826, 'dr-aziz-albalawi', 'Dr. Aziz Albalawi', 'د. عزيز البلوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AzizAlBalawi.png', 'Saudi Board in Ophthalmology King Khalid Fellowship in Ophthalmology  Vitreoretinal Diseases  Surgery', 'Ophthalmology Vitreo and Retinal Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('005bbfdc-75e9-4265-8ed3-cd03dadbbbeb'::uuid, 4700, 5637467149, 'dr-bader-almehmadi', 'Dr. Bader Almehmadi', 'د. بدر المحمادي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/BaderAlMehmadi.jpg', 'Canadian Fellowship in Rheumatoid Arthritis and Systemic Sclerosis', 'Rheumatology Consultant', ARRAY['Rheumatology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8ab918b5-c338-448c-8874-7dd1cab7f22d'::uuid, 4678, 5637467157, 'dr-badria-alnouh', 'Dr. Badria Alnouh', 'د. بدرية النوح', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/BadriaAlnouai.png', 'Saudi & Arab Board of Obstetric & Gynecology Australian Fellowship in Advanced Endoscopic Gynecology, & Aesthetic Gynecology', 'Obstetrician & Gynaecology Consultant, Endoscopic Gynecology Surgeon, Aesthetic Gynecologist', ARRAY['Dermatology & Cosmetics','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('13adaaa9-c82c-479a-8851-09c9cf456f54'::uuid, 169, 5637163331, 'dr-bandar-hetaimish', 'Dr. Bandar Hetaimish', 'د. بندر حتيمش', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/BandarHetaimish.jpg', 'Canadian Board of Orthopedic Surgery', 'Orthopedic Consultant Sports medicine Arthroscopy Lower Limb Arthroplasty Joint Replacement Subspeci', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e7133f36-df2e-4cea-908a-b10613fbc333'::uuid, 3678, 5637393794, 'dr-baraah-tatwany', 'Dr. Baraah Tatwany', 'د. براءة تطواني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.BaraahTatwany.jpeg', 'Saudi Board of General Surgery', 'General Surgery Sr Specialist', ARRAY['General & Bariatric Surgery']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ed7992bf-83f0-4c41-92af-0383f636030d'::uuid, 5545, 5637518098, 'dr-bashair-ibrahim', 'Dr. Bashair Ali', 'د. بشائر ابراهيم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Bashair.Ibrahim.jpg', 'Fellowship in Pediatric Allergy and Immunology', 'Pediatric and Allergy Immunology Sr. Specialist', ARRAY['Allergy & Immunology','Pediatrics']::text[], 'Senior Specialist', ARRAY['Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b261bec1-1051-4be1-8c13-884c3b5078b9'::uuid, 4854, 5637367327, 'dr-basma-alghamdi1', 'Basma AlGhamdi1', 'بسمة الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Education', 'Education', '{}'::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e63426ea-f62b-4b84-ba91-edc0ca57b0c0'::uuid, NULL, NULL, 'dr-bayan-alsharif', 'Dr. Bayan Alsharif', 'د. بيان الشريف', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-bayan-alsharif', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.798Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('eb0fa6d3-0367-497e-82eb-e1b4ba146f5e'::uuid, 5372, 5637507576, 'dr-bushra-assery', 'Dr. Bushra Assery', 'د. بشرى عسيري', '/doctors/dr-bushra-assery.webp', 'Saudi Board of General Pediatrics', 'General Pediatrics Consultant and Assistant Professor', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('082f2329-0382-415c-83f4-3ce7b329b9ab'::uuid, NULL, NULL, 'dr-dana-alyafi', 'Dr. Dana Alyafi', 'د. دانة اليافي', '/doctors/dana-alyafi.webp', 'American Board of Orthodontics', 'Orthodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:48.922Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1d68ae5d-34dd-4bbf-b2a1-0cf2ef5176f3'::uuid, 2846, 5637271326, 'dr-dekra-bazarah', 'Dr. Dekra Bazarah', 'د. ذكرى بازرعة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DekraBazarah.jpeg', 'Arab and Saudi Board of Family Medicine  American Diploma of Lifestyle Medicine', 'Family Medicine Consultant and Breastfeeding Trainer', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('36ca5f04-2a33-4362-ae66-11c0befd61b3'::uuid, 394, 5637200076, 'dr-dena-khawandanah', 'Dr. Dena Khawandanah', 'د. دينا خوندنه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrDenaKhawandanah.jpg', 'American Board of Endocrinology Diabetes and Metabolism American Board of Internal Medicine', 'Endocrinology and Diabetes Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('be132fc2-627a-4ab1-8a4c-9700fcd58b4c'::uuid, 3912, 5637419836, 'dr-ekram-elshahidy', 'Dr. Ekram Elshahidy', 'د. اكرام الشهيدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Egyptian Board of Pediatrics Masters Degree in Pediatrics', 'Pediatric Sr Specialist', ARRAY['Pediatrics']::text[], 'Senior Specialist', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ed25c8bb-1238-4902-8a28-00bae1056a6c'::uuid, NULL, NULL, 'dr-elham-elsahafi', 'Dr. Elham Elsahafi', 'د. إالهام الصحفي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-elham-elsahafi', 'Doctorate in Oral Medicine – King''s College London, UK', 'Consultant in Oral Medicine and Aesthetic Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:49.531Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5878c07a-8fbc-44c0-bda8-ddfcd65d5da3'::uuid, NULL, NULL, 'dr-emad-albadawi', 'Dr. Emad Albadawi', 'د. عماد البدوي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-emad-albadawi', 'Doctorate in Pediatric Dentistry – USA
American Board Certified in Pediatric Dentistry', 'Pediatric Dentistry Consultant 
TMJ Disorders and Orofacial Pain Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:49.044Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dc1a43b1-19fe-4c80-a52d-07ebcf73f12b'::uuid, 3221, 5637334468, 'dr-eman-kasim', 'Dr. Eman Kasim', 'د. ايمان قاسم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Eman_Kasim.png', 'Saudi Board of Obstetrics and Gynecology American Fellowship in Cosmetic Gynecology', 'Obstetrics and Gynecology Consultant Cosmetic Gynecology Subspecialty', ARRAY['Dermatology & Cosmetics','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a22d9dd3-1100-4616-989a-4877b0a1de16'::uuid, 3750, 5637407828, 'dr-eman-mahmoud', 'Dr. Eman Mahmoud', 'د. ايمان محمود', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/EmanMahmoud.jpg', 'Master’s Degree in Audio Vestibular Medicine', 'Audio Vestibular Specialist', ARRAY['Audio-vestibular & Speech']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2dd3e63c-93b9-42ac-a6a4-2325e6291512'::uuid, 172, 5637145327, 'dr-eman-obaid', 'Dr. Eman Obaid', 'د. ايمان عبيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrEmanObaid.jpg', 'American Board of Audiology for Tinnitus Management Master’s Degree in Audio-Vestibular Medicine Certified in dizziness/balance Assessment & Management - American Institute of Balance - USA', 'Audio Vestibular Specialist', ARRAY['Audio-vestibular & Speech']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1ede62d8-6852-44c4-8a36-d0625f34ff50'::uuid, 3078, 5637320083, 'dr-enad-alsolami', 'Dr. Enad Alsolami', 'د. عناد السلمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/EnadAlsolami.png', 'Canadian American Board of Internal Medicine Nephrology Canadian Fellowship in Transplant Nephrology', 'Nephrology Consultant', ARRAY['Nephrology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('060c8c17-cd33-4cf7-a57f-287903e765a3'::uuid, 3621, 5637387605, 'dr-enas-hamama', 'Dr. Enas Hamama', 'د. ايناس حمامة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Egyptian Fellowship in Family Medicine', 'Family Medicine Sr Specialist', ARRAY['Family Medicine']::text[], 'Senior Specialist', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('eacb135c-749c-47b4-9714-1178624cba23'::uuid, 3384, 5637365077, 'dr-essam-alghmadi', 'Dr. Essam Alghamdi', 'د. عصام الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Essam.png', 'Arab Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia','Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ad1a6783-95e3-494a-94e2-363434790b40'::uuid, 4894, 5637483721, 'dr-eyad-faizo', 'Dr. Eyad Faizo', 'د. اياد فيزو', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'German Board of Neurosurgery & Spine Surgery German Fellowship in Stereotactic, Functional Neurosurgery & Neuromodulation', 'Neurosurgery & Spine Surgery Consultant', ARRAY['Neurology','Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d32bbb29-39fc-4520-b566-e0353dd76908'::uuid, NULL, NULL, 'dr-eyad-fathi', 'Dr. Eyad Fathi', 'د. إياد فتحي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-eyad-fathi', 'Bachelor’s Degree in Dental Medicine & Surgery
Master’s Degree in Prosthodontics', 'Prosthodontics Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:49.648Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('70232b57-0551-4597-a9de-3d402a642732'::uuid, 3102, 5637321585, 'dr-faeg-sawaf', 'Dr. Faeg Sawaf', 'د. فايق صواف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Fayig.Sawaf.jpeg', 'Canadian Fellowship in Sports Medicine Surgery and Arthroplasty, Australian Fellowship in Lower Limb, Osseointegration, Arthroscopy & Reconstruction', 'Orthopedic Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('eb53e120-dd3a-408b-a7f7-f50cee265fed'::uuid, NULL, NULL, 'dr-fahad-aladwani', 'Dr. Fahad Aladwani', 'د. فهد العدواني', '/doctors/fahad-aladwani.webp', 'Saudi Board of Periodontics & Implants', 'Periodontics & Dental Implants Sr. Specialist', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:49.810Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cddd19ac-e126-4a90-8cce-9d6ba3b9c925'::uuid, 4493, 5637458940, 'dr-fahad-alruwaily', 'Dr. Fahad Alruwaily', 'د. فهد الرويلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FahadAlruwaily.jpg', 'German Board of Ophthalmology German Fellowship in Vitreoretinal Diseases & Surgery', 'Ophthalmology Vitreoretinal Disease & Surgery Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ce294bc2-daab-4069-9a0b-29e4a7c01185'::uuid, 5060, 5637494826, 'dr-fahad-bamehriz', 'Dr. Fahad Bamehriz', 'د. فهد بامحرز', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Fellowship in Advanced Laparoscopic & Robotic & Bariatric Surgery', 'Advanced Laparoscopic & Robotic & Bariatric Surgeon Consultant', ARRAY['General & Bariatric Surgery']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0df7bf83-9218-4508-8290-b4a0411a9891'::uuid, 4504, 5637456596, 'dr-fahad-essa', 'Dr. Fahad Essa', 'د. فهد عيسى', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Fellowship in Pulmonology Canadian Fellowship in Interventional Pulmonology', 'Internal Medicine & Pulmonology Consultant', ARRAY['Internal Medicine','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b3a2d711-3bd7-428a-980c-40b0e961b659'::uuid, 4959, 5637488082, 'dr-faisal-almuhizi', 'Dr. Faisla Almuhizi', 'د. فيصل المهيزع', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrFaisalAlMuhizi.png', 'Canadian Fellowship in Drug Allergy Saudi Fellowship in Allergy & Immunology Saudi Board of Internal Medicine', 'Allergy, Asthma & Immunology Consultant', ARRAY['Allergy & Immunology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a9e3e239-e46e-450e-8b40-cffbee552c69'::uuid, 5622, 5637524083, 'dr-fajr-alsaeedi', 'Dr. Fajr Alsaeedi', 'فجر الصعيدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FajrSaeedi.jpg', 'Saudi Board of Pediatrics', 'Pediatric Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('41fd0cef-f22e-419c-a7f0-7d11db13d277'::uuid, 3122, 5637323829, 'dr-faris-alhejaili', 'Dr. Faris Alhejaili', 'د. فارس الحجيلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FarisAlhejaili.png', 'Canadian Board of Pulmonology & Sleep Medicine', 'Pulmonary Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4322b8ec-a8ea-4747-8ed1-3f895bdff3e1'::uuid, 3824, 5637416078, 'dr-faris-althubaiti', 'Dr. Faris Althubaiti', 'د. فارس الثبيتي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.FarisAlthubaiti.jpeg', 'French Board of Pediatrics French Fellowship in Pediatric Neurology', 'Pediatric Neurology Consultant', ARRAY['Neurology','Pediatrics','Urology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8b45d3ea-3dc6-4d1a-b6b8-4fcf4d9c1eb5'::uuid, 4699, 5637467153, 'dr-fatimah-albrekkan', 'Dr. Fatimah Albrekkan', 'د. فاطمة البريكان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'American Board in Psychiatry', 'Adult Psychiatry & Psychodynamic Psychotherapy Consultant', ARRAY['Psychiatry & Psychology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a1f8dab9-99bc-422d-ad2e-f26305b64f2a'::uuid, 3315, 5637350076, 'dr-fatma-salem', 'Dr. Fatma Salem', 'د. فاطمة سالم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Fellowship in Gastroenterology Hepatology and Endoscopy Saudi Board of Internal Medicine', 'Gastroenterology Hepatology and Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('891d0766-8913-4b39-963d-e76fe5278c61'::uuid, 175, 5637154330, 'dr-fawaz-alhumaid', 'Dr. Fawaz Alhumaid', 'د. فواز الحميد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrFawazHamaid.jpg', 'Canadian Board of Neurology, Canadian Fellowship in Nerve Electrophysiology (EEG/ECG) and Botox', 'Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('848034dc-b93f-4380-9646-bce22e0366f7'::uuid, NULL, NULL, 'dr-fawziah-gomri', 'Dr. Fawziah Gomri', 'د. فوزيه قمري', NULL, 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:49.926Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a4af987e-ed33-45ca-a6ce-4fb6b70dc56e'::uuid, 5468, 5637511343, 'dr-fayez-felemban', 'Dr. Fayez Felemban', 'د. فايز فلمبان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FaizFelemban.jpg', 'Canadian Board of Orthopedic Surgery', 'Orthopedic Knee and Hip Arthroplasty Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('770963cb-d8f3-4ca6-a187-6ea9bf816780'::uuid, NULL, NULL, 'dr-feras-mirdad', 'Dr. Feras Mirdad', 'د. فراس مرداد', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-feras-mirdad', 'Prosthodontics Boston university 
Restorative Dentistry UCLA', 'Specialist in Prosthodontics and Cosmetic Dentistry', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.043Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('bfad954a-2284-4f00-9e07-2924ccefc844'::uuid, NULL, NULL, 'dr-fetoun-alhashemy', 'Dr. Fetoun Alhashemy', 'د. فتون الهاشمي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-fetoun-alhashemy', 'Saudi Board of Pediatric Dentistry', 'Pedodontics Sr. Specialist', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.160Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1c94649b-4c1c-432c-9a9f-637334104880'::uuid, NULL, NULL, 'dr-futoon-abualfaraj', 'Dr. Futoon Abualfaraj', 'د. فتون أبو الفرج', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-futoon-abualfaraj', 'Bachelor’s Degree of Oral & Dental Hygiene - USA', 'Dental Hygienist', ARRAY['Dental']::text[], 'Dental Hygienist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.350Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c2559b0f-d187-4b4b-b3e1-0347adb7c9ef'::uuid, 5634, 5637524850, 'dr-ghufran-abudawood', 'Dr. Ghufran Abudawood', 'د. غفران ابو داوود', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Ophthalmology, Prince Sultan Military Medical City Fellowship in Glaucoma and Cataract Surgery', 'Ophthalmology Glaucoma and Cataract Surgery Sr. Specialist', ARRAY['Ophthalmology']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('3212015e-d5a7-4614-b42b-3f4b3971bb75'::uuid, 176, 5637163335, 'dr-hadeel-tours', 'Dr. Hadeel Tours', 'د. هديل تورس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.hadeel.Tours.jpeg', 'Masters Degree of Marital and Family Therapy', 'Adult psychologist Marriage and Family Therapist', ARRAY['Family Medicine','Psychiatry & Psychology']::text[], '', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('00719d5e-e4ee-47ee-bcc6-9662fc9a6423'::uuid, 5584, 5637522577, 'dr-haifa-alfalah', 'Dr. Haifa Alfalah', 'د. هيفاء الفلاح', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/femaleDoctor.jpg', 'American fellowship in Laser and Dermatosurgery ,Saudi board in Dermatology ,Arab board in Dermatology', 'Dermatology, Laser & Dermatosurgery Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fcee0538-1734-4b62-bea5-82a3fd57f04e'::uuid, 177, 5637147576, 'dr-hamid-madani', 'Dr. Hamid Madani', 'د. حامد مدني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HamidAlmadani.jpg', 'Canadian Fellowship in Rheumatology American Board of Rheumatology', 'Rheumatology Consultant', ARRAY['Rheumatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b9620a2b-9e73-4ad7-8732-f545d11677a0'::uuid, 5070, 5637498576, 'dr-hammam-alghamdi', 'Dr. Hammam Alghamdi', 'د. همام الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Hammam.Alghamdi.j.jpg', 'Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d9635a36-3df1-441d-93dc-b93637e505cb'::uuid, NULL, NULL, 'dr-hammam-bahammam', 'Dr. Hammam Bahammam', 'د. همام باهمام', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-hammam-bahammam', 'Doctor of Science in Pediatric Dentistry (DScD),
Boston University, USA
American Board of Pediatric Dentistry 
Canadian Board of Pediatric Dentistry 
Fellow of the Royal College of Dentist Canada of Pediatric Dentistry', 'Pediatric Dentistry Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.587Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('add24079-43cb-46da-80b5-1ac3f5ed50f6'::uuid, 3175, 5637330577, 'dr-hamza-alofi', 'Dr. Hamza Alofi', 'د. حمزة العوفي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HamzaAlofi.png', 'German Board of Orthopedic Trauma Surgery German Fellowship in Bones  Joints Reconstruction Certified Foot  Ankle Surgeon Germany', 'Orthopedic and Trauma Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.218Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('95d278ee-9845-459e-8390-1f74848bb7dc'::uuid, 326, 5637156576, 'dr-hanaa-rajab', 'Dr. Hanaa Rajab', 'د. هناء رجب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Hanna.Rajab.jpeg', 'Saudi Board of Internal Medicine', 'Internal Medicine Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('916df51c-a292-4230-8030-143a41a89b84'::uuid, 3231, 5637333801, 'dr-haneen-imam', 'Dr. Haneen Imam', 'د. حنين امام', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Haneen.Imam.jpeg', 'Masters Degree in Abnormal and Clinical Psychology UK', 'Clinical Psychologist', ARRAY['Psychiatry & Psychology']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('532501b5-6c13-4182-b2d8-6b93da9c3d16'::uuid, 3741, 5637398080, 'dr-hani-aslan', 'Dr. Hani Aslan', 'د. هاني اصلان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Masters Degree in Ophthalmology', 'Ophthalmology Specialist', ARRAY['Ophthalmology']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Khalidiyyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4dd40ab7-4775-4980-ac16-a26f469306bf'::uuid, NULL, NULL, 'dr-hani-mawardi', 'Dr. Hani Mawardi', 'د. هاني ماوردي', '/doctors/hani-mawardi.webp', 'Doctorate of Oral Biology - USA
American Board of Periodontics, Dental Implant, & Oral Medicine', 'Periodontics, Dental Implant, & Oral Medicine Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.703Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('bb563207-21c0-4786-af59-94e9d7d1b5b6'::uuid, 3305, 5637348577, 'dr-hani-shalabi', 'Dr. Hani Shalabi', 'د. هاني شلبي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/hanishalabi82.png', 'American Board and Fellowship in Endocrinology Diabetes and Metabolism', 'Endocrinology Diabetes and Metabolism Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c74b5140-1e01-4b3b-8071-31f179feaf00'::uuid, 2924, 5637289326, 'dr-hanin-abduljabar', 'Dr. Hanin Abduljabar', 'د. حنين عبدالجبار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HaninAbduljabar.png', 'Board and Fellowship of the Royal College of Surgeons of Canada in Obstetrics and Gynecology', 'Obstetrics and Gynecology Reproductive Endocrinology and Infertility Consultant', ARRAY['Endocrinology & Diabetes','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('afa03006-0111-4797-bf43-594d4b5c3bc2'::uuid, 3300, 5637347078, 'dr-harbi-shawosh', 'Dr. Harbi Shawosh', 'د. حربي شاووش', '/doctors/dr-harbi-shawosh.webp', 'Arab Board of Pediatrics', 'Pediatric Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Tahlia','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a69d6454-a6f0-40e5-94f3-e0b24857d58b'::uuid, NULL, NULL, 'dr-hasan-abed', 'Dr. Hasan Abed', 'د. حسن عابد', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-hasan-abed', 'Doctorate of Special Care Dentistry & Conscious Sedation
Master’s Degree in Special Care Dentistry
British Fellowship in Clinical Conscious Sedation', 'Conscious Sedation & Special Care Dentistry Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.860Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('44e2832c-652f-4a92-aeea-d0f0a57e73fe'::uuid, 4861, 5637483683, 'dr-hashim-balubaid', 'Dr. Hashim Ballubaid', 'د. هاشم بالبيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrBalubaid.PNG', 'Saudi Board of Internal Medicine Canadian Fellowship in Geriatric Medicine', 'Geriatric Medicine Consultant', ARRAY['Geriatric Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c59b5ecf-3b03-4d95-a349-2771e8a723ec'::uuid, 5179, 5637500076, 'dr-hasnaa-ali', 'Dr. Hasnaa Ali', 'د. حسناء علي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Master’s Degree in Pediatrics', 'Pediatric Specialist', ARRAY['Pediatrics']::text[], 'Specialist', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2a901a90-cd8b-4244-add4-0c09ba744388'::uuid, 3423, 5637368076, 'dr-hassan-jaber', 'Dr. Hassan Jaber', 'د. حسن جابر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HassanJaber.jpg', 'Doctorate of Neurosurgery from Germany', 'Neurosurgery Consultant', ARRAY['Neurology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:17.666Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('76073263-b46f-43dd-af73-1ce9674a33ca'::uuid, 5378, 5637509078, 'dr-hatim-batawi', 'Dr. Hatim Batawi', 'د. حاتم بتاوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.HatimBatawi.jpg', 'Canadian Board of Ophthalmology Canadian Fellowship in Medical and Surgical Retinal', 'Ophthalmology, Retinal Diseases and Cataracts Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('60165822-d3ae-4a94-98bc-fd5e6ad5ab05'::uuid, NULL, NULL, 'dr-hayel-makhashin', 'Dr. Hayel Makhashin', 'د. هايل مخاشن', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-hayel-makhashin', 'Egyptian Board of Oral & Maxillofacial Surgery', 'Oral & Maxillofacial Surgery Sr. Specialist', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.467Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6bd29210-f5ec-4064-a6f1-3fa4b2ed4912'::uuid, 3711, 5637398827, 'dr-haziz-albiladi', 'Dr. Haziz Albiladi', 'د. حظيظ البلادي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HazizAlbiladi.jpg', 'Arab Board of Internal Medicine Saudi Fellowship in Gastroenterology', 'Gastroenterology Hepatology and Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f1cb5ad1-603b-43bb-8439-06d2f78dcb2c'::uuid, NULL, NULL, 'dr-heba-binabid', 'Dr. Heba Binabid', 'د. هبه بن عابد', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-heba-binabid', 'Certificate in Esthetic & Restorative - USA', 'Dental Esthetic & Restorative Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:50.979Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8bd2569d-c3f0-465b-b478-2e3db8cb6015'::uuid, 4111, 5637434828, 'dr-hind-alnajashi', 'Dr. Hind Alnajashi', 'د. هند النجاشي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Neurology Canadian Fellowship in Multiple sclerosis', 'Neurology and Multiple Sclerosis Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('bf39002b-b085-4c81-9054-6f25a5da21c1'::uuid, 3879, 5637418342, 'dr-hind-alshanbari', 'Dr. Hind Alshanbari', 'د. هند الشنبري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.HindAlshanbari.jpeg', 'Saudi Board of Pediatrics Saudi Fellowship in Pediatric Infectious Diseases', 'Pediatric & Infectious Diseases Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Obhour','Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2f31ba71-ac3d-487b-82cb-3de5399676a8'::uuid, NULL, NULL, 'dr-hisham-komo', 'Dr. Hisham Komo', 'د. هشام كومو', '/doctors/hisham-komo.webp', 'Saudi Board of Oral & Maxillofacial Surgery', 'Oral & Maxillofacial Surgery Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.100Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('51bc5dd8-7a5d-46b8-a4d1-8c495e8e4d56'::uuid, 310, 5637174577, 'dr-hossam-alamoodi', 'Dr. Hossam Alamoodi', 'د. حسام العمودي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrHosamAmoodi.jpg', 'Canadian Board and Fellowship in Otology and Neuroethology', 'ENT Otology and Neurotology Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7922460e-6258-4bfd-9992-3b26b9bc7a8c'::uuid, 178, 5637145331, 'dr-hossam-mousa', 'Dr. Hossam Mousa', 'د. حسام موسى', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrHossamMoussa.jpg', 'Arab Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ed4eb539-ee34-4f70-8d02-15f35174aa28'::uuid, 3410, 5637367326, 'dr-husam-alim', 'Dr. Husam Alim', 'د. حسام عالم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/HusamAlim.jpg', 'American Board of Endocrinology, Diabetes & Metabolism American Fellowship in Geriatric Medicine', 'Endocrinology, Diabetes, Obesity and Geriatric Medicine Consultant', ARRAY['Endocrinology & Diabetes','Geriatric Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d936db2c-7312-46f2-8ec4-6bb67bc5e55a'::uuid, 3801, 5637414586, 'dr-husam-malibary', 'Dr. Husam Malibary', 'د. حسام مليباري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.HussamMalibary.jpeg', 'Canadian Board in Internal Medicine Canadian Fellowship in Allergy and Immunology', 'Allergy and Immunology Consultant', ARRAY['Allergy & Immunology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d39b7a49-a6cf-4cc0-9c04-7e5927e20c8e'::uuid, NULL, NULL, 'dr-hussam-shawli', 'Dr. Hussam Shawli', 'د. حسام شاولي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-hussam-shawli', 'Saudi Board in Oral and Maxillofacial Surgery', 'Oral & Maxillofacial Surgery and Dental Implant Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.226Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cbc92862-2d8e-48af-800b-bc02734c1fc9'::uuid, 3460, 5637372596, 'dr-ibraheem-algarni', 'Dr. Ibraheem Algarni', 'د. ابراهيم القرني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/IbraheemAlgarni.jpg', 'American Board of Family Medicine American Board of Sports Medicine', 'Family and Sports Medicine Consultant', ARRAY['Family Medicine','Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d6d2fd34-b72c-4b9f-81fb-d42a0d565b93'::uuid, NULL, NULL, 'dr-ibrahim-abdulmalik', 'Dr. Ibrahim Abdulmalik', 'د. إبراهيم عبدالمالك', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ibrahim-abdulmalik', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.385Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('766b52ca-a9d3-4533-a09e-fbc71e3eeaf8'::uuid, 4683, 5637467200, 'dr-ibrahim-alfawaz', 'Dr. Ibrahim Alfawaz', 'د. ابراهيم الفواز', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/IbrahimAlfawaz.jpg', 'Saudi Board in Family Medicine', 'Family Medicine Associate Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ba9828d1-31ed-4eea-ae69-0c65a3fc4ec3'::uuid, 4064, 5637434827, 'dr-ibrahim-alharbi', 'Dr. Ibrahim Alharbi', 'د. ابراهيم الحربي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Board in Pediatrics and Pediatric Hematology Oncology', 'Pediatric Hematology Oncology Consultant', ARRAY['Hematology','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1f28b82d-388b-4a06-9165-01b23f91d264'::uuid, 525, 5637221077, 'dr-ibrahim-alnoury', 'Dr. Ibrahim Alnouri', 'د. ابراهيم النوري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrIbrahimAlnoury.jpg', 'European Board of ENT Head andNeck Surgery Fellow of Pediatric ENT', 'ENT Head and Neck Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e6f2d756-cfb4-429e-961e-6b7edbe8c941'::uuid, 4104, 5637437079, 'dr-ibrahim-balubaid', 'Dr. Ibrahim Balubaid', 'د. ابراهيم بالبيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American andCanadian Board of Gastroenterology Canadian Fellowship in Advanced Therapeutic Endoscopy', 'Gastroenterology and Therapeutic Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('85770a2c-9edc-4cee-90c3-6bfe8256951b'::uuid, 3622, 5637386860, 'dr-islam-abouelmagd', 'Dr. Islam Abouelmagd', 'د. اسلام ابو المجد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/IslamAbouelmagd.jpg', 'Doctorate of Family Medicine Masters Degree in Pediatrics', 'Family Medicine and Pediatric Sr Specialist', ARRAY['Family Medicine','Pediatrics']::text[], 'Senior Specialist', ARRAY['Al Tahlia','Obhour','Al Mohammadiyah','Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9ba70ff2-4420-4deb-8b33-5bab22dd0c28'::uuid, 180, 5637145328, 'dr-jamil-waly', 'Dr. Jamil Waly', 'د. جميل ولي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrJamilWaly.jpg', 'American Board of Pediatrics Canadian Fellowship in Allergy and Immunology', 'Pediatric and Allergy Immunology Consultant', ARRAY['Allergy & Immunology','Pediatrics']::text[], 'Consultant', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('db92fee7-f704-48b8-8973-4b01d8ce4283'::uuid, NULL, NULL, 'dr-jawdat-jamluddin', 'Dr. Jawdat Jamluddin', 'د. جودت جمال الدين', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-jawdat-jamluddin', 'Diploma in Periodontics - Lebanon', 'Periodonitic Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9b86cfd3-5867-4b45-a597-9bb9df6a4b64'::uuid, 335, 5637182828, 'dr-jehad-hariri', 'Dr. Jehad Hariri', 'د. جهاد حريري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrJehadHariri.jpg', 'Canadian and American Board of Dermatology American & Int. Board of Dermatopathology', 'Dermatology and Dermatopathology Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('78e3a296-4497-415b-9113-e46cd1023f22'::uuid, NULL, NULL, 'dr-kawthar-albeedh', 'Dr. Kawthar Albeedh', 'د. كوثر البيض', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-kawthar-albeedh', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.625Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('26526e86-543a-4311-9e54-d10405c6cdec'::uuid, 183, 5637147579, 'dr-khadijah-alattas', 'Dr. Khadijah Alattas', 'د. خديجة العطاس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrKhadIjaAlAttass.jpg', 'Canadian Fellowship in Medical Retina', 'Ophthalmology Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('441e41dc-4be3-4fcb-8a03-fa5aceb81f5d'::uuid, 3946, 5637425827, 'dr-khaled-albazli', 'Dr. Khaled Albazli', 'د. خالد البذلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.KhaledAlbazli.jpeg', 'American Board of Neurology American Fellowship in Neuromuscular Medicine', 'Adult Neurology and Neuromuscular Medicine Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0f3caab3-d661-4165-8759-3bd6f18453dd'::uuid, 4742, 5637475327, 'dr-khaled-bin-saad', 'Dr. Khaled Bin Saad', 'د. خالد بن سعد', '/doctors/dr-khaled-bin-saad.webp', 'Canadian Fellowship in Academic General Pediatrics', 'General Pediatrics Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2413e0f6-b8da-4619-b890-33cfcb337c60'::uuid, 3121, 5637323828, 'dr-khaled-yaghmour', 'Dr. Khaled Yaghmour', 'د. خالد يغمور', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/KhaledYaghmour.png', 'Arab and Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e931747d-f4c0-4217-aadc-98794ddcce31'::uuid, 4401, 5637444743, 'dr-khalid-alfares', 'Dr. Khalid Alfares', 'د. خالد الفارس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Khaled.Alfares.png', 'American Board of Internal Medicine American Fellowship in Endocrinology, Diabetes & Metabolism', 'Internal Medicine, Endocrinology, Diabetes & Metabolism Consultant', ARRAY['Endocrinology & Diabetes','Internal Medicine']::text[], 'Consultant', ARRAY['Obhour','Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4b6ccfcf-ec43-45d2-9e62-2e514ff0d85d'::uuid, 4932, 5637487326, 'dr-khalid-alhussaini', 'Dr. Khalid Alhussaini', 'د. خالد الحصيني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Khaled.alHussaini.png', 'Saudi Board of Internal Medicine Saudi Fellowship in Gastroenterology European & British Fellowship in Gastroenterology & Hepatology', 'Gastroenterology, Hepatology & Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1102153b-d7e8-44e8-b48d-b854da61d420'::uuid, 5026, 5637492579, 'dr-khalid-almatham', 'Dr. Khalid Almatham', 'د. خالد المعثم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/KhaledAlmatham.png', 'Canadian Fellowship in Nephrology & Glomerulonephritis', 'Nephrology Consultant', ARRAY['Nephrology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5d6dcf43-51fc-4e61-a7f1-6ecf654d4a87'::uuid, 4027, 5637431826, 'dr-khalid-alsahhar', 'Dr. Khalid Alsahhar', 'د. خالد السحار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.KhaledAlsahhar.jpeg', 'Traumatology & Orthopedic Surgery Specialization', 'Orthopedic Specialist', ARRAY['Orthopedics']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('45f8fc11-fc6a-4568-b67a-42877567cbdf'::uuid, 4910, 5637483770, 'dr-khalid-bin-naji', 'Dr. Khalid Bin Naji', 'د. خالد بن ناجي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/KhalidNaji.png', 'Canadian Fellowship in Advanced Cardiac Imaging', 'Cardiology & Advanced Cardiac Imaging Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('db6da996-d0f3-4c2a-b06f-f7223a566061'::uuid, 3567, 5637383829, 'dr-khulood-alaidaroos', 'Dr. Khulood Alaidaroos', 'د. خلود العيدروس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.KhuloodAlaidaroos.jpeg', 'Bachelor’s Degree of Medicine & Surgery', 'Pediatric Specialist', ARRAY['Pediatrics']::text[], 'Specialist', ARRAY['Al Tahlia','Obhour','Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c269f14f-1db1-4b30-8fc2-595ab3bfd661'::uuid, 1759, 5637260077, 'dr-laila-aissawi', 'Dr. Lila Aissawi', 'د. ليلى عيسوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Laila.Aissawi.jpeg', 'Diploma in Obstetrics and Gynecology Aesthetic Gynecology Diploma', 'Obstetrics and Gynecology Specialist', ARRAY['Obstetrics & Gynecology']::text[], 'Specialist', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('501f434e-0876-4c91-ba32-1c456faa563e'::uuid, 4091, 5637435626, 'dr-laila-alghamri', 'Dr. Laila Alghamri', 'د. ليلى الغمري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Arab & Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia','Obhour','Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c20eeb41-adae-4722-93e2-487e839bb8bc'::uuid, 4730, 5637473826, 'dr-laila-salamah', 'Dr. Laila Salamah', 'د. ليلى سلامة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Master’s Degree of Science in Speech & Language Pathology FEES, Hanen & Prompt Certified for Speech, Language & Swallowing Disorders', 'Audio Vestibular & Speach', ARRAY['Audio-vestibular & Speech']::text[], '', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('50ccdb26-1316-464a-a178-48809c167ae6'::uuid, NULL, NULL, 'dr-lalyan-bahha', 'Dr. Lalyan Bahha', 'د. لليان بحه', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-lalyan-bahha', 'Saudi Board in Prosthodontics', 'Consultant Prosthodontics & Cosmetic Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.742Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fe1fcae1-2f3e-4844-a44f-e7f3e2327d04'::uuid, 4105, 5637437096, 'dr-lama-ghandoura', 'Dr. Lama Ghandoura', 'د. لمى غندوره', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Lama_Ghandoura.jpg', 'Saudi Board of Family Medicine', 'Family Medicine Sr. Specialist', ARRAY['Family Medicine']::text[], 'Senior Specialist', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ba87148a-430a-4277-b1ae-90addec572c0'::uuid, NULL, NULL, 'dr-lama-samanoudi', 'Dr. Lama Samanoudi', 'د. لمى سمنودي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-lama-samanoudi', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:51.907Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c7af8f96-c1df-41e2-b5cc-b409aca3c003'::uuid, NULL, NULL, 'dr-lina-alsharif', 'Dr. Lina AlSharif', 'د. لينا الشريف', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-lina-alsharif', 'Saudi Board in Endodontics', 'Senior Registrar in Endodontics', ARRAY['Dental']::text[], 'Senior Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.025Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('11b6b8b0-bee2-4a17-825d-d46ca52280e9'::uuid, 5713, 5637529326, 'dr-lojain-almadfaa', 'Dr. Lojain Almadfaa', 'د. لجين المدفع', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/LojainAlmadfaa.jpg', 'Saudi Board in Pediatric Medicine, National Guard Hospital (NGH), Jeddah.', 'Pediatric', ARRAY['Pediatrics']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ee13ddf0-717e-4640-8e99-2c1d58bbdc93'::uuid, NULL, NULL, 'dr-lojain-bassyouni', 'Dr. Lojain Bassyouni', 'د. لوجين بسيوني', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-lojain-bassyouni', 'Canadian Board & Fellowship of Oral & Maxillofacial Surgery', 'Oral & Maxillofacial Surgery Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.175Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('29920cbe-882f-48a2-a070-76228e76778a'::uuid, 4564, 5637460329, 'dr-lolwah-alashgar', 'Dr. Lolwah Alashgar', 'د. لولوة الاشقر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Lulua.PNG', 'Saudi Fellowship in Endocrinology & Diabetes', 'Endocrinology Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d40bad06-f06c-4a4d-bfb2-7af360908cd0'::uuid, 5542, 5637518826, 'dr-lowloh-alotaibi', 'Dr. Lowloh Alotaibi', 'د. لولوه العتيبي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/LowlohAlotaibiApp.jpg', 'Consultant internal Medicine/ Diabetes Management', 'internal Medicine', ARRAY['Internal Medicine']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('094b788e-f582-41bb-9832-6365bbffd2c5'::uuid, 3492, 5637377828, 'dr-lujain-idriss', 'Dr. Lujain Idriss', 'د. لجين ادريس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/LujainIdriss.jpg', 'Saudi Board of Ophthalmology King Khaled Eye Specialist Hospital Fellowship in Cornea Cataract  Re', 'Cornea Cataract Refractive Surgery and Uveitis Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7b62807d-6cd5-4297-8d9b-ec12bb498302'::uuid, 5659, 5637526329, 'dr-lujain-khoj', 'Dr. Lujain Khoj', 'د. لجين خوج', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/LujainKhoj.jpg', 'Saudi Board of Internal Medicine', 'Pulmonary', ARRAY['Pulmonology & Sleep Medicine']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4a96f0f2-18a6-4c55-aed3-44df81517bd1'::uuid, 5343, 5637506169, 'dr-maan-abuzaid', 'Dr. Maan Abuzaid', 'د. معن ابو زيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MaanAbuzaid.jpg', 'Saudi Board of Pediatrics Saudi Fellowship in Perinatal & Neonatal Medicine', 'Pediatric, Neonatal & Perinatal Medicine Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4c725172-5b5a-4aaa-9ee2-860b34b44987'::uuid, 4041, 5637433331, 'dr-mahmoud-alageeli', 'Dr. Mahmoud Alageeli', 'د. محمود العقيلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/maleDoctor.jpg', 'Canadian Fellowship in Otolaryngology and Head and Neck Surgery', 'Otolaryngology, Head & Neck Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('df61e86f-bd5a-496c-947b-fb2337b71589'::uuid, 3998, 5637428827, 'dr-mahmoud-shaheen', 'Dr. Mahmoud Shaheen', 'د. محمود شاهين', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MahmoudShaheen.jpeg', 'Doctorate of Internal Medicine Egypt', 'Internal Medicine & ​Nephrology Consultant', ARRAY['Internal Medicine','Nephrology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('52a1e1c2-72d2-4c0c-9a33-7d7435407632'::uuid, 4693, 5637469333, 'dr-majed-albarrak', 'Dr. Majed Albarrak', 'د. ماجد البراك', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MajedAlbarrak.jpg', 'Canadian Board of Otolaryngology, Head & Neck Surgery for Adults & Pediatrics Canadian Fellowship in Head & Neck Surgical Oncology', 'ENT, Thyroid, Head & Neck, Reconstructive Facial Plastic Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4c5990c7-3a2b-43e7-86c4-16acd61f0b1f'::uuid, 3210, 5637333578, 'dr-majed-alnabulsi', 'Dr. Majed Alnabulsi', 'د. ماجد النابلسي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MajedAlnabulsi.jpg', 'American Board of Internal Medicine, American Board of Lifestyle Medicine', 'Internal Medicine Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4d65c5ee-f4b3-4d4e-8423-87ab87e9e2c1'::uuid, NULL, NULL, 'dr-majed-althubaiti', 'Dr. Majed Althubaiti', 'د. ماجد الثبيتي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-majed-althubaiti', 'Saudi Board of Periodontics & Implants', 'Consultant in Periodontics & Implant Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.446Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7b41fb1b-14b4-45cc-b98c-9888eaaff45c'::uuid, 5549, 5637518100, 'dr-majed-alzahrany', 'Dr. Majed Alzahrany', 'د. ماجد الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Board of Neurology', 'Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6e2524db-cb47-4b34-a8ef-c38ac3016cdb'::uuid, NULL, NULL, 'dr-majed-basharahil', 'Dr. Majed Basharahil', 'د. ماجد باشراحيل', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-majed-basharahil', 'Master’s Degree in Pediatric Dentistry', 'Pedodontics Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.323Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0a66f885-0286-4b32-ace7-1486102873f4'::uuid, 3040, 5637314826, 'dr-majed-sejiny', 'Dr. Majed Sejiny', 'د. ماجد سجيني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Majed.Sejiny.jpeg', 'French & European Board of Urology, French Fellowship in Endo-Urology', 'Urology and Endo-Urology Consultant', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('540b4060-2352-4f6c-aa5f-2125d2576f1c'::uuid, 5281, 5637506092, 'dr-mamdouh-masri', 'Dr. Mamdouh Masri', 'د. ممدوح مصري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MamdouhAlmasri.jpg', 'Canadian Fellowship in Orthopedic Surgery, Upper Extremity, Sport Medicine and Arthroplasty', 'Orthopedics Surgery, Arthroscopy, Joint Replacement and Sports Medicine Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:18.711Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('57c8903d-fc95-458a-8b18-4630da9adcd7'::uuid, 5256, 5637505327, 'dr-mana-alshahrani', 'Dr. Mana Alshahrani', 'د. مانع الشهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Mani.AlShhrani.jpg', 'KSU Sleep Medicine Fellowship ESRS Sleep Medicine Fellowship', 'Family Medicine & Sleep Medicine Consultant', ARRAY['Family Medicine','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ec192d09-ae7a-40ce-beef-ccf5584b55fa'::uuid, NULL, NULL, 'dr-manab-benten', 'Dr. Manab Benten', 'د. مناب بنتن', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-manab-benten', 'Master''s of Oral Sciences from The University at Buffalo
New York, USA - American Board of Orofacial Pain', 'Orofacial Pain, TMJ & Sleep Medicine Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.564Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('06d07bb0-0c04-4b50-8ace-3d5db58a3ea9'::uuid, 4051, 5637432576, 'dr-mansoor-radwi', 'Dr. Mansoor Radwi', 'د. منصور رضوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/maleDoctor.jpg', 'American and Canadian Board in Internal Medicine Hematology for Adults Canadian Fellowship in Bleed', 'Adult Hematology Consultant', ARRAY['Hematology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('81067471-1d9f-44ee-a0d3-67d788abda58'::uuid, 712, 5637249576, 'dr-maram-alshareef', 'Dr. Maram Alshareef', 'د. مرام الشريف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaramAlshareef.png', 'Arab  Saudi Board of Family Medicine Canadian Board of Chronic Pain Management', 'Family Medicine and Chronic Pain Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('53900252-6385-425e-8c96-b32e455ac6eb'::uuid, 2887, 5637277329, 'dr-marwa-alsaggaf', 'Dr. Marwa Alsaggaf', 'د. مروة السقاف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Bachelor Degree of Medicine and Surgery', 'Doctor in Women Health Department', ARRAY['Obstetrics & Gynecology']::text[], '', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b640fc5e-1cdc-487e-9219-cd85f436efc2'::uuid, 3725, 5637403326, 'dr-marwan-elkassas', 'Dr. Marwan Elkassas', 'د. مروان القصاص', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Arab & Egyptian Board of Pediatrics', 'Pediatric Sr Specialist', ARRAY['Pediatrics']::text[], 'Senior Specialist', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8d5b6378-1128-4be4-8cc0-da50de30498f'::uuid, 5669, 5637526334, 'dr-marwan-flimban', 'Dr. Marwan Flimban', 'د. مروان فلمبان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MarwanFlimban.jpg', 'Saudi board for general pediatric at King Faisal Specialist Hospital & Research Centre', 'Pediatric', ARRAY['Pediatrics']::text[], '', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('030ce984-285b-4e6e-bf18-02bdf35c4187'::uuid, NULL, NULL, 'dr-marwan-salah-eldin', 'Dr. Marwan Salah Eldin', 'د. مروان صلاح الدين', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-marwan-salah-eldin', 'Master’s Degree in Oral & Dental Surgery
Italian Fellowship in Microscopic Endodontics & Microsurgery', 'Endodontics Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.681Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ed849447-0c68-4fa8-8dff-cbbb11abe778'::uuid, 3282, 5637344833, 'dr-maryam-alyarimi', 'Dr. Maryam Alyarimi', 'د. مريم اليريمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MariyamAlyarimi60.png', 'Saudi Board of Internal Medicine', 'Endocrinology Specialist', ARRAY['Endocrinology & Diabetes']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('398d3fe9-6e3e-4577-8f24-ef0d76222069'::uuid, 653, 5637241326, 'dr-maryam-bamashmous', 'Dr. Maryam Bamashmous', 'د. مريم بامشموس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaryamBa.png', 'Bachelor’s Degree of Medicine & Surgery Master''s Degree in Hearing & Balance - Spain', 'Audio-Vestibular Specialist', ARRAY['Audio-vestibular & Speech']::text[], 'Specialist', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7ff5952b-a204-4848-9870-8234cdbc5c3d'::uuid, 4680, 5637467158, 'dr-maryam-dabbour', 'Dr. Maryam Dabbour', 'د. مريم دبور', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Pediatric  Saudi Fellowship in Pediatric Pulmonory Canadian Fellowship of Pediatric Cystic Fibrosis & Lung Transplant', 'Pediatric Pulmonary, Cystic Fibrosis & Lung Transplant Consultant', ARRAY['Pediatrics','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5e98b64b-8d9e-408c-9f00-e6f69237f36f'::uuid, NULL, NULL, 'dr-maysaa-alsharqawi', 'Dr. Maysaa Alsharqawi', 'د. ميساء الشرقاوي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-maysaa-alsharqawi', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:52.801Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('af0b436b-f553-434c-bd33-20aa99676bb0'::uuid, 589, 5637231576, 'dr-maysoon-algain', 'Dr. Maysoon Algain', 'د. ميسون القين', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMaysoonAlgain.jpg', 'French Board of DermaAmerican Fellowship in Surgical Oncology Canadian Fellowship in Aesthetic Medicine', 'Dermatology Cutaneous Oncology and  Cosmetic Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('86ffb686-384e-4450-ae20-276a8c691500'::uuid, 268, 5637168576, 'dr-mazin-merdad', 'Dr. Mazin Merdad', 'د. مازن مرداد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian and American Fellowship in Head and Neck Oncology', 'ENT Head and Neck Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('21576ed5-62c8-4ced-97b5-6082d40488bf'::uuid, 5697, 5637527835, 'dr-menal-dogan', 'Dr. Menal Dogan', 'د. منال دوغان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MenalDogan.jpg', 'Saudi board in NGH', 'Pediatric', ARRAY['Pediatrics']::text[], '', ARRAY['Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2288383a-a7ca-4fb3-9cd7-76dbf4baf27a'::uuid, 187, 5637149830, 'dr-mervat-qutub', 'Dr. Mervat Qutub', 'د. ميرفت قطب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMervatQutob.jpg', 'American Board of Pediatrics, Canadian Fellowship in Pediatric Infectious Diseases', 'Pediatric and Infectious Diseases Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b8eaa735-b526-450e-912e-4ceb158a0282'::uuid, 3207, 5637333576, 'dr-mirfat-moqbel', 'Dr. Mirfat Moqbel', 'د. ميرفت مقبل', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-mirfat-moqbel', 'Saudi Board of Restorative Dentistry', 'Consultant In Aesthetic & Restorative Dentistry', ARRAY['Dental']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('72bc45f4-2df3-4106-9c72-4850f7771010'::uuid, 5591, 5637523330, 'dr-mohamad-arab', 'Dr. Mohamed Arab', 'د. محمد عرب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohamadArab.jpg', 'Inter-University Diploma in Cardiology - FRANCE', 'Cardiology Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5570d54f-c3b1-4abb-a142-a002266a19fc'::uuid, 190, 5637145326, 'dr-mohamed-abbass', 'Dr. Mohamed Abbas', 'د. محمد عباس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMohamedAbbass.jpg', 'Masters Degree in General Surgery', 'General Surgery Specialist', ARRAY['General & Bariatric Surgery']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('728cf8ba-8dc4-44e9-8d32-48f865dd44bb'::uuid, 704, 5637247330, 'dr-mohamed-abu-elhasan', 'Dr. Mohamed Abu Elhasan', 'د. محمد ابو الحسن', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohamedAbuElhasan.png', 'Bachelor’s Degree of Medicine & Surgery', 'Endocrinology Specialist', ARRAY['Endocrinology & Diabetes']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('54b438b8-3a65-46f8-906a-92f4c36186be'::uuid, 372, 5637193327, 'dr-mohamed-alfawaz', 'Dr. Mohamed Alfawaz', 'د. محمد الفواز', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMohamedAlFawaz.jpg', 'Canadian and American Fellowship in Internal Medicine, Gastroenterology and Hepatology', 'Gastroenterology Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cc4b16d7-d4ac-4987-9709-80b5df1a997b'::uuid, 3385, 5637365601, 'dr-mohamed-elrefaei', 'Dr. Mohamed Elrefaei', 'د. محمد الرفاعي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohamedElrefeai.jpg', 'Egyptian Fellowship in Ophthalmology Masters Degree in Ophthalmology  Egypt', 'Ophthalmology Sr Specialist', ARRAY['Ophthalmology']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('3753a1e4-2263-4ad9-92dd-49d3e3b5fccd'::uuid, 3806, 5637414587, 'dr-mohamed-elsherief', 'Dr. Mohamed Elsherief', 'د. محمد الشريف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MohamedElshrief.jpg', 'Masters Degree in Otorhinolaryngology', 'ENT Specialist', ARRAY['ENT']::text[], 'Specialist', ARRAY['Obhour','Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fd2db6f8-c7eb-47ac-806d-162fcbc8f70d'::uuid, 582, 5637228622, 'dr-mohamed-jamjoom', 'Dr. Mohamed Jamjoom', 'د. محمد جمجوم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohamedJamjoom.jpg', 'Canadian Fellowship in Orthopedic Surgery', 'Orthopedic Surgery and Joint Replacement Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('05885709-6211-46c4-b84d-de3600c90593'::uuid, 5639, 5637525577, 'dr-mohamed-sabry', 'Dr. Mohamed Sabry', 'د. محمد صبري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohamedSabry.jpg', 'Master degree  in Otorhinolaryngology from Egypt', 'ENT Specialist', ARRAY['ENT']::text[], 'Specialist', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0fadf0c3-6e46-46f2-87f6-55ebb5e155c1'::uuid, 193, 5637146076, 'dr-mohamed-zahran', 'Dr. Mohamed Zahran', 'د. محمد زهران', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMohamedZahran.jpg', 'Fellowship in ENT of Royal College of Physicians Ireland', 'ENT Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('175eedcc-afa3-4a07-9895-98af24dd5199'::uuid, 393, 5637200079, 'dr-mohamed-zahrani', 'Dr. Mohamed Zahrani', 'د. محمد زهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Mohammed.Zahrani.jpeg', 'American & Canadian Board of Internal Medicine & Cardiology, Canadian Fellowship in Echo & Valvular Disease', 'Cardiology Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b8ed7e7c-5f35-4e33-90b2-2eb1c32ff6ae'::uuid, 4494, 5637458920, 'dr-mohammad-alsahan', 'Dr. Mohammad Alsahan', 'د. محمد الصحن', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedAlsahan.jpg', 'Canadian Board of Orthopedics Canadian Fellowship in Sports Medicine & Joint Replacement', 'Orthopedic Sports Medicine & Joint Replacement Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c500eba1-4702-48ea-a4fb-6ceff4619659'::uuid, 5043, 5637492589, 'dr-mohammad-munshi', 'Dr. Mohammad Munshi', 'د. محمد منشي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedMunshi.png', 'Swiss & European Board in Dermatology & Venereology, Fellowship in Immunodermatology University of Bern ( Switzerland)', 'Dermatology Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('77c9cb64-3b83-475c-a059-de458147669e'::uuid, 3707, 5637398826, 'dr-mohammed-abdelkader', 'Dr. Mohammed Abdelkader', 'د. محمد عبدالقادر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MohammedAbdulakader.jpg', 'Master’s Degree in Orthopedic Surgery  Cairo', 'Orthopedic Specialist', ARRAY['Orthopedics']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1dd06fe5-1ac4-4a47-af3e-fea0a4fe0eb9'::uuid, 4890, 5637483702, 'dr-mohammed-aldulaym', 'Dr. Mohammed Aldulaym', 'د. محمد الدليم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedBinDulaym.jpg', 'Saudi Board of Pediatric Ophthalmology King Khalid Eye Specialist Hospital Fellowship in Pediatric Ophthalmology & Strabismus', 'Pediatric Ophthalmology & Strabismus Sr. Consultant', ARRAY['Ophthalmology','Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('92ef7413-9444-4c7a-a095-e2c404a26cfa'::uuid, 4794, 5637479828, 'dr-mohammed-aljaffer', 'Dr. Mohammed Aljaffer', 'د. محمد الجعفر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedAljaffer.png', 'Canadian Fellowship in Neuropsychiatry & Forensic Psychiatry', 'Neuropsychiatry Consultant', ARRAY['Psychiatry & Psychology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('631c8491-2531-49b5-aaa0-cb870eefa873'::uuid, 3523, 5637379338, 'dr-mohammed-aljunaid', 'Dr. Mohammed Aljunaid', 'د. محمد الجنيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Mohammed.Aljunaid.jpeg', 'Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0688bd5f-9c55-457f-b087-56c738923fc9'::uuid, 5627, 5637524844, 'dr-mohammed-alotaibi', 'Dr. Mohammed Alotaibi', 'د. محمد العتيبي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrMohammedAbdullah.jpg', 'Canadian Board in Orthopedic Surgery Fellow of the Royal College of Physicians & Surgeons of Canada Canadian Fellowship in Pediatric Orthopedics', 'Pediatric Orthopedic Surgery Consultant', ARRAY['Orthopedics','Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('aeaf820b-75a8-4dcd-bc31-f88b784a92a9'::uuid, 4722, 5637471576, 'dr-mohammed-alsobki', 'Dr. Mohammed Alsobki', 'د. محمد السبكي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Master''s Degree in Hearing & Balance', 'Audio-Vestibular Specialist', ARRAY['Audio-vestibular & Speech']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('68d21864-3921-40c6-a523-b60b98e946d3'::uuid, NULL, NULL, 'dr-mohammed-attar', 'Dr. Mohammed Attar', 'د. محمد عطار', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-mohammed-attar', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.205Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7b9490a7-a000-42b3-85ac-e443bf8c6b30'::uuid, 195, 5637153577, 'dr-mohammed-attiah', 'Dr. Mohammed Attiah', 'د. محمد عطية', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Fellowship of Pediatric Orthopedic and Scoliosis Surgery', 'Orthopedic Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1e23a768-11c5-46b0-a38d-c40ef7d4cb9e'::uuid, 5342, 5637506168, 'dr-mohammed-ayoub', 'Dr. Mohammed Ayoub', 'د. محمد ايوب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian & American Board of Pediatrics Canadian Board of Pediatric Gastroenterology & Liver Transplant', 'Pediatric Gastroenterology, Hepatology & Nutrition Consultant', ARRAY['Gastroenterology & Hepatology','Nutrition','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ebf7bc33-285d-41d4-aefd-00102aa6b227'::uuid, NULL, NULL, 'dr-mohammed-hefne', 'Dr. Mohammed Hefne', 'د. محمد حفني', '/doctors/mohammed-hefne.webp', 'Saudi Board of Prosthodontics', 'Prosthodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.084Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('99ca1eeb-cc00-4594-b001-5977a8e07edd'::uuid, 5492, 5637512084, 'dr-mohammed-kheyami', 'Dr. Mohammed Kheyami', 'د. محمد خيمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.MohammedKheyami.jpg', 'Saudi Board in Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c8e2ee03-6900-4964-a01a-83dfc8e1dcbe'::uuid, 383, 5637193329, 'dr-mohammed-omar', 'Dr. Mohammed Omar', 'د. محمد عمر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedShaikh.jpg', 'American Board of Internal Medicine, American Board of Infectious Diseases', 'Internal Medicine and Infectious Diseases Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e1d05dbd-edf2-4d44-852e-6b6484f902da'::uuid, 2889, 5637280326, 'dr-mohammed-samannodi', 'Dr. Mohammed Samannodi', 'د. محمد سمنودي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedSamannodi1.png', 'American Board of Internal Medicine American Board of Infectious Diseases', 'Consultant Internal Medicine Infectious Diseases', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0e2de2b3-8b4f-478d-bcd8-67a11f4a2eb3'::uuid, 3161, 5637374826, 'dr-mohmed-torky', 'Dr. Mohamed Torky', 'د. محمد تركي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Mohamed.Torky.jpeg', 'Doctorate of Urology Egypt', 'Urology Consultant', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Khalidiyyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f0d418db-561e-4822-9054-d270c498916d'::uuid, 750, 5637257076, 'dr-mohsen-baduqayl', 'Dr. Mohsen Baduqayl', 'د. محسن بادقيل', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Mohsen.Baduqayl.jpeg', 'Jordanian Board of Internal Medicine Saudi Fellowship in Pulmonary  Medicine', 'Internal and Respiratory Medicine Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('82cace75-f1f6-4549-afd0-d2ee8dd38f41'::uuid, 4819, 5637480598, 'dr-muath-alammar', 'Dr. Muath Alammar', 'د. معاذ العمار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MuathAlammar.jpg', 'Saudi & Arab Board in Family Medicine and Canadian Fellowship in Preventative Medicine', 'Family & Preventative Medicine Consultant and Associate Professor', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6ab56717-9a08-4fb2-8c30-4b152f4ce4d1'::uuid, 5327, 5637506161, 'dr-muhammad-mujammami', 'Dr. Muhammad Mujammami', 'د. محمد مجممي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Fellowship in Endocrinology & Metabolism, Canadian Fellowship in Endocrine Tumors, Endocrine Certification in Neck Ultrasound USA', 'Consultant & Assoc. Prof. of Endocrinology, Diabetes, Thyroid & Endocrine Oncology', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('27ef3e57-e07e-4c9f-87a9-e98fbdbb4ccb'::uuid, 3979, 5637427458, 'dr-muhannad-safiyah', 'Dr. Muhannad Safiyah', 'د. مهند صافيه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'MBBS', 'General Practitioner', ARRAY['Family Medicine']::text[], 'General Practitioner', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('372e1e6e-c23b-4496-8986-fd545c33db47'::uuid, 3066, 5637319332, 'dr-mutaz-amer', 'Dr. Mutaz Amer', 'د. معتز عامر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MutazAmer.png', 'Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('81a33adf-f0ef-43e7-a674-85a742a92643'::uuid, NULL, NULL, 'dr-muthanna-bajnied', 'Dr. Muthanna Bajnied', 'د. مثنى باجنيد', '/doctors/muthanna-bajnied.webp', 'Master of Science in Esthetic & Restorative Dentistry - USA', 'Dental Esthetic & Restorative Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.324Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a9b8d6ba-3e13-459a-8a72-03453a207993'::uuid, 4965, 5637488088, 'dr-muthar-alani', 'Dr. Muthar Alani', 'د. مضر العاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DR.Muthar.Alani.png', 'Iraqi Board of ENT', 'ENT Associate Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ab054a63-65f5-4eca-88c6-8ae5496dd88e'::uuid, 387, 5637197076, 'dr-nada-kalakattawi', 'Dr. Nada Kalakattawi', 'د. ندى كلكتاوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrNadaKalakattawi.jpg', 'Saudi Fellowship in Pediatric Nephrology Saudi Board of Pediatrics', 'Pediatric Nephrology Consultant', ARRAY['Nephrology','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('329ef383-3146-4458-9968-b41509dc7d58'::uuid, 5495, 5637514326, 'dr-nada-zaher', 'Dr. Nada Zaher', 'د. ندى زاهر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Family Medicine', 'Family Medicine Sr. Specialist', ARRAY['Family Medicine']::text[], 'Senior Specialist', ARRAY['Al Tahlia','Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5f72fdd2-c73f-47f2-b583-cfae06cebc27'::uuid, 3968, 5637425936, 'dr-nashwa-aldardeir', 'Dr. Nashwa Aldardeir', 'د. نشوه الدردير', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/maleDoctor.jpg', 'German Board of Obstetrics and Gynecology German Fellowship in Urogynecology', 'Obstetrics and Gynecology Urogynecology and Reconstructive Pelvic Surgery Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1c4ff597-d6ab-4839-97cc-137884b60460'::uuid, 3883, 5637418343, 'dr-nasreen-ashour', 'Dr. Nasreen Ashour', 'د. نسرين عاشور', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.NasreenAshour.jpg', 'Saudi Board in Neurology Saudi Board in Internal Medicine', 'Adult Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b996b8c4-f147-4368-8c72-4725011c13d2'::uuid, 4682, 5637467198, 'dr-nasser-alenezi', 'Dr. Nasser Alenezi', 'د. ناصر العنزي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/NasserAlenezi.jpg', 'Saudi Board of Orthopedic Surgery, Canadian Fellowship in Spine Surgery', 'Orthopedic & Adult & Pediatric Spine Surgery Consultant', ARRAY['Orthopedics','Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8bc2503f-1bc2-4571-b68b-7edb2308ede6'::uuid, NULL, NULL, 'dr-nawaf-alfawzan', 'Dr. Nawaf Alfawzan', 'د. نواف الفوزان', NULL, NULL, 'Family Medicine', ARRAY['Family Medicine']::text[], NULL, ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 1, '2026-07-10T20:55:53.544Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5365f70b-f1ee-4952-abbc-090e6433edac'::uuid, 198, 5637147580, 'dr-nawaf-almarzouki', 'Dr. Nawaf Almarzouki', 'د. نواف المرزوقي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrNawafAlMarzouki.jpg', 'Swedish and European Board of Ophthalmology Canadian Fellowship in Glaucoma and Cataract Surgery', 'Ophthalmology Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('843d3412-ca7f-4836-ac37-fb67bc7fc756'::uuid, 4543, 5637459578, 'dr-nawal-assiri', 'Dr. Nawal Assiri', 'د. نوال عسيري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Nawal.App.png', 'Saudi & Arab Board of Obstetrics & Gynecology & Aesthetic Gynecology', 'Obstetrics & Gynecology & Aesthetic Gynecology Consultant', ARRAY['Dermatology & Cosmetics','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6b11f8d8-6227-4e39-ba22-80287e3cc904'::uuid, NULL, NULL, 'dr-nawras-kherallah', 'Dr. Nawras Kherallah', 'د. نورس خير الله', '/doctors/nawras-kherallah.webp', 'Syrian Board of Periodontics & Oral Implantology
Master’s Degree in Fixed Prosthodontics - France', 'Periodontist & Oral Implantologist Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.486Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9e3c9bd2-cdde-489c-8b9b-b096a3b01499'::uuid, 3060, 5637319329, 'dr-nedaa-bahkali', 'Dr. Nedaa Bahkali', 'د. نداء بهكلي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/NedaaBahkali.jpg', 'Canadian fellowship in Maternal Fetal Medicine and Advanced Obstetrics and Gynecology Ultrasound', 'Maternal Fetal Medicine Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cdaafea4-6cef-42db-8456-73c3ef5a03a3'::uuid, 2817, 5637266078, 'dr-nesrain-alhamedi', 'Dr. Nesrain Alhamedi', 'د. نسرين الحامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/NesrainAlhamedi.png', 'Arab and Saudi Board of Family Medicine Certified Breastfeeding Consultant', 'Arab and Saudi Board of Family Medicine Certified Breastfeeding Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('25807cd2-30f3-40b3-97d3-bc9b392f6b84'::uuid, 3562, 5637383828, 'dr-noran-abuouf', 'Dr. Noran Abuouf', 'د. نوران ابو عوف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Pediatrics Master’s Degree in Clinical Sciences - Clinical Nutrition - UK', 'Pediatric Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.115Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('063970e7-3b20-4954-abd9-ea6089d35b5b'::uuid, 5686, 5637527084, 'dr-nouf-alshehri', 'Dr. Nouf Alshehri', 'د. نوف الشهري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrNoufAlshehri.jpg', 'Saudi board of Endocrinology and Diabetes, Saudi board of Internal Medicine', 'Endocrinology Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Tahlia','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('86a3cced-d534-4189-b5b5-9cd26a859686'::uuid, 4517, 5637458104, 'dr-nouf-alzahrani', 'Dr. Nouf Alzahrani', 'د. نوف الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Nouf.Alzahrani.jpg', 'Bachelor Of Social Science in Psychology', 'Psychology Specialist', ARRAY['Psychiatry & Psychology']::text[], 'Specialist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('86c2c7d7-b7cd-4db5-b264-74bd330bd71d'::uuid, 5377, 5637509077, 'dr-nour-gazzaz', 'Dr. Nour Gazzaz', 'د. نور قزاز', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Canadian Board of Pediatrics Canadian Fellowship in Pediatric Endocrinology & Diabetes', 'Pediatric Endocrinology & Diabetes Consultant', ARRAY['Endocrinology & Diabetes','Pediatrics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('95cbe894-af1b-4e39-b549-56668b13aabe'::uuid, NULL, NULL, 'dr-nourhan-jastaniah', 'Dr. Nourhan Jastaniah', 'د. نورهان جستنيه', NULL, NULL, 'Pediatrics', ARRAY['Pediatrics']::text[], NULL, ARRAY['Al Tahlia','Obhour']::text[], ARRAY['Jeddah']::text[], true, 2, '2026-07-10T20:55:53.544Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5d3e830a-dfc0-45ff-ab91-7c4240a30757'::uuid, 5115, 5637498589, 'dr-nouri-abbas', 'Dr. Nouri Abbas', 'د. نوري عباس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Nouri.Abbas.j.jpg', 'Saudi Board of Pediatrics', 'Pediatric Sr. Specialist', ARRAY['Pediatrics']::text[], 'Senior Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5a0b4e11-9293-4ce2-8d2b-8fb3403ac4de'::uuid, 3706, 5637397381, 'dr-ola-sallam', 'Dr. Ola Sallam', 'د. علا سلام', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Masters Degree in Obstetrics and Gynecology', 'Obstetrics and Gynecology Specialist', ARRAY['Obstetrics & Gynecology']::text[], 'Specialist', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0a3b76e4-f059-45a4-a489-a71c1a3841f2'::uuid, 4618, 5637464076, 'dr-omar-albassam', 'Dr. Omar Albassam', 'د. عمر البسام', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Royal College Certification Board in Internal Medicine Cardiology in Interventional & Structural Cardiology American Board in Internal Medicine Cardiovascular Medicine', 'Interventional & Structural Cardiology Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a6c1a75f-8f7b-45db-b88c-2d6b80b34550'::uuid, 4982, 5637489579, 'dr-omar-alrahbeeni', 'Dr. Omar Alrahbeeni', 'د. عمر الرهبيني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Omar.AlRahbeeni_App.png', 'Saudi Board of Family Medicine', 'Family Medicine Associate Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5b05c3ab-5ac3-4771-9bef-2293d99f7994'::uuid, 3488, 5637377826, 'dr-omar-ashour', 'Dr. Omar Ashour', 'د. عمر عاشور', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/OmarAshour.jpg', 'Saudi Board of Internal Medicine and Canadian Fellowship in Adult Nephrology Blood Pressure and Home Dialysis', 'Canadian Fellowship in Adult Nephrology, Blood Pressure & Home Dialysis', ARRAY['Hematology','Nephrology']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f7593582-fd32-4dc6-99da-496edd05a7b8'::uuid, 336, 5637179076, 'dr-omsalamah-ahmed', 'Dr. Omsalamah Ahmed', 'د. ام سلمى احمد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/OmSalamahKamal.jpg', 'Bachelor of Medicine and Surgery', 'Pediatric Specialist', ARRAY['Pediatrics']::text[], 'Specialist', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7514148e-b0de-4c81-b54b-8bf883f7ed1f'::uuid, 3748, 5637407826, 'dr-osama-bajouh', 'Dr. Osama Bajouh', 'د. اسامة باجوه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.OsamaBajoh.jpg', 'French Fellowship in Obstetrics and Gynecology, Infertility and IVF', 'Obstetrics Gynecology and Infertility Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('847b8457-35ef-43be-8be2-1f0433825f97'::uuid, NULL, NULL, 'dr-osama-basri', 'Dr. Osama Basri', 'د. أسامة بصري', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-osama-basri', 'Diplomate of the American board of orthodontics
Fellow of the Royal College of dentists of Canada in orthodontics 
Sub speciality in Craniofacial and surgical orthodontics- university of Pittsburgh', 'Orthodontics and dentofacial orthopedics', ARRAY['Dental']::text[], '', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.613Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('13c58e44-10db-443d-8d4b-f5b7f721581f'::uuid, 202, 5637147585, 'dr-osama-bawazeer', 'Dr. Osama Bawazeer', 'د. اسامة باوزير', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrOsamaBawazeer.jpg', 'Canadian American and British Fellowship in Surgery', 'Pediatric and Neonatology Surgery Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f03f41b4-7d2a-45f1-bde8-76c7051952f5'::uuid, 4996, 5637491077, 'dr-prof-abdulkareem-almomen', 'Prof. Abdulkareem Almomen', 'بروفيسور. عبدالكريم المؤمن', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Prof.Abdulkareem.PNG', 'American Board of Internal Medicine & Hematology Canadian Fellowship in Internal Medicine International Board of Metal Toxicology - Germany', 'Internal Medicine & Hematology Consultant', ARRAY['Hematology','Internal Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2de50a2e-51ec-497d-af01-428221f38e82'::uuid, 4695, 5637466364, 'dr-prof-abdullah-al-shamrani', 'Prof. Abdullah Alshamrani', 'د. عبدالله الشمراني', '/doctors/dr-prof-abdullah-al-shamrani.webp', 'British Fellowship in Pediatrics Canadian Fellowship in Pulmonory & Sleep Medicine', 'Pediatric Pulmonary & Pediatric Sleep Medicine Consultant', ARRAY['Pediatrics','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ce411b01-ddcf-4111-bfba-38a794cb4de8'::uuid, 5601, 5637524076, 'dr-prof-abdullah-alzahrani', 'Prof. Abdullah Alzahrani', 'بروفيسور. عبدالله الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/AbdullahAlzahrani.jpg', 'Saudi Board of Family Medicine & Arab Board of Family Medicine', 'Diabetes Management & Obesity Management', ARRAY['Endocrinology & Diabetes']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('afa92e04-4dd3-4fb0-967c-d1d9791802ea'::uuid, 5084, 5637498583, 'dr-prof-ahmed-al-rumayyan', 'Prof. Ahmed Alrumayyan', 'بروفيسور. احمد الرميان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American & Canadian Board of Pediatric Canadian Board of Pediatric Neurology', 'Pediatric Neurology Consultant', ARRAY['Neurology','Pediatrics','Urology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c8707be7-101f-445b-a233-f37e1d4d8977'::uuid, 5670, 5637526335, 'dr-prof-ashraf-abosamra', 'Prof. Ashraf Abosamra', 'بروفيسور. اشرف ابو سمره', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Fellowship of the royal college of Surgery of Canada (FRCSC) & Fellowship of Society of Urologic Oncology', 'Urology Consultant', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('17a9206e-fd4c-4bc3-acd9-264adaea01fe'::uuid, 4692, 5637467151, 'dr-prof-bassam-bin-abbas', 'Prof. Bassam Bin Abbas', 'بروفيسور. بسام بن عباس', '/doctors/dr-prof-bassam-bin-abbas.webp', 'American Board of Pediatrics from Yale University & American Board of Pediatric Endocrinology & Diabetes from Stanford University', 'Pediatric Endocrinology Consultant', ARRAY['Endocrinology & Diabetes','Pediatrics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5c752f33-98e0-4db4-bda4-f958cfbb471f'::uuid, 4929, 5637486576, 'dr-prof-fahad-albashiri', 'Prof. Fahad Albashiri', 'بروفيسور. فهد البشيري', '/doctors/dr-prof-fahad-albashiri.webp', 'Canadian Fellowship in Pediatric Epilepsy Fellowship in Pediatric Neurology from King Faisal Specialist Hospital & Research Centre Saudi Board of Pediatrics', 'Pediatric Neurologist & Childhood Epilepsy Consultant', ARRAY['Neurology','Pediatrics','Urology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('45516877-9cb3-4895-a831-5910617dc989'::uuid, 5029, 5637492581, 'dr-prof-fawzi-aljassir', 'Prof. Fawzi Aljassir', 'بروفيسور. فوزي الجاسر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Prof.Fawzi.Aljassir.png', 'Canadian Board of Orthopedic Surgery Canadian Fellowship in Sports Injury Surgery, Reconstructive Surgery, Joint Replacement Surgery, and Bone & Soft Tissue Tumor Surgery', 'Orthopedic & Joint Surgery Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dca85d21-8e8b-4e00-8846-55acfac019b9'::uuid, 583, 5637230826, 'dr-prof-lina-raffa', 'Prof. Lina Raffa', 'د. لينا رفه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Prof.Lina.Raffa.jpg', 'Canadian Fellowship and Swedish Board in Pediatric Ophthalmology and Adult Strabismus', 'Pediatric Ophthalmology and Adult Strabismus Consultant', ARRAY['Ophthalmology','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8249e873-0de1-43bf-a412-ec166dffa428'::uuid, 4702, 5637470076, 'dr-prof-mohammed-alnaami', 'Prof. Mohammed Alnaami', 'بروفيسور. محمد النعمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedAlnaami.jpg', 'Canadian Board in General Surgery and Fellowship in Advanced Laparoscopic Bariatric and Metabolic Surgery', 'General & Advanced Laparoscopic, Metabolic & Bariatric Surgery Consultant', ARRAY['General & Bariatric Surgery']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('24802d6b-05b1-485b-bc94-40f4ccfa03a1'::uuid, 4001, 5637458936, 'dr-prof-mohammed-batais', 'Prof. Mohammed Batais', 'بروفيسور. محمد باتيس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MohammedBatais.jpg', 'Australian Fellowship in Diabetes & Chronic Disease Management', 'Diabetes & Chronic Disease Management Professor & Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0684dd86-c988-42ec-928d-d5cc3ff18c9e'::uuid, 5543, 5637518827, 'dr-prof-rajab-alzahrani', 'Prof. Rajab Alzahrani', 'بروفيسور. رجب الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Prof.RajabAlzahrani.jpg', 'Saudi Board with Honors, European Fellowship, German Fellowship', 'ENT Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('5d16ceb4-c1bc-48b7-9512-093c30189a3f'::uuid, 4704, 5637466366, 'dr-prof-riyad-al-lehebi', 'Prof. Riyad Al Lehebi', 'بروفيسور. رياض اللهيبي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RiyadAlLehebi.jpg', 'American & Canadian Board of Internal Medicine & Pulmonary Medicine Canadian Fellowship in Asthma & Advanced Airways Diseases & Sleep Medicine', 'Pulmonary, Ashtma & Sleep Medicine Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9c64d119-0f16-4c61-bdeb-2e3b3ea37f03'::uuid, 5692, 5637527086, 'dr-prof-sami-bahlas', 'Prof. Sami Bahlas', 'بروفيسور. سامي بحلس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SamiBahlas.jpg', 'Canadian Board of Internal Medicine and Rheumatology', 'Rheumatology', ARRAY['Rheumatology']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('857ba01f-b591-45fb-a5b6-4a0a3f976540'::uuid, 4688, 5637466365, 'dr-prof-turky-almigbal', 'Prof. Turky Almigbal', 'بروفيسور. تركي المقبل', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/TurkyAlMigbal1.jpg', 'Australian Fellowship in Diabetes & Chronic disease', 'Diabetes & Chronic Disease Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cd09d9d0-af61-4461-b2fd-27ea24af0818'::uuid, 4020, 5637431077, 'dr-raed-altayeb', 'Dr. Raed Altayeb', 'د. رائد الطيب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.RaedAltayeb.jpg', 'American board of Neurology American board of Neuromuscular medicine', 'Neurologist and Neuromuscular Medicine Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ec172877-8517-4f9f-892c-33ca961f2ffd'::uuid, 2845, 5637229369, 'dr-rahaf-mukhymir', 'Rahaf Mukhymir', 'رهف مخيمر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Rahaf.Mukhaimar.jpeg', 'Bachelor’s Degree of Optometrist Specialist', 'Optometrist', ARRAY['Ophthalmology']::text[], 'Optometrist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('dd7c6d56-cef3-447b-92aa-e3d007b3d006'::uuid, 412, 5637205328, 'dr-rajiah-mourad', 'Dr. Rajiah Mourad', 'د. راجية مراد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrRajiahMourad.jpg', 'Saudi Board and Fellow of The European Board of ENT and Snoring Surgeries', 'ENT and Sleep Surgery Consultant', ARRAY['ENT','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('37e65e55-e9c8-4897-9acc-9da5d72d22f8'::uuid, 4439, 5637458917, 'dr-rakan-barghouthi', 'Dr. Rakan Barghouthi', 'د. راكان برغوثي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RakanBarghouthi.jpg', 'Saudi Board of Family Medicine', 'Family Medicine Associate Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0df10d22-b7a9-408d-b120-c19abca450e2'::uuid, 3084, 5637320087, 'dr-rami-algahtani', 'Dr. Rami Algahtani', 'د. رامي القحطاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RamiAlgahtani.png', 'American Board of Neurology  American Fellowship in Neurocritical care', 'Adult Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d6a16748-7009-4ba2-88e8-e0cfaa6f19bd'::uuid, NULL, NULL, 'dr-rami-saab', 'Dr. Rami Saab', 'د. رامي صعب', '/doctors/rami-saab.webp', 'Doctorate of Oral & Maxillofacial Surgery - Romania', 'Oral & Maxillofacial Surgery Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.737Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0ba227c5-8028-49e0-a688-5fd421ee78bb'::uuid, 5658, 5637526328, 'dr-ramy-samargandi', 'Dr. Ramy Samargandi', 'د. رامي سمرقندي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RamySamargandi.jpg', 'French board (orthopedic surgery)', 'Orthopedic', ARRAY['Orthopedics']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a43ffe5f-58a6-43c0-b9f2-213c13280576'::uuid, 4536, 5637458113, 'dr-rania-harere', 'Dr. Rania Harere', 'د. رانية حريري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Rania.Harere.png', 'Saudi Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e0ba405f-afd6-4c3a-9c13-54612eb4a9d9'::uuid, 3251, 5637340326, 'dr-raniya-bamuzahim', 'Dr. Raniya Bamuzahim', 'د. رانية بامزاحم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'General Practitioner', 'General Practitioner', ARRAY['Family Medicine']::text[], 'General Practitioner', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9c0736b3-c31b-43bc-8dce-1c5bde2473fa'::uuid, NULL, NULL, 'dr-rawah-eshky', 'Dr. Rawah Eshky', 'د. رواح عشقي', NULL, 'American Board of Orthodontics
Canadian Board of Orthodontics', 'Orthodontics & Dentofacial Orthopedics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:53.855Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f4482dd7-6ef7-41d3-8e5f-1f74699a5e0e'::uuid, 5066, 5637496326, 'dr-rawan-alhazmi', 'Dr. Rawan Alhazmi', 'د. روان الحازمي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RawanAlhazmi.jpg', 'Saudi Board of Obstetrics and Gynecology', 'Obstetrics & Gynecology Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b3a083b9-5237-4484-8536-94ce28fde325'::uuid, 373, 5637193328, 'dr-rayan-alsharief', 'Dr. Rayan Alsharief', 'د. ريان الشريف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Board of Ophthalmology Canadian Fellowship in Diseases  Surgery of the Vitreous  Retina', 'Ophthalmology Consultant', ARRAY['Ophthalmology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c34eb689-fd0c-4e97-9fb6-c1378b52139d'::uuid, 1758, 5637259329, 'dr-reem-alnazawi', 'Dr. Reem Alnazawi', 'د. ريم النزاوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Reem.AlNazzawi.jpeg', 'American Board of Endocrinology, Diabetes & Metabolism, American Board of Internal Medicine', 'Endocrinology, Diabetes & Metabolism Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9c87837e-4da1-45d4-b344-9d88b86053c4'::uuid, 5546, 5637518099, 'dr-renad-alshawbaki', 'Dr. Renad Alshawbaki', 'د. رناد الشوبكي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.RenadAlshawbaki.jpg', 'Saudi Board of Internal Medicine', 'Internal Medicine Consultant', ARRAY['Internal Medicine']::text[], 'Consultant', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('d63bf8bc-89dc-4904-914b-f9a82c5ca6d6'::uuid, NULL, NULL, 'dr-reyouf-mousa', 'Dr. Reyouf Mousa', 'د. ريوف موسى', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-reyouf-mousa', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.005Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c24a4990-46f7-423f-86e3-a6101bfe4afd'::uuid, 3709, 5637398077, 'dr-riham-orabi', 'Dr. Riham Orabi', 'د. ريهام عرابي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.RihamOrabi.jpg', 'Master’s Degree in Pediatrics - Cairo Membership of Royal College of Pediatrics', 'Pediatric Specialist', ARRAY['Pediatrics']::text[], 'Specialist', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('eee67a03-faf9-438c-a693-96b9e3cfffd6'::uuid, 5323, 5637506160, 'dr-roaa-mahroos', 'Dr. Roaa Mahroos', 'د. رؤى محروس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Saudi Board of Internal Medicine Saudi Fellowship in Adult Rheumatology', 'Internal Medicine & Rheumatology Consultant', ARRAY['Internal Medicine','Rheumatology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ffb872a3-7985-42e7-8097-d636212cd8b3'::uuid, 5662, 5637526330, 'dr-roba-jamalallail', 'Dr. Roba Jamalallail', 'د. ربى جمل الليل', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/RobaJamalallail.jpg', 'Saudi Board of Orthopedic Surgery', 'Pediatric Orthopedic Surgery', ARRAY['Orthopedics','Pediatrics']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('3a5d77de-f599-458c-87fd-eaf524491e0a'::uuid, 4121, 5637440076, 'dr-rowa-attar', 'Dr. Rowa Attar', 'د. رواء عطار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'American Board of Cardiovascular Medicine Fellowship in Structural Echocardiography', 'Cardiology & Structural Imaging Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('41a975e7-9a91-4744-a143-fdb195b263a7'::uuid, 3853, 5637416827, 'dr-saddiq-habiballah', 'Dr. Saddiq Habiballah', 'د. صدّيق حبيب الله', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.SaddiqHabiballah.jpg', 'American Board of Pediatrics American Board in Allergy & Immunology', 'Pediatric and Allergy Immunology Consultant', ARRAY['Allergy & Immunology','Pediatrics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('38dc551f-9387-4d21-9c8e-d2e179f0c33d'::uuid, 4014, 5637430677, 'dr-saeed-alghamdi', 'Dr. Saeed Alghamdi', 'د. سعيد الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.SaeedAlghamdi.jpg', 'French Board of Cardiology French Fellowship in Echocardiography', 'Cardiology and Echocardiography Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4e6da98a-44b9-4641-ac3b-3130e9b08b91'::uuid, NULL, NULL, 'dr-saeed-bintalib', 'Dr. Saeed BinTalib', 'د. سعيد بن طالب', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-saeed-bintalib', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.122Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0feb6faa-43d2-42f0-adef-1ea7878eec81'::uuid, 3021, 5637314077, 'dr-saleh-alghamdi', 'Dr. Saleh Alghamdi', 'د. صالح الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SalehAlghamdi.jpg', 'European and Saudi Board of Otolaryngology Head and Neck Surgery andf Sleep Surgery', 'Otolaryngology Head and Neck Surgery Sleep Medicine and Surgery Consultant', ARRAY['ENT','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('90534bef-bc62-40a7-9a5a-365e13c3bdd9'::uuid, 2934, 5637288576, 'dr-salem-bazaraah', 'Dr. Salem Bazaraah', 'د. سالم بازرعه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'American and Canadian Fellowship in Gastroenterology and Therapeutic Endoscopy', 'Gastroenterology Hepatology and Advance Therapeutic Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('549bc643-c0fc-4ffa-a368-09bf2741e8bb'::uuid, 3306, 5637348607, 'dr-salma-alkhammash', 'Dr. Salma Alkhammash', 'د. سلمى الخماش', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Salma.Alkammash.jpeg', 'Canadian Fellowship in Clinical Allergy & Immunology British Fellowship in Clinical Immunology', 'Allergy and Immunology Consultant', ARRAY['Allergy & Immunology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a602dac2-7223-419d-bc49-7193f2035215'::uuid, 4568, 5637460330, 'dr-salma-omran', 'Dr. Salma Omran', 'د. سلمى عمران', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Salma.Omran.jpg', 'Bachelor Degree in Clinical Nutrition', 'Clinical Dietitian', ARRAY['Nutrition']::text[], 'Dietitian', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('4578a1df-4e14-4dd6-a75a-ced4a27f709e'::uuid, 4995, 5637491076, 'dr-salman-alsaleh', 'Dr. Salman Alsaleh', 'د. سلمان الصالح', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SalmanAlsaleh.png', 'American & Canadian Board of Rheumatology American & Canadian Board of Internal Medicine', 'Internal Medicine & Rheumatology Consultant', ARRAY['Internal Medicine','Rheumatology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('177b8d26-e91d-4c47-813b-5fac8fb11b96'::uuid, 5449, 5637510576, 'dr-salwa-al-thagafi', 'Dr. Salwa Althagafi', 'د. سلوى الثقفي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Arab Board in Obstetrician & Genecology', 'Obstetrics& Gynecology & Aesthetic gynecology Consultant', ARRAY['Dermatology & Cosmetics','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('66fb8182-7d4f-44d9-aac7-0f1a75ede64c'::uuid, 3988, 5637428077, 'dr-samahah-mukhtar', 'Samahah Mukhtar', 'سماحه مختار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.SamahahMukhtar.jpg', 'Bachelor’s Degree of Optometrist Specialist', 'Optometrist', ARRAY['Ophthalmology']::text[], 'Optometrist', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ea809cf8-a88a-4321-b420-cf74fc468534'::uuid, 3472, 5637374827, 'dr-samaher-hashim', 'Dr. Samaher Hashim', 'د. سماهر هاشم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SamaherHashim.jpg', 'American Board  Fellowship in Internal Medicine American Board  Fellowship in Pulmonary Diseases A', 'Pulmonary and Critical Care Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c375bc97-a631-4283-b402-6b9bfcb83677'::uuid, 4783, 5637478344, 'dr-samar-al-toukhi', 'Dr. Samar Altoukhi', 'د. سمر الطوخي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Samar_Altoukhi.jpg', 'Canadian Fellowship in Fetal Medicine & High-Risk Pregnancy (Intrauterine) Saudi & Canadian Fellowship in Fetal Medicine & High-Risk Pregnancy Saudi Board in Obstetrics & Gynecology', 'Maternal Fetal Medicine, Obstetric & High Risk Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('10d1cbdb-1ae9-4f61-9066-84dda25afe5f'::uuid, 424, 5637207576, 'dr-sami-alobaidi', 'Dr. Sami Alobaidi', 'د. سامي العبيدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrSamiAlobaidi.jpg', 'American Board of Internal Medicine and Nephrology American Fellowship in Nephrology Transplant', 'Nephrology Consultant', ARRAY['Nephrology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f8ab8c02-351c-4ba7-905c-2074e9e29d78'::uuid, NULL, NULL, 'dr-sami-lodhi', 'Dr. Sami Lodhi', 'د. سامي لودي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-sami-lodhi', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.239Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('931e5fde-464f-4795-b3b3-057c3b9e1037'::uuid, 649, 5637240576, 'dr-saniah-awaidah', 'Dr. Saniah Awaidah', 'د. سنية عويضة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrSaniahAwaidah.jpg', 'Saudi and Arab Board of Pediatrics, Saudi Fellowship in Pediatric Endocrinology', 'Pediatric and Endocrine Consultant', ARRAY['Endocrinology & Diabetes','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9d5e2c32-768e-408a-83e7-3acba1e9bd1c'::uuid, 4495, 5637465577, 'dr-sara-aleid', 'Sara Aleid', 'ساره العيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SaraAleid.jpg', 'Bachelor’s Degree of Health & Rehabilitation', 'Clinical Dietitian', ARRAY['Nutrition']::text[], 'Dietitian', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('9f11c506-1826-406c-8ead-4f47dfdc9cac'::uuid, 5282, 5637506094, 'dr-sarah-aljoudi', 'Dr. Sarah Aljoudi', 'د. ساره الجودي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrSarah.Aljoudi.jpg', 'Saudi, European & Arab Board of Dermatology, Laser & Aesthetic Medicine', 'Dermatology & Cosmetology Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('112c09ab-d14a-4d13-a519-98bf0f1ac852'::uuid, 4872, 5637484329, 'dr-sarah-badawod', 'Dr. Sarah Badawod', 'د. ساره باداود', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Sarah.Badawod.j.jpg', 'Canadian Board of Internal Medicine Canadian Fellowship in Endocrinology, Metabolism & Diabetes', 'Endocrinology and diabetes consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('81f034be-67a2-43e5-8f6e-a26df50d09b2'::uuid, 3945, 5637425114, 'dr-sarah-dahlan', 'Dr. Sarah Dahlan', 'د. ساره دحلان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SarahDahlan.jpg', 'Canadian and American Board of Internal Medicine Canadian Board of Nephrology', 'Internal Medicine ​Nephrology and Blood Pressure Consultant', ARRAY['Hematology','Internal Medicine','Nephrology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('631fa6f5-c4a7-4d74-aecf-b1820447daaa'::uuid, 5485, 5637512078, 'dr-sarah-malaekah', 'Dr. Sarah Malaekah', 'د. ساره ملايكة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.SarahMalaekah.jpg', 'Canadian Fellowship in Pediatric Rheumatology', 'Pediatrics and Pediatric Rheumatology Consultant', ARRAY['Pediatrics','Rheumatology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('260f95bf-57b3-4759-93dc-6c7ccb8cbb6b'::uuid, 3403, 5637366728, 'dr-saud-alzahrani', 'Dr. Saud Alzahrani', 'د. سعود الزهراني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.SaudAlzahrani.jpg', 'American Board of Endocrinology Diabetes and Metabolism', 'Endocrinology Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Obhour','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ca3bb869-240d-4318-b693-ef5307250121'::uuid, 3330, 5637355326, 'dr-saud-bahaidarah', 'Dr. Saud Bahaidarah', 'د. سعود باحيدره', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Saud.Bahaidarah.jpeg', 'King Faisal Specialist Hospital Research Center Fellowship in Pediatric Cardiology Saudi Arab', 'Interventional Pediatric Cardiology Consultant', ARRAY['Cardiology','Pediatrics']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('f698e205-404e-4670-aea9-3cc3611ec8e0'::uuid, 207, 5637147582, 'dr-seraj-aboalnaja', 'Dr. Seraj Aboalnaja', 'د. سراج ابو النجا', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian Board of Internal Medicine Canadian Board of Cardiology American Board of Internal Medicine', 'Interventional & Structural Cardiology Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('a8d696fc-52e5-4f85-9be2-55df7b927ac9'::uuid, 4015, 5637428828, 'dr-seraj-makkawi', 'Dr. Seraj Makkawi', 'د. سراج مكاوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian and American Board in Adult Neurology Canadian Fellowship in Multiple Sclerosis / Neuroimmu', 'Adult Neurology Consultant', ARRAY['Neurology','Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7e883afd-8e73-4c0c-ad0c-31cfa0778424'::uuid, NULL, NULL, 'dr-shahad-abudawood', 'Dr. Shahad Abudawood', 'د. شهد أبوداود', '/doctors/shahad-abudawood.webp', 'American Board of Pediatric Dentistry
Master’s Degree in Pediatric Dentistry - USA', 'Pedodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.355Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2610c7ad-16bb-44c1-8450-5ca41cd9d04b'::uuid, 5688, 5637527082, 'dr-shahd-baarimah', 'Dr. Shahd Baarimah', 'د. شهد باعارمه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrShahdBaarimah.jpg', 'Saudi Board of Pediatric', 'Pediatric', ARRAY['Pediatrics']::text[], '', ARRAY['Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fd71cc4d-e427-4e11-89ba-34a2522d3491'::uuid, 4389, 5637444691, 'dr-shaima-alshareef', 'Dr. Shaima Alshareef', 'د. شيماء الشريف', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/ShiamaaAlshareef.jpg', 'Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Al Khalidiyyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('072da626-dd3d-4dba-aff3-eb0074a3685f'::uuid, 3332, 5637355328, 'dr-sharifa-alshehri', 'Dr. Sharifa Alshehri', 'د. شريفة الشهري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/SharifaAlshehri.png', 'Saudi, Arab, & Jordanian Board of Family Medicine Saudi Fellowship in Diabetes', 'Family Medicine and Diabetes Consultant', ARRAY['Endocrinology & Diabetes','Family Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('6e80083b-d1c6-425c-abd2-4ac6b717d3e6'::uuid, 4381, 5637444576, 'dr-shatha-ali', 'Dr. Shatha Ali', 'د. شذا علي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/ShathaAli.jpg', 'Bachelor’s Degree of Medicine & Surgery Saudi Board of Psychiatry', 'Psychology', ARRAY['Psychiatry & Psychology']::text[], '', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('8962698d-7c38-400f-9431-5cf06d75cda9'::uuid, 368, 5637191826, 'dr-shirin-alkhilafi', 'Dr. Shirin Alkhilafi', 'د. شيرين الخليفي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/ShereenAlkhilafi.png', 'Saudi Board and Arab Board of Dermatology Master’s Degree in Clinical Dermatology - London', 'Dermatology and Cosmetology Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ba0e8558-c7c4-4e3b-a616-3ca566db299b'::uuid, 3784, 5637412331, 'dr-shorooq-banjar', 'Dr. Shorooq Banjar', 'د. شروق بنجر', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.ShorooqBanjar.jpg', 'American & Canadian Board of Internal Medicine American & Canadian Fellowship in Allergy & Immunolog', 'Allergy and Immunology Consultant', ARRAY['Allergy & Immunology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('078b9347-c637-4892-b7a1-21549331180b'::uuid, 539, 5637221080, 'dr-shoroug-ibrahim', 'Dr. Shoroug Ibrahim', 'د. شروق ابراهيم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrShorougIbrahim.jpg', 'Saudi and Arab Board of Family Medicine', 'Family Medicine Consultant', ARRAY['Family Medicine']::text[], 'Consultant', ARRAY['Obhour','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.507Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('940bb4a9-0bc3-4365-9224-6b78e61cf875'::uuid, NULL, NULL, 'dr-siraj-dakhil', 'Dr. Siraj Dakhil', 'د. سراج دخيل', '/doctors/siraj-dakhil.webp', 'Doctorate of Endodontics - USA', 'Endodontics Consultant', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.529Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('881a809e-f00d-4803-bc3a-50fec72efc4a'::uuid, 209, 5637158077, 'dr-soad-mandoura', 'Dr. Soad Mandoura', 'د. سعاد مندورة', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Soad.Mandoura.jpeg', 'Arab and Saudi Board of Dermatology and Dermatosurgery', 'Dermatology and Aesthetic Medicine Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Khalidiyyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('021ac3ce-3523-461e-8053-9cf18db25dd8'::uuid, 5227, 5637502326, 'dr-souzan-al-kafy', 'Dr. Souzan Alkafy', 'د. سوزان الكافي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Souzan.AlKafy.jpg', 'Canadian Board of Obstetrics & Gynecology Canadian Board of Reproductive Endocrinology & Infertility American Board of Obstetrics Gynecology', 'Obstetrics & Gynecology, Reproductive Endocrinology, Infertility & IVF Consultant', ARRAY['Endocrinology & Diabetes','Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('20a12f82-98cc-4f0a-be84-ced822c701a4'::uuid, 5487, 5637512080, 'dr-suhaib-khayat', 'Dr. Suhaib Khayat', 'د. صهيب خياط', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Suhaib.Khayat.jpg', 'Clinical Fellowship in Urogynecology and Reconstructive Pelvic Surgery - Canada', 'Obstetrics and Gynecology Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('0ff5e3fc-75db-4dc3-997d-ea6d7457f3bb'::uuid, 3120, 5637323827, 'dr-suhail-khojah', 'Dr. Suhail Khojah', 'د. سهيل خوجه', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Suhail.Khojah.jpeg', 'Canadian & American Board of Internal Medicine Canadian & American Board of Nephrology Canadian Fel', 'Internal Medicine and ​Nephrology Consultant', ARRAY['Internal Medicine','Nephrology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('fcc36c6f-b122-4d40-8b99-6c477775ac46'::uuid, 4062, 5637434077, 'dr-suzan-alzaidi', 'Dr. Suzan Alzaidi', 'د. سوزان الزايدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Suzan.Alzaidi.jpg', 'Italian Fellowship in Transoral Microlaryngeal Laser Surgery Saudi  European Board of Otolaryngolog', 'Otolaryngology Head  Neck Surgery Microlaryngeal Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('69d184e9-a240-4ca4-8fc0-d2dd1bb1b36e'::uuid, 5672, 5637526337, 'dr-taghreed-altassan', 'Taghreed Altassan', 'تغريد الطاسان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/TaghreedAlTassan.jpg', 'Master''s degree in social service', 'Social Counseling Specialist', ARRAY['Psychiatry & Psychology']::text[], 'Specialist', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2a6aac1c-c29a-4160-bc5d-a59264dd28a1'::uuid, 3103, 5637321586, 'dr-taha-habibullah', 'Dr. Taha Habibullah', 'د. طه حبيب الله', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/TahaHabibullah.jpg', 'European, Arab and Saudi Board of Dermatology', 'Dermatology and Aesthetics Medicine Consultant', ARRAY['Dermatology & Cosmetics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('723fd9ee-fd44-4b1a-bd2f-77ff75790532'::uuid, 2770, 5637262326, 'dr-taha-samman', 'Dr. Taha Samman', 'د. طه سمان', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Taha.Samman.jpeg', 'Saudi and Arab Board of Orthopedic Canadian Fellowship in Sports Medicine', 'Orthopedic Consultant Sports Injuries and Arthroscopic Surgeries Subspecialty', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('2247565c-fce0-4c78-8e56-f6fef2699d3a'::uuid, NULL, NULL, 'dr-tahani-azizalrahman', 'Dr. Tahani Azizalrahman', 'د. تهاني عزيز الرحمن', '/doctors/tahani-azizalrahman.webp', 'Master’s Degree in Pediatric Dentistry', 'Pediatric Dentistry Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.673Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e7930e17-1b79-4679-b600-4001170cc06c'::uuid, 5414, 5637509831, 'dr-talal-almaghamsi', 'Dr. Talal Almaghamsi', 'د. طلال المغامسي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Talal.Almaghamsi.jpg', 'Canadian Fellowship in Pediatric Pulmonology', 'pediatrics & Pediatric Pulmonary Consultant', ARRAY['Pediatrics','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('46a2af7e-d641-4c6e-b99c-9f16646e11ed'::uuid, 5621, 5637524082, 'dr-tayba-wahedi', 'Dr. Tayba Wahedi', 'د. طيبة واحدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Tayba Wahedi.jpg', 'Saudi Board (internal medicine) KAAUH, jeddah , Saudi Fellowship (endocrinology),King Fahad medical city , Riyadh', 'Adult endocrinology, diabetes and metabolism', ARRAY['Endocrinology & Diabetes']::text[], '', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('ace9d4f8-c9a1-4f08-bc0d-ae8c6604ecb0'::uuid, 211, 5637147584, 'dr-turki-alahmadi', 'Dr. Turki Alahmadi', 'د. تركي الاحمدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrTurkiAlAhmadi.jpg', 'Canadian Fellowship in Pediatric Respiratory', 'Pediatric Pulmonology Consultant', ARRAY['Pediatrics','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('15f04307-4d1c-48f0-bd3e-568a9ba90931'::uuid, NULL, NULL, 'dr-waad-bajaber', 'Dr. Waad Bajaber', 'د. وعد باجابر', NULL, 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.912Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c87f832d-ac8a-463c-8f33-888ad8ad76e5'::uuid, 3462, 5637372577, 'dr-wael-abdelkafy', 'Dr. Wael Abdelkafy', 'د. وائل عبدالكافي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WaelAbdelkafy.jpg', 'Doctorate of ENT Egypt American Fellowship in ENT Swiss Fellowship in Otology Skull Base Surger', 'ENT Head and Neck Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('46214df6-fb9e-44ff-a9cc-e9d424891095'::uuid, 258, 5637158084, 'dr-wael-auwad', 'Dr. Wael Auwad', 'د. وائل عواد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrWaelAuwad.jpg', 'British Fellowship in Obstetrics  Gynecology British Fellowship in Cosmetic Gynecology British Doct', 'Gynecology and Urogynecology Consultant', ARRAY['Obstetrics & Gynecology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('105a1823-e55d-46fe-b191-15e16bcfaa32'::uuid, 3412, 5637367329, 'dr-wael-mojeeb', 'Dr. Wael Mojeeb', 'د. وائل مجيب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Wael_Mojeeb.jpg', 'German Board of Orthopedic and Trauma Surgery German Fellowship in Orthopedic Oncology', 'Orthopedic Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7adc20be-d0b2-4aa9-941b-9bb9e68a6068'::uuid, 5489, 5637512082, 'dr-wafa-alaslani', 'Dr. Wafa Alaslani', 'د. وفاء العصلاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', 'Fellowship program in Pediatric Pulmonary- Saudi Arabia', 'Pediatric Pulmonary Consultant', ARRAY['Pediatrics','Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('87dccbd1-bd63-48f8-af9f-1d20fff2724d'::uuid, 5687, 5637527083, 'dr-wafa-alghamdi', 'Dr. Wafa Alghamdi', 'د. وفاء الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WafaAlghamdi.jpg', 'Saudi dermarology board of KFAFH', 'Dermatology', ARRAY['Dermatology & Cosmetics']::text[], '', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:20.038Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('97d6c60b-a1f6-4534-a81d-5e2d47607e39'::uuid, 3789, 5637404828, 'dr-wafa-almuqri', 'Dr. Wafa Almuqri', 'د. وفاء  المقري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/FemaleDoctor.jpg', '-', 'General Practitioner', ARRAY['Family Medicine']::text[], 'General Practitioner', ARRAY['Al Tahlia','Obhour']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('21fcc58b-32e7-443a-8a73-e9a4033748ac'::uuid, 703, 5637247328, 'dr-wafa-maqbul', 'Dr. Wafa Maqbul', 'د. وفاء مقبول', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WafaaMagboul.jpg', 'Saudi Board in Otorhinolaryngology and Head & Neck Surgery, Fellowship in Laryngology & Microsurgery – University of Manchester, United Kingdom', 'ENT Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Tahlia']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('7f5e928b-507b-425b-a846-b2f000965250'::uuid, NULL, NULL, 'dr-wafaa-kattan', 'Dr. Wafaa Kattan', 'د. وفاء قطان', '/doctors/wafaa-kattan.webp', 'Clinical Certificate in Operative & Esthetic Dentistry - USA
Master’s Degree in Oral Science - USA', 'Operative & Esthetic Dentistry Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:55.059Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('71a67688-2444-4d9b-a949-2c8f198c1cd3'::uuid, 3457, 5637371076, 'dr-wail-yar', 'Dr. Wail Yar', 'د. وائل يار', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WailYar.jpg', 'American Board of General Preventive Medicine & Public Health American Fellowship in Sleep Medicine for Adults & Pediatrics', 'Sleep Medicine Consultant', ARRAY['Pulmonology & Sleep Medicine']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Sahafa']::text[], ARRAY['Jeddah','Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('29e13870-2569-47fc-b5f4-e3a669dac5a8'::uuid, NULL, NULL, 'dr-walaa-alamoudi', 'Dr. Walaa Alamoudi', 'د. ولاء العمودي', '/doctors/walaa-alamoudi.webp', 'Master’s Degree in Pediatric Dentistry', 'Pedodontics Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:55.186Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b509eb3f-188d-4fa0-a2ea-41eeffee3942'::uuid, 679, 5637243577, 'dr-walaa-aldabbagh', 'Dr. Walaa Aldabbagh', 'د. ولاء الدباغ', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Walaa.Aldabbagh.jpeg', 'Saudi Board of Internal Medicine, Saudi Fellowship in Rheumatology', 'Internal Medicine and Rheumatology Consultant', ARRAY['Internal Medicine','Rheumatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('cccd815c-1d26-4a96-a1fb-98195d97ada5'::uuid, 4677, 5637467199, 'dr-walaa-almasri', 'Dr. Walaa Almasri', 'د. ولاء المصري', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WalaaAlmasri.jpg', 'Saudi Board of Internal Medicine Canadian Fellowship in Allergy & Immunology Canadian Fellowship in Reproductive Immunology', 'Internal Medicine & Allergy & Reproductive Immunology Consultant', ARRAY['Allergy & Immunology','Internal Medicine']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b391f604-284b-450d-a65f-37db1f0da4a1'::uuid, NULL, NULL, 'dr-walaa-hassan', 'Dr. Walaa Hassan', 'د. ولاء حسان', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-walaa-hassan', 'Master’s Degree in Endodontics', 'Endodontic Specialist', ARRAY['Dental']::text[], 'Specialist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:55.304Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('523bbffd-dad2-48ee-a279-aa0b1eac00a5'::uuid, 2984, 5637294576, 'dr-waleed-alghamdi', 'Dr. Waleed Alghamdi', 'د. وليد الغامدي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Canadian and American Boards in Internal Medicine and Gastroenterology, Canadian Fellowship in Liver', 'Gastroenterology and Transplant Hepatology Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c7228244-3f6f-4718-909e-941520cf6e07'::uuid, 5589, 5637523328, 'dr-waleed-alhemayed', 'Dr. Waleed Alhemayed', 'د. وليد الحميّد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Saudi Board in Internal Medicine, Saudi Board in Adult Cardiology, Saudi Fellowship in Echocardiography transthoracic and transesophageal', 'Cardiology & Echocardiography Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('70912fbf-7bfa-43c2-94c1-ddaac53cb16a'::uuid, 5644, 5637526326, 'dr-waleed-alhuzaim', 'Dr. Waleed Alhuzaim', 'د. وليد الحزيم', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Waleed.Alhuzaim.JPG', 'Canadian Board in Internal medicine American Board in Internal medicine Canadian Fellowship in Gastroenterology', 'Gastroenterology Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('1dd04273-7c8a-4977-b207-9096f9fc8fb6'::uuid, 5362, 5637506264, 'dr-waleed-badoghaish', 'Dr. Waleed Badoghaish', 'د. وليد بادغيش', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.WaleedBadoghaish.jpg', 'American Board & Fellowship of Internal Medicine, Gastroenterology & Hepatology', 'Gastroenterology, Hepatology & Endoscopy Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('48be7a9d-1c54-4ae7-b9f6-306d596e8f8f'::uuid, 3042, 5637315577, 'dr-waleed-eid', 'Dr. Waleed Eid', 'د. وليد عيد', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WaleedEid.png', 'Masters Degree in Otorhinolaryngology', 'ENT Specialist', ARRAY['ENT']::text[], 'Specialist', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('b6d2f6f2-2e55-4f1a-a940-94ff476c7f51'::uuid, 5255, 5637504577, 'dr-waleed-khayyat', 'Dr. Waleed Khayyat', 'د. وليد خياط', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/MaleDoctor.jpg', 'Saudi Board of Ophthalmology', 'Ophthalmology Sr. Specialist', ARRAY['Ophthalmology']::text[], 'Senior Specialist', ARRAY['Al Sahafa']::text[], ARRAY['Riyadh']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('aba4faa0-e3a0-47d4-8c16-912aa3cbd428'::uuid, NULL, NULL, 'dr-waleed-taju', 'Dr. Waleed Taju', 'د. وليد تاجو', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-waleed-taju', 'Membership of the Royal College of Surgeons of Edinburgh', 'Consultant in Orthodontics and Dentofacial Orthopedics', ARRAY['Dental']::text[], 'Consultant', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:55.421Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('484af5f1-aeff-45b0-90e8-a692ad5631b9'::uuid, 4402, 5637445368, 'dr-waseem-tayeb', 'Dr. Waseem Tayeb', 'د. وسيم طيب', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.Waseem.Tayeb.jpg', 'French Fellowship in Minimal Invasive Urology, Endourology & Oncourology Saudi Board of Urology', 'Urology Consultant', ARRAY['Urology']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('26a18b89-58bd-4f67-bc2e-c66fc4af0081'::uuid, 5528, 5637515078, 'dr-wedyan-aboznadah', 'Dr. Wedyan Aboznadah', 'د. وديان ابو زناده', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/WedyanAboznadah.jpg', 'Saudi Board in Internal Medicine, Canadian Board in Endocrinology and Metabolism, Canadian Fellowship in Reproductive Endocrinology and Health', 'Endocrinology Consultant', ARRAY['Endocrinology & Diabetes']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('e95f66b1-86d4-4d6a-9470-ca5229e9bbfd'::uuid, 4862, 5637483664, 'dr-yaser-bamashmos', 'Dr. Yaser Bamashmos', 'د. ياسر بامشموس', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.YaserBamashmos.jpg', 'Saudi Board of Pediatrics', 'Pediatric Consultant', ARRAY['Pediatrics']::text[], 'Consultant', ARRAY['Al Tahlia','Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('517521d6-0576-4201-8dad-6f03af5d527c'::uuid, 2985, 5637308077, 'dr-yasir-khayat', 'Dr. Yasir Khayat', 'د. ياسر خياط', 'https://bamc.myclinic.com.sa/OS.WebAPI.External\Images\YasirKhayat.png', 'American Canadian Board of Internal Medicine Canadian Fellowship in Gastroenterology', 'Gastroenterology Consultant', ARRAY['Gastroenterology & Hepatology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c839820d-24e9-4925-919d-cf8f3c1d158d'::uuid, 3085, 5637320086, 'dr-yosra-turkistani', 'Dr. Yosra Turkistani', 'د. يسرا تركستاني', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrYosraTurkistani.jpeg', 'Canadian American Board of Internal Medicine Adult Cardiology Canadian Fellowship American Board of echocardiography', 'Adult Cardiology Consultant', ARRAY['Cardiology']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('962d3706-36fd-441b-9319-22761810531b'::uuid, 3448, 5637370326, 'dr-yousuf-alqurashi', 'Dr. Yousuf Alqurashi', 'د. يوسف القرشي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Dr.YousufAlqurashi.jpg', 'Canadian Fellowship in Head  Neck Oncology Surgery', 'ENT Head and Neck Oncology Surgery Consultant', ARRAY['ENT']::text[], 'Consultant', ARRAY['Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('c3d59031-0152-46a6-bfbf-fbb476591595'::uuid, NULL, NULL, 'dr-yusra-khadwardi', 'Dr. Yusra Khadwardi', 'د. يسرا خداوردي', 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-yusra-khadwardi', 'Bachelor’s Degree of Dental Medicine & Surgery', 'General Dentist', ARRAY['Dental']::text[], 'General Dentist', ARRAY['Jeddah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-07-08T12:27:54.792Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('25cb2e78-99e1-410c-9a3f-69b1a140f649'::uuid, 4442, 5637448328, 'dr-zaki-nawawi', 'Dr. Zaki Nawawi', 'د. زكي نواوي', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/DrZaki.Nawawi.jpg', 'Doctorate of Orthopedic, joints and Limb Reconstruction For Children and Adults - Germany', 'Orthopedic, joints and Limb Reconstruction For Children and Adults Consultant', ARRAY['Orthopedics']::text[], 'Consultant', ARRAY['Al Mohammadiyah']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
insert into doctors (id, source_user_id, source_rec_id, slug, name_en, name_ar, image_url, qualification_en, specialty_raw, specialties, title, branches, cities, is_active, sort_order, created_at, updated_at)
values ('94723840-a97b-4c58-ad37-96b4cb8b0afa'::uuid, 5375, 5637509076, 'dr-ziyad-mirza', 'Dr. Ziyad Mirza', 'د. زياد مرزا', 'https://bamc.myclinic.com.sa/OS.WebAPI.External/Images/Ziyad.Mirza.jpg', 'Saudi Board of Pediatrics Saudi Fellowship in Pediatric Gastroenterology, Hepatology & Nutrition', 'Pediatric Gastroenterology, Hepatology & Nutrition Consultant', ARRAY['Gastroenterology & Hepatology','Nutrition','Pediatrics']::text[], 'Consultant', ARRAY['Al Mohammadiyah','Al Safa']::text[], ARRAY['Jeddah']::text[], true, 0, '2026-06-26T00:55:19.901Z'::timestamptz, now())
on conflict (slug) do update set
  name_en = excluded.name_en,
  name_ar = excluded.name_ar,
  image_url = case
    when excluded.image_url like 'https://bamc%' and doctors.image_url like 'https://res.cloudinary.com%' then doctors.image_url
    when (excluded.image_url is null or excluded.image_url = '') and doctors.image_url is not null and doctors.image_url <> '' then doctors.image_url
    else excluded.image_url end,
  qualification_en = excluded.qualification_en,
  specialty_raw = excluded.specialty_raw,
  specialties = excluded.specialties,
  title = excluded.title,
  branches = excluded.branches,
  cities = excluded.cities,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
commit;
