import "server-only";
import { demoPerformance } from "@/data/performance";
import type { PerformanceSummary } from "@/lib/types";

/**
 * Performance service. Only return `source: "live"` for independently
 * verified figures — the UI labels anything else as demo data.
 */
export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  return demoPerformance;
}
