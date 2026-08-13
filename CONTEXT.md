# GARUDA

Aplikasi mobile (Android/iOS/web via Expo) yang mendeteksi pesan penipuan (scam/phishing)
dari teks yang ditempel atau diketik user, memakai model NLP on-device.

## Language

**Deteksi**:
Proses menjalankan `deteksiScam(text)` atas satu pesan untuk menghasilkan `HasilDeteksi`.
Selalu on-device (tidak butuh internet), murni sinkron (bukan network call).
_Avoid_: Scan, Analisis, Cek (istilah UI-facing yang lebih santai — boleh dipakai di
copy tombol, tapi bukan di kode/komentar teknis)

**HasilDeteksi**:
Output dari `deteksiScam()`: `{ status: 'SCAM' | 'AMAN', confidence: number }`.
Ditampilkan sebagai **BAHAYA** (merah, kalau status SCAM) atau **AMAN** (hijau).
_Avoid_: Result, Prediction (istilah model ML generik — di project ini selalu disebut Hasil/HasilDeteksi)

**Guardian**:
Kontak keluarga/wali opsional yang bisa menerima notifikasi hasil deteksi dari user.
Bersifat sepenuhnya opsional — user bisa pakai GARUDA sendirian tanpa Guardian.
Sejak v3: tombol "Bagikan ke Guardian" **dicabut dari Result Screen** (keputusan sadar,
bukan regresi) — titik akses fitur Guardian belum ditentukan ulang (kemungkinan lewat
tab Panduan atau menu terpisah), menunggu `GARUDA_Pairing_Guardian_Roadmap.md` yang
direferensikan spec v3 tapi belum ada di repo.

**Kategori**:
Klasifikasi jenis modus phishing dari sebuah pesan yang sudah divonis SCAM, dihitung
`kategorikanPesan(teks)` di `src/utils/kategorisasi.js` (keyword-matching, bukan ML,
jalan SETELAH `deteksiScam()`). Lima nilai: `link_pemblokiran_akun`,
`link_verifikasi_pihak_ketiga`, `link_hadiah_undian`, `otp_pretext`, `umum` (fallback).
Dihitung di Home, hasilnya (string kategori pendek) yang dikirim ke Result — bukan teks
pesan mentah, supaya isi pesan (bisa sensitif) tidak ikut nempel di parameter navigasi.

**Indikasi** / **Tindakan**:
Dua field per kategori di `src/data/knowledgeBase.json`. **Indikasi** = daftar ciri-ciri
pola yang dikenali (ditampilkan sebagai bullet list di kartu "Indikasi yang dikenali").
**Tindakan** = langkah konkret yang disarankan (list bernomor di kartu "Lakukan ini
sekarang"). Keduanya WAJIB diambil dari lookup `knowledgeBase.kategori[kategori]`, bukan
teks statis yang sama untuk semua kasus BAHAYA.

**kontak_resmi**:
Field di `knowledgeBase.json` (kontak OJK 157, cekrekening.id) yang menurut `_readme`-nya
wajib tampil di semua kategori BAHAYA. Ditampilkan sebagai baris tambahan di kartu
"Lakukan ini sekarang", bukan kartu terpisah.

**Panduan**:
Rencana tab kedua di bottom nav (v3), berdampingan dengan "Beranda". Sempat dicoba sebagai
tab disabled/pudar, tapi dicabut total dari `app-tabs.tsx` — fitur "coming soon", belum ada
desain halamannya. Jangan bangun tab/halaman Panduan sampai ada referensi visual dan
keputusan eksplisit untuk memunculkannya lagi.

**Catatan** (dicabut sejak v3):
Bekas paragraf disclaimer yang HANYA muncul di status card saat hasilnya BAHAYA,
mengarahkan user untuk tetap verifikasi lewat aplikasi resmi (bukan klik link di pesan)
kalau merasa pesannya asli — merespons keterbatasan `deteksiScam()` (model cuma baca pola
teks, tidak mengecek identitas pengirim/domain, jadi bisa false-positive pada hadiah/undian
asli). **Sengaja dihapus dari `result.tsx` di v3** (keputusan sadar, bukan gap) — kartu
Indikasi/Tindakan yang baru dianggap sudah cukup memandu user, tidak digantikan pesan
setara. Istilah ini disimpan di sini cuma sebagai catatan sejarah; jangan bangun ulang
tanpa keputusan eksplisit baru.

**Disclaimer persisten**:
Teks singkat di bagian paling bawah layar Result, selalu tampil (beda dari "Catatan"
yang kondisional). Framing GARUDA sebagai *indikator*, bukan *verifikator mutlak*.

**Berita Terkait**:
Fitur di layar Result yang menampilkan artikel berita terkait modus penipuan serupa.
SATU-SATUNYA bagian dari GARUDA yang butuh internet (klasifikasi utama tetap 100%
on-device). Untuk build awal, artikel boleh dummy/hardcoded — fokus ke struktur
online/offline dulu, belum ke integrasi news API sungguhan.

## Struktur Layar

**Onboarding**:
Layar pembuka. `Design/code.html` (sumber struktur aslinya) sudah ada di repo sejak
spec v2, tapi implementasinya belum dikerjakan — satu-satunya item Definition of Done
v2 yang masih terbuka.

**Home/Input**:
Layar tempat user menempel/ketik pesan yang mau dicek, sekarang di
`src/app/(tabs)/index.tsx`. Sengaja **tetap StyleSheet** (bukan NativeWind) meski scope
UI-nya terus bertambah (v3 nambah kartu input berlabel, kotak info privasi, paragraf
instruksi) — keputusan yang diulang-konfirmasi dua kali: risiko rewrite lebih mahal
daripada manfaat "satu metode styling seragam".

**Result**:
Layar terpisah (`src/app/result.tsx`, route `/result`) yang menampilkan `HasilDeteksi`
setelah user menekan tombol di Home. Dibangun pakai NativeWind. Sejak v3: kartu BAHAYA
menambah dua bagian baru (kartu Indikasi, kartu Tindakan) hasil lookup `Kategori`, dan
tombol Guardian dicabut. Berita Terkait (v2) **dipertahankan** meski tidak muncul di
screenshot v3 — screenshot dianggap belum sempat menunjukkan bagian bawah layar, bukan
keputusan desain untuk menghapusnya.

## Sumber Kebenaran Desain (Design Source of Truth)

- `Design/DESIGN.md`, `Design/code.html`, `Design/GARUDA_Mockup_Result_BeritaTerkait.html`
  — sumber kebenaran token & struktur untuk iterasi v2. Token warnanya sudah disalin ke
  `tailwind.config.js`.
- `Design V2/GARUDA_v3_*.png` + `GARUDA_Build_UI_v3_Hotfix.md` — iterasi v3 (Home, Hasil
  AMAN, Hasil BAHAYA), token warna disampling manual dari screenshot dan **menggantikan**
  nilai token v2 lama di `tailwind.config.js` (nama token sama, isinya di-refresh ke hex
  v3). **Folder `Design V2/` sudah dihapus dari repo** (sengaja, setelah isinya sepenuhnya
  terserap ke bagian-bagian CONTEXT.md ini) — dokumen ini sekarang satu-satunya sumber
  kebenaran untuk keputusan v3, bukan file spec aslinya.
- `GARUDA_Pairing_Guardian_Roadmap.md` — direferensikan oleh spec v3, **belum ada di
  repo**.
