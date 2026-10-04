/**
 * Domain types shared by the UI, the service layer and (later) the backend.
 * Keep these framework-agnostic so they can be reused by an API or admin app.
 */

/** Where a piece of data came from. Anything other than "live" must be labelled in the UI. */
export type DataSource = "live" | "delayed" | "demo";

export type AssetSymbol = "XAUUSD" | "BTCUSD" | "DXY";

export type Trend = "bullish" | "bearish" | "neutral";
export type Sentiment = "risk-on" | "risk-off" | "mixed";
export type Bias = "long" | "short" | "neutral";

export type MarketStatus = "open" | "closed";

/** Raw market values as delivered by a provider, before analytics are derived. */
export interface RawQuote {
  symbol: AssetSymbol;
  name: string;
  description: string;
  price: number;
  /** Reference price the daily change is measured against (prior close / 24h open). */
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  decimals: number;
  /** Intraday price series used for sparklines. */
  history: number[];
  /** Time of the last price update (ISO). */
  updatedAt: string;
  marketStatus: MarketStatus;
  source: DataSource;
  /** Human-readable data attribution, e.g. "Coinbase". */
  sourceName: string;
}

export interface MarketQuote extends RawQuote {
  change: number;
  changePercent: number;
  trend: Trend;
  sentiment: Sentiment;
  technicalBias: Bias;
  /** Short market note (auto-generated from price action for live data). */
  commentary: string;
  keyLevels: { label: string; value: number }[];
}

export interface MarketSnapshot {
  /** "live" only when every quote comes from a live provider. */
  source: DataSource;
  quotes: MarketQuote[];
  fetchedAt: string;
}

export type TradeDirection = "BUY" | "SELL";
export type TradeStatus = "OPEN" | "CLOSED";
export type TradeResult = "WIN" | "LOSS" | "BREAKEVEN" | "PENDING";

export interface Trade {
  id: string;
  asset: Exclude<AssetSymbol, "DXY">;
  direction: TradeDirection;
  entry: number;
  stopLoss: number;
  takeProfits: number[];
  result: TradeResult;
  status: TradeStatus;
  /** Result in R multiples (risk units). Null while open. */
  rMultiple: number | null;
  /** ISO date string. */
  date: string;
  note?: string;
}

export type PoolStatus = "OPEN" | "FILLING" | "CLOSED" | "BY APPLICATION";
export type RiskLevel = "Moderate" | "High" | "Very High";

export interface InvestmentPool {
  id: string;
  name: string;
  tagline: string;
  minimum: number;
  currency: "GBP";
  duration: string;
  status: PoolStatus;
  riskLevel: RiskLevel;
  strategy: string;
  markets: string[];
  highlights: string[];
}

export interface PerformanceStat {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  caption: string;
}

export interface PerformancePeriod {
  label: string;
  /** Cumulative result in R for the period. */
  value: number;
}

export interface PerformanceSummary {
  source: DataSource;
  stats: PerformanceStat[];
  history: PerformancePeriod[];
  asOf: string;
}

export type SocialPlatform = "telegram" | "tiktok" | "instagram";

export interface CommunityLink {
  platform: SocialPlatform;
  label: string;
  handle: string;
  href: string;
  cta: string;
  description: string;
  /** True while the URL is still a placeholder. */
  isPlaceholder: boolean;
}

/* ---------- Forms ---------- */

export interface ApplicationPayload {
  fullName: string;
  email: string;
  telegram: string;
  country: string;
  amount: string;
  pool: string;
  message: string;
  acknowledgeRisk: boolean;
}

export interface ContactPayload {
  name: string;
  email: string;
  telegram: string;
  subject: string;
  message: string;
}

export interface SubmissionResult {
  ok: boolean;
  reference?: string;
  errors?: Record<string, string>;
  message?: string;
  /** Machine-readable failure reason, e.g. "EMAIL_NOT_VERIFIED". */
  code?: string;
}

/* ---------- Email verification ---------- */

export interface VerificationStartResponse {
  ok: boolean;
  token?: string;
  expiresAt?: number;
  resendAfter?: number;
  /** Present only in test mode (no email provider configured). */
  testCode?: string;
  message?: string;
  retryAfter?: number;
}

export interface VerificationConfirmResponse {
  ok: boolean;
  proof?: string;
  email?: string;
  message?: string;
  attemptsLeft?: number;
  expired?: boolean;
}

/* ---------- Admin-ready models (not yet surfaced in the UI) ---------- */

export type MembershipTier = "observer" | "member" | "elite" | "private-capital";
export type UserRole = "member" | "analyst" | "admin";

export interface Member {
  id: string;
  name: string;
  email: string;
  telegram?: string;
  tier: MembershipTier;
  role: UserRole;
  joinedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string;
  audience: MembershipTier[];
}

export type ApplicationStatus = "received" | "under-review" | "approved" | "declined";

export interface Application extends ApplicationPayload {
  id: string;
  reference: string;
  status: ApplicationStatus;
  submittedAt: string;
}
