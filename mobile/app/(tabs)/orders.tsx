import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { fetchOrders } from "@/services/ordersService";
import { useOrdersStore } from "@/store/useOrdersStore";
import type { Order } from "@/types/events";

function StatePill({ state }: { state: Order["state"] }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{state}</Text>
    </View>
  );
}

function PriorityPill({ priority }: { priority: Order["priority"] }) {
  const style =
    priority === "HIGH"
      ? styles.pHigh
      : priority === "LOW"
      ? styles.pLow
      : styles.pNormal;

  return (
    <View style={[styles.pill, style]}>
      <Text style={styles.pillText}>{priority}</Text>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const orders = useOrdersStore((s) => s.orders);
  const setOrders = useOrdersStore((s) => s.setOrders);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch((e) => console.log("fetchOrders error", e));
  }, [setOrders]);

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.sub}>
            {orders.length === 0 ? "Waiting for orders…" : `${orders.length} orders`}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({ pathname: "/order/[id]", params: { id: item.id } })
          }
          style={styles.card}
        >
          <View style={styles.row}>
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.time}>
              {new Date(item.updatedAt).toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.row2}>
            <StatePill state={item.state} />
            <PriorityPill priority={item.priority} />
            <Text style={styles.meta}>Retries: {item.retryCount}</Text>
          </View>
        </Pressable>
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
  row2: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  id: { fontWeight: "700" },
  time: { opacity: 0.7 },

  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  pillText: { fontWeight: "600", fontSize: 12 },

  pHigh: { backgroundColor: "rgba(255,0,0,0.10)" },
  pNormal: { backgroundColor: "rgba(0,0,0,0.05)" },
  pLow: { backgroundColor: "rgba(0,200,0,0.10)" },

  meta: { opacity: 0.7 },
});