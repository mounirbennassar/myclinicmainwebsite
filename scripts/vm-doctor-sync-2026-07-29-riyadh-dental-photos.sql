-- Photos for seven of the ten Riyadh dental doctors added by the two
-- vm-doctor-sync-2026-07-29-riyadh-dental*.sql scripts.
--
-- Supplied by the clinic as individual portraits. Four arrived as transparent
-- cut-outs, so each was composited onto solid WHITE and downscaled to <=1600px
-- before upload — the same treatment as the 2026-08-11 refresh, and for the same
-- reason: a transparent original comes back with a black backdrop under f_auto.
-- Uploaded to Cloudinary cloud `ubhucgne` under doctors/<slug>; all seven
-- delivery URLs verified 200 image/jpeg.
--
-- Asma Baqais, Nora Al-Amer and Nora Al-Otaibi were not among the files supplied
-- and stay on the gender-driven illustration until someone uploads them from the
-- dashboard.
--
-- Applied once by deploy-vm.yml (marker-guarded).
begin;

update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-adeeb-marshad',    updated_at = now() where slug = 'dr-adeeb-marshad';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-ibrahim-abanmy',   updated_at = now() where slug = 'dr-ibrahim-abanmy';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-lara-safi',        updated_at = now() where slug = 'dr-lara-safi';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-reda-dimashkieh',  updated_at = now() where slug = 'dr-reda-dimashkieh';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-raghad-alsaawi',   updated_at = now() where slug = 'dr-raghad-alsaawi';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-abdulmalik-almani', updated_at = now() where slug = 'dr-abdulmalik-almani';
update doctors set image_url = 'https://res.cloudinary.com/ubhucgne/image/upload/f_auto,q_auto/doctors/dr-majed-al-madani',  updated_at = now() where slug = 'dr-majed-al-madani';

commit;
