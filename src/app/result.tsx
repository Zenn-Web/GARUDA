import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Status = 'SCAM' | 'AMAN';

const STATUS_STYLE = {
  SCAM: {
    cardClassName: 'bg-danger-container',
    borderColor: '#EF4444',
    iconColor: '#EF4444',
    icon: 'shield-alert' as const,
    label: 'BAHAYA',
    labelClassName: 'text-on-error-container',
    tip: 'Jangan klik link, jangan bagikan OTP/PIN/password ke siapa pun. Hubungi bank resmi lewat aplikasi atau nomor resmi kalau ragu.',
    showCatatan: true,
  },
  AMAN: {
    cardClassName: 'bg-safe-container',
    borderColor: '#10B981',
    iconColor: '#10B981',
    icon: 'check-decagram' as const,
    label: 'AMAN',
    labelClassName: 'text-on-surface',
    tip: 'Model tidak menemukan pola credential phishing pada pesan ini. Tetap berhati-hati kalau ada permintaan data pribadi.',
    showCatatan: false,
  },
} satisfies Record<
  Status,
  {
    cardClassName: string;
    borderColor: string;
    iconColor: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    label: string;
    labelClassName: string;
    tip: string;
    showCatatan: boolean;
  }
>;

const ARTIKEL_DUMMY = [
  {
    sumber: 'OJK.go.id',
    judul: 'Waspada Modus Phishing Mengatasnamakan Bank Lewat WhatsApp',
    snippet:
      'OJK mengimbau masyarakat tidak mengklik tautan dari pesan tak dikenal yang mengaku dari pihak bank.',
    url: 'https://ojk.go.id',
  },
  {
    sumber: 'Komdigi.go.id',
    judul: 'Kenali Ciri-Ciri Pesan Penipuan Berkedok Undian Berhadiah',
    snippet: 'Komdigi mencatat ribuan laporan modus serupa dalam sebulan terakhir.',
    url: 'https://komdigi.go.id',
  },
];

export default function ResultScreen() {
  const { status: statusParam, confidence } = useLocalSearchParams<{
    status: string;
    confidence: string;
  }>();
  const status: Status = statusParam === 'SCAM' ? 'SCAM' : 'AMAN';
  const s = STATUS_STYLE[status];

  const [beritaTerbuka, setBeritaTerbuka] = useState(false);
  const [beritaOnline, setBeritaOnline] = useState<boolean | null>(null);
  const [mengecekBerita, setMengecekBerita] = useState(false);

  const cekBerita = async () => {
    setBeritaTerbuka(true);
    setMengecekBerita(true);
    try {
      const controller = new AbortController();
    
      const timeout = setTimeout(() => controller.abort(), 5000);
      await fetch('https://www.google.com/generate_204', { signal: controller.signal });
      clearTimeout(timeout);
      setBeritaOnline(true);
    } catch {
      setBeritaOnline(false);
    } finally {
      setMengecekBerita(false);
    }
  };

  const toggleBerita = () => {
    if (beritaTerbuka) {
      setBeritaTerbuka(false);
      return;
    }
    cekBerita();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="h-touch-target-min flex-row items-center gap-2 bg-surface px-margin-mobile">
        <MaterialCommunityIcons name="shield-account" size={28} color="#003527" />
        <Text className="font-headline-lg text-headline-md text-primary">GARUDA</Text>
      </View>

      <ScrollView contentContainerClassName="px-margin-mobile py-stack-lg" className="flex-1">
        <View
          className={`rounded-xl p-6 mb-stack-lg ${s.cardClassName}`}
          style={{ borderTopWidth: 6, borderTopColor: s.borderColor }}
        >
          <View className="flex-row items-center gap-3 mb-stack-sm">
            <MaterialCommunityIcons name={s.icon} size={40} color={s.iconColor} />
            <Text className={`font-headline-lg text-headline-lg ${s.labelClassName}`}>{s.label}</Text>
          </View>

          <Text className="font-body-md text-on-surface-variant mb-stack-md">
            Tingkat keyakinan: {confidence}%
          </Text>

          <Text className="font-body-lg text-on-surface leading-relaxed">{s.tip}</Text>

          {s.showCatatan && (
            <View className="mt-stack-md border-t border-outline-variant pt-stack-md">
              <Text className="font-label-lg text-label-lg text-on-surface-variant mb-1">Catatan</Text>
              <Text className="font-body-md text-on-surface-variant leading-relaxed">
                Meski terdeteksi berisiko, kalau kamu yakin pesan ini dari sumber resmi yang kamu
                ikuti sendiri, jangan klik link di pesan ini. Buka langsung aplikasi resminya untuk
                mengecek klaim — bukan lewat link yang dikirim.
              </Text>
            </View>
          )}
        </View>

        <View className="gap-stack-md">
          <TouchableOpacity
            className="h-touch-target-min flex-row items-center justify-center gap-2 rounded-xl border-2 border-primary bg-surface"
            activeOpacity={0.85}
            onPress={() => Alert.alert('Guardian', 'Fitur berbagi ke Guardian segera hadir.')}
          >
            <MaterialCommunityIcons name="human-male-female-child" size={22} color="#003527" />
            <Text className="font-button text-button text-primary">Bagikan ke Guardian</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="h-touch-target-min flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-low"
            activeOpacity={0.85}
            onPress={toggleBerita}
          >
            <MaterialCommunityIcons name="newspaper" size={22} color="#191c1d" />
            <Text className="font-button text-button text-on-surface">
              Lihat Ringkasan &amp; Berita Terkait
            </Text>
          </TouchableOpacity>
        </View>

        {beritaTerbuka && !mengecekBerita && beritaOnline && (
          <View className="mt-stack-lg gap-stack-sm">
            <Text className="font-label-lg text-label-lg text-on-surface-variant px-1">
              Kasus serupa yang pernah diberitakan
            </Text>
            {ARTIKEL_DUMMY.map((artikel) => (
              <TouchableOpacity
                key={artikel.sumber}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5"
                activeOpacity={0.85}
                onPress={() => Linking.openURL(artikel.url)}
              >
                <Text className="font-label-lg text-label-lg text-primary mb-1">{artikel.sumber}</Text>
                <Text className="font-body-md text-on-surface font-semibold mb-1">{artikel.judul}</Text>
                <Text className="font-body-md text-on-surface-variant text-sm">{artikel.snippet}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {beritaTerbuka && !mengecekBerita && beritaOnline === false && (
          <View className="mt-stack-lg flex-row items-center gap-3 rounded-xl bg-surface-container-low p-5">
            <MaterialCommunityIcons name="wifi-off" size={22} color="#404944" />
            <Text className="flex-1 font-body-md text-on-surface-variant">
              Butuh koneksi internet untuk memuat berita terkait.{' '}
              <Text className="font-semibold text-primary" onPress={cekBerita}>
                Coba lagi
              </Text>
            </Text>
          </View>
        )}

        <Text className="font-label-lg text-label-lg text-on-surface-variant text-center mt-stack-lg px-4">
          GARUDA membantu mengenali pola pesan mencurigakan, tapi hasilnya adalah indikasi — bukan
          kepastian mutlak. Tetap verifikasi lewat aplikasi/nomor resmi kalau ragu.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
