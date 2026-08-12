import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { deteksiScam } from '@/model/GarudaBrain';

type HasilDeteksi = {
  status: 'SCAM' | 'AMAN';
  confidence: number;
};

export default function HomeScreen() {
  const [teks, setTeks] = useState('');

  const cekPesan = () => {
    if (!teks.trim()) return;
    const hasilDeteksi = deteksiScam(teks) as HasilDeteksi;
    router.push({
      pathname: '/result',
      params: {
        status: hasilDeteksi.status,
        confidence: String(hasilDeteksi.confidence),
      },
    });
  };

  const clipboardTerakhir = useRef('');

  useEffect(() => {
    const cekClipboard = async () => {
      const isiClipboard = await Clipboard.getStringAsync();
      if (isiClipboard && isiClipboard !== clipboardTerakhir.current) {
        clipboardTerakhir.current = isiClipboard;
        setTeks(isiClipboard);
      }
    };

    const listener = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        cekClipboard();
      }
    });

    return () => listener.remove();
  }, []);

  return (
    <ThemedView style={styles.container} lightColor="#f8f9fa">
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.judul}>
          GARUDA
        </ThemedText>

        <TextInput
          multiline
          placeholder="Tempel atau ketik pesan yang mau dicek"
          value={teks}
          onChangeText={setTeks}
          style={styles.input}
        />

        <TouchableOpacity style={styles.tombolUtama} onPress={cekPesan} activeOpacity={0.8}>
          <Text style={styles.tombolUtamaText}>Cek Pesan Ini</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 20 },
  judul: { fontSize: 28, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#bfc9c3',
    minHeight: 100,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  tombolUtama: {
    height: 56,
    backgroundColor: '#003527',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolUtamaText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});

