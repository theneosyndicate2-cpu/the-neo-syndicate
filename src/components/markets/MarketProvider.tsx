"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { enrichAll } from "@/lib/marketAnalytics";
import type { AssetSymbol, MarketQuote, MarketSnapshot, RawQuote } from "@/lib/types";

/**
 * Keeps market data live in the browser:
 *  - polls /api/markets (gold, DXY, BTC) every few seconds while the tab is visible
 *  - streams BTC-USD ticks from Coinbase's public WebSocket for tick-level updates
 * Server-rendered snapshot is used as the initial state, so pages work without JS.
 */

const POLL_OPEN_MS = 5000;
const POLL_CLOSED_MS = 60_000;
const COINBASE_WS = "wss://ws-feed.exchange.coinbase.com";

interface MarketContextValue {
  snapshot: MarketSnapshot;
  /** True once the browser has a working live connection. */
  connected: boolean;
}

const MarketContext = createContext<MarketContextValue | null>(null);

const toRaw = ({ change, changePercent, trend, sentiment, technicalBias, commentary, keyLevels, ...raw }: MarketQuote): RawQuote => raw;

export function MarketProvider({ initial, children }: { initial: MarketSnapshot; children: ReactNode }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [connected, setConnected] = useState(false);
  const latest = useRef(snapshot);
  latest.current = snapshot;

  // Poll the server snapshot.
  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const poll = async () => {
      if (document.visibilityState === "visible") {
        try {
          const res = await fetch("/api/markets", { cache: "no-store" });
          if (res.ok) {
            const next = (await res.json()) as MarketSnapshot;
            if (!cancelled) {
              // Keep the (fresher) streamed BTC price if the WebSocket is ahead of the poll.
              const btcLive = latest.current.quotes.find((q) => q.symbol === "BTCUSD");
              const merged = next.quotes.map((q) =>
                q.symbol === "BTCUSD" && btcLive && btcLive.source === "live" && btcLive.updatedAt > q.updatedAt
                  ? { ...q, price: btcLive.price, updatedAt: btcLive.updatedAt }
                  : q,
              );
              setSnapshot({ ...next, quotes: enrichAll(merged.map(toRaw)) });
              setConnected(true);
            }
          }
        } catch {
          if (!cancelled) setConnected(false);
        }
      }
      const anyOpen = latest.current.quotes.some((q) => q.marketStatus === "open" && q.symbol !== "BTCUSD");
      timer = window.setTimeout(poll, anyOpen ? POLL_OPEN_MS : POLL_CLOSED_MS);
    };

    // Fetch straight away if the page was rendered with fallback data.
    timer = window.setTimeout(poll, latest.current.source === "live" ? 1500 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  // Stream BTC ticks (throttled to ~2 UI updates/sec).
  useEffect(() => {
    if (typeof WebSocket === "undefined") return;
    let ws: WebSocket | null = null;
    let retry: number | undefined;
    let flush: number | undefined;
    let pending: { price: number; open: number; high: number; low: number; time: string } | null = null;
    let closed = false;

    const apply = () => {
      if (!pending) return;
      const tick = pending;
      pending = null;
      setSnapshot((s) => {
        const raws = s.quotes.map((q) =>
          q.symbol === "BTCUSD" && q.source === "live"
            ? {
                ...toRaw(q),
                price: tick.price,
                previousClose: tick.open || q.previousClose,
                dayHigh: tick.high || q.dayHigh,
                dayLow: tick.low || q.dayLow,
                updatedAt: tick.time,
                history: [...q.history.slice(0, -1), tick.price],
              }
            : toRaw(q),
        );
        return { ...s, quotes: enrichAll(raws) };
      });
    };

    const connect = () => {
      ws = new WebSocket(COINBASE_WS);
      ws.onopen = () => {
        ws?.send(JSON.stringify({ type: "subscribe", product_ids: ["BTC-USD"], channels: ["ticker"] }));
        setConnected(true);
      };
      ws.onmessage = (e) => {
        try {
          const m = JSON.parse(e.data as string);
          if (m.type !== "ticker") return;
          pending = {
            price: Number(m.price),
            open: Number(m.open_24h),
            high: Number(m.high_24h),
            low: Number(m.low_24h),
            time: m.time ?? new Date().toISOString(),
          };
        } catch {
          /* ignore malformed frames */
        }
      };
      ws.onclose = () => {
        if (!closed) retry = window.setTimeout(connect, 5000);
      };
      ws.onerror = () => ws?.close();
    };

    connect();
    flush = window.setInterval(apply, 500);
    return () => {
      closed = true;
      window.clearTimeout(retry);
      window.clearInterval(flush);
      ws?.close();
    };
  }, []);

  return <MarketContext.Provider value={{ snapshot, connected }}>{children}</MarketContext.Provider>;
}

/** Live snapshot (falls back to the given server snapshot outside a provider). */
export function useMarketSnapshot(fallback?: MarketSnapshot): MarketSnapshot {
  const ctx = useContext(MarketContext);
  return ctx?.snapshot ?? fallback ?? { source: "demo", quotes: [], fetchedAt: new Date(0).toISOString() };
}

export function useLiveQuote(symbol: AssetSymbol, fallback?: MarketQuote): MarketQuote | undefined {
  const ctx = useContext(MarketContext);
  return ctx?.snapshot.quotes.find((q) => q.symbol === symbol) ?? fallback;
}

export function useMarketConnection() {
  return useContext(MarketContext)?.connected ?? false;
}
