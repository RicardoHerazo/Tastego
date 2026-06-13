# 🍽️ TasteGo

Aplicación móvil desarrollada en **React Native con Expo** para el descubrimiento de restaurantes típicos del departamento de Sucre, Colombia. Permite buscar restaurantes, ver menús, navegar hasta ellos con GPS, guardar favoritos y visualizar platos en realidad aumentada.

---

## 📱 Características principales

- 🎬 Splash animado y onboarding de bienvenida
- 🔐 Registro e inicio de sesión con autenticación real (AsyncStorage)
- 🏠 Pantalla de inicio con restaurantes destacados y categorías
- 🔍 Búsqueda por restaurante y por plato
- ❤️ Sistema de favoritos persistente
- 🗺️ Mapa interactivo con OpenStreetMap + Leaflet (gratuito, sin API key)
- 📍 Distancia y tiempo de entrega calculados con GPS real (fórmula Haversine)
- 🚗 Navegación GPS hacia el restaurante (Google Maps / Apple Maps)
- 📷 Vista de platos en Realidad Aumentada (expo-camera)
- 👤 Perfil de usuario editable con cambio de contraseña
- 🔔 Sistema de notificaciones

---

## 🏗️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React Native + Expo | Framework principal |
| Expo Router | Navegación basada en archivos |
| TypeScript | Tipado estático |
| AsyncStorage | Persistencia de datos local |
| Leaflet + OpenStreetMap | Mapa interactivo gratuito |
| expo-location | GPS y cálculo de distancia real |
| expo-camera | Vista de realidad aumentada |
| react-native-webview | Renderizado del mapa |
| Inter (Google Fonts) | Tipografía principal |

---

## 📁 Estructura del proyecto

---

## 🗺️ Restaurantes reales incluidos

| Restaurante | Dirección | Teléfono |
|---|---|---|
| Llanera La 31 ✅ | Cl. 31 #14-219, Nuevo México | +57 301 5120013 |
| Pardo Gastro Bar ✅ | Cra. 28A #23B-13, La Toscana | +57 304 3393333 |
| Rancho Grande ✅ | Cl. 36 #34-366, Rancho Grande | +57 301 7541553 |

---

## ⚙️ Instalación y ejecución

### Requisitos previos

- Node.js instalado (v18 o superior)
- Expo Go instalado en tu celular Android o iOS
- Git instalado

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/RicardoHerazo/Tastego.git
cd Tastego
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Instalar dependencias de Expo**
```bash
npx expo install expo-location expo-camera react-native-webview @react-native-async-storage/async-storage @react-native-picker/picker @expo-google-fonts/inter expo-font
```

**4. Ejecutar el proyecto**
```bash
npx expo start
```

**5. Abrir en el celular**

Escanea el código QR que aparece en la terminal con la app **Expo Go** disponible en:
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 🗄️ Persistencia de datos

La app usa **AsyncStorage** para guardar localmente en el dispositivo:

| Clave | Contenido |
|---|---|
| `tastego_users` | Lista de usuarios registrados |
| `tastego_session` | Sesión activa del usuario |
| `tastego_favs` | Restaurantes favoritos |

---

## 👨‍💻 Desarrollado por

**Ricardo Herazo**
Ingeniería de Sistemas
2026