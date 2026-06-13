import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email.trim()) {
      return Alert.alert(
        "❌ Campo requerido",
        "Ingresa tu correo electrónico.",
      );
    }
    if (!email.includes("@") || !email.includes(".")) {
      return Alert.alert(
        "❌ Correo inválido",
        "Ingresa un correo electrónico válido.",
      );
    }
    if (!password.trim()) {
      return Alert.alert("❌ Campo requerido", "Ingresa tu contraseña.");
    }
    if (password.length < 6) {
      return Alert.alert(
        "❌ Contraseña muy corta",
        "La contraseña debe tener al menos 6 caracteres.",
      );
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert(
        "❌ Error de acceso",
        result.error ?? "No se pudo iniciar sesión.",
        [
          // Si el error es que no existe la cuenta, ofrecer registrarse
          ...(result.error?.includes("registrarte")
            ? [
                {
                  text: "Registrarme",
                  onPress: () => router.push("/auth/register"),
                },
              ]
            : []),
          { text: "Intentar de nuevo", style: "cancel" },
        ],
      );
    }
    // Si success: el Guard en _layout.tsx redirige automáticamente a home
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoArea}>
          <Text style={styles.logoEmoji}>🍽️</Text>
          <Text style={styles.logoText}>TasteGo</Text>
          <Text style={styles.logoSub}>
            Sabores de Sucre al alcance de tu mano
          </Text>
        </View>

        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.sub}>Bienvenido de vuelta 👋</Text>

        {/* Correo */}
        <Text style={styles.label}>Correo electrónico</Text>
        <View
          style={[
            styles.inputWrap,
            email.length > 0 && styles.inputWrapFocused,
          ]}
        >
          <Ionicons name="mail-outline" size={18} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={Colors.textMuted}
          />
          {email.length > 0 && (
            <TouchableOpacity onPress={() => setEmail("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Contraseña */}
        <Text style={styles.label}>Contraseña</Text>
        <View
          style={[
            styles.inputWrap,
            password.length > 0 && styles.inputWrapFocused,
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
            autoCapitalize="none"
            placeholderTextColor={Colors.textMuted}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>

        {/* Info de seguridad */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={Colors.primary}
          />
          <Text style={styles.infoTxt}>
            Debes tener una cuenta registrada para iniciar sesión.
          </Text>
        </View>

        {/* Botón login */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.btnContent}>
              <Ionicons name="sync" size={18} color="#fff" />
              <Text style={styles.btnTxt}>Verificando...</Text>
            </View>
          ) : (
            <View style={styles.btnContent}>
              <Ionicons name="log-in-outline" size={18} color="#fff" />
              <Text style={styles.btnTxt}>Iniciar sesión</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerTxt}>¿No tienes cuenta?</Text>
          <View style={styles.divider} />
        </View>

        {/* Ir a registro */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push("/auth/register")}
        >
          <Ionicons
            name="person-add-outline"
            size={18}
            color={Colors.primary}
          />
          <Text style={styles.registerBtnTxt}>Crear cuenta nueva</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 28, paddingBottom: 48 },
  logoArea: { alignItems: "center", marginTop: 48, marginBottom: 36 },
  logoEmoji: { fontSize: 52, marginBottom: 8 },
  logoText: {
    fontSize: 42,
    fontFamily: "Inter_800ExtraBold",
    fontStyle: "italic",
    color: Colors.primary,
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 6,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  sub: { fontSize: 15, color: Colors.textLight, marginBottom: 24 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
    marginTop: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputWrapFocused: {
    borderColor: Colors.primary + "60",
    backgroundColor: Colors.primary + "08",
  },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.primary + "10",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  infoTxt: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 19 },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.65 },
  btnContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    marginBottom: 16,
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerTxt: {
    color: Colors.textLight,
    fontSize: 13,
    whiteSpace: "nowrap",
  } as any,
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },
  registerBtnTxt: { color: Colors.primary, fontSize: 16, fontWeight: "700" },
});
