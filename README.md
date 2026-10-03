# The Neo Syndicate

**Capital. Strategy. Execution.** — website for The Neo Syndicate, a private trading and investment community
focused on XAUUSD, BTCUSD, market intelligence and investment pools.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — fill in social links, site URL, data provider
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/syndicate` | Brand story & philosophy |
| `/markets` | Market intelligence dashboard (XAUUSD, BTCUSD, DXY) |
| `/trades` | Elite trades dashboard with filters |
| `/invest` | Investment pools + application form |
| `/community` | Community landing page |
| `/contact` | Contact form |
| `/risk-disclosure`, `/terms`, `/privacy` | Legal (placeholder copy — requires legal review) |
| `/api/applications`, `/api/contact`, `/api/markets` | API routes |

## Demo data

All market prices, trades, performance figures and pool terms are **demo/placeholder data** and are labelled as
such in the UI. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how to connect real data sources and
the planned admin dashboard.

## Configuration

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap, Open Graph |
| `NEXT_PUBLIC_TELEGRAM_URL` / `_TIKTOK_URL` / `_INSTAGRAM_URL` | Social links (placeholders until set) |
| `MARKET_DATA_API_URL` / `MARKET_DATA_API_KEY` | Market data provider |
| `APPLICATIONS_WEBHOOK_URL` | Receives application + contact submissions as JSON |

## Before launch

- Replace social placeholders and confirm the domain in `.env`.
- Have the legal pages reviewed by a qualified professional; confirm regulatory position for investment pools
  in each target jurisdiction.
- Replace demo data with verified sources (never label demo data as live).
