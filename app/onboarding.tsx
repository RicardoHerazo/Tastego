import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const slides = [
  { id: '1', title: 'Descubre los sabores\nque te rodean', body: 'Encuentra los mejores restaurantes típicos de Sucre cerca de ti.', emoji: '🗺️' },
  { id: '2', title: 'Una nueva forma de\ndisfrutar la comida', body: 'Visualiza tus platos favoritos en realidad aumentada antes de ordenar.', emoji: '✨' },
  { id: '3', title: 'Pide, rastrea\ny disfruta', body: 'Ordena desde tu restaurante favorito y sigue tu pedido en tiempo real.', emoji: '🛵' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (current < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.emojiCircle}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnTxt}>{current === slides.length - 1 ? 'Comenzar' : 'Continuar'}</Text>
      </TouchableOpacity>
      {current < slides.length - 1 && (
        <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.skip}>
          <Text style={styles.skipTxt}>Omitir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  slide: { width, alignItems: 'center', paddingHorizontal: 40, paddingTop: 40 },
  emojiCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 44 },
  emoji: { fontSize: 68 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 16, lineHeight: 34 },
  body: { fontSize: 15, color: Colors.textLight, textAlign: 'center', lineHeight: 23 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  btn: { backgroundColor: Colors.primary, borderRadius: 30, paddingVertical: 16, paddingHorizontal: 80, marginBottom: 16, elevation: 4 },
  btnTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skip: { padding: 12 },
  skipTxt: { color: Colors.textLight, fontSize: 14 },
});
