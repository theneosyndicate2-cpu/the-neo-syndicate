import "server-only";
import { investmentPools } from "@/data/investmentPools";
import type { InvestmentPool } from "@/lib/types";

/** Investment pools service — replace with a database/admin-backed source later. */
export async function getInvestmentPools(): Promise<{ placeholder: boolean; pools: InvestmentPool[] }> {
  return { placeholder: true, pools: investmentPools };
}
