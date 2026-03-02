import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ackAlert, fetchAlerts, resolveAlert } from "@/services/alertsService";
import { useAlertsStore } from "@/store/useAlertsStore";
import type { Alert } from "@/types/events";

function SeverityBadge({ severity }: { severity: Alert["severity"] }) {
  const style =
    severity === "HIGH" ? styles.high : severity === "MEDIUM" ? styles.med : styles.low;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.badgeText}>{severity}</Text>
    </View>
  );
}

export default function AlertsScreen() {
  const alerts = useAlertsStore((s) => s.alerts);
  const setAlerts = useAlertsStore((s) => s.setAlerts);
  const upsertAlert = useAlertsStore((s) => s.upsertAlert);

  useEffect(() => {
    fetchAlerts().then(setAlerts).catch((e) => console.log("fetchAlerts error", e));
  }, [setAlerts]);

  async function onAck(id: string) {
    const updated = await ackAlert(id);
    upsertAlert(updated);
  }

  async function onResolve(id: string) {
    const updated = await resolveAlert(id);
    upsertAlert(updated);
  }

  // Optional: show only active alerts
  const active = alerts.filter((a) => a.status !== "RESOLVED");

  return (
    <FlatList
      data={active}
      keyExtractor={(a) => a.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
          <Text style={styles.sub}>
            {active.length === 0 ? "No active alerts 🎉" : `${active.length} active`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <SeverityBadge severity={item.severity} />
          </View>

          <Text style={styles.meta}>Status: {item.status}</Text>

          {item.acknowledgedBy ? (
            <Text style={styles.meta}>Acknowledged by: {item.acknowledgedBy}</Text>
          ) : null}

          <View style={styles.actions}>
            {item.status === "OPEN" ? (
              <Pressable onPress={() => onAck(item.id)} style={styles.btn}>
                <Text style={styles.btnText}>Acknowledge</Text>
              </Pressable>
            ) : null}

            <Pressable onPress={() => onResolve(item.id)} style={styles.btn}>
              <Text style={styles.btnText}>Resolve</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  sub: { opacity: 0.7, marginTop: 4 },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 12,
    marginBottom: 10,
  },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  alertTitle: { fontWeight: "700", flex: 1, marginRight: 10 },

  meta: { marginTop: 6, opacity: 0.75 },

  actions: { marginTop: 12, flexDirection: "row", gap: 10 },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  btnText: { fontWeight: "700" },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontWeight: "800" },
  high: { backgroundColor: "rgba(255,0,0,0.12)" },
  med: { backgroundColor: "rgba(255,170,0,0.16)" },
  low: { backgroundColor: "rgba(0,200,0,0.12)" },
});