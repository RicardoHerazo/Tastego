import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, changePassword, logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [saving, setSaving] = useState(false);

  // Campos de perfil
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthdate, setBirthdate] = useState(user?.birthdate ?? "");
  const [foodPreference, setFoodPreference] = useState(
    user?.foodPreference ?? "Todos",
  );

  // Cambio de contraseña
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim() || !phone.trim())
      return Alert.alert(
        "❌ Error",
        "Nombre, correo y teléfono son obligatorios.",
      );
    setSaving(true);
    await updateProfile({ name, email, phone, birthdate, foodPreference });
    setSaving(false);
    setEditing(false);
    Alert.alert(
      "✅ Perfil actualizado",
      "Tus datos fueron guardados correctamente.",
    );
  };

  const handleChangePassword = async () => {
    if (!newPass.trim())
      return Alert.alert("❌ Error", "Ingresa la nueva contraseña.");
    if (newPass.length < 6)
      return Alert.alert(
        "❌ Error",
        "La contraseña debe tener al menos 6 caracteres.",
      );
    if (newPass !== confirmPass)
      return Alert.alert("❌ Error", "Las contraseñas no coinciden.");
    setSaving(true);
    const result = await changePassword(currentPass, newPass);
    setSaving(false);
    if (result.success) {
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setShowChangePass(false);
      Alert.alert(
        "✅ Contraseña cambiada",
        "Tu contraseña fue actualizada exitosamente.",
      );
    } else {
      Alert.alert("❌ Error", result.error ?? "Error al cambiar contraseña.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity
              onPress={() => setEditing(!editing)}
              style={styles.editBtn}
            >
              <Ionicons
                name={editing ? "close" : "pencil"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <Text style={styles.avatarName}>{user?.name}</Text>
            <Text style={styles.avatarEmail}>{user?.email}</Text>
            <View style={styles.prefBadge}>
              <Text style={styles.prefBadgeTxt}>🍴 {user?.foodPreference}</Text>
            </View>
          </View>

          {/* Información del perfil */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Información personal</Text>

            <View style={styles.card}>
              {[
                {
                  label: "Nombre completo",
                  value: name,
                  setter: setName,
                  icon: "person-outline",
                  keyboard: "default" as const,
                },
                {
                  label: "Correo electrónico",
                  value: email,
                  setter: setEmail,
                  icon: "mail-outline",
                  keyboard: "email-address" as const,
                },
                {
                  label: "Teléfono",
                  value: phone,
                  setter: setPhone,
                  icon: "call-outline",
                  keyboard: "phone-pad" as const,
                },
                {
                  label: "Fecha de nacimiento",
                  value: birthdate,
                  setter: setBirthdate,
                  icon: "calendar-outline",
                  keyboard: "default" as const,
                },
              ].map((field) => (
                <View key={field.label} style={styles.fieldRow}>
                  <Ionicons
                    name={field.icon as any}
                    size={18}
                    color={Colors.primary}
                    style={styles.fieldIcon}
                  />
                  <View style={styles.fieldContent}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    {editing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={field.value}
                        onChangeText={field.setter}
                        keyboardType={field.keyboard}
                        autoCapitalize="none"
                        placeholderTextColor={Colors.textMuted}
                      />
                    ) : (
                      <Text style={styles.fieldValue}>
                        {field.value || "—"}
                      </Text>
                    )}
                  </View>
                </View>
              ))}

              {/* Preferencia de comida */}
              <View style={styles.fieldRow}>
                <Ionicons
                  name="restaurant-outline"
                  size={18}
                  color={Colors.primary}
                  style={styles.fieldIcon}
                />
                <View style={styles.fieldContent}>
                  <Text style={styles.fieldLabel}>Preferencia de comida</Text>
                  {editing ? (
                    <View style={styles.pickerWrap}>
                      <Picker
                        selectedValue={foodPreference}
                        onValueChange={setFoodPreference}
                        style={styles.picker}
                      >
                        {CATEGORIES.map((c) => (
                          <Picker.Item
                            key={c.id}
                            label={`${c.emoji} ${c.name}`}
                            value={c.name}
                          />
                        ))}
                      </Picker>
                    </View>
                  ) : (
                    <Text style={styles.fieldValue}>{foodPreference}</Text>
                  )}
                </View>
              </View>
            </View>

            {editing && (
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.saveBtnTxt}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cambio de contraseña */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionToggle}
              onPress={() => setShowChangePass(!showChangePass)}
            >
              <Text style={styles.sectionTitle}>🔒 Cambiar contraseña</Text>
              <Ionicons
                name={showChangePass ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>

            {showChangePass && (
              <View style={styles.card}>
                {[
                  {
                    label: "Contraseña actual",
                    value: currentPass,
                    setter: setCurrentPass,
                    show: showCurrentPass,
                    toggleShow: () => setShowCurrentPass(!showCurrentPass),
                  },
                  {
                    label: "Nueva contraseña",
                    value: newPass,
                    setter: setNewPass,
                    show: showNewPass,
                    toggleShow: () => setShowNewPass(!showNewPass),
                  },
                  {
                    label: "Confirmar nueva contraseña",
                    value: confirmPass,
                    setter: setConfirmPass,
                    show: showNewPass,
                    toggleShow: () => setShowNewPass(!showNewPass),
                  },
                ].map((field) => (
                  <View key={field.label} style={styles.passField}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <View style={styles.passInputRow}>
                      <TextInput
                        style={styles.passInput}
                        value={field.value}
                        onChangeText={field.setter}
                        secureTextEntry={!field.show}
                        placeholder="••••••••"
                        placeholderTextColor={Colors.textMuted}
                      />
                      <TouchableOpacity onPress={field.toggleShow}>
                        <Ionicons
                          name={field.show ? "eye-off" : "eye"}
                          size={20}
                          color={Colors.textLight}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.changePassBtn, saving && { opacity: 0.7 }]}
                  onPress={handleChangePassword}
                  disabled={saving}
                >
                  <Ionicons name="lock-closed" size={18} color="#fff" />
                  <Text style={styles.changePassBtnTxt}>
                    {saving ? "Cambiando..." : "Cambiar contraseña"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Cerrar sesión */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.logoutTxt}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  editBtn: { padding: 4 },
  avatarSection: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingBottom: 28,
    paddingTop: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 44 },
  avatarName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  avatarEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 10,
  },
  prefBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  prefBadgeTxt: { color: "#fff", fontSize: 13, fontWeight: "600" },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 12,
  },
  sectionToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  fieldIcon: { marginRight: 12 },
  fieldContent: { flex: 1 },
  fieldLabel: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: { fontSize: 15, color: Colors.text, fontWeight: "500" },
  fieldInput: {
    fontSize: 15,
    color: Colors.text,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primary,
    paddingVertical: 4,
  },
  pickerWrap: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 4,
  },
  picker: { height: 44 },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 14,
    elevation: 4,
  },
  saveBtnTxt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  passField: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  passInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.primary,
    marginTop: 6,
  },
  passInput: { flex: 1, fontSize: 15, color: Colors.text, paddingVertical: 6 },
  changePassBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    margin: 14,
  },
  changePassBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "700" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    elevation: 2,
  },
  logoutTxt: { color: Colors.primary, fontSize: 16, fontWeight: "700" },
});
