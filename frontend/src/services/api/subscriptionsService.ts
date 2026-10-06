/**
 * subscriptionsService.ts
 * Real HTTP implementation of ISubscriptionApi — backed by /api/subscriptions
 */

import type { SubscriptionPlan, UserSubscription } from '../../types';
import type { ISubscriptionApi } from './apiClient';
import type { ApiResponse } from './types';
import { httpGet, httpPost } from './httpClient';
import { httpGetPublic } from './httpClient';

// ─── Backend shapes ───────────────────────────────────────────────────────────

interface BackendPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_interval: string;
  is_active: boolean;
  created_at: string;
}

interface BackendSubscription {
  id: string;
  status: string;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
  plan: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    currency: string;
    billing_interval: string;
  } | null;
}

interface BackendTrialActivation {
  subscriptionId: string;
  startedAt: string;
  expiresAt: string;
  status: string;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

function toFrontendPlan(p: BackendPlan): SubscriptionPlan {
  const isYearly = p.billing_interval === 'yearly';
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    priceMonthly: isYearly ? parseFloat((p.price / 12).toFixed(2)) : p.price,
    priceYearly: isYearly ? p.price : parseFloat((p.price * 12).toFixed(2)),
    features: [], // Extended in future iterations
    isPopular: p.name.toUpperCase().includes('PRO'),
  };
}

function toFrontendSubscription(s: BackendSubscription): UserSubscription {
  return {
    id: s.id,
    userId: '',
    planId: s.plan?.id ?? '',
    planName: s.plan?.name ?? 'Unknown Plan',
    billingInterval: s.plan?.billing_interval ?? '',
    status: s.status as UserSubscription['status'],
    startedAt: s.started_at ?? '',
    currentPeriodEnd: s.expires_at ?? '',
    subscribedTraderIds: [],
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

class SubscriptionsService implements ISubscriptionApi {
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const raw = await httpGetPublic<{ data: BackendPlan[] }>('/api/subscriptions/plans');
    return {
      success: true,
      data: (raw.data ?? []).map(toFrontendPlan),
      timestamp: new Date().toISOString(),
    };
  }

  async getMySubscriptions(): Promise<ApiResponse<UserSubscription[]>> {
    const raw = await httpGet<{ data: BackendSubscription[] }>('/api/subscriptions/me');
    return {
      success: true,
      data: (raw.data ?? []).map(toFrontendSubscription),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Activate the one-time 15-day free trial.
   * Backend enforces the one-time restriction — returns 409 if already used.
   */
  async activateFreeTrial(): Promise<ApiResponse<BackendTrialActivation>> {
    const raw = await httpPost<{ data: BackendTrialActivation; message: string }>(
      '/api/subscriptions/trial'
    );
    return {
      success: true,
      data: raw.data,
      message: raw.message,
      timestamp: new Date().toISOString(),
    };
  }

  async subscribeToPlan(_planId: string): Promise<ApiResponse<{ subscriptionId: string; status: string }>> {
    // Payment gateway integration is out of V1 scope
    return {
      success: false,
      data: { subscriptionId: '', status: 'PENDING' },
      message: 'Payment gateway not yet configured. Contact support.',
      timestamp: new Date().toISOString(),
    };
  }
}

export const subscriptionsService = new SubscriptionsService();
