import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { Colors } from "../../constants/Colors";
import { useFavorites } from "../../context/FavoritesContext";
import { restaurants } from "../../data/restaurants";

const { width } = Dimensions.get("window");

export default function RestaurantDetail() {
  // Captura el [id] dinámico de la URL: /restaurant/1 → id = '1'
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Busca el restaurante que coincida con el id de la URL
  const r = restaurants.find((x) => x.id === id);
  if (!r) return null; // si no existe, no renderiza nada

  // Estados que empiezan con valores del array y se actualizan con GPS real
  const [realDistance, setRealDistance] = useState<string>(r.distance);
  const [realTime, setRealTime] = useState<string>(r.deliveryTime);

  // ── CÁLCULO DE DISTANCIA Y TIEMPO REAL ───────────────────────────
  useEffect(() => {
    (async () => {
      // Pide permiso para acceder al GPS del celular
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return; // si niega el permiso, usa los valores del array

      // Obtiene coordenadas reales del celular
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Fórmula Haversine: calcula distancia entre 2 puntos GPS en la Tierra
      const toRad = (val: number) => (val * Math.PI) / 180; // grados → radianes
      const R = 6371; // radio de la Tierra en km
      const dLat = toRad(r.latitude - loc.coords.latitude);
      const dLon = toRad(r.longitude - loc.coords.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(loc.coords.latitude)) *
          Math.cos(toRad(r.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distKm = R * c; // distancia final en km

      // Tiempo estimado: velocidad moto 25km/h + 10 min de preparación
      const tiempoMin = Math.round((distKm / 25) * 60) + 10;
      const tiempoMax = tiempoMin + 10;

      // Actualiza los estados → React re-renderiza con valores reales
      setRealDistance(`${distKm.toFixed(1)} km`);
      setRealTime(`${tiempoMin}-${tiempoMax} min`);
    })();
  }, []); // [] = se ejecuta una sola vez al abrir la pantalla

  // ── MAPA CON LEAFLET + OPENSTREETMAP ─────
  // Se construye un HTML completo que WebView renderiza como mini-navegador
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- Leaflet CSS: estilos del mapa -->
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <!-- Leaflet JS: librería que dibuja el mapa -->
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Crea el mapa centrado en las coordenadas del restaurante
        const map = L.map('map', { zoomControl: true }).setView([${r.latitude}, ${r.longitude}], 16);
        
        // Carga los tiles (imágenes del mapa) desde OpenStreetMap — GRATIS
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        // Marcador personalizado rojo con forma de pin
        const icon = L.divIcon({
          html: '<div style="background:#E8341C;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          className: '',
        });

        // Coloca el marcador en la ubicación del restaurante con popup
        L.marker([${r.latitude}, ${r.longitude}], { icon })
          .addTo(map)
          .bindPopup('<b>${r.name}</b><br>${r.address}')
          .openPopup();
      </script>
    </body>
    </html>
  `;

  // ── NAVEGACIÓN GPS: abre Google Maps o Apple Maps ─────────────────
  const openNavigation = () => {
    const label = encodeURIComponent(r.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${r.latitude},${r.longitude}`, // Apple Maps
      android: `google.navigation:q=${r.latitude},${r.longitude}&mode=d`, // Google Maps
    });
    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url); // abre la app de mapas del celular
        } else {
          // Si no tiene la app instalada → abre Google Maps en el navegador
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${r.latitude},${r.longitude}&destination_place_id=${label}&travelmode=driving`,
          );
        }
      });
    }
  };

  // Abre el restaurante en OpenStreetMap web
  const openInMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=17/${r.latitude}/${r.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── HERO: imagen de portada con overlay oscuro ── */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: r.coverImage }} style={styles.hero} />
          <View style={styles.heroOverlay} />

          {/* Botón volver */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Botón favorito: corazón rojo si está guardado, blanco si no */}
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(r.id)}
          >
            <Ionicons
              name={isFavorite(r.id) ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite(r.id) ? Colors.primary : "#fff"}
            />
          </TouchableOpacity>

          {/* Info superpuesta sobre la imagen */}
          <View style={styles.heroInfo}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{r.name}</Text>
              {/* Badge verde solo si isReal: true en restaurants.ts */}
              {r.isReal && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedTxt}>✅ Verificado</Text>
                </View>
              )}
            </View>
            <View style={styles.heroMeta}>
              <View style={styles.ratingChip}>
                <Ionicons name="star" size={13} color={Colors.primary} />
                <Text style={styles.ratingTxt}>
                  {r.rating} ({r.reviewCount})
                </Text>
              </View>
              <Text style={styles.heroMetaTxt}>
                · {r.category} · {r.distance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* ── STATS: distancia y tiempo calculados con GPS real ── */}
          <View style={styles.statsRow}>
            {[
              { icon: "time-outline", label: realTime, sub: "Entrega" }, // tiempo real GPS
              {
                icon: "location-outline",
                label: realDistance,
                sub: "Distancia",
              }, // distancia real GPS
              { icon: "star-outline", label: String(r.rating), sub: "Rating" }, // rating del array
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Ionicons
                  name={s.icon as any}
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.statValue}>{s.label}</Text>
                <Text style={styles.statLabel}>{s.sub}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.desc}>{r.description}</Text>
          <Text style={styles.address}>
            📍 {r.address} · 🕐 {r.openHours}
          </Text>

          {/* ── BOTONES DE ACCIÓN ── */}
          <View style={styles.actions}>
            {/* Abre Google Maps / Apple Maps con ruta de navegación */}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
              onPress={openNavigation}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.actionTxt}>Cómo llegar</Text>
            </TouchableOpacity>

            {/* Abre la app de llamadas del celular */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionOutline]}
              onPress={() => Linking.openURL(`tel:${r.phone}`)}
            >
              <Ionicons name="call-outline" size={18} color={Colors.primary} />
              <Text style={[styles.actionTxt, { color: Colors.primary }]}>
                Llamar
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── MAPA OPENSTREETMAP + LEAFLET ── */}
          <View style={styles.mapSection}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapTitle}>🗺️ Ubicación</Text>
              {/* Abre OpenStreetMap en el navegador */}
              <TouchableOpacity onPress={openInMaps}>
                <Text style={styles.mapOpenTxt}>Ver en mapa →</Text>
              </TouchableOpacity>
            </View>

            {/* WebView actúa como mini-navegador que renderiza el HTML con Leaflet */}
            <View style={styles.mapWrapper}>
              <WebView
                source={{ html: mapHtml }} // el HTML con el mapa Leaflet
                style={styles.map}
                scrollEnabled={false} // evita conflicto con el ScrollView padre
                javaScriptEnabled // necesario para que Leaflet.js funcione
                originWhitelist={["*"]} // permite cargar recursos de OpenStreetMap
                mixedContentMode="always" // permite http y https mezclados
              />
            </View>

            {/* Botón GPS dentro de la sección del mapa */}
            <TouchableOpacity style={styles.navBtn} onPress={openNavigation}>
              <Ionicons name="navigate-circle" size={20} color="#fff" />
              <Text style={styles.navBtnTxt}>🚗 Iniciar navegación GPS</Text>
            </TouchableOpacity>
          </View>

          {/* ── MENÚ PREVIEW: muestra los platos del restaurante ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍽️ Menú</Text>
            {/* Ver todo → navega a menu/[id].tsx */}
            <TouchableOpacity onPress={() => router.push(`/menu/${r.id}`)}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          {/* Itera sobre el menú del restaurante */}
          {r.menu.map((dish) => (
            // Toca el plato → va a ar/[dish].tsx para ver en AR
            <TouchableOpacity
              key={dish.id}
              style={styles.dishCard}
              onPress={() => router.push(`/ar/${dish.id}`)}
            >
              <Image source={{ uri: dish.image }} style={styles.dishImg} />
              <View style={styles.dishInfo}>
                <View style={styles.dishNameRow}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  {/* Badge "Típico" solo si isTypical: true */}
                  {dish.isTypical && (
                    <View style={styles.typicalBadge}>
                      <Text style={styles.typicalTxt}>Típico</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.dishDesc} numberOfLines={2}>
                  {dish.description}
                </Text>
                <View style={styles.dishFooter}>
                  {/* Precio formateado con separador de miles */}
                  <Text style={styles.dishPrice}>
                    ${dish.price.toLocaleString()}
                  </Text>
                  {/* Indicador de que se puede ver en AR */}
                  <View style={styles.arTag}>
                    <Ionicons
                      name="camera-outline"
                      size={13}
                      color={Colors.primary}
                    />
                    <Text style={styles.arTagTxt}>Ver en AR</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  heroWrap: { position: "relative", height: 280 },
  hero: { width: "100%", height: 280 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject, // cubre toda la imagen
    backgroundColor: "rgba(0,0,0,0.35)", // oscurece para leer el texto
  },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  favBtn: {
    position: "absolute",
    top: 52,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  heroInfo: { position: "absolute", bottom: 20, left: 20, right: 20 },
  heroName: { fontSize: 24, fontWeight: "900", color: "#fff", marginBottom: 6 },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingTxt: { fontSize: 12, fontWeight: "700", color: Colors.text },
  heroMetaTxt: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  heroNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  verifiedBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedTxt: { color: "#fff", fontSize: 11, fontWeight: "700" },
  content: { padding: 20 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 14, fontWeight: "800", color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textLight },
  desc: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 21,
    marginBottom: 8,
  },
  address: { fontSize: 13, color: Colors.textLight, marginBottom: 18 },
  actions: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    elevation: 3,
  },
  actionOutline: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    elevation: 0,
  },
  actionTxt: { color: "#fff", fontSize: 14, fontWeight: "700" },
  mapSection: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  mapTitle: { fontSize: 15, fontWeight: "800", color: Colors.text },
  mapOpenTxt: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  mapWrapper: { height: 220 },
  map: { flex: 1 },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    margin: 14,
    borderRadius: 14,
    elevation: 3,
  },
  navBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: "600" },
  dishCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  dishImg: { width: 90, height: 90 },
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
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typicalTxt: { fontSize: 10, color: Colors.primary, fontWeight: "700" },
  dishDesc: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 17,
    marginTop: 3,
  },
  dishFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  dishPrice: { fontSize: 15, fontWeight: "900", color: Colors.primary },
  arTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  arTagTxt: { fontSize: 12, color: Colors.primary, fontWeight: "600" },
});
