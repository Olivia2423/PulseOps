import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fetchAuditLogs } from "@/services/auditService";
import { useAuditStore } from "@/store/useAuditStore";

export default function AuditScreen() {
  const logs = useAuditStore((s) => s.logs);
  const setLogs = useAuditStore((s) => s.setLogs);

  useEffect(() => {
    fetchAuditLogs()
      .then(setLogs)
      .catch((e) => console.log("fetchAuditLogs error", e));
  }, [setLogs]);

  return (
    <FlatList
      data={logs}
      keyExtractor={(l) => l.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Audit Log</Text>
          <Text style={styles.sub}>
            {logs.length === 0 ? "Waiting for audit events…" : `${logs.length} entries`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.time}>
              {new Date(item.at).toLocaleTimeString()}
            </Text>
          </View>

          <Text style={styles.meta}>
            Actor: {item.actor} • Target: {item.targetId}
          </Text>

          {item.message ? <Text style={styles.msg}>{item.message}</Text> : null}
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

  row: { flexDirection: "row", justifyContent: "space-between" },
  action: { fontWeight: "800" },
  time: { opacity: 0.7 },
  meta: { marginTop: 6, opacity: 0.75 },
  msg: { marginTop: 6 },
});