import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(circleScale, {
        toValue: 20,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => router.replace("/onboarding"), 100);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.circle, { transform: [{ scale: circleScale }] }]}
      />
      <Animated.Text style={[styles.logo, { opacity, transform: [{ scale }] }]}>
        Tg.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  logo: {
    fontSize: 52,
    fontFamily: "Inter_800ExtraBold",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: -1,
  },
});
