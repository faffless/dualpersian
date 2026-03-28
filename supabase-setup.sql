-- =============================================
-- Dual Persian — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste → Run)
-- =============================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  age integer not null,
  gender text not null,
  looking_for text not null,
  bio text default '',
  education text default '',
  profession text default '',
  height_cm integer,
  city text default '',
  country text default '',
  lat double precision,
  lng double precision,
  avatar_url text,
  is_premium boolean default false,
  daily_likes_used integer default 0,
  daily_likes_reset_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 2. PHOTOS TABLE
create table if not exists public.photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  url text not null,
  "order" integer default 0,
  created_at timestamptz default now()
);

-- 3. LIKES TABLE
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  from_user uuid references public.profiles(id) on delete cascade not null,
  to_user uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(from_user, to_user)
);

-- 4. MATCHES TABLE
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user1 uuid references public.profiles(id) on delete cascade not null,
  user2 uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- 5. MESSAGES TABLE
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.photos enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- PROFILES: anyone can read, only owner can update/insert
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- PHOTOS: anyone can read, only owner can insert/delete
create policy "Anyone can view photos"
  on public.photos for select
  using (true);

create policy "Users can insert own photos"
  on public.photos for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own photos"
  on public.photos for delete
  using (auth.uid() = user_id);

-- LIKES: only sender can insert, only involved users can see their own
create policy "Users can insert likes"
  on public.likes for insert
  with check (auth.uid() = from_user);

create policy "Users can see likes they sent or received"
  on public.likes for select
  using (auth.uid() = from_user or auth.uid() = to_user);

-- MATCHES: only participants can read
create policy "Users can view own matches"
  on public.matches for select
  using (auth.uid() = user1 or auth.uid() = user2);

create policy "Authenticated users can create matches"
  on public.matches for insert
  with check (auth.uid() = user1 or auth.uid() = user2);

-- MESSAGES: only match participants can read/insert
create policy "Match participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.matches
      where matches.id = messages.match_id
      and (matches.user1 = auth.uid() or matches.user2 = auth.uid())
    )
  );

create policy "Match participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches
      where matches.id = match_id
      and (matches.user1 = auth.uid() or matches.user2 = auth.uid())
    )
  );

-- =============================================
-- STORAGE BUCKET
-- =============================================

-- Create photos bucket (run separately if needed)
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict do nothing;

-- Storage policy: anyone can view
create policy "Public photo access"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Storage policy: authenticated users can upload to their own folder
create policy "Users can upload own photos"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: users can update/delete their own photos
create policy "Users can update own photos"
  on storage.objects for update
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own photos"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================
-- ENABLE REALTIME FOR MESSAGES
-- =============================================
alter publication supabase_realtime add table public.messages;
