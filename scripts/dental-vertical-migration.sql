-- Dental section: tag every lead with a vertical and the specific service slug.
-- Run in Supabase SQL editor.

alter table public.appointments
  add column if not exists vertical text not null default 'medical';

alter table public.appointments
  add column if not exists service text;

-- Constrain vertical so typos can't sneak in from the API.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'appointments_vertical_check'
  ) then
    alter table public.appointments
      add constraint appointments_vertical_check
      check (vertical in ('medical', 'dental'));
  end if;
end $$;

create index if not exists appointments_vertical_idx
  on public.appointments (vertical);

create index if not exists appointments_service_idx
  on public.appointments (service);
