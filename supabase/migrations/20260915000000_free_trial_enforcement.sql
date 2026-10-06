-- =====================================================================
-- Migration: Free Trial One-Time Enforcement
-- Date: 2026-09-15
-- Purpose:
--   1. Add free_trial_used flag to profiles (single source of truth).
--   2. Add unique constraint on user_subscriptions(user_id, plan_id)
--      so the DB rejects duplicate trial rows even under concurrency.
--   3. Add activate_free_trial() RPC function that performs the entire
--      activation atomically — enforces one-time restriction at the DB level.
-- =====================================================================

-- ─── 1. Add free_trial_used to profiles ──────────────────────────────────────

alter table public.profiles
  add column if not exists free_trial_used boolean not null default false;

-- ─── 2. Unique constraint: one subscription row per (user, plan) ─────────────
-- This makes concurrent duplicate requests impossible at the DB level.

alter table public.user_subscriptions
  drop constraint if exists uq_user_subscriptions_user_plan;

alter table public.user_subscriptions
  add constraint uq_user_subscriptions_user_plan
  unique (user_id, plan_id);

-- ─── 3. Atomic free-trial activation function ────────────────────────────────
-- Called by the backend via supabaseAdmin (service-role, bypasses RLS).
-- Returns the updated subscription row on success.
-- Raises an exception (caught as 409) when the trial has already been used.

create or replace function public.activate_free_trial(p_user_id uuid)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id        uuid;
  v_sub_id         uuid;
  v_started_at     timestamptz;
  v_expires_at     timestamptz;
  v_trial_used     boolean;
begin
  -- 1. Lock the profile row for this user to serialise concurrent calls.
  select free_trial_used
  into   v_trial_used
  from   public.profiles
  where  id = p_user_id
  for update;

  if not found then
    raise exception 'User profile not found' using errcode = 'P0002';
  end if;

  -- 2. Reject if already used.
  if v_trial_used then
    raise exception 'Free trial has already been used'
      using errcode = 'P0001', hint = 'TRIAL_ALREADY_USED';
  end if;

  -- 3. Look up the Free Trial plan.
  select id into v_plan_id
  from   public.subscription_plans
  where  billing_interval = 'FREE_TRIAL'
  limit  1;

  if not found then
    raise exception 'Free Trial plan not found' using errcode = 'P0002';
  end if;

  -- 4. Compute timestamps using server clock (NOT client clock).
  v_started_at := now();
  v_expires_at := now() + interval '15 days';

  -- 5. Update the existing subscription row that the signup trigger created.
  --    If for any reason it doesn't exist, insert it.
  insert into public.user_subscriptions
    (user_id, plan_id, status, started_at, expires_at)
  values
    (p_user_id, v_plan_id, 'ACTIVE', v_started_at, v_expires_at)
  on conflict (user_id, plan_id)
  do update set
    status     = 'ACTIVE',
    started_at = v_started_at,
    expires_at = v_expires_at
  returning id into v_sub_id;

  -- 6. Mark the trial as used on the profile (atomic with the sub update).
  update public.profiles
  set    free_trial_used = true
  where  id = p_user_id;

  -- 7. Return the activated subscription details as JSON.
  return json_build_object(
    'subscription_id', v_sub_id,
    'started_at',      v_started_at,
    'expires_at',      v_expires_at,
    'status',          'ACTIVE'
  );
end;
$$;

-- ─── 4. Backfill: mark existing users who already had a trial as used ─────────
-- Any user who already has a user_subscriptions row linked to the FREE_TRIAL
-- plan is considered to have used their trial.

update public.profiles p
set    free_trial_used = true
where  exists (
  select 1
  from   public.user_subscriptions us
  join   public.subscription_plans sp on sp.id = us.plan_id
  where  us.user_id = p.id
  and    sp.billing_interval = 'FREE_TRIAL'
);

-- ─── 5. RLS: allow users to read their own free_trial_used value ─────────────
-- (profiles already has RLS enabled + select own row policy)
-- No new policy needed — the existing profiles_select_own_or_admin covers this.

-- ─── 6. Grant execute on the RPC only to service_role (backend only) ─────────
-- anon and authenticated roles must NOT call this directly.
revoke execute on function public.activate_free_trial(uuid) from public, anon, authenticated;
grant  execute on function public.activate_free_trial(uuid) to service_role;

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
