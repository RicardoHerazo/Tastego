// ============================================================
// app/ar/[dish].tsx
// Pantalla de vista previa AR de un plato.
// Recibe el ID del plato por la URL, activa la cámara trasera
// y simula un escaneo antes de mostrar la info del plato.
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { restaurants } from "../../data/restaurants";

// Las 3 fases de la experiencia AR
type Phase = "intro" | "scanning" | "result";

export default function ARScreen() {
  // ID del plato recibido desde la URL: /ar/[dish]
  const { dish: dishId } = useLocalSearchParams<{ dish: string }>();
  const router = useRouter();

  // Permiso de cámara
  const [permission, requestPermission] = useCameraPermissions();

  // Fase actual de la experiencia
  const [phase, setPhase] = useState<Phase>("intro");

  // Valor animado para el efecto de pulso del marco de escaneo
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Busca el plato en todos los menús de todos los restaurantes
  const dish = restaurants.flatMap((r) => r.menu).find((d) => d.id === dishId);

  // Solicita permiso de cámara al montar la pantalla
  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  // Cuando entra a "scanning": inicia animación de pulso y avanza a "result" tras 3 seg
  useEffect(() => {
    if (phase === "scanning") {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
      const timer = setTimeout(() => setPhase("result"), 3000);
      // Limpia animación y timer si el componente se desmonta o cambia la fase
      return () => {
        loop.stop();
        clearTimeout(timer);
      };
    }
  }, [phase]);

  // Si no hay permiso de cámara, muestra pantalla para solicitarlo
  if (!permission?.granted) {
    return (
      <View style={styles.permWrap}>
        <Ionicons name="camera-outline" size={56} color="#fff" />
        <Text style={styles.permTitle}>Permiso de cámara</Text>
        <Text style={styles.permSub}>Necesario para la experiencia AR</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnTxt}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cámara trasera como fondo de toda la pantalla */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* Overlay oscuro semitransparente encima de la cámara */}
      <View style={styles.overlay}>
        {/* Botón volver */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* FASE 1 — Intro: instrucciones iniciales y botón para comenzar */}
        {phase === "intro" && (
          <View style={styles.centeredContent}>
            <View style={styles.phoneIllustration}>
              <Text style={styles.phoneEmoji}>📱</Text>
            </View>
            <Text style={styles.phaseTitle}>
              Descubre el plato en{"\n"}realidad aumentada
            </Text>
            <Text style={styles.phaseSub}>
              Apunta la cámara a una{"\n"}superficie plana
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => setPhase("scanning")}
            >
              <Text style={styles.startBtnTxt}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* FASE 2 — Scanning: visor animado con efecto pulso durante 3 segundos */}
        {phase === "scanning" && (
          <View style={styles.centeredContent}>
            <Text style={styles.phaseTitle}>
              Apunta la cámara a{"\n"}una superficie plana
            </Text>
            {/* Marco de escaneo con escala animada */}
            <Animated.View
              style={[styles.scanFrame, { transform: [{ scale: pulseAnim }] }]}
            >
              {/* 4 esquinas decorativas del visor */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <ActivityIndicator size="large" color={Colors.primary} />
            </Animated.View>
            <Text style={styles.scanHint}>Buscando superficie plana...</Text>
          </View>
        )}

        {/* FASE 3 — Result: muestra info del plato (solo si el plato existe) */}
        {phase === "result" && dish && (
          <View style={styles.resultContent}>
            {/* Emoji del plato flotando con sombra debajo */}
            <View style={styles.dishFloat}>
              <Text style={styles.dishFloatEmoji}>🍲</Text>
              <View style={styles.dishShadow} />
            </View>

            {/* Tarjeta blanca con los datos del plato */}
            <View style={styles.resultCard}>
              <Text style={styles.resultDishName}>{dish.name}</Text>

              {/* Badge opcional: solo aparece si el plato es típico */}
              {dish.isTypical && (
                <View style={styles.typicalBadge}>
                  <Text style={styles.typicalTxt}>
                    🌿 Plato Típico de Sucre
                  </Text>
                </View>
              )}

              <Text style={styles.resultDesc}>{dish.description}</Text>

              <View style={styles.resultFooter}>
                <Text style={styles.resultPrice}>
                  ${dish.price.toLocaleString()}
                </Text>
                {/* Calorías: solo se muestra si el plato tiene ese dato */}
                {dish.calories && (
                  <Text style={styles.resultCal}>🔥 {dish.calories} cal</Text>
                )}
              </View>

              {/* Botón para volver a escanear */}
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => setPhase("scanning")}
              >
                <Ionicons name="refresh" size={16} color={Colors.primary} />
                <Text style={styles.resetTxt}>Escanear de nuevo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  // Cubre toda la pantalla con un tinte oscuro sobre la cámara
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  // Botón volver posicionado en la esquina superior izquierda
  backBtn: {
    position: "absolute",
    top: 52,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  // Ilustración decorativa con forma de teléfono
  phoneIllustration: {
    width: 100,
    height: 160,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "rgba(232,52,28,0.1)",
  },
  phoneEmoji: { fontSize: 48 },
  phaseTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 12,
  },
  phaseSub: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 36,
  },
  startBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 52,
    elevation: 4,
  },
  startBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 16 },
  // Contenedor del visor animado (200x200)
  scanFrame: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 32,
  },
  // Base de cada esquina del visor
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  // Cada esquina oculta 2 de sus 4 bordes para formar solo el ángulo
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanHint: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8 },
  // El resultado se ancla al fondo de la pantalla
  resultContent: { flex: 1, justifyContent: "flex-end", padding: 20 },
  dishFloat: { alignItems: "center", marginBottom: 20 },
  dishFloatEmoji: { fontSize: 100 },
  // Sombra elíptica debajo del emoji para dar efecto de flotado
  dishShadow: {
    width: 80,
    height: 10,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
    marginTop: -8,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  resultDishName: { fontSize: 22, fontWeight: "900", color: Colors.text },
  // Color del badge con opacidad al 12% (Colors.warning + "20" en hex)
  typicalBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.warning + "20",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typicalTxt: { fontSize: 12, color: Colors.warning, fontWeight: "700" },
  resultDesc: { fontSize: 13, color: Colors.textLight, lineHeight: 19 },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultPrice: { fontSize: 22, fontWeight: "900", color: Colors.primary },
  resultCal: { fontSize: 13, color: Colors.textLight },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
  },
  resetTxt: { color: Colors.primary, fontWeight: "700", fontSize: 14 },
  // Pantalla de solicitud de permiso (fondo oscuro centrado)
  permWrap: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 14,
  },
  permTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  permSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  permBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
  },
  permBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
