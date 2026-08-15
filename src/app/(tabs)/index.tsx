import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  AppState,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { deteksiScam } from '@/model/GarudaBrain';
import { koreksiDomainResmi } from '@/utils/domainResmi';
import { kategorikanPesan } from '@/utils/kategorisasi';

type HasilDeteksi = {
  status: 'SCAM' | 'AMAN';
  confidence: number;
};

export default function HomeScreen() {
  const { reset } = useLocalSearchParams<{ reset?: string }>();
  // key={reset} remounts HomeContent dari nol saat "Periksa Pesan Lain" ditekan —
  // useState('') sudah cukup buat reset, tanpa perlu effect + setState tambahan
  // (setState sinkron di dalam effect memicu render dobel yang tidak perlu).
  return <HomeContent key={reset ?? 'initial'} />;
}

function HomeContent() {
  const [teks, setTeks] = useState('');
  const clipboardTerakhir = useRef('');

  const cekPesan = () => {
    if (!teks.trim()) return;
    const hasilDeteksi = koreksiDomainResmi(teks, deteksiScam(teks) as HasilDeteksi);
    const kategori = kategorikanPesan(teks);
    router.push({
      pathname: '/result',
      params: { status: hasilDeteksi.status, kategori },
    });
  };

  const cekClipboard = async () => {
    const isiClipboard = await Clipboard.getStringAsync();
    if (isiClipboard && isiClipboard !== clipboardTerakhir.current) {
      clipboardTerakhir.current = isiClipboard;
      setTeks(isiClipboard);
    }
  };

  useEffect(() => {
    cekClipboard();

    const listener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        cekClipboard();
      }
    });

    return () => listener.remove();
  }, []);

  const tempelDariClipboard = async () => {
    const isiClipboard = await Clipboard.getStringAsync();
    if (isiClipboard) {
      clipboardTerakhir.current = isiClipboard;
      setTeks(isiClipboard);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>GARUDA</Text>
        </View>

        <Text style={styles.judul}>Periksa Pesan</Text>

        <Text style={styles.instruksi}>
          Salin pesan mencurigakan, lalu buka GARUDA. Kamu juga bisa menempel atau mengetik pesan
          secara manual.
        </Text>

        <Text style={styles.clipboardInfo}>
          Pesan yang Anda salin akan otomatis muncul di kolom di bawah.
        </Text>

        <View style={styles.kartuInput}>
          <View style={styles.labelInputRow}>
            <Text style={styles.labelInput}>Pesan yang ingin diperiksa</Text>
            <TouchableOpacity onPress={tempelDariClipboard} activeOpacity={0.7}>
              <View style={styles.tombolTempel}>
                <MaterialCommunityIcons name="content-paste" size={16} color="#084732" />
                <Text style={styles.tombolTempelText}>Tempel</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            multiline
            placeholder="Tempel atau ketik pesan di sini..."
            value={teks}
            onChangeText={setTeks}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.tombolUtama} onPress={cekPesan} activeOpacity={0.8}>
          <Text style={styles.tombolUtamaText}>Periksa Pesan Ini</Text>
        </TouchableOpacity>

        <View style={styles.kotakPrivasi}>
          <MaterialCommunityIcons name="cellphone-lock" size={20} color="#1D4ED8" />
          <Text style={styles.kotakPrivasiText}>
            Pemeriksaan berlangsung di perangkat. Isi pesan tidak dikirim ke server untuk proses
            klasifikasi.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 24, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  headerLogo: { width: 28, height: 28 },
  headerText: { fontSize: 20, fontWeight: '700', color: '#084732' },
  judul: { fontSize: 28, fontWeight: '700', marginBottom: 12, color: '#191c1d' },
  instruksi: { fontSize: 18, lineHeight: 26, color: '#404944', marginBottom: 8 },
  clipboardInfo: { fontSize: 16, color: '#707974', marginBottom: 16 },
  kartuInput: {
    borderWidth: 1,
    borderColor: '#bfc9c3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  labelInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  labelInput: { fontSize: 16, fontWeight: '600', color: '#191c1d' },
  tombolTempel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tombolTempelText: { fontSize: 14, fontWeight: '600', color: '#084732' },
  input: {
    minHeight: 100,
    maxHeight: 240,
    fontSize: 18,
    textAlignVertical: 'top',
    color: '#000',
  },
  tombolUtama: {
    height: 56,
    backgroundColor: '#084732',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tombolUtamaText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  kotakPrivasi: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#EBF2FE',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  kotakPrivasiText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#1E3A8A' },
});
