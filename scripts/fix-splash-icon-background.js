// expo-splash-screen tidak pernah men-set windowSplashScreenIconBackgroundColor,
// jadi Android 12+ (SplashScreen API) jatuh ke warna abu-abu default sistem di
// belakang ikon splash alih-alih menyatu dengan windowSplashScreenBackground.
//
// PENTING: nama atributnya `windowSplashScreenIconBackgroundColor` TANPA prefix
// `android:` — ini custom attr dari compat-library androidx.core.splashscreen
// (sama seperti windowSplashScreenBackground/windowSplashScreenAnimatedIcon di
// file yang sama), BUKAN atribut platform native. Prefix `android:` cuma dipakai
// untuk android:windowSplashScreenBehavior (itu memang atribut platform asli).
// Salah pakai prefix di sini tidak error saat build, tapi diam-diam tidak ada
// efek sama sekali (dibuktikan lewat aapt2 dump resources — lihat percakapan).
//
// Dijalankan sebagai SCRIPT TERPISAH setelah `expo prebuild`, bukan config
// plugin — sudah dicoba lewat withAndroidStyles dan withDangerousMod, keduanya
// tidak reliable karena urutan eksekusi mod antar-plugin di config-plugins Expo
// tidak mengikuti urutan array di app.json seperti yang didokumentasikan. Jalankan
// manual tiap habis `npx expo prebuild --platform android [--clean]`:
//
//   node scripts/fix-splash-icon-background.js

const fs = require('fs');
const path = require('path');

const stylesPath = path.join(
  __dirname,
  '..',
  'android/app/src/main/res/values/styles.xml'
);

const marker = '<item name="android:windowSplashScreenBehavior">icon_preferred</item>';
const wrongAddition =
  '<item name="android:windowSplashScreenIconBackgroundColor">@color/splashscreen_background</item>';
const addition =
  '<item name="windowSplashScreenIconBackgroundColor">@color/splashscreen_background</item>';

let contents = fs.readFileSync(stylesPath, 'utf-8');

// Bersihkan sisa versi salah (dengan prefix android:) dari percobaan sebelumnya, kalau ada.
contents = contents.replace(`\n    ${wrongAddition}`, '').replace(wrongAddition, '');

if (contents.includes(addition)) {
  fs.writeFileSync(stylesPath, contents);
  console.log('fix-splash-icon-background: sudah terpasang, tidak ada perubahan.');
  process.exit(0);
}

if (!contents.includes(marker)) {
  console.error(
    `fix-splash-icon-background: marker tidak ditemukan di ${stylesPath} — ` +
      'kemungkinan output expo-splash-screen berubah, cek styles.xml manual.'
  );
  process.exit(1);
}

contents = contents.replace(marker, `${marker}\n    ${addition}`);
fs.writeFileSync(stylesPath, contents);
console.log('fix-splash-icon-background: berhasil ditambahkan ke styles.xml.');
