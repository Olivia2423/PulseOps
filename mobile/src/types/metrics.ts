export type Health = "GREEN" | "YELLOW" | "RED";

export type Metrics = {
  ordersPerMinute: number;
  failureRatePct: number;
  avgProcessingTimeSec: number;
  backlogCount: number;
  health: Health;
  updatedAt: string; // ISO
};