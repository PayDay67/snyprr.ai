-- =====================================================================
-- TRADING PLATFORM — SUPABASE SCHEMA (Phase 1, RBAC-adjusted)
-- Migration: 20260905000000_phase1_rbac_schema.sql
-- Roles used here: user (non-subscriber), subscriber, trader, admin
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";  -- case-insensitive text, used for email uniqueness

-- =====================================================================
-- 1. ROLES & PERMISSIONS (RBAC)
-- =====================================================================

create table if not exists public.roles (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,      -- 'user' | 'subscriber' | 'trader' | 'admin'
  description text
);

create table if not exists public.permissions (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,      -- e.g. 'signal.create', 'signal.publish'
  description text
);

create table if not exists public.role_permissions (
  role_id       uuid references public.roles(id) on delete cascade,
  permission_id uuid references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

-- Seed roles
insert into public.roles (name, description) values
  ('user',       'Non-subscriber. Can browse public site, has 1-month free trial on signup.'),
  ('subscriber', 'Paid or trial access. Can view published signals and permitted trader data.'),
  ('trader',     'Creates, edits, publishes own signals. Views own analytics.'),
  ('admin',      'Full administrative access.')
on conflict (name) do nothing;

-- Seed example permissions
insert into public.permissions (name, description) values
  ('signal.create',        'Create a trading signal'),
  ('signal.publish',       'Publish a trading signal'),
  ('signal.update',        'Update own trading signal'),
  ('signal.cancel',        'Cancel own trading signal'),
  ('signal.view_published','View published signals'),
  ('user.view',            'View user records'),
  ('user.suspend',         'Suspend a user account'),
  ('subscription.manage',  'Manage subscription plans'),
  ('payment.view',         'View payment records'),
  ('admin.access',         'Access admin dashboard')
on conflict (name) do nothing;

-- Wire trader role -> trader permissions
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r, public.permissions p
where r.name = 'trader'
  and p.name in ('signal.create','signal.publish','signal.update','signal.cancel')
on conflict do nothing;

-- Wire subscriber role -> read permission
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r, public.permissions p
where r.name = 'subscriber' and p.name = 'signal.view_published'
on conflict do nothing;

-- Wire admin -> everything
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name = 'admin'
on conflict do nothing;

-- Helper: check role
create or replace function public.has_role(_user_id uuid, _role_name text)
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = _user_id and r.name = _role_name
  );
$$;

-- Helper: check permission
create or replace function public.has_permission(_user_id uuid, _permission_name text)
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = _user_id and p.name = _permission_name
  );
$$;

-- =====================================================================
-- 2. PROFILES (linked to auth.users)
-- =====================================================================

-- Normalizes a phone number to a bare-digits form (e.g. +91 98765 43210 -> 919876543210)
-- so that formatting differences (spaces, dashes, +) never bypass the uniqueness constraint.
create or replace function public.normalize_phone(_phone text)
returns text
language sql
immutable
as $$
  select nullif(regexp_replace(_phone, '[^0-9]', '', 'g'), '');
$$;

create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          citext unique,          -- case-insensitive: one account per email
  phone          text unique,            -- normalized digits only: one account per phone number
  full_name      text,
  username       text unique,
  avatar_url     text,
  account_status text not null default 'ACTIVE'
                 check (account_status in ('ACTIVE','SUSPENDED','BLOCKED','PENDING_VERIFICATION')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint profiles_phone_format check (phone is null or phone ~ '^[0-9]{10,15}$')
);

create index if not exists idx_profiles_phone on public.profiles(phone);

-- Keep phone normalized on every insert/update, regardless of how it arrives
create or replace function public.normalize_profile_phone()
returns trigger
language plpgsql
as $$
begin
  if new.phone is not null then
    new.phone := public.normalize_phone(new.phone);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_normalize_profile_phone on public.profiles;
create trigger trg_normalize_profile_phone
  before insert or update on public.profiles
  for each row execute procedure public.normalize_profile_phone();

-- =====================================================================
-- 3. SUBSCRIPTIONS (with 1-month free trial for every new user)
-- =====================================================================

create table if not exists public.subscription_plans (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  price           numeric(12,2) not null default 0,
  currency        text not null default 'INR',
  billing_interval text not null check (billing_interval in ('FREE_TRIAL','MONTHLY','QUARTERLY','YEARLY')),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

insert into public.subscription_plans (name, description, price, billing_interval)
values ('Free Trial', '1-month free access granted automatically on signup', 0, 'FREE_TRIAL')
on conflict do nothing;

create table if not exists public.user_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  plan_id       uuid not null references public.subscription_plans(id),
  status        text not null default 'ACTIVE'
                check (status in ('ACTIVE','CANCELLED','EXPIRED','SUSPENDED')),
  started_at    timestamptz,
  expires_at    timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists idx_user_subscriptions_lookup
  on public.user_subscriptions(user_id, status, expires_at);

create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  subscription_id     uuid references public.user_subscriptions(id),
  provider            text not null,
  provider_payment_id text,
  amount              numeric(12,2) not null,
  currency            text not null default 'INR',
  status              text not null,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

-- =====================================================================
-- 4. TRADER PROFILES & TRADING SIGNALS (subset — extend per full spec doc)
-- =====================================================================

create table if not exists public.trader_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references auth.users(id) on delete restrict,
  display_name text not null,
  bio          text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.trading_signals (
  id            uuid primary key default gen_random_uuid(),
  trader_id     uuid not null references public.trader_profiles(id) on delete restrict,
  direction     text not null check (direction in ('LONG','SHORT')),
  entry_price   numeric(30,10),
  stop_loss_price numeric(30,10) not null,
  status        text not null default 'DRAFT'
                check (status in ('DRAFT','PUBLISHED','ACTIVE','PARTIALLY_COMPLETED',
                                   'COMPLETED','STOP_LOSS_HIT','CANCELLED','EXPIRED','INVALIDATED')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_trading_signals_status on public.trading_signals(status, published_at);

-- =====================================================================
-- 5. TRIGGER: new auth.users row -> profile + default role + free trial
-- =====================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
  v_plan_id uuid;
begin
  insert into public.profiles (id, email, phone, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.phone, new.raw_user_meta_data->>'phone'),
    new.raw_user_meta_data->>'full_name'
  );

  select id into v_role_id from public.roles where name = 'user';
  insert into public.user_roles (user_id, role_id) values (new.id, v_role_id)
  on conflict do nothing;

  select id into v_plan_id from public.subscription_plans where name = 'Free Trial';
  insert into public.user_subscriptions (user_id, plan_id, status, started_at, expires_at)
  values (new.id, v_plan_id, 'ACTIVE', now(), now() + interval '15 days');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- 7. ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.trader_profiles enable row level security;
alter table public.trading_signals enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.subscription_plans enable row level security;

-- profiles: own row, or admin
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- roles / permissions: readable by anyone authenticated, writable only by admin
drop policy if exists "roles_select_all" on public.roles;
create policy "roles_select_all" on public.roles for select using (true);

drop policy if exists "permissions_select_all" on public.permissions;
create policy "permissions_select_all" on public.permissions for select using (true);

drop policy if exists "role_permissions_select_all" on public.role_permissions;
create policy "role_permissions_select_all" on public.role_permissions for select using (true);

drop policy if exists "user_roles_select_own_or_admin" on public.user_roles;
create policy "user_roles_select_own_or_admin" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "user_roles_admin_write" on public.user_roles;
create policy "user_roles_admin_write" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- subscription_plans: readable by anyone
drop policy if exists "plans_select_all" on public.subscription_plans;
create policy "plans_select_all" on public.subscription_plans for select using (true);

-- user_subscriptions: own row, or admin
drop policy if exists "subs_select_own_or_admin" on public.user_subscriptions;
create policy "subs_select_own_or_admin" on public.user_subscriptions
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- payments: own row, or admin
drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin" on public.payments
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- trader_profiles: public read, owner write
drop policy if exists "trader_profiles_select_all" on public.trader_profiles;
create policy "trader_profiles_select_all" on public.trader_profiles for select using (true);

drop policy if exists "trader_profiles_owner_write" on public.trader_profiles;
create policy "trader_profiles_owner_write" on public.trader_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- trading_signals:
--   * anyone with subscriber/trader/admin role can SELECT published signals
--   * only the owning trader can INSERT/UPDATE their own signals
--   * subscribers/users can NEVER insert/update/delete
drop policy if exists "signals_select_published" on public.trading_signals;
create policy "signals_select_published" on public.trading_signals
  for select using (
    status = 'PUBLISHED'
    or exists (
      select 1 from public.trader_profiles tp
      where tp.id = trading_signals.trader_id and tp.user_id = auth.uid()
    )
    or public.has_role(auth.uid(), 'admin')
  );

drop policy if exists "signals_trader_insert_own" on public.trading_signals;
create policy "signals_trader_insert_own" on public.trading_signals
  for insert with check (
    public.has_role(auth.uid(), 'trader')
    and exists (
      select 1 from public.trader_profiles tp
      where tp.id = trading_signals.trader_id and tp.user_id = auth.uid()
    )
  );

drop policy if exists "signals_trader_update_own" on public.trading_signals;
create policy "signals_trader_update_own" on public.trading_signals
  for update using (
    exists (
      select 1 from public.trader_profiles tp
      where tp.id = trading_signals.trader_id and tp.user_id = auth.uid()
    )
  );

-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
