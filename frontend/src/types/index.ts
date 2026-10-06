export type UserRole = 'ADMIN' | 'TRADER' | 'USER';

export type Permission =
  | 'manage_users'
  | 'manage_traders'
  | 'moderate_predictions'
  | 'manage_subscriptions'
  | 'view_audit_logs'
  | 'manage_settings'
  | 'create_prediction'
  | 'edit_prediction'
  | 'publish_prediction'
  | 'close_prediction'
  | 'view_trader_performance'
  | 'view_predictions'
  | 'follow_trader'
  | 'subscribe_trader'
  | 'manage_watchlist'
  | 'track_prediction';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  subscriptionTier?: 'FREE' | 'PRO' | 'VIP';
  bio?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  permissions: Permission[];
}

export interface TraderProfile {
  id: string;
  userId: string;
  displayName: string;
  handle: string;
  avatar: string;
  bio: string;
  verifiedBadge: boolean;
  joinedDate: string;
  followersCount: number;
  subscribersCount: number;
  totalPredictions: number;
  winRate: number; // Percentage (e.g. 76.4)
  avgRiskReward: number; // e.g. 2.85
  featuredMarkets: string[];
  socialLinks?: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
}

export type PredictionDirection = 'LONG' | 'SHORT';

export type PredictionStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ACTIVE'
  | 'TARGET_HIT'
  | 'STOP_HIT'
  | 'CLOSED'
  | 'CANCELLED'
  | 'EXPIRED';

export type PredictionVisibility = 'PUBLIC' | 'SUBSCRIBERS_ONLY' | 'EXCLUSIVE';

export interface PredictionOutcome {
  status: 'TARGET_HIT' | 'STOP_HIT' | 'CLOSED_MANUALLY' | 'EXPIRED';
  exitPrice: number;
  closedAt: string;
  returnPercentage: number;
  pnlMultiplier?: number;
  summaryNotes?: string;
}

export interface Prediction {
  id: string;
  traderId: string;
  trader: {
    id: string;
    displayName: string;
    handle: string;
    avatar: string;
    verifiedBadge: boolean;
    winRate: number;
  };
  title: string;
  instrument: string; // e.g. 'BTC/USDT', 'ETH/USDT', 'GOLD'
  category: 'CRYPTO' | 'FOREX' | 'STOCKS' | 'INDICES' | 'COMMODITIES';
  direction: PredictionDirection;
  entryPrice: number;
  buyingZone?: number;
  sellingZone?: number;
  stopLoss?: number;
  takeProfit?: number;   // TP1 (primary)
  takeProfit2?: number;  // TP2 (optional)
  takeProfit3?: number;  // TP3 (optional)
  riskRewardRatio?: number; // Calculated (e.g., 3.2)
  timeframe: string; // e.g. '15m', '1h', '4h', '1d'
  strategy: string; // e.g. 'Breakout & Retest', 'Smart Money Concepts'
  analysis: string; // Markdown detailed reasoning
  tags: string[];
  status: PredictionStatus;
  visibility: PredictionVisibility;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  outcome?: PredictionOutcome;
  chartSnapshotUrl?: string;
  likesCount: number;
  viewsCount: number;
  isSaved?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  billingInterval: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING';
  startedAt: string;
  currentPeriodEnd: string;
  subscribedTraderIds: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PREDICTION_PUBLISHED' | 'PREDICTION_STATUS_CHANGE' | 'NEW_FOLLOWER' | 'SUBSCRIPTION_UPDATE' | 'SYSTEM';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface TraderJournalEntry {
  id: string;
  traderId: string;
  date: string;
  title: string;
  content: string;
  linkedPredictionIds: string[];
  tags: string[];
  mindsetRating: number; // 1-5
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'USER' | 'TRADER' | 'PREDICTION' | 'SETTING' | 'SUBSCRIPTION';
  targetId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  category: 'CRYPTO' | 'FOREX' | 'STOCKS' | 'COMMODITIES';
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// ─── Chart Drawing Types ───────────────────────────────────────────────────────

export type DrawingTool =
  | 'pointer'
  | 'horizontal'
  | 'trendline'
  | 'long'
  | 'short'
  | 'rectangle'
  | 'brush'
  | 'text';

interface BaseDrawing {
  id: string;
  color: string;
  opacity: number;
}

export interface HorizontalLineDrawing extends BaseDrawing {
  type: 'horizontal';
  price: number; // price-space anchor
}

export interface TrendLineDrawing extends BaseDrawing {
  type: 'trendline';
  price1: number;
  price2: number;
  barIndex1: number; // lightweight-charts logical bar index
  barIndex2: number;
}

export interface LongPositionDrawing extends BaseDrawing {
  type: 'long';
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
  barIndex1: number;
  barIndex2: number;
}

export interface ShortPositionDrawing extends BaseDrawing {
  type: 'short';
  entryPrice: number;
  stopPrice: number;
  targetPrice: number;
  barIndex1: number;
  barIndex2: number;
}

export interface RectangleDrawing extends BaseDrawing {
  type: 'rectangle';
  price1: number;
  price2: number;
  barIndex1: number;
  barIndex2: number;
}

export interface BrushDrawing extends BaseDrawing {
  type: 'brush';
  /** Array of {price, barIndex} points */
  points: Array<{ price: number; barIndex: number }>;
}

export interface TextDrawing extends BaseDrawing {
  type: 'text';
  price: number;
  barIndex: number;
  text: string;
  fontSize: number;
}

export type ChartDrawing =
  | HorizontalLineDrawing
  | TrendLineDrawing
  | LongPositionDrawing
  | ShortPositionDrawing
  | RectangleDrawing
  | BrushDrawing
  | TextDrawing;
