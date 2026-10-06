import { Router } from 'express';
import { SubscriptionsController } from '../controllers/subscriptions.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Subscription Routes
 * - POST /trial  : Activate the one-time 15-day free trial (auth required)
 * - GET /plans   : List active subscription plans (public / optional auth)
 * - GET /me      : Get current user's active & past subscriptions
 * - GET /payments: Get current user's payment records
 */

router.post('/trial', requireAuth, SubscriptionsController.activateFreeTrial);
router.get('/plans', optionalAuth, SubscriptionsController.getPlans);
router.get('/me', requireAuth, SubscriptionsController.getMySubscriptions);
router.get('/payments', requireAuth, SubscriptionsController.getMyPayments);

export default router;
