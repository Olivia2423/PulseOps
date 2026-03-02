import { api } from "@/lib/api";
import type { Metrics } from "@/types/metrics";

export async function fetchMetrics(): Promise<Metrics | null> {
  const res = await api.get<Metrics | null>("/api/metrics");
  return res.data;
}