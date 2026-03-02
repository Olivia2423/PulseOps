export type OrderState =
  | "CREATED"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_FAILED"
  | "INVENTORY_RESERVED"
  | "SHIPMENT_CREATED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";


export type OrderTransition = {
  from: OrderState;
  to: OrderState;
  at: string; // ISO
  reason?: string;
};

export type Order = {
  id: string;
  state: OrderState;
  priority: "LOW" | "NORMAL" | "HIGH";
  createdAt: string;
  updatedAt: string;
  transitions: OrderTransition[];
  retryCount: number;
};

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH";
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

export type Alert = {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
};

// Metrics pushed from backend
export type Health = "GREEN" | "YELLOW" | "RED";

export type Metrics = {
  ordersPerMinute: number;
  failureRatePct: number;
  avgProcessingTimeSec: number;
  backlogCount: number;
  health: Health;
  updatedAt: string;
};

// Audit 
export type AuditAction =
  | "ALERT_ACKNOWLEDGED"
  | "ALERT_RESOLVED"
  | "ORDER_RETRIED"
  | "ORDER_PRIORITY_CHANGED"
  | "ORDER_FLAGGED";

export type AuditLog = {
  id: string;
  at: string;
  actor: string;
  action: AuditAction;
  targetId: string;
  message?: string;
};

export type SocketEventType =
  | "ORDER_CREATED"
  | "ORDER_UPDATED"
  | "ALERT_TRIGGERED"
  | "ALERT_UPDATED"
  | "METRICS_UPDATED"
  | "AUDIT_LOGGED";

export type SocketPayloadMap = {
  ORDER_CREATED: Order;
  ORDER_UPDATED: Order;
  ALERT_TRIGGERED: Alert;
  ALERT_UPDATED: Alert;
  METRICS_UPDATED: Metrics;
  AUDIT_LOGGED: AuditLog;
};

export type SocketEvent =
  | { type: "ORDER_CREATED"; payload: Order; timestamp: string }
  | { type: "ORDER_UPDATED"; payload: Order; timestamp: string }
  | { type: "ALERT_TRIGGERED"; payload: Alert; timestamp: string }
  | { type: "ALERT_UPDATED"; payload: Alert; timestamp: string }
  | { type: "METRICS_UPDATED"; payload: Metrics; timestamp: string }
  | { type: "AUDIT_LOGGED"; payload: AuditLog; timestamp: string };