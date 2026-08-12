# GARUDA — Tutorial Coding Manual: UI Plain (Belajar Sendiri)

Tutorial ini buat kalian yang mau ngerjain sendiri, bukan lewat agentic AI. Tiap langkah
ada penjelasan **kenapa**, bukan cuma **apa** — biar paham konsepnya, bukan cuma
copy-paste. Kerjain berurutan, jangan loncat.

---

## Langkah 0 — Cek Kesiapan Project

Buka terminal di folder project (`D:\garuda-app` kalau di Windows), lalu jalankan:

```bash
npx expo --version
```

Kalau muncul nomor versi, project kalian sudah siap. Kalau error, berarti dependency
belum lengkap — jalankan `npm install` dulu sebelum lanjut.

---

## Langkah 1 — Install Package Clipboard

**Kenapa:** kita butuh cara buat baca isi clipboard HP (apa yang barusan di-copy user).
React Native nggak punya ini bawaan, jadi butuh package resmi dari Expo.

```bash
npx expo install expo-clipboard
```

Pakai `npx expo install` (bukan `npm install`) karena Expo otomatis milihin versi
package yang cocok sama versi Expo SDK kalian — kalau pakai `npm install` biasa,
risikonya dapat versi yang nggak kompatibel.

Setelah ini selesai, cek `package.json` — harusnya ada baris baru `"expo-clipboard": "..."`.

---

## Langkah 2 — Taruh Model ML di Tempatnya

**Kenapa:** kode aplikasi dan file model dipisah biar rapi — kalau nanti model di-retrain
lagi, kalian tinggal ganti satu file tanpa nyentuh kode UI.

1. Buat folder baru: `src/model/`
2. Copy file `GarudaBrain.js` (yang sudah di-retrain) ke dalam folder itu, jadi path-nya:
   `src/model/GarudaBrain.js`

Buka file itu sekilas, cari baris paling bawah — pastikan ada tulisan seperti ini
(nama fungsi yang akan kita pakai):

```js
export function deteksiScam(text) { ... }
```

Kalau nama fungsinya beda, catat nama aslinya karena kita akan panggil persis nama itu
di langkah berikutnya.

---

## Langkah 3 — Bikin Komponen Home Screen (Bagian Input)

**Kenapa dimulai dari sini:** ini titik paling inti — tanpa ini, seluruh aplikasi nggak
ada gunanya. Kita bangun paling dulu, baru nanti nambah clipboard-detection di atasnya.

Buat file baru: `src/screens/HomeScreen.jsx`

Ketik (jangan copy-paste dulu — ketik manual biar kebiasaan baca tiap barisnya):

```jsx
import { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { deteksiScam } from '../model/GarudaBrain';

export default function HomeScreen() {
  const [teks, setTeks] = useState('');
  const [hasil, setHasil] = useState(null);

  const cekPesan = () => {
    if (!teks.trim()) return;
    const hasilDeteksi = deteksiScam(teks);
    setHasil(hasilDeteksi);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>GARUDA</Text>

      <TextInput
        multiline
        placeholder="Tempel atau ketik pesan yang mau dicek"
        value={teks}
        onChangeText={setTeks}
        style={styles.input}
      />

      <Button title="Cek Pesan Ini" onPress={cekPesan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  judul: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 100,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});
```

**Penjelasan tiap bagian:**
- `useState('')` — nyimpen teks yang lagi diketik/ditempel user, `useState(null)` nyimpen
  hasil deteksi (awalnya kosong karena belum ada yang dicek)
- `cekPesan` — fungsi yang jalan pas tombol ditekan: cek dulu teksnya nggak kosong
  (`.trim()` buang spasi kosong), baru panggil `deteksiScam()` dari model
- `deteksiScam(teks)` — ini satu-satunya baris yang "nyambung" ke ML. Semua kerumitan
  TF-IDF/Logistic Regression udah dibungkus di dalam fungsi itu, kalian tinggal manggil

Simpan, lalu jalankan app-nya (`npx expo run:android` atau `npx expo start` kalau dev
client sudah ke-install) buat mastiin nggak ada error dulu sebelum lanjut.

---

## Langkah 4 — Tampilkan Hasil Deteksi

**Kenapa terpisah dari langkah 3:** biar kalian ngerti dulu alur input→proses jalan
sebelum nambah kerumitan tampilan hasil.

Tambahkan blok ini tepat di bawah `<Button .../>`, masih di dalam `<View style={styles.container}>`:

```jsx
      {hasil && (
        <View style={styles.hasilBox}>
          <Text style={[
            styles.label,
            { color: hasil.status === 'SCAM' ? '#c0392b' : '#27ae60' }
          ]}>
            {hasil.status === 'SCAM' ? 'BAHAYA' : 'AMAN'}
          </Text>

          <Text style={styles.confidence}>
            Confidence: {hasil.confidence}%
          </Text>

          {hasil.status === 'SCAM' && (
            <Text style={styles.tips}>
              Jangan klik link, jangan bagikan OTP/PIN/password ke siapa pun.
              Hubungi bank resmi lewat aplikasi atau nomor resmi kalau ragu.
            </Text>
          )}
        </View>
      )}
```

Dan tambahkan style barunya di dalam `StyleSheet.create({...})`:

```jsx
  hasilBox: { marginTop: 20 },
  label: { fontSize: 26, fontWeight: 'bold' },
  confidence: { fontSize: 14, color: '#666', marginTop: 4 },
  tips: { fontSize: 14, marginTop: 12, lineHeight: 20 },
```

**Penjelasan:**
- `{hasil && (...)}` — pola umum React: kalau `hasil` masih `null` (belum ada yang dicek),
  seluruh blok ini nggak dirender sama sekali. Begitu `hasil` terisi, blok ini muncul.
- `hasil.status === 'SCAM' ? 'BAHAYA' : 'AMAN'` — ternary, cara singkat nulis if/else buat
  milih teks yang ditampilkan
- Tips statis cuma muncul kalau statusnya SCAM — nggak perlu internet karena teksnya
  sudah tertulis langsung di kode, bukan diambil dari API

Coba jalankan, ketik pesan phishing (misal: *"Rekening BCA Anda akan diblokir, klik link
ini"*), tekan tombol, harusnya muncul BAHAYA warna merah + tips.

---

## Langkah 5 — Clipboard Detection

**Kenapa paling akhir:** ini fitur "bonus" di atas alur inti yang sudah jalan dari langkah
3-4. Kalau langkah ini gagal/rumit, app kalian tetap berfungsi penuh lewat input manual.

Tambahkan import di paling atas file (gabung dengan import yang sudah ada):

```jsx
import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import * as Clipboard from 'expo-clipboard';
```

Tambahkan kode ini di dalam komponen `HomeScreen`, sebelum `return (...)`:

```jsx
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
```

**Penjelasan:**
- `useRef('')` — dipakai buat "inget" clipboard terakhir yang udah dicek, TANPA bikin
  komponen re-render tiap kali diubah (beda sama `useState`, yang bikin komponen
  re-render tiap berubah)
- `AppState.addEventListener('change', ...)` — ini "pendengar" bawaan React Native yang
  ngasih tau kapan app pindah dari background ke foreground (`nextState === 'active'`)
  — persis momen yang kita mau: user abis copy pesan di WA, lalu buka GARUDA
- `return () => listener.remove()` — ini "cleanup", wajib ada supaya listener-nya
  dibersihin kalau komponennya di-unmount (kalau lupa, bisa bikin memory leak)
- Perhatikan: langkah ini **cuma ngisi teks ke `TextInput`**, belum otomatis nge-trigger
  `cekPesan()`. Ini keputusan desain sengaja — user tetap yang mutusin kapan mau cek,
  bukan otomatis dianalisis tanpa sepengetahuan mereka (lebih transparan buat Boomer)

Coba tes: copy teks apa aja di app lain (Notes, WhatsApp, dll), lalu buka GARUDA —
`TextInput` harusnya otomatis keisi teks yang barusan di-copy.

---

## Langkah 6 — Sambungkan ke App

Terakhir, pastikan `HomeScreen` ini benar-benar dipakai sebagai layar utama. Buka file
entry point kalian (biasanya `app/index.tsx` kalau pakai Expo Router), dan ganti isinya
supaya me-render `HomeScreen`:

```jsx
import HomeScreen from '../src/screens/HomeScreen';

export default function Index() {
  return <HomeScreen />;
}
```

(Sesuaikan path import `'../src/screens/HomeScreen'` kalau struktur folder kalian beda.)

---

## Checklist Belajar — Sebelum Lanjut ke Fitur Berikutnya

Jangan lanjut ke fitur lain (guardian, riwayat, dll) sebelum semua ini kalian pahami,
bukan cuma "jalan":

- [ ] Saya paham kenapa `useState` dipakai untuk `teks` dan `hasil`, tapi `useRef` untuk clipboard terakhir
- [ ] Saya bisa jelasin ke orang lain apa yang terjadi saat tombol "Cek Pesan Ini" ditekan, dari awal sampai akhir
- [ ] Saya paham kenapa `deteksiScam()` bisa dipanggil langsung tanpa `await`/`async` (karena murni hitungan matematika di JS, bukan network call)
- [ ] App bisa jalan di HP fisik tanpa error lewat `npx expo run:android`

Kalau ada baris yang error atau nggak jelas kenapa, tempel error-nya ke sini — aku bantu
telusuri bareng, bukan langsung kasih fix-nya doang.
