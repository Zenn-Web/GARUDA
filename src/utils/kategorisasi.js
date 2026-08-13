// src/utils/kategorisasi.js
//
// Nentuin kategori phishing dari teks pesan pakai keyword-matching sederhana
// (BUKAN ML — ini logic terpisah dari deteksiScam(), jalan setelahnya).
// Skema: hitung berapa kata kunci per kategori yang muncul di teks, kategori
// dengan hitungan terbanyak menang. Kalau semua 0, balikin 'umum'.

const KATA_KUNCI = {
  link_pemblokiran_akun: [
    'diblokir', 'dibekukan', 'dinonaktifkan', 'suspend', 'terkunci',
    'nonaktif', 'dibatasi', 'diblok',
  ],
  link_verifikasi_pihak_ketiga: [
    'paket', 'kurir', 'resi', 'alamat', 'dukcapil', 'bpjs', 'pajak',
    'bansos', 'kelurahan', 'samsat', 'tertahan',
  ],
  link_hadiah_undian: [
    'selamat', 'menang', 'undian', 'hadiah', 'giveaway', 'klaim',
    'cashback', 'doorprize', 'beruntung',
  ],
  otp_pretext: [
    'otp', 'kode verifikasi', 'kirim balik', 'salah kirim', 'kode aktivasi',
    'punya saya', 'punya aku', 'punya ku',
  ],
};

export function kategorikanPesan(teks) {
  const teksLower = teks.toLowerCase();
  let kategoriTerbaik = 'umum';
  let skorTertinggi = 0;

  for (const [kategori, kataKunciList] of Object.entries(KATA_KUNCI)) {
    let skor = 0;
    for (const kata of kataKunciList) {
      if (teksLower.includes(kata)) {
        skor += 1;
      }
    }
    if (skor > skorTertinggi) {
      skorTertinggi = skor;
      kategoriTerbaik = kategori;
    }
  }

  return kategoriTerbaik;
}
