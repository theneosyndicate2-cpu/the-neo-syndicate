# Architecture

The frontend is built so real data and an admin backend can be added **without rebuilding the UI**.
Components never import mock data directly for dynamic content — they receive typed props from
server components, which get data from the **service layer**.

```
UI components  ←  page (server component)  ←  src/services/*  ←  src/data/* (demo)  →  later: DB / API
```

## Layers

| Layer | Path | Responsibility |
|---|---|---|
| Types | `src/lib/types.ts` | Domain models: `MarketQuote`, `Trade`, `InvestmentPool`, `PerformanceSummary`, `Member`, `Announcement`, `Application`, `MembershipTier`… |
| Demo data | `src/data/*` | Clearly-labelled placeholder data. Delete once real sources exist. |
| Services | `src/services/*` | The only place that knows where data comes from. Server-only. |
| API routes | `src/app/api/*` | `POST /api/applications`, `POST /api/contact`, `GET /api/markets` |
| Validation | `src/lib/validation.ts` | Shared by client forms and API routes. |
| UI | `src/components/*` | Presentational; receives typed props. |

## Data honesty rules (enforced in the UI)

- Every dataset carries a `source: "live" | "delayed" | "demo"`. Anything not `live` renders a visible badge
  (`DataSourceBadge`) and "not live" copy. **Never return `live` from a service unless the data really is.**
- Performance must only be `live` when independently verified.
- Investment pool terms are flagged `placeholder: true` until confirmed.

## Connecting real data

### Market data (live)
Live by default, no API keys:

| Asset | Price | Daily change / range / chart |
|---|---|---|
| XAUUSD | Swissquote public spot quote (bid/ask mid) | COMEX gold futures session (Yahoo chart API), scaled to spot |
| DXY | Computed from 6 Swissquote FX pairs with the ICE formula | ICE DXY session (Yahoo chart API), scaled to the computed value |
| BTCUSD | Coinbase Exchange (REST + browser WebSocket ticks) | Coinbase 24h open/high/low, 15-min candles |

Flow: pages render an ISR snapshot (`revalidate` 15s) → `MarketProvider` (client) polls `/api/markets`
every 5s while FX/metals are open (60s when closed) and streams BTC ticks from `wss://ws-feed.exchange.coinbase.com`.
A quote whose last update is >10 min old is shown as **CLOSED** (weekends/holidays). Any asset whose feed fails
falls back to labelled demo data. Trend, bias, sentiment, pivot levels and the market note are computed from price
action in `src/lib/marketAnalytics.ts` (shared by server and browser).

Overrides: `MARKET_DATA_PROVIDER=demo` forces demo data; `MARKET_DATA_API_URL` (+ `MARKET_DATA_API_KEY`) uses your
own endpoint returning `{ quotes: RawQuote[] }`.

**Licensing:** the free public feeds are suitable for an informational site. For a commercial product, license
data (e.g. Twelve Data, Polygon, OANDA, ICE) and connect it via `MARKET_DATA_API_URL` or a new adapter.

### Application email verification
`/invest` applications require the applicant to confirm their email with a 6-digit code:

1. `POST /api/verification/send { email }` → emails a code (`src/emails/verificationEmail.ts`) and returns a signed
   **challenge** token containing only an HMAC of the code (never the code itself). 10-min expiry; 60s resend
   cooldown; max 5 sends/hour per email and per IP.
2. `POST /api/verification/verify { token, code }` → max 5 attempts, single use; returns a signed **proof** (30 min).
3. `POST /api/applications { ...fields, emailProof }` → rejected with `403 EMAIL_NOT_VERIFIED` unless the proof is
   valid and matches the submitted email.

Config: `VERIFICATION_SECRET` (required in production), `RESEND_API_KEY` + `EMAIL_FROM` to send real email.
Without a provider the flow runs in **test mode** (`EMAIL_DELIVERY=console`, or any non-production run): the code
is logged and shown on screen with a "Test mode" label — never enable that on the live site. Attempt/throttle
counters are in-memory per instance; move them to Redis/the database when running multiple instances.

### Trades / pools / performance
Replace the body of `getTrades`, `getInvestmentPools` and `getPerformanceSummary` with database queries
(Prisma, Drizzle, Supabase…) — keep the return shapes.

### Applications & contact
`src/services/submissions.ts` validates, generates a reference, then forwards JSON to
`APPLICATIONS_WEBHOOK_URL` (CRM / Zapier / Make / n8n / Slack). Swap `persist()` for a DB insert later.
**No payments are processed.** A payment provider (e.g. Stripe) would be introduced *after* approval, from
the admin side, never from the public application form.

## Admin dashboard (future)

Recommended shape — add under `src/app/admin/` (already disallowed in `robots.ts`):

| Module | Model | Notes |
|---|---|---|
| Investment pools | `InvestmentPool` | CRUD, status (`OPEN`, `FILLING`, `CLOSED`, `BY APPLICATION`) |
| Trades | `Trade` | Create setup → update TP hits → close with `rMultiple` |
| Market information | `MarketQuote.commentary/keyLevels/trend/bias` | Analyst overrides on top of the price feed |
| Announcements | `Announcement` | Targeted by `MembershipTier` |
| Applications | `Application` | Status pipeline: `received → under-review → approved/declined` |
| Users & membership | `Member`, `MembershipTier`, `UserRole` | Roles: `member`, `analyst`, `admin` |

Suggested stack: Auth.js or Clerk for auth, Postgres (Supabase/Neon) with Prisma/Drizzle, route protection via
Next.js `proxy.ts`, and Server Actions for admin mutations calling `revalidateTag("markets")` /
`revalidatePath("/trades")` so public pages update immediately.
