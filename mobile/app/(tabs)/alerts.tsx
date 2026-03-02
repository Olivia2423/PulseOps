import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchAlerts } from "@/services/alertsService";
import { useAlertsStore } from "@/store/useAlertsStore";

function SeverityBadge({ severity }: { severity: string }) {
  const style =
    severity === "HIGH"
      ? styles.high
      : severity === "MEDIUM"
      ? styles.medium
      : styles.low;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{severity}</Text>
    </View>
  );
}

export default function AlertsScreen() {
  const alerts = useAlertsStore((s) => s.alerts);
  const setAlerts = useAlertsStore((s) => s.setAlerts);

  useEffect(() => {
    fetchAlerts()
      .then(setAlerts)
      .catch(console.error);
  }, [setAlerts]);

  return (
    <FlatList
      data={alerts}
      keyExtractor={(a) => a.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.sub}>
            {alerts.length} active alerts
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <SeverityBadge severity={item.severity} />
          </View>

          <Text style={styles.status}>
            Status: {item.status}
          </Text>

          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },

  header: { marginBottom: 12 },

  title: { fontSize: 24, fontWeight: "700" },

  sub: { opacity: 0.7 },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alertTitle: {
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },

  status: {
    marginTop: 6,
    opacity: 0.7,
  },

  time: {
    marginTop: 4,
    opacity: 0.5,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  badgeText: {
    fontWeight: "600",
  },

  high: {
    backgroundColor: "#ffdddd",
  },

  medium: {
    backgroundColor: "#fff3cd",
  },

  low: {
    backgroundColor: "#ddffdd",
  },
});