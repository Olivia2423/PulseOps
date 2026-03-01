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

export type AlertType =
  | "PAYMENT_FAILURE_RATE"
  | "STUCK_PROCESSING"
  | "BACKLOG_HIGH";

export type Alert = {
  id: string;
  type: AlertType;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
  notes: string[];
  acknowledgedBy?: string;
  resolvedBy?: string;
};

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
  targetId: string; // alertId or orderId
  message?: string;
};

export type SocketEventType =
  | "ORDER_CREATED"
  | "ORDER_UPDATED"
  | "ALERT_TRIGGERED"
  | "ALERT_UPDATED"
  | "AUDIT_LOGGED"
  | "METRICS_UPDATED";

export type Metrics = {
  ordersPerMinute: number;
  failureRatePct: number;
  avgProcessingTimeSec: number;
  backlogCount: number;
  health: "GREEN" | "YELLOW" | "RED";
  updatedAt: string;
};

export type SocketEvent = {
  type: SocketEventType;
  payload: any;
  timestamp: string;
};