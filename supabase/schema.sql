-- Production version of TaskFlow on Supabase (free tier).
-- Run in the Supabase SQL editor. Auth users live in auth.users (managed by Supabase Auth).

create table public.boards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  color text not null default 'from-indigo-500 to-violet-500',
  created_at timestamptz not null default now()
);

create table public.columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  position int not null
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.columns(id) on delete cascade,
  title text not null,
  description text not null default '',
  labels text[] not null default '{}',
  due_date date,
  position int not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: the database itself guarantees users only touch their own data.
alter table public.boards enable row level security;
alter table public.columns enable row level security;
alter table public.cards enable row level security;

create policy "own boards" on public.boards
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "columns of own boards" on public.columns
  for all using (exists (select 1 from public.boards b where b.id = board_id and b.owner_id = auth.uid()));

create policy "cards of own boards" on public.cards
  for all using (exists (
    select 1 from public.columns c join public.boards b on b.id = c.board_id
    where c.id = column_id and b.owner_id = auth.uid()
  ));
