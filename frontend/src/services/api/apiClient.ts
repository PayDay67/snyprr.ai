import { AuditLogEntry, MarketTicker, NotificationItem, Prediction, SubscriptionPlan, TraderJournalEntry, TraderProfile, User, UserRole, UserSubscription } from '../../types';
import { ApiResponse, PaginatedResponse } from './types';

export interface IPredictionApi {
  getPredictions(filters?: {
    instrument?: string;
    direction?: string;
    status?: string;
    timeframe?: string;
    traderId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Prediction>>;

  getPredictionById(id: string): Promise<ApiResponse<Prediction>>;
  createPrediction(data: Partial<Prediction>): Promise<ApiResponse<Prediction>>;
  updatePrediction(id: string, data: Partial<Prediction>): Promise<ApiResponse<Prediction>>;
  publishPrediction(id: string): Promise<ApiResponse<Prediction>>;
  closePrediction(id: string, outcome: Prediction['outcome']): Promise<ApiResponse<Prediction>>;
}

export interface ITraderApi {
  getTraders(search?: string): Promise<ApiResponse<TraderProfile[]>>;
  getTraderById(id: string): Promise<ApiResponse<TraderProfile>>;
  followTrader(traderId: string): Promise<ApiResponse<{ success: boolean; isFollowing: boolean }>>;
}

export interface IUserApi {
  getCurrentUser(): Promise<ApiResponse<User>>;
  getWatchlist(): Promise<ApiResponse<Prediction[]>>;
  toggleWatchlist(predictionId: string): Promise<ApiResponse<{ isSaved: boolean }>>;
  updateProfile(data: { full_name?: string; username?: string; avatar_url?: string | null }): Promise<ApiResponse<User>>;
}

export interface ISubscriptionApi {
  getPlans(): Promise<ApiResponse<SubscriptionPlan[]>>;
  getMySubscriptions(): Promise<ApiResponse<UserSubscription[]>>;
  activateFreeTrial(): Promise<ApiResponse<{ subscriptionId: string; startedAt: string; expiresAt: string; status: string }>>;
  subscribeToPlan(planId: string): Promise<ApiResponse<{ subscriptionId: string; status: string }>>;
}

export interface INotificationApi {
  getNotifications(): Promise<ApiResponse<NotificationItem[]>>;
  markAsRead(id: string): Promise<ApiResponse<void>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}

export interface IAdminApi {
  getUsers(): Promise<ApiResponse<User[]>>;
  getTraders(): Promise<ApiResponse<TraderProfile[]>>;
  getAuditLogs(): Promise<ApiResponse<AuditLogEntry[]>>;
  getPlatformStats(): Promise<ApiResponse<{
    total_users: number;
    total_signals: number;
    active_published_signals: number;
    registered_traders: number;
    active_subscriptions: number;
  }>>;
  updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<User>>;
  updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'): Promise<ApiResponse<void>>;
  removeUserRole(userId: string, role: UserRole): Promise<ApiResponse<void>>;
}
