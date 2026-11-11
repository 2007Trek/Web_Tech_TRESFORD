-- Run this file in Supabase SQL Editor.
-- The auth.users table is managed by Supabase Auth.

create table if not exists public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_profiles enable row level security;

create policy "Members can read their own profile"
on public.member_profiles for select
to authenticated
using (auth.uid() = id);

create policy "Members can create their own profile"
on public.member_profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Members can update their own profile"
on public.member_profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.member_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_member on auth.users;
create trigger on_auth_user_created_member
after insert on auth.users
for each row execute procedure public.handle_new_member();

create or replace function public.set_member_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists member_profiles_updated_at on public.member_profiles;
create trigger member_profiles_updated_at
before update on public.member_profiles
for each row execute procedure public.set_member_profile_updated_at();

grant select, insert, update on public.member_profiles to authenticated;
revoke all on public.member_profiles from anon;