import { create } from "zustand";
import type { Metrics } from "@/types/metrics";

type MetricsState = {
  metrics: Metrics | null;
  setMetrics: (m: Metrics) => void;
  clear: () => void;
};

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: null,
  setMetrics: (m) => set({ metrics: m }),
  clear: () => set({ metrics: null }),
}));