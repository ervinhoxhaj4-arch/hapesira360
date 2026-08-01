create extension if not exists "pgcrypto";

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  purpose text not null check (purpose in ('shitje','qira')),
  property_type text not null,
  city text not null,
  neighborhood text,
  price numeric not null,
  area numeric not null,
  bedrooms integer default 0,
  bathrooms integer default 0,
  floor integer,
  description text,
  cover_image text,
  images text[] default '{}',
  tour_360_url text,
  latitude double precision,
  longitude double precision,
  featured boolean default false,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.properties enable row level security;
create policy "Published properties are public" on public.properties for select using (published = true);

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;
