import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types.js';
import { AppError } from '../middleware/error.middleware.js';
import { supabaseAdmin } from '../config/supabaseClient.js';

// Shape returned by the activate_free_trial() SQL function
interface TrialActivationResult {
  subscription_id: string;
  started_at: string;
  expires_at: string;
  status: string;
}

export class SubscriptionsService {
  /**
   * Activate the one-time 15-day free trial for the authenticated user.
   *
   * Enforcement is done inside the DB function activate_free_trial() which:
   *   - Acquires a FOR UPDATE lock on the profile row (prevents race conditions)
   *   - Checks free_trial_used — raises P0001 if already used
   *   - Sets started_at = now(), expires_at = now() + 15 days (server clock)
   *   - Marks free_trial_used = true atomically
   *
   * We call it through supabaseAdmin (service_role) because the RPC is
   * restricted to service_role only — no regular user can call it directly.
   */
  static async activateFreeTrial(userId: string): Promise<TrialActivationResult> {
    const { data, error } = await supabaseAdmin.rpc('activate_free_trial', {
      p_user_id: userId,
    });

    if (error) {
      // Postgres raises hint = 'TRIAL_ALREADY_USED' when the trial was already used
      if (
        error.message?.includes('TRIAL_ALREADY_USED') ||
        error.message?.includes('already been used')
      ) {
        throw new AppError('Free trial has already been used.', 409);
      }
      throw new AppError(`Failed to activate free trial: ${error.message}`, 500);
    }

    return data as unknown as TrialActivationResult;
  }

  /**
   * List all active subscription plans (Public/Subscriber access).
   */
  static async getPlans(supabase: SupabaseClient<Database>) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      throw new AppError(`Failed to fetch subscription plans: ${error.message}`, 400, error);
    }
    return data;
  }

  /**
   * Get all subscriptions for current user.
   */
  static async getMySubscriptions(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans (
          id,
          name,
          description,
          price,
          currency,
          billing_interval
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch user subscriptions: ${error.message}`, 400, error);
    }
    return data;
  }

  /**
   * Get payment records for current user.
   */
  static async getMyPayments(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch payment records: ${error.message}`, 400, error);
    }
    return data;
  }
}
