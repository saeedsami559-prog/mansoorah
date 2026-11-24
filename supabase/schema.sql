-- Mansoorah database schema for Supabase.
-- Run once: Supabase dashboard → SQL Editor → New query → paste this whole file → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).

-- E-mail that automatically becomes the admin when it signs up on the website.
create or replace function public.admin_email() returns text
language sql immutable as $$ select 'saeedsami559@gmail.com'::text $$;

-- ---------- Profiles (one per account) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer', 'technician', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', 'customer');
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    case
      when lower(new.email) = lower(public.admin_email()) then 'admin'
      when requested = 'technician' then 'technician'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

-- ---------- Bookings ----------
create table if not exists public.bookings (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  tech_id text not null,
  date date not null,
  slot text not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  total numeric(8, 3) not null check (total >= 0),
  payment text not null check (payment in ('omannet', 'card', 'thawani', 'cash')),
  customer jsonb not null,
  rating jsonb,
  completed_at date,
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings (user_id);

-- ---------- Requests: technician applications, partner requests, contact messages ----------
create table if not exists public.requests (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('technician', 'partner-retail', 'partner-landlord', 'contact')),
  payload jsonb not null,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'new' check (status in ('new', 'done')),
  created_at timestamptz not null default now()
);

-- ---------- Row-level security ----------
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.requests enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
-- Users may only change their name and phone, never their role.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, phone) on public.profiles to authenticated;

drop policy if exists "bookings: insert own" on public.bookings;
create policy "bookings: insert own" on public.bookings
  for insert to authenticated with check (user_id = auth.uid() and status = 'upcoming' and rating is null);

drop policy if exists "bookings: read own or admin" on public.bookings;
create policy "bookings: read own or admin" on public.bookings
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings: update own or admin" on public.bookings;
create policy "bookings: update own or admin" on public.bookings
  for update using (user_id = auth.uid() or public.is_admin());
revoke update on public.bookings from authenticated, anon;
grant update (status, date, slot, rating, completed_at) on public.bookings to authenticated;

-- Customers can only cancel, reschedule or rate their own completed bookings;
-- only the admin can mark a booking as completed.
create or replace function public.guard_booking_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then return new; end if;
  if new.status = 'completed' and old.status <> 'completed' then
    raise exception 'Only the admin can mark a booking as completed';
  end if;
  if new.rating is distinct from old.rating and old.status <> 'completed' then
    raise exception 'Only completed bookings can be rated';
  end if;
  if old.status = 'cancelled' then
    raise exception 'Cancelled bookings cannot be changed';
  end if;
  return new;
end $$;
drop trigger if exists bookings_guard on public.bookings;
create trigger bookings_guard before update on public.bookings
  for each row execute function public.guard_booking_update();

drop policy if exists "requests: anyone can submit" on public.requests;
create policy "requests: anyone can submit" on public.requests
  for insert to anon, authenticated with check (status = 'new' and (user_id is null or user_id = auth.uid()));

drop policy if exists "requests: admin reads" on public.requests;
create policy "requests: admin reads" on public.requests
  for select using (public.is_admin());

drop policy if exists "requests: admin updates" on public.requests;
create policy "requests: admin updates" on public.requests
  for update using (public.is_admin());

-- If the admin account already existed before this script ran, promote it now.
insert into public.profiles (id, email, role)
select id, email, 'admin' from auth.users where lower(email) = lower(public.admin_email())
on conflict (id) do update set role = 'admin';
