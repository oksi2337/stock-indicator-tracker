-- Run this in your Supabase SQL Editor

create table if not exists snapshots (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  label       text,
  data        jsonb not null
);

alter table snapshots enable row level security;

create policy "users see own snapshots"
  on snapshots for select
  using (auth.uid() = user_id);

create policy "users insert own snapshots"
  on snapshots for insert
  with check (auth.uid() = user_id);

create policy "users delete own snapshots"
  on snapshots for delete
  using (auth.uid() = user_id);

create index snapshots_user_created on snapshots (user_id, created_at desc);
