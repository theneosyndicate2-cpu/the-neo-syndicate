import { Panel } from "@/components/admin/ui";
import { TradeForm } from "@/components/admin/AdminForms";

export function AdminTradeFormPanel() {
  return (
    <Panel>
      <h2 className="font-display text-xl text-bone">Post a new trade</h2>
      <p className="mt-1.5 text-sm text-muted">Appears instantly in the members&apos; elite trade log and dashboards.</p>
      <div className="mt-6">
        <TradeForm />
      </div>
    </Panel>
  );
}
