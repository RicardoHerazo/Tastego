import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useFavorites } from "../../context/FavoritesContext";
import { restaurants } from "../../data/restaurants";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const favList = restaurants.filter((r) => favorites.includes(r.id));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritos ❤️</Text>
        <Text style={styles.sub}>{favList.length} guardado(s)</Text>
      </View>
      {favList.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTxt}>Sin favoritos aún</Text>
          <Text style={styles.emptySub}>
            Toca ❤️ en cualquier restaurante para guardarlo
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.exploreTxt}>Explorar restaurantes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favList}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImg} />
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons name="heart" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="star" size={11} color={Colors.primary} />
                  <Text style={styles.cardMeta}>
                    {item.rating} · {item.distance}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  header: { backgroundColor: "#fff", padding: 20, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.text },
  sub: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 14 },
  emptyTxt: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  exploreTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
  grid: { padding: 16, gap: 14 },
  row: { gap: 14 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardImg: { width: "100%", height: 120 },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
  cardInfo: { padding: 10, gap: 4 },
  cardName: { fontSize: 13, fontWeight: "700", color: Colors.text },
  cardMeta: { fontSize: 12, color: Colors.textLight },
});
