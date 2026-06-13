import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
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
import { CATEGORIES } from "../../data/restaurants";

export default function RegisterScreen() {
  // Hook de navegación de Expo Router para moverse entre pantallas
  const router = useRouter();

  const { register } = useAuth();

  // ── Estados del formulario ──
  const [name, setName] = useState(""); // Nombre completo del usuario
  const [email, setEmail] = useState(""); // Correo electrónico
  const [birthdate, setBirthdate] = useState(""); // Fecha de nacimiento (opcional)
  const [phone, setPhone] = useState(""); // Teléfono de contacto
  const [password, setPassword] = useState(""); // Contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación de contraseña
  const [foodPreference, setFoodPreference] = useState("Todos"); // Preferencia gastronómica (valor por defecto: "Todos")

  // ── Estados de visibilidad de contraseña ──
  const [showPass, setShowPass] = useState(false); // Muestra/oculta la contraseña principal
  const [showConfirmPass, setShowConfirmPass] = useState(false); // Muestra/oculta la confirmación

  // Estado de carga: evita múltiples envíos mientras se procesa el registro
  const [loading, setLoading] = useState(false);

  // Valida todos los campos del formulario antes de enviarlo.
  // Retorna un string con el mensaje de error si algo falla,
  // o null si todo es correcto.

  const validate = (): string | null => {
    if (!name.trim()) return "El nombre completo es obligatorio.";
    if (name.trim().length < 3)
      return "El nombre debe tener al menos 3 caracteres.";
    if (!email.trim()) return "El correo electrónico es obligatorio.";
    if (!email.includes("@") || !email.includes("."))
      return "Ingresa un correo electrónico válido.";
    if (!phone.trim()) return "El teléfono es obligatorio.";
    if (phone.replace(/\D/g, "").length < 7)
      // Elimina no-dígitos y verifica longitud mínima de 7 dígitos
      return "Ingresa un número de teléfono válido.";
    if (!password.trim()) return "La contraseña es obligatoria.";
    if (password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return null; // Sin errores: formulario válido
  };

  // 1. Valida el formulario
  // 2. Llama a register() del contexto de autenticación
  const handleRegister = async () => {
    const error = validate();
    // Si hay error de validación, se muestra una alerta y se detiene el proceso
    if (error) return Alert.alert("❌ Error de validación", error);

    setLoading(true); // Activa el estado de carga
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(), // Normaliza el email a minúsculas
      birthdate: birthdate.trim(),
      phone: phone.trim(),
      password,
      foodPreference,
    });
    setLoading(false); // Desactiva el estado de carga

    if (!result.success) {
      // Muestra el error devuelto por el contexto o un mensaje genérico
      Alert.alert(
        "❌ Error al registrarse",
        result.error ?? "No se pudo crear la cuenta.",
      );
    }
    // Si success: Guard redirige automáticamente a home
  };

  // Retorna null si la contraseña está vacía.

  const getPasswordStrength = () => {
    if (password.length === 0) return null; // Sin contraseña, no mostrar indicador
    if (password.length < 6)
      return { label: "Muy corta", color: "#FF3B30", width: "25%" };
    if (password.length < 8)
      return { label: "Débil", color: "#FF9500", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      // Verifica que tenga al menos una mayúscula Y un número
      return { label: "Regular", color: "#FFCC00", width: "75%" };
    return { label: "Fuerte", color: "#34C759", width: "100%" }; // Contraseña segura
  };

  // Resultado del análisis de fortaleza (se usa en el JSX para renderizado condicional)
  const strength = getPasswordStrength();

  // RENDER
  // Estructura visual de la pantalla de registro

  return (
    // KeyboardAvoidingView: desplaza el contenido hacia arriba
    // cuando el teclado virtual aparece
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* ScrollView: permite desplazarse por el formulario completo */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" // Permite tocar botones sin cerrar el teclado primero
      >
        {/* ── Encabezado con botón atrás y logo ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()} // Navega a la pantalla anterior
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.logoArea}>
            <Text style={styles.logoText}>TasteGo</Text>
          </View>
        </View>

        {/* ── Título y subtítulo de la pantalla ── */}
        <Text style={styles.title}>Crear cuenta 🎉</Text>
        <Text style={styles.sub}>Completa tu información para registrarte</Text>

        {/* ── Campo: Nombre completo ── */}
        <Text style={styles.label}>Nombre completo *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={17} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="Tu nombre completo"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words" // Capitaliza automáticamente cada palabra
          />
        </View>

        {/* ── Campo: Correo electrónico ── */}
        <Text style={styles.label}>Correo electrónico *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={17} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address" // Teclado optimizado para emails
            autoCapitalize="none" // Sin capitalización automática
            autoCorrect={false} // Sin corrección automática
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* ── Campo: Fecha de nacimiento (opcional) ── */}
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="calendar-outline"
            size={17}
            color={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={birthdate}
            onChangeText={setBirthdate}
            keyboardType="numbers-and-punctuation" // Teclado con números y signos
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* ── Campo: Teléfono ── */}
        <Text style={styles.label}>Teléfono *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={17} color={Colors.textLight} />
          <TextInput
            style={styles.input}
            placeholder="+57 300 000 0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad" // Teclado numérico para teléfono
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* ── Campo: Contraseña ── */}
        <Text style={styles.label}>Contraseña * (mín. 6 caracteres)</Text>
        <View style={styles.inputWrap}>
          <Ionicons
            name="lock-closed-outline"
            size={17}
            color={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Crea una contraseña segura"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass} // Oculta el texto según el estado
            autoCapitalize="none"
            placeholderTextColor={Colors.textMuted}
          />
          {/* Botón para alternar visibilidad de la contraseña */}
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"} // Icono cambia según el estado
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>

        {/* ── Indicador visual de fortaleza de contraseña ──
            Solo se renderiza si hay texto en el campo de contraseña */}
        {strength && (
          <View style={styles.strengthWrap}>
            {/* Barra de progreso con color y ancho dinámicos según la fortaleza */}
            <View style={styles.strengthBar}>
              <View
                style={[
                  styles.strengthFill,
                  {
                    width: strength.width as any,
                    backgroundColor: strength.color,
                  },
                ]}
              />
            </View>
            {/* Etiqueta textual de la fortaleza (ej: "Fuerte", "Débil") */}
            <Text style={[styles.strengthLabel, { color: strength.color }]}>
              {strength.label}
            </Text>
          </View>
        )}

        {/* ── Campo: Confirmar contraseña ──
            El borde se pone rojo si las contraseñas no coinciden */}
        <Text style={styles.label}>Confirmar contraseña *</Text>
        <View
          style={[
            styles.inputWrap,
            confirmPassword.length > 0 &&
              password !== confirmPassword &&
              styles.inputError, // Aplica estilo de error si hay texto y no coinciden
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={17}
            color={Colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPass}
            autoCapitalize="none"
            placeholderTextColor={Colors.textMuted}
          />
          {/* Botón para alternar visibilidad de la confirmación de contraseña */}
          <TouchableOpacity
            onPress={() => setShowConfirmPass(!showConfirmPass)}
          >
            <Ionicons
              name={showConfirmPass ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        </View>

        {/* Mensaje de error: las contraseñas no coinciden */}
        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text style={styles.errorHint}>⚠️ Las contraseñas no coinciden</Text>
        )}

        {/* Mensaje de éxito: las contraseñas coinciden y son válidas */}
        {confirmPassword.length > 0 &&
          password === confirmPassword &&
          password.length >= 6 && (
            <Text style={styles.successHint}>✅ Las contraseñas coinciden</Text>
          )}

        {/* ── Selector de preferencia de comida (Picker) ──
            Carga las categorías dinámicamente desde el archivo de datos */}
        <Text style={styles.label}>Preferencia de comida</Text>
        <View style={styles.pickerWrap}>
          <Ionicons
            name="restaurant-outline"
            size={17}
            color={Colors.textLight}
            style={{ marginLeft: 14 }}
          />
          <Picker
            selectedValue={foodPreference}
            onValueChange={setFoodPreference} // Actualiza el estado al cambiar la selección
            style={styles.picker}
          >
            {/* Genera un ítem por cada categoría disponible en CATEGORIES */}
            {CATEGORIES.map((c) => (
              <Picker.Item
                key={c.id}
                label={`${c.emoji} ${c.name}`} // Muestra emoji + nombre de la categoría
                value={c.name}
              />
            ))}
          </Picker>
        </View>

        {/* Nota informativa sobre los campos requeridos */}
        <Text style={styles.requiredNote}>* Campos obligatorios</Text>

        {/* ── Botón principal: Crear cuenta ──
            Se deshabilita visualmente y funcionalmente mientras carga */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]} // Estilo atenuado si está cargando
          onPress={handleRegister}
          disabled={loading} // Previene doble envío durante el proceso
        >
          <View style={styles.btnContent}>
            {/* El icono cambia a "sync" mientras se procesa el registro */}
            <Ionicons
              name={loading ? "sync" : "person-add-outline"}
              size={18}
              color="#fff"
            />
            <Text style={styles.btnTxt}>
              {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ── Enlace para ir a iniciar sesión ──
            Redirige a la pantalla anterior (que contiene el login) */}
        <TouchableOpacity onPress={() => router.back()} style={styles.linkRow}>
          <Text style={styles.linkTxt}>
            ¿Ya tienes cuenta? <Text style={styles.link}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>

        {/* Espaciado inferior para evitar que el contenido quede pegado al fondo */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ESTILOS

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Relleno interno del scroll y espacio extra al fondo para el teclado
  content: { padding: 24, paddingBottom: 48 },

  // Fila del encabezado: botón atrás + logo centrado
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 44, // Espacio para el notch/barra de estado
    marginBottom: 24,
  },
  backBtn: { padding: 4, marginRight: 12 },

  // Área del logo: centrada compensando el botón atrás con paddingRight
  logoArea: { flex: 1, alignItems: "center", paddingRight: 34 },
  logoText: {
    fontSize: 38,
    fontFamily: "Inter_800ExtraBold",
    fontStyle: "italic",
    color: Colors.primary,
    letterSpacing: -1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  sub: { fontSize: 14, color: Colors.textLight, marginBottom: 20 },

  // Etiqueta de cada campo del formulario
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 7,
    marginTop: 14,
  },

  // Contenedor de cada campo de texto (ícono + input)
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: "transparent", // Sin borde por defecto (cambia en error)
  },

  // Estilo de error aplicado al contenedor cuando las contraseñas no coinciden
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF0EE" },

  input: { flex: 1, fontSize: 15, color: Colors.text },

  // Contenedor de la barra de fortaleza de contraseña
  strengthWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },

  // Fondo gris de la barra de fortaleza (contenedor completo)
  strengthBar: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: "hidden", // Recorta el relleno para que respete el borderRadius
  },

  // Relleno dinámico de la barra (ancho y color cambian según fortaleza)
  strengthFill: { height: "100%", borderRadius: 3 },

  strengthLabel: {
    fontSize: 12,
    fontWeight: "700",
    minWidth: 60,
    textAlign: "right",
  },

  // Mensajes de validación en tiempo real bajo el campo de confirmación
  errorHint: { fontSize: 12, color: "#FF3B30", marginTop: 5, marginLeft: 4 },
  successHint: { fontSize: 12, color: "#34C759", marginTop: 5, marginLeft: 4 },

  // Contenedor del Picker de preferencia de comida
  pickerWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundGray,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    overflow: "hidden",
  },
  picker: { flex: 1, height: 50 },

  requiredNote: { fontSize: 12, color: Colors.textMuted, marginTop: 16 },

  // Botón principal de registro
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    elevation: 4, // Sombra en Android
  },

  // Reduce la opacidad del botón cuando está en estado de carga
  btnDisabled: { opacity: 0.65 },

  btnContent: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Fila del enlace "¿Ya tienes cuenta?"
  linkRow: { marginTop: 20, alignItems: "center" },
  linkTxt: { fontSize: 14, color: Colors.textLight },
  link: { color: Colors.primary, fontWeight: "700" },
});
