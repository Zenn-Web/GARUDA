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
Fitur Guardian (baik di Onboarding maupun tombol "Bagikan ke Guardian" di Result)
masih berupa stub/placeholder sampai iterasi berikutnya.

**Catatan**:
Paragraf disclaimer yang HANYA muncul di status card saat hasilnya BAHAYA, mengarahkan
user untuk tetap verifikasi lewat aplikasi resmi (bukan klik link di pesan) kalau merasa
pesannya asli. Merespons keterbatasan `deteksiScam()`: model cuma baca pola teks, tidak
mengecek identitas pengirim/domain, jadi bisa false-positive pada hadiah/undian asli.
_Avoid_: Disclaimer (istilah generik — "Catatan" adalah label spesifik yang muncul di UI)

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
Layar pembuka, sumber kebenarannya `code.html` (dari desainer, via Stitch) — **belum
tersedia di repo saat ini**, jadi implementasi Onboarding ditunda sampai file itu ada.

**Home/Input**:
Layar tempat user menempel/ketik pesan yang mau dicek. Saat ini masih versi "Plain"
(StyleSheet biasa, dari tutorial belajar mandiri) — belum dimigrasi ke NativeWind/token
desain baru; migrasi sengaja ditunda supaya tidak mengerjakan re-styling dan fitur baru
sekaligus.

**Result**:
Layar terpisah (route sendiri, bukan inline di Home) yang menampilkan `HasilDeteksi`
setelah user menekan tombol "Cek Pesan Ini" di Home. Sumber kebenaran visualnya:
`GARUDA_Mockup_Result_BeritaTerkait.html`. Dibangun pakai NativeWind, token warna/font
disalin dari `tailwind.config` yang ter-embed di mockup itu.

## Sumber Kebenaran Desain (Design Source of Truth)

- `DESIGN.md`, `code.html` — **belum ada di repo** (dicari di project & Downloads,
  tidak ketemu). Referenced oleh spec `GARUDA_Build_UI_Sinkron_Desain.md` sebagai acuan
  utama, tapi build saat ini jalan tanpa keduanya untuk bagian yang bisa disimpulkan dari
  `GARUDA_Mockup_Result_BeritaTerkait.html`.
- `GARUDA_Mockup_Result_BeritaTerkait.html` — mockup HTML lengkap untuk layar Result,
  termasuk `tailwind.config` penuh (colors, spacing, fontFamily, fontSize) yang jadi
  dasar `tailwind.config.js` NativeWind di project ini.
