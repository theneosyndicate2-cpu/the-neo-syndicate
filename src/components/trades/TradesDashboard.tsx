"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, SlidersHorizontal } from "lucide-react";
import type { DataSource, Trade } from "@/lib/types";
import { cn, formatDate, formatNumber, formatSigned, priceDecimals } from "@/lib/utils";
import { DirectionPill, ResultPill, TradeCard } from "@/components/cards/TradeCard";
import { DataSourceBadge } from "@/components/ui/Badge";

type FilterGroup = "asset" | "direction" | "result" | "status";
type Filters = Record<FilterGroup, string | null>;

const groups: { key: FilterGroup; label: string; options: string[] }[] = [
  { key: "asset", label: "Asset", options: ["XAUUSD", "BTCUSD"] },
  { key: "direction", label: "Direction", options: ["BUY", "SELL"] },
  { key: "result", label: "Result", options: ["WIN", "LOSS"] },
  { key: "status", label: "Status", options: ["OPEN", "CLOSED"] },
];

const initial: Filters = { asset: null, direction: null, result: null, status: null };

export function TradesDashboard({ trades, source }: { trades: Trade[]; source: DataSource }) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [view, setView] = useState<"table" | "cards">("table");

  const filtered = useMemo(
    () =>
      trades.filter(
        (t) =>
          (!filters.asset || t.asset === filters.asset) &&
          (!filters.direction || t.direction === filters.direction) &&
          (!filters.result || t.result === filters.result) &&
          (!filters.status || t.status === filters.status),
      ),
    [trades, filters],
  );

  const stats = useMemo(() => {
    const closed = filtered.filter((t) => t.status === "CLOSED");
    const decisive = closed.filter((t) => t.result === "WIN" || t.result === "LOSS");
    const wins = decisive.filter((t) => t.result === "WIN").length;
    const totalR = closed.reduce((sum, t) => sum + (t.rMultiple ?? 0), 0);
    return {
      total: filtered.length,
      open: filtered.length - closed.length,
      winRate: decisive.length ? (wins / decisive.length) * 100 : 0,
      totalR,
    };
  }, [filtered]);

  const toggle = (group: FilterGroup, value: string) =>
    setFilters((f) => ({ ...f, [group]: f[group] === value ? null : value }));

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4">
        {[
          { label: "Trades shown", value: String(stats.total) },
          { label: "Open positions", value: String(stats.open) },
          { label: "Win rate (closed)", value: `${formatNumber(stats.winRate, 0)}%` },
          { label: "Net result", value: formatSigned(stats.totalR, 1, "R") },
        ].map((s) => (
          <div key={s.label} className="bg-charcoal p-5 sm:p-7">
            <p className="label-mono">{s.label}</p>
            <p className="tabular mt-3 font-display text-2xl font-light text-bone sm:text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-line bg-night p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
          <p className="flex items-center gap-2 label-mono">
            <SlidersHorizontal className="size-3.5 text-cyan" aria-hidden />
            Filters {activeCount > 0 && <span className="text-gold-light">({activeCount})</span>}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {groups.map((g) => (
              <div key={g.key} role="group" aria-label={g.label} className="flex gap-1.5">
                {g.options.map((opt) => {
                  const active = filters[g.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(g.key, opt)}
                      className={cn(
                        "h-9 rounded-sm font-mono border px-3.5 text-[0.625rem] font-medium tracking-[0.16em] transition-all duration-300",
                        active
                          ? "border-cyan/70 bg-cyan/15 text-cyan-light shadow-[0_0_16px_-4px_rgba(56,225,255,0.7)]"
                          : "border-line-strong text-mist hover:border-cyan/40 hover:text-bone",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <button
            type="button"
            onClick={() => setFilters(initial)}
            disabled={!activeCount}
            className="label-mono transition-colors hover:text-gold-light disabled:opacity-40"
          >
            Reset
          </button>
          <div className="hidden rounded-full border border-line p-1 md:flex" role="group" aria-label="View">
            {(
              [
                ["table", Rows3],
                ["cards", LayoutGrid],
              ] as const
            ).map(([v, Icon]) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                aria-label={`${v} view`}
                onClick={() => setView(v)}
                className={cn("grid size-8 place-items-center rounded-full transition-colors", view === v ? "bg-white/10 text-bone" : "text-faint hover:text-bone")}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <DataSourceBadge source={source} label={source === "demo" ? "Sample trades · demo data" : undefined} />
        <p className="text-xs text-faint" aria-live="polite">
          {filtered.length} of {trades.length} trades
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-line-strong px-6 py-20 text-center">
          <p className="font-display text-xl text-bone">No trades match these filters.</p>
          <button type="button" onClick={() => setFilters(initial)} className="mt-4 text-xs tracking-[0.2em] text-gold uppercase hover:text-gold-light">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Table — desktop */}
          <div className={cn("mt-6 overflow-hidden rounded-3xl border border-line", view === "table" ? "hidden md:block" : "hidden")}>
            <table className="tabular w-full text-left text-sm">
              <caption className="sr-only">Trade log{source === "demo" ? " (demo data)" : ""}</caption>
              <thead className="bg-night label-mono">
                <tr>
                  {["Asset", "Direction", "Entry", "Stop loss", "Take profit", "Result", "Date", "Status"].map((h) => (
                    <th key={h} scope="col" className="px-5 py-4 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-charcoal">
                <AnimatePresence initial={false}>
                  {filtered.map((t) => {
                    const d = priceDecimals(t.asset);
                    return (
                      <motion.tr
                        key={t.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="transition-colors hover:bg-graphite"
                      >
                        <th scope="row" className="px-5 py-4 font-display font-normal tracking-[0.1em] text-bone">
                          {t.asset}
                          <span className="block text-[0.625rem] tracking-[0.14em] text-faint">{t.id}</span>
                        </th>
                        <td className="px-5 py-4">
                          <DirectionPill direction={t.direction} />
                        </td>
                        <td className="px-5 py-4 text-bone">{formatNumber(t.entry, d)}</td>
                        <td className="px-5 py-4 text-down/90">{formatNumber(t.stopLoss, d)}</td>
                        <td className="px-5 py-4 text-xs leading-relaxed text-up/90">
                          {t.takeProfits.map((tp, i) => (
                            <span key={i} className="block">
                              <span className="text-faint">TP{i + 1}</span> {formatNumber(tp, d)}
                            </span>
                          ))}
                        </td>
                        <td className="px-5 py-4">
                          <ResultPill trade={t} />
                        </td>
                        <td className="px-5 py-4 text-xs text-mist">
                          <time dateTime={t.date}>{formatDate(t.date)}</time>
                        </td>
                        <td className="px-5 py-4 label-mono">{t.status}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Cards — mobile always, desktop when selected */}
          <motion.div layout className={cn("mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", view === "table" && "md:hidden")}>
            <AnimatePresence initial={false}>
              {filtered.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                >
                  <TradeCard trade={t} className="h-full" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}
