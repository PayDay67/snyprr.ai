import { Request, Response, NextFunction } from 'express';
import { SubscriptionsService } from '../services/subscriptions.service.js';
import { AppError } from '../middleware/error.middleware.js';

export class SubscriptionsController {
  /**
   * POST /api/subscriptions/trial
   * Activates the one-time 15-day free trial for the authenticated user.
   * Idempotent in the "already used" direction — returns 409 if already activated.
   */
  static async activateFreeTrial(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }
      const result = await SubscriptionsService.activateFreeTrial(req.user.id);
      res.status(200).json({
        data: {
          subscriptionId: result.subscription_id,
          startedAt: result.started_at,
          expiresAt: result.expires_at,
          status: result.status,
        },
        message: 'Free trial activated successfully.',
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.supabase) {
        throw new AppError('Database client unavailable', 500);
      }
      const plans = await SubscriptionsService.getPlans(req.supabase);
      res.json({ data: plans });
    } catch (err) {
      next(err);
    }
  }

  static async getMySubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.supabase || !req.user) {
        throw new AppError('Authentication required', 401);
      }
      const subs = await SubscriptionsService.getMySubscriptions(req.supabase, req.user.id);
      res.json({ data: subs });
    } catch (err) {
      next(err);
    }
  }

  static async getMyPayments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.supabase || !req.user) {
        throw new AppError('Authentication required', 401);
      }
      const payments = await SubscriptionsService.getMyPayments(req.supabase, req.user.id);
      res.json({ data: payments });
    } catch (err) {
      next(err);
    }
  }
}
