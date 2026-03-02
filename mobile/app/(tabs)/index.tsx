import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchMetrics } from "@/services/metricsService";
import { useMetricsStore } from "@/store/useMetricsStore";

function HealthBadge({ health }: { health: "GREEN" | "YELLOW" | "RED" }) {
  const label =
    health === "GREEN" ? "Healthy" : health === "YELLOW" ? "Degraded" : "Critical";

  return (
    <View
      style={[
        styles.badge,
        health === "GREEN"
          ? styles.badgeGreen
          : health === "YELLOW"
          ? styles.badgeYellow
          : styles.badgeRed,
      ]}
    >
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const metrics = useMetricsStore((s) => s.metrics);
  const setMetrics = useMetricsStore((s) => s.setMetrics);

  useEffect(() => {
    // initial REST fetch so dashboard isn't empty before socket emits
    fetchMetrics()
      .then((m) => {
        if (m) setMetrics(m);
      })
      .catch((err) => console.log("fetchMetrics error", err));
  }, [setMetrics]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PulseOps</Text>
        {metrics ? <HealthBadge health={metrics.health} /> : null}
      </View>

      <Text style={styles.sub}>
        {metrics
          ? `Updated ${new Date(metrics.updatedAt).toLocaleTimeString()}`
          : "Waiting for metrics…"}
      </Text>

      <View style={styles.grid}>
        <StatCard
          label="Orders / min"
          value={metrics ? String(metrics.ordersPerMinute) : "—"}
        />
        <StatCard
          label="Failure rate"
          value={metrics ? `${metrics.failureRatePct}%` : "—"}
        />
        <StatCard
          label="Avg processing"
          value={metrics ? `${metrics.avgProcessingTimeSec}s` : "—"}
        />
        <StatCard
          label="Backlog"
          value={metrics ? String(metrics.backlogCount) : "—"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "800" },
  sub: { marginTop: 6, opacity: 0.7 },

  grid: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  cardLabel: { opacity: 0.7 },
  cardValue: { marginTop: 8, fontSize: 22, fontWeight: "700" },

  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeText: { fontWeight: "700" },
  badgeGreen: { backgroundColor: "rgba(0, 200, 0, 0.15)" },
  badgeYellow: { backgroundColor: "rgba(255, 170, 0, 0.18)" },
  badgeRed: { backgroundColor: "rgba(255, 0, 0, 0.15)" },
});