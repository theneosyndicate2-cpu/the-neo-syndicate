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

### Market data
Set `MARKET_DATA_API_URL` (and optionally `MARKET_DATA_API_KEY`). The endpoint should return
`{ quotes: MarketQuote[], delayed?: boolean }`. To use a vendor directly (Twelve Data, Polygon, OANDA, etc.),
write an adapter in `src/services/marketData.ts` that maps the vendor's response to `MarketQuote`.
Responses are cached for 60s (`revalidate`) and tagged `markets` so they can be revalidated on demand.

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
