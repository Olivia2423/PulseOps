import { db } from "../domain/db";
import { id, nowIso } from "../domain/utils";
import type { Metrics, Order, OrderState } from "../domain/types";

const ORDER_RATE_PER_MIN = 20; // tweak
const TICK_MS = 1000;

function addTransition(order: Order, to: OrderState, reason?: string) {
  const from = order.state;
  order.state = to;
  order.updatedAt = nowIso();
  order.transitions.push({ from, to, at: order.updatedAt, reason });
}

function createOrder(): Order {
  const createdAt = nowIso();
  return {
    id: id("ord"),
    state: "CREATED",
    priority: "NORMAL",
    createdAt,
    updatedAt: createdAt,
    transitions: [{ from: "CREATED", to: "CREATED", at: createdAt }],
    retryCount: 0,
  };
}

function nextState(order: Order): { to: OrderState; reason?: string } | null {
  switch (order.state) {
    case "CREATED":
      return { to: "PAYMENT_PROCESSING" };

    case "PAYMENT_PROCESSING": {
      // 20% payment failure
      const fail = Math.random() < 0.2;
      return fail
        ? { to: "PAYMENT_FAILED", reason: "Payment gateway timeout" }
        : { to: "INVENTORY_RESERVED" };
    }

    case "PAYMENT_FAILED":
      // stays failed until manual retry
      return null;

    case "INVENTORY_RESERVED":
      return { to: "SHIPMENT_CREATED" };

    case "SHIPMENT_CREATED":
      return { to: "OUT_FOR_DELIVERY" };

    case "OUT_FOR_DELIVERY":
      return { to: "DELIVERED" };

    case "DELIVERED":
      return null;

    default:
      return null;
  }
}

function computeHealth(m: Metrics): Metrics["health"] {
  // simple rule set
  if (m.failureRatePct > 15 || m.backlogCount > 50) return "RED";
  if (m.failureRatePct > 8 || m.backlogCount > 25) return "YELLOW";
  return "GREEN";
}

export function computeMetrics(): Metrics {
  const now = Date.now();
  const orders = Array.from(db.orders.values());

  const backlogCount = orders.filter((o) => o.state !== "DELIVERED").length;

  // "processing time" = created → delivered time, for delivered orders
  const delivered = orders.filter((o) => o.state === "DELIVERED");
  const avgProcessingTimeSec =
    delivered.length === 0
      ? 0
      : Math.round(
          delivered.reduce((sum, o) => {
            const start = new Date(o.createdAt).getTime();
            const end = new Date(o.updatedAt).getTime();
            return sum + (end - start) / 1000;
          }, 0) / delivered.length
        );

  // last 60s orders created
  const createdLastMin = orders.filter(
    (o) => new Date(o.createdAt).getTime() >= now - 60_000
  ).length;

  const failedLastMin = orders.filter(
    (o) =>
      o.state === "PAYMENT_FAILED" &&
      new Date(o.updatedAt).getTime() >= now - 60_000
  ).length;

  const failureRatePct =
    createdLastMin === 0 ? 0 : Math.round((failedLastMin / createdLastMin) * 100);

  const metrics: Metrics = {
    ordersPerMinute: createdLastMin,
    failureRatePct,
    avgProcessingTimeSec,
    backlogCount,
    health: "GREEN",
    updatedAt: nowIso(),
  };

  metrics.health = computeHealth(metrics);
  return metrics;
}

export function startSimulation(onOrderUpdated: (o: Order) => void, onOrderCreated: (o: Order) => void, onMetrics: (m: Metrics) => void) {
  // order creation cadence
  const createEveryMs = Math.max(1000, Math.floor((60_000 / ORDER_RATE_PER_MIN)));

  setInterval(() => {
    const o = createOrder();
    db.orders.set(o.id, o);
    onOrderCreated(o);
  }, createEveryMs);

  // state transitions tick
  setInterval(() => {
    for (const o of db.orders.values()) {
      // random delay chance to simulate async
      if (Math.random() < 0.4) continue;

      const ns = nextState(o);
      if (!ns) continue;

      addTransition(o, ns.to, ns.reason);
      onOrderUpdated(o);
    }

    const m = computeMetrics();
    db.metrics = m;
    onMetrics(m);
  }, TICK_MS);
}