# GARUDA

Aplikasi Android untuk mendeteksi pesan penipuan (scam/phishing) berbahasa Indonesia,
dirancang khusus untuk pengguna lanjut usia. Pengguna menempel atau mengetik pesan yang
mencurigakan, lalu GARUDA memberi penilaian **BAHAYA** atau **AMAN** beserta tingkat
keyakinannya.

Deteksi berjalan **100% di perangkat (offline)** — isi pesan tidak pernah dikirim ke
server mana pun.

---

## Daftar Isi

- [Cara Menjalankan](#cara-menjalankan)
- [Cara Kerja Deteksi](#cara-kerja-deteksi)
- [Struktur Project](#struktur-project)
- [Sistem Desain](#sistem-desain)
- [Testing](#testing)
- [Keterbatasan yang Diketahui](#keterbatasan-yang-diketahui)
- [Status Fitur](#status-fitur)
- [Catatan Teknis Penting](#catatan-teknis-penting)

---

## Cara Menjalankan

### Prasyarat

- Node.js + npm
- Android Studio (emulator) atau HP Android fisik
- Project ini memakai **native module** (Firebase, clipboard), jadi **tidak bisa** dijalankan
  lewat Expo Go biasa — wajib development build.

### Pertama kali (atau setelah menambah package native)

```bash
npm install
npx expo run:android
```

Perintah ini meng-compile aplikasi Android, memasangnya ke emulator/HP, lalu menyalakan
dev server. Prosesnya lama (bisa beberapa menit).

### Sehari-hari (hanya mengubah kode JS/TS)

```bash
npx expo start
```

Cukup nyalakan dev server; aplikasi yang sudah terpasang akan mengambil kode terbaru.
Tambahkan `-c` untuk membersihkan cache kalau ada perubahan konfigurasi:

```bash
npx expo start -c
```

> **Penting:** setelah mengubah `babel.config.js`, `metro.config.js`, atau
> `tailwind.config.js`, Metro **harus** dimatikan total lalu dinyalakan ulang — reload biasa
> tidak cukup.

### Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm test` | Menjalankan test (mode watch) |
| `npx jest` | Menjalankan test sekali jalan |
| `npx tsc --noEmit` | Memeriksa error TypeScript |
| `npm run lint` | Menjalankan ESLint |

---

## Cara Kerja Deteksi

Otak GARUDA ada di [`src/model/GarudaBrain.js`](src/model/GarudaBrain.js) — file yang
di-generate otomatis dari model Python (`model_garuda.pkl` + `vectorizer_garuda.pkl`).

**Pipeline-nya:**

1. **Tokenisasi** — kalimat dipecah jadi kata (regex `\b\w\w+\b`, sama persis dengan
   default scikit-learn)
2. **TF-IDF** — hitung bobot tiap kata, lalu normalisasi L2
3. **Logistic Regression** — kalikan dengan koefisien model, tambah intercept
4. **Sigmoid** — ubah jadi probabilitas 0–1

**Ukuran model:** 3.823 kata dalam kosakata, 212 KB.

**Antarmuka publiknya satu fungsi:**

```js
import { deteksiScam } from '@/model/GarudaBrain';

const hasil = deteksiScam('Rekening BCA Anda akan diblokir, klik link ini');
// → { status: 'SCAM', confidence: 94.5, rawProbability: 0.945 }
```

Fungsi ini **sinkron** (tidak perlu `await`) karena murni perhitungan matematika di
JavaScript, bukan panggilan jaringan.

### Mengganti model

Cukup timpa `src/model/GarudaBrain.js` dengan hasil generate terbaru. Selama nama fungsi
dan bentuk kembaliannya tetap sama, tidak ada kode UI yang perlu diubah.

---

## Struktur Project

```
src/
├── app/                        # Route (Expo Router — nama file = URL)
│   ├── _layout.tsx             # Root: Stack navigator (membungkus tabs + result)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar
│   │   └── index.tsx           # Home — input pesan  →  "/"
│   └── result.tsx              # Hasil deteksi        →  "/result"
├── model/
│   ├── GarudaBrain.js          # Model ML (generated)
│   └── GarudaBrain.test.js
├── components/                 # Komponen bersama (ThemedText, ThemedView, dll)
├── constants/theme.ts
└── hooks/

__tests__/                      # Test level-router (JANGAN taruh di src/app/)
Design/                         # Sumber kebenaran desain (DESIGN.md, code.html, mockup)
```

### Alur navigasi

```
Home (/)  ──[tekan "Cek Pesan Ini"]──►  Result (/result?status=…&confidence=…)
```

`Home` memanggil `deteksiScam()`, lalu mengirim hasilnya ke `Result` lewat parameter URL.

### Dua metode styling hidup berdampingan

Ini **disengaja**, bukan kelalaian:

| Layar | Metode | Alasan |
|---|---|---|
| `(tabs)/index.tsx` | `StyleSheet.create` | Sudah jalan & teruji; menulis ulang lebih berisiko daripada manfaatnya. Nilai warnanya saja yang disamakan dengan `DESIGN.md` |
| `result.tsx` | NativeWind (`className`) | Dibangun dari mockup HTML, sehingga class Tailwind bisa dipakai ulang hampir 1:1 |

React Native tidak mempermasalahkan keduanya berdampingan.

---

## Sistem Desain

Sumber kebenaran ada di [`Design/DESIGN.md`](Design/DESIGN.md) dan
[`Design/code.html`](Design/code.html). Seluruh token disalin ke
[`tailwind.config.js`](tailwind.config.js) — **jangan tulis nilai warna/font baru di luar
itu.**

**Prinsip utama** (semuanya untuk keterbacaan pengguna lansia):

- Font **Atkinson Hyperlegible Next**, teks isi minimal **18px**, instruksi penting 20px
- Kontras teks minimal **7:1**
- Setiap elemen yang bisa ditekan tingginya minimal **56px**
- Margin samping 24px agar jempol tidak memicu gestur tepi layar OS
- Status tidak boleh dibedakan dari warna saja — selalu ada ikon + teks

**Warna status:**

| Status | Warna | Token |
|---|---|---|
| Aman | `#10B981` | `safe` / `safe-container` |
| Peringatan | `#F59E0B` | `warning` / `warning-container` |
| Bahaya | `#EF4444` | `danger` / `danger-container` |
| Utama (brand) | `#003527` | `primary` |

Latar kartu memakai varian `-container` (bukan warna solid penuh) supaya kontras teks
tetap terjaga.

---

## Testing

```bash
npx jest
```

| Berkas | Cakupan |
|---|---|
| `src/model/GarudaBrain.test.js` | `deteksiScam()`: kasus SCAM, kasus AMAN, teks tanpa kata dikenal |
| `__tests__/navigasi-hasil-deteksi.test.tsx` | Alur penuh Home → tekan tombol → layar Result muncul |

Test navigasi memakai `renderRouter` dari `expo-router/testing-library`, yang me-render
**routing dan layout yang sebenarnya**.

> **Kenapa ini penting:** versi awal test ini mem-*mock* `expo-router` dan hanya memeriksa
> `router.push` terpanggil. Test itu selalu hijau **padahal aplikasinya rusak** — layar
> Result tidak pernah muncul karena root layout belum punya Stack. Test yang mem-mock
> router secara desain tidak akan pernah bisa menangkap bug seperti itu.

---

## Keterbatasan yang Diketahui

**`deteksiScam()` hanya membaca pola teks.** Fungsi ini tidak memeriksa identitas pengirim
maupun domain tautan.

Konsekuensinya: pemberitahuan hadiah/undian yang **benar-benar asli** (poin loyalti bank,
giveaway resmi yang memang diikuti pengguna) bisa ikut ditandai BAHAYA kalau pola
bahasanya mirip modus penipuan — ada unsur urgensi, ajakan klaim, dan tautan.

**Ini bukan bug melainkan batas mendasar** dari pendekatan berbasis teks, dan disikapi
dengan jujur di antarmuka, bukan disembunyikan:

1. Paragraf **"Catatan"** — hanya muncul saat hasilnya BAHAYA, mengarahkan pengguna untuk
   tetap memverifikasi lewat aplikasi resmi (bukan mengklik tautan di pesan) kalau merasa
   pesannya asli
2. **Disclaimer persisten** di dasar layar Result — selalu tampil, menegaskan GARUDA adalah
   *indikator*, bukan *penentu mutlak*

Verifikasi pengirim/domain (misalnya daftar putih domain resmi) butuh sumber data di luar
cakupan model teks, dan dicatat sebagai pengembangan lanjutan.

---

## Status Fitur

### Sudah jalan

- Input pesan manual, dengan deteksi clipboard otomatis (`expo-clipboard` + `AppState`) —
  teks yang baru disalin otomatis mengisi kolom input, tapi **tidak** langsung dianalisis;
  pengguna tetap yang menekan tombol
- Layar Result: kartu status berikat atas tebal, tingkat keyakinan, tips, paragraf Catatan
  (khusus BAHAYA), disclaimer persisten
- Berita Terkait: dua kondisi (ada/tidak ada internet). Kegagalan jaringan **terisolasi** di
  bagian ini saja dan tidak memblokir hasil deteksi

### Belum / sengaja ditunda

| Fitur | Status |
|---|---|
| Onboarding | Mockup sudah ada (`Design/code.html`), belum diimplementasikan |
| Bagikan ke Guardian | Tombol masih placeholder (menampilkan dialog "segera hadir") |
| Berita Terkait (data asli) | Masih 2 artikel contoh, belum tersambung ke API berita |
| Laporan nomor telepon | Sengaja tidak dikerjakan pada iterasi ini |
| Verifikasi pengirim/domain | Di luar cakupan model teks — pengembangan lanjutan |

### Firebase

`@react-native-firebase/app`, `auth`, `firestore`, dan `messaging` **sudah terpasang dan
aktif** — SDK berhasil diinisialisasi saat aplikasi dibuka dan terhubung ke project
`garuda-project-89c40`.

Namun **belum ada satu baris kode pun yang memakainya.** Semuanya disiapkan untuk fitur
Guardian (login, penyimpanan relasi pengguna–wali, notifikasi) yang belum dibangun.

> Catatan: `firestore` ada di `package.json` tapi belum terdaftar di daftar `plugins`
> pada `app.json` — perlu ditambahkan sebelum Firestore benar-benar dipakai.

---

## Catatan Teknis Penting

**Jangan menaruh berkas test di dalam `src/app/`.** Folder itu dipindai penuh oleh Expo
Router, sehingga Metro ikut mem-*bundle* berkas test ke dalam aplikasi. Akibatnya
`@testing-library/react-native` ikut terbawa, memanggil modul Node.js `console` yang tidak
ada di Hermes, dan **seluruh bundle gagal dibangun** (HTTP 500) tanpa pesan error yang
jelas di layar.

Lokasi aman: `__tests__/` di root, atau folder mana pun di luar `src/app/`
(`src/model/GarudaBrain.test.js` aman karena `src/model/` bukan bagian dari router).

**Urutan `paths` di `tsconfig.json` berpengaruh.** Pola yang lebih spesifik harus di atas
yang umum — `@/assets/*` sebelum `@/*` — kalau tidak, `@/assets/…` akan salah dipetakan ke
`src/assets/…`.

**`jest-setup.js` mem-*mock* `react-native-worklets` dan komponen `animated-icon`.**
Keduanya butuh runtime native (JSI) yang tidak tersedia di Jest, sementara animasinya
murni dekorasi dan tidak memengaruhi alur yang diuji.

---

## Teknologi

| Komponen | Versi |
|---|---|
| Expo SDK | 57 |
| React Native | 0.86.2 |
| React | 19.2.3 |
| Expo Router | 57 (file-based routing) |
| NativeWind | 4.2.6 (Tailwind CSS 3.4) |
| TypeScript | 6.0 (mode strict) |
| Jest | 29 + `jest-expo` + React Native Testing Library |
