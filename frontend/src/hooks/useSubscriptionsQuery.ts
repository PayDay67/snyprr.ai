import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsService } from '../services/api/subscriptionsService';
import type { UserSubscription } from '../types';

// ─── Derived trial state ──────────────────────────────────────────────────────

export type TrialState = 'none' | 'active' | 'expired';

/**
 * Derives the current trial state from the user's subscription list.
 * - 'none'    → no FREE_TRIAL subscription row exists (should never happen
 *               after signup, but handles edge cases gracefully)
 * - 'active'  → FREE_TRIAL sub exists, status=ACTIVE, expires_at is in the future
 * - 'expired' → FREE_TRIAL sub exists but is EXPIRED, CANCELLED, or past expires_at
 *
 * The expiry comparison uses the server-stored expires_at timestamp, not the
 * browser clock for display — the backend is always the authoritative source
 * for eligibility (enforced via the DB function). This is only for UI rendering.
 */
export function deriveTrialState(subscriptions: UserSubscription[]): {
  state: TrialState;
  subscription: UserSubscription | undefined;
  daysRemaining: number;
} {
  const trialSub = subscriptions.find(
    (s) => s.billingInterval === 'FREE_TRIAL'
  );

  if (!trialSub) {
    return { state: 'none', subscription: undefined, daysRemaining: 0 };
  }

  const now = Date.now();
  const expiresAt = trialSub.currentPeriodEnd
    ? new Date(trialSub.currentPeriodEnd).getTime()
    : 0;

  const isExpiredByDate = expiresAt > 0 && now >= expiresAt;
  const isExpiredByStatus =
    trialSub.status === 'EXPIRED' || trialSub.status === 'CANCELLED';

  if (isExpiredByDate || isExpiredByStatus) {
    return { state: 'expired', subscription: trialSub, daysRemaining: 0 };
  }

  // Active — compute remaining days for display only
  const msRemaining = expiresAt - now;
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return { state: 'active', subscription: trialSub, daysRemaining };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => subscriptionsService.getPlans(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useMySubscriptions() {
  return useQuery({
    queryKey: ['mySubscriptions'],
    queryFn: () => subscriptionsService.getMySubscriptions(),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Convenience hook — fetches the user's subscriptions and returns the
 * computed trial state. Components should use this instead of manually
 * inspecting the subscriptions list.
 */
export function useTrialState() {
  const { data, isLoading, error } = useMySubscriptions();
  const subscriptions = data?.data ?? [];
  const derived = deriveTrialState(subscriptions);
  return { ...derived, isLoading, error };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Activates the one-time 15-day free trial.
 * On success, invalidates the subscriptions cache so the UI immediately
 * reflects the new trial state without requiring a manual refresh.
 */
export function useActivateFreeTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionsService.activateFreeTrial(),
    onSuccess: () => {
      // Re-fetch so trial state updates across all components
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
}

export function useSubscribeToPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => subscriptionsService.subscribeToPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
    },
  });
}
