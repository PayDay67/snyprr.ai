import { AuditLogEntry, NotificationItem, Prediction, SubscriptionPlan, TraderProfile, User } from '../../types';
import { IAdminApi, INotificationApi, IPredictionApi, ISubscriptionApi, ITraderApi, IUserApi } from '../api/apiClient';
import { ApiResponse, NotFoundError, PaginatedResponse } from '../api/types';
import { MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_PREDICTIONS, MOCK_SUBSCRIPTION_PLANS, MOCK_TRADERS, MOCK_USERS } from './mockData';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

class MockPredictionService implements IPredictionApi {
  private predictions: Prediction[] = [...MOCK_PREDICTIONS];

  async getPredictions(filters?: {
    instrument?: string;
    direction?: string;
    status?: string;
    timeframe?: string;
    traderId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Prediction>> {
    await delay();
    let result = [...this.predictions];

    if (filters?.instrument) {
      result = result.filter((p) => p.instrument.toLowerCase().includes(filters.instrument!.toLowerCase()));
    }
    if (filters?.direction) {
      result = result.filter((p) => p.direction === filters.direction);
    }
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.timeframe) {
      result = result.filter((p) => p.timeframe === filters.timeframe);
    }
    if (filters?.traderId) {
      result = result.filter((p) => p.traderId === filters.traderId);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.instrument.toLowerCase().includes(query) ||
          p.strategy.toLowerCase().includes(query) ||
          p.trader.displayName.toLowerCase().includes(query)
      );
    }

    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedItems = result.slice((page - 1) * pageSize, page * pageSize);

    return {
      success: true,
      data: paginatedItems,
      pagination: { page, pageSize, totalItems, totalPages },
      timestamp: new Date().toISOString(),
    };
  }

  async getPredictionById(id: string): Promise<ApiResponse<Prediction>> {
    await delay();
    const item = this.predictions.find((p) => p.id === id);
    if (!item) {
      throw new NotFoundError(`Prediction with ID ${id} not found`);
    }
    return { success: true, data: item, timestamp: new Date().toISOString() };
  }

  async createPrediction(data: Partial<Prediction>): Promise<ApiResponse<Prediction>> {
    await delay();
    const newPrediction: Prediction = {
      id: `pred_${Date.now()}`,
      traderId: data.traderId || 'trader_1',
      trader: data.trader || {
        id: 'trader_1',
        displayName: 'Satoshi Wave',
        handle: '@satoshiwave',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        verifiedBadge: true,
        winRate: 78.5,
      },
      title: data.title || 'Untitled Prediction',
      instrument: data.instrument || 'BTC/USDT',
      category: data.category || 'CRYPTO',
      direction: data.direction || 'LONG',
      entryPrice: data.entryPrice || 90000,
      stopLoss: data.stopLoss || 88000,
      takeProfit: data.takeProfit || 95000,
      riskRewardRatio: data.riskRewardRatio || 2.5,
      timeframe: data.timeframe || '1h',
      strategy: data.strategy || 'Breakout & Retest',
      analysis: data.analysis || 'Detailed analysis text...',
      tags: data.tags || ['Crypto'],
      status: 'PUBLISHED',
      visibility: data.visibility || 'PUBLIC',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likesCount: 0,
      viewsCount: 1,
    };
    this.predictions.unshift(newPrediction);
    return { success: true, data: newPrediction, timestamp: new Date().toISOString() };
  }

  async updatePrediction(id: string, data: Partial<Prediction>): Promise<ApiResponse<Prediction>> {
    await delay();
    const index = this.predictions.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundError('Prediction not found');

    this.predictions[index] = { ...this.predictions[index], ...data, updatedAt: new Date().toISOString() };
    return { success: true, data: this.predictions[index], timestamp: new Date().toISOString() };
  }

  async publishPrediction(id: string): Promise<ApiResponse<Prediction>> {
    return this.updatePrediction(id, { status: 'PUBLISHED', publishedAt: new Date().toISOString() });
  }

  async closePrediction(id: string, outcome: Prediction['outcome']): Promise<ApiResponse<Prediction>> {
    return this.updatePrediction(id, { status: outcome?.status === 'TARGET_HIT' ? 'TARGET_HIT' : 'CLOSED', outcome });
  }
}

class MockTraderService implements ITraderApi {
  private traders = [...MOCK_TRADERS];

  async getTraders(search?: string): Promise<ApiResponse<TraderProfile[]>> {
    await delay();
    let result = [...this.traders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.displayName.toLowerCase().includes(q) || t.handle.toLowerCase().includes(q));
    }
    return { success: true, data: result, timestamp: new Date().toISOString() };
  }

  async getTraderById(id: string): Promise<ApiResponse<TraderProfile>> {
    await delay();
    const trader = this.traders.find((t) => t.id === id || t.userId === id);
    if (!trader) throw new NotFoundError('Trader profile not found');
    return { success: true, data: trader, timestamp: new Date().toISOString() };
  }

  async followTrader(traderId: string): Promise<ApiResponse<{ success: boolean; isFollowing: boolean }>> {
    await delay();
    return { success: true, data: { success: true, isFollowing: true }, timestamp: new Date().toISOString() };
  }
}

class MockUserService implements IUserApi {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay();
    return { success: true, data: MOCK_USERS[3], timestamp: new Date().toISOString() };
  }

  async getWatchlist(): Promise<ApiResponse<Prediction[]>> {
    await delay();
    return { success: true, data: MOCK_PREDICTIONS.filter((p) => p.isSaved), timestamp: new Date().toISOString() };
  }

  async toggleWatchlist(predictionId: string): Promise<ApiResponse<{ isSaved: boolean }>> {
    await delay();
    return { success: true, data: { isSaved: true }, timestamp: new Date().toISOString() };
  }

  async updateProfile(_data: { full_name?: string; username?: string; avatar_url?: string | null }): Promise<ApiResponse<User>> {
    await delay();
    return { success: true, data: MOCK_USERS[3], timestamp: new Date().toISOString() };
  }
}

class MockSubscriptionService implements ISubscriptionApi {
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    await delay();
    return { success: true, data: MOCK_SUBSCRIPTION_PLANS, timestamp: new Date().toISOString() };
  }

  async getMySubscriptions(): Promise<ApiResponse<import('../../types').UserSubscription[]>> {
    await delay();
    return { success: true, data: [], timestamp: new Date().toISOString() };
  }

    async activateFreeTrial(): Promise<
    ApiResponse<{
      subscriptionId: string;
      startedAt: string;
      expiresAt: string;
      status: string;
    }>
  > {
    await delay();

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + 15);

    return {
      success: true,
      data: {
        subscriptionId: `trial_${Date.now()}`,
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'ACTIVE',
      },
      timestamp: new Date().toISOString(),
    };
  }

  async subscribeToPlan(_planId: string): Promise<ApiResponse<{ subscriptionId: string; status: string }>> {
    await delay();
    return { success: true, data: { subscriptionId: `sub_${Date.now()}`, status: 'ACTIVE' }, timestamp: new Date().toISOString() };
  }
}

class MockNotificationService implements INotificationApi {
  private notifications = [...MOCK_NOTIFICATIONS];

  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    await delay();
    return { success: true, data: this.notifications, timestamp: new Date().toISOString() };
  }

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    await delay();
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return { success: true, data: undefined, timestamp: new Date().toISOString() };
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    await delay();
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    return { success: true, data: undefined, timestamp: new Date().toISOString() };
  }
}

class MockAdminService implements IAdminApi {
  async getUsers(): Promise<ApiResponse<User[]>> {
    await delay();
    return { success: true, data: MOCK_USERS, timestamp: new Date().toISOString() };
  }

  async getTraders(): Promise<ApiResponse<TraderProfile[]>> {
    await delay();
    return { success: true, data: MOCK_TRADERS, timestamp: new Date().toISOString() };
  }

  async getAuditLogs(): Promise<ApiResponse<AuditLogEntry[]>> {
    await delay();
    return { success: true, data: MOCK_AUDIT_LOGS, timestamp: new Date().toISOString() };
  }

  async getPlatformStats(): Promise<ApiResponse<{
    total_users: number;
    total_signals: number;
    active_published_signals: number;
    registered_traders: number;
    active_subscriptions: number;
  }>> {
    await delay();
    return {
      success: true,
      data: {
        total_users: MOCK_USERS.length,
        total_signals: 0,
        active_published_signals: 0,
        registered_traders: MOCK_TRADERS.length,
        active_subscriptions: 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  async updateUserRole(userId: string, role: User['role']): Promise<ApiResponse<User>> {
    await delay();
    const index = MOCK_USERS.findIndex((u) => u.id === userId);
    if (index === -1) throw new NotFoundError('User not found');
    const updated = { ...MOCK_USERS[index], role };
    MOCK_USERS[index] = updated;
    return { success: true, data: updated, timestamp: new Date().toISOString() };
  }

  async updateUserStatus(_userId: string, _status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'): Promise<ApiResponse<void>> {
    await delay();
    return { success: true, data: undefined, timestamp: new Date().toISOString() };
  }

  async removeUserRole(_userId: string, _role: import('../../types').UserRole): Promise<ApiResponse<void>> {
    await delay();
    return { success: true, data: undefined, timestamp: new Date().toISOString() };
  }
}

export const mockPredictionApi = new MockPredictionService();
export const mockTraderApi = new MockTraderService();
export const mockUserApi = new MockUserService();
export const mockSubscriptionApi = new MockSubscriptionService();
export const mockNotificationApi = new MockNotificationService();
export const mockAdminApi = new MockAdminService();
