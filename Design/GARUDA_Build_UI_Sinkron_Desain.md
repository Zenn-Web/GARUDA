# GARUDA — Build Spec v2: Sinkron dengan Desain Stitch

Dokumen ini **menggantikan** `GARUDA_Build_UI_Plain.md`. Bedanya: versi itu sengaja
"plain" (styling default) karena desain final belum ada. Sekarang desainnya **sudah
ada** (dibuat teman kalian via Stitch, file `DESIGN.md` + `code.html` + `screen.png`),
jadi build selanjutnya harus pakai token desain itu langsung — bukan lagi placeholder.

## Sumber Kebenaran Desain (Design Source of Truth)

Tiga file ini adalah acuan visual, **jangan menyimpang** dari token yang sudah
ditentukan (warna, font, spacing, radius):

- `DESIGN.md` — spesifikasi lengkap: warna, tipografi, spacing, komponen
- `code.html` — implementasi nyata layar Onboarding, sekaligus referensi konfigurasi
  Tailwind (`tailwind.config`) yang harus dipakai konsisten di semua layar lain
- `GARUDA_Mockup_Result_BeritaTerkait.html` — mockup baru yang aku buat, pakai
  `tailwind.config` **persis sama** dengan punya `code.html`, buat layar Result +
  Berita Terkait (dua state: AMAN dan BAHAYA, toggle pakai tombol "Ganti contoh" di
  kanan atas). **Buka file ini langsung di browser** buat lihat visualisasinya hidup,
  atau buka di code editor buat lihat strukturnya.

Poin desain yang sudah dikonfirmasi konsisten antara desainer dan keputusan produk
sebelumnya (jadi tidak perlu didiskusikan ulang):
- Guardian bersifat **opsional** — sudah tertulis eksplisit di `code.html`:
  *"Dukungan keluarga bersifat opsional. Anda bisa menggunakan GARUDA sendiri."*
- Warna status: **Safe `#10B981`**, **Warning `#F59E0B`**, **Danger `#EF4444`** — pakai
  token `danger-container`/`safe-container` untuk background card (sudah didefinisikan
  di mockup Result), bukan warna solid penuh, supaya kontras teks tetap terjaga.
- Font **Atkinson Hyperlegible Next**, minimum body text 18px — sudah diatur di
  `tailwind.config`, tinggal pakai class `font-body-md`/`text-body-lg` dst, jangan
  override manual.

## Wajib: Pakai NativeWind, Jangan Terjemahkan Manual ke StyleSheet

`code.html` dan `GARUDA_Mockup_Result_BeritaTerkait.html` itu HTML biasa untuk browser
— React Native **tidak bisa** merender tag HTML (`<div>`, `<button>`) atau class
Tailwind versi web secara langsung. Supaya `tailwind.config` yang sudah lengkap dari
desainer bisa dipakai ulang nyaris 1:1 (bukan ditulis ulang manual jadi
`StyleSheet.create({...})`, yang lebih lama dan rawan salah), project ini pakai
**NativeWind** (Tailwind CSS untuk React Native).

Setup (dijalankan sekali di awal):

```bash
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx tailwindcss init
```

Isi `tailwind.config.js` yang baru dibuat dengan **persis** blok `theme.extend` yang
ada di `<script id="tailwind-config">` pada `code.html` — colors, borderRadius,
spacing, fontFamily, fontSize semuanya disalin apa adanya, bukan ditulis ulang dari
nol. Tambahkan juga:

```js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: { /* ...salin dari code.html... */ } },
};
```

**Koreksi penting (langkah ini kelewat di versi sebelumnya, tanpa ini NativeWind
TIDAK akan jalan):** tiga file lain wajib disiapkan juga —

1. Buat `global.css` di root project, isinya cuma 3 baris:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. `babel.config.js` — tambahkan preset `"nativewind/babel"`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

3. `metro.config.js` — bungkus config yang ada dengan `withNativeWind`:
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

4. Import `global.css` sekali di root layout (`app/_layout.tsx`):
```jsx
import "../global.css";
```

Setelah keempat file ini ada, **restart Metro bundler dari nol** (bukan cuma reload
biasa — matikan `npx expo start` sepenuhnya dan jalankan ulang) supaya Babel/Metro
config baru benar-benar terbaca.

Dengan setup ini, komponen React Native bisa pakai `className` yang nyaris sama
persis dengan HTML mockup:

```jsx
// Web (mockup):
// <button class="w-full h-touch-target-min bg-primary text-on-primary rounded-xl">

// React Native + NativeWind:
<TouchableOpacity className="w-full h-touch-target-min bg-primary rounded-xl items-center justify-center">
  <Text className="text-on-primary font-button text-button">Periksa Sekarang</Text>
</TouchableOpacity>
```

Perbedaan yang perlu diperhatikan saat menerjemahkan tag per tag:
- `<div>`/`<section>`/`<main>` → `<View>`
- `<p>`/`<h1>`/`<span>` (teks) → `<Text>` — **semua teks di React Native wajib
  dibungkus `<Text>`**, tidak bisa taruh teks polos langsung di `<View>`
- `<button onclick="...">` → `<TouchableOpacity onPress={...}>`, isinya tetap
  dibungkus `<Text>` untuk labelnya
- `<a href="#">` (card berita) → `<TouchableOpacity onPress={() => Linking.openURL(url)}>`
- Efek `hover:` di CSS web tidak berlaku di mobile (tidak ada hover di touchscreen) —
  boleh diabaikan, tapi pertahankan `active:scale-95` sebagai feedback tekan
- Icon `material-symbols-outlined` (web font) diganti pakai `@expo/vector-icons`
  (family `MaterialSymbols` atau fallback `MaterialIcons` kalau nama ikonnya tidak
  tersedia persis), bukan render font ikon web


## Keputusan: HomeScreen.jsx yang Sudah Ada TIDAK Di-rewrite

`HomeScreen.jsx` dari tutorial sebelumnya **sudah jalan dan sudah tervalidasi**
(`deteksiScam()` terbukti nyambung). Jangan tulis ulang jadi NativeWind — resiko bug
baru dari rewrite lebih mahal daripada manfaat "semua file pakai metode styling yang
sama". StyleSheet dan NativeWind **boleh hidup berdampingan** dalam satu project React
Native, tidak ada konflik teknis.

Yang perlu disamakan hanya **nilai warnanya**, supaya HomeScreen terlihat konsisten
sebelahan dengan Onboarding/Result. Update `StyleSheet.create({...})` di HomeScreen.jsx
pakai hex ini (diambil langsung dari `DESIGN.md`):

| Elemen di HomeScreen | Hex lama (default) | Hex baru (dari DESIGN.md) |
|---|---|---|
| Warna tombol utama (`Button`/background) | default/biru sistem | `#003527` (primary) |
| Warna teks di atas tombol utama | putih default | `#ffffff` (on-primary) |
| Border/background `TextInput` | `#ccc` | `#bfc9c3` (outline-variant) |
| Background layar (`container`) | putih polos | `#f8f9fa` (surface) |
| Warna hasil BAHAYA | `#c0392b` (dari tutorial) | `#EF4444` (danger) |
| Warna hasil AMAN | `#27ae60` (dari tutorial) | `#10B981` (safe) |

React Native tidak punya `<Button>` bawaan yang bisa diwarnai bebas sesuai desain —
kalau mau tombolnya benar-benar sesuai `DESIGN.md` (tinggi 56px, rounded-xl, dst),
ganti `<Button>` jadi `<TouchableOpacity>` + `<Text>` seperti pola di
`code.html`/mockup Result, tetap pakai `StyleSheet.create` (bukan className).

## Struktur Layar (update dari versi plain)

### 1. Onboarding — SUDAH JADI
Pakai `code.html` apa adanya sebagai titik awal. Dua tombol: "Mulai Periksa Pesan"
(masuk ke Home/Input) dan "Masuk sebagai Guardian" (opsional, boleh jadi stub dulu).

### 2. Home / Input — BELUM ADA, perlu dibuat mengikuti gaya `code.html`
Belum ada mockup visual dari desainer untuk layar ini. Sambil menunggu, bangun dengan
pola visual yang sama (card rounded-xl, warna primary `#003527`/`#064e3b`, tombol
tinggi minimal 56px/`h-touch-target-min`, font Atkinson Hyperlegible Next):
- `TextInput` besar bergaya "Scanning Bar" (lihat bagian Inputs di `DESIGN.md`)
- Tombol utama "Periksa Sekarang" gaya `bg-primary text-on-primary`, sama seperti
  tombol "Mulai Periksa Pesan" di Onboarding
- Clipboard-detection: banner kecil di atas input kalau ada teks tersalin (logic sama
  seperti spec sebelumnya — `expo-clipboard` + `AppState` listener)

### 3. Result — SUDAH ADA MOCKUP, lihat `GARUDA_Mockup_Result_BeritaTerkait.html`
Implementasikan persis strukturnya:
- Status card dengan border-top tebal warna status (danger/safe), sesuai prinsip
  "Depth to signify priority" di `DESIGN.md`
- Paragraf **"Catatan"** (disclaimer sumber resmi) — HANYA muncul saat status BAHAYA,
  lihat behavior `showCatatan` di mockup
- Tombol "Bagikan ke Guardian" — style secondary (border 2px, bg putih)
- Tombol "Lihat Ringkasan & Berita Terkait" — style tertiary/muted
  (`bg-surface-container-low`)
- Disclaimer persisten di bagian paling bawah layar (selalu tampil)

## Fitur "Ringkasan & Berita Terkait" — Perilaku Online/Offline

Ini SATU-SATUNYA bagian yang butuh internet (klasifikasi teks utama tetap 100%
on-device). Dua state visual sudah ada di mockup, tinggal diimplementasikan sesuai
kondisi jaringan asli device:

- **Ada internet:** tampilkan `#beritaOnline` di mockup — list card artikel (sumber,
  judul, snippet). Untuk build awal, boleh pakai 2-3 artikel dummy/hardcoded dulu
  sebelum disambungkan ke news API sungguhan — fokus dulu ke struktur visual & interaksinya.
- **Tidak ada internet:** tampilkan `#beritaOffline` — ikon wifi-off + pesan singkat +
  tombol "Coba lagi". **Jangan** blokir seluruh layar Result, cuma bagian Berita
  Terkait ini saja yang menunjukkan status gagal.
- Cek koneksi pakai `@react-native-community/netinfo` (atau cukup try-catch pada
  fetch API-nya kalau belum sempat pasang library tambahan).

## Fitur Nomor Telepon — DITUNDA, bukan prioritas sekarang

Ekstraksi nomor dari pesan (regex) dan fitur "Laporkan Nomor Ini" (community report,
ala GetContact) **sengaja tidak dikerjakan di iterasi ini**. Jangan bangun UI atau
logic untuk ini dulu — cukup dicatat di roadmap. Kalau ada waktu lebih di akhir,
baru revisit.

## Pertimbangan UX Penting: False Positive pada Hadiah/Undian Asli

**Masalah:** `deteksiScam()` cuma baca pola teks, sama sekali tidak mengecek identitas
pengirim atau domain link. Konsekuensinya: notifikasi hadiah/undian yang **benar-benar
asli** (misal poin loyalti bank, giveaway resmi brand yang diikuti user sendiri) bisa
saja ikut ter-flag BAHAYA kalau pola bahasanya mirip modus phishing (urgensi + ajakan
klaim + link). Ini bukan bug di model — ini keterbatasan mendasar pendekatan berbasis
teks yang harus dikomunikasikan jujur ke user, bukan disembunyikan.

**Solusi yang sudah diimplementasikan di level UI/copy (lihat mockup):**
1. Paragraf **"Catatan"** di status card BAHAYA — mengarahkan user untuk tetap verifikasi
   lewat aplikasi resmi langsung (bukan klik link di pesan) kalau merasa yakin itu asli
2. Disclaimer persisten di bagian bawah layar — framing GARUDA sebagai *indikator*,
   bukan *verifikator mutlak*, ditampilkan terus-menerus bukan cuma sekali muncul

**Yang TIDAK dikerjakan sekarang (roadmap):** verifikasi pengirim/domain (misal
whitelist domain resmi) — ini butuh sumber data tambahan yang di luar scope
`deteksiScam()` berbasis teks murni, dicatat sebagai pengembangan lanjutan pasca-kompetisi.

## Definition of Done (v2)

- [ ] NativeWind terpasang dan `tailwind.config.js` berisi token yang sama persis
      dengan `code.html` (colors, spacing, fontFamily, fontSize, borderRadius)
- [ ] Onboarding pakai `code.html` asli tanpa modifikasi struktur
- [ ] Home/Input dibangun dengan token desain yang sama (warna, font, spacing, radius)
- [ ] Result screen sesuai `GARUDA_Mockup_Result_BeritaTerkait.html` — termasuk paragraf
      Catatan yang hanya muncul saat BAHAYA
- [ ] Berita Terkait: state online (artikel dummy oke untuk sekarang) dan state offline
      (pesan gagal + tombol coba lagi) keduanya terlihat berfungsi, tanpa mem-block
      hasil deteksi utama
- [ ] Disclaimer persisten tampil di Result screen
- [ ] Tidak ada fitur nomor telepon/report yang dibangun di iterasi ini
- [ ] Semua warna/font/spacing diambil dari `tailwind.config` yang sama seperti
      `code.html`, tidak ada nilai hardcoded baru yang menyimpang dari `DESIGN.md`
