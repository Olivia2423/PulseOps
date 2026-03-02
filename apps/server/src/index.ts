import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { db } from "./domain/db";
import { id, nowIso } from "./domain/utils";
import type { Alert, Metrics, Order, SocketEvent } from "./domain/types";
import { startSimulation } from "./sim/engine";

const PORT = 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "pulseops-server", timestamp: nowIso() });
});

// -------- REST APIs (minimum) --------
app.get("/api/metrics", (_req, res) => {
  res.json(db.metrics ?? null);
});

app.get("/api/orders", (_req, res) => {
  res.json(Array.from(db.orders.values()));
});

app.get("/api/orders/:id", (req, res) => {
  const order = db.orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.post("/api/orders/:id/retry", (req, res) => {
  const order = db.orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Only meaningful if failed, but allow retry anytime for demo
  order.retryCount += 1;

  // If it was payment failed, move back into processing
  if (order.state === "PAYMENT_FAILED") {
    order.transitions.push({
      from: order.state,
      to: "PAYMENT_PROCESSING",
      at: nowIso(),
      reason: "Manual retry triggered by operator",
    });
    order.state = "PAYMENT_PROCESSING";
    order.updatedAt = nowIso();
  } else {
    order.updatedAt = nowIso();
  }

  // emit update + audit
  emit({ type: "ORDER_UPDATED", payload: order, timestamp: order.updatedAt });
  logAudit("operator", "ORDER_RETRIED", order.id, "Retry processing");

  res.json(order);
});

app.get("/api/alerts", (_req, res) => {
  res.json(Array.from(db.alerts.values()));
});

app.get("/api/audit", (_req, res) => {
  res.json(db.audit.slice(-200).reverse());
});

// -------- Socket.io --------
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

function emit(evt: SocketEvent) {
  io.emit("event", evt);
}

function logAudit(actor: string, action: string, targetId: string, message?: string) {
  const entry = {
    id: id("audit"),
    at: nowIso(),
    actor,
    action: action as any,
    targetId,
    message,
  };
  db.audit.push(entry);
  emit({ type: "AUDIT_LOGGED", payload: entry, timestamp: entry.at });
}

function maybeTriggerAlerts(metrics: Metrics) {
  // Payment failure rate alert
  if (metrics.failureRatePct > 15) {
    const existing = Array.from(db.alerts.values()).find(
      (a) => a.type === "PAYMENT_FAILURE_RATE" && a.status !== "RESOLVED"
    );
    if (!existing) {
      const alert: Alert = {
        id: id("alrt"),
        type: "PAYMENT_FAILURE_RATE",
        title: `Payment failure rate high (${metrics.failureRatePct}%)`,
        severity: "HIGH",
        status: "OPEN",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        notes: [],
      };
      db.alerts.set(alert.id, alert);
      emit({ type: "ALERT_TRIGGERED", payload: alert, timestamp: alert.createdAt });
    }
  }

  // Backlog high alert
  if (metrics.backlogCount > 50) {
    const existing = Array.from(db.alerts.values()).find(
      (a) => a.type === "BACKLOG_HIGH" && a.status !== "RESOLVED"
    );
    if (!existing) {
      const alert: Alert = {
        id: id("alrt"),
        type: "BACKLOG_HIGH",
        title: `Backlog high (${metrics.backlogCount})`,
        severity: "MEDIUM",
        status: "OPEN",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        notes: [],
      };
      db.alerts.set(alert.id, alert);
      emit({ type: "ALERT_TRIGGERED", payload: alert, timestamp: alert.createdAt });
    }
  }
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", (reason) => console.log("Client disconnected:", socket.id, reason));
});

// Start simulation and emit events
startSimulation(
  (order: Order) => emit({ type: "ORDER_UPDATED", payload: order, timestamp: order.updatedAt }),
  (order: Order) => emit({ type: "ORDER_CREATED", payload: order, timestamp: order.createdAt }),
  (metrics: Metrics) => {
    emit({ type: "METRICS_UPDATED", payload: metrics, timestamp: metrics.updatedAt });
    maybeTriggerAlerts(metrics);
  }
);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`PulseOps server running at http://localhost:${PORT}`);
});