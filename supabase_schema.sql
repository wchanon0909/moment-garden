-- Moment Garden Supabase schema
-- Run this in Supabase SQL Editor if you want all friends to share the same moments.

create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(text) <= 300),
  author text default 'anonymous',
  anonymous boolean default false,
  type text default 'cute',
  target text default 'both',
  reactions jsonb default '{"love":0,"eyes":0,"laugh":0,"ship":0}'::jsonb,
  reacted_by jsonb default '{}'::jsonb,
  approved boolean default true,
  x numeric default 50,
  y numeric default 50,
  created_at timestamptz default now()
);

alter table public.moments enable row level security;

-- Simple small-group policy:
-- Anyone with your public anon key can read/insert/update/delete moments.
-- This is OK for a private invite-code demo, but not strong security.
-- For a serious private app, use Supabase Auth and stricter policies.

drop policy if exists "moments_select" on public.moments;
create policy "moments_select"
on public.moments for select
using (true);

drop policy if exists "moments_insert" on public.moments;
create policy "moments_insert"
on public.moments for insert
with check (true);

drop policy if exists "moments_update" on public.moments;
create policy "moments_update"
on public.moments for update
using (true)
with check (true);

drop policy if exists "moments_delete" on public.moments;
create policy "moments_delete"
on public.moments for delete
using (true);
