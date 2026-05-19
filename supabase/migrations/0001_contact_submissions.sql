-- Contact form submissions.
-- Run this once in Supabase SQL Editor (Dashboard → SQL → New query).

create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  message       text not null,
  role          text,
  reason        text,
  source        text not null default 'mba'
                check (source in ('portfolio', 'mba')),
  ip_hash       text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

create index if not exists contact_submissions_ip_recent_idx
  on public.contact_submissions (ip_hash, created_at desc);

-- Enable Row Level Security. Without explicit policies, no role can
-- read or write. The service_role key bypasses RLS, which is what the
-- API route uses to insert. We do NOT add a public insert policy
-- because all writes go through the API route, never directly from the
-- browser.
alter table public.contact_submissions enable row level security;

-- Lock down everything by default. (No policies = denied for anon/auth.)
-- If you ever want to allow direct-from-client inserts, add:
--   create policy "anon can insert" on public.contact_submissions
--     for insert to anon with check (true);
