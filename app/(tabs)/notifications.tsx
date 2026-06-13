import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { NOTIFICATIONS } from "../../data/restaurants";

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones 🔔</Text>
        <Text style={styles.sub}>
          {NOTIFICATIONS.filter((n) => !n.read).length} sin leer
        </Text>
      </View>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
          >
            <View style={[styles.dot, item.read && styles.dotRead]} />
            <View style={styles.info}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  header: { backgroundColor: "#fff", padding: 20, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.text },
  sub: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    elevation: 1,
  },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    flexShrink: 0,
  },
  dotRead: { backgroundColor: Colors.textMuted },
  info: { flex: 1, gap: 3 },
  notifTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  notifBody: { fontSize: 12, color: Colors.textLight, lineHeight: 17 },
  notifTime: { fontSize: 11, color: Colors.textMuted },
});
