import type { Alert, AuditLog, Metrics, Order } from "./types";

export const db = {
  orders: new Map<string, Order>(),
  alerts: new Map<string, Alert>(),
  audit: new Array<AuditLog>(),
  metrics: null as Metrics | null,
};