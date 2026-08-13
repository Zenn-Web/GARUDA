import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import knowledgeBase from '@/data/knowledgeBase.json';

type Status = 'SCAM' | 'AMAN';
type Kategori = keyof typeof knowledgeBase.kategori;

const STATUS_STYLE = {
  SCAM: {
    cardClassName: 'bg-danger-container',
    borderColor: '#D11F21',
    iconColor: '#D11F21',
    icon: 'alert-circle' as const,
    label: 'BAHAYA',
    labelClassName: 'text-on-error-container',
    kalimat:
      'Pesan menunjukkan pola berbahaya yang perlu dihentikan sebelum kamu melakukan tindakan apa pun.',
  },
  AMAN: {
    cardClassName: 'bg-safe-container',
    borderColor: '#12793C',
    iconColor: '#12793C',
    icon: 'check-circle' as const,
    label: 'AMAN',
    labelClassName: 'text-on-surface',
    kalimat: 'Tidak ditemukan indikasi pesan berbahaya dari pola yang dikenali GARUDA.',
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
    kalimat: string;
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
  const { status: statusParam, kategori: kategoriParam } = useLocalSearchParams<{
    status: string;
    kategori: string;
  }>();
  const status: Status = statusParam === 'SCAM' ? 'SCAM' : 'AMAN';
  const s = STATUS_STYLE[status];
  const kategori: Kategori =
    kategoriParam && kategoriParam in knowledgeBase.kategori
      ? (kategoriParam as Kategori)
      : 'umum';
  const dataKategori = knowledgeBase.kategori[kategori];

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

  const periksaPesanLain = () => {
    router.dismissTo({ pathname: '/', params: { reset: String(Date.now()) } });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="h-touch-target-min flex-row items-center gap-2 bg-surface px-margin-mobile">
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={{ width: 28, height: 28 }}
          resizeMode="contain"
        />
        <Text className="font-headline-lg text-headline-md text-primary">Hasil Pemeriksaan</Text>
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

          <Text className="font-body-lg text-on-surface leading-relaxed">{s.kalimat}</Text>
        </View>

        {status === 'AMAN' && (
          <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 mb-stack-lg">
            <Text className="font-label-lg text-label-lg text-on-surface mb-1">
              Tetap berhati-hati
            </Text>
            <Text className="font-body-md text-on-surface-variant leading-relaxed">
              Jangan berikan OTP, PIN, password, atau data pribadi jika pesan tiba-tiba
              memintanya.
            </Text>
          </View>
        )}

        {status === 'SCAM' && (
          <>
            <View className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 mb-stack-lg">
              <Text className="font-label-lg text-label-lg text-on-surface mb-stack-sm">
                Indikasi yang dikenali
              </Text>
              {dataKategori.indikasi.map((baris) => (
                <View key={baris} className="flex-row gap-2 mb-1">
                  <Text className="font-body-md text-on-surface-variant">{'•'}</Text>
                  <Text className="flex-1 font-body-md text-on-surface-variant leading-relaxed">
                    {baris}
                  </Text>
                </View>
              ))}
            </View>

            <View className="rounded-xl bg-warning-container p-5 mb-stack-lg">
              <Text className="font-label-lg text-label-lg text-on-surface mb-stack-sm">
                Lakukan ini sekarang
              </Text>
              {dataKategori.tindakan.map((baris, index) => (
                <View key={baris} className="flex-row gap-2 mb-1">
                  <Text className="font-body-md text-on-surface-variant">{index + 1}.</Text>
                  <Text className="flex-1 font-body-md text-on-surface-variant leading-relaxed">
                    {baris}
                  </Text>
                </View>
              ))}
              <View className="mt-stack-sm border-t border-outline-variant pt-stack-sm">
                {Object.values(knowledgeBase.kontak_resmi).map((kontak) => (
                  <Text
                    key={kontak}
                    className="font-body-md text-on-surface-variant leading-relaxed"
                  >
                    {kontak}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          className="h-touch-target-min flex-row items-center justify-center gap-2 rounded-xl bg-primary mb-stack-md"
          activeOpacity={0.85}
          onPress={periksaPesanLain}
        >
          <Text className="font-button text-button text-on-primary">Periksa Pesan Lain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-touch-target-min flex-row items-center justify-center gap-2 rounded-xl bg-surface-container-low mb-stack-lg"
          activeOpacity={0.85}
          onPress={toggleBerita}
        >
          <MaterialCommunityIcons name="newspaper" size={22} color="#191c1d" />
          <Text className="font-button text-button text-on-surface">
            Lihat Ringkasan &amp; Berita Terkait
          </Text>
        </TouchableOpacity>

        {beritaTerbuka && !mengecekBerita && beritaOnline && (
          <View className="mb-stack-lg gap-stack-sm">
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
          <View className="mb-stack-lg flex-row items-center gap-3 rounded-xl bg-surface-container-low p-5">
            <MaterialCommunityIcons name="wifi-off" size={22} color="#404944" />
            <Text className="flex-1 font-body-md text-on-surface-variant">
              Butuh koneksi internet untuk memuat berita terkait.{' '}
              <Text className="font-semibold text-primary" onPress={cekBerita}>
                Coba lagi
              </Text>
            </Text>
          </View>
        )}

        <View className="flex-row gap-3 rounded-xl bg-info-container p-5">
          <MaterialCommunityIcons name="information" size={22} color="#1D4ED8" />
          <Text className="flex-1 font-body-md text-on-surface-variant leading-relaxed">
            GARUDA membantu mengenali pola pesan mencurigakan, bukan memastikan keaslian pengirim
            atau website.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
