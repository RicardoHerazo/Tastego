import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { CATEGORIES, restaurants } from "../../data/restaurants";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
  }, []);

  const filtered =
    category === "Todos"
      ? restaurants
      : restaurants.filter((r) => r.tags.includes(category));

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingTxt}>Cargando sabores de Sucre... 🍽️</Text>
      </View>
    );
  }

  const featuredRestaurant = restaurants.find(
    (r) => r.discount && r.discount > 0,
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con avatar clickeable → perfil */}
        <View style={styles.header}>
          <View>
            <Text style={styles.location}>📍 Sincelejo, Sucre</Text>
            <Text style={styles.greeting}>
              Hola, {user?.name?.split(" ")[0]} 👋
            </Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.avatarTxt}>
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Banner promo */}
        {featuredRestaurant && (
          <TouchableOpacity
            style={styles.banner}
            onPress={() => router.push(`/restaurant/${featuredRestaurant.id}`)}
          >
            <View style={styles.bannerLeft}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountTxt}>
                  {featuredRestaurant.discount}% OFF
                </Text>
              </View>
              <Text style={styles.bannerTitle}>¡Oferta especial!</Text>
              <Text style={styles.bannerSub}>{featuredRestaurant.name}</Text>
            </View>
            <Image
              source={{ uri: featuredRestaurant.image }}
              style={styles.bannerImg}
            />
          </TouchableOpacity>
        )}

        {/* Categorías */}
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.catList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.catItem}
              onPress={() => setCategory(item.name)}
            >
              <View
                style={[
                  styles.catCircle,
                  category === item.name && styles.catCircleActive,
                ]}
              >
                <Text style={styles.catEmoji}>{item.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.catLabel,
                  category === item.name && styles.catLabelActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Destacados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Destacados</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={restaurants.filter((r) => r.isFeatured)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.featuredImg} />
              <TouchableOpacity
                style={styles.favOverlay}
                onPress={() => toggleFavorite(item.id)}
              >
                <Ionicons
                  name={isFavorite(item.id) ? "heart" : "heart-outline"}
                  size={18}
                  color={isFavorite(item.id) ? Colors.primary : "#fff"}
                />
              </TouchableOpacity>
              {item.discount ? (
                <View style={styles.discountOverlay}>
                  <Text style={styles.discountOverlayTxt}>
                    {item.discount}% OFF
                  </Text>
                </View>
              ) : null}
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.featuredCat}>{item.category}</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="star" size={12} color={Colors.primary} />
                  <Text style={styles.metaTxt}>
                    {item.rating} · {item.deliveryTime}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Lista filtrada */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {category === "Todos"
              ? "🍴 Todos los restaurantes"
              : `🍽️ ${category}`}
          </Text>
        </View>

        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listCard}
            onPress={() => router.push(`/restaurant/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.listImg} />
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listCat}>{item.category}</Text>
              <View style={styles.listMeta}>
                <Ionicons name="star" size={12} color={Colors.primary} />
                <Text style={styles.metaTxt}>
                  {item.rating} ({item.reviewCount})
                </Text>
                <Text style={styles.metaDot}>·</Text>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={Colors.textLight}
                />
                <Text style={styles.metaTxt}>{item.deliveryTime}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Ionicons
                name={isFavorite(item.id) ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite(item.id) ? Colors.primary : Colors.border}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingTxt: { marginTop: 14, color: Colors.textLight, fontSize: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  location: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  greeting: { fontSize: 20, fontWeight: "800", color: Colors.text },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  avatarTxt: { color: "#fff", fontWeight: "800", fontSize: 18 },
  banner: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 18,
    overflow: "hidden",
    height: 110,
  },
  bannerLeft: { flex: 1, padding: 16, justifyContent: "center" },
  discountBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  discountTxt: { color: "#fff", fontWeight: "800", fontSize: 13 },
  bannerTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  bannerImg: { width: 130, height: "100%" },
  catList: { paddingHorizontal: 20, paddingVertical: 20, gap: 16 },
  catItem: { alignItems: "center", gap: 6 },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  catCircleActive: { backgroundColor: Colors.primary },
  catEmoji: { fontSize: 26 },
  catLabel: { fontSize: 11, color: Colors.textLight, fontWeight: "600" },
  catLabelActive: { color: Colors.primary },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  featuredList: { paddingHorizontal: 20, gap: 14, marginBottom: 24 },
  featuredCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  featuredImg: { width: "100%", height: 120 },
  favOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 16,
    padding: 6,
  },
  discountOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountOverlayTxt: { color: "#fff", fontSize: 11, fontWeight: "800" },
  featuredInfo: { padding: 12 },
  featuredName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  featuredCat: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: 6,
  },
  featuredMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 12, color: Colors.textLight },
  metaDot: { color: Colors.textMuted },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  listImg: { width: 76, height: 76, borderRadius: 12 },
  listInfo: { flex: 1, marginLeft: 12, gap: 3 },
  listName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  listCat: { fontSize: 11, color: Colors.primary, fontWeight: "600" },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
});
