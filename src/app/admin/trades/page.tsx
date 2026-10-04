import { formatDate, formatNumber, formatSigned, priceDecimals } from "@/lib/utils";
import { adminTrades } from "@/services/admin";
import { closeTrade, deleteTrade } from "../actions";
import { AdminHeader, Panel, StatusPill, selectClass, smallButton } from "@/components/admin/ui";
import { AdminTradeFormPanel } from "./TradeFormPanel";
import { DirectionPill } from "@/components/cards/TradeCard";

export const metadata = { title: "Trades" };

export default async function AdminTradesPage() {
  const trades = await adminTrades();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader eyebrow="Admin desk" title="Elite trades" />

      <AdminTradeFormPanel />

      {trades.length === 0 ? (
        <Panel>
          <p className="text-sm text-mist">
            No desk trades yet — members currently see the <span className="text-gold-light">sample trade log</span>. Post
            your first trade above and it replaces the samples everywhere.
          </p>
        </Panel>
      ) : (
        <ul className="flex flex-col gap-3">
          {trades.map((t) => {
            const d = priceDecimals(t.asset);
            return (
              <li key={t.id}>
                <Panel className="!p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm text-bone">{t.asset}</span>
                      <DirectionPill direction={t.direction as "BUY" | "SELL"} />
                      <StatusPill status={t.status} />
                      {t.status === "CLOSED" && (
                        <span className={`font-mono text-xs ${t.result === "WIN" ? "text-up" : t.result === "LOSS" ? "text-down" : "text-mist"}`}>
                          {t.result} {t.rMultiple !== null && formatSigned(t.rMultiple, 1, "R")}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
                      {t.code} · {formatDate(t.openedAt.toISOString())}
                    </span>
                  </div>
                  <p className="tabular mt-3 font-mono text-xs text-mist">
                    Entry <span className="text-bone">{formatNumber(t.entry, d)}</span> · SL{" "}
                    <span className="text-down">{formatNumber(t.stopLoss, d)}</span> ·{" "}
                    {t.takeProfits.map((tp, i) => (
                      <span key={i}>
                        TP{i + 1} <span className="text-up">{formatNumber(tp, d)}</span>
                        {i < t.takeProfits.length - 1 ? " · " : ""}
                      </span>
                    ))}
                  </p>
                  {t.note && <p className="mt-2 text-sm text-muted">{t.note}</p>}

                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
                    {t.status === "OPEN" ? (
                      <form action={closeTrade} className="flex flex-wrap items-end gap-2">
                        <input type="hidden" name="id" value={t.id} />
                        <label className="flex flex-col gap-1.5">
                          <span className="label-mono">Close as</span>
                          <select name="result" defaultValue="WIN" className={selectClass}>
                            <option value="WIN">Win</option>
                            <option value="LOSS">Loss</option>
                            <option value="BREAKEVEN">Breakeven</option>
                          </select>
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="label-mono">Result (R)</span>
                          <input name="rMultiple" inputMode="decimal" placeholder="e.g. 2.1" className={`${selectClass} w-24`} />
                        </label>
                        <button type="submit" className={smallButton}>
                          Close trade
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-faint">Closed trades stay in the members&apos; log.</span>
                    )}
                    <form action={deleteTrade}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="font-mono text-[0.625rem] tracking-[0.14em] text-muted uppercase transition-colors hover:text-down"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
