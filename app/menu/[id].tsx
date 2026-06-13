import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { restaurants } from '../../data/restaurants';

export default function MenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const r = restaurants.find((x) => x.id === id);
  if (!r) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Menú 🍽️</Text>
          <Text style={styles.sub}>{r.name}</Text>
        </View>
      </View>
      <FlatList
        data={r.menu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.img} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                {item.isTypical && <View style={styles.badge}><Text style={styles.badgeTxt}>🌿 Típico</Text></View>}
              </View>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              {item.calories && <Text style={styles.calories}>🔥 {item.calories} cal</Text>}
              <View style={styles.footer}>
                <Text style={styles.price}>${item.price.toLocaleString()}</Text>
                <TouchableOpacity style={styles.arBtn} onPress={() => router.push(`/ar/${item.id}`)}>
                  <Ionicons name="camera" size={14} color="#fff" />
                  <Text style={styles.arTxt}>Ver en AR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundGray },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', padding: 20, paddingTop: 52 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text },
  sub: { fontSize: 13, color: Colors.textLight },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 2 },
  img: { width: '100%', height: 160 },
  info: { padding: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  badge: { backgroundColor: Colors.warning + '25', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeTxt: { fontSize: 11, color: Colors.warning, fontWeight: '700' },
  desc: { fontSize: 13, color: Colors.textLight, lineHeight: 18, marginBottom: 6 },
  calories: { fontSize: 12, color: Colors.textLight, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  arBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  arTxt: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
