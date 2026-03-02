import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PulseOps</Text>
      <Text style={styles.subtitle}>Real-Time Workflow Monitoring</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
});