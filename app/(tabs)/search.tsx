import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { CATEGORIES, restaurants } from "../../data/restaurants";

type SearchMode = "restaurantes" | "platos";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [mode, setMode] = useState<SearchMode>("restaurantes");
  const [loading, setLoading] = useState(false);

  const onSearch = (t: string) => {
    setQuery(t);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  // Resultados de restaurantes
  const restaurantResults = restaurants.filter((r) => {
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    const matchC = category === "Todos" || r.tags.includes(category);
    return matchQ && matchC;
  });

  // Resultados de platos (busca en todos los menus)
  const dishResults = restaurants.flatMap((r) =>
    r.menu
      .filter((d) => {
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          d.name.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q);
        const matchC = category === "Todos" || r.tags.includes(category);
        return matchQ && matchC;
      })
      .map((d) => ({
        ...d,
        restaurantId: r.id,
        restaurantName: r.name,
        restaurantImage: r.image,
      })),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header + buscador */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar 🔍</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder={
              mode === "restaurantes"
                ? "Nombre o descripción..."
                : "Nombre del plato..."
            }
            value={query}
            onChangeText={onSearch}
            placeholderTextColor={Colors.textMuted}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Toggle restaurantes / platos */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === "restaurantes" && styles.modeBtnActive,
            ]}
            onPress={() => setMode("restaurantes")}
          >
            <Ionicons
              name="storefront-outline"
              size={16}
              color={mode === "restaurantes" ? "#fff" : Colors.textLight}
            />
            <Text
              style={[
                styles.modeTxt,
                mode === "restaurantes" && styles.modeTxtActive,
              ]}
            >
              Restaurantes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === "platos" && styles.modeBtnActive]}
            onPress={() => setMode("platos")}
          >
            <Ionicons
              name="restaurant-outline"
              size={16}
              color={mode === "platos" ? "#fff" : Colors.textLight}
            />
            <Text
              style={[
                styles.modeTxt,
                mode === "platos" && styles.modeTxtActive,
              ]}
            >
              Platos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chips de categoría */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, category === item.name && styles.chipActive]}
            onPress={() => setCategory(item.name)}
          >
            <Text style={styles.chipEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.chipTxt,
                category === item.name && styles.chipTxtActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
      ) : mode === "restaurantes" ? (
        /* ── MODO RESTAURANTES ── */
        restaurantResults.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTxt}>Sin restaurantes</Text>
            <Text style={styles.emptySub}>
              Prueba con otro término o categoría
            </Text>
          </View>
        ) : (
          <FlatList
            data={restaurantResults}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gridCard}
                onPress={() => router.push(`/restaurant/${item.id}`)}
              >
                <Image source={{ uri: item.image }} style={styles.gridImg} />
                <View style={styles.gridInfo}>
                  <Text style={styles.gridName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.gridCat}>{item.category}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Ionicons name="star" size={11} color={Colors.primary} />
                    <Text style={styles.gridMeta}>
                      {item.rating} · {item.deliveryTime}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )
      ) : /* ── MODO PLATOS ── */
      dishResults.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🍲</Text>
          <Text style={styles.emptyTxt}>Sin platos encontrados</Text>
          <Text style={styles.emptySub}>
            Intenta con otro nombre o ingrediente
          </Text>
        </View>
      ) : (
        <FlatList
          data={dishResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dishList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dishCard}
              onPress={() => router.push(`/restaurant/${item.restaurantId}`)}
            >
              <Image source={{ uri: item.image }} style={styles.dishImg} />
              <View style={styles.dishInfo}>
                <View style={styles.dishNameRow}>
                  <Text style={styles.dishName}>{item.name}</Text>
                  {item.isTypical && (
                    <View style={styles.typicalBadge}>
                      <Text style={styles.typicalTxt}>Típico</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.dishDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.dishFooter}>
                  <Text style={styles.dishPrice}>
                    ${item.price.toLocaleString()}
                  </Text>
                  <View style={styles.restaurantTag}>
                    <Ionicons
                      name="storefront-outline"
                      size={12}
                      color={Colors.textLight}
                    />
                    <Text style={styles.restaurantTagTxt} numberOfLines={1}>
                      {item.restaurantName}
                    </Text>
                  </View>
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
  header: { backgroundColor: "#fff", padding: 20, paddingBottom: 14, gap: 12 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.text },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundGray,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeTxt: { fontSize: 13, fontWeight: "600", color: Colors.textLight },
  modeTxtActive: { color: "#fff" },
  chips: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipEmoji: { fontSize: 14 },
  chipTxt: { fontSize: 13, fontWeight: "600", color: Colors.textLight },
  chipTxtActive: { color: "#fff" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 12 },
  emptyTxt: { fontSize: 18, fontWeight: "700", color: Colors.text },
  emptySub: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
    textAlign: "center",
  },
  // Grid restaurantes
  grid: { padding: 16, gap: 14 },
  row: { gap: 14 },
  gridCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  gridImg: { width: "100%", height: 110 },
  gridInfo: { padding: 10, gap: 3 },
  gridName: { fontSize: 13, fontWeight: "700", color: Colors.text },
  gridCat: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  gridMeta: { fontSize: 11, color: Colors.textLight },
  // Lista platos
  dishList: { padding: 16, gap: 12 },
  dishCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  dishImg: { width: 100, height: 100 },
  dishInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  dishNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  dishName: { fontSize: 14, fontWeight: "700", color: Colors.text },
  typicalBadge: {
    backgroundColor: Colors.primary + "20",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  typicalTxt: { fontSize: 10, color: Colors.primary, fontWeight: "700" },
  dishDesc: { fontSize: 12, color: Colors.textLight, lineHeight: 17 },
  dishFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dishPrice: { fontSize: 15, fontWeight: "900", color: Colors.primary },
  restaurantTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "55%",
  },
  restaurantTagTxt: { fontSize: 11, color: Colors.textLight },
});
