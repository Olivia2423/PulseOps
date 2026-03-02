import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchOrderById, retryOrder } from "@/services/ordersService";
import { useOrdersStore } from "@/store/useOrdersStore";
import type { Order } from "@/types/events";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orders = useOrdersStore((s) => s.orders);

  const cached = useMemo(
    () => orders.find((o) => o.id === id),
    [orders, id]
  );

  const [order, setOrder] = useState<Order | null>(cached ?? null);

  useEffect(() => {
    if (!id) return;
    fetchOrderById(String(id))
      .then(setOrder)
      .catch((e) => console.log("fetchOrderById error", e));
  }, [id]);

  async function onRetry() {
    if (!order) return;
    try {
      const updated = await retryOrder(order.id);
      setOrder(updated);
    } catch (e) {
      console.log("retryOrder error", e);
    }
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Loading order…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{order.id}</Text>
      <Text style={styles.sub}>State: {order.state}</Text>
      <Text style={styles.sub}>Priority: {order.priority}</Text>
      <Text style={styles.sub}>Retries: {order.retryCount}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Retry Processing</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifecycle Timeline</Text>

        {order.transitions.map((t, idx) => (
          <View key={`${t.at}-${idx}`} style={styles.row}>
            <Text style={styles.time}>
              {new Date(t.at).toLocaleTimeString()}
            </Text>
            <Text style={styles.state}>
              {t.from} → {t.to}
            </Text>
          </View>
        ))}

        {order.transitions.some((t) => t.reason) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {order.transitions
              .filter((t) => t.reason)
              .map((t, idx) => (
                <Text key={`${t.at}-r-${idx}`} style={styles.note}>
                  • {t.reason}
                </Text>
              ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800" },
  sub: { marginTop: 6, opacity: 0.75 },

  section: { marginTop: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },

  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  time: { opacity: 0.7, marginBottom: 4 },
  state: { fontWeight: "600" },

  note: { marginTop: 6, opacity: 0.8 },
  actions: { marginTop: 14, marginBottom: 6 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
  },
  buttonText: { fontWeight: "700" },
});