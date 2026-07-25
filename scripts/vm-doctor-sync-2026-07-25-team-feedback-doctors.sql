-- Team feedback 2026-07-25 (via Mounir):
--   1. Dr. Walaa Almasri (Allergy & Immunology) left the clinic  → deactivate.
--   2. Dr. Salwa Althagafi (Obstetrics & Gynecology) left        → deactivate.
--   3. Dr. Badria Alnouh belongs to النساء والولادة ONLY — remove the
--      'Dermatology & Cosmetics' link ("لا تربطها بالتجميل، غير القسم حقها").
--      Her title still mentions Aesthetic Gynecology, which is her real
--      credential; only the department/carousel membership changes.
--
-- Deactivation, not deletion: the dashboard can restore them if either
-- doctor returns, and appointment history keeps its reference.
--
-- Applied once to the VM database by deploy-vm.yml. ⚠️ Neon (the Vercel
-- site's DB) is quota-dead right now — if it is ever revived before the
-- domain cutover, run this same file against Neon or the public site will
-- keep showing all three unchanged.

begin;

update doctors
   set is_active = false, updated_at = now()
 where slug in ('dr-walaa-almasri', 'dr-salwa-al-thagafi');

update doctors
   set specialties = array['Obstetrics & Gynecology']::text[], updated_at = now()
 where slug = 'dr-badria-alnouh';

-- Fail the deploy loudly if any slug didn't match, instead of a silent no-op.
do $$
declare n int;
begin
  select count(*) into n from doctors
   where slug in ('dr-walaa-almasri', 'dr-salwa-al-thagafi')
     and is_active = false;
  if n <> 2 then
    raise exception 'expected 2 deactivated leavers, found %', n;
  end if;

  select count(*) into n from doctors
   where slug = 'dr-badria-alnouh'
     and specialties = array['Obstetrics & Gynecology']::text[];
  if n <> 1 then
    raise exception 'dr-badria-alnouh specialties not updated';
  end if;
end $$;

commit;
