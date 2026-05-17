-- Shattered Light — Supabase schema
-- Run this in the Supabase SQL editor

-- ── Drop existing (safe to re-run) ──────────────────────────────────────────
drop table if exists public.characters cascade;
drop table if exists public.npcs cascade;
drop function if exists public.set_updated_at cascade;

-- ── Characters ───────────────────────────────────────────────────────────────
-- One row per user per room; all slot data stored as JSON array
create table public.characters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  room_id         text not null,
  character_data  jsonb not null default '{}',
  updated_at      timestamptz not null default now(),
  unique (user_id, room_id)
);

alter table public.characters enable row level security;

create policy "Users manage their own characters"
  on public.characters for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── NPCs ─────────────────────────────────────────────────────────────────────
-- One row per room, managed by GM; players can read
create table public.npcs (
  id          uuid primary key default gen_random_uuid(),
  room_id     text not null unique,
  gm_user_id  uuid not null references auth.users(id) on delete cascade,
  npc_data    jsonb not null default '[]',
  updated_at  timestamptz not null default now()
);

alter table public.npcs enable row level security;

create policy "GM manages NPCs for their room"
  on public.npcs for all
  using  (auth.uid() = gm_user_id)
  with check (auth.uid() = gm_user_id);

create policy "Players can read NPCs"
  on public.npcs for select
  using (auth.uid() is not null);

-- ── updated_at trigger ───────────────────────────────────────────────────────
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger characters_updated_at
  before update on public.characters
  for each row execute procedure public.set_updated_at();

create trigger npcs_updated_at
  before update on public.npcs
  for each row execute procedure public.set_updated_at();
