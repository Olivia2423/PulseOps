import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { startSocket } from "@/services/socket";
import { useEventsStore } from "@/store/useEventsStore";
import { useMetricsStore } from "@/store/useMetricsStore";
import { useAlertsStore } from "@/store/useAlertsStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useAuditStore } from "@/store/useAuditStore";
import type { SocketEvent } from "@/types/events";

export default function FeedScreen() {
  const events = useEventsStore((s) => s.events);
  const addEvent = useEventsStore((s) => s.addEvent);
  const setMetrics = useMetricsStore((s) => s.setMetrics);
  const upsertAlert = useAlertsStore((s) => s.upsertAlert);
  const upsertOrder = useOrdersStore((s) => s.upsertOrder);
  const addLog = useAuditStore((s) => s.addLog);

  useEffect(() => {
    const stop = startSocket({
      onConnect: () => console.log("Feed: socket connected"),
      onDisconnect: (reason) =>
        console.log("Feed: socket disconnected", reason),
      onConnectError: (err) => console.log("Feed: socket connect error", err),
      onEvent: (evt) => {
        addEvent(evt);

        if (evt.type === "METRICS_UPDATED") {
          setMetrics(evt.payload);
        }

        if (evt.type === "ALERT_TRIGGERED" || evt.type === "ALERT_UPDATED") {
          upsertAlert(evt.payload);
        }
        if (evt.type === "ORDER_CREATED" || evt.type === "ORDER_UPDATED") {
          upsertOrder(evt.payload);
        }
        if (evt.type === "AUDIT_LOGGED") {
          addLog(evt.payload);
        }
      },
    });

    return () => stop();
  }, [addEvent, setMetrics, upsertAlert, upsertAlert, addLog]);

  return (
    <FlatList
      data={events}
      keyExtractor={(item, idx) => `${item.type}-${item.timestamp}-${idx}`}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Live Feed</Text>
          <Text style={styles.sub}>
            {events.length === 0
              ? "Waiting for socket events…"
              : `Receiving events (${events.length})`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.line}>
            {item.type} • {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          <Text style={styles.small}>
            {JSON.stringify(item.payload).slice(0, 140)}
            {JSON.stringify(item.payload).length > 140 ? "…" : ""}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 14 },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  sub: { marginTop: 4, opacity: 0.7 },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    marginBottom: 10,
  },
  line: { fontWeight: "600" },
  small: { marginTop: 6, opacity: 0.7 },
});