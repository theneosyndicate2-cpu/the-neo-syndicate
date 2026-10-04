import { cn } from "@/lib/utils";

const STEPS = [
  { id: "received", label: "Received" },
  { id: "under-review", label: "Under review" },
  { id: "decision", label: "Decision" },
];

/** Status pipeline for an application: received → under review → approved/declined. */
export function ApplicationStatus({ status }: { status: string }) {
  const index = status === "received" ? 0 : status === "under-review" ? 1 : 2;
  const declined = status === "declined";
  const finalLabel = status === "approved" ? "Approved" : declined ? "Declined" : "Decision";

  return (
    <ol className="grid grid-cols-3 gap-2" aria-label={`Application status: ${status.replace("-", " ")}`}>
      {STEPS.map((s, i) => {
        const reached = i <= index;
        const current = i === index;
        const label = i === 2 ? finalLabel : s.label;
        return (
          <li key={s.id} className="flex flex-col gap-2" aria-current={current ? "step" : undefined}>
            <span
              className={cn(
                "h-1 rounded-full",
                !reached ? "bg-steel" : i === 2 ? (declined ? "bg-down" : "bg-up") : current ? "bg-cyan shadow-[0_0_8px_rgba(56,225,255,0.8)]" : "bg-gold",
              )}
            />
            <span
              className={cn(
                "font-mono text-[0.5625rem] tracking-[0.14em] uppercase",
                !reached ? "text-faint" : i === 2 ? (declined ? "text-down" : "text-up") : current ? "text-cyan-light" : "text-gold",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
